import type { ReactNode } from "react";
import { SiteShell, baseMetadata, siteViewport } from "@/components/layout/SiteShell";
import "../globals.css";

export const metadata = baseMetadata("en");
export const viewport = siteViewport;

export default function EnglishLayout({ children }: { children: ReactNode }) {
  return <SiteShell lang="en">{children}</SiteShell>;
}
