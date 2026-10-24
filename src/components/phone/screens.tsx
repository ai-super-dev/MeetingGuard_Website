"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { useT } from "@/lib/language";
import { people } from "@/lib/people";
import {
  ArrowLeft,
  Bot,
  Check,
  Clock,
  EllipsisVertical,
  GitBranch,
  MapPin,
  Menu,
  Plus,
  Search,
  Sun,
  Timer,
  Video,
} from "lucide-react";
import { Screen } from "./Device";

/*
 * Real MeetingGuard app pages (from the store screenshots), rebuilt at
 * SCREEN_W CSS px wide in the app's dark theme.
 */

/** The app's dark theme (as on its WhatsApp-linking screen). */
const APP = {
  bg: "#0e1524",
  card: "#131b2c",
  line: "#263048",
  chip: "#1f2a40",
  accent: "#b3b7ff",
  ink: "#1b1f4d",
  muted: "#9aa3b8",
  text: "#e6e9f2",
};

type ScreenProps = { height?: number };

function AppHeader({ title }: { title: string }) {
  const t = useT();
  return (
    <div className="mt-[14px] flex items-center gap-[12px] border-b px-[16px] pb-[12px]" style={{ borderColor: APP.line }}>
      <ArrowLeft className="h-[22px] w-[22px]" style={{ color: APP.text }} aria-hidden />
      <span className="flex-1 text-[20px] font-medium" style={{ color: APP.text }}>
        {title}
      </span>
      <span className="grid h-[34px] w-[34px] place-items-center rounded-full text-[11px] font-semibold" style={{ background: APP.chip }}>
        {t.lang.toUpperCase()}
      </span>
      <span className="grid h-[34px] w-[34px] place-items-center rounded-full" style={{ background: APP.chip }}>
        <Sun className="h-[17px] w-[17px]" aria-hidden />
      </span>
      <Menu className="h-[22px] w-[22px]" style={{ color: APP.text }} aria-hidden />
    </div>
  );
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-[16px] border ${className}`} style={{ background: APP.card, borderColor: APP.line }}>
      {children}
    </div>
  );
}

/* ---------- Plan: "All meetings" ---------- */

type Meeting = { time: string; title: string; place: string; video: boolean; source: string; bar: string; isNew?: boolean };

/** Look of each meeting, by day then position; the words come from the dictionary. */
const MEETING_LOOK: { video: boolean; bar: string; isNew?: boolean }[][] = [
  [{ video: false, bar: "#1fa37a" }],
  [
    { video: true, bar: "#8b8ff8", isNew: true },
    { video: true, bar: "#8b8ff8" },
  ],
];

function MeetingCard({ m }: { m: Meeting }) {
  const t = useT();
  return (
    <div
      className="relative flex gap-[12px] rounded-[14px] border py-[12px] pr-[10px] pl-[12px]"
      style={{
        background: APP.card,
        borderColor: m.isNew ? APP.accent : APP.line,
        boxShadow: m.isNew ? `0 0 0 1px ${APP.accent}, 0 0 22px rgba(179,183,255,0.35)` : undefined,
      }}
    >
      <span className="w-[4px] shrink-0 rounded-full" style={{ background: m.bar }} />
      <div className="min-w-0 flex-1 text-left">
        <p className="text-[14px]" style={{ color: APP.muted }}>
          {m.time}
        </p>
        <p className="mt-[2px] text-[17px] font-medium" style={{ color: APP.text }}>
          {m.title}
        </p>
        <p className="mt-[4px] flex items-center gap-[6px] text-[13px]" style={{ color: APP.muted }}>
          {m.video ? <Video className="h-[14px] w-[14px]" aria-hidden /> : <MapPin className="h-[14px] w-[14px]" aria-hidden />}
          {m.place}
        </p>
        <p className="mt-[4px] text-[12px]" style={{ color: APP.muted }}>
          {m.source}
        </p>
      </div>
      <EllipsisVertical className="mt-[22px] h-[20px] w-[20px] shrink-0" style={{ color: APP.muted }} aria-hidden />
      {m.isNew && (
        <span
          className="absolute top-[10px] right-[34px] rounded-full px-[8px] py-[2px] text-[11px] font-semibold"
          style={{ background: APP.accent, color: APP.ink }}
        >
          {t.app.isNew}
        </span>
      )}
    </div>
  );
}

export function PlanScreen({ height }: ScreenProps) {
  const a = useT().app;
  return (
    <Screen className="bg-[#0e1524]" time="16:12" height={height}>
      <AppHeader title={a.allMeetings} />
      <div className="px-[14px] pt-[12px]">
        <div className="flex h-[48px] items-center gap-[12px] rounded-[16px] px-[16px] text-[16px]" style={{ background: APP.chip, color: APP.muted }}>
          <Search className="h-[20px] w-[20px]" aria-hidden />
          {a.search}
        </div>

        {/* Upcoming / Past / All */}
        <div className="mt-[12px] grid grid-cols-3 overflow-hidden rounded-full border text-[14px]" style={{ borderColor: APP.line, color: APP.text }}>
          {a.tabs.map((tab, i) => (
            <span
              key={i}
              className={`py-[7px] text-center ${i ? "border-l" : ""}`}
              style={{ borderColor: APP.line, background: i === 0 ? APP.chip : undefined, fontWeight: i === 0 ? 600 : 400 }}
            >
              {tab}
            </span>
          ))}
        </div>

        {/* source filters */}
        <div className="mt-[10px] flex gap-[8px] overflow-hidden text-[13px] whitespace-nowrap" style={{ color: APP.text }}>
          <span className="flex items-center gap-[6px] rounded-[8px] px-[10px] py-[6px]" style={{ background: APP.chip }}>
            <Check className="h-[14px] w-[14px]" aria-hidden /> {a.allSources}
          </span>
          {["MeetingGuard", "Google Calendar", "Outlook"].map((s) => (
            <span key={s} className="rounded-[8px] border px-[10px] py-[5px]" style={{ borderColor: APP.line }}>
              {s}
            </span>
          ))}
        </div>

        <p className="mt-[10px] text-[12px]" style={{ color: APP.muted }}>
          {a.total}
        </p>

        {a.days.map((d, di) => (
          <div key={di} className="mt-[12px]">
            <div className="flex justify-between text-[13px]" style={{ color: APP.muted }}>
              <span>{d.label}</span>
              <span>{a.meetingCount(d.meetings.length)}</span>
            </div>
            <div className="mt-[8px] space-y-[10px]">
              {d.meetings.map((m, mi) => (
                <MeetingCard key={mi} m={{ ...m, ...MEETING_LOOK[di][mi] }} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <span
        className="absolute right-[14px] bottom-[34px] flex h-[50px] items-center gap-[8px] rounded-[16px] px-[18px] text-[15px] font-semibold shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
        style={{ background: APP.accent, color: APP.ink }}
      >
        <Plus className="h-[18px] w-[18px]" strokeWidth={2.5} aria-hidden />
        {a.newMeeting}
      </span>
    </Screen>
  );
}

/* ---------- Join: "Meeting details" ---------- */

function Label({ children }: { children: ReactNode }) {
  return (
    <p className="mt-[16px] mb-[8px] text-[14px]" style={{ color: APP.muted }}>
      {children}
    </p>
  );
}

export function JoinScreen({ height }: ScreenProps) {
  const t = useT();
  const a = t.app;
  return (
    <Screen className="bg-[#0e1524]" time="10:00" height={height}>
      <AppHeader title={a.details} />
      <div className="px-[14px] pt-[14px]" style={{ color: APP.text }}>
        <p className="text-[24px] font-bold">{t.alarm.title}</p>
        <div className="mt-[8px] flex flex-wrap gap-[8px] text-[13px]">
          <span className="flex items-center gap-[6px] rounded-[8px] border px-[9px] py-[5px]" style={{ borderColor: APP.line }}>
            <GitBranch className="h-[14px] w-[14px]" style={{ color: APP.accent }} aria-hidden />
            {a.createdAi}
          </span>
          <span className="flex items-center gap-[6px] rounded-[8px] border px-[9px] py-[5px]" style={{ borderColor: APP.line }}>
            <Bot className="h-[14px] w-[14px]" style={{ color: APP.accent }} aria-hidden />
            {a.confidence}
          </span>
        </div>

        <Card className="mt-[14px]">
          <div className="flex gap-[12px] border-b px-[14px] py-[11px]" style={{ borderColor: APP.line }}>
            <Clock className="mt-[2px] h-[20px] w-[20px]" style={{ color: APP.muted }} aria-hidden />
            <div>
              <p className="text-[12px]" style={{ color: APP.muted }}>
                {a.when}
              </p>
              <p className="text-[16px]">{a.whenValue}</p>
            </div>
          </div>
          <div className="flex gap-[12px] px-[14px] py-[11px]">
            <Timer className="mt-[2px] h-[20px] w-[20px]" style={{ color: APP.muted }} aria-hidden />
            <div>
              <p className="text-[12px]" style={{ color: APP.muted }}>
                {a.duration}
              </p>
              <p className="text-[16px]">45 min</p>
            </div>
          </div>
        </Card>

        <Label>{a.videoCall}</Label>
        <Card className="px-[14px] py-[12px]">
          <p className="text-[17px]">Zoom</p>
          <p className="mt-[2px] text-[12px] leading-snug break-all" style={{ color: APP.muted }}>
            https://us05web.zoom.us/j/84629371054?pwd=m2TECKqlcEgXMpaaCASMDSwQWLG02r.1
          </p>
          <span
            className="mt-[10px] inline-flex h-[44px] items-center gap-[8px] rounded-full px-[20px] text-[15px] font-semibold"
            style={{ background: APP.accent, color: APP.ink }}
          >
            <Video className="h-[18px] w-[18px] fill-current" aria-hidden />
            {t.alarm.joinNow}
          </span>
          <p className="mt-[8px] text-[14px]">{a.passcode}: PG9j5u</p>
        </Card>

        <Label>{a.participants}</Label>
        <Card className="flex items-center gap-[12px] px-[14px] py-[10px]">
          <Image src={people.woman} alt="" width={36} height={36} className="h-[36px] w-[36px] rounded-full object-cover" />
          <span className="leading-tight">
            <span className="block text-[15px]">Ana García</span>
            <span className="block text-[13px]" style={{ color: APP.muted }}>
              ana.garcia@northwind.co
            </span>
          </span>
        </Card>

        <Label>{a.alerts}</Label>
        <Card className="px-[14px] py-[10px] text-[14px] leading-relaxed">
          <p>{a.reminders}</p>
          <p>{a.intensity}</p>
        </Card>
      </div>
    </Screen>
  );
}
