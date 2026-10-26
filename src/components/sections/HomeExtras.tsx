"use client";

/*
 * Home sections added by the website brief: the daily briefing block, the
 * pricing teaser, the assistant teaser with the waitlist and the FAQ (5).
 */

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { CalendarCheck2, Check, Gift, Mail, Sparkles, Timer, Volume2 } from "lucide-react";
import { WaitlistForm } from "@/components/forms/Forms";
import { Reveal } from "@/components/motion";
import { ArrowLink, ButtonLink, CheckList, Headline, Tag } from "@/components/page/blocks";
import { FaqAccordion, type FaqItem } from "@/components/page/FaqAccordion";
import { SummaryScreen } from "@/components/phone/flows";
import { PhoneShot } from "@/components/phone/PhoneShot";
import { useHref, useT } from "@/lib/language";

/* ---------- daily briefing ---------- */

export function Briefing() {
  const t = useT();
  const href = useHref();
  const b = t.briefing;
  return (
    <section id="briefing" aria-labelledby="briefing-title" className="relative overflow-x-clip py-14 sm:py-[4.5rem]">
      <div className="container-page">
        <div className="mx-auto grid max-w-[1000px] items-center gap-14 md:grid-cols-2 md:gap-16">
          <Reveal className="order-2 text-center md:order-1 md:text-left">
            <p className="eyebrow flex items-center justify-center gap-2 md:justify-start">
              <Volume2 className="h-4 w-4 text-[#2dd4bf]" aria-hidden />
              {b.eyebrow}
            </p>
            <Headline id="briefing-title" line1={b.line1} line2={b.line2} className="mt-3" />
            <p className="mx-auto mt-4 max-w-md text-[0.98rem] leading-relaxed text-white/60 md:mx-0">{b.body}</p>
            <CheckList items={b.points} className="mx-auto mt-6 w-fit text-left md:mx-0" />
            <div className="mt-7 flex flex-wrap items-center justify-center gap-4 md:justify-start">
              <ArrowLink href={href("/features/agenda")}>{t.learnMore}</ArrowLink>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="relative order-1 flex flex-col items-center md:order-2">
            <div
              aria-hidden
              className="absolute top-1/2 left-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(45,212,191,0.16),transparent)] blur-2xl"
            />
            <div className="relative">
              <PhoneShot kind="android" bodyHeight={470}>
                <SummaryScreen />
              </PhoneShot>
            </div>
            <div className="relative mt-5">
              <Tag>{b.androidOnly}</Tag>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- pricing teaser ---------- */

export function PricingTeaser() {
  const t = useT();
  const href = useHref();
  const p = t.pricingTeaser;
  const icons = [Gift, Timer, Sparkles];
  return (
    <section id="pricing" aria-labelledby="pricing-title" className="relative overflow-x-clip py-14 sm:py-[4.5rem]">
      <div className="container-page">
        <Reveal className="surface relative mx-auto max-w-[1000px] overflow-hidden rounded-3xl px-6 py-12 text-center sm:px-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,77,94,0.16),transparent)]"
          />
          <p className="eyebrow relative">{p.eyebrow}</p>
          <Headline id="pricing-title" line1={p.line1} line2={p.line2} className="relative mt-3" />
          <ul className="relative mx-auto mt-9 grid max-w-3xl gap-3 sm:grid-cols-3">
            {p.points.map((point, i) => {
              const Icon = icons[i];
              return (
                <li key={point} className="flex flex-col items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-4 py-5">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent/12 text-[#ff8a95]">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="text-[0.92rem] font-medium text-white/85">{point}</span>
                </li>
              );
            })}
          </ul>
          <div className="relative mt-9 flex justify-center">
            <ButtonLink href={href("/pricing")} primary>
              {p.cta}
            </ButtonLink>
          </div>
          <p className="relative mt-5 text-[0.8rem] text-white/45">{p.note}</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- assistant teaser ---------- */

/** The assistant at work: the request, the email (you in copy) and each step until it is booked. */
export function AssistantVisual() {
  const t = useT();
  const v = t.assistantTeaser.visual;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!inView || reduce) return;
    const timer = setInterval(() => setStep((s) => (s + 1) % (v.steps.length + 1)), 1500);
    return () => clearInterval(timer);
  }, [inView, reduce, v.steps.length]);
  const shown = reduce ? v.steps.length : step;

  return (
    <div ref={ref} className="w-full max-w-[360px] space-y-3">
      <p className="ml-auto w-fit max-w-[90%] rounded-2xl rounded-tr-md bg-white/[0.08] px-4 py-2.5 text-[0.85rem] text-white/90">&quot;{v.ask}&quot;</p>
      <div className="rounded-2xl border border-white/[0.08] bg-[#131316] p-4">
        <div className="flex items-center gap-2 text-[0.75rem] text-white/50">
          <Mail className="h-3.5 w-3.5" aria-hidden />
          <span>{v.to}</span>
          <span className="ml-auto rounded-full bg-accent/12 px-2 py-0.5 text-[#ff8a95]">{v.cc}</span>
        </div>
        <p className="mt-2 text-[0.92rem] font-medium text-white">{v.subject}</p>
        <ol className="mt-4 space-y-2">
          {v.steps.map((s, i) => (
            <li key={s} className="flex items-center gap-2.5 text-[0.8rem]">
              <span
                className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border transition-colors duration-500 ${
                  i < shown ? (i === v.steps.length - 1 ? "border-emerald-400 bg-emerald-400" : "border-white/60 bg-white/60") : "border-white/20"
                }`}
              >
                {i < shown && <Check className="h-2.5 w-2.5 text-[#0b0b0e]" strokeWidth={4} aria-hidden />}
              </span>
              <span className={`transition-colors duration-500 ${i < shown ? "text-white/85" : "text-white/35"}`}>{s}</span>
            </li>
          ))}
        </ol>
        <AnimatePresence>
          {shown === v.steps.length && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-400/10 px-3 py-2 text-[0.78rem] text-emerald-300"
            >
              <CalendarCheck2 className="h-4 w-4" aria-hidden />
              {v.booked}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function AssistantTeaser() {
  const t = useT();
  const href = useHref();
  const a = t.assistantTeaser;
  return (
    <section id="assistant" aria-labelledby="assistant-title" className="relative overflow-x-clip py-14 sm:py-[4.5rem]">
      <div className="container-page">
        <div className="mx-auto grid max-w-[1000px] items-center gap-14 md:grid-cols-2 md:gap-16">
          <Reveal className="text-center md:text-left">
            <p className="eyebrow flex items-center justify-center gap-2 md:justify-start">
              <Sparkles className="h-4 w-4 text-[#ffd9a0]" aria-hidden />
              {a.eyebrow}
            </p>
            <Headline id="assistant-title" line1={a.line1} line2={a.line2} className="mt-3" />
            <p className="mx-auto mt-4 max-w-md text-[0.98rem] leading-relaxed text-white/60 md:mx-0">{a.body}</p>
            <WaitlistForm id="home-waitlist" className="mx-auto mt-7 max-w-md text-left md:mx-0" />
            <div className="mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 md:justify-start">
              <span className="text-[0.8rem] text-white/45">{a.addon}</span>
              <ArrowLink href={href("/assistant")}>{a.more}</ArrowLink>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="flex justify-center">
            <AssistantVisual />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ (5) ---------- */

export function FaqHome({ items }: { items: readonly FaqItem[] }) {
  const t = useT();
  const href = useHref();
  return (
    <section id="faq" aria-labelledby="faq-title" className="relative overflow-x-clip py-14 sm:py-[4.5rem]">
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{t.faqHome.eyebrow}</p>
          <Headline id="faq-title" line1={t.faqHome.title} className="mt-3" />
        </Reveal>
        <Reveal delay={0.1} className="mx-auto mt-10 max-w-3xl">
          <FaqAccordion items={items} defaultOpen={0} />
        </Reveal>
        <div className="mt-6 text-center">
          <ArrowLink href={href("/faq")}>{t.faqHome.all}</ArrowLink>
        </div>
      </div>
    </section>
  );
}
