import type { ComponentType, ReactNode, SVGProps } from "react";
import {
  Bell,
  CalendarDays,
  ChevronRight,
  Clock,
  Ellipsis,
  Mic,
  NotebookText,
  Plus,
  Check,
  Video,
  CalendarPlus,
  UsersRound,
  Briefcase,
} from "lucide-react";
import {
  GoogleCalendarIcon,
  GoogleMeetIcon,
  OutlookIcon,
  PhoneCalendarIcon,
  TeamsIcon,
  ZoomIcon,
} from "@/components/icons/brand";
import { RobotIcon } from "@/components/icons/RobotIcon";
import { AvatarStack } from "@/components/ui/Avatar";
import { ShieldMark } from "@/components/ui/Logo";
import { PulseRing } from "@/components/motion";

type Icon = ComponentType<SVGProps<SVGSVGElement> & { strokeWidth?: number }>;

/* ---------- shared bits ---------- */

function ScreenButton({
  children,
  icon: IconCmp,
  primary = false,
  className = "",
}: {
  children: ReactNode;
  icon?: Icon;
  primary?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`flex h-11 w-full items-center justify-center gap-2 rounded-xl text-[0.82rem] font-semibold ${
        primary
          ? "bg-[linear-gradient(180deg,#3d8fff,#1d5ee8)] text-white shadow-[0_0_18px_rgba(47,125,255,0.75),inset_0_1px_0_rgba(255,255,255,0.35)] ring-1 ring-[#8fc0ff]/60"
          : "border border-white/10 bg-white/[0.07] text-slate-100"
      } ${className}`}
    >
      {IconCmp && <IconCmp className="h-4 w-4" strokeWidth={2.2} />}
      {children}
    </div>
  );
}

function AppTile({ children, className = "h-9 w-9" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`grid shrink-0 place-items-center rounded-[0.6rem] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.35)] ${className}`}>
      {children}
    </span>
  );
}

function CalendarBadge({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <span
      className={`grid place-items-center rounded-xl bg-[linear-gradient(180deg,#3d8fff,#1a4fd0)] shadow-[0_0_18px_rgba(47,125,255,0.8)] ring-1 ring-[#9cc6ff]/60 ${className}`}
    >
      <CalendarDays className="h-1/2 w-1/2 text-white" strokeWidth={2.2} />
    </span>
  );
}

/** Glowing red bell with sound waves — the "critical alert" motif. */
export function AlarmBell({ className = "h-28 w-28" }: { className?: string }) {
  return (
    <div className={`relative grid place-items-center ${className}`}>
      <PulseRing className="absolute inset-[22%] rounded-full bg-[#ff2d55]/30" />
      <PulseRing className="absolute inset-[22%] rounded-full bg-[#ff2d55]/25" delay={1.1} />
      <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full" aria-hidden>
        <g fill="none" stroke="#ff3a5c" strokeLinecap="round" className="drop-shadow-[0_0_6px_#ff2d55]">
          <path d="M24 38a44 44 0 0 0 0 44" strokeWidth="4" />
          <path d="M14 30a56 56 0 0 0 0 60" strokeWidth="3" opacity="0.7" />
          <path d="M96 38a44 44 0 0 1 0 44" strokeWidth="4" />
          <path d="M106 30a56 56 0 0 1 0 60" strokeWidth="3" opacity="0.7" />
        </g>
      </svg>
      <Bell
        className="relative h-[52%] w-[52%] fill-[#ff2d55] text-[#ff7d93] drop-shadow-[0_0_14px_#ff1f4b] drop-shadow-[0_0_30px_rgba(255,31,75,0.7)]"
        strokeWidth={1.4}
        aria-hidden
      />
    </div>
  );
}

/* ---------- feature screens ---------- */

