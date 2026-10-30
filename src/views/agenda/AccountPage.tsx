"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, Bell, CalendarDays, Check, ChevronRight, CirclePlus, ExternalLink, Globe, LogOut, Mail, MailCheck, MailWarning, MessageCircle, Smartphone } from "lucide-react";
import { AgendaFrame } from "@/components/agenda/Frame";
import { ChoiceChips, Helper, Subheading, Switch, ToggleChip } from "@/components/agenda/form";
import { Button, Dialog, Field, inputClass, useToast } from "@/components/agenda/ui";
import { StoreBadges } from "@/components/ui/StoreBadges";
import { LIVE } from "@/lib/agenda/config";
import { useNow } from "@/lib/agenda/hooks";
import { useA } from "@/lib/agenda/i18n";
import { ANNUAL_DISCOUNT_PERCENT, DAILY_AI_LIMITS, effectivePlan, formatUsd, hasStoreSubscription, MANAGE_URL, POPULAR, PRICES, type Cycle } from "@/lib/agenda/plans";
import { normalizeAlertTimes } from "@/lib/agenda/records";
import { AuthError, deleteAccount, displayZone, resetDemo, setDemoPlan, setDisplayZone, signOut, updatePreferences, useAgenda, whatsappStatus, type WhatsAppStatus } from "@/lib/agenda/store";
import { allZones, dayKey, deviceZone, fmtDay, LOCALE } from "@/lib/agenda/time";
import type { AlertIntensity, AlertSoundType, Plan, Preferences, PreferencesPatch } from "@/lib/agenda/types";
import { useHref, useLang } from "@/lib/language";

const STORES = ["google_play", "app_store"] as const;
const PLANS: Plan[] = ["free", "pro", "premium"];
const GREEN = "text-[#1fa37a]";

/** A settings section as in the app: a heading over its rows. */
function Section({ title, children, tone }: { title: string; children: ReactNode; tone?: "danger" }) {
  return (
    <section aria-label={title}>
      <h2 className={`mb-3 px-1 text-[0.95rem] font-semibold ${tone === "danger" ? "text-accent-soft" : ""}`}>{title}</h2>
      {children}
    </section>
  );
}

function Panel({ children, className = "", tone }: { children: ReactNode; className?: string; tone?: "danger" }) {
  return <div className={`surface rounded-2xl p-5 sm:p-6 ${tone === "danger" ? "border-accent/25!" : ""} ${className}`}>{children}</div>;
}

export function AccountPage() {
  const a = useA();
  return (
    <AgendaFrame title={a.account.title}>
      <Account />
    </AgendaFrame>
  );
}

