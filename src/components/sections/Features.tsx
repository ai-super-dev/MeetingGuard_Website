"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import Image, { type StaticImageData } from "next/image";
import { AlarmClock, Bell, BellRing, Check, Link2, Mic, Plus, Video } from "lucide-react";
import {
  AndroidIcon,
  AppleIcon,
  GoogleCalendarIcon,
  GoogleMeetIcon,
  OutlookIcon,
  TeamsIcon,
  ZoomIcon,
} from "@/components/icons/brand";
import { Reveal } from "@/components/motion";
import { AppMark } from "@/components/ui/Logo";
import { people } from "@/lib/people";

/* ---------- shared ---------- */

/** Ticks through `count` states every `ms` while `active`; frozen on the last state for reduced motion. */
function useCycle(count: number, ms: number, active: boolean) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!active || reduce) return;
    const t = setInterval(() => setI((n) => (n + 1) % count), ms);
    return () => clearInterval(t);
  }, [active, reduce, count, ms]);
  return reduce ? count - 1 : i;
}

/**
 * Bento tile: quiet dark surface with a faint accent tint, and a soft
 * spotlight (plus border highlight) that follows the cursor on hover.
 */
function Tile({
  accent,
  title,
  body,
  visual,
  className = "",
  delay = 0,
}: {
  accent: string;
  title: string;
  body: string;
  visual: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <Reveal delay={delay} className={className}>
      <article
        ref={ref}
        onPointerMove={onMove}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-[linear-gradient(180deg,#101014,#0a0a0d)]"
        style={{ "--accent": accent } as CSSProperties}
      >
        {/* faint resting tint in the accent colour */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(120% 70% at 100% 0%, color-mix(in srgb, var(--accent) 9%, transparent), transparent 60%)" }}
        />
        {/* cursor spotlight */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: "radial-gradient(380px circle at var(--mx) var(--my), color-mix(in srgb, var(--accent) 12%, transparent), transparent 65%)" }}
        />
        {/* border highlight near the cursor */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            padding: 1,
            background: "radial-gradient(240px circle at var(--mx) var(--my), color-mix(in srgb, var(--accent) 55%, transparent), transparent 70%)",
            WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />

        <div className="relative flex min-h-[150px] flex-1 items-center justify-center px-6 pt-8">{visual}</div>
        <div className="relative px-6 pt-5 pb-6">
          <h3 className="text-[1rem] font-semibold text-white">{title}</h3>
          <p className="mt-1.5 max-w-md text-[0.86rem] leading-relaxed text-white/50">{body}</p>
        </div>
      </article>
    </Reveal>
  );
}

/* ---------- visuals ---------- */

const LEVELS = [
  { name: "Gentle", note: "A quiet notification" },
  { name: "Standard", note: "Sound and vibration" },
  { name: "Critical", note: "Full-screen alarm with voice readout" },
] as const;

/** The alarm badge for each intensity: outline bell → ringing bell → shaking alarm clock. */
function LevelBadge({ level }: { level: number }) {
  if (level === 0) {
    return (
      <span className="grid h-16 w-16 place-items-center rounded-full border-2 border-[#e5484d]/70 bg-[#e5484d]/10">
        <Bell className="h-7 w-7 text-[#f47d84]" strokeWidth={2} aria-hidden />
      </span>
    );
  }
  if (level === 1) {
    return (
      <span className="grid h-16 w-16 place-items-center rounded-full bg-[#e5484d] shadow-[0_0_0_3px_#f47d84]">
        <BellRing
          className="h-8 w-8 origin-[50%_15%] text-white [animation:bell-ring_2.4s_ease-in-out_infinite]"
          strokeWidth={2.2}
          aria-hidden
        />
      </span>
    );
  }
  return (
    <span className="relative grid h-16 w-16 place-items-center">
      <span className="absolute inset-0 rounded-full bg-[#e5484d]/40 [animation:glow-pulse_1.2s_ease-in-out_infinite]" />
      <span className="relative grid h-16 w-16 place-items-center rounded-full bg-[#e5484d] shadow-[0_0_0_3px_#ff8a8f,0_0_28px_rgba(229,72,77,0.7)]">
        <AlarmClock
          className="h-8 w-8 text-white [animation:bell-vibrate_1.2s_linear_infinite]"
          strokeWidth={2.2}
          aria-hidden
        />
      </span>
    </span>
  );
}

function AlarmVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const level = useCycle(LEVELS.length, 2800, inView);

  return (
    <div ref={ref} className="w-full max-w-[340px] rounded-[24px] border border-white/[0.08] bg-[#0e1524] px-6 pt-8 pb-6 text-center shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
      <div className="relative mx-auto grid h-16 w-16 place-items-center">
        <motion.span
          aria-hidden
          className="absolute inset-[-16px] rounded-full bg-[radial-gradient(closest-side,rgba(229,72,77,0.55),transparent)]"
          animate={{ opacity: [0.2, 0.55, 1][level], scale: [0.8, 0.95, 1.15][level] }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={level}
            className="relative"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.3 }}
          >
            <LevelBadge level={level} />
          </motion.span>
        </AnimatePresence>
      </div>
      <p className="mt-4 text-[1.05rem] font-semibold">Investor call</p>
      <p className="text-[0.8rem] font-medium text-[#ffd9a0]">Starts in 15 minutes</p>

      {/* intensity: Gentle / Standard / Critical */}
      <div className="relative mt-5 grid grid-cols-3 rounded-xl bg-white/[0.05] p-1 text-[0.72rem]">
        {LEVELS.map((l, i) => (
          <span key={l.name} className={`relative z-10 py-1.5 transition-colors duration-500 ${i === level ? "text-white" : "text-white/40"}`}>
            {i === level && (
              <motion.span
                layoutId="alarm-level"
                className="absolute inset-0 -z-10 rounded-lg bg-white/[0.1]"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            {l.name}
          </span>
        ))}
      </div>
      <p className="mt-3 h-4 text-[0.72rem] text-white/45">{LEVELS[level].note}</p>
    </div>
  );
}

function SyncVisual() {
  // tile centres sit at y = 28 and 92 in the 120px-tall column
  const sources = [
    { key: "g", icon: <GoogleCalendarIcon className="h-8 w-8" />, y: 28 },
    { key: "o", icon: <OutlookIcon className="h-8 w-8" />, y: 92 },
  ];
  const path = (y: number) => `M0 ${y} C 70 ${y}, 90 60, 160 60`;

  return (
    <div className="flex items-center justify-center">
      <div className="flex h-[120px] flex-col justify-between">
        {sources.map((s) => (
          <span key={s.key} className="grid h-14 w-14 place-items-center rounded-2xl bg-white/[0.06] ring-1 ring-white/[0.08]">
            {s.icon}
          </span>
        ))}
      </div>
      <svg viewBox="0 0 160 120" className="h-[120px] w-[160px] shrink-0" aria-hidden>
        {sources.map((s, i) => (
          <g key={s.key}>
            <path d={path(s.y)} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
            {/* one dot each way: two-way sync */}
            <circle r="2.4" fill="#6ea8ff">
              <animateMotion path={path(s.y)} dur="2.8s" begin={`${i * 0.7}s`} repeatCount="indefinite" />
            </circle>
            <circle r="2.4" fill="#c7d2fe">
              <animateMotion path={path(s.y)} dur="2.8s" begin={`${1.4 + i * 0.7}s`} repeatCount="indefinite" keyPoints="1;0" keyTimes="0;1" calcMode="linear" />
            </circle>
          </g>
        ))}
      </svg>
      <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white/[0.06] ring-1 ring-white/[0.1]">
        <AppMark className="h-10 w-10" sizes="80px" />
      </span>
    </div>
  );
}

const PHRASE = "Lunch with Ana tomorrow at 2 pm";

function SpeakVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();
  // 0 listening · 1 typed · 2 confirmed
  const [phase, setPhase] = useState(0);
  const [chars, setChars] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    let t: ReturnType<typeof setTimeout>;
    if (phase === 0) t = setTimeout(() => setPhase(1), 1800);
    else if (phase === 1 && chars < PHRASE.length) t = setTimeout(() => setChars((c) => c + 1), 45);
    else if (phase === 1) t = setTimeout(() => setPhase(2), 500);
    else
      t = setTimeout(() => {
        setChars(0);
        setPhase(0);
      }, 2600);
    return () => clearTimeout(t);
  }, [inView, reduce, phase, chars]);

  const shownPhase = reduce ? 2 : phase;
  const text = reduce ? PHRASE : PHRASE.slice(0, chars);

  return (
    <div ref={ref} className="w-full max-w-[360px]">
      <div className="flex h-12 items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/[0.08]">
          <Mic className="h-3.5 w-3.5 text-white/80" aria-hidden />
        </span>
        {shownPhase === 0 ? (
          <span className="flex h-5 flex-1 items-center gap-[3px]" aria-hidden>
            {Array.from({ length: 22 }, (_, i) => (
              <span
                key={i}
                className="w-[3px] rounded-full bg-[#a78bfa]/80"
                style={{ height: "100%", animation: `listen-bar 1s ease-in-out ${(i % 7) * 0.12}s infinite` }}
              />
            ))}
          </span>
        ) : (
          <span className="flex-1 truncate text-[0.88rem] text-white/85">
            {text}
            {shownPhase === 1 && <span className="ml-px inline-block h-4 w-px translate-y-[3px] bg-white/70" />}
          </span>
        )}
      </div>
      <div className="mt-3 h-7">
        <AnimatePresence>
          {shownPhase === 2 && (
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-3 py-1 text-[0.75rem] font-medium text-emerald-300"
            >
              <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
              Confirmed · added to your calendar
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function JoinVisual() {
  return (
    <div className="flex flex-col items-center gap-4">
      <span className="rounded-[16px] bg-[linear-gradient(90deg,#3ee8ff,#7a7bff_55%,#e15bff)] p-[1.5px] transition-shadow duration-500 group-hover:shadow-[0_0_28px_rgba(110,140,255,0.45)]">
        <span className="flex h-11 items-center gap-2 rounded-[14.5px] bg-[#0c0c12] px-6 text-[0.9rem] font-semibold">
          <Video className="h-4 w-4" aria-hidden />
          Join now
        </span>
      </span>
      <span className="flex items-center gap-2">
        {[
          { name: "Zoom", icon: <ZoomIcon className="h-6 w-6" /> },
          { name: "Google Meet", icon: <GoogleMeetIcon className="h-6 w-6" /> },
          { name: "Microsoft Teams", icon: <TeamsIcon className="h-6 w-6" /> },
        ].map((a) => (
          <span
            key={a.name}
            title={a.name}
            className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.06] ring-1 ring-white/[0.08]"
          >
            {a.icon}
          </span>
        ))}
      </span>
    </div>
  );
}

const PEOPLE: { name: string; photo?: StaticImageData; initials?: string; color?: string }[] = [
  { name: "Ana", photo: people.woman },
  { name: "David", photo: people.man },
  { name: "Mia", initials: "MS", color: "#f59e0b" },
];

function ShareVisual() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center">
        {PEOPLE.map((p, i) => (
          <span
            key={p.name}
            className={`relative grid h-11 w-11 place-items-center overflow-hidden rounded-full text-[0.72rem] font-semibold ring-2 ring-[#0d0d11] transition-transform duration-500 ease-out ${
              i === 0 ? "group-hover:-translate-x-1.5" : i === 2 ? "group-hover:translate-x-1.5" : ""
            }`}
            style={{
              marginLeft: i ? -12 : 0,
              ...(p.color ? { background: `color-mix(in srgb, ${p.color} 22%, #0d0d11)`, color: p.color } : null),
            }}
          >
            {p.photo ? <Image src={p.photo} alt="" fill sizes="44px" className="object-cover" /> : p.initials}
          </span>
        ))}
        <span className="ml-3 inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1.5 text-[0.75rem] text-white/75">
          <Plus className="h-3.5 w-3.5" aria-hidden /> Invite
        </span>
      </div>
      <span className="flex items-center gap-1.5 text-[0.72rem] text-white/40 transition-colors duration-500 group-hover:text-white/70">
        <Link2 className="h-3.5 w-3.5" aria-hidden />
        zoom.us/j/84629371054
      </span>
    </div>
  );
}

const TAGLINES = ["Never miss what matters.", "Nunca te pierdas lo importante."];

function PlatformsVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const lang = useCycle(TAGLINES.length, 3200, inView);

  return (
    <div ref={ref} className="flex items-end gap-6">
      {["iPhone", "Android"].map((os, i) => (
        <div key={os} className="flex flex-col items-center gap-2">
          <div className={`relative h-[132px] w-[78px] border border-white/15 bg-white/[0.03] ${i ? "rounded-[14px]" : "rounded-[20px]"}`}>
            <span
              className={`absolute top-2 left-1/2 -translate-x-1/2 bg-white/15 ${i ? "h-1.5 w-1.5 rounded-full" : "h-1.5 w-6 rounded-full"}`}
            />
            <span className="absolute top-7 left-1/2 -translate-x-1/2">
              {i ? <AndroidIcon className="h-6 w-6" /> : <AppleIcon className="h-6 w-6 text-white" />}
            </span>
            <div className="absolute inset-x-2 top-[58%] -translate-y-1/2 text-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={lang}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-[0.62rem] leading-snug font-medium text-white/80"
                >
                  {TAGLINES[lang]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
          <span className="text-[0.72rem] font-medium text-white/55">{os}</span>
        </div>
      ))}
      <div className="mb-7 flex flex-col gap-1.5">
        {["EN", "ES"].map((l, i) => (
          <span
            key={l}
            className={`rounded-md px-2 py-0.5 font-mono text-[0.65rem] transition-colors duration-500 ${
              i === lang ? "bg-white/[0.1] text-white" : "text-white/35"
            }`}
          >
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- section ---------- */

export function Features() {
  return (
    <section id="features" aria-labelledby="features-title" className="relative py-20 sm:py-28">
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Features</p>
          <h2
            id="features-title"
            className="text-shine mt-3 text-[1.9rem] leading-[1.2] font-semibold tracking-[-0.02em] sm:text-[2.4rem]"
          >
            Everything it takes
            <br className="hidden sm:block" /> to show up on time.
          </h2>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-[1080px] gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Tile
            accent="#ff4d5e"
            className="md:col-span-2 lg:row-span-2"
            title="Alarms you can't miss"
            body="Full-screen alarms with sound and voice readout, gentle reminders, snooze and follow-ups — even when the app is closed. You choose the intensity for every meeting."
            visual={<AlarmVisual />}
          />
          <Tile
            accent="#4f8cff"
            className="md:col-span-2"
            title="Two-way calendar sync"
            body="Works with Google Calendar and Outlook. Meetings you create appear in both, with invitations and video-call links."
            visual={<SyncVisual />}
            delay={0.05}
          />
          <Tile
            accent="#22c55e"
            title="Instant join"
            body="One tap into the Zoom, Google Meet or Teams call — the link is generated for you."
            visual={<JoinVisual />}
            delay={0.1}
          />
          <Tile
            accent="#f59e0b"
            title="Share and invite"
            body="Invitations and the call link go to everyone in a tap."
            visual={<ShareVisual />}
            delay={0.15}
          />
          <Tile
            accent="#a78bfa"
            className="md:col-span-2"
            title="Speak or type"
            body="Tell the assistant what you need, in the app or by WhatsApp. It shows what it understood and only saves after you confirm."
            visual={<SpeakVisual />}
            delay={0.05}
          />
          <Tile
            accent="#2dd4bf"
            className="md:col-span-2"
            title="iPhone & Android · English & Español"
            body="The same assistant and alarms on every phone, in English and Spanish."
            visual={<PlatformsVisual />}
            delay={0.1}
          />
        </div>
      </div>
    </section>
  );
}
