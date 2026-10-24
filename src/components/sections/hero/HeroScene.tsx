import Image, { type StaticImageData } from "next/image";
import type { CSSProperties } from "react";
import { icons, images } from "@/lib/assets";
import { LockScreen } from "./LockScreen";
import { PhoneMockup } from "./PhoneMockup";
import {
  HOVER,
  PHONE,
  PHONE_H,
  SCENE_H,
  SCENE_W,
  WAVE,
  WAVE_H,
  sceneBox,
  sceneSquare,
} from "./geometry";

/*
 * The right half of the hero: phone, glowing orbit trails and floating app
 * icons. Layers follow the pointer at different depths through the
 * --px/--py variables set by HeroStage (each ranges -0.5…0.5).
 */
const depth = (d: number): CSSProperties => ({
  transform: `translate3d(calc(var(--px, 0) * var(--u) * ${d}), calc(var(--py, 0) * var(--u) * ${d}), 0)`,
});

/* ---------- orbit trails (all behind the phone) ---------- */

type Orbit = {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  rot: number;
  /** seconds per lap */
  dur: number;
  /** where each light streak starts along the lap (0…1) */
  streaks: number[];
  opacity: number;
};

const ORBITS: Orbit[] = [
  { cx: 1166, cy: 540, rx: 396, ry: 132, rot: -9, dur: 7, streaks: [0, 0.5], opacity: 1 },
  { cx: 1170, cy: 606, rx: 344, ry: 98, rot: -5, dur: 9.5, streaks: [0.22, 0.72], opacity: 0.9 },
  { cx: 1176, cy: 462, rx: 440, ry: 168, rot: -13, dur: 12, streaks: [0.4], opacity: 0.65 },
];

/** Full ellipse starting at its left point, running along the front first. */
const orbitPath = (o: Orbit) =>
  `M ${o.cx - o.rx} ${o.cy} a ${o.rx} ${o.ry} 0 1 0 ${o.rx * 2} 0 a ${o.rx} ${o.ry} 0 1 0 ${-o.rx * 2} 0`;

/**
 * A light streak: stacked dashes of growing length whose heads stay aligned,
 * so the trail tapers from a hot white head into a soft coloured tail, plus a
 * flare riding the head. Stacked strokes give the glow without animated blur
 * filters, which would repaint the whole layer every frame.
 */
const TRAIL = [
  { len: 420, width: 18, color: "url(#orbit-tone)", opacity: 0.1 },
  { len: 300, width: 11, color: "url(#orbit-tone)", opacity: 0.22 },
  { len: 190, width: 6.5, color: "url(#orbit-tone)", opacity: 0.5 },
  { len: 110, width: 3.6, color: "url(#orbit-tone)", opacity: 0.9 },
  { len: 52, width: 2.4, color: "#ffffff", opacity: 1 },
];

