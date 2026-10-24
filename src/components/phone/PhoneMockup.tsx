"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import { SILVER_FRAME, type FrameSpec } from "./geometry";

/**
 * A phone frame PNG with a live HTML screen projected into its opening.
 *
 * The screen is positioned in the frame's own pixel space (where the
 * matrix3d was measured) and that space is scaled to the rendered width, so
 * the UI stays locked to the bezel at every breakpoint. The frame image is a
 * normal responsive <Image>, so it paints even before this measures itself.
 */
export function PhoneMockup({
  children,
  className = "",
  frame = SILVER_FRAME,
  sizes = "(min-width: 1024px) 420px, 70vw",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  frame?: FrameSpec;
  sizes?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / frame.w));
    ro.observe(el);
    return () => ro.disconnect();
  }, [frame.w]);

  return (
    <div ref={ref} className={`relative ${className}`} style={{ aspectRatio: `${frame.w} / ${frame.h}`, ...style }}>
      <div
        className="absolute top-0 left-0 origin-top-left transition-opacity duration-500"
        style={{ width: frame.w, height: frame.h, transform: `scale(${scale})`, opacity: scale ? 1 : 0 }}
      >
        <div className="absolute top-0 left-0 origin-top-left" style={{ transform: frame.matrix }}>
          {children}
        </div>
      </div>
      <Image src={frame.src} alt="" fill preload sizes={sizes} className="pointer-events-none object-contain" />
    </div>
  );
}
