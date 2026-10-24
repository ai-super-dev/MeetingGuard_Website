"use client";

import { AlarmClock, CircleCheck, Clock, MapPin, Video } from "lucide-react";
import { useT } from "@/lib/language";
import { StatusBar } from "./Device";
import { SCREEN_H, SCREEN_W } from "./geometry";

/* Colours sampled from the app's real full-screen alarm (store screenshot). */
const WINE = {
  bg: "#3d0a12",
  badge: "#e5484d",
  ring: "#ff8a8f",
  soft: "#edc0c4",
  amber: "#ffd9a0",
  meta: "#f5d0d3",
  light: "#ececec",
  wine: "#841b29",
  green: "#177245",
  track: "#643b41",
};

/* The same alarm on the app's dark theme (navy, as on its other dark screens). */
const DARK = {
  ...WINE,
  bg: "#0e1524",
  ring: "#f47d84",
  soft: "#aeb6c8",
  meta: "#d7dcea",
  track: "#263048",
};

type MeetingAlarmScreenProps = {
  time?: string;
  title?: string;
  when?: string;
  where?: string;
  height?: number;
  /** "wine" matches the store screenshot; "dark" uses the app's navy dark theme. */
  theme?: "wine" | "dark";
};

/**
 * The app's real full-screen meeting alarm, rebuilt at SCREEN_W CSS px wide:
 * alarm badge, "Starts in 15 minutes", I'm on it / Join now, snoozes,
 * meeting details and the auto-snooze countdown.
 */
export function MeetingAlarmScreen({
  time = "9:45",
  title: titleProp,
  when: whenProp,
  where = "Zoom",
  height = SCREEN_H,
  theme = "wine",
}: MeetingAlarmScreenProps) {
  const t = useT();
  const title = titleProp ?? t.alarm.title;
  const when = whenProp ?? t.alarm.when;
  const C = theme === "dark" ? DARK : WINE;
  return (
    <div
      className="relative flex flex-col overflow-hidden rounded-[48px] text-center text-white"
      style={{ width: SCREEN_W, height, background: C.bg }}
    >
      <StatusBar time={time} className="relative px-[34px] pt-[20px]" />

      <div className="flex flex-1 flex-col items-center justify-center px-[18px] pb-[20px]">
        {/* alarm badge */}
        <span
          className="grid h-[90px] w-[90px] place-items-center rounded-full"
          style={{ background: C.badge, boxShadow: `0 0 0 3px ${C.ring}` }}
        >
          <AlarmClock className="h-[50px] w-[50px] text-white" strokeWidth={2.2} aria-hidden />
        </span>

        <p className="mt-[24px] text-[14px]" style={{ color: C.soft }}>
          {t.alarm.aboutToStart}
        </p>
        <p className="mt-[8px] leading-tight font-bold" style={{ fontSize: title.length > 16 ? 27 : 32 }}>
          {title}
        </p>
        <p className="mt-[10px] text-[16px] font-semibold" style={{ color: C.amber }}>
          {t.alarm.startsIn}
        </p>
        <p className="mt-[18px] flex items-center gap-[8px] text-[15px]" style={{ color: C.meta }}>
          <Clock className="h-[16px] w-[16px]" aria-hidden />
          {when}
        </p>
        <p className="mt-[12px] flex items-center gap-[8px] text-[15px]" style={{ color: C.meta }}>
          <MapPin className="h-[16px] w-[16px]" aria-hidden />
          {where}
        </p>

        <div className="mt-[28px] w-full space-y-[12px] text-[15px] font-medium">
          <div
            className="flex h-[46px] items-center justify-center gap-[8px] rounded-[12px]"
            style={{ background: C.light, color: C.wine }}
          >
            <CircleCheck className="h-[18px] w-[18px] fill-current text-[#841b29] [&>path]:stroke-[#ececec]" aria-hidden />
            {t.alarm.onIt}
          </div>
          <div
            className="flex h-[46px] items-center justify-center gap-[8px] rounded-[12px] text-white"
            style={{ background: C.green }}
          >
            <Video className="h-[18px] w-[18px] fill-current" aria-hidden />
            {t.alarm.joinNow}
          </div>
          <div className="grid grid-cols-2 gap-[12px]">
            {[t.alarm.snooze5, t.alarm.snooze10].map((s) => (
              <div
                key={s}
                className="flex h-[46px] items-center justify-center gap-[6px] rounded-[12px] border"
                style={{ borderColor: C.ring, color: C.soft }}
              >
                <AlarmClock className="h-[15px] w-[15px]" aria-hidden />
                {s}
              </div>
            ))}
          </div>
        </div>

        <p className="mt-[20px] text-[14px] underline underline-offset-[3px]" style={{ color: C.soft }}>
          {t.alarm.details}
        </p>
      </div>

      {/* auto-snooze countdown */}
      <div className="px-[18px] pb-[34px]">
        <div className="h-[6px] w-full overflow-hidden rounded-full" style={{ background: C.track }}>
          <div className="h-full w-[90%] rounded-full" style={{ background: C.amber }} />
        </div>
        <p className="mt-[8px] text-[12px]" style={{ color: C.soft }}>
          {t.alarm.autoSnooze}
        </p>
      </div>
    </div>
  );
}
