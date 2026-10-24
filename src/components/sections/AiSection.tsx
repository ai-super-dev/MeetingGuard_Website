import type { ReactNode } from "react";
import { AudioLines, Plus } from "lucide-react";
import {
  GoogleCalendarIcon,
  GoogleMeetIcon,
  OutlookIcon,
  PhoneCalendarIcon,
  TeamsIcon,
  WhatsAppIcon,
  ZoomIcon,
} from "@/components/icons/brand";
import { Reveal } from "@/components/motion";

const INTEGRATIONS: { name: string; icon: ReactNode }[] = [
  { name: "WhatsApp", icon: <WhatsAppIcon className="h-6 w-6" /> },
  { name: "Microsoft Teams", icon: <TeamsIcon className="h-6 w-6" /> },
  { name: "Google Meet", icon: <GoogleMeetIcon className="h-6 w-6" /> },
  { name: "Zoom", icon: <ZoomIcon className="h-6 w-6" /> },
  { name: "Apple Calendar", icon: <PhoneCalendarIcon className="h-6 w-6" /> },
  { name: "Outlook", icon: <OutlookIcon className="h-6 w-6" /> },
  { name: "Google Calendar", icon: <GoogleCalendarIcon className="h-6 w-6" /> },
];

/**
 * Isometric panel: a dark slab laid back in 3D, with the integrations rising
 * off it one by one and the AI prompt bar along its near edge.
 */
function IsoPanel() {
  return (
    <div className="relative mx-auto h-[420px] w-full max-w-[520px] [perspective:1600px]">
      <div
        className="absolute top-1/2 left-1/2 h-[380px] w-[300px]"
        style={{ transform: "translate(-50%, -50%) rotateX(54deg) rotateZ(-38deg)", transformStyle: "preserve-3d" }}
      >
        {/* the slab */}
        <div className="surface absolute inset-0 rounded-[28px] bg-[linear-gradient(160deg,#16161b,#0b0b0e_60%)]">
          <div className="absolute inset-0 rounded-[28px] bg-[radial-gradient(60%_50%_at_60%_40%,rgba(255,60,80,0.18),transparent_70%)]" />
          {/* prompt bar on the near edge */}
          <div className="absolute inset-x-5 bottom-5 flex h-14 items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.04] px-4 text-[0.9rem] text-white/35">
            <span className="flex-1">Ask MeetingGuard AI…</span>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/[0.07]">
              <AudioLines className="h-4 w-4 text-white/60" aria-hidden />
            </span>
          </div>
          <span className="absolute top-[64%] left-[62%] grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-white/[0.05]">
            <Plus className="h-4 w-4 text-white/50" aria-hidden />
          </span>
        </div>

        {/* integrations standing on the slab's far edge */}
        <ul className="absolute -top-2 left-6 flex flex-col-reverse gap-3" style={{ transform: "translateZ(30px)" }}>
          {INTEGRATIONS.map((it, i) => (
            <li key={it.name}>
              <Reveal delay={0.1 + (INTEGRATIONS.length - i) * 0.08} from="right" distance={40}>
                <span className="flex items-center gap-3 whitespace-nowrap">
                  <span className="drop-shadow-[0_0_10px_rgba(255,255,255,0.15)]">{it.icon}</span>
                  <span className="text-[1rem] font-medium text-white/80">{it.name}</span>
                </span>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function AiSection() {
  return (
    <section id="ai" aria-labelledby="ai-title" className="relative overflow-x-clip py-20 sm:py-28">
      <div className="container-page grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal className="max-w-md">
          <p className="eyebrow">MeetingGuard AI</p>
          <h2 id="ai-title" className="mt-3 text-[1.9rem] leading-[1.2] font-semibold tracking-[-0.02em] sm:text-[2.25rem]">
            One assistant.
            <br />
            Every calendar.
          </h2>
          <p className="mt-4 text-[0.98rem] leading-relaxed text-white/50">
            Tell it what you need in plain language. MeetingGuard finds the best time across Google, Outlook and Apple
            calendars, then sets up the call in Zoom, Meet or Teams.
          </p>
        </Reveal>
        <IsoPanel />
      </div>
    </section>
  );
}
