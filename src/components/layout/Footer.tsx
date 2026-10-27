"use client";

import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon, LinkedInIcon, TikTokIcon, XIcon, YouTubeIcon } from "@/components/icons/brand";
import { NewsletterForm } from "@/components/forms/Forms";
import { Logo } from "@/components/ui/Logo";
import { StoreBadges } from "@/components/ui/StoreBadges";
import { useHref, useT } from "@/lib/language";
import { siteConfig, socialLinks } from "@/lib/site";

const socialIcons = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
  x: XIcon,
  linkedin: LinkedInIcon,
  youtube: YouTubeIcon,
};

/**
 * Two layers: the brand and store badges on the left with the update sign-up
 * on the right; then one thin bar with the copyright on the left and the
 * legal links and contact on the right.
 */
export function Footer() {
  const t = useT();
  const href = useHref();
  const p = t.pages;
  const socials = socialLinks.filter((s) => s.href);

  return (
    <footer className="border-t border-white/[0.07] bg-ink-950">
      <div className="container-page">
        <div className="flex flex-col gap-10 pt-14 pb-12 lg:flex-row lg:items-start lg:justify-between">
          {/* brand */}
          <div>
            <Link href={href("/")} aria-label={t.header.home}>
              <Logo />
            </Link>
            <p className="mt-3 max-w-[340px] text-[0.86rem] leading-relaxed text-white/55">{t.footer.blurb}</p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
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

          {/* update sign-up */}
          <div className="w-full max-w-[400px]">
            <p className="eyebrow">{t.footer.updates}</p>
            <p className="mt-3 text-[0.86rem] leading-relaxed text-white/55">{t.footer.updatesBody}</p>
            <div className="mt-4">
              <NewsletterForm />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/[0.07] py-6 text-[0.75rem] lg:flex-row lg:items-center lg:justify-between">
          <p className="text-white/50">
            © 2026 {siteConfig.company}. {t.footer.rights}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <nav aria-label={t.footer.nav}>
              <ul className="flex items-center gap-5">
                {[
                  { label: p.privacy, href: href("/privacy-policy") },
                  { label: p.terms, href: href("/terms-of-service") },
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-white/65 transition-colors hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <span aria-hidden className="hidden h-3.5 w-px bg-white/15 lg:block" />
            <ul aria-label={t.footer.contact} className="flex flex-wrap items-center gap-x-5 gap-y-2">
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
      </div>
    </footer>
  );
}
