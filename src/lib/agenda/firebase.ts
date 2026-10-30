/*
 * The connection to the app's Firebase project: sign-in, live records and
 * writes, under the same server rules as the app. Loaded only when the site is
 * built with a Firebase config (see config.ts), and only on agenda pages.
 */

import { getApp, getApps, initializeApp } from "firebase/app";
import {
  connectAuthEmulator,
  EmailAuthProvider,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  OAuthProvider,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User as FirebaseUser,
} from "firebase/auth";
import { collection, connectFirestoreEmulator, doc, getFirestore, initializeFirestore, memoryLocalCache, onSnapshot, runTransaction, setDoc, type DocumentData, type Firestore } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions, httpsCallable } from "firebase/functions";
import { EMULATOR_HOST, FIREBASE_CONFIG, FUNCTIONS_REGION } from "./config";
import type { User } from "./types";

const app = getApps().length ? getApp() : initializeApp(FIREBASE_CONFIG);
const auth = getAuth(app);
const functions = getFunctions(app, FUNCTIONS_REGION);

function createDb(): Firestore {
  try {
    return initializeFirestore(app, { ignoreUndefinedProperties: true, localCache: memoryLocalCache() });
  } catch {
    return getFirestore(app);
  }
}
const db = createDb();

if (EMULATOR_HOST) {
  connectAuthEmulator(auth, `http://${EMULATOR_HOST}:9099`, { disableWarnings: true });
  connectFirestoreEmulator(db, EMULATOR_HOST, 8080);
  connectFunctionsEmulator(functions, EMULATOR_HOST, 5001);
}

type Raw = Record<string, unknown>;

/** Firestore dates in old documents become ISO strings, so everything else sees plain JSON. */
function plain(value: unknown): unknown {
  if (value && typeof (value as { toDate?: unknown }).toDate === "function" && typeof (value as { seconds?: unknown }).seconds === "number") {
    return (value as { toDate(): Date }).toDate().toISOString();
  }
  if (Array.isArray(value)) return value.map(plain);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, plain(v)]));
  return value;
}

const plainDoc = (data: DocumentData) => plain(data) as Raw;

// as on the server: Google and Apple accounts count as verified without the email check
const TRUSTED_PROVIDERS = ["google.com", "apple.com"];

function toUser(u: FirebaseUser): User {
  const providers = u.providerData.map((p) => p.providerId);
  return { uid: u.uid, name: u.displayName || (u.email ?? "").split("@")[0], email: u.email ?? "", providers, verified: u.emailVerified || providers.some((p) => TRUSTED_PROVIDERS.includes(p)) };
}

/* ---------- Sign in ---------- */

const googleProvider = () => new GoogleAuthProvider();
function appleProvider() {
  const p = new OAuthProvider("apple.com");
  p.addScope("email");
  p.addScope("name");
  return p;
}

export const onUser = (listener: (user: User | null) => void) => onAuthStateChanged(auth, (u) => listener(u ? toUser(u) : null));
export const signInGoogle = () => signInWithPopup(auth, googleProvider()).then(() => undefined);
export const signInApple = () => signInWithPopup(auth, appleProvider()).then(() => undefined);
export const signInPassword = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password).then(() => undefined);
export const sendReset = (email: string) => sendPasswordResetEmail(auth, email);
export const signOut = () => firebaseSignOut(auth);

/** The server requires a recent sign-in before an account is deleted. */
export async function reauthenticate(password?: string) {
  const user = auth.currentUser;
  if (!user) throw new Error("Nobody is signed in");
  const providers = user.providerData.map((p) => p.providerId);
  if (providers.includes("apple.com")) await reauthenticateWithPopup(user, appleProvider());
  else if (providers.includes("google.com")) await reauthenticateWithPopup(user, googleProvider());
  else await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email ?? "", password ?? ""));
}

export async function deleteAccount() {
  await httpsCallable(functions, "deleteAccount")({ confirm: true });
  await firebaseSignOut(auth);
}

/* ---------- Zoom links (the app's server functions) ---------- */

const ZOOM_CALL_MS = 20_000;

const callZoom = async <T>(name: string, data: unknown) => (await httpsCallable<unknown, T>(functions, name, { timeout: ZOOM_CALL_MS })(data)).data;

/** Whether the server's Zoom integration is set up. */
export const zoomStatus = () => callZoom<{ configured?: unknown }>("zoomStatus", {}).then((r) => r.configured === true);
/** Creates the Zoom meeting of a saved meeting; the server writes the link into it. */
export const zoomCreate = (meetingId: string) => callZoom<unknown>("zoomCreateMeeting", { meetingId });
/** Updates the Zoom meeting after its title, time or length changed. */
export const zoomSync = (meetingId: string) => callZoom<unknown>("zoomSyncMeeting", { meetingId });
/** Deletes the Zoom meeting of a deleted meeting. */
export const zoomDelete = (zoomMeetingId: string) => callZoom<unknown>("zoomDeleteMeeting", { meetingId: null, zoomMeetingId });

/* ---------- WhatsApp assistant (the app's server functions) ---------- */

