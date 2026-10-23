import { Contact, Globe, ShieldCheck, Star, Users } from "lucide-react";
import { CountUp, Reveal } from "@/components/motion";
import { NeonScene } from "@/components/scene/NeonScene";
import { Avatar, type AvatarName } from "@/components/ui/Avatar";
import { SectionHeading, Stars } from "@/components/ui/primitives";

const reviews: { quote: string; name: string; role: string; avatar: AvatarName }[] = [
  {
    quote: "MeetingGuard has completely transformed how I manage my day. I never miss important meetings anymore!",
    name: "Sarah Chen",
    role: "Product Manager, Stripe",
    avatar: "sarah",
  },
  {
    quote: "The AI scheduling is a game changer. It finds the perfect time every time and saves me hours each week.",
    name: "Michael Rodriguez",
    role: "Founder, GrowthLabs",
    avatar: "michael",
  },
  {
    quote: "So easy to use and incredibly reliable. The reminders and one-tap join feature are amazing!",
    name: "Emily Watson",
    role: "Operations Lead, Notion",
    avatar: "emily",
  },
];

const stats = [
  { icon: Users, value: <CountUp value={10000} suffix="+" />, label: "Professionals trust MeetingGuard" },
  {
    icon: Star,
    value: (
      <>
        <CountUp value={4.9} decimals={1} />
        /5
      </>
    ),
    label: "App Store & Google Play rating",
    star: true,
  },
  { icon: ShieldCheck, value: <CountUp value={99.9} decimals={1} suffix="%" />, label: "Uptime & reliability" },
  { icon: Contact, value: <CountUp value={500} suffix="+" />, label: "Companies use MeetingGuard" },
  { icon: Globe, value: <CountUp value={50} suffix="+" />, label: "Countries worldwide" },
];

export function Reviews() {
  return (
    <section id="reviews" aria-labelledby="reviews-title" className="relative overflow-hidden">
      <NeonScene seed={89} height={0.7} centerOpen={0.3} cracks={false} />
      <div className="neon-seam absolute inset-x-0 top-0 z-10" aria-hidden />

      <div className="container-page relative pt-14 pb-10">
        <Reveal>
          <SectionHeading
            id="reviews-title"
            eyebrow="Reviews"
            title={
              <>
                Real people. <span className="text-gradient-pink">Real results.</span>
              </>
            }
            subtitle="Higher productivity. Less stress. Smarter meetings."
          />
        </Reveal>

        <ul className="mt-10 grid gap-5 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <li key={r.name}>
              <Reveal delay={i * 0.12} className="h-full">
                <figure className="glass-panel flex h-full gap-5 rounded-2xl p-6 transition duration-300 hover:-translate-y-1 hover:border-[#7fb0ff]/80 hover:shadow-[0_0_36px_rgba(47,125,255,0.45)]">
                  <Avatar
                    name={r.avatar}
                    className="h-20 w-20 shrink-0 ring-2 ring-white/25 sm:h-[5.5rem] sm:w-[5.5rem]"
                  />
                  <div>
                    <Stars />
                    <blockquote className="mt-2.5 text-[0.92rem] leading-relaxed text-slate-100">
                      &ldquo;{r.quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-4">
                      <p className="font-display font-semibold text-[#8fc0ff]">{r.name}</p>
                      <p className="text-[0.82rem] text-slate-400">{r.role}</p>
                    </figcaption>
                  </div>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal delay={0.1}>
          <ul className="glass-panel mt-6 grid grid-cols-2 gap-y-6 rounded-2xl px-4 py-5 sm:grid-cols-3 lg:grid-cols-5 lg:divide-x lg:divide-white/10">
            {stats.map((s) => (
              <li key={s.label} className="flex items-center justify-center gap-3.5 px-3">
                <s.icon
                  aria-hidden
                  className={`h-9 w-9 shrink-0 ${
                    s.star
                      ? "fill-[#ffd02a] text-[#ffd02a] drop-shadow-[0_0_10px_rgba(255,208,42,0.7)]"
                      : "text-neon-azure drop-shadow-[0_0_10px_rgba(74,163,255,0.85)]"
                  }`}
                  strokeWidth={2}
                />
                <div>
                  <p className="font-display text-[1.45rem] leading-none font-semibold text-white">{s.value}</p>
                  <p className="mt-1 max-w-[9rem] text-[0.72rem] leading-snug text-slate-300">{s.label}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
