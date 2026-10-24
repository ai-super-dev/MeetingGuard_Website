import { Check } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/brand";
import { Reveal } from "@/components/motion";
import { WhatsAppFlow } from "@/components/phone/WhatsAppFlow";

const POINTS = [
  "Instant scheduling for individuals or groups",
  "Plain language processing for complex bookings",
  "Seamless multi-calendar sync (Google, Microsoft)",
];

export function WhatsAppSection() {
  return (
    <section id="whatsapp" aria-labelledby="whatsapp-title" className="section-y relative overflow-x-clip">
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow flex items-center justify-center gap-2">
            <WhatsAppIcon className="h-4 w-4" /> WhatsApp
          </p>
          <h2 id="whatsapp-title" className="mt-3 text-[1.9rem] leading-[1.2] font-semibold text-balance tracking-[-0.02em] sm:text-[2.4rem]">
            Schedule straight
            <br />
            <span className="text-white/50">from WhatsApp.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[0.98rem] leading-relaxed text-white/60">
            Link your number once with a code from the app, then chat with MeetingGuard like you would with an
            assistant — it books the meeting and makes sure you never miss it.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <ul className="mx-auto mt-8 flex w-fit flex-col gap-3 xl:w-auto xl:flex-row xl:justify-center xl:gap-8">
            {POINTS.map((p) => (
              <li key={p} className="flex items-center gap-2.5 text-[0.92rem] text-white/80 xl:whitespace-nowrap">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#25D366]/15">
                  <Check className="h-3 w-3 text-[#25D366]" strokeWidth={3} aria-hidden />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="mt-16 lg:mt-20">
          <WhatsAppFlow />
        </div>
      </div>
    </section>
  );
}
