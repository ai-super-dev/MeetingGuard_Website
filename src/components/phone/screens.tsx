import type { ReactNode } from "react";
import { Check, CheckCheck, ChevronLeft, Copy, Mic, Plus, Users, Video } from "lucide-react";
import { GoogleCalendarIcon, GoogleMeetIcon, WhatsAppIcon, ZoomIcon } from "@/components/icons/brand";
import { AppMark } from "@/components/ui/Logo";
import { Screen } from "./Device";

/* All screens are laid out at SCREEN_W×SCREEN_H CSS px (see geometry.ts). */

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
    <div className="ml-auto max-w-[78%] rounded-[18px] rounded-br-[6px] bg-white/[0.12] px-[14px] py-[10px] text-[15px] leading-snug">
      {children}
    </div>
  ) : (
    <div className="max-w-[86%] rounded-[18px] rounded-bl-[6px] border border-white/[0.06] bg-white/[0.04] px-[14px] py-[10px] text-[15px] leading-snug text-white/85">
      {children}
    </div>
  );
}

/** Step 1 — Plan: plain-language request, the AI's understanding, confirm. */
export function PlanScreen() {
  return (
    <Screen>
      <TopBar title="MeetingGuard AI" leading={<AppMark className="h-[26px] w-[26px]" sizes="52px" />} />
      <div className="flex flex-col gap-[12px] px-[16px] pt-[18px]">
        <Bubble from="me">Lunch with Ana tomorrow at 2 pm, add a Zoom link</Bubble>
        <Bubble from="ai">Here&apos;s what I understood:</Bubble>
        <div className="rounded-[18px] border border-white/[0.08] bg-[#121217] p-[14px]">
          <p className="text-[17px] font-semibold">Lunch with Ana</p>
          <ul className="mt-[8px] space-y-[6px] text-[14px] text-white/60">
            <li>Tomorrow · 14:00 – 15:00</li>
            <li className="flex items-center gap-[6px]">
              <ZoomIcon className="h-[16px] w-[16px]" /> Zoom link will be generated
            </li>
            <li className="flex items-center gap-[6px]">
              <GoogleCalendarIcon className="h-[16px] w-[16px]" /> Google Calendar
            </li>
            <li className="flex items-center gap-[6px]">
              <Users className="h-[16px] w-[16px]" aria-hidden /> Invite: ana@studio.co
            </li>
          </ul>
          <div className="mt-[14px] flex gap-[8px] text-[14px] font-semibold">
            <span className="flex h-[38px] flex-1 items-center justify-center gap-[6px] rounded-[12px] bg-accent">
              <Check className="h-[16px] w-[16px]" aria-hidden /> Confirm
            </span>
            <span className="flex h-[38px] flex-1 items-center justify-center rounded-[12px] bg-white/[0.08] text-white/75">
              Edit
            </span>
          </div>
        </div>
        <p className="text-center text-[12px] text-white/35">Nothing is saved until you confirm</p>
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

/** Step 3 — Join: meeting details with the generated video-call link. */
export function JoinScreen() {
  return (
    <Screen>
      <TopBar title="Meeting details" />
      <div className="px-[18px] pt-[20px]">
        <p className="text-[24px] font-semibold">Investor call</p>
        <p className="mt-[4px] text-[15px] text-white/55">Today · 10:00 – 10:45</p>

        <div className="mt-[20px] rounded-[18px] border border-white/[0.08] bg-[#121217] p-[16px]">
          <div className="flex items-center gap-[10px]">
            <ZoomIcon className="h-[30px] w-[30px]" />
            <span className="text-[24px] leading-none font-bold tracking-[-0.02em] text-[#2D8CFF]">zoom</span>
          </div>
          <div className="mt-[12px] flex items-center gap-[8px] rounded-[10px] bg-white/[0.05] px-[10px] py-[8px] text-[13px] text-white/55">
            <span className="flex-1 truncate">zoom.us/j/84629371054</span>
            <Copy className="h-[15px] w-[15px]" aria-hidden />
          </div>
          <p className="mt-[12px] flex items-center gap-[6px] text-[14px] text-white/55">
            <Users className="h-[15px] w-[15px]" aria-hidden /> 4 participants
          </p>
        </div>

        <div className="mt-[12px] flex items-center gap-[10px] rounded-[14px] border border-white/[0.06] px-[14px] py-[12px] text-[14px] text-white/55">
          <GoogleMeetIcon className="h-[20px] w-[20px]" />
          <span className="flex-1">Also works with Google Meet</span>
        </div>
      </div>

      <div className="absolute inset-x-[30px] bottom-[60px] rounded-[20px] bg-[linear-gradient(90deg,#3ee8ff,#7a7bff_55%,#e15bff)] p-[2.5px] shadow-[0_0_24px_rgba(90,160,255,0.4)]">
        <div className="flex h-[60px] items-center justify-center gap-[8px] rounded-[18px] bg-[#0c0c12] text-[19px] font-semibold">
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
