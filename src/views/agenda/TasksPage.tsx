"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { AlertCircle, Bell, CalendarClock, CalendarDays, Check, CheckCircle2, Clock, Inbox, Link2, ListChecks, ListTodo, Pencil, Plus, Search, SearchX, Sun, Trash2, X } from "lucide-react";
import { AgendaFrame } from "@/components/agenda/Frame";
import { DeleteTaskDialog, TaskEditor, useDueLabel, type TaskDraft } from "@/components/agenda/TaskDialogs";
import { Button, IconButton, useToast } from "@/components/agenda/ui";
import { useNow } from "@/lib/agenda/hooks";
import { useA } from "@/lib/agenda/i18n";
import { displayZone, setTaskDone, useAgenda } from "@/lib/agenda/store";
import { addDays, dayKey, fromZoned } from "@/lib/agenda/time";
import type { Task } from "@/lib/agenda/types";
import { useHref } from "@/lib/language";

type Group = "overdue" | "today" | "tomorrow" | "upcoming" | "someday" | "done";
const GROUPS: Group[] = ["overdue", "today", "tomorrow", "upcoming", "someday", "done"];

type Filter = "overdue" | "today" | "upcoming" | "done" | "all";

const GROUP_ICONS: Record<Group, ReactNode> = {
  overdue: <AlertCircle />,
  today: <Sun />,
  tomorrow: <CalendarClock />,
  upcoming: <CalendarDays />,
  someday: <Inbox />,
  done: <CheckCircle2 />,
};

const dueAt = (t: Task) => `${t.dueDate ?? "9999"}T${t.dueTime ?? "99:99"}`;

/** Open and past due: a timed task after its moment, a task with only a date after its day. */
function isOverdue(t: Task, today: string, now: number) {
  if (t.status !== "open" || !t.dueDate) return false;
  return t.dueTime ? fromZoned(t.dueDate, t.dueTime, t.timezone).getTime() < now : t.dueDate < today;
}

