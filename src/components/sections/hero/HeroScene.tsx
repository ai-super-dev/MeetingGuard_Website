import Image, { type StaticImageData } from "next/image";
import type { CSSProperties } from "react";
import { icons } from "@/lib/assets";
import { LockScreen } from "./LockScreen";
import { PhoneMockup } from "./PhoneMockup";
import { PHONE, PHONE_H, SCENE_H, SCENE_W, sceneBox, sceneSquare } from "./geometry";

/*
 * The right half of the hero: the phone with app icons floating around it.
 * Layers follow the pointer at different depths through the --px/--py
 * variables set by HeroStage (each -0.5…0.5).
 */
const depth = (d: number): CSSProperties => ({
  transform: `translate3d(calc(var(--px, 0) * var(--u) * ${d}), calc(var(--py, 0) * var(--u) * ${d}), 0)`,
});

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
      {/* phone */}
      <div className="absolute" style={{ ...sceneBox(PHONE.x, PHONE.y, PHONE.w, PHONE_H), ...depth(1) }}>
        <div className="h-full w-full [animation:hero-phone-in_1.3s_cubic-bezier(0.22,1,0.36,1)_both_0.25s]">
          <div className="h-full w-full [animation:hero-hover_6s_ease-in-out_1.6s_infinite]">
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
