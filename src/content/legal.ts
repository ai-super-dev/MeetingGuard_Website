import type { Lang } from "@/lib/routes";

/*
 * The privacy policy and terms of service. The English text is copied
 * unchanged from the approved documents (privacy-policy.html and terms.html,
 * last updated September 28, 2026); the Spanish is a translation of it.
 * Keep both languages in step when the documents change.
 */

/** A paragraph, or a bulleted list when it is an array. */
export type LegalBlock = string | readonly string[];
export type LegalSection = { heading: string; body: readonly LegalBlock[] };
export type LegalDocKey = "privacy" | "terms";
export type LegalDoc = {
  path: string;
  title: string;
  description: string;
  updated: string;
  intro: readonly string[];
  sections: readonly LegalSection[];
};

export const legalDocs: Record<Lang, Record<LegalDocKey, LegalDoc>> = {
  "en": {
    "privacy": {
      "path": "/privacy-policy",
      "title": "Privacy Policy",
      "description": "How MeetingGuard AI collects, uses and protects your data.",
      "updated": "Last updated: September 28, 2026",
      "intro": [
        "This policy explains what information the MeetingGuard AI app collects, how we use it, who we share it with and the choices you have. MeetingGuard AI is provided by AETERNUM TECH LTD (\"we\", \"us\")."
      ],
      "sections": [
        {
          "heading": "Who is responsible for your data",
          "body": [
            "AETERNUM TECH LTD (Company No. 14085985), registered at 128 City Road, London, United Kingdom, EC1V 2NX, is responsible for the personal data processed through MeetingGuard AI. You can contact us at support@meetingguard.ai."
          ]
        },
        {
          "heading": "Information we collect",
          "body": [
            "We only collect what the app needs to work:",
            [
              "Account information: when you sign in with Google, we receive your name, email address, profile photo and your Google account identifier. If your account uses an email address and password, the password is handled by Firebase Authentication and we never see it.",
              "Meetings and notes that you create, import or edit: titles, descriptions, dates, times and time zones, locations, video-call links and passcodes, participants' names and email addresses, preparation tips, reminder settings and notes.",
              "Preferences: language, time zone, clock format, alert settings and the calendars you choose to sync.",
              "AI assistant usage: how many assistant requests you make each day, to apply the daily limit of your plan.",
              "Crash and error reports, when crash reporting is enabled in your version of the app: device model, operating system, app version and technical details of the error. We design these reports to leave out your meetings, notes and messages, and email addresses are removed before they are sent."
            ]
          ]
        },
        {
          "heading": "Information that stays on your device",
          "body": [
            "Some information is only stored on your phone:",
            [
              "Files you attach to meetings. They are not uploaded to our servers and are not available on your other devices.",
              "Your conversation with the AI assistant, so you can continue it later. The recent messages are sent with each new request (see \"AI assistant\").",
              "A copy of your meetings, notes and preferences, so the app works offline. It is deleted when you sign out.",
              "Your reminders, which are scheduled by your phone's operating system."
            ]
          ]
        },
        {
          "heading": "How we use your information",
          "body": [
            "We use your information to:",
            [
              "Provide the app: keep your meetings and notes up to date on your devices, schedule your alerts and show your agenda.",
              "Sync the calendars you connect.",
              "Answer your requests to the AI assistant and apply the daily limit of your plan.",
              "Keep the service secure, prevent abuse and fix errors."
            ],
            "We do not sell your personal information, we do not use it for advertising and we do not track you across other apps or websites."
          ]
        },
        {
          "heading": "Google Calendar",
          "body": [
            "If you connect Google Calendar, you allow MeetingGuard AI to view and edit the events of your Google calendars (the \"calendar.events\" permission). The app uses this permission to bring the events of your main calendar into MeetingGuard AI, so you get alerts for them, and to add, change or delete the events you manage in MeetingGuard AI, including creating Google Meet links and sending invitations to participants when you ask for it.",
            "Events from Google Calendar are saved in your MeetingGuard AI account (Google Firebase) so that they are available on your devices, so that you get alerts for them and so that the AI assistant can answer questions about your schedule when you use it.",
            "The access token that lets the app talk to Google Calendar stays on your device, is managed by Google Sign-In and is never stored on our servers. You can disconnect Google Calendar in the app at any time, or remove MeetingGuard AI's access in your Google Account (myaccount.google.com/permissions).",
            "MeetingGuard AI's use and transfer to any other app of information received from Google APIs will adhere to the Google API Services User Data Policy, including the Limited Use requirements.",
            [
              "We use Google user data only to provide and improve the features described in this policy.",
              "We only transfer it to others when it is needed for those features (for example, to OpenAI when you ask the AI assistant about your schedule), for security, to comply with the law, or as part of a merger or acquisition with notice to you.",
              "We do not use it for advertising, we do not sell it and we do not use it to train general AI or machine-learning models.",
              "People do not read it unless you give us permission (for example, for support), it is needed for security or it is required by law."
            ]
          ]
        },
        {
          "heading": "Calendars on your phone",
          "body": [
            "If you allow calendar access, MeetingGuard AI reads the events of the phone calendars you choose and saves them in your account, so you get alerts for them. If you also choose a calendar for export, the app writes your MeetingGuard AI meetings into it. You can change these choices in the app, or turn off calendar access in your phone's settings."
          ]
        },
        {
          "heading": "AI assistant (OpenAI)",
          "body": [
            "The AI assistant is optional. When you send it a request, our server (Google Cloud Functions) sends OpenAI the recent messages of your conversation and a limited view of your meetings from the past 7 days to the next 60 days: titles, dates and times, locations, and up to 10 participants' names and email addresses per meeting. A meeting's description is only included when you ask for follow-up ideas about that meeting. Notes, video-call links and passcodes are never sent.",
            "OpenAI processes this information to write the answer, which our server returns to the app. According to OpenAI's API data policies, OpenAI does not use data sent through its API to train its models by default, and it may keep the data for a limited time to monitor for abuse. The app never contains an OpenAI key and never contacts OpenAI directly.",
            "The assistant only proposes changes: nothing is created, changed, deleted or shared until you confirm it. Answers can be wrong, so check them before you confirm. Please do not send sensitive information, such as health data, to the assistant."
          ]
        },
        {
          "heading": "Notifications",
          "body": [
            "Meeting alerts are scheduled on your device by the operating system, based on your meetings and your alert settings. They show the meeting title and time, also on the lock screen according to your phone's notification settings. We do not send push notifications from a server and we do not use notifications for marketing."
          ]
        },
        {
          "heading": "Who we share information with",
          "body": [
            "We share personal information only with:",
            [
              "Google (Firebase Authentication, Cloud Firestore and Cloud Functions), which hosts your account and data and runs our server code.",
              "OpenAI, which processes your requests to the AI assistant.",
              "Sentry (Functional Software, Inc.), which receives crash and error reports when crash reporting is enabled.",
              "Google Calendar and the calendars on your phone, only when you connect them.",
              "The people you invite: when you ask the app to send invitations or to share a meeting, the recipients receive the meeting details.",
              "Authorities, when the law requires it, or a company that takes over the service, which must follow this policy."
            ]
          ]
        },
        {
          "heading": "Where your information is processed",
          "body": [
            "Our service providers may process your information on servers in the United States and other countries. When the law requires it, these transfers are protected by appropriate safeguards, such as the European Commission's Standard Contractual Clauses."
          ]
        },
        {
          "heading": "How long we keep your information and how to delete it",
          "body": [
            "We keep your information while your account exists.",
            [
              "You can delete your account at any time in the app: Settings → Account → Delete account. This permanently deletes your account, meetings, notes, preferences, assistant usage records and subscription status from our servers, signs you out and removes the app's access to your Google account.",
              "If you can't sign in anymore, write to support@meetingguard.ai from the email address of your account and ask us to delete it.",
              "When you delete a meeting, a minimal record without its content (identifiers and time) is kept for up to 60 days so the deletion reaches your other devices and calendars; after that our server erases it automatically.",
              "Events that the app added to Google Calendar or to your phone's calendar stay there until you delete them.",
              "Server logs contain only your anonymous user ID and are kept for up to 30 days.",
              "Our database backups, which protect against data loss, still contain deleted information until they expire: daily backups are kept for up to 14 days and point-in-time recovery covers the last 7 days. Backups are not used for anything else.",
              "When you delete your account, we keep a record with only your anonymous user ID and the date for 30 days. If we ever have to restore a backup, we use it to delete your data again, so a deleted account stays deleted.",
              "The copy stored on your device is deleted when you sign out or delete your account."
            ]
          ]
        },
        {
          "heading": "Security",
          "body": [
            "Your information is encrypted in transit (TLS) and at rest by Google Cloud. Security rules only allow your own account to read and write your data, and the keys for the AI service stay on our server. No system is completely secure, so we cannot guarantee absolute security, but we work to protect your information and will inform you as the law requires if a breach affects you."
          ]
        },
        {
          "heading": "Your rights",
          "body": [
            "Depending on where you live (for example, under the GDPR in the European Union or the CCPA in California), you may have the right to:",
            [
              "Access your personal data and get a copy of it.",
              "Correct inaccurate data. You can edit your meetings, notes and settings in the app.",
              "Delete your data (see above).",
              "Object to or restrict some processing, and withdraw your consent at any time, for example by disconnecting Google Calendar, turning off calendar access or not using the AI assistant.",
              "Receive your data in a portable format.",
              "Complain to your local data protection authority."
            ],
            "To use these rights, write to support@meetingguard.ai. We will reply within the time required by law.",
            "We process your data to provide the service you asked for (performance of a contract), with your consent (calendar connections and the AI assistant) and for our legitimate interests (security and fixing errors)."
          ]
        },
        {
          "heading": "Children",
          "body": [
            "MeetingGuard AI is not intended for children under 16, and we do not knowingly collect personal information from them. If you think a child has given us personal information, contact us at support@meetingguard.ai and we will delete it."
          ]
        },
        {
          "heading": "Changes to this policy",
          "body": [
            "If we change this policy, we will update the date at the top and, for important changes, let you know in the app before they apply."
          ]
        },
        {
          "heading": "Contact",
          "body": [
            "AETERNUM TECH LTD (Company No. 14085985), 128 City Road, London, United Kingdom, EC1V 2NX. Email: support@meetingguard.ai."
          ]
        }
      ]
    },
    "terms": {
      "path": "/terms-of-service",
      "title": "Terms of Service",
      "description": "The terms for using the MeetingGuard AI app.",
      "updated": "Last updated: September 28, 2026",
      "intro": [
        "Please read these terms carefully. They explain the rules for using MeetingGuard AI and what you can expect from us."
      ],
      "sections": [
        {
          "heading": "Agreement",
          "body": [
            "These Terms of Service are an agreement between you and AETERNUM TECH LTD (\"we\", \"us\"), a company registered in England and Wales under Company No. 14085985 with its registered office at 128 City Road, London, United Kingdom, EC1V 2NX, for the use of the MeetingGuard AI app. By creating an account or using the app, you accept these terms and our Privacy Policy. If you do not agree, please do not use the app."
          ]
        },
        {
          "heading": "The service",
          "body": [
            "MeetingGuard AI helps you manage your meetings: it stores your meetings and notes, schedules reminders on your device, syncs with Google Calendar and the calendars on your phone if you connect them, and offers an AI assistant that proposes changes for you to confirm. We may add, change or remove features over time. Features that are not available yet are marked as such in the app."
          ]
        },
        {
          "heading": "Your account",
          "body": [
            "To use MeetingGuard AI:",
            [
              "You must be at least 16 years old, or older if your country requires it to use online services without a parent's consent.",
              "Give accurate information and keep your Google account or password secure.",
              "You are responsible for the activity in your account. Tell us at support@meetingguard.ai if you think someone else is using it."
            ]
          ]
        },
        {
          "heading": "Alerts and reminders",
          "body": [
            "We work hard to make alerts reliable, but their delivery depends on your device: notification permissions, battery optimization, Do Not Disturb and Focus modes, silent mode, the device being on and the app being able to refresh its schedule. Alerts can arrive late or not at all. For important meetings, keep another reminder as well."
          ]
        },
        {
          "heading": "AI assistant",
          "body": [
            "When you use the AI assistant:",
            [
              "Answers and proposals are generated automatically and can be wrong or incomplete. Review every proposal before you confirm it. You are responsible for the changes you confirm and for the messages you send to other people.",
              "Each plan has a daily limit of assistant requests (the Free plan includes 5 per day). Limits reset every day at midnight UTC.",
              "Do not use the assistant for illegal purposes or in ways that break OpenAI's usage policies."
            ]
          ]
        },
        {
          "heading": "Plans and payments",
          "body": [
            "MeetingGuard AI is currently free to use. The paid plans (Pro and Premium) are shown for information only and cannot be purchased yet. If we offer paid plans in the future, they will be sold through the App Store or Google Play, and the price, billing period, renewal and cancellation terms will be shown before you buy."
          ]
        },
        {
          "heading": "Your content",
          "body": [
            "You keep ownership of the meetings, notes and other content you add. You allow us to store, copy and process it only as needed to run the service for you, for example to sync it, schedule your alerts or answer your assistant requests. You are responsible for having the right to add other people's contact details to your meetings and to send them invitations."
          ]
        },
        {
          "heading": "Third-party services",
          "body": [
            "The app works with services from other companies, such as Google (sign-in, Calendar and Firebase) and OpenAI. Their own terms and privacy policies apply when you use them, and we are not responsible for those services."
          ]
        },
        {
          "heading": "Acceptable use",
          "body": [
            "You agree not to:",
            [
              "Use the app to break the law or other people's rights.",
              "Send spam or unwanted invitations through the app.",
              "Try to access other users' data, our servers or the AI service in ways we do not allow, or get around usage limits.",
              "Disrupt the service, overload it with automated requests, or copy or reverse engineer the app where the law does not allow it."
            ]
          ]
        },
        {
          "heading": "Intellectual property",
          "body": [
            "The app, its design and its brand belong to AETERNUM TECH LTD or its licensors. These terms only give you the right to use the app as described here."
          ]
        },
        {
          "heading": "Ending your use of the app",
          "body": [
            "You can stop using the app and delete your account at any time in Settings → Account → Delete account. We may suspend or close accounts that seriously or repeatedly break these terms, or when the law requires it. When possible, we will tell you first and explain why."
          ]
        },
        {
          "heading": "Disclaimers",
          "body": [
            "The app is provided \"as is\" and \"as available\". To the extent allowed by law, we do not promise that it will work without interruptions or errors, or that alerts, calendar sync and AI answers will always be accurate or on time. Nothing in these terms limits the rights you have under consumer protection laws that cannot be waived."
          ]
        },
        {
          "heading": "Limitation of liability",
          "body": [
            "To the extent allowed by law, AETERNUM TECH LTD is not liable for indirect or consequential losses, such as missed meetings, lost opportunities or lost data, and our total liability for any claim related to the app is limited to the amount you paid us for it in the 12 months before the claim. This does not limit liability that cannot be limited by law."
          ]
        },
        {
          "heading": "Governing law",
          "body": [
            "These terms are governed by the laws of England and Wales, and any dispute is resolved by the courts of England and Wales. If you are a consumer, you also keep the protection of the mandatory laws of the country where you live and can go to its courts."
          ]
        },
        {
          "heading": "Changes to these terms",
          "body": [
            "We may update these terms. We will change the date at the top and, for important changes, let you know in the app before they apply. If you keep using the app afterwards, the new terms apply; if you do not agree with them, you can delete your account."
          ]
        },
        {
          "heading": "Contact",
          "body": [
            "AETERNUM TECH LTD (Company No. 14085985), 128 City Road, London, United Kingdom, EC1V 2NX. Email: support@meetingguard.ai."
          ]
        }
      ]
    }
  },
  "es": {
    "privacy": {
      "path": "/privacy-policy",
      "title": "Política de privacidad",
      "description": "Cómo MeetingGuard AI recopila, usa y protege tus datos.",
      "updated": "Última actualización: 28 de septiembre de 2026",
      "intro": [
        "Esta política explica qué información recopila la app MeetingGuard AI, cómo la usamos, con quién la compartimos y qué opciones tienes. MeetingGuard AI es un servicio de AETERNUM TECH LTD (\"nosotros\")."
      ],
      "sections": [
        {
          "heading": "Quién es responsable de tus datos",
          "body": [
            "AETERNUM TECH LTD (número de empresa 14085985), con domicilio social en 128 City Road, Londres, Reino Unido, EC1V 2NX, es responsable de los datos personales que se tratan a través de MeetingGuard AI. Puedes contactarnos en support@meetingguard.ai."
          ]
        },
        {
          "heading": "Información que recopilamos",
          "body": [
            "Solo recopilamos lo que la app necesita para funcionar:",
            [
              "Información de la cuenta: cuando inicias sesión con Google, recibimos tu nombre, tu dirección de correo electrónico, tu foto de perfil y el identificador de tu cuenta de Google. Si tu cuenta usa una dirección de correo electrónico y una contraseña, la contraseña la gestiona Firebase Authentication y nunca la vemos.",
              "Las reuniones y notas que creas, importas o editas: títulos, descripciones, fechas, horas y zonas horarias, ubicaciones, enlaces y códigos de acceso de videollamadas, nombres y direcciones de correo electrónico de los participantes, consejos de preparación, ajustes de recordatorios y notas.",
              "Preferencias: idioma, zona horaria, formato de hora, ajustes de alertas y los calendarios que eliges sincronizar.",
              "Uso del asistente de IA: cuántas solicitudes haces al asistente cada día, para aplicar el límite diario de tu plan.",
              "Informes de fallos y errores, cuando la notificación de fallos está activada en tu versión de la app: modelo del dispositivo, sistema operativo, versión de la app y detalles técnicos del error. Diseñamos estos informes para que no incluyan tus reuniones, notas ni mensajes, y las direcciones de correo electrónico se eliminan antes de enviarlos."
            ]
          ]
        },
        {
          "heading": "Información que se queda en tu dispositivo",
          "body": [
            "Parte de la información solo se guarda en tu teléfono:",
            [
              "Los archivos que adjuntas a las reuniones. No se suben a nuestros servidores y no están disponibles en tus otros dispositivos.",
              "Tu conversación con el asistente de IA, para que puedas continuarla más tarde. Los mensajes recientes se envían con cada nueva solicitud (consulta \"Asistente de IA\").",
              "Una copia de tus reuniones, notas y preferencias, para que la app funcione sin conexión. Se elimina cuando cierras sesión.",
              "Tus recordatorios, que programa el sistema operativo de tu teléfono."
            ]
          ]
        },
        {
          "heading": "Cómo usamos tu información",
          "body": [
            "Usamos tu información para:",
            [
              "Prestar el servicio de la app: mantener tus reuniones y notas actualizadas en tus dispositivos, programar tus alertas y mostrar tu agenda.",
              "Sincronizar los calendarios que conectas.",
              "Responder a tus solicitudes al asistente de IA y aplicar el límite diario de tu plan.",
              "Mantener el servicio seguro, prevenir abusos y corregir errores."
            ],
            "No vendemos tu información personal, no la usamos para publicidad y no te rastreamos en otras apps o sitios web."
          ]
        },
        {
          "heading": "Google Calendar",
          "body": [
            "Si conectas Google Calendar, permites que MeetingGuard AI vea y edite los eventos de tus calendarios de Google (el permiso \"calendar.events\"). La app usa este permiso para traer a MeetingGuard AI los eventos de tu calendario principal, para que recibas alertas de ellos, y para añadir, cambiar o eliminar los eventos que gestionas en MeetingGuard AI, incluida la creación de enlaces de Google Meet y el envío de invitaciones a los participantes cuando lo pides.",
            "Los eventos de Google Calendar se guardan en tu cuenta de MeetingGuard AI (Google Firebase) para que estén disponibles en tus dispositivos, para que recibas alertas de ellos y para que el asistente de IA pueda responder preguntas sobre tu agenda cuando lo uses.",
            "El token de acceso que permite a la app comunicarse con Google Calendar se queda en tu dispositivo, lo gestiona Google Sign-In y nunca se guarda en nuestros servidores. Puedes desconectar Google Calendar en la app en cualquier momento, o retirar el acceso de MeetingGuard AI en tu cuenta de Google (myaccount.google.com/permissions).",
            "El uso que MeetingGuard AI hace de la información recibida de las API de Google, y su transferencia a cualquier otra app, se ajustará a la Política de datos de usuario de los servicios de API de Google (Google API Services User Data Policy), incluidos los requisitos de uso limitado (Limited Use).",
            [
              "Usamos los datos de usuario de Google solo para prestar y mejorar las funciones descritas en esta política.",
              "Solo los transferimos a terceros cuando es necesario para esas funciones (por ejemplo, a OpenAI cuando preguntas al asistente de IA sobre tu agenda), por seguridad, para cumplir la ley o como parte de una fusión o adquisición, avisándote previamente.",
              "No los usamos para publicidad, no los vendemos y no los usamos para entrenar modelos generales de IA o de aprendizaje automático.",
              "Ninguna persona los lee salvo que nos des permiso (por ejemplo, para soporte), sea necesario por seguridad o lo exija la ley."
            ]
          ]
        },
        {
          "heading": "Calendarios de tu teléfono",
          "body": [
            "Si permites el acceso al calendario, MeetingGuard AI lee los eventos de los calendarios del teléfono que elijas y los guarda en tu cuenta, para que recibas alertas de ellos. Si además eliges un calendario para exportar, la app escribe en él tus reuniones de MeetingGuard AI. Puedes cambiar estas opciones en la app o desactivar el acceso al calendario en los ajustes de tu teléfono."
          ]
        },
        {
          "heading": "Asistente de IA (OpenAI)",
          "body": [
            "El asistente de IA es opcional. Cuando le envías una solicitud, nuestro servidor (Google Cloud Functions) envía a OpenAI los mensajes recientes de tu conversación y una vista limitada de tus reuniones, desde los 7 días anteriores hasta los 60 días siguientes: títulos, fechas y horas, ubicaciones, y los nombres y direcciones de correo electrónico de hasta 10 participantes por reunión. La descripción de una reunión solo se incluye cuando pides ideas de seguimiento sobre esa reunión. Las notas, los enlaces de videollamada y los códigos de acceso nunca se envían.",
            "OpenAI procesa esta información para redactar la respuesta, que nuestro servidor devuelve a la app. Según las políticas de datos de la API de OpenAI, OpenAI no usa por defecto los datos enviados a través de su API para entrenar sus modelos, y puede conservarlos durante un tiempo limitado para detectar abusos. La app nunca contiene una clave de OpenAI y nunca se comunica directamente con OpenAI.",
            "El asistente solo propone cambios: no se crea, cambia, elimina ni comparte nada hasta que lo confirmas. Las respuestas pueden ser incorrectas, así que revísalas antes de confirmar. Por favor, no envíes información sensible, como datos de salud, al asistente."
          ]
        },
        {
          "heading": "Notificaciones",
          "body": [
            "El sistema operativo programa las alertas de reuniones en tu dispositivo, según tus reuniones y tus ajustes de alertas. Muestran el título y la hora de la reunión, también en la pantalla de bloqueo según los ajustes de notificaciones de tu teléfono. No enviamos notificaciones push desde un servidor y no usamos las notificaciones para marketing."
          ]
        },
        {
          "heading": "Con quién compartimos información",
          "body": [
            "Solo compartimos información personal con:",
            [
              "Google (Firebase Authentication, Cloud Firestore y Cloud Functions), que aloja tu cuenta y tus datos y ejecuta el código de nuestro servidor.",
              "OpenAI, que procesa tus solicitudes al asistente de IA.",
              "Sentry (Functional Software, Inc.), que recibe los informes de fallos y errores cuando la notificación de fallos está activada.",
              "Google Calendar y los calendarios de tu teléfono, solo cuando los conectas.",
              "Las personas que invitas: cuando pides a la app que envíe invitaciones o comparta una reunión, los destinatarios reciben los detalles de la reunión.",
              "Las autoridades, cuando la ley lo exige, o una empresa que se haga cargo del servicio, que deberá cumplir esta política."
            ]
          ]
        },
        {
          "heading": "Dónde se procesa tu información",
          "body": [
            "Nuestros proveedores de servicios pueden procesar tu información en servidores de Estados Unidos y otros países. Cuando la ley lo exige, estas transferencias están protegidas con garantías adecuadas, como las Cláusulas Contractuales Tipo de la Comisión Europea."
          ]
        },
        {
          "heading": "Cuánto tiempo conservamos tu información y cómo eliminarla",
          "body": [
            "Conservamos tu información mientras exista tu cuenta.",
            [
              "Puedes eliminar tu cuenta en cualquier momento en la app: Ajustes → Cuenta → Eliminar cuenta. Esto elimina de forma permanente de nuestros servidores tu cuenta, tus reuniones, notas, preferencias, registros de uso del asistente y el estado de tu suscripción, cierra tu sesión y retira el acceso de la app a tu cuenta de Google.",
              "Si ya no puedes iniciar sesión, escribe a support@meetingguard.ai desde la dirección de correo electrónico de tu cuenta y pídenos que la eliminemos.",
              "Cuando eliminas una reunión, se conserva un registro mínimo sin su contenido (identificadores y hora) durante un máximo de 60 días para que la eliminación llegue a tus otros dispositivos y calendarios; después, nuestro servidor lo borra automáticamente.",
              "Los eventos que la app añadió a Google Calendar o al calendario de tu teléfono permanecen allí hasta que los elimines.",
              "Los registros del servidor solo contienen tu ID de usuario anónimo y se conservan durante un máximo de 30 días.",
              "Las copias de seguridad de nuestra base de datos, que protegen frente a la pérdida de datos, siguen conteniendo la información eliminada hasta que caducan: las copias diarias se conservan durante un máximo de 14 días y la recuperación a un momento dado cubre los últimos 7 días. Las copias de seguridad no se usan para nada más.",
              "Cuando eliminas tu cuenta, conservamos durante 30 días un registro con solo tu ID de usuario anónimo y la fecha. Si alguna vez tenemos que restaurar una copia de seguridad, lo usamos para volver a eliminar tus datos, de modo que una cuenta eliminada siga eliminada.",
              "La copia guardada en tu dispositivo se elimina cuando cierras sesión o eliminas tu cuenta."
            ]
          ]
        },
        {
          "heading": "Seguridad",
          "body": [
            "Google Cloud cifra tu información en tránsito (TLS) y en reposo. Las reglas de seguridad solo permiten que tu propia cuenta lea y escriba tus datos, y las claves del servicio de IA se quedan en nuestro servidor. Ningún sistema es completamente seguro, así que no podemos garantizar una seguridad absoluta, pero trabajamos para proteger tu información y te informaremos según lo exija la ley si una brecha de seguridad te afecta."
          ]
        },
        {
          "heading": "Tus derechos",
          "body": [
            "Según dónde vivas (por ejemplo, en virtud del RGPD en la Unión Europea o de la CCPA en California), puedes tener derecho a:",
            [
              "Acceder a tus datos personales y obtener una copia.",
              "Corregir los datos inexactos. Puedes editar tus reuniones, notas y ajustes en la app.",
              "Eliminar tus datos (consulta más arriba).",
              "Oponerte a algunos tratamientos o limitarlos, y retirar tu consentimiento en cualquier momento, por ejemplo desconectando Google Calendar, desactivando el acceso al calendario o dejando de usar el asistente de IA.",
              "Recibir tus datos en un formato portátil.",
              "Presentar una reclamación ante tu autoridad local de protección de datos."
            ],
            "Para ejercer estos derechos, escribe a support@meetingguard.ai. Te responderemos en el plazo que exige la ley.",
            "Tratamos tus datos para prestar el servicio que has pedido (ejecución de un contrato), con tu consentimiento (conexiones de calendario y asistente de IA) y por nuestros intereses legítimos (seguridad y corrección de errores)."
          ]
        },
        {
          "heading": "Menores",
          "body": [
            "MeetingGuard AI no está dirigida a menores de 16 años y no recopilamos a sabiendas información personal de ellos. Si crees que un menor nos ha dado información personal, escríbenos a support@meetingguard.ai y la eliminaremos."
          ]
        },
        {
          "heading": "Cambios en esta política",
          "body": [
            "Si cambiamos esta política, actualizaremos la fecha que aparece al principio y, en el caso de cambios importantes, te avisaremos en la app antes de que se apliquen."
          ]
        },
        {
          "heading": "Contacto",
          "body": [
            "AETERNUM TECH LTD (número de empresa 14085985), 128 City Road, Londres, Reino Unido, EC1V 2NX. Correo electrónico: support@meetingguard.ai."
          ]
        }
      ]
    },
    "terms": {
      "path": "/terms-of-service",
      "title": "Términos del servicio",
      "description": "Los términos para usar la app MeetingGuard AI.",
      "updated": "Última actualización: 28 de septiembre de 2026",
      "intro": [
        "Lee estos términos con atención. Explican las normas para usar MeetingGuard AI y lo que puedes esperar de nosotros."
      ],
      "sections": [
        {
          "heading": "Acuerdo",
          "body": [
            "Estos Términos del servicio son un acuerdo entre tú y AETERNUM TECH LTD (\"nosotros\"), una empresa registrada en Inglaterra y Gales con el número de empresa 14085985 y domicilio social en 128 City Road, Londres, Reino Unido, EC1V 2NX, para el uso de la app MeetingGuard AI. Al crear una cuenta o usar la app, aceptas estos términos y nuestra Política de privacidad. Si no estás de acuerdo, no uses la app."
          ]
        },
        {
          "heading": "El servicio",
          "body": [
            "MeetingGuard AI te ayuda a gestionar tus reuniones: guarda tus reuniones y notas, programa recordatorios en tu dispositivo, se sincroniza con Google Calendar y con los calendarios de tu teléfono si los conectas, y ofrece un asistente de IA que te propone cambios para que los confirmes. Podemos añadir, cambiar o eliminar funciones con el tiempo. Las funciones que aún no están disponibles aparecen marcadas como tales en la app."
          ]
        },
        {
          "heading": "Tu cuenta",
          "body": [
            "Para usar MeetingGuard AI:",
            [
              "Debes tener al menos 16 años, o más si tu país lo exige para usar servicios en línea sin el consentimiento de tus padres.",
              "Da información correcta y mantén segura tu cuenta de Google o tu contraseña.",
              "Eres responsable de la actividad de tu cuenta. Avísanos en support@meetingguard.ai si crees que otra persona la está usando."
            ]
          ]
        },
        {
          "heading": "Alertas y recordatorios",
          "body": [
            "Trabajamos mucho para que las alertas sean fiables, pero su entrega depende de tu dispositivo: los permisos de notificación, la optimización de batería, los modos No molestar y Concentración, el modo silencio, que el dispositivo esté encendido y que la app pueda actualizar su programación. Las alertas pueden llegar tarde o no llegar. Para las reuniones importantes, mantén también otro recordatorio."
          ]
        },
        {
          "heading": "Asistente de IA",
          "body": [
            "Cuando usas el asistente de IA:",
            [
              "Las respuestas y propuestas se generan automáticamente y pueden ser incorrectas o incompletas. Revisa cada propuesta antes de confirmarla. Eres responsable de los cambios que confirmas y de los mensajes que envías a otras personas.",
              "Cada plan tiene un límite diario de solicitudes al asistente (el plan Free incluye 5 al día). Los límites se reinician cada día a medianoche UTC.",
              "No uses el asistente con fines ilegales ni de formas que incumplan las políticas de uso de OpenAI."
            ]
          ]
        },
        {
          "heading": "Planes y pagos",
          "body": [
            "Actualmente MeetingGuard AI es gratuita. Los planes de pago (Pro y Premium) se muestran solo a título informativo y todavía no se pueden comprar. Si en el futuro ofrecemos planes de pago, se venderán a través del App Store o Google Play, y el precio, el periodo de facturación y las condiciones de renovación y cancelación se mostrarán antes de la compra."
          ]
        },
        {
          "heading": "Tu contenido",
          "body": [
            "Sigues siendo propietario de las reuniones, notas y demás contenido que añades. Nos permites guardarlo, copiarlo y procesarlo solo en la medida necesaria para prestarte el servicio, por ejemplo para sincronizarlo, programar tus alertas o responder a tus solicitudes al asistente. Eres responsable de tener derecho a añadir los datos de contacto de otras personas a tus reuniones y a enviarles invitaciones."
          ]
        },
        {
          "heading": "Servicios de terceros",
          "body": [
            "La app funciona con servicios de otras empresas, como Google (inicio de sesión, Calendar y Firebase) y OpenAI. Cuando los usas, se aplican sus propios términos y políticas de privacidad, y no somos responsables de esos servicios."
          ]
        },
        {
          "heading": "Uso aceptable",
          "body": [
            "Te comprometes a no:",
            [
              "Usar la app para infringir la ley o los derechos de otras personas.",
              "Enviar spam o invitaciones no deseadas a través de la app.",
              "Intentar acceder a datos de otros usuarios, a nuestros servidores o al servicio de IA de formas que no permitimos, ni eludir los límites de uso.",
              "Interrumpir el servicio, sobrecargarlo con solicitudes automatizadas, ni copiar la app o aplicarle ingeniería inversa cuando la ley no lo permita."
            ]
          ]
        },
        {
          "heading": "Propiedad intelectual",
          "body": [
            "La app, su diseño y su marca pertenecen a AETERNUM TECH LTD o a sus licenciantes. Estos términos solo te dan derecho a usar la app tal como se describe aquí."
          ]
        },
        {
          "heading": "Dejar de usar la app",
          "body": [
            "Puedes dejar de usar la app y eliminar tu cuenta en cualquier momento en Ajustes → Cuenta → Eliminar cuenta. Podemos suspender o cerrar las cuentas que incumplan estos términos de forma grave o reiterada, o cuando lo exija la ley. Siempre que sea posible, te avisaremos antes y te explicaremos el motivo."
          ]
        },
        {
          "heading": "Exención de garantías",
          "body": [
            "La app se ofrece \"tal cual\" y \"según disponibilidad\". En la medida en que lo permita la ley, no garantizamos que funcione sin interrupciones ni errores, ni que las alertas, la sincronización del calendario y las respuestas de la IA sean siempre exactas o puntuales. Nada de lo dispuesto en estos términos limita los derechos que te otorgan las leyes de protección del consumidor a los que no se puede renunciar."
          ]
        },
        {
          "heading": "Limitación de responsabilidad",
          "body": [
            "En la medida en que lo permita la ley, AETERNUM TECH LTD no es responsable de pérdidas indirectas o consecuentes, como reuniones perdidas, oportunidades perdidas o datos perdidos, y nuestra responsabilidad total por cualquier reclamación relacionada con la app se limita al importe que nos hayas pagado por ella en los 12 meses anteriores a la reclamación. Esto no limita la responsabilidad que la ley no permite limitar."
          ]
        },
        {
          "heading": "Ley aplicable",
          "body": [
            "Estos términos se rigen por las leyes de Inglaterra y Gales, y cualquier disputa se resuelve en los tribunales de Inglaterra y Gales. Si eres consumidor, también conservas la protección de las leyes imperativas del país en el que vives y puedes acudir a sus tribunales."
          ]
        },
        {
          "heading": "Cambios en estos términos",
          "body": [
            "Podemos actualizar estos términos. Cambiaremos la fecha que aparece al principio y, en el caso de cambios importantes, te avisaremos en la app antes de que se apliquen. Si sigues usando la app después, se aplican los nuevos términos; si no estás de acuerdo con ellos, puedes eliminar tu cuenta."
          ]
        },
        {
          "heading": "Contacto",
          "body": [
            "AETERNUM TECH LTD (número de empresa 14085985), 128 City Road, Londres, Reino Unido, EC1V 2NX. Correo electrónico: support@meetingguard.ai."
          ]
        }
      ]
    }
  }
};
