"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Bell, Bot, CalendarDays, CalendarX, Clock, ExternalLink, FileText, Globe, Lightbulb, MapPin, Repeat, StickyNote, Timer, UserPlus, Users, Video, X } from "lucide-react";
import { useA } from "@/lib/agenda/i18n";
import { cardInfo, formHint, linkLabel, showPasscode, zoomNotConfigured } from "@/lib/agenda/conference";
import { findOccurrence, WEEKDAYS } from "@/lib/agenda/recurrence";
import {
  calendarOf,
  cancelOccurrence,
  createMeeting,
  createZoomLink,
  deleteFollowing,
  displayZone,
  editFollowing,
  isLinkedElsewhere,
  joinUrl,
  linkState,
  removeMeeting,
  SeriesEndError,
  setTaskDone,
  shiftedTask,
  updateMeeting,
  updateOccurrence,
  useAgenda,
} from "@/lib/agenda/store";
import { addDays, dayKey, dayStart, daysBetween, fmtDay, fmtDuration, fmtRange, fmtTime, fromZoned, isDayKey, isTimeKey, timeKey, zoneLabel, MINUTE } from "@/lib/agenda/time";
import type { Meeting, MeetingPatch, RecurrenceRule, Task } from "@/lib/agenda/types";
import { ALERT_TIME_OPTIONS, defaultWeekdays, draftFromMeeting, draftToInput, draftToPatch, DURATION_OPTIONS, hasErrors, newDraft, ruleOf, startAtOf, TITLE_MAX, validateDraft, type ErrorCode, type MeetingDraft, type ParticipantDraft } from "@/lib/agenda/validation";
import { useLang } from "@/lib/language";
import { hostOf, type Selection } from "./Calendar";
import { SOURCE_COLOR } from "./look";
import { ChoiceChips, FloatField, FormSection, Helper, ListGroup, PickerRow, Subheading, Switch, ToggleChip } from "./form";
import { Button, Dialog, Field, IconButton, inputClass, useToast } from "./ui";

/** Which meetings of a series a change applies to. */
export type Scope = "one" | "following" | "all";

