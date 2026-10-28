"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Bell, Bot, Check, Clock, ExternalLink, Globe, MapPin, Repeat, StickyNote, Timer, Users, Video } from "lucide-react";
import { useNow } from "@/lib/agenda/hooks";
import { useA } from "@/lib/agenda/i18n";
import { hasFeature, REQUIRED, type Feature } from "@/lib/agenda/plans";
import { findOccurrence } from "@/lib/agenda/recurrence";
import { cancelMeeting, displayZone, newMeetingId, saveMeeting, saveTasks, setTaskDone, useAgenda } from "@/lib/agenda/store";
import { addDays, allZones, dayKey, dayStart, daysBetween, fmtDay, fmtDuration, fmtRange, fromZoned, isDayKey, isTimeKey, timeKey, zoneLabel, MINUTE } from "@/lib/agenda/time";
import type { Intensity, Meeting, Repeat as RepeatRule, Source, Task } from "@/lib/agenda/types";
import { hasErrors, validateMeeting, type ErrorCode, type Errors } from "@/lib/agenda/validation";
import { useLang } from "@/lib/language";
import { hostOf, type Selection } from "./Calendar";
import { SOURCE_COLOR } from "./look";
import { Button, Dialog, Field, inputClass, LockBadge, useToast } from "./ui";

const REMINDER_CHOICES = [0, 5, 10, 15, 30, 60, 1440];
const INTENSITIES: Intensity[] = ["gentle", "standard", "maximum"];
const REPEATS: RepeatRule[] = ["none", "daily", "weekdays", "weekly", "monthly"];

/** Plan checks with the words for a locked feature. */
function usePlan() {
  const a = useA();
  const s = useAgenda();
  return {
    has: (f: Feature) => hasFeature(s.entitlement, f),
    planName: (f: Feature) => a.account.plans[REQUIRED[f]],
    note: (f: Feature) => a.lock.note(a.account.plans[REQUIRED[f]]),
  };
}

function Row({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex gap-3 px-4 py-3">
      <span className="mt-0.5 text-white/45" aria-hidden>
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[0.74rem] text-white/50">{label}</p>
        <div className="mt-0.5 text-[0.92rem]">{children}</div>
      </div>
    </div>
  );
}

/* ---------- Details ---------- */

