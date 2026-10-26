"use client";

import { siteConfig } from "./site";

/*
 * Analytics with consent: GA4 loads only after the visitor accepts in the
 * consent banner, and only when siteConfig.gaMeasurementId is set. Until then
 * `track()` does nothing.
 */

export type Consent = "granted" | "denied";
const KEY = "mg-consent";
export const CONSENT_EVENT = "mg-consent-change";

type Gtag = (...args: unknown[]) => void;
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

export function readConsent(): Consent | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function saveConsent(value: Consent) {
  try {
    localStorage.setItem(KEY, value);
  } catch {}
  window.dispatchEvent(new Event(CONSENT_EVENT));
  if (value === "granted") loadAnalytics();
}

let loaded = false;

/** Injects GA4 once consent is granted. Safe to call repeatedly. */
export function loadAnalytics() {
  const id = siteConfig.gaMeasurementId;
  if (loaded || !id || readConsent() !== "granted") return;
  loaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", id, { anonymize_ip: true });
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s);
}

/**
 * The events the brief asks for: badge_click (store), waitlist_submit,
 * contact_submit, video_play, scroll_75.
 */
export function track(event: "badge_click" | "waitlist_submit" | "contact_submit" | "send_link_submit" | "updates_submit" | "video_play" | "scroll_75", params: Record<string, string> = {}) {
  if (readConsent() !== "granted") return;
  window.gtag?.("event", event, params);
}
