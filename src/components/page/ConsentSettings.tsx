"use client";

import { useSyncExternalStore } from "react";
import { CONSENT_EVENT, readConsent, saveConsent } from "@/lib/analytics";

const subscribe = (cb: () => void) => {
  window.addEventListener(CONSENT_EVENT, cb);
  return () => window.removeEventListener(CONSENT_EVENT, cb);
};

/** Lets the visitor change their analytics choice on the cookies page. */
export function ConsentSettings({ labels }: { labels: { current: string; granted: string; denied: string; unset: string; allow: string; refuse: string } }) {
  const value = useSyncExternalStore(subscribe, () => readConsent() ?? "unset", () => "unset");
  return (
    <div className="surface mx-auto mt-6 flex max-w-3xl flex-col gap-4 rounded-2xl p-6 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-[0.92rem] text-white/75">
        {labels.current}: <strong className="text-white">{value === "granted" ? labels.granted : value === "denied" ? labels.denied : labels.unset}</strong>
      </p>
      <div className="flex gap-2">
        <button type="button" onClick={() => saveConsent("granted")} className="h-9 rounded-lg bg-[#f4f4f5] px-4 text-[0.82rem] font-medium text-[#0b0b0e] hover:bg-white">
          {labels.allow}
        </button>
        <button type="button" onClick={() => saveConsent("denied")} className="h-9 rounded-lg border border-white/12 px-4 text-[0.82rem] font-medium text-white/80 hover:border-white/25">
          {labels.refuse}
        </button>
      </div>
    </div>
  );
}
