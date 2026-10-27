import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Reveal } from "@/components/motion";
import { DraftNotice, Headline, Prose } from "@/components/page/blocks";
import { localize, type Lang } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

/*
 * Legal pages at the URLs the store listings and the Meta app point to:
 * /privacy-policy and /terms-of-service.
 *
 * TODO before launch: replace the privacy policy and terms below with the
 * existing texts, unchanged, and remove their `draft` notices.
 */

type Doc = "privacy" | "terms";
type Section = { heading: string; body: string[]; list?: string[] };
type LegalDoc = { path: string; title: string; description: string; draft?: string; sections: Section[] };

const UPDATED = { en: "Last updated: October 26, 2026", es: "Última actualización: 26 de octubre de 2026" };
const BACK = { en: "Back to home", es: "Volver al inicio" };

const docs: Record<Lang, Record<Doc, LegalDoc>> = {
  en: {
    privacy: {
      path: "/privacy-policy",
      title: "Privacy policy",
      description: "How MeetingGuard collects, uses and protects your calendar and meeting data.",
      draft: "Placeholder text. The current privacy policy will be added here unchanged before launch.",
      sections: [
        { heading: "What we collect", body: ["Meeting titles, times, attendees and join links from the calendars you choose to connect, the tasks you create, your settings, and basic app diagnostics."] },
        { heading: "How we use it", body: ["Only to schedule meetings and tasks, deliver reminders and alarms, read your agenda and let you join with one tap. We never sell your data and there are no ads."] },
        { heading: "Your controls", body: ["You can disconnect any calendar at any time and delete your account and data from within the app or by email."] },
        { heading: "Security", body: ["Data is encrypted in transit and at rest, and calendar access uses the providers' official, revocable permissions."] },
        { heading: "Contact", body: [`${siteConfig.company}, ${siteConfig.supportEmail}.`] },
      ],
    },
    terms: {
      path: "/terms-of-service",
      title: "Terms of service",
      description: "The terms that govern your use of the MeetingGuard app and website.",
      draft: "Placeholder text. The current terms of service will be added here unchanged before launch.",
      sections: [
        { heading: "1. Acceptance of terms", body: ["By downloading or using MeetingGuard you agree to these terms. If you do not agree, please do not use the app."] },
        { heading: "2. Your account", body: ["You are responsible for the calendars and accounts you connect, and for keeping your sign-in details secure."] },
        { heading: "3. Subscriptions", body: ["Paid plans are bought and managed in Google Play or the App Store, under the store's terms."] },
        { heading: "4. Acceptable use", body: ["Do not misuse the service, interfere with its operation, or use it to send unsolicited invitations or messages."] },
        { heading: "5. Changes", body: ["We may update these terms. Continued use after changes take effect means you accept the revised terms."] },
      ],
    },
  },
  es: {
    privacy: {
      path: "/privacy-policy",
      title: "Política de privacidad",
      description: "Cómo recopila, usa y protege MeetingGuard los datos de tu calendario y tus reuniones.",
      draft: "Texto provisional. La política de privacidad actual se añadirá aquí sin cambios antes del lanzamiento.",
      sections: [
        { heading: "Qué recopilamos", body: ["Títulos, horarios, asistentes y enlaces de las reuniones de los calendarios que decidas conectar, las tareas que creas, tus ajustes y diagnósticos básicos de la app."] },
        { heading: "Cómo lo usamos", body: ["Solo para programar reuniones y tareas, enviar recordatorios y alarmas, leer tu agenda y permitirte unirte con un toque. Nunca vendemos tus datos y no hay anuncios."] },
        { heading: "Tus controles", body: ["Puedes desconectar cualquier calendario cuando quieras y eliminar tu cuenta y tus datos desde la app o por correo."] },
        { heading: "Seguridad", body: ["Los datos se cifran en tránsito y en reposo, y el acceso al calendario usa los permisos oficiales y revocables de cada proveedor."] },
        { heading: "Contacto", body: [`${siteConfig.company}, ${siteConfig.supportEmail}.`] },
      ],
    },
    terms: {
      path: "/terms-of-service",
      title: "Términos del servicio",
      description: "Los términos que rigen el uso de la app y el sitio web de MeetingGuard.",
      draft: "Texto provisional. Los términos del servicio actuales se añadirán aquí sin cambios antes del lanzamiento.",
      sections: [
        { heading: "1. Aceptación de los términos", body: ["Al descargar o usar MeetingGuard aceptas estos términos. Si no estás de acuerdo, no uses la app."] },
        { heading: "2. Tu cuenta", body: ["Eres responsable de los calendarios y cuentas que conectas, y de mantener seguros tus datos de acceso."] },
        { heading: "3. Suscripciones", body: ["Los planes de pago se compran y gestionan en Google Play o el App Store, según los términos de cada tienda."] },
        { heading: "4. Uso aceptable", body: ["No hagas un uso indebido del servicio, no interfieras en su funcionamiento ni lo uses para enviar invitaciones o mensajes no solicitados."] },
        { heading: "5. Cambios", body: ["Podemos actualizar estos términos. Seguir usando la app después de los cambios implica que aceptas los términos revisados."] },
      ],
    },
  },
};

export function legalMetadata(lang: Lang, doc: Doc) {
  const d = docs[lang][doc];
  return pageMetadata({ lang, path: d.path, title: d.title, description: d.description });
}

export function LegalDocPage({ lang, doc }: { lang: Lang; doc: Doc }) {
  const d = docs[lang][doc];
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
          <p className="eyebrow mt-10">MeetingGuard</p>
          <Headline as="h1" id="legal-title" line1={d.title} className="mt-3" />
          <p className="mt-3 text-sm text-white/55">{UPDATED[lang]}</p>
        </Reveal>
        <Reveal delay={0.1} className="mt-10">
          {d.draft && <DraftNotice>{d.draft}</DraftNotice>}
          <Prose sections={d.sections} />
        </Reveal>
      </div>
    </section>
  );
}
