"use client";

import { track } from "@/lib/analytics";
import { useLang, useT } from "@/lib/language";
import { usePlatform } from "@/lib/platform";
import { siteConfig } from "@/lib/site";

/*
 * Official store badges in each language, used unmodified as Apple and Google
 * require (App Store artwork from Apple Marketing Tools, Google Play from
 * Google's badge generator).
 */
const BADGE = {
  appStore: { en: "/badges/app-store-en.svg", es: "/badges/app-store-es.svg", ratio: 119.664 / 40 },
  googlePlay: { en: "/badges/google-play-en.png", es: "/badges/google-play-es.png", ratio: { en: 564 / 168, es: 646 / 192 } },
};

export type Store = "appStore" | "googlePlay";

function Badge({ store, height }: { store: Store; height: number }) {
  const t = useT();
  const lang = useLang();
  const src = BADGE[store][lang];
  const ratio = store === "appStore" ? BADGE.appStore.ratio : BADGE.googlePlay.ratio[lang];
  const url = store === "appStore" ? siteConfig.appStoreUrl : siteConfig.playStoreUrl;
  return (
    <a
      href={url || "#"}
      onClick={(e) => {
        // no store link yet: stay put instead of jumping to the top of the page
        if (!url) return e.preventDefault();
        track("badge_click", { store: store === "appStore" ? "app_store" : "google_play" });
      }}
      className="inline-block rounded-[10px] transition duration-300 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- badge artwork is served as-is */}
      <img src={src} alt={store === "appStore" ? t.badges.appStore : t.badges.googlePlay} width={Math.round(height * ratio)} height={height} className="block" style={{ height }} />
    </a>
  );
}

/**
 * The store badge pair. On a phone the visitor's own store comes first; with
 * `single`, only that store's badge is shown (both on desktop).
 */
export function StoreBadges({
  className = "",
  height = 48,
  single = false,
  only,
}: {
  className?: string;
  height?: number;
  single?: boolean;
  /** Show just this store's badge. */
  only?: Store;
}) {
  const platform = usePlatform();
  const order: Store[] = platform === "android" ? ["googlePlay", "appStore"] : ["appStore", "googlePlay"];
  const shown = only ? [only] : single && platform !== "other" ? order.slice(0, 1) : order;
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {shown.map((s) => (
        <Badge key={s} store={s} height={height} />
      ))}
    </div>
  );
}
