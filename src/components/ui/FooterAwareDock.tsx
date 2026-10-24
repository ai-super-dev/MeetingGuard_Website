"use client";

import { useEffect, useState, type ReactNode } from "react";

/** A fixed corner card that steps aside while the footer is on screen, so it never covers footer links. */
export function FooterAwareDock({ className, children }: { className: string; children: ReactNode }) {
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
      className={`${className} transition duration-500 ${hidden ? "pointer-events-none translate-y-4 opacity-0" : ""}`}
    >
      {children}
    </aside>
  );
}
