import Link from "next/link";
import { ArrowUpRight, Smartphone, Sparkles } from "lucide-react";
import { faqGroupItems } from "@/content/faq";
import { Reveal } from "@/components/motion";
import { AvailableLabel, CtaBand, DraftNotice, PageHero, Section, SectionHeading } from "@/components/page/blocks";
import { FaqAccordion } from "@/components/page/FaqAccordion";
import { PricingPlans, type Plan } from "@/components/page/PricingPlans";
import { dictionaries } from "@/lib/i18n";
import { localize, type Lang } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

/*
 * Prices from the brief: Pro from USD 7.99 a month, Google Play yearly 69.99
 * (Pro) and 134.99 (Premium). TODO: the Premium monthly price and each plan's
 * feature list must match the app's paywall exactly; replace the draft lists
 * below and remove the DraftNotice once they are confirmed.
 */
const PRO_MONTHLY = 7.99;
const PRO_YEARLY = 69.99;
const PREMIUM_YEARLY = 134.99;
const saving = Math.round((1 - PRO_YEARLY / (PRO_MONTHLY * 12)) * 100); // 27

const copy = {
  en: {
    meta: { title: "Pricing", description: "MeetingGuard is free to start. Pro from USD 7.99 a month with a 3-day free trial. Subscriptions are bought inside the app." },
    eyebrow: "Pricing",
    line1: "Simple plans.",
    line2: "Start free.",
    lead: "Use MeetingGuard for free, or upgrade for more. Every paid plan starts with a 3-day free trial.",
    draft: "Draft: plan details and the Premium monthly price are placeholders until they are matched with the app.",
    labels: { monthly: "Monthly", yearly: "Yearly", perMonth: "/ month", perYear: "/ year", popular: "Most popular", billing: "Billing period" },
    plans: [
      { id: "free", name: "Free", blurb: "Everything you need to stop missing meetings.", monthly: "USD 0", yearly: "USD 0", features: ["Meetings with full-screen alarms", "Google Calendar sync", "English and Spanish"] },
      {
        id: "pro",
        name: "Pro",
        blurb: "Your assistant for a full calendar.",
        monthly: `USD ${PRO_MONTHLY}`,
        yearly: `USD ${PRO_YEARLY}`,
        saving: `Save ${saving}%`,
        trial: "3-day free trial",
        highlight: true,
        features: ["Everything in Free", "Voice assistant", "Tasks and reminders", "Agenda aloud and daily briefing", "WhatsApp"],
      },
      {
        id: "premium",
        name: "Premium",
        blurb: "For the busiest calendars.",
        monthly: "USD TBC",
        yearly: `USD ${PREMIUM_YEARLY}`,
        trial: "3-day free trial",
        features: ["Everything in Pro", "Premium features TBC"],
      },
    ],
    store: {
      title: "Bought in the app",
      body: "Subscriptions are purchased inside the app on Google Play or the App Store. There is no checkout on this website. Prices are in USD and the store shows your local price.",
    },
    assistant: { name: "Executive assistant", body: "Delegate by voice. Add-on subscription.", link: "What it will do" },
    faq: {
      title: "Billing questions",
      family: { q: "Can my family share one subscription?", a: "A subscription belongs to one MeetingGuard account. Each person needs their own account and plan." },
      trial: { q: "How does the free trial work?", a: "Pro and Premium start with 3 days free. Cancel in your store subscriptions before the trial ends and you are not charged." },
    },
    cta: ["Start free", "in a minute."],
  },
  es: {
    meta: { title: "Precios", description: "MeetingGuard es gratis para empezar. Pro desde 7,99 USD al mes con 3 días de prueba gratis. Las suscripciones se compran dentro de la app." },
    eyebrow: "Precios",
    line1: "Planes sencillos.",
    line2: "Empieza gratis.",
    lead: "Usa MeetingGuard gratis, o mejora para tener más. Todos los planes de pago empiezan con 3 días de prueba gratis.",
    draft: "Borrador: los detalles de los planes y el precio mensual de Premium son provisionales hasta confirmarlos con la app.",
    labels: { monthly: "Mensual", yearly: "Anual", perMonth: "/ mes", perYear: "/ año", popular: "El más elegido", billing: "Periodo de facturación" },
    plans: [
      { id: "free", name: "Gratis", blurb: "Todo lo que necesitas para no perderte reuniones.", monthly: "0 USD", yearly: "0 USD", features: ["Reuniones con alarmas a pantalla completa", "Sincronización con Google Calendar", "Inglés y español"] },
      {
        id: "pro",
        name: "Pro",
        blurb: "Tu asistente para un calendario lleno.",
        monthly: `${String(PRO_MONTHLY).replace(".", ",")} USD`,
        yearly: `${String(PRO_YEARLY).replace(".", ",")} USD`,
        saving: `Ahorra un ${saving}%`,
        trial: "3 días de prueba gratis",
        highlight: true,
        features: ["Todo lo de Gratis", "Asistente de voz", "Tareas y recordatorios", "Agenda en voz alta y resumen diario", "WhatsApp"],
      },
      {
        id: "premium",
        name: "Premium",
        blurb: "Para los calendarios más ocupados.",
        monthly: "Por confirmar",
        yearly: `${String(PREMIUM_YEARLY).replace(".", ",")} USD`,
        trial: "3 días de prueba gratis",
        features: ["Todo lo de Pro", "Funciones Premium por confirmar"],
      },
    ],
    store: {
      title: "Se compra en la app",
      body: "Las suscripciones se compran dentro de la app en Google Play o el App Store. No hay pago en este sitio web. Los precios están en USD y la tienda te muestra tu precio local.",
    },
    assistant: { name: "Asistente ejecutivo", body: "Delega con la voz. Suscripción adicional.", link: "Qué hará" },
    faq: {
      title: "Preguntas sobre facturación",
      family: { q: "¿Mi familia puede compartir una suscripción?", a: "Una suscripción pertenece a una cuenta de MeetingGuard. Cada persona necesita su propia cuenta y plan." },
      trial: { q: "¿Cómo funciona la prueba gratis?", a: "Pro y Premium empiezan con 3 días gratis. Cancela en las suscripciones de tu tienda antes de que termine la prueba y no se te cobra." },
    },
    cta: ["Empieza gratis", "en un minuto."],
  },
} as const;

