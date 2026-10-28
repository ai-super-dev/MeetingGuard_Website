import type { Metadata } from "next";
import { agendaEn, agendaEs } from "@/lib/agenda/i18n";
import type { Lang } from "@/lib/routes";
import { siteConfig } from "@/lib/site";

export type AgendaPageKey = "agenda" | "tasks" | "account" | "signIn" | "invite";

/** Defaults for every agenda page: private, so never indexed. */
export function agendaBaseMetadata(lang: Lang): Metadata {
  const a = lang === "es" ? agendaEs : agendaEn;
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: a.meta.agenda, template: "%s | MeetingGuard" },
    description: a.meta.description,
    applicationName: siteConfig.name,
    robots: { index: false, follow: false },
  };
}

export function agendaMetadata(lang: Lang, page: AgendaPageKey): Metadata {
  const a = lang === "es" ? agendaEs : agendaEn;
  return { title: a.meta[page] };
}
