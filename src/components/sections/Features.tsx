"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { AlarmClock, Bell, BellRing, CalendarDays, Check, CheckCheck, Link2, ListChecks, Loader2, MessageCircle, Mic, Reply, Video, Volume2 } from "lucide-react";
import { featureAccents } from "@/components/icons/feature-icons";
import { Reveal, useReducedMotionSafe } from "@/components/motion";
import { AppMark } from "@/components/ui/Logo";
import { useT } from "@/lib/language";
import type { FeatureSlug } from "@/lib/routes";

/* ---------- shared ---------- */

/** Ticks through `count` states every `ms` while `active`; frozen on the last state for reduced motion. */
function useCycle(count: number, ms: number, active: boolean) {
  const reduce = useReducedMotionSafe();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!active || reduce) return;
    const timer = setInterval(() => setI((n) => (n + 1) % count), ms);
    return () => clearInterval(timer);
  }, [active, reduce, count, ms]);
  return reduce ? count - 1 : i;
}

/**
 * Bento tile: quiet dark surface with a faint accent tint, and a soft
 * spotlight (plus border highlight) that follows the cursor on hover.
 */
function Tile({
  slug,
  title,
  body,
  visual,
  className = "",
  delay = 0,
}: {
  slug: FeatureSlug;
  title: string;
  body: string;
  visual: ReactNode;
  className?: string;
  delay?: number;
}) {
  const accent = featureAccents[slug];
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
      <div
        ref={ref}
        onPointerMove={onMove}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-[linear-gradient(180deg,var(--color-card-from),var(--color-card-to))] transition-colors duration-500 hover:border-white/[0.12]"
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

        <div className="relative flex min-h-[170px] flex-1 items-center justify-center px-6 pt-8">{visual}</div>
        <div className="relative px-6 pt-5 pb-6">
          <h3 className="text-[1rem] font-semibold text-white">{title}</h3>
          <p className="mt-1.5 max-w-md text-[0.86rem] leading-relaxed text-white/60">{body}</p>
        </div>
      </div>
    </Reveal>
  );
}

/* ---------- alarms ---------- */

/** The alarm badge for each intensity: outline bell, ringing bell, shaking alarm clock. */
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
        <AlarmClock className="h-8 w-8 text-white [animation:bell-vibrate_1.2s_linear_infinite]" strokeWidth={2.2} aria-hidden />
      </span>
    </span>
  );
}