/** The app's search: any case, with or without accents. */
const normalize = (text: string) => text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();

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
  const s = useAgenda();
  const now = useNow();
  const zone = displayZone(s);
  const today = dayKey(new Date(now), zone);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [editing, setEditing] = useState<TaskDraft | null>(null);
  const [deleting, setDeleting] = useState<Task | null>(null);

  const groupOf = (t: Task): Group => {
    if (t.status === "done") return "done";
    if (!t.dueDate) return "someday";
    if (isOverdue(t, today, now)) return "overdue";
    if (t.dueDate === today) return "today";
    if (t.dueDate === addDays(today, 1)) return "tomorrow";
    return "upcoming";
  };
  // as in the app, Today also lists what is overdue
  const inFilter: Record<Filter, (t: Task) => boolean> = {
    overdue: (t) => isOverdue(t, today, now),
    today: (t) => t.status === "open" && !!t.dueDate && t.dueDate <= today,
    upcoming: (t) => t.status === "open" && !!t.dueDate && t.dueDate > today,
    done: (t) => t.status === "done",
    all: () => true,
  };
  const count = (f: Filter) => s.tasks.filter(inFilter[f]).length;
  const total = s.tasks.length;
  const doneCount = count("done");
  const percent = total ? Math.round((doneCount / total) * 100) : 0;

  const words = normalize(query).split(/\s+/).filter(Boolean);
  const matches = (t: Task) => {
    const people = t.people.map((p) => `${p.name} ${p.email ?? ""}`).join("\n");
    const meeting = t.meetingId ? (s.meetings.find((m) => m.id === t.meetingId)?.title ?? "") : "";
    const text = normalize(`${t.title}\n${t.description}\n${people}\n${meeting}`);
    return words.every((w) => text.includes(w));
  };
  const shown = s.tasks.filter((t) => inFilter[filter](t) && matches(t));
  const inGroup = (g: Group) =>
    shown
      .filter((t) => groupOf(t) === g)
      .sort((x, y) => (g === "done" ? (y.completedAt ?? "").localeCompare(x.completedAt ?? "") : dueAt(x).localeCompare(dueAt(y))));

  const cards: { id: Filter; icon: ReactNode; label: string; tone?: "alert" | "done"; note?: string; title?: string }[] = [
    { id: "overdue", icon: <AlertCircle />, label: a.tasks.groups.overdue, tone: count("overdue") ? "alert" : undefined },
    { id: "today", icon: <Sun />, label: a.tasks.groups.today },
    { id: "upcoming", icon: <CalendarDays />, label: a.tasks.groups.upcoming },
    { id: "done", icon: <CheckCircle2 />, label: a.tasks.groups.done, tone: "done", note: `${percent}%`, title: a.tasks.progress(doneCount, total) },
    { id: "all", icon: <ListChecks />, label: a.tasks.all },
  ];

  return (
    // as on Account: the full width up to 1180px, then centred at about 84%
    <div className="mx-auto w-full max-w-[max(1180px,84%)]">
      {/* search and new task: one row, stacked on a phone */}
      <div className="flex items-center gap-3 max-sm:flex-col max-sm:items-stretch">
        <div className="flex h-11 min-w-0 flex-1 items-center gap-3 rounded-xl border max-sm:flex-none border-white/10 bg-white/[0.03] pr-1 pl-4 transition-colors focus-within:border-white/30">
          <Search className="h-[18px] w-[18px] shrink-0 text-white/45" aria-hidden />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={a.tasks.search}
            aria-label={a.tasks.search}
            autoComplete="off"
            className="h-full min-w-0 flex-1 bg-transparent text-[0.95rem] text-white outline-none placeholder:text-white/40"
          />
          {query && (
            <IconButton label={a.tasks.clearSearch} onClick={() => setQuery("")}>
              <X className="h-4 w-4" />
            </IconButton>
          )}
        </div>
        <Button variant="primary" onClick={() => setEditing({})} className="h-11! shrink-0">
          <Plus className="h-4 w-4" aria-hidden />
          {a.tasks.newTask}
        </Button>
      </div>

      {/* the numbers, which are also the filters */}
      <div role="group" aria-label={a.tasks.filters} className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-5">
        {cards.map(({ id, ...c }) => (
          <Stat key={id} {...c} value={count(id)} total={total} selected={filter === id} onSelect={() => setFilter(id)} className={id === "all" ? "max-md:col-span-2" : ""} />
        ))}
      </div>

      {/* the list */}
      <div className="mt-8 space-y-6">
        {!total && (
          <Empty icon={<ListTodo />} title={a.tasks.emptyTitle} body={a.tasks.emptyBody} action={a.tasks.emptyAction} onAction={() => setEditing({})} />
        )}
        {total > 0 && !shown.length && (
          <Empty
            icon={<SearchX />}
            title={a.tasks.noMatchTitle}
            body={a.tasks.noMatchBody}
            action={a.tasks.clearFilters}
            onAction={() => {
              setQuery("");
              setFilter("all");
            }}
          />
        )}
        {GROUPS.map((g) => {
          const list = inGroup(g);
          if (!list.length) return null;
          return (
            <section key={g} aria-labelledby={`group-${g}`} className={`surface overflow-hidden rounded-2xl ${g === "overdue" ? "border-accent/30!" : ""}`}>
              <h2 id={`group-${g}`} className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3 sm:px-5">
                <span
                  aria-hidden
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg [&>svg]:h-4 [&>svg]:w-4 ${g === "overdue" ? "bg-accent/15 text-accent-soft" : g === "done" ? "bg-[#1fa37a]/12 text-[#1fa37a]" : "bg-white/[0.06] text-white/70"}`}
                >
                  {GROUP_ICONS[g]}
                </span>
                <span className={`text-[0.95rem] font-semibold ${g === "overdue" ? "text-accent-soft" : ""}`}>{a.tasks.groups[g]}</span>
                <span className="rounded-full bg-white/[0.07] px-2 py-0.5 text-[0.72rem] font-medium text-white/60">{list.length}</span>
              </h2>
              <ul className="divide-y divide-white/[0.06]">
                {list.map((t) => (
                  <TaskRow key={t.id} task={t} overdue={g === "overdue"} onEdit={() => setEditing({ id: t.id })} onDelete={() => setDeleting(t)} />
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      {editing && <TaskEditor draft={editing} onClose={() => setEditing(null)} />}
      {deleting && <DeleteTaskDialog task={deleting} onClose={() => setDeleting(null)} />}
    </div>
  );
}

/** One number of the overview: "Today 3", with a bar for its share of all tasks. A click lists those tasks. */
function Stat({
  icon,
  label,
  value,
  total,
  tone,
  note,
  title,
  selected,
  onSelect,
  className,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  total: number;
  tone?: "alert" | "done";
  note?: string;
  title?: string;
  selected: boolean;
  onSelect: () => void;
  className: string;
}) {
  const color = tone === "alert" ? "bg-accent/15 text-accent-soft" : tone === "done" ? "bg-[#1fa37a]/12 text-[#1fa37a]" : "bg-white/[0.06] text-white/70";
  const bar = tone === "alert" ? "bg-accent-soft" : tone === "done" ? "bg-[#1fa37a]" : "bg-white/45";
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      title={title}
      className={`flex flex-col rounded-2xl border p-4 text-left transition-colors ${selected ? "border-white/35 bg-white/[0.07]" : `surface hover:border-white/20 ${tone === "alert" ? "border-accent/30!" : ""}`} ${className}`}
    >
      <span className="flex items-center justify-between gap-2">
        <span className="text-[0.8rem] font-medium text-white/60">{label}</span>
        <span aria-hidden className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg [&>svg]:h-[15px] [&>svg]:w-[15px] ${color}`}>
          {icon}
        </span>
      </span>
      <span className="mt-2 mb-3 flex items-baseline justify-between gap-2">
        <span className={`text-[1.75rem] leading-none font-semibold tabular-nums ${tone === "alert" ? "text-accent-soft" : ""}`}>{value}</span>
        {note && <span className="text-[0.78rem] font-medium text-[#1fa37a]">{note}</span>}
      </span>
      <span className="mt-auto block h-1 overflow-hidden rounded-full bg-white/[0.07]" aria-hidden>
        <span className={`block h-full rounded-full ${bar}`} style={{ width: `${total ? Math.round((value / total) * 100) : 0}%` }} />
      </span>
      {title && <span className="sr-only">{title}</span>}
    </button>
  );
}

function Empty({ icon, title, body, action, onAction }: { icon: ReactNode; title: string; body: string; action: string; onAction: () => void }) {
  return (
    <div className="surface flex flex-col items-center rounded-2xl px-5 py-12 text-center">
      <span aria-hidden className="grid h-12 w-12 place-items-center rounded-2xl bg-white/[0.06] text-white/60 [&>svg]:h-6 [&>svg]:w-6">
        {icon}
      </span>
      <p className="mt-4 text-[1.02rem] font-semibold">{title}</p>
      <p className="mt-1.5 max-w-[400px] text-[0.88rem] text-white/60">{body}</p>
      <Button onClick={onAction} className="mt-5">
        {action}
      </Button>
    </div>
  );
}

const chip = "inline-flex max-w-full items-center gap-1.5 rounded-md bg-white/[0.05] px-2 py-1 text-[0.75rem] text-white/60";

function TaskRow({ task: t, overdue, onEdit, onDelete }: { task: Task; overdue: boolean; onEdit: () => void; onDelete: () => void }) {
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
    <li className="flex items-start gap-3.5 py-3.5 pr-2 pl-4 transition-colors hover:bg-white/[0.025] sm:pr-3 sm:pl-5">
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
          <button type="button" onClick={onEdit} className={`block max-w-full text-left text-[0.95rem] font-medium break-words hover:underline ${isDone ? "text-white/45 line-through" : "text-white"}`}>
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
      <div className="-my-1.5 flex shrink-0">
        <IconButton label={a.tasks.editTask(t.title)} onClick={onEdit}>
          <Pencil className="h-4 w-4" />
        </IconButton>
        <IconButton label={a.tasks.deleteTask(t.title)} onClick={onDelete} className="hover:text-accent-soft!">
          <Trash2 className="h-4 w-4" />
        </IconButton>
      </div>
    </li>
  );
}
