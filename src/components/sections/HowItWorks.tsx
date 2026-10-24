import { Reveal } from "@/components/motion";
import { AlertScreen } from "@/components/phone/AlertScreen";
import { JoinScreen, PlanScreen } from "@/components/phone/screens";
import { STRAIGHT_SCREEN_H, StraightPhone } from "@/components/phone/StraightPhone";
import { StepShowcase, type Step } from "./StepShowcase";

/** One meeting, followed from the moment it's planned to the moment you join. */
const STEPS: Step[] = [
  {
    day: "Mon",
    time: "16:12",
    title: "Plan",
    body: "Type or say it in plain words. The assistant shows what it understood, and saves only when you confirm.",
    points: [
      "Plain text or voice, in English or Spanish",
      "Zoom or Google Meet link generated for you",
      "Saved to Google Calendar, Outlook and your phone, invitations sent",
    ],
  },
  {
    day: "Wed",
    time: "9:45",
    title: "Alert",
    body: "Fifteen minutes before, an alarm takes over the screen — even with the app closed.",
    points: [
      "Full-screen alarm with sound and voice readout",
      "Snooze, or keep follow-ups going until you respond",
      "You choose the intensity for every meeting",
    ],
  },
  {
    day: "Wed",
    time: "10:00",
    title: "Join",
    body: "Everything you need is one tap away — no searching for links or switching apps.",
    points: [
      "One tap into the Zoom or Google Meet call",
      "Meeting details and the link in one place",
      "See who's already in the call",
    ],
  },
];

const SCREENS = [
  <PlanScreen key="plan" height={STRAIGHT_SCREEN_H} />,
  <AlertScreen key="alert" time="9:45" height={STRAIGHT_SCREEN_H} />,
  <JoinScreen key="join" height={STRAIGHT_SCREEN_H} />,
];

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="relative overflow-x-clip py-20 sm:py-28">
      <div className="container-page">
        <Reveal className="mx-auto max-w-xl text-center">
          <p className="eyebrow">How it works</p>
          <h2 id="how-title" className="text-shine mt-3 text-[1.9rem] font-semibold tracking-[-0.02em] sm:text-[2.4rem]">
            Plan. Alert. Join.
          </h2>
          <p className="mt-3 text-[0.98rem] leading-relaxed text-white/50">
            Follow one meeting from the moment you ask for it to the moment you&apos;re in the call.
          </p>
        </Reveal>

        <Reveal className="mx-auto mt-16 max-w-[1000px]">
          <StepShowcase
            steps={STEPS}
            screens={SCREENS.map((screen) => (
              <StraightPhone key={screen.key} width={360}>
                {screen}
              </StraightPhone>
            ))}
          />
        </Reveal>
      </div>
    </section>
  );
}
