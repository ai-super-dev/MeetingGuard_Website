import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How MeetingGuard collects, uses and protects your calendar and meeting data.",
  alternates: { canonical: "/privacy" },
};

// Placeholder copy — replace with the reviewed legal text before launch.
export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="October 24, 2026"
      sections={[
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
      ]}
    />
  );
}
