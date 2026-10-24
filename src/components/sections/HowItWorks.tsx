import type { ReactNode } from "react";
import { Reveal } from "@/components/motion";
import { AlertScreen } from "@/components/phone/AlertScreen";
import { JoinScreen, PlanScreen } from "@/components/phone/screens";
import { STRAIGHT_SCREEN_H, StraightPhone } from "@/components/phone/StraightPhone";
import { StepTrack, type TrackStep } from "./StepTrack";

/** One meeting, followed from the moment it's planned to the moment you join. */
const STEPS: (TrackStep & { title: string; body: string; result: string[]; screen: ReactNode; focus?: boolean })[] = [
  {
    day: "Mon",
    time: "16:12",
    title: "Plan",
    body: "Type or say it in plain words. The assistant shows what it understood, and saves only when you confirm.",
    result: ["Zoom link", "Invites sent", "Synced"],
    screen: <PlanScreen height={STRAIGHT_SCREEN_H} />,
  },
  {
    day: "Wed",
    time: "9:45",
    title: "Alert",
    body: "Fifteen minutes before, an alarm takes over the screen — even with the app closed. Snooze or follow up as you like.",
    result: ["Full-screen", "Sound + voice", "Follow-ups"],
    screen: <AlertScreen time="9:45" height={STRAIGHT_SCREEN_H} />,
    focus: true,
  },
  {
    day: "Wed",
    time: "10:00",
    title: "Join",
    body: "Everything is one tap away: the Zoom or Google Meet link, the details and who's already in the call.",
    result: ["One tap", "Zoom · Meet", "On time"],
    screen: <JoinScreen height={STRAIGHT_SCREEN_H} />,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="relative overflow-x-clip py-20 sm:py-28">
      <div className="container-page">
        <Reveal className="mx-auto max-w-xl text-center">
          <p className="eyebrow">How it works</p>
          <h2
            id="how-title"
            className="text-shine mt-3 text-[1.9rem] font-semibold tracking-[-0.02em] sm:text-[2.4rem]"
          >
            Plan. Alert. Join.
          </h2>
          <p className="mt-3 text-[0.98rem] leading-relaxed text-white/50">
            Follow one meeting from the moment you ask for it to the moment you&apos;re in the call.
          </p>
        </Reveal>

        <div className="mx-auto mt-16 max-w-[1080px]">
          <StepTrack steps={STEPS.map(({ day, time }) => ({ day, time }))}>
            <ol className="mt-6 grid gap-16 md:grid-cols-3 md:gap-4">
              {STEPS.map((s, i) => (
                <li key={s.title}>
                  <Reveal delay={i * 0.12} className="flex flex-col items-center text-center">
                    {/* time chip for the stacked (mobile) layout */}
                    <p className="mb-2 flex items-baseline gap-2 font-mono text-[0.72rem] tracking-[0.06em] md:hidden">
                      <span className="text-white/45 uppercase">{s.day}</span>
                      <span className="text-[0.95rem] text-white">{s.time}</span>
                    </p>

                    <div className="relative">
                      {s.focus && (
                        <div
                          aria-hidden
                          className="absolute top-1/2 left-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(200,20,40,0.35),transparent)] blur-2xl"
                        />
                      )}
                      <div className="relative">
                        <StraightPhone width={330}>{s.screen}</StraightPhone>
                      </div>
                    </div>

                    <div className="-mt-6 flex items-center gap-3">
                      <span className="font-mono text-[0.72rem] text-[#ff8a95]">0{i + 1}</span>
                      <h3 className="text-[1.2rem] font-semibold">{s.title}</h3>
                    </div>
                    <p className="mt-2 max-w-[290px] text-[0.88rem] leading-relaxed text-white/50">{s.body}</p>
                    <ul className="mt-4 flex flex-wrap justify-center gap-1.5">
                      {s.result.map((r) => (
                        <li
                          key={r}
                          className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[0.7rem] text-white/60"
                        >
                          {r}
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                </li>
              ))}
            </ol>
          </StepTrack>
        </div>
      </div>
    </section>
  );
}
