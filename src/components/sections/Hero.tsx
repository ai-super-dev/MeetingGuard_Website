import Image, { type StaticImageData } from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { CountUp } from "@/components/motion";
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

function UsersIcon() {
  return (
    <svg viewBox="0 0 44 32" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="stat-users" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4f8dff" />
          <stop offset="1" stopColor="#8a6cff" />
        </linearGradient>
      </defs>
      <g fill="url(#stat-users)">
        <circle cx="22" cy="8" r="6.5" />
        <path d="M10 30c0-7 5.4-12 12-12s12 5 12 12z" />
        <circle cx="8.5" cy="11" r="4.6" />
        <path d="M0 29c0-5 3.6-8.6 8.5-8.6 2 0 3.7.6 5 1.6A14.6 14.6 0 0 0 9.4 30H0z" />
        <circle cx="35.5" cy="11" r="4.6" />
        <path d="M44 29c0-5-3.6-8.6-8.5-8.6-2 0-3.7.6-5 1.6a14.6 14.6 0 0 1 4.1 8H44z" />
      </g>
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg viewBox="0 0 32 36" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="stat-shield" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4f8dff" />
          <stop offset="1" stopColor="#7d6cff" />
        </linearGradient>
      </defs>
      <path
        d="M16 2 29 6.5v9.3c0 8.4-5.6 14.4-13 17.7C8.6 30.2 3 24.2 3 15.8V6.5Z"
        fill="none"
        stroke="url(#stat-shield)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="m10.5 17.5 4 4 7.5-8" fill="none" stroke="url(#stat-shield)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="stat-star" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4f8dff" />
          <stop offset="1" stopColor="#6f6cff" />
        </linearGradient>
      </defs>
      <path fill="url(#stat-star)" d="m12 1.8 3.1 6.6 7.2.8-5.4 4.9 1.5 7.1L12 17.6l-6.4 3.6 1.5-7.1-5.4-4.9 7.2-.8z" />
    </svg>
  );
}

const stats: { icon: ReactNode; value: ReactNode; label: string; iconBox: string }[] = [
  {
    icon: <UsersIcon />,
    value: <CountUp value={10} suffix="K+" />,
    label: "Active Users",
    iconBox: "w-7 sm:w-10 lg:w-[calc(var(--u)*2.65)]",
  },
  {
    icon: <ShieldCheckIcon />,
    value: <CountUp value={99.9} decimals={1} suffix="%" />,
    label: "Meeting Protection",
    iconBox: "w-6 sm:w-8 lg:w-[calc(var(--u)*2.05)]",
  },
  {
    icon: <StarIcon />,
    value: (
      <>
        <CountUp value={4.8} decimals={1} />
        /5
      </>
    ),
    label: "App Store Rating",
    iconBox: "w-6 sm:w-9 lg:w-[calc(var(--u)*2.4)]",
  },
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
        <div className="px-5 pt-28 sm:px-8 lg:absolute lg:top-[calc(var(--u)*9.7)] lg:left-[calc(var(--u)*7.3)] lg:w-[calc(var(--u)*42)] lg:p-0">
          {/* badge */}
          <p
            className="hero-rise inline-flex h-9 items-center gap-2 rounded-full border border-[#3a5fc4]/45 bg-[#0a1634]/70 px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-sm lg:h-[calc(var(--u)*2.4)] lg:gap-[calc(var(--u)*0.85)] lg:pr-[calc(var(--u)*1.2)] lg:pl-[calc(var(--u)*1.05)]"
            style={rise(150)}
          >
            <Image
              src={icons.lightning}
              alt=""
              sizes="40px"
              className="h-4 w-4 object-contain lg:h-[calc(var(--u)*1.3)] lg:w-[calc(var(--u)*1.3)]"
            />
            <span className="hero-badge-text text-[0.72rem] font-semibold tracking-[0.2em] uppercase lg:text-[max(11px,calc(var(--u)*0.93))]">
              Your AI meeting assistant
            </span>
          </p>

          {/* headline */}
          <h1
            id="hero-title"
            className="mt-5 text-[2.7rem] leading-[0.95] min-[400px]:text-[2.95rem] font-extrabold tracking-[-0.015em] sm:text-[4.6rem] lg:mt-[calc(var(--u)*1.25)] lg:text-[calc(var(--u)*5.75)]"
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
            className="hero-rise mt-5 max-w-[34rem] text-[1.12rem] leading-[1.3] text-[#c3c9d6] lg:mt-[calc(var(--u)*0.85)] lg:max-w-[calc(var(--u)*37.5)] lg:text-[calc(var(--u)*1.5)] lg:leading-[1.24]"
            style={rise(520)}
          >
            AI-powered meeting scheduling, critical alerts, and automatic calendar sync — so you&apos;re always in the
            right meeting, right on time.
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
          <div className="hero-rise mt-8 lg:mt-[calc(var(--u)*2.2)]" style={rise(1000)}>
            <StoreButtons />
          </div>

          {/* stats */}
          <ul
            className="hero-rise mt-8 flex items-center lg:mt-[calc(var(--u)*2.25)]"
            style={rise(1120)}
          >
            {stats.map((s, i) => (
              <li
                key={s.label}
                className={`flex items-center gap-2 sm:gap-3 lg:gap-[calc(var(--u)*0.75)] ${
                  i > 0
                    ? "ml-3 border-l border-white/15 pl-3 sm:ml-5 sm:pl-5 lg:ml-[calc(var(--u)*1.75)] lg:pl-[calc(var(--u)*1.75)]"
                    : ""
                }`}
              >
                <span className={`shrink-0 drop-shadow-[0_0_8px_rgba(80,130,255,0.55)] ${s.iconBox}`}>{s.icon}</span>
                <span className="leading-none">
                  <span className="block text-[1.05rem] font-semibold sm:text-[1.3rem] tracking-[-0.01em] text-[#f7f8fa] lg:text-[calc(var(--u)*1.55)]">
                    {s.value}
                  </span>
                  <span className="mt-1 block text-[0.66rem] text-[#9aa3b6] sm:text-[0.8rem] lg:mt-[calc(var(--u)*0.4)] lg:text-[max(11px,calc(var(--u)*1.0))]">
                    {s.label}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </HeroStage>
    </section>
  );
}
