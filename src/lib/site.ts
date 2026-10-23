export const siteConfig = {
  name: "MeetingGuard",
  tagline: "Smarter meetings. A brighter you.",
  description:
    "Plan. Alert. Join. MeetingGuard keeps you on track with AI-powered scheduling, critical reminders, calendar sync, and effortless meeting joins.",
  // TODO: replace with the production domain once it is live.
  url: "https://meetingguard.app",
  // TODO: replace with the real store listings.
  appStoreUrl: "#",
  playStoreUrl: "#",
} as const;

export type NavLink = { label: string; href: string };

export const navLinks: NavLink[] = [
  { label: "Features", href: "/#features" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Integrations", href: "/#integrations" },
  { label: "Testimonials", href: "/#reviews" },
  // TODO: no FAQ section yet — add one with id="faq".
  { label: "FAQ", href: "/#faq" },
];

export const footerLinks: NavLink[] = [
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Integrations", href: "/#integrations" },
  { label: "Reviews", href: "/#reviews" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
];

export const socialLinks = [
  { label: "X", href: "#", icon: "x" },
  { label: "LinkedIn", href: "#", icon: "linkedin" },
  { label: "YouTube", href: "#", icon: "youtube" },
  { label: "Instagram", href: "#", icon: "instagram" },
] as const;
