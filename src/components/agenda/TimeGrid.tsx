"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import { Check, Repeat } from "lucide-react";
import { useA } from "@/lib/agenda/i18n";
import { calendarOf, linkState, meetingSync, useAgenda } from "@/lib/agenda/store";
import { dayKey, fmtDay, fmtHour, fmtRange, fmtTime, fromZoned, minuteOfDay } from "@/lib/agenda/time";
import type { Occurrence, Task } from "@/lib/agenda/types";
import { useLang } from "@/lib/language";
import { byDay, type Selection } from "./Calendar";
import { SOURCE_COLOR, tint } from "./look";
import { SyncGlyph } from "./SyncMark";

/** Pixels per hour in the day and week grids. */
const HOUR = 52;
const TASK_COLOR = "#1fa37a";
const select = (o: Occurrence): Selection => ({ id: o.meeting.id, key: o.key });

type Placed = { o: Occurrence; start: number; end: number; col: number; cols: number };

/** Timed meetings of one day, placed side by side where they overlap. */
function placeDay(occs: Occurrence[], day: string, zone: string): Placed[] {
  const items: Placed[] = occs
    .filter((o) => !o.meeting.allDay)
    .map((o) => {
      const startsBefore = dayKey(o.start, zone) < day;
      const endsAfter = dayKey(new Date(o.end.getTime() - 1), zone) > day;
      const start = startsBefore ? 0 : minuteOfDay(o.start, zone);
      const end = endsAfter ? 1440 : minuteOfDay(o.end, zone) || 1440;
      return { o, start, end: Math.max(end, start + 24), col: 0, cols: 1 };
    })
    .sort((a, b) => a.start - b.start || b.end - a.end);

  const out: Placed[] = [];
  let cluster: Placed[] = [];
  let clusterEnd = -1;
  const flush = () => {
    const columns: number[] = [];
    for (const it of cluster) {
      let c = columns.findIndex((end) => end <= it.start);
      if (c < 0) c = columns.push(0) - 1;
      columns[c] = it.end;
      it.col = c;
    }
    for (const it of cluster) it.cols = columns.length;
    out.push(...cluster);
    cluster = [];
  };
  for (const it of items) {
    if (cluster.length && it.start >= clusterEnd) flush();
    cluster.push(it);
    clusterEnd = Math.max(clusterEnd, it.end);
  }
  flush();
  return out;
}

function useLabel() {
  const lang = useLang();
  return (o: Occurrence, zone: string) => (o.meeting.allDay ? o.title : `${o.title}, ${fmtRange(o.start, o.end, lang, zone)}`);
}

function AllDayChip({ o, onOpen, zone }: { o: Occurrence; onOpen: (s: Selection) => void; zone: string }) {
  const label = useLabel();
  const color = SOURCE_COLOR[calendarOf(o.meeting)];
  return (
    <button
      type="button"
      onClick={() => onOpen(select(o))}
      aria-label={label(o, zone)}
      className={`block w-full truncate rounded-md px-2 py-1 text-left text-[0.74rem] font-medium text-white ${o.meeting.status === "cancelled" ? "line-through opacity-60" : ""}`}
      style={{ background: tint(color, 26), boxShadow: `inset 3px 0 0 ${color}` }}
    >
      {o.title}
    </button>
  );
}

/** A task due that day: its circle, title and time; a click opens it. */
function TaskChip({ task: t, zone, onOpen }: { task: Task; zone: string; onOpen: () => void }) {
  const lang = useLang();
  const done = t.status === "done";
  const time = t.dueTime && t.dueDate ? fmtTime(fromZoned(t.dueDate, t.dueTime, t.timezone), lang, zone) : "";
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={[t.title, time].filter(Boolean).join(", ")}
      className="flex w-full items-center gap-1.5 rounded-md px-1.5 py-1 text-left text-[0.74rem] transition-colors hover:bg-white/[0.06]"
      style={{ background: tint(TASK_COLOR, 10) }}
    >
      <span className="grid h-3 w-3 shrink-0 place-items-center rounded-full border-[1.5px]" style={{ borderColor: TASK_COLOR, background: done ? TASK_COLOR : "transparent" }}>
        {done && <Check className="h-2 w-2 text-[#fff]" strokeWidth={4} aria-hidden />}
      </span>
      <span className={`min-w-0 flex-1 truncate ${done ? "text-white/45 line-through" : "text-white/90"}`}>{t.title}</span>
      {time && <span className="shrink-0 text-[0.66rem] text-white/50 tabular-nums">{time}</span>}
    </button>
  );
}

