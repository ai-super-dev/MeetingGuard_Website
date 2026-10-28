/*
 * Recurring meetings. A series repeats at the same wall-clock time in the
 * zone it was planned in (so 9:00 stays 9:00 across daylight-saving changes);
 * single dates can be skipped or moved through `exceptions`, as in the app.
 */

import type { Meeting, Occurrence } from "./types";
import { addDays, dayKey, daysBetween, fromZoned, timeKey, weekday } from "./time";

/** The next due day of a series after `day`, or null when the series has ended. */
function nextDay(m: Meeting, day: string, firstDay: string): string | null {
  let next: string;
  switch (m.repeat) {
    case "daily":
      next = addDays(day, 1);
      break;
    case "weekdays":
      next = addDays(day, weekday(day) === 5 ? 3 : weekday(day) === 6 ? 2 : 1);
      break;
    case "weekly":
      next = addDays(day, 7);
      break;
    case "monthly": {
      // same day of the month; months without it are left out
      const dom = firstDay.slice(8);
      let [y, mo] = day.split("-").map(Number);
      for (;;) {
        mo += 1;
        if (mo > 12) [y, mo] = [y + 1, 1];
        const candidate = `${y}-${String(mo).padStart(2, "0")}-${dom}`;
        if (addDays(candidate, 0) === candidate) {
          next = candidate;
          break;
        }
      }
      break;
    }
    default:
      return null;
  }
  return m.repeatUntil && next > m.repeatUntil ? null : next;
}

/** Every meeting of `m` that overlaps [from, to). */
export function occurrences(m: Meeting, from: Date, to: Date): Occurrence[] {
  const start = new Date(m.start);
  const end = new Date(m.end);
  if (m.repeat === "none") return end > from && start < to ? [{ meeting: m, key: "", start, end, moved: false }] : [];

  const length = end.getTime() - start.getTime();
  const firstDay = dayKey(start, m.timeZone);
  const time = timeKey(start, m.timeZone);
  const out: Occurrence[] = [];
  const pushIfVisible = (o: Occurrence) => {
    if (o.end > from && o.start < to) out.push(o);
  };

  // jump close to the window instead of walking a long series from its first day
  let day: string | null = firstDay;
  const gap = daysBetween(firstDay, dayKey(from, m.timeZone)) - 2;
  if (gap > 0 && (m.repeat === "daily" || m.repeat === "weekly")) {
    const step = m.repeat === "daily" ? 1 : 7;
    day = addDays(firstDay, Math.floor(gap / step) * step);
  }

  for (let i = 0; day && i < 800; i++) {
    const due = fromZoned(day, time, m.timeZone);
    if (due.getTime() - length > to.getTime() + 2 * 86_400_000) break;
    const ex = m.exceptions[day];
    if (!ex?.skip) {
      if (ex?.start && ex.end) pushIfVisible({ meeting: m, key: day, start: new Date(ex.start), end: new Date(ex.end), moved: true });
      else pushIfVisible({ meeting: m, key: day, start: due, end: new Date(due.getTime() + length), moved: false });
    }
    day = nextDay(m, day, firstDay);
  }
  // single meetings moved from outside the window into it
  for (const [key, ex] of Object.entries(m.exceptions)) {
    if (ex.start && ex.end && !out.some((o) => o.key === key)) {
      const o = { meeting: m, key, start: new Date(ex.start), end: new Date(ex.end), moved: true };
      if (o.end > from && o.start < to) out.push(o);
    }
  }
  return out;
}

/** All meetings in [from, to), sorted by start. */
export function expandAll(meetings: Meeting[], from: Date, to: Date) {
  return meetings.flatMap((m) => occurrences(m, from, to)).sort((a, b) => a.start.getTime() - b.start.getTime());
}

/** The occurrence of a series on a given key, or the single meeting itself. */
export function findOccurrence(m: Meeting, key: string): Occurrence | null {
  if (!key) return { meeting: m, key: "", start: new Date(m.start), end: new Date(m.end), moved: false };
  const ex = m.exceptions[key];
  if (ex?.skip) return null;
  const length = new Date(m.end).getTime() - new Date(m.start).getTime();
  if (ex?.start && ex.end) return { meeting: m, key, start: new Date(ex.start), end: new Date(ex.end), moved: true };
  const start = fromZoned(key, timeKey(new Date(m.start), m.timeZone), m.timeZone);
  return { meeting: m, key, start, end: new Date(start.getTime() + length), moved: false };
}
