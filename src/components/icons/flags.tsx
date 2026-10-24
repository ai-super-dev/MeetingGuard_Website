import type { SVGProps } from "react";

type FlagProps = SVGProps<SVGSVGElement>;

/* Drawn as SVG: emoji flags don't render on Windows. */

export function UsFlag(props: FlagProps) {
  return (
    <svg viewBox="0 0 24 16" aria-hidden focusable={false} {...props}>
      <rect width="24" height="16" fill="#B22234" />
      {[1, 3, 5, 7, 9, 11].map((i) => (
        <rect key={i} y={(i * 16) / 13} width="24" height={16 / 13} fill="#fff" />
      ))}
      <rect width="10.4" height={(7 * 16) / 13} fill="#3C3B6E" />
      {[1.4, 3.3, 5.2, 7.1].flatMap((y, r) =>
        (r % 2 ? [2.6, 5.2, 7.8] : [1.3, 3.9, 6.5, 9.1]).map((x) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="0.55" fill="#fff" />
        )),
      )}
    </svg>
  );
}

export function SpainFlag(props: FlagProps) {
  return (
    <svg viewBox="0 0 24 16" aria-hidden focusable={false} {...props}>
      <rect width="24" height="16" fill="#AA151B" />
      <rect y="4" width="24" height="8" fill="#F1BF00" />
      <rect x="5.2" y="6" width="2.6" height="4" rx="0.6" fill="#AA151B" opacity="0.85" />
    </svg>
  );
}
