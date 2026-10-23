import type { ReactNode } from "react";
import { CircleCheck } from "lucide-react";

export type Tone = "blue" | "cyan" | "red" | "violet";

export const toneStyles: Record<
  Tone,
  { tile: string; check: string; glow: string; phoneGlow: string }
> = {
  blue: {
    tile: "from-[#3b8dff] to-[#1546c9] border-[#9cc6ff]/70 shadow-[0_0_28px_rgba(47,125,255,0.75),inset_0_1px_0_rgba(255,255,255,0.35)]",
    check: "text-neon-cyan",
    glow: "rgba(47,125,255,0.75)",
    phoneGlow: "0 0 32px rgba(47,125,255,0.85), 0 0 90px rgba(47,125,255,0.45)",
  },
  cyan: {
    tile: "from-[#2f9dff] to-[#1546c9] border-[#9cdcff]/70 shadow-[0_0_28px_rgba(34,180,255,0.75),inset_0_1px_0_rgba(255,255,255,0.35)]",
    check: "text-neon-cyan",
    glow: "rgba(34,216,245,0.75)",
    phoneGlow: "0 0 32px rgba(56,140,255,0.85), 0 0 90px rgba(56,140,255,0.45)",
  },
  red: {
    tile: "from-[#ff4d6d] to-[#b3123a] border-[#ffb0c0]/70 shadow-[0_0_30px_rgba(255,51,85,0.8),inset_0_1px_0_rgba(255,255,255,0.35)]",
    check: "text-[#ff3d5e]",
    glow: "rgba(255,51,85,0.75)",
    phoneGlow: "0 0 32px rgba(255,60,110,0.85), 0 0 90px rgba(255,40,90,0.45)",
  },
  violet: {
    tile: "from-[#6f6bff] to-[#3a24c9] border-[#c3b8ff]/70 shadow-[0_0_28px_rgba(124,92,255,0.8),inset_0_1px_0_rgba(255,255,255,0.35)]",
    check: "text-[#a585ff]",
    glow: "rgba(139,92,246,0.75)",
    phoneGlow: "0 0 32px rgba(96,110,255,0.85), 0 0 90px rgba(110,80,255,0.45)",
  },
};

/** Rounded neon square that frames a feature icon. */
export function IconTile({
  tone = "blue",
  children,
  className = "h-[4.5rem] w-[4.5rem] rounded-2xl",
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`grid shrink-0 place-items-center border bg-gradient-to-b text-white ${toneStyles[tone].tile} ${className}`}
    >
      {children}
    </span>
  );
}

export function CheckList({ items, tone = "cyan" }: { items: string[]; tone?: Tone }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-3 text-[0.95rem] text-slate-200">
          <CircleCheck
            className={`h-5 w-5 shrink-0 fill-current ${toneStyles[tone].check} [&>path]:stroke-night-900`}
            strokeWidth={2.4}
            aria-hidden
          />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  id,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
  id: string;
}) {
  return (
    <header className="mx-auto max-w-3xl text-center">
      <p className="eyebrow">{eyebrow}</p>
      <h2
        id={id}
        className="mt-3 font-display text-[2rem] font-semibold leading-tight tracking-tight text-white sm:text-[2.5rem]"
      >
        {title}
      </h2>
      <p className="mt-2 text-base text-slate-300 sm:text-lg">{subtitle}</p>
    </header>
  );
}

export function Stars({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <span className="flex gap-0.5 text-[#ffd02a]" aria-label="5 out of 5 stars" role="img">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 24 24" className={`${className} drop-shadow-[0_0_6px_rgba(255,208,42,0.6)]`} aria-hidden>
          <path
            fill="currentColor"
            d="m12 2.6 2.8 6 6.6.7-4.9 4.5 1.4 6.5L12 17l-5.9 3.3 1.4-6.5L2.6 9.3l6.6-.7z"
          />
        </svg>
      ))}
    </span>
  );
}
