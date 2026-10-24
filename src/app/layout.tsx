import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MotionProvider } from "@/components/motion";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "MeetingGuard — Never miss what matters",
    template: "%s | MeetingGuard",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "meeting reminders",
    "AI scheduling",
    "calendar sync",
    "Google Calendar",
    "Outlook",
    "Zoom",
    "Google Meet",
    "Microsoft Teams",
    "critical alerts",
    "meeting app",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: "MeetingGuard — Never miss what matters",
    description: siteConfig.description,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "MeetingGuard — Never miss what matters",
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#07070a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${mono.variable}`}>
      <body className="min-h-screen overflow-x-clip">
        <a
          href="#main"
          className="sr-only z-[60] rounded-md bg-accent px-4 py-2 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <MotionProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
