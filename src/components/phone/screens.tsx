import type { ReactNode } from "react";
import { BellRing, Check, CheckCheck, ChevronLeft, Copy, Mic, Plus, Users, Video } from "lucide-react";
import { GoogleCalendarIcon, GoogleMeetIcon, OutlookIcon, WhatsAppIcon, ZoomIcon } from "@/components/icons/brand";
import { AppMark } from "@/components/ui/Logo";
import { Screen } from "./Device";

/* All screens are laid out at SCREEN_W CSS px wide (see geometry.ts). */

type ScreenProps = { height?: number };

function TopBar({ title, leading }: { title: string; leading?: ReactNode }) {
  return (
    <div className="relative mt-[18px] flex items-center gap-[10px] border-b border-white/[0.06] px-[18px] pb-[14px]">
      <ChevronLeft className="h-[22px] w-[22px] text-white/60" aria-hidden />
      {leading}
      <span className="text-[17px] font-semibold">{title}</span>
    </div>
  );
}

function Bubble({ from, children }: { from: "me" | "ai"; children: ReactNode }) {
  return from === "me" ? (
    <div className="ml-auto max-w-[80%] rounded-[18px] rounded-br-[6px] bg-white/[0.12] px-[14px] py-[10px] text-[15px] leading-snug">
      {children}
    </div>
  ) : (
    <div className="max-w-[86%] rounded-[18px] rounded-bl-[6px] border border-white/[0.06] bg-white/[0.04] px-[14px] py-[10px] text-[15px] leading-snug text-white/85">
      {children}
    </div>
  );
}

const PEOPLE = [
  { initials: "AK", name: "You", color: "#ff6b78", status: "Joining" },
  { initials: "AN", name: "Ana Ruiz", color: "#6ea8ff", status: "In call" },
  { initials: "DL", name: "David Lee", color: "#34c27a", status: "In call" },
  { initials: "MS", name: "Mia Santos", color: "#f59e0b", status: "Invited" },
];

/** Step 1 — Plan: a plain-language request, confirmed, then saved everywhere. */
export function PlanScreen({ height }: ScreenProps) {
  return (
    <Screen time="16:12" height={height}>
      <TopBar title="MeetingGuard AI" leading={<AppMark className="h-[26px] w-[26px]" sizes="52px" />} />
      <div className="flex flex-col gap-[12px] px-[16px] pt-[18px]">
        <Bubble from="me">Investor call with Ana on Wednesday at 10, add a Zoom link</Bubble>
        <div className="rounded-[18px] border border-white/[0.08] bg-[#121217] p-[14px]">
          <p className="text-[12px] text-white/45">Here&apos;s what I understood</p>
          <p className="mt-[4px] text-[17px] font-semibold">Investor call</p>
          <ul className="mt-[8px] space-y-[6px] text-[14px] text-white/60">
            <li>Wed, Oct 28 · 10:00 – 10:45</li>
            <li className="flex items-center gap-[6px]">
              <ZoomIcon className="h-[16px] w-[16px]" /> Zoom link generated
            </li>
            <li className="flex items-center gap-[6px]">
              <BellRing className="h-[16px] w-[16px] text-[#ff8a95]" aria-hidden /> Alarm 15 min before
            </li>
          </ul>
          <div className="mt-[14px] flex gap-[8px] text-[14px] font-semibold">
            <span className="flex h-[38px] flex-1 items-center justify-center gap-[6px] rounded-[12px] bg-accent">
              <Check className="h-[16px] w-[16px]" aria-hidden /> Confirmed
            </span>
            <span className="flex h-[38px] flex-1 items-center justify-center rounded-[12px] bg-white/[0.08] text-white/75">
              Edit
            </span>
          </div>
        </div>
        <Bubble from="ai">
          <span className="flex items-center gap-[6px] font-medium text-white">
            <Check className="h-[16px] w-[16px] text-emerald-400" strokeWidth={3} aria-hidden /> Saved
          </span>
          <span className="mt-[6px] flex items-center gap-[6px] text-[13px] text-white/60">
            <GoogleCalendarIcon className="h-[15px] w-[15px]" /> Google Calendar
            <OutlookIcon className="ml-[4px] h-[15px] w-[15px]" /> Outlook
          </span>
          <span className="mt-[4px] flex items-center gap-[6px] text-[13px] text-white/60">
            <Users className="h-[15px] w-[15px]" aria-hidden /> Invitation sent to Ana
          </span>
        </Bubble>
      </div>
      <div className="absolute inset-x-[14px] bottom-[34px] flex h-[50px] items-center gap-[10px] rounded-[18px] border border-white/[0.07] bg-white/[0.04] px-[14px] text-[14px] text-white/40">
        <span className="flex-1">Type or speak…</span>
        <span className="grid h-[34px] w-[34px] place-items-center rounded-full bg-accent">
          <Mic className="h-[17px] w-[17px] text-white" aria-hidden />
        </span>
      </div>
    </Screen>
  );
}

