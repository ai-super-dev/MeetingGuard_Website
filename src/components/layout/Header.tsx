"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Download, Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useHref, useT } from "@/lib/language";
import { splitPath } from "@/lib/routes";
import { LanguageSwitch } from "./LanguageSwitch";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { key: "privacy", path: "/privacy-policy" },
  { key: "terms", path: "/terms-of-service" },
] as const;

/** Floating, rounded navigation bar that firms up once the page scrolls. */
export function Header() {
  const t = useT();
  const href = useHref();
  const pathname = usePathname();
  const { path } = splitPath(pathname);
  const [open, setOpen] = useState(false); // mobile menu
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 16));

  const closeAll = () => setOpen(false);
  // the store badges at the end of the home page
  const download = `${href("/")}#download`;
  const linkClass = (active: boolean) =>
    `rounded-lg px-3 py-2 text-[0.88rem] transition-colors ${active ? "text-white" : "text-white/65 hover:text-white"}`;

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 sm:top-4 sm:px-6">
      <div
        className={`mx-auto max-w-[1200px] rounded-2xl border transition-colors duration-300 ${
          scrolled || open
            ? "border-white/[0.09] bg-[#0c0c0f]/90 backdrop-blur-xl"
            : "border-white/[0.07] bg-[#0c0c0f]/60 backdrop-blur-md"
        }`}
      >
        <div className="flex h-16 items-center px-4 sm:px-6">
          <Link href={href("/")} aria-label={t.header.home} className="shrink-0" onClick={closeAll}>
            <Logo />
          </Link>

          <nav aria-label={t.header.primary} className="ml-auto hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => (
                <li key={item.key}>
                  <Link href={href(item.path)} className={linkClass(path === item.path)} aria-current={path === item.path ? "page" : undefined}>
                    {t.header.nav[item.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-1.5 lg:ml-6">
            <LanguageSwitch />
            <span aria-hidden className="mx-1 hidden h-5 w-px bg-white/10 lg:block" />
            <ThemeToggle className="hidden lg:block" />
            <Link
              href={download}
              className="ml-2 hidden h-9 items-center gap-2 rounded-lg bg-[#f4f4f5] px-3.5 text-[0.85rem] font-medium text-[#0b0b0e] transition hover:bg-white sm:inline-flex"
            >
              <Download className="h-4 w-4" aria-hidden />
              {t.header.download}
            </Link>
            <button
              type="button"
              className="ml-1 grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-white lg:hidden"
              aria-label={open ? t.header.closeMenu : t.header.openMenu}
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
              aria-label={t.header.primary}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="max-h-[calc(100vh-6rem)] overflow-y-auto lg:hidden"
            >
              <ul className="flex flex-col border-t border-white/[0.07] px-3 py-2">
                {NAV.map((item) => (
                  <li key={item.key}>
                    <Link
                      href={href(item.path)}
                      onClick={closeAll}
                      className="block rounded-lg px-3 py-3 text-white/80 hover:bg-white/5 hover:text-white"
                    >
                      {t.header.nav[item.key]}
                    </Link>
                  </li>
                ))}
                <li className="mt-1 flex items-center justify-between gap-3 border-t border-white/[0.07] px-1 pt-3 pb-2">
                  <ThemeToggle withLabel />
                  <Link
                    href={download}
                    onClick={closeAll}
                    className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#f4f4f5] px-4 text-[0.88rem] font-medium text-[#0b0b0e] sm:hidden"
                  >
                    <Download className="h-4 w-4" aria-hidden />
                    {t.header.download}
                  </Link>
                </li>
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
