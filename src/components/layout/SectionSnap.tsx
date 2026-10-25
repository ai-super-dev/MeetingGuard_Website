"use client";

import { useEffect } from "react";
import { animate, useReducedMotion } from "motion/react";

const GLIDE = { duration: 0.9, ease: [0.65, 0, 0.35, 1] as const };
/** Space between the floating header's bottom edge and a section's eyebrow when a glide lands. */
const GAP = 44;
/** Space kept under the "Why MeetingGuard" cards when gliding back up to them. */
const END_GAP = 40;
/** Wheel silence (ms) that marks the end of trackpad inertia after a glide. */
const QUIET_MS = 180;

/** Page offset of an element, ignoring transforms (its Reveal may still be mid-animation). */
function pageTop(el: HTMLElement) {
  let top = 0;
  for (let n: HTMLElement | null = el; n; n = n.offsetParent as HTMLElement | null) top += n.offsetTop;
  return top;
}

/** Scroll position that puts `[data-snap=name]` just under the header. */
function landing(name: string) {
  const el = document.querySelector<HTMLElement>(`[data-snap="${name}"]`);
  if (!el) return null;
  const bar = document.querySelector("header > div");
  const headerBottom = bar ? bar.getBoundingClientRect().bottom : 0;
  return Math.max(0, Math.round(pageTop(el) - headerBottom - GAP));
}

/**
 * Glide zones, each a [top, bottom] scroll range the page never rests inside:
 *   hero → "Why MeetingGuard" (its eyebrow under the header), and
 *   the end of the "Why" cards → "How it works".
 * The calendar section is taller than the screen, so between its top and the
 * bottom of its cards the page scrolls normally.
 */
function zones(): [number, number][] {
  const why = landing("why");
  const how = landing("how");
  const end = document.querySelector<HTMLElement>('[data-snap="why-end"]');
  const out: [number, number][] = [];
  if (why === null) return out;
  out.push([0, why]);
  if (how !== null && end) {
    const cardsInView = Math.round(pageTop(end) + end.offsetHeight + END_GAP - window.innerHeight);
    const top = Math.max(why, cardsInView);
    if (how > top) out.push([top, how]);
  }
  return out;
}

/**
 * Section glides: a scroll that would leave two sections half on screen glides
 * to the next section instead (and back up), so the half-and-half view never
 * stays on screen. Elsewhere the page scrolls normally, and scrollbar drags are
 * untouched.
 */
export function SectionSnap() {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    let controls: ReturnType<typeof animate> | undefined;
    let gliding = false;
    let quiet = true; // false while a glide's input (trackpad inertia, the same swipe) is still arriving
    let quietTimer: ReturnType<typeof setTimeout> | undefined;
    let swipeUsed = false; // the current touch gesture already triggered a glide
    let touchY: number | null = null;
    let lastTouch = 0;

    const waitForQuiet = () => {
      clearTimeout(quietTimer);
      quietTimer = setTimeout(() => (quiet = true), QUIET_MS);
    };

    const glide = (to: number) => {
      gliding = true;
      quiet = false;
      controls?.stop();
      controls = animate(window.scrollY, to, {
        ...GLIDE,
        onUpdate: (v) => window.scrollTo({ top: v, behavior: "instant" }),
        onComplete: () => {
          gliding = false;
          waitForQuiet();
        },
      });
    };

    /** Where a scroll of `dy` px from here should glide to instead, or null to scroll normally. */
    const redirect = (dy: number): number | null => {
      const y = window.scrollY;
      for (const [top, bottom] of zones()) {
        if (dy > 0) {
          if (y >= top - 1 && y < bottom - 1) return bottom; // down from the upper section → the next one
          if (y < top - 1 && y + dy > top) return bottom; // scrolling down into the zone
        } else {
          if (y > top + 1 && y <= bottom + 1) return top; // up from the lower section → back
          if (y > bottom + 1 && y + dy < bottom) return bottom; // coming back up: stop with the section in full first
        }
      }
      return null;
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      if (gliding || !quiet) {
        e.preventDefault();
        if (!gliding) waitForQuiet();
        return;
      }
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
      const to = redirect(e.deltaY * unit);
      if (to === null) return;
      e.preventDefault();
      glide(to);
    };

    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0]?.clientY ?? null;
      swipeUsed = false;
      lastTouch = Date.now();
    };
    const onTouchMove = (e: TouchEvent) => {
      lastTouch = Date.now();
      if (gliding || swipeUsed) {
        e.preventDefault();
        return;
      }
      if (touchY === null || e.touches.length > 1) return;
      const dy = touchY - e.touches[0].clientY; // finger moving up = scrolling down
      if (Math.abs(dy) < 10) return;
      const to = redirect(dy);
      if (to === null) return;
      e.preventDefault();
      swipeUsed = true;
      glide(to);
    };
    // a touch fling can coast into a zone; finish it to the nearer end
    const onScrollEnd = () => {
      if (gliding || Date.now() - lastTouch > 1500) return;
      const y = window.scrollY;
      const zone = zones().find(([top, bottom]) => y > top + 1 && y < bottom - 1);
      if (zone) glide(y > (zone[0] + zone[1]) / 2 ? zone[1] : zone[0]);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      const el = e.target as HTMLElement | null;
      if (el?.closest("input, textarea, select, [contenteditable]")) return;
      if (e.key === " " && el?.closest("button, a, [role=button]")) return;
      const page = window.innerHeight * 0.85;
      const dy =
        e.key === "ArrowDown" ? 40 : e.key === "ArrowUp" ? -40
        : e.key === "PageDown" || (e.key === " " && !e.shiftKey) ? page
        : e.key === "PageUp" || (e.key === " " && e.shiftKey) ? -page
        : 0;
      if (!dy) return;
      if (gliding) {
        e.preventDefault();
        return;
      }
      const to = redirect(dy);
      if (to === null) return;
      e.preventDefault();
      glide(to);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("scrollend", onScrollEnd);
    window.addEventListener("keydown", onKey);
    return () => {
      controls?.stop();
      clearTimeout(quietTimer);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("scrollend", onScrollEnd);
      window.removeEventListener("keydown", onKey);
    };
  }, [reduce]);

  return null;
}
