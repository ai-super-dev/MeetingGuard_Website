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
    <footer className="relative border-t border-[#3d6bff]/30 bg-[#040a24]">
      <div className="neon-seam absolute inset-x-0 -top-px opacity-70" aria-hidden />
      <div className="container-page flex flex-col items-center gap-6 py-7 lg:flex-row lg:justify-between">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-8">
          <Link href="/" aria-label="MeetingGuard home">
            <Logo />
          </Link>
          <p className="text-xs whitespace-nowrap text-slate-400">© 2026 MeetingGuard. All rights reserved.</p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {footerLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-xs text-slate-300 transition-colors hover:text-white">
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
                  className="text-white transition hover:text-neon-azure hover:drop-shadow-[0_0_8px_#4aa3ff]"
                >
                  <Icon className="h-5 w-5" />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </footer>
  );
}
