"use client";

import type { ReactNode } from "react";
import Image, { type StaticImageData } from "next/image";
import { FramedPhone } from "./FramedPhone";
import { SCREEN_W, STRAIGHT_FRAME } from "./geometry";

/** Screen height (CSS px) used by every PhoneShot, so iPhone and Android shots line up. */
export const SHOT_H = STRAIGHT_FRAME.screenH;

/**
 * Android phone drawn in CSS: thin even bezel, punch-hole camera and side keys.
 * The SCREEN_W-wide screen is scaled to fit `bodyHeight`.
 */
function AndroidPhone({ bodyHeight, children }: { bodyHeight: number; children: ReactNode }) {
  const bezel = Math.round(bodyHeight * 0.022);
  const screenH = bodyHeight - bezel * 2;
  const scale = screenH / SHOT_H;
  const width = SCREEN_W * scale + bezel * 2;
  return (
    <div
      className="relative rounded-[36px] bg-[linear-gradient(160deg,#2a2b31,#121317_45%,#24252b)] shadow-[0_40px_100px_rgba(0,0,0,0.7),inset_0_0_0_1px_rgba(255,255,255,0.08)]"
      style={{ width, height: bodyHeight, padding: bezel }}
    >
      {/* side keys */}
      <span aria-hidden className="absolute top-[22%] -right-[3px] h-[9%] w-[3px] rounded-r bg-[#2e2f35]" />
      <span aria-hidden className="absolute top-[34%] -right-[3px] h-[15%] w-[3px] rounded-r bg-[#2e2f35]" />
      <div className="relative h-full w-full overflow-hidden rounded-[29px] bg-black">
        <div className="origin-top-left" style={{ transform: `scale(${scale})`, width: SCREEN_W }}>
          {children}
        </div>
        {/* punch-hole camera */}
        <span aria-hidden className="absolute top-[1.6%] left-1/2 h-[2.1%] w-auto -translate-x-1/2 rounded-full bg-black ring-1 ring-white/10" style={{ aspectRatio: "1" }} />
      </div>
    </div>
  );
}

/** Fits a real exported screenshot into the screen area. */
function Screenshot({ src, alt }: { src: StaticImageData | string; alt: string }) {
  return (
    <div className="relative overflow-hidden rounded-[48px] bg-black" style={{ width: SCREEN_W, height: SHOT_H }}>
      <Image src={src} alt={alt} fill sizes="300px" className="object-cover object-top" />
    </div>
  );
}

/**
 * A phone showing either a rebuilt app screen (children) or, once Dusko exports
 * them, a real screenshot (`image`). `kind` picks the iPhone or Android frame.
 */
export function PhoneShot({
  kind = "iphone",
  bodyHeight = 460,
  image,
  alt = "",
  mirror = false,
  children,
}: {
  kind?: "iphone" | "android";
  bodyHeight?: number;
  image?: StaticImageData | string;
  alt?: string;
  mirror?: boolean;
  children?: ReactNode;
}) {
  const screen = image ? <Screenshot src={image} alt={alt} /> : children;
  if (kind === "android") {
    return (
      <div style={mirror ? { WebkitBoxReflect: "below 6px linear-gradient(transparent 84%, rgba(255,255,255,0.14))" } : undefined}>
        <AndroidPhone bodyHeight={bodyHeight}>{screen}</AndroidPhone>
      </div>
    );
  }
  return (
    <FramedPhone frame={STRAIGHT_FRAME} bodyHeight={bodyHeight} mirror={mirror}>
      {screen}
    </FramedPhone>
  );
}
