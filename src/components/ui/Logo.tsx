import { useId } from "react";

/** MeetingGuard mark: a bell guarded by a shield, in the crimson accent. */
export function ShieldMark({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden focusable={false}>
      <defs>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff6b78" />
          <stop offset="1" stopColor="#d81b34" />
        </linearGradient>
      </defs>
      <path
        d="M16 2.2 28 6.6V15c0 7.4-5.1 12.5-12 15-6.9-2.5-12-7.6-12-15V6.6Z"
        fill={`url(#${id}-fill)`}
        stroke="#ffd0d5"
        strokeOpacity="0.55"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M16 8.6c-3 0-5.1 2.3-5.1 5.3v3.4l-1.7 2.3h13.6l-1.7-2.3v-3.4c0-3-2.1-5.3-5.1-5.3Z" fill="#fff" />
      <circle cx="16" cy="21.7" r="1.6" fill="#fff" />
      <path d="M16 6.6v2" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/**
 * App icon: the mark on a dark squircle. `glow` adds the crimson halo used
 * where the icon is the focal point (hero, final call to action).
 */
export function AppIcon({ className = "h-20 w-20", glow = false }: { className?: string; glow?: boolean }) {
  return (
    <span className={`relative inline-grid place-items-center ${className}`}>
      {glow && (
        <span
          aria-hidden
          className="absolute -inset-[60%] rounded-full bg-[radial-gradient(closest-side,rgba(255,60,80,0.55),rgba(255,40,60,0.15)_55%,transparent)] [animation:glow-pulse_4s_ease-in-out_infinite]"
        />
      )}
      <span className="relative grid h-full w-full place-items-center rounded-[24%] border border-white/10 bg-[linear-gradient(160deg,#2a0d12_0%,#14070a_55%,#0b0507_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_40px_rgba(0,0,0,0.6)]">
        <ShieldMark className="h-[58%] w-[58%] drop-shadow-[0_0_14px_rgba(255,70,90,0.85)]" />
      </span>
    </span>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <ShieldMark className="h-6 w-6 drop-shadow-[0_0_8px_rgba(255,70,90,0.6)]" />
      <span className="text-[1.02rem] font-semibold tracking-[-0.01em] text-white">MeetingGuard</span>
    </span>
  );
}
