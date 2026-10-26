import { monthName } from "@/lib/i18n";
import { localize, type Lang } from "@/lib/routes";
import { availability, siteConfig } from "@/lib/site";

/*
 * The FAQ: twenty questions in six groups. Answers stay short and link to the
 * page with the detail. HOME_FAQ picks the five shown on the home page.
 */

type Item = { id: string; q: string; a: string; link?: { path: string; label: string } };
type Group = { id: string; title: string; items: Item[] };

const month = (lang: Lang, m: keyof typeof availability) => monthName(lang, availability[m]);

const en: Group[] = [
  {
    id: "start",
    title: "Getting started",
    items: [
      {
        id: "what",
        q: "What is MeetingGuard?",
        a: "An AI meeting assistant for iPhone and Android. You say or type what you need, confirm the card, and a full-screen alarm makes sure you show up.",
        link: { path: "/how-it-works", label: "How it works" },
      },
      {
        id: "free",
        q: "Is MeetingGuard free?",
        a: "Yes, there is a free plan. Pro and Premium add more, and you can try them free for 3 days.",
        link: { path: "/pricing", label: "See pricing" },
      },
      {
        id: "calendars",
        q: "Which calendars does it work with?",
        a: `Google Calendar today. Outlook arrives in ${month("en", "outlook")}, then Microsoft To Do and Google Tasks.`,
        link: { path: "/features/integrations", label: "Calendars and tasks" },
      },
      {
        id: "languages",
        q: "Which languages does it speak?",
        a: "English and Spanish, by voice and by text. You can switch at any time.",
        link: { path: "/features/voice-assistant", label: "Voice assistant" },
      },
    ],
  },
  {
    id: "voice",
    title: "Voice",
    items: [
      {
        id: "create",
        q: "How do I create a meeting by voice?",
        a: 'Tap the microphone and say it in plain words, for example "Lunch with Ana Friday at 1". Check the card and confirm.',
        link: { path: "/features/voice-assistant", label: "Voice assistant" },
      },
      {
        id: "wrong",
        q: "What if it gets something wrong?",
        a: "Fix it by typing on the card before you confirm. Nothing is saved until you confirm.",
      },
      {
        id: "move",
        q: "Can it move or cancel meetings?",
        a: "Yes. Say which meeting and the new time. If more than one meeting matches, it asks which one before it changes anything.",
      },
      {
        id: "task",
        q: "Can one sentence create a meeting and a task?",
        a: 'Yes. "Call with Mia Thursday at 3, remind me to send the contract before" gives you a meeting and a task, linked.',
        link: { path: "/features/tasks", label: "Tasks and reminders" },
      },
    ],
  },
  {
    id: "alarms",
    title: "Alarms",
    items: [
      {
        id: "closed",
        q: "Will the alarm ring if the app is closed?",
        a: "Yes. Alarms are scheduled on your phone, ring with the app closed and are set again after a restart.",
        link: { path: "/features/alarms", label: "Alarms" },
      },
      {
        id: "permissions",
        q: "Why does Android ask for extra permissions?",
        a: "Android 14 and later need you to allow full-screen notifications and alarms. The app shows you the exact switch, step by step.",
        link: { path: "/features/alarms", label: "The permission steps" },
      },
      {
        id: "iphone",
        q: "Does it work the same on iPhone?",
        a: "Alarms and the voice assistant work on both. A few things differ, for example the full-screen morning summary is Android only.",
        link: { path: "/how-it-works", label: "iPhone and Android" },
      },
    ],
  },
  {
    id: "whatsapp",
    title: "WhatsApp",
    items: [
      {
        id: "link",
        q: "How do I link WhatsApp?",
        a: `In the app, open WhatsApp, tap Generate code and send the code to our business number, ${siteConfig.whatsappNumberRaw}.`,
        link: { path: "/features/whatsapp", label: "WhatsApp" },
      },
      {
        id: "unsolicited",
        q: "Will you send me messages I didn't ask for?",
        a: "No. MeetingGuard only replies to messages you send. No marketing and no unsolicited messages.",
      },
      {
        id: "what-whatsapp",
        q: "What can I do by WhatsApp?",
        a: "Create meetings and tasks by message, ask what is on your agenda, and confirm with the buttons in the chat.",
      },
    ],
  },
  {
    id: "billing",
    title: "Billing",
    items: [
      {
        id: "subscribe",
        q: "How do I subscribe?",
        a: "Inside the app, through Google Play or the App Store. There is no checkout on this website.",
        link: { path: "/pricing", label: "Pricing" },
      },
      {
        id: "cancel",
        q: "How do I cancel?",
        a: "In your Google Play or App Store subscriptions. Your plan stays active until the end of the period you paid for.",
      },
      {
        id: "restore",
        q: "I changed phones. How do I get my plan back?",
        a: "Sign in with the same account on the new phone and restore your purchase from the store. Your plan comes back with it.",
      },
    ],
  },
  {
    id: "privacy",
    title: "Privacy",
    items: [
      {
        id: "record",
        q: "Does MeetingGuard record my meetings?",
        a: "No. MeetingGuard never records meetings. The coming debrief feature reads the summary your notetaker already sends.",
        link: { path: "/security", label: "Security and privacy" },
      },
      {
        id: "sell",
        q: "Do you sell my data or show ads?",
        a: "No. There are no ads and we never sell your data.",
        link: { path: "/security", label: "Security and privacy" },
      },
      {
        id: "delete",
        q: "How do I delete my account?",
        a: `In the app, or by email to ${siteConfig.supportEmail}. Your data is deleted with it.`,
        link: { path: "/delete-account", label: "Delete your account" },
      },
    ],
  },
];

