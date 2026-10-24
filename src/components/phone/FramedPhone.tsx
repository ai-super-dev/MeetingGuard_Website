import type { CSSProperties, ReactNode } from "react";
import { PhoneMockup } from "./PhoneMockup";
import type { FrameSpec } from "./geometry";

/**
 * Glossy-floor reflection. The mask is laid over the reflection before it's
 * flipped, so its bottom (opaque) end sits right at the phone's edge and the
 * reflection fades out as it goes down.
 */
const MIRROR_REFLECT = "below 6px linear-gradient(transparent 76%, rgba(255,255,255,0.24))";
const MIRROR: CSSProperties = { WebkitBoxReflect: MIRROR_REFLECT };

/**
 * A frame PNG drawn so its phone body is `bodyHeight` px tall. The layout box
 * hugs the body, so the PNG's empty margins don't push neighbouring content.
 */
export function FramedPhone({
  frame,
  bodyHeight,
  mirror = false,
  children,
}: {
  frame: FrameSpec;
  bodyHeight: number;
  /** Reflect the phone on a glossy floor beneath it. */
  mirror?: boolean;
  children: ReactNode;
}) {
  const body = frame.body ?? { x: 0, y: 0, w: frame.w, h: frame.h };
  const k = bodyHeight / body.h;
  return (
    <div className="relative" style={{ width: body.w * k, height: body.h * k, ...(mirror ? MIRROR : null) }}>
      <PhoneMockup
        frame={frame}
        sizes={`${Math.ceil(frame.w * k)}px`}
        style={{ position: "absolute", left: -body.x * k, top: -body.y * k, width: frame.w * k }}
      >
        {children}
      </PhoneMockup>
    </div>
  );
}
