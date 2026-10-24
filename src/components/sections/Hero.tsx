import type { CSSProperties } from "react";
import Image from "next/image";
import { ScrollDrift, TiltPhone } from "@/components/motion";
import { HomeScreen } from "@/components/phone/HomeScreen";
import { PhoneMockup } from "@/components/phone/PhoneMockup";
import { StoreButtons } from "@/components/ui/StoreButtons";
import { icons } from "@/lib/assets";
import { siteConfig } from "@/lib/site";

const rise = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` });

/** Centre of the phone body inside phone_frame.png (mean of the screen corners). */
const PHONE_CENTER = { left: "49.3%", top: "47.5%" };

/** One bell ring (see `bell-vibrate`); each ring sends out two waves. */
const RING_S = 1.6;
const WAVES = 4;

/** Radio waves broadcasting from the ringing bell. */
function RadioWaves() {
  return (
    <div aria-hidden className="pointer-events-none absolute" style={PHONE_CENTER}>
      {Array.from({ length: WAVES }, (_, i) => (
        <span
          key={i}
          className="absolute top-0 left-0 aspect-square w-[min(1000px,190vw)] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-[#ff5a6e]/60 shadow-[0_0_40px_rgba(255,60,80,0.25),inset_0_0_40px_rgba(255,60,80,0.15)]"
          style={{ animation: `radio-wave ${(RING_S * WAVES) / 2}s cubic-bezier(0.2,0.6,0.35,1) ${(i * RING_S) / 2}s infinite both` }}
        />
      ))}
      {/* faint static rings so the field never looks empty between pulses */}
      <span
        className="absolute top-0 left-0 aspect-square w-[min(1100px,200vw)] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: "repeating-radial-gradient(circle, transparent 0 63px, rgba(255,255,255,0.03) 64px 65px)",
          maskImage: "radial-gradient(circle, #000 20%, transparent 68%)",
          WebkitMaskImage: "radial-gradient(circle, #000 20%, transparent 68%)",
        }}
      />
    </div>
  );
}

/** The alarm bell, floating in front of the phone and vibrating as it rings. */
function RingingBell() {
  return (
    <div
      className="absolute aspect-square w-[42%] -translate-x-1/2 -translate-y-1/2"
      style={{ ...PHONE_CENTER, transform: "translateZ(70px)" }}
    >
      <div className="rise h-full w-full" style={rise(450)}>
        <span
          aria-hidden
          className="absolute -inset-[35%] rounded-full bg-[radial-gradient(closest-side,rgba(255,40,70,0.55),rgba(255,40,70,0.12)_55%,transparent)]"
          style={{ animation: `bell-glow ${RING_S}s ease-in-out infinite` }}
        />
        <Image
          src={icons.bell}
          alt="Ringing MeetingGuard alarm"
          sizes="(min-width: 1024px) 160px, 120px"
          preload
          className="relative h-full w-full origin-[50%_14%] object-contain"
          style={{ animation: `bell-vibrate ${RING_S}s linear infinite` }}
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
        className="absolute top-[14%] left-1/2 h-[520px] w-[520px] -translate-x-[70%] rounded-full bg-[radial-gradient(closest-side,rgba(200,20,40,0.45),transparent)] blur-3xl"
      />
      <div
        aria-hidden
        className="absolute top-[24%] left-1/2 h-[420px] w-[420px] -translate-x-[5%] rounded-full bg-[radial-gradient(closest-side,rgba(170,15,35,0.35),transparent)] blur-3xl"
      />

      <div className="container-page relative flex flex-col items-center text-center">
        <ScrollDrift y={-90} scale={0.94} className="relative">
          <RadioWaves />
          <div className="rise relative" style={rise(100)}>
            <TiltPhone className="w-[260px] sm:w-[330px] lg:w-[360px]">
              <div className="relative" style={{ transformStyle: "preserve-3d" }}>
                <div className="[mask-image:linear-gradient(180deg,#000_50%,transparent_94%)] [-webkit-mask-image:linear-gradient(180deg,#000_50%,transparent_94%)]">
                  <PhoneMockup className="w-full drop-shadow-[0_30px_60px_rgba(0,0,0,0.7)]">
                    <div className="opacity-80">
                      <HomeScreen />
                    </div>
                  </PhoneMockup>
                </div>
                <RingingBell />
              </div>
            </TiltPhone>
          </div>
        </ScrollDrift>

        <h1
          id="hero-title"
          className="rise text-shine relative -mt-6 text-[2.75rem] leading-[1.06] font-semibold tracking-[-0.03em] sm:text-[3.6rem] lg:text-[4rem]"
          style={rise(250)}
        >
          Never miss
          <br />
          what matters.
        </h1>
        <p className="rise mt-4 text-[1.02rem] font-medium text-white/60 sm:text-[1.1rem]" style={rise(380)}>
          {siteConfig.tagline}
        </p>
        <div className="rise mt-7" style={rise(500)}>
          <StoreButtons className="justify-center" />
        </div>
        <p className="rise eyebrow mt-6" style={rise(620)}>
          iPhone &amp; Android · English &amp; Español
        </p>
      </div>
    </section>
  );
}
