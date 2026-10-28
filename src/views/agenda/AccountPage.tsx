"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Check, ExternalLink, LogOut, Minus } from "lucide-react";
import { LanguageSwitch } from "@/components/layout/LanguageSwitch";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { AgendaFrame } from "@/components/agenda/Frame";
import { Button, Dialog, Field, inputClass, useToast } from "@/components/agenda/ui";
import { StoreBadges } from "@/components/ui/StoreBadges";
import { useNow } from "@/lib/agenda/hooks";
import { useA } from "@/lib/agenda/i18n";
import { hasFeature, MANAGE_URL, onTrial, REQUIRED, type Feature } from "@/lib/agenda/plans";
import { deleteAccount, displayZone, resetDemo, savePrefs, setDemoPlan, signOut, useAgenda } from "@/lib/agenda/store";
import { allZones, dayKey, deviceZone, fmtDay } from "@/lib/agenda/time";
import type { Connections, Plan } from "@/lib/agenda/types";
import { useHref, useLang } from "@/lib/language";

const FEATURES = Object.keys(REQUIRED) as Feature[];
const CONNECTIONS: (keyof Connections)[] = ["google", "outlook", "microsoftToDo", "googleTasks"];

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
  const trial = onTrial(e, now);
  const trialDays = Math.max(1, Math.ceil((e.trialEndsAt - now) / 86_400_000));
  const zone = displayZone(s.prefs);
  const names = { ...a.sources, ...a.taskLists };

  return (
    <div className="mx-auto grid max-w-[1000px] gap-5 lg:grid-cols-2">
      <div className="space-y-5">
        <Card title={a.account.profile}>
          <div className="flex items-center gap-4">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white/[0.08] text-[1.3rem] font-semibold">{user.name.charAt(0).toUpperCase()}</span>
            <div className="min-w-0">
              <p className="truncate text-[1.02rem] font-medium">{user.name}</p>
              <p className="truncate text-[0.86rem] text-white/60">{user.email}</p>
              <p className="mt-1 text-[0.76rem] text-white/45">{a.account.provider[user.provider]}</p>
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
            <span className="rounded-lg bg-white/[0.08] px-3 py-1.5 text-[1.05rem] font-semibold">{a.account.plans[e.plan]}</span>
            {trial && <span className="text-[0.85rem] text-warm">{a.account.trial(trialDays)}</span>}
            {!trial && e.plan !== "free" && e.renewsAt > 0 && <span className="text-[0.85rem] text-white/55">{a.account.renews(fmtDay(dayKey(new Date(e.renewsAt), zone), lang, { day: "numeric", month: "long", year: "numeric" }))}</span>}
          </div>
          {e.store ? (
            <a
              href={MANAGE_URL[e.store]}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg border border-white/12 px-4 text-[0.88rem] font-medium text-white/85 hover:border-white/25 hover:text-white"
            >
              {a.account.manage}
              <span className="text-white/45">· {a.account.manageWhere[e.store]}</span>
              <ExternalLink className="h-3.5 w-3.5 text-white/45" aria-hidden />
            </a>
          ) : (
            <>
              <p className="mt-4 text-[0.86rem] leading-relaxed text-white/60">{a.account.freeBody}</p>
              <StoreBadges className="mt-4" height={40} />
            </>
          )}
          <h3 className="mt-6 text-[0.8rem] font-medium text-white/55">{a.account.onTheWeb}</h3>
          <ul className="mt-2 space-y-2">
            {FEATURES.map((f) => {
              const on = hasFeature(e, f);
              return (
                <li key={f} className="flex items-center gap-3 text-[0.88rem]">
                  {on ? <Check className="h-4 w-4 text-[#1fa37a]" aria-hidden /> : <Minus className="h-4 w-4 text-white/30" aria-hidden />}
                  <span className={on ? "" : "text-white/45"}>{a.account.features[f]}</span>
                  <span className="sr-only">{on ? a.account.included : a.account.notIncluded}</span>
                  {!on && <span className="ml-auto text-[0.72rem] text-warm uppercase">{a.account.plans[REQUIRED[f]]}</span>}
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      <div className="space-y-5">
        <Card title={a.account.connections}>
          <ul className="divide-y divide-white/[0.06]">
            {CONNECTIONS.map((c) => (
              <li key={c} className="flex items-center justify-between py-2.5 text-[0.9rem]">
                {names[c]}
                <span className={`text-[0.8rem] ${s.connections[c] ? "text-[#1fa37a]" : "text-white/45"}`}>{s.connections[c] ? a.account.connected : a.account.notConnected}</span>
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
                <select {...p} className={inputClass} value={s.prefs.timeZone} onChange={(ev) => savePrefs({ timeZone: ev.target.value })}>
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

        <Card title={a.account.demoTitle}>
          <p className="text-[0.8rem] text-white/50">{a.account.demoNote}</p>
          <p className="mt-4 text-[0.8rem] font-medium text-white/65">{a.account.demoPlan}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {(
              [
                ["free", false, a.account.plans.free],
                ["pro", true, a.account.demoTrial],
                ["pro", false, a.account.plans.pro],
                ["premium", false, a.account.plans.premium],
              ] as [Plan, boolean, string][]
            ).map(([plan, isTrial, label]) => {
              const active = e.plan === plan && trial === isTrial;
              return (
                <button
                  key={label}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setDemoPlan(plan, isTrial)}
                  className={`rounded-lg border px-3 py-1.5 text-[0.82rem] ${active ? "border-white/40 bg-white/[0.08]" : "border-white/10 text-white/65 hover:text-white"}`}
                >
                  {label}
                </button>
              );
            })}
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
  const href = useHref();
  const router = useRouter();
  const toast = useToast();
  const [typed, setTyped] = useState("");
  const [busy, setBusy] = useState(false);
  const ready = typed.trim().toUpperCase() === a.account.deleteWord;

  const confirm = async () => {
    setBusy(true);
    try {
      await deleteAccount();
      router.replace(href("/app/sign-in"));
    } catch {
      setBusy(false);
      toast(a.errors.save, { tone: "error" });
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
      <Field label={a.account.deleteType(a.account.deleteWord)} className="mt-4">
        {(p) => <input {...p} className={inputClass} value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" autoCapitalize="characters" />}
      </Field>
    </Dialog>
  );
}
