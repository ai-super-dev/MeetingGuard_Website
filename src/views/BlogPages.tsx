import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion";
import { CtaBand, PageHero, Section } from "@/components/page/blocks";
import { dictionaries } from "@/lib/i18n";
import { parseFrontMatter, renderMarkdown } from "@/lib/markdown";
import { localize, type Lang } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

/*
 * The blog is Markdown-driven: one file per post in src/content/blog/en and
 * src/content/blog/es with the same file name (the URL slug). Front matter:
 * title, description, date (YYYY-MM-DD), author. A post without a Spanish
 * file falls back to English on the Spanish site.
 */

const DIR = path.join(process.cwd(), "src", "content", "blog");

const copy = {
  en: { eyebrow: "Blog", line1: "Notes on showing up", line2: "on time.", lead: "Short reads on meetings, alarms and running your day by voice.", read: "Read", back: "All posts", cta: ["Try it on your", "next meeting."] },
  es: { eyebrow: "Blog", line1: "Ideas para llegar", line2: "siempre a tiempo.", lead: "Lecturas cortas sobre reuniones, alarmas y cómo gestionar tu día con la voz.", read: "Leer", back: "Todas las entradas", cta: ["Pruébalo en tu", "próxima reunión."] },
} as const;

export function blogSlugs() {
  return fs
    .readdirSync(path.join(DIR, "en"))
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""))
    .sort();
}

function getPost(lang: Lang, slug: string) {
  const own = path.join(DIR, lang, `${slug}.md`);
  const file = fs.existsSync(own) ? own : path.join(DIR, "en", `${slug}.md`);
  const { data, body } = parseFrontMatter(fs.readFileSync(file, "utf8"));
  // links inside Spanish posts may be written as English paths
  const html = renderMarkdown(body);
  return { slug, title: data.title ?? slug, description: data.description ?? "", date: data.date ?? "", author: data.author ?? "", html };
}

function formatDate(lang: Lang, iso: string) {
  if (!iso) return "";
  return new Intl.DateTimeFormat(lang === "es" ? "es-ES" : "en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${iso}T12:00:00Z`));
}

export function blogIndexMetadata(lang: Lang) {
  const c = copy[lang];
  return pageMetadata({ lang, path: "/blog", title: c.eyebrow, description: c.lead });
}

export function BlogIndexPage({ lang }: { lang: Lang }) {
  const c = copy[lang];
  const posts = blogSlugs()
    .map((s) => getPost(lang, s))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  return (
    <>
      <PageHero eyebrow={c.eyebrow} line1={c.line1} line2={c.line2} lead={c.lead} />
      <Section>
        <div className="mx-auto grid max-w-[1000px] gap-4 md:grid-cols-3">
          {posts.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.06} className="h-full">
              <Link href={localize(`/blog/${p.slug}`, lang)} className="group surface flex h-full flex-col rounded-2xl p-6 transition-colors duration-300 hover:border-white/[0.14]">
                <p className="font-mono text-[0.72rem] tracking-[0.04em] text-white/45">{formatDate(lang, p.date)}</p>
                <h2 className="mt-3 text-[1.15rem] leading-snug font-semibold text-white">{p.title}</h2>
                <p className="mt-2 flex-1 text-[0.88rem] leading-relaxed text-white/55">{p.description}</p>
                <span className="mt-6 inline-flex items-center gap-1 text-[0.85rem] font-medium text-white/70 transition-colors group-hover:text-white">
                  {c.read}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>
      <CtaBand line1={c.cta[0]} line2={c.cta[1]} body={dictionaries[lang].cta.sentence} />
    </>
  );
}

export function blogPostMetadata(lang: Lang, slug: string) {
  const p = getPost(lang, slug);
  return pageMetadata({ lang, path: `/blog/${slug}`, title: p.title, description: p.description });
}

export function BlogPostPage({ lang, slug }: { lang: Lang; slug: string }) {
  const c = copy[lang];
  const p = getPost(lang, slug);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: p.title,
    description: p.description,
    datePublished: p.date,
    inLanguage: lang,
    author: { "@type": "Organization", name: p.author },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <article className="relative overflow-x-clip pt-32 pb-10 sm:pt-40">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 h-[480px] w-[760px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(190,20,40,0.2),transparent)] blur-2xl"
        />
        <div className="container-page relative max-w-[720px]">
          <Link href={localize("/blog", lang)} className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white">
            <ArrowLeft className="h-4 w-4" aria-hidden /> {c.back}
          </Link>
          <Reveal>
            <p className="mt-10 font-mono text-[0.72rem] tracking-[0.04em] text-white/45">
              {formatDate(lang, p.date)} · {p.author}
            </p>
            <h1 className="mt-3 text-[2.2rem] leading-[1.1] font-semibold tracking-[-0.025em] text-balance sm:text-[2.8rem]">{p.title}</h1>
            <p className="mt-5 text-[1.08rem] leading-relaxed text-white/60">{p.description}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="prose-mg mt-12" dangerouslySetInnerHTML={{ __html: p.html }} />
          </Reveal>
        </div>
      </article>
      <CtaBand line1={c.cta[0]} line2={c.cta[1]} body={dictionaries[lang].cta.sentence} />
    </>
  );
}
