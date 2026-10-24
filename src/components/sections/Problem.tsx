"use client";

import type { ReactNode } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CircleX,
  Menu,
  Search,
} from "lucide-react";
import { GoogleCalendarIcon } from "@/components/icons/brand";
import { Reveal } from "@/components/motion";
import { MeetingAlarmScreen } from "@/components/phone/MeetingAlarmScreen";
import { CAL_FRAME } from "@/components/phone/geometry";
import { FramedPhone } from "@/components/phone/FramedPhone";
import { AppMark } from "@/components/ui/Logo";
import { useT } from "@/lib/language";
import type { Dict } from "@/lib/i18n";

/* ---------- calendar week mock ---------- */

const START_HOUR = 8;
const HOURS = 6; // 8 AM – 1 PM
const ROW = 56; // px per hour

const DAYS = [
  { date: 26, wide: true },
  { date: 27 },
  { date: 28, today: true },
  { date: 29 },
  { date: 30, wide: true },
];

type CalEvent = {
  day: number;
  start: number;
  end: number;
  title: keyof Dict["problem"]["events"];
  color: string;
  guarded?: boolean;
};

const EVENTS: CalEvent[] = [
  { day: 0, start: 9, end: 9.5, title: "standup", color: "#4f8cff" },
  { day: 0, start: 11, end: 12, title: "product", color: "#2fb8a8" },
  { day: 1, start: 9, end: 9.5, title: "standup", color: "#4f8cff" },
  { day: 1, start: 12, end: 13, title: "lunch", color: "#f59e0b" },
  { day: 2, start: 9, end: 9.5, title: "standup", color: "#4f8cff" },
  { day: 2, start: 10, end: 10.75, title: "investor", color: "#ff4d5e", guarded: true },
  { day: 2, start: 11.5, end: 12.5, title: "design", color: "#a78bfa" },
  { day: 3, start: 9, end: 9.5, title: "standup", color: "#4f8cff" },
  { day: 3, start: 10.5, end: 11.5, title: "client", color: "#34c27a" },
  { day: 4, start: 9, end: 9.5, title: "standup", color: "#4f8cff" },
  { day: 4, start: 12, end: 12.5, title: "oneOnOne", color: "#4f8cff" },
];

const y = (h: number) => (h - START_HOUR) * ROW;
const NOW = 9.75; // 09:45 — fifteen minutes before the investor call
const fmt = (h: number) => `${Math.floor(h)}:${String(Math.round((h % 1) * 60)).padStart(2, "0")}`;

/** Mon and Fri drop out on small screens so the week still reads clearly. */
const dayVisibility = (wide?: boolean) => (wide ? "hidden sm:block" : "block");

function EventBlock({ e, title }: { e: CalEvent; title: string }) {
  const height = y(e.end) - y(e.start);
  if (!e.guarded) {
    return (
      <div
        className="absolute inset-x-1 overflow-hidden rounded-md border-l-[3px] px-1.5 py-1 text-[0.68rem] leading-tight"
        style={{ top: y(e.start) + 1, height: height - 2, borderColor: e.color, background: `${e.color}26` }}
      >
        <p className="truncate font-medium text-white/85">{title}</p>
        {height > 40 && <p className="text-white/55">{fmt(e.start)}</p>}
      </div>
    );
  }
  return (
    <div className="absolute inset-x-1 z-10" style={{ top: y(e.start) + 1, height: height - 2 }}>
      {/* lights up once the now-line reaches the alarm time */}
      <Reveal delay={1.3} from="scale" distance={0} className="absolute -inset-1 rounded-lg">
        <span
          aria-hidden
          className="absolute inset-0 rounded-lg shadow-[0_0_0_1.5px_rgba(255,77,94,0.9),0_0_28px_rgba(255,60,80,0.55)] [animation:glow-pulse_2.4s_ease-in-out_infinite]"
        />
      </Reveal>
      <div
        className="relative h-full overflow-hidden rounded-md border-l-[3px] px-1.5 py-1 text-[0.68rem] leading-tight"
        style={{ borderColor: e.color, background: `${e.color}33` }}
      >
        <p className="flex items-center gap-1 truncate font-semibold text-white">
          <AppMark className="h-3 w-3 shrink-0" sizes="24px" />
          {title}
        </p>
        <p className="truncate text-white/60">10:00 – 10:45 · Zoom</p>
      </div>
    </div>
  );
}

