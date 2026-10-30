/*
 * Reading and writing the app's documents: the same rules as the app's
 * src/core/types.ts (buildMeeting, applyMeetingPatch, tombstoneMeeting,
 * buildTask, applyTaskPatch and their parsers). Pure. Every write sends the
 * whole document, as the app does, so fields the web never shows stay intact.
 */

import { dayKey, isDayKey, isTimeKey, isValidZone, timeKey } from "./time";
import type { Entitlement, ExternalRefs, Meeting, MeetingInput, MeetingPatch, MeetingSource, Participant, Plan, Preferences, RecurrenceRule, Task, TaskInput, TaskPatch } from "./types";

const ID = /^[A-Za-z0-9_-]{1,128}$/;
const SOURCES: MeetingSource[] = ["manual", "ai_chat", "whatsapp", "google", "device", "outlook"];

/** Left out of a document while empty, as the app stores them. */
const SPARSE_EXTERNAL = ["outlookEventId", "outlookCalendarId", "outlookChangeKey", "outlookUpdatedAt", "zoomMeetingId"];
const EMPTY_EXTERNAL: ExternalRefs = { googleEventId: null, googleCalendarId: null, googleEtag: null, googleUpdatedAt: null, deviceEventId: null, deviceCalendarId: null, outlookEventId: null, outlookCalendarId: null, outlookChangeKey: null, outlookUpdatedAt: null, zoomMeetingId: null };
const SPARSE_MEETING = ["recurrence", "recurrenceOverrides", "seriesId"] as const;

export const DEFAULT_MEETING_MINUTES = 60;
export const MAX_MEETING_MINUTES = 20_160;

const TOMBSTONE_TITLE = "Deleted meeting";

type Raw = Record<string, unknown>;

const isIso = (v: unknown): v is string => typeof v === "string" && !Number.isNaN(Date.parse(v));
const str = (v: unknown, fallback = "") => (typeof v === "string" ? v : fallback);
const nullable = (v: unknown) => (typeof v === "string" ? v : null);

/** A time later than `previous`, so a write always counts as the newest one. */
export function nextTimestamp(now: number, previous?: string | null) {
  const before = previous ? Date.parse(previous) : 0;
  return new Date(Math.max(now, before + 1)).toISOString();
}

function normalizeParticipants(list: Participant[] | undefined): Participant[] {
  const byEmail = new Map<string, Participant>();
  for (const p of list ?? []) {
    const email = p.email.trim().toLowerCase();
    if (!byEmail.has(email)) byEmail.set(email, { email, name: p.name?.trim() || null, status: p.status ?? null });
  }
  return [...byEmail.values()];
}

export const normalizeAlertTimes = (times: number[]) => [...new Set(times)].sort((a, b) => b - a);

/* ---------- Meetings ---------- */

export function buildMeeting(input: MeetingInput, ctx: { id: string; userId: string; now: string; timezone: string; language: "en" | "es" }): Meeting {
  const timezone = input.timezone ?? ctx.timezone;
  const startAt = new Date(input.startAt).toISOString();
  const start = new Date(startAt);
  const recurrence = input.recurrence ?? null;
  return {
    id: ctx.id,
    userId: ctx.userId,
    title: input.title.trim(),
    description: input.description ?? "",
    startAt,
    durationMinutes: input.durationMinutes ?? DEFAULT_MEETING_MINUTES,
    timezone,
    allDay: input.allDay ?? false,
    date: dayKey(start, timezone),
    time: timeKey(start, timezone),
    location: input.location ?? null,
    conference: input.conference ?? null,
    participants: normalizeParticipants(input.participants),
    source: input.source ?? "manual",
    confidence: input.confidence ?? null,
    language: input.language ?? ctx.language,
    preparationTips: input.preparationTips ?? [],
    customAlertTimes: input.customAlertTimes ? normalizeAlertTimes(input.customAlertTimes) : null,
    alertIntensity: input.alertIntensity ?? null,
    notes: input.notes ?? null,
    status: input.status ?? "scheduled",
    external: { ...EMPTY_EXTERNAL },
    recurrence,
    recurrenceOverrides: recurrence ? (input.recurrenceOverrides ?? null) : null,
    seriesId: recurrence ? ctx.id : null,
    createdAt: ctx.now,
    updatedAt: ctx.now,
    deletedAt: null,
  };
}

