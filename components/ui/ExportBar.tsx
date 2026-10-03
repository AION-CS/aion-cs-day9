"use client";

import { useEffect, useState } from "react";
import { DOC_CSS, downloadHtml, printDocument, wrapDocument } from "@/lib/exportDoc";
import { flash } from "@/lib/flash";
import { jumpTo } from "@/components/ui/MissingList";

import type { MissingEntry } from "@/lib/missing";
import { tt } from "@/lib/lang";

/**
 * Preview + Export. The Export button is never disabled. A rust "still missing" notice sits here live,
 * whenever anything in the route is open — not gated by a click — naming every gap as a clickable item
 * (scroll + flash the exact element, CLAUDE.md #2); it disappears the instant nothing is missing. Clicking
 * Export or Print while something is open scrolls that notice into view and flashes its first entry; with
 * nothing missing it downloads straight away.
 */
export function ExportBar({
  id,
  previewTitle,
  exportLabel,
  docTitle,
  filename,
  missing,
  buildBody,
  showPreview = true,
}: {
  id: string;
  previewTitle: string;
  exportLabel: string;
  docTitle: string;
  filename: string;
  missing: MissingEntry[];
  buildBody: () => string;
  /** Off when the page already shows the same document live (the memo builder). */
  showPreview?: boolean;
}) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [tick, setTick] = useState(0);
  const open = missing.length > 0;

  // Every time Export/Print is pressed while something is open, flash the first entry so the eye lands on it.
  useEffect(() => {
    if (!open || tick === 0) return;
    const el = document.getElementById(`${id}-missing-0`);
    if (el) flash(el, "warn");
  }, [open, tick, id]);

  const run = (kind: "download" | "print") => {
    if (missing.length > 0) {
      setTick((t) => t + 1);
      window.setTimeout(() => document.getElementById(`${id}-panel`)?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 30);
      return;
    }
    const html = wrapDocument(docTitle, buildBody());
    if (kind === "download") downloadHtml(filename, html);
    else printDocument(filename, html);
  };

  return (
    <div id={id} className="space-y-3">
      {showPreview && <details
        className="card p-4"
        onToggle={(e) => setPreviewOpen((e.currentTarget as HTMLDetailsElement).open)}
      >
        <summary className="cursor-pointer font-semibold text-ink">{previewTitle}</summary>
        {previewOpen && (
          <div className="mt-3 overflow-x-auto rounded-lg border border-line bg-paper p-4 md:p-6">
            <style dangerouslySetInnerHTML={{ __html: DOC_CSS }} />
            <div className="doc" dangerouslySetInnerHTML={{ __html: buildBody() }} />
          </div>
        )}
      </details>}

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => run("download")} className="btn-primary">
          {exportLabel}
        </button>
        <button type="button" onClick={() => run("print")} className="btn-ghost">
          {tt("Print / save as PDF", "Drucken / als PDF speichern")}
        </button>
        <span className="text-caption text-ash">
          {tt("File name:", "Dateiname:")}{" "}
          <span className="tnum font-semibold text-ink">{filename}.html</span>
        </span>
      </div>

      {open && (
        <div id={`${id}-panel`} role="status" aria-label={tt("Still missing before export", "Noch offen vor dem Export")} className="fade-in card border-rust/40 bg-rustSoft p-4">
          <h4 className="smallcaps text-rust">{tt("Still missing before export", "Noch offen vor dem Export")}</h4>
          <p className="mt-1 text-caption text-ash">
            {tt(`${missing.length} ${missing.length === 1 ? "item" : "items"} still open. Select one to jump to it. This disappears once nothing is missing.`, `${missing.length} ${missing.length === 1 ? "Punkt" : "Punkte"} noch offen. Wählen Sie einen, um dorthin zu springen. Dies verschwindet, sobald nichts mehr fehlt.`)}
          </p>
          <ul className="mt-2 space-y-1.5">
            {missing.map((m, i) => (
              <li key={`${m.id}-${i}`} id={`${id}-missing-${i}`} className="rounded-md px-2 py-1">
                <button
                  type="button"
                  onClick={() => jumpTo(m)}
                  className="text-left text-caption text-ink underline decoration-dotted underline-offset-2 hover:text-rust"
                >
                  {m.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
