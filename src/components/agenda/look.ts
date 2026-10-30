import type { Calendar } from "@/lib/agenda/types";

/** One colour per calendar, as the app's coloured bars on meeting cards. */
export const SOURCE_COLOR: Record<Calendar, string> = {
  meetingguard: "#8b8ff8",
  google: "#1fa37a",
  outlook: "#2f7fd8",
  device: "#c98a2b",
};

/** A soft fill of a calendar colour on the current theme's panel. */
export const tint = (color: string, amount = 16) => `color-mix(in oklab, ${color} ${amount}%, var(--color-panel))`;
