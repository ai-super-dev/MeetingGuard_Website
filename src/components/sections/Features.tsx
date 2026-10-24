import type { ReactNode } from "react";
import {
  Bell,
  BellOff,
  CalendarPlus,
  Clock,
  Copy,
  Link2,
  Plus,
  Share2,
  Video,
  Volume2,
  X,
} from "lucide-react";
import {
  GoogleCalendarIcon,
  GoogleMeetIcon,
  OutlookIcon,
  PhoneCalendarIcon,
  ZoomIcon,
} from "@/components/icons/brand";
import { Reveal } from "@/components/motion";
import { StatusBar } from "@/components/phone/Device";

function FeatureCard({
  title,
  body,
  visual,
  note,
  delay = 0,
}: {
  title: string;
  body: string;
  visual?: ReactNode;
  note?: string;
  delay?: number;
}) {
  return (
    <Reveal delay={delay}>
      <article className="surface group overflow-hidden rounded-2xl transition-colors duration-300 hover:border-white/[0.12]">
        {visual && <div className="relative overflow-hidden px-7 pt-7">{visual}</div>}
        <div className="px-7 pt-6 pb-7">
          <h3 className="text-[0.98rem] font-semibold text-white">{title}</h3>
          <p className="mt-1.5 max-w-sm text-[0.85rem] leading-relaxed text-white/50">{body}</p>
          {note && <p className="mt-2 text-[0.7rem] text-white/30">{note}</p>}
        </div>
      </article>
    </Reveal>
  );
}

/* ---------- visuals ---------- */

function AlertVisual() {
  return (
    <div className="mx-auto h-[318px] w-full max-w-[270px] rounded-t-[36px] border border-b-0 border-white/10 bg-[#0b0b0e] px-5 pt-3 [mask-image:linear-gradient(180deg,#000_88%,transparent)]">
      <StatusBar className="px-3 text-[13px]" />
      <div className="mt-5 flex flex-col items-center text-center">
        <span className="relative grid h-16 w-16 place-items-center">
          <span className="absolute inset-0 rounded-full bg-[radial-gradient(closest-side,rgba(255,60,80,0.6),transparent)] [animation:glow-pulse_1.8s_ease-in-out_infinite]" />
          <Bell
            className="relative h-9 w-9 origin-[50%_15%] fill-accent text-[#ff9aa4] [animation:bell-ring_2.4s_ease-in-out_infinite]"
            strokeWidth={1.5}
            aria-hidden
          />
        </span>
        <p className="mt-3 text-[1rem] font-semibold">Investor Call</p>
        <p className="text-[0.78rem] text-white/50">starts in 15 minutes</p>
        <p className="mt-2 flex items-center gap-1.5 text-[0.7rem] text-white/40">
          <Volume2 className="h-3.5 w-3.5" aria-hidden />
          &ldquo;Investor call starts in 15 minutes&rdquo;
        </p>
        <div className="mt-4 flex w-full gap-2">
          <span className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl bg-accent text-[0.78rem] font-semibold">
            <Video className="h-3.5 w-3.5" aria-hidden />
            Join now
          </span>
          <span className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl bg-white/[0.08] text-[0.78rem] text-white/80">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            Snooze
          </span>
        </div>
        <div className="mt-3 grid w-full grid-cols-3 rounded-xl bg-white/[0.05] p-1 text-[0.7rem]">
          <span className="py-1.5 text-white/45">Gentle</span>
          <span className="py-1.5 text-white/45">Standard</span>
          <span className="rounded-lg bg-white/[0.1] py-1.5 font-semibold text-white">Critical</span>
        </div>
      </div>
    </div>
  );
}

function CalendarsVisual() {
  const rows = [
    { name: "Google Calendar", icon: <GoogleCalendarIcon className="h-5 w-5" /> },
    { name: "Outlook", icon: <OutlookIcon className="h-5 w-5" /> },
    { name: "Phone calendar", icon: <PhoneCalendarIcon className="h-5 w-5" /> },
  ];
  return (
    <div className="mx-auto w-full max-w-[300px] overflow-hidden rounded-[22px] border border-white/10 bg-[#0b0b0e]">
      <div className="relative h-[86px] bg-[radial-gradient(80%_120%_at_80%_0%,rgba(255,60,80,0.22),transparent_70%)] px-4 pt-4">
        <p className="text-[0.75rem] text-white/45">Connected calendars</p>
        <p className="mt-1 text-[1.05rem] font-semibold">Two-way sync · up to date</p>
      </div>
      <ul className="divide-y divide-white/[0.06]">
        {rows.map((r) => (
          <li key={r.name} className="flex items-center gap-3 px-4 py-3 text-[0.82rem]">
            {r.icon}
            <span className="flex-1 text-white/80">{r.name}</span>
            <span className="relative h-5 w-9 rounded-full bg-accent/90" aria-hidden>
              <span className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full bg-white" />
            </span>
          </li>
        ))}
        <li className="flex items-center gap-3 px-4 py-3 text-[0.82rem] text-white/45">
          <Plus className="h-5 w-5" aria-hidden />
          Add calendar
        </li>
      </ul>
    </div>
  );
}

