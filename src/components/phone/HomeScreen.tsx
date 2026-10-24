import type { ComponentType, ReactNode, SVGProps } from "react";
import { AlarmClock, CalendarDays, Mic, Search, Share2, SlidersHorizontal, Sparkles } from "lucide-react";
import { GoogleCalendarIcon, OutlookIcon, PhoneCalendarIcon } from "@/components/icons/brand";
import { AppMark } from "@/components/ui/Logo";
import { SCREEN_H, SCREEN_W } from "./geometry";

type Icon = ComponentType<SVGProps<SVGSVGElement> & { strokeWidth?: number }>;

export function StatusBar({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-between text-[15px] font-semibold text-white ${className}`}>
      <span>9:41</span>
      <svg viewBox="0 0 54 12" className="h-[11px] w-auto" aria-hidden>
        <g fill="#fff">
          <rect x="0" y="8" width="2.6" height="4" rx="0.6" />
          <rect x="4" y="6" width="2.6" height="6" rx="0.6" />
          <rect x="8" y="3.5" width="2.6" height="8.5" rx="0.6" />
          <rect x="12" y="1" width="2.6" height="11" rx="0.6" />
          <path d="M24 3.2a8.6 8.6 0 0 1 6.2 2.5l-1.3 1.3a6.8 6.8 0 0 0-9.8 0l-1.3-1.3A8.6 8.6 0 0 1 24 3.2zm0 3.6a5 5 0 0 1 3.6 1.5L24 12l-3.6-3.7A5 5 0 0 1 24 6.8z" />
          <rect x="35" y="2" width="16" height="9" rx="2.4" fill="none" stroke="#fff" strokeOpacity="0.6" />
          <rect x="36.6" y="3.6" width="12.4" height="5.8" rx="1.3" />
          <rect x="52" y="5" width="1.6" height="3.4" rx="0.8" fillOpacity="0.6" />
        </g>
      </svg>
    </div>
  );
}

const ACTIONS: { label: string; icon: Icon; color: string; tint: string }[] = [
  { label: "Assistant", icon: Sparkles, color: "#ff6b78", tint: "rgba(255,77,94,0.16)" },
  { label: "Alarms", icon: AlarmClock, color: "#ff8a5c", tint: "rgba(255,138,92,0.14)" },
  { label: "Calendars", icon: CalendarDays, color: "#6ea8ff", tint: "rgba(110,168,255,0.14)" },
  { label: "Share", icon: Share2, color: "#a78bfa", tint: "rgba(167,139,250,0.16)" },
];

/** Today's meetings, each tagged with the calendar it was synced from. */
const UP_NEXT: { title: string; meta: string; icon: ReactNode; alarm?: boolean }[] = [
  { title: "Investor Call", meta: "10:00 · Google Calendar", icon: <GoogleCalendarIcon className="h-[18px] w-[18px]" />, alarm: true },
  { title: "Team Standup", meta: "11:30 · Outlook", icon: <OutlookIcon className="h-[18px] w-[18px]" /> },
  { title: "Dentist", meta: "14:00 · Phone calendar", icon: <PhoneCalendarIcon className="h-[18px] w-[18px]" /> },
  { title: "Client Sync", meta: "16:00 · Google Calendar", icon: <GoogleCalendarIcon className="h-[18px] w-[18px]" /> },
];

/**
 * MeetingGuard's home screen, laid out at SCREEN_W×SCREEN_H CSS px. Used both
 * projected into the hero phone frame and inside the flat phone mockup.
 */
export function HomeScreen() {
  return (
    <div
      className="relative overflow-hidden rounded-[48px] bg-[#0b0b0e] text-left text-white"
      style={{ width: SCREEN_W, height: SCREEN_H }}
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[300px] bg-[radial-gradient(70%_100%_at_70%_0%,rgba(255,60,80,0.16),transparent_70%)]"
      />
      <StatusBar className="relative px-[34px] pt-[20px]" />

      {/* search row */}
      <div className="relative mt-[22px] flex items-center gap-[12px] px-[20px]">
        <SlidersHorizontal className="h-[20px] w-[20px] text-white/60" aria-hidden />
        <div className="flex h-[40px] flex-1 items-center gap-[8px] rounded-[12px] bg-white/[0.07] px-[12px] text-[14px] text-white/45">
          <Search className="h-[16px] w-[16px]" aria-hidden />
          Search meetings
        </div>
        <span className="grid h-[34px] w-[34px] place-items-center rounded-full bg-[linear-gradient(140deg,#ff7a85,#9b1c2e)] text-[12px] font-semibold">
          AK
        </span>
      </div>

      {/* quick actions */}
      <div className="relative mt-[26px] grid grid-cols-4 px-[14px]">
        {ACTIONS.map((a) => (
          <div key={a.label} className="flex flex-col items-center gap-[8px]">
            <span
              className="grid h-[52px] w-[52px] place-items-center rounded-[15px] border border-white/[0.06]"
              style={{ background: a.tint }}
            >
              <a.icon className="h-[24px] w-[24px]" style={{ color: a.color }} strokeWidth={2} />
            </span>
            <span className="text-[12px] text-white/70">{a.label}</span>
          </div>
        ))}
      </div>

      {/* today */}
      <p className="relative mt-[28px] px-[22px] text-[13px] text-white/40">Today</p>
      <ul className="relative mt-[6px] px-[12px]">
        {UP_NEXT.map((m) => (
          <li key={m.title} className="flex items-center gap-[12px] rounded-[12px] px-[10px] py-[10px]">
            <span className="grid h-[32px] w-[32px] place-items-center rounded-[9px] bg-white/[0.06]">{m.icon}</span>
            <span className="flex-1 leading-tight">
              <span className="block text-[15px] font-medium">{m.title}</span>
              <span className="block text-[12px] text-white/40">{m.meta}</span>
            </span>
            {m.alarm && (
              <span className="flex items-center gap-[4px] rounded-full border border-accent/40 bg-accent/15 px-[8px] py-[3px] text-[11px] font-medium text-[#ff8a95]">
                <AlarmClock className="h-[11px] w-[11px]" aria-hidden />
                Alarm on
              </span>
            )}
          </li>
        ))}
      </ul>

      {/* AI proposal — nothing changes until the user confirms */}
      <div className="absolute inset-x-[12px] bottom-[150px] rounded-[18px] border border-white/[0.07] bg-white/[0.04] p-[12px]">
        <p className="flex items-center gap-[6px] text-[12px] text-white/50">
          <Sparkles className="h-[13px] w-[13px] text-[#ff6b78]" aria-hidden />
          Suggested change
        </p>
        <p className="mt-[4px] text-[14px]">Move Client Sync to 16:30 and share with Mia?</p>
        <div className="mt-[10px] flex gap-[8px] text-[13px] font-medium">
          <span className="flex h-[32px] flex-1 items-center justify-center rounded-[10px] bg-accent">Confirm</span>
          <span className="flex h-[32px] flex-1 items-center justify-center rounded-[10px] bg-white/[0.08] text-white/75">
            Edit
          </span>
        </div>
      </div>

      {/* assistant bar: plain text or voice */}
      <div className="absolute inset-x-[12px] bottom-[34px] rounded-[22px] border border-white/[0.06] bg-[linear-gradient(160deg,rgba(255,77,94,0.16),rgba(30,20,24,0.9)_45%,rgba(20,20,24,0.95))] p-[12px]">
        <span className="inline-flex items-center gap-[6px] rounded-[8px] bg-white/[0.06] px-[8px] py-[4px] text-[12px] text-white/80">
          <AppMark className="h-[16px] w-[16px]" sizes="32px" />
          MeetingGuard AI
        </span>
        <div className="mt-[10px] flex items-center gap-[10px] text-[14px] text-white/40">
          <span className="flex-1">Type or speak to schedule…</span>
          <span className="grid h-[36px] w-[48px] place-items-center rounded-[12px] bg-white/[0.08]">
            <Mic className="h-[18px] w-[18px] text-white/80" aria-hidden />
          </span>
        </div>
      </div>
      <span className="absolute bottom-[12px] left-1/2 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-white/85" />
    </div>
  );
}

/** Flat phone shell (no frame image) holding the home screen at a given width. */
export function FlatPhone({ width = 300, children }: { width?: number; children: ReactNode }) {
  const scale = width / SCREEN_W;
  return (
    <div
      className="relative rounded-[42px] border border-white/10 bg-[#0b0b0e] p-[6px] shadow-[0_40px_120px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.06)]"
      style={{ width: width + 14, height: SCREEN_H * scale + 14 }}
    >
      <div className="origin-top-left" style={{ transform: `scale(${scale})` }}>
        {children}
      </div>
    </div>
  );
}
