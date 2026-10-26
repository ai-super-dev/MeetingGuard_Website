import { HelpCircle, Mail, Phone, Star, Trash2 } from "lucide-react";
import { ContactForm } from "@/components/forms/Forms";
import { Reveal } from "@/components/motion";
import { ArrowLink, Card, PageHero, Section } from "@/components/page/blocks";
import { localize, type Lang } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

const copy = {
  en: {
    meta: { title: "Support", description: "Contact MeetingGuard support, find answers in the FAQ, delete your account or leave a review." },
    eyebrow: "Support",
    line1: "How can we",
    line2: "help?",
    lead: "Send us a message and we will reply by email. Many answers are already in the FAQ.",
    formTitle: "Send a message",
    faq: { title: "Read the FAQ", body: "Twenty questions on getting started, voice, alarms, WhatsApp, billing and privacy.", link: "Open the FAQ" },
    delete: { title: "Delete your account", body: "In the app, or by email. Everything is deleted with it.", link: "See the steps" },
    review: { title: "Enjoying MeetingGuard?", body: "A review in the store helps other busy people find it.", appStore: "Review on the App Store", googlePlay: "Review on Google Play" },
    direct: "Or write to us directly",
  },
  es: {
    meta: { title: "Soporte", description: "Contacta con el soporte de MeetingGuard, encuentra respuestas en las preguntas frecuentes, elimina tu cuenta o deja una valoración." },
    eyebrow: "Soporte",
    line1: "¿Cómo podemos",
    line2: "ayudarte?",
    lead: "Envíanos un mensaje y te responderemos por correo. Muchas respuestas ya están en las preguntas frecuentes.",
    formTitle: "Envía un mensaje",
    faq: { title: "Lee las preguntas frecuentes", body: "Veinte preguntas sobre primeros pasos, voz, alarmas, WhatsApp, facturación y privacidad.", link: "Abrir preguntas" },
    delete: { title: "Elimina tu cuenta", body: "En la app o por correo. Todo se elimina con ella.", link: "Ver los pasos" },
    review: { title: "¿Te gusta MeetingGuard?", body: "Una valoración en la tienda ayuda a otras personas ocupadas a encontrarlo.", appStore: "Valorar en el App Store", googlePlay: "Valorar en Google Play" },
    direct: "O escríbenos directamente",
  },
} as const;

export function supportMetadata(lang: Lang) {
  const c = copy[lang];
  return pageMetadata({ lang, path: "/support", title: c.meta.title, description: c.meta.description });
}

export function SupportPage({ lang }: { lang: Lang }) {
  const c = copy[lang];
  return (
    <>
      <PageHero eyebrow={c.eyebrow} line1={c.line1} line2={c.line2} lead={c.lead} />
      <Section className="pt-0 pb-24 sm:pt-0 sm:pb-32">
        <div className="mx-auto grid max-w-[1040px] gap-4 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <Card>
              <h2 className="text-[1.15rem] font-semibold text-white">{c.formTitle}</h2>
              <div className="mt-6">
                <ContactForm />
              </div>
              <div className="mt-8 border-t border-white/[0.07] pt-6">
                <p className="text-[0.82rem] text-white/50">{c.direct}</p>
                <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-[0.9rem]">
                  <a href={`mailto:${siteConfig.supportEmail}`} className="inline-flex items-center gap-2 text-white/80 hover:text-white">
                    <Mail className="h-4 w-4 text-white/45" aria-hidden />
                    {siteConfig.supportEmail}
                  </a>
                  <a href={`tel:${siteConfig.contactPhone}`} className="inline-flex items-center gap-2 text-white/80 hover:text-white">
                    <Phone className="h-4 w-4 text-white/45" aria-hidden />
                    {siteConfig.contactPhoneLabel}
                  </a>
                </div>
              </div>
            </Card>
          </Reveal>
          <div className="grid gap-4">
            <Reveal delay={0.06}>
              <Card>
                <HelpCircle className="h-5 w-5 text-white/70" aria-hidden />
                <h2 className="mt-4 font-semibold text-white">{c.faq.title}</h2>
                <p className="mt-1.5 text-[0.88rem] leading-relaxed text-white/60">{c.faq.body}</p>
                <ArrowLink href={localize("/faq", lang)} className="mt-4">
                  {c.faq.link}
                </ArrowLink>
              </Card>
            </Reveal>
            <Reveal delay={0.12}>
              <Card>
                <Trash2 className="h-5 w-5 text-white/70" aria-hidden />
                <h2 className="mt-4 font-semibold text-white">{c.delete.title}</h2>
                <p className="mt-1.5 text-[0.88rem] leading-relaxed text-white/60">{c.delete.body}</p>
                <ArrowLink href={localize("/delete-account", lang)} className="mt-4">
                  {c.delete.link}
                </ArrowLink>
              </Card>
            </Reveal>
            <Reveal delay={0.18}>
              <Card>
                <Star className="h-5 w-5 text-[#ffd9a0]" aria-hidden />
                <h2 className="mt-4 font-semibold text-white">{c.review.title}</h2>
                <p className="mt-1.5 text-[0.88rem] leading-relaxed text-white/60">{c.review.body}</p>
                <div className="mt-4 flex flex-col gap-2">
                  <a href={siteConfig.appStoreReviewUrl} className="text-[0.88rem] font-medium text-white/85 underline-offset-2 hover:text-white hover:underline">
                    {c.review.appStore}
                  </a>
                  <a href={siteConfig.playStoreReviewUrl} className="text-[0.88rem] font-medium text-white/85 underline-offset-2 hover:text-white hover:underline">
                    {c.review.googlePlay}
                  </a>
                </div>
              </Card>
            </Reveal>
          </div>
        </div>
      </Section>
    </>
  );
}
