"use client";

import type { CSSProperties } from "react";
import { ScrollDrift, TiltPhone } from "@/components/motion";
import { AlertScreen } from "@/components/phone/AlertScreen";
import { PhoneMockup } from "@/components/phone/PhoneMockup";
import { StoreBadges } from "@/components/ui/StoreBadges";
import { useT } from "@/lib/language";

const rise = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` });


/** Centre of the phone body inside phone_frame.png (mean of the screen corners). */
const PHONE_CENTER = { left: "49.3%", top: "47.5%" };

/**
 * The phone's plane as a 2D affine: its top edge runs at -5.4° and its long
 * edge leans 12° (both measured from phone_frame.png), so a circle drawn
 * through this matrix lies at the same tilt as the phone.
 */
const PHONE_PLANE = "matrix(0.995, -0.094, -0.209, 0.978, 0, 0)";

/**
 * Faint rings broadcasting outward from the phone in its own tilted plane,
 * like a radio signal: each ring grows from the centre and fades until it
 * is gone. Negative delays start the loop already spread across the field.
 */
const RING_COUNT = 8;
const RING_CYCLE = 9.6; // s — two rings per bell ring (2.4 s)

function TiltedRings({ center = PHONE_CENTER }: { center?: { left: string; top: string } }) {
  return (
    <div aria-hidden className="pointer-events-none absolute" style={center}>
      <div className="absolute top-0 left-0 h-0 w-0" style={{ transform: PHONE_PLANE }}>
        {Array.from({ length: RING_COUNT }, (_, i) => (
          <span
            key={i}
            className="absolute top-0 left-0 aspect-square w-[min(1100px,200vw)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.11]"
            style={{
              animation: `ring-out ${RING_CYCLE}s linear ${(-i * RING_CYCLE) / RING_COUNT}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * How much of the phone shows: the window is this fraction of the phone's
 * height, cutting it off below the screen's Join button.
 */
const VISIBLE = 0.74;
/** phone_frame.png is 1024 x 1536 */
const FRAME_RATIO = 1536 / 1024;

/**
 * The tilted phone, larger and cropped: a window shows the top ~74% and the
 * cut fades into the page over a crimson glow, as if the phone were rising
 * out of the light.
 */
function CroppedPhone() {
  const windowRatio = FRAME_RATIO * VISIBLE; // window height / phone width
  return (
    <div className="relative mx-auto w-[300px] sm:w-[380px] lg:w-[min(40vw,calc((100svh_-_7.5rem)/1.11),640px)]">
      {/* rings centred on the phone body; the box is VISIBLE of the frame's height */}
      <TiltedRings center={{ left: PHONE_CENTER.left, top: `${(parseFloat(PHONE_CENTER.top) / VISIBLE).toFixed(1)}%` }} />
      {/* light under the cut */}
      <div
        aria-hidden
        className="absolute bottom-[-12%] left-1/2 h-[46%] w-[120%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(230,30,55,0.5),rgba(170,15,35,0.18)_55%,transparent)] blur-2xl"
      />
      <div
        aria-hidden
        className="absolute top-[18%] left-1/2 h-[70%] w-[90%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(200,20,40,0.32),transparent)] blur-3xl"
      />
      <div
        className="relative overflow-hidden [mask-image:linear-gradient(180deg,#000_58%,rgba(0,0,0,0.55)_78%,transparent_100%)] [-webkit-mask-image:linear-gradient(180deg,#000_58%,rgba(0,0,0,0.55)_78%,transparent_100%)]"
        style={{ aspectRatio: `1 / ${windowRatio}` }}
      >
        <TiltPhone intensity={8}>
          <PhoneMockup className="w-full" sizes="(min-width: 1024px) 640px, 380px">
            <AlertScreen time="9:45" />
          </PhoneMockup>
        </TiltPhone>
      </div>
    </div>
  );
}

export function Hero() {
  const t = useT();
  // desktop: each headline line stays on one line, sized so the longer one fills the text column (~33rem)
  const longest = Math.max(t.hero.line1.length, t.hero.line2.length);
  const titleSize = { "--hero-title": `min(5.2rem, ${(33 / (longest * 0.54)).toFixed(2)}rem)` } as CSSProperties;
  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden pt-28 pb-14 sm:pt-32 sm:pb-[4.5rem] lg:flex lg:min-h-[100svh] lg:items-center lg:pt-24 lg:pb-6"
    >
      <div className="container-page relative grid w-full items-center gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-8">
        {/* phone: right on desktop, on top on phones */}
        <ScrollDrift y={-60} scale={0.97} className="relative lg:order-2">
          <div className="rise relative" style={rise(100)}>
            <CroppedPhone />
          </div>
        </ScrollDrift>

        <div className="relative text-center lg:order-1 lg:text-left">
          <h1
            id="hero-title"
            className="rise relative text-[2.9rem] leading-[1.04] font-semibold tracking-[-0.035em] sm:text-[3.9rem] lg:[font-size:var(--hero-title)]"
            style={{ ...rise(250), ...titleSize }}
          >
            <span className="lg:whitespace-nowrap">{t.hero.line1}</span>
            <br />
            <span className="text-white/50 lg:whitespace-nowrap">{t.hero.line2}</span>
          </h1>
          <p className="rise mx-auto mt-6 max-w-xl text-[1.08rem] leading-relaxed text-white/65 sm:text-[1.2rem] lg:mx-0 lg:mt-7 lg:max-w-[34rem] lg:text-[1.3rem]" style={rise(380)}>
            {t.hero.sentence}
          </p>
          <div className="rise mt-9 lg:mt-11" style={rise(500)}>
            <StoreBadges className="justify-center lg:justify-start" height={58} />
          </div>
        </div>
      </div>
    </section>
  );
}
