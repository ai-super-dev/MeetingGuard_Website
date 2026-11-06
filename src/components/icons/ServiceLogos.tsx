import { useId } from "react";

/*
 * Official app icons of the services Meeting Guard AI works with, shown beside
 * their names on the landing the way the WhatsApp logo is (the client asked for
 * them): each kept unchanged, in its own colours, no larger than the text.
 * The drawings come from the theSVG (MIT) and selfh.st (CC BY 4.0) icon sets.
 * Each copy gets its own ids, so two on one page never share a gradient.
 */

type LogoProps = { className?: string };

/** A prefix for this copy's ids (useId's characters are not all safe in url(#...)). */
function useIds() {
  return `lg${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
}

/** Google Meet (the 2025 icon). */
export function GoogleMeetLogo({ className = "" }: LogoProps) {
  const p = useIds();
  return (
    <svg viewBox="0 0 192 192" className={className} aria-hidden>
      <mask id={`${p}a`} width="129" height="138" x="8" y="27" maskUnits="userSpaceOnUse" style={{ maskType: "luminance" }}>
        <path fill="#fff" d="M8 71c0-24.3 19.7-44 44-44h64c11.046 0 20 8.954 20 20v98c0 11.046-8.954 20-20 20H28c-11.046 0-20-8.954-20-20z" />
      </mask>
      <g fill="none">
        <path fill={`url(#${p}b)`} d="M110.015 108.88c-6.829-4.718-6.921-14.778-.179-19.62L165 49.643c7.94-5.701 19-.038 19 9.737v77.755c0 9.675-10.861 15.359-18.821 9.859z" />
        <path fill={`url(#${p}d)`} d="M8 71c0-24.3 19.7-44 44-44h64c11.046 0 20 8.954 20 20v98c0 11.046-8.954 20-20 20H28c-11.046 0-20-8.954-20-20z" />
        <g filter={`url(#${p}e)`} mask={`url(#${p}a)`}>
          <path fill={`url(#${p}c)`} d="m73.906 99.198l110-63.198v124z" />
        </g>
        <circle cx="38" cy="135" r="14" fill="#fff" />
        <defs>
          <linearGradient id={`${p}b`} x1="128.8" x2="227.2" y1="104.44" y2="104.44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f6a100" />
            <stop offset="1" stopColor="#ffbe00" />
          </linearGradient>
          <linearGradient id={`${p}c`} x1="136.22" x2="78.5" y1="91.32" y2="91.19" gradientUnits="userSpaceOnUse">
            <stop offset=".15" stopColor="#ffb5e8" />
            <stop offset="1" stopColor="#ffdbf5" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={`${p}d`} cx="0" cy="0" r="1" gradientTransform="matrix(-159.725 0 0 -135.852 160.325 96)" gradientUnits="userSpaceOnUse">
            <stop offset=".15" stopColor="#ffe921" />
            <stop offset="1" stopColor="#fec700" />
          </radialGradient>
          <filter id={`${p}e`} width="166" height="180" x="45.91" y="8" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur result="effect1_foregroundBlur_37584_9338" stdDeviation="14" />
          </filter>
        </defs>
      </g>
    </svg>
  );
}

