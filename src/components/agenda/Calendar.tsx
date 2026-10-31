"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import { MapPin, Repeat, Video } from "lucide-react";
import { useA } from "@/lib/agenda/i18n";
import { addDays, dayKey, daysBetween, fmtDay, fmtHour, fmtRange, fmtTime, minuteOfDay, monthStart, weekStart, weekdayNames } from "@/lib/agenda/time";
import { calendarOf, joinUrl } from "@/lib/agenda/store";
import type { Occurrence } from "@/lib/agenda/types";
import { useLang } from "@/lib/language";
import { SOURCE_COLOR, tint } from "./look";

export type Selection = { id: string; key: string };

const HOUR = 52; // px per hour in the day and week grids
const select = (o: Occurrence): Selection => ({ id: o.meeting.id, key: o.key });

/** Meetings by the days they cover (all-day meetings can span several). */
export function byDay(occs: Occurrence[], zone: string) {
  const map = new Map<string, Occurrence[]>();
  for (const o of occs) {
    // an all-day meeting stays on its own dates, whatever zone it is seen from
    const z = o.meeting.allDay ? o.meeting.timezone : zone;
    const first = dayKey(o.start, z);
    const last = dayKey(new Date(Math.max(o.start.getTime(), o.end.getTime() - 1)), z);
    const span = Math.min(daysBetween(first, last), 31);
    for (let i = 0; i <= span; i++) {
      const d = addDays(first, i);
      map.set(d, [...(map.get(d) ?? []), o]);
    }
  }
  return map;
}

function useLabel() {
  const lang = useLang();
  return (o: Occurrence, zone: string) =>
    o.meeting.allDay ? o.title : `${o.title}, ${fmtRange(o.start, o.end, lang, zone)}`;
}

/* ---------- Day and week: time grid ---------- */

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

