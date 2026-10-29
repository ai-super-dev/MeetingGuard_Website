/*
 * URL scheme: English at the root, Spanish under /es/ with the same slugs.
 * Every page exists in both languages.
 */

export type Lang = "en" | "es";
export const LANGS: readonly Lang[] = ["en", "es"];

/**
 * The page's URL, ending in a slash: `/privacy-policy` -> `/privacy-policy/`, or
 * `/es/privacy-policy/` for Spanish; `/` -> `/es/`. A query or hash stays after
 * the slash. Every page is built as a folder with an index.html (trailingSlash in
 * next.config.ts), which any web server serves without special rules.
 */
export function localize(path: string, lang: Lang) {
  const [, base, rest] = path.match(/^([^?#]*)(.*)$/)!;
  const page = base.endsWith("/") ? base : `${base}/`;
  if (lang === "en") return page + rest;
  return (page === "/" ? "/es/" : `/es${page}`) + rest;
}

/** Splits a pathname into its language and the language-neutral path (no final slash). */
export function splitPath(pathname: string): { lang: Lang; path: string } {
  const p = (pathname || "/").replace(/(.)\/+$/, "$1");
  if (p === "/es") return { lang: "es", path: "/" };
  if (p.startsWith("/es/")) return { lang: "es", path: p.slice(3) };
  return { lang: "en", path: p };
}

/** The seven features shown as tiles on the home page. */
export const FEATURE_SLUGS = ["voice-assistant", "alarms", "tasks", "agenda", "whatsapp", "meeting-links", "integrations"] as const;
export type FeatureSlug = (typeof FEATURE_SLUGS)[number];

/** Every page, language-neutral. */
export const PAGES = ["/", "/privacy-policy", "/terms-of-service"] as const;
