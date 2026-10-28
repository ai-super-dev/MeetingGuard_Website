/*
 * Quick capture: a task typed in one line, like "Send the deck to Ana
 * tomorrow at 5 pm" or "Llamar a Carlos el viernes a las 10". The day and
 * time words are taken out and the rest is the title. Plain rules, no AI
 * (the web agenda has no voice or AI features); the result is shown on a
 * card to check before it is saved.
 */

import type { Lang } from "@/lib/routes";
import { addDays, weekday } from "./time";

export type Captured = { title: string; dueDate: string; dueTime: string };

const WEEKDAYS: Record<Lang, string[]> = {
  en: ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
  es: ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"],
};

const plain = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function to24(hour: number, minute: number, meridiem: string) {
  let h = hour;
  const m = meridiem.replace(/\./g, "");
  if (m === "pm" && h < 12) h += 12;
  if (m === "am" && h === 12) h = 0;
  if (h > 23 || minute > 59) return "";
  return `${String(h).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function capture(text: string, lang: Lang, today: string): Captured {
  let rest = ` ${text.trim()} `;
  let dueDate = "";
  let dueTime = "";
  const take = (re: RegExp, fn: (m: RegExpMatchArray) => void) => {
    const m = plain(rest).match(re);
    if (!m || m.index === undefined) return;
    fn(m);
    rest = `${rest.slice(0, m.index)} ${rest.slice(m.index + m[0].length)}`;
  };

  // time: "at 5 pm", "5pm", "17:00", "a las 10", "a las 17:30"
  take(/\s(?:at|a las|a la)?\s*(\d{1,2})(?::(\d{2}))?\s*(a\.?m\.?|p\.?m\.?)(?=\s)/, (m) => {
    dueTime = to24(Number(m[1]), Number(m[2] ?? 0), m[3]);
  });
  if (!dueTime)
    take(/\s(?:at|a las|a la)\s+(\d{1,2})(?::(\d{2}))?(?=\s)|\s(\d{1,2}):(\d{2})(?=\s)/, (m) => {
      dueTime = to24(Number(m[1] ?? m[3]), Number(m[2] ?? m[4] ?? 0), "");
    });
  if (!dueTime) take(/\s(?:at noon|a mediodia|al mediodia)(?=\s)/, () => (dueTime = "12:00"));

  // day
  if (lang === "es") {
    take(/\spasado manana(?=\s)/, () => (dueDate = addDays(today, 2)));
    // "mañana" is tomorrow unless it is "por la mañana" (in the morning)
    take(/\s(?<!la\s)manana(?=\s)/, () => (dueDate = addDays(today, 1)));
    take(/\shoy(?=\s)/, () => (dueDate = today));
    take(/\sen (\d{1,2}) dias(?=\s)/, (m) => (dueDate = addDays(today, Number(m[1]))));
    take(/\s(?:el|este|el proximo|el siguiente)?\s*(domingo|lunes|martes|miercoles|jueves|viernes|sabado)(?=\s)/, (m) => {
      const target = WEEKDAYS.es.indexOf(m[1]);
      dueDate = addDays(today, ((target - weekday(today) + 7) % 7) || 7);
    });
    take(/\spor la (manana|tarde|noche)(?=\s)/, (m) => {
      if (!dueTime) dueTime = { manana: "09:00", tarde: "16:00", noche: "20:00" }[m[1]] ?? "";
    });
  } else {
    take(/\s(?:on\s)?today(?=\s)/, () => (dueDate = today));
    take(/\stonight(?=\s)/, () => {
      dueDate = today;
      if (!dueTime) dueTime = "20:00";
    });
    take(/\s(?:on\s)?tomorrow(?=\s)/, () => (dueDate = addDays(today, 1)));
    take(/\sin (\d{1,2}) days?(?=\s)/, (m) => (dueDate = addDays(today, Number(m[1]))));
    take(/\s(?:on\s|next\s|this\s)?(sunday|monday|tuesday|wednesday|thursday|friday|saturday)(?=\s)/, (m) => {
      const target = WEEKDAYS.en.indexOf(m[1]);
      dueDate = addDays(today, ((target - weekday(today) + 7) % 7) || 7);
    });
    take(/\sin the (morning|afternoon|evening)(?=\s)/, (m) => {
      if (!dueTime) dueTime = { morning: "09:00", afternoon: "16:00", evening: "20:00" }[m[1]] ?? "";
    });
  }
  // a time with no day means today (the card shows it, so the user can change it)
  if (dueTime && !dueDate) dueDate = today;

  const title = rest
    .replace(/\s+/g, " ")
    .replace(/\s(?:at|on|by|el|a las|para)\s*$/i, "")
    .trim();
  return { title: title.charAt(0).toUpperCase() + title.slice(1), dueDate, dueTime };
}
