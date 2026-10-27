import type { CSSProperties, ReactNode } from "react";
import { PhoneMockup } from "./PhoneMockup";
import type { FrameSpec } from "./geometry";

/**
 * Glossy-floor reflection (--phone-reflect in globals.css, one per theme). The
 * mask is laid over the reflection before it's flipped, so its bottom (opaque)
 * end sits right at the phone's edge and the reflection fades out going down.
 */
const MIRROR: CSSProperties = {
  // the fallback is the dark-theme reflection, in case the variable is missing
  WebkitBoxReflect: "var(--phone-reflect, below 6px linear-gradient(transparent 84%, rgba(255,255,255,0.14)))",
};

/**
 * A frame PNG drawn so its phone body is `bodyHeight` px tall. The layout box
 * hugs the body, so the PNG's empty margins don't push neighbouring content.
 */
export function FramedPhone({
  frame,
  bodyHeight,
  mirror = false,
  rotate = 0,
  children,
}: {
  frame: FrameSpec;
  bodyHeight: number;
  /** Reflect the phone on a glossy floor beneath it. */
  mirror?: boolean;
  /** Extra clockwise turn in degrees, around the phone body's centre. */
  rotate?: number;
  children: ReactNode;
}) {
  const body = frame.body ?? { x: 0, y: 0, w: frame.w, h: frame.h };
  const k = bodyHeight / body.h;
  return (
    <div className="theme-dark relative" style={{ width: body.w * k, height: body.h * k, ...(mirror ? MIRROR : null) }}>
      <PhoneMockup
        frame={frame}
        sizes={`${Math.ceil(frame.w * k)}px`}
        style={{
          position: "absolute",
          left: -body.x * k,
          top: -body.y * k,
          width: frame.w * k,
          ...(rotate
            ? {
                transform: `rotate(${rotate}deg)`,
                transformOrigin: `${(body.x + body.w / 2) * k}px ${(body.y + body.h / 2) * k}px`,
              }
            : null),
        }}
      >
        {children}
      </PhoneMockup>
    </div>
  );
}
