import { CalendarCheck2, CheckCircle2, Mail, Mic, Repeat2, ShieldCheck, UserCheck } from "lucide-react";
import { WaitlistForm } from "@/components/forms/Forms";
import { Reveal } from "@/components/motion";
import { AvailableLabel, Card, CtaBand, PageHero, PointGrid, Section, SectionHeading } from "@/components/page/blocks";
import { AssistantVisual } from "@/components/sections/HomeExtras";
import { dictionaries } from "@/lib/i18n";
import type { Lang } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

const copy = {
  en: {
    meta: { title: "Executive assistant", description: "Delegate by voice. The MeetingGuard executive assistant emails, follows up and books, and you approve. Join the list." },
    eyebrow: "Executive assistant",
    line1: "Delegate it by voice.",
    line2: "It handles the rest.",
    lead: "The executive assistant emails, follows up and books for you. You approve, it acts, and you are copied on every email.",
    what: {
      line1: "What it will do",
      line2: "for you.",
      items: [
        { title: "Delegate by voice", body: "Tell it what you need, the way you would tell a person." },
        { title: "It emails", body: "It writes to the people involved, from a clear assistant address, with you in copy." },
        { title: "It follows up", body: "No answer? It sends a polite follow-up, so you don't have to chase." },
        { title: "It books", body: "When a time is agreed, it creates the meeting, sends the invitation and sets your alarm." },
        { title: "You approve", body: "You see what it plans to send before it goes out." },
      ],
    },
    example: {
      eyebrow: "An example",
      line1: "Meet Carlos.",
      line2: "He's hard to pin down.",
      steps: [
        { who: "You", text: '"Find 30 minutes with Carlos next week to review the proposal."' },
        { who: "Assistant", text: "Drafts an email to Carlos with three times that fit your calendar, with you in copy." },
        { who: "You", text: "Approve the draft with one tap. It is sent." },
        { who: "Assistant", text: "Two days, no reply. It sends a short follow-up." },
        { who: "Carlos", text: "Picks Tuesday at 11:00." },
        { who: "Assistant", text: "Books the meeting, sends the invitation and sets your alarm. Done." },
      ],
    },
    safety: {
      eyebrow: "The safety rules",
      line1: "It works for you,",
      line2: "inside your rules.",
      items: [
        { title: "You are copied on every email", body: "Nothing is sent that you cannot see." },
        { title: "Nothing outside your mandate", body: "It only acts on what you asked it to do." },
        { title: "You approve first", body: "You see the message and the meeting before they go out." },
        { title: "Stop anytime", body: "Pause or cancel a task and it stops straight away." },
      ],
    },
    join: {
      line1: "Be first",
      line2: "when it launches.",
      body: "Join the list and we will email you once, when the assistant is ready.",
    },
    addon: "Available as an add-on subscription.",
    cta: ["Meanwhile, never miss", "a meeting again."],
  },
  es: {
    meta: { title: "Asistente ejecutivo", description: "Delega con la voz. El asistente ejecutivo de MeetingGuard escribe correos, hace seguimiento y reserva, y tú apruebas. Únete a la lista." },
    eyebrow: "Asistente ejecutivo",
    line1: "Delégalo con la voz.",
    line2: "Él se encarga del resto.",
    lead: "El asistente ejecutivo escribe correos, hace seguimiento y reserva por ti. Tú apruebas, él actúa, y te copia en cada correo.",
    what: {
      line1: "Lo que hará",
      line2: "por ti.",
      items: [
        { title: "Delega con la voz", body: "Dile lo que necesitas, como se lo dirías a una persona." },
        { title: "Escribe correos", body: "Escribe a las personas implicadas, desde una dirección de asistente clara, contigo en copia." },
        { title: "Hace seguimiento", body: "¿Sin respuesta? Envía un recordatorio amable, para que no tengas que perseguir a nadie." },
        { title: "Reserva", body: "Cuando hay una hora acordada, crea la reunión, envía la invitación y programa tu alarma." },
        { title: "Tú apruebas", body: "Ves lo que va a enviar antes de que salga." },
      ],
    },
    example: {
      eyebrow: "Un ejemplo",
      line1: "Te presentamos a Carlos.",
      line2: "Es difícil de localizar.",
      steps: [
        { who: "Tú", text: '"Busca 30 minutos con Carlos la próxima semana para revisar la propuesta."' },
        { who: "Asistente", text: "Prepara un correo a Carlos con tres horas que encajan en tu calendario, contigo en copia." },
        { who: "Tú", text: "Apruebas el borrador con un toque. Se envía." },
        { who: "Asistente", text: "Dos días sin respuesta. Envía un breve recordatorio." },
        { who: "Carlos", text: "Elige el martes a las 11:00." },
        { who: "Asistente", text: "Reserva la reunión, envía la invitación y programa tu alarma. Hecho." },
      ],
    },
    safety: {
      eyebrow: "Las reglas de seguridad",
      line1: "Trabaja para ti,",
      line2: "dentro de tus reglas.",
      items: [
        { title: "Te copia en cada correo", body: "No se envía nada que no puedas ver." },
        { title: "Nada fuera de tu encargo", body: "Solo actúa sobre lo que le pediste." },
        { title: "Tú apruebas primero", body: "Ves el mensaje y la reunión antes de que salgan." },
        { title: "Detenlo cuando quieras", body: "Pausa o cancela una tarea y se detiene al momento." },
      ],
    },
    join: {
      line1: "Sé de los primeros",
      line2: "cuando llegue.",
      body: "Únete a la lista y te escribiremos una sola vez, cuando el asistente esté listo.",
    },
    addon: "Disponible como suscripción adicional.",
    cta: ["Mientras tanto, no vuelvas", "a perderte una reunión."],
  },
} as const;

