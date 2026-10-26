"use client";

import type { CSSProperties } from "react";
import { ScrollDrift, TiltPhone } from "@/components/motion";
import { AlertScreen } from "@/components/phone/AlertScreen";
import { PhoneMockup } from "@/components/phone/PhoneMockup";
import { Check, Star } from "lucide-react";
import { StoreBadges } from "@/components/ui/StoreBadges";
import { siteConfig } from "@/lib/site";
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
            className="rise relative text-[2.6rem] leading-[1.06] font-semibold tracking-[-0.03em] sm:text-[3.4rem] lg:text-[4.1rem]"
            style={rise(250)}
          >
            {t.hero.line1}
            <br />
            <span className="text-white/50">{t.hero.line2}</span>
          </h1>
          <p className="rise mx-auto mt-5 max-w-xl text-[1rem] leading-relaxed text-white/65 sm:text-[1.08rem] lg:mx-0" style={rise(380)}>
            {t.hero.sentence}
          </p>
          {/* the three promises */}
          <ul
            className="rise mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[0.88rem] text-white/80 lg:justify-start"
            style={rise(440)}
          >
            {t.hero.promises.map((p) => (
              <li key={p} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#ff8a95]" strokeWidth={2.6} aria-hidden />
                {p}
              </li>
            ))}
          </ul>
          <div className="rise mt-8" style={rise(500)}>
            <StoreBadges className="justify-center lg:justify-start" />
          </div>
          {/* social proof strip */}
          <p
            className="rise mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[0.78rem] text-white/50 lg:justify-start"
            style={rise(580)}
          >
            <span className="font-medium text-white/70">{t.hero.proof}</span>
            <span aria-hidden className="h-3 w-px bg-white/15" />
            <span>{t.hero.proofDetail}</span>
            {siteConfig.ratings &&
              (["appStore", "googlePlay"] as const).map((store) =>
                siteConfig.ratings?.[store] ? (
                  <span key={store} className="inline-flex items-center gap-1">
                    <span aria-hidden className="h-3 w-px bg-white/15" />
                    <Star className="h-3.5 w-3.5 fill-[#ffd9a0] text-[#ffd9a0]" aria-hidden />
                    {siteConfig.ratings[store]} {t.hero.ratingStore[store]}
                  </span>
                ) : null,
              )}
          </p>
        </div>
      </div>
    </section>
  );
}
