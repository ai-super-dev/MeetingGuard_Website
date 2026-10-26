import Link from "next/link";
import {
  AlarmClock,
  ArrowUpRight,
  BellRing,
  CalendarDays,
  Clock,
  Hand,
  HelpCircle,
  KeyRound,
  Keyboard,
  Languages,
  Link2,
  ListChecks,
  Lock,
  MessageCircle,
  Mic,
  Phone,
  RefreshCw,
  RotateCcw,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Sun,
  TimerReset,
  Video,
  Volume2,
  type LucideIcon,
} from "lucide-react";
import { features, type IconKey } from "@/content/features";
import { faqGroupItems } from "@/content/faq";
import { featureAccents, featureIcons } from "@/components/icons/feature-icons";
import { Reveal } from "@/components/motion";
import { AvailableLabel, Card, CtaBand, PageHero, PointGrid, Section, SectionHeading, Tag } from "@/components/page/blocks";
import { FaqAccordion } from "@/components/page/FaqAccordion";
import { WhatsAppFlow } from "@/components/phone/WhatsAppFlow";
import { StoreBadges } from "@/components/ui/StoreBadges";
import { dictionaries } from "@/lib/i18n";
import { localize, type FeatureSlug, type Lang } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { Shot } from "./screens";

const ICONS: Record<IconKey, LucideIcon> = {
  mic: Mic,
  languages: Languages,
  keyboard: Keyboard,
  lock: Lock,
  link: Link2,
  help: HelpCircle,
  alarm: AlarmClock,
  bell: BellRing,
  snooze: TimerReset,
  restart: RotateCcw,
  sliders: SlidersHorizontal,
  video: Video,
  list: ListChecks,
  calendar: CalendarDays,
  clock: Clock,
  volume: Volume2,
  sun: Sun,
  hands: Hand,
  message: MessageCircle,
  key: KeyRound,
  shield: ShieldCheck,
  phone: Phone,
  sync: RefreshCw,
  send: Send,
};

export function featureMetadata(lang: Lang, slug: FeatureSlug) {
  const c = features[lang][slug];
  return pageMetadata({ lang, path: `/features/${slug}`, title: c.meta.title, description: c.meta.description });
}

