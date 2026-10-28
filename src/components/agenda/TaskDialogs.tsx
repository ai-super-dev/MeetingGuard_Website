"use client";

import { useState, type FormEvent } from "react";
import { Bell, CalendarDays, Link2 } from "lucide-react";
import { useNow } from "@/lib/agenda/hooks";
import { useA } from "@/lib/agenda/i18n";
import { hasFeature, REQUIRED } from "@/lib/agenda/plans";
import { expandAll } from "@/lib/agenda/recurrence";
import { deleteTask, displayZone, newTaskId, saveTask, useAgenda } from "@/lib/agenda/store";
import { addDays, dayKey, dayStart, fmtDay, fmtTime, fromZoned } from "@/lib/agenda/time";
import type { Task, TaskList } from "@/lib/agenda/types";
import { hasErrors, validateTask, type Errors } from "@/lib/agenda/validation";
import { useLang } from "@/lib/language";
import { Button, Dialog, Field, inputClass, LockBadge, useToast } from "./ui";

const REMINDERS = [0, 5, 15, 30, 60, 1440];
export const LISTS: TaskList[] = ["meetingguard", "microsoftToDo", "googleTasks"];

/** Whether a list can take tasks: connected in the app, and in the plan. */
export function useListAvailable() {
  const s = useAgenda();
  return (list: TaskList) => list === "meetingguard" || (hasFeature(s.entitlement, "taskLists") && s.connections[list]);
}

/** "Today, 5:00 PM" / "Fri, Oct 30". */
export function useDueLabel() {
  const a = useA();
  const lang = useLang();
  const s = useAgenda();
  const now = useNow();
  const zone = displayZone(s.prefs);
  const today = dayKey(new Date(now), zone);
  return (t: Pick<Task, "dueDate" | "dueTime">) => {
    if (!t.dueDate) return a.tasks.noDue;
    const day =
      t.dueDate === today ? a.tasks.groups.today : t.dueDate === addDays(today, 1) ? a.tasks.groups.tomorrow : fmtDay(t.dueDate, lang, { weekday: "short", day: "numeric", month: "short" });
    return t.dueTime ? `${day}, ${fmtTime(fromZoned(t.dueDate, t.dueTime, zone), lang, zone)}` : day;
  };
}

/** Meetings a task can be linked to: the next two months, plus its current one. */
function useMeetingChoices(current: string) {
  const s = useAgenda();
  const now = useNow();
  const lang = useLang();
  const zone = displayZone(s.prefs);
  const today = dayKey(new Date(now), zone);
  const seen = new Set<string>();
  const choices: { id: string; label: string }[] = [];
  for (const o of expandAll(s.meetings, dayStart(addDays(today, -7), zone), dayStart(addDays(today, 60), zone))) {
    if (seen.has(o.meeting.id)) continue;
    seen.add(o.meeting.id);
    choices.push({ id: o.meeting.id, label: `${o.meeting.title} (${fmtDay(dayKey(o.start, zone), lang, { day: "numeric", month: "short" })})` });
  }
  const linked = s.meetings.find((m) => m.id === current);
  if (linked && !seen.has(linked.id)) choices.unshift({ id: linked.id, label: linked.title });
  return choices;
}

export type TaskDraft = Partial<Task>;

