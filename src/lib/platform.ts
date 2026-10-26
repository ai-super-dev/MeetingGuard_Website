"use client";

import { useSyncExternalStore } from "react";

export type Platform = "ios" | "android" | "other";

function detect(): Platform {
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return "android";
  // iPadOS reports itself as a Mac with touch support
  if (/iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1)) return "ios";
  return "other";
}

const noop = () => () => {};

/** The visitor's phone platform; "other" during prerender and on desktops. */
export function usePlatform(): Platform {
  return useSyncExternalStore(noop, detect, () => "other");
}
