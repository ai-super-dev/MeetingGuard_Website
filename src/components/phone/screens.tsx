import type { ReactNode } from "react";
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
  User,
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
  return (
    <div className="mt-[14px] flex items-center gap-[12px] border-b px-[16px] pb-[12px]" style={{ borderColor: APP.line }}>
      <ArrowLeft className="h-[22px] w-[22px]" style={{ color: APP.text }} aria-hidden />
      <span className="flex-1 text-[20px] font-medium" style={{ color: APP.text }}>
        {title}
      </span>
      <span className="grid h-[34px] w-[34px] place-items-center rounded-full text-[11px] font-semibold" style={{ background: APP.chip }}>
        EN
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

const DAYS: { label: string; meetings: Meeting[] }[] = [
  {
    label: "Tomorrow · October 27th, 2026",
    meetings: [
      { time: "12:00 PM - 1:00 PM", title: "Lunch with Ana", place: "Cafe Central", video: false, source: "Created with the AI assistant", bar: "#1fa37a" },
    ],
  },
  {
    label: "Wednesday · October 28th, 2026",
    meetings: [
      { time: "10:00 AM - 10:45 AM", title: "Investor call", place: "Zoom", video: true, source: "Created with the AI assistant", bar: "#8b8ff8", isNew: true },
      { time: "11:30 AM - 12:30 PM", title: "Design review with Marketing", place: "Zoom", video: true, source: "Created in MeetingGuard", bar: "#8b8ff8" },
    ],
  },
];

function MeetingCard({ m }: { m: Meeting }) {
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
          New
        </span>
      )}
    </div>
  );
}

export function PlanScreen({ height }: ScreenProps) {
  return (
    <Screen className="bg-[#0e1524]" time="16:12" height={height}>
      <AppHeader title="All meetings" />
      <div className="px-[14px] pt-[12px]">
        <div className="flex h-[48px] items-center gap-[12px] rounded-[16px] px-[16px] text-[16px]" style={{ background: APP.chip, color: APP.muted }}>
          <Search className="h-[20px] w-[20px]" aria-hidden />
          Search meetings
        </div>

        {/* Upcoming / Past / All */}
        <div className="mt-[12px] grid grid-cols-3 overflow-hidden rounded-full border text-[14px]" style={{ borderColor: APP.line, color: APP.text }}>
          {["Upcoming", "Past", "All"].map((t, i) => (
            <span
              key={t}
              className={`py-[7px] text-center ${i ? "border-l" : ""}`}
              style={{ borderColor: APP.line, background: i === 0 ? APP.chip : undefined, fontWeight: i === 0 ? 600 : 400 }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* source filters */}
        <div className="mt-[10px] flex gap-[8px] overflow-hidden text-[13px] whitespace-nowrap" style={{ color: APP.text }}>
          <span className="flex items-center gap-[6px] rounded-[8px] px-[10px] py-[6px]" style={{ background: APP.chip }}>
            <Check className="h-[14px] w-[14px]" aria-hidden /> All sources
          </span>
          {["MeetingGuard", "Google Calendar", "Outlook"].map((s) => (
            <span key={s} className="rounded-[8px] border px-[10px] py-[5px]" style={{ borderColor: APP.line }}>
              {s}
            </span>
          ))}
        </div>

        <p className="mt-[10px] text-[12px]" style={{ color: APP.muted }}>
          3 meetings
        </p>

        {DAYS.map((d) => (
          <div key={d.label} className="mt-[12px]">
            <div className="flex justify-between text-[13px]" style={{ color: APP.muted }}>
              <span>{d.label}</span>
              <span>
                {d.meetings.length} meeting{d.meetings.length > 1 ? "s" : ""}
              </span>
            </div>
            <div className="mt-[8px] space-y-[10px]">
              {d.meetings.map((m) => (
                <MeetingCard key={m.title} m={m} />
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
        New meeting
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
  return (
    <Screen className="bg-[#0e1524]" time="10:00" height={height}>
      <AppHeader title="Meeting details" />
      <div className="px-[14px] pt-[14px]" style={{ color: APP.text }}>
        <p className="text-[24px] font-bold">Investor call</p>
        <div className="mt-[8px] flex flex-wrap gap-[8px] text-[13px]">
          <span className="flex items-center gap-[6px] rounded-[8px] border px-[9px] py-[5px]" style={{ borderColor: APP.line }}>
            <GitBranch className="h-[14px] w-[14px]" style={{ color: APP.accent }} aria-hidden />
            Created with the AI assistant
          </span>
          <span className="flex items-center gap-[6px] rounded-[8px] border px-[9px] py-[5px]" style={{ borderColor: APP.line }}>
            <Bot className="h-[14px] w-[14px]" style={{ color: APP.accent }} aria-hidden />
            AI confidence 96%
          </span>
        </div>

        <Card className="mt-[14px]">
          <div className="flex gap-[12px] border-b px-[14px] py-[11px]" style={{ borderColor: APP.line }}>
            <Clock className="mt-[2px] h-[20px] w-[20px]" style={{ color: APP.muted }} aria-hidden />
            <div>
              <p className="text-[12px]" style={{ color: APP.muted }}>
                When
              </p>
              <p className="text-[16px]">Wed, Oct 28 · 10:00 - 10:45 AM</p>
            </div>
          </div>
          <div className="flex gap-[12px] px-[14px] py-[11px]">
            <Timer className="mt-[2px] h-[20px] w-[20px]" style={{ color: APP.muted }} aria-hidden />
            <div>
              <p className="text-[12px]" style={{ color: APP.muted }}>
                Duration
              </p>
              <p className="text-[16px]">45 min</p>
            </div>
          </div>
        </Card>

        <Label>Video call</Label>
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
            Join now
          </span>
          <p className="mt-[8px] text-[14px]">Passcode: PG9j5u</p>
        </Card>

        <Label>1 participant</Label>
        <Card className="flex items-center gap-[12px] px-[14px] py-[12px] text-[15px]">
          <User className="h-[20px] w-[20px]" style={{ color: APP.muted }} aria-hidden />
          ana@example.com
        </Card>

        <Label>Alerts</Label>
        <Card className="px-[14px] py-[10px] text-[14px] leading-relaxed">
          <p>Your default reminders: 15 min before, 5 min before, At start</p>
          <p>Intensity: Maximum (your default)</p>
        </Card>
      </div>
    </Screen>
  );
}
