"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

export type TrackStep = { time: string; day: string };

function Node({ progress, at, step }: { progress: MotionValue<number>; at: number; step: TrackStep }) {
  const lit = useTransform(progress, [Math.max(0, at - 0.06), at], [0, 1]);
  const labelOpacity = useTransform(lit, [0, 1], [0.45, 1]);
  return (
    <div className="flex flex-col items-center">
      <span className="relative grid h-4 w-4 place-items-center">
        <span className="absolute inset-0 rounded-full border border-white/15 bg-ink-950" />
        <motion.span
          style={{ opacity: lit, scale: lit }}
          className="absolute inset-0 rounded-full bg-accent shadow-[0_0_0_4px_rgba(255,77,94,0.18),0_0_18px_rgba(255,77,94,0.8)]"
        />
      </span>
      <motion.span
        style={{ opacity: labelOpacity }}
        className="mt-3 flex items-baseline gap-2 font-mono text-[0.72rem] tracking-[0.06em] whitespace-nowrap"
      >
        <span className="text-white/45 uppercase">{step.day}</span>
        <span className="text-[0.95rem] text-white tabular-nums">{step.time}</span>
      </motion.span>
    </div>
  );
}

/**
 * Horizontal timeline above the steps (desktop). The crimson line fills
 * from the first step to the last as the section scrolls through view,
 * and each dot lights up when the line reaches it.
 */
export function StepTrack({ steps, children }: { steps: TrackStep[]; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "start 30%"] });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const last = steps.length - 1;
  const inset = `${50 / steps.length}%`;

  return (
    <div ref={ref}>
      <div className="relative hidden md:block">
        <span aria-hidden className="absolute top-[7px] h-px bg-white/10" style={{ left: inset, right: inset }} />
        <motion.span
          aria-hidden
          className="absolute top-[6.5px] h-[2px] origin-left bg-[linear-gradient(90deg,#ff4d5e,#ff8a95)] shadow-[0_0_12px_rgba(255,77,94,0.7)]"
          style={{ left: inset, right: inset, scaleX: fill }}
        />
        <div className="grid" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
          {steps.map((s, i) => (
            <Node key={s.time} progress={fill} at={last ? i / last : 0} step={s} />
          ))}
        </div>
      </div>
      {children}
    </div>
  );
}
