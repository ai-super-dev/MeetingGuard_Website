import { BellRing, ChevronDown, ChevronLeft, ChevronRight, Menu, Search, Video, X } from "lucide-react";
import { GoogleCalendarIcon } from "@/components/icons/brand";
import { Reveal } from "@/components/motion";
import { AlertScreen } from "@/components/phone/AlertScreen";
import { FlatPhone } from "@/components/phone/Device";
import { AppMark } from "@/components/ui/Logo";

/* ---------- calendar week mock ---------- */

const START_HOUR = 8;
const HOURS = 6; // 8 AM – 1 PM
const ROW = 56; // px per hour

const DAYS = [
  { name: "MON", date: 26, wide: true },
  { name: "TUE", date: 27 },
  { name: "WED", date: 28, today: true },
  { name: "THU", date: 29 },
  { name: "FRI", date: 30, wide: true },
];

type CalEvent = { day: number; start: number; end: number; title: string; color: string; guarded?: boolean };

const EVENTS: CalEvent[] = [
  { day: 0, start: 9, end: 9.5, title: "Team standup", color: "#4f8cff" },
  { day: 0, start: 11, end: 12, title: "Product sync", color: "#2fb8a8" },
  { day: 1, start: 9, end: 9.5, title: "Team standup", color: "#4f8cff" },
  { day: 1, start: 12, end: 13, title: "Lunch with Ana", color: "#f59e0b" },
  { day: 2, start: 9, end: 9.5, title: "Team standup", color: "#4f8cff" },
  { day: 2, start: 10, end: 10.75, title: "Investor call", color: "#ff4d5e", guarded: true },
  { day: 2, start: 11.5, end: 12.5, title: "Design review", color: "#a78bfa" },
  { day: 3, start: 9, end: 9.5, title: "Team standup", color: "#4f8cff" },
  { day: 3, start: 10.5, end: 11.5, title: "Client sync", color: "#34c27a" },
  { day: 4, start: 9, end: 9.5, title: "Team standup", color: "#4f8cff" },
  { day: 4, start: 12, end: 12.5, title: "1:1 with Mia", color: "#4f8cff" },
];

const y = (h: number) => (h - START_HOUR) * ROW;
const NOW = 9.75; // 09:45 — fifteen minutes before the investor call
const fmt = (h: number) => `${Math.floor(h)}:${String(Math.round((h % 1) * 60)).padStart(2, "0")}`;

/** Mon and Fri drop out on small screens so the week still reads clearly. */
const dayVisibility = (wide?: boolean) => (wide ? "hidden sm:block" : "block");

