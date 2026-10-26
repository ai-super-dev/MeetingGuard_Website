// Static imports let next/image know each asset's size and serve resized
// AVIF/WebP versions instead of the 1 MB source PNGs in /public.
import appIcon from "../../public/icons/app_icon.png";
import bellIcon from "../../public/icons/bell_icon.png";
import phoneCal from "../../public/images/phone-alert.png";
import phoneFrame from "../../public/images/phone_frame.png";
import phoneFrameStraight from "../../public/images/phone_frame_str.png";
import phonePurple from "../../public/images/phone_purple.png";
import phoneRed from "../../public/images/phone_red.png";
import phoneBlue from "../../public/images/phone_blue.png";
import androidPhone from "../../public/images/android_phone_tilt.png";

export const images = { phoneCal, phoneFrame, phoneFrameStraight, phonePurple, phoneRed, phoneBlue, androidPhone };

export const icons = {
  app: appIcon,
  bell: bellIcon,
};
