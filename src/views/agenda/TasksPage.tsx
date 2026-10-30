"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { AlertCircle, Bell, CalendarClock, CalendarDays, Check, CheckCircle2, ChevronDown, Clock, Inbox, Link2, ListTodo, Plus, Sparkles, Sun } from "lucide-react";
import { AgendaFrame } from "@/components/agenda/Frame";
import { CaptureCard, TaskEditor, useDueLabel, type TaskDraft } from "@/components/agenda/TaskDialogs";
import { Button, useToast } from "@/components/agenda/ui";
import { capture } from "@/lib/agenda/capture";
import { useNow } from "@/lib/agenda/hooks";
import { useA } from "@/lib/agenda/i18n";
import { displayZone, setTaskDone, useAgenda } from "@/lib/agenda/store";
import { addDays, dayKey, fromZoned } from "@/lib/agenda/time";
import type { Task } from "@/lib/agenda/types";
import { useHref, useLang } from "@/lib/language";

type Group = "overdue" | "today" | "tomorrow" | "upcoming" | "someday";
const GROUPS: Group[] = ["overdue", "today", "tomorrow", "upcoming", "someday"];

const GROUP_ICONS: Record<Group, ReactNode> = {
  overdue: <AlertCircle />,
  today: <Sun />,
  tomorrow: <CalendarClock />,
  upcoming: <CalendarDays />,
  someday: <Inbox />,
};

const dueAt = (t: Task) => `${t.dueDate ?? "9999"}T${t.dueTime ?? "99:99"}`;

/** Open and past due: a timed task after its moment, a task with only a date after its day. */
function isOverdue(t: Task, today: string, now: number) {
  if (t.status !== "open" || !t.dueDate) return false;
  return t.dueTime ? fromZoned(t.dueDate, t.dueTime, t.timezone).getTime() < now : t.dueDate < today;
}

export function TasksPage() {
  const a = useA();
  return (
    <AgendaFrame title={a.tasks.title}>
      <Tasks />
    </AgendaFrame>
  );
}

