"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { useT } from "@/lib/language";

/**
 * Light / dark switch. The site is dark only for now, so pressing it shows a
 * short "coming soon" note instead of changing the theme.
 */
export function ThemeToggle({ className = "", withLabel = false }: { className?: string; withLabel?: boolean }) {
  const t = useT();
  const [note, setNote] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const onClick = () => {
    setNote(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setNote(false), 2200);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={onClick}
        aria-label={t.header.theme.toLight}
        title={t.header.theme.toLight}
        className={`group relative flex h-8 items-center gap-2 rounded-md text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white ${
          withLabel ? "px-3" : "w-8 justify-center"
        }`}
      >
        <span className="relative grid h-4 w-4 place-items-center">
          <Moon className="h-4 w-4 transition duration-300 group-hover:scale-75 group-hover:opacity-0" aria-hidden />
          <Sun className="absolute h-4 w-4 scale-75 opacity-0 transition duration-300 group-hover:scale-100 group-hover:opacity-100" aria-hidden />
        </span>
        {withLabel && <span className="text-[0.85rem]">{t.header.theme.toLight}</span>}
      </button>
      <AnimatePresence>
        {note && (
          <motion.span
            role="status"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute top-full right-0 z-10 mt-2 rounded-lg border border-white/10 bg-[#141418] px-3 py-1.5 text-[0.75rem] whitespace-nowrap text-white/80 shadow-[0_12px_30px_rgba(0,0,0,0.5)]"
          >
            {t.header.theme.toLight}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
