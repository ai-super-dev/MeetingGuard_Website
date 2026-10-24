"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { images } from "@/lib/assets";
import { FRAME_H, FRAME_W, SCREEN_MATRIX } from "./geometry";

/**
 * phone_frame.png with a live HTML screen projected into its opening.
 *
 * The screen is positioned in the frame's own 1024×1536 px space (where the
 * matrix3d was measured) and that space is scaled to the rendered width, so
 * the UI stays locked to the bezel at every breakpoint. The frame image is a
 * normal responsive <Image>, so it paints even before this measures itself.
 */
export function PhoneMockup({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / FRAME_W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} className={`relative aspect-[1024/1536] ${className}`}>
      <div
        className="absolute top-0 left-0 origin-top-left transition-opacity duration-500"
        style={{ width: FRAME_W, height: FRAME_H, transform: `scale(${scale})`, opacity: scale ? 1 : 0 }}
      >
        <div className="absolute top-0 left-0 origin-top-left" style={{ transform: SCREEN_MATRIX }}>
          {children}
        </div>
      </div>
      <Image
        src={images.phoneFrame}
        alt=""
        fill
        preload
        sizes="(min-width: 1024px) 420px, 70vw"
        className="pointer-events-none object-contain"
      />
    </div>
  );
}
