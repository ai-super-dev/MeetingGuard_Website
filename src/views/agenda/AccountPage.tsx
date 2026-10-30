"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Check, ExternalLink, LogOut } from "lucide-react";
import { LanguageSwitch } from "@/components/layout/LanguageSwitch";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { AgendaFrame } from "@/components/agenda/Frame";
import { Button, Dialog, Field, inputClass, useToast } from "@/components/agenda/ui";
import { StoreBadges } from "@/components/ui/StoreBadges";
import { LIVE } from "@/lib/agenda/config";
import { useNow } from "@/lib/agenda/hooks";
import { useA } from "@/lib/agenda/i18n";
import { DAILY_AI_LIMITS, effectivePlan, hasStoreSubscription, MANAGE_URL } from "@/lib/agenda/plans";
import { AuthError, deleteAccount, displayZone, resetDemo, setDemoPlan, setDisplayZone, signOut, useAgenda } from "@/lib/agenda/store";
import { allZones, dayKey, deviceZone, fmtDay } from "@/lib/agenda/time";
import type { Plan } from "@/lib/agenda/types";
import { useHref, useLang } from "@/lib/language";

const STORES = ["google_play", "app_store"] as const;

function Card({ title, children, tone }: { title: string; children: ReactNode; tone?: "danger" }) {
  return (
    <section aria-label={title} className={`surface rounded-2xl p-5 sm:p-6 ${tone === "danger" ? "border-accent/25!" : ""}`}>
      <h2 className={`text-[0.98rem] font-semibold ${tone === "danger" ? "text-accent-soft" : ""}`}>{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
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
  const lang = useLang();
  const s = useAgenda();
  const now = useNow();
  const href = useHref();
  const router = useRouter();
  const toast = useToast();
  const [leaving, setLeaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const user = s.user;
  if (!user) return null;

  const e = s.entitlement;
  const plan = effectivePlan(e, now);
  const zone = displayZone(s);
  const primaryProvider = user.providers.find((p): p is keyof typeof a.account.provider => p in a.account.provider);
  // connected in the app; Outlook's connection stays on the phone, so its meetings are the sign
  const connections = [
    { name: a.sources.google, on: s.prefs.googleCalendarSyncEnabled, off: a.account.notConnected },
    { name: a.sources.outlook, on: s.meetings.some((m) => m.source === "outlook" || !!m.external.outlookEventId), off: a.account.outlookUnknown },
    { name: a.sources.device, on: s.prefs.deviceCalendarImportIds.length > 0 || s.prefs.deviceCalendarExportId !== null, off: a.account.notConnected },
  ];

  return (
    <div className="mx-auto grid max-w-[1000px] grid-cols-1 gap-5 lg:grid-cols-2">
      <div className="space-y-5">
        <Card title={a.account.profile}>
          <div className="flex items-center gap-4">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white/[0.08] text-[1.3rem] font-semibold">{user.name.charAt(0).toUpperCase()}</span>
            <div className="min-w-0">
              <p className="truncate text-[1.02rem] font-medium">{user.name}</p>
              <p className="truncate text-[0.86rem] text-white/60">{user.email}</p>
              {primaryProvider && <p className="mt-1 text-[0.76rem] text-white/45">{a.account.provider[primaryProvider]}</p>}
            </div>
          </div>
          <Button
            className="mt-5"
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
        </Card>

        <Card title={a.account.plan}>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-lg bg-white/[0.08] px-3 py-1.5 text-[1.05rem] font-semibold">{a.account.plans[plan]}</span>
            {plan !== "free" && e.expiresAt && <span className="text-[0.85rem] text-white/55">{a.account.renews(fmtDay(dayKey(new Date(e.expiresAt), zone), lang, { day: "numeric", month: "long", year: "numeric" }))}</span>}
          </div>
          {plan !== "free" && e.status === "grace_period" && <p className="mt-3 text-[0.85rem] text-warm">{a.account.grace}</p>}
          {plan === "free" ? (
            <>
              <p className="mt-4 text-[0.86rem] leading-relaxed text-white/60">{a.account.freeBody}</p>
              <StoreBadges className="mt-4" height={40} />
            </>
          ) : (
            hasStoreSubscription(e) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {STORES.map((store) => (
                  <a
                    key={store}
                    href={MANAGE_URL[store]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-10 flex-wrap items-center gap-x-2 rounded-lg border border-white/12 px-4 py-2 text-[0.88rem] font-medium text-white/85 hover:border-white/25 hover:text-white"
                  >
                    {a.account.manage}
                    <span className="text-white/45">· {a.account.manageWhere[store]}</span>
                    <ExternalLink className="h-3.5 w-3.5 text-white/45" aria-hidden />
                  </a>
                ))}
              </div>
            )
          )}
          <h3 className="mt-6 text-[0.8rem] font-medium text-white/55">{a.account.includes}</h3>
          <ul className="mt-2 space-y-2">
            {[a.account.includesAll, a.account.includesCalendars, a.account.includesAi(DAILY_AI_LIMITS[plan])].map((line) => (
              <li key={line} className="flex items-center gap-3 text-[0.88rem]">
                <Check className="h-4 w-4 shrink-0 text-[#1fa37a]" aria-hidden />
                {line}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="space-y-5">
        <Card title={a.account.connections}>
          <ul className="divide-y divide-white/[0.06]">
            {connections.map((c) => (
              <li key={c.name} className="flex items-center justify-between gap-3 py-2.5 text-[0.9rem]">
                {c.name}
                <span className={`text-right text-[0.8rem] ${c.on ? "text-[#1fa37a]" : "text-white/45"}`}>{c.on ? a.account.connected : c.off}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[0.8rem] text-white/50">{a.account.connectionsBody}</p>
        </Card>

        <Card title={a.account.preferences}>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3 text-[0.9rem]">
              <span>{a.account.language}</span>
              <LanguageSwitch />
            </div>
            <div className="flex items-center justify-between gap-3 text-[0.9rem]">
              <span>{a.account.theme}</span>
              <ThemeToggle withLabel />
            </div>
            <Field label={a.account.timeZone}>
              {(p) => (
                <select {...p} className={inputClass} value={s.zone} onChange={(ev) => setDisplayZone(ev.target.value)}>
                  <option value="">{a.account.deviceZone(deviceZone().replace(/_/g, " "))}</option>
                  {allZones().map((z) => (
                    <option key={z} value={z}>
                      {z.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              )}
            </Field>
          </div>
        </Card>

        {!LIVE && (
          <Card title={a.account.demoTitle}>
            <p className="text-[0.8rem] text-white/50">{a.account.demoNote}</p>
            <p className="mt-4 text-[0.8rem] font-medium text-white/65">{a.account.demoPlan}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(["free", "pro", "premium"] as Plan[]).map((option) => (
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
          </Card>
        )}

        <Card title={a.account.deleteTitle} tone="danger">
          <p className="text-[0.86rem] leading-relaxed text-white/60">{a.account.deleteBody}</p>
          <Button variant="danger" className="mt-4" onClick={() => setDeleting(true)}>
            {a.account.deleteButton}
          </Button>
        </Card>
      </div>

      {deleting && <DeleteAccount onClose={() => setDeleting(false)} />}
    </div>
  );
}

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
