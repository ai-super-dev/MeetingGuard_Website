import type { ReactNode } from "react";
import { SCREEN_H, SCREEN_W } from "./geometry";

export function StatusBar({ className = "", time = "9:41" }: { className?: string; time?: string }) {
  return (
    <div className={`flex items-center justify-between text-[15px] font-semibold text-white ${className}`}>
      <span>{time}</span>
      <svg viewBox="0 0 54 12" className="h-[11px] w-auto" aria-hidden>
        <g fill="#fff">
          <rect x="0" y="8" width="2.6" height="4" rx="0.6" />
          <rect x="4" y="6" width="2.6" height="6" rx="0.6" />
          <rect x="8" y="3.5" width="2.6" height="8.5" rx="0.6" />
          <rect x="12" y="1" width="2.6" height="11" rx="0.6" />
          <path d="M24 3.2a8.6 8.6 0 0 1 6.2 2.5l-1.3 1.3a6.8 6.8 0 0 0-9.8 0l-1.3-1.3A8.6 8.6 0 0 1 24 3.2zm0 3.6a5 5 0 0 1 3.6 1.5L24 12l-3.6-3.7A5 5 0 0 1 24 6.8z" />
          <rect x="35" y="2" width="16" height="9" rx="2.4" fill="none" stroke="#fff" strokeOpacity="0.6" />
          <rect x="36.6" y="3.6" width="12.4" height="5.8" rx="1.3" />
          <rect x="52" y="5" width="1.6" height="3.4" rx="0.8" fillOpacity="0.6" />
        </g>
      </svg>
    </div>
  );
}

/** A SCREEN_W×SCREEN_H screen surface with the status bar and home indicator. */
export function Screen({ children, className = "bg-[#0a0a0d]" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[48px] text-left text-white ${className}`}
      style={{ width: SCREEN_W, height: SCREEN_H }}
    >
      <StatusBar className="relative z-10 px-[34px] pt-[20px]" />
      {children}
      <span className="absolute bottom-[12px] left-1/2 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-white/85" />
    </div>
  );
}

/** Flat phone shell (no frame image) holding a screen at a given width. */
export function FlatPhone({ width = 300, children }: { width?: number; children: ReactNode }) {
  const scale = width / SCREEN_W;
  return (
    <div
      className="relative shrink-0 rounded-[42px] border border-white/10 bg-[#0b0b0e] p-[6px] shadow-[0_40px_120px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.06)]"
      style={{ width: width + 14, height: SCREEN_H * scale + 14 }}
    >
      <div className="origin-top-left" style={{ transform: `scale(${scale})` }}>
        {children}
      </div>
    </div>
  );
}
