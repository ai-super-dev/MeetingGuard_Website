import type { ReactNode } from "react";
import { SiteShell, baseMetadata, siteViewport } from "@/components/layout/SiteShell";
import "../globals.css";

export const metadata = baseMetadata("es");
export const viewport = siteViewport;

export default function SpanishLayout({ children }: { children: ReactNode }) {
  return <SiteShell lang="es">{children}</SiteShell>;
}
