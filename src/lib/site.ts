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
  // TODO: the real store listings.
  appStoreUrl: "#",
  playStoreUrl: "#",
  // TODO: store review links (support page) once the listings are live.
  appStoreReviewUrl: "#",
  playStoreReviewUrl: "#",
  // TODO: store ratings for the social proof strip, e.g. { appStore: 4.8, googlePlay: 4.7 }.
  ratings: null as null | { appStore?: number; googlePlay?: number },
  // TODO: URL of the Cloud Function that receives the waitlist, contact, send-link and update forms.
  formsEndpoint: "",
  // TODO: GA4 measurement ID (G-XXXXXXX). Analytics loads only after consent and only when this is set.
  gaMeasurementId: "",
  // TODO: hosted product video (mp4) and its captions; the video block shows a poster until then.
  video: { src: "", poster: "", captionsEn: "", captionsEs: "" },
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
