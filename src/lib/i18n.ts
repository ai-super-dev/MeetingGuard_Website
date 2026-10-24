/*
 * Every visible string on the site, in English and Spanish. `es` must mirror
 * the shape of `en` (the Dict type enforces it), so a missing translation is a
 * type error rather than a blank on the page.
 */

type Widen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly Widen<U>[]
    : { readonly [K in keyof T]: Widen<T[K]> };

export const en = {
  lang: "en",
  tagline: "Plan, Alert, Join. Your AI meeting companion.",
  skip: "Skip to content",

  header: {
    home: "MeetingGuard home",
    primary: "Primary",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    language: "Language",
  },
  links: { privacy: "Privacy Policy", terms: "Terms of Service" },
  store: {
    appStoreAria: "Download MeetingGuard on the App Store",
    appStoreTop: "Get it today",
    playAria: "Get MeetingGuard on Google Play",
    playTop: "Get it on",
  },
  qr: { scan: "Scan to Download", aria: "QR code to download MeetingGuard" },

  hero: { line1: "Never miss", line2: "what matters." },

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
  },

  problem: {
    eyebrow: "Why MeetingGuard",
    line1: "Your calendar stores time.",
    line2a: "MeetingGuard",
    line2b: "protects it.",
    body: "Calendars only store dates. When your day gets busy, passive notifications get ignored. MeetingGuard reads the same calendar — and makes sure you’re in the right meeting, right on time.",
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
        steps: ["Nothing happens.", "One small banner — swiped away with everything else.", "The call starts without you."],
      },
      {
        title: "With MeetingGuard",
        outcome: "On time",
        steps: [
          "Your phone vibrates and a full-screen alarm takes over — even with the app closed.",
          "Follow-ups keep going until you respond.",
          "One tap on Join now — you’re in the Zoom call.",
        ],
      },
    ],
  },

  how: {
    eyebrow: "How it works",
    title: "Plan. Alert. Join.",
    body: "Follow one meeting from the moment you ask for it to the moment you're in the call.",
    group: "How it works steps",
    show: "Show step",
    steps: [
      {
        day: "Mon",
        title: "Plan",
        body: "Type or say it in plain words. The assistant shows what it understood, and saves only when you confirm.",
        points: [
          "Plain text or voice, in English or Spanish",
          "Zoom, Google Meet or Teams link generated for you",
          "Saved to Google Calendar, Outlook and your phone, invitations sent",
        ],
      },
      {
        day: "Wed",
        title: "Alert",
        body: "Fifteen minutes before, an alarm takes over the screen — even with the app closed.",
        points: [
          "Full-screen alarm with sound and voice readout",
          "Snooze, or keep follow-ups going until you respond",
          "You choose the intensity for every meeting",
        ],
      },
      {
        day: "Wed",
        title: "Join",
        body: "Everything you need is one tap away — no searching for links or switching apps.",
        points: [
          "One tap into the Zoom, Google Meet or Teams call",
          "Meeting details and the link in one place",
          "See who's already in the call",
        ],
      },
    ],
  },

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

  whatsapp: {
    eyebrow: "WhatsApp",
    line1: "Schedule straight",
    line2: "from WhatsApp.",
    body: "Link your number once with a code from the app, then chat with MeetingGuard like you would with an assistant — it books the meeting and makes sure you never miss it.",
    points: [
      ["Instant scheduling for", "individuals or groups"],
      ["Plain language processing", "for complex bookings"],
      ["Seamless multi-calendar", "sync (Google, Microsoft)"],
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
    phrase: "Lunch with Ana tomorrow at 2 pm",
    confirmed: "Confirmed · added to your calendar",
    invite: "Invite",
    tiles: {
      alarm: {
        title: "Alarms you can't miss",
        body: "Full-screen alarms with sound and voice readout, gentle reminders, snooze and follow-ups — even when the app is closed. You choose the intensity for every meeting.",
      },
      sync: {
        title: "Two-way calendar sync",
        body: "Works with Google Calendar and Outlook. Meetings you create appear in both, with invitations and video-call links.",
      },
      join: {
        title: "Instant join",
        body: "One tap into the Zoom, Google Meet or Teams call — the link is generated for you.",
      },
      share: { title: "Share and invite", body: "Invitations and the call link go to everyone in a tap." },
      speak: {
        title: "Speak or type",
        body: "Tell the assistant what you need, in the app or by WhatsApp. It shows what it understood and only saves after you confirm.",
      },
      platforms: {
        title: "iPhone & Android · English & Español",
        body: "The same assistant and alarms on every phone, in English and Spanish.",
      },
    },
  },

  cta: { line1: "Your next meeting", line2: "is already covered." },

  footer: {
    blurb: "Stay organized and never miss a meeting again.",
    contact: "Contact",
    updates: "Stay updated",
    rights: "© 2026 MeetingGuard. All rights reserved.",
    nav: "Footer",
    emailLabel: "Enter your email address here",
    emailPlaceholder: "Your email for notifications",
    subscribe: "Subscribe for updates",
    done: "Thanks — you're on the list.",
    error: "Something went wrong. Please try again.",
    soon: "Update subscriptions are opening soon.",
  },

  legal: {
    back: "Back to home",
    updated: "Last updated: October 24, 2026",
    privacy: {
      title: "Privacy Policy",
      sections: [
        {
          heading: "What we collect",
          body: "Meeting titles, times, attendees and join links from the calendars you choose to connect, plus basic app diagnostics.",
        },
        {
          heading: "How we use it",
          body: "Only to schedule meetings, deliver reminders and alerts, and let you join with one tap. We never sell your data.",
        },
        {
          heading: "Your controls",
          body: "You can disconnect any calendar at any time and request deletion of your data from within the app.",
        },
        {
          heading: "Security",
          body: "Data is encrypted in transit and at rest, and calendar access uses the providers' official, revocable permissions.",
        },
      ],
    },
    terms: {
      title: "Terms of Service",
      sections: [
        {
          heading: "1. Acceptance of terms",
          body: "By downloading or using MeetingGuard you agree to these terms. If you do not agree, please do not use the app.",
        },
        {
          heading: "2. Your account",
          body: "You are responsible for the calendars and accounts you connect, and for keeping your sign-in credentials secure.",
        },
        {
          heading: "3. Acceptable use",
          body: "Do not misuse the service, interfere with its operation, or use it to send unsolicited invitations.",
        },
        {
          heading: "4. Changes",
          body: "We may update these terms from time to time. Continued use after changes take effect means you accept the revised terms.",
        },
      ],
    },
  },
};

