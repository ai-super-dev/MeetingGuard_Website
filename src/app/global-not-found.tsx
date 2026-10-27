import type { Metadata } from "next";
import Link from "next/link";
import { inter, mono } from "@/components/layout/SiteShell";
import { AppMark } from "@/components/ui/Logo";
import { en, es } from "@/lib/i18n";
import { THEME_SCRIPT } from "@/lib/theme";
import "./globals.css";

export const metadata: Metadata = {
  title: "404 | MeetingGuard",
  robots: { index: false, follow: true },
};

/** One page for every unmatched URL, in both languages (it renders outside the language layouts). */
export default function GlobalNotFound() {
  return (
    <html lang="en" data-theme="dark" className={`${inter.variable} ${mono.variable}`} suppressHydrationWarning>
      <body className="grid min-h-screen place-items-center overflow-x-clip px-5">
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/3 left-1/2 h-[420px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(190,20,40,0.25),transparent)] blur-2xl"
        />
        <main className="relative text-center">
          <AppMark className="mx-auto h-14 w-14" sizes="112px" />
          <p className="eyebrow mt-8">404</p>
          <h1 className="mt-3 text-[2rem] leading-tight font-semibold tracking-[-0.02em] sm:text-[2.6rem]">
            {en.notFound.title}
            <br />
            <span lang="es" className="text-white/50">
              {es.notFound.title}
            </span>
          </h1>
          <p className="mt-4 text-white/60">{en.notFound.body}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/" className="rounded-xl bg-inverse px-5 py-3 text-[0.9rem] font-medium text-on-inverse hover:bg-inverse-hover">
              {en.notFound.home}
            </Link>
            <Link
              href="/es"
              lang="es"
              className="rounded-xl border border-white/12 px-5 py-3 text-[0.9rem] font-medium text-white/85 hover:border-white/25"
            >
              {es.notFound.home}
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
