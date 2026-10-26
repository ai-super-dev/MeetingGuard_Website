"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { ChevronDown, Download, Menu, X } from "lucide-react";
import { featureAccents, featureIcons, useCaseIcons } from "@/components/icons/feature-icons";
import { Logo } from "@/components/ui/Logo";
import { useHref, useT } from "@/lib/language";
import { FEATURE_SLUGS, USE_CASE_SLUGS, splitPath } from "@/lib/routes";
import { LanguageSwitch } from "./LanguageSwitch";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { key: "how", path: "/how-it-works" },
  { key: "features", path: null },
  { key: "pricing", path: "/pricing" },
  { key: "assistant", path: "/assistant" },
] as const;

/** The Features dropdown: the six feature pages and the three use cases. */
function FeaturesPanel({ onNavigate }: { onNavigate: () => void }) {
  const t = useT();
  const href = useHref();
  return (
    <div className="grid gap-6 p-5 md:grid-cols-[1.35fr_1fr]">
      <div>
        <p className="eyebrow px-2">{t.header.featuresMenu.features}</p>
        <ul className="mt-2 grid gap-0.5">
          {FEATURE_SLUGS.map((slug) => {
            const Icon = featureIcons[slug];
            return (
              <li key={slug}>
                <Link
                  href={href(`/features/${slug}`)}
                  onClick={onNavigate}
                  className="group flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-white/[0.05]"
                >
                  <span
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-lg ring-1 ring-white/[0.08]"
                    style={{ background: `color-mix(in srgb, ${featureAccents[slug]} 14%, transparent)`, color: featureAccents[slug] }}
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[0.88rem] font-medium text-white">{t.pages.features[slug]}</span>
                    <span className="block truncate text-[0.78rem] text-white/50">{t.pages.featureBlurbs[slug]}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="md:border-l md:border-white/[0.06] md:pl-6">
        <p className="eyebrow px-2">{t.header.featuresMenu.useCases}</p>
        <ul className="mt-2 grid gap-0.5">
          {USE_CASE_SLUGS.map((slug) => {
            const Icon = useCaseIcons[slug];
            return (
              <li key={slug}>
                <Link
                  href={href(`/for/${slug}`)}
                  onClick={onNavigate}
                  className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-white/[0.05]"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/[0.05] text-white/70 ring-1 ring-white/[0.08]">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[0.88rem] font-medium text-white">{t.pages.useCases[slug]}</span>
                    <span className="block truncate text-[0.78rem] text-white/50">{t.pages.useCaseBlurbs[slug]}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/** Floating, rounded navigation bar that firms up once the page scrolls. */
export function Header() {
  const t = useT();
  const href = useHref();
  const pathname = usePathname();
  const { path } = splitPath(pathname);
  const [open, setOpen] = useState(false); // mobile menu
  const [menu, setMenu] = useState(false); // desktop Features panel
  const [mobileFeatures, setMobileFeatures] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 16));
  const menuRef = useRef<HTMLLIElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // close the Features panel on Escape or a click outside it
  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    const onDown = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenu(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [menu]);

  const closeAll = () => {
    setMenu(false);
    setOpen(false);
  };
  const featuresActive = path.startsWith("/features") || path.startsWith("/for/");
  const linkClass = (active: boolean) =>
    `rounded-lg px-3 py-2 text-[0.88rem] transition-colors ${active ? "text-white" : "text-white/65 hover:text-white"}`;

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 sm:top-4 sm:px-6">
      <div
        className={`mx-auto max-w-[1200px] rounded-2xl border transition-colors duration-300 ${
          scrolled || open || menu
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
              {NAV.map((item) =>
                item.path ? (
                  <li key={item.key}>
                    <Link href={href(item.path)} className={linkClass(path === item.path)} aria-current={path === item.path ? "page" : undefined}>
                      {t.header.nav[item.key]}
                    </Link>
                  </li>
                ) : (
                  <li
                    key={item.key}
                    ref={menuRef}
                    className="relative"
                    onPointerEnter={(e) => {
                      if (e.pointerType !== "mouse") return;
                      clearTimeout(hoverTimer.current);
                      setMenu(true);
                    }}
                    onPointerLeave={(e) => {
                      if (e.pointerType !== "mouse") return;
                      hoverTimer.current = setTimeout(() => setMenu(false), 160);
                    }}
                  >
                    <button
                      type="button"
                      aria-expanded={menu}
                      aria-controls="features-menu"
                      onClick={() => setMenu((v) => !v)}
                      className={`flex items-center gap-1 ${linkClass(featuresActive || menu)}`}
                    >
                      {t.header.nav.features}
                      <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${menu ? "rotate-180" : ""}`} aria-hidden />
                    </button>
                    <AnimatePresence>
                      {menu && (
                        <motion.div
                          id="features-menu"
                          initial={{ opacity: 0, y: -6, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -6, scale: 0.98 }}
                          transition={{ duration: 0.18, ease: "easeOut" }}
                          className="absolute top-full left-1/2 mt-3 w-[620px] -translate-x-1/2 origin-top rounded-2xl border border-white/[0.09] bg-[#0e0e12] shadow-[0_30px_80px_rgba(0,0,0,0.7)]"
                        >
                          {/* bridge so the pointer can travel from the button to the panel */}
                          <span aria-hidden className="absolute -top-3 inset-x-0 h-3" />
                          <FeaturesPanel onNavigate={closeAll} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-1.5 lg:ml-6">
            <LanguageSwitch />
            <span aria-hidden className="mx-1 hidden h-5 w-px bg-white/10 lg:block" />
            <ThemeToggle className="hidden lg:block" />
            <Link
              href={href("/download")}
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
                {NAV.map((item) =>
                  item.path ? (
                    <li key={item.key}>
                      <Link
                        href={href(item.path)}
                        onClick={closeAll}
                        className="block rounded-lg px-3 py-3 text-white/80 hover:bg-white/5 hover:text-white"
                      >
                        {t.header.nav[item.key]}
                      </Link>
                    </li>
                  ) : (
                    <li key={item.key}>
                      <button
                        type="button"
                        aria-expanded={mobileFeatures}
                        onClick={() => setMobileFeatures((v) => !v)}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-white/80 hover:bg-white/5 hover:text-white"
                      >
                        {t.header.nav.features}
                        <ChevronDown className={`h-4 w-4 transition-transform ${mobileFeatures ? "rotate-180" : ""}`} aria-hidden />
                      </button>
                      <AnimatePresence initial={false}>
                        {mobileFeatures && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <FeaturesPanel onNavigate={closeAll} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  ),
                )}
                <li className="mt-1 flex items-center justify-between gap-3 border-t border-white/[0.07] px-1 pt-3 pb-2">
                  <ThemeToggle withLabel />
                  <Link
                    href={href("/download")}
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
