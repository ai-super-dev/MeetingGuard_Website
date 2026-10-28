"use client";

import { useEffect, useState, type FormEvent } from "react";
import { CalendarClock, CheckCircle2, Clock, ExternalLink, Video, XCircle } from "lucide-react";
import { hostOf } from "@/components/agenda/Calendar";
import { BareFrame } from "@/components/agenda/Frame";
import { Button, Field, inputClass, Spinner } from "@/components/agenda/ui";
import { useNow } from "@/lib/agenda/hooks";
import { useA } from "@/lib/agenda/i18n";
import { answerInvite, getInvite, type Invite } from "@/lib/agenda/store";
import { dayKey, deviceZone, fmtDay, fmtDuration, fmtRange, fromZoned, isDayKey, isTimeKey, timeKey, zoneLabel, MINUTE } from "@/lib/agenda/time";
import type { InviteAnswer } from "@/lib/agenda/types";
import { useHref, useLang } from "@/lib/language";

/**
 * The page a guest opens from an invitation link (Dusko's M15). No account
 * and no app: accept, decline or propose another time. The token comes from
 * `?t=` (or from /invite/<token> once hosting rewrites that path here).
 */
export function InvitePage() {
  const href = useHref();
  return (
    <BareFrame logoHref={href("/")}>
      <Guest />
    </BareFrame>
  );
}

function readToken() {
  if (typeof window === "undefined") return "";
  const fromQuery = new URLSearchParams(window.location.search).get("t");
  const fromPath = window.location.pathname.match(/\/invite\/([^/]+)/)?.[1];
  return (fromQuery ?? fromPath ?? "").trim();
}

function Guest() {
  const a = useA();
  const lang = useLang();
  const [invite, setInvite] = useState<Invite | null | "expired" | "loading">("loading");

  useEffect(() => {
    let live = true;
    getInvite(readToken(), lang).then((result) => {
      if (live) setInvite(result);
    });
    return () => {
      live = false;
    };
  }, [lang]);

  if (invite === "loading") return <Spinner label={a.invite.loading} />;
  if (invite === null || invite === "expired") {
    return (
      <div className="surface w-full max-w-[440px] rounded-2xl p-7 text-center">
        <XCircle className="mx-auto h-10 w-10 text-white/35" aria-hidden />
        <h1 className="mt-4 text-[1.2rem] font-semibold">{a.invite.title}</h1>
        <p className="mt-2 text-[0.92rem] text-white/65">{invite === "expired" ? a.invite.expired : a.invite.invalid}</p>
      </div>
    );
  }
  return <InviteCard invite={invite} onAnswered={(answer) => setInvite({ ...invite, answer })} />;
}

