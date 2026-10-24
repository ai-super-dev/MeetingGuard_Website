import Link from "next/link";
import { InstagramIcon, LinkedInIcon, XIcon, YouTubeIcon } from "@/components/icons/brand";
import { Logo } from "@/components/ui/Logo";
import { footerLinks, socialLinks } from "@/lib/site";

const socialIcons = {
  x: XIcon,
  linkedin: LinkedInIcon,
  youtube: YouTubeIcon,
  instagram: InstagramIcon,
};

export function Footer() {
  return (
    <footer className="border-t border-white/[0.07] bg-ink-950">
      <div className="container-page flex flex-col items-center gap-6 py-10 lg:flex-row lg:justify-between">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-8">
          <Link href="/" aria-label="MeetingGuard home">
            <Logo />
          </Link>
          <p className="text-xs whitespace-nowrap text-white/35">© 2026 MeetingGuard. All rights reserved.</p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {footerLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-xs text-white/55 transition-colors hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="flex items-center gap-5">
          {socialLinks.map((s) => {
            const Icon = socialIcons[s.icon];
            return (
              <li key={s.label}>
                <a
                  href={s.href}
                  aria-label={s.label}
                  className="text-white/55 transition hover:text-white"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </footer>
  );
}