export function TimeGrid({
  days,
  occs,
  zone,
  today,
  now,
  onOpen,
  onNew,
  onDay,
}: {
  days: string[];
  occs: Occurrence[];
  zone: string;
  today: string;
  now: number;
  onOpen: (s: Selection) => void;
  onNew: (day: string, time: string) => void;
  onDay?: (day: string) => void;
}) {
  const a = useA();
  const lang = useLang();
  const label = useLabel();
  const scroller = useRef<HTMLDivElement>(null);
  const perDay = byDay(occs, zone);
  const allDay = days.map((d) => (perDay.get(d) ?? []).filter((o) => o.meeting.allDay));
  const columns = `52px repeat(${days.length}, minmax(0, 1fr))`;
  const nowMinute = now ? minuteOfDay(new Date(now), zone) : 0;
  const showsToday = days.includes(today);

  // open at the working day, or just before now when today is on screen
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
    <div className="surface overflow-hidden rounded-2xl">
      {/* day headings */}
      <div className="grid border-b border-white/[0.07]" style={{ gridTemplateColumns: columns }}>
        <span />
        {days.map((d) => {
          const isToday = d === today;
          const content = (
            <>
              <span className="block text-[0.7rem] tracking-wide text-white/50 uppercase">{fmtDay(d, lang, { weekday: "short" })}</span>
              <span
                className={`mx-auto mt-0.5 grid h-8 w-8 place-items-center rounded-full text-[0.95rem] font-semibold ${
                  isToday ? "bg-accent text-[#fff]" : "text-white"
                }`}
              >
                {Number(d.slice(8))}
              </span>
            </>
          );
          return onDay ? (
            <button key={d} type="button" onClick={() => onDay(d)} aria-label={a.calendar.openDay(fmtDay(d, lang))} className="py-2 text-center hover:bg-white/[0.03]">
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
        <div className="grid border-b border-white/[0.07]" style={{ gridTemplateColumns: columns }}>
          <span className="px-1.5 py-2 text-[0.64rem] leading-tight text-white/45">{a.calendar.allDay}</span>
          {allDay.map((list, i) => (
            <div key={days[i]} className="space-y-1 border-l border-white/[0.06] p-1">
              {list.map((o) => (
                <AllDayChip key={o.meeting.id + o.key} o={o} onOpen={onOpen} zone={zone} />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* hours */}
      <div ref={scroller} className="relative h-[calc(100dvh-366px)] min-h-[380px] overflow-y-auto md:h-[calc(100dvh-316px)] lg:h-[calc(100dvh-292px)]">
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
              className="relative cursor-cell border-l border-white/[0.06]"
              style={{
                backgroundImage: "linear-gradient(to bottom, color-mix(in oklab, var(--color-white) 6%, transparent) 1px, transparent 1px)",
                backgroundSize: `100% ${HOUR}px`,
              }}
            >
              {placeDay(perDay.get(d) ?? [], d, zone).map(({ o, start, end, col, cols }) => {
                const color = SOURCE_COLOR[calendarOf(o.meeting)];
                const height = ((end - start) / 60) * HOUR;
                const short = height < 30;
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
                    <span className={`flex items-center gap-1 truncate font-semibold text-white ${short ? "text-[0.72rem] leading-[1.15]" : "text-[0.76rem] leading-tight"}`}>
                      {o.meeting.recurrence && <Repeat className="h-3 w-3 shrink-0 opacity-60" aria-hidden />}
                      <span className={`truncate ${o.meeting.status === "cancelled" ? "line-through" : ""}`}>{o.title}</span>
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

/** "zoom.us" from a video link. */
export function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^(www|us\d+web)\./, "");
  } catch {
    return url;
  }
}

/* ---------- Week on a phone: a list, like the app's "All meetings" ---------- */

export function MeetingCard({ o, zone, onOpen }: { o: Occurrence; zone: string; onOpen: (s: Selection) => void }) {
  const a = useA();
  const lang = useLang();
  const m = o.meeting;
  const color = SOURCE_COLOR[calendarOf(m)];
  const url = joinUrl(m);
  const place = url ? hostOf(url) : (m.location?.address ?? "");
  return (
    <button
      type="button"
      onClick={() => onOpen(select(o))}
      className="surface flex w-full gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:border-white/20"
    >
      <span className="w-1 shrink-0 rounded-full" style={{ background: color }} />
      <span className="min-w-0 flex-1">
        <span className="block text-[0.8rem] text-white/55">{m.allDay ? a.calendar.allDay : fmtRange(o.start, o.end, lang, zone)}</span>
        <span className="mt-0.5 flex items-center gap-1.5 text-[0.98rem] font-medium">
          <span className={`truncate ${m.status === "cancelled" ? "line-through opacity-60" : ""}`}>{o.title}</span>
          {m.recurrence && <Repeat className="h-3.5 w-3.5 shrink-0 text-white/45" aria-label={a.details.repeats} />}
        </span>
        {place && (
          <span className="mt-1 flex items-center gap-1.5 text-[0.78rem] text-white/55">
            {url ? <Video className="h-3.5 w-3.5" aria-hidden /> : <MapPin className="h-3.5 w-3.5" aria-hidden />}
            <span className="truncate">{place}</span>
          </span>
        )}
        <span className="mt-1 block text-[0.72rem] text-white/45">{a.sources[calendarOf(m)]}</span>
      </span>
    </button>
  );
}

export function DayList({
  days,
  occs,
  zone,
  today,
  onOpen,
  onDay,
}: {
  days: string[];
  occs: Occurrence[];
  zone: string;
  today: string;
  onOpen: (s: Selection) => void;
  onDay: (day: string) => void;
}) {
  const a = useA();
  const lang = useLang();
  const perDay = byDay(occs, zone);
  if (!occs.length) return <p className="surface rounded-2xl px-5 py-10 text-center text-[0.9rem] text-white/55">{a.calendar.emptyWeek}</p>;
  return (
    <div className="space-y-5">
      {days.map((d) => {
        const list = perDay.get(d) ?? [];
        return (
          <section key={d} aria-label={fmtDay(d, lang)}>
            <div className="flex items-baseline justify-between text-[0.8rem]">
              <button type="button" onClick={() => onDay(d)} className={`font-medium hover:underline ${d === today ? "text-accent-soft" : "text-white/70"}`}>
                {fmtDay(d, lang)}
              </button>
              <span className="text-white/45">{a.calendar.count(list.length)}</span>
            </div>
            <div className="mt-2 space-y-2">
              {list.map((o) => (
                <MeetingCard key={o.meeting.id + o.key} o={o} zone={zone} onOpen={onOpen} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

/* ---------- Month ---------- */

export function monthDays(date: string) {
  const first = weekStart(monthStart(date));
  const days = Array.from({ length: 42 }, (_, i) => addDays(first, i));
  // drop a last row that is entirely next month
  return days[35].slice(0, 7) !== date.slice(0, 7) ? days.slice(0, 35) : days;
}

export function MonthGrid({
  date,
  occs,
  zone,
  today,
  onOpen,
  onDay,
}: {
  date: string;
  occs: Occurrence[];
  zone: string;
  today: string;
  onOpen: (s: Selection) => void;
  onDay: (day: string) => void;
}) {
  const a = useA();
  const lang = useLang();
  const perDay = byDay(occs, zone);
  const days = monthDays(date);
  const month = date.slice(0, 7);
  return (
    <div className="surface overflow-hidden rounded-2xl">
      <div className="grid grid-cols-7 border-b border-white/[0.07]">
        {weekdayNames(lang).map((n) => (
          <span key={n} className="py-2 text-center text-[0.7rem] tracking-wide text-white/50 uppercase">
            {n}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((d, i) => {
          const list = perDay.get(d) ?? [];
          const inMonth = d.slice(0, 7) === month;
          return (
            <div key={d} className={`min-h-[66px] border-white/[0.06] p-1 md:min-h-[116px] md:p-1.5 ${i % 7 ? "border-l" : ""} ${i >= 7 ? "border-t" : ""} ${inMonth ? "" : "bg-white/[0.015]"}`}>
              <button
                type="button"
                onClick={() => onDay(d)}
                aria-label={`${a.calendar.openDay(fmtDay(d, lang))}, ${a.calendar.count(list.length)}`}
                className={`grid h-7 w-7 place-items-center rounded-full text-[0.8rem] font-medium ${
                  d === today ? "bg-accent text-[#fff]" : inMonth ? "text-white hover:bg-white/[0.08]" : "text-white/35 hover:bg-white/[0.05]"
                }`}
              >
                {Number(d.slice(8))}
              </button>
              {/* phone: dots */}
              <div className="mt-1 flex flex-wrap gap-1 px-1 md:hidden" aria-hidden>
                {list.slice(0, 4).map((o) => (
                  <span key={o.meeting.id + o.key} className="h-1.5 w-1.5 rounded-full" style={{ background: SOURCE_COLOR[calendarOf(o.meeting)] }} />
                ))}
              </div>
              {/* computer: titles */}
              <div className="mt-1 hidden space-y-0.5 md:block">
                {list.slice(0, 3).map((o) => (
                  <button
                    key={o.meeting.id + o.key}
                    type="button"
                    onClick={() => onOpen(select(o))}
                    className="flex w-full items-center gap-1.5 truncate rounded px-1 py-0.5 text-left text-[0.72rem] hover:bg-white/[0.06]"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: SOURCE_COLOR[calendarOf(o.meeting)] }} />
                    {!o.meeting.allDay && <span className="shrink-0 text-white/50 tabular-nums">{fmtTime(o.start, lang, zone)}</span>}
                    <span className={`truncate text-white/85 ${o.meeting.status === "cancelled" ? "line-through" : ""}`}>{o.title}</span>
                  </button>
                ))}
                {list.length > 3 && (
                  <button type="button" onClick={() => onDay(d)} className="px-1 text-[0.7rem] text-white/50 hover:text-white">
                    {a.calendar.more(list.length - 3)}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
