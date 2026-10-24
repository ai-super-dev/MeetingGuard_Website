import Image, { type StaticImageData } from "next/image";
import type { CSSProperties } from "react";
import { icons, images } from "@/lib/assets";
import { LockScreen } from "./LockScreen";
import { PhoneMockup } from "./PhoneMockup";
import { PHONE, PHONE_H, SCENE_H, SCENE_W, sceneBox, sceneSquare } from "./geometry";

/*
 * The right half of the hero: phone, orbiting rings and floating app icons.
 * Layers follow the pointer at different depths through the --px/--py
 * variables set by HeroStage (each ranges -0.5…0.5).
 */
const depth = (d: number): CSSProperties => ({
  transform: `translate3d(calc(var(--px, 0) * var(--u) * ${d}), calc(var(--py, 0) * var(--u) * ${d}), 0)`,
});

/* ---------- orbit rings ---------- */

type Ring = { cx: number; cy: number; rx: number; ry: number; rot: number; w: number; dur: number; opacity: number };

const RINGS: Ring[] = [
  { cx: 1166, cy: 540, rx: 412, ry: 112, rot: -8, w: 2.6, dur: 8, opacity: 1 },
  { cx: 1166, cy: 588, rx: 352, ry: 90, rot: -6, w: 1.8, dur: 11, opacity: 0.85 },
  { cx: 1172, cy: 470, rx: 472, ry: 150, rot: -10, w: 1.2, dur: 15, opacity: 0.5 },
];

/**
 * One half of every ring. The back half is drawn before the phone and the
 * front half after it, so the rings — and the comets running along them —
 * pass behind and then in front of the device.
 */
function RingHalf({ half }: { half: "back" | "front" }) {
  const id = `ring-${half}`;
  return (
    <svg
      viewBox={`0 0 ${SCENE_W} ${SCENE_H}`}
      className="absolute inset-0 h-full w-full overflow-visible mix-blend-screen"
      style={{ ...depth(1.4), opacity: half === "back" ? 0.7 : 1 }}
      aria-hidden
    >
      <defs>
        <linearGradient id={`${id}-stroke`} gradientUnits="userSpaceOnUse" x1="700" y1="0" x2="1640" y2="0">
          <stop offset="0" stopColor="#38d6ff" />
          <stop offset="0.5" stopColor="#7a6dff" />
          <stop offset="1" stopColor="#d46cff" />
        </linearGradient>
        <filter id={`${id}-blur`} x="-10%" y="-60%" width="120%" height="220%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        {RINGS.map((r, i) => (
          <clipPath key={i} id={`${id}-clip-${i}`} clipPathUnits="userSpaceOnUse">
            <rect
              x={r.cx - r.rx - 60}
              y={half === "back" ? r.cy - r.ry - 60 : r.cy}
              width={r.rx * 2 + 120}
              height={r.ry + 60}
            />
          </clipPath>
        ))}
      </defs>

      {RINGS.map((r, i) => {
        const shape = { cx: r.cx, cy: r.cy, rx: r.rx, ry: r.ry, pathLength: 1000, fill: "none" };
        const orbit = (delay: number): CSSProperties => ({ animation: `hero-orbit ${r.dur}s linear ${delay}s infinite` });
        return (
          <g key={i} transform={`rotate(${r.rot} ${r.cx} ${r.cy})`} clipPath={`url(#${id}-clip-${i})`} opacity={r.opacity}>
            <ellipse {...shape} stroke={`url(#${id}-stroke)`} strokeWidth={r.w * 4} opacity="0.45" filter={`url(#${id}-blur)`} />
            <ellipse {...shape} stroke={`url(#${id}-stroke)`} strokeWidth={r.w} />
            {/* two comets per ring, half an orbit apart */}
            {[0, -r.dur / 2].map((delay) => (
              <g key={delay} strokeLinecap="round">
                <ellipse {...shape} stroke="#9fe8ff" strokeWidth={r.w * 7} strokeDasharray="70 930" filter={`url(#${id}-blur)`} style={orbit(delay)} />
                <ellipse {...shape} stroke="#ffffff" strokeWidth={r.w * 1.6} strokeDasharray="44 956" strokeDashoffset="-13" style={orbit(delay)} />
              </g>
            ))}
          </g>
        );
      })}
    </svg>
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
  const phoneStyle = sceneBox(PHONE.x, PHONE.y, PHONE.w, PHONE_H);

  return (
    <div className="absolute inset-0">
      {/* glowing base the phone stands on */}
      <div className="absolute" style={{ ...sceneBox(712, 640, 820, 461), ...depth(0.8) }}>
        <Image
          src={images.waveEffect}
          alt=""
          fill
          sizes="(min-width: 1024px) 56vw, 110vw"
          className="object-contain mix-blend-screen"
          style={{ animation: "hero-base 4.5s ease-in-out infinite" }}
        />
      </div>

      <RingHalf half="back" />

      {/* phone */}
      <div className="absolute" style={{ ...phoneStyle, ...depth(1) }}>
        <div className="h-full w-full [animation:hero-phone-in_1.3s_cubic-bezier(0.22,1,0.36,1)_both_0.25s]">
          <div className="h-full w-full [animation:hero-float_7s_ease-in-out_1.6s_infinite]">
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

      <RingHalf half="front" />

      {/* app icons orbiting the phone */}
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
