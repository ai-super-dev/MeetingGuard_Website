import { faqItems, HOME_FAQ } from "@/content/faq";
import { SectionSnap } from "@/components/layout/SectionSnap";
import { Features } from "@/components/sections/Features";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { AssistantTeaser, Briefing, FaqHome, PricingTeaser } from "@/components/sections/HomeExtras";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Problem } from "@/components/sections/Problem";
import { WhatsAppSection } from "@/components/sections/WhatsAppSection";
import { QrDownload } from "@/components/ui/QrDownload";
import { dictionaries } from "@/lib/i18n";
import type { Lang } from "@/lib/routes";
import { appJsonLd, pageMetadata } from "@/lib/seo";

export function homeMetadata(lang: Lang) {
  const t = dictionaries[lang];
  return pageMetadata({ lang, path: "/", title: t.meta.homeTitle, description: t.meta.homeDescription });
}

/**
 * Landing page, in the order of the brief: hero (one sentence, three
 * promises, badges, proof), how it works, six features, WhatsApp, the daily
 * briefing, pricing teaser, assistant teaser, FAQ and the final call to action.
 * The "Why MeetingGuard" calendar section sits between the hero and how it works.
 */
export function HomePage({ lang }: { lang: Lang }) {
  const t = dictionaries[lang];
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd(t.meta.homeDescription)).replace(/</g, "\\u003c") }}
      />
      <Hero />
      <SectionSnap />
      <Problem />
      <HowItWorks />
      <Features />
      <WhatsAppSection />
      <Briefing />
      <PricingTeaser />
      <AssistantTeaser />
      <FaqHome items={faqItems(lang, HOME_FAQ)} />
      <FinalCta />
      <QrDownload lang={lang} />
    </>
  );
}
