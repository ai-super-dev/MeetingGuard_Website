export const siteConfig = {
  name: "MeetingGuard",
  tagline: "Plan, Alert, Join. Your AI meeting companion.",
  description:
    "MeetingGuard AI keeps your meetings in one place, syncs Google Calendar, Outlook and your phone's calendars, and rings alarms you can't miss — even when the app is closed. Create, move and share meetings by text or voice. For iPhone and Android.",
  // TODO: replace with the production domain once it is live.
  url: "https://meetingguard.app",
  // TODO: replace with the real store listings.
  appStoreUrl: "#",
  playStoreUrl: "#",
  // The MeetingGuard WhatsApp bot (number shown in the app's WhatsApp linking screen).
  whatsappNumber: "+44 7403 693109",
  whatsappNumberRaw: "+447403693109",
  whatsappUrl: "https://wa.me/447403693109",
} as const;

export type NavLink = { label: string; href: string };

export const navLinks: NavLink[] = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "WhatsApp", href: "/#whatsapp" },
  { label: "AI", href: "/#ai" },
  { label: "Features", href: "/#features" },
];

export const footerLinks: NavLink[] = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "WhatsApp", href: "/#whatsapp" },
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
