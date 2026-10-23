import type { ReactNode } from "react";
import { toneStyles, type Tone } from "@/components/ui/primitives";

type PhoneFrameProps = {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  screenClassName?: string;
  /** Hide the status bar for very small renders. */
  statusBar?: boolean;
};

function StatusIcons() {
  return (
    <svg viewBox="0 0 54 12" className="h-[0.6rem] w-auto" aria-hidden>
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
  );
}

/** Metallic, neon-lit smartphone shell that renders any screen inside it. */
export function PhoneFrame({
  children,
  tone = "blue",
  className = "h-[540px] w-[268px]",
  screenClassName = "bg-[linear-gradient(180deg,#0d1d5c_0%,#0a1546_45%,#070f36_100%)]",
  statusBar = true,
}: PhoneFrameProps) {
  return (
    <div
      className={`relative rounded-[2.9rem] p-[3px] ${className}`}
      style={{
        background: "linear-gradient(150deg,#dbe6ff 0%,#7f8de8 18%,#2a2f78 45%,#151a4d 70%,#9fb0ff 100%)",
        boxShadow: toneStyles[tone].phoneGlow,
      }}
    >
      {/* side buttons */}
      <span className="absolute top-[18%] -left-[3px] h-8 w-[3px] rounded-l bg-[#8d9be8]" />
      <span className="absolute top-[27%] -left-[3px] h-12 w-[3px] rounded-l bg-[#8d9be8]" />
      <span className="absolute top-[24%] -right-[3px] h-16 w-[3px] rounded-r bg-[#8d9be8]" />

      <div className="relative h-full w-full rounded-[2.75rem] bg-[#02030c] p-[7px]">
        <div className={`relative h-full w-full overflow-hidden rounded-[2.3rem] ${screenClassName}`}>
          {/* notch */}
          <div className="absolute top-0 left-1/2 z-20 h-[1.45rem] w-[42%] -translate-x-1/2 rounded-b-[1rem] bg-[#02030c]">
            <span className="absolute top-[0.45rem] right-[22%] h-[0.45rem] w-[0.45rem] rounded-full bg-[#121a3a] ring-1 ring-[#1f2b5c]" />
          </div>
          {statusBar && (
            <div className="relative z-10 flex items-center justify-between px-[1.35rem] pt-[0.55rem] text-[0.68rem] font-semibold text-white">
              <span>9:41</span>
              <StatusIcons />
            </div>
          )}
          <div className="relative z-0 h-full">{children}</div>
          {/* glass reflection */}
          <div className="pointer-events-none absolute inset-0 z-30 bg-[linear-gradient(115deg,rgba(255,255,255,0.13)_0%,rgba(255,255,255,0.03)_28%,transparent_45%)]" />
        </div>
      </div>
    </div>
  );
}
