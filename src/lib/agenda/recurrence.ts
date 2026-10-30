/*
 * Recurring meetings, the same rules as the app's src/core/recurrence.ts. A
 * series is one stored meeting: its own start is the first date, and the other
 * dates are worked out from its rule. Each keeps its wall-clock time in the
 * meeting's zone (9:00 stays 9:00 across daylight-saving changes). Changes to
 * single dates live in `recurrenceOverrides`, keyed by the date it was due.
 */

import { addDays, daysBetween, fromZoned, isDayKey, weekday } from "./time";
import type { Meeting, Occurrence, RecurrenceOverride, RecurrenceOverrides, RecurrenceRule, RecurrenceWeekday } from "./types";

export const WEEKDAYS: RecurrenceWeekday[] = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];

const MAX_ITERATIONS = 5000;
const MAX_OCCURRENCES = 500;
/** How far past the window to look for a date that was moved back into it. */
const OVERRIDE_LOOKAHEAD = 62 * 86_400_000;

/** 0 = Monday ... 6 = Sunday. */
const mondayIndex = (day: string) => (weekday(day) + 6) % 7;

export const weekdayCode = (day: string) => WEEKDAYS[mondayIndex(day)];

const daysInMonth = (year: number, month: number) => new Date(Date.UTC(year, month, 0)).getUTCDate();

