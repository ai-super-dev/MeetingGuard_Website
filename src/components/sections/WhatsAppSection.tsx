"use client";

import { Check, MessageCircle } from "lucide-react";
import { Reveal } from "@/components/motion";
import { WhatsAppFlow } from "@/components/phone/WhatsAppFlow";
import { useT } from "@/lib/language";

export function WhatsAppSection() {
  const t = useT();
  return (
    <section id="whatsapp" aria-labelledby="whatsapp-title" className="relative py-14 sm:py-[4.5rem] overflow-x-clip">
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow flex items-center justify-center gap-2">
            <MessageCircle className="h-4 w-4 text-[#25D366]" aria-hidden /> {t.whatsapp.eyebrow}
          </p>
          <h2 id="whatsapp-title" className="mt-3 text-[1.9rem] leading-[1.2] font-semibold text-balance tracking-[-0.02em] sm:text-[2.4rem]">
            {t.whatsapp.line1}
            <br />
            <span className="text-white/50">{t.whatsapp.line2}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[0.98rem] leading-relaxed text-white/60">
            {t.whatsapp.body}
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <ul className="mx-auto mt-8 grid w-fit gap-3 lg:grid-cols-3 lg:gap-12">
            {t.whatsapp.points.map(([first, second]) => (
              <li key={first} className="flex items-start gap-2.5 text-[0.92rem] leading-snug text-white/80">
                <span className="mt-px grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#25D366]/15">
                  <Check className="h-3 w-3 text-[#25D366]" strokeWidth={3} aria-hidden />
                </span>
                <span>
                  {first}
                  <br className="hidden lg:block" /> {second}
                </span>
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
