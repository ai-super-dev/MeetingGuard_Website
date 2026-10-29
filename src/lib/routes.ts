/*
 * URL scheme: English at the root, Spanish under /es/ with the same slugs.
 * Every page exists in both languages.
 */

export type Lang = "en" | "es";
export const LANGS: readonly Lang[] = ["en", "es"];

/** `/privacy-policy` -> `/es/privacy-policy` for Spanish; `/` -> `/es`. */
export function localize(path: string, lang: Lang) {
  if (lang === "en") return path;
  return path === "/" ? "/es" : `/es${path}`;
}

/** Splits a pathname into its language and the language-neutral path. */
export function splitPath(pathname: string): { lang: Lang; path: string } {
  if (pathname === "/es" || pathname === "/es/") return { lang: "es", path: "/" };
  if (pathname.startsWith("/es/")) return { lang: "es", path: pathname.slice(3) };
  return { lang: "en", path: pathname || "/" };
}

/** The seven features shown as tiles on the home page. */
export const FEATURE_SLUGS = ["voice-assistant", "alarms", "tasks", "agenda", "whatsapp", "meeting-links", "integrations"] as const;
export type FeatureSlug = (typeof FEATURE_SLUGS)[number];

/** Every page, language-neutral. */
export const PAGES = ["/", "/privacy-policy", "/terms-of-service"] as const;
