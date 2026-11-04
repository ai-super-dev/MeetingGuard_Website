"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ListPlus, Plus } from "lucide-react";
import { byDay, type Selection } from "@/components/agenda/Calendar";
import { AgendaFrame } from "@/components/agenda/Frame";
import { SOURCE_COLOR } from "@/components/agenda/look";
import { suggestedTime, useMeetingFlows } from "@/components/agenda/MeetingFlows";
import { MeetingRow, useDayTitle } from "@/components/agenda/MeetingRow";
import { TaskEditor, type TaskDraft } from "@/components/agenda/TaskDialogs";
import { Button, IconButton, TaskCheck, useToast } from "@/components/agenda/ui";
import { useNow } from "@/lib/agenda/hooks";
import { useA } from "@/lib/agenda/i18n";
import { compareWithinDay } from "@/lib/agenda/meetingsList";
import { expandAll } from "@/lib/agenda/recurrence";
import { calendarOf, displayZone, setTaskDone, useAgenda } from "@/lib/agenda/store";
import { addDays, addMonths, dayKey, dayStart, fmtDay, fmtMonth, fmtTime, fromZoned, isDayKey, monthStart, weekday } from "@/lib/agenda/time";
import type { Calendar, Task } from "@/lib/agenda/types";
import { useLang } from "@/lib/language";

/** One dot per source on a day, in this order. Outlook only appears when the account has it. */
const DOT_ORDER: Calendar[] = ["meetingguard", "google", "outlook", "device"];
const LEGEND: Calendar[] = ["meetingguard", "google", "device"];
const TASK_COLOR = "#1fa37a";

/** A day and an open meeting from the address (?date=2026-11-02&open=id). */
function readAddress() {
  const q = new URLSearchParams(window.location.search);
  const date = q.get("date") ?? "";
  return {
    date: isDayKey(date) ? date : "",
    open: q.get("open") ? ({ id: q.get("open") as string, key: q.get("key") ?? "" } satisfies Selection) : null,
  };
}

export function CalendarPage() {
  const a = useA();
  return (
    <AgendaFrame title={a.meta.calendar}>
      <CalendarView />
    </AgendaFrame>
  );
}

