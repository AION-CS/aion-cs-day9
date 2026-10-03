"use client";

import { useState } from "react";
import { DOC_CSS, memoBody } from "@/lib/exportDoc";
import { usePersisted } from "@/store/usePersisted";
import { useHydrated } from "@/store/useStore";
import { tt } from "@/lib/lang";

/**
 * The live memo (CLAUDE.md #12, report-builder). It is built by the same `memoBody` the export uses, in memo reading order whatever
 * order the questions are answered in, so what the participant reads here is exactly what they download. It sits at the bottom of
 * the task, full width, below the last question and above Export, so the questions keep the whole screen while the participant
 * works; a Hide / Show button folds it away (session-only).
 */
export function MemoPanel() {
  const p = usePersisted();
  const [open, setOpen] = useState(true);
  // The memo carries today's date and the stored answers, so it is drawn only after the client has hydrated:
  // the static HTML never disagrees with the first client paint, whatever day the page is opened.
  const hydrated = useHydrated();
  const html = hydrated && open ? memoBody(p) : "";
  return (
    <section id="live-memo" aria-label={tt("Live memo", "Live-Memo")} className="card p-4 print:hidden">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="smallcaps text-accent">{tt("Live memo · assembles as you answer", "Live-Memo · setzt sich beim Antworten zusammen")}</p>
        <button type="button" aria-expanded={open} aria-controls="live-memo-body" onClick={() => setOpen((o) => !o)} className="btn-ghost btn-sm">
          {open ? tt("Hide the memo", "Memo ausblenden") : tt("Show the memo", "Memo anzeigen")}
        </button>
      </div>
      {open && (
        <div id="live-memo-body" className="mt-3">
          <style dangerouslySetInnerHTML={{ __html: DOC_CSS }} />
          <div className="doc mx-auto max-w-3xl" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      )}
    </section>
  );
}
