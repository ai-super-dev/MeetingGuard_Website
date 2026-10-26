import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ScreenKey } from "@/content/features";
import { featureAccents, featureIcons, useCaseIcons } from "@/components/icons/feature-icons";
import { Reveal } from "@/components/motion";
import { Card, CtaBand, PageHero, Section, SectionHeading } from "@/components/page/blocks";
import { StoreBadges } from "@/components/ui/StoreBadges";
import { dictionaries } from "@/lib/i18n";
import { localize, type FeatureSlug, type Lang, type UseCaseSlug } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { Shot } from "./screens";

type UseCase = {
  meta: { title: string; description: string };
  eyebrow: string;
  line1: string;
  line2: string;
  lead: string;
  day: { title: string; items: { time: string; text: string; risk?: boolean }[] };
  problem: { title: string; body: string };
  fit: { title: [string, string]; items: { feature: FeatureSlug; title: string; body: string }[] };
  flow: { title: [string, string]; steps: { screen: ScreenKey; kind: "iphone" | "android"; caption: string }[] };
  cta: [string, string];
};

const en: Record<UseCaseSlug, UseCase> = {
  consultants: {
    meta: { title: "MeetingGuard for consultants", description: "Back-to-back client calls, different time zones, zero slips. How consultants use MeetingGuard to show up on time for every client." },
    eyebrow: "For consultants",
    line1: "Every client",
    line2: "gets you on time.",
    lead: "When your calendar is your business, one late call costs more than a few minutes. MeetingGuard makes sure it never happens.",
    day: {
      title: "A typical day",
      items: [
        { time: "08:30", text: "Workshop with client A, on site" },
        { time: "11:00", text: "Call with client B, who moved it twice", risk: true },
        { time: "14:00", text: "Proposal review, internal" },
        { time: "16:30", text: "Steering meeting with client C, other time zone", risk: true },
      ],
    },
    problem: {
      title: "The problem",
      body: "You go from one client to the next with no gap. Reminders arrive while you are presenting and get swiped away. A moved call or a time-zone change is all it takes to be late.",
    },
    fit: {
      title: ["How MeetingGuard", "fits your day."],
      items: [
        { feature: "alarms", title: "Critical alarms for client calls", body: "Set the intensity per meeting, so the client calls always ring full screen." },
        { feature: "voice-assistant", title: "Book between meetings", body: "Move or create a call by voice while you walk to the next room." },
        { feature: "agenda", title: "Your day on the way in", body: "Hear today's clients and anything overdue before the first workshop." },
      ],
    },
    flow: {
      title: ["From the workshop", "to the next call."],
      steps: [
        { screen: "voice", kind: "iphone", caption: "Move a call by voice" },
        { screen: "alarm", kind: "iphone", caption: "The alarm before the client" },
        { screen: "agenda", kind: "iphone", caption: "Tomorrow, read aloud" },
      ],
    },
    cta: ["Show up on time", "for every client."],
  },
  sales: {
    meta: { title: "MeetingGuard for sales", description: "A missed demo is a lost deal. How sales teams use MeetingGuard to join every call on time and follow up the same day." },
    eyebrow: "For sales",
    line1: "Every call,",
    line2: "on time.",
    lead: "A missed demo is a lost deal. MeetingGuard rings before every call, puts the link one tap away and remembers the follow-ups.",
    day: {
      title: "A typical day",
      items: [
        { time: "09:00", text: "Pipeline review with the team" },
        { time: "10:30", text: "Discovery call with a new lead", risk: true },
        { time: "13:00", text: "Demo, rescheduled by the prospect", risk: true },
        { time: "17:00", text: "Follow-up emails from today's calls" },
      ],
    },
    problem: {
      title: "The problem",
      body: "Prospects reschedule, links live in different emails, and follow-ups wait until you remember them. Each slip is a deal that cools down.",
    },
    fit: {
      title: ["How MeetingGuard", "fits your pipeline."],
      items: [
        { feature: "alarms", title: "Join from the alarm", body: "Fifteen minutes before, the alarm rings with Join now on screen." },
        { feature: "tasks", title: "Follow-ups that ring", body: "Say the follow-up after the call and it becomes a task with a reminder." },
        { feature: "whatsapp", title: "Book from WhatsApp", body: "Confirm a time with a prospect and book it from the chat you are already in." },
      ],
    },
    flow: {
      title: ["From the demo", "to the follow-up."],
      steps: [
        { screen: "alarm", kind: "iphone", caption: "The alarm, with the link" },
        { screen: "tasks", kind: "iphone", caption: "Follow-ups as tasks" },
        { screen: "plan", kind: "iphone", caption: "The week at a glance" },
      ],
    },
    cta: ["Never lose a deal", "to a missed call."],
  },
  founders: {
    meta: { title: "MeetingGuard for founders", description: "Investors, team, hiring and customers in one calendar. How founders use MeetingGuard to keep every commitment." },
    eyebrow: "For founders",
    line1: "Investors, team, hiring.",
    line2: "All on time.",
    lead: "Your calendar switches context every hour. MeetingGuard keeps every commitment, so the important ones never slip.",
    day: {
      title: "A typical day",
      items: [
        { time: "08:00", text: "Team standup" },
        { time: "10:00", text: "Investor call, moved from last week", risk: true },
        { time: "12:30", text: "Interview with a candidate" },
        { time: "16:00", text: "Customer call, booked an hour ago", risk: true },
      ],
    },
    problem: {
      title: "The problem",
      body: "Meetings get added and moved all day, often from your phone between other calls. The one you forget is always the one that matters.",
    },
    fit: {
      title: ["How MeetingGuard", "fits your week."],
      items: [
        { feature: "voice-assistant", title: "Change plans in a sentence", body: '"Move the investor call to Wednesday at 10" and confirm. Done.' },
        { feature: "agenda", title: "A briefing every morning", body: "Your meetings and what is overdue, read at the time you choose." },
        { feature: "alarms", title: "The investor call never slips", body: "Make it critical and it rings full screen, even with the app closed." },
      ],
    },
    flow: {
      title: ["From the standup", "to the investor call."],
      steps: [
        { screen: "summary", kind: "android", caption: "The morning summary" },
        { screen: "confirm", kind: "android", caption: "A moved call, confirmed" },
        { screen: "alarm", kind: "android", caption: "The alarm before it starts" },
      ],
    },
    cta: ["Keep every", "commitment."],
  },
};

