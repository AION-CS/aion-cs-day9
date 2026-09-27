"use client";

import { useEffect, useState } from "react";
import { DOC_CSS, downloadHtml, printDocument, wrapDocument } from "@/lib/exportDoc";
import { flash } from "@/lib/flash";
import { jumpTo } from "@/components/ui/MissingList";

import type { MissingEntry } from "@/lib/missing";
import { tt } from "@/lib/lang";

/**
 * Preview + Export. The Export button is never disabled: while something is
 * missing it opens a "Before you export" panel that lists each gap as a
 * clickable item (scroll + flash the exact element), and flashes the first one.
 * With nothing missing it downloads.
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
  const [panel, setPanel] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [tick, setTick] = useState(0);

  // After the panel opens, flash its first entry so the eye lands on the list.
  useEffect(() => {
    if (!panel || tick === 0) return;
    const el = document.getElementById(`${id}-missing-0`);
    if (el) flash(el, "warn");
  }, [panel, tick, id]);

  const run = (kind: "download" | "print") => {
    if (missing.length > 0) {
      setPanel(true);
      setTick((t) => t + 1);
      window.setTimeout(() => document.getElementById(`${id}-panel`)?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 30);
      return;
    }
    setPanel(false);
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

      {panel && (
        <div id={`${id}-panel`} role="region" aria-label={tt("Before you export", "Vor dem Export")} className="card border-rust/40 bg-rustSoft p-4">
          <div className="flex items-start justify-between gap-3">
            <h4 className="font-semibold text-ink">{tt("Before you export", "Vor dem Export")}</h4>
            <button type="button" onClick={() => setPanel(false)} className="btn-ghost btn-sm">
              {tt("Close", "Schließen")}
            </button>
          </div>
          {missing.length === 0 ? (
            <p className="mt-2 text-caption text-ink">{tt(`Nothing is missing now. Press “${exportLabel}” again.`, `Jetzt fehlt nichts mehr. Drücken Sie noch einmal „${exportLabel}“.`)}</p>
          ) : (
            <>
              <p className="mt-1 text-caption text-ash">
                {tt(`${missing.length} ${missing.length === 1 ? "item" : "items"} still open. Select one to jump to it.`, `${missing.length} ${missing.length === 1 ? "Punkt" : "Punkte"} noch offen. Wählen Sie einen, um dorthin zu springen.`)}
              </p>
              <ul className="mt-2 space-y-1.5">
                {missing.map((m, i) => (
                  <li key={`${m.id}-${i}`} id={`${id}-missing-${i}`} className="rounded-md px-2 py-1">
                    <button
                      type="button"
                      onClick={() => jumpTo(m)}
                      className="text-left text-caption text-ink underline decoration-dotted underline-offset-2 hover:text-accentHi"
                    >
                      {m.label}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
