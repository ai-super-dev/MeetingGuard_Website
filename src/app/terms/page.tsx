import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of the MeetingGuard app and website.",
  alternates: { canonical: "/terms" },
};

// Placeholder copy (English and Spanish in src/lib/i18n.ts) — replace with the reviewed legal text before launch.
export default function TermsPage() {
  return <LegalPage doc="terms" />;
}
