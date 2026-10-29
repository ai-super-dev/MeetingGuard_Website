"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { AlarmClock, Bell, BellRing, CalendarDays, Check, CheckCheck, Link2, ListChecks, Loader2, MessageCircle, Mic, Reply, Video, Volume2 } from "lucide-react";
import { featureAccents } from "@/components/icons/feature-icons";
import { Reveal, useReducedMotionSafe } from "@/components/motion";
import { AvailableLabel } from "@/components/page/blocks";
import { AppMark } from "@/components/ui/Logo";
import { useT } from "@/lib/language";
import type { FeatureSlug } from "@/lib/routes";
import { availability } from "@/lib/site";

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

const WAVE_BARS = 30;

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
    if (phase === 0) timer = setTimeout(() => setPhase(1), 1800);
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

  // stacked (mic over the words) so it fits a narrow tile; the words wrap instead of being cut off
  return (
    <div ref={ref} className="flex w-full max-w-[380px] flex-col items-center text-center">
      <span className="relative grid h-11 w-11 place-items-center">
        {shownPhase === 0 && <span className="absolute inset-0 rounded-full bg-[#a78bfa]/25 [animation:glow-pulse_1.8s_ease-in-out_infinite]" />}
        <span className="relative grid h-9 w-9 place-items-center rounded-full bg-white/[0.08]">
          <Mic className="h-4 w-4 text-white/80" aria-hidden />
        </span>
      </span>
      <div className="mt-3 flex min-h-[4.5rem] w-full items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-2">
        {shownPhase === 0 ? (
          // spread over about 80% of the box (87% of the inside, past the padding), taller in the middle and lower at the ends, like a voice
          <span className="flex h-7 w-[87%] items-center justify-between" aria-hidden>
            {Array.from({ length: WAVE_BARS }, (_, i) => (
              <span
                key={i}
                className="w-[3px] rounded-full bg-[#a78bfa]/80"
                style={{
                  height: `${Math.round(35 + 65 * Math.sin((Math.PI * (i + 0.5)) / WAVE_BARS))}%`,
                  animation: `listen-bar 1s ease-in-out ${((i * 5) % 11) * 0.09}s infinite`,
                }}
              />
            ))}
          </span>
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
      <AvailableLabel className="mt-3 whitespace-normal!">
        {v.debrief} · {t.available(availability.debrief)}
      </AvailableLabel>
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

/* ---------- Zoom and Teams links ---------- */

/** A meeting gets a Zoom link, then a Teams one (names only, no third-party logos). */
function LinksVisual() {
  const t = useT();
  const v = t.features.visuals;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const phase = useCycle(4, 1500, inView); // 0 Zoom, creating · 1 Zoom link · 2 Teams, creating · 3 Teams link
  const service = phase < 2 ? 0 : 1;
  const ready = phase % 2 === 1;
  const services = [
    { name: "Zoom", url: "zoom.us/j/84629371054" },
    { name: "Teams", url: "teams.microsoft.com/l/meetup-join" },
  ];
  return (
    <div ref={ref} className="w-full max-w-[300px] rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3 text-left">
      <p className="truncate text-[0.84rem] font-medium text-white">{v.linked}</p>
      <p className="mt-0.5 text-[0.72rem] text-white/50">{v.linkWhen}</p>
      <div className="mt-3 grid grid-cols-2 rounded-lg bg-white/[0.05] p-0.5 text-[0.74rem]">
        {services.map((s, i) => (
          <span
            key={s.name}
            className={`relative z-10 flex items-center justify-center gap-1.5 py-1.5 transition-colors duration-500 ${i === service ? "text-white" : "text-white/50"}`}
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

/** What syncs today and what is on the way (names only, no third-party logos). */
function IntegrationsVisual() {
  const t = useT();
  const sources = [
    { name: "Google Calendar", icon: CalendarDays, month: null },
    { name: "Outlook", icon: CalendarDays, month: availability.outlook },
    { name: "Microsoft To Do", icon: ListChecks, month: availability.microsoftToDo },
    { name: "Google Tasks", icon: ListChecks, month: availability.googleTasks },
  ] as const;
  // row centres in the 176px-tall column (four 36px rows)
  const ys = [18, 64.7, 111.3, 158];
  const path = (y: number) => `M0 ${y} C 50 ${y}, 60 88, 110 88`;
  return (
    <div className="flex items-center justify-center">
      <div className="flex h-[176px] flex-col justify-between">
        {sources.map((s) => {
          const Icon = s.icon;
          return (
            <span
              key={s.name}
              className={`flex h-9 items-center gap-2 rounded-xl px-3 ring-1 ${s.month ? "bg-white/[0.02] ring-white/[0.06]" : "bg-white/[0.06] ring-white/[0.1]"}`}
            >
              <Icon className={`h-4 w-4 ${s.month ? "text-white/35" : "text-[#8ab4ff]"}`} aria-hidden />
              <span className={`text-[0.78rem] whitespace-nowrap ${s.month ? "text-white/45" : "text-white"}`}>{s.name}</span>
              {s.month ? (
                <span className="ml-1 rounded-full bg-warm/10 px-1.5 py-0.5 text-[0.6rem] whitespace-nowrap text-warm">{t.available(s.month)}</span>
              ) : (
                <span className="ml-1 flex items-center gap-1 text-[0.6rem] text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  {t.features.visuals.live}
                </span>
              )}
            </span>
          );
        })}
      </div>
      <svg viewBox="0 0 110 176" className="hidden h-[176px] w-[110px] shrink-0 sm:block" aria-hidden>
        {sources.map((s, i) => (
          <g key={s.name}>
            <path
              d={path(ys[i])}
              fill="none"
              style={{ stroke: `color-mix(in oklab, var(--color-white) ${s.month ? 8 : 20}%, transparent)` }}
              strokeWidth="1"
              strokeDasharray={s.month ? "3 4" : undefined}
            />
            {!s.month && (
              <>
                <circle r="2.4" fill="#6ea8ff">
                  <animateMotion path={path(ys[i])} dur="2.6s" repeatCount="indefinite" />
                </circle>
                <circle r="2.4" fill="#c7d2fe">
                  <animateMotion path={path(ys[i])} dur="2.6s" begin="1.3s" repeatCount="indefinite" keyPoints="1;0" keyTimes="0;1" calcMode="linear" />
                </circle>
              </>
            )}
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
