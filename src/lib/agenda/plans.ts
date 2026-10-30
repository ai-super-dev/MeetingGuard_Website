/*
 * Plans. The web reads the same entitlement record as the app and works out
 * the plan the same way. In the app, plans differ only in daily AI assistant
 * requests: meetings, tasks, alerts and calendars are in every plan, so nothing
 * on the web agenda (which has no assistant) is locked. Subscriptions are
 * bought and managed only in the stores; there is no web checkout.
 */

import type { Entitlement, Plan } from "./types";

/** AI assistant requests a day, set by the server (shown as the app shows them). */
export const DAILY_AI_LIMITS: Record<Plan, number> = { free: 5, pro: 100, premium: 500 };

/** The plan in effect: expired, revoked or past its end means Free. */
export function effectivePlan(e: Entitlement, now: number): Plan {
  if (e.status === "expired" || e.status === "revoked") return "free";
  if (e.expiresAt !== null && Date.parse(e.expiresAt) <= now) return "free";
  return e.plan;
}

/** A plan given by an admin has no store subscription to manage. */
export const hasStoreSubscription = (e: Entitlement) => e.source !== "admin" && e.source !== "manual" && e.source !== "default";

/** Where a subscriber manages their plan (the record doesn't say which store, so both are offered). */
export const MANAGE_URL = {
  google_play: "https://play.google.com/store/account/subscriptions",
  app_store: "https://apps.apple.com/account/subscriptions",
} as const;
