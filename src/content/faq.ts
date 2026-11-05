import type { Lang } from "@/lib/routes";
import type { FaqItem } from "@/components/page/FaqAccordion";

/* The questions shown on the home page, in English and Spanish. */

export const faq: Record<Lang, FaqItem[]> = {
  en: [
    {
      q: "What is Meeting Guard AI?",
      a: "An AI meeting assistant for iPhone and Android. You say or type what you need, confirm the card, and a full-screen alarm makes sure you show up.",
    },
    {
      q: "Is Meeting Guard AI free?",
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
      q: "Does Meeting Guard AI record my meetings?",
      a: "No. Meeting Guard AI never records meetings. After a meeting you can tell the app how it went in a short spoken debrief, and it turns what was agreed into tasks.",
    },
    {
      q: "How does the debrief after a meeting work?",
      a: "Five minutes after a meeting ends, the app sends a notification asking how it went (you can turn this off in the alert settings). Tap Debrief there, or Debrief this meeting in the meeting's details, then say or type what was agreed: who does what and by when, in up to 60 seconds. The AI proposes one task per commitment, linked to the meeting, and nothing is saved until you confirm each one. A debrief counts as one AI assistant request.",
    },
    {
      q: "Do tasks sync both ways with Google Tasks and Microsoft To Do?",
      a: "Yes. Tasks you add, change, complete or delete in Google Tasks or Microsoft To Do change in Meeting Guard AI, and the other way round. You choose a list for each service in the app. Google Tasks keeps the due date but not the time; To Do needs Outlook connected first. Repeating tasks don't sync.",
    },
    {
      q: "Where are meeting notes and attachments kept?",
      a: "Your notes for a meeting are private, sync to your other devices and the web agenda, and are never sent to the AI. Attachments (documents, photos, audio and more, up to 50 MB each) stay on the phone where you added them: they aren't uploaded, don't sync to your other devices and aren't shared with participants.",
    },
  ],
  es: [
    {
      q: "¿Qué es Meeting Guard AI?",
      a: "Un asistente de reuniones con IA para iPhone y Android. Dices o escribes lo que necesitas, confirmas la tarjeta y una alarma a pantalla completa se asegura de que llegues.",
    },
    {
      q: "¿Meeting Guard AI es gratis?",
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
      q: "¿Meeting Guard AI graba mis reuniones?",
      a: "No. Meeting Guard AI nunca graba reuniones. Después de una reunión puedes contarle a la app cómo fue en un breve resumen hablado, y convierte lo acordado en tareas.",
    },
    {
      q: "¿Cómo funciona el resumen después de una reunión?",
      a: "Cinco minutos después de terminar una reunión, la app te envía una notificación preguntando qué tal fue (puedes desactivarla en los ajustes de alertas). Toca Resumen ahí, o Resumir esta reunión en los detalles de la reunión, y di o escribe lo acordado: quién hace qué y para cuándo, en hasta 60 segundos. La IA propone una tarea por cada compromiso, vinculada a la reunión, y no se guarda nada hasta que confirmas cada una. Un resumen cuenta como una consulta al asistente de IA.",
    },
    {
      q: "¿Las tareas se sincronizan en ambos sentidos con Google Tasks y Microsoft To Do?",
      a: "Sí. Las tareas que añades, cambias, completas o eliminas en Google Tasks o Microsoft To Do cambian en Meeting Guard AI, y al revés. En la app eliges una lista para cada servicio. Google Tasks guarda la fecha límite pero no la hora; To Do necesita Outlook conectado primero. Las tareas repetitivas no se sincronizan.",
    },
    {
      q: "¿Dónde se guardan las notas y los archivos adjuntos de las reuniones?",
      a: "Tus notas de una reunión son privadas, se sincronizan con tus otros dispositivos y con la agenda web, y nunca se envían a la IA. Los archivos adjuntos (documentos, fotos, audio y más, de hasta 50 MB cada uno) se quedan en el teléfono donde los añadiste: no se suben, no se sincronizan con tus otros dispositivos y no se comparten con los participantes.",
    },
  ],
};
