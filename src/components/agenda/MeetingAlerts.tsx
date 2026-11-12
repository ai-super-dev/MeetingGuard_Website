"use client";

/*
 * Meeting alerts on the web agenda, like the app's in-app alerts
 * (src/components/alerts in the app). The rules of when a meeting rings are in
 * lib/agenda/alerts.ts, the sound and voice in lib/agenda/alertSound.ts.
 * - Maximum: fills the window and waits for an answer: I'm on it, Join now or
 *   Snooze. Nobody answers in 60 seconds: it snoozes itself.
 * - Medium: a banner at the top with a chime. It can be minimized, but it
 *   stays until you act.
 * - Light: a short message at the bottom that hides itself after 12 seconds.
 * While this tab is in the background (or the browser is behind another
 * window), a browser notification shows as well, once the user allows them.
 * Several agenda tabs: only one rings, the one in front (else the one used last). What was answered
 * or snoozed is kept in this browser, so a reload doesn't ring it again.
 */

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AlarmClock, Bell, BellRing, ChevronDown, ChevronUp, Video, X } from "lucide-react";
import { AlertFeedback, type FeedbackRequest } from "@/lib/agenda/alertSound";
import { alertPhase, CATCH_UP_MS, dueAlerts, planAlerts, snoozeAlert, snoozeChoices, snoozeId, type DueAlert, type Snooze } from "@/lib/agenda/alerts";
import { useA, type AgendaDict } from "@/lib/agenda/i18n";
import { displayZone, joinUrl, useAgenda } from "@/lib/agenda/store";
import { fmtRange, fmtTime, MINUTE } from "@/lib/agenda/time";
import type { Meeting, Preferences } from "@/lib/agenda/types";
import { useLang } from "@/lib/language";
import { splitPath, type Lang } from "@/lib/routes";

/* ---------- What this browser remembers ---------- */

const STORE_PREFIX = "mg-alerts:";
const LEADER_KEY = "mg-alerts-leader";
const BAR_KEY = "mg-alerts-bar-closed";
/** Answered alerts are remembered this long. */
const KEEP_MS = 48 * 60 * MINUTE;
/** How far ahead the alerts are worked out, and how often again. */
const PLAN_AHEAD_MS = 6 * 60 * MINUTE;
const PLAN_EVERY_MS = 5 * MINUTE;
/** The full-screen alert snoozes itself after this, the light one hides itself after that. */
const AUTO_SNOOZE_MS = 60_000;
const LIGHT_DISMISS_AFTER_MS = 3000;
const LIGHT_HIDE_MS = 12_000;
/** A tab that rang last and hasn't been heard from this long is gone (a background tab may only tick once a minute). */
const LEADER_STALE_MS = 75_000;
const LEADER_REFRESH_MS = 5000;
const ICON = "/icons/app_icon.png";

type Saved = { done: Record<string, number>; snoozes: Snooze[] };

const memory = new Map<string, Saved>();
const isSnooze = (v: unknown): v is Snooze => {
  const s = v as Snooze;
  return !!s && typeof s.id === "string" && typeof s.meetingId === "string" && typeof s.key === "string" && typeof s.fireAt === "number";
};

function load(uid: string): Saved {
  const fallback = memory.get(uid) ?? { done: {}, snoozes: [] };
  try {
    const raw = localStorage.getItem(STORE_PREFIX + uid);
    if (!raw) return fallback;
    const v = JSON.parse(raw) as Partial<Saved>;
    return { done: v.done && typeof v.done === "object" ? v.done : {}, snoozes: Array.isArray(v.snoozes) ? v.snoozes.filter(isSnooze) : [] };
  } catch {
    return fallback;
  }
}

function save(uid: string, s: Saved) {
  const now = Date.now();
  const v: Saved = { done: Object.fromEntries(Object.entries(s.done).filter(([, at]) => now - at < KEEP_MS)), snoozes: s.snoozes };
  memory.set(uid, v);
  try {
    localStorage.setItem(STORE_PREFIX + uid, JSON.stringify(v));
  } catch {}
}

/* ---------- One ringing tab ---------- */

const TAB = Math.random().toString(36).slice(2);

function claim() {
  try {
    localStorage.setItem(LEADER_KEY, JSON.stringify({ tab: TAB, at: Date.now() }));
  } catch {}
}

