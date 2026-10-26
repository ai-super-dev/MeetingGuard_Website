"use client";

/*
 * Stand-in screens for flows that have no exported screenshot yet (voice,
 * confirm card, agenda, morning summary, tasks, Android permission). They use
 * the app's dark theme; swap each for Dusko's real screenshot through
 * PhoneShot's `image` prop when it arrives.
 */

import type { ReactNode } from "react";
import { ArrowLeft, Check, Clock, Keyboard, ListChecks, Lock, Mic, Sun, Users, Video, Volume2 } from "lucide-react";
import { AppMark } from "@/components/ui/Logo";
import { useT } from "@/lib/language";
import { Screen } from "./Device";
import { SHOT_H } from "./PhoneShot";
import { APP } from "./screens";

function Bar({ title, back = true }: { title: string; back?: boolean }) {
  return (
    <div className="mt-[14px] flex items-center gap-[12px] border-b px-[16px] pb-[12px]" style={{ borderColor: APP.line }}>
      {back ? <ArrowLeft className="h-[22px] w-[22px]" style={{ color: APP.text }} aria-hidden /> : <AppMark className="h-[26px] w-[26px]" sizes="52px" />}
      <span className="flex-1 text-[20px] font-medium" style={{ color: APP.text }}>
        {title}
      </span>
    </div>
  );
}

function Waves({ count = 26, color = APP.accent, height = 46 }: { count?: number; color?: string; height?: number }) {
  return (
    <span className="flex items-center gap-[4px]" style={{ height }} aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="w-[4px] rounded-full"
          style={{ height: "100%", background: color, opacity: 0.85, animation: `listen-bar 1s ease-in-out ${(i % 7) * 0.12}s infinite` }}
        />
      ))}
    </span>
  );
}

/** Say it: the assistant listening, with the transcript. */
export function VoiceScreen({ height = SHOT_H, time = "16:12" }: { height?: number; time?: string }) {
  const s = useT().screens;
  return (
    <Screen className="bg-[#0e1524]" time={time} height={height}>
      <Bar title="MeetingGuard" back={false} />
      <div className="flex flex-col items-center px-[22px] pt-[70px] text-center">
        <span className="relative grid h-[120px] w-[120px] place-items-center">
          <span className="absolute inset-0 rounded-full bg-[#b3b7ff]/15 [animation:glow-pulse_1.6s_ease-in-out_infinite]" />
          <span className="relative grid h-[92px] w-[92px] place-items-center rounded-full" style={{ background: APP.accent, color: APP.ink }}>
            <Mic className="h-[40px] w-[40px]" aria-hidden />
          </span>
        </span>
        <p className="mt-[22px] text-[15px] font-medium" style={{ color: APP.accent }}>
          {s.listening}
        </p>
        <div className="mt-[14px]">
          <Waves />
        </div>
        <p className="mt-[34px] text-[24px] leading-snug font-medium" style={{ color: APP.text }}>
          &quot;{s.spoken}&quot;
        </p>
      </div>
      <span
        className="absolute inset-x-[90px] bottom-[44px] flex h-[46px] items-center justify-center gap-[8px] rounded-full border text-[15px]"
        style={{ borderColor: APP.line, color: APP.muted }}
      >
        <Keyboard className="h-[18px] w-[18px]" aria-hidden />
        {s.typeInstead}
      </span>
    </Screen>
  );
}

function Row({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-center gap-[12px] border-t px-[16px] py-[13px] text-[16px]" style={{ borderColor: APP.line, color: APP.text }}>
      <span style={{ color: APP.muted }}>{icon}</span>
      {children}
    </div>
  );
}

