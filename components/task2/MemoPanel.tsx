"use client";

import { useState } from "react";
import { DOC_CSS, memoBody } from "@/lib/exportDoc";
import { usePersisted } from "@/store/usePersisted";
import { useHydrated } from "@/store/useStore";
import { tt } from "@/lib/lang";

/**
 * The live memo. It is built by the same `memoBody` the export uses, in memo reading order whatever order the questions on the
 * left are answered in, so what the participant reads here is exactly what they download. A sticky column on desktop; on a phone
 * a sticky strip that expands.
 */
export function MemoPanel() {
  const p = usePersisted();
  const [open, setOpen] = useState(false);
  // The memo carries today's date and the stored answers, so it is drawn only after the client has hydrated:
  // the static HTML never disagrees with the first client paint, whatever day the page is opened.
  const hydrated = useHydrated();
  const html = hydrated ? memoBody(p) : "";
  return (
    <>
      <aside aria-label={tt("Live memo", "Live-Memo")} className="hidden self-start lg:sticky lg:top-28 lg:block lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto print:hidden">
        <div className="card p-4">
          <p className="smallcaps mb-2 text-accent">{tt("Live memo · assembles as you answer", "Live-Memo · setzt sich beim Antworten zusammen")}</p>
          <style dangerouslySetInnerHTML={{ __html: DOC_CSS }} />
          <div className="doc" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </aside>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper shadow-lg lg:hidden print:hidden">
        <button type="button" aria-expanded={open} aria-controls="memo-strip-body" onClick={() => setOpen((o) => !o)} className="flex min-h-[44px] w-full items-center justify-between gap-3 px-4 py-2 text-left">
          <span className="smallcaps text-accent">{tt("Live memo", "Live-Memo")}</span>
          <span className="text-caption text-ash">{open ? tt("Tap to collapse", "Tippen zum Einklappen") : tt("Tap to expand", "Tippen zum Aufklappen")}</span>
        </button>
        {open && (
          <div id="memo-strip-body" className="max-h-[65vh] overflow-y-auto border-t border-line p-3">
            <style dangerouslySetInnerHTML={{ __html: DOC_CSS }} />
            <div className="doc" dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        )}
      </div>
    </>
  );
}
