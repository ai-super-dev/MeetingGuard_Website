import { Reveal } from "@/components/motion";
import { AppIcon } from "@/components/ui/Logo";
import { StoreButtons } from "@/components/ui/StoreButtons";
import { siteConfig } from "@/lib/site";

export function FinalCta() {
  return (
    <section aria-labelledby="cta-title" className="relative overflow-hidden py-28 sm:py-36">
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 h-[480px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(190,20,40,0.28),transparent)] blur-2xl"
      />
      <Reveal className="container-page relative flex flex-col items-center text-center">
        <AppIcon className="h-[140px] w-[140px] sm:h-[184px] sm:w-[184px]" />
        <h2
          id="cta-title"
          className="text-shine mt-12 text-[2.2rem] leading-[1.1] font-semibold tracking-[-0.03em] sm:text-[3rem]"
        >
          Never miss what matters.
        </h2>
        <p className="mt-3 font-medium text-white/55">{siteConfig.tagline}</p>
        <StoreButtons className="mt-8 justify-center" />
      </Reveal>
    </section>
  );
}
