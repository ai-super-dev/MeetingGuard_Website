"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { ArrowLeft, CheckCheck, Menu, Mic, EllipsisVertical, Plus, Reply, Sun } from "lucide-react";
import { useReducedMotionSafe } from "@/components/motion";
import { AppMark } from "@/components/ui/Logo";
import { useT } from "@/lib/language";
import { siteConfig } from "@/lib/site";
import { Screen } from "./Device";
import { FramedPhone } from "./FramedPhone";
import { STRAIGHT_FRAME } from "./geometry";

/*
 * The real WhatsApp-linking flow on two phones. Beats:
 *   0 "Generate code" tapped · 1 code card shown (MeetingGuard app)
 *   2 code sent · 3 "linked" reply · 4 booking request
 *   5 proposal with Confirm/Cancel · 6 Confirm · 7 Done (WhatsApp)
 * Each phone plays its beats once it is in view and the previous phone has
 * finished, so it reads left-to-right on desktop and phone-by-phone on mobile.
 */
const LAST = 7;
/** Beats owned by each phone, and the pause before each of them (ms). */
const PHONE_BEATS = [[0, 1], [2, 3, 4, 5, 6, 7]];
const BEAT_MS = [2000, 450, 800, 1100, 1300, 1300, 1400, 1100];

export const LINK_CODE = "891675";

/* WhatsApp dark theme */
const WA = { bg: "#0b141a", bar: "#1f2c34", out: "#005c4b", in: "#1f2c34", tick: "#53bdeb", green: "#00a884" };
/* MeetingGuard app theme (from the app's WhatsApp screen) */
const APP = { bg: "#0e1524", card: "#131b2c", line: "#263048", accent: "#b3b7ff", ink: "#1b1f4d", muted: "#9aa3b8" };

