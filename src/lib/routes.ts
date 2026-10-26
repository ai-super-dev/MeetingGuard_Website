/*
 * URL scheme: English at the root, Spanish under /es/ with the same slugs.
 * Every page exists in both languages.
 */

export type Lang = "en" | "es";
export const LANGS: readonly Lang[] = ["en", "es"];

/** `/pricing` -> `/es/pricing` for Spanish; `/` -> `/es`. */
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

export const FEATURE_SLUGS = ["voice-assistant", "alarms", "tasks", "agenda", "whatsapp", "integrations"] as const;
export type FeatureSlug = (typeof FEATURE_SLUGS)[number];

export const USE_CASE_SLUGS = ["consultants", "sales", "founders"] as const;
export type UseCaseSlug = (typeof USE_CASE_SLUGS)[number];

/** Every static page, language-neutral (blog posts are added by the sitemap from the content folder). */
export const PAGES = [
  "/",
  "/how-it-works",
  ...FEATURE_SLUGS.map((s) => `/features/${s}`),
  "/assistant",
  "/pricing",
  ...USE_CASE_SLUGS.map((s) => `/for/${s}`),
  "/security",
  "/about",
  "/faq",
  "/support",
  "/download",
  "/blog",
  "/privacy-policy",
  "/terms-of-service",
  "/delete-account",
  "/cookies",
  "/press",
] as const;