function Orbits() {
  return (
    <>
      {/* static glow tracks — blurred once, never repainted */}
      <svg
        viewBox={`0 0 ${SCENE_W} ${SCENE_H}`}
        className="absolute inset-0 h-full w-full overflow-visible mix-blend-screen"
        style={depth(1.4)}
        aria-hidden
      >
        <defs>
          <linearGradient id="track-tone" gradientUnits="userSpaceOnUse" x1="720" y1="0" x2="1620" y2="0">
            <stop offset="0" stopColor="#2fc8ff" />
            <stop offset="0.45" stopColor="#4d63ff" />
            <stop offset="1" stopColor="#c45bff" />
          </linearGradient>
          <filter id="track-blur" x="-10%" y="-50%" width="120%" height="200%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
          <filter id="track-blur-soft" x="-10%" y="-50%" width="120%" height="200%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>
        {ORBITS.map((o, i) => (
          <g key={i} transform={`rotate(${o.rot} ${o.cx} ${o.cy})`} opacity={o.opacity} fill="none">
            <path d={orbitPath(o)} stroke="url(#track-tone)" strokeWidth="26" opacity="0.5" filter="url(#track-blur)" />
            <path d={orbitPath(o)} stroke="url(#track-tone)" strokeWidth="7" opacity="0.55" filter="url(#track-blur-soft)" />
            <path d={orbitPath(o)} stroke="url(#track-tone)" strokeWidth="1.8" opacity="0.85" />
          </g>
        ))}
      </svg>

      {/* moving light streaks */}
      <svg
        viewBox={`0 0 ${SCENE_W} ${SCENE_H}`}
        className="hero-streaks absolute inset-0 h-full w-full overflow-visible mix-blend-screen"
        style={depth(1.4)}
        aria-hidden
      >
        <defs>
          <linearGradient id="orbit-tone" gradientUnits="userSpaceOnUse" x1="720" y1="0" x2="1620" y2="0">
            <stop offset="0" stopColor="#38d6ff" />
            <stop offset="0.5" stopColor="#6f6bff" />
            <stop offset="1" stopColor="#e06bff" />
          </linearGradient>
          <radialGradient id="orbit-flare">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.18" stopColor="#f3d9ff" stopOpacity="0.95" />
            <stop offset="0.45" stopColor="#b56bff" stopOpacity="0.45" />
            <stop offset="1" stopColor="#7a5cff" stopOpacity="0" />
          </radialGradient>
        </defs>
        {ORBITS.map((o, i) => {
          const d = orbitPath(o);
          return (
            <g key={i} transform={`rotate(${o.rot} ${o.cx} ${o.cy})`} opacity={o.opacity} fill="none" strokeLinecap="round">
              {o.streaks.map((phase) => {
                const begin = `${-phase * o.dur}s`;
                return (
                  <g key={phase}>
                    {TRAIL.map((t) => (
                      <path
                        key={t.len}
                        d={d}
                        pathLength={1000}
                        stroke={t.color}
                        strokeWidth={t.width}
                        opacity={t.opacity}
                        strokeDasharray={`${t.len} ${1000 - t.len}`}
                      >
                        {/* head = len − offset, so every layer's head moves in lockstep */}
                        <animate
                          attributeName="stroke-dashoffset"
                          values={`${t.len};${t.len - 1000}`}
                          dur={`${o.dur}s`}
                          begin={begin}
                          repeatCount="indefinite"
                        />
                      </path>
                    ))}
                    <circle r="34" fill="url(#orbit-flare)">
                      <animateMotion path={d} dur={`${o.dur}s`} begin={begin} repeatCount="indefinite" />
                    </circle>
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
    </>
  );
}

/* ---------- floating app icons ---------- */

const FLOATERS: { icon: StaticImageData; cx: number; cy: number; size: number; depth: number; dur: number; delay: number; tilt: number }[] = [
  { icon: icons.calendar, cx: 968, cy: 262, size: 178, depth: 2.4, dur: 6.2, delay: 0, tilt: -4 },
  { icon: icons.meeting, cx: 1522, cy: 334, size: 184, depth: 2.8, dur: 7, delay: 0.8, tilt: 4 },
  { icon: icons.whatsapp, cx: 892, cy: 484, size: 170, depth: 3.2, dur: 6.6, delay: 1.6, tilt: -5 },
  { icon: icons.robot, cx: 1502, cy: 566, size: 218, depth: 2.2, dur: 5.6, delay: 0.4, tilt: 3 },
];

const PARTICLES = [
  [742, 210, 0], [690, 520, 1.4], [812, 720, 2.6], [905, 160, 3.4], [1470, 150, 0.8],
  [1610, 250, 2.1], [1625, 480, 3.9], [1585, 760, 1.1], [1380, 905, 2.9], [760, 860, 4.4],
  [640, 330, 5.1], [1530, 880, 0.4], [990, 900, 3.1], [560, 640, 1.8],
] as const;

const SPARKLES = [
  [1052, 196, 0.2], [1580, 252, 1.3], [808, 420, 2.2], [1618, 540, 0.9], [1410, 92, 3],
] as const;

export function HeroScene() {
  return (
    <div className="absolute inset-0">
      <Orbits />

      {/*
       * Base wave: tilted to the phone's bottom edge, and pulsing on the same
       * clock as the phone hover — it swells as the phone rises and shrinks
       * as it settles. Same pointer depth as the phone so they stay together.
       */}
      <div
        className="absolute"
        style={{ ...sceneBox(WAVE.cx - WAVE.w / 2, WAVE.cy - WAVE_H * 0.53, WAVE.w, WAVE_H), ...depth(1) }}
      >
        <div className="h-full w-full" style={{ transform: `rotate(${WAVE.tilt}deg)`, transformOrigin: "50% 53%" }}>
          <div className="h-full w-full origin-[50%_53%]" style={{ animation: `hero-wave-pulse ${HOVER}` }}>
            <Image
              src={images.waveEffect}
              alt=""
              fill
              sizes="(min-width: 1024px) 40vw, 80vw"
              className="object-contain mix-blend-screen"
            />
          </div>
        </div>
      </div>

      {/* phone — drawn after the orbits so it is never covered by them */}
      <div className="absolute" style={{ ...sceneBox(PHONE.x, PHONE.y, PHONE.w, PHONE_H), ...depth(1) }}>
        <div className="h-full w-full [animation:hero-phone-in_1.3s_cubic-bezier(0.22,1,0.36,1)_both_0.25s]">
          <div className="h-full w-full" style={{ animation: `hero-hover ${HOVER}` }}>
            <div
              className="relative h-full w-full"
              style={{
                transform:
                  "perspective(1600px) rotateY(calc(var(--px, 0) * 9deg)) rotateX(calc(var(--py, 0) * -6deg))",
              }}
            >
              <span
                aria-hidden
                className="absolute inset-[6%_4%] rounded-[30%] bg-[radial-gradient(closest-side,rgba(130,80,255,0.55),transparent)] blur-2xl"
              />
              <PhoneMockup className="relative h-full w-full drop-shadow-[0_0_28px_rgba(140,90,255,0.55)]">
                <LockScreen />
              </PhoneMockup>
            </div>
          </div>
        </div>
      </div>

      {/* app icons around the phone */}
      {FLOATERS.map((f, i) => (
        <div key={i} className="absolute" style={{ ...sceneSquare(f.cx, f.cy, f.size), ...depth(f.depth) }}>
          <div
            className="h-full w-full"
            style={{ animation: `hero-pop 0.9s cubic-bezier(0.34,1.56,0.64,1) ${0.9 + i * 0.15}s both` }}
          >
            <div
              className="h-full w-full"
              style={{
                ["--tilt" as string]: `${f.tilt}deg`,
                animation: `hero-float ${f.dur}s ease-in-out ${f.delay}s infinite`,
              }}
            >
              <Image src={f.icon} alt="" fill sizes="(min-width: 1024px) 12vw, 26vw" className="object-contain" />
            </div>
          </div>
        </div>
      ))}

      {/* twinkles and drifting motes */}
      {SPARKLES.map(([x, y, d]) => (
        <svg
          key={`${x}-${y}`}
          viewBox="0 0 24 24"
          className="absolute w-[1.4%] -translate-x-1/2 -translate-y-1/2 animate-twinkle text-white drop-shadow-[0_0_6px_#8fb8ff]"
          style={{ left: `${(x / SCENE_W) * 100}%`, top: `${(y / SCENE_H) * 100}%`, animationDelay: `${d}s` }}
          aria-hidden
        >
          <path fill="currentColor" d="M12 0c.8 6.4 5.6 11.2 12 12-6.4.8-11.2 5.6-12 12-.8-6.4-5.6-11.2-12-12C6.4 11.2 11.2 6.4 12 0z" />
        </svg>
      ))}
      {PARTICLES.map(([x, y, d]) => (
        <span
          key={`${x}-${y}`}
          className="absolute aspect-square w-[0.42%] rounded-full bg-[#8fb2ff] shadow-[0_0_10px_3px_rgba(110,130,255,0.75)]"
          style={{ left: `${(x / SCENE_W) * 100}%`, top: `${(y / SCENE_H) * 100}%`, animation: `hero-drift 6s ease-in-out ${d}s infinite` }}
        />
      ))}
    </div>
  );
}