/** Confirm it: the card with what was understood. */
export function ConfirmScreen({ height = SHOT_H, time = "16:12", confirmed = false }: { height?: number; time?: string; confirmed?: boolean }) {
  const t = useT();
  const s = t.screens;
  return (
    <Screen className="bg-[#0e1524]" time={time} height={height}>
      <Bar title={s.cardTitle} />
      <div className="px-[14px] pt-[18px]">
        <div className="overflow-hidden rounded-[18px] border" style={{ background: APP.card, borderColor: APP.accent, boxShadow: "0 0 24px rgba(179,183,255,0.25)" }}>
          <p className="px-[16px] pt-[16px] pb-[14px] text-[24px] font-bold" style={{ color: APP.text }}>
            {t.alarm.title}
          </p>
          <Row icon={<Clock className="h-[18px] w-[18px]" aria-hidden />}>{s.cardWhen}</Row>
          <Row icon={<Users className="h-[18px] w-[18px]" aria-hidden />}>{s.cardWith}</Row>
          <Row icon={<Video className="h-[18px] w-[18px]" aria-hidden />}>{s.cardLink}</Row>
          <Row icon={<ListChecks className="h-[18px] w-[18px]" aria-hidden />}>{s.cardTask}</Row>
        </div>
        <p className="mt-[16px] flex items-center justify-center gap-[8px] text-[14px]" style={{ color: APP.muted }}>
          <Lock className="h-[15px] w-[15px]" aria-hidden />
          {s.notSaved}
        </p>
      </div>
      <div className="absolute inset-x-[14px] bottom-[44px] grid grid-cols-2 gap-[10px] text-[16px] font-semibold">
        <span className="flex h-[50px] items-center justify-center rounded-full border" style={{ borderColor: APP.line, color: APP.text }}>
          {s.edit}
        </span>
        <span
          className="flex h-[50px] items-center justify-center gap-[8px] rounded-full transition-colors duration-500"
          style={{ background: confirmed ? "#1f9d6a" : APP.accent, color: confirmed ? "#fff" : APP.ink }}
        >
          {confirmed && <Check className="h-[18px] w-[18px]" strokeWidth={3} aria-hidden />}
          {s.confirm}
        </span>
      </div>
    </Screen>
  );
}

