import type { ReactNode } from "react";
import { Bell, CalendarDays, Sparkles } from "lucide-react";
import { GoogleMeetIcon, OutlookIcon, TeamsIcon, WhatsAppIcon, ZoomIcon } from "@/components/icons/brand";
import { Reveal, ScrollSlide } from "@/components/motion";
import { FlatPhone, HomeScreen } from "@/components/phone/HomeScreen";

type SideCard = { title: string; kind: string; icon: ReactNode; offset: string };

const LEFT: SideCard[] = [
  { title: "Investor Call", kind: "Critical alert", icon: <Bell className="h-4 w-4 text-accent" />, offset: "mr-10" },
  { title: "Team Standup", kind: "Google Meet", icon: <GoogleMeetIcon className="h-4 w-4" />, offset: "mr-0" },
  { title: "Design Review", kind: "Zoom", icon: <ZoomIcon className="h-4 w-4" />, offset: "mr-6" },
  { title: "Board Prep", kind: "Outlook", icon: <OutlookIcon className="h-4 w-4" />, offset: "mr-14" },
];

const RIGHT: SideCard[] = [
  { title: "Client Sync", kind: "Microsoft Teams", icon: <TeamsIcon className="h-4 w-4" />, offset: "ml-8" },
  { title: "Find time with Mia", kind: "AI scheduling", icon: <Sparkles className="h-4 w-4 text-accent" />, offset: "ml-0" },
  { title: "Lunch with Sam", kind: "From WhatsApp", icon: <WhatsAppIcon className="h-4 w-4" />, offset: "ml-12" },
  { title: "Apple Calendar", kind: "Connected", icon: <CalendarDays className="h-4 w-4 text-[#6ea8ff]" />, offset: "ml-4" },
];

function Card({ card }: { card: SideCard }) {
  return (
    <div className={`surface flex w-[230px] items-center gap-3 rounded-xl px-3.5 py-2.5 ${card.offset}`}>
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/[0.05]">{card.icon}</span>
      <span className="text-left leading-tight">
        <span className="block text-[0.85rem] text-white/85">{card.title}</span>
        <span className="block text-[0.68rem] text-white/35">{card.kind}</span>
      </span>
    </div>
  );
}

export function Overview() {
  return (
    <section id="overview" aria-labelledby="overview-title" className="relative py-20 sm:py-28">
      <div className="container-page">
        <Reveal className="mx-auto max-w-xl text-center">
          <p className="eyebrow">Today</p>
          <h2 id="overview-title" className="mt-3 text-[1.9rem] font-semibold tracking-[-0.02em] sm:text-[2.25rem]">
            Your day, at a glance
          </h2>
          <p className="mt-3 text-[0.98rem] leading-relaxed text-white/50">
            Every meeting from every calendar in one calm view. Critical calls stand out, and your AI assistant is
            always a tap away.
          </p>
        </Reveal>

        <div className="relative mt-16 flex items-center justify-center">
          {/* side cards, tucked behind the phone */}
          <div className="absolute top-1/2 right-1/2 hidden -translate-y-[70%] flex-col items-end gap-5 pr-[110px] lg:flex">
            {LEFT.map((c) => (
              <ScrollSlide key={c.title} from={-160} opacity={0.55}>
                <Card card={c} />
              </ScrollSlide>
            ))}
          </div>
          <div className="absolute top-1/2 left-1/2 hidden -translate-y-[70%] flex-col items-start gap-5 pl-[110px] lg:flex">
            {RIGHT.map((c) => (
              <ScrollSlide key={c.title} from={160} opacity={0.55}>
                <Card card={c} />
              </ScrollSlide>
            ))}
          </div>

          <Reveal from="scale" className="relative z-10">
            <FlatPhone width={300}>
              <HomeScreen />
            </FlatPhone>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
