// Static imports let next/image know each asset's size and serve resized
// AVIF/WebP versions instead of the 1 MB source PNGs in /public.
import appIcon from "../../public/icons/app_icon.png";
import appStoreIcon from "../../public/icons/app_store_icon.png";
import bellIcon from "../../public/icons/bell_icon.png";
import playStoreIcon from "../../public/icons/play_store_icon.png";
import phoneFrame from "../../public/images/phone_frame.png";

export const images = { phoneFrame };

export const icons = {
  app: appIcon,
  appStore: appStoreIcon,
  bell: bellIcon,
  playStore: playStoreIcon,
};