function useRuleLabel() {
  const a = useA();
  const lang = useLang();
  return (m: Pick<Meeting, "recurrence" | "timezone">) => {
    const rule = m.recurrence as RecurrenceRule;
    const end = rule.until ? ` ${a.until(fmtDay(dayKey(new Date(rule.until), m.timezone), lang, { day: "numeric", month: "short" }))}` : rule.count ? `, ${a.times(rule.count)}` : "";
    return `${a.repeat[rule.freq](rule.interval)}${end}`;
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

function Gone({ title, onClose }: { title: string; onClose: () => void }) {
  const a = useA();
  return (
    <Dialog title={title} onClose={onClose} size="sm" footer={<Button onClick={onClose}>{a.common.close}</Button>}>
      <p className="text-[0.92rem] text-white/70">{a.errors.missing}</p>
    </Dialog>
  );
}

const saveError = (a: ReturnType<typeof useA>, err: unknown) => (err instanceof SeriesEndError ? a.errors.seriesEnd : a.errors.save);

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
  const ruleLabel = useRuleLabel();
  const zone = displayZone(s);
  const m = s.meetings.find((x) => x.id === sel.id);
  const o = m ? findOccurrence(m, sel.key) : null;

  if (!m || !o) return <Gone title={a.details.when} onClose={onClose} />;

  const minutes = Math.round((o.end.getTime() - o.start.getTime()) / MINUTE);
  const linked = s.tasks.filter((t) => t.meetingId === m.id);
  const day = dayKey(o.start, m.allDay ? m.timezone : zone);
  const calendar = calendarOf(m);
  const url = joinUrl(m);
  const alerts = m.customAlertTimes ?? s.prefs.defaultAlertTimes;
  const participantLabel = (p: Meeting["participants"][number]) => p.name || p.email;

  return (
    <Dialog
      title={o.title}
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
          <span className="h-2 w-2 rounded-full" style={{ background: SOURCE_COLOR[calendar] }} />
          {a.sources[calendar]}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 px-2 py-1 text-white/75">
          <Bot className="h-3.5 w-3.5" aria-hidden />
          {a.origins[m.source]}
        </span>
        {m.recurrence && (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 px-2 py-1 text-white/75">
            <Repeat className="h-3.5 w-3.5" aria-hidden />
            {ruleLabel(m)}
          </span>
        )}
        {m.status === "cancelled" && <span className="inline-flex items-center rounded-md border border-accent/40 px-2 py-1 text-accent-soft">{a.details.cancelled}</span>}
      </div>

      <div className="mt-4 divide-y divide-white/[0.07] rounded-xl border border-white/[0.08]">
        <Row icon={<Clock className="h-[18px] w-[18px]" />} label={a.details.when}>
          {fmtDay(day, lang)}
          {!m.allDay && <span className="block text-white/70">{fmtRange(o.start, o.end, lang, zone)}</span>}
          {m.allDay && <span className="block text-white/70">{a.calendar.allDay}</span>}
          {o.overridden && <span className="mt-1 block text-[0.78rem] text-warm">{a.details.moved}</span>}
        </Row>
        {!m.allDay && (
          <Row icon={<Timer className="h-[18px] w-[18px]" />} label={a.details.duration}>
            {fmtDuration(minutes)}
          </Row>
        )}
        {m.timezone !== zone && !m.allDay && (
          <Row icon={<Globe className="h-[18px] w-[18px]" />} label={a.details.timeZone}>
            {a.details.plannedIn(zoneLabel(m.timezone, o.start, lang))}: {fmtRange(o.start, o.end, lang, m.timezone)}
          </Row>
        )}
      </div>

      {m.conference && !url && <PendingLink m={m} />}
      {url && (
        <section className="mt-4">
          <h3 className="mb-2 text-[0.8rem] text-white/55">{a.details.videoCall}</h3>
          <div className="rounded-xl border border-white/[0.08] p-4">
            <p className="flex items-center gap-2 text-[0.95rem] font-medium">
              <Video className="h-4 w-4 text-white/55" aria-hidden />
              {hostOf(url)}
            </p>
            <p className="mt-1 text-[0.76rem] break-all text-white/45">{url}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-full bg-inverse px-5 text-[0.88rem] font-semibold text-on-inverse hover:bg-inverse-hover"
              >
                <Video className="h-4 w-4" aria-hidden />
                {a.details.join}
                <ExternalLink className="h-3.5 w-3.5 opacity-60" aria-hidden />
              </a>
              {m.conference?.password && (
                <span className="text-[0.85rem] text-white/70">
                  {a.details.passcode}: <span className="font-mono">{m.conference.password}</span>
                </span>
              )}
            </div>
          </div>
        </section>
      )}

      {(m.location?.address || m.participants.length > 0 || m.description || m.notes || m.preparationTips.length > 0) && (
        <div className="mt-4 divide-y divide-white/[0.07] rounded-xl border border-white/[0.08]">
          {m.location?.address && (
            <Row icon={<MapPin className="h-[18px] w-[18px]" />} label={a.details.location}>
              {m.location.address}
            </Row>
          )}
          {m.participants.length > 0 && (
            <Row icon={<Users className="h-[18px] w-[18px]" />} label={a.details.participants(m.participants.length)}>
              <ul className="space-y-2 pt-1">
                {m.participants.map((p) => (
                  <li key={p.email} className="flex items-center gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/[0.08] text-[0.72rem] font-semibold">
                      {participantLabel(p)
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </span>
                    <span className="min-w-0 leading-tight">
                      <span className="block truncate">{participantLabel(p)}</span>
                      {p.name && <span className="block truncate text-[0.78rem] text-white/50">{p.email}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </Row>
          )}
          {m.description && (
            <Row icon={<FileText className="h-[18px] w-[18px]" />} label={a.details.description}>
              <p className="whitespace-pre-line text-white/80">{m.description}</p>
            </Row>
          )}
          {m.preparationTips.length > 0 && (
            <Row icon={<Lightbulb className="h-[18px] w-[18px]" />} label={a.details.tips}>
              <ul className="list-inside list-disc text-white/80">
                {m.preparationTips.map((tip) => (
                  <li key={tip}>{tip}</li>
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
          <p>
            {alerts.length ? alerts.map(a.reminder).join(", ") : a.details.noReminders}
            {m.customAlertTimes === null && <span className="text-white/50"> {a.details.yourDefault}</span>}
          </p>
          <p className="text-white/65">
            {a.details.intensity}: {a.intensity[m.alertIntensity ?? s.prefs.alertIntensity]}
            {m.alertIntensity === null && <span className="text-white/50"> {a.details.yourDefault}</span>}
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
                    checked={t.status === "done"}
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
                  <span className={`flex-1 text-[0.9rem] ${t.status === "done" ? "text-white/45 line-through" : ""}`}>{t.title}</span>
                  {t.dueDate && <span className="text-[0.76rem] text-white/50">{fmtDay(t.dueDate, lang, { day: "numeric", month: "short" })}</span>}
                </label>
              </li>
            ))}
          </ul>
        </section>
      )}

      {isLinkedElsewhere(m) && <p className="mt-4 text-[0.78rem] text-white/45">{a.details.synced(a.sources[calendar === "meetingguard" ? (m.external.outlookEventId ? "outlook" : "google") : calendar])}</p>}
    </Dialog>
  );
}

/** A video call without its link yet: where the link comes from, and Try again when Zoom failed. */
function PendingLink({ m }: { m: Meeting }) {
  const a = useA();
  const s = useAgenda();
  const [retrying, setRetrying] = useState(false);
  const failed = m.conference?.provider === "zoom" && s.zoomFailed.includes(m.id) && s.zoom === true;
  const info = cardInfo(m, linkState(s));
  return (
    <section className="mt-4">
      <h3 className="mb-2 text-[0.8rem] text-white/55">{a.details.videoCall}</h3>
      <div className="rounded-xl border border-white/[0.08] p-4">
        <p className="flex items-center gap-2 text-[0.95rem] font-medium">
          <Video className="h-4 w-4 text-white/55" aria-hidden />
          {m.conference ? a.form.provider[m.conference.provider] : ""}
        </p>
        <p className="mt-1.5 text-[0.84rem] text-white/65">{failed ? a.link.zoomCreateFailed : a.link[info]}</p>
        {failed && (
          <Button
            className="mt-3"
            busy={retrying}
            onClick={async () => {
              setRetrying(true);
              await createZoomLink(m.id).catch(() => {});
              setRetrying(false);
            }}
          >
            {a.common.retry}
          </Button>
        )}
      </div>
    </section>
  );
}

/* ---------- Which meetings of a series ---------- */

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

/** Asked before editing one date of a series, as in the app. */
export function EditScopeDialog({ sel, onClose, onChoose }: { sel: Selection; onClose: () => void; onChoose: (scope: Scope) => void }) {
  const a = useA();
  const lang = useLang();
  const s = useAgenda();
  const m = s.meetings.find((x) => x.id === sel.id);
  if (!m) return <Gone title={a.scope.editTitle} onClose={onClose} />;
  return (
    <Dialog title={a.scope.editTitle} onClose={onClose} size="sm" footer={<Button onClick={onClose}>{a.common.cancel}</Button>}>
      <p className="mb-4 text-[0.9rem] text-white/70">{a.scope.editBody(m.title, fmtDay(sel.key, lang, { day: "numeric", month: "long" }))}</p>
      <div className="grid gap-2">
        <Button onClick={() => onChoose("one")} data-autofocus>
          {a.scope.one}
        </Button>
        <Button onClick={() => onChoose("following")}>{a.scope.following}</Button>
        <Button onClick={() => onChoose("all")}>{a.scope.all}</Button>
      </div>
    </Dialog>
  );
}

/* ---------- Linked tasks move with the meeting ---------- */

/** Open tasks of this meeting that have a due date: the ones a move can carry along. */
const movableTasks = (tasks: Task[], meetingId: string) => tasks.filter((t) => t.meetingId === meetingId && t.status === "open" && t.dueDate);

function LinkedQuestion({ tasks, value, onChange }: { tasks: Task[]; value: boolean | null; onChange: (v: boolean) => void }) {
  const a = useA();
  return (
    <fieldset className="rounded-xl border border-warm/30 bg-warm/[0.05] p-3">
      <legend className="px-1 text-[0.86rem] font-medium">{a.move.linked(tasks.length)}</legend>
      <ul className="mb-3 ml-1 list-inside list-disc text-[0.8rem] text-white/60">
        {tasks.map((t) => (
          <li key={t.id}>{t.title}</li>
        ))}
      </ul>
      <Choice
        name="move-linked"
        value={value === null ? "" : value ? "yes" : "no"}
        onChange={(v) => onChange(v === "yes")}
        options={[
          { value: "yes", label: a.move.linkedYes },
          { value: "no", label: a.move.linkedNo },
        ]}
      />
    </fieldset>
  );
}

/* ---------- Create and edit ---------- */

export type EditorMode = { kind: "new"; day: string; time: string } | { kind: "edit"; id: string };

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** The meeting form, laid out and worded like the app's (src/screens/meetings/MeetingFormScreen.tsx). */
export function MeetingEditor({ mode, onClose }: { mode: EditorMode; onClose: () => void }) {
  const a = useA();
  const lang = useLang();
  const s = useAgenda();
  const toast = useToast();
  const ruleLabel = useRuleLabel();
  const zone = displayZone(s);
  const existing = mode.kind === "edit" ? s.meetings.find((m) => m.id === mode.id) : undefined;

  const [original] = useState<MeetingDraft>(() =>
    existing ? draftFromMeeting(existing, s.prefs.defaultAlertTimes) : newDraft({ day: mode.kind === "new" ? mode.day : "", time: mode.kind === "new" ? mode.time : "09:00", timezone: zone, defaultAlertTimes: s.prefs.defaultAlertTimes }),
  );
  const [draft, setDraft] = useState(original);
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [moveLinked, setMoveLinked] = useState<boolean | null>(null);
  const change = (patch: Partial<MeetingDraft>) => setDraft((d) => ({ ...d, ...patch }));

  if (mode.kind === "edit" && !existing) return <Gone title={a.editor.editTitle} onClose={onClose} />;

  // as in the app, problems show once Save was pressed
  const found = validateDraft(draft);
  const errors = submitted ? found : {};
  const validStart = isDayKey(draft.date) && (draft.allDay || isTimeKey(draft.time));
  const newStart = validStart ? startAtOf(draft) : null;
  const startMoved = !!existing && !!newStart && Date.parse(newStart) !== Date.parse(existing.startAt);
  const linked = existing && startMoved ? movableTasks(s.tasks, existing.id) : [];
  const durationChoices = [...new Set([...DURATION_OPTIONS, draft.durationMinutes])].sort((x, y) => x - y);

  const links = linkState(s);
  const target = { source: existing?.source ?? ("manual" as const), recurring: draft.repeat !== "none", outlookEventId: existing?.external.outlookEventId ?? null };
  const hint = formHint(draft.conferenceProvider, draft.conferenceUrl, links, target);
  const rule = ruleOf(draft, existing?.recurrence ?? null);
  const monthDay = existing?.recurrence?.freq === "monthly" && existing.recurrence.byMonthDay !== null ? existing.recurrence.byMonthDay : isDayKey(draft.date) ? Number(draft.date.slice(8, 10)) : 1;
  const interval = Number(draft.repeatInterval) || 0;

  const setRepeat = (repeat: MeetingDraft["repeat"]) =>
    // switching to weekly selects the meeting's own weekday
    change({ repeat, repeatWeekdays: repeat === "weekly" && !draft.repeatWeekdays.length ? defaultWeekdays(draft) : draft.repeatWeekdays });
  const setParticipant = (index: number, patch: Partial<ParticipantDraft>) => change({ participants: draft.participants.map((row, i) => (i === index ? { ...row, ...patch } : row)) });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (hasErrors(found)) {
      toast(a.form.fixErrors, { tone: "error" });
      return;
    }
    if (linked.length > 0 && moveLinked === null) return;
    setBusy(true);
    try {
      if (existing) {
        const patch = draftToPatch(existing, draft, original);
        if (Object.keys(patch).length) {
          const ms = patch.startAt ? Date.parse(patch.startAt) - Date.parse(existing.startAt) : 0;
          const days = patch.startAt ? daysBetween(existing.date, draft.date) : 0;
          await updateMeeting(existing.id, patch, moveLinked ? linked.map((t) => shiftedTask(t, ms, days)) : []);
        }
      } else {
        await createMeeting(draftToInput(draft), lang);
      }
      toast(a.toast.saved);
      onClose();
    } catch (err) {
      setBusy(false);
      toast(saveError(a, err), { tone: "error" });
    }
  };

  const formId = "meeting-form";
  const dateLabel = isDayKey(draft.date) ? capitalize(fmtDay(draft.date, lang, { weekday: "long", month: "long", day: "numeric", year: "numeric" })) : "—";
  const timeLabel = newStart && !draft.allDay ? fmtTime(new Date(newStart), lang, draft.timezone) : "—";

  return (
    <Dialog
      title={existing ? a.editor.editTitle : a.editor.newTitle}
      onClose={onClose}
      size="lg"
      footer={
        <Button variant="primary" type="submit" form={formId} busy={busy} disabled={linked.length > 0 && moveLinked === null} className="w-full">
          {existing ? a.form.saveChanges : a.form.create}
        </Button>
      }
    >
      <form id={formId} onSubmit={submit} noValidate className="space-y-3">
        {existing?.source === "google" && <Helper>{a.details.synced(a.sources.google)}</Helper>}

        <FormSection>
          <div className="space-y-3">
            <FloatField label={a.form.title} value={draft.title} onChange={(v) => change({ title: v })} error={errors.title} maxLength={TITLE_MAX} autoFocus />
            <FloatField label={a.form.description} value={draft.description} onChange={(v) => change({ description: v })} error={errors.description} multiline />
          </div>
        </FormSection>

        <FormSection title={a.form.when}>
          <ListGroup>
            <PickerRow icon={<CalendarDays className="h-5 w-5" />} title={a.form.pickDate} supporting={dateLabel} type="date" value={draft.date} onChange={(v) => change({ date: v })} invalid={!!errors.date} />
            {!draft.allDay && <PickerRow icon={<Clock className="h-5 w-5" />} title={a.form.pickTime} supporting={timeLabel} type="time" value={draft.time} onChange={(v) => change({ time: v })} invalid={!!errors.time} />}
          </ListGroup>
          {draft.timezone !== zone && <Helper tone="muted">{a.form.timeZone(draft.timezone.replace(/_/g, " "))}</Helper>}
          {(errors.date || errors.time) && <Helper tone="error">{a.errors[errors.date ?? errors.time ?? "badDate"]}</Helper>}
          <div className="mt-4">
            <Switch label={a.form.allDay} checked={draft.allDay} onChange={(on) => change({ allDay: on, durationMinutes: on ? 1440 : 60 })} />
          </div>
          {!draft.allDay && (
            <>
              <Subheading>{a.form.duration}</Subheading>
              <ChoiceChips label={a.form.duration} value={draft.durationMinutes} onChange={(v) => change({ durationMinutes: v })} options={durationChoices.map((min) => ({ value: min, label: fmtDuration(min) }))} />
            </>
          )}
        </FormSection>

        <FormSection title={a.form.repeatTitle}>
          <ChoiceChips label={a.form.repeatTitle} value={draft.repeat} onChange={setRepeat} options={(["none", "daily", "weekly", "monthly"] as const).map((r) => ({ value: r, label: a.form.repeatChoice[r] }))} />
          {draft.repeat !== "none" && (
            <>
              {existing?.recurrence && <Helper>{a.form.seriesNote}</Helper>}
              <div className="mt-3 flex items-center gap-2 text-[0.88rem]">
                {a.form.everyLabel}
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={2}
                  value={draft.repeatInterval}
                  onChange={(e) => change({ repeatInterval: e.target.value })}
                  aria-label={a.form.intervalInput}
                  aria-invalid={errors.repeatInterval ? true : undefined}
                  className={`h-10 w-16 rounded-lg border bg-transparent text-center text-white outline-none ${errors.repeatInterval ? "border-accent" : "border-white/20 focus:border-white/60"}`}
                />
                {a.form.unit[draft.repeat](interval)}
              </div>
              {errors.repeatInterval && <Helper tone="error">{a.errors.badRepeatInterval}</Helper>}
              {draft.repeat === "weekly" && (
                <>
                  <Subheading>{a.form.weekdaysLabel}</Subheading>
                  <div className="flex flex-wrap gap-2">
                    {WEEKDAYS.map((code, i) => {
                      const on = draft.repeatWeekdays.includes(code);
                      return (
                        <ToggleChip key={code} on={on} label={fmtDay(addDays("2026-10-26", i), lang, { weekday: "long" })} onClick={() => change({ repeatWeekdays: on ? draft.repeatWeekdays.filter((x) => x !== code) : WEEKDAYS.filter((x) => x === code || draft.repeatWeekdays.includes(x)) })}>
                          {fmtDay(addDays("2026-10-26", i), lang, { weekday: "short" })}
                        </ToggleChip>
                      );
                    })}
                  </div>
                </>
              )}
              {draft.repeat === "monthly" && <Helper>{a.form.monthDayNote(monthDay)}</Helper>}
              <Subheading>{a.form.endsLabel}</Subheading>
              <ChoiceChips label={a.form.endsLabel} value={draft.repeatEnd} onChange={(v) => change({ repeatEnd: v })} options={(["never", "onDate", "afterCount"] as const).map((c) => ({ value: c, label: a.form.end[c] }))} />
              {draft.repeatEnd === "onDate" && (
                <div className="mt-3">
                  {isDayKey(draft.repeatUntilDate) && <p className="mb-2 text-[0.88rem]">{a.form.untilOn(capitalize(fmtDay(draft.repeatUntilDate, lang, { month: "long", day: "numeric", year: "numeric" })))}</p>}
                  <ListGroup>
                    <PickerRow icon={<CalendarX className="h-5 w-5" />} title={a.form.pickUntilDate} supporting={isDayKey(draft.repeatUntilDate) ? fmtDay(draft.repeatUntilDate, lang, { weekday: "short", month: "short", day: "numeric", year: "numeric" }) : "—"} type="date" value={draft.repeatUntilDate || draft.date} onChange={(v) => change({ repeatUntilDate: v })} invalid={!!errors.repeatUntil} />
                  </ListGroup>
                  {errors.repeatUntil && <Helper tone="error">{a.errors.badRepeatUntil}</Helper>}
                </div>
              )}
              {draft.repeatEnd === "afterCount" && <FloatField className="mt-3 max-w-[220px]" label={a.form.countLabel} value={draft.repeatCount} onChange={(v) => change({ repeatCount: v })} inputMode="numeric" maxLength={3} error={errors.repeatCount} />}
              {rule && <Helper tone="muted">{ruleLabel({ recurrence: rule, timezone: draft.timezone })}</Helper>}
            </>
          )}
        </FormSection>

        <FormSection title={a.form.place}>
          <ChoiceChips label={a.form.place} value={draft.locationType} onChange={(v) => change({ locationType: v })} options={(["none", "physical", "virtual", "hybrid"] as const).map((c) => ({ value: c, label: a.form.location[c] }))} />
          {(draft.locationType === "physical" || draft.locationType === "hybrid") && <FloatField className="mt-3" label={a.form.address} value={draft.address} onChange={(v) => change({ address: v })} maxLength={500} error={errors.address} />}
        </FormSection>

        <FormSection title={a.form.videoCall}>
          <ChoiceChips
            label={a.form.videoCall}
            value={draft.conferenceProvider}
            onChange={(v) => change({ conferenceProvider: v })}
            options={(["none", "google_meet", "zoom", "teams", "other"] as const).map((c) => ({ value: c, label: c === "none" ? a.form.noVideoCall : a.form.provider[c] }))}
          />
          {hint && <Helper>{a.form[hint]}</Helper>}
          {zoomNotConfigured(draft.conferenceProvider, draft.conferenceUrl, links) && <Helper tone="muted">{a.form.zoomNotConfigured}</Helper>}
          {draft.conferenceProvider !== "none" && (
            <div className="mt-3 space-y-3">
              <FloatField label={a.form[linkLabel(draft.conferenceProvider, links, target)]} value={draft.conferenceUrl} onChange={(v) => change({ conferenceUrl: v })} type="url" inputMode="url" placeholder="https://" error={errors.conferenceUrl} />
              {showPasscode(draft.conferenceProvider, draft.conferenceUrl, draft.conferencePassword) && (
                <FloatField label={a.form.password} value={draft.conferencePassword} onChange={(v) => change({ conferencePassword: v })} maxLength={100} error={errors.conferencePassword} autoComplete="off" />
              )}
            </div>
          )}
        </FormSection>

        <FormSection title={a.form.participants}>
          {draft.participants.map((row, i) => (
            <div key={i} className="mb-3 flex items-start gap-2">
              <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-2">
                <FloatField label={a.form.participantEmail} value={row.email} onChange={(v) => setParticipant(i, { email: v })} type="email" inputMode="email" autoComplete="off" />
                <FloatField label={a.form.participantName} value={row.name} onChange={(v) => setParticipant(i, { name: v })} autoComplete="off" />
              </div>
              <IconButton label={a.form.removeParticipant} className="mt-2" onClick={() => change({ participants: draft.participants.filter((_, j) => j !== i) })}>
                <X className="h-4 w-4" />
              </IconButton>
            </div>
          ))}
          {errors.participants && <Helper tone="error">{a.errors[errors.participants]}</Helper>}
          <button type="button" onClick={() => change({ participants: [...draft.participants, { email: "", name: "" }] })} className="inline-flex h-9 items-center gap-2 rounded-lg px-2 text-[0.84rem] font-medium text-white/85 hover:bg-white/[0.06] hover:text-white">
            <UserPlus className="h-4 w-4" aria-hidden />
            {a.form.addParticipant}
          </button>
          {draft.participants.length > 0 && <Helper>{links.google ? a.form.invitesByGoogle : a.form.invitesNeedCalendar}</Helper>}
        </FormSection>

        <FormSection title={a.form.tips}>
          <FloatField label={a.form.tipsLabel} value={draft.tips} onChange={(v) => change({ tips: v })} multiline error={errors.tips} />
        </FormSection>

        <FormSection title={a.form.alerts}>
          <Switch
            label={a.form.useDefaultAlerts}
            checked={!draft.customAlerts}
            onChange={(useDefaults) => change({ customAlerts: !useDefaults, alertTimes: useDefaults || draft.alertTimes.length ? draft.alertTimes : [...s.prefs.defaultAlertTimes] })}
          />
          {draft.customAlerts ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {[...new Set([...ALERT_TIME_OPTIONS, ...draft.alertTimes])]
                .sort((x, y) => y - x)
                .map((min) => {
                  const on = draft.alertTimes.includes(min);
                  return (
                    <ToggleChip key={min} on={on} onClick={() => change({ alertTimes: on ? draft.alertTimes.filter((x) => x !== min) : [...draft.alertTimes, min].sort((x, y) => y - x) })}>
                      {a.reminder(min)}
                    </ToggleChip>
                  );
                })}
            </div>
          ) : (
            <Helper tone="muted">{a.editor.remindersDefault(s.prefs.defaultAlertTimes.map(a.reminder).join(", "))}</Helper>
          )}
          {errors.alertTimes && <Helper tone="error">{a.errors.alertTimesRequired}</Helper>}
          <Subheading>{a.form.intensity}</Subheading>
          <ChoiceChips
            label={a.form.intensity}
            value={draft.alertIntensity}
            onChange={(v) => change({ alertIntensity: v })}
            options={(["default", "max", "medium", "light"] as const).map((level) => ({ value: level, label: level === "default" ? a.form.intensityDefault(a.intensity[s.prefs.alertIntensity]) : a.intensity[level] }))}
          />
        </FormSection>

        <FormSection title={a.form.notes}>
          <FloatField label={a.form.notes} value={draft.notes} onChange={(v) => change({ notes: v })} multiline error={errors.notes} />
        </FormSection>

        <FormSection title={a.form.attachments}>
          <p className="text-[0.8rem] text-white/55">{a.form.attachmentsWeb}</p>
        </FormSection>

        {linked.length > 0 && <LinkedQuestion tasks={linked} value={moveLinked} onChange={setMoveLinked} />}
      </form>
    </Dialog>
  );
}

/* ---------- Edit one date of a series, or this and the following ---------- */

export function OccurrenceEditor({ sel, scope, onClose }: { sel: Selection; scope: "one" | "following"; onClose: () => void }) {
  const a = useA();
  const s = useAgenda();
  const toast = useToast();
  const m = s.meetings.find((x) => x.id === sel.id);
  const o = m ? findOccurrence(m, sel.key) : null;
  const [title, setTitle] = useState(o?.title ?? "");
  const [date, setDate] = useState(() => (o && m ? dayKey(o.start, m.timezone) : ""));
  const [time, setTime] = useState(() => (o && m ? timeKey(o.start, m.timezone) : ""));
  const [duration, setDuration] = useState(() => (o ? Math.round((o.end.getTime() - o.start.getTime()) / MINUTE) : 60));
  const [errors, setErrors] = useState<{ title?: ErrorCode; date?: ErrorCode; time?: ErrorCode }>({});
  const [busy, setBusy] = useState(false);

  const heading = scope === "one" ? a.scope.occurrenceTitle : a.scope.followingTitle;
  if (!m || !o) return <Gone title={heading} onClose={onClose} />;

  const durations = DURATION_OPTIONS.includes(duration) ? DURATION_OPTIONS : [...DURATION_OPTIONS, duration].sort((x, y) => x - y);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const found: typeof errors = {};
    if (!title.trim()) found.title = "required";
    else if (title.trim().length > TITLE_MAX) found.title = "tooLong";
    if (!isDayKey(date)) found.date = "badDate";
    if (!m.allDay && !isTimeKey(time)) found.time = "badTime";
    setErrors(found);
    if (hasErrors(found)) return;
    const startAt = fromZoned(date, m.allDay ? "00:00" : time, m.timezone);
    const patch: { title?: string; startAt?: string; durationMinutes?: number } = {};
    if (title.trim() !== o.title) patch.title = title.trim();
    if (startAt.getTime() !== o.start.getTime()) patch.startAt = startAt.toISOString();
    if (duration !== Math.round((o.end.getTime() - o.start.getTime()) / MINUTE)) patch.durationMinutes = duration;
    if (!Object.keys(patch).length) return onClose();
    setBusy(true);
    try {
      if (scope === "one") await updateOccurrence(m.id, sel.key, patch);
      else await editFollowing(m.id, sel.key, patch);
      toast(a.toast.saved);
      onClose();
    } catch (err) {
      setBusy(false);
      toast(saveError(a, err), { tone: "error" });
    }
  };

  const formId = "occurrence-form";
  return (
    <Dialog
      title={heading}
      onClose={onClose}
      size="sm"
      footer={
        <>
          <Button onClick={onClose}>{a.common.cancel}</Button>
          <Button variant="primary" type="submit" form={formId} busy={busy}>
            {a.editor.save}
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={submit} noValidate className="space-y-4">
        <Field label={a.editor.title} error={errors.title}>
          {(p) => <input {...p} className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} maxLength={TITLE_MAX} autoFocus />}
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label={a.editor.date} error={errors.date} className={m.allDay ? "col-span-2" : ""}>
            {(p) => <input {...p} type="date" className={inputClass} value={date} onChange={(e) => setDate(e.target.value)} />}
          </Field>
          {!m.allDay && (
            <Field label={a.editor.start} error={errors.time}>
              {(p) => <input {...p} type="time" className={inputClass} value={time} onChange={(e) => setTime(e.target.value)} />}
            </Field>
          )}
        </div>
        {!m.allDay && (
          <Field label={a.editor.duration}>
            {(p) => (
              <select {...p} className={inputClass} value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
                {durations.map((min) => (
                  <option key={min} value={min}>
                    {fmtDuration(min)}
                  </option>
                ))}
              </select>
            )}
          </Field>
        )}
        {scope === "one" && <p className="text-[0.78rem] text-white/50">{a.scope.occurrenceNote}</p>}
      </form>
    </Dialog>
  );
}

/* ---------- Move ---------- */

export function MoveDialog({ sel, onClose }: { sel: Selection; onClose: () => void }) {
  const a = useA();
  const s = useAgenda();
  const toast = useToast();
  const m = s.meetings.find((x) => x.id === sel.id);
  const o = m ? findOccurrence(m, sel.key) : null;
  // an all-day meeting moves on its own calendar days
  const zone = m?.allDay ? m.timezone : displayZone(s);
  const [date, setDate] = useState(() => (o ? dayKey(o.start, zone) : ""));
  const [start, setStart] = useState(() => (o ? timeKey(o.start, zone) : ""));
  const [scope, setScope] = useState<Scope>(sel.key ? "one" : "all");
  const [moveLinked, setMoveLinked] = useState<boolean | null>(null);
  const [error, setError] = useState<{ date?: ErrorCode; start?: ErrorCode }>({});
  const [busy, setBusy] = useState(false);

  if (!m || !o) return <Gone title={a.move.title} onClose={onClose} />;

  const length = o.end.getTime() - o.start.getTime();
  const linked = movableTasks(s.tasks, m.id);
  const series = !!m.recurrence && !!sel.key;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const next: typeof error = {};
    if (!isDayKey(date)) next.date = "badDate";
    if (!m.allDay && !isTimeKey(start)) next.start = "badTime";
    setError(next);
    if (hasErrors(next) || (linked.length > 0 && moveLinked === null)) return;

    const newStart = m.allDay ? dayStart(date, zone) : fromZoned(date, start, zone);
    const delta = newStart.getTime() - o.start.getTime();
    const dayDelta = daysBetween(dayKey(o.start, zone), date);
    const tasks = moveLinked ? linked.map((t) => shiftedTask(t, delta, dayDelta)) : [];
    setBusy(true);
    try {
      if (series && scope === "one") {
        await updateOccurrence(m.id, sel.key, { startAt: newStart.toISOString() }, tasks);
      } else if (series && scope === "following") {
        await editFollowing(m.id, sel.key, { startAt: newStart.toISOString() } satisfies MeetingPatch, tasks);
      } else if (m.recurrence) {
        await updateMeeting(m.id, { startAt: new Date(Date.parse(m.startAt) + delta).toISOString() }, tasks);
      } else {
        await updateMeeting(m.id, { startAt: newStart.toISOString() }, tasks);
      }
      toast(a.toast.moved);
      onClose();
    } catch (err) {
      setBusy(false);
      toast(saveError(a, err), { tone: "error" });
    }
  };

  const formId = "move-form";
  return (
    <Dialog
      title={`${a.move.title}: ${o.title}`}
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
            <Choice
              name="move-scope"
              value={scope}
              onChange={setScope}
              options={[
                { value: "one", label: a.move.scopeOne },
                { value: "following", label: a.move.scopeFollowing },
                { value: "all", label: a.move.scopeAll },
              ]}
            />
          </fieldset>
        )}

        {linked.length > 0 && <LinkedQuestion tasks={linked} value={moveLinked} onChange={setMoveLinked} />}
      </form>
    </Dialog>
  );
}

/* ---------- Delete ---------- */

export function CancelDialog({ sel, onClose }: { sel: Selection; onClose: () => void }) {
  const a = useA();
  const s = useAgenda();
  const toast = useToast();
  const m = s.meetings.find((x) => x.id === sel.id);
  const [scope, setScope] = useState<Scope>("one");
  const [busy, setBusy] = useState(false);
  if (!m) return null;
  const series = !!m.recurrence && !!sel.key;
  const hasLinked = s.tasks.some((t) => t.meetingId === m.id);
  const calendar = calendarOf(m);
  const elsewhere = isLinkedElsewhere(m) && calendar !== "device";

  const confirm = async () => {
    setBusy(true);
    try {
      if (series && scope === "one") await cancelOccurrence(m.id, sel.key);
      else if (series && scope === "following") await deleteFollowing(m.id, sel.key);
      else await removeMeeting(m.id);
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
      <p className="mt-2 text-[0.88rem] text-white/65">{series ? a.cancel.seriesBody : a.cancel.body}</p>
      {calendar === "device" && <p className="mt-2 text-[0.88rem] text-white/65">{a.cancel.device}</p>}
      {elsewhere && <p className="mt-2 text-[0.88rem] text-white/65">{a.cancel.synced(a.sources[calendar === "meetingguard" ? (m.external.outlookEventId ? "outlook" : "google") : calendar])}</p>}
      {hasLinked && <p className="mt-2 text-[0.88rem] text-white/65">{a.cancel.linkedKept}</p>}
      {series && (
        <div className="mt-4">
          <Choice
            name="cancel-scope"
            value={scope}
            onChange={setScope}
            options={[
              { value: "one", label: a.cancel.scopeOne },
              { value: "following", label: a.cancel.scopeFollowing },
              { value: "all", label: a.cancel.scopeAll },
            ]}
          />
        </div>
      )}
    </Dialog>
  );
}
