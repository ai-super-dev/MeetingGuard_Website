"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";

export type FaqItem = { q: string; a: string };

/** FAQ accordion: one answer open at a time, keyboard and screen-reader friendly. */
export function FaqAccordion({ items, defaultOpen = -1 }: { items: readonly FaqItem[]; defaultOpen?: number }) {
  const [open, setOpen] = useState(defaultOpen);
  const base = useId();
  return (
    <div className="divide-y divide-white/[0.07] rounded-2xl border border-white/[0.07] bg-[linear-gradient(180deg,var(--color-card-from),var(--color-card-to))]">
      {items.map((item, i) => {
        const isOpen = open === i;
        const id = `${base}-${i}`;
        return (
          <div key={item.q}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`${id}-panel`}
                id={`${id}-button`}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full items-center justify-between gap-6 px-5 py-5 text-left text-[0.98rem] font-medium text-white transition-colors hover:text-white sm:px-7"
              >
                {item.q}
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/12 text-white/70 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`${id}-panel`}
                  role="region"
                  aria-labelledby={`${id}-button`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 text-[0.92rem] leading-relaxed text-white/60 sm:px-7">{item.a}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
