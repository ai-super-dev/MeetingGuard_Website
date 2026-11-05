"use client";

import { useMemo, useState } from "react";
import { CalendarCheck, CalendarClock, CalendarDays, Check, Plus, Search, SearchX, X, type LucideIcon } from "lucide-react";
import { AgendaFrame } from "@/components/agenda/Frame";
import { SOURCE_COLOR } from "@/components/agenda/look";
import { suggestedTime, useMeetingFlows } from "@/components/agenda/MeetingFlows";
import { MeetingRow, useDayTitle } from "@/components/agenda/MeetingRow";
import { SyncLateNote, usePlaceNames } from "@/components/agenda/SyncMark";
import { Button, IconButton, TONES } from "@/components/agenda/ui";
import { useNow } from "@/lib/agenda/hooks";
import { useA } from "@/lib/agenda/i18n";
import { buildSections, hasActiveFilters, LIST_FUTURE_DAYS, LIST_PAST_DAYS, type SourceFilter, type TimeFilter } from "@/lib/agenda/meetingsList";
import { expandAll } from "@/lib/agenda/recurrence";
import { calendarOf, displayZone, linkState, meetingSync, useAgenda } from "@/lib/agenda/store";
import { addDays, dayKey, dayStart } from "@/lib/agenda/time";
import type { Calendar } from "@/lib/agenda/types";

/** Always offered; the others appear when the account has meetings from them. */
const MAIN_SOURCES: Calendar[] = ["meetingguard", "google"];
const OTHER_SOURCES: Calendar[] = ["outlook", "device"];
const TIME_FILTERS: TimeFilter[] = ["upcoming", "past", "all"];
const ALL_COLOR = "#3b82f6";

export function MeetingsPage() {
  const a = useA();
  return (
    <AgendaFrame title={a.meta.agenda}>
      <Meetings />
    </AgendaFrame>
  );
}

