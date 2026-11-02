"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, MoreVertical, Repeat, Video } from "lucide-react";
import { useA } from "@/lib/agenda/i18n";
import { calendarOf, joinUrl } from "@/lib/agenda/store";
import { addDays, dayKey, fmtDay, fmtRange, fmtTime } from "@/lib/agenda/time";
import type { Occurrence } from "@/lib/agenda/types";
import { useLang } from "@/lib/language";
import { SOURCE_COLOR } from "./look";
import type { MeetingFlows } from "./MeetingFlows";

/** "Today · November 2, 2026", or the full date further away. */
export function useDayTitle(today: string) {
  const a = useA();
  const lang = useLang();
  return (day: string) => {
    const r = a.calendar.relation;
    const relation = day === today ? r.today : day === addDays(today, 1) ? r.tomorrow : day === addDays(today, -1) ? r.yesterday : null;
    return relation
      ? `${relation} · ${fmtDay(day, lang, { month: "long", day: "numeric", year: "numeric" })}`
      : fmtDay(day, lang, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  };
}

/** One meeting, as on the app's lists: a click opens it, and the three dots offer edit and delete. */
export function MeetingRow({ o, zone, now, flows }: { o: Occurrence; zone: string; now: number; flows: MeetingFlows }) {
  const a = useA();
  const lang = useLang();
  const m = o.meeting;
  const sel = { id: m.id, key: o.key };
  const cancelled = m.status === "cancelled";
  const live = !cancelled && !m.allDay && o.start.getTime() <= now && now < o.end.getTime();
  const sameDay = dayKey(o.start, zone) === dayKey(new Date(o.end.getTime() - 1), zone);
  const short = { weekday: "short", month: "short", day: "numeric" } as const;
  const when = m.allDay
    ? a.calendar.allDay
    : sameDay
      ? fmtRange(o.start, o.end, lang, zone)
      : `${fmtDay(dayKey(o.start, zone), lang, short)} ${fmtTime(o.start, lang, zone)} - ${fmtDay(dayKey(o.end, zone), lang, short)} ${fmtTime(o.end, lang, zone)}`;
  const place = m.location?.address || (m.conference ? a.form.provider[m.conference.provider] : joinUrl(m) ? a.meetingsPage.online : "");
  const isVideo = !m.location?.address;

  return (
    <div className="surface relative flex rounded-2xl transition-colors hover:border-white/20">
      <button type="button" onClick={() => flows.details(sel)} className="flex min-w-0 flex-1 gap-3 rounded-2xl py-3 pl-3 text-left sm:pl-4">
        <span aria-hidden className="w-1 shrink-0 rounded-full" style={{ background: SOURCE_COLOR[calendarOf(m)] }} />
        <span className="min-w-0 flex-1">
          <span className={`block text-[0.8rem] ${live ? "font-medium text-accent-soft" : "text-white/60"}`}>{when}</span>
          <span className={`mt-0.5 block text-[1rem] font-semibold break-words ${cancelled ? "text-white/50 line-through" : ""}`}>{o.title}</span>
          {place && (
            <span className="mt-1 flex items-center gap-1.5 text-[0.8rem] text-white/60">
              {isVideo ? <Video className="h-3.5 w-3.5 shrink-0" aria-hidden /> : <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />}
              <span className="min-w-0 truncate">{place}</span>
            </span>
          )}
          <span className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.74rem] text-white/50">
            {live && <span className="rounded-md bg-accent/15 px-1.5 py-0.5 font-medium text-accent-soft">{a.calendar.now}</span>}
            {cancelled && <span className="rounded-md bg-white/[0.08] px-1.5 py-0.5 font-medium text-white/70">{a.details.cancelled}</span>}
            {m.recurrence && (
              <span className="inline-flex items-center gap-1">
                <Repeat className="h-3 w-3" aria-hidden />
                {a.details.repeats}
              </span>
            )}
            <span>{a.origins[m.source]}</span>
          </span>
        </span>
      </button>
      <RowMenu title={o.title} onOpen={() => flows.details(sel)} onEdit={() => flows.edit(sel)} onDelete={() => flows.remove(sel)} />
    </div>
  );
}

function RowMenu({ title, onOpen, onEdit, onDelete }: { title: string; onOpen: () => void; onEdit: () => void; onDelete: () => void }) {
  const a = useA();
  const [open, setOpen] = useState(false);
  const [above, setAbove] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  const toggle = () => {
    // near the bottom of the list or the screen, it opens upwards so nothing is cut off
    const area = box.current?.closest("[data-scroll-area]");
    const limit = area && getComputedStyle(area).overflowY === "auto" ? area.getBoundingClientRect().bottom : window.innerHeight;
    setAbove((box.current?.getBoundingClientRect().bottom ?? 0) + 140 > limit);
    setOpen((v) => !v);
  };

  // a click elsewhere or Esc closes it
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const item = "block w-full px-3.5 py-2 text-left text-[0.86rem] transition-colors hover:bg-white/[0.06]";
  const choose = (run: () => void) => () => {
    setOpen(false);
    run();
  };
  return (
    <div ref={box} className="relative shrink-0 self-center pr-1.5 pl-1">
      <button
        type="button"
        aria-label={a.meetingsPage.moreActions(title)}
        title={a.meetingsPage.moreActions(title)}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={toggle}
        className="grid h-9 w-9 place-items-center rounded-lg text-white/65 transition-colors hover:bg-white/[0.07] hover:text-white"
      >
        <MoreVertical className="h-[18px] w-[18px]" aria-hidden />
      </button>
      {open && (
        <div role="menu" className={`absolute right-1.5 z-30 w-44 ${above ? "bottom-full mb-1" : "top-full mt-1"} overflow-hidden rounded-xl border border-white/10 bg-panel py-1 shadow-[0_12px_40px_rgba(0,0,0,0.35)]`}>
          <button type="button" role="menuitem" className={item} onClick={choose(onOpen)}>
            {a.meetingsPage.openDetails}
          </button>
          <button type="button" role="menuitem" className={item} onClick={choose(onEdit)}>
            {a.details.edit}
          </button>
          <button type="button" role="menuitem" className={`${item} text-accent-soft`} onClick={choose(onDelete)}>
            {a.details.cancel}
          </button>
        </div>
      )}
    </div>
  );
}
