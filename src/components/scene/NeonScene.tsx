/**
 * Procedural neon landscape: starfield, nebula haze, a moon, electric
 * cracks, three ranges of faceted crystal mountains and a reflective floor.
 *
 * Everything is generated from a seed so server and client markup match and
 * every section gets its own unique (but stable) skyline.
 */

type SceneTone = "blue" | "red" | "violet";
type MoonTone = "blue" | "purple" | "red";

export type MoonSpec = {
  /** CSS position of the moon's centre, relative to the scene. */
  left: string;
  top: string;
  /** Diameter in px. */
  size: number;
  tone: MoonTone;
};

type NeonSceneProps = {
  seed: number;
  tone?: SceneTone;
  moon?: MoonSpec;
  /** 0..1 — share of the width (from the centre) kept free of tall peaks. */
  centerOpen?: number;
  /** Tallest peak as a share of the scene height. */
  height?: number;
  cracks?: boolean;
  className?: string;
};

const W = 1440;
const H = 720;
const FLOOR = H - 92;

const palettes: Record<
  SceneTone,
  { rim: string; rimAlt: string; rimFar: string; fog: string; nebula: string; streak: [string, string] }
> = {
  blue: {
    rim: "#b65cff",
    rimAlt: "#3d8bff",
    rimFar: "#4f6bff",
    fog: "rgba(150,70,255,0.5)",
    nebula:
      "radial-gradient(60% 55% at 72% 18%, rgba(110,70,255,0.32), transparent 70%), radial-gradient(55% 60% at 28% 38%, rgba(30,90,255,0.30), transparent 70%), radial-gradient(40% 35% at 50% 60%, rgba(60,40,200,0.25), transparent 70%)",
    streak: ["#4c8dff", "#c06bff"],
  },
  red: {
    rim: "#ff3d7a",
    rimAlt: "#c43bff",
    rimFar: "#7a3cff",
    fog: "rgba(255,50,120,0.45)",
    nebula:
      "radial-gradient(55% 50% at 70% 30%, rgba(255,40,110,0.30), transparent 70%), radial-gradient(55% 60% at 25% 40%, rgba(140,40,220,0.32), transparent 70%), radial-gradient(40% 35% at 55% 65%, rgba(200,30,120,0.22), transparent 70%)",
    streak: ["#ff4f8b", "#a84dff"],
  },
  violet: {
    rim: "#a66bff",
    rimAlt: "#4f7dff",
    rimFar: "#5b5bff",
    fog: "rgba(120,80,255,0.5)",
    nebula:
      "radial-gradient(60% 55% at 30% 25%, rgba(70,90,255,0.32), transparent 70%), radial-gradient(55% 60% at 72% 40%, rgba(130,70,255,0.30), transparent 70%)",
    streak: ["#5a8cff", "#a46bff"],
  },
};

const moons: Record<MoonTone, { body: string; glow: string; rim: string }> = {
  purple: {
    body: "radial-gradient(circle at 34% 30%, #b9b0ff 0%, #6f5fe0 26%, #3b2c9e 55%, #170f4a 80%)",
    glow: "0 0 60px rgba(140,110,255,0.65), 0 0 140px rgba(110,80,255,0.35), inset -18px -24px 50px rgba(5,5,30,0.75)",
    rim: "rgba(210,190,255,0.6)",
  },
  blue: {
    body: "radial-gradient(circle at 34% 30%, #a9c8ff 0%, #5a83e6 26%, #28449f 55%, #0c1850 80%)",
    glow: "0 0 60px rgba(80,140,255,0.6), 0 0 140px rgba(60,110,255,0.3), inset -18px -24px 50px rgba(3,6,30,0.75)",
    rim: "rgba(190,215,255,0.6)",
  },
  red: {
    body: "radial-gradient(circle at 34% 30%, #ffa1b6 0%, #e04a72 26%, #8e1b45 55%, #360620 80%)",
    glow: "0 0 60px rgba(255,60,110,0.65), 0 0 140px rgba(255,40,90,0.35), inset -18px -24px 50px rgba(25,3,12,0.75)",
    rim: "rgba(255,190,205,0.6)",
  },
};

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Pt = [number, number];
const r0 = Math.round;
const pts = (list: Pt[]) => list.map(([x, y]) => `${r0(x)},${r0(y)}`).join(" L");

