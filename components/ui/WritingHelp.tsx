"use client";

import { RevealHint } from "@/components/ui/RevealHint";
import { scrollToAndFlash } from "@/lib/flash";
import { Gloss } from "@/lib/glossify";
import { tt } from "@/lib/lang";

/** One entry of a clue kit: what it is, its value as printed (or the learner's own answer), and the element to flash. */
export type HelpRef = { label: string; value: string; target: string; before?: () => void };

/**
 * The clue kit of a field (CLAUDE.md #42), hidden until asked for: first "What to look at", every number, rule, earlier answer and
 * fact the model answer uses, each with its value and a button that scrolls to its source and flashes it (a collapsed source is opened
 * first by `before`); then "How to build it", the steps. It names the inputs and the order, never the answer (#4, #24).
 */
export function WritingHelp({ id, steps, refs, refsTitle, label }: { id: string; steps: string[]; refs?: HelpRef[]; refsTitle?: string; label?: string }) {
  return (
    <RevealHint id={id} label={label ?? tt("Show what to look at", "Zeigen, worauf Sie schauen")} title={tt("What to look at · and how to build the answer", "Worauf Sie schauen · und wie Sie die Antwort aufbauen")}>
      <div className="space-y-2 text-caption text-ink">
        {refs && refs.length > 0 && (
          <div>
            <p className="smallcaps text-ash">
              {refsTitle ?? tt("What to look at", "Worauf Sie schauen")} · {tt("click one to see it on the page", "klicken Sie eines an, um es auf der Seite zu sehen")}
            </p>
            <ul className="mt-1 space-y-1">
              {refs.map((r) => (
                <li key={`${r.label}-${r.target}`}>
                  <button
                    type="button"
                    onClick={() => {
                      r.before?.();
                      window.setTimeout(() => scrollToAndFlash(r.target, "ref"), r.before ? 60 : 0);
                    }}
                    className="flex min-h-[36px] w-full flex-wrap items-baseline gap-x-2 rounded px-2 py-1 text-left hover:bg-accentSoft"
                  >
                    <span className="text-ink">{r.label}:</span>
                    <span className="tnum font-semibold text-ink">{r.value}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div>
          <p className="smallcaps text-ash">{tt("How to build it", "So bauen Sie es auf")}</p>
          <ol className="mt-1 list-decimal space-y-1 pl-5">
            {steps.map((s) => (
              <li key={s}>
                <Gloss>{s}</Gloss>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </RevealHint>
  );
}