/** Step 3 — Join: the generated link, who's there, one tap in. */
export function JoinScreen({ height }: ScreenProps) {
  return (
    <Screen time="10:00" height={height}>
      <TopBar title="Meeting details" />
      <div className="px-[18px] pt-[18px]">
        <div className="flex items-center gap-[8px]">
          <span className="relative flex h-[10px] w-[10px]">
            <span className="absolute inset-0 rounded-full bg-emerald-400 [animation:glow-pulse_1.4s_ease-in-out_infinite]" />
          </span>
          <span className="text-[13px] font-medium text-emerald-300">Starting now</span>
        </div>
        <p className="mt-[6px] text-[24px] font-semibold">Investor call</p>
        <p className="mt-[2px] text-[15px] text-white/55">Today · 10:00 – 10:45</p>

        <div className="mt-[16px] rounded-[18px] border border-white/[0.08] bg-[#121217] p-[14px]">
          <div className="flex items-center gap-[10px]">
            <ZoomIcon className="h-[28px] w-[28px]" />
            <span className="text-[22px] leading-none font-bold tracking-[-0.02em] text-[#2D8CFF]">zoom</span>
            <span className="ml-auto flex items-center gap-[4px] text-[12px] text-white/45">
              <GoogleMeetIcon className="h-[14px] w-[14px]" /> Meet too
            </span>
          </div>
          <div className="mt-[10px] flex items-center gap-[8px] rounded-[10px] bg-white/[0.05] px-[10px] py-[8px] text-[13px] text-white/55">
            <span className="flex-1 truncate">zoom.us/j/84629371054</span>
            <Copy className="h-[15px] w-[15px]" aria-hidden />
          </div>
        </div>

        <p className="mt-[16px] text-[13px] text-white/40">Participants · 4</p>
        <ul className="mt-[8px] space-y-[10px]">
          {PEOPLE.map((p) => (
            <li key={p.initials} className="flex items-center gap-[10px] text-[14px]">
              <span
                className="grid h-[30px] w-[30px] place-items-center rounded-full text-[11px] font-semibold"
                style={{ background: `${p.color}33`, color: p.color }}
              >
                {p.initials}
              </span>
              <span className="flex-1 text-white/85">{p.name}</span>
              <span className={`text-[12px] ${p.status === "In call" ? "text-emerald-300" : "text-white/40"}`}>
                {p.status}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="absolute inset-x-[30px] bottom-[44px] rounded-[20px] bg-[linear-gradient(90deg,#3ee8ff,#7a7bff_55%,#e15bff)] p-[2.5px] shadow-[0_0_24px_rgba(90,160,255,0.4)]">
        <div className="flex h-[58px] items-center justify-center gap-[8px] rounded-[18px] bg-[#0c0c12] text-[19px] font-semibold">
          <Video className="h-[20px] w-[20px]" aria-hidden /> Join now
        </div>
      </div>
    </Screen>
  );
}

/** WhatsApp chat with the MeetingGuard assistant. */
export function WhatsAppScreen() {
  return (
    <Screen className="bg-[#0b0f0d]">
      <TopBar
        title="MeetingGuard"
        leading={
          <span className="relative">
            <AppMark className="h-[28px] w-[28px]" sizes="56px" />
            <WhatsAppIcon className="absolute -right-[4px] -bottom-[4px] h-[14px] w-[14px]" />
          </span>
        }
      />
      <div className="flex flex-col gap-[12px] px-[16px] pt-[16px]">
        <p className="mx-auto rounded-[8px] bg-white/[0.06] px-[10px] py-[3px] text-[12px] text-white/45">Today</p>
        {/* voice note */}
        <div className="ml-auto flex w-[78%] items-center gap-[10px] rounded-[18px] rounded-br-[6px] bg-[#1f6e4c]/70 px-[12px] py-[10px]">
          <span className="grid h-[30px] w-[30px] place-items-center rounded-full bg-white/15">
            <Mic className="h-[15px] w-[15px]" aria-hidden />
          </span>
          <span className="flex h-[20px] flex-1 items-center gap-[2px]" aria-hidden>
            {[8, 14, 6, 18, 10, 16, 7, 12, 18, 9, 14, 6, 11, 16, 8, 12].map((h, i) => (
              <span key={i} className="w-[3px] rounded-full bg-white/70" style={{ height: h }} />
            ))}
          </span>
          <span className="text-[12px] text-white/60">0:06</span>
        </div>
        <div className="ml-auto max-w-[80%] rounded-[18px] rounded-br-[6px] bg-[#1f6e4c]/70 px-[14px] py-[10px] text-[15px] leading-snug">
          Meeting with Ana and the design team this Friday at 10, Zoom link please
          <span className="mt-[2px] flex items-center justify-end gap-[4px] text-[11px] text-white/50">
            9:41 <CheckCheck className="h-[13px] w-[13px] text-[#53bdeb]" aria-hidden />
          </span>
        </div>
        <div className="max-w-[88%] rounded-[18px] rounded-bl-[6px] border border-white/[0.06] bg-white/[0.05] p-[14px] text-[14px] text-white/80">
          <p className="text-[16px] font-semibold text-white">Design review · Fri 10:00</p>
          <p className="mt-[6px] flex items-center gap-[6px]">
            <ZoomIcon className="h-[16px] w-[16px]" /> zoom.us/j/57204816390
          </p>
          <p className="mt-[4px] flex items-center gap-[6px]">
            <GoogleCalendarIcon className="h-[16px] w-[16px]" /> Added to Google Calendar
          </p>
          <p className="mt-[4px] flex items-center gap-[6px]">
            <Users className="h-[16px] w-[16px]" aria-hidden /> Invitations sent to 4 people
          </p>
        </div>
      </div>
      <div className="absolute inset-x-[12px] bottom-[34px] flex h-[48px] items-center gap-[10px] rounded-full bg-white/[0.06] px-[14px] text-[14px] text-white/35">
        <Plus className="h-[20px] w-[20px]" aria-hidden />
        <span className="flex-1">Message</span>
        <span className="grid h-[34px] w-[34px] place-items-center rounded-full bg-[#25D366]">
          <Mic className="h-[16px] w-[16px] text-[#0b0f0d]" aria-hidden />
        </span>
      </div>
    </Screen>
  );
}
