import type { ReactNode } from "react";
import { AgendaDocument, agendaViewport } from "@/components/agenda/AgendaDocument";
import { agendaBaseMetadata } from "@/views/agenda/meta";
import "../../../globals.css";

export const metadata = agendaBaseMetadata("es");
export const viewport = agendaViewport;

/** The web agenda in Spanish (its own root layout, without the site's header and footer). */
export default function SpanishAgendaLayout({ children }: { children: ReactNode }) {
  return <AgendaDocument lang="es">{children}</AgendaDocument>;
}