function Account() {
  const a = useA();
  const s = useAgenda();
  const href = useHref();
  const router = useRouter();
  const toast = useToast();
  const [leaving, setLeaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const user = s.user;
  if (!user) return null;

  const primaryProvider = user.providers.find((p): p is keyof typeof a.account.provider => p in a.account.provider);
  // only email accounts have an address to verify, as in the app
  const emailAccount = user.providers.includes("password");
  const p = s.prefs;
  const alertSummary = p.alertEnabled ? `${a.alertForm.level[p.alertIntensity].title} · ${p.defaultAlertTimes.map(a.reminder).join(", ")}` : a.account.alertsOff;

  return (
    <div className="mx-auto max-w-[920px] space-y-9">
      <Section title={a.account.title}>
        <Panel className="flex flex-wrap items-center gap-x-5 gap-y-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white/[0.08] text-[1.3rem] font-semibold">{user.name.charAt(0).toUpperCase()}</span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[1.02rem] font-medium">{user.name}</p>
            <p className="truncate text-[0.86rem] text-white/60">{user.email}</p>
            {(primaryProvider || emailAccount) && (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {primaryProvider && <Status tone="muted">{a.account.provider[primaryProvider]}</Status>}
                {emailAccount && (
                  <Status tone={user.verified ? "ok" : "warn"}>
                    {user.verified ? <MailCheck className="h-3.5 w-3.5" aria-hidden /> : <MailWarning className="h-3.5 w-3.5" aria-hidden />}
                    {user.verified ? a.account.emailVerified : a.account.emailNotVerified}
                  </Status>
                )}
              </div>
            )}
          </div>
          <Button
            className="shrink-0 max-sm:w-full"
            busy={leaving}
            onClick={async () => {
              setLeaving(true);
              await signOut();
              router.replace(href("/app/sign-in"));
            }}
          >
            <LogOut className="h-4 w-4" aria-hidden />
            {a.account.signOut}
          </Button>
        </Panel>
      </Section>

      <PlanSection />

      <Section title={a.account.alerts}>
        <Panel className="p-0! sm:p-0!">
          <button type="button" onClick={() => setAlertsOpen(true)} className="flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-left transition-colors hover:bg-white/[0.04] sm:px-6">
            <IconTile>
              <Bell />
            </IconTile>
            <span className="min-w-0 flex-1">
              <span className="block text-[0.95rem] font-medium">{a.account.alertsOpen}</span>
              <span className="block text-[0.82rem] text-white/55">{alertSummary}</span>
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-white/50" aria-hidden />
          </button>
        </Panel>
      </Section>

      <Section title={a.account.timeFormat}>
        <TimeFormat value={p.use24HourClock} onChange={(use24HourClock) => void updatePreferences({ use24HourClock }).catch(() => toast(a.account.saveFailed, { tone: "error" }))} />
      </Section>

      <Section title={a.account.timeZone}>
        <Panel className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <IconTile>
              <Globe />
            </IconTile>
            <div className="min-w-0">
              <p className="text-[0.95rem] font-medium">{a.account.timeZoneLabel}</p>
              <p className="text-[0.82rem] text-white/55">{a.account.timeZoneNote}</p>
            </div>
          </div>
          <select aria-label={a.account.timeZoneLabel} className={`${inputClass} shrink-0 sm:w-[300px]`} value={s.zone} onChange={(ev) => setDisplayZone(ev.target.value)}>
            <option value="">{a.account.deviceZone(deviceZone().replace(/_/g, " "))}</option>
            {allZones().map((z) => (
              <option key={z} value={z}>
                {z.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </Panel>
      </Section>

      <Section title={a.account.connections}>
        <Connections />
      </Section>

      <Section title={a.account.integrations}>
        <WhatsApp />
      </Section>

      {!LIVE && <PreviewTools />}

      <Section title={a.account.deleteTitle} tone="danger">
        <Panel tone="danger" className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[560px] text-[0.86rem] leading-relaxed text-white/60">{a.account.deleteBody}</p>
          <Button variant="danger" className="shrink-0" onClick={() => setDeleting(true)}>
            {a.account.deleteButton}
          </Button>
        </Panel>
      </Section>

      {alertsOpen && <AlertSettings onClose={() => setAlertsOpen(false)} />}
      {deleting && <DeleteAccount onClose={() => setDeleting(false)} />}
    </div>
  );
}

/* ---------- Plan ---------- */

function PlanSection() {
  const a = useA();
  const lang = useLang();
  const s = useAgenda();
  const now = useNow();
  const [cycle, setCycle] = useState<Cycle>("monthly");
  const [getting, setGetting] = useState<Plan | null>(null);
  const [managing, setManaging] = useState(false);
  const e = s.entitlement;
  const current = effectivePlan(e, now);
  const store = hasStoreSubscription(e);
  const until = current !== "free" && e.expiresAt ? a.account.renews(fmtDay(dayKey(new Date(e.expiresAt), displayZone(s)), lang, { day: "numeric", month: "long", year: "numeric" })) : null;

  return (
    <Section title={a.account.plan}>
      <div className="mb-5 flex justify-center">
        <div role="radiogroup" aria-label={a.account.cycle} className="inline-flex rounded-full border border-white/10 bg-white/[0.04] p-1">
          {(["monthly", "yearly"] as const).map((c) => (
            <button
              key={c}
              type="button"
              role="radio"
              aria-checked={cycle === c}
              onClick={() => setCycle(c)}
              className={`inline-flex h-8 items-center gap-2 rounded-full px-4 text-[0.84rem] font-medium transition-colors ${cycle === c ? "bg-white/[0.12] text-white" : "text-white/60 hover:text-white"}`}
            >
              {c === "monthly" ? a.account.monthly : a.account.yearly}
              {c === "yearly" && <span className="rounded-full bg-inverse px-1.5 py-px text-[0.7rem] font-semibold text-on-inverse">-{ANNUAL_DISCOUNT_PERCENT}%</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 md:items-stretch md:py-3">
        {PLANS.map((plan) => {
          const isCurrent = plan === current;
          return (
            <article
              key={plan}
              aria-label={a.account.plans[plan]}
              aria-current={isCurrent || undefined}
              className={`flex flex-col rounded-2xl border p-5 sm:p-6 ${
                isCurrent ? "border-white/25 bg-white/[0.07] shadow-[0_18px_60px_rgba(0,0,0,0.45)] md:-my-3 md:py-8" : "surface"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-[1.15rem] font-semibold">{a.account.plans[plan]}</h3>
                {isCurrent ? (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white/[0.1] px-2.5 py-1 text-[0.72rem] font-medium">
                    <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
                    {a.account.current}
                  </span>
                ) : (
                  plan === POPULAR && <span className="shrink-0 rounded-full border border-white/15 px-2.5 py-1 text-[0.72rem] text-white/70">{a.account.popular}</span>
                )}
              </div>
              <p className="mt-1 min-h-[2.6em] text-[0.84rem] leading-snug text-white/55">{a.account.planBlurb[plan]}</p>

              <Price plan={plan} cycle={cycle} />

              <div className="mt-5">
                {isCurrent ? (
                  plan !== "free" && store ? (
                    <Button className="w-full" onClick={() => setManaging(true)}>
                      {a.account.manage}
                    </Button>
                  ) : (
                    <Button className="w-full" disabled>
                      <Check className="h-4 w-4" aria-hidden />
                      {a.account.current}
                    </Button>
                  )
                ) : plan === "free" ? (
                  <p className="flex h-10 items-center justify-center rounded-lg border border-dashed border-white/12 text-[0.84rem] text-white/50">{a.account.included}</p>
                ) : (
                  <Button variant="primary" className="w-full" onClick={() => setGetting(plan)}>
                    {a.account.getInApp}
                  </Button>
                )}
              </div>

              {isCurrent && until && <p className="mt-3 text-[0.8rem] text-white/55">{until}</p>}
              {isCurrent && plan !== "free" && e.status === "grace_period" && <p className="mt-2 text-[0.8rem] text-warm">{a.account.grace}</p>}
              {isCurrent && plan !== "free" && !store && <p className="mt-3 text-[0.8rem] text-white/55">{a.account.granted}</p>}

              <ul className="mt-6 space-y-2.5">
                {(plan === "free"
                  ? [{ text: a.account.features.requests(DAILY_AI_LIMITS.free) }, { text: a.account.features.meetings }, { text: a.account.features.calendars }]
                  : [{ text: a.account.features.everythingFree, plus: true }, { text: a.account.features.requests(DAILY_AI_LIMITS[plan]) }]
                ).map((f) => (
                  <li key={f.text} className={`flex items-start gap-2.5 text-[0.86rem] ${"plus" in f ? "text-white/60" : ""}`}>
                    {"plus" in f ? <CirclePlus className="mt-0.5 h-4 w-4 shrink-0 text-white/50" aria-hidden /> : <Check className={`mt-0.5 h-4 w-4 shrink-0 ${GREEN}`} aria-hidden />}
                    {f.text}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
      <p className="mt-5 text-center text-[0.76rem] text-white/45">{a.account.priceNote}</p>

      {getting && (
        <Dialog title={a.account.getTitle(a.account.plans[getting])} onClose={() => setGetting(null)} size="sm">
          <p className="text-[0.88rem] leading-relaxed text-white/75">{a.account.getBody}</p>
          {store && current !== "free" && <p className="mt-3 text-[0.84rem] leading-relaxed text-white/60">{a.account.getManaged}</p>}
          <StoreBadges className="mt-5" height={40} />
        </Dialog>
      )}
      {managing && (
        <Dialog title={a.account.manage} onClose={() => setManaging(false)} size="sm">
          {e.status === "grace_period" && <p className="mb-4 text-[0.86rem] text-warm">{a.account.grace}</p>}
          <div className="flex flex-col gap-2">
            {STORES.map((st) => (
              <a
                key={st}
                href={MANAGE_URL[st]}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center justify-between gap-2 rounded-lg border border-white/12 px-4 py-2 text-[0.88rem] font-medium text-white/85 hover:border-white/25 hover:text-white"
              >
                {a.account.manageWhere[st]}
                <ExternalLink className="h-3.5 w-3.5 text-white/45" aria-hidden />
              </a>
            ))}
          </div>
        </Dialog>
      )}
    </Section>
  );
}

function Price({ plan, cycle }: { plan: Plan; cycle: Cycle }) {
  const a = useA();
  const unit = <span className="ml-1.5 text-[0.82rem] font-normal text-white/50">/ {a.account.perMonth}</span>;
  if (plan === "free") {
    return (
      <div className="mt-5">
        <p className="text-[2.4rem] leading-none font-semibold tracking-tight">
          {formatUsd(0)}
          {unit}
        </p>
        <p className="mt-2 text-[0.78rem] text-white/50">{a.account.forever}</p>
      </div>
    );
  }
  const price = PRICES[plan];
  const shown = cycle === "monthly" ? price.monthly : Number((price.yearly / 12).toFixed(2));
  return (
    <div className="mt-5">
      <p className="text-[2.4rem] leading-none font-semibold tracking-tight">
        {formatUsd(shown)}
        {unit}
      </p>
      <p className="mt-2 text-[0.78rem] text-white/50">
        {cycle === "yearly" ? (
          <>
            <s className="mr-1.5 text-white/35">{formatUsd(Number((price.monthly * 12).toFixed(2)))}</s>
            {a.account.billedYearly(formatUsd(price.yearly))}
          </>
        ) : (
          a.account.trial
        )}
      </p>
    </div>
  );
}

/* ---------- Settings ---------- */

/** A small rounded square holding a row's icon. */
function IconTile({ children }: { children: ReactNode }) {
  return (
    <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/[0.06] text-white/75 [&>svg]:h-[18px] [&>svg]:w-[18px]">
      {children}
    </span>
  );
}

const STATUS_TONES = {
  ok: "bg-[#1fa37a]/12 text-[#1fa37a]",
  warn: "bg-warm/12 text-warm",
  muted: "bg-white/[0.06] text-white/55",
};

/** A status as a small pill: "Connected", "Email verified". */
function Status({ tone, dot = false, children }: { tone: keyof typeof STATUS_TONES; dot?: boolean; children: ReactNode }) {
  return (
    <span className={`inline-flex max-w-full items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.75rem] leading-tight font-medium ${STATUS_TONES[tone]}`}>
      {dot && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" aria-hidden />}
      {children}
    </span>
  );
}

const CLOCKS = ["auto", "12", "24"] as const;
// a sample afternoon time, shown in each format
const SAMPLE = new Date(Date.UTC(2026, 0, 5, 15, 30));

/** Auto, 12-hour or 24-hour: three cards that fill the row, a list of rows on a phone. */
function TimeFormat({ value, onChange }: { value: boolean | null; onChange: (use24: boolean | null) => void }) {
  const a = useA();
  const lang = useLang();
  const current = value === null ? "auto" : value ? "24" : "12";
  const example = (c: (typeof CLOCKS)[number]) =>
    new Intl.DateTimeFormat(LOCALE[lang], { timeZone: "UTC", hour: "numeric", minute: "2-digit", ...(c === "auto" ? {} : { hourCycle: c === "24" ? "h23" : "h12" }) }).format(SAMPLE);
  return (
    <>
      <div role="radiogroup" aria-label={a.account.timeFormat} className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
        {CLOCKS.map((c) => {
          const on = c === current;
          return (
            <button
              key={c}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onChange(c === "auto" ? null : c === "24")}
              className={`relative flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition-colors sm:block sm:p-5 ${on ? "border-white/35 bg-white/[0.07]" : "surface hover:border-white/20"}`}
            >
              {/* a radio circle in the row on a phone, a check in the corner of the card above */}
              <span
                aria-hidden
                className={`grid h-5 w-5 shrink-0 place-items-center rounded-full sm:absolute sm:top-4 sm:right-4 ${on ? "bg-inverse text-on-inverse" : "border-2 border-white/25 sm:hidden"}`}
              >
                {on && <Check className="h-3 w-3" strokeWidth={3} />}
              </span>
              <span className="block text-[0.92rem] font-medium">{a.account.clock[c]}</span>
              <span className={`ml-auto block text-[1rem] font-semibold whitespace-nowrap tabular-nums sm:mt-1.5 sm:ml-0 sm:text-[1.35rem] ${on ? "" : "text-white/50"}`}>{example(c)}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-3 px-1 text-[0.8rem] text-white/50">{a.account.timeFormatHint}</p>
    </>
  );
}

function Connections() {
  const a = useA();
  const s = useAgenda();
  // connected in the app; Outlook's connection stays on the phone, so its meetings are the sign
  const connections = [
    { name: a.sources.google, icon: <CalendarDays />, on: s.prefs.googleCalendarSyncEnabled, off: a.account.notConnected },
    { name: a.sources.outlook, icon: <Mail />, on: s.meetings.some((m) => m.source === "outlook" || !!m.external.outlookEventId), off: a.account.outlookUnknown },
    { name: a.sources.device, icon: <Smartphone />, on: s.prefs.deviceCalendarImportIds.length > 0 || s.prefs.deviceCalendarExportId !== null, off: a.account.notConnected },
  ];
  return (
    <Panel className="p-0! sm:p-0!">
      <ul className="divide-y divide-white/[0.06]">
        {connections.map((c) => (
          <li key={c.name} className="flex items-center gap-4 px-5 py-3.5 sm:px-6">
            <IconTile>{c.icon}</IconTile>
            {/* the status sits under the name on a phone, at the end of the row above */}
            <div className="flex min-w-0 flex-1 flex-col items-start gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
              <span className="text-[0.92rem] font-medium">{c.name}</span>
              <Status tone={c.on ? "ok" : "muted"} dot>
                {c.on ? a.account.connected : c.off}
              </Status>
            </div>
          </li>
        ))}
      </ul>
      <p className="border-t border-white/[0.06] px-5 py-3 text-[0.8rem] text-white/50 sm:px-6">{a.account.connectionsBody}</p>
    </Panel>
  );
}

function WhatsApp() {
  const a = useA();
  const uid = useAgenda().user?.uid;
  const [status, setStatus] = useState<WhatsAppStatus | "failed" | null>(null);
  useEffect(() => {
    let live = true;
    whatsappStatus().then(
      (st) => live && setStatus(st),
      () => live && setStatus("failed"),
    );
    return () => {
      live = false;
    };
  }, [uid]);

  const text =
    status === null ? "…" : status === "failed" ? a.account.waUnknown : !status.enabled ? a.account.waUnavailable : status.linked ? a.account.waLinked(status.linkedLast4) : a.account.waNotLinked;
  const linked = status !== null && status !== "failed" && status.enabled && status.linked;
  return (
    <Panel className="flex items-start gap-4">
      <IconTile>
        <MessageCircle />
      </IconTile>
      <div className="min-w-0 flex-1">
        {/* as in Calendars: the status under the name on a phone */}
        <div className="flex min-h-10 flex-col items-start justify-center gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <p className="text-[0.95rem] font-medium">{a.account.whatsapp}</p>
          <span aria-live="polite">
            <Status tone={linked ? "ok" : "muted"} dot>
              {text}
            </Status>
          </span>
        </div>
        {!linked && <p className="mt-1.5 text-[0.82rem] leading-relaxed text-white/55 sm:mt-0.5">{a.account.waBody}</p>}
      </div>
    </Panel>
  );
}

/* ---------- Alert settings (the app's Settings > Alerts) ---------- */

const INTENSITIES: AlertIntensity[] = ["max", "medium", "light"];
const SOUND_TYPES: AlertSoundType[] = ["voice_and_sound", "voice_only", "sound_only"];
const VOLUME_LEVELS = [0.4, 0.6, 0.8, 1];
const ALERT_TIME_OPTIONS = [60, 30, 15, 10, 5, 0];
const SNOOZE_OPTIONS = [5, 10, 15, 30];

type AlertDraft = Pick<Preferences, "alertEnabled" | "alertIntensity" | "alertSoundType" | "alertVolume" | "vibrationEnabled" | "defaultAlertTimes" | "snoozeMinutes" | "followUpEnabled" | "briefingEnabled" | "briefingTime">;
const DRAFT_KEYS: (keyof AlertDraft)[] = ["alertEnabled", "alertIntensity", "alertSoundType", "alertVolume", "vibrationEnabled", "defaultAlertTimes", "snoozeMinutes", "followUpEnabled", "briefingEnabled", "briefingTime"];

/** The step the app highlights for a stored volume. */
const nearestVolume = (v: number) => VOLUME_LEVELS.reduce((best, level) => (Math.abs(level - v) <= Math.abs(best - v) + 1e-9 ? level : best), 1);

/** Only what changed, as the app saves it. */
function alertPatch(prefs: Preferences, d: AlertDraft): PreferencesPatch {
  const patch: Record<string, unknown> = {};
  for (const k of DRAFT_KEYS) {
    if (JSON.stringify(d[k]) !== JSON.stringify(prefs[k])) patch[k] = d[k];
  }
  return patch as PreferencesPatch;
}

function AlertSettings({ onClose }: { onClose: () => void }) {
  const a = useA();
  const f = a.alertForm;
  const s = useAgenda();
  const toast = useToast();
  const [d, setD] = useState<AlertDraft>(() => ({ ...s.prefs, defaultAlertTimes: normalizeAlertTimes(s.prefs.defaultAlertTimes) }));
  const [busy, setBusy] = useState(false);
  const set = (patch: Partial<AlertDraft>) => setD((x) => ({ ...x, ...patch }));
  const timesValid = !d.alertEnabled || d.defaultAlertTimes.length > 0;
  const timeValid = /^([01]\d|2[0-3]):[0-5]\d$/.test(d.briefingTime);
  const patch = alertPatch(s.prefs, d);
  // an empty reminder list is never saved (the app keeps the old one)
  if (d.defaultAlertTimes.length === 0) delete patch.defaultAlertTimes;

  const saveAll = async () => {
    if (Object.keys(patch).length === 0) return onClose();
    setBusy(true);
    try {
      await updatePreferences(patch);
      toast(f.saved);
      onClose();
    } catch {
      setBusy(false);
      toast(a.account.saveFailed, { tone: "error" });
    }
  };

  return (
    <Dialog
      title={f.title}
      onClose={onClose}
      size="lg"
      footer={
        <>
          <Button onClick={onClose}>{a.common.cancel}</Button>
          <Button variant="primary" onClick={saveAll} disabled={!timesValid || !timeValid} busy={busy}>
            {f.save}
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <Switch label={f.enabled} checked={d.alertEnabled} onChange={(alertEnabled) => set({ alertEnabled })} />

        <div className={`space-y-6 ${d.alertEnabled ? "" : "pointer-events-none opacity-45"}`} inert={!d.alertEnabled || undefined}>
          <div>
            <Subheading>{f.intensity}</Subheading>
            <div role="radiogroup" aria-label={f.intensity} className="space-y-1.5">
              {INTENSITIES.map((level) => {
                const on = d.alertIntensity === level;
                return (
                  <button
                    key={level}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => set({ alertIntensity: level })}
                    className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${on ? "bg-white/[0.08]" : "hover:bg-white/[0.04]"}`}
                  >
                    <span className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border-2 ${on ? "border-white" : "border-white/40"}`}>{on && <span className="h-1.5 w-1.5 rounded-full bg-white" />}</span>
                    <span>
                      <span className="block text-[0.9rem] font-medium">{f.level[level].title}</span>
                      <span className="block text-[0.8rem] leading-snug text-white/55">{f.level[level].description}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <Subheading>{f.sound}</Subheading>
            <ChoiceChips label={f.sound} value={d.alertSoundType} options={SOUND_TYPES.map((t) => ({ value: t, label: f.soundType[t] }))} onChange={(alertSoundType) => set({ alertSoundType })} />
            {d.alertSoundType !== "sound_only" && <Helper>{f.voiceNeedsApp}</Helper>}
            <Subheading>{f.volume}</Subheading>
            <ChoiceChips label={f.volume} value={nearestVolume(d.alertVolume)} options={VOLUME_LEVELS.map((v) => ({ value: v, label: `${Math.round(v * 100)}%` }))} onChange={(alertVolume) => set({ alertVolume })} />
            <div className="mt-4">
              <Switch label={f.vibration} checked={d.vibrationEnabled} onChange={(vibrationEnabled) => set({ vibrationEnabled })} />
            </div>
          </div>

          <div>
            <Subheading>{f.times}</Subheading>
            <p className="mb-2 text-[0.8rem] text-white/55">{f.timesHint}</p>
            <div className="flex flex-wrap gap-2">
              {normalizeAlertTimes([...ALERT_TIME_OPTIONS, ...s.prefs.defaultAlertTimes]).map((min) => {
                const on = d.defaultAlertTimes.includes(min);
                return (
                  <ToggleChip key={min} on={on} onClick={() => set({ defaultAlertTimes: on ? d.defaultAlertTimes.filter((x) => x !== min) : normalizeAlertTimes([...d.defaultAlertTimes, min]) })}>
                    {a.reminder(min)}
                  </ToggleChip>
                );
              })}
            </div>
            {!timesValid && <Helper tone="error">{f.timesRequired}</Helper>}
          </div>
        </div>

        <div>
          <Subheading>{f.snooze}</Subheading>
          <ChoiceChips
            label={f.snooze}
            value={d.snoozeMinutes}
            options={[...new Set([...SNOOZE_OPTIONS, s.prefs.snoozeMinutes])].sort((x, y) => x - y).map((m) => ({ value: m, label: f.minutes(m) }))}
            onChange={(snoozeMinutes) => set({ snoozeMinutes })}
          />
        </div>

        <div>
          <Switch label={f.followUp} checked={d.followUpEnabled} onChange={(followUpEnabled) => set({ followUpEnabled })} />
          <Helper>{f.followUpBody}</Helper>
        </div>

        <div>
          <Switch label={f.briefing} checked={d.briefingEnabled} onChange={(briefingEnabled) => set({ briefingEnabled })} />
          <Helper>{f.briefingBody}</Helper>
          {d.briefingEnabled && (
            <Field label={f.briefingTime} className="mt-3 max-w-[200px]">
              {(fp) => <input {...fp} type="time" className={inputClass} value={d.briefingTime} onChange={(ev) => ev.target.value && set({ briefingTime: ev.target.value })} />}
            </Field>
          )}
        </div>

        <p className="rounded-xl border border-white/[0.08] px-4 py-3 text-[0.8rem] leading-relaxed text-white/55">{f.phoneOnly}</p>
      </div>
    </Dialog>
  );
}

/* ---------- Preview only ---------- */

function PreviewTools() {
  const a = useA();
  const lang = useLang();
  const s = useAgenda();
  const now = useNow();
  const toast = useToast();
  const plan = effectivePlan(s.entitlement, now);
  return (
    <Section title={a.account.demoTitle}>
      <Panel>
        <p className="text-[0.8rem] text-white/50">{a.account.demoNote}</p>
        <p className="mt-4 text-[0.8rem] font-medium text-white/65">{a.account.demoPlan}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {PLANS.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={plan === option}
              onClick={() => setDemoPlan(option)}
              className={`rounded-lg border px-3 py-1.5 text-[0.82rem] ${plan === option ? "border-white/40 bg-white/[0.08]" : "border-white/10 text-white/65 hover:text-white"}`}
            >
              {a.account.plans[option]}
            </button>
          ))}
        </div>
        <Button
          variant="ghost"
          className="mt-3 -ml-3"
          onClick={() => {
            resetDemo(lang);
            toast(a.toast.reset);
          }}
        >
          {a.account.demoReset}
        </Button>
      </Panel>
    </Section>
  );
}

/* ---------- Delete account ---------- */

function DeleteAccount({ onClose }: { onClose: () => void }) {
  const a = useA();
  const s = useAgenda();
  const href = useHref();
  const router = useRouter();
  const [typed, setTyped] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const providers = s.user?.providers ?? [];
  // the server requires a recent sign-in: a window for Google and Apple, the password otherwise
  const popupProvider = providers.includes("apple.com") ? "Apple" : providers.includes("google.com") ? "Google" : "";
  const needsPassword = LIVE && !popupProvider;
  const ready = typed.trim().toUpperCase() === a.account.deleteWord && (!needsPassword || !!password);

  const confirm = async () => {
    setBusy(true);
    setError("");
    try {
      await deleteAccount(needsPassword ? password : undefined);
      router.replace(href("/app/sign-in"));
    } catch (err) {
      setBusy(false);
      if (err instanceof AuthError) {
        if (err.code !== "cancelled") setError(a.signIn.errors[err.code]);
      } else {
        setError(a.account.deleteFailed);
      }
    }
  };

  return (
    <Dialog
      title={a.account.deleteAsk}
      onClose={onClose}
      size="sm"
      footer={
        <>
          <Button onClick={onClose}>{a.account.keep}</Button>
          <Button variant="danger" onClick={confirm} disabled={!ready} busy={busy}>
            {a.account.deleteConfirm}
          </Button>
        </>
      }
    >
      <ul className="ml-1 list-inside list-disc space-y-1 text-[0.88rem] text-white/75">
        {a.account.deleteList.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
      <p className="mt-3 text-[0.82rem] text-white/55">{a.account.deleteStore}</p>
      {LIVE && popupProvider && <p className="mt-2 text-[0.82rem] text-white/55">{a.account.deleteConfirmIdentity(popupProvider)}</p>}
      <Field label={a.account.deleteType(a.account.deleteWord)} className="mt-4">
        {(p) => <input {...p} className={inputClass} value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" autoCapitalize="characters" />}
      </Field>
      {needsPassword && (
        <Field label={a.account.deletePassword} className="mt-3">
          {(p) => <input {...p} type="password" className={inputClass} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />}
        </Field>
      )}
      {error && (
        <p role="alert" className="mt-3 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-[0.85rem]">
          {error}
        </p>
      )}
    </Dialog>
  );
}
