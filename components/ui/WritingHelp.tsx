"use client";

import { RevealHint } from "@/components/ui/RevealHint";
import { scrollToAndFlash } from "@/lib/flash";
import { Gloss } from "@/lib/glossify";
import { tt } from "@/lib/lang";

export type HelpRef = { label: string; value: string; target: string };

/**
 * A hidden help under a judged, free-text answer: a frame for how to build it (what to name, in which order) and,
 * where the case or the learner's own earlier answers hold them, the numbers it can rest on, each a button that
 * scrolls to and flashes its source. It is a frame and a list of reference points, never the answer itself.
 */
export function WritingHelp({ id, steps, refs, refsTitle }: { id: string; steps: string[]; refs?: HelpRef[]; refsTitle?: string }) {
  return (
    <RevealHint id={id} label={tt("Show how to build the answer", "Zeigen, wie man die Antwort aufbaut")} title={tt("How to build the answer · a frame, not the answer", "So bauen Sie die Antwort auf · ein Rahmen, nicht die Antwort")}>
      <div className="space-y-2 text-caption text-ink">
        <ol className="list-decimal space-y-1 pl-5">
          {steps.map((s) => (
            <li key={s}>
              <Gloss>{s}</Gloss>
            </li>
          ))}
        </ol>
        {refs && refs.length > 0 && (
          <div>
            <p className="smallcaps text-ash">
              {refsTitle ?? tt("Numbers you can use", "Zahlen, die Sie nutzen können")} · {tt("click one to see it on the page", "klicken Sie eine an, um sie auf der Seite zu sehen")}
            </p>
            <ul className="mt-1 space-y-1">
              {refs.map((r) => (
                <li key={r.label}>
                  <button
                    type="button"
                    onClick={() => scrollToAndFlash(r.target, "ref")}
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
      </div>
    </RevealHint>
  );
}
