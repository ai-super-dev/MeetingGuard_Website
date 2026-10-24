import type { ReactNode } from "react";
import Image from "next/image";
import { images } from "@/lib/assets";
import { SCREEN_W } from "./geometry";

/**
 * Screen opening inside phone_frame_str.png (1024×1536), measured from its
 * alpha channel. The PNG also carries a soft glow, so the phone body only
 * spans the middle ~66% of the image width.
 */
const FRAME = { w: 1024, h: 1536 };
const OPENING = { x: 216, y: 111, w: 592, h: 1286 };

/** Screen height (CSS px at SCREEN_W wide) that matches the opening's aspect. */
export const STRAIGHT_SCREEN_H = Math.round((SCREEN_W * OPENING.h) / OPENING.w);

/** Front-facing phone (phone_frame_str.png) with a live screen; `width` is the image width in px. */
export function StraightPhone({ width, children }: { width: number; children: ReactNode }) {
  const scale = (width * (OPENING.w / FRAME.w)) / SCREEN_W;
  return (
    <div className="relative" style={{ width, height: (width * FRAME.h) / FRAME.w }}>
      <div
        className="absolute overflow-hidden rounded-[13%/6%]"
        style={{
          left: `${(OPENING.x / FRAME.w) * 100}%`,
          top: `${(OPENING.y / FRAME.h) * 100}%`,
          width: `${(OPENING.w / FRAME.w) * 100}%`,
          height: `${(OPENING.h / FRAME.h) * 100}%`,
        }}
      >
        <div className="origin-top-left" style={{ transform: `scale(${scale})` }}>
          {children}
        </div>
      </div>
      <Image
        src={images.phoneFrameStraight}
        alt=""
        fill
        sizes={`${width}px`}
        className="pointer-events-none object-contain"
      />
    </div>
  );
}
