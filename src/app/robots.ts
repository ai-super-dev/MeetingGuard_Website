import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    // the web agenda is private to each account
    rules: { userAgent: "*", allow: "/", disallow: ["/app", "/es/app"] },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
