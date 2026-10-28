/*
 * Shared strings (header, footer, forms, home page, phone screens) in English
 * and Spanish. `es` must mirror the shape of `en` (the Dict type enforces it),
 * so a missing translation is a type error rather than a blank on the page.
 * Page-specific copy lives in src/content/.
 *
 * Content rules from the brief: plain punctuation (no em dashes, ellipses or
 * curly quotes), short, direct and friendly. Text inside screens rebuilt from
 * the real app keeps the app's own wording.
 */

export type Widen<T> = T extends string
  ? string
  : T extends (...args: never[]) => unknown
    ? T
    : T extends readonly (infer U)[]
      ? readonly Widen<U>[]
      : { readonly [K in keyof T]: Widen<T[K]> };

const MONTHS_EN = { november: "November", december: "December", january: "January" } as const;
const MONTHS_ES = { november: "noviembre", december: "diciembre", january: "enero" } as const;
export type Month = keyof typeof MONTHS_EN;

/** "November" / "noviembre". */
export const monthName = (lang: "en" | "es", m: Month) => (lang === "es" ? MONTHS_ES : MONTHS_EN)[m];

export const en = {
  lang: "en",
  skip: "Skip to content",
  available: (m: Month) => `Available ${MONTHS_EN[m]}`,

  meta: {
    homeTitle: "MeetingGuard: never miss a meeting",
    homeDescription:
      "MeetingGuard is the AI meeting assistant for busy professionals. Say what you need, confirm the card, and a full-screen alarm makes sure you never miss it. English and Spanish, iPhone and Android.",
  },

  header: {
    home: "MeetingGuard home",
    primary: "Main",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    nav: { privacy: "Privacy Policy", terms: "Terms of Service" },
    download: "Download",
    // opens the web agenda (it asks to sign in first)
    signIn: "Sign in",
    // shown when Sign in is clicked while the web agenda is not open yet
    signInSoon: "The web agenda is coming soon.",
    theme: { toLight: "Light theme", toDark: "Dark theme" },
  },

  // short names for the legal pages, used by the footer
  pages: {
    privacy: "Privacy policy",
    terms: "Terms of service",
  },

  badges: {
    appStore: "Download on the App Store",
    googlePlay: "Get it on Google Play",
  },
  qr: { scan: "Scan to download", aria: "QR code that opens the MeetingGuard website" },

  consent: {
    text: "We use analytics to improve this site, only if you agree.",
    accept: "Accept",
    decline: "Decline",
    more: "Privacy policy",
  },

  forms: {
    email: "Email",
    emailPlaceholder: "you@company.com",
    language: "Language",
    languages: { en: "English", es: "Spanish" },
    sending: "Sending",
    error: "Something went wrong. Please try again, or email us.",
    offline: "This form opens at launch. Until then, email us.",
    joinList: "Join the list",
    joined: "You're on the list. We'll email you when it opens.",
    honeypot: "Leave this field empty",
  },

  hero: {
    line1: "Never miss",
    line2: "what matters.",
    sentence: "The AI meeting assistant that turns what you say into meetings, rings until you show up, and remembers your tasks.",
    promises: ["Never miss a meeting", "Talk to your calendar", "Your tasks remembered"],
    proof: "Built for busy professionals",
    proofDetail: "iPhone and Android · English and Spanish",
    ratingStore: { appStore: "App Store", googlePlay: "Google Play" },
  },

  alarm: {
    title: "Investor call",
    startsIn: "Starts in 15 minutes",
    aboutToStart: "Your meeting is about to start",
    when: "10:00 AM - 10:45 AM",
    onIt: "I'm on it",
    joinNow: "Join now",
    snooze5: "Snooze 5 min",
    snooze10: "Snooze 10 min",
    details: "Meeting details",
    autoSnooze: "Auto-snooze in 54 seconds",
    platform: "Video call",
  },

  problem: {
    eyebrow: "Why MeetingGuard",
    line1: "Your calendar stores time.",
    line2a: "MeetingGuard",
    line2b: "protects it.",
    body: "Calendars only store dates. When your day gets busy, passive notifications get ignored. MeetingGuard reads the same calendar and makes sure you're in the right meeting, right on time.",
    calendar: "Calendar",
    today: "Today",
    month: "October 2026",
    week: "Week",
    days: ["MON", "TUE", "WED", "THU", "FRI"],
    events: {
      standup: "Team standup",
      product: "Product sync",
      lunch: "Lunch with Ana",
      investor: "Investor call",
      design: "Design review",
      client: "Client sync",
      oneOnOne: "1:1 with Mia",
    },
    lanes: [
      {
        title: "Calendar alone",
        outcome: "Late for the call",
        steps: ["Nothing happens.", "One small banner, swiped away with everything else.", "The call starts without you."],
      },
      {
        title: "With MeetingGuard",
        outcome: "On time",
        steps: [
          "Your phone rings and a full-screen alarm takes over, even with the app closed.",
          "Follow-ups keep going until you respond.",
          "One tap on Join now and you're in the call.",
        ],
      },
    ],
  },

  how: {
    eyebrow: "How it works",
    title: "Say it. Confirm it. Never miss it.",
    body: "One meeting, from the sentence you say to the moment it starts.",
    group: "How it works steps",
    show: "Show step",
    steps: [
      {
        day: "Mon",
        title: "Say it",
        body: "Tell MeetingGuard what you need in plain words, by voice or by text, in English or Spanish.",
        points: [
          "Create, move or cancel a meeting by voice",
          "A meeting and its task from one sentence",
          "Type to correct anything it misheard",
        ],
      },
      {
        day: "Mon",
        title: "Confirm it",
        body: "You see a card with exactly what it understood. Nothing is saved until you confirm.",
        points: [
          "Title, time, people and the call link on one card",
          "Change anything before you confirm",
          "Saved to your calendar and invitations sent",
        ],
      },
      {
        day: "Wed",
        title: "Never miss it",
        body: "Fifteen minutes before, an alarm takes over the screen, even with the app closed.",
        points: [
          "Full-screen alarm with sound and voice readout",
          "Snooze or dismiss in one tap",
          "Still rings after your phone restarts",
        ],
      },
    ],
  },

  // text on phone screens (the Plan and Join screens are rebuilt from the real app)
  app: {
    allMeetings: "All meetings",
    search: "Search meetings",
    tabs: ["Upcoming", "Past", "All"],
    allSources: "All sources",
    total: "3 meetings",
    meetingCount: (n: number) => `${n} meeting${n > 1 ? "s" : ""}`,
    days: [
      {
        label: "Tomorrow · October 27th, 2026",
        meetings: [{ time: "12:00 PM - 1:00 PM", title: "Lunch with Ana", place: "Cafe Central", source: "Created with the AI assistant" }],
      },
      {
        label: "Wednesday · October 28th, 2026",
        meetings: [
          { time: "10:00 AM - 10:45 AM", title: "Investor call", place: "Zoom", source: "Created with the AI assistant" },
          { time: "11:30 AM - 12:30 PM", title: "Design review with Marketing", place: "Zoom", source: "Created in MeetingGuard" },
        ],
      },
    ],
    isNew: "New",
    newMeeting: "New meeting",
    details: "Meeting details",
    createdAi: "Created with the AI assistant",
    confidence: "AI confidence 96%",
    when: "When",
    whenValue: "Wed, Oct 28 · 10:00 - 10:45 AM",
    duration: "Duration",
    videoCall: "Video call",
    passcode: "Passcode",
    participants: "1 participant",
    alerts: "Alerts",
    reminders: "Your default reminders: 15 min before, 5 min before, At start",
    intensity: "Intensity: Maximum (your default)",
  },

  // stand-in screens for flows without exported screenshots yet
  screens: {
    listening: "Listening",
    spoken: "Investor call with Ana Wednesday at 10, add a Zoom link",
    typeInstead: "Type instead",
    cardTitle: "New meeting",
    cardWhen: "Wed, Oct 28 · 10:00 - 10:45",
    cardWith: "Ana García",
    cardLink: "Zoom link added",
    cardTask: "Task: send the deck to Ana",
    notSaved: "Nothing is saved until you confirm",
    confirm: "Confirm",
    edit: "Edit",
    agendaTitle: "Your agenda",
    agendaToday: "Today",
    agendaOverdue: "Overdue",
    agendaTomorrow: "Tomorrow",
    agendaItems: {
      today: ["10:00 Investor call", "12:30 Lunch with Ana", "16:00 Design review"],
      overdue: ["Send the deck to Ana"],
      tomorrow: ["09:00 Team standup", "11:00 Client sync"],
    },
    reading: "Reading aloud",
    summaryHello: "Good morning",
    summaryLine: "3 meetings today. 1 task overdue.",
    summaryFirst: "First up: Investor call at 10:00",
    summaryStart: "Start my day",
    tasksTitle: "Tasks",
    tasks: [
      { title: "Send the deck to Ana", due: "Today", link: "Investor call" },
      { title: "Book flights to Madrid", due: "Friday", link: "" },
      { title: "Review the Q4 plan", due: "Next week", link: "Design review" },
    ],
    taskDone: "Done",
  },

  whatsapp: {
    eyebrow: "WhatsApp",
    line1: "Schedule straight",
    line2: "from WhatsApp.",
    body: "Link your number once with a code from the app. Then message MeetingGuard like you would an assistant: it books the meeting and makes sure you never miss it.",
    points: [
      ["Meetings and tasks", "by message"],
      ["Confirm buttons before", "anything is saved"],
      ["No messages you", "didn't ask for"],
    ],
    phones: [
      {
        where: "In MeetingGuard",
        title: "Generate a code",
        body: "Tap Generate code, then copy it or open WhatsApp. One-time use, expires in minutes.",
      },
      {
        where: "In WhatsApp",
        title: "Send it, then book in plain words",
        body: "Send the code to link your number, then just ask for a meeting. Confirm, and it's done.",
      },
    ],
    link: {
      intro:
        "Link your WhatsApp number to create meetings by message. Generate a code here, then send it to the bot from WhatsApp. The code works once and expires after a few minutes.",
      generate: "Generate code",
      sendTo: "Send this code by WhatsApp to",
      expires: "Expires in 9:58",
      copy: "Copy code",
      open: "Open WhatsApp",
    },
    chat: {
      today: "Today",
      meta: "This business uses a secure service from Meta to manage this chat.",
      message: "Message",
      request: "investor call with Ana tomorrow at 10, add a zoom link",
      prepared: "I prepared the following for you. Please review and confirm.",
      proposal: "Propose an investor call with Ana tomorrow at 10:00 with a Zoom link.",
      quoted: "• Propose an investor call with Ana tomorrow at 10:00…",
      apply: "Should I apply this? Reply 1 to confirm or 2 to cancel.",
      confirm: "Confirm",
      cancel: "Cancel",
      done: "Done. I applied the changes.",
    },
  },

  features: {
    eyebrow: "Features",
    line1: "Everything it takes",
    line2: "to show up on time.",
    levels: [
      { name: "Gentle", note: "A quiet notification" },
      { name: "Standard", note: "Sound and vibration" },
      { name: "Critical", note: "Full-screen alarm with voice readout" },
    ],
    phrase: "Move my 3 pm with Mia to Friday",
    confirmed: "Moved to Friday · confirmed",
    tiles: {
      alarms: {
        title: "Alarms you can't miss",
        body: "A full-screen alarm with sound, snooze and dismiss. It works with the app closed and survives a restart. You choose the intensity for every meeting.",
      },
      "voice-assistant": {
        title: "Voice assistant",
        body: "Create, move and cancel meetings by voice in English or Spanish. Nothing is saved until you confirm.",
      },
      tasks: {
        title: "Tasks and reminders",
        body: "Tasks by voice with due dates, reminded through the same alarms and linked to their meetings.",
      },
      agenda: {
        title: "Agenda aloud",
        body: "Hear today, what's overdue and tomorrow, with a daily briefing at your time.",
      },
      whatsapp: {
        title: "WhatsApp",
        body: "Create meetings and tasks by message and confirm with one tap. We never send messages you didn't ask for.",
      },
      integrations: {
        title: "Calendars and tasks in sync",
        body: "Google Calendar today. Outlook, Microsoft To Do and Google Tasks are on the way.",
      },
    },
    visuals: {
      dueToday: "Today",
      linked: "Investor call",
      newTask: "Send the deck to Ana",
      reading: "Reading your agenda",
      chatAsk: "Lunch with Ana Friday at 1",
      chatCard: "Lunch with Ana · Fri 13:00",
      chatDone: "Done. It's in your calendar.",
      live: "Live",
      debrief: "Debriefs",
      tasks: [
        { title: "Book flights", due: "Fri" },
        { title: "Review Q4 plan", due: "Mon" },
      ],
      newTaskShort: "Send the deck",
    },
  },

  briefing: {
    eyebrow: "Daily briefing",
    line1: "Your day, read to you,",
    line2: "at the time you choose.",
    body: "Every morning MeetingGuard reads your meetings, what's overdue and what's next. On Android, a full-screen summary is waiting when you wake up.",
    points: ["Today, overdue and tomorrow", "At the time you set", "Full-screen summary on Android"],
    androidOnly: "Full-screen summary: Android only",
  },

  pricingTeaser: {
    eyebrow: "Pricing",
    line1: "Start free.",
    line2: "Upgrade when you're ready.",
    points: ["Free plan, no card needed", "3-day free trial", "Pro from USD 7.99 a month"],
    note: "Subscriptions are bought inside the app on Google Play or the App Store.",
  },

  assistantTeaser: {
    eyebrow: "Coming soon",
    line1: "An executive assistant",
    line2: "that works for you.",
    body: "Delegate by voice. It emails, follows up and books, and you approve every step. You are copied on every email.",
    addon: "Available as an add-on subscription.",
    visual: {
      ask: "Find 30 minutes with Carlos next week",
      to: "To: Carlos",
      cc: "Cc: you",
      subject: "30 minutes next week?",
      steps: ["Email sent", "Follow-up sent", "Carlos picked Tue 11:00", "You approved. Booked."],
      booked: "Tue 11:00 with Carlos, in your calendar",
    },
  },

  faqHome: { eyebrow: "FAQ", title: "Questions, answered." },

  cta: { line1: "Your next meeting", line2: "is already covered.", sentence: "Free to start. Set up in a minute." },

  footer: {
    blurb: "Stay organized and never miss a meeting again.",
    updates: "Stay updated",
    updatesBody: "Launch news and new features, now and then. No spam.",
    contact: "Contact",
    rights: "All rights reserved.",
    nav: "Footer",
    emailLabel: "Enter your email address here",
    emailPlaceholder: "Your email for notifications",
    subscribe: "Subscribe for updates",
    subscribeShort: "Subscribe",
    done: "Thanks, you're on the list.",
  },

  notFound: { title: "This page does not exist.", body: "The link may be old or mistyped.", home: "Back to home" },
};

