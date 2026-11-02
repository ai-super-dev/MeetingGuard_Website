/*
 * The Meetings page's rules, the same as the app's
 * src/screens/meetings/list/meetingListModel.ts: search, time and source
 * filters, then one group per day.
 */

import { calendarOf } from "./store";
import { dayKey } from "./time";
import type { Calendar, Occurrence } from "./types";

/** How far the list looks, as in the app. */
export const LIST_PAST_DAYS = 90;
export const LIST_FUTURE_DAYS = 370;

export type TimeFilter = "upcoming" | "past" | "all";
export type SourceFilter = "all" | Calendar;
export type MeetingFilters = { time: TimeFilter; source: SourceFilter; query: string };
export type MeetingSection = { day: string; items: Occurrence[] };

/** Any case, with or without accents ("reunion" finds "Reunión"). */
const normalize = (text: string) => text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();

/** Every word must appear somewhere: title, description, notes, place or people. */
function matchesSearch(o: Occurrence, query: string) {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (!words.length) return true;
  const m = o.meeting;
  const people = m.participants.flatMap((p) => [p.email, p.name ?? ""]);
  const text = normalize([o.title, m.title, m.description, m.notes ?? "", m.location?.address ?? "", ...people].join("\n"));
  return words.every((w) => text.includes(w));
}

/** Upcoming means not ended yet, so a meeting in progress stays listed. */
function matchesTime(o: Occurrence, time: TimeFilter, now: number) {
  if (time === "all") return true;
  const ended = o.end.getTime() <= now;
  return time === "past" ? ended : !ended;
}

/** The day a meeting is listed under; an all-day meeting stays on its own date. */
const listDay = (o: Occurrence, zone: string) => dayKey(o.start, o.meeting.allDay ? o.meeting.timezone : zone);

/** Within a day: all-day meetings first, then by start, then by title. */
export const compareWithinDay = (a: Occurrence, b: Occurrence) =>
  Number(b.meeting.allDay) - Number(a.meeting.allDay) || a.start.getTime() - b.start.getTime() || a.title.localeCompare(b.title);

/** Filtered meetings by day: the soonest day first, or the latest first for past meetings. */
export function buildSections(occs: readonly Occurrence[], filters: MeetingFilters, zone: string, now: number): MeetingSection[] {
  const days = new Map<string, Occurrence[]>();
  for (const o of occs) {
    if (!matchesTime(o, filters.time, now)) continue;
    if (filters.source !== "all" && calendarOf(o.meeting) !== filters.source) continue;
    if (!matchesSearch(o, filters.query)) continue;
    const day = listDay(o, zone);
    days.set(day, [...(days.get(day) ?? []), o]);
  }
  const keys = [...days.keys()].sort();
  if (filters.time === "past") keys.reverse();
  return keys.map((day) => ({ day, items: (days.get(day) ?? []).sort(compareWithinDay) }));
}

/** A search or a source filter is on. */
export const hasActiveFilters = (filters: MeetingFilters) => filters.source !== "all" || normalize(filters.query).length > 0;