export function AlertScreen() {
  return (
    <div className="flex h-full flex-col items-center px-4 pt-7 text-center">
      <AlarmBell />
      <p className="mt-3 font-display text-[1.5rem] leading-tight font-semibold text-white">Investor Call</p>
      <p className="mt-0.5 text-[0.98rem] text-slate-100">starts in 15 minutes</p>
      <p className="mt-0.5 text-[0.72rem] text-slate-300 italic">Today at 10:00 AM</p>
      <div className="mt-6 w-full space-y-2.5">
        <ScreenButton primary icon={Video}>
          Join Meeting
        </ScreenButton>
        <ScreenButton icon={Clock}>Snooze</ScreenButton>
        <ScreenButton icon={NotebookText}>View Details</ScreenButton>
      </div>
    </div>
  );
}

export function CalendarsScreen() {
  const rows = [
    { name: "Google Calendar", icon: <GoogleCalendarIcon className="h-6 w-6" /> },
    { name: "Outlook Calendar", icon: <OutlookIcon className="h-6 w-6" /> },
    { name: "Apple Calendar", icon: <PhoneCalendarIcon className="h-6 w-6" /> },
  ];
  return (
    <div className="flex h-full flex-col items-center px-3.5 pt-5">
      <CalendarBadge />
      <p className="mt-2.5 font-display text-[1.02rem] font-semibold text-white">Connected Calendars</p>
      <div className="mt-4 w-full space-y-2">
        {rows.map((r) => (
          <div
            key={r.name}
            className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.07] p-2.5"
          >
            <AppTile>{r.icon}</AppTile>
            <div className="min-w-0 flex-1 text-left">
              <p className="text-[0.78rem] font-medium text-white">{r.name}</p>
              <p className="mt-0.5 flex items-center gap-1 text-[0.62rem] text-emerald-400">
                <span className="grid h-2.5 w-2.5 place-items-center rounded-full border border-emerald-400">
                  <span className="h-1 w-1 rounded-full bg-emerald-400" />
                </span>
                Connected
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-300" />
          </div>
        ))}
      </div>
      <div className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#4f8dff]/40 bg-[#1b3c97]/60 text-[0.78rem] font-medium text-white">
        <span className="grid h-4 w-4 place-items-center rounded-full bg-white text-[#1b3c97]">
          <Plus className="h-3 w-3" strokeWidth={3} />
        </span>
        Add Calendar
      </div>
    </div>
  );
}

export function AIChatScreen() {
  return (
    <div className="flex h-full flex-col px-3.5 pt-5">
      <div className="relative ml-auto max-w-[78%] rounded-2xl rounded-br-md bg-[linear-gradient(180deg,#3d8fff,#2464ea)] px-3.5 py-2.5 text-[0.78rem] leading-snug text-white shadow-[0_0_16px_rgba(47,125,255,0.6)]">
        Schedule a team sync tomorrow at 2pm
      </div>
      <div className="mt-3 flex items-center gap-2">
        <RobotIcon className="h-11 w-11 shrink-0 drop-shadow-[0_0_10px_rgba(120,170,255,0.8)]" />
        <div className="rounded-2xl rounded-bl-md bg-white/[0.1] px-3 py-2 text-[0.76rem] text-slate-100">
          I found a time for you:
        </div>
      </div>
      <div className="mt-3 rounded-2xl border border-[#4f8dff]/30 bg-[#152a6b]/70 p-3">
        <div className="flex gap-2.5">
          <AppTile className="h-8 w-8">
            <PhoneCalendarIcon className="h-6 w-6" />
          </AppTile>
          <div className="text-[0.74rem] leading-relaxed text-slate-200">
            <p className="font-display text-[0.9rem] font-semibold text-white">Team Sync</p>
            <p>Tomorrow • 2:00 PM</p>
            <p>30 min • Google Meet</p>
          </div>
        </div>
        <div className="mt-2 pl-[2.6rem]">
          <AvatarStack names={["ava", "noah", "mia"]} size="h-6 w-6" />
        </div>
      </div>
      <ScreenButton primary className="mt-3" icon={Plus}>
        Create Meeting
      </ScreenButton>
    </div>
  );
}

