"use client";

/*
 * The web agenda's data. Every read and write goes through this file.
 *
 * With a Firebase config (config.ts) it signs in to the app's accounts and
 * reads and writes the app's own records, live both ways. Without one, a
 * preview account is kept in this browser with sample data, through the same
 * functions, so the screens don't know the difference.
 *
 * Writes follow the app's data layer (src/services/data/engine.ts): whole
 * documents, the newest version wins, and deleted meetings stay as an empty
 * record so every device can sync the deletion.
 */

import { useSyncExternalStore } from "react";
import type { Lang } from "@/lib/routes";
import { LIVE } from "./config";
import type * as Remote from "./firebase";
import { applyMeetingPatch, applyTaskPatch, buildMeeting, buildTask, DEFAULT_PREFERENCES, FREE, meetingToDoc, nextTimestamp, parseEntitlement, parseMeeting, parsePreferences, parseTask, taskToDoc, tombstoneMeeting } from "./records";
import { reconcileAnchor, splitRecurrenceAt, withOverride } from "./recurrence";
import { addDays, dayKey, deviceZone, fromZoned, timeKey, weekStart } from "./time";
import type { LinkState } from "./conference";
import type { Calendar, Entitlement, InviteAnswer, Meeting, MeetingInput, MeetingPatch, Plan, Preferences, RecurrenceOverride, Task, TaskInput, TaskPatch, User } from "./types";

/** What the screens read: `ready` is false until the session and first records are known. */
export type AgendaState = {
  ready: boolean;
  /** The first records couldn't be loaded. */
  loadFailed: boolean;
  user: User | null;
  entitlement: Entitlement;
  /** Without deleted meetings. */
  meetings: Meeting[];
  tasks: Task[];
  prefs: Preferences;
  /** The zone chosen on this browser; "" follows this device. */
  zone: string;
  /** The server's Zoom links: null while unknown, or when this account can't use them. */
  zoom: boolean | null;
  /** Meetings whose Zoom link couldn't be created in this session. */
  zoomFailed: string[];
};

const ZONE_KEY = "mg-agenda-zone";
const DEMO_KEY = "mg-agenda-preview";
const DELETED_KEY = "mg-agenda-deleted";

const BLANK: Omit<AgendaState, "zone"> = { ready: false, loadFailed: false, user: null, entitlement: FREE, meetings: [], tasks: [], prefs: DEFAULT_PREFERENCES, zoom: null, zoomFailed: [] };
const SERVER: AgendaState = { ...BLANK, zone: "" };

let state: AgendaState = SERVER;
/** Every meeting, deleted ones included (writes need them; the screens don't). */
let allMeetings: Meeting[] = [];
let started = false;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function setState(next: Partial<AgendaState>) {
  state = { ...state, ...next };
  emit();
}

function setMeetings(all: Meeting[]) {
  allMeetings = all;
  setState({ meetings: all.filter((m) => m.deletedAt === null) });
}

function readZone() {
  try {
    return localStorage.getItem(ZONE_KEY) ?? "";
  } catch {
    return "";
  }
}

/* ---------- Session ---------- */

let remote: typeof Remote | null = null;
const loadRemote = async () => (remote ??= await import("./firebase"));

let stopListening: (() => void) | null = null;
let loaded = { meetings: false, tasks: false };

/** A version on this browser that is newer than the server's stays until the server catches up. */
function merged<T extends { id: string; updatedAt: string }>(local: T[], incoming: T[]) {
  const before = new Map(local.map((x) => [x.id, x]));
  return incoming.map((x) => {
    const mine = before.get(x.id);
    return mine && Date.parse(mine.updatedAt) > Date.parse(x.updatedAt) ? mine : x;
  });
}

function markLoaded(kind: keyof typeof loaded) {
  loaded[kind] = true;
  if (loaded.meetings && loaded.tasks && !state.ready) setState({ ready: true });
}

