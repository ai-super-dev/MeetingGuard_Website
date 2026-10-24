import { AppleIcon, GooglePlayIcon } from "@/components/icons/brand";
import { siteConfig } from "@/lib/site";

const base =
  "inline-flex h-12 items-center gap-2.5 rounded-xl px-4 transition duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

/** Primary white App Store button + secondary dark Google Play button. */
export function StoreButtons({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <a
        href={siteConfig.appStoreUrl}
        aria-label="Download MeetingGuard on the App Store"
        className={`${base} bg-[#f4f4f5] text-[#0b0b0e] shadow-[0_8px_30px_rgba(255,255,255,0.08)] hover:bg-white`}
      >
        <AppleIcon className="h-5 w-5" />
        <span className="flex flex-col text-left leading-none">
          <span className="text-[0.82rem] font-medium">Get it today</span>
          <span className="mt-0.5 text-[0.72rem] text-[#3f3f46]">App Store</span>
        </span>
      </a>
      <a
        href={siteConfig.playStoreUrl}
        aria-label="Get MeetingGuard on Google Play"
        className={`${base} border border-white/12 bg-ink-850 text-white hover:border-white/25 hover:bg-ink-800`}
      >
        <GooglePlayIcon className="h-5 w-5" />
        <span className="flex flex-col text-left leading-none">
          <span className="text-[0.82rem] font-medium">Get it on</span>
          <span className="mt-0.5 text-[0.72rem] text-white/55">Google Play</span>
        </span>
      </a>
    </div>
  );
}
