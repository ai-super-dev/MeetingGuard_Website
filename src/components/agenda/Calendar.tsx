import { addDays, dayKey, daysBetween } from "@/lib/agenda/time";
import type { Occurrence } from "@/lib/agenda/types";

export type Selection = { id: string; key: string };

/** Meetings by the days they cover (all-day meetings can span several). */
export function byDay(occs: Occurrence[], zone: string) {
  const map = new Map<string, Occurrence[]>();
  for (const o of occs) {
    // an all-day meeting stays on its own dates, whatever zone it is seen from
    const z = o.meeting.allDay ? o.meeting.timezone : zone;
    const first = dayKey(o.start, z);
    const last = dayKey(new Date(Math.max(o.start.getTime(), o.end.getTime() - 1)), z);
    const span = Math.min(daysBetween(first, last), 31);
    for (let i = 0; i <= span; i++) {
      const d = addDays(first, i);
      map.set(d, [...(map.get(d) ?? []), o]);
    }
  }
  return map;
}

/** "zoom.us" from a video link. */
export function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^(www|us\d+web)\./, "");
  } catch {
    return url;
  }
}
