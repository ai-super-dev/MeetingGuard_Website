"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Reveal } from "@/components/motion";
import { useT } from "@/lib/language";

/** Shared shell for Terms / Privacy so they match the landing page's look. */
export function LegalPage({ doc }: { doc: "privacy" | "terms" }) {
  const t = useT();
  const { title, sections } = t.legal[doc];
  return (
    <section aria-labelledby="legal-title" className="relative min-h-screen overflow-hidden pt-28">
      <div
        aria-hidden
        className="absolute -top-40 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(190,20,40,0.22),transparent)] blur-2xl"
      />
      <div className="container-page relative max-w-3xl pb-24">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> {t.legal.back}
        </Link>
        <Reveal>
          <p className="eyebrow mt-10">MeetingGuard</p>
          <h1 id="legal-title" className="mt-3 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
            {title}
          </h1>
          <p className="mt-3 text-sm text-white/55">{t.legal.updated}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="surface mt-10 space-y-8 rounded-2xl p-6 sm:p-10">
            {sections.map((s) => (
              <div key={s.heading}>
                <h2 className="text-lg font-semibold text-white">{s.heading}</h2>
                <div className="mt-2 leading-relaxed text-white/55">{s.body}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
