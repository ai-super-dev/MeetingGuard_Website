import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Check, Clock } from "lucide-react";
import { Reveal } from "@/components/motion";
import { StoreBadges } from "@/components/ui/StoreBadges";
import { AppIcon } from "@/components/ui/Logo";

/*
 * Building blocks for every inner page, in the landing page's style: the
 * two-tone headline (white line, dim second line), mono eyebrow, quiet dark
 * surfaces and the crimson accent.
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

/** Top of an inner page: eyebrow, two-tone h1, lead, optional actions and visual. */
export function PageHero({
  eyebrow,
  line1,
  line2,
  lead,
  label,
  children,
  visual,
}: {
  eyebrow: string;
  line1: ReactNode;
  line2?: ReactNode;
  lead?: ReactNode;
  label?: ReactNode;
  children?: ReactNode;
  visual?: ReactNode;
}) {
  const text = (
    <div className={visual ? "text-center lg:text-left" : "mx-auto max-w-3xl text-center"}>
      <div className={`flex flex-wrap items-center gap-3 ${visual ? "justify-center lg:justify-start" : "justify-center"}`}>
        <p className="eyebrow">{eyebrow}</p>
        {label}
      </div>
      <Headline as="h1" line1={line1} line2={line2} className="mt-4" />
      {lead && <p className={`mt-5 text-[1.05rem] leading-relaxed text-white/60 ${visual ? "mx-auto max-w-xl lg:mx-0" : "mx-auto max-w-2xl"}`}>{lead}</p>}
      {children && <div className={`mt-8 flex flex-wrap gap-3 ${visual ? "justify-center lg:justify-start" : "justify-center"}`}>{children}</div>}
    </div>
  );
  return (
    <section className="relative overflow-x-clip pt-32 pb-14 sm:pt-40 sm:pb-[4.5rem]">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(190,20,40,0.22),transparent)] blur-2xl"
      />
      <div className="container-page relative">
        {visual ? (
          <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-10">
            <Reveal>{text}</Reveal>
            <Reveal delay={0.15} className="flex justify-center">
              {visual}
            </Reveal>
          </div>
        ) : (
          <Reveal>{text}</Reveal>
        )}
      </div>
    </section>
  );
}

/** A page section with the standard rhythm (same gap as the landing page). */
export function Section({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`relative overflow-x-clip py-14 sm:py-[4.5rem] ${className}`}>
      <div className="container-page relative">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  line1,
  line2,
  body,
  align = "center",
  label,
}: {
  eyebrow?: string;
  line1: ReactNode;
  line2?: ReactNode;
  body?: ReactNode;
  align?: "center" | "left";
  label?: ReactNode;
}) {
  const center = align === "center";
  return (
    <Reveal className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {(eyebrow || label) && (
        <div className={`flex flex-wrap items-center gap-3 ${center ? "justify-center" : ""}`}>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          {label}
        </div>
      )}
      <Headline line1={line1} line2={line2} className="mt-3" />
      {body && <p className={`mt-4 text-[0.98rem] leading-relaxed text-white/60 ${center ? "mx-auto max-w-xl" : ""}`}>{body}</p>}
    </Reveal>
  );
}

/** Dark card used for points, steps and FAQ groups. */
export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`surface rounded-2xl p-6 sm:p-7 ${className}`}>{children}</div>;
}

/** Grid of point cards: icon, title, text and an optional label. */
export function PointGrid({
  items,
  columns = 3,
}: {
  items: { icon?: ReactNode; title: string; body: ReactNode; label?: ReactNode }[];
  columns?: 2 | 3;
}) {
  return (
    <div className={`mt-12 grid gap-4 md:grid-cols-2 ${columns === 3 ? "lg:grid-cols-3" : ""}`}>
      {items.map((it, i) => (
        <Reveal key={it.title} delay={(i % 3) * 0.06} className="h-full">
          <Card className="h-full">
            <div className="flex items-start justify-between gap-3">
              {it.icon && (
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/[0.05] text-white/80 ring-1 ring-white/[0.08]">{it.icon}</span>
              )}
              {it.label}
            </div>
            <h3 className={`${it.icon ? "mt-5" : ""} text-[1.02rem] font-semibold text-white`}>{it.title}</h3>
            <div className="mt-2 text-[0.9rem] leading-relaxed text-white/60">{it.body}</div>
          </Card>
        </Reveal>
      ))}
    </div>
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

/** Text link with an arrow. */
export function ArrowLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={`group inline-flex items-center gap-1.5 text-[0.9rem] font-medium text-white/85 transition-colors hover:text-white ${className}`}>
      {children}
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
    </Link>
  );
}

/** Secondary button (outline). */
export function ButtonLink({ href, children, primary = false }: { href: string; children: ReactNode; primary?: boolean }) {
  return (
    <Link
      href={href}
      className={
        primary
          ? "inline-flex h-12 items-center gap-2 rounded-xl bg-[#f4f4f5] px-5 text-[0.9rem] font-medium text-[#0b0b0e] transition hover:bg-white"
          : "inline-flex h-12 items-center gap-2 rounded-xl border border-white/12 px-5 text-[0.9rem] font-medium text-white/85 transition hover:border-white/25 hover:text-white"
      }
    >
      {children}
    </Link>
  );
}

/** Closing call to action with the store badges, used at the end of inner pages. */
export function CtaBand({ line1, line2, body }: { line1: string; line2?: string; body?: string }) {
  return (
    <section className="relative overflow-x-clip pt-14 pb-24 sm:pt-[4.5rem] sm:pb-32">
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 h-[420px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(190,20,40,0.24),transparent)] blur-2xl"
      />
      <Reveal className="container-page relative flex flex-col items-center text-center">
        <AppIcon className="h-[96px] w-[96px] sm:h-[112px] sm:w-[112px]" />
        <Headline line1={line1} line2={line2} className="mt-10" />
        {body && <p className="mt-4 max-w-xl text-white/60">{body}</p>}
        <StoreBadges className="mt-8 justify-center" />
      </Reveal>
    </section>
  );
}

/** Long-form text sections (legal, security). Each body is plain paragraphs or a list. */
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
