"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";

export type Step = {
  day: string;
  time: string;
  title: string;
  body: string;
  points: string[];
};

/** Seconds the timeline takes to flow from one step to the next. */
const DWELL = 4;
const ease = [0.22, 1, 0.36, 1] as const;
/** Seconds for one phone to fade out as the next fades in. */
const FADE = 1.4;
/** Slow in, slow out — for the glow and text crossfades between steps. */
const SOFT = [0.45, 0, 0.25, 1] as const;

function TrackNode({
  step,
  index,
  progress,
  onSelect,
}: {
  step: Step;
  index: number;
  progress: MotionValue<number>;
  onSelect: () => void;
}) {
  const lit = useTransform(progress, [index - 0.04, index], [0, 1]);
  const label = useTransform(lit, [0, 1], [0.45, 1]);
  return (
    <button
      type="button"
      onClick={onSelect}
      className="group flex flex-col items-center focus-visible:outline-none"
      aria-label={`Show step ${index + 1}: ${step.title}`}
    >
      <span className="relative grid h-4 w-4 place-items-center">
        <span className="absolute inset-0 rounded-full border border-white/15 bg-ink-950 group-focus-visible:ring-2 group-focus-visible:ring-accent" />
        <motion.span
          className="absolute inset-0 rounded-full bg-accent shadow-[0_0_0_4px_rgba(255,77,94,0.18),0_0_18px_rgba(255,77,94,0.8)]"
          style={{ opacity: lit, scale: lit }}
        />
      </span>
      <motion.span
        style={{ opacity: label }}
        className="mt-3 flex items-baseline gap-1.5 font-mono text-[0.66rem] tracking-[0.06em] whitespace-nowrap group-hover:!opacity-100 sm:gap-2 sm:text-[0.72rem]"
      >
        <span className="text-white/45 uppercase">{step.day}</span>
        <span className="text-[0.85rem] text-white tabular-nums sm:text-[0.95rem]">{step.time}</span>
      </motion.span>
    </button>
  );
}

/**
 * Plan → Alert → Join as one interactive story: the phone on the left and the
 * explanation on the right change together. It advances on its own while in
 * view: the timeline line flows from one time to the next and the step changes
 * when it arrives. Pausing (hover, off-screen) freezes the line mid-flow;
 * clicking a time glides the line there.
 */
export function StepShowcase({
  steps,
  screens,
  glows,
}: {
  steps: Step[];
  screens: ReactNode[];
  /** Glow colour behind the phone for each step. */
  glows: string[];
}) {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();
  const playing = inView && !hovered && !reduce;
  const last = steps.length - 1;
  const step = steps[active];

  /** Position on the timeline in step units: 0 = first step, `last` = final step. */
  const progress = useMotionValue(0);
  const fill = useTransform(progress, (v) => (last ? v / last : 0));
  const head = useTransform(fill, (v) => `${v * 100}%`);
  const snap = useRef(false);


  const select = (i: number) => {
    snap.current = true;
    setActive(i);
  };

  useEffect(() => {
    let cancelled = false;
    let controls: ReturnType<typeof animate> | undefined;
    const run = async () => {
      // after a click (or the loop restarting) glide the line to the chosen step
      if (snap.current) {
        snap.current = false;
        controls = animate(progress, active, { duration: 0.8, ease });
        await controls;
      }
      if (cancelled || !playing) return;
      if (active < last) {
        // time flows toward the next step, continuing from wherever it paused
        const target = active + 1;
        controls = animate(progress, target, { duration: (target - progress.get()) * DWELL, ease: "linear" });
        await controls;
        if (!cancelled) setActive(target);
      } else {
        await new Promise((r) => setTimeout(r, DWELL * 1000));
        if (!cancelled) select(0);
      }
    };
    run();
    return () => {
      cancelled = true;
      controls?.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, playing]);

  return (
    <div ref={ref}>
      {/* timeline: the line itself is the timer, flowing from one time to the next */}
      <div className="relative mx-auto max-w-[760px]" role="group" aria-label="How it works steps">
        <div className="absolute top-[7px] right-[16.66%] left-[16.66%]">
          <span aria-hidden className="absolute inset-x-0 h-px bg-white/10" />
          <motion.span
            aria-hidden
            className="absolute inset-x-0 -top-px h-[2px] origin-left bg-[linear-gradient(90deg,#ff4d5e,#ff8a95)] shadow-[0_0_12px_rgba(255,77,94,0.7)]"
            style={{ scaleX: fill }}
          />
          {/* glowing "now" head riding the end of the line */}
          <motion.span
            aria-hidden
            className="absolute top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_10px_3px_rgba(255,120,135,0.9)]"
            style={{ left: head }}
          />
        </div>
        <div className="grid grid-cols-3">
          {steps.map((s, i) => (
            <TrackNode key={s.title} step={s} index={i} progress={progress} onSelect={() => select(i)} />
          ))}
        </div>
      </div>

      <div
        className="mt-10 grid items-center gap-10 md:mt-14 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-16"
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        {/* phone */}
        <div className="flex flex-col items-center">
          <div className="relative">
            {glows.map((g, i) => (
              <motion.div
                key={g}
                aria-hidden
                className="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
                style={{ background: `radial-gradient(closest-side, ${g}, transparent)` }}
                initial={false}
                animate={{ opacity: i === active ? 1 : 0 }}
                transition={{ duration: FADE, ease: SOFT }}
              />
            ))}
            {/* all three phones stay mounted; the active one fades in as the last fades out */}
            <div className="relative -my-8 grid scale-[0.86] place-items-center sm:my-0 sm:scale-100">
              {screens.map((screen, i) => (
                <motion.div
                  key={i}
                  className="col-start-1 row-start-1"
                  initial={false}
                  animate={i === active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }}
                  transition={{ duration: FADE, ease: SOFT }}
                  style={{ filter: "none", pointerEvents: i === active ? "auto" : "none" }}
                  aria-hidden={i !== active}
                >
                  {screen}
                </motion.div>
              ))}
            </div>
          </div>

        </div>

        {/* explanation */}
        <div className="relative min-h-[300px] text-center md:text-left" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: SOFT } }}
              exit={{ opacity: 0, y: -6, filter: "blur(4px)", transition: { duration: 0.55, ease: SOFT } }}
            >
              <p className="flex items-baseline justify-center gap-3 font-mono text-[0.75rem] tracking-[0.06em] md:justify-start">
                <span className="text-[#ff8a95]">0{active + 1}</span>
                <span className="text-white/40 uppercase">
                  {step.day} · {step.time}
                </span>
              </p>
              <h3 className="text-shine mt-3 text-[2.4rem] leading-none font-semibold tracking-[-0.03em] sm:text-[3rem]">
                {step.title}
              </h3>
              <p className="mx-auto mt-5 max-w-md text-[1.02rem] leading-relaxed text-white/55 md:mx-0">{step.body}</p>
              <ul className="mt-7 space-y-3 text-left">
                {step.points.map((p, i) => (
                  <motion.li
                    key={p}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.25 + i * 0.12, ease: SOFT }}
                    className="mx-auto flex max-w-md items-start gap-3 text-[0.95rem] text-white/80 md:mx-0"
                  >
                    <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent shadow-[0_0_8px_rgba(255,77,94,0.8)]" />
                    {p}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
