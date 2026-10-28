import type { Source } from "@/lib/agenda/types";

/** One colour per calendar, as the app's coloured bars on meeting cards. */
export const SOURCE_COLOR: Record<Source, string> = {
  meetingguard: "#8b8ff8",
  google: "#1fa37a",
  outlook: "#2f7fd8",
};

/** A soft fill of a calendar colour on the current theme's panel. */
export const tint = (color: string, amount = 16) => `color-mix(in oklab, ${color} ${amount}%, var(--color-panel))`;
