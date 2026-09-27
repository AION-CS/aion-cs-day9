"use client";

import type { CalcBuilder } from "@/lib/calcBuilder";
import { allPartsRight, builderResult, partKey, partValues } from "@/lib/calcBuilder";
import { num, tt } from "@/lib/lang";

/**
 * After a check flags an answer, say specifically what to look at instead of a bare "wrong": whether the formula
 * parts are all right but the entered figure differs, which parts hold a number from the wrong place, or that the
 * parts are not filled yet (and where to fill them). Rendered only for a flagged answer; the caller decides that.
 * The text never gives a value: a part clue names the table and the row, and a result is the learner's own.
 */
export function CalcDiagnosis({
  builder,
  figure,
  parts,
  partFlags,
  name,
  mismatch,
}: {
  builder: CalcBuilder;
  figure: string;
  parts: Record<string, string>;
  partFlags: string[];
  /** What the answer is called in the text: "this cell", "your sentence". */
  name: string;
  /** The sentence for "every part is right and gives {result}, but the answer differs". */
  mismatch: (result: string) => string;
}) {
  const values = partValues(builder, figure, parts);
  const filledCount = Object.values(values).filter((v) => v !== null).length;
  const wrong = builder.parts.filter((p) => partFlags.includes(partKey(figure, p.id)));
  let text: string;
  if (allPartsRight(builder, figure, parts)) {
    const r = builderResult(builder, figure, parts);
    text = mismatch(r === null ? "" : num(r, { maximumFractionDigits: 2 }));
  } else if (wrong.length > 0) {
    const names = wrong.map((p) => p.label).join(", ");
    text = tt(`The outlined ${wrong.length === 1 ? "part" : "parts"} in the formula calculator ${wrong.length === 1 ? "holds" : "hold"} a number from the wrong place: ${names}. Each names the row to read.`, `${wrong.length === 1 ? "Der markierte Teil" : "Die markierten Teile"} im Formelrechner ${wrong.length === 1 ? "enthält" : "enthalten"} eine Zahl von der falschen Stelle: ${names}. Jeder nennt die Zeile, die zu lesen ist.`);
  } else if (filledCount === 0) {
    text = tt(`To see exactly where it goes wrong, open “Show the formula” and fill its ${builder.parts.length} parts. The next check marks each part that holds the wrong number and names the row to read.`, `Um genau zu sehen, wo es falsch läuft, öffnen Sie „Formel zeigen“ und füllen Sie die ${builder.parts.length} Teile. Die nächste Prüfung markiert jeden Teil mit falscher Zahl und nennt die Zeile, die zu lesen ist.`);
  } else {
    const left = builder.parts.length - filledCount;
    text = tt(`The parts you filled are right; ${left} ${left === 1 ? "part is" : "parts are"} still empty in the formula calculator. Fill ${left === 1 ? "it" : "them"} to see which step changes ${name}.`, `Die ausgefüllten Teile stimmen; ${left} ${left === 1 ? "Teil ist" : "Teile sind"} im Formelrechner noch leer. Füllen Sie ${left === 1 ? "ihn" : "sie"}, um zu sehen, welcher Schritt ${name} verändert.`);
  }
  return (
    <p role="status" className="rounded-md border border-gold bg-accentSoft px-2.5 py-1.5 text-micro normal-case tracking-normal text-ink">
      <span className="smallcaps mr-1 text-accent">{tt("What to check", "Was zu prüfen ist")}</span>
      {text}
    </p>
  );
}