/** Rendered once the agenda has loaded in the browser, so it can read the address directly. */
function CalendarView() {
  const a = useA();
  const lang = useLang();
  const s = useAgenda();
  const now = useNow();
  const zone = displayZone(s);
  const today = dayKey(new Date(now), zone);
  const dayTitle = useDayTitle(today);

  const [start] = useState(readAddress);
  const [selected, setSelected] = useState(start.date || today);
  const [month, setMonth] = useState(monthStart(start.date || today));
  const [task, setTask] = useState<TaskDraft | null>(null);
  const flows = useMeetingFlows(start.open);

  // keep the address in step, so a reload opens the same day
  useEffect(() => {
    window.history.replaceState(window.history.state, "", `?date=${selected}`);
  }, [selected]);

  // six weeks, Sunday first
  const grid = useMemo(() => {
    const first = addDays(month, -weekday(month));
    return Array.from({ length: 42 }, (_, i) => addDays(first, i));
  }, [month]);
  const perDay = useMemo(() => byDay(expandAll(s.meetings, dayStart(addDays(grid[0], -1), zone), dayStart(addDays(grid[41], 2), zone)), zone), [s.meetings, grid, zone]);
  // tasks stay on their own date, as in the app
  const tasksByDay = useMemo(() => {
    const map = new Map<string, Task[]>();
    for (const t of s.tasks) if (t.dueDate) map.set(t.dueDate, [...(map.get(t.dueDate) ?? []), t]);
    return map;
  }, [s.tasks]);

  const dayMeetings = [...(perDay.get(selected) ?? [])].sort(compareWithinDay);
  const dayTasks = [...(tasksByDay.get(selected) ?? [])].sort((x, y) => Number(x.status === "done") - Number(y.status === "done") || (x.dueTime ?? "99:99").localeCompare(y.dueTime ?? "99:99"));
  const showingToday = selected === today && month === monthStart(today);
  const legend = s.meetings.some((m) => calendarOf(m) === "outlook") ? DOT_ORDER : LEGEND;

  const select = (day: string) => {
    setSelected(day);
    setMonth(monthStart(day));
  };
  const changeMonth = (delta: 1 | -1) => {
    const next = addMonths(month, delta);
    setMonth(next);
    // keep the selection inside the month: today when it is there, otherwise the 1st
    setSelected(next === monthStart(today) ? today : next);
  };

  const summary = [dayMeetings.length ? a.calendar.count(dayMeetings.length) : a.calendarPage.noMeetings, ...(dayTasks.length ? [a.calendarPage.taskCount(dayTasks.length)] : [])].join(" · ");

  return (
    // as on Tasks: the full width up to 1180px, then centred at about 84%.
    // On a computer it fills the screen under the top bar, and only the day's list scrolls.
    <div className="mx-auto w-full max-w-[max(1180px,84%)] lg:-mb-6 lg:flex lg:h-[calc(100dvh-97px)] lg:min-h-[540px] lg:flex-col">
      {/* the month, and the two ways to add something to the selected day */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-3">
        <div className="flex min-w-0 flex-1 items-center gap-1 max-sm:basis-full">
          <IconButton label={a.calendarPage.previousMonth} onClick={() => changeMonth(-1)}>
            <ChevronLeft className="h-5 w-5" />
          </IconButton>
          <h2 aria-live="polite" className="min-w-0 truncate px-1 text-center text-[1.15rem] font-semibold first-letter:uppercase max-sm:flex-1 sm:text-[1.25rem]">
            {fmtMonth(month, lang)}
          </h2>
          <IconButton label={a.calendarPage.nextMonth} onClick={() => changeMonth(1)}>
            <ChevronRight className="h-5 w-5" />
          </IconButton>
          {!showingToday && (
            <Button onClick={() => select(today)} aria-label={a.calendarPage.goToToday} className="ml-1 h-9! px-3!">
              {a.toolbar.today}
            </Button>
          )}
        </div>
        <div className="grid shrink-0 grid-cols-2 gap-2 max-sm:w-full sm:flex">
          <Button variant="meeting" onClick={() => flows.newMeeting(selected, suggestedTime(selected, today, now, zone))} className="whitespace-nowrap max-sm:px-2.5!">
            <Plus className="h-4 w-4" aria-hidden />
            {a.toolbar.newMeeting}
          </Button>
          <Button variant="task" onClick={() => setTask({ dueDate: selected })} className="whitespace-nowrap max-sm:px-2.5!">
            <ListPlus className="h-4 w-4" aria-hidden />
            {a.tasks.newTask}
          </Button>
        </div>
      </div>

      <div className="mt-4 grid items-start gap-5 lg:min-h-0 lg:flex-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-stretch">
        {/* the month grid */}
        <section aria-label={fmtMonth(month, lang)} className="surface rounded-2xl p-3 sm:p-4 lg:flex lg:min-h-0 lg:flex-col">
          <div aria-hidden className="grid grid-cols-7">
            {grid.slice(0, 7).map((d) => (
              <span key={d} className="pb-1.5 text-center text-[0.72rem] font-medium text-white/50 uppercase">
                {fmtDay(d, lang, { weekday: "short" }).replace(".", "").slice(0, 2)}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-0.5 lg:min-h-0 lg:flex-1 lg:grid-rows-6">
            {grid.map((d) => {
              const meetings = perDay.get(d) ?? [];
              const inMonth = d.slice(0, 7) === month.slice(0, 7);
              const isSelected = d === selected;
              const isToday = d === today;
              const hasTasks = (tasksByDay.get(d) ?? []).some((t) => t.status === "open");
              const present = new Set(meetings.map((o) => calendarOf(o.meeting)));
              const label = [fmtDay(d, lang, { weekday: "long", month: "long", day: "numeric", year: "numeric" }), meetings.length ? a.calendar.count(meetings.length) : a.calendarPage.noMeetings, ...(hasTasks ? [a.calendarPage.hasTasks] : []), ...(isToday ? [a.calendarPage.todayMarker] : [])].join(", ");
              return (
                <button key={d} type="button" onClick={() => select(d)} aria-pressed={isSelected} aria-label={label} className="group flex flex-col items-center justify-center pt-1 pb-1">
                  <span
                    className={`grid h-9 w-9 place-items-center rounded-full text-[0.88rem] transition-colors sm:h-10 sm:w-10 ${
                      isSelected ? "bg-accent font-semibold text-[#fff]" : isToday ? "bg-accent/15 font-semibold text-accent-soft" : inMonth ? "text-white group-hover:bg-white/[0.08]" : "text-white/30 group-hover:bg-white/[0.05]"
                    }`}
                  >
                    {Number(d.slice(8))}
                  </span>
                  <span aria-hidden className={`mt-1 flex h-1.5 items-center gap-[3px] ${inMonth ? "" : "opacity-50"}`}>
                    {DOT_ORDER.filter((c) => present.has(c)).map((c) => (
                      <span key={c} className="h-1.5 w-1.5 rounded-full" style={{ background: SOURCE_COLOR[c] }} />
                    ))}
                    {hasTasks && <span className="h-1.5 w-1.5 rounded-full border-[1.5px]" style={{ borderColor: TASK_COLOR }} />}
                  </span>
                </button>
              );
            })}
          </div>
          <div aria-hidden className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1.5 border-t border-white/[0.06] pt-3 text-[0.75rem] text-white/60">
            {legend.map((c) => (
              <span key={c} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: SOURCE_COLOR[c] }} />
                {a.sources[c]}
              </span>
            ))}
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full border-[1.5px]" style={{ borderColor: TASK_COLOR }} />
              {a.tasks.title}
            </span>
          </div>
        </section>

        {/* the selected day */}
        <section aria-label={dayTitle(selected)} className="min-w-0 lg:flex lg:min-h-0 lg:flex-col">
          <h2 className="text-[1.05rem] font-semibold first-letter:uppercase">{dayTitle(selected)}</h2>
          <p role="status" className="mt-0.5 text-[0.8rem] text-white/55">
            {summary}
          </p>

          {/* on a computer, the only part of the page that scrolls */}
          <div data-scroll-area className="mt-3 space-y-3 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-1.5 lg:[scrollbar-width:thin]">
            {dayTasks.length > 0 && (
              <ul aria-label={a.tasks.title} className="surface rounded-2xl py-1">
                {dayTasks.map((t) => (
                  <DayTask key={t.id} task={t} zone={zone} onOpen={() => setTask({ id: t.id })} />
                ))}
              </ul>
            )}

            {dayMeetings.length > 0 ? (
              <div className="space-y-2.5">
                {dayMeetings.map((o) => (
                  <MeetingRow key={o.meeting.id + o.key} o={o} zone={zone} now={now} flows={flows} />
                ))}
              </div>
            ) : (
              <p className="surface rounded-2xl px-5 py-8 text-center text-[0.88rem] text-white/55">{a.calendarPage.emptyDay}</p>
            )}
          </div>
        </section>
      </div>

      {task && <TaskEditor draft={task} onClose={() => setTask(null)} />}
      {flows.dialogs}
    </div>
  );
}

function DayTask({ task: t, zone, onOpen }: { task: Task; zone: string; onOpen: () => void }) {
  const a = useA();
  const lang = useLang();
  const toast = useToast();
  const s = useAgenda();
  const done = t.status === "done";
  const toggle = async (next: boolean) => {
    try {
      await setTaskDone(t.id, next);
      toast(next ? a.toast.taskDone : a.toast.taskUndone, { action: { label: a.toast.undo, run: () => void setTaskDone(t.id, !next) } });
    } catch {
      toast(a.errors.save, { tone: "error" });
    }
  };
  return (
    <li className="flex items-center gap-3 px-4 py-2">
      <TaskCheck
        checked={done}
        busy={s.savingTasks.includes(t.id)}
        onChange={(next) => void toggle(next)}
        label={done ? a.tasks.markUndone(t.title) : a.tasks.markDone(t.title)}
      />
      <button type="button" onClick={onOpen} className={`min-w-0 flex-1 truncate text-left text-[0.9rem] hover:underline ${done ? "text-white/45 line-through" : ""}`}>
        {t.title}
      </button>
      {t.dueTime && t.dueDate && <span className="shrink-0 text-[0.76rem] text-white/55">{fmtTime(fromZoned(t.dueDate, t.dueTime, t.timezone), lang, zone)}</span>}
    </li>
  );
}
