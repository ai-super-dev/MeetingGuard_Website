"use client";

import { useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";

export type Step = {
  day: string;
  time: string;
  title: string;
  body: string;
  points: string[];
};

/** How long each step stays on screen before advancing (s). */
const DWELL = 6;
const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Plan → Alert → Join as one interactive story: the phone on the left and the
 * explanation on the right change together. It advances on its own while in
 * view; the dots under the phone and the timeline above jump to any step.
 */
export function StepShowcase({ steps, screens }: { steps: Step[]; screens: ReactNode[] }) {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();
  const playing = inView && !hovered && !reduce;
  const last = steps.length - 1;
  const next = () => setActive((a) => (a + 1) % steps.length);
  const step = steps[active];

  return (
    <div ref={ref}>
      {/* timeline: fills up to the active step */}
      <div className="relative mx-auto hidden max-w-[760px] md:block">
        <span aria-hidden className="absolute top-[7px] right-[16.66%] left-[16.66%] h-px bg-white/10" />
        <motion.span
          aria-hidden
          className="absolute top-[6.5px] right-[16.66%] left-[16.66%] h-[2px] origin-left bg-[linear-gradient(90deg,#ff4d5e,#ff8a95)] shadow-[0_0_12px_rgba(255,77,94,0.7)]"
          animate={{ scaleX: last ? active / last : 0 }}
          transition={{ duration: 0.8, ease }}
        />
        <div className="grid grid-cols-3">
          {steps.map((s, i) => {
            const lit = i <= active;
            return (
              <button
                key={s.title}
                type="button"
                onClick={() => setActive(i)}
                className="group flex flex-col items-center focus-visible:outline-none"
                aria-label={`Show step ${i + 1}: ${s.title}`}
              >
                <span className="relative grid h-4 w-4 place-items-center">
                  <span className="absolute inset-0 rounded-full border border-white/15 bg-ink-950 group-focus-visible:ring-2 group-focus-visible:ring-accent" />
                  <motion.span
                    className="absolute inset-0 rounded-full bg-accent shadow-[0_0_0_4px_rgba(255,77,94,0.18),0_0_18px_rgba(255,77,94,0.8)]"
                    animate={{ opacity: lit ? 1 : 0, scale: lit ? 1 : 0.3 }}
                    transition={{ duration: 0.4, delay: lit ? 0.35 : 0 }}
                  />
                </span>
                <span
                  className={`mt-3 flex items-baseline gap-2 font-mono text-[0.72rem] tracking-[0.06em] whitespace-nowrap transition-opacity duration-500 ${
                    lit ? "opacity-100" : "opacity-45 group-hover:opacity-75"
                  }`}
                >
                  <span className="text-white/45 uppercase">{s.day}</span>
                  <span className="text-[0.95rem] text-white tabular-nums">{s.time}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        className="mt-10 grid items-center gap-10 md:mt-14 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-16"
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        {/* phone + step dots */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <motion.div
              aria-hidden
              className="absolute top-1/2 left-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(200,20,40,0.35),transparent)] blur-2xl"
              animate={{ opacity: active === 1 ? 1 : 0.45 }}
              transition={{ duration: 0.8 }}
            />
            {/* all three screens stay mounted; only the active one is shown */}
            <div className="relative grid">
              {screens.map((screen, i) => (
                <motion.div
                  key={i}
                  className="col-start-1 row-start-1"
                  initial={false}
                  animate={
                    i === active
                      ? { opacity: 1, scale: 1, x: 0, filter: "blur(0px)" }
                      : { opacity: 0, scale: 0.96, x: i < active ? -24 : 24, filter: "blur(6px)" }
                  }
                  transition={{ duration: 0.7, ease }}
                  style={{ pointerEvents: i === active ? "auto" : "none" }}
                  aria-hidden={i !== active}
                >
                  {screen}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-2 flex items-center gap-2" role="tablist" aria-label="How it works steps">
            {steps.map((s, i) => (
              <button
                key={s.title}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`Step ${i + 1}: ${s.title}`}
                onClick={() => setActive(i)}
                className="group grid h-6 place-items-center px-0.5 focus-visible:outline-none"
              >
                <span
                  className={`relative block h-[6px] overflow-hidden rounded-full transition-all duration-500 group-focus-visible:ring-2 group-focus-visible:ring-accent ${
                    i === active ? "w-9 bg-white/15" : "w-[6px] bg-white/25 group-hover:bg-white/50"
                  }`}
                >
                  {i === active &&
                    (playing ? (
                      <motion.span
                        key={`${active}-play`}
                        className="absolute inset-0 origin-left rounded-full bg-accent"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: DWELL, ease: "linear" }}
                        onAnimationComplete={next}
                      />
                    ) : (
                      <span className="absolute inset-0 rounded-full bg-accent" />
                    ))}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* explanation */}
        <div className="relative min-h-[300px] text-center md:text-left" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
              transition={{ duration: 0.45, ease }}
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
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
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
