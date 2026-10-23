"use client";

import { useEffect, useRef, type ReactNode } from "react";
import {
  MotionConfig,
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type HTMLMotionProps,
} from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  from?: "up" | "left" | "right" | "scale";
  distance?: number;
};

/** Fades + slides its children in the first time they scroll into view. */
export function Reveal({ delay = 0, from = "up", distance = 36, children, ...rest }: RevealProps) {
  const offset =
    from === "left"
      ? { x: -distance }
      : from === "right"
        ? { x: distance }
        : from === "scale"
          ? { scale: 0.92 }
          : { y: distance };

  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.8, delay, ease }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

type TiltPhoneProps = {
  children: ReactNode;
  className?: string;
  /** Resting pose of the device, in degrees. */
  rotate?: number;
  rotateY?: number;
  rotateX?: number;
  /** How strongly the phone follows the pointer. */
  intensity?: number;
  float?: number;
  delay?: number;
  /** Set false above the fold, where a CSS entrance keeps it visible pre-hydration. */
  entrance?: boolean;
};

/**
 * Wraps a phone so it enters with a 3D swing, floats idly, and leans toward
 * the pointer while the cursor is over it — the "interactive phone movement".
 */
export function TiltPhone({
  children,
  className,
  rotate = 0,
  rotateY = 0,
  rotateX = 0,
  intensity = 14,
  float = 12,
  delay = 0,
  entrance = true,
}: TiltPhoneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 120, damping: 14, mass: 0.6 };
  const ry = useSpring(useTransform(px, (v) => rotateY + v * intensity), spring);
  const rx = useSpring(useTransform(py, (v) => rotateX - v * intensity), spring);

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }

  function onLeave() {
    px.set(0);
    py.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ perspective: 1200, ...(entrance ? null : { rotateZ: rotate }) }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      {...(entrance && {
        initial: { opacity: 0, y: 70, rotateZ: rotate - 8 },
        whileInView: { opacity: 1, y: 0, rotateZ: rotate },
        viewport: { once: true, margin: "0px 0px -60px 0px" },
        transition: { duration: 1.1, delay, ease },
      })}
    >
      <motion.div
        animate={reduce ? undefined : { y: [0, -float, 0] }}
        transition={{ duration: 6.5, delay: delay + 1.1, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}>{children}</motion.div>
      </motion.div>
    </motion.div>
  );
}

/** Counts a number up when it first appears; keeps prefix/suffix formatting. */
export function CountUp({ value, decimals = 0, suffix = "" }: { value: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" });
  const format = (n: number) =>
    n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;

  useEffect(() => {
    if (!inView || !ref.current) return;
    const node = ref.current;
    const controls = animate(0, value, {
      duration: 1.8,
      ease: "easeOut",
      onUpdate: (n) => {
        node.textContent = format(n);
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, value]);

  return <span ref={ref}>{format(value)}</span>;
}

/** Pulsing ring used behind alert bells and check marks. */
export function PulseRing({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.span
      aria-hidden
      className={className}
      initial={{ scale: 0.8, opacity: 0.7 }}
      animate={{ scale: 1.6, opacity: 0 }}
      transition={{ duration: 2.2, delay, repeat: Infinity, ease: "easeOut" }}
    />
  );
}
