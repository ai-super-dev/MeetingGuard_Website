import { useId } from "react";

export type AvatarLook = {
  skin: string;
  hair: string;
  shirt: string;
  bg: [string, string];
  hairStyle: "long" | "short" | "bun" | "wavy";
  beard?: boolean;
};

/** Illustrated portrait presets used across the page (reviewers, attendees). */
export const avatarLooks = {
  sarah: { skin: "#f1c7a8", hair: "#2a1a14", shirt: "#e5e7eb", bg: ["#dfe8f5", "#b8c7dd"], hairStyle: "long" },
  michael: { skin: "#d9a07a", hair: "#2b1b12", shirt: "#7fb2e5", bg: ["#e7eef7", "#c1d0e3"], hairStyle: "short", beard: true },
  emily: { skin: "#f3cfb3", hair: "#5a3420", shirt: "#f5f5f4", bg: ["#ece7e2", "#cfc4b9"], hairStyle: "wavy" },
  ava: { skin: "#f0c9ad", hair: "#7a4a2a", shirt: "#334155", bg: ["#c9d6ea", "#8ea3c4"], hairStyle: "long" },
  mia: { skin: "#e8b896", hair: "#3b2416", shirt: "#f8fafc", bg: ["#dbe4f0", "#a9b8cf"], hairStyle: "bun" },
  noah: { skin: "#c98d66", hair: "#1c120c", shirt: "#1e3a8a", bg: ["#cdd8ea", "#95a7c6"], hairStyle: "short", beard: true },
  liam: { skin: "#eabd9a", hair: "#4a2f1d", shirt: "#0f172a", bg: ["#d5dfee", "#9eb0cd"], hairStyle: "short" },
  ethan: { skin: "#d6a27f", hair: "#2a1d15", shirt: "#475569", bg: ["#c8d3e6", "#8799b8"], hairStyle: "short", beard: true },
} satisfies Record<string, AvatarLook>;

export type AvatarName = keyof typeof avatarLooks;

type AvatarProps = {
  name: AvatarName;
  className?: string;
  label?: string;
};

export function Avatar({ name, className = "h-10 w-10", label }: AvatarProps) {
  const look: AvatarLook = avatarLooks[name];
  const id = useId();

  return (
    <svg
      viewBox="0 0 64 64"
      className={`rounded-full ${className}`}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={look.bg[0]} />
          <stop offset="1" stopColor={look.bg[1]} />
        </linearGradient>
        <clipPath id={`${id}-clip`}>
          <circle cx="32" cy="32" r="32" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-clip)`}>
        <rect width="64" height="64" fill={`url(#${id}-bg)`} />

        {/* hair behind the head */}
        {look.hairStyle === "long" && (
          <path d="M17 30c0-11 6.5-18 15-18s15 7 15 18v22H17z" fill={look.hair} />
        )}
        {look.hairStyle === "wavy" && (
          <path
            d="M16 32c-1-12 6-20 16-20s17 8 16 20c1 6 3 12 0 18-4 3-28 3-32 0-3-6-1-12 0-18z"
            fill={look.hair}
          />
        )}
        {look.hairStyle === "bun" && <circle cx="32" cy="12" r="6.5" fill={look.hair} />}

        {/* shoulders */}
        <path d="M8 64c1-11 10-17 24-17s23 6 24 17z" fill={look.shirt} />
        <path d="M27 44h10v6c0 3-10 3-10 0z" fill={look.skin} />
        <path d="M26.5 47.5 32 53l5.5-5.5" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="1.2" />

        {/* face */}
        <ellipse cx="32" cy="32" rx="11" ry="13" fill={look.skin} />
        <ellipse cx="20.8" cy="33" rx="1.8" ry="2.6" fill={look.skin} />
        <ellipse cx="43.2" cy="33" rx="1.8" ry="2.6" fill={look.skin} />
        {look.beard && (
          <path d="M21.5 34c1 9 5.5 11.5 10.5 11.5S41.5 43 42.5 34c-2 5-6 6.5-10.5 6.5S23.5 39 21.5 34z" fill={look.hair} opacity="0.85" />
        )}
        <ellipse cx="27.6" cy="31.5" rx="1.3" ry="1.5" fill="#1f1611" />
        <ellipse cx="36.4" cy="31.5" rx="1.3" ry="1.5" fill="#1f1611" />
        <path d="M25.2 28.2q2.4-1.4 4.6-.2M34.2 28q2.2-1.2 4.6.2" stroke={look.hair} strokeWidth="1.1" fill="none" strokeLinecap="round" />
        <path d="M27.8 37.6q4.2 3.4 8.4 0" stroke="#9a4a3c" strokeWidth="1.3" fill="#fff" strokeLinecap="round" />

        {/* hair on top */}
        {look.hairStyle === "short" && (
          <path d="M20.5 30c-1.5-9 3.5-15 11.5-15s13 6 11.5 15c-1-4-3-7-6-8-5 2-11 2-14.5 0-1.5 1.5-2.2 4.5-2.5 8z" fill={look.hair} />
        )}
        {(look.hairStyle === "long" || look.hairStyle === "bun") && (
          <path d="M20.5 30c-.5-9.5 4.5-14.5 11.5-14.5S44 20.5 43.5 30c-3-6-8-8.5-14-9-3.5 2-6.5 4.5-9 9z" fill={look.hair} />
        )}
        {look.hairStyle === "wavy" && (
          <path d="M20 31c-.5-9.5 4.5-15 12-15s12.5 5.5 12 15c-2.5-5.5-6-8.5-12.5-9.5-4 2-8.5 4.5-11.5 9.5z" fill={look.hair} />
        )}
      </g>
    </svg>
  );
}

type AvatarStackProps = {
  names: AvatarName[];
  size?: string;
  ring?: string;
};

export function AvatarStack({ names, size = "h-6 w-6", ring = "ring-2 ring-night-800" }: AvatarStackProps) {
  return (
    <span className="flex -space-x-1.5">
      {names.map((n) => (
        <span key={n} className={`rounded-full ${ring}`}>
          <Avatar name={n} className={size} />
        </span>
      ))}
    </span>
  );
}
