import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion";
import { AlertScreen } from "@/components/phone/AlertScreen";
import { FlatPhone } from "@/components/phone/Device";
import { JoinScreen, PlanScreen } from "@/components/phone/screens";

const STEPS: { title: string; body: string; screen: ReactNode }[] = [
  {
    title: "Plan",
    body: "Type or say what you need. The assistant sets up the meeting, adds the people and generates the video-call link.",
    screen: <PlanScreen />,
  },
  {
    title: "Alert",
    body: "Before it starts, an alarm rings — even with the app closed. Snooze it or follow up, at the intensity you choose.",
    screen: <AlertScreen />,
  },
  {
    title: "Join",
    body: "Everything you need is one tap away: the Zoom or Google Meet link, the details and who's attending.",
    screen: <JoinScreen />,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="relative py-20 sm:py-28">
      <div className="container-page">
        <Reveal className="mx-auto max-w-xl text-center">
          <p className="eyebrow">How it works</p>
          <h2 id="how-title" className="mt-3 text-[1.9rem] font-semibold tracking-[-0.02em] sm:text-[2.25rem]">
            Plan. Alert. Join.
          </h2>
          <p className="mt-3 text-[0.98rem] leading-relaxed text-white/50">
            Three steps to total peace of mind — from setting up a meeting by voice or chat to getting you into the
            call.
          </p>
        </Reveal>

        <ol className="mt-16 grid gap-12 md:grid-cols-3 md:gap-6">
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative">
              <Reveal delay={i * 0.12} className="flex flex-col items-center text-center">
                <FlatPhone width={220}>{s.screen}</FlatPhone>
                <p className="mt-8 font-mono text-[0.72rem] tracking-[0.08em] text-[#ff8a95]">0{i + 1}</p>
                <h3 className="mt-1 text-[1.15rem] font-semibold">{s.title}</h3>
                <p className="mt-2 max-w-[280px] text-[0.88rem] leading-relaxed text-white/50">{s.body}</p>
              </Reveal>
              {i < STEPS.length - 1 && (
                <ArrowRight
                  aria-hidden
                  className="absolute top-[200px] -right-6 hidden h-5 w-5 text-white/25 md:block"
                />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
