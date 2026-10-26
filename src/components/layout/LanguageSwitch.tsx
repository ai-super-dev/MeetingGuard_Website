"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SpainFlag, UsFlag } from "@/components/icons/flags";
import { useLang } from "@/lib/language";
import { localize, splitPath, type Lang } from "@/lib/routes";

const LANGS: Record<Lang, { label: string; name: string; Flag: typeof UsFlag }> = {
  en: { label: "EN", name: "English", Flag: UsFlag },
  es: { label: "ES", name: "Español", Flag: SpainFlag },
};

/** Round flag + code, one row of the rolling switch. */
function Row({ lang, dim = false }: { lang: Lang; dim?: boolean }) {
  const { label, Flag } = LANGS[lang];
  return (
    <span className={`flex h-8 items-center gap-2 ${dim ? "text-white/90" : "text-white"}`}>
      <span className="grid h-4 w-4 shrink-0 place-items-center overflow-hidden rounded-full ring-1 ring-white/20">
        <Flag className="h-4 w-6 max-w-none" preserveAspectRatio="xMidYMid slice" />
      </span>
      {label}
    </span>
  );
}

/**
 * One button showing the current language. On hover or focus it rolls up to
 * reveal the other language, and pressing it opens the same page in that one.
 */
export function LanguageSwitch() {
  const lang = useLang();
  const other: Lang = lang === "en" ? "es" : "en";
  const { path } = splitPath(usePathname());

  return (
    <Link
      href={localize(path, other)}
      hrefLang={other}
      aria-label={lang === "en" ? `Cambiar a ${LANGS[other].name}` : `Switch to ${LANGS[other].name}`}
      title={LANGS[other].name}
      className="group relative block h-8 overflow-hidden rounded-full border border-white/10 bg-white/[0.05] px-3 text-[0.78rem] font-semibold tracking-[0.04em] transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.09] focus-visible:border-white/25"
    >
      <span className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-8 group-focus-visible:-translate-y-8 motion-reduce:transition-none">
        <Row lang={lang} />
        <Row lang={other} dim />
      </span>
    </Link>
  );
}
