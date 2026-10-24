import { AiSection } from "@/components/sections/AiSection";
import { Features } from "@/components/sections/Features";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { Overview } from "@/components/sections/Overview";
import { QrDownload } from "@/components/ui/QrDownload";
import { siteConfig } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: siteConfig.name,
  applicationCategory: "BusinessApplication",
  operatingSystem: "iOS, Android",
  description: siteConfig.description,
  url: siteConfig.url,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Hero />
      <Overview />
      <AiSection />
      <Features />
      <FinalCta />
      <QrDownload />
    </>
  );
}
