import { Check, CloudOff, Minus, RefreshCw, Wifi } from "lucide-react";
import { Reveal } from "@/components/motion";
import { ArrowLink, CheckList, CtaBand, PageHero, PointGrid, Section, SectionHeading, Tag } from "@/components/page/blocks";
import { VideoBlock } from "@/components/page/VideoBlock";
import { StoreBadges } from "@/components/ui/StoreBadges";
import { dictionaries } from "@/lib/i18n";
import { localize, type Lang } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { Shot } from "./screens";

const copy = {
  en: {
    meta: { title: "How it works", description: "Say it, confirm it, never miss it. The voice flow, alarms over the lock screen, the agenda aloud, the morning summary and what changes between Android and iPhone." },
    eyebrow: "How it works",
    line1: "From one sentence",
    line2: "to never missing it.",
    lead: "MeetingGuard listens, shows you what it understood, and rings before every meeting. Here is the whole flow, and what is different on Android and iPhone.",
    video: { title: "MeetingGuard in 90 seconds", pending: "Video with English and Spanish captions, coming in November" },
    voice: {
      eyebrow: "1 · The voice flow",
      line1: "Speak, check the card,",
      line2: "confirm.",
      body: "Tap the microphone and talk in plain words. MeetingGuard turns it into a card. Nothing is saved until you confirm.",
      steps: [
        { title: "Speak", body: "Create, move or cancel, in English or Spanish." },
        { title: "The card", body: "Title, time, people, the call link and any task." },
        { title: "Confirm", body: "Saved to your calendar, invitations sent, alarm set." },
      ],
    },
    alarms: {
      eyebrow: "2 · Alarms over the lock screen",
      line1: "Fifteen minutes before,",
      line2: "your phone rings.",
      body: "A full-screen alarm with sound and the meeting read aloud, even with the app closed and the phone locked.",
      points: ["Snooze 5 or 10 minutes, or dismiss", "Join now opens the call", "Follow-ups until you respond", "Set again after a restart"],
      link: "More about alarms",
    },
    agenda: {
      eyebrow: "3 · The agenda aloud",
      line1: "Ask what's on,",
      line2: "and hear it.",
      body: 'Say "What do I have tomorrow?" or tap play. MeetingGuard reads today, what is overdue and tomorrow.',
      points: ["Meetings and tasks together", "In English or Spanish", "Hands free"],
      link: "More about the agenda",
    },
    summary: {
      eyebrow: "4 · The morning summary",
      line1: "Your day on one screen,",
      line2: "when you wake up.",
      body: "At the time you choose, a daily briefing reads your day. On Android, a full-screen summary is waiting for you too.",
      points: ["Daily briefing at your time", "First meeting and overdue tasks", "Start my day with one tap"],
    },
    offline: {
      eyebrow: "5 · Offline",
      line1: "No signal?",
      line2: "Your alarms still ring.",
      items: [
        { title: "Alarms ring offline", body: "Alarms are scheduled on your phone, so they ring with no connection." },
        { title: "Requests need a connection", body: "Creating or changing meetings by voice or WhatsApp needs the internet." },
        { title: "It catches up", body: "Changes made in your calendar sync as soon as you are back online." },
      ],
    },
    platforms: {
      eyebrow: "6 · Android and iPhone",
      line1: "The same assistant,",
      line2: "honest differences.",
      body: "Most things work the same on both. Where the phone's system sets the rules, we say so.",
      head: ["", "Android", "iPhone"],
      rows: [
        { name: "Voice assistant, English and Spanish", android: true, iphone: true },
        { name: "Alarm before every meeting", android: "Full screen, over the lock screen", iphone: "With sound on the lock screen" },
        { name: "Snooze, dismiss and join from the alarm", android: true, iphone: true },
        { name: "Agenda aloud and daily briefing", android: true, iphone: true },
        { name: "Full-screen morning summary", android: true, iphone: false },
        { name: "WhatsApp", android: true, iphone: true },
      ],
    },
    cta: ["See it on", "your own calendar."],
  },
  es: {
    meta: { title: "Cómo funciona", description: "Dilo, confírmalo y no te lo pierdas. El flujo por voz, las alarmas en la pantalla de bloqueo, la agenda en voz alta, el resumen matinal y las diferencias entre Android y iPhone." },
    eyebrow: "Cómo funciona",
    line1: "De una frase",
    line2: "a no perderte nada.",
    lead: "MeetingGuard escucha, te muestra lo que entendió y suena antes de cada reunión. Este es el recorrido completo, y lo que cambia entre Android y iPhone.",
    video: { title: "MeetingGuard en 90 segundos", pending: "Vídeo con subtítulos en inglés y español, disponible en noviembre" },
    voice: {
      eyebrow: "1 · El flujo por voz",
      line1: "Habla, revisa la tarjeta,",
      line2: "confirma.",
      body: "Toca el micrófono y habla con tus palabras. MeetingGuard lo convierte en una tarjeta. No se guarda nada hasta que confirmas.",
      steps: [
        { title: "Habla", body: "Crea, mueve o cancela, en inglés o español." },
        { title: "La tarjeta", body: "Título, hora, personas, enlace y cualquier tarea." },
        { title: "Confirma", body: "Guardada en tu calendario, invitaciones enviadas, alarma programada." },
      ],
    },
    alarms: {
      eyebrow: "2 · Alarmas en la pantalla de bloqueo",
      line1: "Quince minutos antes,",
      line2: "tu teléfono suena.",
      body: "Una alarma a pantalla completa con sonido y la reunión leída en voz alta, incluso con la app cerrada y el teléfono bloqueado.",
      points: ["Pospón 5 o 10 minutos, o descarta", "Unirse ahora abre la llamada", "Recordatorios hasta que respondes", "Se reprograma tras un reinicio"],
      link: "Más sobre las alarmas",
    },
    agenda: {
      eyebrow: "3 · La agenda en voz alta",
      line1: "Pregunta qué tienes,",
      line2: "y escúchalo.",
      body: 'Di "¿Qué tengo mañana?" o toca reproducir. MeetingGuard lee lo de hoy, lo pendiente y lo de mañana.',
      points: ["Reuniones y tareas juntas", "En inglés o español", "Sin manos"],
      link: "Más sobre la agenda",
    },
    summary: {
      eyebrow: "4 · El resumen matinal",
      line1: "Tu día en una pantalla,",
      line2: "al despertar.",
      body: "A la hora que elijas, un resumen diario lee tu día. En Android, además te espera un resumen a pantalla completa.",
      points: ["Resumen diario a tu hora", "Primera reunión y tareas pendientes", "Empezar el día con un toque"],
    },
    offline: {
      eyebrow: "5 · Sin conexión",
      line1: "¿Sin cobertura?",
      line2: "Tus alarmas siguen sonando.",
      items: [
        { title: "Las alarmas suenan sin conexión", body: "Las alarmas se programan en tu teléfono, así que suenan sin conexión." },
        { title: "Las peticiones necesitan conexión", body: "Crear o cambiar reuniones por voz o WhatsApp necesita internet." },
        { title: "Se pone al día", body: "Los cambios hechos en tu calendario se sincronizan en cuanto vuelves a tener conexión." },
      ],
    },
    platforms: {
      eyebrow: "6 · Android y iPhone",
      line1: "El mismo asistente,",
      line2: "diferencias honestas.",
      body: "Casi todo funciona igual en ambos. Donde el sistema del teléfono pone las reglas, lo decimos.",
      head: ["", "Android", "iPhone"],
      rows: [
        { name: "Asistente de voz, inglés y español", android: true, iphone: true },
        { name: "Alarma antes de cada reunión", android: "A pantalla completa, en la pantalla de bloqueo", iphone: "Con sonido en la pantalla de bloqueo" },
        { name: "Posponer, descartar y unirse desde la alarma", android: true, iphone: true },
        { name: "Agenda en voz alta y resumen diario", android: true, iphone: true },
        { name: "Resumen matinal a pantalla completa", android: true, iphone: false },
        { name: "WhatsApp", android: true, iphone: true },
      ],
    },
    cta: ["Míralo en", "tu propio calendario."],
  },
} as const;

