import { SendLinkForm } from "@/components/forms/Forms";
import { Reveal } from "@/components/motion";
import { Card, PageHero, Section } from "@/components/page/blocks";
import { DownloadChoice } from "@/components/page/DownloadChoice";
import { QrSvg } from "@/components/ui/QrDownload";
import { localize, type Lang } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

const copy = {
  en: {
    meta: { title: "Download", description: "Get MeetingGuard for iPhone or Android. Free to start." },
    eyebrow: "Download",
    line1: "Get MeetingGuard.",
    line2: "Free to start.",
    lead: "For iPhone and Android, in English and Spanish.",
    qr: { title: "On a computer?", body: "Scan with your phone's camera to open this page there." },
    email: { title: "Or send yourself the link", body: "We email you the link once. Nothing else.", done: "Sent. Check your inbox on your phone." },
    other: "Also available on",
  },
  es: {
    meta: { title: "Descargar", description: "Descarga MeetingGuard para iPhone o Android. Gratis para empezar." },
    eyebrow: "Descargar",
    line1: "Descarga MeetingGuard.",
    line2: "Gratis para empezar.",
    lead: "Para iPhone y Android, en inglés y español.",
    qr: { title: "¿Estás en un ordenador?", body: "Escanéalo con la cámara de tu teléfono para abrir esta página allí." },
    email: { title: "O envíate el enlace", body: "Te enviamos el enlace una vez. Nada más.", done: "Enviado. Revisa tu correo en el teléfono." },
    other: "También disponible en",
  },
} as const;

export function downloadMetadata(lang: Lang) {
  const c = copy[lang];
  return pageMetadata({ lang, path: "/download", title: c.meta.title, description: c.meta.description });
}

/**
 * The URL used in WhatsApp messages and ads: detects the platform and shows
 * one big badge for the right store; desktop visitors get a QR code and the
 * option to email themselves the link.
 */
export function DownloadPage({ lang }: { lang: Lang }) {
  const c = copy[lang];
  return (
    <>
      <PageHero eyebrow={c.eyebrow} line1={c.line1} line2={c.line2} lead={c.lead}>
        <DownloadChoice otherLabel={c.other} />
      </PageHero>
      <Section className="pt-0 pb-24 sm:pt-0 sm:pb-32">
        <div className="mx-auto grid max-w-[880px] gap-4 md:grid-cols-[auto_1fr]">
          <Reveal>
            <Card className="flex h-full flex-col items-center text-center md:w-[260px]">
              <QrSvg value={`${siteConfig.url}${localize("/download", lang)}`} className="h-40 w-40 rounded-lg" />
              <h2 className="mt-5 font-semibold text-white">{c.qr.title}</h2>
              <p className="mt-1.5 text-[0.86rem] leading-relaxed text-white/55">{c.qr.body}</p>
            </Card>
          </Reveal>
          <Reveal delay={0.08}>
            <Card className="flex h-full flex-col justify-center">
              <h2 className="font-semibold text-white">{c.email.title}</h2>
              <p className="mt-1.5 text-[0.88rem] text-white/55">{c.email.body}</p>
              <div className="mt-5">
                <SendLinkForm done={c.email.done} />
              </div>
            </Card>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
