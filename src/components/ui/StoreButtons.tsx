import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { icons } from "@/lib/assets";
import { siteConfig } from "@/lib/site";

const stores = [
  {
    href: siteConfig.appStoreUrl,
    label: "Download MeetingGuard on the App Store",
    icon: icons.appStore,
    small: "Download on the",
    big: "App Store",
    width: "lg:w-[calc(var(--u)*17.5)]",
    edge: "linear-gradient(90deg, #a24dff 0%, #6a6dff 50%, #3a8dff 100%)",
    halo: "rgb(140 80 255 / 0.6)",
  },
  {
    href: siteConfig.playStoreUrl,
    label: "Get MeetingGuard on Google Play",
    icon: icons.googlePlay,
    small: "GET IT ON",
    big: "Google Play",
    width: "lg:w-[calc(var(--u)*18.4)]",
    edge: "linear-gradient(90deg, #3a8dff 0%, #38c6ff 100%)",
    halo: "rgb(56 150 255 / 0.6)",
  },
];

/**
 * Black store badges with a neon gradient edge and chevron — sized in hero
 * units (`--u`) on desktop so they scale with the "First page" composition.
 */
export function StoreButtons({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 lg:gap-[calc(var(--u)*1.15)] ${className}`}>
      {stores.map((s) => (
        <a
          key={s.big}
          href={s.href}
          aria-label={s.label}
          className={`hero-store-btn group flex h-16 w-[15.5rem] items-center gap-3 rounded-xl px-5 text-white transition duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-azure lg:h-[calc(var(--u)*5.2)] lg:rounded-[calc(var(--u)*0.9)] lg:gap-[calc(var(--u)*0.7)] lg:pr-[calc(var(--u)*1.6)] lg:pl-[calc(var(--u)*1.75)] ${s.width}`}
          style={{ ["--edge" as string]: s.edge, ["--halo" as string]: s.halo }}
        >
          <Image
            src={s.icon}
            alt=""
            sizes="96px"
            className="h-11 w-11 flex-none object-contain lg:-ml-[calc(var(--u)*0.35)] lg:h-[calc(var(--u)*3.6)] lg:w-[calc(var(--u)*3.6)]"
          />
          <span className="flex flex-1 flex-col leading-none whitespace-nowrap">
            <span className="text-[0.8rem] font-medium tracking-wide text-slate-100 lg:text-[max(11px,calc(var(--u)*1.02))]">
              {s.small}
            </span>
            <span className="mt-1 text-[1.45rem] font-semibold tracking-[-0.02em] lg:mt-[calc(var(--u)*0.25)] lg:text-[max(18px,calc(var(--u)*1.75))]">
              {s.big}
            </span>
          </span>
          <ChevronRight
            aria-hidden
            className="h-5 w-5 flex-none text-slate-300 transition-transform duration-300 group-hover:translate-x-1 lg:h-[calc(var(--u)*1.5)] lg:w-[calc(var(--u)*1.5)]"
            strokeWidth={2}
          />
        </a>
      ))}
    </div>
  );
}
