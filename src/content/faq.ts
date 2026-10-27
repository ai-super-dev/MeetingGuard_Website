import type { Lang } from "@/lib/routes";
import type { FaqItem } from "@/components/page/FaqAccordion";

/* The five questions shown on the home page, in English and Spanish. */

export const faq: Record<Lang, FaqItem[]> = {
  en: [
    {
      q: "What is MeetingGuard?",
      a: "An AI meeting assistant for iPhone and Android. You say or type what you need, confirm the card, and a full-screen alarm makes sure you show up.",
    },
    {
      q: "Is MeetingGuard free?",
      a: "Yes, there is a free plan. Pro and Premium add more, and you can try them free for 3 days.",
    },
    {
      q: "Will the alarm ring if the app is closed?",
      a: "Yes. Alarms are scheduled on your phone, ring with the app closed and are set again after a restart.",
    },
    {
      q: "Which languages does it speak?",
      a: "English and Spanish, by voice and by text. You can switch at any time.",
    },
    {
      q: "Does MeetingGuard record my meetings?",
      a: "No. MeetingGuard never records meetings. The coming debrief feature reads the summary your notetaker already sends.",
    },
  ],
  es: [
    {
      q: "¿Qué es MeetingGuard?",
      a: "Un asistente de reuniones con IA para iPhone y Android. Dices o escribes lo que necesitas, confirmas la tarjeta y una alarma a pantalla completa se asegura de que llegues.",
    },
    {
      q: "¿MeetingGuard es gratis?",
      a: "Sí, hay un plan gratuito. Pro y Premium añaden más, y puedes probarlos gratis durante 3 días.",
    },
    {
      q: "¿La alarma suena con la app cerrada?",
      a: "Sí. Las alarmas se programan en tu teléfono, suenan con la app cerrada y se vuelven a programar tras un reinicio.",
    },
    {
      q: "¿Qué idiomas habla?",
      a: "Inglés y español, por voz y por texto. Puedes cambiar cuando quieras.",
    },
    {
      q: "¿MeetingGuard graba mis reuniones?",
      a: "No. MeetingGuard nunca graba reuniones. La función de resúmenes que llega lee el resumen que tu herramienta de notas ya envía.",
    },
  ],
};
