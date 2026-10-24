"use client";

import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  TikTokIcon,
  XIcon,
  YouTubeIcon,
} from "@/components/icons/brand";
import { Logo } from "@/components/ui/Logo";
import { useT } from "@/lib/language";
import { footerLinks, siteConfig, socialLinks } from "@/lib/site";
import { NewsletterForm } from "./NewsletterForm";

const socialIcons = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
  x: XIcon,
  linkedin: LinkedInIcon,
  youtube: YouTubeIcon,
};

export function Footer() {
  const t = useT();
  return (
    <footer className="border-t border-white/[0.07] bg-ink-950">
      <div className="container-page">
        <div className="grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1.4fr] lg:gap-16">
          {/* connect */}
          <div>
            <Link href="/" aria-label={t.header.home}>
              <Logo />
            </Link>
            <p className="mt-4 max-w-[260px] text-[0.9rem] leading-relaxed text-white/60">
              {t.footer.blurb}
            </p>
            <ul className="mt-6 flex items-center gap-4">
              {socialLinks.map((s) => {
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
          </div>

          {/* contact */}
          <div>
            <p className="eyebrow">{t.footer.contact}</p>
            <ul className="mt-4 space-y-3 text-[0.9rem]">
              <li>
                <a
                  href={`tel:${siteConfig.contactPhone}`}
                  className="inline-flex items-center gap-2.5 text-white/75 transition-colors hover:text-white"
                >
                  <Phone className="h-4 w-4 text-white/45" aria-hidden />
                  {siteConfig.contactPhoneLabel}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="inline-flex items-center gap-2.5 text-white/75 transition-colors hover:text-white"
                >
                  <Mail className="h-4 w-4 text-white/45" aria-hidden />
                  {siteConfig.contactEmail}
                </a>
              </li>
            </ul>
          </div>

          {/* updates */}
          <div className="md:col-span-2 lg:col-span-1">
            <p className="eyebrow">{t.footer.updates}</p>
            <div className="mt-4">
              <NewsletterForm />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 border-t border-white/[0.07] py-6 sm:flex-row sm:justify-between">
          <p className="text-xs text-white/50">{t.footer.rights}</p>
          <nav aria-label={t.footer.nav}>
            <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
              {footerLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-xs text-white/65 transition-colors hover:text-white">
                    {t.links[l.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