export function howItWorksMetadata(lang: Lang) {
  const c = copy[lang];
  return pageMetadata({ lang, path: "/how-it-works", title: c.meta.title, description: c.meta.description });
}

function Cell({ value }: { value: boolean | string }) {
  if (value === true) return <Check className="mx-auto h-5 w-5 text-emerald-300" strokeWidth={2.6} aria-label="Yes" />;
  if (value === false) return <Minus className="mx-auto h-5 w-5 text-white/25" aria-label="No" />;
  return <span className="text-[0.82rem] text-white/75">{value}</span>;
}

/** Text beside a phone; `flip` puts the phone on the right. */
function Split({
  eyebrow,
  line1,
  line2,
  body,
  points,
  link,
  phone,
  flip = false,
  tag,
}: {
  eyebrow: string;
  line1: string;
  line2: string;
  body: string;
  points: readonly string[];
  link?: { href: string; label: string };
  phone: React.ReactNode;
  flip?: boolean;
  tag?: string;
}) {
  return (
    <Section>
      <div className="mx-auto grid max-w-[1000px] items-center gap-12 md:grid-cols-2 md:gap-16">
        <Reveal className={`flex flex-col items-center ${flip ? "md:order-2" : ""}`}>
          {phone}
          {tag && (
            <div className="mt-5">
              <Tag>{tag}</Tag>
            </div>
          )}
        </Reveal>
        <div className={flip ? "md:order-1" : ""}>
          <SectionHeading eyebrow={eyebrow} line1={line1} line2={line2} body={body} align="left" />
          <Reveal delay={0.1}>
            <CheckList items={points} className="mt-6" />
            {link && <ArrowLink href={link.href} className="mt-7">{link.label}</ArrowLink>}
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

export function HowItWorksPage({ lang }: { lang: Lang }) {
  const c = copy[lang];
  const t = dictionaries[lang];
  return (
    <>
      <PageHero eyebrow={c.eyebrow} line1={c.line1} line2={c.line2} lead={c.lead}>
        <StoreBadges />
      </PageHero>

      <Section className="pt-0 sm:pt-0">
        <Reveal>
          <VideoBlock title={c.video.title} pending={c.video.pending} />
        </Reveal>
      </Section>

      <Section>
        <SectionHeading eyebrow={c.voice.eyebrow} line1={c.voice.line1} line2={c.voice.line2} body={c.voice.body} />
        <ol className="mx-auto mt-14 grid max-w-[1000px] gap-12 md:grid-cols-3">
          {(["voice", "confirm", "confirmed"] as const).map((screen, i) => (
            <Reveal key={screen} delay={i * 0.08} className="flex flex-col items-center text-center">
              <Shot screen={screen} kind="iphone" lang={lang} bodyHeight={400} />
              <p className="mt-7 font-mono text-[0.72rem] tracking-[0.06em] text-[#ff8a95]">0{i + 1}</p>
              <h3 className="mt-1 text-[1.05rem] font-semibold text-white">{c.voice.steps[i].title}</h3>
              <p className="mt-1.5 max-w-[260px] text-[0.88rem] leading-relaxed text-white/60">{c.voice.steps[i].body}</p>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Split
        {...c.alarms}
        link={{ href: localize("/features/alarms", lang), label: c.alarms.link }}
        phone={<Shot screen="alarm" kind="iphone" lang={lang} bodyHeight={460} mirror />}
      />
      <Split
        {...c.agenda}
        flip
        link={{ href: localize("/features/agenda", lang), label: c.agenda.link }}
        phone={<Shot screen="agenda" kind="iphone" lang={lang} bodyHeight={460} mirror />}
      />
      <Split {...c.summary} tag={t.common.androidOnly} phone={<Shot screen="summary" kind="android" lang={lang} bodyHeight={460} />} />

      <Section>
        <SectionHeading eyebrow={c.offline.eyebrow} line1={c.offline.line1} line2={c.offline.line2} />
        <PointGrid
          items={c.offline.items.map((it, i) => ({
            icon: [<CloudOff key="a" className="h-5 w-5" aria-hidden />, <Wifi key="b" className="h-5 w-5" aria-hidden />, <RefreshCw key="c" className="h-5 w-5" aria-hidden />][i],
            title: it.title,
            body: it.body,
          }))}
        />
      </Section>

      <Section>
        <SectionHeading eyebrow={c.platforms.eyebrow} line1={c.platforms.line1} line2={c.platforms.line2} body={c.platforms.body} />
        <Reveal delay={0.1} className="mx-auto mt-10 max-w-3xl overflow-x-auto rounded-2xl border border-white/[0.07] bg-[linear-gradient(180deg,#0f0f13,#0a0a0d)]">
          <table className="w-full min-w-[520px] text-left">
            <thead>
              <tr className="border-b border-white/[0.07] text-[0.78rem] text-white/50">
                {c.platforms.head.map((h, i) => (
                  <th key={i} scope="col" className={`px-5 py-4 font-medium sm:px-7 ${i ? "w-[30%] text-center" : ""}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {c.platforms.rows.map((r) => (
                <tr key={r.name}>
                  <th scope="row" className="px-5 py-4 text-[0.9rem] font-medium text-white/85 sm:px-7">
                    {r.name}
                  </th>
                  <td className="px-4 py-4 text-center">
                    <Cell value={r.android} />
                  </td>
                  <td className="px-4 py-4 text-center">
                    <Cell value={r.iphone} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </Section>

      <CtaBand line1={c.cta[0]} line2={c.cta[1]} body={t.cta.sentence} />
    </>
  );
}
