"use client";

import { useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { CONSENT_EVENT, loadAnalytics, readConsent, saveConsent } from "@/lib/analytics";
import { useHref, useT } from "@/lib/language";
import { siteConfig } from "@/lib/site";

const subscribe = (cb: () => void) => {
  window.addEventListener(CONSENT_EVENT, cb);
  return () => window.removeEventListener(CONSENT_EVENT, cb);
};

/**
 * Asks once whether analytics may run. Shown only when analytics is configured
 * (siteConfig.gaMeasurementId), since nothing is collected otherwise.
 */
export function ConsentBanner() {
  const t = useT();
  const href = useHref();
  // "unset" until the visitor answers; "n/a" during prerender
  const consent = useSyncExternalStore(subscribe, () => readConsent() ?? "unset", () => "n/a");

  useEffect(() => {
    if (consent === "granted") loadAnalytics();
  }, [consent]);

  const open = Boolean(siteConfig.gaMeasurementId) && consent === "unset";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-live="polite"
          aria-label={t.consent.more}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          className="fixed inset-x-3 bottom-3 z-[55] rounded-2xl border border-white/10 bg-[#0d0d10]/95 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-md sm:inset-x-auto sm:bottom-5 sm:left-5 sm:max-w-[360px]"
        >
          <p className="text-[0.86rem] leading-relaxed text-white/75">
            {t.consent.text}{" "}
            <Link href={href("/privacy-policy")} className="text-white underline underline-offset-2">
              {t.consent.more}
            </Link>
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => saveConsent("granted")}
              className="h-9 rounded-lg bg-[#f4f4f5] px-4 text-[0.82rem] font-medium text-[#0b0b0e] hover:bg-white"
            >
              {t.consent.accept}
            </button>
            <button
              type="button"
              onClick={() => saveConsent("denied")}
              className="h-9 rounded-lg border border-white/12 px-4 text-[0.82rem] font-medium text-white/80 hover:border-white/25"
            >
              {t.consent.decline}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