function EventBlock({ e }: { e: CalEvent }) {
  const height = y(e.end) - y(e.start);
  if (!e.guarded) {
    return (
      <div
        className="absolute inset-x-1 overflow-hidden rounded-md border-l-[3px] px-1.5 py-1 text-[0.68rem] leading-tight"
        style={{ top: y(e.start) + 1, height: height - 2, borderColor: e.color, background: `${e.color}26` }}
      >
        <p className="truncate font-medium text-white/85">{e.title}</p>
        {height > 40 && <p className="text-white/45">{fmt(e.start)}</p>}
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
          {e.title}
        </p>
        <p className="truncate text-white/60">10:00 – 10:45 · Zoom</p>
      </div>
      {/* "guarded" chip hanging off the event */}
      <Reveal delay={1.5} className="absolute top-full left-0 mt-1.5 whitespace-nowrap">
        <span className="inline-flex items-center gap-1 rounded-full border border-accent/40 bg-[#1a0b0e] px-2 py-0.5 text-[0.64rem] font-medium text-[#ff8a95]">
          <BellRing className="h-3 w-3" aria-hidden />
          Alarm ringing · 9:45
        </span>
      </Reveal>
    </div>
  );
}

function CalendarWeek() {
  return (
    <div className="surface overflow-hidden rounded-2xl">
      {/* app bar */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3 text-white/70 sm:gap-3 lg:pr-9">
        <Menu className="hidden h-4 w-4 sm:block" aria-hidden />
        <GoogleCalendarIcon className="h-6 w-6" />
        <span className="text-[0.95rem] text-white/85">Calendar</span>
        <span className="ml-2 hidden rounded-full border border-white/15 px-3 py-1 text-[0.72rem] sm:inline">Today</span>
        <ChevronLeft className="hidden h-4 w-4 sm:block" aria-hidden />
        <ChevronRight className="hidden h-4 w-4 sm:block" aria-hidden />
        <span className="text-[0.88rem] text-white/85 sm:text-[0.95rem]">October 2026</span>
        <Search className="ml-auto hidden h-4 w-4 sm:block" aria-hidden />
        <span className="ml-auto flex items-center gap-1 rounded-full border border-white/15 px-3 py-1 text-[0.72rem] sm:ml-0">
          Week <ChevronDown className="h-3 w-3" aria-hidden />
        </span>
      </div>

      <div className="grid grid-cols-[40px_repeat(3,minmax(0,1fr))] sm:grid-cols-[48px_repeat(5,minmax(0,1fr))]">
        {/* day headers */}
        <div className="border-b border-white/[0.06]" />
        {DAYS.map((d) => (
          <div
            key={d.name}
            className={`${dayVisibility(d.wide)} border-b border-l border-white/[0.06] py-2.5 text-center`}
          >
            <p className={`text-[0.62rem] tracking-wide ${d.today ? "text-[#8ab4ff]" : "text-white/40"}`}>{d.name}</p>
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
              className="absolute right-1.5 -translate-y-1/2 text-[0.6rem] text-white/35"
              style={{ top: i * ROW }}
            >
              {i === 0 ? "" : `${((START_HOUR + i - 1) % 12) + 1} ${START_HOUR + i < 12 ? "AM" : "PM"}`}
            </span>
          ))}
        </div>

        {/* day columns */}
        {DAYS.map((d, di) => (
          <div
            key={d.name}
            className={`${dayVisibility(d.wide)} relative border-l border-white/[0.06]`}
            style={{
              height: HOURS * ROW,
              backgroundImage: `repeating-linear-gradient(180deg, transparent 0 ${ROW - 1}px, rgba(255,255,255,0.05) ${ROW - 1}px ${ROW}px)`,
            }}
          >
            {EVENTS.filter((e) => e.day === di).map((e) => (
              <EventBlock key={e.title + e.start} e={e} />
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

/* ---------- minute-by-minute comparison ---------- */

const MOMENTS = ["9:45", "9:50", "10:00"];

const ROWS = [
  {
    who: "Your calendar",
    icon: <GoogleCalendarIcon className="h-5 w-5" />,
    steps: ["Nothing happens", "One small banner, swiped away", "The call started without you"],
    tone: "muted" as const,
  },
  {
    who: "MeetingGuard",
    icon: <AppMark className="h-5 w-5" sizes="40px" />,
    steps: ["Alarm rings — even with the app closed", "Follow-up until you respond", "One tap: you're in the Zoom call"],
    tone: "accent" as const,
  },
];

function Comparison() {
  return (
    <div className="surface mt-5 overflow-hidden rounded-2xl">
      <div className="hidden grid-cols-[180px_repeat(3,minmax(0,1fr))] border-b border-white/[0.06] md:grid">
        <span />
        {MOMENTS.map((m) => (
          <span key={m} className="px-5 py-3 font-mono text-[0.72rem] text-white/40">
            {m}
          </span>
        ))}
      </div>
      {ROWS.map((r) => (
        <div
          key={r.who}
          className="grid grid-cols-1 border-b border-white/[0.06] last:border-b-0 md:grid-cols-[180px_repeat(3,minmax(0,1fr))]"
        >
          <p className="flex items-center gap-2.5 px-5 pt-4 pb-2 text-[0.9rem] font-semibold md:py-4">
            {r.icon}
            <span className={r.tone === "accent" ? "text-white" : "text-white/55"}>{r.who}</span>
          </p>
          {r.steps.map((s, i) => (
            <p
              key={s}
              className={`flex items-start gap-2 px-5 py-1.5 text-[0.85rem] leading-snug md:py-4 ${
                r.tone === "accent" ? "text-white/85" : "text-white/35"
              }`}
            >
              <span className="w-11 shrink-0 font-mono text-[0.7rem] text-white/30 md:hidden">{MOMENTS[i]}</span>
              {r.tone === "accent" ? (
                i === 2 ? (
                  <Video className="mt-0.5 h-4 w-4 shrink-0 text-[#ff8a95]" aria-hidden />
                ) : (
                  <BellRing className="mt-0.5 h-4 w-4 shrink-0 text-[#ff8a95]" aria-hidden />
                )
              ) : (
                <X className="mt-0.5 h-4 w-4 shrink-0 text-white/25" aria-hidden />
              )}
              {s}
            </p>
          ))}
          <span className="pb-3 md:hidden" />
        </div>
      ))}
    </div>
  );
}

export function Problem() {
  return (
    <section aria-labelledby="problem-title" className="relative overflow-x-clip py-20 sm:py-28">
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Why MeetingGuard</p>
          <h2
            id="problem-title"
            className="text-shine mt-3 text-[1.9rem] leading-[1.2] font-semibold tracking-[-0.02em] sm:text-[2.4rem]"
          >
            Your calendar organizes time.
            <br />
            MeetingGuard protects your commitments.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[0.98rem] leading-relaxed text-white/50">
            Calendars only store dates. When your day gets busy, passive notifications get ignored. MeetingGuard reads
            the same calendar — and makes sure you&apos;re in the right meeting, right on time.
          </p>
        </Reveal>

        <div className="mx-auto mt-14 max-w-[1040px]">
          <div className="relative grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-0">
            <Reveal>
              <CalendarWeek />
            </Reveal>

            {/* MeetingGuard steps in front of the calendar */}
            <Reveal delay={1.1} from="right" className="relative flex flex-col items-center lg:-ml-6">
              <div
                aria-hidden
                className="absolute top-1/2 left-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(200,20,40,0.35),transparent)] blur-2xl"
              />
              <p className="eyebrow relative mb-4 text-[#ff8a95]">9:45 · 15 min before</p>
              <div className="relative">
                <FlatPhone width={210}>
                  <AlertScreen />
                </FlatPhone>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <Comparison />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
