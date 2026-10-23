import Image from "next/image";
import type { CSSProperties } from "react";
import { images } from "@/lib/assets";

/*
 * The lock-screen artwork plus animated light effects pinned to it.
 * Every overlay is positioned in % of the 1672×941 artwork, so the effects
 * stay locked to the bell, orbit rings and slider at any viewport size.
 */
const AW = 1672;
const AH = 941;
const pct = (x: number, y: number): CSSProperties => ({ left: `${(x / AW) * 100}%`, top: `${(y / AH) * 100}%` });

// Phone silhouette in artwork pixels — light trails are masked out of it.
const PHONE = "1075,98 1442,124 1308,884 893,850";

const particles = [
  [742, 210, 0], [690, 520, 1.4], [812, 720, 2.6], [905, 160, 3.4], [1470, 150, 0.8],
  [1610, 250, 2.1], [1625, 480, 3.9], [1585, 760, 1.1], [1380, 905, 2.9], [760, 860, 4.4],
  [640, 330, 5.1], [1530, 880, 0.4], [990, 900, 3.1], [560, 640, 1.8],
] as const;

const sparkles = [
  [1012, 196, 0.2], [1566, 268, 1.3], [818, 430, 2.2], [1596, 532, 0.9],
] as const;

function Shimmer({ x, y, w, h, rotate, radius, delay }: { x: number; y: number; w: number; h: number; rotate: number; radius: string; delay: number }) {
  return (
    <div
      className="absolute overflow-hidden mix-blend-screen"
      style={{
        ...pct(x, y),
        width: `${(w / AW) * 100}%`,
        height: `${(h / AH) * 100}%`,
        transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
        borderRadius: radius,
      }}
    >
      <span
        className="absolute inset-y-0 left-0 w-1/3 bg-[linear-gradient(90deg,transparent,rgba(190,200,255,0.38),transparent)]"
        style={{ animation: `hero-sweep 5.5s ease-in-out ${delay}s infinite` }}
      />
    </div>
  );
}

export function HeroArt() {
  return (
    <div className="absolute inset-0 [animation:hero-art-in_1.4s_cubic-bezier(0.22,1,0.36,1)_both_0.1s]">
      <div className="absolute inset-0 [animation:hero-breathe_14s_ease-in-out_1.6s_infinite]">
        <Image
          src={images.heroArt}
          alt="MeetingGuard lock screen showing a critical Investor Call alert, with Google Calendar, Zoom, WhatsApp and the AI assistant orbiting the phone"
          fill
          preload
          quality={90}
          sizes="(min-width: 1024px) min(100vw, 1777px), 185vw"
          className="object-cover"
        />

        {/* ringing bell glow */}
        <div
          className="absolute aspect-square w-[15%] rounded-full mix-blend-screen"
          style={{
            ...pct(1165, 398),
            background: "radial-gradient(circle, rgba(255,40,80,0.55) 0%, rgba(255,30,70,0.18) 38%, transparent 68%)",
            animation: "hero-pulse 1.8s ease-in-out infinite",
          }}
        />

        {/* light trails: comets running the orbit, pulsing floor ring */}
        <svg viewBox={`0 0 ${AW} ${AH}`} className="absolute inset-0 h-full w-full mix-blend-screen" aria-hidden>
          <defs>
            <linearGradient id="hero-comet" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#4fd8ff" />
              <stop offset="0.5" stopColor="#ffffff" />
              <stop offset="1" stopColor="#b46bff" />
            </linearGradient>
            <filter id="hero-blur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" />
            </filter>
            <mask id="hero-phone-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={AW} height={AH}>
              <rect width={AW} height={AH} fill="#fff" />
              <polygon points={PHONE} fill="#000" />
            </mask>
          </defs>

          <g mask="url(#hero-phone-mask)" fill="none" strokeLinecap="round">
            {[
              { rx: 388, ry: 178, rot: 6, dur: 7, delay: 0, w: 4 },
              { rx: 350, ry: 150, rot: -4, dur: 9, delay: 2.5, w: 3 },
            ].map((o, i) => (
              <g key={i} transform={`rotate(${o.rot} 1180 500)`}>
                <ellipse
                  cx="1180"
                  cy="500"
                  rx={o.rx}
                  ry={o.ry}
                  pathLength={1000}
                  stroke="url(#hero-comet)"
                  strokeWidth={o.w * 3}
                  strokeDasharray="60 940"
                  filter="url(#hero-blur)"
                  opacity="0.8"
                  style={{ animation: `hero-orbit ${o.dur}s linear ${o.delay}s infinite` }}
                />
                <ellipse
                  cx="1180"
                  cy="500"
                  rx={o.rx}
                  ry={o.ry}
                  pathLength={1000}
                  stroke="#ffffff"
                  strokeWidth={o.w * 0.6}
                  strokeDasharray="40 960"
                  strokeDashoffset="-10"
                  style={{ animation: `hero-orbit ${o.dur}s linear ${o.delay}s infinite` }}
                />
              </g>
            ))}
          </g>

          {/* floor ring ripple */}
          <ellipse cx="1102" cy="866" rx="330" ry="44" fill="none" stroke="#7a7cff" strokeWidth="3" opacity="0">
            <animate attributeName="rx" values="250;380" dur="3.2s" repeatCount="indefinite" />
            <animate attributeName="ry" values="32;54" dur="3.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.9;0" dur="3.2s" repeatCount="indefinite" />
          </ellipse>
        </svg>

        {/* glass shine across the notification and the slider */}
        <Shimmer x={1150} y={565} w={318} h={118} rotate={5} radius="16%/30%" delay={2} />
        <Shimmer x={1120} y={700} w={286} h={80} rotate={5} radius="999px" delay={3.2} />

        {/* slider knob pulse */}
        <span
          className="absolute aspect-square w-[4.4%] rounded-full border-2 border-[#9c8cff]/70 mix-blend-screen"
          style={{ ...pct(1012, 690), animation: "hero-pulse 2.2s ease-in-out infinite" }}
        />

        {/* twinkling sparkles near the orbiting apps */}
        {sparkles.map(([x, y, d]) => (
          <svg
            key={`${x}-${y}`}
            viewBox="0 0 24 24"
            className="absolute w-[1.4%] -translate-x-1/2 -translate-y-1/2 animate-twinkle text-white drop-shadow-[0_0_6px_#8fb8ff]"
            style={{ ...pct(x, y), animationDelay: `${d}s` }}
            aria-hidden
          >
            <path fill="currentColor" d="M12 0c.8 6.4 5.6 11.2 12 12-6.4.8-11.2 5.6-12 12-.8-6.4-5.6-11.2-12-12C6.4 11.2 11.2 6.4 12 0z" />
          </svg>
        ))}

        {/* drifting particles */}
        {particles.map(([x, y, d]) => (
          <span
            key={`${x}-${y}`}
            className="absolute aspect-square w-[0.42%] rounded-full bg-[#8fb2ff] shadow-[0_0_10px_3px_rgba(110,130,255,0.75)]"
            style={{ ...pct(x, y), animation: `hero-drift 6s ease-in-out ${d}s infinite` }}
          />
        ))}
      </div>

      {/* blends the art into the copy above it on small screens */}
      <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-[#00081a] to-transparent lg:hidden" />
    </div>
  );
}