/** Jagged polyline from a to b with `n` intermediate points pushed sideways. */
function jag(rand: () => number, a: Pt, b: Pt, n: number, spread: number): Pt[] {
  const out: Pt[] = [a];
  for (let i = 1; i <= n; i++) {
    const t = i / (n + 1) + (rand() - 0.5) * 0.12;
    out.push([a[0] + (b[0] - a[0]) * t + (rand() - 0.5) * spread, a[1] + (b[1] - a[1]) * t + (rand() - 0.5) * spread * 0.6]);
  }
  out.push(b);
  return out;
}

type RangeOpts = {
  maxH: number;
  minH: number;
  power: number;
  gap: number;
  step: [number, number];
  width: [number, number];
};

/**
 * A mountain range made of overlapping faceted peaks. Each peak is split by
 * a ridge into a shadow face and a face lit toward the centre of the scene.
 */
function buildRange(rand: () => number, o: RangeOpts) {
  const peaks: { h: number; shadow: string; lit: string; edge: string; vein: string }[] = [];
  for (let x = -80; x < W + 80; x += o.step[0] + rand() * (o.step[1] - o.step[0])) {
    const d = Math.min(1, Math.abs(x - W / 2) / (W / 2));
    const env = Math.pow(Math.max(0, (d - o.gap) / (1 - o.gap)), o.power);
    const h = (o.minH + (o.maxH - o.minH) * env) * (0.6 + rand() * 0.4);
    if (h < 14) continue;

    const hw = h * (o.width[0] + rand() * (o.width[1] - o.width[0])) + 16;
    const apex: Pt = [x + (rand() - 0.5) * 20, FLOOR - h];
    const baseL: Pt = [x - hw, FLOOR + 2];
    const baseR: Pt = [x + hw * (0.8 + rand() * 0.4), FLOOR + 2];
    const ridgeBase: Pt = [x + (rand() - 0.5) * hw * 0.5, FLOOR + 2];

    const left = jag(rand, baseL, apex, 3, h * 0.12);
    const right = jag(rand, apex, baseR, 3, h * 0.12);
    const ridge = jag(rand, apex, ridgeBase, 3, h * 0.1);
    const ridgeUp = [...ridge].reverse();

    // light falls from the centre of the scene
    const litRight = x < W / 2;
    const faceL = `M${pts([...left, ...ridge.slice(1)])} Z`;
    const faceR = `M${pts([...right, ...ridgeUp.slice(1)])} Z`;

    // the lit outline plus the upper part of the ridge
    const outline = litRight ? right.slice(0, 3) : left.slice(-3);
    const edge = `M${pts(outline)} M${pts(ridge.slice(0, 3))}`;

    // glowing crack running down the lit face
    let vein = "";
    if (h > 120 && rand() > 0.35) {
      const side = litRight ? 1 : -1;
      let vx = apex[0] + side * hw * 0.15;
      let vy = apex[1] + h * 0.15;
      const trail: Pt[] = [[vx, vy]];
      for (let s = 0; s < 4; s++) {
        vx += side * (rand() * hw * 0.18);
        vy += h * (0.08 + rand() * 0.12);
        trail.push([vx, vy]);
      }
      vein = `M${pts(trail)}`;
    }

    peaks.push({ h, shadow: litRight ? faceL : faceR, lit: litRight ? faceR : faceL, edge, vein });
  }
  // taller peaks sit further back
  peaks.sort((a, b) => b.h - a.h);
  return peaks;
}

function buildCracks(rand: () => number, count: number) {
  const paths: string[] = [];
  for (let c = 0; c < count; c++) {
    const side = c % 2 === 0 ? -1 : 1;
    let x = W / 2 + side * (180 + rand() * 360);
    let y = 70 + rand() * 220;
    const trail: Pt[] = [[x, y]];
    const segs = 5 + Math.floor(rand() * 5);
    let branches = "";
    for (let s = 0; s < segs; s++) {
      x += side * (12 + rand() * 26);
      y += (rand() - 0.3) * 30;
      trail.push([x, y]);
      if (rand() > 0.7) {
        branches += ` M${r0(x)},${r0(y)} L${r0(x + side * (10 + rand() * 20))},${r0(y + (rand() - 0.5) * 36)}`;
      }
    }
    paths.push(`M${pts(trail)}${branches}`);
  }
  return paths.join(" ");
}

