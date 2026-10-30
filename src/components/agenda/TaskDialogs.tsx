"use client";

import { useState, type FormEvent } from "react";
import { Bell, CalendarDays, Link2 } from "lucide-react";
import { useNow } from "@/lib/agenda/hooks";
import { useA } from "@/lib/agenda/i18n";
import { expandAll } from "@/lib/agenda/recurrence";
import { createTask, deleteTask, displayZone, restoreTask, updateTask, useAgenda } from "@/lib/agenda/store";
import { addDays, dayKey, dayStart, fmtDay, fmtTime, fromZoned } from "@/lib/agenda/time";
import type { Task } from "@/lib/agenda/types";
import { DESCRIPTION_MAX, hasErrors, TASK_REMINDERS, TITLE_MAX, validateTask, type Errors } from "@/lib/agenda/validation";
import { useLang } from "@/lib/language";
import { Button, Dialog, Field, inputClass, useToast } from "./ui";

/** "Today, 5:00 PM" / "Fri, Oct 30". */
export function useDueLabel() {
  const a = useA();
  const lang = useLang();
  const s = useAgenda();
  const now = useNow();
  const zone = displayZone(s);
  const today = dayKey(new Date(now), zone);
  return (t: Pick<Task, "dueDate" | "dueTime" | "timezone">) => {
    if (!t.dueDate) return a.tasks.noDue;
    const day =
      t.dueDate === today ? a.tasks.groups.today : t.dueDate === addDays(today, 1) ? a.tasks.groups.tomorrow : fmtDay(t.dueDate, lang, { weekday: "short", day: "numeric", month: "short" });
    return t.dueTime ? `${day}, ${fmtTime(fromZoned(t.dueDate, t.dueTime, t.timezone), lang, zone)}` : day;
  };
}

/** Meetings a task can be linked to: the next two months, plus its current one. */
function useMeetingChoices(current: string) {
  const s = useAgenda();
  const now = useNow();
  const lang = useLang();
  const zone = displayZone(s);
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

export type TaskDraft = { id?: string; title?: string; description?: string; dueDate?: string; dueTime?: string; meetingId?: string };

/** Create or edit a task. A task with an id is edited; without one it is new. */
export function TaskEditor({ draft, onClose }: { draft: TaskDraft; onClose: () => void }) {
  const a = useA();
  const s = useAgenda();
  const toast = useToast();
  const existing = draft.id ? s.tasks.find((t) => t.id === draft.id) : undefined;
  const [form, setForm] = useState(() => ({
    title: existing?.title ?? draft.title ?? "",
    description: existing?.description ?? draft.description ?? "",
    dueDate: existing?.dueDate ?? draft.dueDate ?? "",
    dueTime: existing?.dueTime ?? draft.dueTime ?? "",
    reminder: existing ? existing.reminderMinutesBefore : null,
    meetingId: existing?.meetingId ?? draft.meetingId ?? "",
  }));
  const [errors, setErrors] = useState<Errors<string>>({});
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const meetings = useMeetingChoices(form.meetingId);
  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => setForm((f) => ({ ...f, [key]: value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validateTask(form);
    setErrors(found);
    if (hasErrors(found)) return;
    // a time needs a date, and a reminder needs a time: clearing one clears the next
    const fields = {
      title: form.title.trim(),
      description: form.description.replace(/\s+$/, ""),
      dueDate: form.dueDate || null,
      dueTime: form.dueDate ? form.dueTime || null : null,
      reminderMinutesBefore: form.dueDate && form.dueTime ? form.reminder : null,
      meetingId: form.meetingId || null,
    };
    setBusy(true);
    try {
      if (existing) await updateTask(existing.id, fields);
      else await createTask(fields);
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
      toast(a.toast.taskDeleted, { action: { label: a.toast.undo, run: () => void restoreTask(existing) } });
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
          {(p) => <input {...p} className={inputClass} value={form.title} onChange={(e) => set("title", e.target.value)} autoFocus maxLength={TITLE_MAX} />}
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
              disabled={!form.dueDate}
              onChange={(e) => {
                const v = e.target.value;
                // a first time brings the reminder "at due time"; no time means no reminder
                setForm((f) => ({ ...f, dueTime: v, reminder: v && f.reminder === null && !f.dueTime ? 0 : v ? f.reminder : null }));
              }}
            />
          )}
        </Field>
        <Field label={a.taskEditor.reminder}>
          {(p) => (
            <select
              {...p}
              className={inputClass}
              value={form.reminder === null ? "" : String(form.reminder)}
              disabled={!form.dueDate || !form.dueTime}
              onChange={(e) => set("reminder", e.target.value === "" ? null : Number(e.target.value))}
            >
              <option value="">{a.taskEditor.reminderNone}</option>
              {[...new Set([...TASK_REMINDERS, ...(form.reminder === null ? [] : [form.reminder])])]
                .sort((x, y) => x - y)
                .map((min) => (
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
              {form.meetingId && !meetings.some((m) => m.id === form.meetingId) && <option value={form.meetingId}>{a.tasks.meetingGone}</option>}
              {meetings.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          )}
        </Field>
        <Field label={a.taskEditor.notes} error={errors.description} className="sm:col-span-2">
          {(p) => <textarea {...p} rows={3} className={`${inputClass} h-auto py-2`} value={form.description} maxLength={DESCRIPTION_MAX} onChange={(e) => set("description", e.target.value)} />}
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
  const s = useAgenda();
  const toast = useToast();
  const due = useDueLabel();
  const [busy, setBusy] = useState(false);
  const meeting = s.meetings.find((m) => m.id === draft.meetingId);
  const timezone = displayZone(s);

  const confirm = async () => {
    setBusy(true);
    try {
      await createTask({
        title: draft.title ?? "",
        dueDate: draft.dueDate || null,
        dueTime: draft.dueTime || null,
        timezone,
        reminderMinutesBefore: draft.dueTime ? 0 : null,
        meetingId: draft.meetingId || null,
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
          {due({ dueDate: draft.dueDate || null, dueTime: draft.dueTime || null, timezone })}
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
