import { useId } from "react";
import Image from "next/image";
import { icons } from "@/lib/assets";

type ShieldMarkProps = { className?: string };

/** MeetingGuard shield mark — a guarded bell inside a neon shield. */
export function ShieldMark({ className }: ShieldMarkProps) {
  const id = useId();
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden focusable={false}>
      <defs>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3d8bff" />
          <stop offset="1" stopColor="#0b36b8" />
        </linearGradient>
        <linearGradient id={`${id}-edge`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#bfe0ff" />
          <stop offset="1" stopColor="#4f8dff" />
        </linearGradient>
      </defs>
      <path
        d="M16 2.2 28 6.6V15c0 7.4-5.1 12.5-12 15-6.9-2.5-12-7.6-12-15V6.6Z"
        fill={`url(#${id}-fill)`}
        stroke={`url(#${id}-edge)`}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M16 8.6c-3 0-5.1 2.3-5.1 5.3v3.4l-1.7 2.3h13.6l-1.7-2.3v-3.4c0-3-2.1-5.3-5.1-5.3Z"
        fill="#e8f3ff"
      />
      <circle cx="16" cy="21.7" r="1.6" fill="#e8f3ff" />
      <path d="M16 6.6v2" stroke="#e8f3ff" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

type LogoProps = {
  className?: string;
  /** Classes for the shield image and the wordmark (sizes differ per placement). */
  markClassName?: string;
  textClassName?: string;
};

export function Logo({
  className = "gap-2.5",
  markClassName = "h-9 w-9",
  textClassName = "text-xl",
}: LogoProps) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      <Image
        src={icons.app}
        alt=""
        sizes="72px"
        className={`object-contain drop-shadow-[0_0_10px_rgba(59,130,246,0.6)] ${markClassName}`}
      />
      <span className={`font-sans font-bold tracking-[-0.03em] text-white ${textClassName}`}>MeetingGuard</span>
    </span>
  );
}