function Tasks() {
  const a = useA();
  const lang = useLang();
  const s = useAgenda();
  const now = useNow();
  const zone = displayZone(s);
  const today = dayKey(new Date(now), zone);

  const [text, setText] = useState("");
  const [card, setCard] = useState<TaskDraft | null>(null);
  const [editing, setEditing] = useState<TaskDraft | null>(null);
  const [showDone, setShowDone] = useState(false);

  const groupOf = (t: Task): Group => {
    if (!t.dueDate) return "someday";
    if (isOverdue(t, today, now)) return "overdue";
    if (t.dueDate === today) return "today";
    if (t.dueDate === addDays(today, 1)) return "tomorrow";
    return "upcoming";
  };
  const open = s.tasks.filter((t) => t.status === "open").sort((x, y) => dueAt(x).localeCompare(dueAt(y)));
  const done = s.tasks.filter((t) => t.status === "done").sort((x, y) => (y.completedAt ?? "").localeCompare(x.completedAt ?? ""));
  const count = (...gs: Group[]) => open.filter((t) => gs.includes(groupOf(t))).length;
  const total = s.tasks.length;
  const percent = total ? Math.round((done.length / total) * 100) : 0;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    const c = capture(text, lang, today);
    if (!c.title) return;
    setCard({ title: c.title, dueDate: c.dueDate, dueTime: c.dueTime });
    setText("");
  };

  return (
    // as on Account: the full width up to 1180px, then centred at about 84%
    <div className="mx-auto w-full max-w-[max(1180px,84%)]">
      {/* quick capture */}
      <form onSubmit={submit} className="surface rounded-2xl p-4 sm:p-5">
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] py-1.5 pr-1.5 pl-4 transition-colors focus-within:border-white/30">
          <Sparkles className="h-[18px] w-[18px] shrink-0 text-white/45" aria-hidden />
          <label htmlFor="capture" className="sr-only">
            {a.tasks.capture}
          </label>
          <input
            id="capture"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={a.tasks.capturePlaceholder}
            aria-describedby="capture-hint"
            autoComplete="off"
            className="h-11 min-w-0 flex-1 bg-transparent text-[1rem] text-white outline-none placeholder:text-white/35"
          />
          <Button variant="primary" type="submit" className="h-10 px-3 sm:px-4" aria-label={a.tasks.capture}>
            <Plus className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">{a.tasks.capture}</span>
          </Button>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1">
          <p id="capture-hint" className="text-[0.78rem] text-white/45">
            {a.tasks.captureHint}
          </p>
          <button type="button" onClick={() => setEditing({})} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[0.82rem] font-medium text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white">
            <Plus className="h-3.5 w-3.5" aria-hidden />
            {a.tasks.newTask}
          </button>
        </div>
      </form>

      {/* at a glance */}
      {total > 0 && (
        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat icon={<AlertCircle />} label={a.tasks.groups.overdue} value={count("overdue")} total={total} tone={count("overdue") ? "alert" : undefined} />
          <Stat icon={<Sun />} label={a.tasks.groups.today} value={count("today")} total={total} />
          <Stat icon={<CalendarDays />} label={a.tasks.groups.upcoming} value={count("tomorrow", "upcoming")} total={total} />
          <Stat icon={<CheckCircle2 />} label={a.tasks.groups.done} value={done.length} total={total} tone="done" note={`${percent}%`} title={a.tasks.progress(done.length, total)} />
        </div>
      )}

      {/* the list */}
      <div className="mt-8 space-y-6">
        {!s.tasks.length && (
          <Empty icon={<ListTodo />} text={a.tasks.empty} />
        )}
        {s.tasks.length > 0 && !open.length && <Empty icon={<CheckCircle2 />} text={a.tasks.allDone} tone="done" />}
        {GROUPS.map((g) => {
          const list = open.filter((t) => groupOf(t) === g);
          if (!list.length) return null;
          return (
            <section key={g} aria-labelledby={`group-${g}`} className={`surface overflow-hidden rounded-2xl ${g === "overdue" ? "border-accent/30!" : ""}`}>
              <h2 id={`group-${g}`} className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3 sm:px-5">
                <span aria-hidden className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg [&>svg]:h-4 [&>svg]:w-4 ${g === "overdue" ? "bg-accent/15 text-accent-soft" : "bg-white/[0.06] text-white/70"}`}>
                  {GROUP_ICONS[g]}
                </span>
                <span className={`text-[0.95rem] font-semibold ${g === "overdue" ? "text-accent-soft" : ""}`}>{a.tasks.groups[g]}</span>
                <span className="rounded-full bg-white/[0.07] px-2 py-0.5 text-[0.72rem] font-medium text-white/60">{list.length}</span>
              </h2>
              <ul className="divide-y divide-white/[0.06]">
                {list.map((t) => (
                  <TaskRow key={t.id} task={t} overdue={g === "overdue"} onEdit={() => setEditing({ id: t.id })} />
                ))}
              </ul>
            </section>
          );
        })}

        {done.length > 0 && (
          <section aria-labelledby="group-done" className="surface overflow-hidden rounded-2xl">
            <h2 id="group-done">
              <button
                type="button"
                aria-expanded={showDone}
                onClick={() => setShowDone((v) => !v)}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/[0.03] sm:px-5 ${showDone ? "border-b border-white/[0.06]" : ""}`}
              >
                <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#1fa37a]/12 text-[#1fa37a]">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
                <span className="flex-1 text-[0.95rem] font-semibold text-white/80">{showDone ? a.tasks.hideDone : a.tasks.showDone(done.length)}</span>
                <ChevronDown className={`h-4 w-4 text-white/50 transition-transform ${showDone ? "rotate-180" : ""}`} aria-hidden />
              </button>
            </h2>
            {showDone && (
              <ul className="divide-y divide-white/[0.06]">
                {done.slice(0, 50).map((t) => (
                  <TaskRow key={t.id} task={t} overdue={false} onEdit={() => setEditing({ id: t.id })} />
                ))}
              </ul>
            )}
          </section>
        )}
      </div>

      {card && (
        <CaptureCard
          draft={card}
          onClose={() => setCard(null)}
          onEdit={() => {
            setEditing(card);
            setCard(null);
          }}
        />
      )}
      {editing && <TaskEditor draft={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

/** One number of the overview: "Today 3", with a bar for its share of all tasks. */
function Stat({ icon, label, value, total, tone, note, title }: { icon: ReactNode; label: string; value: number; total: number; tone?: "alert" | "done"; note?: string; title?: string }) {
  const color = tone === "alert" ? "bg-accent/15 text-accent-soft" : tone === "done" ? "bg-[#1fa37a]/12 text-[#1fa37a]" : "bg-white/[0.06] text-white/70";
  const bar = tone === "alert" ? "bg-accent-soft" : tone === "done" ? "bg-[#1fa37a]" : "bg-white/45";
  return (
    <div title={title} className={`surface rounded-2xl p-4 ${tone === "alert" ? "border-accent/30!" : ""}`}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-[0.8rem] font-medium text-white/60">{label}</p>
        <span aria-hidden className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg [&>svg]:h-[15px] [&>svg]:w-[15px] ${color}`}>
          {icon}
        </span>
      </div>
      <p className="mt-2 flex items-baseline justify-between gap-2">
        <span className={`text-[1.75rem] leading-none font-semibold tabular-nums ${tone === "alert" ? "text-accent-soft" : ""}`}>{value}</span>
        {note && <span className="text-[0.78rem] font-medium text-[#1fa37a]">{note}</span>}
      </p>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.07]" aria-hidden>
        <div className={`h-full rounded-full ${bar}`} style={{ width: `${total ? Math.round((value / total) * 100) : 0}%` }} />
      </div>
      {title && <p className="sr-only">{title}</p>}
    </div>
  );
}

function Empty({ icon, text, tone }: { icon: ReactNode; text: string; tone?: "done" }) {
  return (
    <div className="surface flex flex-col items-center rounded-2xl px-5 py-12 text-center">
      <span aria-hidden className={`grid h-12 w-12 place-items-center rounded-2xl [&>svg]:h-6 [&>svg]:w-6 ${tone === "done" ? "bg-[#1fa37a]/12 text-[#1fa37a]" : "bg-white/[0.06] text-white/60"}`}>
        {icon}
      </span>
      <p className="mt-4 max-w-[360px] text-[0.92rem] text-white/60">{text}</p>
    </div>
  );
}

const chip = "inline-flex max-w-full items-center gap-1.5 rounded-md bg-white/[0.05] px-2 py-1 text-[0.75rem] text-white/60";

function TaskRow({ task: t, overdue, onEdit }: { task: Task; overdue: boolean; onEdit: () => void }) {
  const a = useA();
  const s = useAgenda();
  const href = useHref();
  const toast = useToast();
  const due = useDueLabel();
  const zone = displayZone(s);
  const meeting = t.meetingId ? s.meetings.find((m) => m.id === t.meetingId) : undefined;
  const isDone = t.status === "done";

  const toggle = async (done: boolean) => {
    try {
      await setTaskDone(t.id, done);
      toast(done ? a.toast.taskDone : a.toast.taskUndone, { action: { label: a.toast.undo, run: () => void setTaskDone(t.id, !done) } });
    } catch {
      toast(a.errors.save, { tone: "error" });
    }
  };

  return (
    <li className="flex items-start gap-3.5 px-4 py-3.5 transition-colors hover:bg-white/[0.025] sm:px-5">
      {/* a round box over the real checkbox */}
      <span className="relative mt-0.5 grid h-5 w-5 shrink-0 place-items-center">
        <input
          type="checkbox"
          checked={isDone}
          onChange={(e) => toggle(e.target.checked)}
          aria-label={isDone ? a.tasks.markUndone(t.title) : a.tasks.markDone(t.title)}
          className={`peer h-5 w-5 cursor-pointer appearance-none rounded-full border-2 transition-colors checked:border-[#1fa37a] checked:bg-[#1fa37a] hover:border-white/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 ${overdue ? "border-accent-soft/70" : "border-white/30"}`}
        />
        <Check className="pointer-events-none absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100" strokeWidth={3} aria-hidden />
      </span>
      <div className="min-w-0 flex-1 md:flex md:items-start md:gap-6">
        <div className="min-w-0 flex-1">
          <button type="button" onClick={onEdit} className={`block max-w-full text-left text-[0.95rem] font-medium hover:underline ${isDone ? "text-white/45 line-through" : "text-white"}`}>
            {t.title}
          </button>
          {t.description && !isDone && <p className="mt-0.5 truncate text-[0.8rem] text-white/45">{t.description}</p>}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-1.5 md:mt-0 md:max-w-[50%] md:justify-end">
          {t.dueDate && (
            <span className={`${chip} ${overdue ? "bg-accent/15! font-medium text-accent-soft!" : ""}`}>
              <Clock className="h-3 w-3 shrink-0" aria-hidden />
              {due(t)}
            </span>
          )}
          {t.reminderMinutesBefore !== null && !isDone && (
            <span className={chip}>
              <Bell className="h-3 w-3 shrink-0" aria-hidden />
              {t.reminderMinutesBefore === 0 ? a.taskEditor.atDueTime : a.reminder(t.reminderMinutesBefore)}
            </span>
          )}
          {meeting && (
            <Link href={`${href("/app")}?view=day&date=${dayKey(new Date(meeting.startAt), zone)}&open=${meeting.id}`} className={`${chip} transition-colors hover:bg-white/[0.1] hover:text-white`}>
              <Link2 className="h-3 w-3 shrink-0" aria-hidden />
              <span className="truncate">{meeting.title}</span>
            </Link>
          )}
          {t.meetingId && !meeting && <span className={chip}>{a.tasks.meetingGone}</span>}
        </div>
      </div>
    </li>
  );
}
