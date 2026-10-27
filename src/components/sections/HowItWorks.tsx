"use client";

import { Fragment } from "react";
import { Reveal } from "@/components/motion";
import { ConfirmScreen, VoiceScreen } from "@/components/phone/flows";
import { FramedPhone } from "@/components/phone/FramedPhone";
import { MeetingAlarmScreen } from "@/components/phone/MeetingAlarmScreen";
import { BLUE_FRAME, PURPLE_FRAME, RED_FRAME } from "@/components/phone/geometry";
import { useT } from "@/lib/language";
import { StepShowcase } from "./StepShowcase";

/** One meeting: said on Monday afternoon, confirmed a moment later, never missed on Wednesday. */
const TIMES = ["16:12", "16:13", "9:45"];

/** Say it, Confirm it and Never miss it each get their own phone colour. */
const PHONE_BODY_H = 500;
const SCREENS = [
  <FramedPhone key="say" frame={PURPLE_FRAME} bodyHeight={PHONE_BODY_H} mirror>
    <VoiceScreen height={PURPLE_FRAME.screenH} />
  </FramedPhone>,
  <FramedPhone key="confirm" frame={BLUE_FRAME} bodyHeight={PHONE_BODY_H} mirror>
    <ConfirmScreen height={BLUE_FRAME.screenH} time="16:13" />
  </FramedPhone>,
  <FramedPhone key="alarm" frame={RED_FRAME} bodyHeight={PHONE_BODY_H} mirror>
    <MeetingAlarmScreen theme="dark" height={RED_FRAME.screenH} />
  </FramedPhone>,
];

export function HowItWorks() {
  const t = useT();
  const steps = t.how.steps.map((s, i) => ({ ...s, time: TIMES[i] }));
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="relative overflow-x-clip py-14 sm:py-[4.5rem]">
      <div className="container-page">
        <Reveal className="mx-auto max-w-xl text-center">
          <p data-snap="how" className="eyebrow">
            {t.how.eyebrow}
          </p>
          <h2 id="how-title" className="mt-3 text-[1.9rem] font-semibold tracking-[-0.02em] text-balance sm:text-[2.4rem]">
            {/* keep each short sentence on one line ("Say it." / "Confirm it." / "Never miss it.") */}
            {t.how.title.split(/(?<=\.)\s+/).map((part, i) => (
              <Fragment key={i}>
                {i > 0 && " "}
                <span className="whitespace-nowrap">{part}</span>
              </Fragment>
            ))}
          </h2>
          <p className="mt-3 text-[0.98rem] leading-relaxed text-white/60">{t.how.body}</p>
        </Reveal>

        <Reveal className="mx-auto mt-16 max-w-[1000px]">
          <StepShowcase
            steps={steps}
            screens={SCREENS}
            glows={["rgba(150,70,255,0.22)", "rgba(40,140,255,0.22)", "rgba(220,25,50,0.36)"]}
          />
        </Reveal>
      </div>
    </section>
  );
}
