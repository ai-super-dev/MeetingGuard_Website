import type { Month } from "@/lib/i18n";
import type { FeatureSlug, Lang } from "@/lib/routes";
import { availability, siteConfig } from "@/lib/site";

/*
 * Copy for the six feature pages (one template, see src/views/FeaturePage.tsx).
 * Screens are named; the view maps each name to a rebuilt app screen until
 * Dusko's real screenshots replace them.
 */

export type ScreenKey =
  | "voice"
  | "confirm"
  | "confirmed"
  | "plan"
  | "join"
  | "alarm"
  | "permFullscreen"
  | "permAlarms"
  | "tasks"
  | "tasksDone"
  | "agenda"
  | "summary";

export type IconKey =
  | "mic"
  | "languages"
  | "keyboard"
  | "lock"
  | "link"
  | "help"
  | "alarm"
  | "bell"
  | "snooze"
  | "restart"
  | "sliders"
  | "video"
  | "list"
  | "calendar"
  | "clock"
  | "volume"
  | "sun"
  | "hands"
  | "message"
  | "key"
  | "shield"
  | "phone"
  | "sync"
  | "send";

type Highlight = { icon: IconKey; title: string; body: string; label?: "android" | Month };
type FlowStep = { screen: ScreenKey; kind: "iphone" | "android"; title: string; body: string };

export type FeatureContent = {
  meta: { title: string; description: string };
  eyebrow: string;
  line1: string;
  line2: string;
  lead: string;
  hero: { screen: ScreenKey; kind: "iphone" | "android" };
  highlightsTitle: [string, string];
  highlights: Highlight[];
  flowTitle?: [string, string];
  flow?: FlowStep[];
  /** Show the two-phone WhatsApp linking flow from the home page. */
  whatsappFlow?: boolean;
  extra?: {
    eyebrow: string;
    title: [string, string];
    body: string;
    points: string[];
    screens?: { screen: ScreenKey; kind: "iphone" | "android"; caption: string }[];
    note?: string;
  };
  /** Integrations: what syncs today and what is coming. */
  table?: { title: [string, string]; rows: { name: string; kind: "calendar" | "tasks"; status: "now" | Month }[] };
  faqGroup?: string;
  related: FeatureSlug[];
  cta: [string, string];
};

const integrationsRows = [
  { name: "Google Calendar", kind: "calendar" as const, status: "now" as const },
  { name: "Outlook", kind: "calendar" as const, status: availability.outlook },
  { name: "Microsoft To Do", kind: "tasks" as const, status: availability.microsoftToDo },
  { name: "Google Tasks", kind: "tasks" as const, status: availability.googleTasks },
];

