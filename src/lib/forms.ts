"use client";

import { siteConfig } from "./site";

export type FormKind = "waitlist" | "updates";
export type SubmitResult = "ok" | "error" | "offline";

/** Name of the hidden field bots fill in and people never see. */
export const HONEYPOT = "website";

/**
 * Posts one of the site's forms to the Cloud Function, which writes it to
 * Firestore and emails support@. Returns "offline" while the endpoint is not
 * configured, so the form can say so instead of pretending it was sent.
 */
export async function submitForm(kind: FormKind, form: HTMLFormElement, lang: string): Promise<SubmitResult> {
  const data = Object.fromEntries(new FormData(form).entries());
  // a filled honeypot is a bot: act as if it worked and send nothing
  if (data[HONEYPOT]) return "ok";
  delete data[HONEYPOT];
  if (!siteConfig.formsEndpoint) return "offline";
  try {
    const res = await fetch(siteConfig.formsEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, lang, page: location.pathname, ...data }),
    });
    return res.ok ? "ok" : "error";
  } catch {
    return "error";
  }
}