export type Dict = Widen<typeof en>;

export const es: Dict = {
  lang: "es",
  skip: "Saltar al contenido",
  available: (m: Month) => `Disponible en ${MONTHS_ES[m]}`,

  meta: {
    homeTitle: "MeetingGuard: no te pierdas ninguna reunión",
    homeDescription:
      "MeetingGuard es el asistente de reuniones con IA para profesionales ocupados. Di lo que necesitas, confirma la tarjeta y una alarma a pantalla completa se asegura de que no te lo pierdas. En inglés y español, para iPhone y Android.",
  },

  header: {
    home: "Inicio de MeetingGuard",
    primary: "Principal",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    nav: { privacy: "Política de privacidad", terms: "Términos del servicio" },
    download: "Descargar",
    // opens the web agenda (it asks to sign in first)
    signIn: "Iniciar sesión",
    // shown when Sign in is clicked while the web agenda is not open yet
    signInSoon: "La agenda web estará disponible pronto.",
    theme: { toLight: "Tema claro", toDark: "Tema oscuro" },
  },

  // short names for the legal pages, used by the footer
  pages: {
    privacy: "Política de privacidad",
    terms: "Términos del servicio",
  },

  badges: {
    appStore: "Consíguelo en el App Store",
    googlePlay: "Disponible en Google Play",
  },
  qr: { scan: "Escanea para descargar", aria: "Código QR que abre el sitio web de MeetingGuard" },

  consent: {
    text: "Usamos analítica para mejorar este sitio, solo si lo aceptas.",
    accept: "Aceptar",
    decline: "Rechazar",
    more: "Política de privacidad",
  },

  forms: {
    email: "Correo electrónico",
    emailPlaceholder: "tu@empresa.com",
    language: "Idioma",
    languages: { en: "Inglés", es: "Español" },
    sending: "Enviando",
    error: "Algo salió mal. Inténtalo de nuevo o escríbenos.",
    offline: "Este formulario se activa en el lanzamiento. Mientras tanto, escríbenos.",
    joinList: "Unirme a la lista",
    joined: "Ya estás en la lista. Te escribiremos cuando abra.",
    honeypot: "Deja este campo vacío",
  },

  hero: {
    line1: "Nunca te pierdas",
    line2: "lo importante.",
    sentence: "El asistente de reuniones con IA que convierte lo que dices en reuniones, suena hasta que llegas y recuerda tus tareas.",
    promises: ["Nunca te pierdas una reunión", "Habla con tu calendario", "Tus tareas, recordadas"],
    proof: "Creado para profesionales ocupados",
    proofDetail: "iPhone y Android · Inglés y español",
    ratingStore: { appStore: "App Store", googlePlay: "Google Play" },
  },

  alarm: {
    title: "Llamada con inversores",
    startsIn: "Empieza en 15 minutos",
    aboutToStart: "Tu reunión está por comenzar",
    when: "10:00 - 10:45",
    onIt: "Ya voy",
    joinNow: "Unirse ahora",
    snooze5: "Posponer 5 min",
    snooze10: "Posponer 10 min",
    details: "Detalles de la reunión",
    autoSnooze: "Se pospondrá en 54 segundos",
    platform: "Videollamada",
  },

  problem: {
    eyebrow: "Por qué MeetingGuard",
    line1: "Tu calendario guarda el tiempo.",
    line2a: "MeetingGuard",
    line2b: "lo protege.",
    body: "Los calendarios solo guardan fechas. Cuando tu día se complica, las notificaciones pasivas se ignoran. MeetingGuard lee el mismo calendario y se asegura de que estés en la reunión correcta, justo a tiempo.",
    calendar: "Calendario",
    today: "Hoy",
    month: "Octubre de 2026",
    week: "Semana",
    days: ["LUN", "MAR", "MIÉ", "JUE", "VIE"],
    events: {
      standup: "Reunión diaria",
      product: "Sincro de producto",
      lunch: "Comida con Ana",
      investor: "Llamada con inversores",
      design: "Revisión de diseño",
      client: "Reunión con cliente",
      oneOnOne: "1:1 con Mia",
    },
    lanes: [
      {
        title: "Solo el calendario",
        outcome: "Tarde a la llamada",
        steps: ["No pasa nada.", "Un pequeño aviso, descartado junto con todo lo demás.", "La llamada empieza sin ti."],
      },
      {
        title: "Con MeetingGuard",
        outcome: "A tiempo",
        steps: [
          "Tu teléfono suena y una alarma a pantalla completa toma el control, incluso con la app cerrada.",
          "Los recordatorios siguen hasta que respondes.",
          "Un toque en Unirse ahora y ya estás en la llamada.",
        ],
      },
    ],
  },

  how: {
    eyebrow: "Cómo funciona",
    title: "Dilo. Confírmalo. No te lo pierdas.",
    body: "Una reunión, desde la frase que dices hasta el momento en que empieza.",
    group: "Pasos de cómo funciona",
    show: "Mostrar paso",
    steps: [
      {
        day: "Lun",
        title: "Dilo",
        body: "Dile a MeetingGuard lo que necesitas con tus palabras, por voz o por texto, en inglés o español.",
        points: [
          "Crea, mueve o cancela una reunión con la voz",
          "Una reunión y su tarea con una sola frase",
          "Escribe para corregir lo que no entendió",
        ],
      },
      {
        day: "Lun",
        title: "Confírmalo",
        body: "Ves una tarjeta con exactamente lo que entendió. No se guarda nada hasta que confirmas.",
        points: [
          "Título, hora, personas y enlace en una tarjeta",
          "Cambia lo que quieras antes de confirmar",
          "Guardada en tu calendario, con invitaciones enviadas",
        ],
      },
      {
        day: "Mié",
        title: "No te lo pierdas",
        body: "Quince minutos antes, una alarma ocupa la pantalla, incluso con la app cerrada.",
        points: [
          "Alarma a pantalla completa con sonido y lectura en voz",
          "Pospón o descarta con un toque",
          "Sigue sonando aunque el teléfono se reinicie",
        ],
      },
    ],
  },

  app: {
    allMeetings: "Todas las reuniones",
    search: "Buscar reuniones",
    tabs: ["Próximas", "Pasadas", "Todas"],
    allSources: "Todas las fuentes",
    total: "3 reuniones",
    meetingCount: (n: number) => `${n} ${n > 1 ? "reuniones" : "reunión"}`,
    days: [
      {
        label: "Mañana · 27 de octubre de 2026",
        meetings: [{ time: "12:00 - 13:00", title: "Comida con Ana", place: "Café Central", source: "Creada con el asistente de IA" }],
      },
      {
        label: "Miércoles · 28 de octubre de 2026",
        meetings: [
          { time: "10:00 - 10:45", title: "Llamada con inversores", place: "Zoom", source: "Creada con el asistente de IA" },
          { time: "11:30 - 12:30", title: "Revisión de diseño con Marketing", place: "Zoom", source: "Creada en MeetingGuard" },
        ],
      },
    ],
    isNew: "Nueva",
    newMeeting: "Nueva reunión",
    details: "Detalles de la reunión",
    createdAi: "Creada con el asistente de IA",
    confidence: "Confianza de la IA 96%",
    when: "Cuándo",
    whenValue: "Mié, 28 oct · 10:00 - 10:45",
    duration: "Duración",
    videoCall: "Videollamada",
    passcode: "Código de acceso",
    participants: "1 participante",
    alerts: "Alertas",
    reminders: "Tus recordatorios predeterminados: 15 min antes, 5 min antes, Al inicio",
    intensity: "Intensidad: Máxima (tu predeterminada)",
  },

  screens: {
    listening: "Escuchando",
    spoken: "Llamada con inversores con Ana el miércoles a las 10, añade un enlace de Zoom",
    typeInstead: "Escribir",
    cardTitle: "Nueva reunión",
    cardWhen: "Mié, 28 oct · 10:00 - 10:45",
    cardWith: "Ana García",
    cardLink: "Enlace de Zoom añadido",
    cardTask: "Tarea: enviar la presentación a Ana",
    notSaved: "No se guarda nada hasta que confirmas",
    confirm: "Confirmar",
    edit: "Editar",
    agendaTitle: "Tu agenda",
    agendaToday: "Hoy",
    agendaOverdue: "Pendiente",
    agendaTomorrow: "Mañana",
    agendaItems: {
      today: ["10:00 Llamada con inversores", "12:30 Comida con Ana", "16:00 Revisión de diseño"],
      overdue: ["Enviar la presentación a Ana"],
      tomorrow: ["09:00 Reunión diaria", "11:00 Reunión con cliente"],
    },
    reading: "Leyendo en voz alta",
    summaryHello: "Buenos días",
    summaryLine: "3 reuniones hoy. 1 tarea pendiente.",
    summaryFirst: "Primero: Llamada con inversores a las 10:00",
    summaryStart: "Empezar el día",
    tasksTitle: "Tareas",
    tasks: [
      { title: "Enviar la presentación a Ana", due: "Hoy", link: "Llamada con inversores" },
      { title: "Reservar vuelos a Madrid", due: "Viernes", link: "" },
      { title: "Revisar el plan del Q4", due: "Próxima semana", link: "Revisión de diseño" },
    ],
    taskDone: "Hecha",
  },

  whatsapp: {
    eyebrow: "WhatsApp",
    line1: "Agenda directamente",
    line2: "desde WhatsApp.",
    body: "Vincula tu número una vez con un código de la app. Después escribe a MeetingGuard como a un asistente: reserva la reunión y se asegura de que no te la pierdas.",
    points: [
      ["Reuniones y tareas", "por mensaje"],
      ["Botones para confirmar", "antes de guardar nada"],
      ["Ningún mensaje que", "no hayas pedido"],
    ],
    phones: [
      {
        where: "En MeetingGuard",
        title: "Genera un código",
        body: "Toca Generar código y cópialo o abre WhatsApp. Es de un solo uso y caduca en minutos.",
      },
      {
        where: "En WhatsApp",
        title: "Envíalo y reserva con tus palabras",
        body: "Envía el código para vincular tu número y pide una reunión. Confirma y listo.",
      },
    ],
    link: {
      intro:
        "Vincula tu número de WhatsApp para crear reuniones por mensaje. Genera un código aquí y envíalo al bot desde WhatsApp. El código funciona una vez y caduca a los pocos minutos.",
      generate: "Generar código",
      sendTo: "Envía este código por WhatsApp al",
      expires: "Caduca en 9:58",
      copy: "Copiar código",
      open: "Abrir WhatsApp",
    },
    chat: {
      today: "Hoy",
      meta: "Esta empresa usa un servicio seguro de Meta para gestionar este chat.",
      message: "Mensaje",
      request: "llamada con inversores con Ana mañana a las 10, añade un enlace de zoom",
      prepared: "Preparé lo siguiente para ti. Revísalo y confírmalo.",
      proposal: "Proponer una llamada con inversores con Ana mañana a las 10:00 con un enlace de Zoom.",
      quoted: "• Proponer una llamada con inversores con Ana mañana a las 10:00…",
      apply: "¿Lo aplico? Responde 1 para confirmar o 2 para cancelar.",
      confirm: "Confirmar",
      cancel: "Cancelar",
      done: "Listo. Apliqué los cambios.",
    },
  },

  features: {
    eyebrow: "Funciones",
    line1: "Todo lo necesario",
    line2: "para llegar a tiempo.",
    levels: [
      { name: "Suave", note: "Una notificación discreta" },
      { name: "Estándar", note: "Sonido y vibración" },
      { name: "Crítica", note: "Alarma a pantalla completa con voz" },
    ],
    phrase: "Mueve mi reunión de las 15:00 con Mia al viernes",
    confirmed: "Movida al viernes · confirmado",
    tiles: {
      alarms: {
        title: "Alarmas imposibles de ignorar",
        body: "Una alarma a pantalla completa con sonido, posponer y descartar. Funciona con la app cerrada y sobrevive a un reinicio. Tú eliges la intensidad de cada reunión.",
      },
      "voice-assistant": {
        title: "Asistente de voz",
        body: "Crea, mueve y cancela reuniones con la voz en inglés o español. No se guarda nada hasta que confirmas.",
      },
      tasks: {
        title: "Tareas y recordatorios",
        body: "Tareas por voz con fecha límite, recordadas con las mismas alarmas y vinculadas a sus reuniones.",
      },
      agenda: {
        title: "Agenda en voz alta",
        body: "Escucha lo de hoy, lo pendiente y lo de mañana, con un resumen diario a tu hora.",
      },
      whatsapp: {
        title: "WhatsApp",
        body: "Crea reuniones y tareas por mensaje y confirma con un toque. Nunca enviamos mensajes que no hayas pedido.",
      },
      integrations: {
        title: "Calendarios y tareas sincronizados",
        body: "Google Calendar desde hoy. Outlook, Microsoft To Do y Google Tasks están en camino.",
      },
    },
    visuals: {
      dueToday: "Hoy",
      linked: "Llamada con inversores",
      newTask: "Enviar la presentación a Ana",
      reading: "Leyendo tu agenda",
      chatAsk: "Comida con Ana el viernes a la 1",
      chatCard: "Comida con Ana · vie 13:00",
      chatDone: "Listo. Ya está en tu calendario.",
      live: "Activo",
      debrief: "Resúmenes",
      tasks: [
        { title: "Reservar vuelos", due: "vie" },
        { title: "Revisar plan Q4", due: "lun" },
      ],
      newTaskShort: "Enviar la presentación",
    },
  },

  briefing: {
    eyebrow: "Resumen diario",
    line1: "Tu día, leído para ti,",
    line2: "a la hora que elijas.",
    body: "Cada mañana MeetingGuard lee tus reuniones, lo pendiente y lo que viene. En Android, te espera un resumen a pantalla completa al despertar.",
    points: ["Hoy, pendiente y mañana", "A la hora que configures", "Resumen a pantalla completa en Android"],
    androidOnly: "Resumen a pantalla completa: solo Android",
  },

  pricingTeaser: {
    eyebrow: "Precios",
    line1: "Empieza gratis.",
    line2: "Mejora cuando quieras.",
    points: ["Plan gratuito, sin tarjeta", "3 días de prueba gratis", "Pro desde 7,99 USD al mes"],
    note: "Las suscripciones se compran dentro de la app en Google Play o el App Store.",
  },

  assistantTeaser: {
    eyebrow: "Muy pronto",
    line1: "Un asistente ejecutivo",
    line2: "que trabaja para ti.",
    body: "Delega con la voz. Escribe correos, hace seguimiento y reserva, y tú apruebas cada paso. Te copia en cada correo.",
    addon: "Disponible como suscripción adicional.",
    visual: {
      ask: "Busca 30 minutos con Carlos la próxima semana",
      to: "Para: Carlos",
      cc: "Cc: tú",
      subject: "¿30 minutos la próxima semana?",
      steps: ["Correo enviado", "Seguimiento enviado", "Carlos eligió mar 11:00", "Lo aprobaste. Reservado."],
      booked: "Mar 11:00 con Carlos, en tu calendario",
    },
  },

  faqHome: { eyebrow: "Preguntas", title: "Preguntas, resueltas." },

  cta: { line1: "Tu próxima reunión", line2: "ya está cubierta.", sentence: "Gratis para empezar. Listo en un minuto." },

  footer: {
    blurb: "Mantente organizado y no vuelvas a perderte una reunión.",
    updates: "Novedades",
    updatesBody: "Noticias del lanzamiento y nuevas funciones, de vez en cuando. Sin spam.",
    contact: "Contacto",
    rights: "Todos los derechos reservados.",
    nav: "Pie de página",
    emailLabel: "Introduce tu correo electrónico",
    emailPlaceholder: "Tu correo para notificaciones",
    subscribe: "Suscribirme a novedades",
    subscribeShort: "Suscribirme",
    done: "Gracias, ya estás en la lista.",
  },

  notFound: { title: "Esta página no existe.", body: "Puede que el enlace sea antiguo o tenga un error.", home: "Volver al inicio" },
};

export const dictionaries = { en, es } as const;
