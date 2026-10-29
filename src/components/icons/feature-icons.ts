import { AlarmClock, ListChecks, MessageCircle, Mic, RefreshCw, Video, Volume2, type LucideIcon } from "lucide-react";
import type { FeatureSlug } from "@/lib/routes";

/** Neutral icons for the seven features (no third-party logos). */
export const featureIcons: Record<FeatureSlug, LucideIcon> = {
  "voice-assistant": Mic,
  alarms: AlarmClock,
  tasks: ListChecks,
  agenda: Volume2,
  whatsapp: MessageCircle,
  "meeting-links": Video,
  integrations: RefreshCw,
};

/** Accent per feature, used by the home tiles. */
export const featureAccents: Record<FeatureSlug, string> = {
  alarms: "#ff4d5e",
  "voice-assistant": "#a78bfa",
  tasks: "#f59e0b",
  agenda: "#2dd4bf",
  whatsapp: "#22c55e",
  "meeting-links": "#f472b6",
  integrations: "#4f8cff",
};
