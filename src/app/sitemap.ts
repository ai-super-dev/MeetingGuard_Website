import type { MetadataRoute } from "next";
import { blogSlugs } from "@/views/BlogPages";
import { localize, PAGES } from "@/lib/routes";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

/** Every page in both languages, each entry listing its English and Spanish URLs. */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...PAGES, ...blogSlugs().map((s) => `/blog/${s}`)];
  return paths.flatMap((path) =>
    (["en", "es"] as const).map((lang) => ({
      url: `${siteConfig.url}${localize(path, lang)}`,
      changeFrequency: path === "/" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "/" ? 1 : path.startsWith("/features") || path === "/pricing" ? 0.8 : 0.5,
      alternates: { languages: { en: `${siteConfig.url}${localize(path, "en")}`, es: `${siteConfig.url}${localize(path, "es")}` } },
    })),
  );
}
