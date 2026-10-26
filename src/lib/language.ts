"use client";

import { createContext, createElement, useContext, type ReactNode } from "react";
import { dictionaries, type Dict } from "./i18n";
import { localize, type Lang } from "./routes";

export type { Lang } from "./routes";

const LangContext = createContext<Lang>("en");

/** Set once per root layout: `/` pages are English, `/es/` pages Spanish. */
export function LangProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  return createElement(LangContext.Provider, { value: lang }, children);
}

export function useLang(): Lang {
  return useContext(LangContext);
}

/** The site's strings in the page's language. */
export function useT(): Dict {
  return dictionaries[useLang()];
}

/** Builds a link in the page's language: `href("/pricing")` is `/es/pricing` on Spanish pages. */
export function useHref() {
  const lang = useLang();
  return (path: string) => localize(path, lang);
}
