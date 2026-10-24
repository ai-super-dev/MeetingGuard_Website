import Image from "next/image";
import { icons } from "@/lib/assets";

/** The MeetingGuard shield (app_icon.png) at any size. */
export function AppMark({ className = "h-6 w-6", sizes = "48px" }: { className?: string; sizes?: string }) {
  return <Image src={icons.app} alt="" sizes={sizes} className={`object-contain ${className}`} />;
}

/** Large app icon with a soft halo — the focal point of the closing section. */
export function AppIcon({ className = "h-20 w-20" }: { className?: string }) {
  return (
    <span className={`relative inline-grid place-items-center ${className}`}>
      <span
        aria-hidden
        className="absolute -inset-[70%] rounded-full bg-[radial-gradient(closest-side,rgba(60,130,255,0.4),rgba(60,110,255,0.1)_55%,transparent)] [animation:glow-pulse_4s_ease-in-out_infinite]"
      />
      <AppMark className="relative h-full w-full" sizes="200px" />
    </span>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <AppMark className="h-8 w-8" sizes="64px" />
      <span className="text-[1.02rem] font-semibold tracking-[-0.01em] text-white">MeetingGuard</span>
    </span>
  );
}