const en: Record<FeatureSlug, FeatureContent> = {
  "voice-assistant": {
    meta: {
      title: "Voice assistant",
      description: "Create, move and cancel meetings by voice in English or Spanish. MeetingGuard shows a card first and saves nothing until you confirm.",
    },
    eyebrow: "Voice assistant",
    line1: "Say it in plain words.",
    line2: "It does the rest.",
    lead: "Talk to your calendar like you would talk to a person. MeetingGuard turns what you say into a meeting card and saves it only when you confirm.",
    hero: { screen: "voice", kind: "iphone" },
    highlightsTitle: ["One sentence", "is enough."],
    highlights: [
      { icon: "mic", title: "Create, move and cancel", body: 'Say "Lunch with Ana Friday at 1", "Move my 3 pm to Thursday" or "Cancel the design review".' },
      { icon: "languages", title: "English and Spanish", body: "Speak in either language and switch whenever you like." },
      { icon: "keyboard", title: "Correct by typing", body: "Misheard a name or a time? Fix it on the card before you confirm." },
      { icon: "lock", title: "Nothing saved until you confirm", body: "You always see what it understood first. No surprises in your calendar." },
      { icon: "link", title: "A meeting and a task at once", body: '"Call with Mia Thursday at 3, remind me to send the contract before" gives you both, linked.' },
      { icon: "help", title: "It asks when it is not sure", body: "Moving a meeting and more than one matches? It asks which one before it changes anything." },
    ],
    flowTitle: ["From a sentence", "to your calendar."],
    flow: [
      { screen: "voice", kind: "iphone", title: "Say it", body: "Tap the microphone and say what you need." },
      { screen: "confirm", kind: "iphone", title: "Check the card", body: "Title, time, people, the call link and any task." },
      { screen: "plan", kind: "iphone", title: "Confirm", body: "It is saved and the invitations go out." },
    ],
    faqGroup: "voice",
    related: ["tasks", "alarms", "whatsapp"],
    cta: ["Your calendar,", "now by voice."],
  },
  alarms: {
    meta: {
      title: "Meeting alarms",
      description: "A full-screen alarm before every meeting, with sound, snooze and dismiss. It works with the app closed and survives a restart.",
    },
    eyebrow: "Alarms",
    line1: "An alarm,",
    line2: "not a notification.",
    lead: "Notifications get swiped away. MeetingGuard rings a full-screen alarm before every meeting, so you show up on time, even with the app closed.",
    hero: { screen: "alarm", kind: "iphone" },
    highlightsTitle: ["Hard to miss,", "easy to handle."],
    highlights: [
      { icon: "alarm", title: "Full-screen alarm", body: "Takes over the screen, over the lock screen, with sound and the meeting read aloud." },
      { icon: "bell", title: "Status notification", body: "A quiet notification keeps your next meeting in view until it starts." },
      { icon: "snooze", title: "Snooze and dismiss", body: "Snooze 5 or 10 minutes, or dismiss in one tap. Follow-ups continue until you respond." },
      { icon: "restart", title: "Survives a restart", body: "Your alarms are scheduled again after the phone restarts. No need to open the app." },
      { icon: "sliders", title: "Your intensity", body: "Gentle, standard or critical. Choose it for every meeting." },
      { icon: "video", title: "Join from the alarm", body: "Join now opens the video call straight from the alarm." },
    ],
    extra: {
      eyebrow: "Android 14 and later",
      title: ["Allow full-screen alarms", "once."],
      body: "Android 14 changed how apps may show full-screen alarms, so you give MeetingGuard permission once. The app asks at the right moment and opens the exact screen.",
      points: [
        "Open Settings, then Apps, then MeetingGuard.",
        "Turn on Full-screen notifications.",
        "Turn on Alarms and reminders.",
        "Optional: set battery use to Unrestricted so alarms are never delayed.",
      ],
      screens: [
        { screen: "permFullscreen", kind: "android", caption: "Full-screen notifications" },
        { screen: "permAlarms", kind: "android", caption: "Alarms and reminders" },
      ],
      note: "On iPhone, allow notifications and time-sensitive alerts when the app asks.",
    },
    faqGroup: "alarms",
    related: ["agenda", "voice-assistant", "tasks"],
    cta: ["Never be late", "for a call again."],
  },
  tasks: {
    meta: {
      title: "Tasks and reminders",
      description: "Tasks by voice with due dates, reminded through the same alarm system and linked to the meetings they belong to.",
    },
    eyebrow: "Tasks and reminders",
    line1: "Your tasks,",
    line2: "remembered.",
    lead: "Say a task the way you say a meeting. MeetingGuard gives it a due date, reminds you with the same alarms and links it to the meeting it belongs to.",
    hero: { screen: "tasks", kind: "iphone" },
    highlightsTitle: ["The follow-ups", "that used to slip."],
    highlights: [
      { icon: "mic", title: "Tasks by voice", body: '"Remind me to send the deck to Ana tomorrow" is all it takes.' },
      { icon: "calendar", title: "Due dates", body: "Today, Friday or next week. Said in plain words, set on the task." },
      { icon: "alarm", title: "Reminders that ring", body: "Task reminders use the same alarm system as your meetings." },
      { icon: "link", title: "Linked to meetings", body: "A task created with a meeting stays attached to it, so you see both together." },
      { icon: "clock", title: "Overdue, out loud", body: "Anything overdue is part of your agenda and your daily briefing." },
      {
        icon: "list",
        title: "Meeting debriefs",
        body: "After a meeting, MeetingGuard reads the summary your notetaker already sends and turns the action items into tasks.",
        label: availability.debrief,
      },
    ],
    flowTitle: ["Said, set", "and done."],
    flow: [
      { screen: "tasks", kind: "iphone", title: "Your tasks", body: "Due dates and linked meetings at a glance." },
      { screen: "agenda", kind: "iphone", title: "In your agenda", body: "Overdue tasks are read with your day." },
      { screen: "tasksDone", kind: "iphone", title: "Done", body: "Tick it off when it is done." },
    ],
    faqGroup: "voice",
    related: ["voice-assistant", "agenda", "alarms"],
    cta: ["Remember everything", "without trying."],
  },
  agenda: {
    meta: {
      title: "Agenda aloud",
      description: "Hear today, what's overdue and tomorrow. A daily briefing at the time you choose, and a full-screen morning summary on Android.",
    },
    eyebrow: "Agenda aloud",
    line1: "Your day,",
    line2: "read to you.",
    lead: "Ask what is on, or let MeetingGuard tell you at the time you choose: today, what is overdue and what is coming tomorrow.",
    hero: { screen: "agenda", kind: "iphone" },
    highlightsTitle: ["Know your day", "before it starts."],
    highlights: [
      { icon: "volume", title: "Today, overdue, tomorrow", body: "Your meetings and tasks in the order you need them." },
      { icon: "clock", title: "Daily briefing at your time", body: "Pick the time. MeetingGuard reads your day every morning." },
      { icon: "sun", title: "Full-screen morning summary", body: "Your day on one screen when you wake up.", label: "android" },
      { icon: "mic", title: "Ask anytime", body: 'Say "What do I have tomorrow?" and hear it.' },
      { icon: "hands", title: "Hands free", body: "Listen while you drive, walk or get ready." },
      { icon: "languages", title: "English and Spanish", body: "Your agenda in the language you use the app in." },
    ],
    flowTitle: ["Listen,", "or glance."],
    flow: [
      { screen: "agenda", kind: "iphone", title: "Agenda aloud", body: "Each line is read in turn." },
      { screen: "summary", kind: "android", title: "Morning summary", body: "Full screen when you wake up. Android only." },
    ],
    faqGroup: "alarms",
    related: ["alarms", "tasks", "voice-assistant"],
    cta: ["Start every day", "already briefed."],
  },
  whatsapp: {
    meta: {
      title: "MeetingGuard on WhatsApp",
      description: "Link your number once, then create meetings and tasks by WhatsApp message and confirm with a tap. We never send messages you didn't ask for.",
    },
    eyebrow: "WhatsApp",
    line1: "Your assistant,",
    line2: "in WhatsApp.",
    lead: "Link your number once. Then create meetings and tasks by message, and confirm with a tap, without opening the app.",
    hero: { screen: "plan", kind: "iphone" },
    highlightsTitle: ["As easy as", "sending a message."],
    highlights: [
      { icon: "key", title: "Link with a code", body: "Generate a one-time code in the app and send it from WhatsApp. It expires in minutes." },
      { icon: "message", title: "Meetings and tasks by message", body: "Write like you would to an assistant, in English or Spanish." },
      { icon: "lock", title: "Confirm buttons", body: "Every change comes with Confirm and Cancel. Nothing is saved before you tap." },
      { icon: "shield", title: "Only replies to you", body: "We never send messages you didn't ask for. No marketing, no unsolicited messages." },
      { icon: "phone", title: "Our business number", body: `Messages come from ${siteConfig.whatsappNumberRaw}. Save it so you know it is us.` },
      { icon: "sync", title: "Same calendar", body: "What you book by message appears in the app and your calendar, with alarms." },
    ],
    whatsappFlow: true,
    extra: {
      eyebrow: "What we never send",
      title: ["Your WhatsApp", "stays yours."],
      body: "MeetingGuard is a business account that answers you. It does not start conversations.",
      points: [
        "No marketing or promotional messages.",
        "No messages you did not ask for.",
        "No messages to your contacts or groups.",
        "You can unlink your number in the app at any time.",
      ],
    },
    faqGroup: "whatsapp",
    related: ["voice-assistant", "tasks", "integrations"],
    cta: ["Book your next meeting", "by message."],
  },
  integrations: {
    meta: {
      title: "Calendars and tasks in sync",
      description: "MeetingGuard works with Google Calendar today. Outlook, Microsoft To Do and Google Tasks are on the way.",
    },
    eyebrow: "Calendars and tasks",
    line1: "Works with",
    line2: "the calendar you have.",
    lead: "MeetingGuard reads and writes your Google Calendar today. Outlook, Microsoft To Do and Google Tasks are coming, and this page is updated at each release.",
    hero: { screen: "plan", kind: "iphone" },
    highlightsTitle: ["One calendar,", "no copying."],
    highlights: [
      { icon: "sync", title: "Two-way with Google Calendar", body: "Meetings you create appear in Google Calendar, and changes there show up in MeetingGuard." },
      { icon: "send", title: "Invitations sent for you", body: "Guests are invited from your calendar when you confirm." },
      { icon: "video", title: "The call link on the event", body: "The video link is saved with the meeting, ready to join from the alarm." },
    ],
    table: { title: ["What syncs today,", "and what is next."], rows: integrationsRows },
    flowTitle: ["All your meetings,", "one list."],
    flow: [
      { screen: "plan", kind: "iphone", title: "All meetings", body: "Filter by source: MeetingGuard or your calendar." },
      { screen: "join", kind: "iphone", title: "Meeting details", body: "Time, link and guests from the calendar event." },
    ],
    faqGroup: "start",
    related: ["voice-assistant", "alarms", "whatsapp"],
    cta: ["Keep your calendar.", "Add an assistant."],
  },
};

