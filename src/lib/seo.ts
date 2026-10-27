import type { Metadata } from "next";
import { localize, type Lang } from "./routes";
import { siteConfig } from "./site";

/**
 * Title, description, canonical URL, hreflang pair and social cards for one
 * page in one language. `path` is language-neutral (`/privacy-policy`).
 */
export function pageMetadata({
  lang,
  path,
  title,
  description,
  noindex = false,
}: {
  lang: Lang;
  path: string;
  title: string;
  description: string;
  noindex?: boolean;
}): Metadata {
  const url = localize(path, lang);
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { en: localize(path, "en"), es: localize(path, "es"), "x-default": localize(path, "en") },
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title,
      description,
      url,
      locale: lang === "es" ? "es_ES" : "en_US",
      alternateLocale: lang === "es" ? "en_US" : "es_ES",
    },
    twitter: { card: "summary_large_image", title, description },
    robots: noindex ? { index: false, follow: true } : { index: true, follow: true },
  };
}

/** SoftwareApplication structured data for the home page. */
export function appJsonLd(description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteConfig.name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "iOS, Android",
    description,
    url: siteConfig.url,
    publisher: { "@type": "Organization", name: siteConfig.company },
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
}
