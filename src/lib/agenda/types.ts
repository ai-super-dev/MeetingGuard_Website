/*
 * The web agenda's records. They mirror the documents the app reads and
 * writes (meetings, tasks, the plan), so when the backend is connected the
 * web and the phone share one set of records and stay in sync both ways.
 */

/** Where a meeting lives: MeetingGuard itself or a synced calendar. */
export type Source = "meetingguard" | "google" | "outlook";

/** How a record was created (shown as a chip, as in the app). */
export type Origin = "app" | "assistant" | "whatsapp" | "web" | "sync";

/** Alarm intensity, as in the app's alert settings. */
export type Intensity = "gentle" | "standard" | "maximum";

export type Repeat = "none" | "daily" | "weekdays" | "weekly" | "monthly";

export type Participant = { name: string; email: string };

export type Meeting = {
  id: string;
  title: string;
  /** ISO instants (UTC). */
  start: string;
  end: string;
  allDay: boolean;
  /** The time zone the meeting was planned in (IANA name). */
  timeZone: string;
  location: string;
  videoUrl: string;
  passcode: string;
  participants: Participant[];
  notes: string;
  /** Minutes before the start; 0 is "at start". */
  reminders: number[];
  intensity: Intensity;
  source: Source;
  origin: Origin;
  repeat: Repeat;
  /** Last day of the series (YYYY-MM-DD in the meeting's time zone). */
  repeatUntil: string;
  /**
   * Changes to single meetings of a series, keyed by the day the meeting was
   * due (YYYY-MM-DD in the meeting's time zone): skipped, or moved.
   */
  exceptions: Record<string, { skip?: true; start?: string; end?: string }>;
  updatedAt: number;
};

/** One meeting on the calendar: a single meeting, or one date of a series. */
export type Occurrence = {
  meeting: Meeting;
  /** Exception key for series ("" for single meetings). */
  key: string;
  start: Date;
  end: Date;
  moved: boolean;
};

export type TaskList = "meetingguard" | "microsoftToDo" | "googleTasks";

export type Task = {
  id: string;
  title: string;
  notes: string;
  /** Due day (YYYY-MM-DD) and optional time (HH:mm), in the user's time zone. */
  dueDate: string;
  dueTime: string;
  /** Minutes before the due time; null for no reminder. */
  reminder: number | null;
  meetingId: string;
  list: TaskList;
  done: boolean;
  doneAt: number;
  origin: Origin;
  updatedAt: number;
};

export type Plan = "free" | "pro" | "premium";

/** The entitlement record the app also reads (plan, trial, store). */
export type Entitlement = {
  plan: Plan;
  /** End of the free trial (ms), 0 when not on a trial. */
  trialEndsAt: number;
  store: "google_play" | "app_store" | null;
  renewsAt: number;
};

export type User = {
  uid: string;
  name: string;
  email: string;
  provider: "google" | "password";
};

/** Synced calendars and task lists, connected in the app. */
export type Connections = { google: boolean; outlook: boolean; microsoftToDo: boolean; googleTasks: boolean };

export type Prefs = {
  /** The zone times are shown in; "" follows this device. */
  timeZone: string;
  defaultReminders: number[];
  defaultIntensity: Intensity;
};

export type AgendaData = {
  user: User | null;
  entitlement: Entitlement;
  meetings: Meeting[];
  tasks: Task[];
  connections: Connections;
  prefs: Prefs;
};

/** A guest's answer to an invitation link. */
export type InviteAnswer = { kind: "accept" } | { kind: "decline" } | { kind: "propose"; start: string; end: string; note: string };