function RangeLayer({
  peaks,
  uid,
  name,
  shadow,
  litOpacity,
  edgeColor,
  edgeWidth,
  glow,
  veinColor,
}: {
  peaks: ReturnType<typeof buildRange>;
  uid: string;
  name: string;
  shadow: string;
  litOpacity: number;
  edgeColor: string;
  edgeWidth: number;
  glow: number;
  veinColor?: string;
}) {
  return (
    <g id={`${uid}-${name}`}>
      {peaks.map((pk, i) => (
        <g key={i}>
          <path d={pk.shadow} fill={shadow} />
          <path d={pk.lit} fill={shadow} />
          <path d={pk.lit} fill={`url(#${uid}-lit-${name})`} opacity={litOpacity} />
        </g>
      ))}
      <path
        d={peaks.map((pk) => pk.edge).join(" ")}
        fill="none"
        stroke={edgeColor}
        strokeWidth={edgeWidth * 4}
        opacity={glow}
        filter={`url(#${uid}-glow)`}
        strokeLinejoin="round"
      />
      <path
        d={peaks.map((pk) => pk.edge).join(" ")}
        fill="none"
        stroke={`url(#${uid}-edge-${name})`}
        strokeWidth={edgeWidth}
        strokeLinejoin="round"
      />
      {veinColor && (
        <>
          <path
            d={peaks.map((pk) => pk.vein).join(" ")}
            fill="none"
            stroke={veinColor}
            strokeWidth="4"
            opacity="0.5"
            filter={`url(#${uid}-glow)`}
          />
          <path d={peaks.map((pk) => pk.vein).join(" ")} fill="none" stroke={veinColor} strokeWidth="1" opacity="0.9" />
        </>
      )}
    </g>
  );
}

