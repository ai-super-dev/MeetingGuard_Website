import type { CSSProperties } from "react";
import { BellRing, RefreshCw, Sparkles, Video } from "lucide-react";
import { ScrollDrift, TiltPhone } from "@/components/motion";
import { AlertScreen } from "@/components/phone/AlertScreen";
import { PhoneMockup } from "@/components/phone/PhoneMockup";
import { StoreButtons } from "@/components/ui/StoreButtons";
import { siteConfig } from "@/lib/site";

const rise = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` });

const PILLS = [
  { label: "AI Scheduling", icon: Sparkles },
  { label: "Smart Alerts", icon: BellRing },
  { label: "Calendar Sync", icon: RefreshCw },
  { label: "Instant Join", icon: Video },
];

/** Centre of the phone body inside phone_frame.png (mean of the screen corners). */
const PHONE_CENTER = { left: "49.3%", top: "47.5%" };

/**
 * The phone's plane as a 2D affine: its top edge runs at -5.4° and its long
 * edge leans 12° (both measured from phone_frame.png), so a circle drawn
 * through this matrix lies at the same tilt as the phone.
 */
const PHONE_PLANE = "matrix(0.995, -0.094, -0.209, 0.978, 0, 0)";

/** Faint concentric rings around the phone, tilted to the phone's plane. */
function TiltedRings() {
  return (
    <div aria-hidden className="pointer-events-none absolute" style={PHONE_CENTER}>
      <div className="absolute top-0 left-0 h-0 w-0" style={{ transform: PHONE_PLANE }}>
        <span
          className="absolute top-0 left-0 aspect-square w-[min(1100px,200vw)] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: "repeating-radial-gradient(circle, transparent 0 63px, rgba(255,255,255,0.045) 64px 65px)",
            maskImage: "radial-gradient(circle, #000 22%, transparent 68%)",
            WebkitMaskImage: "radial-gradient(circle, #000 22%, transparent 68%)",
          }}
        />
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden pt-28 pb-24 sm:pt-32">
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
            <TiltPhone className="w-[260px] sm:w-[330px] lg:w-[360px]">
              <div className="relative">
                <div className="[mask-image:linear-gradient(180deg,#000_78%,transparent_100%)] [-webkit-mask-image:linear-gradient(180deg,#000_78%,transparent_100%)]">
                  <PhoneMockup className="w-full">
                    <AlertScreen />
                  </PhoneMockup>
                </div>
              </div>
            </TiltPhone>
          </div>
        </ScrollDrift>

        <h1
          id="hero-title"
          className="rise text-shine relative mt-2 text-[2.75rem] leading-[1.06] font-semibold tracking-[-0.03em] sm:text-[3.6rem] lg:text-[4rem]"
          style={rise(250)}
        >
          Never miss
          <br />
          what matters.
        </h1>
        <p className="rise mt-4 text-[1.02rem] font-medium text-white/60 sm:text-[1.1rem]" style={rise(380)}>
          {siteConfig.tagline}
        </p>
        <ul className="rise mt-6 flex max-w-md flex-wrap justify-center gap-2" style={rise(440)}>
          {PILLS.map((p) => (
            <li
              key={p.label}
              className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[0.78rem] text-white/70"
            >
              <p.icon className="h-3.5 w-3.5 text-[#ff8a95]" aria-hidden />
              {p.label}
            </li>
          ))}
        </ul>
        <div className="rise mt-7" style={rise(540)}>
          <StoreButtons className="justify-center" />
        </div>
        <p className="rise eyebrow mt-6" style={rise(620)}>
          iPhone &amp; Android · English &amp; Español
        </p>
      </div>
    </section>
  );
}
