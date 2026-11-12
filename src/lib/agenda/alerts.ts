/*
 * Meeting alerts on the web agenda, with the same rules as the app's alert
 * planner (src/services/alerts/plan.ts in the app):
 * - a meeting rings when it is scheduled, not deleted and not all-day;
 * - at its own alert times, or else the user's default ones (minutes before);
 * - with its own intensity, else the one for imported meetings, else the default;
 * - each date of a series rings on its own; cancelled dates never ring;
 * - nothing rings while meeting alerts are off in the alert settings.
 * The web rings only while an agenda page is open, so an alert whose time
 * passed while the page was closed still shows for a short while (the newest
 * one per meeting, and only until the meeting ends).
 * Pure: no browser APIs here.
 */

import { findOccurrence, occurrences } from "./recurrence";
import { MINUTE } from "./time";
import type { AlertIntensity, Meeting, Occurrence, Preferences } from "./types";

/** An alert whose time passed while no agenda page was open still shows this long after its time (the app's re-show window). */
export const CATCH_UP_MS = 20 * MINUTE;
/** A planned alert this close to a snooze of the same meeting would ring twice, so it is dropped. */
export const SNOOZE_DEDUPE_MS = 2 * MINUTE;
/** Within this much of the start, the alert says "starting now". */
const NOW_WINDOW_MS = 30_000;
/** Imported meetings: they may have their own default intensity. */
const IMPORTED = new Set(["google", "outlook", "device"]);

/** One alert due to ring. */
export type DueAlert = {
  /** Unique per meeting, date and alert time (or snooze). */
  id: string;
  meetingId: string;
  /** The date of a series ("" for single meetings). */
  key: string;
  fireAt: number;
  start: number;
  end: number;
  title: string;
  intensity: AlertIntensity;
  /** Minutes before the start; null for a snooze. */
  offset: number | null;
};

/** A snoozed alert, kept in this browser until it rings. */
export type Snooze = { id: string; meetingId: string; key: string; fireAt: number };

export function isAlertEligible(m: Meeting) {
  return m.deletedAt === null && m.status === "scheduled" && !m.allDay && Number.isFinite(Date.parse(m.startAt));
}

export function alertIntensityOf(m: Pick<Meeting, "alertIntensity" | "source">, prefs: Pick<Preferences, "alertIntensity" | "importedAlertIntensity">): AlertIntensity {
  if (m.alertIntensity !== null) return m.alertIntensity;
  if (IMPORTED.has(m.source) && prefs.importedAlertIntensity !== null) return prefs.importedAlertIntensity;
  return prefs.alertIntensity;
}

/** The alert times of a meeting in minutes before the start, largest first. */
export function alertOffsetsOf(m: Pick<Meeting, "customAlertTimes">, prefs: Pick<Preferences, "defaultAlertTimes">) {
  const source = m.customAlertTimes ?? prefs.defaultAlertTimes;
  return [...new Set(source.filter((v) => Number.isInteger(v) && v >= 0))].sort((a, b) => b - a);
}

const alertId = (meetingId: string, key: string, offset: number) => `${meetingId}|${key}|${offset}`;
export const snoozeId = (meetingId: string, key: string, fireAt: number) => `${meetingId}|${key}|s${fireAt}`;
/** The meeting date an alert belongs to. */
export const occurrenceId = (a: Pick<DueAlert, "meetingId" | "key">) => `${a.meetingId}|${a.key}`;