function AgendaGroup({ title, items, tone, reading }: { title: string; items: readonly string[]; tone?: string; reading?: number }) {
  return (
    <div className="mt-[16px]">
      <p className="text-[13px] font-semibold tracking-wide uppercase" style={{ color: tone ?? APP.muted }}>
        {title}
      </p>
      <div className="mt-[8px] space-y-[8px]">
        {items.map((item, i) => (
          <p
            key={item}
            className="rounded-[12px] border px-[14px] py-[11px] text-[16px] transition-colors duration-500"
            style={{
              background: reading === i ? "rgba(179,183,255,0.14)" : APP.card,
              borderColor: reading === i ? APP.accent : APP.line,
              color: APP.text,
            }}
          >
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

/** Agenda aloud: today, overdue and tomorrow, with the line being read highlighted. */
export function AgendaScreen({ height = SHOT_H, time = "8:00" }: { height?: number; time?: string }) {
  const s = useT().screens;
  return (
    <Screen className="bg-[#0e1524]" time={time} height={height}>
      <Bar title={s.agendaTitle} />
      <div className="px-[14px] pt-[14px]">
        <span className="inline-flex items-center gap-[10px] rounded-full px-[14px] py-[8px] text-[14px] font-medium" style={{ background: APP.chip, color: APP.accent }}>
          <Volume2 className="h-[16px] w-[16px]" aria-hidden />
          {s.reading}
          <Waves count={8} height={14} />
        </span>
        <AgendaGroup title={s.agendaToday} items={s.agendaItems.today} reading={0} />
        <AgendaGroup title={s.agendaOverdue} items={s.agendaItems.overdue} tone="#ffb4a8" />
        <AgendaGroup title={s.agendaTomorrow} items={s.agendaItems.tomorrow} />
      </div>
    </Screen>
  );
}

/** Morning summary (Android full-screen). */
export function SummaryScreen({ height = SHOT_H, time = "7:30" }: { height?: number; time?: string }) {
  const t = useT();
  const s = t.screens;
  return (
    <Screen className="bg-[radial-gradient(120%_60%_at_50%_0%,#2a2f6b,#0e1524_60%)]" time={time} height={height}>
      <div className="flex flex-col items-center px-[24px] pt-[80px] text-center">
        <Sun className="h-[44px] w-[44px] text-[#ffd9a0]" aria-hidden />
        <p className="mt-[18px] text-[64px] leading-none font-semibold tracking-[-0.02em] text-white">{time}</p>
        <p className="mt-[16px] text-[28px] font-semibold" style={{ color: APP.text }}>
          {s.summaryHello}
        </p>
        <p className="mt-[10px] text-[17px]" style={{ color: APP.muted }}>
          {s.summaryLine}
        </p>
        <div className="mt-[34px] w-full rounded-[18px] border px-[16px] py-[16px] text-left" style={{ background: "rgba(19,27,44,0.85)", borderColor: APP.line }}>
          <p className="flex items-center gap-[10px] text-[16px]" style={{ color: APP.text }}>
            <Clock className="h-[18px] w-[18px]" style={{ color: APP.accent }} aria-hidden />
            {s.summaryFirst}
          </p>
          <div className="mt-[12px]">
            <Waves count={30} height={22} />
          </div>
        </div>
      </div>
      <span
        className="absolute inset-x-[24px] bottom-[44px] flex h-[52px] items-center justify-center rounded-full text-[16px] font-semibold"
        style={{ background: APP.accent, color: APP.ink }}
      >
        {s.summaryStart}
      </span>
    </Screen>
  );
}

/** Tasks list with due dates and linked meetings. */
export function TasksScreen({ height = SHOT_H, time = "9:10", doneFirst = false }: { height?: number; time?: string; doneFirst?: boolean }) {
  const s = useT().screens;
  return (
    <Screen className="bg-[#0e1524]" time={time} height={height}>
      <Bar title={s.tasksTitle} />
      <div className="space-y-[10px] px-[14px] pt-[16px]">
        {s.tasks.map((task, i) => {
          const done = doneFirst && i === 0;
          return (
            <div key={task.title} className="flex gap-[12px] rounded-[14px] border px-[14px] py-[13px]" style={{ background: APP.card, borderColor: APP.line }}>
              <span
                className="mt-[2px] grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full border-2 transition-colors duration-500"
                style={{ borderColor: done ? "#1f9d6a" : APP.muted, background: done ? "#1f9d6a" : "transparent" }}
              >
                {done && <Check className="h-[13px] w-[13px] text-white" strokeWidth={3.5} aria-hidden />}
              </span>
              <div className="min-w-0">
                <p className={`text-[17px] ${done ? "line-through opacity-60" : ""}`} style={{ color: APP.text }}>
                  {task.title}
                </p>
                <div className="mt-[6px] flex flex-wrap gap-[6px] text-[12px]">
                  <span className="rounded-full px-[9px] py-[3px]" style={{ background: APP.chip, color: i === 0 ? "#ffd9a0" : APP.muted }}>
                    {task.due}
                  </span>
                  {task.link && (
                    <span className="flex items-center gap-[4px] rounded-full px-[9px] py-[3px]" style={{ background: APP.chip, color: APP.accent }}>
                      <Video className="h-[11px] w-[11px]" aria-hidden />
                      {task.link}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Screen>
  );
}

/** Android settings page for one permission, with MeetingGuard switched on. */
export function PermissionScreen({ title, label, note, height = SHOT_H }: { title: string; label: string; note: string; height?: number }) {
  return (
    <Screen className="bg-[#111318]" time="9:41" height={height}>
      <div className="mt-[14px] flex items-center gap-[14px] px-[18px] pb-[18px]">
        <ArrowLeft className="h-[22px] w-[22px] text-white/80" aria-hidden />
      </div>
      <p className="px-[24px] text-[34px] leading-tight text-white">{title}</p>
      <div className="mx-[16px] mt-[30px] flex items-center gap-[14px] rounded-[22px] bg-[#1c1f26] px-[18px] py-[18px]">
        <AppMark className="h-[34px] w-[34px]" sizes="68px" />
        <span className="flex-1 text-[17px] text-white">{label}</span>
        <span className="relative h-[30px] w-[52px] rounded-full bg-[#a8c7fa]">
          <span className="absolute top-[3px] right-[3px] grid h-[24px] w-[24px] place-items-center rounded-full bg-[#062e6f]">
            <Check className="h-[14px] w-[14px] text-[#a8c7fa]" strokeWidth={3} aria-hidden />
          </span>
        </span>
      </div>
      <p className="px-[24px] pt-[18px] text-[15px] leading-relaxed text-white/60">{note}</p>
    </Screen>
  );
}