function VoiceVisual() {
  return (
    <div className="mx-auto w-full max-w-[300px]">
      <p className="px-2 text-[0.82rem] leading-relaxed text-white/25">
        Lunch with Ana tomorrow at 2 pm, and remind me ten minutes before…
      </p>
      <div className="mt-4 flex h-12 items-center gap-3 rounded-2xl border border-accent/30 bg-[linear-gradient(90deg,rgba(255,77,94,0.25),rgba(255,77,94,0.1))] px-4">
        <span className="flex-1 text-[0.85rem] text-white/70">Listening…</span>
        <X className="h-4 w-4 text-white/50" aria-hidden />
        <span className="flex h-8 w-11 items-center justify-center gap-[3px] rounded-lg bg-white/[0.08]" aria-hidden>
          {[0, 0.2, 0.4, 0.1, 0.3].map((d) => (
            <span
              key={d}
              className="h-4 w-[3px] origin-center rounded-full bg-white/80"
              style={{ animation: `listen-bar 0.9s ease-in-out ${d}s infinite` }}
            />
          ))}
        </span>
      </div>
      <div className="mx-auto mt-5 h-1 w-24 rounded-full bg-white/70" />
    </div>
  );
}

function JoinVisual() {
  const actions = [
    { label: "Join with Zoom", icon: <ZoomIcon className="h-4 w-4" /> },
    { label: "Join with Google Meet", icon: <GoogleMeetIcon className="h-4 w-4" /> },
    { label: "Copy meeting link", icon: <Copy className="h-4 w-4 text-white/60" /> },
    { label: "Snooze 5 minutes", icon: <BellOff className="h-4 w-4 text-white/60" /> },
    { label: "Add to calendar", icon: <CalendarPlus className="h-4 w-4 text-white/60" /> },
    { label: "Share meeting", icon: <Share2 className="h-4 w-4 text-white/60" /> },
  ];
  return (
    <div className="h-[330px] [perspective:1200px]">
      <div
        className="mx-auto w-full max-w-[320px] rounded-[22px] border border-white/10 bg-[#0e0e12] p-4 [mask-image:linear-gradient(180deg,#000_60%,transparent)]"
        style={{ transform: "rotateX(28deg) rotateZ(-14deg) translateY(10px)", transformOrigin: "50% 0" }}
      >
        <div className="flex items-center gap-2 rounded-xl bg-white/[0.05] px-3 py-2.5 text-[0.8rem] text-white/45">
          <Link2 className="h-4 w-4" aria-hidden />
          Investor Call · starts in 2 min
        </div>
        <ul className="mt-2">
          {actions.map((a, i) => (
            <li
              key={a.label}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[0.85rem] ${
                i === 0 ? "bg-accent/15 text-white" : "text-white/70"
              }`}
            >
              {a.icon}
              {a.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Features() {
  return (
    <section id="features" aria-labelledby="features-title" className="relative py-20 sm:py-28">
      <div className="container-page">
        <Reveal className="mx-auto max-w-xl text-center">
          <p className="eyebrow">Features</p>
          <h2 id="features-title" className="mt-3 text-[1.9rem] font-semibold tracking-[-0.02em] sm:text-[2.25rem]">
            Built for the meetings that matter
          </h2>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-[920px] grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-[repeat(2,minmax(0,1fr))]">
          <div className="flex flex-col gap-5">
            <FeatureCard
              title="Alarms you can't miss"
              body="Full-screen alarms with sound and voice readout, gentle reminders, snooze and follow-ups — even when the app is closed. You choose the intensity for every meeting."
              visual={<AlertVisual />}
            />
            <FeatureCard
              title="Speak or type"
              body="Tell the assistant what you need, in the app or by WhatsApp. It shows what it understood and only saves after you confirm."
              visual={<VoiceVisual />}
              delay={0.05}
            />
            <FeatureCard
              title="iPhone & Android · English & Español"
              body="The same assistant and alarms on every phone, in English and Spanish."
              delay={0.1}
            />
          </div>
          <div className="flex flex-col gap-5">
            <FeatureCard
              title="Two-way calendar sync"
              body="Google Calendar, Outlook and the calendars on your phone. Meetings you create in MeetingGuard appear everywhere, with invitations and video-call links included."
              visual={<CalendarsVisual />}
              delay={0.08}
            />
            <FeatureCard
              title="Instant join"
              body="One tap into the Zoom or Google Meet call — the link is generated for you. No more hunting for links."
              visual={<JoinVisual />}
              delay={0.12}
            />
            <FeatureCard
              title="Share and invite"
              body="Share any meeting in a tap. Invitations and the call link go to everyone, so the whole team lands in the same room."
              delay={0.16}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
