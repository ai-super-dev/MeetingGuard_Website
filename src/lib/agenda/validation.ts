/*
 * The checks a meeting or task passes before it is saved, the same on the
 * web as in the app. Each returns the fields that fail, with an error code
 * the screens turn into words (see `errors` in the agenda dictionary).
 * TODO(Dusko): keep these in step with the app's validation.
 */

import { isDayKey, isTimeKey } from "./time";

export type ErrorCode =
  | "required"
  | "tooLong"
  | "badDate"
  | "badTime"
  | "endBeforeStart"
  | "tooLongMeeting"
  | "inPast"
  | "badUrl"
  | "badEmail"
  | "untilBeforeStart"
  | "needsDue"
  | "needsTime";

export type Errors<K extends string> = Partial<Record<K, ErrorCode>>;

export const TITLE_MAX = 120;
const MAX_MEETING_MINUTES = 24 * 60;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isUrl(value: string) {
  try {
    const u = new URL(value);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

export const isEmail = (value: string) => EMAIL.test(value);

export type MeetingCheck = {
  title: string;
  date: string;
  start: string;
  end: string;
  allDay: boolean;
  /** Instants derived from the fields (null when the fields are invalid). */
  startAt: Date | null;
  endAt: Date | null;
  videoUrl: string;
  emails: string[];
  repeatUntil: string;
  /** New meetings and moves may not start in the past. */
  checkPast: boolean;
  now: number;
};

export function validateMeeting(c: MeetingCheck): Errors<"title" | "date" | "start" | "end" | "videoUrl" | "participants" | "repeatUntil"> {
  const e: Errors<"title" | "date" | "start" | "end" | "videoUrl" | "participants" | "repeatUntil"> = {};
  if (!c.title.trim()) e.title = "required";
  else if (c.title.trim().length > TITLE_MAX) e.title = "tooLong";
  if (!isDayKey(c.date)) e.date = "badDate";
  if (!c.allDay) {
    if (!isTimeKey(c.start)) e.start = "badTime";
    if (!isTimeKey(c.end)) e.end = "badTime";
  }
  if (!e.date && !e.start && !e.end && c.startAt && c.endAt) {
    const minutes = (c.endAt.getTime() - c.startAt.getTime()) / 60_000;
    if (!c.allDay && minutes <= 0) e.end = "endBeforeStart";
    else if (!c.allDay && minutes > MAX_MEETING_MINUTES) e.end = "tooLongMeeting";
    if (c.checkPast && c.endAt.getTime() < c.now) e[c.allDay ? "date" : "start"] = "inPast";
  }
  if (c.videoUrl.trim() && !isUrl(c.videoUrl.trim())) e.videoUrl = "badUrl";
  if (c.emails.some((x) => !isEmail(x))) e.participants = "badEmail";
  if (c.repeatUntil && (!isDayKey(c.repeatUntil) || c.repeatUntil < c.date)) e.repeatUntil = "untilBeforeStart";
  return e;
}

export function validateTask(t: { title: string; dueDate: string; dueTime: string; reminder: number | null }): Errors<"title" | "dueDate" | "dueTime" | "reminder"> {
  const e: Errors<"title" | "dueDate" | "dueTime" | "reminder"> = {};
  if (!t.title.trim()) e.title = "required";
  else if (t.title.trim().length > TITLE_MAX) e.title = "tooLong";
  if (t.dueDate && !isDayKey(t.dueDate)) e.dueDate = "badDate";
  if (t.dueTime && !isTimeKey(t.dueTime)) e.dueTime = "badTime";
  if (t.dueTime && !t.dueDate) e.dueDate = "needsDue";
  if (t.reminder !== null && !t.dueTime) e.reminder = "needsTime";
  return e;
}

export const hasErrors = (e: object) => Object.keys(e).length > 0;