export function MeetingDetails({
  sel,
  onClose,
  onEdit,
  onMove,
  onCancel,
}: {
  sel: Selection;
  onClose: () => void;
  onEdit: () => void;
  onMove: () => void;
  onCancel: () => void;
}) {
  const a = useA();
  const lang = useLang();
  const s = useAgenda();
  const toast = useToast();
  const zone = displayZone(s.prefs);
  const m = s.meetings.find((x) => x.id === sel.id);
  const o = m ? findOccurrence(m, sel.key) : null;

  if (!m || !o) {
    return (
      <Dialog title={a.details.when} onClose={onClose} size="sm" footer={<Button onClick={onClose}>{a.common.close}</Button>}>
        <p className="text-[0.92rem] text-white/70">{a.errors.missing}</p>
      </Dialog>
    );
  }

  const minutes = Math.round((o.end.getTime() - o.start.getTime()) / MINUTE);
  const linked = s.tasks.filter((t) => t.meetingId === m.id);
  const day = dayKey(o.start, zone);

  return (
    <Dialog
      title={m.title}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" className="mr-auto text-accent-soft hover:text-accent" onClick={onCancel}>
            {a.details.cancel}
          </Button>
          <Button onClick={onMove}>{a.details.move}</Button>
          <Button variant="primary" onClick={onEdit}>
            {a.details.edit}
          </Button>
        </>
      }
    >
      <div className="flex flex-wrap gap-2 text-[0.76rem]">
        <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 px-2 py-1">
          <span className="h-2 w-2 rounded-full" style={{ background: SOURCE_COLOR[m.source] }} />
          {a.sources[m.source]}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 px-2 py-1 text-white/75">
          <Bot className="h-3.5 w-3.5" aria-hidden />
          {a.origins[m.origin]}
        </span>
        {m.repeat !== "none" && (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 px-2 py-1 text-white/75">
            <Repeat className="h-3.5 w-3.5" aria-hidden />
            {a.repeat[m.repeat]}
            {m.repeatUntil ? ` ${a.until(fmtDay(m.repeatUntil, lang, { day: "numeric", month: "short" }))}` : ""}
          </span>
        )}
      </div>

      <div className="mt-4 divide-y divide-white/[0.07] rounded-xl border border-white/[0.08]">
        <Row icon={<Clock className="h-[18px] w-[18px]" />} label={a.details.when}>
          {fmtDay(day, lang)}
          {!m.allDay && <span className="block text-white/70">{fmtRange(o.start, o.end, lang, zone)}</span>}
          {m.allDay && <span className="block text-white/70">{a.calendar.allDay}</span>}
          {o.moved && <span className="mt-1 block text-[0.78rem] text-warm">{a.details.moved}</span>}
        </Row>
        {!m.allDay && (
          <Row icon={<Timer className="h-[18px] w-[18px]" />} label={a.details.duration}>
            {fmtDuration(minutes)}
          </Row>
        )}
        {m.timeZone !== zone && !m.allDay && (
          <Row icon={<Globe className="h-[18px] w-[18px]" />} label={a.details.timeZone}>
            {a.details.plannedIn(zoneLabel(m.timeZone, o.start, lang))}: {fmtRange(o.start, o.end, lang, m.timeZone)}
          </Row>
        )}
      </div>

      {m.videoUrl && (
        <section className="mt-4">
          <h3 className="mb-2 text-[0.8rem] text-white/55">{a.details.videoCall}</h3>
          <div className="rounded-xl border border-white/[0.08] p-4">
            <p className="flex items-center gap-2 text-[0.95rem] font-medium">
              <Video className="h-4 w-4 text-white/55" aria-hidden />
              {hostOf(m.videoUrl)}
            </p>
            <p className="mt-1 text-[0.76rem] break-all text-white/45">{m.videoUrl}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <a
                href={m.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-full bg-inverse px-5 text-[0.88rem] font-semibold text-on-inverse hover:bg-inverse-hover"
              >
                <Video className="h-4 w-4" aria-hidden />
                {a.details.join}
                <ExternalLink className="h-3.5 w-3.5 opacity-60" aria-hidden />
              </a>
              {m.passcode && (
                <span className="text-[0.85rem] text-white/70">
                  {a.details.passcode}: <span className="font-mono">{m.passcode}</span>
                </span>
              )}
            </div>
          </div>
        </section>
      )}

      {(m.location || m.participants.length > 0 || m.notes) && (
        <div className="mt-4 divide-y divide-white/[0.07] rounded-xl border border-white/[0.08]">
          {m.location && (
            <Row icon={<MapPin className="h-[18px] w-[18px]" />} label={a.details.location}>
              {m.location}
            </Row>
          )}
          {m.participants.length > 0 && (
            <Row icon={<Users className="h-[18px] w-[18px]" />} label={a.details.participants(m.participants.length)}>
              <ul className="space-y-2 pt-1">
                {m.participants.map((p) => (
                  <li key={p.email} className="flex items-center gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/[0.08] text-[0.72rem] font-semibold">
                      {p.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </span>
                    <span className="min-w-0 leading-tight">
                      <span className="block truncate">{p.name}</span>
                      <span className="block truncate text-[0.78rem] text-white/50">{p.email}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Row>
          )}
          {m.notes && (
            <Row icon={<StickyNote className="h-[18px] w-[18px]" />} label={a.details.notes}>
              <p className="whitespace-pre-line text-white/80">{m.notes}</p>
            </Row>
          )}
        </div>
      )}

      <div className="mt-4 rounded-xl border border-white/[0.08]">
        <Row icon={<Bell className="h-[18px] w-[18px]" />} label={a.details.alerts}>
          <p>{m.reminders.length ? [...m.reminders].sort((x, y) => y - x).map(a.reminder).join(", ") : a.details.noReminders}</p>
          <p className="text-white/65">
            {a.details.intensity}: {a.intensity[m.intensity]}
          </p>
        </Row>
      </div>

      {linked.length > 0 && (
        <section className="mt-4">
          <h3 className="mb-2 text-[0.8rem] text-white/55">{a.details.linkedTasks}</h3>
          <ul className="space-y-1.5">
            {linked.map((t) => (
              <li key={t.id}>
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/[0.08] px-3 py-2.5 hover:border-white/15">
                  <input
                    type="checkbox"
                    checked={t.done}
                    onChange={async (e) => {
                      try {
                        await setTaskDone(t.id, e.target.checked);
                        toast(e.target.checked ? a.toast.taskDone : a.toast.taskUndone);
                      } catch {
                        toast(a.errors.save, { tone: "error" });
                      }
                    }}
                    className="h-4 w-4 accent-[var(--color-accent)]"
                  />
                  <span className={`flex-1 text-[0.9rem] ${t.done ? "text-white/45 line-through" : ""}`}>{t.title}</span>
                  {t.dueDate && <span className="text-[0.76rem] text-white/50">{fmtDay(t.dueDate, lang, { day: "numeric", month: "short" })}</span>}
                </label>
              </li>
            ))}
          </ul>
        </section>
      )}

      {m.source !== "meetingguard" && <p className="mt-4 text-[0.78rem] text-white/45">{a.details.synced(a.sources[m.source])}</p>}
    </Dialog>
  );
}

/* ---------- Create and edit ---------- */

type Form = {
  title: string;
  date: string;
  start: string;
  end: string;
  allDay: boolean;
  timeZone: string;
  source: Source;
  repeat: RepeatRule;
  repeatUntil: string;
  location: string;
  videoUrl: string;
  passcode: string;
  participants: string;
  reminders: number[];
  intensity: Intensity;
  notes: string;
};

const plusMinutes = (time: string, minutes: number) => {
  const [h, m] = time.split(":").map(Number);
  const t = Math.min(h * 60 + m + minutes, 23 * 60 + 59);
  return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
};

export type EditorMode = { kind: "new"; day: string; time: string } | { kind: "edit"; id: string };

export function MeetingEditor({ mode, onClose }: { mode: EditorMode; onClose: () => void }) {
  const a = useA();
  const s = useAgenda();
  const now = useNow();
  const toast = useToast();
  const plan = usePlan();
  const zone = displayZone(s.prefs);
  const existing = mode.kind === "edit" ? s.meetings.find((m) => m.id === mode.id) : undefined;

  const [form, setForm] = useState<Form>(() => {
    if (existing) {
      const start = new Date(existing.start);
      const end = new Date(existing.end);
      return {
        title: existing.title,
        date: dayKey(start, existing.timeZone),
        start: timeKey(start, existing.timeZone),
        end: timeKey(end, existing.timeZone),
        allDay: existing.allDay,
        timeZone: existing.timeZone,
        source: existing.source,
        repeat: existing.repeat,
        repeatUntil: existing.repeatUntil,
        location: existing.location,
        videoUrl: existing.videoUrl,
        passcode: existing.passcode,
        participants: existing.participants.map((p) => p.email).join(", "),
        reminders: existing.reminders,
        intensity: existing.intensity,
        notes: existing.notes,
      };
    }
    const start = mode.kind === "new" ? mode.time : "09:00";
    return {
      title: "",
      date: mode.kind === "new" ? mode.day : "",
      start,
      end: plusMinutes(start, 30),
      allDay: false,
      timeZone: zone,
      source: "meetingguard",
      repeat: "none",
      repeatUntil: "",
      location: "",
      videoUrl: "",
      passcode: "",
      participants: "",
      reminders: s.prefs.defaultReminders,
      intensity: s.prefs.defaultIntensity,
      notes: "",
    };
  });
  const [errors, setErrors] = useState<Errors<string>>({});
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof Form>(key: K, value: Form[K]) => setForm((f) => ({ ...f, [key]: value }));

  if (mode.kind === "edit" && !existing) {
    return (
      <Dialog title={a.editor.editTitle} onClose={onClose} size="sm" footer={<Button onClick={onClose}>{a.common.close}</Button>}>
        <p className="text-[0.92rem] text-white/70">{a.errors.missing}</p>
      </Dialog>
    );
  }

  const zones = allZones();
  const sourceAvailable: Record<Source, boolean> = {
    meetingguard: true,
    google: s.connections.google,
    outlook: s.connections.outlook && plan.has("outlook"),
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const valid = isDayKey(form.date) && (form.allDay || (isTimeKey(form.start) && isTimeKey(form.end)));
    const startAt = valid ? (form.allDay ? dayStart(form.date, form.timeZone) : fromZoned(form.date, form.start, form.timeZone)) : null;
    const endAt = valid ? (form.allDay ? dayStart(addDays(form.date, 1), form.timeZone) : fromZoned(form.date, form.end, form.timeZone)) : null;
    const emails = form.participants
      .split(/[,;\s]+/)
      .map((x) => x.trim())
      .filter(Boolean);
    const startChanged = !existing || startAt?.toISOString() !== existing.start;
    const found = validateMeeting({
      title: form.title,
      date: form.date,
      start: form.start,
      end: form.end,
      allDay: form.allDay,
      startAt,
      endAt,
      videoUrl: form.videoUrl,
      emails,
      repeatUntil: form.repeatUntil,
      checkPast: startChanged && form.repeat === "none",
      now,
    });
    setErrors(found);
    if (hasErrors(found) || !startAt || !endAt) return;

    const known = new Map((existing?.participants ?? []).map((p) => [p.email, p.name]));
    const meeting: Meeting = {
      id: existing?.id ?? newMeetingId(),
      title: form.title.trim(),
      start: startAt.toISOString(),
      end: endAt.toISOString(),
      allDay: form.allDay,
      timeZone: form.timeZone,
      location: form.location.trim(),
      videoUrl: form.videoUrl.trim(),
      passcode: form.passcode.trim(),
      participants: emails.map((email) => ({ email, name: known.get(email) ?? email.split("@")[0] })),
      notes: form.notes.trim(),
      reminders: [...new Set(form.reminders)].sort((x, y) => y - x),
      intensity: form.intensity,
      source: form.source,
      origin: existing?.origin ?? "web",
      repeat: form.repeat,
      repeatUntil: form.repeat === "none" ? "" : form.repeatUntil,
      // a series that starts at a new time drops its single-date changes
      exceptions: existing && !startChanged ? existing.exceptions : {},
      updatedAt: 0,
    };
    setBusy(true);
    try {
      await saveMeeting(meeting);
      toast(a.toast.saved);
      onClose();
    } catch {
      setBusy(false);
      toast(a.errors.save, { tone: "error" });
    }
  };

  const formId = "meeting-form";
  return (
    <Dialog
      title={existing ? a.editor.editTitle : a.editor.newTitle}
      onClose={onClose}
      size="lg"
      footer={
        <>
          <Button onClick={onClose}>{a.common.cancel}</Button>
          <Button variant="primary" type="submit" form={formId} busy={busy}>
            {existing ? a.editor.save : a.editor.create}
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-6">
        <Field label={a.editor.title} error={errors.title} className="sm:col-span-6">
          {(p) => <input {...p} className={inputClass} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder={a.editor.titlePlaceholder} autoFocus maxLength={160} />}
        </Field>

        <Field label={a.editor.date} error={errors.date} className="sm:col-span-2">
          {(p) => <input {...p} type="date" className={inputClass} value={form.date} onChange={(e) => set("date", e.target.value)} />}
        </Field>
        {!form.allDay && (
          <>
            <Field label={a.editor.start} error={errors.start} className="sm:col-span-2">
              {(p) => (
                <input
                  {...p}
                  type="time"
                  className={inputClass}
                  value={form.start}
                  onChange={(e) => {
                    // keep the length when the start moves
                    const v = e.target.value;
                    setForm((f) => {
                      if (!isTimeKey(v) || !isTimeKey(f.start) || !isTimeKey(f.end)) return { ...f, start: v };
                      const [h1, m1] = f.start.split(":").map(Number);
                      const [h2, m2] = f.end.split(":").map(Number);
                      return { ...f, start: v, end: plusMinutes(v, Math.max(15, h2 * 60 + m2 - (h1 * 60 + m1))) };
                    });
                  }}
                />
              )}
            </Field>
            <Field label={a.editor.end} error={errors.end} className="sm:col-span-2">
              {(p) => <input {...p} type="time" className={inputClass} value={form.end} onChange={(e) => set("end", e.target.value)} />}
            </Field>
          </>
        )}
        <label className="flex items-center gap-2 text-[0.86rem] text-white/80 sm:col-span-6">
          <input type="checkbox" checked={form.allDay} onChange={(e) => set("allDay", e.target.checked)} className="h-4 w-4 accent-[var(--color-accent)]" />
          {a.editor.allDay}
        </label>

        <Field label={a.editor.timeZone} className="sm:col-span-3">
          {(p) => (
            <select {...p} className={inputClass} value={form.timeZone} onChange={(e) => set("timeZone", e.target.value)}>
              {(zones.includes(form.timeZone) ? zones : [form.timeZone, ...zones]).map((z) => (
                <option key={z} value={z}>
                  {z.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          )}
        </Field>
        <Field
          label={a.editor.calendar}
          hint={!sourceAvailable.outlook ? `Outlook: ${plan.has("outlook") ? a.editor.connectInApp : plan.note("outlook")}` : undefined}
          className="sm:col-span-3"
        >
          {(p) => (
            <select {...p} className={inputClass} value={form.source} onChange={(e) => set("source", e.target.value as Source)}>
              {(["meetingguard", "google", "outlook"] as Source[]).map((src) => (
                <option key={src} value={src} disabled={!sourceAvailable[src] && form.source !== src}>
                  {a.sources[src]}
                </option>
              ))}
            </select>
          )}
        </Field>

        <Field
          label={
            <span className="flex items-center gap-2">
              {a.editor.repeat} {!plan.has("recurring") && <LockBadge plan={plan.planName("recurring")} />}
            </span>
          }
          hint={!plan.has("recurring") ? plan.note("recurring") : existing && existing.repeat !== "none" ? a.editor.seriesNote : undefined}
          className="sm:col-span-3"
        >
          {(p) => (
            <select {...p} className={inputClass} value={form.repeat} disabled={!plan.has("recurring")} onChange={(e) => set("repeat", e.target.value as RepeatRule)}>
              {REPEATS.map((r) => (
                <option key={r} value={r}>
                  {a.repeat[r]}
                </option>
              ))}
            </select>
          )}
        </Field>
        {form.repeat !== "none" && (
          <Field label={a.editor.repeatUntil} error={errors.repeatUntil} className="sm:col-span-3">
            {(p) => <input {...p} type="date" className={inputClass} value={form.repeatUntil} disabled={!plan.has("recurring")} onChange={(e) => set("repeatUntil", e.target.value)} />}
          </Field>
        )}

        <Field label={a.editor.location} className="sm:col-span-6">
          {(p) => <input {...p} className={inputClass} value={form.location} onChange={(e) => set("location", e.target.value)} placeholder={a.editor.locationPlaceholder} />}
        </Field>
        <Field label={a.editor.videoUrl} error={errors.videoUrl} className="sm:col-span-4">
          {(p) => <input {...p} type="url" inputMode="url" className={inputClass} value={form.videoUrl} onChange={(e) => set("videoUrl", e.target.value)} placeholder="https://" />}
        </Field>
        <Field label={a.editor.passcode} className="sm:col-span-2">
          {(p) => <input {...p} className={inputClass} value={form.passcode} onChange={(e) => set("passcode", e.target.value)} />}
        </Field>
        <Field label={a.editor.participants} hint={a.editor.participantsHint} error={errors.participants} className="sm:col-span-6">
          {(p) => <input {...p} type="text" inputMode="email" className={inputClass} value={form.participants} onChange={(e) => set("participants", e.target.value)} placeholder="ana@company.com" />}
        </Field>

        <fieldset className="sm:col-span-6">
          <legend className="mb-1.5 flex items-center gap-2 text-[0.8rem] font-medium text-white/65">
            {a.editor.reminders} {!plan.has("customReminders") && <LockBadge plan={plan.planName("customReminders")} />}
          </legend>
          <div className="flex flex-wrap gap-2">
            {REMINDER_CHOICES.map((min) => {
              const on = form.reminders.includes(min);
              return (
                <button
                  key={min}
                  type="button"
                  aria-pressed={on}
                  disabled={!plan.has("customReminders")}
                  onClick={() => set("reminders", on ? form.reminders.filter((x) => x !== min) : [...form.reminders, min])}
                  className={`inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[0.8rem] transition-colors disabled:cursor-not-allowed ${
                    on ? "border-white/40 bg-white/[0.1] text-white" : "border-white/12 text-white/60 hover:text-white"
                  } ${!plan.has("customReminders") && !on ? "opacity-40" : ""}`}
                >
                  {on && <Check className="h-3.5 w-3.5" aria-hidden />}
                  {a.reminder(min)}
                </button>
              );
            })}
          </div>
          <p className="mt-1.5 text-[0.76rem] text-white/45">{plan.has("customReminders") ? a.editor.remindersDefault : plan.note("customReminders")}</p>
        </fieldset>

        <fieldset className="sm:col-span-6">
          <legend className="mb-1.5 flex items-center gap-2 text-[0.8rem] font-medium text-white/65">
            {a.editor.intensity} {!plan.has("intensity") && <LockBadge plan={plan.planName("intensity")} />}
          </legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {INTENSITIES.map((level) => (
              <label
                key={level}
                className={`flex cursor-pointer items-start gap-2.5 rounded-lg border px-3 py-2.5 text-[0.85rem] has-[:disabled]:cursor-not-allowed ${
                  form.intensity === level ? "border-white/40 bg-white/[0.06]" : "border-white/10"
                } ${!plan.has("intensity") && form.intensity !== level ? "opacity-40" : ""}`}
              >
                <input
                  type="radio"
                  name="intensity"
                  checked={form.intensity === level}
                  disabled={!plan.has("intensity")}
                  onChange={() => set("intensity", level)}
                  className="mt-0.5 accent-[var(--color-accent)]"
                />
                <span>
                  <span className="block font-medium">{a.intensity[level]}</span>
                  <span className="block text-[0.76rem] text-white/50">{a.intensityNote[level]}</span>
                </span>
              </label>
            ))}
          </div>
          {!plan.has("intensity") && <p className="mt-1.5 text-[0.76rem] text-white/45">{plan.note("intensity")}</p>}
        </fieldset>

        <Field label={a.editor.notes} className="sm:col-span-6">
          {(p) => <textarea {...p} rows={3} className={`${inputClass} h-auto py-2`} value={form.notes} onChange={(e) => set("notes", e.target.value)} />}
        </Field>
      </form>
    </Dialog>
  );
}

/* ---------- Move ---------- */

/** Shifts a task's due date and time by the same amount as its meeting. */
function shiftTask(t: Task, ms: number, days: number, zone: string): Task {
  if (!t.dueDate) return t;
  if (!t.dueTime) return { ...t, dueDate: addDays(t.dueDate, days) };
  const due = new Date(fromZoned(t.dueDate, t.dueTime, zone).getTime() + ms);
  return { ...t, dueDate: dayKey(due, zone), dueTime: timeKey(due, zone) };
}

export function MoveDialog({ sel, onClose }: { sel: Selection; onClose: () => void }) {
  const a = useA();
  const s = useAgenda();
  const now = useNow();
  const toast = useToast();
  const zone = displayZone(s.prefs);
  const m = s.meetings.find((x) => x.id === sel.id);
  const o = m ? findOccurrence(m, sel.key) : null;
  const [date, setDate] = useState(() => (o ? dayKey(o.start, zone) : ""));
  const [start, setStart] = useState(() => (o ? timeKey(o.start, zone) : ""));
  const [scope, setScope] = useState<"one" | "all">("one");
  const [moveLinked, setMoveLinked] = useState<boolean | null>(null);
  const [error, setError] = useState<{ date?: ErrorCode; start?: ErrorCode }>({});
  const [busy, setBusy] = useState(false);

  if (!m || !o) {
    return (
      <Dialog title={a.move.title} onClose={onClose} size="sm" footer={<Button onClick={onClose}>{a.common.close}</Button>}>
        <p className="text-[0.92rem] text-white/70">{a.errors.missing}</p>
      </Dialog>
    );
  }

  const length = o.end.getTime() - o.start.getTime();
  const linked = s.tasks.filter((t) => t.meetingId === m.id && !t.done && t.dueDate);
  const series = m.repeat !== "none";

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const next: typeof error = {};
    if (!isDayKey(date)) next.date = "badDate";
    if (!m.allDay && !isTimeKey(start)) next.start = "badTime";
    const newStart = next.date || next.start ? null : m.allDay ? dayStart(date, zone) : fromZoned(date, start, zone);
    if (newStart && newStart.getTime() + length < now) next[m.allDay ? "date" : "start"] = "inPast";
    setError(next);
    if (!newStart || hasErrors(next) || (linked.length > 0 && moveLinked === null)) return;

    const delta = newStart.getTime() - o.start.getTime();
    const dayDelta = daysBetween(dayKey(o.start, zone), date);
    const newEnd = new Date(newStart.getTime() + length);
    let updated: Meeting;
    if (series && scope === "one") {
      updated = { ...m, exceptions: { ...m.exceptions, [o.key]: { start: newStart.toISOString(), end: newEnd.toISOString() } } };
    } else if (series) {
      updated = {
        ...m,
        start: new Date(new Date(m.start).getTime() + delta).toISOString(),
        end: new Date(new Date(m.end).getTime() + delta).toISOString(),
        exceptions: {},
      };
    } else {
      updated = { ...m, start: newStart.toISOString(), end: newEnd.toISOString() };
    }
    setBusy(true);
    try {
      await saveMeeting(updated);
      if (moveLinked) await saveTasks(linked.map((t) => shiftTask(t, delta, dayDelta, zone)));
      toast(a.toast.moved);
      onClose();
    } catch {
      setBusy(false);
      toast(a.errors.save, { tone: "error" });
    }
  };

  const formId = "move-form";
  return (
    <Dialog
      title={`${a.move.title}: ${m.title}`}
      onClose={onClose}
      size="sm"
      footer={
        <>
          <Button onClick={onClose}>{a.common.cancel}</Button>
          <Button variant="primary" type="submit" form={formId} busy={busy} disabled={linked.length > 0 && moveLinked === null}>
            {a.move.confirm}
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={submit} noValidate className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label={a.move.date} error={error.date} className={m.allDay ? "col-span-2" : ""}>
            {(p) => <input {...p} type="date" className={inputClass} value={date} onChange={(e) => setDate(e.target.value)} autoFocus />}
          </Field>
          {!m.allDay && (
            <Field label={a.move.start} error={error.start}>
              {(p) => <input {...p} type="time" className={inputClass} value={start} onChange={(e) => setStart(e.target.value)} />}
            </Field>
          )}
        </div>
        {!m.allDay && <p className="text-[0.8rem] text-white/50">{a.move.keepsLength(fmtDuration(Math.round(length / MINUTE)))}</p>}

        {series && (
          <fieldset>
            <legend className="mb-2 text-[0.8rem] font-medium text-white/65">{a.move.scope}</legend>
            <Choice name="move-scope" value={scope} onChange={setScope} options={[{ value: "one", label: a.move.scopeOne }, { value: "all", label: a.move.scopeAll }]} />
          </fieldset>
        )}

        {linked.length > 0 && (
          <fieldset className="rounded-xl border border-warm/30 bg-warm/[0.05] p-3">
            <legend className="px-1 text-[0.86rem] font-medium">{a.move.linked(linked.length)}</legend>
            <ul className="mb-3 ml-1 list-inside list-disc text-[0.8rem] text-white/60">
              {linked.map((t) => (
                <li key={t.id}>{t.title}</li>
              ))}
            </ul>
            <Choice
              name="move-linked"
              value={moveLinked === null ? "" : moveLinked ? "yes" : "no"}
              onChange={(v) => setMoveLinked(v === "yes")}
              options={[{ value: "yes", label: a.move.linkedYes }, { value: "no", label: a.move.linkedNo }]}
            />
          </fieldset>
        )}
      </form>
    </Dialog>
  );
}

function Choice<T extends string>({ name, value, onChange, options }: { name: string; value: T | ""; onChange: (v: T) => void; options: { value: T; label: string }[] }) {
  return (
    <div className="space-y-1.5">
      {options.map((opt) => (
        <label key={opt.value} className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-white/10 px-3 py-2.5 text-[0.88rem] has-[:checked]:border-white/40 has-[:checked]:bg-white/[0.06]">
          <input type="radio" name={name} checked={value === opt.value} onChange={() => onChange(opt.value)} className="accent-[var(--color-accent)]" />
          {opt.label}
        </label>
      ))}
    </div>
  );
}

/* ---------- Cancel ---------- */

export function CancelDialog({ sel, onClose }: { sel: Selection; onClose: () => void }) {
  const a = useA();
  const s = useAgenda();
  const toast = useToast();
  const m = s.meetings.find((x) => x.id === sel.id);
  const [scope, setScope] = useState<"one" | "all">("one");
  const [busy, setBusy] = useState(false);
  if (!m) return null;
  const series = m.repeat !== "none" && !!sel.key;
  const hasLinked = s.tasks.some((t) => t.meetingId === m.id);

  const confirm = async () => {
    setBusy(true);
    try {
      if (series && scope === "one") await saveMeeting({ ...m, exceptions: { ...m.exceptions, [sel.key]: { skip: true } } });
      else await cancelMeeting(m.id);
      toast(a.toast.cancelled);
      onClose();
    } catch {
      setBusy(false);
      toast(a.errors.save, { tone: "error" });
    }
  };

  return (
    <Dialog
      title={a.cancel.title}
      onClose={onClose}
      size="sm"
      footer={
        <>
          <Button onClick={onClose}>{a.cancel.keep}</Button>
          <Button variant="danger" onClick={confirm} busy={busy}>
            {a.cancel.confirm}
          </Button>
        </>
      }
    >
      <p className="text-[0.95rem] font-medium">{m.title}</p>
      <p className="mt-2 text-[0.88rem] text-white/65">{a.cancel.body}</p>
      {m.source !== "meetingguard" && <p className="mt-2 text-[0.88rem] text-white/65">{a.cancel.synced(a.sources[m.source])}</p>}
      {hasLinked && <p className="mt-2 text-[0.88rem] text-white/65">{a.cancel.linkedKept}</p>}
      {series && (
        <div className="mt-4">
          <Choice name="cancel-scope" value={scope} onChange={setScope} options={[{ value: "one", label: a.cancel.scopeOne }, { value: "all", label: a.cancel.scopeAll }]} />
        </div>
      )}
    </Dialog>
  );
}
