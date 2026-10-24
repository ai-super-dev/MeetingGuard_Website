"use client";

import { useEffect } from "react";
import { motion } from "motion/react";
import { SpainFlag, UsFlag } from "@/components/icons/flags";
import { type Lang, useLanguage, useT } from "@/lib/language";

const LANGS: { code: Lang; label: string; name: string; Flag: typeof UsFlag }[] = [
  { code: "en", label: "EN", name: "English", Flag: UsFlag },
  { code: "es", label: "ES", name: "Español", Flag: SpainFlag },
];

/** EN / ES segmented switch with country flags. */
export function LanguageSwitch() {
  const [lang, setLang] = useLanguage();
  const t = useT();

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <div role="group" aria-label={t.header.language} className="flex gap-0.5">
      {LANGS.map(({ code, label, name, Flag }) => {
        const active = code === lang;
        return (
          <button
            key={code}
            type="button"
            lang={code}
            aria-label={name}
            aria-pressed={active}
            onClick={() => setLang(code)}
            className={`relative flex h-8 items-center gap-1.5 rounded-md px-2.5 text-[0.8rem] font-medium transition-colors duration-300 ${
              active ? "text-white" : "text-white/55 hover:text-white/85"
            }`}
          >
            {active && (
              <motion.span
                layoutId="lang-pill"
                className="absolute inset-0 rounded-md bg-white/[0.1]"
                transition={{ type: "spring", stiffness: 400, damping: 34 }}
              />
            )}
            <Flag className={`relative h-3 w-[18px] rounded-[2px] transition-opacity ${active ? "" : "opacity-60"}`} />
            <span className="relative">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
