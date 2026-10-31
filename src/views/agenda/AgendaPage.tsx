"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Keyboard, Plus } from "lucide-react";
import { byDay, DayList, MonthGrid, TimeGrid, monthDays, type Selection } from "@/components/agenda/Calendar";
import { AgendaFrame } from "@/components/agenda/Frame";
import { SOURCE_COLOR } from "@/components/agenda/look";
import { CancelDialog, EditScopeDialog, MeetingDetails, MeetingEditor, MoveDialog, OccurrenceEditor, type EditorMode } from "@/components/agenda/MeetingDialogs";
import { Button, Dialog, IconButton, Segmented } from "@/components/agenda/ui";
import { shortcutBlocked, useNow } from "@/lib/agenda/hooks";
import { useA } from "@/lib/agenda/i18n";
import { expandAll } from "@/lib/agenda/recurrence";
import { calendarOf, displayZone, useAgenda } from "@/lib/agenda/store";
import { addDays, addMonths, dayKey, dayStart, fmtDay, fmtDayRange, fmtMonth, isDayKey, minuteOfDay, weekStart } from "@/lib/agenda/time";
import type { Calendar } from "@/lib/agenda/types";
import { useLang } from "@/lib/language";

type View = "day" | "week" | "month";
const VIEWS: View[] = ["day", "week", "month"];
const SOURCES: Calendar[] = ["meetingguard", "google", "outlook", "device"];

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

/** The list behind the "Keyboard shortcuts" button. */
function ShortcutsDialog({ onClose }: { onClose: () => void }) {
  const a = useA();
  const rows = [
    { keys: ["N"], label: a.toolbar.newMeeting },
    { keys: ["T"], label: a.toolbar.today },
    { keys: ["D", "W", "M"], label: a.toolbar.keyViews },
    { keys: ["←", "→"], label: a.toolbar.keyMove },
    { keys: ["?"], label: a.toolbar.keyHelp },
  ];
  return (
    <Dialog title={a.toolbar.shortcuts} onClose={onClose} size="sm">
      <dl className="space-y-3">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-4">
            <dt className="flex w-24 shrink-0 gap-1">
              {r.keys.map((k) => (
                <kbd key={k} className="grid h-7 min-w-7 place-items-center rounded-md border border-white/15 bg-white/[0.06] px-1.5 font-sans text-[0.8rem] font-semibold">
                  {k}
                </kbd>
              ))}
            </dt>
            <dd className="text-[0.88rem] text-white/80">{r.label}</dd>
          </div>
        ))}
      </dl>
    </Dialog>
  );
}

