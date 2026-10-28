import type { ReactNode } from "react";
import type { Viewport } from "next";
import { inter, mono } from "@/components/layout/SiteShell";
import { SkipLink } from "@/components/layout/SkipLink";
import { ThemeRestore } from "@/components/layout/ThemeToggle";
import { LangProvider } from "@/lib/language";
import type { Lang } from "@/lib/routes";
import { THEME_SCRIPT } from "@/lib/theme";
import { ToastProvider } from "./ui";

export const agendaViewport: Viewport = {
  themeColor: "#07070a",
  colorScheme: "dark",
  // the bottom tab bar sits above the phone's home indicator
  viewportFit: "cover",
};

/**
 * The web agenda's document for one language. It shares the site's fonts,
 * colours and light / dark theme, but has its own app layout instead of the
 * marketing header and footer.
 */
export function AgendaDocument({ lang, children }: { lang: Lang; children: ReactNode }) {
  return (
    <html lang={lang} data-theme="dark" className={`${inter.variable} ${mono.variable}`} suppressHydrationWarning>
      <body className="min-h-dvh overflow-x-clip">
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <ThemeRestore />
        <LangProvider lang={lang}>
          <ToastProvider>
            <SkipLink />
            {children}
          </ToastProvider>
        </LangProvider>
      </body>
    </html>
  );
}
