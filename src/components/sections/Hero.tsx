import Image, { type StaticImageData } from "next/image";
import type { CSSProperties } from "react";
import { StoreButtons } from "@/components/ui/StoreButtons";
import { icons, images } from "@/lib/assets";
import { HeroScene } from "./hero/HeroScene";
import { HeroStage } from "./hero/HeroStage";

/*
 * Desktop sizes use the hero unit --u (1% of the 1672px "First page"
 * reference), so type, icons and spacing keep the exact proportions of the
 * design and stay locked to the artwork behind them.
 */

const features: { label: [string, string]; icon: StaticImageData; glow: string }[] = [
  { label: ["Smart", "Alerts"], icon: icons.smartAlert, glow: "rgba(255,50,90,0.55)" },
  { label: ["AI", "Scheduling"], icon: icons.aiScheduling, glow: "rgba(50,120,255,0.55)" },
  { label: ["Calendar", "Sync"], icon: icons.calendarSync, glow: "rgba(40,220,120,0.5)" },
  { label: ["AI", "Assistant"], icon: icons.aiAssistant, glow: "rgba(160,80,255,0.55)" },
];

const rise = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` });

/** Edge-to-edge night sky; anchored to the bottom so the rocks stay under the phone. */
function HeroBackground() {
  return (
    <div className="absolute inset-0 [animation:hero-bg-in_1.6s_ease-out_both]">
      <Image
        src={images.heroBackground}
        alt=""
        fill
        preload
        quality={90}
        sizes="100vw"
        className="object-cover object-[72%_100%] lg:object-bottom"
      />
      {/* the design keeps the copy side dark */}
      <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(0,8,26,0.78)_0%,rgba(0,8,26,0.55)_30%,rgba(0,8,26,0.15)_50%,transparent_62%)] lg:block" />
      {/* keeps the stacked copy readable on small screens */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,8,26,0.82)_0%,rgba(0,8,26,0.55)_45%,rgba(0,8,26,0.1)_75%)] lg:hidden" />
    </div>
  );
}

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden bg-[#00081a]">
      <HeroStage background={<HeroBackground />} scene={<HeroScene />}>
        <div className="px-5 pt-28 sm:px-8 lg:absolute lg:top-[calc(var(--u)*14)] lg:left-[calc(var(--u)*7.3)] lg:w-[calc(var(--u)*42)] lg:p-0">
          {/* headline */}
          <h1
            id="hero-title"
            className="text-[2.7rem] leading-[0.95] min-[400px]:text-[2.95rem] font-extrabold tracking-[-0.015em] sm:text-[4.6rem] lg:text-[calc(var(--u)*5.75)]"
          >
            <span className="hero-rise block text-[#f8f9fa]" style={rise(250)}>
              Never miss
            </span>
            <span className="hero-rise block pb-[0.06em]" style={rise(380)}>
              <span className="hero-gradient-text">what matters.</span>
            </span>
          </h1>

          {/* intro */}
          <p
            className="hero-rise mt-5 max-w-[34rem] text-[1.12rem] leading-[1.3] text-[#c3c9d6] lg:mt-[calc(var(--u)*1.1)] lg:max-w-[calc(var(--u)*37.5)] lg:text-[calc(var(--u)*1.7)] lg:leading-[1.24]"
            style={rise(520)}
          >
            Plan, Alert, Join. Your AI meeting companion.
          </p>

          {/* feature icons */}
          <ul className="mt-8 flex gap-[2.1rem] sm:gap-12 lg:mt-[calc(var(--u)*2.15)] lg:gap-[calc(var(--u)*6.45)]">
            {features.map((f, i) => (
              <li
                key={f.label.join(" ")}
                className="hero-rise group flex w-14 flex-col items-center lg:w-[calc(var(--u)*3.95)]"
                style={rise(640 + i * 90)}
              >
                <span
                  className="relative block aspect-square w-full transition-transform duration-300 group-hover:-translate-y-1.5 group-hover:scale-110"
                  style={{ animation: `hero-breathe 4.5s ease-in-out ${i * 0.5}s infinite` }}
                >
                  <span
                    aria-hidden
                    className="absolute inset-[12%] rounded-2xl opacity-45 blur-lg transition-opacity duration-300 group-hover:opacity-100"
                    style={{ background: f.glow }}
                  />
                  <Image
                    src={f.icon}
                    alt=""
                    sizes="120px"
                    className="absolute -inset-[15%] h-[130%] w-[130%] max-w-none object-contain"
                  />
                </span>
                <span className="mt-2 text-center text-[0.85rem] leading-[1.22] whitespace-nowrap text-[#e6e9f0] lg:mt-[calc(var(--u)*0.8)] lg:text-[max(11px,calc(var(--u)*1.08))]">
                  {f.label[0]}
                  <br />
                  {f.label[1]}
                </span>
              </li>
            ))}
          </ul>

          {/* store buttons */}
          <div className="hero-rise mt-8 lg:mt-[calc(var(--u)*2.6)]" style={rise(1000)}>
            <StoreButtons />
          </div>
        </div>
      </HeroStage>
    </section>
  );
}
