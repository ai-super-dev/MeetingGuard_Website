// Static imports let next/image know each asset's size and serve resized
// AVIF/WebP versions instead of the 1 MB source PNGs in /public.
import appIcon from "../../public/icons/app_icon.png";
import appStoreIcon from "../../public/icons/app_store_icon.png";
import bellIcon from "../../public/icons/bell_icon.png";
import playStoreIcon from "../../public/icons/play_store_icon.png";
import phoneBlue from "../../public/images/phone_blue.png";
import phoneFrame from "../../public/images/phone_frame.png";
import phonePurple from "../../public/images/phone_purple.png";
import phoneRed from "../../public/images/phone_red.png";
import phoneTeal from "../../public/images/phone_teal.png";

export const images = { phoneBlue, phoneFrame, phonePurple, phoneRed, phoneTeal };

export const icons = {
  app: appIcon,
  appStore: appStoreIcon,
  bell: bellIcon,
  playStore: playStoreIcon,
};
