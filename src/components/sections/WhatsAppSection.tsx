import { BellRing, MessageCircle, UserPlus } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/brand";
import { Reveal } from "@/components/motion";
import { WhatsAppDemo } from "@/components/phone/WhatsAppDemo";
import { AppMark } from "@/components/ui/Logo";
import { siteConfig } from "@/lib/site";

const STEPS = [
  {
    icon: UserPlus,
    title: "Save the number",
    body: "Add MeetingGuard to your contacts, just like a person.",
  },
  {
    icon: MessageCircle,
    title: "Message it",
    body: "Text or send a voice note in plain words. It confirms the details before saving — with the video link and invites.",
  },
  {
    icon: BellRing,
    title: "Get the alarm",
    body: "When it's time, MeetingGuard rings. The meeting is already in your calendars.",
  },
];

/** The agent's WhatsApp contact, with a direct "chat" link. */
function ContactCard() {
  return (
    <div className="surface mt-8 flex flex-wrap items-center gap-4 rounded-2xl p-4">
      <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/[0.05]">
        <AppMark className="h-9 w-9" sizes="72px" />
        <WhatsAppIcon className="absolute -right-0.5 -bottom-0.5 h-5 w-5" />
      </span>
      <span className="min-w-[10rem] flex-1 leading-tight">
        <span className="block font-semibold">MeetingGuard</span>
        <span className="block font-mono text-[0.85rem] whitespace-nowrap text-white/55">{siteConfig.whatsappNumber}</span>
      </span>
      <a
        href={siteConfig.whatsappUrl}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#25D366] max-sm:w-full px-4 text-[0.88rem] font-semibold text-[#0b141a] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#25D366]"
      >
        <WhatsAppIcon className="h-4 w-4 [&_rect]:fill-[#0b141a] [&_path]:fill-[#25D366]" />
        Chat on WhatsApp
      </a>
    </div>
  );
}

export function WhatsAppSection() {
  return (
    <section id="whatsapp" aria-labelledby="whatsapp-title" className="relative overflow-x-clip py-20 sm:py-28">
      <div className="container-page grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
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
            MeetingGuard has its own WhatsApp number. Chat with it like you would with an assistant — it books the
            meeting and makes sure you never miss it.
          </p>

          <ol className="mt-8 space-y-5">
            {STEPS.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.03]">
                  <s.icon className="h-[18px] w-[18px] text-[#25D366]" aria-hidden />
                  <span className="absolute -top-1.5 -right-1.5 grid h-4 w-4 place-items-center rounded-full bg-ink-950 font-mono text-[0.6rem] text-white/50 ring-1 ring-white/10">
                    {i + 1}
                  </span>
                </span>
                <span>
                  <span className="block text-[0.98rem] font-semibold">{s.title}</span>
                  <span className="mt-0.5 block text-[0.88rem] leading-relaxed text-white/50">{s.body}</span>
                </span>
              </li>
            ))}
          </ol>

          <ContactCard />
        </Reveal>

        <div className="flex justify-center">
          <WhatsAppDemo />
        </div>
      </div>
    </section>
  );
}
