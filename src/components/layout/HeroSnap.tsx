"use client";

import { useEffect } from "react";
import { animate, useReducedMotion } from "motion/react";

const GLIDE = { duration: 0.9, ease: [0.65, 0, 0.35, 1] as const };
/** Space between the floating header's bottom edge and the calendar section's eyebrow. */
const GAP = 44;
/** Wheel silence (ms) that marks the end of trackpad inertia after a glide. */
const QUIET_MS = 180;

/** Page offset of an element, ignoring transforms (its Reveal may still be mid-animation). */
function pageTop(el: HTMLElement) {
  let top = 0;
  for (let n: HTMLElement | null = el; n; n = n.offsetParent as HTMLElement | null) top += n.offsetTop;
  return top;
}

/**
 * Hero ↔ calendar section glide. One scroll down from the hero lands with the
 * calendar section fully in view; one scroll up from there returns to the hero,
 * so the half-hero / half-calendar view is never left on screen. Below the
 * calendar section the page scrolls normally, and scrollbar drags are untouched.
 */
export function HeroSnap() {
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

    const target = () => {
      const anchor = document.querySelector<HTMLElement>("[data-snap-anchor]");
      if (!anchor) return 0;
      const bar = document.querySelector("header > div");
      const headerBottom = bar ? bar.getBoundingClientRect().bottom : 0;
      return Math.max(0, Math.round(pageTop(anchor) - headerBottom - GAP));
    };

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
      const t = target();
      const y = window.scrollY;
      if (dy > 0 && y < t - 1) return t; // down from the hero → calendar section
      if (dy < 0 && y > 0 && y <= t + 1) return 0; // up from the calendar section → hero
      if (dy < 0 && y > t + 1 && y + dy < t) return t; // coming back up: stop with the section in full first
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
    // a touch fling can coast into the in-between view; finish it to the nearer end
    const onScrollEnd = () => {
      if (gliding || Date.now() - lastTouch > 1500) return;
      const t = target();
      const y = window.scrollY;
      if (y > 1 && y < t - 1) glide(y > t / 2 ? t : 0);
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
