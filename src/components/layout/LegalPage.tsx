import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Reveal } from "@/components/motion";
import { NeonScene } from "@/components/scene/NeonScene";

type LegalPageProps = {
  title: string;
  updated: string;
  sections: { heading: string; body: ReactNode }[];
};

/** Shared shell for Terms / Privacy so they match the landing page's look. */
export function LegalPage({ title, updated, sections }: LegalPageProps) {
  return (
    <section aria-labelledby="legal-title" className="relative min-h-screen overflow-hidden pt-16">
      <NeonScene seed={131} height={0.5} centerOpen={0.4} />
      <div className="container-page relative max-w-3xl py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
        <Reveal>
          <p className="eyebrow mt-8">MeetingGuard</p>
          <h1 id="legal-title" className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mt-2 text-sm text-slate-400">Last updated: {updated}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="glass-panel mt-10 space-y-8 rounded-2xl p-6 sm:p-10">
            {sections.map((s) => (
              <div key={s.heading}>
                <h2 className="font-display text-xl font-semibold text-white">{s.heading}</h2>
                <div className="mt-2 leading-relaxed text-slate-300">{s.body}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
