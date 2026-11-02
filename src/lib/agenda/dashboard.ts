/*
 * The dashboard's rules, the same as the app's src/screens/home/homeModel.ts
 * and src/screens/insights/meetingInsights.ts. They work on occurrences, so a
 * series counts every date it has, not just its stored first date. No words
 * here; they live in i18n.ts.
 */

import { joinUrl } from "./store";
import { addDays, dayKey, daysBetween, fromZoned, weekday } from "./time";
import type { Occurrence, Task } from "./types";

/** A meeting that starts at most this long after another ends is "back-to-back". */
const BACK_TO_BACK_GAP = 5 * 60_000;

/** Under an hour the countdown shows a ticking clock. */
const CLOCK_LIMIT_SECONDS = 3600;

/** Tasks shown on the dashboard. */
export const MAX_TASK_ROWS = 3;

export type DayPeriod = "morning" | "afternoon" | "evening";

/** 05:00-11:59 morning, 12:00-17:59 afternoon, otherwise evening. */
export function dayPeriodOf(hour: number): DayPeriod {
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  return "evening";
}

/** First name for the greeting ("Ana María López" is "Ana"); never an email address. */
export function firstNameOf(name: string | null | undefined) {
  const first = (name ?? "").trim().split(/\s+/)[0] ?? "";
  if (!first || first.includes("@")) return null;
  return first.length > 24 ? `${first.slice(0, 24)}...` : first;
}

const countable = (o: Occurrence) => o.meeting.status === "scheduled";

/* ---------- Happening now and next ---------- */

/** The timed meeting in progress (the one that started last) and the first one still to come. */
export function findNowAndNext(occs: readonly Occurrence[], now: number) {
  let current: Occurrence | null = null;
  let next: Occurrence | null = null;
  for (const o of occs) {
    if (!countable(o) || o.meeting.allDay) continue;
    const start = o.start.getTime();
    if (start <= now && o.end.getTime() > now) {
      if (!current || start > current.start.getTime()) current = o;
    } else if (start > now && (!next || start < next.start.getTime())) {
      next = o;
    }
  }
  return { current, next };
}

export type Countdown =
  | { kind: "now" }
  /** Under an hour: "4:05", ticking. */
  | { kind: "clock"; text: string }
  /** 1 to 24 hours: whole minutes. */
  | { kind: "duration"; minutes: number }
  /** A day or more away: a relative date. */
  | { kind: "relative" };

export function countdownTo(target: number, now: number): Countdown {
  const total = Math.max(0, Math.ceil((target - now) / 1000));
  if (total === 0) return { kind: "now" };
  if (total >= 24 * 3600) return { kind: "relative" };
  if (total >= CLOCK_LIMIT_SECONDS) return { kind: "duration", minutes: Math.ceil(total / 60) };
  return { kind: "clock", text: `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}` };
}

/* ---------- Which days a meeting is on ---------- */

/** The dates a meeting occupies: its start date, or every date of an all-day meeting in its own zone. */
export function datesOf(o: Occurrence, zone: string) {
  if (!o.meeting.allDay) return [dayKey(o.start, zone)];
  const z = o.meeting.timezone;
  const first = dayKey(o.start, z);
  const last = dayKey(new Date(Math.max(o.start.getTime(), o.end.getTime() - 1)), z);
  return Array.from({ length: Math.min(daysBetween(first, last), 31) + 1 }, (_, i) => addDays(first, i));
}

const onDays = (occs: readonly Occurrence[], days: readonly string[], zone: string) => {
  const wanted = new Set(days);
  return occs.filter((o) => datesOf(o, zone).some((d) => wanted.has(d)));
};

/* ---------- Conflicts ---------- */

type Pair = { first: Occurrence; second: Occurrence };

const timedSorted = (occs: readonly Occurrence[]) =>
  occs.filter((o) => countable(o) && !o.meeting.allDay).sort((a, b) => a.start.getTime() - b.start.getTime() || a.end.getTime() - b.end.getTime());

/** Pairs of timed meetings whose times overlap. */
export function findOverlaps(occs: readonly Occurrence[]) {
  const sorted = timedSorted(occs);
  const pairs: Pair[] = [];
  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      if (sorted[j].start >= sorted[i].end) break;
      pairs.push({ first: sorted[i], second: sorted[j] });
    }
  }
  return pairs;
}

/** Meetings that start with no real break after an earlier one, each with the meeting it follows. */
export function findBackToBack(occs: readonly Occurrence[]) {
  const sorted = timedSorted(occs);
  const pairs: Pair[] = [];
  for (const second of sorted) {
    let previous: Occurrence | null = null;
    for (const first of sorted) {
      if (first === second) continue;
      if (first.start >= second.start) break;
      const gap = second.start.getTime() - first.end.getTime();
      if (gap >= 0 && gap <= BACK_TO_BACK_GAP && (!previous || first.end >= previous.end)) previous = first;
    }
    if (previous) pairs.push({ first: previous, second });
  }
  return pairs;
}

