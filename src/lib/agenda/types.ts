/*
 * The web agenda's records: the same documents the app reads and writes
 * (src/core/types.ts in the app), so web and phone share one set of records.
 * Instants are UTC ISO strings; optional values are null, never missing.
 */

export type MeetingSource = "manual" | "ai_chat" | "whatsapp" | "google" | "device" | "outlook";

/** Which calendar a meeting shows under (one colour and one filter each). */
export type Calendar = "meetingguard" | "google" | "outlook" | "device";

export type AlertIntensity = "max" | "medium" | "light";

export type ConferenceProvider = "zoom" | "teams" | "google_meet" | "other";
export type Conference = { provider: ConferenceProvider; url: string | null; password: string | null };

export type LocationType = "physical" | "virtual" | "hybrid";
export type MeetingLocation = { type: LocationType; address: string | null; virtualUrl: string | null };

export type Participant = { email: string; name: string | null; status: "needs_action" | "accepted" | "declined" | "tentative" | null };

export type RecurrenceFreq = "daily" | "weekly" | "monthly";
export type RecurrenceWeekday = "MO" | "TU" | "WE" | "TH" | "FR" | "SA" | "SU";

export type RecurrenceRule = {
  freq: RecurrenceFreq;
  interval: number;
  byWeekday: RecurrenceWeekday[] | null;
  byMonthDay: number | null;
  /** Inclusive instant, compared with each meeting's original start. */
  until: string | null;
  count: number | null;
};

/** A change to one date of a series, keyed by that date in the meeting's zone. */
export type RecurrenceOverride = { status: "cancelled" | "modified"; startAt: string | null; durationMinutes: number | null; title: string | null };
export type RecurrenceOverrides = Record<string, RecurrenceOverride>;

/** Links to the same meeting in other calendars. The web keeps them as they are. */
export type ExternalRefs = Record<string, string | null>;

export type Meeting = {
  id: string;
  userId: string;
  title: string;
  description: string;
  startAt: string;
  durationMinutes: number;
  timezone: string;
  allDay: boolean;
  /** Local date and time of startAt in `timezone`; always derived from it. */
  date: string;
  time: string;
  location: MeetingLocation | null;
  conference: Conference | null;
  participants: Participant[];
  source: MeetingSource;
  confidence: number | null;
  language: "en" | "es";
  preparationTips: string[];
  /** Minutes before the start; null follows the user's default reminders. */
  customAlertTimes: number[] | null;
  /** null follows the user's default intensity. */
  alertIntensity: AlertIntensity | null;
  notes: string | null;
  status: "scheduled" | "cancelled";
  external: ExternalRefs;
  recurrence: RecurrenceRule | null;
  recurrenceOverrides: RecurrenceOverrides | null;
  seriesId: string | null;
  createdAt: string;
  updatedAt: string;
  /** Deleted meetings stay as an empty record so every device can sync the deletion. */
  deletedAt: string | null;
};

/** What the forms may set on a meeting. */
export type MeetingInput = Pick<Meeting, "title" | "startAt"> &
  Partial<Pick<Meeting, "description" | "durationMinutes" | "timezone" | "allDay" | "location" | "conference" | "confidence" | "preparationTips" | "customAlertTimes" | "alertIntensity" | "notes" | "status" | "recurrence" | "recurrenceOverrides" | "language" | "source">> & {
    participants?: Participant[];
  };

export type MeetingPatch = Partial<Omit<MeetingInput, "source">>;

/** One meeting on the calendar: a single meeting, or one date of a series. */
export type Occurrence = {
  meeting: Meeting;
  /** The date this one was due on, in the meeting's zone ("" for single meetings). */
  key: string;
  start: Date;
  end: Date;
  title: string;
  /** This date of the series was changed on its own. */
  overridden: boolean;
};

export type TaskPerson = { name: string; email: string | null };

export type Task = {
  id: string;
  userId: string;
  title: string;
  description: string;
  /** Local day and optional time in `timezone`. */
  dueDate: string | null;
  dueTime: string | null;
  timezone: string;
  reminderMinutesBefore: number | null;
  status: "open" | "done";
  meetingId: string | null;
  people: TaskPerson[];
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TaskInput = Pick<Task, "title"> & Partial<Pick<Task, "description" | "dueDate" | "dueTime" | "timezone" | "reminderMinutesBefore" | "meetingId" | "people">>;
export type TaskPatch = Partial<TaskInput> & { status?: Task["status"] };

export type Plan = "free" | "pro" | "premium";

/** The server-owned plan record (entitlements/{uid}); the web only reads it. */
export type Entitlement = {
  plan: Plan;
  status: "active" | "grace_period" | "expired" | "revoked";
  expiresAt: string | null;
  source: string;
  updatedAt: string | null;
};

export type User = {
  uid: string;
  name: string;
  email: string;
  /** Firebase provider ids: "google.com", "apple.com", "password". */
  providers: string[];
  /** A verified email, or a Google or Apple account: the server's Zoom links need it. */
  verified?: boolean;
};

export type AlertSoundType = "voice_and_sound" | "voice_only" | "sound_only";

/** The parts of the app's preferences the web reads. Account changes the alert ones and the time format. */
export type Preferences = {
  language: "en" | "es";
  alertEnabled: boolean;
  alertIntensity: AlertIntensity;
  alertSoundType: AlertSoundType;
  alertVolume: number;
  vibrationEnabled: boolean;
  defaultAlertTimes: number[];
  snoozeMinutes: number;
  followUpEnabled: boolean;
  briefingEnabled: boolean;
  /** "HH:mm". */
  briefingTime: string;
  /** null follows the language. */
  use24HourClock: boolean | null;
  googleCalendarSyncEnabled: boolean;
  deviceCalendarImportIds: string[];
  deviceCalendarExportId: string | null;
  updatedAt: string | null;
};

/** The settings the web changes. */
export type PreferencesPatch = Partial<Pick<Preferences, "alertEnabled" | "alertIntensity" | "alertSoundType" | "alertVolume" | "vibrationEnabled" | "defaultAlertTimes" | "snoozeMinutes" | "followUpEnabled" | "briefingEnabled" | "briefingTime" | "use24HourClock">>;

/** A guest's answer to an invitation link. */
export type InviteAnswer = { kind: "accept" } | { kind: "decline" } | { kind: "propose"; start: string; end: string; note: string };
