"use client";

import { Play } from "lucide-react";
import { track } from "@/lib/analytics";
import { useLang } from "@/lib/language";
import { siteConfig } from "@/lib/site";

/**
 * The product video: never autoplays with sound, captions in both languages,
 * a poster until it plays. Until the video is hosted (siteConfig.video.src),
 * a poster card with the given caption stands in.
 */
export function VideoBlock({ title, pending }: { title: string; pending: string }) {
  const lang = useLang();
  const v = siteConfig.video;

  if (!v.src) {
    return (
      <figure className="surface relative mx-auto grid aspect-video max-w-4xl place-items-center overflow-hidden rounded-2xl">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_45%,rgba(190,20,40,0.22),transparent_70%)]"
        />
        <div className="relative text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-white/15 bg-white/[0.06]">
            <Play className="ml-0.5 h-6 w-6 text-white/80" aria-hidden />
          </span>
          <figcaption className="mt-4 text-[0.95rem] font-medium text-white">{title}</figcaption>
          <p className="mt-1 text-[0.82rem] text-white/50">{pending}</p>
        </div>
      </figure>
    );
  }

  return (
    <figure className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-white/[0.08] bg-black">
      <video
        controls
        playsInline
        preload="none"
        poster={v.poster || undefined}
        className="block aspect-video w-full"
        onPlay={() => track("video_play")}
        aria-label={title}
      >
        <source src={v.src} type="video/mp4" />
        {v.captionsEn && <track kind="captions" src={v.captionsEn} srcLang="en" label="English" default={lang === "en"} />}
        {v.captionsEs && <track kind="captions" src={v.captionsEs} srcLang="es" label="Español" default={lang === "es"} />}
      </video>
      <figcaption className="sr-only">{title}</figcaption>
    </figure>
  );
}
