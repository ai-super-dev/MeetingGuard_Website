import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { Reveal } from "@/components/motion";
import { PhoneFrame } from "@/components/phone/PhoneFrame";
import {
  StepCreatedScreen,
  StepDoneScreen,
  StepTellScreen,
  StepUnderstandScreen,
} from "@/components/phone/screens";
import { NeonScene } from "@/components/scene/NeonScene";
import { SectionHeading } from "@/components/ui/primitives";

type Step = { title: string; body: string; screen: ReactNode; screenClassName?: string };

const steps: Step[] = [
  {
    title: "Tell your assistant.",
    body: "Type or speak what you need in natural language.",
    screen: <StepTellScreen />,
  },
  {
    title: "AI understands.",
    body: "MeetingGuard finds the best time, checks availability, and prepares the details.",
    screen: <StepUnderstandScreen />,
  },
  {
    title: "Meeting created.",
    body: "Review the details and confirm with one tap.",
    screen: <StepCreatedScreen />,
  },
  {
    title: "You're all set.",
    body: "You'll get a confirmation and timely reminders.",
    screen: <StepDoneScreen />,
    screenClassName: "bg-[linear-gradient(180deg,#2a1f86_0%,#4a1f9e_55%,#6a2bb8_100%)]",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="relative overflow-hidden">
      <NeonScene seed={61} height={0.62} centerOpen={0} />
      <div className="neon-seam absolute inset-x-0 top-0 z-10" aria-hidden />

      <div className="container-page relative py-14">
        <Reveal>
          <SectionHeading
            id="how-title"
            eyebrow="How it works"
            title={
              <>
                From a message to a <span className="text-gradient-cyan">meeting.</span> In seconds.
              </>
            }
            subtitle="Just 4 simple steps. Natural language. Real results."
          />
        </Reveal>

        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-9">
          {steps.map((s, i) => (
            <li key={s.title} className="relative">
              <Reveal delay={i * 0.14} className="h-full">
                <article className="glass-panel group flex h-[340px] flex-col overflow-hidden rounded-2xl px-5 pt-5 transition duration-300 hover:-translate-y-1.5 hover:border-[#7fb0ff]/80 hover:shadow-[0_0_40px_rgba(47,125,255,0.45)]">
                  <div className="flex gap-3.5">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[linear-gradient(180deg,#3b6dff,#5a2ee0)] font-display text-xl font-semibold text-white shadow-[0_0_18px_rgba(90,120,255,0.9)] ring-2 ring-[#a9c6ff]/80">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-display text-[1.05rem] font-semibold text-white">{s.title}</h3>
                      <p className="mt-1.5 text-[0.8rem] leading-snug text-slate-300">{s.body}</p>
                    </div>
                  </div>
                  {/* the card clips the phone, showing only its upper screen */}
                  <div className="mt-5 flex justify-center">
                    <div className="transition-transform duration-500 group-hover:-translate-y-2">
                      <PhoneFrame
                        className="h-[380px] w-[200px]"
                        tone={i === 3 ? "violet" : "blue"}
                        screenClassName={s.screenClassName}
                      >
                        {s.screen}
                      </PhoneFrame>
                    </div>
                  </div>
                </article>
              </Reveal>
              {i < steps.length - 1 && (
                <ChevronRight
                  aria-hidden
                  className="absolute top-[58%] -right-[2.05rem] z-10 hidden h-8 w-8 text-neon-cyan drop-shadow-[0_0_8px_#22d8f5] lg:block"
                  strokeWidth={2.6}
                />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
