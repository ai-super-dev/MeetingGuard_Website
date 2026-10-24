"use client";

import { Reveal } from "@/components/motion";
import { MeetingAlarmScreen } from "@/components/phone/MeetingAlarmScreen";
import { JoinScreen, PlanScreen } from "@/components/phone/screens";
import { FramedPhone } from "@/components/phone/FramedPhone";
import { PURPLE_FRAME, RED_FRAME, BLUE_FRAME } from "@/components/phone/geometry";
import { useT } from "@/lib/language";
import { StepShowcase } from "./StepShowcase";

/** One meeting, followed from the moment it's planned to the moment you join. */
const TIMES = ["16:12", "9:45", "10:00"];

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
  const t = useT();
  const steps = t.how.steps.map((s, i) => ({ ...s, time: TIMES[i] }));
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="relative py-14 sm:py-[4.5rem] overflow-x-clip">
      <div className="container-page">
        <Reveal className="mx-auto max-w-xl text-center">
          <p className="eyebrow">{t.how.eyebrow}</p>
          <h2 id="how-title" className="mt-3 text-[1.9rem] text-balance font-semibold tracking-[-0.02em] sm:text-[2.4rem]">
            {t.how.title}
          </h2>
          <p className="mt-3 text-[0.98rem] leading-relaxed text-white/60">
            {t.how.body}
          </p>
        </Reveal>

        <Reveal className="mx-auto mt-16 max-w-[1000px]">
          <StepShowcase
            steps={steps}
            screens={SCREENS}
            glows={["rgba(150,70,255,0.22)", "rgba(220,25,50,0.36)", "rgba(40,140,255,0.2)"]}
          />
        </Reveal>
      </div>
    </section>
  );
}
