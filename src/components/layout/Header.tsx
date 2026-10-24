"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { AppleIcon } from "@/components/icons/brand";
import { navLinks, siteConfig } from "@/lib/site";

/** Floating, rounded navigation bar that firms up once the page scrolls. */
export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 16));

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 sm:top-4 sm:px-6">
      <div
        className={`mx-auto max-w-[1200px] rounded-2xl border transition-colors duration-300 ${
          scrolled || open
            ? "border-white/[0.09] bg-[#0c0c0f]/85 backdrop-blur-xl"
            : "border-white/[0.07] bg-[#0c0c0f]/60 backdrop-blur-md"
        }`}
      >
        <div className="flex h-16 items-center px-4 sm:px-6">
          <Link href="/" aria-label="MeetingGuard home" className="shrink-0">
            <Logo />
          </Link>

          <nav aria-label="Primary" className="mx-auto hidden md:block">
            <ul className="flex items-center gap-8">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[0.88rem] text-white/65 transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2 md:ml-0">
            <a
              href={siteConfig.appStoreUrl}
              className="hidden h-9 items-center gap-2 rounded-lg bg-[#f4f4f5] px-3.5 text-[0.85rem] font-medium text-[#0b0b0e] transition hover:bg-white sm:inline-flex"
            >
              <AppleIcon className="h-4 w-4" />
              Download
            </a>
            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-white md:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.nav
              id="mobile-nav"
              aria-label="Mobile"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden md:hidden"
            >
              <ul className="flex flex-col border-t border-white/[0.07] px-3 py-2">
                {navLinks.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-3 py-3 text-white/75 hover:bg-white/5 hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
                <li className="pt-1 pb-2 sm:hidden">
                  <a
                    href={siteConfig.appStoreUrl}
                    className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#f4f4f5] font-medium text-[#0b0b0e]"
                  >
                    <AppleIcon className="h-4 w-4" />
                    Download
                  </a>
                </li>
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