function startLive() {
  void loadRemote().then((r) => {
    r.onUser((user) => {
      stopListening?.();
      stopListening = null;
      loaded = { meetings: false, tasks: false };
      allMeetings = [];
      if (!user) {
        setState({ ...BLANK, ready: true });
        return;
      }
      setState({ ...BLANK, user });
      void r.ensureProfile(user, new Date().toISOString()).catch(() => {});
      // as in the app, an account that isn't verified only pastes Zoom links
      if (user.verified) {
        void r.zoomStatus().then(
          (zoom) => state.user?.uid === user.uid && setState({ zoom }),
          () => {},
        );
      }
      stopListening = r.listen(user.uid, {
        meetings: (docs) => {
          const parsed = docs.flatMap((d) => parseMeeting(d.id, d.data) ?? []);
          setMeetings(merged(allMeetings, parsed));
          markLoaded("meetings");
        },
        tasks: (docs) => {
          const parsed = docs.flatMap((d) => parseTask(d.id, d.data) ?? []);
          setState({ tasks: merged(state.tasks, parsed) });
          markLoaded("tasks");
        },
        entitlement: (data) => setState({ entitlement: parseEntitlement(data) }),
        preferences: (data) => setState({ prefs: parsePreferences(data) }),
        error: () => setState({ ready: true, loadFailed: true }),
      });
    });
  });
}

function start() {
  if (started) return;
  started = true;
  state = { ...state, zone: readZone() };
  if (LIVE) startLive();
  else startDemo();
}

