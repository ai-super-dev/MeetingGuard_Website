import type { ReactNode } from "react";
import { Reveal, TiltPhone } from "@/components/motion";
import { PhoneFrame } from "@/components/phone/PhoneFrame";
import { NeonScene, type MoonSpec } from "@/components/scene/NeonScene";
import { CheckList, IconTile, type Tone } from "@/components/ui/primitives";

export type FeatureSectionProps = {
  id?: string;
  /** Optional block rendered above the feature row (e.g. a section heading). */
  intro?: ReactNode;
  icon: ReactNode;
  title: ReactNode;
  titleId: string;
  description: string;
  bullets: string[];
  tone: Tone;
  screen: ReactNode;
  /** Put the phone on the right instead of the left. */
  phoneRight?: boolean;
  scene: { seed: number; tone?: "blue" | "red" | "violet"; moon?: MoonSpec };
};

export function FeatureSection({
  id,
  intro,
  icon,
  title,
  titleId,
  description,
  bullets,
  tone,
  screen,
  phoneRight = false,
  scene,
}: FeatureSectionProps) {
  return (
    <section id={id} aria-labelledby={titleId} className="relative overflow-hidden">
      <NeonScene seed={scene.seed} tone={scene.tone} moon={scene.moon} height={0.8} centerOpen={0.18} />
      <div className="neon-seam absolute inset-x-0 top-0 z-10" aria-hidden />

      <div className="container-page relative py-14 lg:py-12">
        {intro}

        <div className="mt-2 grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
          <div className={`flex justify-center ${phoneRight ? "lg:order-2" : ""}`}>
            <TiltPhone
              rotate={phoneRight ? 6 : 4}
              rotateY={phoneRight ? -14 : 14}
              rotateX={4}
              float={10}
            >
              <PhoneFrame tone={tone} className="h-[470px] w-[248px]">
                {screen}
              </PhoneFrame>
            </TiltPhone>
          </div>

          <Reveal from={phoneRight ? "left" : "right"} className={phoneRight ? "lg:order-1 lg:pl-16" : "lg:pr-4"}>
            <div className="mx-auto grid max-w-xl grid-cols-[auto_1fr] items-start gap-x-6 gap-y-4 sm:gap-x-7">
              <IconTile tone={tone}>{icon}</IconTile>
              <div>
                <h3
                  id={titleId}
                  className="font-display text-[1.9rem] leading-tight font-semibold tracking-tight text-white sm:text-[2.15rem]"
                >
                  {title}
                </h3>
                <p className="mt-4 max-w-md text-[0.98rem] leading-relaxed text-slate-300">{description}</p>
                <div className="mt-6">
                  <CheckList items={bullets} tone={tone} />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
