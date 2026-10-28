"use client";

/*
 * The web agenda's data, front end only for now.
 *
 * Every read and write goes through the functions in this file. Today they
 * keep a demo account in this browser (localStorage), filled with sample
 * meetings and tasks, and other tabs of the same browser follow each change
 * at once. When the backend is connected, these same functions call Firebase
 * Authentication (the app's sign-in methods) and Firestore (the app's
 * records, under the same server rules), and the screens stay as they are.
 */

import { useSyncExternalStore } from "react";
import type { Lang } from "@/lib/routes";
import { addDays, dayKey, deviceZone, fromZoned, weekStart } from "./time";
import type { AgendaData, Entitlement, InviteAnswer, Meeting, Plan, Prefs, Task, User } from "./types";

const KEY = "mg-agenda-demo";

const DEFAULT_PREFS: Prefs = { timeZone: "", defaultReminders: [15, 5, 0], defaultIntensity: "maximum" };
const FREE: Entitlement = { plan: "free", trialEndsAt: 0, store: null, renewsAt: 0 };

const EMPTY: AgendaData = {
  user: null,
  entitlement: FREE,
  meetings: [],
  tasks: [],
  connections: { google: false, outlook: false, microsoftToDo: false, googleTasks: false },
  prefs: DEFAULT_PREFS,
};

/** What the screens read: `ready` is false until this browser's data is loaded. */
export type AgendaState = AgendaData & { ready: boolean };

const SERVER: AgendaState = { ...EMPTY, ready: false };
let state: AgendaState | null = null;
const listeners = new Set<() => void>();

function load(): AgendaState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...EMPTY, ...(JSON.parse(raw) as AgendaData), ready: true };
  } catch {}
  return { ...EMPTY, ready: true };
}

function read(): AgendaState {
  if (!state) state = load();
  return state;
}

function emit() {
  for (const l of listeners) l();
}

const toData = ({ user, entitlement, meetings, tasks, connections, prefs }: AgendaData): AgendaData => ({ user, entitlement, meetings, tasks, connections, prefs });

/** Saves a change. Throws when the browser refuses to store it (shown as an error). */
function commit(next: AgendaData) {
  const data = toData(next);
  localStorage.setItem(KEY, JSON.stringify(data));
  state = { ...data, ready: true };
  emit();
}

function onStorage(e: StorageEvent) {
  if (e.key !== KEY) return;
  state = load();
  emit();
}

