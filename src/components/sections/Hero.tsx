import type { CSSProperties } from "react";
import { ScrollDrift, TiltPhone } from "@/components/motion";
import { HomeScreen } from "@/components/phone/HomeScreen";
import { PhoneMockup } from "@/components/phone/PhoneMockup";
import { AppIcon } from "@/components/ui/Logo";
import { StoreButtons } from "@/components/ui/StoreButtons";
import { siteConfig } from "@/lib/site";

const rise = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` });

/** Faint concentric rings behind the phone, fading out from the centre. */
function Rings() {
  return (
    <div
      aria-hidden
      className="absolute top-[38%] left-1/2 aspect-square w-[min(1100px,160vw)] -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        background: "repeating-radial-gradient(circle, transparent 0 63px, rgba(255,255,255,0.035) 64px 65px)",
        maskImage: "radial-gradient(circle, #000 20%, transparent 68%)",
        WebkitMaskImage: "radial-gradient(circle, #000 20%, transparent 68%)",
      }}
    />
  );
}

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden pt-28 pb-24 sm:pt-32">
      <Rings />
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
        {/* phone + app icon */}
        <ScrollDrift y={-90} scale={0.94} className="relative">
          <div className="rise" style={rise(100)}>
            <TiltPhone className="w-[260px] sm:w-[330px] lg:w-[360px]">
              <div className="[mask-image:linear-gradient(180deg,#000_45%,transparent_92%)] [-webkit-mask-image:linear-gradient(180deg,#000_45%,transparent_92%)]">
                <PhoneMockup className="w-full drop-shadow-[0_30px_60px_rgba(0,0,0,0.7)]">
                  <div className="opacity-90">
                    <HomeScreen />
                  </div>
                </PhoneMockup>
              </div>
            </TiltPhone>
          </div>
          <div className="rise absolute bottom-[14%] left-1/2 -translate-x-1/2" style={rise(500)}>
            <div className="[animation:float_6s_ease-in-out_1.5s_infinite]">
              <AppIcon glow className="h-[88px] w-[88px] sm:h-[104px] sm:w-[104px]" />
            </div>
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
      </div>
    </section>
  );
}
