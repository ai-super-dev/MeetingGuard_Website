import { CallToAction } from "@/components/sections/CallToAction";
import {
  AISchedulingSection,
  CalendarSyncSection,
  CriticalAlertsSection,
  SmartRemindersSection,
} from "@/components/sections/Features";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Integrations } from "@/components/sections/Integrations";
import { Reviews } from "@/components/sections/Reviews";
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
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", bestRating: "5", ratingCount: "10000" },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Hero />
      <CalendarSyncSection />
      <CriticalAlertsSection />
      <AISchedulingSection />
      <SmartRemindersSection />
      <HowItWorks />
      <Integrations />
      <Reviews />
      <CallToAction />
    </>
  );
}
