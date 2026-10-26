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

function TiltedRings() {
  return (
    <div aria-hidden className="pointer-events-none absolute" style={PHONE_CENTER}>
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

export function Hero() {
  const t = useT();
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden pt-28 pb-14 sm:pt-32 sm:pb-[4.5rem] lg:pt-28">
      {/* crimson glow behind the phone */}
      <div
        aria-hidden
        className="absolute top-[14%] left-1/2 h-[520px] w-[520px] -translate-x-[70%] rounded-full bg-[radial-gradient(closest-side,rgba(200,20,40,0.4),transparent)] blur-3xl"
      />
      <div
        aria-hidden
        className="absolute top-[24%] left-1/2 h-[420px] w-[420px] -translate-x-[5%] rounded-full bg-[radial-gradient(closest-side,rgba(170,15,35,0.3),transparent)] blur-3xl"
      />

      <div className="container-page relative flex flex-col items-center text-center">
        <ScrollDrift y={-90} scale={0.94} className="relative">
          <TiltedRings />
          <div className="rise relative" style={rise(100)}>
            <TiltPhone className="w-[240px] sm:w-[300px] lg:w-[clamp(250px,30vh,320px)]">
              <div className="relative">
                <div className="[mask-image:linear-gradient(180deg,#000_78%,transparent_100%)] [-webkit-mask-image:linear-gradient(180deg,#000_78%,transparent_100%)]">
                  <PhoneMockup className="w-full">
                    <AlertScreen time="9:45" />
                  </PhoneMockup>
                </div>
              </div>
            </TiltPhone>
          </div>
        </ScrollDrift>

        <h1
          id="hero-title"
          className="rise relative mt-2 text-[2.6rem] leading-[1.06] font-semibold tracking-[-0.03em] sm:text-[3.4rem] lg:text-[3.7rem]"
          style={rise(250)}
        >
          {t.hero.line1}
          <br />
          <span className="text-white/50">{t.hero.line2}</span>
        </h1>
        <p className="rise mt-4 max-w-xl text-[1rem] leading-relaxed text-white/65 sm:text-[1.08rem]" style={rise(380)}>
          {t.hero.sentence}
        </p>
        {/* the three promises */}
        <ul className="rise mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[0.88rem] text-white/80" style={rise(440)}>
          {t.hero.promises.map((p) => (
            <li key={p} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-[#ff8a95]" strokeWidth={2.6} aria-hidden />
              {p}
            </li>
          ))}
        </ul>
        <div className="rise mt-6" style={rise(500)}>
          <StoreBadges className="justify-center" />
        </div>
        {/* social proof strip */}
        <p className="rise mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[0.78rem] text-white/50" style={rise(580)}>
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
    </section>
  );
}
