import { Reveal, TiltPhone } from "@/components/motion";
import { PhoneFrame } from "@/components/phone/PhoneFrame";
import { BrandScreen, MeetingsScreen } from "@/components/phone/screens";
import { NeonScene } from "@/components/scene/NeonScene";
import { StoreButtons } from "@/components/ui/StoreButtons";

export function CallToAction() {
  return (
    <section aria-labelledby="cta-title" className="relative overflow-hidden">
      <NeonScene seed={97} height={0.8} centerOpen={0.2} />
      <div className="neon-seam absolute inset-x-0 top-0 z-10" aria-hidden />

      <div className="container-page relative grid items-center gap-10 pt-14 lg:grid-cols-[1.45fr_1fr] lg:pt-10">
        <div className="pb-4 text-center lg:pb-16 lg:text-left">
          <Reveal>
            <p className="eyebrow">Get started today</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2
              id="cta-title"
              className="mt-3 font-display text-[2.5rem] leading-[1.05] font-bold tracking-tight sm:text-[3.3rem] xl:whitespace-nowrap"
            >
              <span className="text-gradient-cyan">Never miss a</span>{" "}
              <span className="text-gradient-pink">meeting again.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mx-auto mt-4 max-w-lg text-[1.05rem] leading-relaxed text-slate-200 lg:mx-0">
              Join thousands of professionals who trust MeetingGuard for smarter, stress-free meetings.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <StoreButtons className="mt-7 justify-center lg:justify-start" />
          </Reveal>
        </div>

        {/* phones rise out of the floor; their lower halves are clipped by the section */}
        <div className="relative mx-auto -mb-28 flex h-[400px] w-full max-w-[460px] items-start justify-center">
          <TiltPhone className="absolute top-8 left-0 sm:left-6" rotate={10} rotateY={-12} float={8}>
            <PhoneFrame className="h-[420px] w-[205px]">
              <MeetingsScreen />
            </PhoneFrame>
          </TiltPhone>
          <TiltPhone className="absolute top-0 right-0 sm:right-4" rotate={12} rotateY={-14} float={12} delay={0.15}>
            <PhoneFrame className="h-[440px] w-[215px]">
              <BrandScreen />
            </PhoneFrame>
          </TiltPhone>
        </div>
      </div>
    </section>
  );
}
