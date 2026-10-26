import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Reveal } from "@/components/motion";
import { DraftNotice, Headline, Prose } from "@/components/page/blocks";
import { ConsentSettings } from "@/components/page/ConsentSettings";
import { localize, type Lang } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

/*
 * Legal pages at the URLs the store listings and the Meta app point to:
 * /privacy-policy, /terms-of-service, /delete-account, /cookies.
 *
 * TODO before launch: replace the privacy policy and terms below with the
 * existing texts, unchanged, and remove their `draft` notices. The
 * delete-account steps should be checked against the app.
 */

type Doc = "privacy" | "terms" | "deleteAccount" | "cookies";
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
    deleteAccount: {
      path: "/delete-account",
      title: "Delete your account",
      description: "How to delete your MeetingGuard account and all the data that goes with it.",
      sections: [
        {
          heading: "In the app",
          body: ["The quickest way. Your account and data are deleted straight away."],
          list: ["Open MeetingGuard and go to Settings.", "Tap Account, then Delete account.", "Confirm. You are signed out and your data is deleted."],
        },
        {
          heading: "By email",
          body: [`If you no longer have the app, email ${siteConfig.supportEmail} from the address you signed up with, with the subject "Delete my account". We confirm by email when it is done.`],
        },
        {
          heading: "What is deleted",
          body: ["Everything MeetingGuard stores about you:"],
          list: [
            "Your account and settings.",
            "Meetings and tasks created in MeetingGuard, and the connection to your calendars.",
            "Your linked WhatsApp number and the messages you sent to MeetingGuard.",
            "Voice requests and their text.",
          ],
        },
        {
          heading: "What is not deleted",
          body: [
            "Events already in your own Google Calendar stay there; delete them in your calendar if you want to.",
            "Subscriptions are managed by Google Play or the App Store. Cancel yours there so you are not charged again; the stores keep their own purchase records.",
          ],
        },
      ],
    },
    cookies: {
      path: "/cookies",
      title: "Cookies",
      description: "Which cookies and similar storage the MeetingGuard website uses, and how to change your choice.",
      sections: [
        { heading: "Strictly necessary", body: ["The site stores your analytics choice in your browser so it does not ask again. This is not used to identify you."] },
        {
          heading: "Analytics, only with your consent",
          body: ["If you accept, we use Google Analytics to understand how the site is used: pages visited, store badge clicks, form submissions, video plays and how far pages are scrolled. It sets cookies such as _ga. If you decline, no analytics cookies are set."],
        },
        { heading: "No advertising cookies", body: ["We do not use advertising or tracking cookies, and we never sell data."] },
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
    deleteAccount: {
      path: "/delete-account",
      title: "Eliminar tu cuenta",
      description: "Cómo eliminar tu cuenta de MeetingGuard y todos los datos asociados.",
      sections: [
        {
          heading: "En la app",
          body: ["La forma más rápida. Tu cuenta y tus datos se eliminan al momento."],
          list: ["Abre MeetingGuard y ve a Ajustes.", "Toca Cuenta y después Eliminar cuenta.", "Confirma. Se cierra tu sesión y tus datos se eliminan."],
        },
        {
          heading: "Por correo",
          body: [`Si ya no tienes la app, escribe a ${siteConfig.supportEmail} desde la dirección con la que te registraste, con el asunto "Eliminar mi cuenta". Te confirmamos por correo cuando esté hecho.`],
        },
        {
          heading: "Qué se elimina",
          body: ["Todo lo que MeetingGuard guarda sobre ti:"],
          list: [
            "Tu cuenta y tus ajustes.",
            "Las reuniones y tareas creadas en MeetingGuard, y la conexión con tus calendarios.",
            "Tu número de WhatsApp vinculado y los mensajes que enviaste a MeetingGuard.",
            "Las peticiones de voz y su texto.",
          ],
        },
        {
          heading: "Qué no se elimina",
          body: [
            "Los eventos que ya están en tu propio Google Calendar siguen allí; elimínalos en tu calendario si quieres.",
            "Las suscripciones las gestionan Google Play o el App Store. Cancela la tuya allí para que no se te vuelva a cobrar; las tiendas guardan sus propios registros de compra.",
          ],
        },
      ],
    },
    cookies: {
      path: "/cookies",
      title: "Cookies",
      description: "Qué cookies y almacenamiento similar usa el sitio web de MeetingGuard, y cómo cambiar tu elección.",
      sections: [
        { heading: "Estrictamente necesarias", body: ["El sitio guarda tu elección sobre la analítica en tu navegador para no volver a preguntarte. No se usa para identificarte."] },
        {
          heading: "Analítica, solo con tu consentimiento",
          body: ["Si aceptas, usamos Google Analytics para entender cómo se usa el sitio: páginas visitadas, clics en las insignias de las tiendas, envíos de formularios, reproducciones de vídeo y hasta dónde se desplazan las páginas. Usa cookies como _ga. Si rechazas, no se instala ninguna cookie de analítica."],
        },
        { heading: "Sin cookies publicitarias", body: ["No usamos cookies publicitarias ni de seguimiento, y nunca vendemos datos."] },
      ],
    },
  },
};

const consentLabels = {
  en: { current: "Your analytics choice", granted: "Allowed", denied: "Declined", unset: "Not chosen yet", allow: "Allow analytics", refuse: "Decline analytics" },
  es: { current: "Tu elección de analítica", granted: "Permitida", denied: "Rechazada", unset: "Sin elegir", allow: "Permitir analítica", refuse: "Rechazar analítica" },
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
          {doc === "cookies" && <ConsentSettings labels={consentLabels[lang]} />}
        </Reveal>
      </div>
    </section>
  );
}
