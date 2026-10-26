"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { SpainFlag, UsFlag } from "@/components/icons/flags";
import { useLang, useT } from "@/lib/language";
import { localize, splitPath, type Lang } from "@/lib/routes";

const LANGS: { code: Lang; label: string; name: string; Flag: typeof UsFlag }[] = [
  { code: "en", label: "EN", name: "English", Flag: UsFlag },
  { code: "es", label: "ES", name: "Español", Flag: SpainFlag },
];

/** EN / ES switch with country flags; each side links to the same page in that language. */
export function LanguageSwitch({ layoutId = "lang-pill" }: { layoutId?: string }) {
  const lang = useLang();
  const t = useT();
  const { path } = splitPath(usePathname());

  return (
    <div role="group" aria-label={t.header.language} className="flex gap-0.5">
      {LANGS.map(({ code, label, name, Flag }) => {
        const active = code === lang;
        return (
          <Link
            key={code}
            href={localize(path, code)}
            hrefLang={code}
            lang={code}
            aria-label={name}
            aria-current={active ? "true" : undefined}
            className={`relative flex h-8 items-center gap-1.5 rounded-md px-2.5 text-[0.8rem] font-medium transition-colors duration-300 ${
              active ? "text-white" : "text-white/55 hover:text-white/85"
            }`}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-md bg-white/[0.1]"
                transition={{ type: "spring", stiffness: 400, damping: 34 }}
              />
            )}
            <Flag className={`relative h-3 w-[18px] rounded-[2px] transition-opacity ${active ? "" : "opacity-60"}`} />
            <span className="relative">{label}</span>
          </Link>
        );
      })}
    </div>
  );
}
