"use client";

import { useState, type FormEvent } from "react";
import { useT } from "@/lib/language";
import { siteConfig } from "@/lib/site";

type Status = "idle" | "sending" | "done" | "error" | "soon";

/** Email field + "Subscribe for updates", posting to siteConfig.newsletterEndpoint once it's set. */
export function NewsletterForm() {
  const t = useT();
  const [status, setStatus] = useState<Status>("idle");
  const messages: Partial<Record<Status, string>> = { done: t.footer.done, error: t.footer.error, soon: t.footer.soon };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("email");
    if (!siteConfig.newsletterEndpoint) {
      setStatus("soon");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(siteConfig.newsletterEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-[380px]">
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
          className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-[0.88rem] text-white placeholder:text-white/40 focus:border-white/25 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="h-11 rounded-xl bg-[#f4f4f5] px-5 text-[0.85rem] font-medium text-[#0b0b0e] transition hover:bg-white disabled:opacity-60"
        >
          {t.footer.subscribe}
        </button>
      </div>
      <p aria-live="polite" className="mt-2 h-4 text-[0.78rem] text-white/55">
        {messages[status]}
      </p>
    </form>
  );
}
