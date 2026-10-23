import type { ReactNode } from "react";
import {
  GoogleCalendarIcon,
  GoogleMeetIcon,
  OutlookIcon,
  PhoneCalendarIcon,
  WhatsAppIcon,
  ZoomIcon,
} from "@/components/icons/brand";
import { Reveal, TiltPhone } from "@/components/motion";
import { PhoneFrame } from "@/components/phone/PhoneFrame";
import { HubScreen } from "@/components/phone/screens";
import { NeonScene } from "@/components/scene/NeonScene";
import { SectionHeading } from "@/components/ui/primitives";

type Integration = { name: string; body: string; icon: ReactNode };

const left: Integration[] = [
  { name: "Google Calendar", body: "Sync your Google Calendar events and meetings.", icon: <GoogleCalendarIcon className="h-9 w-9" /> },
  { name: "Outlook Calendar", body: "Keep your Outlook meetings in sync automatically.", icon: <OutlookIcon className="h-9 w-9" /> },
  { name: "Google Meet", body: "Join meetings with one tap.", icon: <GoogleMeetIcon className="h-9 w-9" /> },
];

const right: Integration[] = [
  { name: "Zoom", body: "Get reminders and join Zoom meetings instantly.", icon: <ZoomIcon className="h-10 w-10" /> },
  { name: "WhatsApp", body: "Turn messages into meetings.", icon: <WhatsAppIcon className="h-10 w-10" /> },
  { name: "Phone Calendar", body: "Keep your device calendar in sync.", icon: <PhoneCalendarIcon className="h-10 w-10" /> },
];

function IntegrationCard({ item, delay, from }: { item: Integration; delay: number; from: "left" | "right" }) {
  return (
    <Reveal from={from} delay={delay}>
      <article className="glass-panel flex h-[116px] items-center gap-4 rounded-2xl px-5 transition duration-300 hover:border-[#7fb0ff]/80 hover:shadow-[0_0_34px_rgba(47,125,255,0.5)]">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-white shadow-[0_0_16px_rgba(120,170,255,0.45)]">
          {item.icon}
        </span>
        <div>
          <h3 className="font-display text-[1.02rem] font-semibold text-white">{item.name}</h3>
          <p className="mt-1 text-[0.8rem] leading-snug text-slate-300">{item.body}</p>
        </div>
      </article>
    </Reveal>
  );
}

/* Circuit traces between the cards (300px columns) and the phone (x 370–590) in a 960×400 box. */
const leftTraces = [
  "M300 58 H322 L344 108 H372",
  "M300 200 H372",
  "M300 342 H322 L344 292 H372",
  "M322 58 V30 H352 L360 150 H372",
  "M330 200 L346 236 H372",
  "M322 342 V370 H352 L360 250 H372",
];
const rightTraces = leftTraces.map((d) =>
  d.replace(/([MHL])\s?(\d+)/g, (_, cmd: string, x: string) => `${cmd}${960 - Number(x)}`),
);
const nodes = [
  [300, 58],
  [300, 200],
  [300, 342],
  [372, 108],
  [372, 150],
  [372, 200],
  [372, 236],
  [372, 250],
  [372, 292],
];

function Traces() {
  const all = [...leftTraces, ...rightTraces];
  return (
    <svg
      viewBox="0 0 960 400"
      className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
      aria-hidden
    >
      <defs>
        <filter id="trace-glow" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {all.map((d) => (
          <path key={`g${d}`} d={d} stroke="#3d8bff" strokeWidth="6" opacity="0.55" filter="url(#trace-glow)" />
        ))}
        {all.map((d) => (
          <path key={`c${d}`} d={d} stroke="#7cc0ff" strokeWidth="1.6" />
        ))}
        {all.map((d) => (
          <path key={`f${d}`} d={d} stroke="#ffffff" strokeWidth="2" strokeDasharray="6 34" className="animate-flow" />
        ))}
      </g>
      {nodes.flatMap(([x, y]) => [
        <circle key={`l${x}-${y}`} cx={x} cy={y} r="3.6" fill="#bfe0ff" className="drop-shadow-[0_0_6px_#4aa3ff]" />,
        <circle key={`r${x}-${y}`} cx={960 - x} cy={y} r="3.6" fill="#bfe0ff" className="drop-shadow-[0_0_6px_#4aa3ff]" />,
      ])}
    </svg>
  );
}

export function Integrations() {
  return (
    <section id="integrations" aria-labelledby="integrations-title" className="relative overflow-hidden">
      <NeonScene seed={73} height={0.75} centerOpen={0.25} />
      <div className="neon-seam absolute inset-x-0 top-0 z-10" aria-hidden />

      <div className="container-page relative py-14">
        <Reveal>
          <SectionHeading
            id="integrations-title"
            eyebrow="Integrations"
            title="Works with the tools you already use."
            subtitle="MeetingGuard stays in sync with your favorite calendars and communication platforms."
          />
        </Reveal>

        <div className="relative mx-auto mt-10 grid max-w-xl gap-4 lg:mt-12 lg:h-[400px] lg:w-[960px] lg:max-w-none lg:grid-cols-[300px_360px_300px] lg:gap-0">
          <Traces />
          <div className="flex justify-center lg:order-2 lg:-mt-4">
            <TiltPhone intensity={10} float={8}>
              <PhoneFrame className="h-[430px] w-[220px]">
                <HubScreen />
              </PhoneFrame>
            </TiltPhone>
          </div>
          <div className="grid gap-4 lg:order-1 lg:gap-[26px]">
            {left.map((it, i) => (
              <IntegrationCard key={it.name} item={it} delay={i * 0.12} from="left" />
            ))}
          </div>
          <div className="grid gap-4 lg:order-3 lg:gap-[26px]">
            {right.map((it, i) => (
              <IntegrationCard key={it.name} item={it} delay={i * 0.12} from="right" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