/** Every planned alert with its time in [from, to), sorted by time. */
export function planAlerts(meetings: readonly Meeting[], prefs: Preferences, from: number, to: number): DueAlert[] {
  if (!prefs.alertEnabled || to <= from) return [];
  const out: DueAlert[] = [];
  for (const m of meetings) {
    if (!isAlertEligible(m)) continue;
    const offsets = alertOffsetsOf(m, prefs);
    if (!offsets.length) continue;
    const intensity = alertIntensityOf(m, prefs);
    // a meeting that starts up to its largest alert time after `to` can still ring before it
    const occs: Occurrence[] = occurrences(m, new Date(from), new Date(to + offsets[0] * MINUTE));
    for (const o of occs) {
      const start = o.start.getTime();
      for (const offset of offsets) {
        const fireAt = start - offset * MINUTE;
        if (fireAt < from || fireAt >= to) continue;
        out.push({ id: alertId(m.id, o.key, offset), meetingId: m.id, key: o.key, fireAt, start, end: o.end.getTime(), title: o.title, intensity, offset });
      }
    }
  }
  return out.sort((a, b) => a.fireAt - b.fireAt || (a.offset ?? 0) - (b.offset ?? 0) || (a.id < b.id ? -1 : 1));
}

/** A snooze as an alert, with the meeting as it is now; null when that meeting or date is gone. */
export function snoozeAlert(s: Snooze, meetings: readonly Meeting[], prefs: Preferences): DueAlert | null {
  const m = meetings.find((x) => x.id === s.meetingId);
  if (!m || !isAlertEligible(m) || !prefs.alertEnabled) return null;
  const o = findOccurrence(m, s.key);
  if (!o) return null;
  return { id: s.id, meetingId: m.id, key: s.key, fireAt: s.fireAt, start: o.start.getTime(), end: o.end.getTime(), title: o.title, intensity: alertIntensityOf(m, prefs), offset: null };
}

export type DueResult = {
  /** To show now, oldest first; at most one per meeting date. */
  show: DueAlert[];
  /** Passed over without ringing: an older alert of the same meeting date, one next to a snooze, or a meeting that has ended. */
  skip: string[];
};

/**
 * What should ring at `now`: alerts that are due and not handled yet. Of several
 * due for the same meeting date only the newest rings (the page was closed, or
 * the tab slept). A planned alert next to a snooze of the same meeting date is
 * left out, as in the app.
 */
export function dueAlerts(candidates: readonly DueAlert[], snoozes: readonly Snooze[], handled: (id: string) => boolean, now: number): DueResult {
  const skip: string[] = [];
  const newest = new Map<string, DueAlert>();
  for (const a of candidates) {
    if (handled(a.id) || a.fireAt > now) continue;
    if (now - a.fireAt > CATCH_UP_MS || a.end <= now) {
      skip.push(a.id);
      continue;
    }
    if (a.offset !== null && snoozes.some((s) => s.meetingId === a.meetingId && s.key === a.key && Math.abs(s.fireAt - a.fireAt) <= SNOOZE_DEDUPE_MS)) {
      skip.push(a.id);
      continue;
    }
    const k = occurrenceId(a);
    const prev = newest.get(k);
    if (!prev) newest.set(k, a);
    else if (a.fireAt >= prev.fireAt) {
      skip.push(prev.id);
      newest.set(k, a);
    } else skip.push(a.id);
  }
  return { show: [...newest.values()].sort((a, b) => a.fireAt - b.fireAt), skip };
}

export type AlertPhase = "upcoming" | "now" | "started";

/** Where the meeting is relative to now, with whole minutes to the start (or since it). */
export function alertPhase(start: number, now: number): { phase: AlertPhase; minutes: number } {
  const diff = start - now;
  if (Math.abs(diff) <= NOW_WINDOW_MS) return { phase: "now", minutes: 0 };
  if (diff > 0) return { phase: "upcoming", minutes: Math.max(1, Math.ceil(diff / MINUTE)) };
  return { phase: "started", minutes: Math.max(1, Math.floor(-diff / MINUTE)) };
}

/** The snooze choices of the full-screen alert: [default, longer], as in the app. */
export function snoozeChoices(defaultMinutes: number): [number, number] {
  const base = Math.min(60, Math.max(1, Math.round(defaultMinutes)));
  const longer = base < 10 ? 10 : Math.min(60, base * 2);
  return [base, longer === base ? Math.min(120, base + 5) : longer];
}