const es: Record<UseCaseSlug, UseCase> = {
  consultants: {
    meta: { title: "MeetingGuard para consultores", description: "Llamadas con clientes seguidas, distintas zonas horarias, cero despistes. Así usan MeetingGuard los consultores para llegar a tiempo con cada cliente." },
    eyebrow: "Para consultores",
    line1: "Cada cliente",
    line2: "te tiene a tiempo.",
    lead: "Cuando tu calendario es tu negocio, una llamada tarde cuesta más que unos minutos. MeetingGuard se asegura de que no pase.",
    day: {
      title: "Un día típico",
      items: [
        { time: "08:30", text: "Taller con el cliente A, presencial" },
        { time: "11:00", text: "Llamada con el cliente B, que la movió dos veces", risk: true },
        { time: "14:00", text: "Revisión de propuesta, interna" },
        { time: "16:30", text: "Comité con el cliente C, otra zona horaria", risk: true },
      ],
    },
    problem: {
      title: "El problema",
      body: "Pasas de un cliente al siguiente sin pausa. Los recordatorios llegan mientras presentas y se descartan. Basta una llamada movida o un cambio de zona horaria para llegar tarde.",
    },
    fit: {
      title: ["Cómo encaja MeetingGuard", "en tu día."],
      items: [
        { feature: "alarms", title: "Alarmas críticas para clientes", body: "Elige la intensidad por reunión, así las llamadas con clientes siempre suenan a pantalla completa." },
        { feature: "voice-assistant", title: "Reserva entre reuniones", body: "Mueve o crea una llamada con la voz mientras vas a la siguiente sala." },
        { feature: "agenda", title: "Tu día de camino", body: "Escucha los clientes de hoy y lo pendiente antes del primer taller." },
      ],
    },
    flow: {
      title: ["Del taller", "a la siguiente llamada."],
      steps: [
        { screen: "voice", kind: "iphone", caption: "Mueve una llamada con la voz" },
        { screen: "alarm", kind: "iphone", caption: "La alarma antes del cliente" },
        { screen: "agenda", kind: "iphone", caption: "Mañana, en voz alta" },
      ],
    },
    cta: ["Llega a tiempo", "con cada cliente."],
  },
  sales: {
    meta: { title: "MeetingGuard para ventas", description: "Una demo perdida es una venta perdida. Así usan MeetingGuard los equipos de ventas para entrar a tiempo en cada llamada y hacer seguimiento el mismo día." },
    eyebrow: "Para ventas",
    line1: "Cada llamada,",
    line2: "a tiempo.",
    lead: "Una demo perdida es una venta perdida. MeetingGuard suena antes de cada llamada, deja el enlace a un toque y recuerda los seguimientos.",
    day: {
      title: "Un día típico",
      items: [
        { time: "09:00", text: "Revisión del pipeline con el equipo" },
        { time: "10:30", text: "Llamada de descubrimiento con un lead nuevo", risk: true },
        { time: "13:00", text: "Demo, reprogramada por el cliente", risk: true },
        { time: "17:00", text: "Correos de seguimiento de las llamadas de hoy" },
      ],
    },
    problem: {
      title: "El problema",
      body: "Los clientes reprograman, los enlaces están en correos distintos y los seguimientos esperan a que te acuerdes. Cada despiste es una venta que se enfría.",
    },
    fit: {
      title: ["Cómo encaja MeetingGuard", "en tu pipeline."],
      items: [
        { feature: "alarms", title: "Únete desde la alarma", body: "Quince minutos antes, la alarma suena con Unirse ahora en pantalla." },
        { feature: "tasks", title: "Seguimientos que suenan", body: "Di el seguimiento después de la llamada y se convierte en una tarea con recordatorio." },
        { feature: "whatsapp", title: "Reserva desde WhatsApp", body: "Confirma una hora con un cliente y resérvala desde el chat en el que ya estás." },
      ],
    },
    flow: {
      title: ["De la demo", "al seguimiento."],
      steps: [
        { screen: "alarm", kind: "iphone", caption: "La alarma, con el enlace" },
        { screen: "tasks", kind: "iphone", caption: "Seguimientos como tareas" },
        { screen: "plan", kind: "iphone", caption: "La semana de un vistazo" },
      ],
    },
    cta: ["No pierdas una venta", "por una llamada olvidada."],
  },
  founders: {
    meta: { title: "MeetingGuard para fundadores", description: "Inversores, equipo, contratación y clientes en un calendario. Así usan MeetingGuard los fundadores para cumplir cada compromiso." },
    eyebrow: "Para fundadores",
    line1: "Inversores, equipo, contratación.",
    line2: "Todo a tiempo.",
    lead: "Tu calendario cambia de contexto cada hora. MeetingGuard cumple cada compromiso para que los importantes nunca se escapen.",
    day: {
      title: "Un día típico",
      items: [
        { time: "08:00", text: "Reunión diaria del equipo" },
        { time: "10:00", text: "Llamada con inversores, movida desde la semana pasada", risk: true },
        { time: "12:30", text: "Entrevista con un candidato" },
        { time: "16:00", text: "Llamada con un cliente, reservada hace una hora", risk: true },
      ],
    },
    problem: {
      title: "El problema",
      body: "Las reuniones se añaden y se mueven todo el día, a menudo desde el teléfono entre otras llamadas. La que olvidas siempre es la que importa.",
    },
    fit: {
      title: ["Cómo encaja MeetingGuard", "en tu semana."],
      items: [
        { feature: "voice-assistant", title: "Cambia planes con una frase", body: '"Mueve la llamada con inversores al miércoles a las 10" y confirma. Hecho.' },
        { feature: "agenda", title: "Un resumen cada mañana", body: "Tus reuniones y lo pendiente, leídos a la hora que elijas." },
        { feature: "alarms", title: "La llamada con inversores nunca se escapa", body: "Hazla crítica y sonará a pantalla completa, incluso con la app cerrada." },
      ],
    },
    flow: {
      title: ["De la reunión diaria", "a la llamada con inversores."],
      steps: [
        { screen: "summary", kind: "android", caption: "El resumen matinal" },
        { screen: "confirm", kind: "android", caption: "Una llamada movida, confirmada" },
        { screen: "alarm", kind: "android", caption: "La alarma antes de empezar" },
      ],
    },
    cta: ["Cumple cada", "compromiso."],
  },
};

