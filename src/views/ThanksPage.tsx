import { CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/motion";
import { ButtonLink, Headline } from "@/components/page/blocks";
import { localize, type Lang } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

const copy = {
  en: { title: "Thanks", line1: "Thanks.", line2: "We got your message.", body: "We will reply by email, usually within one working day.", home: "Back to home", faq: "Read the FAQ" },
  es: { title: "Gracias", line1: "Gracias.", line2: "Hemos recibido tu mensaje.", body: "Te responderemos por correo, normalmente en un día laborable.", home: "Volver al inicio", faq: "Leer las preguntas frecuentes" },
} as const;

export function thanksMetadata(lang: Lang) {
  const c = copy[lang];
  return pageMetadata({ lang, path: "/thanks", title: c.title, description: c.body, noindex: true });
}

/** Shown after the waitlist and contact forms. */
export function ThanksPage({ lang }: { lang: Lang }) {
  const c = copy[lang];
  return (
    <section className="relative grid min-h-[80vh] place-items-center overflow-x-clip px-5 pt-32 pb-24">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 left-1/2 h-[420px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(52,211,153,0.16),transparent)] blur-2xl"
      />
      <Reveal className="relative text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-300" aria-hidden />
        <Headline as="h1" line1={c.line1} line2={c.line2} className="mt-6" />
        <p className="mx-auto mt-4 max-w-md text-white/60">{c.body}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href={localize("/", lang)} primary>
            {c.home}
          </ButtonLink>
          <ButtonLink href={localize("/faq", lang)}>{c.faq}</ButtonLink>
        </div>
      </Reveal>
    </section>
  );
}
