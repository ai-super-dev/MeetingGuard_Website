import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { MotionProvider } from "@/components/motion";
import { dictionaries } from "@/lib/i18n";
import { LangProvider } from "@/lib/language";
import type { Lang } from "@/lib/routes";
import { siteConfig } from "@/lib/site";
import { ConsentBanner } from "./ConsentBanner";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { ScrollDepth } from "./ScrollDepth";
import { SkipLink } from "./SkipLink";

export const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
export const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

/** Site-wide metadata defaults for one language; each page adds its own title and description. */
export function baseMetadata(lang: Lang): Metadata {
  const t = dictionaries[lang];
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: t.meta.homeTitle, template: "%s | MeetingGuard" },
    description: t.meta.homeDescription,
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.company }],
  };
}

export const siteViewport: Viewport = {
  themeColor: "#07070a",
  colorScheme: "dark",
};

/**
 * The document for one language (each language has its own root layout so
 * <html lang> is right in the prerendered HTML).
 */
export function SiteShell({ lang, children }: { lang: Lang; children: ReactNode }) {
  return (
    <html lang={lang} data-theme="dark" data-scroll-behavior="smooth" className={`${inter.variable} ${mono.variable}`}>
      <body className="min-h-screen overflow-x-clip">
        <LangProvider lang={lang}>
          <MotionProvider>
            <SkipLink />
            <Header />
            <main id="main">{children}</main>
            <Footer />
            <ConsentBanner />
            <ScrollDepth />
          </MotionProvider>
        </LangProvider>
      </body>
    </html>
  );
}
