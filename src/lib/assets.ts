// Static imports let next/image know each asset's size and serve resized
// AVIF/WebP versions instead of the 1–2 MB source PNGs in /public.
import heroBackground from "../../public/images/Neon MeetingGuard Lock Screen.png";
import phoneBorder from "../../public/images/phone_border.png";
import waveEffect from "../../public/images/wave_effect.png";
import aiAssistantIcon from "../../public/icons/ai_assistant_icon.png";
import aiSchedulingIcon from "../../public/icons/ai_scheduling_icon.png";
import appIcon from "../../public/icons/app_icon.png";
import appStoreIcon from "../../public/icons/app_store_icon.png";
import calendarIcon from "../../public/icons/calendar_icon.png";
import calendarSyncIcon from "../../public/icons/calendar_sync_icon.png";
import googlePlayIcon from "../../public/icons/google_play_store_icon.png";
import lightningIcon from "../../public/icons/lightning_icon.png";
import meetingIcon from "../../public/icons/meeting_icon.png";
import phoneBellIcon from "../../public/icons/phone_bell_icon.png";
import robotIcon from "../../public/icons/robot_icon.png";
import smartAlertIcon from "../../public/icons/smart_alert_icon.png";
import whatsappIcon from "../../public/icons/whatsapp_icon.png";

export const images = { heroBackground, phoneBorder, waveEffect };

export const icons = {
  aiAssistant: aiAssistantIcon,
  aiScheduling: aiSchedulingIcon,
  app: appIcon,
  appStore: appStoreIcon,
  calendar: calendarIcon,
  calendarSync: calendarSyncIcon,
  googlePlay: googlePlayIcon,
  lightning: lightningIcon,
  meeting: meetingIcon,
  phoneBell: phoneBellIcon,
  robot: robotIcon,
  smartAlert: smartAlertIcon,
  whatsapp: whatsappIcon,
};
