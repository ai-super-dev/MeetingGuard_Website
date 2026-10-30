/*
 * The meeting form, the same checks and conversions as the app's
 * src/screens/meetings/meetingForm.ts: the form edits a draft of plain strings,
 * which is checked and turned into what is saved. Errors are codes the screens
 * turn into words (see `errors` in the agenda dictionary).
 */

import { MAX_MEETING_MINUTES, normalizeAlertTimes } from "./records";
import { weekdayCode, WEEKDAYS } from "./recurrence";
import { dayKey, fromZoned, isDayKey, isTimeKey, isValidZone } from "./time";
import type { AlertIntensity, Conference, ConferenceProvider, LocationType, Meeting, MeetingInput, MeetingLocation, MeetingPatch, Participant, RecurrenceFreq, RecurrenceRule, RecurrenceWeekday } from "./types";

export type ErrorCode =
  | "required"
  | "tooLong"
  | "badDate"
  | "badTime"
  | "badDuration"
  | "badZone"
  | "badUrl"
  | "badEmail"
  | "tooManyParticipants"
  | "tooManyTips"
  | "alertTimesRequired"
  | "badRepeatInterval"
  | "badRepeatUntil"
  | "badRepeatCount";

export type Errors<K extends string> = Partial<Record<K, ErrorCode>>;

export const TITLE_MAX = 200;
export const DESCRIPTION_MAX = 4000;
const NOTES_MAX = 10_000;
const ADDRESS_MAX = 500;
const PASSWORD_MAX = 100;
const PARTICIPANTS_MAX = 100;
const TIPS_MAX = 20;
const TIP_CHARS_MAX = 300;
const INTERVAL_MAX = 99;
const COUNT_MAX = 730;
const DAY_MINUTES = 1440;

/** Minutes before the start offered as reminders. */
export const ALERT_TIME_OPTIONS = [60, 30, 15, 10, 5, 0];
export const DURATION_OPTIONS = [15, 30, 45, 60, 90, 120];

