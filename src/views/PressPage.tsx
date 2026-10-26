import { Download, Mail } from "lucide-react";
import { Reveal } from "@/components/motion";
import { Card, DraftNotice, PageHero, Section, SectionHeading } from "@/components/page/blocks";
import { AppMark } from "@/components/ui/Logo";
import type { Lang } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { Shot } from "./screens";

const copy = {
  en: {
    meta: { title: "Press", description: "MeetingGuard press kit: description, logo files, screenshots, founder quote and contact." },
    eyebrow: "Press",
    line1: "Press kit.",
    line2: "Everything in one place.",
    about: {
      title: "About MeetingGuard",
      body: `MeetingGuard is an AI meeting assistant for iPhone and Android, made by ${siteConfig.company}. You say or type what you need in English or Spanish, confirm a card, and a full-screen alarm makes sure you show up. It creates, moves and cancels meetings by voice, keeps tasks with reminders, reads your agenda aloud and works through WhatsApp.`,
    },
    logo: { title: "Logo files", icon: "App icon, PNG", note: "Please do not change the colours or proportions." },
    shots: { title: "Screenshots", captions: ["The meeting alarm", "Say it by voice", "The agenda aloud"] },
    quoteDraft: "Founder quote to be added.",
    contact: { title: "Press contact", body: "For interviews, data or images, write to us." },
  },
  es: {
    meta: { title: "Prensa", description: "Kit de prensa de MeetingGuard: descripción, logotipos, capturas, cita del fundador y contacto." },
    eyebrow: "Prensa",
    line1: "Kit de prensa.",
    line2: "Todo en un sitio.",
    about: {
      title: "Sobre MeetingGuard",
      body: `MeetingGuard es un asistente de reuniones con IA para iPhone y Android, creado por ${siteConfig.company}. Dices o escribes lo que necesitas en inglés o español, confirmas una tarjeta y una alarma a pantalla completa se asegura de que llegues. Crea, mueve y cancela reuniones con la voz, gestiona tareas con recordatorios, lee tu agenda en voz alta y funciona por WhatsApp.`,
    },
    logo: { title: "Logotipos", icon: "Icono de la app, PNG", note: "Por favor, no cambies los colores ni las proporciones." },
    shots: { title: "Capturas", captions: ["La alarma de reunión", "Dilo con la voz", "La agenda en voz alta"] },
    quoteDraft: "Cita del fundador pendiente.",
    contact: { title: "Contacto de prensa", body: "Para entrevistas, datos o imágenes, escríbenos." },
  },
} as const;

export function pressMetadata(lang: Lang) {
  const c = copy[lang];
  return pageMetadata({ lang, path: "/press", title: c.meta.title, description: c.meta.description });
}

export function PressPage({ lang }: { lang: Lang }) {
  const c = copy[lang];
  return (
    <>
      <PageHero eyebrow={c.eyebrow} line1={c.line1} line2={c.line2} />
      <Section className="pt-0 sm:pt-0">
        <div className="mx-auto grid max-w-[1000px] gap-4 md:grid-cols-[1.5fr_1fr]">
          <Reveal>
            <Card className="h-full">
              <h2 className="font-semibold text-white">{c.about.title}</h2>
              <p className="mt-3 leading-relaxed text-white/65">{c.about.body}</p>
            </Card>
          </Reveal>
          <Reveal delay={0.08}>
            <Card className="h-full">
              <h2 className="font-semibold text-white">{c.logo.title}</h2>
              <div className="mt-5 flex items-center gap-4">
                <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white/[0.04] ring-1 ring-white/[0.08]">
                  <AppMark className="h-11 w-11" sizes="88px" />
                </span>
                <a href="/icons/app_icon.png" download className="inline-flex items-center gap-2 text-[0.9rem] font-medium text-white/85 hover:text-white">
                  <Download className="h-4 w-4" aria-hidden />
                  {c.logo.icon}
                </a>
              </div>
              <p className="mt-4 text-[0.8rem] text-white/45">{c.logo.note}</p>
            </Card>
          </Reveal>
        </div>
      </Section>

      <Section>
        <SectionHeading line1={c.shots.title} />
        <div className="mx-auto mt-12 grid max-w-[1000px] gap-12 md:grid-cols-3">
          {(["alarm", "voice", "agenda"] as const).map((s, i) => (
            <Reveal key={s} delay={i * 0.08} className="flex flex-col items-center">
              <Shot screen={s} kind="iphone" lang={lang} bodyHeight={400} />
              <p className="mt-6 text-[0.9rem] text-white/70">{c.shots.captions[i]}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <DraftNotice>{c.quoteDraft}</DraftNotice>
        <SectionHeading line1={c.contact.title} body={c.contact.body} />
        <div className="mt-8 flex justify-center">
          <a href={`mailto:${siteConfig.supportEmail}`} className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/12 px-4 text-[0.9rem] text-white/85 hover:border-white/25">
            <Mail className="h-4 w-4 text-white/50" aria-hidden />
            {siteConfig.supportEmail}
          </a>
        </div>
      </Section>
    </>
  );
}
