import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Reveal } from "@/components/motion";
import { Headline, Prose } from "@/components/page/blocks";
import { legalDocs, type LegalDocKey } from "@/content/legal";
import { localize, type Lang } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

/*
 * Legal pages at the URLs the store listings and the Meta app point to:
 * /privacy-policy and /terms-of-service. The text lives in src/content/legal.ts.
 */

const BACK = { en: "Back to home", es: "Volver al inicio" };

export function legalMetadata(lang: Lang, doc: LegalDocKey) {
  const d = legalDocs[lang][doc];
  return pageMetadata({ lang, path: d.path, title: d.title, description: d.description });
}

export function LegalDocPage({ lang, doc }: { lang: Lang; doc: LegalDocKey }) {
  const d = legalDocs[lang][doc];
  return (
    <section aria-labelledby="legal-title" className="relative min-h-screen overflow-x-clip pt-32 sm:pt-40">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(190,20,40,0.2),transparent)] blur-2xl"
      />
      <div className="container-page relative max-w-3xl pb-24">
        <Link href={localize("/", lang)} className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white">
          <ArrowLeft className="h-4 w-4" aria-hidden /> {BACK[lang]}
        </Link>
        <Reveal>
          <p className="eyebrow mt-10">MeetingGuard AI</p>
          <Headline as="h1" id="legal-title" line1={d.title} className="mt-3" />
          <p className="mt-3 text-sm text-white/55">{d.updated}</p>
          {d.intro.map((p) => (
            <p key={p} className="mt-6 leading-relaxed text-white/70">
              {p}
            </p>
          ))}
        </Reveal>
        <Reveal delay={0.1} className="mt-10">
          <Prose sections={d.sections} />
        </Reveal>
      </div>
    </section>
  );
}
