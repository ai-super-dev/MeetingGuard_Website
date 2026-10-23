"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { navLinks, siteConfig } from "@/lib/site";

/*
 * Desktop sizes are in hero units (--u, 1% of the 1672px reference) so the
 * bar lines up with the "First page" composition: logo at 7.3u, nav from
 * 31.5u, 12.4u gradient pill on the right.
 */
export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500 ${
        scrolled || open
          ? "border-b border-white/[0.06] bg-[#020818]/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1777px] items-center px-5 sm:px-8 lg:h-[calc(var(--u)*6.25)] lg:px-[calc(var(--u)*7.3)]">
        <Link
          href="/"
          aria-label="MeetingGuard home"
          className="hero-rise shrink-0"
          style={{ animationDelay: "50ms" }}
        >
          {/* the shield PNG has transparent padding, hence the larger box + pull-in */}
          <Logo
            className="gap-1.5 lg:-ml-[calc(var(--u)*0.6)] lg:gap-[calc(var(--u)*0.28)]"
            markClassName="h-11 w-11 lg:h-[calc(var(--u)*4.7)] lg:w-[calc(var(--u)*4.7)]"
            textClassName="text-[1.35rem] lg:text-[max(20px,calc(var(--u)*2.17))]"
          />
        </Link>

        <nav aria-label="Primary" className="hidden lg:ml-[calc(var(--u)*5.6)] lg:block">
          <ul className="flex items-center gap-[calc(var(--u)*3.1)]">
            {navLinks.map((l, i) => (
              <li key={l.href} className="hero-rise" style={{ animationDelay: `${120 + i * 60}ms` }}>
                <Link
                  href={l.href}
                  className="relative text-[max(14px,calc(var(--u)*1.14))] font-medium text-[#dde3ee] transition-colors after:absolute after:-bottom-[calc(var(--u)*0.45)] after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-[linear-gradient(90deg,#347bfb,#a951fd)] after:transition-transform after:duration-300 hover:text-white hover:after:scale-x-100"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <a
            href={siteConfig.appStoreUrl}
            className="hidden h-11 items-center rounded-full bg-[linear-gradient(90deg,#347bfb_0%,#6d66fc_55%,#a951fd_100%)] px-6 text-[0.95rem] font-semibold text-white transition-[filter,transform] duration-300 [animation:hero-rise_1s_cubic-bezier(0.22,1,0.36,1)_both_450ms,hero-cta-glow_3.2s_ease-in-out_1.5s_infinite] hover:-translate-y-px hover:brightness-110 sm:inline-flex lg:h-[calc(var(--u)*3.3)] lg:w-[calc(var(--u)*12.4)] lg:justify-center lg:px-0 lg:text-[max(14px,calc(var(--u)*1.14))]"
          >
            Download App
          </a>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-lg border border-white/15 text-white lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
            className="overflow-hidden border-t border-white/10 lg:hidden"
          >
            <ul className="flex flex-col px-5 py-3 sm:px-8">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-2 py-3 text-slate-200 hover:bg-white/5 hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2 sm:hidden">
                <a
                  href={siteConfig.appStoreUrl}
                  className="block rounded-full bg-[linear-gradient(90deg,#347bfb,#a951fd)] py-3 text-center font-semibold"
                >
                  Download App
                </a>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
