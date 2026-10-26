import type { ReactNode } from "react";
import { permissionScreens, type ScreenKey } from "@/content/features";
import { AgendaScreen, ConfirmScreen, PermissionScreen, SummaryScreen, TasksScreen, VoiceScreen } from "@/components/phone/flows";
import { MeetingAlarmScreen } from "@/components/phone/MeetingAlarmScreen";
import { PhoneShot, SHOT_H } from "@/components/phone/PhoneShot";
import { JoinScreen, PlanScreen } from "@/components/phone/screens";
import type { Lang } from "@/lib/routes";

/** The rebuilt app screen for a name used in the page content. */
export function screenFor(key: ScreenKey, lang: Lang): ReactNode {
  const perm = permissionScreens[lang];
  switch (key) {
    case "voice":
      return <VoiceScreen />;
    case "confirm":
      return <ConfirmScreen />;
    case "confirmed":
      return <ConfirmScreen confirmed />;
    case "plan":
      return <PlanScreen height={SHOT_H} />;
    case "join":
      return <JoinScreen height={SHOT_H} />;
    case "alarm":
      return <MeetingAlarmScreen theme="dark" height={SHOT_H} />;
    case "permFullscreen":
      return <PermissionScreen {...perm.permFullscreen} />;
    case "permAlarms":
      return <PermissionScreen {...perm.permAlarms} />;
    case "tasks":
      return <TasksScreen />;
    case "tasksDone":
      return <TasksScreen doneFirst />;
    case "agenda":
      return <AgendaScreen />;
    case "summary":
      return <SummaryScreen />;
  }
}

/** A phone (iPhone or Android frame) showing one named screen. */
export function Shot({
  screen,
  kind,
  lang,
  bodyHeight = 420,
  mirror = false,
}: {
  screen: ScreenKey;
  kind: "iphone" | "android";
  lang: Lang;
  bodyHeight?: number;
  mirror?: boolean;
}) {
  return (
    <PhoneShot kind={kind} bodyHeight={bodyHeight} mirror={mirror}>
      {screenFor(screen, lang)}
    </PhoneShot>
  );
}
