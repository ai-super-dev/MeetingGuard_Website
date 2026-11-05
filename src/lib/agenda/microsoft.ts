/*
 * Continue with Microsoft, the Microsoft half (the app's ARCHITECTURE section 31).
 *
 * Firebase can't sign in with a Microsoft token by itself, so, like the app, the
 * website runs Microsoft's own sign-in (authorization code with PKCE, identity
 * scopes only), trades the code for the id_token, and hands that token and its
 * nonce to the app's server function `microsoftSignIn` (see firebase.ts), which
 * answers with a Firebase sign-in token for the same account as in the app.
 *
 * The Microsoft window comes back to /auth/microsoft/ on this site (a static
 * page in public/), which passes the answer here over a BroadcastChannel and
 * closes. A channel, not window.opener: Microsoft is preparing a
 * Cross-Origin-Opener-Policy (report-only today) that cuts that link.
 *
 * The Azure registration lists each site address as a "Single-page
 * application" redirect, which also lets the browser call the token endpoint.
 * Nothing is stored: the tokens live only for this sign-in.
 */

import { MSAL_CLIENT_ID, MSAL_TENANT } from "./config";

/** The callback page; with each site address it must be a redirect URI on the Azure registration. */
export const MICROSOFT_CALLBACK_PATH = "/auth/microsoft/";
/** Shared with public/auth/microsoft/index.html. */
const CHANNEL = "mg-microsoft-sign-in";
const SCOPES = "openid profile email";
const TOKEN_TIMEOUT_MS = 30_000;

export type MicrosoftFailure = "cancelled" | "popupBlocked" | "network" | "failed";

/** A Microsoft sign-in that didn't give an id_token. */
export class MicrosoftError extends Error {
  constructor(public reason: MicrosoftFailure) {
    super(reason);
  }
}

/** What the server needs, plus the name and email for the "set up the app first" window. */
export type MicrosoftIdentity = { idToken: string; nonce: string; name: string; email: string };

function base64url(bytes: Uint8Array) {
  let text = "";
  for (const b of bytes) text += String.fromCharCode(b);
  return btoa(text).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

const randomText = (bytes: number) => base64url(crypto.getRandomValues(new Uint8Array(bytes)));

async function challengeOf(verifier: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  return base64url(new Uint8Array(digest));
}

/** The name and email in the id_token, only to show them (the server checks the token). */
function claimsOf(idToken: string): { name: string; email: string } {
  try {
    const part = idToken.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const bytes = Uint8Array.from(atob(part.padEnd(part.length + ((4 - (part.length % 4)) % 4), "=")), (c) => c.charCodeAt(0));
    const c = JSON.parse(new TextDecoder().decode(bytes)) as Record<string, unknown>;
    const email = typeof c.email === "string" ? c.email : typeof c.preferred_username === "string" && c.preferred_username.includes("@") ? c.preferred_username : "";
    return { name: typeof c.name === "string" ? c.name : email.split("@")[0], email };
  } catch {
    return { name: "", email: "" };
  }
}

/** A window in the middle of the current one, the size of Microsoft's sign-in. */
function openWindow() {
  const w = 500;
  const h = 640;
  const left = Math.max(0, window.screenX + (window.outerWidth - w) / 2);
  const top = Math.max(0, window.screenY + (window.outerHeight - h) / 2);
  return window.open("about:blank", "mg-microsoft", `popup=yes,width=${w},height=${h},left=${left},top=${top}`);
}

type CallbackMessage = { state?: string; code?: string; error?: string };

/** The authorization code from the callback page, or why there is none. */
function waitForCode(popup: Window, state: string) {
  return new Promise<string>((resolve, reject) => {
    const channel = new BroadcastChannel(CHANNEL);
    let closedSince = 0;
    const finish = () => {
      channel.close();
      clearInterval(watch);
    };
    channel.onmessage = (e: MessageEvent<CallbackMessage>) => {
      if (e.data?.state !== state) return;
      finish();
      try {
        popup.close();
      } catch {}
      if (e.data.code) resolve(e.data.code);
      // access_denied: the person said no on Microsoft's screen
      else reject(new MicrosoftError(e.data.error === "access_denied" ? "cancelled" : "failed"));
    };
    // a closed window is a cancel; a short grace lets a last message from the callback arrive first
    const watch = setInterval(() => {
      if (!popup.closed) return void (closedSince = 0);
      closedSince ||= Date.now();
      if (Date.now() - closedSince < 1500) return;
      finish();
      reject(new MicrosoftError("cancelled"));
    }, 300);
  });
}

async function exchange(code: string, verifier: string, redirectUri: string) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TOKEN_TIMEOUT_MS);
  let response: Response;
  try {
    response = await fetch(`https://login.microsoftonline.com/${MSAL_TENANT}/oauth2/v2.0/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
      body: new URLSearchParams({ client_id: MSAL_CLIENT_ID, scope: SCOPES, grant_type: "authorization_code", code, code_verifier: verifier, redirect_uri: redirectUri }).toString(),
      signal: controller.signal,
    });
  } catch {
    throw new MicrosoftError("network");
  } finally {
    clearTimeout(timer);
  }
  const body = (await response.json().catch(() => ({}))) as { id_token?: unknown };
  if (!response.ok || typeof body.id_token !== "string" || !body.id_token) throw new MicrosoftError("failed");
  return body.id_token;
}

/**
 * Opens Microsoft's sign-in and answers with the id_token. Call it straight from
 * the click: the window opens before anything is awaited, or the browser blocks it.
 */
export async function requestMicrosoftIdToken(): Promise<MicrosoftIdentity> {
  const popup = openWindow();
  if (!popup) throw new MicrosoftError("popupBlocked");
  try {
    const redirectUri = `${location.origin}${MICROSOFT_CALLBACK_PATH}`;
    const verifier = randomText(48);
    const state = randomText(16);
    // the server checks the token's nonce against this one (16 to 128 characters)
    const nonce = randomText(24);
    const query = new URLSearchParams({
      client_id: MSAL_CLIENT_ID,
      response_type: "code",
      response_mode: "query",
      redirect_uri: redirectUri,
      scope: SCOPES,
      state,
      nonce,
      code_challenge: await challengeOf(verifier),
      code_challenge_method: "S256",
      prompt: "select_account",
    });
    popup.location.href = `https://login.microsoftonline.com/${MSAL_TENANT}/oauth2/v2.0/authorize?${query}`;
    const code = await waitForCode(popup, state);
    const idToken = await exchange(code, verifier, redirectUri);
    return { idToken, nonce, ...claimsOf(idToken) };
  } catch (err) {
    try {
      popup.close();
    } catch {}
    throw err instanceof MicrosoftError ? err : new MicrosoftError("failed");
  }
}