function CalendarWeek() {
  const t = useT();
  const p = t.problem;
  // 9 AM … 1 PM in English, 9:00 … 13:00 in Spanish
  const hour = (h: number) => (t.lang === "es" ? `${h}:00` : `${((h - 1) % 12) + 1} ${h < 12 ? "AM" : "PM"}`);
  return (
    <div
      className="overflow-hidden rounded-2xl bg-[linear-gradient(180deg,#0f0f13,#0a0a0d)] shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
      style={{ border: "2px solid rgba(255,255,255,0.13)" }}
    >
      {/* app bar */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3 text-white/70 sm:gap-3 lg:pr-9">
        <Menu className="hidden h-4 w-4 sm:block" aria-hidden />
        <GoogleCalendarIcon className="h-6 w-6" />
        <span className="hidden text-[0.95rem] text-white/85 sm:inline">{p.calendar}</span>
        <span className="ml-2 hidden rounded-full border border-white/15 px-3 py-1 text-[0.72rem] sm:inline">{p.today}</span>
        <ChevronLeft className="hidden h-4 w-4 sm:block" aria-hidden />
        <ChevronRight className="hidden h-4 w-4 sm:block" aria-hidden />
        <span className="text-[0.88rem] whitespace-nowrap text-white/85 sm:text-[0.95rem]">{p.month}</span>
        <Search className="ml-auto hidden h-4 w-4 sm:block" aria-hidden />
        <span className="ml-auto flex items-center gap-1 rounded-full border border-white/15 px-3 py-1 text-[0.72rem] sm:ml-0">
          {p.week} <ChevronDown className="h-3 w-3" aria-hidden />
        </span>
      </div>

      <div className="grid grid-cols-[40px_repeat(3,minmax(0,1fr))] sm:grid-cols-[48px_repeat(5,minmax(0,1fr))]">
        {/* day headers */}
        <div className="border-b border-white/[0.06]" />
        {DAYS.map((d, di) => (
          <div
            key={d.date}
            className={`${dayVisibility(d.wide)} border-b border-l border-white/[0.06] py-2.5 text-center`}
          >
            <p className={`text-[0.62rem] tracking-wide ${d.today ? "text-[#8ab4ff]" : "text-white/50"}`}>{p.days[di]}</p>
            <p
              className={`mx-auto mt-1 grid h-8 w-8 place-items-center rounded-full text-[1rem] ${
                d.today ? "bg-[#4f8cff] font-semibold text-white" : "text-white/75"
              }`}
            >
              {d.date}
            </p>
          </div>
        ))}

        {/* time gutter */}
        <div className="relative" style={{ height: HOURS * ROW }}>
          {Array.from({ length: HOURS }, (_, i) => (
            <span
              key={i}
              className="absolute right-1.5 -translate-y-1/2 text-[0.6rem] text-white/45"
              style={{ top: i * ROW }}
            >
              {i === 0 ? "" : hour(START_HOUR + i)}
            </span>
          ))}
        </div>

        {/* day columns */}
        {DAYS.map((d, di) => (
          <div
            key={d.date}
            className={`${dayVisibility(d.wide)} relative border-l border-white/[0.06]`}
            style={{
              height: HOURS * ROW,
              backgroundImage: `repeating-linear-gradient(180deg, transparent 0 ${ROW - 1}px, rgba(255,255,255,0.05) ${ROW - 1}px ${ROW}px)`,
            }}
          >
            {EVENTS.filter((e) => e.day === di).map((e) => (
              <EventBlock key={e.title + e.start} e={e} title={p.events[e.title]} />
            ))}
            {d.today && (
              /* the "now" line glides down to 9:45 as the section comes into view */
              <Reveal
                from="up"
                distance={-y(NOW) + 6}
                className="absolute inset-x-0 z-20"
                style={{ top: y(NOW) }}
              >
                <span className="absolute top-0 left-0 h-[2px] w-full -translate-y-1/2 bg-accent" />
                <span className="absolute top-0 -left-[5px] h-[10px] w-[10px] -translate-y-1/2 rounded-full bg-accent" />
              </Reveal>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- the phone stepping in ---------- */

function GuardPhone() {
  return (
    <div className="relative lg:-translate-x-9">
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(200,20,40,0.32),transparent)] blur-2xl"
      />
      <FramedPhone frame={CAL_FRAME} bodyHeight={476} mirror>
        <MeetingAlarmScreen height={CAL_FRAME.screenH} />
      </FramedPhone>
    </div>
  );
}

/* ---------- with vs. without ---------- */

type Lane = Dict["problem"]["lanes"][number] & { icon: ReactNode; good: boolean };

const LANE_LOOK = [
  { icon: <GoogleCalendarIcon className="h-5 w-5" />, good: false },
  { icon: <AppMark className="h-5 w-5" sizes="40px" />, good: true },
];
const LANE_TIMES = ["9:45", "9:50", "10:00"];

function LaneCard({ lane }: { lane: Lane }) {
  return (
    <div
      className={`relative h-full overflow-hidden rounded-2xl p-6 sm:p-7 ${
        lane.good
          ? "border border-accent/30 bg-[radial-gradient(90%_70%_at_100%_0%,rgba(255,60,80,0.16),transparent_70%),linear-gradient(180deg,#121014,#0b0a0d)]"
          : "surface"
      }`}
    >
      <div className="flex items-center gap-2.5">
        {lane.icon}
        <span className={`text-[0.95rem] font-semibold ${lane.good ? "text-white" : "text-white/60"}`}>
          {lane.title}
        </span>
        <span
          className={`ml-auto inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.72rem] font-medium ${
            lane.good ? "bg-emerald-400/12 text-emerald-300" : "bg-white/[0.06] text-white/55"
          }`}
        >
          {lane.good ? (
            <CircleCheck className="h-3.5 w-3.5" aria-hidden />
          ) : (
            <CircleX className="h-3.5 w-3.5" aria-hidden />
          )}
          {lane.outcome}
        </span>
      </div>

      <ol className="relative mt-7 space-y-5">
        <span
          aria-hidden
          className={`absolute top-2 bottom-2 left-[61px] w-px ${
            lane.good ? "bg-[linear-gradient(180deg,#ff4d5e,rgba(255,77,94,0.15))]" : "bg-white/10"
          }`}
        />
        {lane.steps.map((text, i) => (
          <li key={LANE_TIMES[i]} className="relative grid grid-cols-[44px_12px_minmax(0,1fr)] items-start gap-x-3">
            <span className={`pt-px font-mono text-[0.74rem] ${lane.good ? "text-[#ff8a95]" : "text-white/50"}`}>
              {LANE_TIMES[i]}
            </span>
            <span
              className={`mt-1 h-3 w-3 rounded-full border-2 ${
                lane.good
                  ? "border-accent bg-[#1a0b0e] shadow-[0_0_10px_rgba(255,77,94,0.7)]"
                  : i === lane.steps.length - 1
                    ? "border-white/30 bg-white/30"
                    : "border-white/20 bg-ink-950"
              }`}
            />
            <span className={`text-[0.9rem] leading-snug ${lane.good ? "text-white/85" : "text-white/55"}`}>
              {text}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function Problem() {
  const t = useT();
  const p = t.problem;
  return (
    <section aria-labelledby="problem-title" className="relative py-14 sm:py-[4.5rem] overflow-x-clip">
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{p.eyebrow}</p>
          <h2
            id="problem-title"
            className="mt-3 text-[1.9rem] leading-[1.2] font-semibold text-balance tracking-[-0.02em] sm:text-[2.4rem]"
          >
            {p.line1}
            <br />
            <span className="text-white/50">
              {p.line2a} <span className="whitespace-nowrap">{p.line2b}</span>
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[0.98rem] leading-relaxed text-white/60">
            {p.body}
          </p>
        </Reveal>

        <div className="mx-auto mt-14 max-w-[1040px]">
          {/* the 3D tilt pushes the calendar's near edge out to the left; shift the pair back to centre */}
          <div className="relative grid items-center gap-4 lg:translate-x-[4.5%] lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-0">
            <Reveal>
              {/* reflection only when the calendar sits beside the phone; stacked (tablet/phone) it would show behind the phone */}
              <div className="lg:[transform:perspective(800px)_rotateY(18deg)] lg:[-webkit-box-reflect:below_6px_linear-gradient(transparent_84%,rgba(255,255,255,0.14))]">
                <CalendarWeek />
              </div>
            </Reveal>

            {/* MeetingGuard steps in front of the calendar, overlapping its far edge */}
            <Reveal delay={1.1} from="right" className="relative flex justify-center lg:-ml-[74px]">
              <GuardPhone />
            </Reveal>
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-2 lg:mt-20">
            {p.lanes.map((lane, i) => (
              <Reveal key={i} delay={i * 0.12} className="h-full">
                <LaneCard lane={{ ...lane, ...LANE_LOOK[i] }} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
