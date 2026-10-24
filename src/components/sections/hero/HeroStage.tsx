"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

/**
 * Interactive frame for the hero.
 *
 * - `background` fills the whole section edge to edge (no side gaps at any width).
 * - `scene` (phone, rings, icons) and `children` (copy) live in a centred
 *   frame with the 1672×941 proportions of the design.
 * - The pointer position is exposed as --px/--py (-0.5…0.5, spring-smoothed)
 *   so server-rendered layers can parallax at their own depth in pure CSS.
 * - On scroll the background and scene sink while the copy lifts away.
 */
export function HeroStage({
  background,
  scene,
  children,
}: {
  background: ReactNode;
  scene: ReactNode;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const sceneY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 55, damping: 16, mass: 0.8 };
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);
  useMotionValueEvent(sx, "change", (v) => ref.current?.style.setProperty("--px", v.toFixed(4)));
  useMotionValueEvent(sy, "change", (v) => ref.current?.style.setProperty("--py", v.toFixed(4)));
  const copyX = useTransform(sx, (v) => v * -8);

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
      className="relative"
    >
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        {background}
      </motion.div>

      <div className="relative mx-auto flex max-w-[1777px] flex-col lg:block lg:h-[calc(var(--u)*56.28)]">
        <motion.div style={{ y: copyY, opacity: copyOpacity, x: copyX }} className="relative z-10 lg:absolute lg:inset-0">
          {children}
        </motion.div>

        {/*
         * Below lg the scene is cropped to a window centred on the phone
         * (phone centre sits at 70% of the scene width).
         */}
        <motion.div
          style={{ y: sceneY, scale: sceneScale }}
          className="relative aspect-[1/1.02] w-full overflow-hidden sm:aspect-[4/3] lg:absolute lg:inset-0 lg:aspect-auto lg:overflow-visible"
        >
          <div className="absolute inset-y-0 right-[-2.5%] aspect-[1672/941] h-full sm:right-[10%] lg:inset-0 lg:h-auto">
            {scene}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