export function StandupScreen() {
  const apps = [
    { name: "Zoom", icon: <ZoomIcon className="h-6 w-6" /> },
    { name: "Google Meet", icon: <GoogleMeetIcon className="h-6 w-6" /> },
    { name: "Teams", icon: <TeamsIcon className="h-6 w-6" /> },
    { name: "More", icon: <Ellipsis className="h-5 w-5 text-white" /> },
  ];
  return (
    <div className="flex h-full flex-col items-center px-3.5 pt-5 text-center">
      <CalendarBadge className="h-9 w-9" />
      <p className="mt-2 font-display text-[1.1rem] font-semibold text-white">Team Standup</p>
      <p className="text-[0.74rem] text-slate-300">Today • 9:00 – 9:30 AM</p>
      <ScreenButton primary className="mt-3.5" icon={Video}>
        Join Meeting
      </ScreenButton>
      <div className="mt-3 grid w-full grid-cols-4 gap-1.5">
        {apps.map((a) => (
          <div key={a.name} className="flex flex-col items-center gap-1">
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.08]">
              {a.icon}
            </span>
            <span className="text-[0.56rem] text-slate-300">{a.name}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 w-full space-y-1.5">
        {[
          { label: "View Meeting Details", icon: NotebookText },
          { label: "Add to Calendar", icon: CalendarPlus },
        ].map((row) => (
          <div
            key={row.label}
            className="flex h-9 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3 text-[0.7rem] text-slate-100"
          >
            <row.icon className="h-3.5 w-3.5 text-slate-300" />
            <span className="flex-1 text-left">{row.label}</span>
            <ChevronRight className="h-3.5 w-3.5 text-[#6aa8ff]" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- how-it-works screens ---------- */

export function StepTellScreen() {
  return (
    <div className="flex h-full flex-col px-3 pt-6">
      <div className="relative rounded-2xl rounded-bl-md bg-[linear-gradient(180deg,#3d8fff,#2464ea)] px-3.5 py-3 text-[0.78rem] leading-snug text-white shadow-[0_0_16px_rgba(47,125,255,0.6)]">
        Schedule a product review with the design team tomorrow at 2pm
      </div>
      <div className="mt-5 flex justify-end pr-4">
        <span className="relative grid h-11 w-11 place-items-center rounded-full bg-[linear-gradient(180deg,#3d8fff,#1d5ee8)] shadow-[0_0_18px_rgba(47,125,255,0.9)] ring-2 ring-[#9cc6ff]/70">
          <PulseRing className="absolute inset-0 rounded-full bg-[#2f7dff]/40" />
          <Mic className="relative h-5 w-5 text-white" />
        </span>
      </div>
    </div>
  );
}

export function StepUnderstandScreen() {
  return (
    <div className="flex h-full flex-col px-3 pt-6">
      <p className="text-center font-display text-[0.86rem] font-semibold text-white">Found the perfect time!</p>
      <div className="mt-3 rounded-xl border border-[#4f8dff]/30 bg-[#163170]/70 p-2.5">
        <div className="flex gap-2">
          <AppTile className="h-7 w-7">
            <GoogleCalendarIcon className="h-5 w-5" />
          </AppTile>
          <div className="text-[0.66rem] leading-relaxed text-slate-200">
            <p className="text-[0.76rem] font-semibold text-white">Product Review</p>
            <p>Tomorrow • 2:00 PM</p>
            <p>1 hour • Google Meet</p>
          </div>
        </div>
        <div className="mt-1.5 pl-9">
          <AvatarStack names={["emily", "noah", "sarah"]} size="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export function StepCreatedScreen() {
  return (
    <div className="flex h-full flex-col px-2.5 pt-5">
      <div className="rounded-xl bg-white p-2.5 text-slate-700 shadow-[0_0_20px_rgba(120,170,255,0.5)]">
        <div className="flex gap-2">
          <OutlookIcon className="h-6 w-6 shrink-0" />
          <div className="text-[0.62rem] leading-relaxed">
            <p className="text-[0.74rem] font-semibold text-slate-900">Product Review</p>
            <p>Tomorrow • 2:00 – 3:00 PM</p>
            <p>Google Meet</p>
          </div>
        </div>
        <div className="mt-2">
          <AvatarStack names={["noah", "emily", "liam", "mia"]} size="h-5 w-5" ring="ring-2 ring-white" />
        </div>
        <div className="mt-2.5 flex h-8 items-center justify-center rounded-lg bg-[linear-gradient(180deg,#3d8fff,#1d5ee8)] text-[0.7rem] font-semibold text-white">
          Confirm Meeting
        </div>
      </div>
    </div>
  );
}

export function StepDoneScreen() {
  return (
    <div className="flex h-full flex-col items-center px-3 pt-7 text-center">
      <span className="relative grid h-12 w-12 place-items-center rounded-full bg-[linear-gradient(180deg,#34d399,#059669)] shadow-[0_0_22px_rgba(52,211,153,0.85)] ring-2 ring-emerald-200/70">
        <PulseRing className="absolute inset-0 rounded-full bg-emerald-400/40" />
        <Check className="relative h-6 w-6 text-white" strokeWidth={3} />
      </span>
      <p className="mt-3 font-display text-[0.92rem] font-semibold text-white">Meeting Scheduled!</p>
      <p className="mt-1 text-[0.66rem] leading-snug text-violet-100/85">
        You&apos;ll get a reminder
        <br />
        before the meeting.
      </p>
    </div>
  );
}

/* ---------- brand / list screens ---------- */

export function HubScreen() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-4 pb-10 text-center">
      <ShieldMark className="h-24 w-24 drop-shadow-[0_0_24px_rgba(59,130,246,0.95)]" />
      <p className="mt-4 font-display text-[1.35rem] font-semibold text-white">MeetingGuard</p>
      <p className="mt-2 text-[0.82rem] leading-snug text-[#8fbaff]">
        Your meetings.
        <br />
        In sync. Everywhere.
      </p>
    </div>
  );
}

export function BrandScreen() {
  return (
    <div className="flex h-full flex-col items-center px-4 pt-16 text-center">
      <ShieldMark className="h-20 w-20 drop-shadow-[0_0_24px_rgba(59,130,246,0.95)]" />
      <p className="mt-4 font-display text-[1.3rem] font-semibold text-white">MeetingGuard</p>
      <p className="mt-2 text-[0.8rem] leading-snug text-[#8fbaff] italic">
        Smarter meetings.
        <br />A brighter you.
      </p>
    </div>
  );
}

export function MeetingsScreen() {
  const items = [
    { title: "Team Standup", time: "9:00 – 9:30 AM", icon: UsersRound },
    { title: "Product Review", time: "2:00 – 3:00 PM", icon: Briefcase },
    { title: "Client Call", time: "4:00 – 4:30 PM", icon: Clock },
  ];
  return (
    <div className="flex h-full flex-col px-3 pt-5">
      <p className="text-center font-display text-[1rem] font-semibold text-white">Meetings</p>
      <div className="mt-3 grid grid-cols-2 rounded-xl bg-white/[0.07] p-1 text-[0.66rem]">
        <span className="rounded-lg bg-[linear-gradient(180deg,#3d8fff,#1d5ee8)] py-1.5 text-center font-semibold text-white">
          Today
        </span>
        <span className="py-1.5 text-center text-slate-300">Upcoming</span>
      </div>
      <div className="mt-3 space-y-2">
        {items.map((it) => (
          <div key={it.title} className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.07] p-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[#2f7dff]/25 ring-1 ring-[#6aa8ff]/50">
              <it.icon className="h-3.5 w-3.5 text-[#9cc6ff]" />
            </span>
            <div className="text-[0.62rem] text-slate-300">
              <p className="text-[0.74rem] font-medium text-white">{it.title}</p>
              {it.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