const pop = {
  initial: { opacity: 0, y: 10, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
};

/* ---------- phone 1: MeetingGuard app ---------- */

function AppLinkScreen({ step }: { step: number }) {
  const t = useT();
  const l = t.whatsapp.link;
  const pressed = step === 0;
  const ready = step >= 1;
  return (
    <Screen className="bg-[#0e1524]" time="11:40" height={STRAIGHT_FRAME.screenH}>
      <div className="mt-[16px] flex items-center gap-[12px] border-b px-[16px] pb-[14px]" style={{ borderColor: APP.line }}>
        <ArrowLeft className="h-[22px] w-[22px] text-white/85" aria-hidden />
        <span className="flex-1 text-[20px] font-medium">WhatsApp</span>
        <span className="grid h-[34px] w-[34px] place-items-center rounded-full text-[11px] font-semibold" style={{ background: APP.line }}>
          {t.lang.toUpperCase()}
        </span>
        <span className="grid h-[34px] w-[34px] place-items-center rounded-full" style={{ background: APP.line }}>
          <Sun className="h-[17px] w-[17px]" aria-hidden />
        </span>
        <Menu className="h-[22px] w-[22px] text-white/85" aria-hidden />
      </div>

      <p className="px-[16px] pt-[14px] text-[13px] leading-[1.45]" style={{ color: APP.muted }}>
        {l.intro}
      </p>

      <div className="relative mx-[14px] mt-[14px]">
        <AnimatePresence mode="wait" initial={false}>
          {!ready ? (
            <motion.div
              key="generate"
              animate={{ scale: pressed ? 0.95 : 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="relative flex h-[46px] items-center justify-center overflow-hidden rounded-full text-[15px] font-semibold"
              style={{ background: APP.accent, color: APP.ink }}
            >
              {/* tap ripple */}
              {pressed && (
                <motion.span
                  aria-hidden
                  className="absolute h-[40px] w-[40px] rounded-full bg-white/60"
                  initial={{ scale: 0, opacity: 0.8 }}
                  animate={{ scale: 9, opacity: 0 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                />
              )}
              <span className="relative">{l.generate}</span>
            </motion.div>
          ) : (
            <motion.div
              key="code"
              {...pop}
              className="rounded-[16px] border px-[14px] pt-[18px] pb-[14px] text-center"
              style={{ background: APP.card, borderColor: APP.line }}
            >
              <p className="font-mono text-[36px] font-semibold tracking-[0.18em]">{LINK_CODE}</p>
              <p className="mt-[6px] text-[13px]" style={{ color: APP.muted }}>
                {l.sendTo} {siteConfig.whatsappNumberRaw}
              </p>
              <p className="mt-[12px] text-[13px]" style={{ color: APP.muted }}>
                {l.expires}
              </p>
              <div
                className="mt-[14px] flex h-[42px] items-center justify-center rounded-full text-[14px] font-semibold"
                style={{ background: "#2e3a52" }}
              >
                {l.copy}
              </div>
              <div
                className="mt-[10px] flex h-[42px] items-center justify-center rounded-full text-[14px] font-semibold"
                style={{ background: APP.accent, color: APP.ink }}
              >
                {l.open}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <span
        className="absolute bottom-[40px] left-[16px] grid h-[50px] w-[50px] place-items-center rounded-full"
        style={{ background: APP.accent }}
      >
        <AppMark className="h-[28px] w-[28px]" sizes="56px" />
      </span>
    </Screen>
  );
}

/* ---------- phones 2 & 3: WhatsApp ---------- */

function Bubble({ from, time, children, className = "" }: { from: "me" | "bot"; time: string; children: ReactNode; className?: string }) {
  const me = from === "me";
  return (
    <motion.div
      {...pop}
      className={`max-w-[84%] shrink-0 rounded-[12px] px-[11px] pt-[7px] pb-[5px] text-[15px] leading-snug ${
        me ? "ml-auto rounded-tr-[4px]" : "rounded-tl-[4px]"
      } ${className}`}
      style={{ background: me ? WA.out : WA.in, transformOrigin: me ? "100% 0" : "0 0" }}
    >
      {children}
      <span className="mt-[2px] flex items-center justify-end gap-[3px] text-[11px] text-white/50">
        {time}
        {me && <CheckCheck className="h-[14px] w-[14px]" style={{ color: WA.tick }} aria-hidden />}
      </span>
    </motion.div>
  );
}

function WhatsAppChrome({ children }: { children: ReactNode }) {
  const t = useT();
  return (
    <Screen className="bg-[#0b141a]" time="11:44" height={STRAIGHT_FRAME.screenH}>
      <div className="relative mt-[14px] flex items-center gap-[10px] px-[12px] pb-[12px]" style={{ background: WA.bar }}>
        <ArrowLeft className="h-[22px] w-[22px] text-white/75" aria-hidden />
        <span className="grid h-[38px] w-[38px] place-items-center rounded-full bg-[#0e1a22]">
          <AppMark className="h-[28px] w-[28px]" sizes="56px" />
        </span>
        <span className="flex-1 text-[17px] font-medium">Meeting Guard AI</span>
        <EllipsisVertical className="h-[20px] w-[20px] text-white/70" aria-hidden />
      </div>

      {/* anchored to the input bar: new messages push older ones up, like a real chat */}
      <div className="absolute inset-x-0 top-[106px] bottom-[90px] flex flex-col justify-end gap-[7px] overflow-hidden px-[10px]">
        {children}
      </div>

      <div className="absolute inset-x-[8px] bottom-[34px] flex items-center gap-[8px]">
        <span className="flex h-[46px] flex-1 items-center gap-[10px] rounded-full px-[14px] text-[15px] text-white/40" style={{ background: WA.in }}>
          <Plus className="h-[20px] w-[20px]" aria-hidden />
          {t.whatsapp.chat.message}
        </span>
        <span className="grid h-[46px] w-[46px] place-items-center rounded-full" style={{ background: WA.green }}>
          <Mic className="h-[20px] w-[20px] text-[#0b141a]" aria-hidden />
        </span>
      </div>
    </Screen>
  );
}

function ChatScreen({ step }: { step: number }) {
  const c = useT().whatsapp.chat;
  return (
    <WhatsAppChrome>
      <span className="mx-auto shrink-0 rounded-[8px] px-[10px] py-[3px] text-[12px] text-white/55" style={{ background: WA.in }}>
        {c.today}
      </span>
      <p className="mx-[6px] shrink-0 rounded-[8px] bg-[#182229] px-[10px] py-[6px] text-center text-[12px] leading-snug text-[#e9c46a]/80">
        {c.meta}
      </p>
      {step >= 2 && (
        <Bubble from="me" time="11:41">
          <span className="font-semibold text-[#53bdeb] underline underline-offset-2">{LINK_CODE}</span>
        </Bubble>
      )}
      {step >= 3 && (
        <Bubble from="bot" time="11:42">
          Your WhatsApp is now linked to MeetingGuard. Ask me about your meetings, for example &ldquo;What do I have
          tomorrow?&rdquo;
          <span className="mt-[8px] block text-white/75">
            Tu WhatsApp quedó vinculado a MeetingGuard. Pregúntame por tus reuniones, por ejemplo «¿Qué tengo mañana?»
          </span>
        </Bubble>
      )}
      {step >= 4 && (
        <Bubble from="me" time="11:43">
          {c.request}
        </Bubble>
      )}
      {step >= 5 && (
        <>
          <Bubble from="bot" time="11:43">
            {c.prepared}
          </Bubble>
          <motion.div {...pop} className="w-[86%] shrink-0 overflow-hidden rounded-[12px] rounded-tl-[4px]" style={{ background: WA.in }}>
            <div className="px-[11px] pt-[8px] pb-[5px] text-[15px] leading-snug">
              <p className="flex gap-[6px]">
                <span>•</span>
                <span>{c.proposal}</span>
              </p>
              <p className="mt-[8px]">{c.apply}</p>
              <span className="mt-[2px] block text-right text-[11px] text-white/50">11:43</span>
            </div>
            {/* WhatsApp quick-reply buttons */}
            {[c.confirm, c.cancel].map((b, bi) => (
              <div
                key={bi}
                className="flex items-center justify-center gap-[6px] border-t border-white/[0.08] py-[8px] text-[15px] font-medium"
                style={{ color: step >= 6 && bi === 0 ? "rgba(255,255,255,0.35)" : WA.green }}
              >
                <Reply className="h-[16px] w-[16px]" aria-hidden />
                {b}
              </div>
            ))}
          </motion.div>
        </>
      )}
      {step >= 6 && (
        <Bubble from="me" time="11:43">
          {/* quoted reply */}
          <span className="mb-[6px] block rounded-[8px] border-l-[4px] border-[#a78bfa] bg-black/20 px-[8px] py-[5px] text-[13px] leading-snug">
            <span className="block font-semibold text-[#c4b5fd]">Meeting Guard AI</span>
            <span className="text-white/65">{c.quoted}</span>
          </span>
          {c.confirm}
        </Bubble>
      )}
      {step >= 7 && (
        <Bubble from="bot" time="11:44">
          {c.done}
        </Bubble>
      )}
    </WhatsAppChrome>
  );
}

/* ---------- the row ---------- */

function FlowPhone({
  index,
  canStart,
  onDone,
  children,
}: {
  index: number;
  canStart: boolean;
  onDone: () => void;
  children: (step: number) => ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotionSafe();
  const beats = PHONE_BEATS[index];
  const [played, setPlayed] = useState(0); // beats of this phone already shown

  useEffect(() => {
    if (reduce || !inView || !canStart) return;
    if (played >= beats.length) {
      onDone();
      return;
    }
    const t = setTimeout(() => setPlayed((n) => n + 1), BEAT_MS[beats[played]]);
    return () => clearTimeout(t);
  }, [reduce, inView, canStart, played, beats, onDone]);

  // reduced motion: show the finished flow straight away
  const step = reduce ? LAST : played ? beats[played - 1] : beats[0] - 1;
  return (
    <div ref={ref} className="relative">
      {children(step)}
    </div>
  );
}

export function WhatsAppFlow() {
  const t = useT();
  const [done, setDone] = useState(0); // phones that have finished playing
  const screens = [
    (step: number) => <AppLinkScreen step={step} />,
    (step: number) => <ChatScreen step={step} />,
  ];

  return (
    <ol className="mx-auto grid max-w-[880px] gap-14 md:grid-cols-2 md:gap-8">
      {t.whatsapp.phones.map((p, i) => (
        <li key={i} className="flex flex-col items-center text-center">
          <p className="flex items-center gap-2 font-mono text-[0.72rem] tracking-[0.06em] uppercase">
            <span className="text-[#25D366]">0{i + 1}</span>
            <span className="text-white/55">{p.where}</span>
          </p>
          <h3 className="mt-2 text-[1.1rem] font-semibold">{p.title}</h3>
          <p className="mt-1.5 max-w-[320px] text-[0.86rem] leading-relaxed text-white/60">{p.body}</p>
          {/* mt-auto: phones line up even when the captions wrap to different heights */}
          <div className="relative mt-auto mb-24 pt-8">
            <div
              aria-hidden
              className="absolute top-1/2 left-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
              style={{
                background: `radial-gradient(closest-side, ${i === 0 ? "rgba(140,150,255,0.12)" : "rgba(37,211,102,0.11)"}, transparent)`,
              }}
            />
            <FlowPhone index={i} canStart={done >= i} onDone={() => setDone((d) => Math.max(d, i + 1))}>
              {(step) => (
                <FramedPhone frame={STRAIGHT_FRAME} bodyHeight={520} mirror>
                  {screens[i](step)}
                </FramedPhone>
              )}
            </FlowPhone>
          </div>
        </li>
      ))}
    </ol>
  );
}
