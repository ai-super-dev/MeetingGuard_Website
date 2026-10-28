"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { DayList, MonthGrid, TimeGrid, monthDays, type Selection } from "@/components/agenda/Calendar";
import { AgendaFrame } from "@/components/agenda/Frame";
import { SOURCE_COLOR } from "@/components/agenda/look";
import { CancelDialog, MeetingDetails, MeetingEditor, MoveDialog, type EditorMode } from "@/components/agenda/MeetingDialogs";
import { Button, IconButton, Segmented } from "@/components/agenda/ui";
import { shortcutBlocked, useNow } from "@/lib/agenda/hooks";
import { useA } from "@/lib/agenda/i18n";
import { expandAll } from "@/lib/agenda/recurrence";
import { displayZone, useAgenda } from "@/lib/agenda/store";
import { addDays, addMonths, dayKey, dayStart, fmtDay, fmtDayRange, fmtMonth, isDayKey, minuteOfDay, weekStart } from "@/lib/agenda/time";
import type { Source } from "@/lib/agenda/types";
import { useLang } from "@/lib/language";

type View = "day" | "week" | "month";
const VIEWS: View[] = ["day", "week", "month"];
const SOURCES: Source[] = ["meetingguard", "google", "outlook"];

/** The view, day and open meeting from the address (?view=week&date=2026-10-28&open=id). */
function readAddress() {
  const q = new URLSearchParams(window.location.search);
  const view = q.get("view") as View;
  const date = q.get("date") ?? "";
  return {
    view: VIEWS.includes(view) ? view : "week",
    date: isDayKey(date) ? date : "",
    open: q.get("open") ? { id: q.get("open") as string, key: q.get("key") ?? "" } : null,
  };
}

export function AgendaPage() {
  const a = useA();
  return (
    <AgendaFrame title={a.meta.agenda}>
      <Agenda />
    </AgendaFrame>
  );
}