export type WhatsAppStatus = { enabled: boolean; linked: boolean; linkedLast4: string | null };

/** Whether the bot is set up and this account's phone is linked. */
export async function whatsappStatus(): Promise<WhatsAppStatus> {
  const r = (await httpsCallable<unknown, Raw>(functions, "whatsappLinkStatus", { timeout: 10_000 })({})).data;
  return { enabled: r.enabled === true, linked: r.linked === true, linkedLast4: typeof r.linkedLast4 === "string" ? r.linkedLast4 : null };
}

/* ---------- Live records ---------- */

export type Handlers = {
  meetings: (docs: { id: string; data: Raw }[], fromCache: boolean) => void;
  tasks: (docs: { id: string; data: Raw }[], fromCache: boolean) => void;
  entitlement: (data: Raw | null) => void;
  preferences: (data: Raw | null) => void;
  error: (error: unknown) => void;
};

/** Listens to the user's records (the whole collections, as the app does). */
export function listen(uid: string, on: Handlers) {
  const stops = [
    onSnapshot(collection(db, `users/${uid}/meetings`), (s) => on.meetings(s.docs.map((d) => ({ id: d.id, data: plainDoc(d.data()) })), s.metadata.fromCache), on.error),
    onSnapshot(collection(db, `users/${uid}/tasks`), (s) => on.tasks(s.docs.map((d) => ({ id: d.id, data: plainDoc(d.data()) })), s.metadata.fromCache), on.error),
    onSnapshot(doc(db, `entitlements/${uid}`), (s) => on.entitlement(s.exists() ? plainDoc(s.data()) : null), on.error),
    onSnapshot(doc(db, `users/${uid}/settings/preferences`), (s) => on.preferences(s.exists() ? plainDoc(s.data()) : null), on.error),
  ];
  return () => stops.forEach((stop) => stop());
}

export const newDocId = (uid: string, kind: "meetings" | "tasks") => doc(collection(db, `users/${uid}/${kind}`)).id;

/* ---------- Writes ---------- */

const SAVE_LIMIT_MS = 30_000;

export type Write = { path: string; mode: "create" | "set" | "delete"; data: Raw | null; updatedAt: string };

const isNewer = (current: Raw, updatedAt: string) => {
  const server = typeof current.updatedAt === "string" ? Date.parse(current.updatedAt) : NaN;
  return server > Date.parse(updatedAt);
};

/**
 * Saves several documents together, or none of them. As in the app, the newest
 * version wins: a document changed more recently on another device is left as
 * it is, and a document to create that already exists isn't overwritten.
 */
export async function commit(writes: Write[]) {
  const saved = runTransaction(
    db,
    async (tx) => {
      const refs = writes.map((w) => doc(db, w.path));
      const current = await Promise.all(refs.map((ref) => tx.get(ref)));
      writes.forEach((w, i) => {
        const snap = current[i];
        const exists = snap.exists();
        if (w.mode === "create") {
          if (!exists && w.data) tx.set(refs[i], w.data);
        } else if (exists && isNewer(plainDoc(snap.data()), w.updatedAt)) {
          // changed on another device in the meantime: the newer version stays
        } else if (w.mode === "delete") {
          if (exists) tx.delete(refs[i]);
        } else if (w.data) {
          tx.set(refs[i], w.data);
        }
      });
    },
    { maxAttempts: 3 },
  );
  // a save that hangs (a lost connection) reports an error instead of spinning for ever
  let timer: ReturnType<typeof setTimeout> | undefined;
  const limit = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("Save timed out")), SAVE_LIMIT_MS);
  });
  try {
    await Promise.race([saved, limit]);
  } finally {
    clearTimeout(timer);
  }
}

/** Saves changed settings as the app does: only those fields, merged into the record, with a new time. */
export async function savePreferences(uid: string, patch: Raw, updatedAt: string) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const limit = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("Save timed out")), SAVE_LIMIT_MS);
  });
  try {
    await Promise.race([setDoc(doc(db, `users/${uid}/settings/preferences`), { ...patch, updatedAt }, { merge: true }), limit]);
  } finally {
    clearTimeout(timer);
  }
}

/** Keeps the profile's identity up to date, as the app does on each sign-in. */
export async function ensureProfile(user: User, now: string) {
  const ref = doc(db, `users/${user.uid}`);
  const allowed = ["uid", "email", "displayName", "photoURL", "createdAt", "updatedAt", "lastLoginAt", "legacyMigratedAt"];
  const current = auth.currentUser;
  const identity = { uid: user.uid, email: current?.email?.slice(0, 254) ?? null, displayName: current?.displayName?.slice(0, 200) ?? null, photoURL: current?.photoURL?.slice(0, 2048) ?? null, updatedAt: now, lastLoginAt: now };
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists()) {
      tx.set(ref, { ...identity, createdAt: now, legacyMigratedAt: null });
      return;
    }
    const data = plainDoc(snap.data());
    // an old profile is converted by the app, which knows the old format
    if (Object.keys(data).some((k) => !allowed.includes(k))) return;
    tx.set(ref, typeof data.createdAt === "string" ? identity : { ...identity, createdAt: now }, { merge: true });
  });
}
