"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics";

/** Sends the "scroll_75" analytics event once per page view, when the visitor reaches 75% of the page. */
export function ScrollDepth() {
  const pathname = usePathname();

  useEffect(() => {
    let sent = false;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (sent || max <= 0 || window.scrollY / max < 0.75) return;
      sent = true;
      track("scroll_75", { page: pathname });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return null;
}
