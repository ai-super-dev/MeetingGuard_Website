"use client";

import { StoreBadges } from "@/components/ui/StoreBadges";
import { usePlatform } from "@/lib/platform";

/**
 * On a phone: one big badge for that phone's store, the other store small
 * underneath. On a computer: both badges, same size.
 */
export function DownloadChoice({ otherLabel }: { otherLabel: string }) {
  const platform = usePlatform();
  if (platform === "other") return <StoreBadges className="justify-center" height={56} />;
  return (
    <div className="flex flex-col items-center gap-5">
      <StoreBadges single height={68} className="justify-center" />
      <div className="flex flex-col items-center gap-2">
        <span className="text-[0.78rem] text-white/45">{otherLabel}</span>
        <StoreBadges only={platform === "ios" ? "googlePlay" : "appStore"} height={36} />
      </div>
    </div>
  );
}
