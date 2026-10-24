/**
 * Spiral-galaxy "hole" the phone dives into, drawn face-on in a 1000×1000
 * box. HeroScene flattens and tilts it onto the phone's axis and spins it,
 * so it reads as a glowing solar system lying under the phone.
 *
 * Everything is generated from a fixed seed so server and client match.
 */

const C = 500;
const HOLE_R = 246; // dark portal the phone sinks into
const ARMS = 3;

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = (n: number) => Math.round(n * 10) / 10;

/** Logarithmic spiral from radius r0 to r1 over `turns` turns. */
function spiral(arm: number, r0: number, r1v: number, turns: number, steps = 90) {
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const r = r0 * Math.pow(r1v / r0, t);
    const a = (arm / ARMS) * Math.PI * 2 + t * turns * Math.PI * 2;
    pts.push(`${r1(C + r * Math.cos(a))},${r1(C + r * Math.sin(a))}`);
  }
  return `M${pts.join(" L")}`;
}

const rand = rng(20261024);

const OUTER_ARMS = Array.from({ length: ARMS }, (_, i) => spiral(i, HOLE_R + 6, 492, 0.85));
const INNER_SWIRL = Array.from({ length: ARMS }, (_, i) => spiral(i + 0.5, 30, HOLE_R - 8, 1.1));

/** Star dust scattered along the arms. */
const DUST = Array.from({ length: ARMS * 70 }, (_, k) => {
  const arm = k % ARMS;
  const t = rand();
  const r = (HOLE_R + 6) * Math.pow(492 / (HOLE_R + 6), t);
  const a = (arm / ARMS) * Math.PI * 2 + t * 0.85 * Math.PI * 2 + (rand() - 0.5) * 0.35;
  const jitter = (rand() - 0.5) * 34;
  return {
    x: r1(C + (r + jitter) * Math.cos(a)),
    y: r1(C + (r + jitter) * Math.sin(a)),
    r: r1(1.4 + rand() * 3.6),
    o: Math.round((0.35 + rand() * 0.65) * 100) / 100,
    c: t < 0.35 ? "#ffd6ff" : t < 0.7 ? "#a48cff" : "#7fd8ff",
  };
});

/** Orbits with a "planet" each, like a small solar system around the hole. */
const ORBITS = [
  { r: 300, planet: 0.6, size: 7, color: "#ff9cf2" },
  { r: 356, planet: 2.4, size: 9, color: "#8fb8ff" },
  { r: 414, planet: 4.1, size: 6, color: "#c49bff" },
  { r: 470, planet: 1.3, size: 8, color: "#6fe3ff" },
];

export function Galaxy() {
  return (
    <svg viewBox="0 0 1000 1000" className="h-full w-full overflow-visible" aria-hidden>
      <defs>
        <radialGradient id="gal-tone" gradientUnits="userSpaceOnUse" cx={C} cy={C} r="500">
          <stop offset="0.46" stopColor="#ffd9ff" />
          <stop offset="0.56" stopColor="#ff7ce8" />
          <stop offset="0.68" stopColor="#a05cff" />
          <stop offset="0.82" stopColor="#4f6bff" />
          <stop offset="1" stopColor="#2fc8ff" />
        </radialGradient>
        <radialGradient id="gal-haze" gradientUnits="userSpaceOnUse" cx={C} cy={C} r="500">
          <stop offset="0.45" stopColor="#c66bff" stopOpacity="0.75" />
          <stop offset="0.7" stopColor="#4f5cff" stopOpacity="0.42" />
          <stop offset="1" stopColor="#2f8cff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gal-hole" gradientUnits="userSpaceOnUse" cx={C} cy={C} r={HOLE_R}>
          <stop offset="0" stopColor="#020010" />
          <stop offset="0.7" stopColor="#0b0430" />
          <stop offset="1" stopColor="#2a0f6e" />
        </radialGradient>
        <filter id="gal-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <filter id="gal-blur-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* glowing disc haze */}
      <circle cx={C} cy={C} r="498" fill="url(#gal-haze)" />

      {/* solar-system orbits */}
      <g fill="none" stroke="#9aa8ff">
        {ORBITS.map((o) => (
          <circle key={o.r} cx={C} cy={C} r={o.r} strokeWidth="2.4" opacity="0.5" />
        ))}
      </g>

      {/* spiral arms: wide glow → soft → crisp core */}
      <g fill="none" strokeLinecap="round">
        {OUTER_ARMS.map((d, i) => (
          <g key={i}>
            <path d={d} stroke="url(#gal-tone)" strokeWidth="64" opacity="0.6" filter="url(#gal-blur)" />
            <path d={d} stroke="url(#gal-tone)" strokeWidth="22" opacity="0.9" filter="url(#gal-blur-soft)" />
            <path d={d} stroke="#ffffff" strokeWidth="5" opacity="0.9" />
          </g>
        ))}
      </g>

      {DUST.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={p.c} opacity={p.o} />
      ))}

      {/* planets riding the orbits */}
      {ORBITS.map((o) => {
        const x = r1(C + o.r * Math.cos(o.planet));
        const y = r1(C + o.r * Math.sin(o.planet));
        return (
          <g key={o.r}>
            <circle cx={x} cy={y} r={o.size * 3} fill={o.color} opacity="0.35" filter="url(#gal-blur-soft)" />
            <circle cx={x} cy={y} r={o.size} fill="#fff" />
          </g>
        );
      })}

      {/* the hole: dark portal, faint inner vortex, blazing event-horizon ring */}
      <circle cx={C} cy={C} r={HOLE_R} fill="url(#gal-hole)" />
      <g fill="none" stroke="#8a6bff" strokeLinecap="round" opacity="0.4">
        {INNER_SWIRL.map((d, i) => (
          <path key={i} d={d} strokeWidth="5" />
        ))}
      </g>
      <circle cx={C} cy={C} r={HOLE_R} fill="none" stroke="#e7a8ff" strokeWidth="28" opacity="0.8" filter="url(#gal-blur)" />
      <circle cx={C} cy={C} r={HOLE_R} fill="none" stroke="#ffffff" strokeWidth="4" />
    </svg>
  );
}
