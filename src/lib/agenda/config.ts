/*
 * The Firebase web app's public settings, set when the site is built (see
 * .env.example). They identify the project; access is enforced by sign-in and
 * the server rules. Without them, /app runs as a preview with sample data kept
 * in this browser.
 */

export const FIREBASE_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
};

/** True when this build is connected to the app's records. */
export const LIVE = !!(FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.authDomain && FIREBASE_CONFIG.projectId && FIREBASE_CONFIG.appId);

export const FUNCTIONS_REGION = process.env.NEXT_PUBLIC_FUNCTIONS_REGION || "us-central1";

/** Sign in with Apple needs a Services ID in Firebase before it works on the web, so it is switched on separately. */
export const APPLE_SIGN_IN = process.env.NEXT_PUBLIC_APPLE_SIGN_IN === "1";

/** For testing against the local Firebase emulators. */
export const EMULATOR_HOST = process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_HOST ?? "";
