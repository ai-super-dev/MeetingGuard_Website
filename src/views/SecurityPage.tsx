import { Ban, Building2, Database, EyeOff, Lock, Trash2 } from "lucide-react";
import { CtaBand, PageHero, PointGrid, Section, SectionHeading } from "@/components/page/blocks";
import { dictionaries } from "@/lib/i18n";
import type { Lang } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

// TODO: the Google Cloud region where data is stored (e.g. "europe-west2, London").
const REGION = "";

const copy = (lang: Lang) => {
  const t = dictionaries[lang];
  const region = REGION || t.tbc;
  const number = siteConfig.companyNumber || t.tbc;
  return lang === "en"
    ? {
        meta: { title: "Security and privacy", description: "What MeetingGuard stores and where, how it is protected, what the assistant will and will not read, and how to delete everything." },
        eyebrow: "Security and privacy",
        line1: "Your calendar is private.",
        line2: "We keep it that way.",
        lead: "What we store, where it lives, who can read it, and how to delete it. In plain words.",
        items: [
          { icon: Database, title: "What we store and where", body: `Your meetings, tasks and settings, and the calendars you choose to connect. Stored in Google Cloud, region ${region}.` },
          { icon: Lock, title: "Encrypted", body: "Data is encrypted in transit and at rest. Calendar access uses each provider's official permissions, which you can revoke at any time." },
          { icon: EyeOff, title: "What the assistant reads", body: "Only what a request needs: the meeting or task you ask about, and the email threads it starts for you. It does not read the rest of your inbox." },
          { icon: Ban, title: "No ads, no selling", body: "There are no ads in MeetingGuard and we never sell your data to anyone." },
          { icon: Trash2, title: "Deletion", body: "Delete your account in the app or by email and your data is deleted with it." },
          { icon: Building2, title: "Who we are", body: `MeetingGuard is made by ${siteConfig.company}, a UK company, number ${number}.` },
        ],
        recording: { line1: "We never record", line2: "your meetings.", body: "MeetingGuard does not join or record calls. The coming debrief feature reads the summary your notetaker already sends, only when you allow it." },
        cta: ["Private by design.", "Ready when you are."],
      }
    : {
        meta: { title: "Seguridad y privacidad", description: "Qué guarda MeetingGuard y dónde, cómo se protege, qué leerá el asistente y qué no, y cómo eliminarlo todo." },
        eyebrow: "Seguridad y privacidad",
        line1: "Tu calendario es privado.",
        line2: "Lo mantenemos así.",
        lead: "Qué guardamos, dónde está, quién puede leerlo y cómo eliminarlo. Con palabras claras.",
        items: [
          { icon: Database, title: "Qué guardamos y dónde", body: `Tus reuniones, tareas y ajustes, y los calendarios que decides conectar. Guardados en Google Cloud, región ${region}.` },
          { icon: Lock, title: "Cifrado", body: "Los datos se cifran en tránsito y en reposo. El acceso al calendario usa los permisos oficiales de cada proveedor, que puedes revocar cuando quieras." },
          { icon: EyeOff, title: "Lo que lee el asistente", body: "Solo lo que necesita una petición: la reunión o tarea por la que preguntas y los hilos de correo que inicia por ti. No lee el resto de tu bandeja." },
          { icon: Ban, title: "Sin anuncios, sin venta", body: "MeetingGuard no tiene anuncios y nunca vendemos tus datos a nadie." },
          { icon: Trash2, title: "Eliminación", body: "Elimina tu cuenta en la app o por correo y tus datos se eliminan con ella." },
          { icon: Building2, title: "Quiénes somos", body: `MeetingGuard lo hace ${siteConfig.company}, una empresa del Reino Unido, número ${number}.` },
        ],
        recording: { line1: "Nunca grabamos", line2: "tus reuniones.", body: "MeetingGuard no se une a las llamadas ni las graba. La función de resúmenes que llega lee el resumen que tu herramienta de notas ya envía, solo si lo permites." },
        cta: ["Privado por diseño.", "Listo cuando tú lo estés."],
      };
};

export function securityMetadata(lang: Lang) {
  const c = copy(lang);
  return pageMetadata({ lang, path: "/security", title: c.meta.title, description: c.meta.description });
}

export function SecurityPage({ lang }: { lang: Lang }) {
  const c = copy(lang);
  return (
    <>
      <PageHero eyebrow={c.eyebrow} line1={c.line1} line2={c.line2} lead={c.lead} />
      <Section className="pt-0 sm:pt-0">
        <PointGrid
          items={c.items.map((it) => ({ icon: <it.icon className="h-5 w-5 text-emerald-300" aria-hidden />, title: it.title, body: it.body }))}
        />
      </Section>
      <Section>
        <SectionHeading line1={c.recording.line1} line2={c.recording.line2} body={c.recording.body} />
      </Section>
      <CtaBand line1={c.cta[0]} line2={c.cta[1]} body={dictionaries[lang].cta.sentence} />
    </>
  );
}
