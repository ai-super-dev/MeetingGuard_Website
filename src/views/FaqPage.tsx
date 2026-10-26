import { faq, faqGroupItems } from "@/content/faq";
import { Reveal } from "@/components/motion";
import { ButtonLink, CtaBand, PageHero, Section } from "@/components/page/blocks";
import { FaqAccordion } from "@/components/page/FaqAccordion";
import { dictionaries } from "@/lib/i18n";
import { localize, type Lang } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

const copy = {
  en: {
    meta: { title: "FAQ", description: "Answers about getting started, voice, alarms, WhatsApp, billing and privacy." },
    eyebrow: "FAQ",
    line1: "Questions,",
    line2: "answered.",
    lead: "Short answers, with a link when there is more to read.",
    more: "Still need help?",
    support: "Contact support",
    cta: ["Ready to try it?", "It's free to start."],
  },
  es: {
    meta: { title: "Preguntas frecuentes", description: "Respuestas sobre primeros pasos, voz, alarmas, WhatsApp, facturación y privacidad." },
    eyebrow: "Preguntas frecuentes",
    line1: "Preguntas,",
    line2: "resueltas.",
    lead: "Respuestas cortas, con un enlace cuando hay más que leer.",
    more: "¿Necesitas más ayuda?",
    support: "Contactar con soporte",
    cta: ["¿Listo para probarlo?", "Es gratis para empezar."],
  },
} as const;

export function faqMetadata(lang: Lang) {
  const c = copy[lang];
  return pageMetadata({ lang, path: "/faq", title: c.meta.title, description: c.meta.description });
}

export function FaqPage({ lang }: { lang: Lang }) {
  const c = copy[lang];
  const groups = faq[lang];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: groups.flatMap((g) => g.items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } }))),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <PageHero eyebrow={c.eyebrow} line1={c.line1} line2={c.line2} lead={c.lead}>
        <nav aria-label={c.eyebrow} className="flex flex-wrap justify-center gap-2">
          {groups.map((g) => (
            <a key={g.id} href={`#${g.id}`} className="rounded-full border border-white/10 px-3.5 py-1.5 text-[0.82rem] text-white/70 transition hover:border-white/25 hover:text-white">
              {g.title}
            </a>
          ))}
        </nav>
      </PageHero>

      <Section className="pt-0 sm:pt-0">
        <div className="mx-auto max-w-3xl space-y-12">
          {groups.map((g) => (
            <Reveal key={g.id}>
              <section id={g.id} aria-labelledby={`${g.id}-title`} className="scroll-mt-28">
                <h2 id={`${g.id}-title`} className="eyebrow mb-4">
                  {g.title}
                </h2>
                <FaqAccordion items={faqGroupItems(lang, g.id)} />
              </section>
            </Reveal>
          ))}
        </div>
        <div className="mt-14 text-center">
          <p className="text-white/60">{c.more}</p>
          <div className="mt-4 flex justify-center">
            <ButtonLink href={localize("/support", lang)}>{c.support}</ButtonLink>
          </div>
        </div>
      </Section>

      <CtaBand line1={c.cta[0]} line2={c.cta[1]} body={dictionaries[lang].cta.sentence} />
    </>
  );
}
