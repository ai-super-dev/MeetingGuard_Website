"use client";

import { useEffect } from "react";
import { Reveal } from "@/components/motion";
import { AppIcon } from "@/components/ui/Logo";
import { StoreBadges } from "@/components/ui/StoreBadges";
import { DOWNLOAD_ID, takePendingDownload } from "@/lib/download";
import { useT } from "@/lib/language";

export function FinalCta() {
  const t = useT();

  // opened from the header's Download button on another page: go straight to the badges
  useEffect(() => {
    if (!takePendingDownload()) return;
    // after the page has moved to the top on arrival
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => document.getElementById(DOWNLOAD_ID)?.scrollIntoView({ behavior: "instant" })),
    );
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <section id={DOWNLOAD_ID}aria-labelledby="cta-title" className="relative overflow-x-clip pt-14 pb-28 sm:pt-[4.5rem] sm:pb-36">
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 h-[480px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(190,20,40,0.28),transparent)] blur-2xl"
      />
      <Reveal className="container-page relative flex flex-col items-center text-center">
        <AppIcon className="h-[140px] w-[140px] sm:h-[184px] sm:w-[184px]" />
        <h2
          id="cta-title"
          className="mt-12 text-[2rem] leading-[1.1] text-balance font-semibold tracking-[-0.03em] sm:text-[3rem]"
        >
          {t.cta.line1}
          <br />
          <span className="text-white/50">{t.cta.line2}</span>
        </h2>
        <p className="mt-4 font-medium text-white/60">{t.cta.sentence}</p>
        <StoreBadges className="mt-8 justify-center" />
      </Reveal>
    </section>
  );
}