function InviteCard({ invite, onAnswered }: { invite: Invite; onAnswered: (answer: InviteAnswer | null) => void }) {
  const a = useA();
  const lang = useLang();
  const href = useHref();
  const now = useNow();
  const zone = deviceZone();
  const start = new Date(invite.start);
  const end = new Date(invite.end);
  const length = end.getTime() - start.getTime();
  const [proposing, setProposing] = useState(false);
  const [date, setDate] = useState(dayKey(start, zone));
  const [time, setTime] = useState(timeKey(start, zone));
  const [note, setNote] = useState("");
  const [error, setError] = useState<{ date?: string; time?: string }>({});
  const [busy, setBusy] = useState<"" | InviteAnswer["kind"]>("");

  const send = async (answer: InviteAnswer) => {
    setBusy(answer.kind);
    try {
      await answerInvite(invite.token, answer);
      onAnswered(answer);
      setProposing(false);
    } finally {
      setBusy("");
    }
  };

  const propose = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof error = {};
    if (!isDayKey(date)) next.date = "badDate";
    if (!isTimeKey(time)) next.time = "badTime";
    const at = next.date || next.time ? null : fromZoned(date, time, zone);
    if (at && at.getTime() < now) next.time = "inPast";
    setError(next);
    if (!at || Object.keys(next).length) return;
    void send({ kind: "propose", start: at.toISOString(), end: new Date(at.getTime() + length).toISOString(), note: note.trim() });
  };

  const answered = invite.answer;
  return (
    <div className="w-full max-w-[480px]">
      <article className="surface overflow-hidden rounded-2xl">
        <div className="border-b border-white/[0.07] px-6 py-5 sm:px-7">
          <p className="text-[0.85rem] text-white/60">{a.invite.from(invite.organizer)}</p>
          <h1 className="mt-1.5 text-[1.45rem] leading-tight font-semibold tracking-[-0.02em]">{invite.title}</h1>
        </div>
        <dl className="space-y-3 px-6 py-5 text-[0.92rem] sm:px-7">
          <div className="flex gap-3">
            <dt className="sr-only">{a.details.when}</dt>
            <CalendarClock className="mt-0.5 h-[18px] w-[18px] shrink-0 text-white/45" aria-hidden />
            <dd>
              <span className="block first-letter:uppercase">{fmtDay(dayKey(start, zone), lang)}</span>
              <span className="block text-white/70">{fmtRange(start, end, lang, zone)}</span>
              <span className="mt-0.5 block text-[0.76rem] text-white/45">{a.invite.yourZone(zoneLabel(zone, start, lang))}</span>
            </dd>
          </div>
          <div className="flex gap-3">
            <dt className="sr-only">{a.details.duration}</dt>
            <Clock className="mt-0.5 h-[18px] w-[18px] shrink-0 text-white/45" aria-hidden />
            <dd>{fmtDuration(Math.round(length / MINUTE))}</dd>
          </div>
          {invite.videoUrl && (
            <div className="flex gap-3">
              <dt className="sr-only">{a.details.videoCall}</dt>
              <Video className="mt-0.5 h-[18px] w-[18px] shrink-0 text-white/45" aria-hidden />
              <dd>
                <a href={invite.videoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:underline">
                  {hostOf(invite.videoUrl)}
                  <ExternalLink className="h-3.5 w-3.5 text-white/45" aria-hidden />
                </a>
              </dd>
            </div>
          )}
        </dl>

        <div className="border-t border-white/[0.07] px-6 py-5 sm:px-7">
          {answered && !proposing ? (
            <div role="status">
              <p className="flex items-start gap-2.5 text-[0.95rem]">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#1fa37a]" aria-hidden />
                {answered.kind === "accept" ? a.invite.accepted(invite.organizer) : answered.kind === "decline" ? a.invite.declined(invite.organizer) : a.invite.proposed(invite.organizer)}
              </p>
              {answered.kind === "propose" && (
                <p className="mt-2 ml-7 text-[0.85rem] text-white/60">
                  {fmtDay(dayKey(new Date(answered.start), zone), lang, { weekday: "long", day: "numeric", month: "long" })}, {fmtRange(new Date(answered.start), new Date(answered.end), lang, zone)}
                </p>
              )}
              <Button variant="ghost" className="mt-3 -ml-3" onClick={() => onAnswered(null)}>
                {a.invite.change}
              </Button>
            </div>
          ) : proposing ? (
            <form onSubmit={propose} noValidate className="space-y-4">
              <p className="text-[0.9rem] text-white/70">{a.invite.proposeLead(invite.organizer)}</p>
              <div className="grid grid-cols-2 gap-3">
                <Field label={a.move.date} error={error.date}>
                  {(p) => <input {...p} type="date" className={inputClass} value={date} onChange={(e) => setDate(e.target.value)} autoFocus />}
                </Field>
                <Field label={a.move.start} error={error.time}>
                  {(p) => <input {...p} type="time" className={inputClass} value={time} onChange={(e) => setTime(e.target.value)} />}
                </Field>
              </div>
              <Field label={a.invite.note}>
                {(p) => <textarea {...p} rows={2} maxLength={300} className={`${inputClass} h-auto py-2`} value={note} onChange={(e) => setNote(e.target.value)} placeholder={a.invite.notePlaceholder} />}
              </Field>
              <div className="flex flex-wrap justify-end gap-2">
                <Button onClick={() => setProposing(false)}>{a.common.back}</Button>
                <Button variant="primary" type="submit" busy={busy === "propose"}>
                  {a.invite.send}
                </Button>
              </div>
            </form>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="primary" className="h-11" busy={busy === "accept"} disabled={!!busy} onClick={() => send({ kind: "accept" })}>
                  {a.invite.accept}
                </Button>
                <Button className="h-11" busy={busy === "decline"} disabled={!!busy} onClick={() => send({ kind: "decline" })}>
                  {a.invite.decline}
                </Button>
              </div>
              <Button variant="ghost" className="mt-2 h-11 w-full" disabled={!!busy} onClick={() => setProposing(true)}>
                {a.invite.propose}
              </Button>
              <p className="mt-3 text-center text-[0.78rem] text-white/45">{a.invite.noApp}</p>
            </>
          )}
        </div>
      </article>
      <p className="mt-5 text-center text-[0.8rem] text-white/45">
        {a.invite.sentWith} ·{" "}
        <a href={`${href("/")}#download`} className="text-white/70 hover:text-white hover:underline">
          {a.invite.getApp}
        </a>
      </p>
    </div>
  );
}
