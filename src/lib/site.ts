/*
 * Facts used across the site. Values marked TODO are not confirmed yet; the
 * page shows them as "TBC" or hides the element until they are filled in.
 */
export const siteConfig = {
  name: "MeetingGuard",
  url: "https://meetingguard.ai",
  company: "Aeternum Tech Ltd",
  // TODO: UK company number (Companies House).
  companyNumber: "",
  supportEmail: "support@meetingguard.ai",
  // Support phone from the original site's footer.
  contactPhone: "+447400752170",
  contactPhoneLabel: "+44 7400 752170",
  // The MeetingGuard WhatsApp business number (shown in the app's WhatsApp linking screen).
  whatsappNumberRaw: "+447403693109",
  // TODO: the App Store listing. Until a link is set, its badge does nothing when clicked.
  appStoreUrl: "",
  playStoreUrl: "https://play.google.com/store/apps/details?id=com.meetingguard.ai",
  // The header's Sign in button opens the web agenda (/app) only when this is true; until
  // then it shows "coming soon". The agenda itself can still be opened by typing /app.
  agendaOpen: false,
  // TODO: URL of the Cloud Function that receives the waitlist and update forms.
  formsEndpoint: "",
  // TODO: GA4 measurement ID (G-XXXXXXX). Analytics loads only after consent and only when this is set.
  gaMeasurementId: "",
};

/** Social profiles; an icon only appears once its link is filled in. */
export const socialLinks: { label: string; href: string; icon: "facebook" | "instagram" | "tiktok" | "x" | "linkedin" | "youtube" }[] = [
  { label: "Facebook", href: "", icon: "facebook" },
  { label: "Instagram", href: "", icon: "instagram" },
  { label: "TikTok", href: "", icon: "tiktok" },
  { label: "X", href: "", icon: "x" },
  { label: "LinkedIn", href: "", icon: "linkedin" },
  { label: "YouTube", href: "", icon: "youtube" },
];

/** Release months for features that are not shipped yet (the "available <month>" labels). */
export const availability = {
  // TODO: confirm each month at release time.
  outlook: "november",
  microsoftToDo: "december",
  googleTasks: "december",
  debrief: "december",
} as const;