function Meetings() {
  const a = useA();
  const s = useAgenda();
  const now = useNow();
  const zone = displayZone(s);
  const today = dayKey(new Date(now), zone);
  const flows = useMeetingFlows();
  const dayTitle = useDayTitle(today);
  const p = a.meetingsPage;

  const [query, setQuery] = useState("");
  const [time, setTime] = useState<TimeFilter>("upcoming");
  const [source, setSource] = useState<SourceFilter>("all");

  const occs = useMemo(() => expandAll(s.meetings, dayStart(addDays(today, -LIST_PAST_DAYS), zone), dayStart(addDays(today, LIST_FUTURE_DAYS), zone)), [s.meetings, today, zone]);
  const filters = { time, source, query };
  const sections = useMemo(() => buildSections(occs, { time, source, query }, zone, now), [occs, time, source, query, zone, now]);
  const count = sections.reduce((sum, section) => sum + section.items.length, 0);
  const newMeeting = () => flows.newMeeting(today, suggestedTime(today, today, now, zone));
  const sources = [...MAIN_SOURCES, ...OTHER_SOURCES.filter((src) => s.meetings.some((m) => calendarOf(m) === src))];

  // one note for every change the phone still hasn't sent after a day, instead of a warning on each row
  const placeNames = usePlaceNames();
  const targets = linkState(s);
  const late = s.meetings.map((m) => meetingSync(m, targets, now)).filter((x) => x?.state === "late");
  const latePlaces = (["google", "outlook"] as const).filter((p) => late.some((x) => x?.places.includes(p)));

  return (
    // as on Tasks: the full width up to 1180px, then centred at about 84%
    <div className="mx-auto w-full max-w-[max(1180px,84%)]">
      {/* search and new meeting: one row, stacked on a phone */}
      <div className="flex items-center gap-3 max-sm:flex-col max-sm:items-stretch">
        <div className="flex h-11 min-w-0 flex-1 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] pr-1 pl-4 transition-colors focus-within:border-white/30 max-sm:flex-none">
          <Search className="h-[18px] w-[18px] shrink-0 text-white/45" aria-hidden />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={p.search}
            aria-label={p.searchLabel}
            autoComplete="off"
            className="h-full min-w-0 flex-1 bg-transparent text-[0.95rem] text-white outline-none placeholder:text-white/40"
          />
          {query && (
            <IconButton label={p.clearSearch} onClick={() => setQuery("")}>
              <X className="h-4 w-4" />
            </IconButton>
          )}
        </div>
        <Button variant="meeting" onClick={newMeeting} className="h-11! shrink-0">
          <Plus className="h-4 w-4" aria-hidden />
          {a.toolbar.newMeeting}
        </Button>
      </div>

      {/* when, and where from */}
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3">
        {/* three equal parts across a phone; only as wide as it needs from a tablet up */}
        <div role="radiogroup" aria-label={p.timeLabel} className="grid w-full grid-cols-3 gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1 sm:inline-grid sm:w-auto">
          {TIME_FILTERS.map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={time === value}
              onClick={() => setTime(value)}
              className={`h-9 min-w-0 rounded-full px-2 text-[0.85rem] font-medium whitespace-nowrap transition sm:px-5 ${time === value ? TONES.meeting : "border border-transparent text-white/65 hover:bg-white/[0.06] hover:text-white"}`}
            >
              {p.time[value]}
            </button>
          ))}
        </div>
        <div role="group" aria-label={p.sourceLabel} className="flex min-w-0 flex-wrap gap-2">
          <SourceChip color={ALL_COLOR} label={a.toolbar.allSources} selected={source === "all"} onClick={() => setSource("all")} />
          {sources.map((src) => (
            <SourceChip key={src} color={SOURCE_COLOR[src]} label={a.sources[src]} selected={source === src} onClick={() => setSource(src)} />
          ))}
        </div>
      </div>

      {s.meetings.length > 0 && (
        <p role="status" className="mt-3 text-[0.8rem] text-white/55">
          {a.calendar.count(count)}
        </p>
      )}
      {late.length > 0 && <SyncLateNote className="mt-3" text={a.sync.lateMeetings(late.length, placeNames([...latePlaces]))} />}

      {/* the list */}
      {sections.length > 0 ? (
        <div className="mt-3 space-y-6">
          {sections.map((section) => (
            <section key={section.day} aria-label={dayTitle(section.day)}>
              <div className="mb-2 flex items-baseline justify-between gap-4">
                <h2 className="min-w-0 text-[0.95rem] font-semibold text-white/85 first-letter:uppercase">{dayTitle(section.day)}</h2>
                <span className="shrink-0 text-[0.78rem] text-white/50">{a.calendar.count(section.items.length)}</span>
              </div>
              <div className="space-y-2.5">
                {section.items.map((o) => (
                  <MeetingRow key={o.meeting.id + o.key} o={o} zone={zone} now={now} flows={flows} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : s.meetings.length === 0 ? (
        <Empty Icon={CalendarDays} title={p.empty.none.title} body={p.empty.none.body} action={a.toolbar.newMeeting} onAction={newMeeting} />
      ) : hasActiveFilters(filters) ? (
        <Empty
          Icon={SearchX}
          title={p.empty.noMatches.title}
          body={p.empty.noMatches.body}
          action={p.clearFilters}
          onAction={() => {
            setQuery("");
            setSource("all");
          }}
        />
      ) : time === "upcoming" ? (
        <Empty Icon={CalendarCheck} title={p.empty.upcoming.title} body={p.empty.upcoming.body} action={p.showPast} onAction={() => setTime("past")} />
      ) : time === "past" ? (
        <Empty Icon={CalendarClock} title={p.empty.past.title} body={p.empty.past.body} action={a.toolbar.newMeeting} onAction={newMeeting} />
      ) : (
        <Empty Icon={CalendarDays} title={p.empty.all.title} body={p.empty.all.body} action={a.toolbar.newMeeting} onAction={newMeeting} />
      )}

      {flows.dialogs}
    </div>
  );
}

/** A round filter in its source's colour; the chosen one fills with that colour and shows a tick. */
function SourceChip({ color, label, selected, onClick }: { color: string; label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`flex h-9 items-center gap-2 rounded-full border px-3.5 text-[0.82rem] font-medium whitespace-nowrap transition-colors ${selected ? "text-white" : "border-white/10 text-white/70 hover:border-white/25 hover:text-white"}`}
      style={selected ? { background: `color-mix(in srgb, ${color} 18%, transparent)`, borderColor: `color-mix(in srgb, ${color} 65%, transparent)` } : undefined}
    >
      {selected ? <Check aria-hidden className="h-3.5 w-3.5" strokeWidth={3} style={{ color }} /> : <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: color }} />}
      {label}
    </button>
  );
}

function Empty({ Icon, title, body, action, onAction }: { Icon: LucideIcon; title: string; body: string; action: string; onAction: () => void }) {
  return (
    <div className="surface mt-4 flex flex-col items-center rounded-2xl px-5 py-12 text-center">
      <span aria-hidden className="grid h-12 w-12 place-items-center rounded-2xl bg-white/[0.06] text-white/60">
        <Icon className="h-6 w-6" />
      </span>
      <p className="mt-4 text-[1.02rem] font-semibold">{title}</p>
      <p className="mt-1.5 max-w-[420px] text-[0.88rem] text-white/60">{body}</p>
      <Button onClick={onAction} className="mt-5">
        {action}
      </Button>
    </div>
  );
}
