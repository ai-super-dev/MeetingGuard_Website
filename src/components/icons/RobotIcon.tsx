import type { SVGProps } from "react";

/** Friendly assistant robot head used for the AI features. */
export function RobotIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden focusable={false} {...props}>
      <path d="M24 4.5v5" stroke="#e8f1ff" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="24" cy="4.2" r="2.6" fill="#e8f1ff" />
      <rect x="7" y="20" width="4" height="10" rx="2" fill="#c9dcff" />
      <rect x="37" y="20" width="4" height="10" rx="2" fill="#c9dcff" />
      <rect x="10" y="10" width="28" height="26" rx="10" fill="#f2f7ff" />
      <rect x="14" y="15.5" width="20" height="14" rx="7" fill="#0d1a4a" />
      <ellipse cx="19.6" cy="22.5" rx="2.4" ry="2.9" fill="#4cc9ff" />
      <ellipse cx="28.4" cy="22.5" rx="2.4" ry="2.9" fill="#4cc9ff" />
      <path d="M16 38h16a4 4 0 0 1 4 4v2H12v-2a4 4 0 0 1 4-4z" fill="#c9dcff" />
    </svg>
  );
}
