"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform, useMotionValue } from "motion/react";

/**
 * Interactive frame for the hero: the artwork leans and drifts with the
 * pointer (3D parallax), and on scroll the art sinks/zooms while the copy
 * lifts away. Both layers are server-rendered and passed in as props.
 */
export function HeroStage({ art, children }: { art: ReactNode; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const artY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const artScale = useTransform(scrollYProgress, [0, 1], [1, 1.07]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 60, damping: 18, mass: 0.8 };
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);
  const artX = useTransform(sx, (v) => v * -18);
  const artShiftY = useTransform(sy, (v) => v * -12);
  const artRotY = useTransform(sx, (v) => v * 4);
  const artRotX = useTransform(sy, (v) => v * -3);
  const copyX = useTransform(sx, (v) => v * 6);

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
      className="relative mx-auto flex max-w-[1777px] flex-col lg:block lg:h-[calc(var(--u)*56.28)]"
    >
      <motion.div style={{ y: copyY, opacity: copyOpacity, x: copyX }} className="relative z-10 lg:absolute lg:inset-0">
        {children}
      </motion.div>
      <motion.div
        style={{ y: artY, scale: artScale }}
        className="relative order-last aspect-square overflow-hidden sm:aspect-[16/11] lg:absolute lg:inset-0 lg:order-none lg:aspect-auto lg:overflow-visible"
      >
        <motion.div
          style={{ x: artX, y: artShiftY, rotateY: artRotY, rotateX: artRotX, transformPerspective: 1600 }}
          className="absolute inset-y-0 right-[-5%] aspect-[1672/941] h-full lg:inset-0 lg:right-0 lg:h-auto"
        >
          {art}
        </motion.div>
      </motion.div>
    </div>
  );
}
