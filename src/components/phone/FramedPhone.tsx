import type { ReactNode } from "react";
import { PhoneMockup } from "./PhoneMockup";
import type { FrameSpec } from "./geometry";

/**
 * A frame PNG drawn so its phone body is `bodyHeight` px tall. The layout box
 * hugs the body, so the PNG's empty margins don't push neighbouring content.
 */
export function FramedPhone({
  frame,
  bodyHeight,
  children,
}: {
  frame: FrameSpec;
  bodyHeight: number;
  children: ReactNode;
}) {
  const body = frame.body ?? { x: 0, y: 0, w: frame.w, h: frame.h };
  const k = bodyHeight / body.h;
  return (
    <div className="relative" style={{ width: body.w * k, height: body.h * k }}>
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
