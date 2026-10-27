import QRCode from "qrcode";
import { localize, type Lang } from "@/lib/routes";
import { siteConfig } from "@/lib/site";
import { FooterAwareDock } from "./FooterAwareDock";

/** QR code as a single SVG path, generated synchronously at render/build time. */
export function QrSvg({ value, className }: { value: string; className?: string }) {
  const { modules } = QRCode.create(value, { errorCorrectionLevel: "M" });
  const n = modules.size;
  let d = "";
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (modules.get(y, x)) d += `M${x} ${y}h1v1h-1z`;
    }
  }
  return (
    <svg viewBox={`-2 -2 ${n + 4} ${n + 4}`} className={className} aria-hidden shapeRendering="crispEdges">
      <rect x="-2" y="-2" width={n + 4} height={n + 4} fill="#fff" />
      <path d={d} fill="#000" />
    </svg>
  );
}

/** Desktop-only corner card: scanning it opens the site on the phone. */
export function QrDownload({ lang }: { lang: Lang }) {
  return (
    <FooterAwareDock className="fixed right-5 bottom-5 z-40 hidden flex-col items-center gap-2 rounded-2xl border border-white/10 bg-bar/90 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-md lg:flex">
      <QrSvg value={`${siteConfig.url}${localize("/", lang)}`} className="h-[104px] w-[104px] rounded-md" />
    </FooterAwareDock>
  );
}
