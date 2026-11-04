"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, BarChart3, CalendarDays, CalendarPlus, CheckCircle2, ChevronRight, Clock, Hourglass, Info, Lightbulb, ListPlus, MapPin, SquareCheck, Video } from "lucide-react";
import { AgendaFrame } from "@/components/agenda/Frame";
import { suggestedTime, useMeetingFlows } from "@/components/agenda/MeetingFlows";
import { TaskEditor, type TaskDraft } from "@/components/agenda/TaskDialogs";
import { Button, TaskCheck, TONES, useToast } from "@/components/agenda/ui";
import { barFraction, countdownTo, dayPeriodOf, dueNow, findNowAndNext, firstNameOf, isOverdue, todayTimeline, weekSummary, type TimelineItem, type WeekSummary } from "@/lib/agenda/dashboard";
import { useNow } from "@/lib/agenda/hooks";
import { useA } from "@/lib/agenda/i18n";
import { expandAll } from "@/lib/agenda/recurrence";
import { displayZone, joinUrl, setTaskDone, useAgenda } from "@/lib/agenda/store";
import { addDays, dayKey, dayStart, daysBetween, fmtDay, fmtDuration, fmtRange, fmtTime, fromZoned, LOCALE, zoned } from "@/lib/agenda/time";
import type { Occurrence, Task } from "@/lib/agenda/types";
import { useHref, useLang } from "@/lib/language";

/** How far the dashboard looks: back through last week for the comparison, ahead for "next", as in the app. */
const PAST_DAYS = 14;
const FUTURE_DAYS = 370;

export function DashboardPage() {
  const a = useA();
  return (
    <AgendaFrame title={a.meta.dashboard}>
      <Dashboard />
    </AgendaFrame>
  );
}

/** Rendered once the agenda has loaded in the browser. */
function Dashboard() {
  const s = useAgenda();
  const now = useNow();
  const zone = displayZone(s);
  const today = dayKey(new Date(now), zone);

  const [task, setTask] = useState<TaskDraft | null>(null);
  const flows = useMeetingFlows();

  // the calendar used to live at this address: send its old links on to where it is now
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.has("view") || q.has("date") || q.has("open")) window.location.replace(`${window.location.pathname.replace(/\/$/, "")}/calendar/?${q}`);
  }, []);

  const occs = useMemo(
    () => expandAll(s.meetings, dayStart(addDays(today, -PAST_DAYS), zone), dayStart(addDays(today, FUTURE_DAYS), zone)),
    [s.meetings, today, zone],
  );
  const timeline = useMemo(() => todayTimeline(occs, today, zone, now), [occs, today, zone, now]);
  const week = useMemo(() => weekSummary(occs, today, zone, now), [occs, today, zone, now]);

  const newMeeting = () => flows.newMeeting(today, suggestedTime(today, today, now, zone));
  const details = (o: Occurrence) => flows.details({ id: o.meeting.id, key: o.key });

  return (
    // as on Tasks and Profile: the full width up to 1180px, then centred at about 84%
    <div className="mx-auto w-full max-w-[max(1180px,84%)] space-y-5">
      <Greeting now={now} zone={zone} today={today} />

      {/* from a tablet up the upcoming meeting and the buttons share one row; everything else is full width */}
      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_220px] xl:grid-cols-[minmax(0,1fr)_260px]">
        <NowAndNext occs={occs} zone={zone} onDetails={details} />
        <QuickActions onNewMeeting={newMeeting} onNewTask={() => setTask({})} />
      </div>

      <TasksCard today={today} now={now} zone={zone} onOpen={(t) => setTask({ id: t.id })} onNew={() => setTask({})} />
      <Today items={timeline} zone={zone} onOpen={details} onNew={newMeeting} />
      <YourWeek week={week} />

      {task && <TaskEditor draft={task} onClose={() => setTask(null)} />}
      {flows.dialogs}
    </div>
  );
}

/* ---------- Pieces ---------- */

