"use client";

import { useT } from "@/lib/language";

export function SkipLink() {
  const t = useT();
  return (
    <a
      href="#main"
      className="sr-only z-[60] rounded-md bg-accent px-4 py-2 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
    >
      {t.skip}
    </a>
  );
}