function release() {
  try {
    const raw = localStorage.getItem(LEADER_KEY);
    if (raw && (JSON.parse(raw) as { tab?: string }).tab === TAB) localStorage.removeItem(LEADER_KEY);
  } catch {}
}

/** Whether this tab rings: the one in front, else the one used last, else any (the one used last is gone). */
function isLeader() {
  try {
    if (document.visibilityState === "visible" && document.hasFocus()) {
      claim();
      return true;
    }
    const raw = localStorage.getItem(LEADER_KEY);
    const l = raw ? (JSON.parse(raw) as { tab?: string; at?: number }) : null;
    const now = Date.now();
    if (!l || typeof l.at !== "number" || now - l.at > LEADER_STALE_MS) {
      claim();
      return true;
    }
    if (l.tab !== TAB) return false;
    if (now - l.at > LEADER_REFRESH_MS) claim();
    return true;
  } catch {
    return true;
  }
}

/* ---------- Words ---------- */

const PROVIDER: Record<string, string | null> = { zoom: "Zoom", teams: "Microsoft Teams", google_meet: "Google Meet", other: null };

function placeOf(m: Meeting | undefined) {
  const address = m?.location?.address?.trim();
  if (address) return address.slice(0, 120);
  return m?.conference ? PROVIDER[m.conference.provider] : null;
}

function wordsFor(alert: DueAlert, meeting: Meeting | undefined, now: number, a: AgendaDict, lang: Lang, zone: string) {
  const { phase, minutes } = alertPhase(alert.start, now);
  const title = alert.title.trim().slice(0, 200) || a.alerts.untitled;
  const lead = a.alerts.lead(minutes);
  const when = phase === "upcoming" ? a.alerts.when.upcoming(lead) : phase === "now" ? a.alerts.when.now : a.alerts.when.started(minutes);
  const range = fmtRange(new Date(alert.start), new Date(alert.end), lang, zone);
  const place = placeOf(meeting);
  const heading = a.alerts.heading[phase];
  const notification = phase === "upcoming" ? a.alerts.notification.upcoming(title, lead) : a.alerts.notification[phase](title);
  let voice = phase === "upcoming" ? a.alerts.voice.upcoming(title, lead, fmtTime(new Date(alert.start), lang, zone)) : a.alerts.voice[phase](title);
  if (place) voice = `${voice} ${a.alerts.voice.location(place)}`;
  return { title, when, range, place, heading, notification, voice, url: meeting ? joinUrl(meeting) : null };
}

/* ---------- The alerts ---------- */

type Active = DueAlert & { shownAt: number | null };

/** The ones on screen: the first of each intensity (the others wait their turn). */
function onScreen(list: readonly Active[]) {
  return (["max", "medium", "light"] as const).map((level) => list.find((x) => x.intensity === level)).filter((x): x is Active => !!x);
}

type Latest = { uid: string; meetings: Meeting[]; prefs: Preferences; a: AgendaDict; lang: Lang; zone: string };

/**
 * In the agenda's layout (AgendaDocument.tsx), so an alert keeps ringing while
 * you move between agenda pages. Not on the sign-in page or a guest's invitation.
 */
export function AgendaAlerts() {
  const { path } = splitPath(usePathname());
  if (path === "/app/sign-in" || path === "/app/invite") return null;
  return <MeetingAlerts />;
}

