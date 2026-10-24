export const siteConfig = {
  name: "MeetingGuard",
  tagline: "Plan, Alert, Join. Your AI meeting companion.",
  description:
    "Plan, Alert, Join. MeetingGuard is your AI meeting companion — critical alerts, calendar sync, AI scheduling and one-tap joins on iPhone and Android.",
  // TODO: replace with the production domain once it is live.
  url: "https://meetingguard.app",
  // TODO: replace with the real store listings.
  appStoreUrl: "#",
  playStoreUrl: "#",
} as const;

export type NavLink = { label: string; href: string };

export const navLinks: NavLink[] = [
  { label: "Overview", href: "/#overview" },
  { label: "AI", href: "/#ai" },
  { label: "Features", href: "/#features" },
  { label: "Privacy", href: "/privacy" },
];

export const footerLinks: NavLink[] = [
  { label: "Overview", href: "/#overview" },
  { label: "AI", href: "/#ai" },
  { label: "Features", href: "/#features" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
];

export const socialLinks = [
  { label: "X", href: "#", icon: "x" },
  { label: "LinkedIn", href: "#", icon: "linkedin" },
  { label: "YouTube", href: "#", icon: "youtube" },
  { label: "Instagram", href: "#", icon: "instagram" },
] as const;