export function assistantMetadata(lang: Lang) {
  const c = copy[lang];
  return pageMetadata({ lang, path: "/assistant", title: c.meta.title, description: c.meta.description });
}

const whatIcons = [Mic, Mail, Repeat2, CalendarCheck2, UserCheck];
const safetyIcons = [Mail, ShieldCheck, CheckCircle2, UserCheck];

export function AssistantPage({ lang }: { lang: Lang }) {
  const c = copy[lang];
  const t = dictionaries[lang];
  return (
    <>
      <PageHero
        eyebrow={c.eyebrow}
        label={<AvailableLabel>{t.comingSoon}</AvailableLabel>}
        line1={c.line1}
        line2={c.line2}
        lead={c.lead}
        visual={<AssistantVisual />}
      >
        <div className="w-full max-w-md">
          <WaitlistForm id="hero-waitlist" />
          <p className="mt-1 text-[0.8rem] text-white/45">{c.addon}</p>
        </div>
      </PageHero>

      <Section>
        <SectionHeading line1={c.what.line1} line2={c.what.line2} />
        <PointGrid
          items={c.what.items.map((it, i) => {
            const Icon = whatIcons[i];
            return { icon: <Icon className="h-5 w-5 text-[#ffd9a0]" aria-hidden />, title: it.title, body: it.body };
          })}
        />
      </Section>

      <Section>
        <SectionHeading eyebrow={c.example.eyebrow} line1={c.example.line1} line2={c.example.line2} />
        <Reveal delay={0.1} className="mx-auto mt-12 max-w-2xl">
          <ol className="relative space-y-4 before:absolute before:top-3 before:bottom-3 before:left-[19px] before:w-px before:bg-white/10">
            {c.example.steps.map((s, i) => {
              const assistant = s.who === "Assistant" || s.who === "Asistente";
              return (
                <li key={i} className="relative flex gap-4">
                  <span
                    className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border font-mono text-[0.72rem] ${
                      assistant ? "border-[#ffd9a0]/40 bg-[#1a1610] text-[#ffd9a0]" : "border-white/15 bg-ink-900 text-white/70"
                    }`}
                  >
                    0{i + 1}
                  </span>
                  <Card className="flex-1 p-4! sm:p-5!">
                    <p className={`text-[0.72rem] font-medium tracking-wide uppercase ${assistant ? "text-[#ffd9a0]" : "text-white/45"}`}>{s.who}</p>
                    <p className="mt-1 text-[0.95rem] leading-relaxed text-white/85">{s.text}</p>
                  </Card>
                </li>
              );
            })}
          </ol>
        </Reveal>
      </Section>

      <Section>
        <SectionHeading eyebrow={c.safety.eyebrow} line1={c.safety.line1} line2={c.safety.line2} />
        <PointGrid
          columns={2}
          items={c.safety.items.map((it, i) => {
            const Icon = safetyIcons[i];
            return { icon: <Icon className="h-5 w-5 text-emerald-300" aria-hidden />, title: it.title, body: it.body };
          })}
        />
      </Section>

      <Section>
        <Reveal className="surface mx-auto max-w-2xl rounded-3xl px-6 py-12 text-center sm:px-12">
          <SectionHeading line1={c.join.line1} line2={c.join.line2} body={c.join.body} />
          <WaitlistForm id="bottom-waitlist" className="mx-auto mt-8 max-w-md text-left" />
          <p className="mt-1 text-[0.8rem] text-white/45">{c.addon}</p>
        </Reveal>
      </Section>

      <CtaBand line1={c.cta[0]} line2={c.cta[1]} body={t.cta.sentence} />
    </>
  );
}