/** Zoom (the Zoom Workplace app icon). */
export function ZoomLogo({ className = "" }: LogoProps) {
  const p = useIds();
  return (
    <svg viewBox="0 0 256 256" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${p}a`} x1="23.666%" x2="76.334%" y1="95.612%" y2="4.388%">
          <stop offset="0%" stopColor="#0845bf" />
          <stop offset="19.11%" stopColor="#0950de" />
          <stop offset="38.23%" stopColor="#0b59f6" />
          <stop offset="50%" stopColor="#0b5cff" />
          <stop offset="67.32%" stopColor="#0e5efe" />
          <stop offset="77.74%" stopColor="#1665fc" />
          <stop offset="86.33%" stopColor="#246ff9" />
          <stop offset="93.88%" stopColor="#387ff4" />
          <stop offset="100%" stopColor="#4f90ee" />
        </linearGradient>
      </defs>
      <path fill={`url(#${p}a)`} d="M256 128c0 13.568-1.024 27.136-3.328 40.192c-6.912 43.264-41.216 77.568-84.48 84.48C155.136 254.976 141.568 256 128 256s-27.136-1.024-40.192-3.328c-43.264-6.912-77.568-41.216-84.48-84.48C1.024 155.136 0 141.568 0 128s1.024-27.136 3.328-40.192c6.912-43.264 41.216-77.568 84.48-84.48C100.864 1.024 114.432 0 128 0s27.136 1.024 40.192 3.328c43.264 6.912 77.568 41.216 84.48 84.48C254.976 100.864 256 114.432 256 128" />
      <path fill="#fff" d="M204.032 207.872H75.008c-8.448 0-16.64-4.608-20.48-12.032c-4.608-8.704-2.816-19.2 4.096-26.112l89.856-89.856H83.968c-17.664 0-32-14.336-32-32h118.784c8.448 0 16.64 4.608 20.48 12.032c4.608 8.704 2.816 19.2-4.096 26.112l-89.6 90.112h74.496c17.664 0 32 14.08 32 31.744" />
    </svg>
  );
}

/** Microsoft Teams (the 2025 icon). */
export function TeamsLogo({ className = "" }: LogoProps) {
  const p = useIds();
  return (
    <svg viewBox="4 4 36 38" className={className} aria-hidden>
      <g fill="none">
        <path fill={`url(#${p}a)`} d="M22 20h12a6 6 0 0 1 6 6v10a6 6 0 0 1-12 0V26a6 6 0 0 0-6-6" />
        <path fill={`url(#${p}b)`} d="M8 24a6 6 0 0 1 6-6h8a6 6 0 0 1 6 6v12a6 6 0 0 0 6 6H18c-5.523 0-10-4.477-10-10z" />
        <path fill={`url(#${p}l)`} fillOpacity=".7" d="M8 24a6 6 0 0 1 6-6h8a6 6 0 0 1 6 6v12a6 6 0 0 0 6 6H18c-5.523 0-10-4.477-10-10z" />
        <path fill={`url(#${p}c)`} fillOpacity=".7" d="M8 24a6 6 0 0 1 6-6h8a6 6 0 0 1 6 6v12a6 6 0 0 0 6 6H18c-5.523 0-10-4.477-10-10z" />
        <path fill={`url(#${p}d)`} d="M33 18a5 5 0 1 0 0-10a5 5 0 0 0 0 10" />
        <path fill={`url(#${p}e)`} fillOpacity=".46" d="M33 18a5 5 0 1 0 0-10a5 5 0 0 0 0 10" />
        <path fill={`url(#${p}f)`} fillOpacity=".4" d="M33 18a5 5 0 1 0 0-10a5 5 0 0 0 0 10" />
        <path fill={`url(#${p}g)`} d="M18 16a6 6 0 1 0 0-12a6 6 0 0 0 0 12" />
        <path fill={`url(#${p}h)`} fillOpacity=".6" d="M18 16a6 6 0 1 0 0-12a6 6 0 0 0 0 12" />
        <path fill={`url(#${p}i)`} fillOpacity=".5" d="M18 16a6 6 0 1 0 0-12a6 6 0 0 0 0 12" />
        <rect width="16" height="16" x="4" y="23" fill={`url(#${p}j)`} rx="3.25" />
        <rect width="16" height="16" x="4" y="23" fill={`url(#${p}k)`} fillOpacity=".7" rx="3.25" />
        <path fill="#fff" d="M15.48 28.105h-2.448v7.466h-2.065v-7.466H8.52V26.43h6.96z" />
        <defs>
          <radialGradient id={`${p}a`} cx="0" cy="0" r="1" gradientTransform="matrix(13.4784 0 0 33.2694 39.797 22.174)" gradientUnits="userSpaceOnUse">
            <stop stopColor="#a98aff" />
            <stop offset=".14" stopColor="#8c75ff" />
            <stop offset=".565" stopColor="#5f50e2" />
            <stop offset=".9" stopColor="#3c2cb8" />
          </radialGradient>
          <radialGradient id={`${p}b`} cx="0" cy="0" r="1" gradientTransform="rotate(68.154 -7.716 14.713)scale(32.752 33.1231)" gradientUnits="userSpaceOnUse">
            <stop stopColor="#85c2ff" />
            <stop offset=".69" stopColor="#7588ff" />
            <stop offset="1" stopColor="#6459fe" />
          </radialGradient>
          <radialGradient id={`${p}c`} cx="0" cy="0" r="1" gradientTransform="rotate(113.326 8.093 17.645)scale(19.2186 15.4273)" gradientUnits="userSpaceOnUse">
            <stop stopColor="#bd96ff" />
            <stop offset=".687" stopColor="#bd96ff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${p}d`} cx="0" cy="0" r="1" gradientTransform="matrix(0 -10 12.6216 0 33 11.571)" gradientUnits="userSpaceOnUse">
            <stop offset=".268" stopColor="#6868f7" />
            <stop offset="1" stopColor="#3923b1" />
          </radialGradient>
          <radialGradient id={`${p}e`} cx="0" cy="0" r="1" gradientTransform="rotate(40.052 -.03 44.872)scale(7.14629 10.3363)" gradientUnits="userSpaceOnUse">
            <stop offset=".271" stopColor="#a1d3ff" />
            <stop offset=".813" stopColor="#a1d3ff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${p}f`} cx="0" cy="0" r="1" gradientTransform="rotate(-41.658 32.118 -43.42)scale(8.51275 20.8824)" gradientUnits="userSpaceOnUse">
            <stop stopColor="#e3acfd" />
            <stop offset=".816" stopColor="#9fa2ff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${p}g`} cx="0" cy="0" r="1" gradientTransform="matrix(0 -12 15.146 0 18 8.286)" gradientUnits="userSpaceOnUse">
            <stop offset=".268" stopColor="#8282ff" />
            <stop offset="1" stopColor="#3923b1" />
          </radialGradient>
          <radialGradient id={`${p}h`} cx="0" cy="0" r="1" gradientTransform="rotate(40.052 -3.155 21.416)scale(8.57554 12.4035)" gradientUnits="userSpaceOnUse">
            <stop offset=".271" stopColor="#a1d3ff" />
            <stop offset=".813" stopColor="#a1d3ff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${p}i`} cx="0" cy="0" r="1" gradientTransform="rotate(-41.658 20.382 -26.516)scale(10.2153 25.0589)" gradientUnits="userSpaceOnUse">
            <stop stopColor="#e3acfd" />
            <stop offset=".816" stopColor="#9fa2ff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${p}j`} cx="0" cy="0" r="1" gradientTransform="rotate(45 -25.763 16.328)scale(22.6274)" gradientUnits="userSpaceOnUse">
            <stop offset=".047" stopColor="#688eff" />
            <stop offset=".947" stopColor="#230f94" />
          </radialGradient>
          <radialGradient id={`${p}k`} cx="0" cy="0" r="1" gradientTransform="matrix(0 11.2 -13.0702 0 12 32.6)" gradientUnits="userSpaceOnUse">
            <stop offset=".571" stopColor="#6965f6" stopOpacity="0" />
            <stop offset="1" stopColor="#8f8fff" />
          </radialGradient>
          <linearGradient id={`${p}l`} x1="20.594" x2="20.594" y1="18" y2="42" gradientUnits="userSpaceOnUse">
            <stop offset=".801" stopColor="#6864f6" stopOpacity="0" />
            <stop offset="1" stopColor="#5149de" />
          </linearGradient>
        </defs>
      </g>
    </svg>
  );
}

/** Microsoft To Do. */
export function MicrosoftToDoLogo({ className = "" }: LogoProps) {
  const p = useIds();
  return (
    <svg viewBox="0 0 512 512" className={className} aria-hidden>
      <path fill="#195abd" d="m6.5 240.3l74.8-74.8c8.6-8.6 22.7-8.6 31.3 0l180.8 180.8c8.6 8.6 8.6 22.7 0 31.3l-74.8 74.8c-8.6 8.6-22.7 8.6-31.3 0L6.5 271.7c-8.7-8.7-8.7-22.7 0-31.4" />
      <linearGradient id={`${p}a`} x1="157.99" x2="476.24" y1="811.473" y2="493.224" gradientTransform="translate(-8.065 -396.349)" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#2987e6" />
        <stop offset=".994" stopColor="#58c1f5" />
      </linearGradient>
      <path fill={`url(#${p}a)`} d="m430.8 59.5l74.8 74.8c8.6 8.6 8.6 22.7 0 31.3l-287 286.9c-8.6 8.6-22.7 8.6-31.3 0l-74.8-74.8c-8.6-8.6-8.6-22.7 0-31.3L399.4 59.5c8.7-8.6 22.7-8.6 31.4 0" />
    </svg>
  );
}

/** Google Tasks (the 2025 icon). */
export function GoogleTasksLogo({ className = "" }: LogoProps) {
  const p = useIds();
  return (
    <svg viewBox="0 0 192 192" className={className} aria-hidden>
      <g fill="none">
        <g clipPath={`url(#${p}b)`}>
          <rect width="152" height="130" x="20" y="52" fill="#bbe2ff" rx="65" />
          <rect width="172" height="152" x="10" y="14" fill="#3186ff" rx="74" />
          <mask id={`${p}a`} width="172" height="152" x="10" y="14" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }}>
            <rect width="172" height="152" x="10" y="14" fill="#3c90ff" rx="74" />
          </mask>
          <g filter={`url(#${p}e)`} mask={`url(#${p}a)`}>
            <rect width="152" height="130" x="20" y="52" fill={`url(#${p}d)`} rx="65" />
          </g>
          <g clipPath={`url(#${p}c)`}>
            <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12" d="m61 90l22.172 22.172a4 4 0 0 0 5.656 0L138 63" />
          </g>
        </g>
        <defs>
          <clipPath id={`${p}b`}>
            <path fill="#fff" d="M0 0h192v192H0z" />
          </clipPath>
          <clipPath id={`${p}c`}>
            <path fill="#fff" d="M44 38h104v104H44z" />
          </clipPath>
          <linearGradient id={`${p}d`} x1="96" x2="100.64" y1="166.9" y2="67.25" gradientUnits="userSpaceOnUse">
            <stop offset=".01" stopColor="#a9a8ff" />
            <stop offset=".79" stopColor="#a9a8ff" stopOpacity="0" />
          </linearGradient>
          <filter id={`${p}e`} width="176" height="154" x="8" y="40" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur result="effect1_foregroundBlur_37601_9976" stdDeviation="6" />
          </filter>
        </defs>
      </g>
    </svg>
  );
}
