/*
 * Video-call links, as in the app (src/core/conference.ts and the video-call
 * helpers of src/screens/meetings/meetingForm.ts). Nothing here makes up a link:
 * a meeting saved with a provider and no link gets a real one from that
 * provider.
 *
 * - Google Meet: Google Calendar creates it when the meeting syncs there.
 * - Microsoft Teams: Outlook creates it when a one-off meeting is first synced.
 * - Zoom: the app's server function creates it right after saving, when the
 *   Zoom integration is set up (store.ts asks the server).
 * - Online meeting: only a pasted link.
 */

import type { ConferenceProvider, Meeting, MeetingSource } from "./types";

/** What the web knows about the connections that create links. */
export type LinkState = {
  /** Google Calendar sync is on in the app. */
  google: boolean;
  /** Meetings already sync with Outlook (its connection stays on the phone). */
  outlook: boolean;
  /** The server's Zoom integration: null while unknown, or when this account can't use it. */
  zoom: boolean | null;
};

export type ConferenceMode = "none" | "paste" | "auto_google" | "auto_outlook" | "auto_zoom";
export type AutoState = "ready" | "needs_connection" | "not_configured" | null;

/** Which meeting it is: the syncs never create links for some meetings. */
export type LinkTarget = { source: MeetingSource; recurring: boolean; outlookEventId?: string | null };

function providerMode(provider: "none" | ConferenceProvider, s: LinkState): { mode: ConferenceMode; state: AutoState } {
  switch (provider) {
    case "none":
      return { mode: "none", state: null };
    case "other":
      return { mode: "paste", state: null };
    case "zoom":
      return s.zoom === null ? { mode: "paste", state: null } : { mode: "auto_zoom", state: s.zoom ? "ready" : "not_configured" };
    case "google_meet":
      return { mode: "auto_google", state: s.google ? "ready" : "needs_connection" };
    case "teams":
      // the web can't see whether the app offers Outlook, so Teams promises a link only once Outlook is in use
      return s.outlook ? { mode: "auto_outlook", state: "ready" } : { mode: "paste", state: null };
  }
}

/** How an empty link behaves for this provider and meeting. */
export function conferenceMode(provider: "none" | ConferenceProvider, s: LinkState, target: LinkTarget) {
  const result = providerMode(provider, s);
  // Google never receives phone-calendar or Outlook meetings; Outlook never receives imported or repeating ones
  if (result.mode === "auto_google" && (target.source === "device" || target.source === "outlook")) return { mode: "paste" as const, state: null };
  if (result.mode === "auto_outlook" && (target.source === "google" || target.source === "device" || target.recurring)) return { mode: "paste" as const, state: null };
  // Outlook only adds a Teams link when the event is first created
  if (result.mode === "auto_outlook" && target.outlookEventId) return { mode: "paste" as const, state: null };
  return result;
}

export type FormHint = "pasteLinkHint" | "meetWillBeCreated" | "meetNeedsCalendar" | "teamsWillBeCreated" | "zoomWillBeCreated";

/** The line under the video-call choices; null when nothing is chosen or a link is typed. */
export function formHint(provider: "none" | ConferenceProvider, url: string, s: LinkState, target: LinkTarget): FormHint | null {
  if (provider === "none" || url.trim()) return null;
  const { mode, state } = conferenceMode(provider, s, target);
  if (mode === "auto_google") return state === "ready" ? "meetWillBeCreated" : "meetNeedsCalendar";
  if (mode === "auto_outlook") return "teamsWillBeCreated";
  if (mode === "auto_zoom") return state === "ready" ? "zoomWillBeCreated" : "pasteLinkHint";
  return mode === "paste" ? "pasteLinkHint" : null;
}

/** The muted "why" under the hint when the server said Zoom isn't set up. */
export const zoomNotConfigured = (provider: "none" | ConferenceProvider, url: string, s: LinkState) => provider === "zoom" && !url.trim() && s.zoom === false;

/** "Existing link (optional)" while a real link will be created, "Meeting link" otherwise. */
export function linkLabel(provider: "none" | ConferenceProvider, s: LinkState, target: LinkTarget): "link" | "linkOptional" {
  const { mode, state } = conferenceMode(provider, s, target);
  if (mode === "auto_zoom") return state === "ready" ? "linkOptional" : "link";
  return mode === "auto_google" || mode === "auto_outlook" ? "linkOptional" : "link";
}

/** The passcode only makes sense next to a link (or while one is stored, so it can be cleared). */
export const showPasscode = (provider: "none" | ConferenceProvider, url: string, passcode: string) => provider !== "none" && (!!url.trim() || !!passcode.trim());

export type CardInfo = "meetPending" | "meetNeedsCalendar" | "teamsPending" | "teamsLinkTooLate" | "zoomPending" | "noLink";

/** What the details say about a meeting with a video call but no link yet. */
export function cardInfo(m: Pick<Meeting, "conference" | "source" | "recurrence" | "external">, s: LinkState): CardInfo {
  if (!m.conference) return "noLink";
  const target = { source: m.source, recurring: m.recurrence !== null };
  if (m.conference.provider === "teams" && s.outlook && m.external.outlookEventId && !target.recurring && m.source !== "google" && m.source !== "device") return "teamsLinkTooLate";
  const { mode, state } = conferenceMode(m.conference.provider, s, target);
  if (mode === "auto_google") return state === "ready" ? "meetPending" : "meetNeedsCalendar";
  if (mode === "auto_outlook") return "teamsPending";
  if (mode === "auto_zoom" && state === "ready") return "zoomPending";
  return "noLink";
}
