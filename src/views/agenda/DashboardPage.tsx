"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, BarChart3, CalendarDays, CalendarPlus, CheckCircle2, ChevronRight, CircleUser, Clock, Hourglass, Info, Lightbulb, ListPlus, MapPin, SquareCheck, Video } from "lucide-react";
import { AgendaFrame } from "@/components/agenda/Frame";
import { CancelDialog, EditScopeDialog, MeetingDetails, MeetingEditor, MoveDialog, OccurrenceEditor, type EditorMode } from "@/components/agenda/MeetingDialogs";
import { TaskEditor, type TaskDraft } from "@/components/agenda/TaskDialogs";
import type { Selection } from "@/components/agenda/Calendar";
import { Button, useToast } from "@/components/agenda/ui";
import { barFraction, countdownTo, dayPeriodOf, dueNow, findNowAndNext, firstNameOf, isOverdue, todayTimeline, weekSummary, type TimelineItem, type WeekSummary } from "@/lib/agenda/dashboard";
import { useNow } from "@/lib/agenda/hooks";
import { useA } from "@/lib/agenda/i18n";
import { expandAll } from "@/lib/agenda/recurrence";
import { displayZone, joinUrl, setTaskDone, useAgenda } from "@/lib/agenda/store";
import { addDays, dayKey, dayStart, daysBetween, fmtDay, fmtDuration, fmtRange, fmtTime, fromZoned, LOCALE, minuteOfDay, zoned } from "@/lib/agenda/time";
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

  const [editor, setEditor] = useState<EditorMode | null>(null);
  const [task, setTask] = useState<TaskDraft | null>(null);
  const [open, setOpen] = useState<Selection | null>(null);
  const [askScope, setAskScope] = useState<Selection | null>(null);
  const [occurrenceEdit, setOccurrenceEdit] = useState<{ sel: Selection; scope: "one" | "following" } | null>(null);
  const [moving, setMoving] = useState<Selection | null>(null);
  const [cancelling, setCancelling] = useState<Selection | null>(null);

  // the calendar used to live at this address: send its old links on to where it is now
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.has("view") || q.has("date") || q.has("open")) window.location.replace(`${window.location.pathname.replace(/\/$/, "")}/meetings/?${q}`);
  }, []);

  const occs = useMemo(
    () => expandAll(s.meetings, dayStart(addDays(today, -PAST_DAYS), zone), dayStart(addDays(today, FUTURE_DAYS), zone)),
    [s.meetings, today, zone],
  );
  const timeline = useMemo(() => todayTimeline(occs, today, zone, now), [occs, today, zone, now]);
  const week = useMemo(() => weekSummary(occs, today, zone, now), [occs, today, zone, now]);

  const newMeeting = () => {
    // the next half hour today, as on the Meetings page
    const next = Math.ceil((minuteOfDay(new Date(now), zone) + 1) / 30) * 30;
    const time = next < 24 * 60 ? `${String(Math.floor(next / 60)).padStart(2, "0")}:${String(next % 60).padStart(2, "0")}` : "09:00";
    setEditor({ kind: "new", day: next < 24 * 60 ? today : addDays(today, 1), time });
  };
  const details = (o: Occurrence) => setOpen({ id: o.meeting.id, key: o.key });

  return (
    <div className="mx-auto w-full max-w-[1180px] space-y-5">
      <Greeting now={now} zone={zone} today={today} />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <NowAndNext occs={occs} zone={zone} onDetails={details} />
        <div className="space-y-5">
          <QuickActions onNewMeeting={newMeeting} onNewTask={() => setTask({})} />
          <TasksCard today={today} now={now} zone={zone} onOpen={(t) => setTask({ id: t.id })} onNew={() => setTask({})} />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Today items={timeline} zone={zone} onOpen={details} onNew={newMeeting} />
        <YourWeek week={week} />
      </div>

      {task && <TaskEditor draft={task} onClose={() => setTask(null)} />}
      {open && (
        <MeetingDetails
          sel={open}
          onClose={() => setOpen(null)}
          onEdit={() => {
            // one date of a series: ask which meetings the edit is for, as on the Meetings page
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
    <section className="surface relative overflow-hidden rounded-2xl px-5 py-6 sm:px-7 sm:py-7">
      {name && <p className="text-[0.75rem] font-semibold tracking-[0.14em] text-white/55 uppercase">{period}</p>}
      <p className={`text-[1.9rem] leading-tight font-semibold tracking-[-0.02em] break-words sm:text-[2.3rem] ${name ? "mt-1" : ""}`}>{name ?? period}</p>
      <p className="mt-1.5 text-[0.92rem] text-white/60 first-letter:uppercase">{fmtDay(today, lang, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
      <CalendarDays aria-hidden strokeWidth={1} className="pointer-events-none absolute top-1/2 right-5 hidden h-28 w-28 -translate-y-1/2 text-white/[0.07] sm:block" />
    </section>
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
    <section aria-label={a.dashboard.next} className="surface flex flex-col divide-y divide-white/[0.06] overflow-hidden rounded-2xl">
      {current && <MeetingBlock occurrence={current} kind="current" now={now} zone={zone} onDetails={onDetails} />}
      {next && <MeetingBlock occurrence={next} kind="next" now={now} zone={zone} onDetails={onDetails} />}
      {!current && !next && (
        <div className="flex flex-1 items-center gap-3.5 px-5 py-6">
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

  return (
    <div className="grid gap-4 px-4 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:px-5">
      <div className="min-w-0">
        <p className={`text-[0.72rem] font-semibold tracking-[0.12em] uppercase ${kind === "current" ? "text-accent-soft" : "text-white/55"}`}>{kind === "current" ? d.current : d.next}</p>
        <p className="mt-1.5 text-[1.3rem] leading-snug font-semibold break-words">{o.title}</p>
        <p className="mt-2 flex items-center gap-2 text-[0.85rem] text-white/65">
          <CalendarDays className="h-4 w-4 shrink-0" aria-hidden />
          <span className="min-w-0">
            {fmtDay(dayKey(o.start, zone), lang, { weekday: "short", month: "short", day: "numeric" })} · {fmtRange(o.start, o.end, lang, zone)}
          </span>
        </p>
        <p className="mt-1 flex items-center gap-2 text-[0.85rem] text-white/65">
          {link ? <Video className="h-4 w-4 shrink-0" aria-hidden /> : <MapPin className="h-4 w-4 shrink-0" aria-hidden />}
          <span className="min-w-0 truncate">{link ? d.online : (address ?? d.noPlace)}</span>
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
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-inverse px-4 text-[0.88rem] font-medium text-on-inverse transition-colors hover:bg-inverse-hover"
            >
              <Video className="h-4 w-4" aria-hidden />
              {d.join}
            </a>
          )}
          <Button onClick={() => onDetails(o)} aria-label={d.detailsA11y(o.title)} className={link ? "" : "col-span-2 sm:col-span-1"}>
            {d.details}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Quick actions ---------- */

function QuickActions({ onNewMeeting, onNewTask }: { onNewMeeting: () => void; onNewTask: () => void }) {
  const a = useA();
  const href = useHref();
  const tile = "flex min-h-[76px] flex-col items-center justify-center gap-1.5 rounded-xl border p-2 text-center text-[0.78rem] font-medium transition-colors";
  const plain = `${tile} surface text-white/85 hover:border-white/25 hover:text-white`;
  return (
    <section aria-label={a.dashboard.actions} className="grid grid-cols-4 gap-2.5">
      <button type="button" onClick={onNewMeeting} className={`${tile} border-transparent bg-inverse text-on-inverse hover:bg-inverse-hover`}>
        <CalendarPlus className="h-5 w-5" aria-hidden />
        {a.dashboard.newMeeting}
      </button>
      <button type="button" onClick={onNewTask} className={plain}>
        <ListPlus className="h-5 w-5" aria-hidden />
        {a.dashboard.newTask}
      </button>
      <Link href={href("/app/meetings")} className={plain}>
        <CalendarDays className="h-5 w-5" aria-hidden />
        {a.nav.agenda}
      </Link>
      <Link href={href("/app/account")} className={plain}>
        <CircleUser className="h-5 w-5" aria-hidden />
        {a.nav.account}
      </Link>
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
        <ul className="divide-y divide-white/[0.06]">
          {rows.map((t) => (
            <TaskRow key={t.id} task={t} overdue={isOverdue(t, today, now)} zone={zone} onOpen={() => onOpen(t)} />
          ))}
        </ul>
      ) : (
        <div className="px-4 py-4 sm:px-5">
          <p className="text-[0.86rem] text-white/60">{openCount > 0 ? d.nothingDueToday : d.noTasks}</p>
          {openCount === 0 && (
            <Button onClick={onNew} className="mt-3">
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
      <input
        type="checkbox"
        checked={false}
        onChange={() => void done()}
        aria-label={a.tasks.markDone(t.title)}
        className={`h-5 w-5 shrink-0 cursor-pointer appearance-none rounded-full border-2 transition-colors hover:border-white/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 ${overdue ? "border-accent-soft/70" : "border-white/30"}`}
      />
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
        <ul className="divide-y divide-white/[0.06]">
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
          <Button onClick={onNew} className="mt-4">
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
        <p className="mt-4 text-[0.78rem] font-medium text-white/55">{d.weeklySummary}</p>
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
        <dl className="mt-4 grid grid-cols-2 gap-3">
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