/**
 * Day and week: the hours down the side, each meeting as a block at its time
 * (side by side where they overlap), all-day meetings and the day's tasks in a
 * strip on top, and a line at the current time. A click on an empty slot starts
 * a new meeting at that half hour.
 */
export function TimeGrid({
  days,
  occs,
  tasks,
  zone,
  today,
  now,
  onOpen,
  onNew,
  onDay,
  onTask,
  className = "",
}: {
  days: string[];
  occs: Occurrence[];
  tasks: Map<string, Task[]>;
  zone: string;
  today: string;
  now: number;
  onOpen: (s: Selection) => void;
  onNew: (day: string, time: string) => void;
  /** The week's day headings open that day. */
  onDay?: (day: string) => void;
  onTask: (t: Task) => void;
  className?: string;
}) {
  const a = useA();
  const lang = useLang();
  const s = useAgenda();
  const label = useLabel();
  const scroller = useRef<HTMLDivElement>(null);
  const perDay = byDay(occs, zone);
  const allDay = days.map((d) => (perDay.get(d) ?? []).filter((o) => o.meeting.allDay));
  const dayTasks = days.map((d) => tasks.get(d) ?? []);
  const columns = `56px repeat(${days.length}, minmax(0, 1fr))`;
  const nowMinute = now ? minuteOfDay(new Date(now), zone) : 0;
  const showsToday = days.includes(today);
  const targets = linkState(s);

  // opens at the working day, or just before now when today is on screen
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = (showsToday ? Math.max(0, nowMinute / 60 - 1.5) : 7.5) * HOUR;
    // only when the shown days change, not every minute
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days.join()]);

  const newAt = (day: string) => (e: MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    const y = e.clientY - e.currentTarget.getBoundingClientRect().top;
    const minutes = Math.min(23 * 60 + 30, Math.max(0, Math.floor((y / HOUR) * 2) * 30));
    onNew(day, `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`);
  };

  return (
    <div className={`surface flex flex-col overflow-hidden rounded-2xl ${className}`}>
      {/* day headings */}
      <div className="grid shrink-0 border-b border-white/[0.07]" style={{ gridTemplateColumns: columns }}>
        <span />
        {days.map((d) => {
          const isToday = d === today;
          const content = (
            <>
              <span className={`block text-[0.7rem] tracking-wide uppercase ${isToday ? "text-accent-soft" : "text-white/50"}`}>{fmtDay(d, lang, { weekday: "short" })}</span>
              <span className={`mx-auto mt-0.5 grid h-8 w-8 place-items-center rounded-full text-[0.95rem] font-semibold ${isToday ? "bg-accent text-[#fff]" : "text-white"}`}>
                {Number(d.slice(8))}
              </span>
            </>
          );
          return onDay ? (
            <button key={d} type="button" onClick={() => onDay(d)} aria-label={a.calendar.openDay(fmtDay(d, lang, { weekday: "long", month: "long", day: "numeric" }))} className="py-2 text-center transition-colors hover:bg-white/[0.04]">
              {content}
            </button>
          ) : (
            <div key={d} className="py-2 text-center">
              {content}
            </div>
          );
        })}
      </div>

      {/* all-day meetings */}
      {allDay.some((x) => x.length) && (
        <div className="grid shrink-0 border-b border-white/[0.07]" style={{ gridTemplateColumns: columns }}>
          <span className="px-1.5 py-2 text-right text-[0.64rem] leading-tight text-white/45">{a.calendar.allDay}</span>
          {allDay.map((list, i) => (
            <div key={days[i]} className="min-w-0 space-y-1 border-l border-white/[0.06] p-1">
              {list.map((o) => (
                <AllDayChip key={o.meeting.id + o.key} o={o} onOpen={onOpen} zone={zone} />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* the day's tasks, as on the month's day list */}
      {dayTasks.some((x) => x.length) && (
        <div className="grid shrink-0 border-b border-white/[0.07]" style={{ gridTemplateColumns: columns }}>
          <span className="px-1.5 py-2 text-right text-[0.64rem] leading-tight text-white/45">{a.tasks.title}</span>
          {dayTasks.map((list, i) => (
            <div key={days[i]} className="max-h-[92px] min-w-0 space-y-1 overflow-y-auto border-l border-white/[0.06] p-1 [scrollbar-width:thin]">
              {list.map((t) => (
                <TaskChip key={t.id} task={t} zone={zone} onOpen={() => onTask(t)} />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* hours */}
      <div ref={scroller} data-scroll-area className="relative min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin]">
        <div className="relative grid" style={{ gridTemplateColumns: columns, height: 24 * HOUR }}>
          <div className="relative" aria-hidden>
            {Array.from({ length: 23 }, (_, i) => (
              <span key={i} className="absolute right-2 -translate-y-1/2 text-[0.66rem] whitespace-nowrap text-white/40 tabular-nums" style={{ top: (i + 1) * HOUR }}>
                {fmtHour(i + 1, lang)}
              </span>
            ))}
          </div>
          {days.map((d) => (
            <div
              key={d}
              onClick={newAt(d)}
              title={a.toolbar.newMeeting}
              className={`relative cursor-cell border-l border-white/[0.06] ${d === today && days.length > 1 ? "bg-accent/[0.03]" : ""}`}
              style={{
                backgroundImage: "linear-gradient(to bottom, color-mix(in oklab, var(--color-white) 6%, transparent) 1px, transparent 1px)",
                backgroundSize: `100% ${HOUR}px`,
              }}
            >
              {placeDay(perDay.get(d) ?? [], d, zone).map(({ o, start, end, col, cols }) => {
                const color = SOURCE_COLOR[calendarOf(o.meeting)];
                const height = ((end - start) / 60) * HOUR;
                const short = height < 30;
                const sync = meetingSync(o.meeting, targets, now);
                const pending = sync && sync.state !== "synced" ? sync.state : null;
                return (
                  <button
                    key={o.meeting.id + o.key}
                    type="button"
                    onClick={() => onOpen(select(o))}
                    aria-label={label(o, zone)}
                    className={`absolute overflow-hidden rounded-md px-2 text-left transition-[filter] hover:brightness-110 focus-visible:z-10 ${short ? "py-0.5" : "py-1"} ${o.meeting.status === "cancelled" ? "opacity-60" : ""}`}
                    style={{
                      top: (start / 60) * HOUR + 1,
                      height: height - 2,
                      left: `calc(${(col / cols) * 100}% + 2px)`,
                      width: `calc(${100 / cols}% - 4px)`,
                      background: tint(color, 24),
                      boxShadow: `inset 3px 0 0 ${color}`,
                    }}
                  >
                    <span className={`flex items-center gap-1 font-semibold text-white ${short ? "text-[0.72rem] leading-[1.15]" : "text-[0.76rem] leading-tight"}`}>
                      {o.meeting.recurrence && <Repeat className="h-3 w-3 shrink-0 opacity-60" aria-hidden />}
                      <span className={`min-w-0 flex-1 truncate ${o.meeting.status === "cancelled" ? "line-through" : ""}`}>{o.title}</span>
                      {/* a change made here that the phone hasn't sent yet */}
                      {pending && <SyncGlyph state={pending} className="h-3.5 w-3.5" />}
                    </span>
                    {height > 34 && <span className="block truncate text-[0.7rem] text-white/60">{fmtRange(o.start, o.end, lang, zone)}</span>}
                  </button>
                );
              })}
              {d === today && now > 0 && (
                <span aria-hidden className="pointer-events-none absolute inset-x-0 z-[5] h-0.5 bg-accent" style={{ top: (nowMinute / 60) * HOUR }}>
                  <span className="absolute -top-[4px] -left-[5px] h-2.5 w-2.5 rounded-full bg-accent" />
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
