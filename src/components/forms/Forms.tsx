"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { track } from "@/lib/analytics";
import { HONEYPOT, submitForm, type FormKind, type SubmitResult } from "@/lib/forms";
import { useLang, useT } from "@/lib/language";
import { siteConfig } from "@/lib/site";

export const inputClass =
  "h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-[0.9rem] text-white placeholder:text-white/40 transition-colors focus:border-white/30 focus:outline-none";
const buttonClass =
  "h-11 shrink-0 rounded-xl bg-inverse px-5 text-[0.88rem] font-medium text-on-inverse transition hover:bg-inverse-hover disabled:opacity-60";

const EVENTS = { waitlist: "waitlist_submit", updates: "updates_submit" } as const;

/** Submit handling shared by every form: honeypot, analytics event and an inline message. */
function useSubmit(kind: FormKind) {
  const lang = useLang();
  const [status, setStatus] = useState<"idle" | "sending" | SubmitResult>("idle");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    const result = await submitForm(kind, e.currentTarget, lang);
    if (result === "ok") {
      track(EVENTS[kind]);
      e.currentTarget?.reset();
    }
    setStatus(result);
  };
  return { status, onSubmit };
}

/** Hidden field that people never see and bots fill in. */
function Honeypot() {
  const t = useT();
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        {t.forms.honeypot}
        <input type="text" name={HONEYPOT} tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

function Status({ status, done }: { status: string; done?: string }) {
  const t = useT();
  const text =
    status === "error" ? t.forms.error : status === "offline" ? t.forms.offline : status === "ok" ? done : status === "sending" ? t.forms.sending : "";
  return (
    <p aria-live="polite" className={`mt-2 min-h-4 text-[0.78rem] ${status === "error" ? "text-accent-soft" : "text-white/55"}`}>
      {text}
      {(status === "offline" || status === "error") && (
        <>
          {" "}
          <a href={`mailto:${siteConfig.supportEmail}`} className="text-white underline underline-offset-2">
            {siteConfig.supportEmail}
          </a>
        </>
      )}
    </p>
  );
}

/** Native select with the site's input look and a chevron. */
function Select({ id, name, defaultValue, children }: { id: string; name: string; defaultValue: string; children: ReactNode }) {
  return (
    <div className="relative">
      <select id={id} name={name} defaultValue={defaultValue} className={`${inputClass} appearance-none pr-9 [&>option]:bg-panel`}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-white/45" aria-hidden />
    </div>
  );
}

/** Assistant waitlist: email and language. */
export function WaitlistForm({ id = "waitlist", className = "" }: { id?: string; className?: string }) {
  const t = useT();
  const lang = useLang();
  const { status, onSubmit } = useSubmit("waitlist");
  return (
    <form onSubmit={onSubmit} className={`relative ${className}`}>
      <Honeypot />
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex-1">
          <label htmlFor={`${id}-email`} className="sr-only">
            {t.forms.email}
          </label>
          <input id={`${id}-email`} name="email" type="email" required autoComplete="email" placeholder={t.forms.emailPlaceholder} className={inputClass} />
        </div>
        <div className="sm:w-36">
          <label htmlFor={`${id}-lang`} className="sr-only">
            {t.forms.language}
          </label>
          <Select id={`${id}-lang`} name="language" defaultValue={lang}>
            <option value="en">{t.forms.languages.en}</option>
            <option value="es">{t.forms.languages.es}</option>
          </Select>
        </div>
        <button type="submit" disabled={status === "sending"} className={buttonClass}>
          {t.forms.joinList}
        </button>
      </div>
      <Status status={status} done={t.forms.joined} />
    </form>
  );
}

/** Footer: "Subscribe for updates", as one pill (email field with the button inside). */
export function NewsletterForm() {
  const t = useT();
  const { status, onSubmit } = useSubmit("updates");
  return (
    <form onSubmit={onSubmit} className="relative w-full max-w-[400px]">
      <Honeypot />
      <label htmlFor="newsletter-email" className="sr-only">
        {t.footer.emailLabel}
      </label>
      <div className="relative">
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={t.footer.emailPlaceholder}
          className="h-11 w-full rounded-full border border-white/10 bg-white/[0.04] pr-[8.5rem] pl-4 text-[0.86rem] text-white transition-colors placeholder:text-white/35 focus:border-white/30 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          aria-label={t.footer.subscribe}
          className="group absolute top-1 right-1 inline-flex h-9 items-center gap-1.5 rounded-full bg-inverse pr-3 pl-4 text-[0.8rem] font-medium whitespace-nowrap text-on-inverse transition hover:bg-inverse-hover disabled:opacity-60"
        >
          {t.footer.subscribeShort}
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
        </button>
      </div>
      <Status status={status} done={t.footer.done} />
    </form>
  );
}
