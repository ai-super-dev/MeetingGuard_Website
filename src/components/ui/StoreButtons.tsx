import Image from "next/image";
import { icons } from "@/lib/assets";
import { siteConfig } from "@/lib/site";

const stores = [
  {
    href: siteConfig.appStoreUrl,
    label: "Download MeetingGuard on the App Store",
    icon: icons.appStore,
    small: "Download on the",
    big: "App Store",
  },
  {
    href: siteConfig.playStoreUrl,
    label: "Get MeetingGuard on Google Play",
    icon: icons.googlePlay,
    small: "GET IT ON",
    big: "Google Play",
  },
];

/**
 * Classic store badges: black fill, thin light border, white lettering —
 * sized in hero units (`--u`) on desktop so they scale with the hero.
 */
export function StoreButtons({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 lg:gap-[calc(var(--u)*1.15)] ${className}`}>
      {stores.map((s) => (
        <a
          key={s.big}
          href={s.href}
          aria-label={s.label}
          className="flex h-[3.75rem] items-center gap-2.5 rounded-xl border-2 border-[#a6a6a6] bg-black pr-5 pl-3.5 text-white transition duration-300 hover:-translate-y-0.5 hover:border-white hover:shadow-[0_6px_24px_rgba(0,0,0,0.5)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-azure lg:h-[calc(var(--u)*4.7)] lg:gap-[calc(var(--u)*0.75)] lg:rounded-[calc(var(--u)*0.85)] lg:pr-[calc(var(--u)*1.7)] lg:pl-[calc(var(--u)*1.05)]"
        >
          {/* the icon PNGs carry transparent padding, so draw them a bit larger */}
          <Image
            src={s.icon}
            alt=""
            sizes="96px"
            className="h-10 w-10 flex-none object-contain lg:h-[calc(var(--u)*3.3)] lg:w-[calc(var(--u)*3.3)]"
          />
          <span className="flex flex-col leading-none whitespace-nowrap">
            <span className="text-[0.78rem] font-medium tracking-wide lg:text-[max(11px,calc(var(--u)*1.0))]">
              {s.small}
            </span>
            <span className="mt-1 text-[1.6rem] font-semibold tracking-[-0.02em] lg:mt-[calc(var(--u)*0.2)] lg:text-[max(19px,calc(var(--u)*2.05))]">
              {s.big}
            </span>
          </span>
        </a>
      ))}
    </div>
  );
}