/* ---------- Today ---------- */

export type TimelineItem = {
  occurrence: Occurrence;
  state: "past" | "now" | "upcoming";
  overlapsWith: Occurrence[];
  followsRightAfter: Occurrence | null;
};

/** Today's meetings in order: all-day first, then by start. Cancelled ones stay listed but never conflict. */
export function todayTimeline(occs: readonly Occurrence[], today: string, zone: string, now: number): TimelineItem[] {
  const all = onDays(occs, [today], zone);
  const scheduled = all.filter(countable);
  const overlaps = findOverlaps(scheduled);
  const backToBack = findBackToBack(scheduled);
  return all
    .map((o): TimelineItem => {
      const state = o.meeting.allDay ? "now" : o.end.getTime() <= now ? "past" : o.start.getTime() <= now ? "now" : "upcoming";
      if (!countable(o)) return { occurrence: o, state, overlapsWith: [], followsRightAfter: null };
      return {
        occurrence: o,
        state,
        overlapsWith: overlaps.filter((p) => p.first === o || p.second === o).map((p) => (p.first === o ? p.second : p.first)),
        followsRightAfter: backToBack.find((p) => p.second === o)?.first ?? null,
      };
    })
    .sort((x, y) => Number(y.occurrence.meeting.allDay) - Number(x.occurrence.meeting.allDay) || x.occurrence.start.getTime() - y.occurrence.start.getTime() || x.occurrence.title.localeCompare(y.occurrence.title));
}

/* ---------- Your week ---------- */

/** The week starts on Sunday, as on the app's dashboard. */
export const sundayOf = (day: string) => addDays(day, -weekday(day));

const minutesOf = (occs: readonly Occurrence[]) => occs.reduce((sum, o) => sum + (o.meeting.allDay ? 0 : Math.round((o.end.getTime() - o.start.getTime()) / 60_000)), 0);

const hasPlace = (o: Occurrence) => joinUrl(o.meeting) !== null || !!o.meeting.location?.address?.trim();

export type WeekSummary = {
  days: { day: string; count: number; minutes: number }[];
  count: number;
  minutes: number;
  lastCount: number;
  lastMinutes: number;
  overlaps: number;
  backToBack: number;
  missingPlace: number;
  withTips: number;
};

/** This week's numbers, compared with last week, and what deserves a look in the rest of it. */
export function weekSummary(occs: readonly Occurrence[], today: string, zone: string, now: number): WeekSummary {
  const sunday = sundayOf(today);
  const daysFrom = (first: string) => Array.from({ length: 7 }, (_, i) => addDays(first, i));
  const days = daysFrom(sunday);
  const scheduled = occs.filter(countable);
  const week = onDays(scheduled, days, zone);
  const last = onDays(scheduled, daysFrom(addDays(sunday, -7)), zone);
  const open = week.filter((o) => o.meeting.allDay || o.end.getTime() > now);
  return {
    days: days.map((day) => {
      const onDay = onDays(week, [day], zone);
      return { day, count: onDay.length, minutes: minutesOf(onDay) };
    }),
    count: week.length,
    minutes: minutesOf(week),
    lastCount: last.length,
    lastMinutes: minutesOf(last),
    overlaps: findOverlaps(open).length,
    backToBack: findBackToBack(open).length,
    missingPlace: open.filter((o) => !o.meeting.allDay && !hasPlace(o)).length,
    withTips: open.filter((o) => o.meeting.preparationTips.length > 0).length,
  };
}

/** How tall a day's bar is, against the longest day (by time; by count when there is no time). */
export function barFraction(day: { count: number; minutes: number }, days: readonly { count: number; minutes: number }[]) {
  const most = Math.max(0, ...days.map((d) => d.minutes));
  if (most > 0) return day.minutes / most;
  const mostCount = Math.max(0, ...days.map((d) => d.count));
  return mostCount > 0 ? day.count / mostCount : 0;
}

/* ---------- Tasks ---------- */

/** Open and past due: a timed task after its moment, a task with only a date after its day. */
export function isOverdue(t: Task, today: string, now: number) {
  if (t.status !== "open" || !t.dueDate) return false;
  return t.dueTime ? fromZoned(t.dueDate, t.dueTime, t.timezone).getTime() < now : t.dueDate < today;
}

/** The dashboard's tasks: open and due today or earlier, most urgent first. */
export function dueNow(tasks: readonly Task[], today: string) {
  const at = (t: Task) => `${t.dueDate}T${t.dueTime ?? "99:99"}`;
  return tasks
    .filter((t) => t.status === "open" && !!t.dueDate && t.dueDate <= today)
    .sort((x, y) => at(x).localeCompare(at(y)))
    .slice(0, MAX_TASK_ROWS);
}