/** Rendered once the agenda has loaded in the browser, so it can read the address directly. */
function Agenda() {
  const a = useA();
  const lang = useLang();
  const s = useAgenda();
  const now = useNow();
  const zone = displayZone(s);
  const today = dayKey(new Date(now), zone);

  const [start] = useState(readAddress);
  const [view, setView] = useState<View>(start.view);
  const [date, setDate] = useState(start.date || today);
  const [hidden, setHidden] = useState<Calendar[]>([]);
  const [open, setOpen] = useState<Selection | null>(start.open);
  const [editor, setEditor] = useState<EditorMode | null>(null);
  const [askScope, setAskScope] = useState<Selection | null>(null);
  const [occurrenceEdit, setOccurrenceEdit] = useState<{ sel: Selection; scope: "one" | "following" } | null>(null);
  const [moving, setMoving] = useState<Selection | null>(null);
  const [cancelling, setCancelling] = useState<Selection | null>(null);
  const [showKeys, setShowKeys] = useState(false);

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
  const occs = useMemo(() => {
    // a day of slack on each side, for all-day meetings planned in another zone
    const found = expandAll(s.meetings.filter((m) => !hidden.includes(calendarOf(m))), dayStart(addDays(first, -1), zone), dayStart(addDays(last, 2), zone));
    const perDay = byDay(found, zone);
    const shown = new Set(days.flatMap((d) => perDay.get(d) ?? []));
    return found.filter((o) => shown.has(o));
  }, [s.meetings, hidden, days, first, last, zone]);

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

  // N new meeting, T today, D W M views, arrows back and forward, ? this list
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
      else if (e.key === "?") setShowKeys(true);
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
  const visibleSources = SOURCES.filter((src) => src === "meetingguard" || s.meetings.some((m) => calendarOf(m) === src));
  const dayEmpty = view === "day" && occs.length === 0;

  return (
    <>
      {/* toolbar: pinned under the top bar. On a phone only the date and New meeting are; from a tablet up it is one row */}
      <div className="max-md:contents md:sticky md:top-14 md:z-20 md:-mx-4 md:-mt-2 md:flex md:items-center md:gap-2 md:bg-ink-950 md:px-4 md:py-2 lg:top-16 lg:-mx-8 lg:px-8">
        <div className="flex items-center gap-3 max-md:sticky max-md:top-14 max-md:z-20 max-md:-mx-4 max-md:-mt-2 max-md:bg-ink-950 max-md:px-4 max-md:py-2 md:contents">
          <h2 className="min-w-0 flex-1 text-[1.05rem] leading-tight font-semibold first-letter:uppercase md:order-2 md:truncate md:text-[1.15rem]" aria-live="polite">
            {title}
          </h2>
          <Button variant="primary" onClick={() => newMeeting()} aria-keyshortcuts="N" title={`${a.toolbar.newMeeting} (N)`} className="h-9 shrink-0 px-3 md:order-4 lg:h-10 lg:px-4">
            <Plus className="h-4 w-4" aria-hidden />
            {a.toolbar.newMeeting}
          </Button>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 md:contents">
          <Button onClick={() => setDate(today)} aria-keyshortcuts="T" title={`${a.toolbar.today} (T)`} className="h-9 px-2.5 sm:px-3 md:order-1">
            {a.toolbar.today}
          </Button>
          <div className="flex md:order-1">
            <IconButton label={a.toolbar.prev} title={`${a.toolbar.prev} (←)`} onClick={() => step(-1)} aria-keyshortcuts="ArrowLeft" className="max-sm:w-8">
              <ChevronLeft className="h-5 w-5" />
            </IconButton>
            <IconButton label={a.toolbar.next} title={`${a.toolbar.next} (→)`} onClick={() => step(1)} aria-keyshortcuts="ArrowRight" className="max-sm:w-8">
              <ChevronRight className="h-5 w-5" />
            </IconButton>
          </div>
          <div className="max-md:ml-auto max-sm:[&_button]:px-2 md:order-3">
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
        </div>
      </div>

      {/* calendars shown, and the keyboard list where there is a keyboard */}
      <div className="mt-3 flex items-start gap-2 md:mt-1">
        <div role="group" aria-label={a.toolbar.sources} className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1 text-[0.8rem]">
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
        <button
          type="button"
          onClick={() => setShowKeys(true)}
          aria-keyshortcuts="?"
          title={`${a.toolbar.shortcuts} (?)`}
          className="hidden shrink-0 items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 text-[0.8rem] text-white/70 transition-colors hover:border-white/25 hover:text-white lg:[@media(pointer:fine)]:flex"
        >
          <Keyboard className="h-4 w-4" aria-hidden />
          {a.toolbar.shortcuts}
        </button>
      </div>

      {dayEmpty && <p className="mt-3 text-[0.85rem] text-white/50">{a.calendar.emptyDay}</p>}

      <div className="mt-3 max-lg:-mb-10">
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

      {showKeys && <ShortcutsDialog onClose={() => setShowKeys(false)} />}

      {open && (
        <MeetingDetails
          sel={open}
          onClose={() => setOpen(null)}
          onEdit={() => {
            // one date of a series: ask which meetings the edit is for, as in the app
            const isSeries = !!open.key && !!s.meetings.find((m) => m.id === open.id)?.recurrence;
            if (isSeries) setAskScope(open);
            else setEditor({ kind: "edit", id: open.id });
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
      {askScope && (
        <EditScopeDialog
          sel={askScope}
          onClose={() => setAskScope(null)}
          onChoose={(scope) => {
            if (scope === "all") setEditor({ kind: "edit", id: askScope.id });
            else setOccurrenceEdit({ sel: askScope, scope });
            setAskScope(null);
          }}
        />
      )}
      {occurrenceEdit && <OccurrenceEditor sel={occurrenceEdit.sel} scope={occurrenceEdit.scope} onClose={() => setOccurrenceEdit(null)} />}
      {editor && <MeetingEditor mode={editor} onClose={() => setEditor(null)} />}
      {moving && <MoveDialog sel={moving} onClose={() => setMoving(null)} />}
      {cancelling && <CancelDialog sel={cancelling} onClose={() => setCancelling(null)} />}
    </>
  );
}