function MeetingAlerts() {
  const s = useAgenda();
  const a = useA();
  const lang = useLang();
  const zone = displayZone(s);
  const uid = s.ready && !s.blocked ? (s.user?.uid ?? "") : "";

  const [active, setActive] = useState<Active[]>([]);
  const [now, setNow] = useState(() => Date.now());
  const [soundBlocked, setSoundBlocked] = useState(false);

  const latest = useRef<Latest>({ uid, meetings: s.meetings, prefs: s.prefs, a, lang, zone });
  const activeRef = useRef<Active[]>([]);
  const plan = useRef<{ at: number; items: DueAlert[] }>({ at: 0, items: [] });
  const feedback = useRef(new Map<string, AlertFeedback>());
  const notes = useRef(new Map<string, Notification>());

  useEffect(() => {
    latest.current = { uid, meetings: s.meetings, prefs: s.prefs, a, lang, zone };
  });

  // meetings or settings changed: work the alerts out again on the next tick
  useEffect(() => {
    plan.current.at = 0;
  }, [s.meetings, s.prefs]);

  /** Sets the alerts, starting and stopping sounds and notifications to match. */
  const apply = useRef((next: Active[]) => {
    const at = Date.now();
    const shown = new Set(onScreen(next).map((x) => x.id));
    const list = next.map((x) => (shown.has(x.id) && x.shownAt === null ? { ...x, shownAt: at } : x));
    for (const [id, f] of feedback.current) {
      if (!shown.has(id)) {
        f.stop();
        feedback.current.delete(id);
      }
    }
    for (const x of list) {
      if (!shown.has(x.id) || feedback.current.has(x.id)) continue;
      const { meetings, prefs, a: dict, lang: l, zone: z } = latest.current;
      const words = wordsFor(x, meetings.find((m) => m.id === x.meetingId), at, dict, l, z);
      const req: FeedbackRequest = { intensity: x.intensity, soundType: prefs.alertSoundType, volume: prefs.alertVolume, voice: words.voice, lang: l };
      const f = new AlertFeedback(req, () => setSoundBlocked(true));
      feedback.current.set(x.id, f);
      f.start();
    }
    for (const [id, n] of notes.current) {
      if (!list.some((x) => x.id === id)) {
        n.close();
        notes.current.delete(id);
      }
    }
    activeRef.current = list;
    setActive(list);
  });

  /** Answered (or snoozed): never rings again in this browser. */
  const resolve = useRef((alert: DueAlert, snoozeMinutes?: number) => {
    const { uid: id } = latest.current;
    const saved = load(id);
    saved.done[alert.id] = Date.now();
    saved.snoozes = saved.snoozes.filter((x) => x.id !== alert.id);
    if (snoozeMinutes) {
      const fireAt = Date.now() + snoozeMinutes * MINUTE;
      saved.snoozes.push({ id: snoozeId(alert.meetingId, alert.key, fireAt), meetingId: alert.meetingId, key: alert.key, fireAt });
    }
    save(id, saved);
    apply.current(activeRef.current.filter((x) => x.id !== alert.id));
  });

  useEffect(() => {
    if (!uid) return;

    const notify = (alert: DueAlert) => {
      if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
      if (!document.hidden && document.hasFocus()) return;
      const { meetings, a: dict, lang: l, zone: z } = latest.current;
      const meeting = meetings.find((m) => m.id === alert.meetingId);
      const words = wordsFor(alert, meeting, Date.now(), dict, l, z);
      try {
        const n = new Notification(words.notification, {
          body: words.place ? `${words.range} · ${words.place}` : words.range,
          icon: ICON,
          tag: alert.id,
          lang: l,
          requireInteraction: alert.intensity === "max",
        });
        n.onclick = () => {
          window.focus();
          n.close();
        };
        notes.current.set(alert.id, n);
      } catch {}
    };

    const tick = () => {
      const at = Date.now();
      const { meetings, prefs } = latest.current;
      const current = activeRef.current;
      if (!prefs.alertEnabled || !isLeader()) {
        if (current.length) apply.current([]);
        return;
      }
      if (at - plan.current.at > PLAN_EVERY_MS) plan.current = { at, items: planAlerts(meetings, prefs, at - CATCH_UP_MS, at + PLAN_AHEAD_MS) };

      const saved = load(uid);
      const snoozes: Snooze[] = [];
      const snoozed: DueAlert[] = [];
      for (const sn of saved.snoozes) {
        const x = snoozeAlert(sn, meetings, prefs);
        if (x) {
          snoozes.push(sn);
          snoozed.push(x);
        }
      }
      const candidates = new Map([...plan.current.items, ...snoozed].map((x) => [x.id, x]));
      const { show, skip } = dueAlerts([...candidates.values()], snoozes, (id) => id in saved.done, at);
      const skipped = new Set(skip);

      let changed = snoozes.length !== saved.snoozes.length;
      for (const id of skip) {
        saved.done[id] = at;
        changed = true;
      }
      saved.snoozes = snoozes.filter((x) => !skipped.has(x.id));
      if (changed) save(uid, saved);

      // the ones on screen, as their meeting is now; gone when the meeting or date is gone, or a newer alert took over
      const kept = current.flatMap((x) => {
        const fresh = candidates.get(x.id);
        return fresh && !skipped.has(x.id) ? [{ ...fresh, shownAt: x.shownAt }] : [];
      });
      const added = show.filter((x) => !kept.some((k) => k.id === x.id)).map((x) => ({ ...x, shownAt: null }));
      const next = [...kept, ...added];
      const same = next.length === current.length && next.every((x, i) => x.id === current[i].id && x.title === current[i].title && x.start === current[i].start && x.end === current[i].end);
      if (!same) apply.current(next);
      for (const x of added) notify(x);

      // the full-screen one snoozes itself, the light one hides itself
      for (const x of onScreen(activeRef.current)) {
        if (x.shownAt === null) continue;
        if (x.intensity === "max" && at - x.shownAt >= AUTO_SNOOZE_MS) resolve.current(x, snoozeChoices(prefs.snoozeMinutes)[0]);
        else if (x.intensity === "light" && at - x.shownAt >= LIGHT_HIDE_MS) resolve.current(x);
      }
      if (activeRef.current.length) setNow(at);
    };

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        claim();
        tick();
      }
    };
    const onFocus = () => {
      claim();
      tick();
    };
    // a tab opened or reloaded in front rings from now on
    if (document.visibilityState === "visible") claim();
    const first = setTimeout(tick, 0);
    const timer = setInterval(tick, 1000);
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onFocus);
    window.addEventListener("pagehide", release);
    const sounds = feedback.current;
    const shown = notes.current;
    return () => {
      clearTimeout(first);
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("pagehide", release);
      for (const f of sounds.values()) f.stop();
      sounds.clear();
      for (const n of shown.values()) n.close();
      shown.clear();
      activeRef.current = [];
      release();
    };
  }, [uid]);

  // the browser held the sound back: the next click or key plays it
  useEffect(() => {
    if (!soundBlocked) return;
    const unlock = () => {
      for (const f of feedback.current.values()) f.retry();
      setSoundBlocked(false);
    };
    window.addEventListener("pointerdown", unlock, true);
    window.addEventListener("keydown", unlock, true);
    return () => {
      window.removeEventListener("pointerdown", unlock, true);
      window.removeEventListener("keydown", unlock, true);
    };
  }, [soundBlocked]);

  if (!uid) return null;
  const shown = onScreen(active);
  const max = shown.find((x) => x.intensity === "max");
  const medium = shown.find((x) => x.intensity === "medium");
  const light = shown.find((x) => x.intensity === "light");
  const meetingOf = (x: DueAlert) => s.meetings.find((m) => m.id === x.meetingId);
  const join = (x: DueAlert, url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
    resolve.current(x);
  };
  const common = { now, lang, zone, soundBlocked };

  return (
    <>
      {light && <LightAlert key={light.id} alert={light} meeting={meetingOf(light)} {...common} onDismiss={() => resolve.current(light)} />}
      {medium && (
        <MediumAlert
          key={medium.id}
          alert={medium}
          meeting={meetingOf(medium)}
          {...common}
          snoozeMinutes={snoozeChoices(s.prefs.snoozeMinutes)[0]}
          onAck={() => resolve.current(medium)}
          onSnooze={(m) => resolve.current(medium, m)}
          onJoin={(url) => join(medium, url)}
        />
      )}
      {max && (
        <MaxAlert
          key={max.id}
          alert={max}
          meeting={meetingOf(max)}
          {...common}
          snoozeOptions={snoozeChoices(s.prefs.snoozeMinutes)}
          onAck={() => resolve.current(max)}
          onSnooze={(m) => resolve.current(max, m)}
          onJoin={(url) => join(max, url)}
        />
      )}
    </>
  );
}