export function applyMeetingPatch(m: Meeting, patch: MeetingPatch, now: string): Meeting {
  const timezone = patch.timezone ?? m.timezone;
  const startAt = patch.startAt !== undefined ? new Date(patch.startAt).toISOString() : m.startAt;
  const start = new Date(startAt);
  const next: Meeting = {
    ...m,
    ...patch,
    title: patch.title?.trim() ?? m.title,
    startAt,
    timezone,
    date: dayKey(start, timezone),
    time: timeKey(start, timezone),
    participants: patch.participants ? normalizeParticipants(patch.participants) : m.participants,
    customAlertTimes: patch.customAlertTimes === undefined ? m.customAlertTimes : patch.customAlertTimes && normalizeAlertTimes(patch.customAlertTimes),
    updatedAt: now,
  };
  if (next.recurrence === null) next.recurrenceOverrides = null;
  else if (m.recurrence === null && next.seriesId === null) next.seriesId = m.id;
  return next;
}

/** A deleted meeting keeps only what sync needs; its content is removed. */
export function tombstoneMeeting(m: Meeting, now: string): Meeting {
  return {
    ...m,
    title: TOMBSTONE_TITLE,
    description: "",
    location: null,
    conference: null,
    participants: [],
    preparationTips: [],
    customAlertTimes: null,
    alertIntensity: null,
    notes: null,
    confidence: null,
    recurrence: null,
    recurrenceOverrides: null,
    deletedAt: now,
    updatedAt: now,
  };
}

/** The stored document: no id, and the newer fields left out while empty. */
export function meetingToDoc(m: Meeting): Raw {
  const out: Raw = { ...m, external: { ...m.external } };
  delete out.id;
  for (const key of SPARSE_MEETING) if (out[key] === null) delete out[key];
  const external = out.external as ExternalRefs;
  for (const key of SPARSE_EXTERNAL) if (external[key] === null) delete external[key];
  return out;
}

function parseRule(raw: unknown): RecurrenceRule | null {
  if (typeof raw !== "object" || raw === null) return null;
  const r = raw as Raw;
  if (r.freq !== "daily" && r.freq !== "weekly" && r.freq !== "monthly") return null;
  return {
    freq: r.freq,
    interval: typeof r.interval === "number" ? r.interval : 1,
    byWeekday: Array.isArray(r.byWeekday) && r.byWeekday.length ? (r.byWeekday as RecurrenceRule["byWeekday"]) : null,
    byMonthDay: typeof r.byMonthDay === "number" ? r.byMonthDay : null,
    until: isIso(r.until) ? r.until : null,
    count: typeof r.count === "number" ? r.count : null,
  };
}

/** A stored meeting, or null when the document isn't a valid meeting (it is skipped, as in the app). */
export function parseMeeting(id: string, raw: Raw): Meeting | null {
  if (!ID.test(id) || typeof raw.title !== "string" || !raw.title || !isIso(raw.startAt) || typeof raw.timezone !== "string") return null;
  if (!SOURCES.includes(raw.source as MeetingSource) || !isIso(raw.createdAt) || !isIso(raw.updatedAt)) return null;
  const start = new Date(raw.startAt);
  const zone = isValidZone(raw.timezone) ? raw.timezone : "UTC";
  const recurrence = parseRule(raw.recurrence);
  return {
    id,
    userId: str(raw.userId),
    title: raw.title,
    description: str(raw.description),
    startAt: raw.startAt,
    durationMinutes: typeof raw.durationMinutes === "number" ? raw.durationMinutes : DEFAULT_MEETING_MINUTES,
    timezone: raw.timezone,
    allDay: raw.allDay === true,
    date: dayKey(start, zone),
    time: timeKey(start, zone),
    location: (raw.location as Meeting["location"]) ?? null,
    conference: (raw.conference as Meeting["conference"]) ?? null,
    participants: Array.isArray(raw.participants) ? (raw.participants as Participant[]) : [],
    source: raw.source as MeetingSource,
    confidence: typeof raw.confidence === "number" ? raw.confidence : null,
    language: raw.language === "es" ? "es" : "en",
    preparationTips: Array.isArray(raw.preparationTips) ? (raw.preparationTips as string[]) : [],
    customAlertTimes: Array.isArray(raw.customAlertTimes) ? (raw.customAlertTimes as number[]) : null,
    alertIntensity: (raw.alertIntensity as Meeting["alertIntensity"]) ?? null,
    notes: nullable(raw.notes),
    status: raw.status === "cancelled" ? "cancelled" : "scheduled",
    external: { ...EMPTY_EXTERNAL, ...((raw.external as ExternalRefs) ?? {}) },
    recurrence,
    recurrenceOverrides: recurrence ? ((raw.recurrenceOverrides as Meeting["recurrenceOverrides"]) ?? null) : null,
    seriesId: nullable(raw.seriesId),
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    deletedAt: nullable(raw.deletedAt),
  };
}

/* ---------- Tasks ---------- */

/** A time needs a date, and a reminder needs a time. */
function normalizeDue(t: Pick<Task, "dueDate" | "dueTime" | "reminderMinutesBefore">) {
  const dueTime = t.dueDate === null ? null : t.dueTime;
  return { dueDate: t.dueDate, dueTime, reminderMinutesBefore: dueTime === null ? null : t.reminderMinutesBefore };
}

