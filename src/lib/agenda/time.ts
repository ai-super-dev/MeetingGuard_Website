/*
 * Dates and time zones. Meetings are stored as UTC instants with the zone
 * they were planned in; the agenda shows them in the user's zone. Days are
 * handled as "YYYY-MM-DD" keys in that zone, so a day is always a day, also
 * across daylight-saving changes.
 */

import type { Lang } from "@/lib/routes";

export const MINUTE = 60_000;
export const DAY = 86_400_000;

export const LOCALE: Record<Lang, string> = { en: "en-US", es: "es-ES" };

/** This device's time zone. */
export function deviceZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
}

export function isValidZone(zone: string) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: zone }).format(0);
    return !!zone;
  } catch {
    return false;
  }
}

/** Every zone the browser knows, with a short list as fallback. */
export function allZones(): string[] {
  try {
    return (Intl as unknown as { supportedValuesOf(k: string): string[] }).supportedValuesOf("timeZone");
  } catch {
    return ["UTC", "Europe/London", "Europe/Madrid", "America/New_York", "America/Chicago", "America/Los_Angeles", "America/Mexico_City", "America/Bogota", "America/Argentina/Buenos_Aires", "Asia/Dubai", "Asia/Kolkata", "Asia/Singapore", "Australia/Sydney"];
  }
}

const partsCache = new Map<string, Intl.DateTimeFormat>();
function partsFormat(zone: string) {
  let f = partsCache.get(zone);
  if (!f) {
    f = new Intl.DateTimeFormat("en-US", { timeZone: zone, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" });
    partsCache.set(zone, f);
  }
  return f;
}

/** Wall-clock fields of an instant in a zone. */
export function zoned(date: Date, zone: string) {
  const p: Record<string, number> = {};
  for (const part of partsFormat(zone).formatToParts(date)) if (part.type !== "literal") p[part.type] = Number(part.value);
  return { y: p.year, m: p.month, d: p.day, h: p.hour % 24, min: p.minute, s: p.second };
}

const pad = (n: number) => String(n).padStart(2, "0");

/** "YYYY-MM-DD" of an instant in a zone. */
export function dayKey(date: Date, zone: string) {
  const z = zoned(date, zone);
  return `${z.y}-${pad(z.m)}-${pad(z.d)}`;
}

/** "HH:mm" of an instant in a zone. */
export function timeKey(date: Date, zone: string) {
  const z = zoned(date, zone);
  return `${pad(z.h)}:${pad(z.min)}`;
}

/** Minutes since midnight of an instant in a zone. */
export function minuteOfDay(date: Date, zone: string) {
  const z = zoned(date, zone);
  return z.h * 60 + z.min;
}

function offsetMinutes(utc: number, zone: string) {
  const whole = Math.floor(utc / 1000) * 1000;
  const z = zoned(new Date(whole), zone);
  return Math.round((Date.UTC(z.y, z.m - 1, z.d, z.h, z.min, z.s) - whole) / MINUTE);
}

/**
 * The instant of a wall-clock date and time in a zone ("2026-10-28", "10:00"),
 * worked out as in the app, so both get the same instant: a time skipped by a
 * clock change moves to just after it.
 */
export function fromZoned(day: string, time: string, zone: string): Date {
  const [y, m, d] = day.split("-").map(Number);
  const [h, min] = (time || "00:00").split(":").map(Number);
  const wall = Date.UTC(y, m - 1, d, h, min);
  const first = offsetMinutes(wall, zone);
  const utc1 = wall - first * MINUTE;
  const second = offsetMinutes(utc1, zone);
  if (first === second) return new Date(utc1);
  const utc2 = wall - second * MINUTE;
  if (offsetMinutes(utc2, zone) === second) return new Date(utc2);
  return new Date(Math.max(utc1, utc2));
}

/** Start of a day in a zone. */
export const dayStart = (day: string, zone: string) => fromZoned(day, "00:00", zone);

/** Day key arithmetic, independent of zones. */
export function addDays(day: string, n: number) {
  const [y, m, d] = day.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + n));
  return `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())}`;
}

