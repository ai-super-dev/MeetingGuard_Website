"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { BellRing, CheckCheck, ChevronLeft, Mic, Phone, Plus, Video } from "lucide-react";
import { GoogleCalendarIcon, ZoomIcon } from "@/components/icons/brand";
import { AppMark } from "@/components/ui/Logo";
import { Screen } from "./Device";
import { FramedPhone } from "./FramedPhone";
import { TEAL_FRAME } from "./geometry";

/*
 * A WhatsApp conversation with the MeetingGuard agent, played beat by beat
 * when it scrolls into view:
 *   0 voice note · 1 text · 2 agent typing · 3 proposal with Confirm/Change
 *   4 "Confirm" · 5 agent confirms · 6 the alarm notification pops out
 */
const LAST = 6;
/** Pause before each beat (ms). */
const BEAT_MS = [700, 1300, 1100, 1700, 1500, 1300, 1700];

/* WhatsApp's dark-theme palette, so the chat reads as the real thing */
const WA = { bg: "#0b141a", bar: "#1f2c34", out: "#005c4b", in: "#1f2c34", tick: "#53bdeb", green: "#00a884" };

const pop = {
  initial: { opacity: 0, y: 10, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
};

function Bubble({ from, time, children }: { from: "me" | "bot"; time?: string; children: ReactNode }) {
  const me = from === "me";
  return (
    <motion.div
      {...pop}
      className={`max-w-[82%] rounded-[14px] px-[12px] pt-[8px] pb-[6px] text-[16px] leading-snug ${
        me ? "ml-auto rounded-tr-[4px]" : "rounded-tl-[4px]"
      }`}
      style={{ background: me ? WA.out : WA.in, transformOrigin: me ? "100% 0" : "0 0" }}
    >
      {children}
      {time && (
        <span className="mt-[2px] flex items-center justify-end gap-[3px] text-[11px] text-white/50">
          {time}
          {me && <CheckCheck className="h-[14px] w-[14px]" style={{ color: WA.tick }} aria-hidden />}
        </span>
      )}
    </motion.div>
  );
}

function ChatScreen({ step }: { step: number }) {
  return (
    <Screen className="bg-[#0b141a]" time="16:12" height={TEAL_FRAME.screenH}>
      {/* contact header */}
      <div className="relative mt-[14px] flex items-center gap-[10px] px-[14px] pb-[12px]" style={{ background: WA.bar }}>
        <ChevronLeft className="h-[24px] w-[24px] text-white/70" aria-hidden />
        <span className="grid h-[40px] w-[40px] place-items-center rounded-full bg-[#0e1a22]">
          <AppMark className="h-[30px] w-[30px]" sizes="60px" />
        </span>
        <span className="flex-1 leading-tight">
          <span className="block text-[17px] font-semibold">MeetingGuard</span>
          <span className="block text-[12px]" style={{ color: step === 2 ? WA.green : "rgba(255,255,255,0.5)" }}>
            {step === 2 ? "typing…" : "online"}
          </span>
        </span>
        <Video className="h-[22px] w-[22px] text-white/70" aria-hidden />
        <Phone className="ml-[14px] h-[20px] w-[20px] text-white/70" aria-hidden />
      </div>

      <div className="flex flex-col gap-[8px] px-[12px] pt-[14px]">
        <span className="mx-auto rounded-[8px] px-[10px] py-[3px] text-[12px] text-white/55" style={{ background: WA.in }}>
          Today
        </span>

        <Bubble from="bot" time="16:11">
          Hi! I&apos;m your MeetingGuard assistant. Text me or send a voice note — I&apos;ll schedule it and ring you
          before it starts.
        </Bubble>

        {step >= 0 && (
          <Bubble from="me" time="16:12">
            <span className="flex items-center gap-[10px]">
              <span className="grid h-[30px] w-[30px] place-items-center rounded-full bg-white/15">
                <Mic className="h-[16px] w-[16px]" aria-hidden />
              </span>
              <span className="flex h-[22px] items-center gap-[2px]" aria-hidden>
                {[8, 14, 6, 18, 10, 16, 7, 12, 18, 9, 14, 6, 11, 16, 8, 12, 15, 7].map((h, i) => (
                  <span key={i} className="w-[3px] rounded-full bg-white/70" style={{ height: h }} />
                ))}
              </span>
              <span className="text-[12px] text-white/60">0:05</span>
            </span>
          </Bubble>
        )}
        {step >= 1 && (
          <Bubble from="me" time="16:12">
            Investor call with Ana tomorrow at 10, add a Zoom link
          </Bubble>
        )}

        <AnimatePresence>
          {step === 2 && (
            <motion.div
              key="typing"
              {...pop}
              exit={{ opacity: 0 }}
              className="flex w-fit gap-[5px] rounded-[14px] rounded-tl-[4px] px-[14px] py-[13px]"
              style={{ background: WA.in }}
            >
              {[0, 0.15, 0.3].map((d) => (
                <motion.span
                  key={d}
                  className="h-[7px] w-[7px] rounded-full bg-white/60"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 0.9, delay: d, repeat: Infinity }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {step >= 3 && (
          <motion.div {...pop} className="w-[86%] overflow-hidden rounded-[14px] rounded-tl-[4px]" style={{ background: WA.in }}>
            <div className="px-[12px] pt-[8px] pb-[6px] text-[15px] leading-snug">
              <p className="text-white/70">Here&apos;s what I understood:</p>
              <p className="mt-[4px] text-[17px] font-semibold">Investor call with Ana</p>
              <p className="mt-[4px] text-white/75">Tomorrow · 10:00 – 10:45</p>
              <p className="mt-[3px] flex items-center gap-[6px] text-white/75">
                <ZoomIcon className="h-[16px] w-[16px]" /> Zoom link ready
              </p>
              <p className="mt-[3px] flex items-center gap-[6px] text-white/75">
                <BellRing className="h-[16px] w-[16px] text-[#ff8a95]" aria-hidden /> Alarm 15 min before
              </p>
              <span className="mt-[2px] block text-right text-[11px] text-white/50">16:12</span>
            </div>
            {/* WhatsApp quick-reply buttons */}
            {["Confirm", "Change"].map((b) => (
              <div
                key={b}
                className="border-t border-white/[0.08] py-[9px] text-center text-[15px] font-medium"
                style={{ color: WA.green }}
              >
                {b}
              </div>
            ))}
          </motion.div>
        )}
        {step >= 4 && (
          <Bubble from="me" time="16:12">
            Confirm
          </Bubble>
        )}
        {step >= 5 && (
          <Bubble from="bot" time="16:13">
            Done ✅ Saved to your calendar
            <span className="mt-[6px] flex items-center gap-[6px] text-[14px] text-white/75">
              <GoogleCalendarIcon className="h-[15px] w-[15px]" /> Google Calendar · invite sent to Ana
            </span>
            <span className="mt-[4px] block text-[14px] text-white/75">I&apos;ll ring you tomorrow at 9:45.</span>
          </Bubble>
        )}
      </div>

      {/* message bar */}
      <div className="absolute inset-x-[10px] bottom-[34px] flex items-center gap-[10px]">
        <span className="flex h-[46px] flex-1 items-center gap-[10px] rounded-full px-[14px] text-[15px] text-white/40" style={{ background: WA.in }}>
          <Plus className="h-[20px] w-[20px]" aria-hidden />
          Message
        </span>
        <span className="grid h-[46px] w-[46px] place-items-center rounded-full" style={{ background: WA.green }}>
          <Mic className="h-[20px] w-[20px] text-[#0b141a]" aria-hidden />
        </span>
      </div>
    </Screen>
  );
}

/** The alarm that fires later — popping out beside the phone to close the loop. */
function AlarmNotification() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -14, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="w-[270px] rounded-2xl border border-white/10 bg-[#141418]/90 p-3 shadow-[0_24px_60px_rgba(0,0,0,0.6),0_0_40px_rgba(255,60,80,0.18)] backdrop-blur-md"
    >
      <div className="flex items-center gap-2 text-[0.7rem] text-white/45">
        <AppMark className="h-4 w-4" sizes="32px" />
        <span className="flex-1">MeetingGuard</span>
        <span>Tomorrow 9:45</span>
      </div>
      <div className="mt-2 flex items-start gap-2.5">
        <span className="relative mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent/20">
          <span className="absolute inset-0 rounded-full bg-accent/30 [animation:glow-pulse_1.6s_ease-in-out_infinite]" />
          <BellRing className="relative h-4 w-4 text-[#ff8a95]" aria-hidden />
        </span>
        <span className="leading-tight">
          <span className="block text-[0.9rem] font-semibold">Investor call</span>
          <span className="block text-[0.78rem] text-white/55">Starts in 15 minutes · Join on Zoom</span>
        </span>
      </div>
    </motion.div>
  );
}

export function WhatsAppDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.45 });
  const reduce = useReducedMotion();
  const [played, setPlayed] = useState(-1);
  // reduced motion: show the finished conversation straight away
  const step = reduce ? LAST : played;

  useEffect(() => {
    if (!inView || reduce || played >= LAST) return;
    const t = setTimeout(() => setPlayed((s) => s + 1), BEAT_MS[played + 1]);
    return () => clearTimeout(t);
  }, [inView, reduce, played]);

  return (
    <div ref={ref} className="relative">
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(37,211,102,0.18),transparent)] blur-2xl"
      />
      <div className="relative">
        <FramedPhone frame={TEAL_FRAME} bodyHeight={600} mirror>
          <ChatScreen step={step} />
        </FramedPhone>
      </div>
      <div className="absolute bottom-[14%] left-1/2 -translate-x-1/2 sm:bottom-[20%] sm:-left-40 sm:translate-x-0">
        <AnimatePresence>{step >= LAST && <AlarmNotification />}</AnimatePresence>
      </div>
    </div>
  );
}
