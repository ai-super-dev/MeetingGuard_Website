import { Bell, CalendarDays, Zap } from "lucide-react";
import { RobotIcon } from "@/components/icons/RobotIcon";
import { Reveal } from "@/components/motion";
import { AIChatScreen, AlertScreen, CalendarsScreen, StandupScreen } from "@/components/phone/screens";
import { SectionHeading } from "@/components/ui/primitives";
import { FeatureSection } from "./FeatureSection";

export function CalendarSyncSection() {
  return (
    <FeatureSection
      id="features"
      intro={
        <Reveal>
          <SectionHeading
            id="features-title"
            eyebrow="Powerful features"
            title={
              <>
                Everything you need for <span className="text-gradient-cyan">smarter</span>{" "}
                <span className="text-gradient-pink">meetings.</span>
              </>
            }
            subtitle="Stay organized, informed, and in control with AI-powered tools built for your day."
          />
        </Reveal>
      }
      icon={<CalendarDays className="h-9 w-9" strokeWidth={2} />}
      title="Calendar Sync"
      titleId="calendar-sync-title"
      description="Connect Google Calendar, Outlook, and your phone's calendar in one place. Keep all your meetings unified and always up to date."
      bullets={[
        "Sync Google, Outlook and Apple calendars",
        "See all meetings in one unified view",
        "Automatic updates in real time",
        "Secure and private calendar access",
      ]}
      tone="cyan"
      screen={<CalendarsScreen />}
      scene={{ seed: 23, moon: { left: "36%", top: "52%", size: 200, tone: "blue" } }}
    />
  );
}

export function CriticalAlertsSection() {
  return (
    <FeatureSection
      icon={<Bell className="h-9 w-9 fill-white/90" strokeWidth={2} />}
      title="Critical Alerts"
      titleId="critical-alerts-title"
      description="Get important meeting alerts so you're always prepared. Full-screen alerts ensure you never miss an important meeting."
      bullets={[
        "Full-screen alerts for important meetings",
        "Smart timing based on your schedule",
        "Customizable alert styles and sounds",
        "Works across all your devices",
      ]}
      tone="red"
      screen={<AlertScreen />}
      phoneRight
      scene={{ seed: 37, tone: "red", moon: { left: "90%", top: "40%", size: 240, tone: "red" } }}
    />
  );
}

export function AISchedulingSection() {
  return (
    <FeatureSection
      icon={<RobotIcon className="h-12 w-12" />}
      title="AI Scheduling"
      titleId="ai-scheduling-title"
      description="Just tell your AI assistant what you need. It understands natural language, finds the best time, proposes the details, and handles the rest for you."
      bullets={[
        "Natural language scheduling",
        "Finds the best time for everyone",
        "Automatically prepares meeting details",
        "Works with your connected calendars",
      ]}
      tone="violet"
      screen={<AIChatScreen />}
      scene={{ seed: 41, tone: "violet" }}
    />
  );
}

export function SmartRemindersSection() {
  return (
    <FeatureSection
      icon={<Zap className="h-9 w-9 fill-white/20" strokeWidth={2} />}
      title={
        <>
          Smart Reminders &amp;
          <br />
          Instant Join
        </>
      }
      titleId="smart-reminders-title"
      description="Get timely reminders and join your meetings with one tap. No more searching for links or opening multiple apps."
      bullets={[
        "Timely reminders before each meeting",
        "One-tap join for Zoom, Google Meet, Teams",
        "Shows all meeting details in one place",
        "Save time and stay focused",
      ]}
      tone="blue"
      screen={<StandupScreen />}
      phoneRight
      scene={{ seed: 53, moon: { left: "95%", top: "48%", size: 210, tone: "blue" } }}
    />
  );
}
