"use client";

import { useState } from "react";
import { useAgenda } from "@/lib/agenda/store";
import { minuteOfDay } from "@/lib/agenda/time";
import type { Selection } from "./Calendar";
import { CancelDialog, EditScopeDialog, MeetingDetails, MeetingEditor, MoveDialog, OccurrenceEditor, type EditorMode } from "./MeetingDialogs";

/** The start a new meeting suggests: the next half hour today, 9:00 on other days. */
export function suggestedTime(day: string, today: string, now: number, zone: string) {
  const next = Math.ceil((minuteOfDay(new Date(now), zone) + 1) / 30) * 30;
  return day === today && next < 24 * 60 ? `${String(Math.floor(next / 60)).padStart(2, "0")}:${String(next % 60).padStart(2, "0")}` : "09:00";
}

/**
 * Everything a meeting can open: details, the form, and for a series the
 * question of which dates an edit is for. Put `dialogs` in the page.
 */
export function useMeetingFlows(initial: Selection | null = null) {
  const s = useAgenda();
  const [open, setOpen] = useState<Selection | null>(initial);
  const [editor, setEditor] = useState<EditorMode | null>(null);
  const [askScope, setAskScope] = useState<Selection | null>(null);
  const [occurrenceEdit, setOccurrenceEdit] = useState<{ sel: Selection; scope: "one" | "following" } | null>(null);
  const [moving, setMoving] = useState<Selection | null>(null);
  const [cancelling, setCancelling] = useState<Selection | null>(null);

  const edit = (sel: Selection) => {
    // one date of a series: ask which meetings the edit is for, as in the app
    const isSeries = !!sel.key && !!s.meetings.find((m) => m.id === sel.id)?.recurrence;
    if (isSeries) setAskScope(sel);
    else setEditor({ kind: "edit", id: sel.id });
  };

  const dialogs = (
    <>
      {open && (
        <MeetingDetails
          sel={open}
          onClose={() => setOpen(null)}
          onEdit={() => {
            edit(open);
            setOpen(null);
          }}
          onMove={() => {
            setMoving(open);
            setOpen(null);
          }}
          onCancel={() => {
            setCancelling(open);
            setOpen(null);
          }}
        />
      )}
      {askScope && (
        <EditScopeDialog
          sel={askScope}
          onClose={() => setAskScope(null)}
          onChoose={(scope) => {
            if (scope === "all") setEditor({ kind: "edit", id: askScope.id });
            else setOccurrenceEdit({ sel: askScope, scope });
            setAskScope(null);
          }}
        />
      )}
      {occurrenceEdit && <OccurrenceEditor sel={occurrenceEdit.sel} scope={occurrenceEdit.scope} onClose={() => setOccurrenceEdit(null)} />}
      {editor && <MeetingEditor mode={editor} onClose={() => setEditor(null)} />}
      {moving && <MoveDialog sel={moving} onClose={() => setMoving(null)} />}
      {cancelling && <CancelDialog sel={cancelling} onClose={() => setCancelling(null)} />}
    </>
  );

  return { details: setOpen, edit, remove: setCancelling, newMeeting: (day: string, time: string) => setEditor({ kind: "new", day, time }), dialogs };
}

export type MeetingFlows = ReturnType<typeof useMeetingFlows>;