function subscribe(listener: () => void) {
  if (listeners.size === 0) window.addEventListener("storage", onStorage);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

/** The signed-in user's agenda, live. */
export function useAgenda(): AgendaState {
  return useSyncExternalStore(subscribe, read, () => SERVER);
}

/** The zone the agenda is shown in. */
export const displayZone = (prefs: Prefs) => prefs.timeZone || deviceZone();

/* ---------- A small delay, so the screens show their saving states as they will with the network ---------- */

const wait = (ms = 250) => new Promise((r) => setTimeout(r, ms));

const newId = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`);

/* ---------- Sign in ---------- */

export class AuthError extends Error {
  constructor(public code: "wrongPassword" | "noAccount" | "network" | "tooMany") {
    super(code);
  }
}

function startSession(user: User, lang: Lang) {
  const data = read();
  // the demo account keeps its records between visits; a new one gets the sample agenda
  if (data.user?.email === user.email) {
    commit({ ...data, user });
  } else {
    commit({ ...EMPTY, ...sample(lang, Date.now()), user });
  }
}

/** "Continue with Google". TODO(backend): signInWithPopup(GoogleAuthProvider). */
export async function signInWithGoogle(lang: Lang) {
  await wait(600);
  startSession({ uid: "demo-google", name: "Alex Morgan", email: "alex.morgan@gmail.com", provider: "google" }, lang);
}

/** Email and password. TODO(backend): signInWithEmailAndPassword. */
export async function signInWithPassword(email: string, password: string, lang: Lang) {
  await wait(600);
  if (password.length < 6) throw new AuthError("wrongPassword");
  const local = email.split("@")[0].replace(/[._-]+/g, " ");
  const name = local.replace(/\b\w/g, (c) => c.toUpperCase());
  startSession({ uid: `demo-${email}`, name, email, provider: "password" }, lang);
}

/** TODO(backend): sendPasswordResetEmail. */
export async function sendPasswordReset(email: string) {
  await wait(500);
  void email;
}

const DELETED_KEY = "mg-agenda-deleted";

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

/** Signing out keeps nothing on this device (the app does the same). */
export async function signOut() {
  await wait(200);
  commit({ ...read(), user: null });
}

/**
 * Deletes the account and everything in it, the same deletion the app does.
 * TODO(backend): the account-deletion function (also removes store-independent data).
 */
export async function deleteAccount() {
  await wait(900);
  localStorage.removeItem(KEY);
  try {
    sessionStorage.setItem(DELETED_KEY, "1");
  } catch {}
  state = { ...EMPTY, ready: true };
  emit();
}

/* ---------- Meetings ---------- */

export async function saveMeeting(m: Meeting) {
  await wait();
  const data = read();
  const saved = { ...m, updatedAt: Date.now() };
  const exists = data.meetings.some((x) => x.id === m.id);
  commit({ ...data, meetings: exists ? data.meetings.map((x) => (x.id === m.id ? saved : x)) : [...data.meetings, saved] });
  return saved;
}

export const newMeetingId = newId;

/** Cancels a meeting (or a whole series); linked tasks stay, unlinked. */
export async function cancelMeeting(id: string) {
  await wait();
  const data = read();
  commit({
    ...data,
    meetings: data.meetings.filter((m) => m.id !== id),
    tasks: data.tasks.map((t) => (t.meetingId === id ? { ...t, meetingId: "", updatedAt: Date.now() } : t)),
  });
}

/* ---------- Tasks ---------- */

export const newTaskId = newId;

export async function saveTask(t: Task) {
  await wait();
  const data = read();
  const saved = { ...t, updatedAt: Date.now() };
  const exists = data.tasks.some((x) => x.id === t.id);
  commit({ ...data, tasks: exists ? data.tasks.map((x) => (x.id === t.id ? saved : x)) : [saved, ...data.tasks] });
  return saved;
}

/** Saves several tasks at once (moving linked tasks with their meeting). */
export async function saveTasks(tasks: Task[]) {
  await wait();
  const data = read();
  const byId = new Map(tasks.map((t) => [t.id, { ...t, updatedAt: Date.now() }]));
  commit({ ...data, tasks: data.tasks.map((t) => byId.get(t.id) ?? t) });
}

export async function setTaskDone(id: string, done: boolean) {
  await wait(120);
  const data = read();
  commit({ ...data, tasks: data.tasks.map((t) => (t.id === id ? { ...t, done, doneAt: done ? Date.now() : 0, updatedAt: Date.now() } : t)) });
}

export async function deleteTask(id: string) {
  await wait();
  const data = read();
  commit({ ...data, tasks: data.tasks.filter((t) => t.id !== id) });
}

/* ---------- Settings ---------- */

export async function savePrefs(prefs: Partial<Prefs>) {
  const data = read();
  commit({ ...data, prefs: { ...data.prefs, ...prefs } });
}

/** Demo only: try the agenda on each plan. On the live site the plan comes from the store purchase. */
export function setDemoPlan(plan: Plan, trial: boolean) {
  const data = read();
  const now = Date.now();
  const entitlement: Entitlement =
    plan === "free" ? FREE : { plan, trialEndsAt: trial ? now + 2 * 86_400_000 : 0, store: "google_play", renewsAt: now + (trial ? 2 : 24) * 86_400_000 };
  commit({ ...data, entitlement });
}

/** Demo only: put the sample agenda back. */
export function resetDemo(lang: Lang) {
  const data = read();
  commit({ ...EMPTY, ...sample(lang, Date.now()), user: data.user, prefs: data.prefs });
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
 * TODO(backend): read the invitation through the guest-link function (M15).
 */
export async function getInvite(token: string, lang: Lang): Promise<Invite | null | "expired"> {
  await wait(400);
  if (!token) return null;
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

/** TODO(backend): send the answer through the guest-link function; the organizer is notified in the app. */
export async function answerInvite(token: string, answer: InviteAnswer) {
  await wait(600);
  localStorage.setItem(`${INVITE_KEY}:${token}`, JSON.stringify(answer));
}

/* ---------- The sample agenda ---------- */

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
function sample(lang: Lang, now: number): Partial<AgendaData> {
  const s = SAMPLE[lang];
  const zone = deviceZone();
  const today = dayKey(new Date(now), zone);
  const monday = weekStart(today);
  const at = (day: string, time: string) => fromZoned(day, time, zone).toISOString();
  const base = { allDay: false, timeZone: zone, location: "", videoUrl: "", passcode: "", participants: [], notes: "", reminders: [15, 5, 0], intensity: "maximum" as const, repeat: "none" as const, repeatUntil: "", exceptions: {}, updatedAt: now };
  const ana = { name: "Ana García", email: "ana.garcia@northwind.co" };

  const meetings: Meeting[] = [
    { ...base, id: "m-investor", title: s.investor, start: at(today, "10:00"), end: at(today, "10:45"), videoUrl: "https://us05web.zoom.us/j/84629371054", passcode: "PG9j5u", participants: [ana], source: "meetingguard", origin: "assistant" },
    { ...base, id: "m-lunch", title: s.lunch, start: at(today, "12:30"), end: at(today, "13:30"), location: s.cafe, participants: [ana], source: "meetingguard", origin: "whatsapp" },
    { ...base, id: "m-design", title: s.design, start: at(today, "16:00"), end: at(today, "17:00"), videoUrl: "https://meet.google.com/xvd-pqra-kmt", source: "google", origin: "sync" },
    { ...base, id: "m-standup", title: s.standup, start: at(monday, "09:00"), end: at(monday, "09:15"), videoUrl: "https://meet.google.com/qwe-rtyu-iop", source: "google", origin: "sync", repeat: "weekdays", exceptions: { [addDays(monday, 2)]: { skip: true } } },
    { ...base, id: "m-client", title: s.client, start: at(addDays(today, 1), "11:00"), end: at(addDays(today, 1), "11:30"), videoUrl: "https://teams.microsoft.com/l/meetup-join/demo", participants: [{ name: "Liam Chen", email: "liam.chen@northwind.co" }], source: "meetingguard", origin: "app" },
    { ...base, id: "m-1on1", title: s.oneOnOne, start: at(addDays(monday, 3), "15:00"), end: at(addDays(monday, 3), "15:30"), participants: [{ name: "Carlos Ruiz", email: "carlos.ruiz@meetingguard.ai" }], source: "meetingguard", origin: "assistant", repeat: "weekly" },
    { ...base, id: "m-dentist", title: s.dentist, start: at(addDays(today, 3), "18:00"), end: at(addDays(today, 3), "18:45"), location: s.dentistPlace, reminders: [60, 15], intensity: "standard", source: "meetingguard", origin: "app" },
    { ...base, id: "m-offsite", title: s.offsite, start: at(addDays(today, 8), "00:00"), end: at(addDays(today, 9), "00:00"), allDay: true, reminders: [], source: "google", origin: "sync" },
  ];

  const task = (t: Partial<Task> & Pick<Task, "id" | "title">): Task => ({ notes: "", dueDate: "", dueTime: "", reminder: null, meetingId: "", list: "meetingguard", done: false, doneAt: 0, origin: "app", updatedAt: now, ...t });
  const tasks: Task[] = [
    task({ id: "t-deck", title: s.deck, notes: s.deckNotes, dueDate: today, dueTime: "09:30", reminder: 15, meetingId: "m-investor", origin: "assistant" }),
    task({ id: "t-carlos", title: s.carlos, dueDate: addDays(today, -1), dueTime: "17:00", reminder: 0 }),
    task({ id: "t-flights", title: s.flights, dueDate: addDays(today, 2), origin: "whatsapp" }),
    task({ id: "t-q4", title: s.q4, dueDate: addDays(today, 6), dueTime: "12:00", reminder: 60, meetingId: "m-design" }),
    task({ id: "t-agenda", title: s.agenda }),
    task({ id: "t-invoice", title: s.invoice, dueDate: addDays(today, -2), done: true, doneAt: now - 86_400_000 }),
  ];

  return {
    meetings,
    tasks,
    entitlement: FREE,
    connections: { google: true, outlook: false, microsoftToDo: false, googleTasks: false },
  };
}
