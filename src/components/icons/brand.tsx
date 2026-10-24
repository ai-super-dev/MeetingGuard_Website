import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = (props: IconProps) => ({
  viewBox: "0 0 24 24",
  "aria-hidden": true,
  focusable: false,
  ...props,
});

export function GoogleCalendarIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6.5 3h11v3.5h-11z" fill="#4285F4" />
      <path d="M3 5a2 2 0 0 1 2-2h1.5v3.5H3z" fill="#1967D2" />
      <path d="M17.5 3H19a2 2 0 0 1 2 2v1.5h-3.5z" fill="#4285F4" />
      <path d="M3 6.5h3.5v11H3z" fill="#4285F4" />
      <path d="M17.5 6.5H21v11h-3.5z" fill="#FBBC04" />
      <path d="M6.5 17.5h11V21h-11z" fill="#34A853" />
      <path d="M3 17.5h3.5V21H5a2 2 0 0 1-2-2z" fill="#188038" />
      <path d="M17.5 17.5H21L17.5 21z" fill="#EA4335" />
      <rect x="6.5" y="6.5" width="11" height="11" fill="#fff" />
      <text
        x="12"
        y="15.1"
        textAnchor="middle"
        fontSize="7"
        fontWeight="700"
        fontFamily="Arial, sans-serif"
        fill="#4285F4"
      >
        31
      </text>
    </svg>
  );
}

export function OutlookIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="8" y="4" width="14" height="16" rx="2" fill="#0364B8" />
      <path d="M8 12h14v6a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2z" fill="#28A8EA" />
      <path d="M8 12l7 4 7-4" fill="none" stroke="#0A2767" strokeWidth="0.9" />
      <rect x="2" y="6.5" width="11" height="11" rx="1.6" fill="#0078D4" />
      <ellipse cx="7.5" cy="12" rx="2.5" ry="3.1" fill="none" stroke="#fff" strokeWidth="1.6" />
    </svg>
  );
}

export function PhoneCalendarIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="3" width="18" height="18" rx="3" fill="#fff" />
      <path d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v2.5H3z" fill="#FF3B30" />
      <path d="M6 5.6h12" stroke="#fff" strokeWidth="0.9" strokeDasharray="1.2 1" />
      <text
        x="12"
        y="18.2"
        textAnchor="middle"
        fontSize="8.5"
        fontWeight="700"
        fontFamily="Arial, sans-serif"
        fill="#1d4ed8"
      >
        17
      </text>
    </svg>
  );
}

export function ZoomIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="2" y="2" width="20" height="20" rx="5.5" fill="#2D8CFF" />
      <rect x="5.2" y="8.4" width="9.6" height="7.2" rx="1.7" fill="#fff" />
      <path d="M15.6 11.1l3.4-2.3v6.4l-3.4-2.3z" fill="#fff" />
    </svg>
  );
}

export function GoogleMeetIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M2 9l4-4v4z" fill="#EA4335" />
      <path d="M6 5h7.2A1.8 1.8 0 0 1 15 6.8V9H6z" fill="#FFBA00" />
      <path d="M2 9h4v6H2z" fill="#2684FC" />
      <path d="M2 15h4v4H3.8A1.8 1.8 0 0 1 2 17.2z" fill="#0066DA" />
      <path d="M6 15h9v2.2a1.8 1.8 0 0 1-1.8 1.8H6z" fill="#00AC47" />
      <path d="M12.2 9H15v6h-2.8z" fill="#00832D" />
      <path d="M15 10.2l5.6-4.1c.6-.4 1.4 0 1.4.7v10.4c0 .7-.8 1.1-1.4.7L15 13.8z" fill="#00AC47" />
    </svg>
  );
}

export function TeamsIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="18.3" cy="5.6" r="2.4" fill="#7B83EB" />
      <rect x="7.5" y="7" width="14.5" height="12" rx="3" fill="#7B83EB" />
      <circle cx="12.5" cy="4.6" r="2.6" fill="#5059C9" />
      <rect x="2" y="7.2" width="11" height="11" rx="1.6" fill="#4B53BC" />
      <path d="M4.6 9.6h5.8V11H8.2v4.8H6.8V11H4.6z" fill="#fff" />
    </svg>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="2" y="2" width="20" height="20" rx="5.5" fill="#25D366" />
      <path
        d="M12 5.2a6.8 6.8 0 0 0-5.9 10.2l-.9 3.4 3.5-.9A6.8 6.8 0 1 0 12 5.2z"
        fill="none"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9.7 8.8c.2-.4.4-.4.6-.4h.5c.2 0 .4.1.5.4l.6 1.5c.1.2 0 .4-.1.6l-.4.5c-.1.1-.1.3 0 .4.6.9 1.3 1.6 2.2 2.1.2.1.3.1.5-.1l.5-.6c.2-.2.4-.2.6-.1l1.4.7c.2.1.3.3.3.5 0 .6-.3 1.2-.9 1.5-.5.3-1.3.3-2 .1-1.7-.6-3.2-1.9-4-3.6-.4-.9-.6-2-.3-2.6z"
        fill="#fff"
      />
    </svg>
  );
}

export function AppleIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor">
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}

export function GooglePlayIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3.6 2.2L13.4 12l-9.8 9.8c-.3-.2-.5-.6-.5-1.1V3.3c0-.5.2-.9.5-1.1z" fill="#32BBFF" />
      <path d="M3.6 2.2c.4-.3.9-.3 1.5 0l11.5 6.6-3.2 3.2z" fill="#32D873" />
      <path d="M16.6 8.8l3.7 2.1c1 .6 1 1.6 0 2.2l-3.7 2.1-3.2-3.2z" fill="#FFD400" />
      <path d="M13.4 12l3.2 3.2-11.5 6.6c-.6.3-1.1.3-1.5 0z" fill="#FF3A44" />
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  );
}

export function LinkedInIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
    </svg>
  );
}

export function YouTubeIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor">
      <path
        fillRule="evenodd"
        d="M5.5 4.5h13A4.5 4.5 0 0 1 23 9v6a4.5 4.5 0 0 1-4.5 4.5h-13A4.5 4.5 0 0 1 1 15V9a4.5 4.5 0 0 1 4.5-4.5zM9.8 8.6v6.8l5.9-3.4z"
      />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.4" />
      <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function AndroidIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="#3ddc84">
      <path d="M6 9.5h12V17a1.5 1.5 0 0 1-1.5 1.5H15V21a1.25 1.25 0 0 1-2.5 0v-2.5h-1V21a1.25 1.25 0 0 1-2.5 0v-2.5H7.5A1.5 1.5 0 0 1 6 17z" />
      <path d="M6 8.75a6 6 0 0 1 12 0z" />
      <path d="M8.2 2.6 9.4 4.7M15.8 2.6l-1.2 2.1" stroke="#3ddc84" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="9.6" cy="6.7" r="0.75" fill="#0b0b0e" />
      <circle cx="14.4" cy="6.7" r="0.75" fill="#0b0b0e" />
      <rect x="3" y="10" width="2.2" height="6" rx="1.1" />
      <rect x="18.8" y="10" width="2.2" height="6" rx="1.1" />
    </svg>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor">
      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
    </svg>
  );
}

export function TikTokIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}
