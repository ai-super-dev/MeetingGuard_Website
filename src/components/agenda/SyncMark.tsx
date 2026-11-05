"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useA } from "@/lib/agenda/i18n";
import type { SyncPlace, SyncStatus } from "@/lib/agenda/store";

/** "Microsoft To Do and Google Tasks". */
export function usePlaceNames() {
  const a = useA();
  return (places: SyncPlace[]) => {
    const names = places.map((p) => a.sync.places[p]);
    return names.length > 1 ? `${names.slice(0, -1).join(", ")} ${a.sync.and} ${names[names.length - 1]}` : (names[0] ?? "");
  };
}

/**
 * A filled blue cloud (the Google Tasks blue) with a white arrow. While a change is
 * on its way, an up arrow sits in it: it lifts gently for the first minutes
 * after the save, then rests, so a long wait for the phone stays calm. Once the
 * change is late, an amber dot replaces the arrow.
 */
export function SyncGlyph({ state, moving = false, className = "h-[22px] w-[22px]" }: { state: "syncing" | "late"; moving?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`shrink-0 ${className}`} aria-hidden>
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" className="fill-sync-cloud" />
      {state === "syncing" ? (
        <g className={moving ? "animate-[sync-lift_2.6s_cubic-bezier(0.33,1,0.68,1)_infinite] [transform-box:fill-box] motion-reduce:animate-none" : undefined}>
          <path d="M12 15.7v-6M9.5 12.1 12 9.6l2.5 2.5" fill="none" className="stroke-sync-arrow" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ) : (
        <circle cx="12" cy="13" r="2.7" fill="#f59e0b" />
      )}
    </svg>
  );
}

/** A small tile for each service, close to its own app icon. */
function PlaceMark({ place }: { place: SyncPlace }) {
  const tile = "grid h-4 w-4 shrink-0 place-items-center overflow-hidden rounded-[5px] ring-1 ring-white/15";
  switch (place) {
    case "todo":
      return (
        <span className={`${tile} bg-[linear-gradient(135deg,#1e5ed6,#4a9bff)]`}>
          <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" aria-hidden>
            <path d="M3.4 8.4 6.5 11.4 12.8 4.8" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      );
    case "gtasks":
      return (
        <span className={`${tile} bg-[#fff]`}>
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
            <circle cx="8" cy="8" r="6.2" fill="#1a73e8" />
            <path d="M5.2 8.2 7.1 10 10.9 6.1" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      );
    case "google":
      return (
        <span className={`${tile} bg-[#fff]`}>
          <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
            <rect x="0" y="0" width="16" height="4.6" fill="#4285f4" />
            <rect x="4" y="7" width="3" height="2.6" rx="0.6" fill="#4285f4" />
            <rect x="9" y="7" width="3" height="2.6" rx="0.6" fill="#34a853" />
            <rect x="4" y="11" width="3" height="2.6" rx="0.6" fill="#fbbc04" />
            <rect x="9" y="11" width="3" height="2.6" rx="0.6" fill="#ea4335" />
          </svg>
        </span>
      );
    case "outlook":
      return (
        <span className={`${tile} bg-[linear-gradient(135deg,#0a5ead,#28a8ea)]`}>
          <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" aria-hidden>
            <ellipse cx="8" cy="8" rx="4" ry="4.6" stroke="#fff" strokeWidth="2.1" />
          </svg>
        </span>
      );
  }
}

/**
 * Where a task or meeting stands with the services the app syncs, as one quiet
 * mark at the end of its row. Hover, focus or a tap shows the words in a small
 * bubble, drawn over the page so a card's rounded edge never cuts it off.
 */
