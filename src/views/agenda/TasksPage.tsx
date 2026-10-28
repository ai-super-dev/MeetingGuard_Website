"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Bell, ChevronDown, Link2, Plus, Sparkles } from "lucide-react";
import { AgendaFrame } from "@/components/agenda/Frame";
import { CaptureCard, LISTS, TaskEditor, useDueLabel, useListAvailable, type TaskDraft } from "@/components/agenda/TaskDialogs";
import { Button, useToast } from "@/components/agenda/ui";
import { capture } from "@/lib/agenda/capture";
import { useNow } from "@/lib/agenda/hooks";
import { useA } from "@/lib/agenda/i18n";
import { displayZone, setTaskDone, useAgenda } from "@/lib/agenda/store";
import { addDays, dayKey, fromZoned } from "@/lib/agenda/time";
import type { Task, TaskList } from "@/lib/agenda/types";
import { useHref, useLang } from "@/lib/language";

type Group = "overdue" | "today" | "tomorrow" | "upcoming" | "someday";
const GROUPS: Group[] = ["overdue", "today", "tomorrow", "upcoming", "someday"];

const dueAt = (t: Task) => `${t.dueDate || "9999"}T${t.dueTime || "99:99"}`;

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
  const zone = displayZone(s.prefs);
  const today = dayKey(new Date(now), zone);
  const available = useListAvailable();

  const [text, setText] = useState("");
  const [card, setCard] = useState<TaskDraft | null>(null);
  const [editing, setEditing] = useState<TaskDraft | null>(null);
  const [lists, setLists] = useState<TaskList[]>([]);
  const [showDone, setShowDone] = useState(false);

  const shown = s.tasks.filter((t) => !lists.length || lists.includes(t.list));
  const groupOf = (t: Task): Group => {
    if (!t.dueDate) return "someday";
    const late = t.dueDate < today || (t.dueDate === today && t.dueTime && fromZoned(t.dueDate, t.dueTime, zone).getTime() < now);
    if (late) return "overdue";
    if (t.dueDate === today) return "today";
    if (t.dueDate === addDays(today, 1)) return "tomorrow";
    return "upcoming";
  };
  const open = shown.filter((t) => !t.done).sort((x, y) => dueAt(x).localeCompare(dueAt(y)));
  const done = shown.filter((t) => t.done).sort((x, y) => y.doneAt - x.doneAt);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    const c = capture(text, lang, today);
    if (!c.title) return;
    setCard({ title: c.title, dueDate: c.dueDate, dueTime: c.dueTime });
    setText("");
  };

  // only lists that can hold tasks, or already do, are worth a filter
  const filterLists = LISTS.filter((l) => available(l) || s.tasks.some((t) => t.list === l));

  return (
    <div className="mx-auto max-w-[760px]">
      {/* quick capture */}
      <form onSubmit={submit} className="surface flex items-center gap-2 rounded-2xl p-2 pl-4">
        <Sparkles className="h-4 w-4 shrink-0 text-white/40" aria-hidden />
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
          className="h-10 min-w-0 flex-1 bg-transparent text-[0.95rem] text-white outline-none placeholder:text-white/35"
        />
        <Button variant="primary" type="submit" className="h-10 px-3 sm:px-4" aria-label={a.tasks.capture}>
          <Plus className="h-4 w-4" aria-hidden />
          <span className="hidden sm:inline">{a.tasks.capture}</span>
        </Button>
      </form>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <p id="capture-hint" className="text-[0.76rem] text-white/45">
          {a.tasks.captureHint}
        </p>
        <button type="button" onClick={() => setEditing({})} className="text-[0.8rem] font-medium text-white/70 hover:text-white">
          {a.tasks.newTask}
        </button>
      </div>

      {filterLists.length > 1 && (
        <div role="group" aria-label={a.tasks.lists} className="mt-5 flex gap-2 overflow-x-auto pb-1 text-[0.8rem]">
          <button
            type="button"
            aria-pressed={!lists.length}
            onClick={() => setLists([])}
            className={`shrink-0 rounded-lg border px-3 py-1.5 ${!lists.length ? "border-white/30 bg-white/[0.08]" : "border-white/10 text-white/60 hover:text-white"}`}
          >
            {a.tasks.allLists}
          </button>
          {filterLists.map((l) => (
            <button
              key={l}
              type="button"
              aria-pressed={lists.includes(l)}
              onClick={() => setLists((x) => (x.includes(l) ? x.filter((y) => y !== l) : [...x, l]))}
              className={`shrink-0 rounded-lg border px-3 py-1.5 ${lists.includes(l) ? "border-white/30 bg-white/[0.08]" : "border-white/10 text-white/60 hover:text-white"}`}
            >
              {a.taskLists[l]}
            </button>
          ))}
        </div>
      )}

      {/* the list */}
      <div className="mt-6 space-y-7">
        {!s.tasks.length && <p className="surface rounded-2xl px-5 py-10 text-center text-[0.9rem] text-white/55">{a.tasks.empty}</p>}
        {s.tasks.length > 0 && !open.length && <p className="surface rounded-2xl px-5 py-8 text-center text-[0.9rem] text-white/55">{a.tasks.allDone}</p>}
        {GROUPS.map((g) => {
          const list = open.filter((t) => groupOf(t) === g);
          if (!list.length) return null;
          return (
            <section key={g} aria-labelledby={`group-${g}`}>
              <h2 id={`group-${g}`} className={`mb-2 flex items-center gap-2 text-[0.8rem] font-semibold tracking-wide uppercase ${g === "overdue" ? "text-accent-soft" : "text-white/55"}`}>
                {a.tasks.groups[g]}
                <span className="font-normal text-white/40">{list.length}</span>
              </h2>
              <ul className="surface divide-y divide-white/[0.06] overflow-hidden rounded-2xl">
                {list.map((t) => (
                  <TaskRow key={t.id} task={t} overdue={g === "overdue"} onEdit={() => setEditing({ id: t.id })} />
                ))}
              </ul>
            </section>
          );
        })}

        {done.length > 0 && (
          <section aria-labelledby="group-done">
            <h2 id="group-done">
              <button type="button" aria-expanded={showDone} onClick={() => setShowDone((v) => !v)} className="flex items-center gap-2 text-[0.8rem] font-semibold tracking-wide text-white/55 uppercase hover:text-white">
                <ChevronDown className={`h-4 w-4 transition-transform ${showDone ? "" : "-rotate-90"}`} aria-hidden />
                {showDone ? a.tasks.hideDone : a.tasks.showDone(done.length)}
              </button>
            </h2>
            {showDone && (
              <ul className="surface mt-2 divide-y divide-white/[0.06] overflow-hidden rounded-2xl">
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

function TaskRow({ task: t, overdue, onEdit }: { task: Task; overdue: boolean; onEdit: () => void }) {
  const a = useA();
  const s = useAgenda();
  const href = useHref();
  const toast = useToast();
  const due = useDueLabel();
  const zone = displayZone(s.prefs);
  const meeting = t.meetingId ? s.meetings.find((m) => m.id === t.meetingId) : undefined;

  const toggle = async (done: boolean) => {
    try {
      await setTaskDone(t.id, done);
      toast(done ? a.toast.taskDone : a.toast.taskUndone, { action: { label: a.toast.undo, run: () => void setTaskDone(t.id, !done) } });
    } catch {
      toast(a.errors.save, { tone: "error" });
    }
  };

  return (
    <li className="flex items-start gap-3 px-4 py-3">
      <input
        type="checkbox"
        checked={t.done}
        onChange={(e) => toggle(e.target.checked)}
        aria-label={t.done ? a.tasks.markUndone(t.title) : a.tasks.markDone(t.title)}
        className="mt-1 h-[18px] w-[18px] shrink-0 cursor-pointer accent-[var(--color-accent)]"
      />
      <div className="min-w-0 flex-1">
        <button type="button" onClick={onEdit} className={`block max-w-full text-left text-[0.95rem] hover:underline ${t.done ? "text-white/45 line-through" : "text-white"}`}>
          {t.title}
        </button>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.76rem] text-white/50">
          {t.dueDate && <span className={overdue ? "font-medium text-accent-soft" : ""}>{due(t)}</span>}
          {t.reminder !== null && !t.done && (
            <span className="inline-flex items-center gap-1">
              <Bell className="h-3 w-3" aria-hidden />
              {t.reminder === 0 ? a.taskEditor.atDueTime : a.reminder(t.reminder)}
            </span>
          )}
          {meeting && (
            <Link
              href={`${href("/app")}?view=day&date=${dayKey(new Date(meeting.start), zone)}&open=${meeting.id}`}
              className="inline-flex max-w-full items-center gap-1 truncate rounded-md border border-white/10 px-1.5 py-0.5 hover:border-white/25 hover:text-white"
            >
              <Link2 className="h-3 w-3 shrink-0" aria-hidden />
              <span className="truncate">{meeting.title}</span>
            </Link>
          )}
          {t.list !== "meetingguard" && <span>{a.taskLists[t.list]}</span>}
        </div>
      </div>
    </li>
  );
}