const useCases: Record<Lang, Record<UseCaseSlug, UseCase>> = { en, es };

export function audienceMetadata(lang: Lang, slug: UseCaseSlug) {
  const c = useCases[lang][slug];
  return pageMetadata({ lang, path: `/for/${slug}`, title: c.meta.title, description: c.meta.description });
}

export function UseCasePage({ lang, slug }: { lang: Lang; slug: UseCaseSlug }) {
  const c = useCases[lang][slug];
  const t = dictionaries[lang];
  const Icon = useCaseIcons[slug];
  return (
    <>
      <PageHero
        eyebrow={c.eyebrow}
        label={
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-white/[0.06] text-white/70">
            <Icon className="h-4 w-4" aria-hidden />
          </span>
        }
        line1={c.line1}
        line2={c.line2}
        lead={c.lead}
      >
        <StoreBadges />
      </PageHero>

      {/* the day and the problem */}
      <Section className="pt-0 sm:pt-0">
        <div className="mx-auto grid max-w-[1000px] gap-4 md:grid-cols-[1.1fr_0.9fr]">
          <Reveal className="h-full">
            <Card className="h-full">
              <p className="eyebrow">{c.day.title}</p>
              <ol className="mt-6 space-y-4">
                {c.day.items.map((it) => (
                  <li key={it.time} className="grid grid-cols-[52px_12px_minmax(0,1fr)] items-start gap-x-3">
                    <span className={`pt-px font-mono text-[0.78rem] ${it.risk ? "text-[#ff8a95]" : "text-white/50"}`}>{it.time}</span>
                    <span className={`mt-1 h-3 w-3 rounded-full border-2 ${it.risk ? "border-accent shadow-[0_0_10px_rgba(255,77,94,0.6)]" : "border-white/25"}`} />
                    <span className={`text-[0.92rem] ${it.risk ? "text-white" : "text-white/65"}`}>{it.text}</span>
                  </li>
                ))}
              </ol>
            </Card>
          </Reveal>
          <Reveal delay={0.08} className="h-full">
            <div className="h-full rounded-2xl border border-accent/25 bg-[radial-gradient(90%_70%_at_100%_0%,rgba(255,60,80,0.12),transparent_70%),linear-gradient(180deg,#121014,#0b0a0d)] p-6 sm:p-7">
              <p className="eyebrow">{c.problem.title}</p>
              <p className="mt-6 text-[1.02rem] leading-relaxed text-white/80">{c.problem.body}</p>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section>
        <SectionHeading line1={c.fit.title[0]} line2={c.fit.title[1]} />
        <div className="mx-auto mt-12 grid max-w-[1000px] gap-4 md:grid-cols-3">
          {c.fit.items.map((it, i) => {
            const FIcon = featureIcons[it.feature];
            const accent = featureAccents[it.feature];
            return (
              <Reveal key={it.title} delay={i * 0.06} className="h-full">
                <Link href={localize(`/features/${it.feature}`, lang)} className="group block h-full">
                  <Card className="h-full transition-colors duration-300 group-hover:border-white/[0.14]">
                    <div className="flex items-center justify-between">
                      <span className="grid h-10 w-10 place-items-center rounded-xl ring-1 ring-white/[0.08]" style={{ background: `color-mix(in srgb, ${accent} 14%, transparent)`, color: accent }}>
                        <FIcon className="h-5 w-5" aria-hidden />
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-white/40 transition group-hover:text-white" aria-hidden />
                    </div>
                    <h3 className="mt-5 font-semibold text-white">{it.title}</h3>
                    <p className="mt-2 text-[0.9rem] leading-relaxed text-white/60">{it.body}</p>
                  </Card>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Section>

      <Section>
        <SectionHeading line1={c.flow.title[0]} line2={c.flow.title[1]} />
        <ol className="mx-auto mt-14 grid max-w-[1000px] gap-12 md:grid-cols-3">
          {c.flow.steps.map((s, i) => (
            <Reveal key={s.caption} delay={i * 0.08} className="flex flex-col items-center text-center">
              <Shot screen={s.screen} kind={s.kind} lang={lang} bodyHeight={400} />
              <p className="mt-7 font-mono text-[0.72rem] tracking-[0.06em] text-[#ff8a95]">0{i + 1}</p>
              <p className="mt-1 text-[0.95rem] font-medium text-white">{s.caption}</p>
            </Reveal>
          ))}
        </ol>
      </Section>

      <CtaBand line1={c.cta[0]} line2={c.cta[1]} body={t.cta.sentence} />
    </>
  );
}
