"use client";

import { useEffect } from "react";
import { GLOSS_BY_ID, glossText } from "@/data/glossary";
import { useGloss } from "@/store/useGloss";
import { tt } from "@/lib/lang";

/**
 * The explanation card for the term that was clicked. One card for the whole site,
 * fixed to the bottom of the screen so opening it never moves the text you were
 * reading. Escape or Close hides it; clicking another term swaps it.
 */
export function GlossaryPanel() {
  const id = useGloss((s) => s.id);
  const close = useGloss((s) => s.close);
  const raw = id ? (GLOSS_BY_ID[id] ?? null) : null;
  const entry = raw ? glossText(raw) : null;

  useEffect(() => {
    if (!id) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [id, close]);

  return (
    <div id="gloss-panel" role="region" aria-live="polite" aria-label={tt("Term explanation", "Begriffserklärung")} className="print:hidden">
      {entry && (
        <div className="fade-in fixed bottom-14 left-3 right-3 z-[45] rounded-xl border border-accent/40 bg-paper p-4 shadow-lg sm:left-auto sm:max-w-sm lg:bottom-4 lg:right-4">
          <div className="flex items-start justify-between gap-3">
            <p className="smallcaps text-accent">{tt("In plain words", "In einfachen Worten")}</p>
            <button type="button" onClick={close} className="btn-ghost btn-sm">
              {tt("Close", "Schließen")}
            </button>
          </div>
          <h2 className="mt-1 text-h3">{entry.title}</h2>
          <p className="mt-1.5 text-body text-ink">{entry.plain}</p>
          {entry.example && (
            <p className="mt-2 rounded-md bg-mist px-3 py-2 text-caption text-ink">
              <span className="font-semibold">{tt("Example.", "Beispiel.")}</span>{" "}
              {entry.example}
            </p>
          )}
          {entry.from && <p className="mt-2 text-micro normal-case tracking-normal text-ash">{tt("Idea from:", "Idee aus:")}{" "}
            {entry.from}</p>}
        </div>
      )}
    </div>
  );
}
