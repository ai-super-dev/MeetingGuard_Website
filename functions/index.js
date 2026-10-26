/*
 * Website forms endpoint (waitlist, contact, send-link, updates).
 *
 * One HTTPS function, as the brief asks: it validates the submission, drops
 * bots (honeypot), rate-limits by IP, writes to Firestore and emails support@.
 * Email goes out through the "Trigger Email from Firestore" extension: this
 * function writes a document to the `mail` collection and the extension sends
 * it. No third-party form service.
 *
 * Deploy (Dusko): `cd functions && npm install && firebase deploy --only functions:websiteForms`
 * then put the function URL in src/lib/site.ts (formsEndpoint).
 *
 * Not run in this repository; review before deploying.
 */
const { onRequest } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

initializeApp();
const db = getFirestore();

const SUPPORT = "support@meetingguard.ai";
const ALLOWED_ORIGINS = ["https://meetingguard.ai", "https://www.meetingguard.ai"];
const KINDS = new Set(["waitlist", "contact", "send-link", "updates"]);
const MAX_PER_HOUR = 10;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const clean = (v, max = 2000) => (typeof v === "string" ? v.trim().slice(0, max) : "");

exports.websiteForms = onRequest({ region: "europe-west1", cors: ALLOWED_ORIGINS }, async (req, res) => {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  const body = req.body || {};
  // honeypot: the site never sends this field, bots fill it in
  if (body.website) return res.status(200).json({ ok: true });

  const kind = clean(body.kind, 20);
  const email = clean(body.email, 200).toLowerCase();
  const lang = body.lang === "es" ? "es" : "en";
  if (!KINDS.has(kind) || !EMAIL.test(email)) return res.status(400).json({ ok: false });
  if (kind === "contact" && (!clean(body.name) || !clean(body.message))) return res.status(400).json({ ok: false });

  // rate limit: MAX_PER_HOUR submissions per IP per hour
  const ip = (req.headers["x-forwarded-for"] || req.ip || "unknown").toString().split(",")[0].trim();
  const bucket = db.collection("websiteFormLimits").doc(`${ip.replace(/[^\w.:-]/g, "_")}_${new Date().toISOString().slice(0, 13)}`);
  const allowed = await db.runTransaction(async (tx) => {
    const snap = await tx.get(bucket);
    const count = snap.exists ? snap.get("count") : 0;
    if (count >= MAX_PER_HOUR) return false;
    tx.set(bucket, { count: count + 1, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    return true;
  });
  if (!allowed) return res.status(429).json({ ok: false });

  const entry = {
    kind,
    email,
    lang,
    name: clean(body.name, 200),
    topic: clean(body.topic, 40),
    message: clean(body.message, 5000),
    language: clean(body.language, 5),
    page: clean(body.page, 200),
    createdAt: FieldValue.serverTimestamp(),
  };
  await db.collection("websiteForms").add(entry);

  const subject = {
    waitlist: `Assistant waitlist: ${email}`,
    contact: `Website contact (${entry.topic || "question"}): ${entry.name}`,
    "send-link": `Download link requested: ${email}`,
    updates: `Update subscription: ${email}`,
  }[kind];
  const text = Object.entries(entry)
    .filter(([k, v]) => k !== "createdAt" && v)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
  await db.collection("mail").add({ to: SUPPORT, replyTo: email, message: { subject, text } });

  // TODO: for kind "send-link", also email the visitor the download link (https://meetingguard.ai/download)
  // once the sending address and template are agreed.

  return res.status(200).json({ ok: true });
});
