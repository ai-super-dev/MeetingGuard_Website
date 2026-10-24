import { CalendarDays, Mail, MessageCircle, Newspaper } from "lucide-react";
import { Reveal } from "@/components/motion";
import { AlertScreen } from "@/components/phone/AlertScreen";
import { FlatPhone } from "@/components/phone/Device";

type Banner = { app: string; title: string; detail: string; icon: typeof CalendarDays };

/** The meeting reminder, buried in a stack of everyday notifications. */
const STACK: Banner[] = [
  { app: "Messages", title: "Sam", detail: "Running 5 min late, sorry!", icon: MessageCircle },
  { app: "Mail", title: "Weekly report", detail: "Here are this week's numbers…", icon: Mail },
  { app: "Calendar", title: "Investor call", detail: "10:00 – 10:45", icon: CalendarDays },
  { app: "News", title: "Markets open higher", detail: "Stocks rise in early trading…", icon: Newspaper },
  { app: "Messages", title: "Family", detail: "Dinner at 8?", icon: MessageCircle },
];

function PassiveStack() {
  return (
    <ul className="w-full max-w-[300px] space-y-2 [mask-image:linear-gradient(180deg,transparent,#000_20%,#000_80%,transparent)]">
      {STACK.map((b, i) => (
        <li
          key={i}
          className={`surface rounded-2xl p-3 text-left ${b.app === "Calendar" ? "opacity-70" : "opacity-35"}`}
        >
          <div className="flex items-center gap-2 text-[0.68rem] text-white/45">
            <b.icon className="h-3.5 w-3.5" aria-hidden />
            <span className="flex-1">{b.app}</span>
            <span>now</span>
          </div>
          <p className="mt-1 text-[0.82rem] font-medium text-white/80">{b.title}</p>
          <p className="truncate text-[0.72rem] text-white/45">{b.detail}</p>
        </li>
      ))}
    </ul>
  );
}

export function Problem() {
  return (
    <section aria-labelledby="problem-title" className="relative py-20 sm:py-28">
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Why MeetingGuard</p>
          <h2
            id="problem-title"
            className="text-shine mt-3 text-[1.9rem] leading-[1.2] font-semibold tracking-[-0.02em] sm:text-[2.4rem]"
          >
            Your calendar organizes time.
            <br />
            MeetingGuard protects your commitments.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[0.98rem] leading-relaxed text-white/50">
            Calendars only store dates. When your day gets busy, passive notifications get ignored. MeetingGuard makes
            sure you&apos;re always in the right meeting, right on time.
          </p>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-[880px] items-center gap-6 md:grid-cols-2">
          <Reveal from="left" className="surface flex h-full flex-col items-center rounded-2xl px-6 py-10 text-center">
            <p className="eyebrow">A regular calendar</p>
            <div className="mt-8 flex w-full flex-1 items-center justify-center">
              <PassiveStack />
            </div>
            <p className="mt-8 text-[0.95rem] font-semibold text-white/80">One more banner in the pile</p>
            <p className="mt-1 text-[0.85rem] text-white/45">Easy to swipe away, buried under everything else.</p>
          </Reveal>

          <Reveal from="right" className="surface flex h-full flex-col items-center rounded-2xl px-6 py-10 text-center">
            <p className="eyebrow text-[#ff8a95]">MeetingGuard</p>
            <div className="mt-8">
              <FlatPhone width={190}>
                <AlertScreen />
              </FlatPhone>
            </div>
            <p className="mt-8 text-[0.95rem] font-semibold text-white">An alarm you can&apos;t ignore</p>
            <p className="mt-1 text-[0.85rem] text-white/45">
              Rings even when the app is closed, full-screen over the lock screen on Android.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
