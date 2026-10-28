/*
 * Plans and permissions. The web reads the same entitlement record as the
 * app, so a feature locked on a Free account in the app is locked here too.
 * Subscriptions are bought and managed only in the stores; there is no web
 * checkout.
 */

import type { Entitlement, Plan } from "./types";

export type Feature = "recurring" | "outlook" | "taskLists" | "customReminders" | "intensity";

/**
 * The lowest plan that includes each web feature.
 * TODO(Dusko): match the app's entitlement rules before launch (S3).
 */
export const REQUIRED: Record<Feature, Plan> = {
  recurring: "pro",
  outlook: "pro",
  taskLists: "pro",
  customReminders: "pro",
  intensity: "pro",
};

const RANK: Record<Plan, number> = { free: 0, pro: 1, premium: 2 };

/** True while a trial is running (the trial unlocks its plan). */
export const onTrial = (e: Entitlement, now: number) => e.trialEndsAt > now;

export function hasFeature(e: Entitlement, feature: Feature) {
  return RANK[e.plan] >= RANK[REQUIRED[feature]];
}

/** Where a subscriber manages their plan. */
export const MANAGE_URL = {
  google_play: "https://play.google.com/store/account/subscriptions",
  app_store: "https://apps.apple.com/account/subscriptions",
} as const;