export type Dict = Widen<Omit<typeof en, "app">> & {
  readonly app: Widen<Omit<typeof en.app, "meetingCount">> & { readonly meetingCount: (n: number) => string };
};

export const es: Dict = {
  lang: "es",
  tagline: "Planifica, Alerta, Únete. Tu asistente de reuniones con IA.",
  skip: "Saltar al contenido",

  header: {
    home: "Inicio de MeetingGuard",
    primary: "Principal",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    language: "Idioma",
  },
  links: { privacy: "Política de privacidad", terms: "Términos del servicio" },
  store: {
    appStoreAria: "Descarga MeetingGuard en el App Store",
    appStoreTop: "Descárgalo hoy",
    playAria: "Consigue MeetingGuard en Google Play",
    playTop: "Disponible en",
  },
  qr: { scan: "Escanea para descargar", aria: "Código QR para descargar MeetingGuard" },

  hero: { line1: "Nunca te pierdas", line2: "lo importante." },

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
          "Tu teléfono vibra y una alarma a pantalla completa toma el control, incluso con la app cerrada.",
          "Los recordatorios siguen hasta que respondes.",
          "Un toque en Unirse ahora y ya estás en la llamada de Zoom.",
        ],
      },
    ],
  },

  how: {
    eyebrow: "Cómo funciona",
    title: "Planifica. Alerta. Únete.",
    body: "Sigue una reunión desde que la pides hasta que entras en la llamada.",
    group: "Pasos de cómo funciona",
    show: "Mostrar paso",
    steps: [
      {
        day: "Lun",
        title: "Planifica",
        body: "Escríbelo o dilo con tus palabras. El asistente te muestra lo que entendió y solo guarda cuando confirmas.",
        points: [
          "Texto o voz, en inglés o español",
          "Enlace de Zoom, Google Meet o Teams generado automáticamente",
          "Guardada en Google Calendar, Outlook y tu teléfono, con invitaciones enviadas",
        ],
      },
      {
        day: "Mié",
        title: "Alerta",
        body: "Quince minutos antes, una alarma ocupa la pantalla, incluso con la app cerrada.",
        points: [
          "Alarma a pantalla completa con sonido y lectura en voz",
          "Pospón, o deja que los recordatorios sigan hasta que respondas",
          "Tú eliges la intensidad de cada reunión",
        ],
      },
      {
        day: "Mié",
        title: "Únete",
        body: "Todo lo que necesitas está a un toque: sin buscar enlaces ni cambiar de app.",
        points: [
          "Un toque y entras en la llamada de Zoom, Google Meet o Teams",
          "Los detalles de la reunión y el enlace en un solo lugar",
          "Mira quién está ya en la llamada",
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

  whatsapp: {
    eyebrow: "WhatsApp",
    line1: "Agenda directamente",
    line2: "desde WhatsApp.",
    body: "Vincula tu número una vez con un código de la app y luego chatea con MeetingGuard como lo harías con un asistente: reserva la reunión y se asegura de que no te la pierdas.",
    points: [
      ["Agenda al instante para", "personas o grupos"],
      ["Lenguaje natural para", "reservas complejas"],
      ["Sincronización con varios", "calendarios (Google, Microsoft)"],
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
    phrase: "Comida con Ana mañana a las 14:00",
    confirmed: "Confirmado · añadido a tu calendario",
    invite: "Invitar",
    tiles: {
      alarm: {
        title: "Alarmas imposibles de ignorar",
        body: "Alarmas a pantalla completa con sonido y lectura en voz, recordatorios suaves, posponer y seguimientos, incluso con la app cerrada. Tú eliges la intensidad de cada reunión.",
      },
      sync: {
        title: "Sincronización bidireccional",
        body: "Funciona con Google Calendar y Outlook. Las reuniones que creas aparecen en ambos, con invitaciones y enlaces de videollamada.",
      },
      join: {
        title: "Únete al instante",
        body: "Un toque y entras en la llamada de Zoom, Google Meet o Teams: el enlace se genera automáticamente.",
      },
      share: { title: "Comparte e invita", body: "Las invitaciones y el enlace llegan a todos con un toque." },
      speak: {
        title: "Habla o escribe",
        body: "Dile al asistente lo que necesitas, en la app o por WhatsApp. Te muestra lo que entendió y solo guarda cuando confirmas.",
      },
      platforms: {
        title: "iPhone y Android · English y Español",
        body: "El mismo asistente y las mismas alarmas en cualquier teléfono, en inglés y en español.",
      },
    },
  },

  cta: { line1: "Tu próxima reunión", line2: "ya está cubierta." },

  footer: {
    blurb: "Mantente organizado y no vuelvas a perderte una reunión.",
    contact: "Contacto",
    updates: "Novedades",
    rights: "© 2026 MeetingGuard. Todos los derechos reservados.",
    nav: "Pie de página",
    emailLabel: "Introduce tu correo electrónico",
    emailPlaceholder: "Tu correo para notificaciones",
    subscribe: "Suscribirme a novedades",
    done: "Gracias, ya estás en la lista.",
    error: "Algo salió mal. Inténtalo de nuevo.",
    soon: "Las suscripciones abrirán pronto.",
  },

  legal: {
    back: "Volver al inicio",
    updated: "Última actualización: 24 de octubre de 2026",
    privacy: {
      title: "Política de privacidad",
      sections: [
        {
          heading: "Qué recopilamos",
          body: "Títulos, horarios, asistentes y enlaces de las reuniones de los calendarios que decidas conectar, además de diagnósticos básicos de la app.",
        },
        {
          heading: "Cómo lo usamos",
          body: "Solo para programar reuniones, enviar recordatorios y alertas, y permitirte unirte con un toque. Nunca vendemos tus datos.",
        },
        {
          heading: "Tus controles",
          body: "Puedes desconectar cualquier calendario en cualquier momento y solicitar la eliminación de tus datos desde la app.",
        },
        {
          heading: "Seguridad",
          body: "Los datos se cifran en tránsito y en reposo, y el acceso al calendario usa los permisos oficiales y revocables de cada proveedor.",
        },
      ],
    },
    terms: {
      title: "Términos del servicio",
      sections: [
        {
          heading: "1. Aceptación de los términos",
          body: "Al descargar o usar MeetingGuard aceptas estos términos. Si no estás de acuerdo, no uses la app.",
        },
        {
          heading: "2. Tu cuenta",
          body: "Eres responsable de los calendarios y cuentas que conectas, y de mantener seguras tus credenciales de acceso.",
        },
        {
          heading: "3. Uso aceptable",
          body: "No hagas un uso indebido del servicio, no interfieras en su funcionamiento ni lo uses para enviar invitaciones no solicitadas.",
        },
        {
          heading: "4. Cambios",
          body: "Podemos actualizar estos términos ocasionalmente. Seguir usando la app después de los cambios implica que aceptas los términos revisados.",
        },
      ],
    },
  },
};

export const dictionaries = { en, es } as const;