function AlarmVisual() {
  const t = useT();
  const levels = t.features.levels;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const level = useCycle(levels.length, 2800, inView);

  return (
    <div ref={ref} className="w-full max-w-[340px] rounded-[24px] border border-white/[0.08] bg-panel px-6 pt-8 pb-6 text-center shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
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
      <p className="mt-4 text-[1.05rem] font-semibold">{t.alarm.title}</p>
      <p className="text-[0.8rem] font-medium text-warm">{t.alarm.startsIn}</p>

      {/* intensity: Gentle / Standard / Critical */}
      <div className="relative mt-5 grid grid-cols-3 rounded-xl bg-white/[0.05] p-1 text-[0.72rem]">
        {levels.map((l, i) => (
          <span key={i} className={`relative z-10 py-1.5 transition-colors duration-500 ${i === level ? "text-white" : "text-white/50"}`}>
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
      <p className="mt-3 h-4 text-[0.72rem] text-white/55">{levels[level].note}</p>
    </div>
  );
}

/* ---------- voice assistant ---------- */

const WAVE_BARS = 36;
/** Tallest and shortest bar, in px. */
const WAVE_MAX = 54;
const WAVE_MIN = 3;
/** How long the card "listens" before the words appear: about the time it takes to say the sentence. */
const LISTEN_MS = 3300;

/**
 * Loudness over time (0 to 1), like someone speaking: words of 0.25 to 0.6 s
 * that swell and fade like syllables, with short pauses of 0.1 to 0.25 s
 * between them. One value per 80 ms.
 */
function loudnessSource(rand: () => number) {
  let left = 0;
  let len = 0;
  let pause = false;
  let peak = 0;
  return () => {
    if (left <= 0) {
      pause = !pause;
      len = left = pause ? 1 + Math.floor(rand() * 3) : 3 + Math.floor(rand() * 5);
      peak = 0.6 + rand() * 0.4;
    }
    const k = len - left;
    left -= 1;
    if (pause) return 0.03;
    const syllable = Math.sin((Math.PI * (k + 0.5)) / len);
    return peak * (0.45 + 0.55 * syllable) * (0.75 + rand() * 0.25);
  };
}

/** Violet on the left to blue on the right, one colour per bar. */
const WAVE_COLORS = Array.from({ length: WAVE_BARS }, (_, i) => {
  const stops = [
    [167, 139, 250], // violet
    [129, 140, 248], // indigo
    [96, 165, 250], // blue
  ];
  const x = (i / (WAVE_BARS - 1)) * (stops.length - 1);
  const a = stops[Math.floor(x)];
  const b = stops[Math.min(stops.length - 1, Math.floor(x) + 1)];
  const f = x - Math.floor(x);
  return `rgb(${a.map((c, k) => Math.round(c + (b[k] - c) * f)).join(",")})`;
});

/**
 * A bar's height at time `t` (s) for a loudness: a soft lens (tallest in the
 * middle) with two gentle bumps drifting along the row, so the shape keeps
 * flowing while every bar stays in place.
 */
function waveHeight(i: number, t: number, loud: number) {
  const x = (i + 0.5) / WAVE_BARS;
  const lens = Math.exp(-(((x - 0.5) / 0.36) ** 2));
  const ripple = 0.5 + 0.3 * Math.sin(2 * Math.PI * (1.3 * x - 1.1 * t)) + 0.2 * Math.sin(2 * Math.PI * (2.7 * x + 1.6 * t) + 1.7);
  return WAVE_MIN + (WAVE_MAX - WAVE_MIN) * Math.min(1, loud * 1.6) * lens * ripple;
}

/**
 * The listening wave: rounded bars that rise and settle smoothly with the
 * voice (every frame, eased), drop to soft dots in the pauses, and make the
 * mic's halo breathe with the same loudness.
 */
function VoiceWave({ active, halo }: { active: boolean; halo: React.RefObject<HTMLSpanElement | null> }) {
  const bars = useRef<(HTMLSpanElement | null)[]>([]);
  useEffect(() => {
    if (!active) return;
    const source = loudnessSource(Math.random);
    const heights = Array.from({ length: WAVE_BARS }, (_, i) => waveHeight(i, 0, 0.6));
    const start = performance.now();
    let loud = 0.6;
    let target = 0.6;
    let next = start;
    let frame = 0;
    const step = (now: number) => {
      const t = (now - start) / 1000;
      if (now >= next) {
        target = source();
        next = now + 80;
      }
      // quick to rise, slower to settle, like a voice meter
      loud += (target - loud) * (target > loud ? 0.22 : 0.09);
      for (let i = 0; i < WAVE_BARS; i++) {
        heights[i] += (waveHeight(i, t, loud) - heights[i]) * 0.3;
        const el = bars.current[i];
        if (el) el.style.height = `${heights[i].toFixed(1)}px`;
      }
      if (halo.current) {
        halo.current.style.transform = `scale(${(0.85 + 0.55 * loud).toFixed(3)})`;
        halo.current.style.opacity = (0.35 + 0.65 * loud).toFixed(3);
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [active, halo]);

  // the first frame is the same on the server and in the browser
  return (
    <span className="flex h-14 w-[80%] items-center justify-between drop-shadow-[0_0_8px_rgba(139,124,250,0.45)]" aria-hidden>
      {WAVE_COLORS.map((color, i) => (
        <span
          key={i}
          ref={(el) => {
            bars.current[i] = el;
          }}
          className="w-[3px] rounded-full"
          style={{ height: `${waveHeight(i, 0, 0.6).toFixed(1)}px`, background: color }}
        />
      ))}
    </span>
  );
}

function SpeakVisual() {
  const t = useT();
  const phrase = t.features.phrase;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotionSafe();
  // 0 listening · 1 typed · 2 confirmed
  const [phase, setPhase] = useState(0);
  const [chars, setChars] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    let timer: ReturnType<typeof setTimeout>;
    if (phase === 0) timer = setTimeout(() => setPhase(1), LISTEN_MS);
    else if (phase === 1 && chars < phrase.length) timer = setTimeout(() => setChars((c) => c + 1), 45);
    else if (phase === 1) timer = setTimeout(() => setPhase(2), 500);
    else
      timer = setTimeout(() => {
        setChars(0);
        setPhase(0);
      }, 2600);
    return () => clearTimeout(timer);
  }, [inView, reduce, phase, chars, phrase]);

  const shownPhase = reduce ? 2 : phase;
  const text = reduce ? phrase : phrase.slice(0, chars);
  const halo = useRef<HTMLSpanElement>(null);

  // stacked (mic over the words) so it fits a narrow tile; the words wrap instead of being cut off
  return (
    <div ref={ref} className="flex w-full max-w-[380px] flex-col items-center text-center">
      <span className="relative grid h-11 w-11 place-items-center">
        {/* while listening, the halo grows and fades with the voice */}
        {shownPhase === 0 && <span ref={halo} className="absolute -inset-2 rounded-full bg-[radial-gradient(closest-side,rgba(139,124,250,0.55),rgba(96,165,250,0.15)_70%,transparent)]" />}
        <span className="relative grid h-9 w-9 place-items-center rounded-full bg-white/[0.08]">
          <Mic className="h-4 w-4 text-white/80" aria-hidden />
        </span>
      </span>
      <div className="mt-3 flex min-h-[4.5rem] w-full items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-2">
        {shownPhase === 0 ? (
          <VoiceWave active={inView && !reduce} halo={halo} />
        ) : (
          <span className="text-[0.86rem] leading-snug text-white/85">
            {text}
            {shownPhase === 1 && <span className="ml-px inline-block h-4 w-px translate-y-[3px] bg-white/70" />}
          </span>
        )}
      </div>
      {/* room for two lines: in a narrow tile the note wraps */}
      <div className="mt-3 flex min-h-[2.6rem] items-start justify-center">
        <AnimatePresence>
          {shownPhase === 2 && (
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-emerald-400/10 px-3 py-1 text-[0.74rem] leading-snug font-medium text-emerald-300"
            >
              <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
              {t.features.confirmed}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------- tasks ---------- */

/** A new task arrives (linked to its meeting), then the first one is ticked off. */
function TasksVisual() {
  const t = useT();
  const v = t.features.visuals;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const phase = useCycle(3, 1700, inView); // 0 two tasks · 1 new task in · 2 new task ticked
  const rows = [
    ...(phase >= 1 ? [{ title: v.newTaskShort, due: v.dueToday, fresh: true }] : []),
    ...v.tasks.map((x) => ({ ...x, fresh: false })),
  ];
  return (
    <div ref={ref} className="w-full max-w-[300px]">
      <div className="flex h-[116px] flex-col justify-end gap-2">
        <AnimatePresence initial={false}>
          {rows.map((r, i) => {
            const done = phase === 2 && i === 0;
            return (
              <motion.div
                key={r.title}
                layout
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 ${r.fresh ? "border-[#f59e0b]/40 bg-[#f59e0b]/[0.06]" : "border-white/[0.07] bg-white/[0.03]"}`}
              >
                <span
                  className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border transition-colors duration-500 ${done ? "border-emerald-400 bg-emerald-400" : "border-white/30"}`}
                >
                  {done && <Check className="h-2.5 w-2.5 text-on-inverse" strokeWidth={4} aria-hidden />}
                </span>
                <span className={`min-w-0 flex-1 truncate text-[0.78rem] ${done ? "text-white/40 line-through" : "text-white/85"}`}>{r.title}</span>
                <span className="shrink-0 rounded-full bg-white/[0.06] px-2 py-0.5 text-[0.65rem] text-white/55">{r.due}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-[0.72rem] font-medium text-emerald-300">
        <Mic className="h-3 w-3 shrink-0" aria-hidden />
        {v.debrief}
      </span>
    </div>
  );
}

/* ---------- agenda aloud ---------- */

/** Each part of the agenda lights up as it is read. */
function AgendaVisual() {
  const t = useT();
  const s = t.screens;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const line = useCycle(3, 1500, inView);
  const rows = [
    { label: s.agendaToday, n: s.agendaItems.today.length },
    { label: s.agendaOverdue, n: s.agendaItems.overdue.length },
    { label: s.agendaTomorrow, n: s.agendaItems.tomorrow.length },
  ];
  return (
    <div ref={ref} className="flex w-full max-w-[280px] flex-col items-center gap-4">
      <span className="relative grid h-14 w-14 place-items-center">
        <span className="absolute inset-0 rounded-full bg-[#2dd4bf]/20 [animation:glow-pulse_1.8s_ease-in-out_infinite]" />
        <span className="relative grid h-11 w-11 place-items-center rounded-full bg-[#2dd4bf]/90 text-[#062a26]">
          <Volume2 className="h-5 w-5" aria-hidden />
        </span>
      </span>
      <div className="w-full space-y-1.5">
        {rows.map((r, i) => (
          <div
            key={r.label}
            className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-[0.78rem] transition-colors duration-500 ${
              i === line ? "bg-[#2dd4bf]/12 text-white" : "text-white/45"
            }`}
          >
            <span>{r.label}</span>
            <span className="flex items-center gap-2">
              {i === line && (
                <span className="flex h-3 items-center gap-[2px]" aria-hidden>
                  {Array.from({ length: 5 }, (_, k) => (
                    <span
                      key={k}
                      className="w-[2px] rounded-full bg-[#2dd4bf]"
                      style={{ height: "100%", animation: `listen-bar 0.9s ease-in-out ${k * 0.12}s infinite` }}
                    />
                  ))}
                </span>
              )}
              <span className="tabular-nums">{r.n}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- WhatsApp ---------- */

/** A message, the confirm card, the tap, the reply, in a small WhatsApp chat window. */
function WhatsAppVisual() {
  const t = useT();
  const v = t.features.visuals;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const phase = useCycle(4, 1500, inView); // 0 ask · 1 card · 2 confirmed · 3 done
  const pop = { initial: { opacity: 0, y: 6, scale: 0.97 }, animate: { opacity: 1, y: 0, scale: 1 }, transition: { duration: 0.35 } };
  return (
    // WhatsApp's own dark chat colours, kept in both site themes (the name and a generic chat icon, no logo)
    <div
      ref={ref}
      className="theme-dark w-full max-w-[360px] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0b141a] text-[0.78rem] shadow-[0_24px_60px_rgba(0,0,0,0.35)]"
    >
      <div className="flex items-center gap-2.5 bg-[#1f2c34] px-3 py-2">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#0e1a22]">
          <AppMark className="h-6 w-6" sizes="48px" />
        </span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block truncate text-[0.82rem] font-medium text-white">Meeting Guard AI</span>
          <span className="block text-[0.66rem] text-white/50">{v.chatOnline}</span>
        </span>
        <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#25D366]/15 px-2 py-1 text-[0.66rem] font-semibold text-[#25D366]">
          <MessageCircle className="h-3.5 w-3.5" aria-hidden />
          WhatsApp
        </span>
      </div>
      <div className="flex h-[172px] flex-col justify-end gap-2 overflow-hidden px-3 py-2.5">
        <motion.p {...pop} className="ml-auto flex max-w-[80%] items-end gap-1.5 rounded-xl rounded-tr-sm bg-[#005c4b] px-3 py-1.5 text-white/90">
          {v.chatAsk}
          <CheckCheck className="mb-px h-3.5 w-3.5 shrink-0 text-[#53bdeb]" aria-hidden />
        </motion.p>
        <AnimatePresence>
          {phase >= 1 && (
            <motion.div key="card" {...pop} className="max-w-[82%] overflow-hidden rounded-xl rounded-tl-sm bg-[#1f2c34]">
              <p className="px-3 pt-2 pb-1.5 text-white/85">{v.chatCard}</p>
              <div className="grid grid-cols-2 border-t border-white/[0.08] text-[0.72rem] font-medium">
                <span
                  className={`flex items-center justify-center gap-1 py-1.5 transition-colors duration-300 ${phase >= 2 ? "bg-[#00a884]/20 text-white" : "text-[#00a884]"}`}
                >
                  <Reply className="h-3 w-3" aria-hidden />
                  {t.whatsapp.chat.confirm}
                </span>
                <span className="flex items-center justify-center gap-1 border-l border-white/[0.08] py-1.5 text-[#00a884]">
                  <Reply className="h-3 w-3" aria-hidden />
                  {t.whatsapp.chat.cancel}
                </span>
              </div>
            </motion.div>
          )}
          {phase >= 3 && (
            <motion.p key="done" {...pop} className="max-w-[78%] rounded-xl rounded-tl-sm bg-[#1f2c34] px-3 py-1.5 text-white/85">
              {v.chatDone}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      <div className="flex items-center gap-2 px-2.5 pb-2.5">
        <span className="flex h-8 min-w-0 flex-1 items-center rounded-full bg-[#1f2c34] px-3 text-white/40">
          <span className="truncate">{t.whatsapp.chat.message}</span>
        </span>
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#00a884]">
          <Mic className="h-4 w-4 text-[#0b141a]" aria-hidden />
        </span>
      </div>
    </div>
  );
}

/* ---------- Google Meet, Zoom and Teams links ---------- */

/** A meeting gets a Google Meet link, then a Zoom one, then a Teams one (names only, no third-party logos). */
function LinksVisual() {
  const t = useT();
  const v = t.features.visuals;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const phase = useCycle(6, 1500, inView); // per service: creating, then its link (Google Meet, Zoom, Teams)
  const service = Math.floor(phase / 2);
  const ready = phase % 2 === 1;
  const services = [
    { name: "Google Meet", url: "meet.google.com/kdw-qmzp-xra" },
    { name: "Zoom", url: "zoom.us/j/84629371054" },
    { name: "Teams", url: "teams.microsoft.com/l/meetup-join" },
  ];
  return (
    <div ref={ref} className="w-full max-w-[300px] rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3 text-left">
      <p className="truncate text-[0.84rem] font-medium text-white">{v.linked}</p>
      <p className="mt-0.5 text-[0.72rem] text-white/50">{v.linkWhen}</p>
      <div className="mt-3 grid grid-cols-[1.4fr_1fr_1fr] rounded-lg bg-white/[0.05] p-0.5 text-[0.74rem]">
        {services.map((s, i) => (
          <span
            key={s.name}
            className={`relative z-10 flex items-center justify-center gap-1.5 py-1.5 whitespace-nowrap transition-colors duration-500 ${i === service ? "text-white" : "text-white/50"}`}
          >
            {i === service && (
              <motion.span
                layoutId="link-service"
                className="absolute inset-0 -z-10 rounded-md bg-white/[0.1]"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <Video className="h-3.5 w-3.5" aria-hidden />
            {s.name}
          </span>
        ))}
      </div>
      <div className="mt-2 flex h-9 items-center gap-2 rounded-lg border border-white/[0.07] px-2.5 text-[0.74rem]">
        {ready ? (
          <>
            <Link2 className="h-3.5 w-3.5 shrink-0 text-[#f472b6]" aria-hidden />
            <span className="min-w-0 flex-1 truncate text-white/80">{services[service].url}</span>
            <Check className="h-3.5 w-3.5 shrink-0 text-emerald-300" strokeWidth={3} aria-hidden />
          </>
        ) : (
          <>
            <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-white/45" aria-hidden />
            <span className="truncate text-white/50">{v.linkCreating}</span>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- calendars and tasks ---------- */

/** The calendars and task lists that sync with the app (names only, no third-party logos). */
function IntegrationsVisual() {
  const t = useT();
  const sources = [
    { name: "Google Calendar", icon: CalendarDays },
    { name: "Outlook", icon: CalendarDays },
    { name: "Microsoft To Do", icon: ListChecks },
    { name: "Google Tasks", icon: ListChecks },
  ] as const;
  // row centres in the 176px-tall column (four 36px rows)
  const ys = [18, 64.7, 111.3, 158];
  /*
   * Each line has its own speed, start point and pause, so the dots never move
   * together: `dur` is one trip in seconds, `out`/`back` are where each dot is at
   * the start (a negative begin, so no dot waits in the corner), and `wait` is the
   * share of each trip it rests before leaving.
   */
  const flows = [
    { dur: 2.3, out: -0.4, back: -1.6, wait: 0.15 },
    { dur: 3.4, out: -2.6, back: -0.7, wait: 0.35 },
    { dur: 2.8, out: -1.3, back: -2.5, wait: 0.05 },
    { dur: 3.9, out: -3.1, back: -1.2, wait: 0.25 },
  ];
  const path = (y: number) => `M0 ${y} C 50 ${y}, 60 88, 110 88`;
  return (
    <div className="flex items-center justify-center">
      <div className="flex h-[176px] flex-col justify-between">
        {sources.map((s) => {
          const Icon = s.icon;
          return (
            <span key={s.name} className="flex h-9 items-center gap-2 rounded-xl bg-white/[0.06] px-3 ring-1 ring-white/[0.1]">
              <Icon className="h-4 w-4 text-[#8ab4ff]" aria-hidden />
              <span className="text-[0.78rem] whitespace-nowrap text-white">{s.name}</span>
              <span className="ml-1 flex items-center gap-1 text-[0.6rem] text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {t.features.visuals.live}
              </span>
            </span>
          );
        })}
      </div>
      <svg viewBox="0 0 110 176" className="hidden h-[176px] w-[110px] shrink-0 sm:block" aria-hidden>
        {sources.map((s, i) => (
          <g key={s.name}>
            <path d={path(ys[i])} fill="none" style={{ stroke: "color-mix(in oklab, var(--color-white) 20%, transparent)" }} strokeWidth="1" />
            {/* to the app, then back from it; each rests a moment, then eases along the line */}
            <circle r="2.4" fill="#6ea8ff">
              <animateMotion
                path={path(ys[i])}
                dur={`${flows[i].dur}s`}
                begin={`${flows[i].out}s`}
                repeatCount="indefinite"
                calcMode="spline"
                keyPoints="0;0;1"
                keyTimes={`0;${flows[i].wait};1`}
                keySplines="0 0 1 1;0.45 0 0.55 1"
              />
            </circle>
            <circle r="2.4" fill="#c7d2fe">
              <animateMotion
                path={path(ys[i])}
                dur={`${flows[(i + 2) % 4].dur}s`}
                begin={`${flows[i].back}s`}
                repeatCount="indefinite"
                calcMode="spline"
                keyPoints="1;1;0"
                keyTimes={`0;${flows[(i + 1) % 4].wait};1`}
                keySplines="0 0 1 1;0.45 0 0.55 1"
              />
            </circle>
          </g>
        ))}
      </svg>
      <span className="hidden h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white/[0.06] ring-1 ring-white/[0.1] sm:grid">
        <AppMark className="h-10 w-10" sizes="80px" />
      </span>
    </div>
  );
}

/* ---------- section ---------- */

export function Features() {
  const t = useT();
  const f = t.features;
  return (
    <section id="features" aria-labelledby="features-title" className="relative py-14 sm:py-[4.5rem]">
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{f.eyebrow}</p>
          <h2 id="features-title" className="mt-3 text-[1.9rem] leading-[1.2] font-semibold tracking-[-0.02em] text-balance sm:text-[2.4rem]">
            {f.line1}
            <br />
            <span className="text-white/50">{f.line2}</span>
          </h2>
        </Reveal>

        {/* wide: two half-width tiles per row for the first two rows, then the voice tile half-width beside two small ones */}
        <div className="mx-auto mt-14 grid max-w-[1080px] gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Tile slug="whatsapp" className="md:col-span-2" {...f.tiles.whatsapp} visual={<WhatsAppVisual />} />
          <Tile slug="alarms" className="md:col-span-2" {...f.tiles.alarms} visual={<AlarmVisual />} delay={0.05} />
          <Tile slug="meeting-links" className="md:col-span-2" {...f.tiles["meeting-links"]} visual={<LinksVisual />} delay={0.05} />
          <Tile slug="integrations" className="md:col-span-2" {...f.tiles.integrations} visual={<IntegrationsVisual />} delay={0.1} />
          <Tile slug="voice-assistant" className="md:col-span-2" {...f.tiles["voice-assistant"]} visual={<SpeakVisual />} delay={0.05} />
          <Tile slug="tasks" {...f.tiles.tasks} visual={<TasksVisual />} delay={0.1} />
          <Tile slug="agenda" {...f.tiles.agenda} visual={<AgendaVisual />} delay={0.15} />
        </div>
      </div>
    </section>
  );
}

/* the visuals double as illustrations on the feature pages */
export { AgendaVisual, AlarmVisual, IntegrationsVisual, LinksVisual, SpeakVisual, TasksVisual, WhatsAppVisual };