const es: Group[] = [
  {
    id: "start",
    title: "Primeros pasos",
    items: [
      {
        id: "what",
        q: "¿Qué es MeetingGuard?",
        a: "Un asistente de reuniones con IA para iPhone y Android. Dices o escribes lo que necesitas, confirmas la tarjeta y una alarma a pantalla completa se asegura de que llegues.",
        link: { path: "/how-it-works", label: "Cómo funciona" },
      },
      {
        id: "free",
        q: "¿MeetingGuard es gratis?",
        a: "Sí, hay un plan gratuito. Pro y Premium añaden más, y puedes probarlos gratis durante 3 días.",
        link: { path: "/pricing", label: "Ver precios" },
      },
      {
        id: "calendars",
        q: "¿Con qué calendarios funciona?",
        a: `Con Google Calendar desde hoy. Outlook llega en ${month("es", "outlook")}, y después Microsoft To Do y Google Tasks.`,
        link: { path: "/features/integrations", label: "Calendarios y tareas" },
      },
      {
        id: "languages",
        q: "¿Qué idiomas habla?",
        a: "Inglés y español, por voz y por texto. Puedes cambiar cuando quieras.",
        link: { path: "/features/voice-assistant", label: "Asistente de voz" },
      },
    ],
  },
  {
    id: "voice",
    title: "Voz",
    items: [
      {
        id: "create",
        q: "¿Cómo creo una reunión con la voz?",
        a: 'Toca el micrófono y dilo con tus palabras, por ejemplo "Comida con Ana el viernes a la 1". Revisa la tarjeta y confirma.',
        link: { path: "/features/voice-assistant", label: "Asistente de voz" },
      },
      {
        id: "wrong",
        q: "¿Y si entiende algo mal?",
        a: "Corrígelo escribiendo en la tarjeta antes de confirmar. No se guarda nada hasta que confirmas.",
      },
      {
        id: "move",
        q: "¿Puede mover o cancelar reuniones?",
        a: "Sí. Di qué reunión y la nueva hora. Si hay más de una que coincide, te pregunta cuál antes de cambiar nada.",
      },
      {
        id: "task",
        q: "¿Una frase puede crear una reunión y una tarea?",
        a: 'Sí. "Llamada con Mia el jueves a las 3, recuérdame enviar el contrato antes" te da una reunión y una tarea, vinculadas.',
        link: { path: "/features/tasks", label: "Tareas y recordatorios" },
      },
    ],
  },
  {
    id: "alarms",
    title: "Alarmas",
    items: [
      {
        id: "closed",
        q: "¿La alarma suena con la app cerrada?",
        a: "Sí. Las alarmas se programan en tu teléfono, suenan con la app cerrada y se vuelven a programar tras un reinicio.",
        link: { path: "/features/alarms", label: "Alarmas" },
      },
      {
        id: "permissions",
        q: "¿Por qué Android pide permisos adicionales?",
        a: "Android 14 y posteriores necesitan que permitas las notificaciones a pantalla completa y las alarmas. La app te muestra el interruptor exacto, paso a paso.",
        link: { path: "/features/alarms", label: "Los pasos" },
      },
      {
        id: "iphone",
        q: "¿Funciona igual en iPhone?",
        a: "Las alarmas y el asistente de voz funcionan en ambos. Algunas cosas cambian, por ejemplo el resumen matinal a pantalla completa es solo para Android.",
        link: { path: "/how-it-works", label: "iPhone y Android" },
      },
    ],
  },
  {
    id: "whatsapp",
    title: "WhatsApp",
    items: [
      {
        id: "link",
        q: "¿Cómo vinculo WhatsApp?",
        a: `En la app, abre WhatsApp, toca Generar código y envía el código a nuestro número de empresa, ${siteConfig.whatsappNumberRaw}.`,
        link: { path: "/features/whatsapp", label: "WhatsApp" },
      },
      {
        id: "unsolicited",
        q: "¿Me enviaréis mensajes que no he pedido?",
        a: "No. MeetingGuard solo responde a los mensajes que tú envías. Nada de publicidad ni mensajes no solicitados.",
      },
      {
        id: "what-whatsapp",
        q: "¿Qué puedo hacer por WhatsApp?",
        a: "Crear reuniones y tareas por mensaje, preguntar por tu agenda y confirmar con los botones del chat.",
      },
    ],
  },
  {
    id: "billing",
    title: "Facturación",
    items: [
      {
        id: "subscribe",
        q: "¿Cómo me suscribo?",
        a: "Dentro de la app, con Google Play o el App Store. No hay pago en este sitio web.",
        link: { path: "/pricing", label: "Precios" },
      },
      {
        id: "cancel",
        q: "¿Cómo cancelo?",
        a: "En tus suscripciones de Google Play o del App Store. Tu plan sigue activo hasta el final del periodo pagado.",
      },
      {
        id: "restore",
        q: "Cambié de teléfono. ¿Cómo recupero mi plan?",
        a: "Inicia sesión con la misma cuenta en el teléfono nuevo y restaura tu compra desde la tienda. Tu plan vuelve con ella.",
      },
    ],
  },
  {
    id: "privacy",
    title: "Privacidad",
    items: [
      {
        id: "record",
        q: "¿MeetingGuard graba mis reuniones?",
        a: "No. MeetingGuard nunca graba reuniones. La función de resúmenes que llega lee el resumen que tu herramienta de notas ya envía.",
        link: { path: "/security", label: "Seguridad y privacidad" },
      },
      {
        id: "sell",
        q: "¿Vendéis mis datos o mostráis anuncios?",
        a: "No. No hay anuncios y nunca vendemos tus datos.",
        link: { path: "/security", label: "Seguridad y privacidad" },
      },
      {
        id: "delete",
        q: "¿Cómo elimino mi cuenta?",
        a: `En la app, o por correo a ${siteConfig.supportEmail}. Tus datos se eliminan con ella.`,
        link: { path: "/delete-account", label: "Eliminar tu cuenta" },
      },
    ],
  },
];

export const faq: Record<Lang, Group[]> = { en, es };

/** The five questions on the home page. */
export const HOME_FAQ = ["what", "free", "closed", "languages", "record"];

/** Items ready for the accordion (links localized). */
export function faqItems(lang: Lang, ids?: string[]) {
  const all = faq[lang].flatMap((g) => g.items);
  const picked = ids ? ids.map((id) => all.find((i) => i.id === id)!).filter(Boolean) : all;
  return picked.map((i) => ({ q: i.q, a: i.a, link: i.link && { href: localize(i.link.path, lang), label: i.link.label } }));
}

export function faqGroupItems(lang: Lang, groupId: string) {
  const g = faq[lang].find((x) => x.id === groupId);
  return g ? faqItems(lang, g.items.map((i) => i.id)) : [];
}
