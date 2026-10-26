import { Mail, Phone, Quote } from "lucide-react";
import { Reveal } from "@/components/motion";
import { Card, CtaBand, DraftNotice, PageHero, Section, SectionHeading } from "@/components/page/blocks";
import { dictionaries } from "@/lib/i18n";
import type { Lang } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

/*
 * TODO: the founder quote (from Francisco) and the team's first names and
 * roles. Until the quote arrives, the quote card shows a draft notice.
 */
const FOUNDER_QUOTE = { en: "", es: "", name: "Francisco" };
const TEAM = [
  { name: "Francisco", role: { en: "Founder", es: "Fundador" } },
  { name: "Dusko", role: { en: "Product and engineering", es: "Producto e ingeniería" } },
  { name: "Sven", role: { en: "Website", es: "Sitio web" } },
];

const copy = {
  en: {
    meta: { title: "About", description: "Why we built MeetingGuard, who we are and how to reach us." },
    eyebrow: "About",
    line1: "Built for people",
    line2: "whose day is their calendar.",
    story: {
      title: "The story",
      lines: [
        "We kept seeing the same thing: busy people with full calendars, still late for the calls that matter.",
        "Calendars store time. They do not protect it.",
        "So we built an assistant that listens, shows you what it understood and rings until you show up.",
        "In English and Spanish, on iPhone and Android, from day one.",
        "That is MeetingGuard.",
      ],
    },
    quoteDraft: "Founder quote to be added.",
    team: "The team",
    contact: { title: "Contact", body: "Questions, ideas or press: we read every message." },
    cta: ["Come and try it.", "It's free to start."],
  },
  es: {
    meta: { title: "Quiénes somos", description: "Por qué creamos MeetingGuard, quiénes somos y cómo contactarnos." },
    eyebrow: "Quiénes somos",
    line1: "Creado para personas",
    line2: "cuyo día es su calendario.",
    story: {
      title: "La historia",
      lines: [
        "Veíamos siempre lo mismo: personas ocupadas, con calendarios llenos, llegando tarde a las llamadas que importan.",
        "Los calendarios guardan el tiempo. No lo protegen.",
        "Así que creamos un asistente que escucha, te muestra lo que entendió y suena hasta que llegas.",
        "En inglés y español, en iPhone y Android, desde el primer día.",
        "Eso es MeetingGuard.",
      ],
    },
    quoteDraft: "Cita del fundador pendiente.",
    team: "El equipo",
    contact: { title: "Contacto", body: "Preguntas, ideas o prensa: leemos todos los mensajes." },
    cta: ["Ven a probarlo.", "Es gratis para empezar."],
  },
} as const;

export function aboutMetadata(lang: Lang) {
  const c = copy[lang];
  return pageMetadata({ lang, path: "/about", title: c.meta.title, description: c.meta.description });
}

export function AboutPage({ lang }: { lang: Lang }) {
  const c = copy[lang];
  const quote = FOUNDER_QUOTE[lang];
  return (
    <>
      <PageHero eyebrow={c.eyebrow} line1={c.line1} line2={c.line2} />

      <Section className="pt-0 sm:pt-0">
        <Reveal className="mx-auto max-w-2xl">
          <p className="eyebrow text-center">{c.story.title}</p>
          <div className="mt-6 space-y-4 text-center text-[1.15rem] leading-relaxed text-white/75 sm:text-[1.25rem]">
            {c.story.lines.map((l, i) => (
              <p key={l} className={i === c.story.lines.length - 1 ? "font-semibold text-white" : ""}>
                {l}
              </p>
            ))}
          </div>
        </Reveal>
      </Section>

      <Section>
        <Reveal className="mx-auto max-w-3xl">
          {quote ? (
            <figure className="surface rounded-3xl px-8 py-10 text-center">
              <Quote className="mx-auto h-8 w-8 text-accent" aria-hidden />
              <blockquote className="mt-5 text-[1.3rem] leading-relaxed font-medium text-white">{quote}</blockquote>
              <figcaption className="mt-5 text-white/55">{FOUNDER_QUOTE.name}</figcaption>
            </figure>
          ) : (
            <DraftNotice>{c.quoteDraft}</DraftNotice>
          )}
        </Reveal>
      </Section>

      <Section>
        <SectionHeading line1={c.team} />
        <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
          {TEAM.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.06}>
              <Card className="text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white/[0.06] text-[1.1rem] font-semibold text-white/85 ring-1 ring-white/[0.1]">
                  {m.name[0]}
                </span>
                <p className="mt-4 font-semibold text-white">{m.name}</p>
                <p className="mt-1 text-[0.86rem] text-white/55">{m.role[lang]}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading line1={c.contact.title} body={c.contact.body} />
        <Reveal delay={0.1} className="mt-8 flex flex-wrap justify-center gap-3">
          <a href={`mailto:${siteConfig.supportEmail}`} className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/12 px-4 text-[0.9rem] text-white/85 hover:border-white/25">
            <Mail className="h-4 w-4 text-white/50" aria-hidden />
            {siteConfig.supportEmail}
          </a>
          <a href={`tel:${siteConfig.contactPhone}`} className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/12 px-4 text-[0.9rem] text-white/85 hover:border-white/25">
            <Phone className="h-4 w-4 text-white/50" aria-hidden />
            {siteConfig.contactPhoneLabel}
          </a>
        </Reveal>
      </Section>

      <CtaBand line1={c.cta[0]} line2={c.cta[1]} body={dictionaries[lang].cta.sentence} />
    </>
  );
}