type ViewProps = { alert: Active; meeting: Meeting | undefined; now: number; lang: Lang; zone: string; soundBlocked: boolean };

/** Maximum: the whole window, until it is answered. */
function MaxAlert({
  alert,
  meeting,
  now,
  lang,
  zone,
  soundBlocked,
  snoozeOptions,
  onAck,
  onSnooze,
  onJoin,
}: ViewProps & { snoozeOptions: number[]; onAck: () => void; onSnooze: (minutes: number) => void; onJoin: (url: string) => void }) {
  const a = useA();
  const ref = useRef<HTMLDialogElement>(null);
  const labelId = useId();
  const w = wordsFor(alert, meeting, now, a, lang, zone);
  const left = alert.shownAt === null ? 60 : Math.max(0, Math.ceil((alert.shownAt + AUTO_SNOOZE_MS - now) / 1000));

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (!d.open) d.showModal();
    d.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    // it only closes through its buttons
    const reopen = () => {
      if (d.isConnected && !d.open) d.showModal();
    };
    d.addEventListener("close", reopen);
    return () => d.removeEventListener("close", reopen);
  }, []);

  return (
    <dialog
      ref={ref}
      role="alertdialog"
      aria-labelledby={labelId}
      data-meeting-alert="max"
      onCancel={(e) => e.preventDefault()}
      className="theme-dark fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none border-0 bg-[#3f0a14] p-0 text-white backdrop:bg-black/70"
    >
      <div className="flex min-h-full flex-col items-center justify-center px-6 py-10 text-center">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-white/10 ring-1 ring-white/15 motion-safe:animate-pulse" aria-hidden>
          <AlarmClock className="h-10 w-10" />
        </span>
        <p className="mt-6 text-[0.95rem] font-medium text-[#fbd5d8]">{w.heading}</p>
        <h2 id={labelId} className="mt-2 max-w-[640px] text-[clamp(1.6rem,4vw,2.4rem)] leading-tight font-semibold tracking-[-0.015em] text-balance break-words">
          {w.title}
        </h2>
        <p className="mt-3 text-[1.1rem] font-semibold text-[#f5d58a]">{w.when}</p>
        <p className="mt-1 text-[0.95rem] text-white/75">{w.range}</p>
        {w.place && <p className="mt-0.5 max-w-[560px] text-[0.9rem] text-white/60">{w.place}</p>}

        <div className="mt-8 flex w-full max-w-[380px] flex-col gap-3">
          <button type="button" data-autofocus onClick={onAck} className="h-12 rounded-xl bg-[#fafafa] text-[0.98rem] font-semibold text-[#3f0a14] transition hover:bg-white">
            {a.alerts.acknowledge}
          </button>
          {w.url && (
            <button
              type="button"
              onClick={() => onJoin(w.url!)}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#1f9d55] text-[0.98rem] font-semibold text-[#fff] transition hover:brightness-110"
            >
              <Video className="h-5 w-5" aria-hidden />
              {a.alerts.join}
            </button>
          )}
          <div className="grid grid-cols-2 gap-3">
            {snoozeOptions.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => onSnooze(m)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#f3a0a8]/70 text-[0.88rem] font-medium text-[#fbd5d8] transition hover:bg-white/[0.06]"
              >
                <AlarmClock className="h-4 w-4" aria-hidden />
                {a.alerts.snooze(m)}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-6 text-[0.82rem] text-white/55">{a.alerts.autoSnooze(left)}</p>
        {soundBlocked && <p className="mt-2 max-w-[420px] text-[0.82rem] text-[#f5d58a]">{a.alerts.soundBlocked}</p>}
      </div>
    </dialog>
  );
}