// the app's own check: an address it wouldn't accept would make the whole meeting unreadable there
const EMAIL = /^(?:[A-Za-z0-9_'+\-]+\.)*[A-Za-z0-9_'+\-]*[A-Za-z0-9_+-]@(?:[A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;

export const isEmail = (value: string) => EMAIL.test(value) && value.length <= 254;

/** One participant row of the form. */
export type ParticipantDraft = { email: string; name: string };

export type MeetingDraft = {
  title: string;
  description: string;
  date: string;
  time: string;
  allDay: boolean;
  durationMinutes: number;
  timezone: string;
  locationType: "none" | LocationType;
  address: string;
  /** Kept as it is: the join link of an imported meeting. */
  virtualUrl: string | null;
  conferenceProvider: "none" | ConferenceProvider;
  conferenceUrl: string;
  conferencePassword: string;
  participants: ParticipantDraft[];
  /** One per line. */
  tips: string;
  customAlerts: boolean;
  alertTimes: number[];
  alertIntensity: "default" | AlertIntensity;
  notes: string;
  repeat: "none" | RecurrenceFreq;
  repeatInterval: string;
  repeatWeekdays: RecurrenceWeekday[];
  repeatEnd: "never" | "onDate" | "afterCount";
  repeatUntilDate: string;
  repeatCount: string;
};

export function newDraft(o: { day: string; time: string; timezone: string; defaultAlertTimes: number[] }): MeetingDraft {
  return {
    title: "",
    description: "",
    date: o.day,
    time: o.time,
    allDay: false,
    durationMinutes: 60,
    timezone: o.timezone,
    locationType: "none",
    address: "",
    virtualUrl: null,
    conferenceProvider: "none",
    conferenceUrl: "",
    conferencePassword: "",
    participants: [],
    tips: "",
    customAlerts: false,
    alertTimes: [...o.defaultAlertTimes],
    alertIntensity: "default",
    notes: "",
    repeat: "none",
    repeatInterval: "1",
    repeatWeekdays: [],
    repeatEnd: "never",
    repeatUntilDate: "",
    repeatCount: "",
  };
}

export function draftFromMeeting(m: Meeting, defaultAlertTimes: number[]): MeetingDraft {
  const rule = m.recurrence;
  return {
    title: m.title,
    description: m.description,
    date: m.date,
    time: m.allDay ? "09:00" : m.time,
    allDay: m.allDay,
    durationMinutes: m.durationMinutes,
    timezone: m.timezone,
    locationType: m.location?.type ?? "none",
    address: m.location?.address ?? "",
    virtualUrl: m.location?.virtualUrl ?? null,
    conferenceProvider: m.conference?.provider ?? "none",
    conferenceUrl: m.conference?.url ?? "",
    conferencePassword: m.conference?.password ?? "",
    participants: m.participants.map((p) => ({ email: p.email, name: p.name ?? "" })),
    tips: m.preparationTips.join("\n"),
    customAlerts: m.customAlertTimes !== null,
    alertTimes: [...(m.customAlertTimes ?? defaultAlertTimes)],
    alertIntensity: m.alertIntensity ?? "default",
    notes: m.notes ?? "",
    repeat: rule?.freq ?? "none",
    repeatInterval: String(rule?.interval ?? 1),
    repeatWeekdays: rule?.byWeekday ? [...rule.byWeekday] : [],
    repeatEnd: !rule || (rule.until === null && rule.count === null) ? "never" : rule.until !== null ? "onDate" : "afterCount",
    repeatUntilDate: rule?.until ? dayKey(new Date(rule.until), m.timezone) : "",
    repeatCount: rule?.count != null ? String(rule.count) : "",
  };
}

/** Adds https:// to a typed link without one; null when it isn't an http(s) link. */
export function normalizeUrl(text: string): string | null {
  const trimmed = text.trim();
  if (!trimmed || trimmed.length > 2048) return null;
  const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const u = new URL(withScheme);
    return u.protocol === "https:" || u.protocol === "http:" ? withScheme : null;
  } catch {
    return null;
  }
}

/** The rows the user filled in; empty rows are ignored. */
const participantRows = (d: Pick<MeetingDraft, "participants">) => d.participants.filter((row) => row.email.trim() || row.name.trim());

const parseTips = (text: string) =>
  text
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);

function wholeIn(text: string, max: number) {
  const n = Number(text.trim());
  return Number.isInteger(n) && n >= 1 && n <= max ? n : null;
}

export function validateDraft(d: MeetingDraft) {
  const e: Errors<"title" | "date" | "time" | "duration" | "timezone" | "description" | "notes" | "address" | "conferenceUrl" | "conferencePassword" | "participants" | "tips" | "alertTimes" | "repeatInterval" | "repeatUntil" | "repeatCount"> = {};
  const title = d.title.trim();
  if (!title) e.title = "required";
  else if (title.length > TITLE_MAX) e.title = "tooLong";
  if (!isValidZone(d.timezone)) e.timezone = "badZone";
  if (!isDayKey(d.date)) e.date = "badDate";
  if (!d.allDay && !isTimeKey(d.time)) e.time = "badTime";
  if (!Number.isInteger(d.durationMinutes) || d.durationMinutes < 1 || d.durationMinutes > MAX_MEETING_MINUTES) e.duration = "badDuration";
  if (d.description.length > DESCRIPTION_MAX) e.description = "tooLong";
  if (d.notes.length > NOTES_MAX) e.notes = "tooLong";
  if ((d.locationType === "physical" || d.locationType === "hybrid") && d.address.trim().length > ADDRESS_MAX) e.address = "tooLong";
  if (d.conferenceProvider !== "none") {
    if (d.conferenceUrl.trim() && !normalizeUrl(d.conferenceUrl)) e.conferenceUrl = "badUrl";
    if (d.conferencePassword.trim().length > PASSWORD_MAX) e.conferencePassword = "tooLong";
  }
  const rows = participantRows(d);
  if (rows.length > PARTICIPANTS_MAX) e.participants = "tooManyParticipants";
  else if (rows.some((row) => !isEmail(row.email.trim().toLowerCase()))) e.participants = "badEmail";
  const tips = parseTips(d.tips);
  if (tips.length > TIPS_MAX || tips.some((t) => t.length > TIP_CHARS_MAX)) e.tips = "tooManyTips";
  if (d.customAlerts && !d.alertTimes.length) e.alertTimes = "alertTimesRequired";
  if (d.repeat !== "none") {
    if (wholeIn(d.repeatInterval, INTERVAL_MAX) === null) e.repeatInterval = "badRepeatInterval";
    if (d.repeatEnd === "onDate" && (!isDayKey(d.repeatUntilDate) || d.repeatUntilDate < d.date)) e.repeatUntil = "badRepeatUntil";
    if (d.repeatEnd === "afterCount" && wholeIn(d.repeatCount, COUNT_MAX) === null) e.repeatCount = "badRepeatCount";
  }
  return e;
}

export const hasErrors = (e: object) => Object.keys(e).length > 0;

/** The form's rule. `existing` keeps what the form doesn't edit: an imported day of the month, and the exact end when its day is unchanged. */
export function ruleOf(d: MeetingDraft, existing: RecurrenceRule | null = null): RecurrenceRule | null {
  if (d.repeat === "none") return null;
  let until: string | null = null;
  let count: number | null = null;
  if (d.repeatEnd === "onDate" && isDayKey(d.repeatUntilDate)) {
    const sameDay = existing?.until && dayKey(new Date(existing.until), d.timezone) === d.repeatUntilDate;
    until = sameDay ? existing.until : fromZoned(d.repeatUntilDate, "23:59", d.timezone).toISOString();
  } else if (d.repeatEnd === "afterCount") {
    count = wholeIn(d.repeatCount, COUNT_MAX) ?? 1;
  }
  return {
    freq: d.repeat,
    interval: wholeIn(d.repeatInterval, INTERVAL_MAX) ?? 1,
    byWeekday: d.repeat === "weekly" && d.repeatWeekdays.length ? WEEKDAYS.filter((x) => d.repeatWeekdays.includes(x)) : null,
    byMonthDay: d.repeat === "monthly" && existing?.freq === "monthly" ? existing.byMonthDay : null,
    until,
    count,
  };
}

/** The meeting's own weekday, selected when a draft switches to weekly. */
export const defaultWeekdays = (d: Pick<MeetingDraft, "date">): RecurrenceWeekday[] => (isDayKey(d.date) ? [weekdayCode(d.date)] : []);

export const startAtOf = (d: MeetingDraft) => fromZoned(d.date, d.allDay ? "00:00" : d.time, d.timezone).toISOString();

const durationOf = (d: MeetingDraft) => (d.allDay ? Math.max(1, Math.round(d.durationMinutes / DAY_MINUTES)) * DAY_MINUTES : d.durationMinutes);

function locationOf(d: MeetingDraft): MeetingLocation | null {
  if (d.locationType === "none") return null;
  const address = d.address.trim();
  return { type: d.locationType, address: d.locationType === "virtual" || !address ? null : address, virtualUrl: d.locationType === "physical" ? null : d.virtualUrl };
}

function conferenceOf(d: MeetingDraft): Conference | null {
  if (d.conferenceProvider === "none") return null;
  return { provider: d.conferenceProvider, url: normalizeUrl(d.conferenceUrl), password: d.conferencePassword.trim() || null };
}

function participantsOf(d: MeetingDraft, existing: Participant[] = []): Participant[] {
  const status = new Map(existing.map((p) => [p.email.toLowerCase(), p.status]));
  return participantRows(d).map((row) => {
    const email = row.email.trim().toLowerCase();
    return { email, name: row.name.trim() || null, status: status.get(email) ?? null };
  });
}

const alertTimesOf = (d: MeetingDraft) => (d.customAlerts ? normalizeAlertTimes(d.alertTimes) : null);
const intensityOf = (d: MeetingDraft) => (d.alertIntensity === "default" ? null : d.alertIntensity);

export function draftToInput(d: MeetingDraft): MeetingInput {
  return {
    title: d.title.trim(),
    description: d.description.trim(),
    startAt: startAtOf(d),
    durationMinutes: durationOf(d),
    timezone: d.timezone,
    allDay: d.allDay,
    location: locationOf(d),
    conference: conferenceOf(d),
    participants: participantsOf(d),
    source: "manual",
    confidence: 100,
    preparationTips: parseTips(d.tips),
    customAlertTimes: alertTimesOf(d),
    alertIntensity: intensityOf(d),
    notes: d.notes.trim() || null,
    recurrence: ruleOf(d),
  };
}

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

/**
 * Only what the form changed. `original` is the draft the form started with:
 * when the link field wasn't touched, the live link wins, since the phone may
 * have written a new Meet, Teams or Zoom link while the form was open.
 */
export function draftToPatch(m: Meeting, d: MeetingDraft, original: MeetingDraft): MeetingPatch {
  const patch: MeetingPatch = {};
  const title = d.title.trim();
  if (title !== m.title) patch.title = title;
  const description = d.description.trim();
  if (description !== m.description) patch.description = description;
  const startAt = startAtOf(d);
  if (Date.parse(startAt) !== Date.parse(m.startAt)) patch.startAt = startAt;
  if (d.timezone !== m.timezone) patch.timezone = d.timezone;
  if (d.allDay !== m.allDay) patch.allDay = d.allDay;
  const duration = durationOf(d);
  if (duration !== m.durationMinutes) patch.durationMinutes = duration;
  const location = locationOf(d);
  if (!same(location, m.location)) patch.location = location;
  const conference = conferenceOf(d);
  if (conference && m.conference && conference.provider === m.conference.provider && d.conferenceUrl.trim() === original.conferenceUrl.trim()) {
    conference.url = m.conference.url;
    if (d.conferencePassword.trim() === original.conferencePassword.trim()) conference.password = m.conference.password;
  }
  if (!same(conference, m.conference)) patch.conference = conference;
  const participants = participantsOf(d, m.participants);
  if (!same(participants, m.participants.map((p) => ({ email: p.email, name: p.name, status: p.status })))) patch.participants = participants;
  const tips = parseTips(d.tips);
  if (!same(tips, m.preparationTips)) patch.preparationTips = tips;
  const alertTimes = alertTimesOf(d);
  if (!same(alertTimes, m.customAlertTimes)) patch.customAlertTimes = alertTimes;
  const intensity = intensityOf(d);
  if (intensity !== m.alertIntensity) patch.alertIntensity = intensity;
  const notes = d.notes.trim() || null;
  if (notes !== m.notes) patch.notes = notes;
  const rule = ruleOf(d, m.recurrence);
  if (!same(rule, m.recurrence)) patch.recurrence = rule;
  return patch;
}

/* ---------- Tasks ---------- */

/** Minutes before the due time offered as reminders. */
export const TASK_REMINDERS = [0, 5, 15, 30, 60, 1440];

export function validateTask(t: { title: string; description: string; dueDate: string; dueTime: string }) {
  const e: Errors<"title" | "description" | "dueDate" | "dueTime"> = {};
  const title = t.title.trim();
  if (!title) e.title = "required";
  else if (title.length > TITLE_MAX) e.title = "tooLong";
  if (t.description.length > DESCRIPTION_MAX) e.description = "tooLong";
  if (t.dueDate && !isDayKey(t.dueDate)) e.dueDate = "badDate";
  if (t.dueTime && !isTimeKey(t.dueTime)) e.dueTime = "badTime";
  return e;
}