export function pricingMetadata(lang: Lang) {
  const c = copy[lang];
  return pageMetadata({ lang, path: "/pricing", title: c.meta.title, description: c.meta.description });
}

export function PricingPage({ lang }: { lang: Lang }) {
  const c = copy[lang];
  const t = dictionaries[lang];
  const faq = [c.faq.trial, ...faqGroupItems(lang, "billing"), c.faq.family];
  return (
    <>
      <PageHero eyebrow={c.eyebrow} line1={c.line1} line2={c.line2} lead={c.lead} />

      <Section className="pt-0 sm:pt-0">
        <DraftNotice>{c.draft}</DraftNotice>
        <Reveal>
          <PricingPlans plans={c.plans as unknown as Plan[]} labels={c.labels} />
        </Reveal>

        {/* the assistant plan row, coming soon */}
        <Reveal delay={0.1} className="mx-auto mt-4 max-w-[1040px]">
          <Link
            href={localize("/assistant", lang)}
            className="group surface flex flex-col gap-4 rounded-2xl p-6 transition-colors hover:border-white/[0.14] sm:flex-row sm:items-center"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#ffd9a0]/10 text-[#ffd9a0]">
              <Sparkles className="h-5 w-5" aria-hidden />
            </span>
            <span className="flex-1">
              <span className="flex flex-wrap items-center gap-3">
                <span className="font-semibold text-white">{c.assistant.name}</span>
                <AvailableLabel>{t.comingSoon}</AvailableLabel>
              </span>
              <span className="mt-1 block text-[0.88rem] text-white/55">{c.assistant.body}</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[0.85rem] font-medium text-white/70 group-hover:text-white">
              {c.assistant.link}
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </span>
          </Link>
        </Reveal>

        <Reveal delay={0.15} className="mx-auto mt-10 flex max-w-2xl items-start gap-4 text-left">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/[0.05] text-white/70 ring-1 ring-white/[0.08]">
            <Smartphone className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <p className="font-medium text-white">{c.store.title}</p>
            <p className="mt-1 text-[0.9rem] leading-relaxed text-white/60">{c.store.body}</p>
          </div>
        </Reveal>
      </Section>

      <Section>
        <SectionHeading eyebrow={t.common.questions} line1={c.faq.title} />
        <Reveal delay={0.1} className="mx-auto mt-10 max-w-3xl">
          <FaqAccordion items={faq} defaultOpen={0} />
        </Reveal>
      </Section>

      <CtaBand line1={c.cta[0]} line2={c.cta[1]} body={t.cta.sentence} />
    </>
  );
}
