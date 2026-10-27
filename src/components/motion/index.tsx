"use client";

import { useRef, useSyncExternalStore, type ReactNode } from "react";
import {
  MotionConfig,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type HTMLMotionProps,
} from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

const REDUCE_QUERY = "(prefers-reduced-motion: reduce)";
const subscribeReduce = (onChange: () => void) => {
  const query = window.matchMedia(REDUCE_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

/**
 * The visitor's reduced-motion setting, for components that render
 * differently with it. Unlike motion's useReducedMotion it is false while the
 * page hydrates (the prerendered HTML can't know the setting) and switches
 * right after, so the first render matches the HTML. A mismatch makes React
 * rebuild the whole page.
 */
export function useReducedMotionSafe() {
  return useSyncExternalStore(subscribeReduce, () => window.matchMedia(REDUCE_QUERY).matches, () => false);
}

export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  from?: "up" | "left" | "right" | "scale";
  distance?: number;
};

/** Fades + slides its children in the first time they scroll into view. */
export function Reveal({ delay = 0, from = "up", distance = 28, children, ...rest }: RevealProps) {
  const offset =
    from === "left"
      ? { x: -distance }
      : from === "right"
        ? { x: distance }
        : from === "scale"
          ? { scale: 0.94 }
          : { y: distance };

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(6px)", ...offset }}
      whileInView={{ opacity: 1, filter: "blur(0px)", x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.9, delay, ease }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Leans its children toward the pointer (3D) while the cursor is over them. */
export function TiltPhone({
  children,
  className,
  intensity = 12,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 110, damping: 16, mass: 0.6 };
  const ry = useSpring(useTransform(px, (v) => v * intensity), spring);
  const rx = useSpring(useTransform(py, (v) => -v * intensity), spring);

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ perspective: 1400 }}
      onPointerMove={onMove}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
    >
      <motion.div style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}>{children}</motion.div>
    </motion.div>
  );
}

/**
 * Scroll-linked drift: while the element passes through the viewport it moves
 * by `y` px and scales from 1 to `scale` (used for the hero phone).
 */
export function ScrollDrift({
  children,
  className,
  y = -80,
  scale = 1,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  scale?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const ty = useTransform(scrollYProgress, [0, 1], [0, y]);
  const s = useTransform(scrollYProgress, [0, 1], [1, scale]);
  return (
    <motion.div ref={ref} className={className} style={{ y: ty, scale: s }}>
      {children}
    </motion.div>
  );
}
