"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { track } from "@/lib/analytics";
import { HONEYPOT, submitForm, type FormKind, type SubmitResult } from "@/lib/forms";
import { useHref, useLang, useT } from "@/lib/language";
import { siteConfig } from "@/lib/site";

export const inputClass =
  "h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-[0.9rem] text-white placeholder:text-white/40 transition-colors focus:border-white/30 focus:outline-none";
const buttonClass =
  "h-11 shrink-0 rounded-xl bg-[#f4f4f5] px-5 text-[0.88rem] font-medium text-[#0b0b0e] transition hover:bg-white disabled:opacity-60";

const EVENTS = { waitlist: "waitlist_submit", contact: "contact_submit", "send-link": "send_link_submit", updates: "updates_submit" } as const;

/** Submit handling shared by every form: honeypot, analytics event, thanks page or inline message. */
function useSubmit(kind: FormKind, thanksPage: boolean) {
  const lang = useLang();
  const href = useHref();
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "sending" | SubmitResult>("idle");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    const result = await submitForm(kind, e.currentTarget, lang);
    if (result === "ok") {
      track(EVENTS[kind]);
      if (thanksPage) return router.push(href("/thanks"));
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
    <p aria-live="polite" className={`mt-2 min-h-4 text-[0.78rem] ${status === "error" ? "text-[#ff8a95]" : "text-white/55"}`}>
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
      <select id={id} name={name} defaultValue={defaultValue} className={`${inputClass} appearance-none pr-9 [&>option]:bg-[#141418]`}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-white/45" aria-hidden />
    </div>
  );
}

function Label({ children, htmlFor }: { children: ReactNode; htmlFor: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-[0.8rem] text-white/65">
      {children}
    </label>
  );
}

/** Assistant waitlist: email and language. */
export function WaitlistForm({ id = "waitlist", className = "" }: { id?: string; className?: string }) {
  const t = useT();
  const lang = useLang();
  const { status, onSubmit } = useSubmit("waitlist", true);
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
      <Status status={status} />
    </form>
  );
}

/** Support contact form. */
export function ContactForm() {
  const t = useT();
  const { status, onSubmit } = useSubmit("contact", true);
  return (
    <form onSubmit={onSubmit} className="relative grid gap-4">
      <Honeypot />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="contact-name">{t.forms.name}</Label>
          <input id="contact-name" name="name" required autoComplete="name" className={inputClass} />
        </div>
        <div>
          <Label htmlFor="contact-email">{t.forms.email}</Label>
          <input id="contact-email" name="email" type="email" required autoComplete="email" placeholder={t.forms.emailPlaceholder} className={inputClass} />
        </div>
      </div>
      <div>
        <Label htmlFor="contact-topic">{t.forms.topic}</Label>
        <Select id="contact-topic" name="topic" defaultValue="question">
          {Object.entries(t.forms.topics).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="contact-message">{t.forms.message}</Label>
        <textarea id="contact-message" name="message" required rows={5} className={`${inputClass} h-auto py-3`} />
      </div>
      <div>
        <button type="submit" disabled={status === "sending"} className={buttonClass}>
          {t.forms.sendMessage}
        </button>
        <Status status={status} />
      </div>
    </form>
  );
}

/** Download page: "send me the link" by email. */
export function SendLinkForm({ done }: { done: string }) {
  const t = useT();
  const { status, onSubmit } = useSubmit("send-link", false);
  return (
    <form onSubmit={onSubmit} className="relative">
      <Honeypot />
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="send-link-email" className="sr-only">
          {t.forms.email}
        </label>
        <input id="send-link-email" name="email" type="email" required autoComplete="email" placeholder={t.forms.emailPlaceholder} className={inputClass} />
        <button type="submit" disabled={status === "sending"} className={buttonClass}>
          {t.forms.sendLink}
        </button>
      </div>
      <Status status={status} done={done} />
    </form>
  );
}

/** Footer: "Subscribe for updates". */
export function NewsletterForm() {
  const t = useT();
  const { status, onSubmit } = useSubmit("updates", false);
  return (
    <form onSubmit={onSubmit} className="relative w-full max-w-[380px]">
      <Honeypot />
      <label htmlFor="newsletter-email" className="text-[0.88rem] text-white/75">
        {t.footer.emailLabel}
      </label>
      <div className="mt-3 flex flex-col items-start gap-3">
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={t.footer.emailPlaceholder}
          className={inputClass}
        />
        <button type="submit" disabled={status === "sending"} className={buttonClass}>
          {t.footer.subscribe}
        </button>
      </div>
      <Status status={status} done={t.footer.done} />
    </form>
  );
}
