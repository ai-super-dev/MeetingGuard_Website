import { Check } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/brand";
import { Reveal } from "@/components/motion";
import { FlatPhone } from "@/components/phone/Device";
import { WhatsAppScreen } from "@/components/phone/screens";

const POINTS = [
  "Book meetings for one person or a whole group",
  "Plain language, even for complex bookings",
  "Video-call link generated and invitations sent",
  "Lands in Google Calendar, Outlook and your phone's calendar",
];

export function WhatsAppSection() {
  return (
    <section id="whatsapp" aria-labelledby="whatsapp-title" className="relative overflow-x-clip py-20 sm:py-28">
      <div className="container-page grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
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
            No forms, no switching between apps. Send a quick voice note or a text, and your assistant creates the
            meeting, generates the link and protects your schedule.
          </p>
          <ul className="mt-7 space-y-3">
            {POINTS.map((p) => (
              <li key={p} className="flex items-start gap-3 text-[0.92rem] text-white/75">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#25D366]/15">
                  <Check className="h-3 w-3 text-[#25D366]" strokeWidth={3} aria-hidden />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal from="scale" className="relative flex justify-center">
          <div
            aria-hidden
            className="absolute top-1/2 left-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(37,211,102,0.14),transparent)] blur-2xl"
          />
          <div className="relative">
            <FlatPhone width={280}>
              <WhatsAppScreen />
            </FlatPhone>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