/** Rendered once the agenda has loaded in the browser, so it can read the address directly. */
function Agenda() {
  const a = useA();
  const lang = useLang();
  const s = useAgenda();
  const now = useNow();
  const zone = displayZone(s.prefs);
  const today = dayKey(new Date(now), zone);

  const [start] = useState(readAddress);
  const [view, setView] = useState<View>(start.view);
  const [date, setDate] = useState(start.date || today);
  const [hidden, setHidden] = useState<Source[]>([]);
  const [open, setOpen] = useState<Selection | null>(start.open);
  const [editor, setEditor] = useState<EditorMode | null>(null);
  const [moving, setMoving] = useState<Selection | null>(null);
  const [cancelling, setCancelling] = useState<Selection | null>(null);

  // keep the address in step, so a reload or a shared link opens the same view
  useEffect(() => {
    window.history.replaceState(window.history.state, "", `?view=${view}&date=${date}`);
  }, [view, date]);

  const days = useMemo(
    () => (view === "day" ? [date] : view === "week" ? Array.from({ length: 7 }, (_, i) => addDays(weekStart(date), i)) : monthDays(date)),
    [view, date],
  );
  const first = days[0];
  const last = days[days.length - 1];
  const occs = useMemo(
    () => expandAll(s.meetings.filter((m) => !hidden.includes(m.source)), dayStart(first, zone), dayStart(addDays(last, 1), zone)),
    [s.meetings, hidden, first, last, zone],
  );

  const step = (dir: 1 | -1) => setDate((d) => (view === "day" ? addDays(d, dir) : view === "week" ? addDays(d, 7 * dir) : addMonths(d, dir)));
  const goDay = (d: string) => {
    setDate(d);
    setView("day");
  };
  const newMeeting = (day = date, time?: string) => {
    let at = time;
    if (!at) {
      // the next half hour today, 9:00 on other days
      const next = Math.ceil((minuteOfDay(new Date(now), zone) + 1) / 30) * 30;
      at = day === today && next < 24 * 60 ? `${String(Math.floor(next / 60)).padStart(2, "0")}:${String(next % 60).padStart(2, "0")}` : "09:00";
    }
    setEditor({ kind: "new", day, time: at });
  };

  // N new meeting, T today, D W M views, arrows back and forward
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (shortcutBlocked(e)) return;
      const k = e.key.toLowerCase();
      if (k === "n") newMeeting();
      else if (k === "t") setDate(today);
      else if (k === "d") setView("day");
      else if (k === "w") setView("week");
      else if (k === "m") setView("month");
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const title =
    view === "day"
      ? fmtDay(date, lang, { weekday: "long", day: "numeric", month: "long", year: "numeric" })
      : view === "week"
        ? fmtDayRange(days[0], days[6], lang)
        : fmtMonth(date, lang);
  const visibleSources = SOURCES.filter((src) => src === "meetingguard" || s.connections[src] || s.meetings.some((m) => m.source === src));
  const dayEmpty = view === "day" && occs.length === 0;

  return (
    <>
      {/* toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={() => setDate(today)} aria-keyshortcuts="T" className="h-9 px-3">
          {a.toolbar.today}
        </Button>
        <div className="flex">
          <IconButton label={a.toolbar.prev} onClick={() => step(-1)} aria-keyshortcuts="ArrowLeft">
            <ChevronLeft className="h-5 w-5" />
          </IconButton>
          <IconButton label={a.toolbar.next} onClick={() => step(1)} aria-keyshortcuts="ArrowRight">
            <ChevronRight className="h-5 w-5" />
          </IconButton>
        </div>
        <h2 className="min-w-0 flex-1 truncate text-[1.05rem] font-semibold first-letter:uppercase max-sm:order-first max-sm:basis-full sm:text-[1.15rem]" aria-live="polite">
          {title}
        </h2>
        <div className="max-sm:ml-auto">
        <Segmented
          label={a.toolbar.view}
          value={view}
          onChange={setView}
          options={[
            { value: "day", label: a.toolbar.day, shortcut: "D" },
            { value: "week", label: a.toolbar.week, shortcut: "W" },
            { value: "month", label: a.toolbar.month, shortcut: "M" },
          ]}
        />
        </div>
        <Button variant="primary" onClick={() => newMeeting()} aria-keyshortcuts="N" className="max-lg:hidden">
          <Plus className="h-4 w-4" aria-hidden />
          {a.toolbar.newMeeting}
        </Button>
      </div>

      {/* calendars shown */}
      <div role="group" aria-label={a.toolbar.sources} className="mt-3 flex gap-2 overflow-x-auto pb-1 text-[0.8rem]">
        <button
          type="button"
          aria-pressed={hidden.length === 0}
          onClick={() => setHidden([])}
          className={`shrink-0 rounded-lg border px-3 py-1.5 ${hidden.length === 0 ? "border-white/30 bg-white/[0.08] text-white" : "border-white/10 text-white/60 hover:text-white"}`}
        >
          {a.toolbar.allSources}
        </button>
        {visibleSources.map((src) => {
          const shown = !hidden.includes(src);
          return (
            <button
              key={src}
              type="button"
              aria-pressed={shown}
              onClick={() => setHidden((h) => (shown ? [...h, src] : h.filter((x) => x !== src)))}
              className={`flex shrink-0 items-center gap-2 rounded-lg border px-3 py-1.5 ${shown ? "border-white/15 text-white" : "border-white/[0.07] text-white/40 line-through"}`}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: SOURCE_COLOR[src], opacity: shown ? 1 : 0.4 }} />
              {a.sources[src]}
            </button>
          );
        })}
      </div>

      {dayEmpty && <p className="mt-3 text-[0.85rem] text-white/50">{a.calendar.emptyDay}</p>}

      <div className="mt-3">
        {view === "day" && <TimeGrid days={days} occs={occs} zone={zone} today={today} now={now} onOpen={setOpen} onNew={newMeeting} />}
        {view === "week" && (
          <>
            <div className="hidden md:block">
              <TimeGrid days={days} occs={occs} zone={zone} today={today} now={now} onOpen={setOpen} onNew={newMeeting} onDay={goDay} />
            </div>
            <div className="md:hidden">
              <DayList days={days} occs={occs} zone={zone} today={today} onOpen={setOpen} onDay={goDay} />
            </div>
          </>
        )}
        {view === "month" && <MonthGrid date={date} occs={occs} zone={zone} today={today} onOpen={setOpen} onDay={goDay} />}
      </div>

      <p className="mt-4 hidden text-[0.75rem] text-white/35 lg:block">{a.toolbar.shortcuts}</p>

      {/* new meeting on a phone, where the app has it */}
      <button
        type="button"
        onClick={() => newMeeting()}
        className="fixed right-4 bottom-[calc(80px+env(safe-area-inset-bottom))] z-30 flex h-12 items-center gap-2 rounded-2xl bg-inverse px-5 text-[0.9rem] font-semibold text-on-inverse shadow-[0_10px_30px_rgba(0,0,0,0.45)] lg:hidden"
      >
        <Plus className="h-5 w-5" aria-hidden />
        {a.toolbar.newMeeting}
      </button>

      {open && (
        <MeetingDetails
          sel={open}
          onClose={() => setOpen(null)}
          onEdit={() => {
            setEditor({ kind: "edit", id: open.id });
            setOpen(null);
          }}
          onMove={() => {
            setMoving(open);
            setOpen(null);
          }}
          onCancel={() => {
            setCancelling(open);
            setOpen(null);
          }}
        />
      )}
      {editor && <MeetingEditor mode={editor} onClose={() => setEditor(null)} />}
      {moving && <MoveDialog sel={moving} onClose={() => setMoving(null)} />}
      {cancelling && <CancelDialog sel={cancelling} onClose={() => setCancelling(null)} />}
    </>
  );
}