export function FeaturePage({ lang, slug }: { lang: Lang; slug: FeatureSlug }) {
  const t = dictionaries[lang];
  const c = features[lang][slug];
  const accent = featureAccents[slug];
  const Icon = featureIcons[slug];
  const label = (l?: "android" | Parameters<typeof t.available>[0]) =>
    l === "android" ? <Tag>{t.common.androidOnly}</Tag> : l ? <AvailableLabel>{t.available(l)}</AvailableLabel> : undefined;

  return (
    <>
      <PageHero
        eyebrow={c.eyebrow}
        line1={c.line1}
        line2={c.line2}
        lead={c.lead}
        visual={
          <div className="relative">
            <div
              aria-hidden
              className="absolute top-1/2 left-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
              style={{ background: `radial-gradient(closest-side, color-mix(in srgb, ${accent} 30%, transparent), transparent)` }}
            />
            <div className="relative">
              <Shot screen={c.hero.screen} kind={c.hero.kind} lang={lang} bodyHeight={480} mirror />
            </div>
          </div>
        }
      >
        <StoreBadges />
      </PageHero>

      <Section>
        <SectionHeading
          eyebrow={c.eyebrow}
          line1={c.highlightsTitle[0]}
          line2={c.highlightsTitle[1]}
          label={
            <span className="grid h-7 w-7 place-items-center rounded-lg" style={{ background: `color-mix(in srgb, ${accent} 16%, transparent)`, color: accent }}>
              <Icon className="h-4 w-4" aria-hidden />
            </span>
          }
        />
        <PointGrid
          items={c.highlights.map((h) => {
            const HIcon = ICONS[h.icon];
            return { icon: <HIcon className="h-5 w-5" style={{ color: accent }} aria-hidden />, title: h.title, body: h.body, label: label(h.label) };
          })}
        />
      </Section>

      {c.table && (
        <Section>
          <SectionHeading line1={c.table.title[0]} line2={c.table.title[1]} />
          <Reveal className="mx-auto mt-10 max-w-2xl">
            <ul className="divide-y divide-white/[0.07] rounded-2xl border border-white/[0.07] bg-[linear-gradient(180deg,#0f0f13,#0a0a0d)]">
              {c.table.rows.map((r) => {
                const RIcon = r.kind === "calendar" ? CalendarDays : ListChecks;
                return (
                  <li key={r.name} className="flex items-center gap-4 px-5 py-4 sm:px-7">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/[0.05] text-white/70 ring-1 ring-white/[0.08]">
                      <RIcon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="flex-1 font-medium text-white">{r.name}</span>
                    {r.status === "now" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[0.72rem] font-medium text-emerald-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        {t.common.availableNow}
                      </span>
                    ) : (
                      <AvailableLabel>{t.available(r.status)}</AvailableLabel>
                    )}
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </Section>
      )}

      {c.whatsappFlow && (
        <Section>
          <WhatsAppFlow />
        </Section>
      )}

      {c.flow && c.flowTitle && (
        <Section>
          <SectionHeading line1={c.flowTitle[0]} line2={c.flowTitle[1]} />
          <ol className={`mx-auto mt-14 grid max-w-[1000px] gap-12 ${c.flow.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2 md:max-w-[720px]"}`}>
            {c.flow.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.08} className="flex flex-col items-center text-center">
                <Shot screen={step.screen} kind={step.kind} lang={lang} bodyHeight={400} />
                <p className="mt-7 font-mono text-[0.72rem] tracking-[0.06em]" style={{ color: accent }}>
                  0{i + 1}
                </p>
                <h3 className="mt-1 text-[1.05rem] font-semibold text-white">{step.title}</h3>
                <p className="mt-1.5 max-w-[260px] text-[0.88rem] leading-relaxed text-white/60">{step.body}</p>
              </Reveal>
            ))}
          </ol>
        </Section>
      )}

      {c.extra && (
        <Section>
          <div className={`mx-auto grid max-w-[1000px] items-center gap-12 ${c.extra.screens ? "lg:grid-cols-[minmax(0,1fr)_auto]" : ""}`}>
            <div className={c.extra.screens ? "" : "mx-auto max-w-2xl"}>
              <SectionHeading eyebrow={c.extra.eyebrow} line1={c.extra.title[0]} line2={c.extra.title[1]} body={c.extra.body} align={c.extra.screens ? "left" : "center"} />
              <Reveal delay={0.1}>
                <ol className={`mt-8 space-y-3 ${c.extra.screens ? "" : "mx-auto w-fit"}`}>
                  {c.extra.points.map((p, i) => (
                    <li key={p} className="flex items-start gap-3 text-[0.95rem] text-white/80">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-white/12 font-mono text-[0.7rem] text-white/60">{i + 1}</span>
                      {p}
                    </li>
                  ))}
                </ol>
                {c.extra.note && <p className="mt-6 text-[0.85rem] text-white/50">{c.extra.note}</p>}
              </Reveal>
            </div>
            {c.extra.screens && (
              <Reveal delay={0.15} className="flex justify-center gap-6 max-sm:[zoom:0.84] sm:gap-12">
                {c.extra.screens.map((s, i, all) => (
                  <figure key={s.caption} className="flex flex-col items-center">
                    {/* a pair of phones turn to face each other */}
                    <Shot screen={s.screen} kind={s.kind} lang={lang} bodyHeight={360} facing={all.length === 2 && i === 0 ? "right" : "left"} />
                    <figcaption className="mt-4 max-w-[170px] text-center text-[0.78rem] text-white/55">{s.caption}</figcaption>
                  </figure>
                ))}
              </Reveal>
            )}
          </div>
        </Section>
      )}

      {c.faqGroup && (
        <Section>
          <SectionHeading eyebrow={t.common.questions} line1={t.faqHome.title} />
          <Reveal delay={0.1} className="mx-auto mt-10 max-w-3xl">
            <FaqAccordion items={faqGroupItems(lang, c.faqGroup)} />
          </Reveal>
        </Section>
      )}

      <Section>
        <SectionHeading line1={t.common.related} />
        <div className="mx-auto mt-10 grid max-w-[1000px] gap-4 md:grid-cols-3">
          {c.related.map((r, i) => {
            const RIcon = featureIcons[r];
            return (
              <Reveal key={r} delay={i * 0.06} className="h-full">
                <Link href={localize(`/features/${r}`, lang)} className="group block h-full">
                  <Card className="h-full transition-colors duration-300 group-hover:border-white/[0.14]">
                    <div className="flex items-center justify-between">
                      <span
                        className="grid h-10 w-10 place-items-center rounded-xl ring-1 ring-white/[0.08]"
                        style={{ background: `color-mix(in srgb, ${featureAccents[r]} 14%, transparent)`, color: featureAccents[r] }}
                      >
                        <RIcon className="h-5 w-5" aria-hidden />
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-white/40 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" aria-hidden />
                    </div>
                    <h3 className="mt-5 font-semibold text-white">{t.pages.features[r]}</h3>
                    <p className="mt-1.5 text-[0.88rem] text-white/55">{t.pages.featureBlurbs[r]}</p>
                  </Card>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Section>

      <CtaBand line1={c.cta[0]} line2={c.cta[1]} body={t.cta.sentence} />
    </>
  );
}
