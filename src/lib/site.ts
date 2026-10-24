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
  whatsappNumberRaw: "+447403693109",
  // Support contact (from the original site's footer).
  contactPhone: "+447400752170",
  contactPhoneLabel: "+44 7400 752170",
  contactEmail: "hello@meetingguard.ai",
  // TODO: endpoint that accepts { email } for update subscriptions; the form says "opening soon" until it's set.
  newsletterEndpoint: "",
} as const;

export type NavLink = { label: string; href: string };

export const navLinks: NavLink[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

export const footerLinks: NavLink[] = [
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
];

export const socialLinks = [
  { label: "Facebook", href: "#", icon: "facebook" },
  { label: "Instagram", href: "#", icon: "instagram" },
  { label: "TikTok", href: "#", icon: "tiktok" },
  { label: "X", href: "#", icon: "x" },
  { label: "LinkedIn", href: "#", icon: "linkedin" },
  { label: "YouTube", href: "#", icon: "youtube" },
] as const;