const es: Record<FeatureSlug, FeatureContent> = {
  "voice-assistant": {
    meta: {
      title: "Asistente de voz",
      description: "Crea, mueve y cancela reuniones con la voz en inglés o español. MeetingGuard te muestra una tarjeta y no guarda nada hasta que confirmas.",
    },
    eyebrow: "Asistente de voz",
    line1: "Dilo con tus palabras.",
    line2: "Él hace el resto.",
    lead: "Habla con tu calendario como hablarías con una persona. MeetingGuard convierte lo que dices en una tarjeta de reunión y solo la guarda cuando confirmas.",
    hero: { screen: "voice", kind: "iphone" },
    highlightsTitle: ["Una frase", "es suficiente."],
    highlights: [
      { icon: "mic", title: "Crea, mueve y cancela", body: 'Di "Comida con Ana el viernes a la 1", "Mueve mi reunión de las 15:00 al jueves" o "Cancela la revisión de diseño".' },
      { icon: "languages", title: "Inglés y español", body: "Habla en cualquiera de los dos y cambia cuando quieras." },
      { icon: "keyboard", title: "Corrige escribiendo", body: "¿Entendió mal un nombre o una hora? Corrígelo en la tarjeta antes de confirmar." },
      { icon: "lock", title: "Nada se guarda sin confirmar", body: "Siempre ves primero lo que entendió. Sin sorpresas en tu calendario." },
      { icon: "link", title: "Una reunión y una tarea a la vez", body: '"Llamada con Mia el jueves a las 3, recuérdame enviar el contrato antes" te da ambas, vinculadas.' },
      { icon: "help", title: "Pregunta cuando duda", body: "¿Mueves una reunión y coincide más de una? Te pregunta cuál antes de cambiar nada." },
    ],
    flowTitle: ["De una frase", "a tu calendario."],
    flow: [
      { screen: "voice", kind: "iphone", title: "Dilo", body: "Toca el micrófono y di lo que necesitas." },
      { screen: "confirm", kind: "iphone", title: "Revisa la tarjeta", body: "Título, hora, personas, enlace y cualquier tarea." },
      { screen: "plan", kind: "iphone", title: "Confirma", body: "Se guarda y se envían las invitaciones." },
    ],
    faqGroup: "voice",
    related: ["tasks", "alarms", "whatsapp"],
    cta: ["Tu calendario,", "ahora con la voz."],
  },
  alarms: {
    meta: {
      title: "Alarmas de reuniones",
      description: "Una alarma a pantalla completa antes de cada reunión, con sonido, posponer y descartar. Funciona con la app cerrada y sobrevive a un reinicio.",
    },
    eyebrow: "Alarmas",
    line1: "Una alarma,",
    line2: "no una notificación.",
    lead: "Las notificaciones se descartan. MeetingGuard hace sonar una alarma a pantalla completa antes de cada reunión para que llegues a tiempo, incluso con la app cerrada.",
    hero: { screen: "alarm", kind: "iphone" },
    highlightsTitle: ["Difícil de ignorar,", "fácil de gestionar."],
    highlights: [
      { icon: "alarm", title: "Alarma a pantalla completa", body: "Ocupa la pantalla, también la de bloqueo, con sonido y la reunión leída en voz alta." },
      { icon: "bell", title: "Notificación de estado", body: "Una notificación discreta mantiene tu próxima reunión a la vista hasta que empieza." },
      { icon: "snooze", title: "Posponer y descartar", body: "Pospón 5 o 10 minutos, o descarta con un toque. Los recordatorios siguen hasta que respondes." },
      { icon: "restart", title: "Sobrevive a un reinicio", body: "Tus alarmas se vuelven a programar tras reiniciar el teléfono. Sin abrir la app." },
      { icon: "sliders", title: "Tu intensidad", body: "Suave, estándar o crítica. Elígela para cada reunión." },
      { icon: "video", title: "Únete desde la alarma", body: "Unirse ahora abre la videollamada directamente desde la alarma." },
    ],
    extra: {
      eyebrow: "Android 14 y posteriores",
      title: ["Permite las alarmas a pantalla completa", "una vez."],
      body: "Android 14 cambió cómo las apps pueden mostrar alarmas a pantalla completa, así que das permiso a MeetingGuard una sola vez. La app te lo pide en el momento justo y abre la pantalla exacta.",
      points: [
        "Abre Ajustes, después Aplicaciones y después MeetingGuard.",
        "Activa Notificaciones a pantalla completa.",
        "Activa Alarmas y recordatorios.",
        "Opcional: pon el uso de batería en Sin restricciones para que las alarmas nunca se retrasen.",
      ],
      screens: [
        { screen: "permFullscreen", kind: "android", caption: "Notificaciones a pantalla completa" },
        { screen: "permAlarms", kind: "android", caption: "Alarmas y recordatorios" },
      ],
      note: "En iPhone, permite las notificaciones y los avisos urgentes cuando la app lo pida.",
    },
    faqGroup: "alarms",
    related: ["agenda", "voice-assistant", "tasks"],
    cta: ["No vuelvas a llegar tarde", "a una llamada."],
  },
  tasks: {
    meta: {
      title: "Tareas y recordatorios",
      description: "Tareas por voz con fecha límite, recordadas con el mismo sistema de alarmas y vinculadas a las reuniones a las que pertenecen.",
    },
    eyebrow: "Tareas y recordatorios",
    line1: "Tus tareas,",
    line2: "recordadas.",
    lead: "Di una tarea como dices una reunión. MeetingGuard le pone fecha, te la recuerda con las mismas alarmas y la vincula a su reunión.",
    hero: { screen: "tasks", kind: "iphone" },
    highlightsTitle: ["Los seguimientos", "que antes se escapaban."],
    highlights: [
      { icon: "mic", title: "Tareas por voz", body: '"Recuérdame enviar la presentación a Ana mañana" es todo lo que necesitas.' },
      { icon: "calendar", title: "Fechas límite", body: "Hoy, el viernes o la próxima semana. Dicho con tus palabras, puesto en la tarea." },
      { icon: "alarm", title: "Recordatorios que suenan", body: "Los recordatorios de tareas usan el mismo sistema de alarmas que tus reuniones." },
      { icon: "link", title: "Vinculadas a reuniones", body: "Una tarea creada con una reunión queda unida a ella, así ves ambas juntas." },
      { icon: "clock", title: "Lo pendiente, en voz alta", body: "Todo lo pendiente forma parte de tu agenda y de tu resumen diario." },
      {
        icon: "list",
        title: "Resúmenes de reuniones",
        body: "Tras una reunión, MeetingGuard lee el resumen que tu herramienta de notas ya envía y convierte los puntos de acción en tareas.",
        label: availability.debrief,
      },
    ],
    flowTitle: ["Dicho, programado", "y hecho."],
    flow: [
      { screen: "tasks", kind: "iphone", title: "Tus tareas", body: "Fechas y reuniones vinculadas de un vistazo." },
      { screen: "agenda", kind: "iphone", title: "En tu agenda", body: "Las tareas pendientes se leen con tu día." },
      { screen: "tasksDone", kind: "iphone", title: "Hecha", body: "Márcala cuando la termines." },
    ],
    faqGroup: "voice",
    related: ["voice-assistant", "agenda", "alarms"],
    cta: ["Recuérdalo todo", "sin esfuerzo."],
  },
  agenda: {
    meta: {
      title: "Agenda en voz alta",
      description: "Escucha lo de hoy, lo pendiente y lo de mañana. Un resumen diario a tu hora y un resumen matinal a pantalla completa en Android.",
    },
    eyebrow: "Agenda en voz alta",
    line1: "Tu día,",
    line2: "leído para ti.",
    lead: "Pregunta qué tienes, o deja que MeetingGuard te lo diga a la hora que elijas: hoy, lo pendiente y lo que viene mañana.",
    hero: { screen: "agenda", kind: "iphone" },
    highlightsTitle: ["Conoce tu día", "antes de que empiece."],
    highlights: [
      { icon: "volume", title: "Hoy, pendiente, mañana", body: "Tus reuniones y tareas en el orden en que las necesitas." },
      { icon: "clock", title: "Resumen diario a tu hora", body: "Elige la hora. MeetingGuard lee tu día cada mañana." },
      { icon: "sun", title: "Resumen matinal a pantalla completa", body: "Tu día en una pantalla al despertar.", label: "android" },
      { icon: "mic", title: "Pregunta cuando quieras", body: 'Di "¿Qué tengo mañana?" y escúchalo.' },
      { icon: "hands", title: "Sin manos", body: "Escucha mientras conduces, caminas o te preparas." },
      { icon: "languages", title: "Inglés y español", body: "Tu agenda en el idioma en que usas la app." },
    ],
    flowTitle: ["Escucha,", "o echa un vistazo."],
    flow: [
      { screen: "agenda", kind: "iphone", title: "Agenda en voz alta", body: "Cada línea se lee por turnos." },
      { screen: "summary", kind: "android", title: "Resumen matinal", body: "A pantalla completa al despertar. Solo Android." },
    ],
    faqGroup: "alarms",
    related: ["alarms", "tasks", "voice-assistant"],
    cta: ["Empieza cada día", "ya informado."],
  },
  whatsapp: {
    meta: {
      title: "MeetingGuard en WhatsApp",
      description: "Vincula tu número una vez y crea reuniones y tareas por WhatsApp, con confirmación en un toque. Nunca enviamos mensajes que no hayas pedido.",
    },
    eyebrow: "WhatsApp",
    line1: "Tu asistente,",
    line2: "en WhatsApp.",
    lead: "Vincula tu número una vez. Después crea reuniones y tareas por mensaje y confirma con un toque, sin abrir la app.",
    hero: { screen: "plan", kind: "iphone" },
    highlightsTitle: ["Tan fácil como", "enviar un mensaje."],
    highlights: [
      { icon: "key", title: "Vincula con un código", body: "Genera un código de un solo uso en la app y envíalo desde WhatsApp. Caduca en minutos." },
      { icon: "message", title: "Reuniones y tareas por mensaje", body: "Escribe como lo harías a un asistente, en inglés o español." },
      { icon: "lock", title: "Botones para confirmar", body: "Cada cambio llega con Confirmar y Cancelar. No se guarda nada antes de tocar." },
      { icon: "shield", title: "Solo te responde a ti", body: "Nunca enviamos mensajes que no hayas pedido. Nada de publicidad ni mensajes no solicitados." },
      { icon: "phone", title: "Nuestro número de empresa", body: `Los mensajes llegan desde ${siteConfig.whatsappNumberRaw}. Guárdalo para saber que somos nosotros.` },
      { icon: "sync", title: "El mismo calendario", body: "Lo que reservas por mensaje aparece en la app y en tu calendario, con alarmas." },
    ],
    whatsappFlow: true,
    extra: {
      eyebrow: "Lo que nunca enviamos",
      title: ["Tu WhatsApp", "sigue siendo tuyo."],
      body: "MeetingGuard es una cuenta de empresa que te responde. No inicia conversaciones.",
      points: [
        "Ningún mensaje publicitario o promocional.",
        "Ningún mensaje que no hayas pedido.",
        "Ningún mensaje a tus contactos o grupos.",
        "Puedes desvincular tu número en la app cuando quieras.",
      ],
    },
    faqGroup: "whatsapp",
    related: ["voice-assistant", "tasks", "integrations"],
    cta: ["Reserva tu próxima reunión", "por mensaje."],
  },
  integrations: {
    meta: {
      title: "Calendarios y tareas sincronizados",
      description: "MeetingGuard funciona con Google Calendar desde hoy. Outlook, Microsoft To Do y Google Tasks están en camino.",
    },
    eyebrow: "Calendarios y tareas",
    line1: "Funciona con",
    line2: "el calendario que ya usas.",
    lead: "MeetingGuard lee y escribe en tu Google Calendar desde hoy. Outlook, Microsoft To Do y Google Tasks están en camino, y esta página se actualiza con cada versión.",
    hero: { screen: "plan", kind: "iphone" },
    highlightsTitle: ["Un calendario,", "sin copiar nada."],
    highlights: [
      { icon: "sync", title: "Bidireccional con Google Calendar", body: "Las reuniones que creas aparecen en Google Calendar, y los cambios allí se ven en MeetingGuard." },
      { icon: "send", title: "Invitaciones enviadas por ti", body: "Los invitados reciben la invitación desde tu calendario cuando confirmas." },
      { icon: "video", title: "El enlace en el evento", body: "El enlace de la videollamada se guarda con la reunión, listo para unirte desde la alarma." },
    ],
    table: { title: ["Lo que se sincroniza hoy,", "y lo que viene."], rows: integrationsRows },
    flowTitle: ["Todas tus reuniones,", "en una lista."],
    flow: [
      { screen: "plan", kind: "iphone", title: "Todas las reuniones", body: "Filtra por origen: MeetingGuard o tu calendario." },
      { screen: "join", kind: "iphone", title: "Detalles de la reunión", body: "Hora, enlace e invitados del evento del calendario." },
    ],
    faqGroup: "start",
    related: ["voice-assistant", "alarms", "whatsapp"],
    cta: ["Mantén tu calendario.", "Suma un asistente."],
  },
};

export const features: Record<Lang, Record<FeatureSlug, FeatureContent>> = { en, es };

/** Text on the two Android permission screens. */
export const permissionScreens = {
  en: {
    permFullscreen: { title: "Full-screen notifications", label: "MeetingGuard", note: "Allow this app to show notifications that take up the full screen when the device is locked." },
    permAlarms: { title: "Alarms and reminders", label: "MeetingGuard", note: "Allow this app to set alarms and schedule time-sensitive actions." },
  },
  es: {
    permFullscreen: { title: "Notificaciones a pantalla completa", label: "MeetingGuard", note: "Permite que esta app muestre notificaciones que ocupan toda la pantalla cuando el dispositivo está bloqueado." },
    permAlarms: { title: "Alarmas y recordatorios", label: "MeetingGuard", note: "Permite que esta app configure alarmas y programe acciones urgentes." },
  },
} as const;