export function SyncMark({ status, className = "" }: { status: SyncStatus; className?: string }) {
  const a = useA();
  const names = usePlaceNames()(status.places);
  const title = a.sync.title[status.state];
  const text = status.state === "synced" ? a.sync.synced(names) : a.sync[status.state](names);

  const button = useRef<HTMLButtonElement>(null);
  const pointer = useRef("mouse");
  const [spot, setSpot] = useState<{ x: number; y: number; below: boolean } | null>(null);

  const show = () => {
    const r = button.current?.getBoundingClientRect();
    if (!r) return;
    // above the mark, unless that would leave the window
    setSpot({ x: r.left + r.width / 2, y: r.top < 110 ? r.bottom + 8 : r.top - 8, below: r.top < 110 });
  };
  const hide = () => setSpot(null);

  // centred on the mark, but never past either edge of the window
  const bubble = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const el = bubble.current;
    if (!spot || !el) return;
    const w = el.offsetWidth;
    el.style.left = `${Math.max(12, Math.min(spot.x - w / 2, window.innerWidth - 12 - w))}px`;
    el.style.visibility = "visible";
  }, [spot]);

  // a scroll, Esc or a tap elsewhere puts it away
  useEffect(() => {
    if (!spot) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && hide();
    const onDown = (e: PointerEvent) => !button.current?.contains(e.target as Node) && hide();
    window.addEventListener("scroll", hide, true);
    window.addEventListener("resize", hide);
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("scroll", hide, true);
      window.removeEventListener("resize", hide);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [spot]);

  let mark: ReactNode;
  if (status.state === "synced") {
    mark = (
      <span className="flex items-center gap-1">
        {status.places.map((p) => (
          <PlaceMark key={p} place={p} />
        ))}
      </span>
    );
  } else {
    mark = <SyncGlyph state={status.state} moving={status.fresh} />;
  }

  return (
    <>
      <button
        ref={button}
        type="button"
        aria-label={`${title}. ${text}`}
        data-sync={status.state}
        onPointerDown={(e) => (pointer.current = e.pointerType)}
        onPointerEnter={(e) => e.pointerType === "mouse" && show()}
        onPointerLeave={(e) => e.pointerType === "mouse" && hide()}
        onFocus={() => pointer.current !== "touch" && show()}
        onBlur={hide}
        // a tap opens and closes it; with a mouse, hovering already shows it
        onClick={() => pointer.current !== "mouse" && (spot ? hide() : show())}
        className={`inline-grid h-7 min-w-7 shrink-0 place-items-center rounded-md px-1 transition-colors hover:bg-white/[0.07] ${className}`}
      >
        {mark}
      </button>
      {spot &&
        createPortal(
          <span
            aria-hidden
            className="pointer-events-none fixed z-[70] w-max max-w-[min(260px,calc(100vw-24px))] rounded-xl border border-white/10 bg-bar px-3 py-2.5 text-left shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
            ref={bubble}
            // placed once measured (below), so it never shows in the wrong spot
            style={{ top: spot.y, left: 0, visibility: "hidden", transform: spot.below ? undefined : "translateY(-100%)" }}
          >
            <span className={`flex items-center gap-1.5 text-[0.78rem] font-semibold ${status.state === "late" ? "text-warm" : "text-white/90"}`}>
              {status.state === "synced" ? (
                <span className="flex items-center gap-1">
                  {status.places.map((p) => (
                    <PlaceMark key={p} place={p} />
                  ))}
                </span>
              ) : (
                <SyncGlyph state={status.state} moving={status.fresh} className="h-4 w-4" />
              )}
              {title}
            </span>
            <span className="mt-1 block text-[0.78rem] leading-snug text-white/65">{text}</span>
          </span>,
          document.body,
        )}
    </>
  );
}

/** One note above a list when changes made here haven't reached the phone's services after a day. */
export function SyncLateNote({ text, className = "" }: { text: string; className?: string }) {
  return (
    <p role="status" className={`flex items-start gap-2.5 rounded-xl border border-warm/20 bg-warm/[0.06] px-3.5 py-2.5 text-[0.84rem] leading-snug text-white/80 ${className}`}>
      <SyncGlyph state="late" className="mt-px h-[18px] w-[18px]" />
      <span>{text}</span>
    </p>
  );
}