export function buildTask(input: TaskInput, ctx: { id: string; userId: string; now: string; timezone: string }): Task {
  return {
    id: ctx.id,
    userId: ctx.userId,
    title: input.title.trim(),
    description: input.description ?? "",
    timezone: input.timezone ?? ctx.timezone,
    ...normalizeDue({ dueDate: input.dueDate ?? null, dueTime: input.dueTime ?? null, reminderMinutesBefore: input.reminderMinutesBefore ?? null }),
    status: "open",
    meetingId: input.meetingId ?? null,
    people: input.people ?? [],
    completedAt: null,
    createdAt: ctx.now,
    updatedAt: ctx.now,
  };
}

export function applyTaskPatch(t: Task, patch: TaskPatch, now: string): Task {
  const status = patch.status ?? t.status;
  return {
    ...t,
    title: patch.title?.trim() ?? t.title,
    description: patch.description ?? t.description,
    timezone: patch.timezone ?? t.timezone,
    ...normalizeDue({
      dueDate: patch.dueDate !== undefined ? patch.dueDate : t.dueDate,
      dueTime: patch.dueTime !== undefined ? patch.dueTime : t.dueTime,
      reminderMinutesBefore: patch.reminderMinutesBefore !== undefined ? patch.reminderMinutesBefore : t.reminderMinutesBefore,
    }),
    status,
    meetingId: patch.meetingId !== undefined ? patch.meetingId : t.meetingId,
    people: patch.people ?? t.people,
    completedAt: status === "done" ? (t.status === "done" ? t.completedAt : now) : null,
    updatedAt: now,
  };
}

export function taskToDoc(t: Task): Raw {
  const out: Raw = { ...t };
  delete out.id;
  return out;
}

export function parseTask(id: string, raw: Raw): Task | null {
  if (!ID.test(id) || typeof raw.title !== "string" || !raw.title || !isIso(raw.createdAt) || !isIso(raw.updatedAt)) return null;
  const dueDate = typeof raw.dueDate === "string" && isDayKey(raw.dueDate) ? raw.dueDate : null;
  const dueTime = typeof raw.dueTime === "string" && isTimeKey(raw.dueTime) ? raw.dueTime : null;
  const status = raw.status === "done" ? "done" : "open";
  return {
    id,
    userId: str(raw.userId),
    title: raw.title,
    description: str(raw.description),
    timezone: str(raw.timezone, "UTC"),
    ...normalizeDue({ dueDate, dueTime, reminderMinutesBefore: typeof raw.reminderMinutesBefore === "number" ? raw.reminderMinutesBefore : null }),
    status,
    meetingId: nullable(raw.meetingId),
    people: Array.isArray(raw.people) ? (raw.people as Task["people"]) : [],
    completedAt: status === "done" ? (isIso(raw.completedAt) ? raw.completedAt : raw.updatedAt) : null,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

/* ---------- Plan and preferences ---------- */

export const FREE: Entitlement = { plan: "free", status: "active", expiresAt: null, source: "default", updatedAt: null };

/** A missing or unreadable record means Free. */
export function parseEntitlement(raw: Raw | null): Entitlement {
  if (!raw || !["free", "pro", "premium"].includes(raw.plan as string) || !["active", "grace_period", "expired", "revoked"].includes(raw.status as string)) return FREE;
  return { plan: raw.plan as Plan, status: raw.status as Entitlement["status"], expiresAt: nullable(raw.expiresAt), source: str(raw.source, "default"), updatedAt: nullable(raw.updatedAt) };
}

export const DEFAULT_PREFERENCES: Preferences = { alertIntensity: "max", defaultAlertTimes: [15, 5, 0], googleCalendarSyncEnabled: false, deviceCalendarImportIds: [], deviceCalendarExportId: null };

export function parsePreferences(raw: Raw | null): Preferences {
  if (!raw) return DEFAULT_PREFERENCES;
  return {
    alertIntensity: raw.alertIntensity === "medium" || raw.alertIntensity === "light" ? raw.alertIntensity : "max",
    defaultAlertTimes: Array.isArray(raw.defaultAlertTimes) ? normalizeAlertTimes(raw.defaultAlertTimes as number[]) : DEFAULT_PREFERENCES.defaultAlertTimes,
    googleCalendarSyncEnabled: raw.googleCalendarSyncEnabled === true,
    deviceCalendarImportIds: Array.isArray(raw.deviceCalendarImportIds) ? (raw.deviceCalendarImportIds as string[]) : [],
    deviceCalendarExportId: nullable(raw.deviceCalendarExportId),
  };
}