export function addMonths(day: string, n: number) {
  const [y, m] = day.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1 + n, 1));
  return `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-01`;
}

/** 0 = Sunday ... 6 = Saturday. */
export function weekday(day: string) {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

/** Weeks start on Monday. */
export const weekStart = (day: string) => addDays(day, -((weekday(day) + 6) % 7));

export const monthStart = (day: string) => `${day.slice(0, 7)}-01`;

export function daysBetween(a: string, b: string) {
  const [y1, m1, d1] = a.split("-").map(Number);
  const [y2, m2, d2] = b.split("-").map(Number);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / DAY);
}

export function isDayKey(s: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = s.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d));
  return t.getUTCFullYear() === y && t.getUTCMonth() === m - 1 && t.getUTCDate() === d;
}
export const isTimeKey = (s: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(s);

/* ---------- Formatting ---------- */

const formatCache = new Map<string, Intl.DateTimeFormat>();
function format(lang: Lang, zone: string, opts: Intl.DateTimeFormatOptions) {
  const key = lang + zone + JSON.stringify(opts);
  let f = formatCache.get(key);
  if (!f) {
    f = new Intl.DateTimeFormat(LOCALE[lang], { timeZone: zone, ...opts });
    formatCache.set(key, f);
  }
  return f;
}

/** A day key shown as a date (formatted at noon UTC so no zone can shift it). */
function keyDate(day: string) {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12));
}

/** The account's time format (Preferences.use24HourClock): null follows the language. */
let clock24: boolean | null = null;
export const setClock = (use24: boolean | null) => {
  clock24 = use24;
};
const clock = (): Intl.DateTimeFormatOptions => (clock24 === null ? {} : { hourCycle: clock24 ? "h23" : "h12" });

export const fmtTime = (date: Date, lang: Lang, zone: string) => format(lang, zone, { hour: "numeric", minute: "2-digit", ...clock() }).format(date);

export const fmtDay = (day: string, lang: Lang, opts: Intl.DateTimeFormatOptions = { weekday: "long", month: "long", day: "numeric" }) =>
  format(lang, "UTC", opts).format(keyDate(day));

/** Hour labels of the time grid: "10 AM" / "10:00". */
export const fmtHour = (hour: number, lang: Lang) =>
  format(lang, "UTC", (clock24 ?? lang !== "en") ? { hour: "2-digit", minute: "2-digit", hourCycle: "h23" } : { hour: "numeric", hourCycle: "h12" }).format(new Date(Date.UTC(2026, 0, 1, hour)));

/** "Oct 26 - Nov 1, 2026". */
export const fmtDayRange = (first: string, last: string, lang: Lang) =>
  format(lang, "UTC", { month: "short", day: "numeric", year: "numeric" }).formatRange(keyDate(first), keyDate(last));

export const fmtMonth = (day: string, lang: Lang) => format(lang, "UTC", { month: "long", year: "numeric" }).format(keyDate(day));

/** "10:00 - 10:45 AM" style range. */
export const fmtRange = (start: Date, end: Date, lang: Lang, zone: string) =>
  format(lang, zone, { hour: "numeric", minute: "2-digit", ...clock() }).formatRange(start, end);

/** "45 min", "1 h 30 min". */
export function fmtDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return [h ? `${h} h` : "", m || !h ? `${m} min` : ""].filter(Boolean).join(" ");
}

/** "GMT+1" style label of a zone at an instant. */
export function zoneLabel(zone: string, date: Date, lang: Lang) {
  const part = format(lang, zone, { timeZoneName: "short" })
    .formatToParts(date)
    .find((p) => p.type === "timeZoneName");
  const city = zone.split("/").pop()?.replace(/_/g, " ") ?? zone;
  return `${city} (${part?.value ?? zone})`;
}

/** Short weekday names starting on Monday. */
export function weekdayNames(lang: Lang, width: "short" | "narrow" = "short") {
  return Array.from({ length: 7 }, (_, i) => fmtDay(addDays("2026-10-26", i), lang, { weekday: width }));
}
