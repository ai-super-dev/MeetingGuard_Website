import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How MeetingGuard collects, uses and protects your calendar and meeting data.",
  alternates: { canonical: "/privacy" },
};

// Placeholder copy (English and Spanish in src/lib/i18n.ts) — replace with the reviewed legal text before launch.
export default function PrivacyPage() {
  return <LegalPage doc="privacy" />;
}
