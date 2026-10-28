"use client";

import { useSyncExternalStore } from "react";
import { MINUTE } from "./time";

/* ---------- The current time, shared by every screen and refreshed each minute ---------- */

let now = 0;
const clockListeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | undefined;

function tick() {
  now = Math.floor(Date.now() / MINUTE) * MINUTE;
  for (const l of clockListeners) l();
}

function subscribeClock(listener: () => void) {
  if (clockListeners.size === 0) {
    tick();
    timer = setInterval(tick, 15_000);
  }
  clockListeners.add(listener);
  return () => {
    clockListeners.delete(listener);
    if (clockListeners.size === 0) clearInterval(timer);
  };
}

const readClock = () => now || Math.floor(Date.now() / MINUTE) * MINUTE;

/** The current minute (ms). */
export function useNow() {
  return useSyncExternalStore(subscribeClock, readClock, () => 0);
}

/* ---------- Connection ---------- */

function subscribeOnline(listener: () => void) {
  window.addEventListener("online", listener);
  window.addEventListener("offline", listener);
  return () => {
    window.removeEventListener("online", listener);
    window.removeEventListener("offline", listener);
  };
}

/** False while the browser is offline. */
export function useOnline() {
  return useSyncExternalStore(subscribeOnline, () => navigator.onLine, () => true);
}

/** True when nothing should catch a single-key shortcut (typing, or a dialog is open). */
export function shortcutBlocked(e: KeyboardEvent) {
  if (e.metaKey || e.ctrlKey || e.altKey) return true;
  const el = e.target as HTMLElement | null;
  if (el?.closest("input, textarea, select, [contenteditable=true]")) return true;
  return !!document.querySelector("dialog[open]");
}