function Heading({ id, icon, title, trailing }: { id: string; icon?: ReactNode; title: string; trailing?: ReactNode }) {
  return (
    <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3 sm:px-5">
      {icon && (
        <span aria-hidden className="text-white/60 [&>svg]:h-[18px] [&>svg]:w-[18px]">
          {icon}
        </span>
      )}
      <h2 id={id} className="min-w-0 flex-1 text-[0.98rem] font-semibold">
        {title}
      </h2>
      {trailing && <span className="shrink-0 rounded-full bg-white/[0.07] px-2.5 py-0.5 text-[0.75rem] font-medium text-white/60">{trailing}</span>}
    </div>
  );
}

function Greeting({ now, zone, today }: { now: number; zone: string; today: string }) {
  const a = useA();
  const lang = useLang();
  const s = useAgenda();
  const period = a.dashboard.greeting[dayPeriodOf(zoned(new Date(now), zone).h)];
  const name = firstNameOf(s.user?.name);
  return (
    <section className="surface relative overflow-hidden rounded-2xl">
      <HeaderArt theme="dark" base="linear-gradient(90deg, #030e46, #07105a)" />
      <HeaderArt theme="light" base="linear-gradient(90deg, #edf3fc, #e9f1fe)" />
      <div className="relative flex min-h-[168px] flex-col justify-end px-5 py-5 sm:min-h-[190px] sm:px-7">
        {name && <p className="text-[0.72rem] font-medium tracking-[0.16em] text-white/80 uppercase">{period}</p>}
        <p className={`max-w-[75%] text-[1.9rem] leading-tight font-bold tracking-[-0.02em] break-words sm:text-[2.3rem] ${name ? "mt-1" : ""}`}>{name ?? period}</p>
        <p className="mt-1 text-[0.9rem] text-white/75 first-letter:uppercase">{fmtDay(today, lang, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
        <span aria-hidden className="mt-2.5 block h-[3px] w-10 rounded-full bg-[#3b82f6]" />
      </div>
    </section>
  );
}

/**
 * The header's picture, the same as the app's, for one theme. It sits on the right, tall enough to
 * show the whole calendar, and fades on its left into a colour taken from the picture.
 */
function HeaderArt({ theme, base }: { theme: "dark" | "light"; base: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 ${theme === "dark" ? "[html[data-theme=light]_&]:hidden" : "hidden [html[data-theme=light]_&]:block"}`} style={{ backgroundImage: base }}>
      <div
        className="absolute top-0 right-0 aspect-[232/100] h-full bg-cover bg-no-repeat [background-position:50%_100%] sm:aspect-[339/100] sm:[background-position:50%_64%]"
        style={{
          backgroundImage: `url(/images/dashboard_header_${theme}.jpg)`,
          maskImage: "linear-gradient(to right, transparent, #000 40%)",
          WebkitMaskImage: "linear-gradient(to right, transparent, #000 40%)",
        }}
      />
    </div>
  );
}

/* ---------- Happening now and next meeting ---------- */

/** The countdown ticks on its own, so only this card redraws each second. */
function NowAndNext({ occs, zone, onDetails }: { occs: Occurrence[]; zone: string; onDetails: (o: Occurrence) => void }) {
  const a = useA();
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const { current, next } = useMemo(() => findNowAndNext(occs, now), [occs, now]);

  return (
    <section aria-label={a.dashboard.next} className="surface flex flex-col overflow-hidden rounded-2xl">
      {current && <MeetingBlock occurrence={current} kind="current" now={now} zone={zone} onDetails={onDetails} />}
      {next && <MeetingBlock occurrence={next} kind="next" now={now} zone={zone} onDetails={onDetails} />}
      {!current && !next && (
        <div className="flex flex-1 items-center gap-3.5 px-5 py-6 md:py-3">
          <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/[0.06] text-white/60">
            <CalendarDays className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[1rem] font-semibold">{a.dashboard.none}</p>
            <p className="mt-0.5 text-[0.85rem] text-white/55">{a.dashboard.noneHint}</p>
          </div>
        </div>
      )}
    </section>
  );
}

/** "tomorrow", "in 3 days": for a meeting a day or more away. */
function relativeDay(start: Date, now: number, zone: string, lang: "en" | "es") {
  const days = daysBetween(dayKey(new Date(now), zone), dayKey(start, zone));
  return new Intl.RelativeTimeFormat(LOCALE[lang], { numeric: "auto" }).format(days, "day");
}

function MeetingBlock({ occurrence: o, kind, now, zone, onDetails }: { occurrence: Occurrence; kind: "current" | "next"; now: number; zone: string; onDetails: (o: Occurrence) => void }) {
  const a = useA();
  const lang = useLang();
  const d = a.dashboard;
  const link = joinUrl(o.meeting);
  const address = o.meeting.location?.address?.trim();

  const left = countdownTo(kind === "current" ? o.end.getTime() : o.start.getTime(), now);
  const label = kind === "current" ? d.endsIn : left.kind === "now" ? d.startingNow : left.kind === "relative" ? d.starts : d.startsIn;
  const value =
    left.kind === "clock" ? left.text : left.kind === "duration" ? fmtDuration(left.minutes) : left.kind === "relative" ? relativeDay(o.start, now, zone, lang) : "";
  const eyebrow = `text-[0.72rem] font-semibold tracking-[0.12em] uppercase ${kind === "current" ? "text-accent-soft" : "text-white/55"}`;
  const when = `${fmtDay(dayKey(o.start, zone), lang, { weekday: "short", month: "short", day: "numeric" })} · ${fmtRange(o.start, o.end, lang, zone)}`;
  const place = link ? d.online : (address ?? d.noPlace);

  return (
    <div className="flex flex-1 flex-col justify-center border-t border-white/[0.06] first:border-t-0">
    {/* tablet and computer: one compact band of about two lines */}
    <div className="hidden items-center gap-4 px-5 py-3 md:flex">
      <div className="min-w-0 flex-1">
        <p className="truncate" title={o.title}>
          <span className={`${eyebrow} block xl:mr-2.5 xl:inline`}>{kind === "current" ? d.current : d.next}</span>
          <span className="text-[1rem] font-semibold">{o.title}</span>
        </p>
        <p className="mt-0.5 truncate text-[0.82rem] text-white/60" title={`${when} · ${place}`}>
          {when}
          <span className="max-xl:hidden"> · {place}</span>
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5 xl:flex-row xl:items-center xl:gap-4">
        <p className="flex items-baseline gap-1.5 whitespace-nowrap">
          <span className="text-[0.75rem] text-white/55">{label}</span>
          {value && <span className="text-[1rem] font-semibold tabular-nums first-letter:uppercase">{value}</span>}
        </p>
        <div className="flex gap-2">
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={d.joinA11y(o.title)}
              className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-lg px-3 text-[0.82rem] font-medium transition ${TONES.meeting}`}
            >
              <Video className="h-4 w-4" aria-hidden />
              {d.join}
            </a>
          )}
          <Button variant="detail" onClick={() => onDetails(o)} aria-label={d.detailsA11y(o.title)} className="h-9! px-3! text-[0.82rem]!">
            {d.details}
          </Button>
        </div>
      </div>
    </div>

    {/* phone */}
    <div className="grid gap-4 px-4 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:px-5 md:hidden">
      <div className="min-w-0">
        <p className={eyebrow}>{kind === "current" ? d.current : d.next}</p>
        <p className="mt-1.5 text-[1.3rem] leading-snug font-semibold break-words">{o.title}</p>
        <p className="mt-2 flex items-center gap-2 text-[0.85rem] text-white/65">
          <CalendarDays className="h-4 w-4 shrink-0" aria-hidden />
          <span className="min-w-0">{when}</span>
        </p>
        <p className="mt-1 flex items-center gap-2 text-[0.85rem] text-white/65">
          {link ? <Video className="h-4 w-4 shrink-0" aria-hidden /> : <MapPin className="h-4 w-4 shrink-0" aria-hidden />}
          <span className="min-w-0 truncate">{place}</span>
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:w-[170px]">
        <div className="flex items-baseline justify-between gap-3 sm:block">
          <p className="text-[0.75rem] text-white/55">{label}</p>
          {value && <p className="text-[1.4rem] leading-tight font-semibold tabular-nums first-letter:uppercase sm:mt-0.5">{value}</p>}
        </div>
        <div className="mt-1 grid grid-cols-2 gap-2 sm:grid-cols-1">
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={d.joinA11y(o.title)}
              className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-[0.88rem] font-medium transition ${TONES.meeting}`}
            >
              <Video className="h-4 w-4" aria-hidden />
              {d.join}
            </a>
          )}
          <Button variant="detail" onClick={() => onDetails(o)} aria-label={d.detailsA11y(o.title)} className={link ? "" : "col-span-2 sm:col-span-1"}>
            {d.details}
          </Button>
        </div>
      </div>
    </div>
    </div>
  );
}

/* ---------- Quick actions ---------- */

function QuickActions({ onNewMeeting, onNewTask }: { onNewMeeting: () => void; onNewTask: () => void }) {
  const a = useA();
  const tile = "flex min-h-[76px] flex-col items-center justify-center gap-1.5 rounded-xl p-2 text-center text-[0.78rem] font-semibold transition";
  return (
    <section aria-label={a.dashboard.actions} className="grid grid-cols-2 gap-2.5">
      <button type="button" onClick={onNewMeeting} className={`${tile} ${TONES.meeting}`}>
        <CalendarPlus className="h-5 w-5" aria-hidden />
        {a.dashboard.newMeeting}
      </button>
      <button type="button" onClick={onNewTask} className={`${tile} ${TONES.task}`}>
        <ListPlus className="h-5 w-5" aria-hidden />
        {a.dashboard.newTask}
      </button>
    </section>
  );
}

/* ---------- Tasks ---------- */

function TasksCard({ today, now, zone, onOpen, onNew }: { today: string; now: number; zone: string; onOpen: (t: Task) => void; onNew: () => void }) {
  const a = useA();
  const s = useAgenda();
  const href = useHref();
  const d = a.dashboard;
  const openCount = s.tasks.filter((t) => t.status === "open").length;
  const rows = dueNow(s.tasks, today);
  return (
    <section aria-labelledby="dash-tasks" className="surface overflow-hidden rounded-2xl">
      <Heading id="dash-tasks" icon={<SquareCheck />} title={d.tasksTitle} trailing={d.openCount(openCount)} />
      {rows.length ? (
        <ul>
          {rows.map((t) => (
            <TaskRow key={t.id} task={t} overdue={isOverdue(t, today, now)} zone={zone} onOpen={() => onOpen(t)} />
          ))}
        </ul>
      ) : (
        <div className="px-4 py-4 sm:px-5">
          <p className="text-[0.86rem] text-white/60">{openCount > 0 ? d.nothingDueToday : d.noTasks}</p>
          {openCount === 0 && (
            <Button variant="task" onClick={onNew} className="mt-3">
              {d.newTask}
            </Button>
          )}
        </div>
      )}
      <Link href={href("/app/tasks")} className="flex items-center gap-1.5 border-t border-white/[0.06] px-4 py-3 text-[0.85rem] font-medium text-white/80 transition-colors hover:text-white sm:px-5">
        {d.viewAllTasks}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </section>
  );
}

function TaskRow({ task: t, overdue, zone, onOpen }: { task: Task; overdue: boolean; zone: string; onOpen: () => void }) {
  const a = useA();
  const lang = useLang();
  const toast = useToast();
  const s = useAgenda();
  const done = async () => {
    try {
      await setTaskDone(t.id, true);
      toast(a.toast.taskDone, { action: { label: a.toast.undo, run: () => void setTaskDone(t.id, false) } });
    } catch {
      toast(a.errors.save, { tone: "error" });
    }
  };
  const due = overdue ? a.dashboard.overdue : t.dueTime && t.dueDate ? fmtTime(fromZoned(t.dueDate, t.dueTime, t.timezone), lang, zone) : a.dashboard.dueToday;
  return (
    <li className="flex items-center gap-3 px-4 py-2.5 sm:px-5">
      <TaskCheck checked={false} busy={s.savingTasks.includes(t.id)} overdue={overdue} onChange={() => void done()} label={a.tasks.markDone(t.title)} />
      <button type="button" onClick={onOpen} className="min-w-0 flex-1 truncate text-left text-[0.9rem] hover:underline">
        {t.title}
      </button>
      <span className={`shrink-0 text-[0.76rem] ${overdue ? "font-medium text-accent-soft" : "text-white/55"}`}>{due}</span>
    </li>
  );
}

/* ---------- Today ---------- */

function Today({ items, zone, onOpen, onNew }: { items: TimelineItem[]; zone: string; onOpen: (o: Occurrence) => void; onNew: () => void }) {
  const a = useA();
  const d = a.dashboard;
  // cancelled meetings stay listed but aren't counted, as in the app
  const count = items.filter((i) => i.occurrence.meeting.status === "scheduled").length;
  return (
    <section aria-labelledby="dash-today" className="surface self-start overflow-hidden rounded-2xl">
      <Heading id="dash-today" title={d.today} trailing={d.meetingCount(count)} />
      {items.length ? (
        <ul>
          {items.map((item) => (
            <TodayRow key={`${item.occurrence.meeting.id}-${item.occurrence.key}`} item={item} zone={zone} onOpen={() => onOpen(item.occurrence)} />
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center px-5 py-9 text-center">
          <span aria-hidden className="grid h-11 w-11 place-items-center rounded-xl bg-white/[0.06] text-white/60">
            <CalendarDays className="h-5 w-5" />
          </span>
          <p className="mt-3 text-[0.98rem] font-semibold">{d.noMeetingsToday}</p>
          <p className="mt-1 text-[0.85rem] text-white/55">{d.noMeetingsHint}</p>
          <Button variant="meeting" onClick={onNew} className="mt-4">
            {d.newMeeting}
          </Button>
        </div>
      )}
    </section>
  );
}

function TodayRow({ item, zone, onOpen }: { item: TimelineItem; zone: string; onOpen: () => void }) {
  const a = useA();
  const lang = useLang();
  const d = a.dashboard;
  const { occurrence: o, state, overlapsWith, followsRightAfter } = item;
  const cancelled = o.meeting.status === "cancelled";
  const badge = cancelled ? d.stateCancelled : o.meeting.allDay ? null : state === "now" ? d.stateNow : state === "past" ? d.stateDone : null;
  const faded = cancelled || state === "past";
  return (
    <li>
      <button type="button" onClick={onOpen} className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-white/[0.03] sm:gap-4 sm:px-5">
        <span className={`w-[64px] shrink-0 pt-0.5 text-[0.8rem] tabular-nums sm:w-[72px] ${faded ? "text-white/45" : "text-white/70"}`}>{o.meeting.allDay ? d.allDay : fmtTime(o.start, lang, zone)}</span>
        <span aria-hidden className={`mt-[7px] h-2 w-2 shrink-0 rounded-full ${state === "now" && !cancelled ? "bg-accent-soft" : "bg-white/25"}`} />
        <span className="min-w-0 flex-1">
          <span className={`block text-[0.93rem] font-medium break-words ${cancelled ? "text-white/45 line-through" : faded ? "text-white/60" : ""}`}>{o.title}</span>
          {!o.meeting.allDay && <span className="mt-0.5 block text-[0.78rem] text-white/50">{fmtRange(o.start, o.end, lang, zone)}</span>}
          {badge && <span className={`mt-1.5 inline-block rounded-md px-2 py-0.5 text-[0.72rem] font-medium ${state === "now" && !cancelled ? "bg-accent/15 text-accent-soft" : "bg-white/[0.07] text-white/60"}`}>{badge}</span>}
          {overlapsWith.length > 0 && (
            <span className="mt-1.5 flex items-center gap-1.5 text-[0.78rem] text-accent-soft">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span className="min-w-0 truncate">{overlapsWith.length === 1 ? d.overlapsWith(overlapsWith[0].title) : d.overlapsMany(overlapsWith.length)}</span>
            </span>
          )}
          {followsRightAfter && (
            <span className="mt-1.5 flex items-center gap-1.5 text-[0.78rem] text-warm">
              <Hourglass className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span className="min-w-0 truncate">{d.rightAfter(followsRightAfter.title)}</span>
            </span>
          )}
        </span>
        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-white/35" aria-hidden />
      </button>
    </li>
  );
}

/* ---------- Your week ---------- */

function YourWeek({ week }: { week: WeekSummary }) {
  const a = useA();
  const lang = useLang();
  const d = a.dashboard;
  const issues: { icon: ReactNode; text: string; tone: string }[] = [
    ...(week.overlaps ? [{ icon: <AlertCircle />, text: d.overlaps(week.overlaps), tone: "text-accent-soft" }] : []),
    ...(week.backToBack ? [{ icon: <Hourglass />, text: d.backToBack(week.backToBack), tone: "text-warm" }] : []),
    ...(week.missingPlace ? [{ icon: <Info />, text: d.missingPlace(week.missingPlace), tone: "text-white/60" }] : []),
    ...(week.withTips ? [{ icon: <Lightbulb />, text: d.withTips(week.withTips), tone: "text-white/60" }] : []),
  ];
  return (
    <section aria-labelledby="dash-week" className="surface self-start overflow-hidden rounded-2xl">
      <Heading id="dash-week" icon={<BarChart3 />} title={d.yourWeek} />
      <div className="px-4 py-4 sm:px-5">
        <p className="text-[0.85rem] font-medium text-white/70">{d.weekTotals(d.meetingCount(week.count), fmtDuration(week.minutes))}</p>
        {/* full width on a computer: the bars on the left, the numbers on the right */}
        <div className="lg:mt-4 lg:grid lg:grid-cols-2 lg:gap-10">
        <div>
        <p className="mt-4 text-[0.78rem] font-medium text-white/55 lg:mt-0">{d.weeklySummary}</p>
        {/* one bar a day, Sunday first */}
        <ul className="mt-2 grid grid-cols-7 gap-1.5">
          {week.days.map((day) => {
            const name = fmtDay(day.day, lang, { weekday: "long" });
            return (
              <li key={day.day} className="flex flex-col items-center gap-1.5" title={d.dayBar(name, d.meetingCount(day.count), fmtDuration(day.minutes))}>
                <span className="sr-only">{d.dayBar(name, d.meetingCount(day.count), fmtDuration(day.minutes))}</span>
                <span aria-hidden className="flex h-16 w-full max-w-[26px] items-end overflow-hidden rounded-md bg-white/[0.05]">
                  <span className={`block w-full rounded-md ${day.count ? "bg-white/70" : ""}`} style={{ height: day.count ? `${Math.max(10, Math.round(barFraction(day, week.days) * 100))}%` : 0 }} />
                </span>
                <span aria-hidden className="text-[0.72rem] text-white/55 uppercase">
                  {fmtDay(day.day, lang, { weekday: "narrow" })}
                </span>
              </li>
            );
          })}
        </ul>
        </div>
        <div>
        <dl className="mt-4 grid grid-cols-2 gap-3 lg:mt-0">
          <Total icon={<CalendarDays />} value={d.meetingCount(week.count)} versus={d.versusMeetings(week.lastCount)} />
          <Total icon={<Clock />} value={d.totalTime(fmtDuration(week.minutes))} versus={d.versusTime(fmtDuration(week.lastMinutes))} />
        </dl>
        <ul className="mt-4 space-y-1.5 border-t border-white/[0.06] pt-3.5">
          {issues.length ? (
            issues.map((i) => (
              <li key={i.text} className="flex items-start gap-2 text-[0.82rem] text-white/75">
                <span aria-hidden className={`mt-0.5 shrink-0 [&>svg]:h-3.5 [&>svg]:w-3.5 ${i.tone}`}>
                  {i.icon}
                </span>
                {i.text}
              </li>
            ))
          ) : (
            <li className="flex items-start gap-2 text-[0.82rem] text-white/75">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#1fa37a]" aria-hidden />
              {d.allClear}
            </li>
          )}
        </ul>
        </div>
        </div>
      </div>
    </section>
  );
}

function Total({ icon, value, versus }: { icon: ReactNode; value: string; versus: string }) {
  return (
    <div className="flex min-w-0 items-start gap-2">
      <span aria-hidden className="mt-0.5 shrink-0 text-white/55 [&>svg]:h-4 [&>svg]:w-4">
        {icon}
      </span>
      <div className="min-w-0">
        <dt className="text-[0.92rem] font-semibold">{value}</dt>
        <dd className="text-[0.74rem] text-white/50">{versus}</dd>
      </div>
    </div>
  );
}
