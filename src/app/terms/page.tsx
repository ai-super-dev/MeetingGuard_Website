import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of the MeetingGuard app and website.",
  alternates: { canonical: "/terms" },
};

// Placeholder copy — replace with the reviewed legal text before launch.
export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="October 24, 2026"
      sections={[
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
      ]}
    />
  );
}
