"use client";

import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon, LinkedInIcon, TikTokIcon, XIcon, YouTubeIcon } from "@/components/icons/brand";
import { NewsletterForm } from "@/components/forms/Forms";
import { Logo } from "@/components/ui/Logo";
import { StoreBadges } from "@/components/ui/StoreBadges";
import { useHref, useT } from "@/lib/language";
import { FEATURE_SLUGS } from "@/lib/routes";
import { siteConfig, socialLinks } from "@/lib/site";

const socialIcons = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
  x: XIcon,
  linkedin: LinkedInIcon,
  youtube: YouTubeIcon,
};

function Column({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="eyebrow">{title}</p>
      <ul className="mt-4 space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-[0.84rem] text-white/60 transition-colors hover:text-white">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Two layers: brand, update sign-up and badges beside the four link columns;
 * then one thin bar with the copyright, company line and contact.
 */
export function Footer() {
  const t = useT();
  const href = useHref();
  const p = t.pages;
  const socials = socialLinks.filter((s) => s.href);

  return (
    <footer className="border-t border-white/[0.07] bg-ink-950">
      <div className="container-page">
        <div className="grid gap-12 pt-14 pb-12 lg:grid-cols-12 lg:gap-10">
          {/* brand */}
          <div className="lg:col-span-4">
            <Link href={href("/")} aria-label={t.header.home}>
              <Logo />
            </Link>
            <p className="mt-3 max-w-[300px] text-[0.86rem] leading-relaxed text-white/55">{t.footer.blurb}</p>
            <div className="mt-6">
              <NewsletterForm />
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <StoreBadges height={36} />
              {socials.length > 0 && (
                <ul className="flex items-center gap-2">
                  {socials.map((s) => {
                    const Icon = socialIcons[s.icon];
                    return (
                      <li key={s.label}>
                        <a
                          href={s.href}
                          aria-label={s.label}
                          className="grid h-9 w-9 place-items-center rounded-lg border border-white/[0.08] text-white/65 transition hover:border-white/20 hover:text-white"
                        >
                          <Icon className="h-[17px] w-[17px]" />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          <nav aria-label={t.footer.nav} className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 lg:col-span-8 lg:pl-10">
            <Column
              title={t.footer.product}
              links={[
                { label: p.how, href: href("/how-it-works") },
                { label: p.pricing, href: href("/pricing") },
                { label: p.assistant, href: href("/assistant") },
                { label: p.download, href: href("/download") },
                { label: p.blog, href: href("/blog") },
              ]}
            />
            <Column title={t.footer.featuresCol} links={FEATURE_SLUGS.map((s) => ({ label: p.features[s], href: href(`/features/${s}`) }))} />
            <Column
              title={t.footer.company}
              links={[
                { label: p.about, href: href("/about") },
                { label: p.security, href: href("/security") },
                { label: p.faq, href: href("/faq") },
                { label: p.support, href: href("/support") },
                { label: p.press, href: href("/press") },
              ]}
            />
            <Column
              title={t.footer.legal}
              links={[
                { label: p.privacy, href: href("/privacy-policy") },
                { label: p.terms, href: href("/terms-of-service") },
                { label: p.deleteAccount, href: href("/delete-account") },
                { label: p.cookies, href: href("/cookies") },
              ]}
            />
          </nav>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/[0.07] py-6 text-[0.75rem] text-white/45 md:flex-row md:items-center md:justify-between">
          <p className="text-white/60">
            © 2026 {siteConfig.company}. {t.footer.rights}
          </p>
          <ul aria-label={t.footer.contact} className="flex shrink-0 flex-wrap items-center gap-x-5 gap-y-2">
            <li>
              <a href={`mailto:${siteConfig.supportEmail}`} className="inline-flex items-center gap-1.5 text-white/65 transition-colors hover:text-white">
                <Mail className="h-3.5 w-3.5" aria-hidden />
                {siteConfig.supportEmail}
              </a>
            </li>
            <li>
              <a href={`tel:${siteConfig.contactPhone}`} className="inline-flex items-center gap-1.5 text-white/65 transition-colors hover:text-white">
                <Phone className="h-3.5 w-3.5" aria-hidden />
                {siteConfig.contactPhoneLabel}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
