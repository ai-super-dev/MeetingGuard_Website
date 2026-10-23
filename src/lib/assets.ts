// Static imports let next/image know each asset's size and serve resized
// AVIF/WebP versions instead of the 1–2 MB source PNGs in /public.
import heroArt from "../../public/images/Neon MeetingGuard Lock Screen.png";
import aiAssistantIcon from "../../public/icons/ai assistant icon.png";
import aiSchedulingIcon from "../../public/icons/ai scheduling icon.png";
import appIcon from "../../public/icons/app icon.png";
import appStoreIcon from "../../public/icons/app store icon.png";
import calendarSyncIcon from "../../public/icons/calendar sync icon.png";
import googlePlayIcon from "../../public/icons/google play store icon.png";
import lightningIcon from "../../public/icons/lightning icon.png";
import smartAlertIcon from "../../public/icons/smart alert icon.png";

export const images = { heroArt };

export const icons = {
  aiAssistant: aiAssistantIcon,
  aiScheduling: aiSchedulingIcon,
  app: appIcon,
  appStore: appStoreIcon,
  calendarSync: calendarSyncIcon,
  googlePlay: googlePlayIcon,
  lightning: lightningIcon,
  smartAlert: smartAlertIcon,
};