export function NeonScene({
  seed,
  tone = "blue",
  moon,
  centerOpen = 0.22,
  height = 0.72,
  cracks = true,
  className = "",
}: NeonSceneProps) {
  const rand = rng(seed);
  const p = palettes[tone];
  const uid = `ns${seed}`;
  const mh = FLOOR * height;
  const top = FLOOR - mh;

  const back = buildRange(rand, { maxH: mh * 0.78, minH: 40, power: 0.8, gap: 0, step: [34, 62], width: [0.45, 0.75] });
  const mid = buildRange(rand, { maxH: mh, minH: 10, power: 1.15, gap: centerOpen, step: [30, 58], width: [0.4, 0.65] });
  const front = buildRange(rand, {
    maxH: mh * 0.58,
    minH: 0,
    power: 1.3,
    gap: Math.min(0.8, centerOpen + 0.32),
    step: [28, 52],
    width: [0.45, 0.7],
  });
  const crackPath = cracks ? buildCracks(rand, 4) : "";

  const stars = Array.from({ length: 80 }, () => ({
    x: r0(rand() * W),
    y: r0(rand() * FLOOR * 0.8),
    r: Math.round((0.4 + rand() * 1.1) * 10) / 10,
    o: Math.round((0.35 + rand() * 0.65) * 100) / 100,
    tw: rand() > 0.7,
    delay: Math.round(rand() * 40) / 10,
  }));

  const streaks = Array.from({ length: 16 }, () => ({
    x: r0(rand() * W - 100),
    y: r0(FLOOR + 6 + rand() * (H - FLOOR - 10)),
    w: r0(60 + rand() * 360),
    o: Math.round((0.12 + rand() * 0.45) * 100) / 100,
    c: rand() > 0.5 ? p.streak[0] : p.streak[1],
  }));

  const m = moon ? moons[moon.tone] : null;
  const vGrad = (id: string, stops: [number, string, number][]) => (
    <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="0" y1={top} x2="0" y2={FLOOR}>
      {stops.map(([o, c, op]) => (
        <stop key={o} offset={o} stopColor={c} stopOpacity={op} />
      ))}
    </linearGradient>
  );

  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {/* deep sky */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#030820_0%,#06103a_45%,#0a1550_78%,#050b2c_100%)]" />
      <div className="absolute inset-0" style={{ backgroundImage: p.nebula }} />

      {/* stars */}
      <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice">
        {stars.map((s, i) => (
          <circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill={i % 5 === 0 ? "#a9c8ff" : "#ffffff"}
            opacity={s.o}
            className={s.tw ? "animate-twinkle" : undefined}
            style={s.tw ? { animationDelay: `${s.delay}s` } : undefined}
          />
        ))}
      </svg>

      {/* moon */}
      {moon && m && (
        <div
          className="absolute rounded-full"
          style={{
            left: moon.left,
            top: moon.top,
            width: moon.size,
            height: moon.size,
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle at 62% 38%, rgba(0,0,0,0.16) 0 5%, transparent 6.5%), radial-gradient(circle at 40% 66%, rgba(0,0,0,0.14) 0 7%, transparent 9%), radial-gradient(circle at 72% 68%, rgba(0,0,0,0.12) 0 4%, transparent 5.5%), radial-gradient(circle at 26% 46%, rgba(255,255,255,0.1) 0 3%, transparent 4.5%), ${m.body}`,
            boxShadow: `${m.glow}, inset 2px 2px 0 ${m.rim}`,
          }}
        />
      )}

      {/* landscape */}
      {/* pinned to the bottom at a fixed aspect so narrow screens still see the ranges */}
      <svg
        className="absolute bottom-0 left-1/2 h-auto w-[max(100%,820px)] -translate-x-1/2"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMax meet"
      >
        <defs>
          {vGrad(`${uid}-lit-back`, [
            [0, p.rimFar, 0.55],
            [1, p.rimFar, 0],
          ])}
          {vGrad(`${uid}-lit-mid`, [
            [0, p.rim, 0.75],
            [0.45, p.rim, 0.28],
            [1, p.rimAlt, 0.05],
          ])}
          {vGrad(`${uid}-lit-front`, [
            [0.3, p.rimAlt, 0.6],
            [1, p.rimAlt, 0.05],
          ])}
          {vGrad(`${uid}-edge-back`, [
            [0, p.rimFar, 0.8],
            [1, p.rimFar, 0.1],
          ])}
          {vGrad(`${uid}-edge-mid`, [
            [0, "#ffffff", 0.95],
            [0.25, p.rim, 1],
            [1, p.rim, 0.15],
          ])}
          {vGrad(`${uid}-edge-front`, [
            [0.3, "#bcd6ff", 1],
            [0.6, p.rimAlt, 0.9],
            [1, p.rimAlt, 0.15],
          ])}
          <linearGradient id={`${uid}-floor`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0b1b5c" />
            <stop offset="0.4" stopColor="#081241" />
            <stop offset="1" stopColor="#030716" />
          </linearGradient>
          <radialGradient id={`${uid}-fog`}>
            <stop offset="0" stopColor={p.fog} />
            <stop offset="1" stopColor={p.fog} stopOpacity="0" />
          </radialGradient>
          <filter id={`${uid}-glow`} x="-5%" y="-20%" width="110%" height="140%">
            <feGaussianBlur stdDeviation="3.2" />
          </filter>
          <clipPath id={`${uid}-floorclip`}>
            <rect x="0" y={FLOOR} width={W} height={H - FLOOR} />
          </clipPath>
        </defs>

        {cracks && (
          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d={crackPath} stroke={p.rim} strokeWidth="4" opacity="0.3" filter={`url(#${uid}-glow)`} />
            <path d={crackPath} stroke={p.rimAlt} strokeWidth="0.9" opacity="0.5" />
          </g>
        )}

        <g opacity="0.9">
          <RangeLayer peaks={back} uid={uid} name="back" shadow="#0b1446" litOpacity={1} edgeColor={p.rimFar} edgeWidth={1} glow={0.25} />
        </g>

        {/* coloured haze where the ranges meet the floor */}
        <ellipse cx={W * 0.16} cy={FLOOR - 30} rx="380" ry="150" fill={`url(#${uid}-fog)`} />
        <ellipse cx={W * 0.84} cy={FLOOR - 30} rx="380" ry="150" fill={`url(#${uid}-fog)`} />

        <RangeLayer peaks={mid} uid={uid} name="mid" shadow="#080b2c" litOpacity={1} edgeColor={p.rim} edgeWidth={1.4} glow={0.6} veinColor={p.rim} />
        <RangeLayer peaks={front} uid={uid} name="front" shadow="#03051a" litOpacity={0.9} edgeColor={p.rimAlt} edgeWidth={1.3} glow={0.55} veinColor={p.rimAlt} />

        {/* reflective floor */}
        <rect x="0" y={FLOOR} width={W} height={H - FLOOR} fill={`url(#${uid}-floor)`} />
        <g clipPath={`url(#${uid}-floorclip)`} opacity="0.3">
          <use href={`#${uid}-mid`} transform={`translate(0 ${FLOOR * 2}) scale(1 -1)`} />
          <use href={`#${uid}-front`} transform={`translate(0 ${FLOOR * 2}) scale(1 -1)`} />
        </g>
        {streaks.map((s, i) => (
          <rect key={i} x={s.x} y={s.y} width={s.w} height="1.6" rx="0.8" fill={s.c} opacity={s.o} />
        ))}
        <rect x="0" y={FLOOR - 1} width={W} height="3" fill={p.rimAlt} opacity="0.55" filter={`url(#${uid}-glow)`} />
      </svg>

      {/* soft vignette keeps edges moody */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_45%,transparent_55%,rgba(2,5,26,0.6)_100%)]" />
    </div>
  );
}
