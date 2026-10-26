import { AlarmClock, Briefcase, ListChecks, MessageCircle, Mic, RefreshCw, Rocket, TrendingUp, Volume2, type LucideIcon } from "lucide-react";
import type { FeatureSlug, UseCaseSlug } from "@/lib/routes";

/** Neutral icons for the six features and three use cases (no third-party logos). */
export const featureIcons: Record<FeatureSlug, LucideIcon> = {
  "voice-assistant": Mic,
  alarms: AlarmClock,
  tasks: ListChecks,
  agenda: Volume2,
  whatsapp: MessageCircle,
  integrations: RefreshCw,
};

export const useCaseIcons: Record<UseCaseSlug, LucideIcon> = {
  consultants: Briefcase,
  sales: TrendingUp,
  founders: Rocket,
};

/** Accent per feature, shared by the home tiles, the menu and the feature pages. */
export const featureAccents: Record<FeatureSlug, string> = {
  alarms: "#ff4d5e",
  "voice-assistant": "#a78bfa",
  tasks: "#f59e0b",
  agenda: "#2dd4bf",
  whatsapp: "#22c55e",
  integrations: "#4f8cff",
};
