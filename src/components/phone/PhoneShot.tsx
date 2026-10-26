"use client";

import { cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import Image, { type StaticImageData } from "next/image";
import { FramedPhone } from "./FramedPhone";
import { ANDROID_FRAME, ANDROID_FRAME_RIGHT, SCREEN_W, STRAIGHT_FRAME } from "./geometry";

/** Screen height (CSS px) used by every PhoneShot, so iPhone and Android shots line up. */
export const SHOT_H = STRAIGHT_FRAME.screenH;

/** Black bezel (CSS px at SCREEN_W) between the Android frame's rim and its screen. */
const ANDROID_BEZEL = 10;

/** Fits a real exported screenshot into the screen area. */
function Screenshot({ src, alt, height = SHOT_H }: { src: StaticImageData | string; alt: string; height?: number }) {
  return (
    <div className="relative overflow-hidden rounded-[48px] bg-black" style={{ width: SCREEN_W, height }}>
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
  facing = "left",
  children,
}: {
  kind?: "iphone" | "android";
  /** Android only: which way the tilted phone's screen faces. */
  facing?: "left" | "right";
  bodyHeight?: number;
  image?: StaticImageData | string;
  alt?: string;
  mirror?: boolean;
  children?: ReactNode;
}) {
  const frame = kind === "android" ? (facing === "right" ? ANDROID_FRAME_RIGHT : ANDROID_FRAME) : STRAIGHT_FRAME;
  // the Android frame's opening is the inside of its metal rim, so the screen
  // sits inside a thin black bezel drawn here
  const bezel = kind === "android" ? ANDROID_BEZEL : 0;
  const k = (SCREEN_W - bezel * 2) / SCREEN_W;
  const screenH = Math.round((frame.screenH - bezel * 2) / k);
  // rebuilt screens take the opening's height so they fill it exactly
  const screen = image ? (
    <Screenshot src={image} alt={alt} height={screenH} />
  ) : isValidElement(children) ? (
    cloneElement(children as ReactElement<{ height?: number }>, { height: screenH })
  ) : (
    children
  );
  return (
    <FramedPhone frame={frame} bodyHeight={bodyHeight} mirror={mirror}>
      {bezel ? (
        <div className="rounded-[52px] bg-black" style={{ width: SCREEN_W, height: frame.screenH, padding: bezel }}>
          <div className="origin-top-left" style={{ transform: `scale(${k})`, width: SCREEN_W }}>
            {screen}
          </div>
        </div>
      ) : (
        screen
      )}
    </FramedPhone>
  );
}
