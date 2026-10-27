import type { ReactNode } from "react";
import { Check, Clock } from "lucide-react";

/*
 * Small building blocks shared by the home sections and the legal pages, in
 * the landing page's style: the two-tone headline (white line, dim second
 * line), quiet dark surfaces and the crimson accent.
 */

/** "Available <month>" / "Coming soon" pill for features that are not shipped yet. */
export function AvailableLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-[#ffd9a0]/25 bg-[#ffd9a0]/10 px-2.5 py-1 text-[0.72rem] font-medium whitespace-nowrap text-[#ffd9a0] ${className}`}
    >
      <Clock className="h-3 w-3" aria-hidden />
      {children}
    </span>
  );
}

/** Small bordered tag (e.g. "Android only"). */
export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/12 bg-white/[0.04] px-2.5 py-1 text-[0.72rem] font-medium whitespace-nowrap text-white/70">
      {children}
    </span>
  );
}

export function Headline({
  as: As = "h2",
  line1,
  line2,
  className = "",
  id,
}: {
  as?: "h1" | "h2";
  line1: ReactNode;
  line2?: ReactNode;
  className?: string;
  id?: string;
}) {
  const size = As === "h1" ? "text-[2.3rem] sm:text-[3.2rem] leading-[1.08]" : "text-[1.9rem] sm:text-[2.4rem] leading-[1.2]";
  return (
    <As id={id} className={`font-semibold tracking-[-0.025em] text-balance ${size} ${className}`}>
      {line1}
      {line2 && (
        <>
          <br />
          <span className="text-white/50">{line2}</span>
        </>
      )}
    </As>
  );
}

/** Check-mark list in the accent colour. */
export function CheckList({ items, className = "" }: { items: readonly ReactNode[]; className?: string }) {
  return (
    <ul className={`space-y-3 ${className}`}>
      {items.map((p, i) => (
        <li key={i} className="flex items-start gap-3 text-[0.95rem] text-white/80">
          <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent/15">
            <Check className="h-3 w-3 text-[#ff8a95]" strokeWidth={3} aria-hidden />
          </span>
          {p}
        </li>
      ))}
    </ul>
  );
}

/** Long-form text sections (legal). Each body is plain paragraphs or a list. */
export function Prose({ sections }: { sections: readonly { heading: string; body: readonly string[]; list?: readonly string[] }[] }) {
  return (
    <div className="surface mx-auto max-w-3xl space-y-9 rounded-2xl p-6 sm:p-10">
      {sections.map((s) => (
        <div key={s.heading}>
          <h2 className="text-[1.15rem] font-semibold text-white">{s.heading}</h2>
          {s.body.map((p) => (
            <p key={p} className="mt-3 leading-relaxed text-white/65">
              {p}
            </p>
          ))}
          {s.list && (
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-white/65 marker:text-white/30">
              {s.list.map((li) => (
                <li key={li}>{li}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

/** Amber notice for content that still has to be supplied (e.g. the final legal text). */
export function DraftNotice({ children }: { children: ReactNode }) {
  return (
    <p className="mx-auto mb-6 max-w-3xl rounded-xl border border-[#ffd9a0]/25 bg-[#ffd9a0]/[0.07] px-4 py-3 text-[0.85rem] text-[#ffd9a0]">
      {children}
    </p>
  );
}