/** The original dates of a series in order, from its first date. Endless for endless rules. */
function* candidateDates(anchor: string, rule: RecurrenceRule): Generator<string> {
  if (rule.freq === "daily") {
    for (let date = anchor; ; date = addDays(date, rule.interval)) yield date;
  }
  if (rule.freq === "weekly") {
    const selected = new Set((rule.byWeekday?.length ? rule.byWeekday : [weekdayCode(anchor)]).map((c) => WEEKDAYS.indexOf(c)));
    const monday = addDays(anchor, -mondayIndex(anchor));
    for (let week = 0; ; week++) {
      const start = addDays(monday, week * rule.interval * 7);
      for (let offset = 0; offset < 7; offset++) {
        if (!selected.has(offset)) continue;
        const date = addDays(start, offset);
        if (daysBetween(anchor, date) >= 0) yield date;
      }
    }
  }
  if (rule.freq === "monthly") {
    const [year, month, firstDay] = anchor.split("-").map(Number);
    const day = rule.byMonthDay ?? firstDay;
    const first = year * 12 + (month - 1);
    for (let step = 0; ; step++) {
      const total = first + step * rule.interval;
      const y = Math.floor(total / 12);
      const m = (total % 12) + 1;
      // a month without that day is left out and doesn't count
      if (day > daysInMonth(y, m)) continue;
      const date = `${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      if (daysBetween(anchor, date) >= 0) yield date;
    }
  }
}

const timeOf = (m: Pick<Meeting, "allDay" | "time">) => (m.allDay ? "00:00" : m.time);

/** One date of a series with its own changes applied. */
function build(m: Meeting, key: string, due: Date, override: RecurrenceOverride | undefined): Occurrence {
  const overridden = override?.status === "modified";
  const start = overridden && override.startAt ? new Date(override.startAt) : due;
  const minutes = (overridden ? override.durationMinutes : null) ?? m.durationMinutes;
  return { meeting: m, key, start, end: new Date(start.getTime() + minutes * 60_000), title: (overridden ? override.title : null) ?? m.title, overridden };
}

/** Every date of a series overlapping [from, to), without the cancelled ones. */
function expandSeries(m: Meeting, rule: RecurrenceRule, from: Date, to: Date): Occurrence[] {
  const untilMs = rule.until ? Date.parse(rule.until) : null;
  const overrides = m.recurrenceOverrides ?? {};
  const hasOverrides = Object.keys(overrides).length > 0;
  const out: Occurrence[] = [];
  let generated = 0;
  let iterations = 0;
  for (const key of candidateDates(m.date, rule)) {
    if (++iterations > MAX_ITERATIONS) break;
    const due = fromZoned(key, timeOf(m), m.timezone);
    if (untilMs !== null && due.getTime() > untilMs) break;
    generated++;
    if (rule.count !== null && generated > rule.count) break;
    const override = overrides[key];
    if (override?.status === "cancelled") continue;
    if (due >= to && override?.status !== "modified") {
      if (!hasOverrides || due.getTime() - to.getTime() > OVERRIDE_LOOKAHEAD) break;
      continue;
    }
    const o = build(m, key, due, override);
    if (o.end > from && o.start < to) out.push(o);
    if (out.length >= MAX_OCCURRENCES) break;
  }
  return out;
}

/** Every meeting of `m` that overlaps [from, to). */
export function occurrences(m: Meeting, from: Date, to: Date): Occurrence[] {
  if (m.recurrence) {
    try {
      return expandSeries(m, m.recurrence, from, to);
    } catch {
      // a stored rule that can't be worked out: show the meeting once rather than hide it
    }
  }
  const start = new Date(m.startAt);
  const end = new Date(start.getTime() + m.durationMinutes * 60_000);
  return end > from && start < to ? [{ meeting: m, key: "", start, end, title: m.title, overridden: false }] : [];
}

/** All meetings in [from, to), sorted by start. */
export function expandAll(meetings: Meeting[], from: Date, to: Date) {
  return meetings.flatMap((m) => occurrences(m, from, to)).sort((a, b) => a.start.getTime() - b.start.getTime());
}

/** The occurrence of a series on a given key, or the meeting's own first date. */
export function findOccurrence(m: Meeting, key: string): Occurrence | null {
  if (!key || !m.recurrence) {
    const start = new Date(m.startAt);
    return { meeting: m, key: "", start, end: new Date(start.getTime() + m.durationMinutes * 60_000), title: m.title, overridden: false };
  }
  const override = m.recurrenceOverrides?.[key];
  if (override?.status === "cancelled") return null;
  return build(m, key, fromZoned(key, timeOf(m), m.timezone), override);
}

/** The overrides with one date set (or removed with null); null when none are left. */
export function withOverride(overrides: RecurrenceOverrides | null, key: string, override: RecurrenceOverride | null): RecurrenceOverrides | null {
  const next = { ...(overrides ?? {}) };
  if (override) next[key] = override;
  else delete next[key];
  return Object.keys(next).length ? next : null;
}

export type SeriesSplit = {
  masterRule: RecurrenceRule;
  masterOverrides: RecurrenceOverrides | null;
  tailStartAt: string;
  tailRule: RecurrenceRule;
  tailOverrides: RecurrenceOverrides | null;
};

/**
 * Splits a series at one of its dates ("this and following"). "series_edit"
 * means it is the first date, so the change applies to the whole series; null
 * means the date isn't part of the series.
 */
export function splitRecurrenceAt(m: Meeting, fromKey: string): SeriesSplit | "series_edit" | null {
  const rule = m.recurrence;
  if (!rule || !isDayKey(fromKey)) return null;
  const untilMs = rule.until ? Date.parse(rule.until) : null;
  let before = 0;
  let first: string | null = null;
  let found = false;
  let iterations = 0;
  for (const date of candidateDates(m.date, rule)) {
    if (++iterations > MAX_ITERATIONS) break;
    if (daysBetween(fromKey, date) > 0) break;
    if (untilMs !== null && fromZoned(date, timeOf(m), m.timezone).getTime() > untilMs) break;
    if (rule.count !== null && before + 1 > rule.count) break;
    first ??= date;
    if (date === fromKey) {
      found = true;
      break;
    }
    before++;
  }
  if (!found) return null;
  if (first === fromKey) return "series_edit";

  const tailStart = fromZoned(fromKey, timeOf(m), m.timezone);
  const masterOverrides: RecurrenceOverrides = {};
  const tailOverrides: RecurrenceOverrides = {};
  for (const [key, override] of Object.entries(m.recurrenceOverrides ?? {})) {
    if (daysBetween(fromKey, key) >= 0) tailOverrides[key] = override;
    else masterOverrides[key] = override;
  }
  return {
    masterRule: { ...rule, until: new Date(tailStart.getTime() - 1000).toISOString(), count: null },
    masterOverrides: Object.keys(masterOverrides).length ? masterOverrides : null,
    tailStartAt: tailStart.toISOString(),
    tailRule: { ...rule, count: rule.count !== null ? rule.count - before : null },
    tailOverrides: Object.keys(tailOverrides).length ? tailOverrides : null,
  };
}

/** After a series moves to another date, its weekday or day of the month moves with it. */
export function reconcileAnchor(rule: RecurrenceRule, oldDay: string, newDay: string): RecurrenceRule {
  if (oldDay === newDay) return rule;
  if (rule.freq === "weekly" && rule.byWeekday?.length) {
    const before = weekdayCode(oldDay);
    const after = weekdayCode(newDay);
    if (before === after || !rule.byWeekday.includes(before)) return rule;
    const days = new Set(rule.byWeekday);
    days.delete(before);
    days.add(after);
    return { ...rule, byWeekday: WEEKDAYS.filter((d) => days.has(d)) };
  }
  if (rule.freq === "monthly" && rule.byMonthDay !== null) {
    const before = Number(oldDay.slice(8, 10));
    return rule.byMonthDay === before && before !== Number(newDay.slice(8, 10)) ? { ...rule, byMonthDay: Number(newDay.slice(8, 10)) } : rule;
  }
  return rule;
}