/** Medium: a banner at the top; it can be minimized, but stays until answered. */
function MediumAlert({
  alert,
  meeting,
  now,
  lang,
  zone,
  soundBlocked,
  snoozeMinutes,
  onAck,
  onSnooze,
  onJoin,
}: ViewProps & { snoozeMinutes: number; onAck: () => void; onSnooze: (minutes: number) => void; onJoin: (url: string) => void }) {
  const a = useA();
  const [minimized, setMinimized] = useState(false);
  const w = wordsFor(alert, meeting, now, a, lang, zone);

  return (
    <div className="theme-dark pointer-events-none fixed inset-x-0 top-3 z-[80] flex justify-center px-3" data-meeting-alert="medium">
      {minimized ? (
        <button
          type="button"
          onClick={() => setMinimized(false)}
          aria-label={a.alerts.expand}
          className="pointer-events-auto inline-flex max-w-full items-center gap-2 rounded-full border-l-4 border-[#c9974a] bg-[#1b2433] py-2 pr-3 pl-3 text-[0.85rem] text-white shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
        >
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#c9974a]" aria-hidden />
          <span className="truncate">
            {w.title} · {w.when}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-white/70" aria-hidden />
        </button>
      ) : (
        <div role="alert" className="pointer-events-auto w-full max-w-[560px] rounded-xl border-l-4 border-[#c9974a] bg-[#1b2433] p-4 text-white shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#c9974a]" aria-hidden />
            <p className="flex-1 text-[0.8rem] font-medium text-[#e8c88f]">{a.alerts.mediumHeading}</p>
            <button type="button" onClick={() => setMinimized(true)} aria-label={a.alerts.minimize} title={a.alerts.minimize} className="-m-1 grid h-8 w-8 place-items-center rounded-lg text-white/70 hover:bg-white/[0.08] hover:text-white">
              <ChevronUp className="h-4 w-4" aria-hidden />
            </button>
          </div>
          <p className="mt-1 text-[1rem] leading-snug font-semibold break-words">{w.title}</p>
          <p className="mt-0.5 text-[0.85rem] text-white/70">
            {w.when} · {w.range}
            {w.place && ` · ${w.place}`}
          </p>
          {soundBlocked && <p className="mt-1.5 text-[0.78rem] text-[#f5d58a]">{a.alerts.soundBlocked}</p>}
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={onAck} className="h-9 rounded-lg bg-[#fafafa] px-3.5 text-[0.85rem] font-semibold text-[#1b2433] hover:bg-white">
              {a.alerts.acknowledge}
            </button>
            {w.url && (
              <button type="button" onClick={() => onJoin(w.url!)} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#1f9d55] px-3.5 text-[0.85rem] font-semibold text-[#fff] hover:brightness-110">
                <Video className="h-4 w-4" aria-hidden />
                {a.alerts.join}
              </button>
            )}
            <button type="button" onClick={() => onSnooze(snoozeMinutes)} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/20 px-3.5 text-[0.85rem] font-medium text-white/85 hover:border-white/35 hover:text-white">
              <AlarmClock className="h-4 w-4" aria-hidden />
              {a.alerts.snooze(snoozeMinutes)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** Light: a short message that hides itself. */
function LightAlert({ alert, meeting, now, lang, zone, onDismiss }: ViewProps & { onDismiss: () => void }) {
  const a = useA();
  const w = wordsFor(alert, meeting, now, a, lang, zone);
  const canDismiss = alert.shownAt !== null && now - alert.shownAt >= LIGHT_DISMISS_AFTER_MS;
  return (
    <div className="theme-dark pointer-events-none fixed inset-x-0 bottom-36 z-[80] flex justify-center px-3 lg:bottom-20" data-meeting-alert="light">
      <div role="status" className="pointer-events-auto flex w-full max-w-[480px] items-center gap-3 rounded-2xl bg-[#1b2433] py-3 pr-2 pl-4 text-white shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
        <Bell className="h-5 w-5 shrink-0 text-[#c9d4e6]" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="text-[0.75rem] text-white/60">{a.alerts.lightHeading}</p>
          <p className="truncate text-[0.9rem] font-medium">
            {w.title} · {w.when}
          </p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          disabled={!canDismiss}
          aria-label={a.alerts.dismiss}
          title={a.alerts.dismiss}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-white/70 hover:bg-white/[0.08] hover:text-white disabled:opacity-40"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}

/* ---------- Asking the browser ---------- */

const canAsk = () => typeof Notification !== "undefined" && Notification.permission === "default";

function barClosed() {
  try {
    return localStorage.getItem(BAR_KEY) === "1";
  } catch {
    return false;
  }
}

/** Under the top bar until the browser has been asked: lets alerts show while this tab is in the background. */
export function AlertsBar() {
  const a = useA();
  const s = useAgenda();
  const [show, setShow] = useState(() => canAsk() && !barClosed());
  if (!show || !s.prefs.alertEnabled) return null;
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-[#4f8df9]/20 bg-[#4f8df9]/[0.07] px-4 py-2.5 text-[0.8rem] text-white/80 lg:px-8" data-alerts-bar>
      <BellRing className="h-4 w-4 shrink-0 text-[color:color-mix(in_srgb,#4f8df9_70%,var(--color-white))]" aria-hidden />
      <p className="min-w-0 flex-1 basis-[240px]">{a.alerts.bar.text}</p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            void Notification.requestPermission()
              .catch(() => undefined)
              .finally(() => setShow(false));
          }}
          className="h-8 rounded-full bg-[linear-gradient(135deg,#4f8df9,#2563eb)] px-3.5 text-[0.78rem] font-semibold text-[#fff] hover:brightness-110"
        >
          {a.alerts.bar.turnOn}
        </button>
        <button
          type="button"
          onClick={() => {
            setShow(false);
            try {
              localStorage.setItem(BAR_KEY, "1");
            } catch {}
          }}
          className="h-8 rounded-full px-3 text-[0.78rem] font-medium text-white/60 hover:text-white"
        >
          {a.alerts.bar.later}
        </button>
      </div>
    </div>
  );
}