function subscribe(listener: () => void) {
  start();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const read = () => state;

/** The signed-in user's agenda, live. */
export function useAgenda(): AgendaState {
  return useSyncExternalStore(subscribe, read, () => SERVER);
}

/** The zone the agenda is shown in. */
export const displayZone = (s: Pick<AgendaState, "zone">) => s.zone || deviceZone();

/** Shows times in another zone on this browser only; the app keeps its own. */
export function setDisplayZone(zone: string) {
  try {
    if (zone) localStorage.setItem(ZONE_KEY, zone);
    else localStorage.removeItem(ZONE_KEY);
  } catch {}
  setState({ zone });
}

/** Which calendar a meeting shows under. */
export function calendarOf(m: Pick<Meeting, "source">): Calendar {
  return m.source === "google" || m.source === "outlook" || m.source === "device" ? m.source : "meetingguard";
}

/** The meeting's join link, if it has one. */
export function joinUrl(m: Pick<Meeting, "conference" | "location">) {
  const url = m.conference?.url ?? m.location?.virtualUrl ?? null;
  return url && /^https?:\/\//i.test(url) ? url : null;
}

/** What creates video-call links for this account (see conference.ts). */
export const linkState = (s: Pick<AgendaState, "prefs" | "meetings" | "zoom">): LinkState => ({
  google: s.prefs.googleCalendarSyncEnabled,
  outlook: s.meetings.some((m) => m.source === "outlook" || !!m.external.outlookEventId),
  zoom: s.zoom,
});

/** The meeting also lives in another calendar. */
export function isLinkedElsewhere(m: Pick<Meeting, "source" | "external">) {
  return calendarOf(m) !== "meetingguard" || !!m.external.googleEventId || !!m.external.outlookEventId;
}

/* ---------- Sign in ---------- */

export type AuthCode = "wrongPassword" | "network" | "tooMany" | "popupBlocked" | "otherMethod" | "disabled" | "unavailable" | "generic";

/** A sign-in that failed, with the reason the screen turns into words; "cancelled" shows nothing. */
export class AuthError extends Error {
  constructor(public code: AuthCode | "cancelled") {
    super(code);
  }
}

function toAuthError(err: unknown): AuthError {
  const code = (err as { code?: string })?.code ?? "";
  if (["auth/invalid-credential", "auth/wrong-password", "auth/user-not-found", "auth/invalid-email", "auth/missing-password"].includes(code)) return new AuthError("wrongPassword");
  if (["auth/popup-closed-by-user", "auth/cancelled-popup-request", "auth/user-cancelled"].includes(code)) return new AuthError("cancelled");
  if (code === "auth/network-request-failed") return new AuthError("network");
  if (code === "auth/too-many-requests") return new AuthError("tooMany");
  if (code === "auth/popup-blocked") return new AuthError("popupBlocked");
  if (code === "auth/account-exists-with-different-credential") return new AuthError("otherMethod");
  if (code === "auth/user-disabled") return new AuthError("disabled");
  if (["auth/operation-not-allowed", "auth/unauthorized-domain", "auth/configuration-not-found"].includes(code)) return new AuthError("unavailable");
  return new AuthError("generic");
}

const signedIn = async (run: () => Promise<void>) => {
  try {
    await run();
  } catch (err) {
    throw toAuthError(err);
  }
};

export async function signInWithGoogle(lang: Lang) {
  if (!LIVE) return demoSignIn({ uid: "preview-google", name: "Alex Morgan", email: "alex.morgan@gmail.com", providers: ["google.com"] }, lang);
  const r = await loadRemote();
  await signedIn(r.signInGoogle);
}

export async function signInWithApple(lang: Lang) {
  if (!LIVE) return demoSignIn({ uid: "preview-apple", name: "Alex Morgan", email: "alex.morgan@icloud.com", providers: ["apple.com"] }, lang);
  const r = await loadRemote();
  await signedIn(r.signInApple);
}

export async function signInWithPassword(email: string, password: string, lang: Lang) {
  if (!LIVE) {
    if (password.length < 6) throw new AuthError("wrongPassword");
    const name = email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return demoSignIn({ uid: "preview-password", name, email, providers: ["password"] }, lang);
  }
  const r = await loadRemote();
  await signedIn(() => r.signInPassword(email, password));
}

/** Says the same whether or not the address has an account, so it can't be used to find accounts. */
export async function sendPasswordReset(email: string) {
  if (!LIVE) return;
  const r = await loadRemote();
  try {
    await r.sendReset(email);
  } catch (err) {
    const e = toAuthError(err);
    if (e.code !== "wrongPassword") throw e;
  }
}

/** True once, right after the account was deleted (the sign-in page says so). */
export function takeDeletedNotice() {
  try {
    const deleted = sessionStorage.getItem(DELETED_KEY) === "1";
    sessionStorage.removeItem(DELETED_KEY);
    return deleted;
  } catch {
    return false;
  }
}

/** Nothing stays on this device after signing out. */
export async function signOut() {
  if (!LIVE) return setDemo({ user: null });
  const r = await loadRemote();
  await r.signOut();
}

/**
 * Deletes the account and everything in it through the app's own server
 * function, which requires a recent sign-in: Google and Apple accounts confirm
 * in a window, email accounts with their password.
 */
export async function deleteAccount(password?: string) {
  if (LIVE) {
    const r = await loadRemote();
    try {
      await r.reauthenticate(password);
    } catch (err) {
      throw toAuthError(err);
    }
    await r.deleteAccount();
  } else {
    try {
      localStorage.removeItem(DEMO_KEY);
    } catch {}
    allMeetings = [];
    setState({ ...BLANK, ready: true });
  }
  try {
    sessionStorage.setItem(DELETED_KEY, "1");
  } catch {}
}

/* ---------- Writing ---------- */

type Change = { meetings?: Meeting[]; tasks?: Task[]; creates?: string[]; removeTasks?: Task[] };

const stamp = (previous?: string | null) => nextTimestamp(Date.now(), previous);

const requireUid = () => {
  if (!state.user) throw new Error("Nobody is signed in");
  return state.user.uid;
};

/** Saves records together, then shows them right away (the live listener confirms them). */
async function save(change: Change) {
  const uid = requireUid();
  const creates = new Set(change.creates ?? []);
  if (LIVE) {
    const r = await loadRemote();
    await r.commit([
      ...(change.meetings ?? []).map((m) => ({ path: `users/${uid}/meetings/${m.id}`, mode: creates.has(m.id) ? ("create" as const) : ("set" as const), data: meetingToDoc(m), updatedAt: m.updatedAt })),
      ...(change.tasks ?? []).map((t) => ({ path: `users/${uid}/tasks/${t.id}`, mode: creates.has(t.id) ? ("create" as const) : ("set" as const), data: taskToDoc(t), updatedAt: t.updatedAt })),
      ...(change.removeTasks ?? []).map((t) => ({ path: `users/${uid}/tasks/${t.id}`, mode: "delete" as const, data: null, updatedAt: stamp(t.updatedAt) })),
    ]);
  } else {
    await new Promise((done) => setTimeout(done, 150));
  }
  const meetings = new Map(allMeetings.map((m) => [m.id, m]));
  for (const m of change.meetings ?? []) meetings.set(m.id, m);
  const tasks = new Map(state.tasks.map((t) => [t.id, t]));
  for (const t of change.tasks ?? []) tasks.set(t.id, t);
  for (const t of change.removeTasks ?? []) tasks.delete(t.id);
  allMeetings = [...meetings.values()];
  setState({ meetings: allMeetings.filter((m) => m.deletedAt === null), tasks: [...tasks.values()] });
  if (!LIVE) persistDemo();
}

const newId = (kind: "meetings" | "tasks") => {
  if (remote && LIVE) return remote.newDocId(requireUid(), kind);
  const c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(crypto.getRandomValues(new Uint8Array(20)), (b) => c[b % c.length]).join("");
};

function requireMeeting(id: string) {
  const m = allMeetings.find((x) => x.id === id);
  if (!m || m.deletedAt !== null) throw new Error("Meeting not found");
  return m;
}

/** A series whose date moved keeps its weekday or day of the month with it; a start past its end isn't allowed. */
function reconcileSeries(before: Meeting, after: Meeting, patch: MeetingPatch) {
  let result = after;
  if (result.recurrence && patch.recurrence === undefined && result.date !== before.date) {
    const rule = reconcileAnchor(result.recurrence, before.date, result.date);
    if (rule !== result.recurrence) result = applyMeetingPatch(result, { recurrence: rule }, result.updatedAt);
  }
  if (result.recurrence?.until && Date.parse(result.startAt) > Date.parse(result.recurrence.until)) throw new SeriesEndError();
  return result;
}

/** The new start is after the end of the series. */
export class SeriesEndError extends Error {}

/* ---------- Zoom links ---------- */

const zoomCalls = new Map<string, Promise<void>>();

function setZoomFailed(id: string, failed: boolean) {
  const others = state.zoomFailed.filter((x) => x !== id);
  setState({ zoomFailed: failed ? [...others, id] : others });
}

/**
 * Asks the app's server to create the Zoom meeting of a saved meeting. The
 * server writes the link into the meeting, so it arrives like any other change.
 */
export function createZoomLink(id: string) {
  const running = zoomCalls.get(id);
  if (running) return running;
  const call = loadRemote()
    .then((r) => r.zoomCreate(id))
    .then(
      () => setZoomFailed(id, false),
      (err: unknown) => {
        setZoomFailed(id, true);
        throw err;
      },
    )
    .finally(() => zoomCalls.delete(id));
  zoomCalls.set(id, call);
  return call;
}

/** A Zoom meeting saved without a link gets one from the server, as in the app. */
function afterZoomSave(saved: Meeting, patch?: MeetingPatch) {
  if (!LIVE || saved.conference?.provider !== "zoom") return;
  if (saved.conference.url === null && state.zoom === true) void createZoomLink(saved.id).catch(() => {});
  // the Zoom meeting follows its title, time and length
  const zoomId = saved.external.zoomMeetingId;
  if (zoomId && patch && (patch.title !== undefined || patch.startAt !== undefined || patch.durationMinutes !== undefined || patch.timezone !== undefined)) {
    void loadRemote()
      .then((r) => r.zoomSync(saved.id))
      .catch(() => {});
  }
}

/* ---------- Meetings ---------- */

export async function createMeeting(input: MeetingInput, lang: Lang) {
  const meeting = buildMeeting(input, { id: newId("meetings"), userId: requireUid(), now: stamp(), timezone: deviceZone(), language: lang });
  await save({ meetings: [meeting], creates: [meeting.id] });
  afterZoomSave(meeting);
  return meeting;
}

/** Changes a meeting or a whole series, and any linked tasks moved with it. */
export async function updateMeeting(id: string, patch: MeetingPatch, linkedTasks: Task[] = []) {
  const current = requireMeeting(id);
  const next = reconcileSeries(current, applyMeetingPatch(current, patch, stamp(current.updatedAt)), patch);
  await save({ meetings: [next], tasks: linkedTasks });
  afterZoomSave(next, patch);
}

/** Deletes a meeting or a whole series. Linked tasks stay, as in the app. */
export async function removeMeeting(id: string) {
  const current = requireMeeting(id);
  await save({ meetings: [tombstoneMeeting(current, stamp(current.updatedAt))] });
  // its Zoom meeting goes too
  const zoomId = current.external.zoomMeetingId;
  if (LIVE && zoomId) {
    void loadRemote()
      .then((r) => r.zoomDelete(zoomId))
      .catch(() => {});
  }
}

async function writeOverride(id: string, key: string, compute: (m: Meeting) => RecurrenceOverride, linkedTasks: Task[] = []) {
  const current = requireMeeting(id);
  const overrides = withOverride(current.recurrenceOverrides, key, compute(current));
  await save({ meetings: [applyMeetingPatch(current, { recurrenceOverrides: overrides }, stamp(current.updatedAt))], tasks: linkedTasks });
}

/** Changes one date of a series. */
export function updateOccurrence(id: string, key: string, patch: { startAt?: string; durationMinutes?: number; title?: string }, linkedTasks: Task[] = []) {
  return writeOverride(
    id,
    key,
    (m) => {
      const existing = m.recurrenceOverrides?.[key];
      const base = existing?.status === "modified" ? existing : null;
      return { status: "modified", startAt: patch.startAt ?? base?.startAt ?? null, durationMinutes: patch.durationMinutes ?? base?.durationMinutes ?? null, title: patch.title ?? base?.title ?? null };
    },
    linkedTasks,
  );
}

/** Removes one date of a series. */
export const cancelOccurrence = (id: string, key: string) => writeOverride(id, key, () => ({ status: "cancelled", startAt: null, durationMinutes: null, title: null }));

/**
 * "This and following": the series ends before this date, and a new series
 * with the change starts on it. External links stay with the old series, so
 * the new one is added to synced calendars as a new event. Both are saved
 * together. From the first date, it is the whole series.
 */
export async function editFollowing(id: string, key: string, patch: MeetingPatch, linkedTasks: Task[] = []) {
  const current = requireMeeting(id);
  const split = splitRecurrenceAt(current, key);
  if (!split) throw new Error("Not a date of this series");
  if (split === "series_edit") return updateMeeting(id, patch, linkedTasks);
  const master = applyMeetingPatch(current, { recurrence: split.masterRule, recurrenceOverrides: split.masterOverrides }, stamp(current.updatedAt));
  const serverZoomLink = current.conference?.provider === "zoom" && !!current.external.zoomMeetingId;
  const now = stamp();
  const built = buildMeeting(
    {
      title: current.title,
      startAt: split.tailStartAt,
      source: current.source === "google" ? "manual" : current.source,
      description: current.description,
      durationMinutes: current.durationMinutes,
      timezone: current.timezone,
      allDay: current.allDay,
      location: current.location,
      conference: current.conference && serverZoomLink ? { ...current.conference, url: null, password: null } : current.conference,
      participants: current.participants,
      confidence: current.confidence,
      language: current.language,
      preparationTips: current.preparationTips,
      customAlertTimes: current.customAlertTimes,
      alertIntensity: current.alertIntensity,
      notes: current.notes,
      status: current.status,
      recurrence: split.tailRule,
      recurrenceOverrides: split.tailOverrides,
    },
    { id: newId("meetings"), userId: current.userId, now, timezone: current.timezone, language: current.language },
  );
  const tail = Object.keys(patch).length ? reconcileSeries(built, applyMeetingPatch(built, patch, now), patch) : built;
  await save({ meetings: [master, tail], creates: [tail.id], tasks: linkedTasks });
  afterZoomSave(tail);
}

/** Removes this date and every later one. From the first date, it is the whole series. */
export async function deleteFollowing(id: string, key: string) {
  const current = requireMeeting(id);
  const split = splitRecurrenceAt(current, key);
  if (!split) throw new Error("Not a date of this series");
  if (split === "series_edit") return removeMeeting(id);
  await save({ meetings: [applyMeetingPatch(current, { recurrence: split.masterRule, recurrenceOverrides: split.masterOverrides }, stamp(current.updatedAt))] });
}

/* ---------- Tasks ---------- */

export async function createTask(input: TaskInput) {
  const task = buildTask(input, { id: newId("tasks"), userId: requireUid(), now: stamp(), timezone: deviceZone() });
  await save({ tasks: [task], creates: [task.id] });
  return task;
}

function requireTask(id: string) {
  const t = state.tasks.find((x) => x.id === id);
  if (!t) throw new Error("Task not found");
  return t;
}

export async function updateTask(id: string, patch: TaskPatch) {
  const current = requireTask(id);
  await save({ tasks: [applyTaskPatch(current, patch, stamp(current.updatedAt))] });
}

export const setTaskDone = (id: string, done: boolean) => updateTask(id, { status: done ? "done" : "open" });

/** A linked task moved by the same amount as its meeting (not saved yet). */
export function shiftedTask(t: Task, ms: number, days: number): Task {
  const now = stamp(t.updatedAt);
  if (!t.dueDate) return t;
  if (!t.dueTime) return applyTaskPatch(t, { dueDate: addDays(t.dueDate, days) }, now);
  const due = new Date(fromZoned(t.dueDate, t.dueTime, t.timezone).getTime() + ms);
  return applyTaskPatch(t, { dueDate: dayKey(due, t.timezone), dueTime: timeKey(due, t.timezone) }, now);
}

export async function deleteTask(id: string) {
  await save({ removeTasks: [requireTask(id)] });
}

/** Undo for a deleted task: the same task, back. */
export async function restoreTask(t: Task) {
  await save({ tasks: [{ ...t, updatedAt: stamp(t.updatedAt) }], creates: [t.id] });
}

/* ---------- Guest invitations (Dusko's M15 links open here) ---------- */

export type Invite = {
  token: string;
  organizer: string;
  title: string;
  start: string;
  end: string;
  timeZone: string;
  location: string;
  videoUrl: string;
  /** The guest's earlier answer, if any. */
  answer: InviteAnswer | null;
};

const INVITE_KEY = "mg-invite-demo";

/**
 * The invitation behind a link, or null when the link is unknown or expired.
 * TODO(M15): read the invitation through the guest-link function; until it
 * exists a live site treats every link as unknown, and the preview shows a sample.
 */
export async function getInvite(token: string, lang: Lang): Promise<Invite | null | "expired"> {
  await new Promise((done) => setTimeout(done, 400));
  if (!token || LIVE) return null;
  if (token === "expired") return "expired";
  const zone = deviceZone();
  const day = addDays(dayKey(new Date(), zone), 2);
  const start = fromZoned(day, "10:00", zone);
  let answer: InviteAnswer | null = null;
  try {
    answer = JSON.parse(localStorage.getItem(`${INVITE_KEY}:${token}`) ?? "null");
  } catch {}
  return {
    token,
    organizer: "Alex Morgan",
    title: lang === "es" ? "Revisión del plan del cuarto trimestre" : "Q4 plan review",
    start: start.toISOString(),
    end: new Date(start.getTime() + 45 * 60_000).toISOString(),
    timeZone: zone,
    location: "",
    videoUrl: "https://meet.google.com/abc-defg-hij",
    answer,
  };
}

/** TODO(M15): send the answer through the guest-link function; the organizer is notified in the app. */
export async function answerInvite(token: string, answer: InviteAnswer) {
  await new Promise((done) => setTimeout(done, 600));
  localStorage.setItem(`${INVITE_KEY}:${token}`, JSON.stringify(answer));
}

/* ---------- The preview (a build without a Firebase config) ---------- */

type DemoData = { user: User | null; entitlement: Entitlement; meetings: Meeting[]; tasks: Task[] };

function persistDemo() {
  try {
    const data: DemoData = { user: state.user, entitlement: state.entitlement, meetings: allMeetings, tasks: state.tasks };
    localStorage.setItem(DEMO_KEY, JSON.stringify(data));
  } catch {}
}

function loadDemo(): DemoData | null {
  try {
    const raw = localStorage.getItem(DEMO_KEY);
    return raw ? (JSON.parse(raw) as DemoData) : null;
  } catch {
    return null;
  }
}

function setDemo(data: Partial<DemoData>) {
  if (data.meetings) allMeetings = data.meetings;
  setState({ ...data, meetings: allMeetings.filter((m) => m.deletedAt === null) });
  persistDemo();
}

function startDemo() {
  const data = loadDemo();
  if (data) allMeetings = data.meetings;
  state = { ...state, ready: true, user: data?.user ?? null, entitlement: data?.entitlement ?? FREE, tasks: data?.tasks ?? [], meetings: allMeetings.filter((m) => m.deletedAt === null) };
  window.addEventListener("storage", (e) => {
    if (e.key !== DEMO_KEY) return;
    const next = loadDemo();
    if (next) setDemo(next);
  });
}

function demoSignIn(user: User, lang: Lang) {
  // the preview account keeps its records between visits; a new one gets the sample agenda
  const data = loadDemo();
  if (data && data.meetings.length && data.meetings[0].userId === user.uid) setDemo({ ...data, user });
  else setDemo({ ...sample(user.uid, lang, Date.now()), user, entitlement: FREE });
}

/** Preview only: try the agenda on each plan. On the live site the plan comes from the store purchase. */
export function setDemoPlan(plan: Plan) {
  setDemo({ entitlement: plan === "free" ? FREE : { plan, status: "active", expiresAt: new Date(Date.now() + 24 * 86_400_000).toISOString(), source: "revenuecat", updatedAt: new Date().toISOString() } });
}

/** Preview only: put the sample agenda back. */
export function resetDemo(lang: Lang) {
  if (state.user) setDemo(sample(state.user.uid, lang, Date.now()));
}

const SAMPLE = {
  en: {
    investor: "Investor call",
    lunch: "Lunch with Ana",
    cafe: "Cafe Central",
    design: "Design review with Marketing",
    standup: "Team standup",
    client: "Client sync with Northwind",
    dentist: "Dentist",
    dentistPlace: "Calle Mayor 12",
    oneOnOne: "1:1 with Carlos",
    offsite: "Planning day",
    deck: "Send the deck to Ana",
    deckNotes: "The version with the Q3 numbers.",
    flights: "Book flights to Madrid",
    q4: "Review the Q4 plan",
    carlos: "Reply to Carlos about the budget",
    invoice: "Pay the design studio invoice",
    agenda: "Prepare the standup agenda",
  },
  es: {
    investor: "Llamada con inversores",
    lunch: "Comida con Ana",
    cafe: "Café Central",
    design: "Revisión de diseño con Marketing",
    standup: "Reunión diaria del equipo",
    client: "Seguimiento con Northwind",
    dentist: "Dentista",
    dentistPlace: "Calle Mayor 12",
    oneOnOne: "Uno a uno con Carlos",
    offsite: "Día de planificación",
    deck: "Enviar la presentación a Ana",
    deckNotes: "La versión con las cifras del tercer trimestre.",
    flights: "Reservar vuelos a Madrid",
    q4: "Revisar el plan del cuarto trimestre",
    carlos: "Responder a Carlos sobre el presupuesto",
    invoice: "Pagar la factura del estudio de diseño",
    agenda: "Preparar el orden del día",
  },
};

/** Sample meetings and tasks around today, in the visitor's language. */
function sample(uid: string, lang: Lang, nowMs: number): Pick<DemoData, "meetings" | "tasks"> {
  const s = SAMPLE[lang];
  const zone = deviceZone();
  const now = new Date(nowMs).toISOString();
  const today = dayKey(new Date(nowMs), zone);
  const monday = weekStart(today);
  const at = (day: string, time: string) => fromZoned(day, time, zone).toISOString();
  const video = (provider: "zoom" | "teams" | "google_meet", url: string, password: string | null = null) => ({ provider, url, password });
  const place = (address: string) => ({ type: "physical" as const, address, virtualUrl: null });
  const ana = { email: "ana.garcia@northwind.co", name: "Ana García", status: null };
  const meeting = (id: string, input: MeetingInput, external: Meeting["external"] = {}) => {
    const m = buildMeeting(input, { id, userId: uid, now, timezone: zone, language: lang });
    return { ...m, external: { ...m.external, ...external } };
  };
  const google = (id: string) => ({ googleEventId: id });
  const meetings: Meeting[] = [
    meeting("m-investor", { title: s.investor, startAt: at(today, "10:00"), durationMinutes: 45, conference: video("zoom", "https://us05web.zoom.us/j/84629371054", "PG9j5u"), participants: [ana], source: "ai_chat" }),
    meeting("m-lunch", { title: s.lunch, startAt: at(today, "12:30"), location: place(s.cafe), participants: [ana], source: "whatsapp" }),
    meeting("m-design", { title: s.design, startAt: at(today, "16:00"), conference: video("google_meet", "https://meet.google.com/xvd-pqra-kmt"), source: "google" }, google("design")),
    meeting(
      "m-standup",
      {
        title: s.standup,
        startAt: at(monday, "09:00"),
        durationMinutes: 15,
        conference: video("google_meet", "https://meet.google.com/qwe-rtyu-iop"),
        source: "google",
        recurrence: { freq: "weekly", interval: 1, byWeekday: ["MO", "TU", "WE", "TH", "FR"], byMonthDay: null, until: null, count: null },
        recurrenceOverrides: { [addDays(monday, 2)]: { status: "cancelled", startAt: null, durationMinutes: null, title: null } },
      },
      google("standup"),
    ),
    meeting("m-client", { title: s.client, startAt: at(addDays(today, 1), "11:00"), durationMinutes: 30, conference: video("teams", "https://teams.microsoft.com/l/meetup-join/preview"), participants: [{ email: "liam.chen@northwind.co", name: "Liam Chen", status: null }], source: "manual" }),
    meeting("m-1on1", { title: s.oneOnOne, startAt: at(addDays(monday, 3), "15:00"), durationMinutes: 30, participants: [{ email: "carlos.ruiz@meetingguard.ai", name: "Carlos Ruiz", status: null }], source: "ai_chat", recurrence: { freq: "weekly", interval: 1, byWeekday: ["TH"], byMonthDay: null, until: null, count: null } }),
    meeting("m-dentist", { title: s.dentist, startAt: at(addDays(today, 3), "18:00"), durationMinutes: 45, location: place(s.dentistPlace), customAlertTimes: [60, 15], alertIntensity: "medium", source: "manual" }),
    meeting("m-offsite", { title: s.offsite, startAt: at(addDays(today, 8), "00:00"), durationMinutes: 1440, allDay: true, source: "google" }, google("offsite")),
  ];
  const task = (id: string, input: TaskInput) => buildTask(input, { id, userId: uid, now, timezone: zone });
  const invoice = task("t-invoice", { title: s.invoice, dueDate: addDays(today, -2) });
  const tasks: Task[] = [
    task("t-deck", { title: s.deck, description: s.deckNotes, dueDate: today, dueTime: "09:30", reminderMinutesBefore: 15, meetingId: "m-investor" }),
    task("t-carlos", { title: s.carlos, dueDate: addDays(today, -1), dueTime: "17:00", reminderMinutesBefore: 0 }),
    task("t-flights", { title: s.flights, dueDate: addDays(today, 2) }),
    task("t-q4", { title: s.q4, dueDate: addDays(today, 6), dueTime: "12:00", reminderMinutesBefore: 60, meetingId: "m-design" }),
    task("t-agenda", { title: s.agenda }),
    { ...invoice, status: "done", completedAt: new Date(nowMs - 86_400_000).toISOString() },
  ];
  return { meetings, tasks };
}
