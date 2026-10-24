"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useT } from "@/lib/language";

/** The fixed QR corner card: steps aside while the footer is on screen, so it never covers footer links. */
export function FooterAwareDock({ className, children }: { className: string; children: ReactNode }) {
  const t = useT();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const io = new IntersectionObserver(([entry]) => setHidden(entry.isIntersecting));
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  return (
    <aside
      aria-hidden={hidden || undefined}
      aria-label={t.qr.aria}
      className={`${className} transition duration-500 ${hidden ? "pointer-events-none translate-y-4 opacity-0" : ""}`}
    >
      {children}
      <span className="text-[0.75rem] font-semibold text-white/90">{t.qr.scan}</span>
    </aside>
  );
}
