import { Reveal } from "@/components/motion";
import { MeetingAlarmScreen } from "@/components/phone/MeetingAlarmScreen";
import { JoinScreen, PlanScreen } from "@/components/phone/screens";
import { FramedPhone } from "@/components/phone/FramedPhone";
import { PURPLE_FRAME, RED_FRAME, BLUE_FRAME } from "@/components/phone/geometry";
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
      "Zoom, Google Meet or Teams link generated for you",
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
      "One tap into the Zoom, Google Meet or Teams call",
      "Meeting details and the link in one place",
      "See who's already in the call",
    ],
  },
];

/** Plan, Alert and Join each get their own phone colour. */
const PHONE_BODY_H = 500;
const SCREENS = [
  <FramedPhone key="plan" frame={PURPLE_FRAME} bodyHeight={PHONE_BODY_H} mirror>
    <PlanScreen height={PURPLE_FRAME.screenH} />
  </FramedPhone>,
  <FramedPhone key="alert" frame={RED_FRAME} bodyHeight={PHONE_BODY_H} mirror>
    <MeetingAlarmScreen theme="dark" height={RED_FRAME.screenH} />
  </FramedPhone>,
  <FramedPhone key="join" frame={BLUE_FRAME} bodyHeight={PHONE_BODY_H} mirror>
    <JoinScreen height={BLUE_FRAME.screenH} />
  </FramedPhone>,
];

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="section-y relative overflow-x-clip">
      <div className="container-page">
        <Reveal className="mx-auto max-w-xl text-center">
          <p className="eyebrow">How it works</p>
          <h2 id="how-title" className="mt-3 text-[1.9rem] text-balance font-semibold tracking-[-0.02em] sm:text-[2.4rem]">
            Plan. Alert. Join.
          </h2>
          <p className="mt-3 text-[0.98rem] leading-relaxed text-white/60">
            Follow one meeting from the moment you ask for it to the moment you&apos;re in the call.
          </p>
        </Reveal>

        <Reveal className="mx-auto mt-16 max-w-[1000px]">
          <StepShowcase
            steps={STEPS}
            screens={SCREENS}
            glows={["rgba(150,70,255,0.22)", "rgba(220,25,50,0.36)", "rgba(40,140,255,0.2)"]}
          />
        </Reveal>
      </div>
    </section>
  );
}