/** Create or edit a task. A task with an id is edited; without one it is new. */
export function TaskEditor({ draft, onClose }: { draft: TaskDraft; onClose: () => void }) {
  const a = useA();
  const s = useAgenda();
  const toast = useToast();
  const available = useListAvailable();
  const existing = draft.id ? s.tasks.find((t) => t.id === draft.id) : undefined;
  const [form, setForm] = useState(() => ({
    title: existing?.title ?? draft.title ?? "",
    notes: existing?.notes ?? draft.notes ?? "",
    dueDate: existing?.dueDate ?? draft.dueDate ?? "",
    dueTime: existing?.dueTime ?? draft.dueTime ?? "",
    reminder: existing ? existing.reminder : (draft.reminder ?? null),
    meetingId: existing?.meetingId ?? draft.meetingId ?? "",
    list: existing?.list ?? draft.list ?? ("meetingguard" as TaskList),
  }));
  const [errors, setErrors] = useState<Errors<string>>({});
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const meetings = useMeetingChoices(form.meetingId);
  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => setForm((f) => ({ ...f, [key]: value }));
  const listsLocked = !hasFeature(s.entitlement, "taskLists");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validateTask(form);
    setErrors(found);
    if (hasErrors(found)) return;
    const task: Task = {
      id: existing?.id ?? newTaskId(),
      title: form.title.trim(),
      notes: form.notes.trim(),
      dueDate: form.dueDate,
      dueTime: form.dueTime,
      reminder: form.dueTime ? form.reminder : null,
      meetingId: form.meetingId,
      list: form.list,
      done: existing?.done ?? false,
      doneAt: existing?.doneAt ?? 0,
      origin: existing?.origin ?? "web",
      updatedAt: 0,
    };
    setBusy(true);
    try {
      await saveTask(task);
      toast(a.toast.taskSaved);
      onClose();
    } catch {
      setBusy(false);
      toast(a.errors.save, { tone: "error" });
    }
  };

  const remove = async () => {
    if (!existing) return;
    setBusy(true);
    try {
      await deleteTask(existing.id);
      toast(a.toast.taskDeleted, { action: { label: a.toast.undo, run: () => void saveTask(existing) } });
      onClose();
    } catch {
      setBusy(false);
      toast(a.errors.save, { tone: "error" });
    }
  };

  if (draft.id && !existing) {
    return (
      <Dialog title={a.taskEditor.editTitle} onClose={onClose} size="sm" footer={<Button onClick={onClose}>{a.common.close}</Button>}>
        <p className="text-[0.92rem] text-white/70">{a.errors.missing}</p>
      </Dialog>
    );
  }

  if (confirmDelete && existing) {
    return (
      <Dialog
        title={a.taskEditor.deleteTitle}
        onClose={() => setConfirmDelete(false)}
        size="sm"
        footer={
          <>
            <Button onClick={() => setConfirmDelete(false)}>{a.taskEditor.keep}</Button>
            <Button variant="danger" onClick={remove} busy={busy}>
              {a.taskEditor.deleteConfirm}
            </Button>
          </>
        }
      >
        <p className="text-[0.95rem] font-medium">{existing.title}</p>
        <p className="mt-2 text-[0.88rem] text-white/65">{a.taskEditor.deleteBody}</p>
      </Dialog>
    );
  }

  const formId = "task-form";
  return (
    <Dialog
      title={existing ? a.taskEditor.editTitle : a.taskEditor.newTitle}
      onClose={onClose}
      footer={
        <>
          {existing && (
            <Button variant="ghost" className="mr-auto text-accent-soft hover:text-accent" onClick={() => setConfirmDelete(true)}>
              {a.taskEditor.delete}
            </Button>
          )}
          <Button onClick={onClose}>{a.common.cancel}</Button>
          <Button variant="primary" type="submit" form={formId} busy={busy}>
            {existing ? a.taskEditor.save : a.taskEditor.create}
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
        <Field label={a.taskEditor.title} error={errors.title} className="sm:col-span-2">
          {(p) => <input {...p} className={inputClass} value={form.title} onChange={(e) => set("title", e.target.value)} autoFocus maxLength={160} />}
        </Field>
        <Field label={a.taskEditor.dueDate} error={errors.dueDate}>
          {(p) => <input {...p} type="date" className={inputClass} value={form.dueDate} onChange={(e) => set("dueDate", e.target.value)} />}
        </Field>
        <Field label={a.taskEditor.dueTime} error={errors.dueTime}>
          {(p) => (
            <input
              {...p}
              type="time"
              className={inputClass}
              value={form.dueTime}
              onChange={(e) => {
                const v = e.target.value;
                // a time brings the reminder "at due time", as in the app
                setForm((f) => ({ ...f, dueTime: v, reminder: v && f.reminder === null && !f.dueTime ? 0 : v ? f.reminder : null }));
              }}
            />
          )}
        </Field>
        <Field label={a.taskEditor.reminder} error={errors.reminder}>
          {(p) => (
            <select
              {...p}
              className={inputClass}
              value={form.reminder === null ? "" : String(form.reminder)}
              disabled={!form.dueTime}
              onChange={(e) => set("reminder", e.target.value === "" ? null : Number(e.target.value))}
            >
              <option value="">{a.taskEditor.reminderNone}</option>
              {REMINDERS.map((min) => (
                <option key={min} value={min}>
                  {min === 0 ? a.taskEditor.atDueTime : a.reminder(min)}
                </option>
              ))}
            </select>
          )}
        </Field>
        <Field label={a.taskEditor.meeting}>
          {(p) => (
            <select {...p} className={inputClass} value={form.meetingId} onChange={(e) => set("meetingId", e.target.value)}>
              <option value="">{a.taskEditor.meetingNone}</option>
              {meetings.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          )}
        </Field>
        <Field
          label={
            <span className="flex items-center gap-2">
              {a.taskEditor.list} {listsLocked && <LockBadge plan={a.account.plans[REQUIRED.taskLists]} />}
            </span>
          }
          hint={listsLocked ? a.lock.note(a.account.plans[REQUIRED.taskLists]) : !s.connections.microsoftToDo || !s.connections.googleTasks ? a.account.connectionsBody : undefined}
          className="sm:col-span-2"
        >
          {(p) => (
            <select {...p} className={inputClass} value={form.list} onChange={(e) => set("list", e.target.value as TaskList)}>
              {LISTS.map((l) => (
                <option key={l} value={l} disabled={!available(l) && form.list !== l}>
                  {a.taskLists[l]}
                  {!available(l) && l !== "meetingguard" ? ` (${s.connections[l] ? a.account.notIncluded : a.account.notConnected})` : ""}
                </option>
              ))}
            </select>
          )}
        </Field>
        <Field label={a.taskEditor.notes} className="sm:col-span-2">
          {(p) => <textarea {...p} rows={3} className={`${inputClass} h-auto py-2`} value={form.notes} onChange={(e) => set("notes", e.target.value)} />}
        </Field>
      </form>
    </Dialog>
  );
}

/**
 * The card a typed task lands on before it is saved: the app's rule,
 * "nothing is saved until you confirm".
 */
export function CaptureCard({ draft, onClose, onEdit }: { draft: TaskDraft; onClose: () => void; onEdit: () => void }) {
  const a = useA();
  const toast = useToast();
  const due = useDueLabel();
  const [busy, setBusy] = useState(false);
  const meeting = useAgenda().meetings.find((m) => m.id === draft.meetingId);

  const confirm = async () => {
    setBusy(true);
    try {
      await saveTask({
        id: newTaskId(),
        title: draft.title ?? "",
        notes: "",
        dueDate: draft.dueDate ?? "",
        dueTime: draft.dueTime ?? "",
        reminder: draft.dueTime ? 0 : null,
        meetingId: draft.meetingId ?? "",
        list: "meetingguard",
        done: false,
        doneAt: 0,
        origin: "web",
        updatedAt: 0,
      });
      toast(a.toast.taskSaved);
      onClose();
    } catch {
      setBusy(false);
      toast(a.errors.save, { tone: "error" });
    }
  };

  return (
    <Dialog
      title={a.tasks.cardTitle}
      onClose={onClose}
      size="sm"
      footer={
        <>
          <Button onClick={onEdit}>{a.tasks.edit}</Button>
          <Button variant="primary" onClick={confirm} busy={busy} data-autofocus>
            {a.tasks.confirm}
          </Button>
        </>
      }
    >
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-[1.02rem] font-semibold">{draft.title}</p>
        <p className="mt-2 flex items-center gap-2 text-[0.85rem] text-white/70">
          <CalendarDays className="h-4 w-4 text-white/45" aria-hidden />
          {due({ dueDate: draft.dueDate ?? "", dueTime: draft.dueTime ?? "" })}
        </p>
        {draft.dueTime && (
          <p className="mt-1 flex items-center gap-2 text-[0.85rem] text-white/70">
            <Bell className="h-4 w-4 text-white/45" aria-hidden />
            {a.taskEditor.atDueTime}
          </p>
        )}
        {meeting && (
          <p className="mt-1 flex items-center gap-2 text-[0.85rem] text-white/70">
            <Link2 className="h-4 w-4 text-white/45" aria-hidden />
            {meeting.title}
          </p>
        )}
      </div>
      <p className="mt-3 text-[0.8rem] text-white/50">{a.tasks.notSaved}</p>
    </Dialog>
  );
}
