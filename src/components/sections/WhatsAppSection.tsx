import { Check } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/brand";
import { Reveal } from "@/components/motion";
import { WhatsAppFlow } from "@/components/phone/WhatsAppFlow";

const POINTS = [
  "Instant scheduling for individuals or groups.",
  "Plain language processing for complex bookings.",
  "Seamless multi-calendar sync (Google, Microsoft).",
];

export function WhatsAppSection() {
  return (
    <section id="whatsapp" aria-labelledby="whatsapp-title" className="relative overflow-x-clip py-20 sm:py-28">
      <div className="container-page">
        <div className="grid items-end gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal className="max-w-lg">
            <p className="eyebrow flex items-center gap-2">
              <WhatsAppIcon className="h-4 w-4" /> WhatsApp
            </p>
            <h2
              id="whatsapp-title"
              className="mt-3 text-[1.9rem] leading-[1.2] font-semibold tracking-[-0.02em] sm:text-[2.25rem]"
            >
              Schedule straight from WhatsApp.
            </h2>
            <p className="mt-4 text-[0.98rem] leading-relaxed text-white/50">
              Link your number once with a code from the app, then chat with MeetingGuard like you would with an
              assistant — it books the meeting and makes sure you never miss it.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="max-w-lg">
            <ul className="space-y-3">
              {POINTS.map((p) => (
                <li key={p} className="flex items-start gap-3 text-[0.95rem] text-white/80">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#25D366]/15">
                    <Check className="h-3 w-3 text-[#25D366]" strokeWidth={3} aria-hidden />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="mt-16 lg:mt-20">
          <WhatsAppFlow />
        </div>
      </div>
    </section>
  );
}
