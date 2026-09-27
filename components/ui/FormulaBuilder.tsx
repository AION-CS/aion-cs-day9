"use client";

import clsx from "clsx";
import type { CalcBuilder } from "@/lib/calcBuilder";
import { builderResult, partKey } from "@/lib/calcBuilder";
import { scrollToAndFlash } from "@/lib/flash";
import { parseAmount } from "@/lib/parseAmount";
import { num, tt } from "@/lib/lang";

/**
 * The automatic calculator under a calculation question: one small input per part of the formula, the
 * formula re-written with the learner's values, the live result, and a button that copies the result
 * into the answer field. The manual Calculator stays beside it; the learner uses either. After a check,
 * every wrong part is outlined in amber (#15) and names the exact row and part of the row to read,
 * never the value.
 */
export function FormulaBuilder({
  figure,
  builder,
  parts,
  partFlags,
  onPart,
  onUse,
  unit,
  label,
  source,
}: {
  figure: string;
  builder: CalcBuilder;
  parts: Record<string, string>;
  partFlags: string[];
  onPart: (key: string, value: string) => void;
  /** Copies the result into the answer field. Omit it where the answer is a sentence, not a number field. */
  onUse?: (value: number) => void;
  unit?: string;
  /** What the answer field is called in the button, when it is not the figure id ("Option A · Project"). */
  label?: string;
  /** Where the numbers are read from, in the intro line. */
  source?: string;
}) {
  const result = builderResult(builder, figure, parts);
  const filled = Object.fromEntries(
    builder.parts.map((p) => {
      const raw = (parts[partKey(figure, p.id)] ?? "").trim();
      return [p.id, raw || "▢"];
    }),
  );
  const wrongHere = builder.parts.filter((p) => partFlags.includes(partKey(figure, p.id)));

  return (
    <div className="mt-2 space-y-2 border-t border-line pt-2">
      <p className="text-caption text-ink">
        <span className="font-semibold">{tt("Or let it calculate:", "Oder lassen Sie rechnen:")}</span>{" "}
        {tt(`fill each part below with the number from ${source ?? "the table"}. The result appears as you type.`, `füllen Sie jeden Teil unten mit der Zahl aus ${source ?? "der Tabelle"}. Das Ergebnis erscheint beim Tippen.`)}
      </p>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {builder.parts.map((p) => {
          const key = partKey(figure, p.id);
          const id = `part-${figure}-${p.id}`;
          const raw = parts[key] ?? "";
          const flagged = partFlags.includes(key);
          const unreadable = raw.trim() !== "" && parseAmount(raw) === null;
          return (
            <div key={p.id} id={id} className={clsx("space-y-1 rounded-md p-1.5", flagged && "is-flagged bg-accentSoft")}>
              <label htmlFor={`${id}-in`} className="block text-micro font-semibold text-ash">
                {p.label}
              </label>
              <input
                id={`${id}-in`}
                className="field tnum py-1.5 text-caption"
                inputMode="decimal"
                autoComplete="off"
                value={raw}
                onChange={(e) => onPart(key, e.target.value)}
                aria-invalid={flagged || undefined}
                aria-describedby={flagged ? `${id}-clue` : undefined}
              />
              {unreadable && <p className="text-micro normal-case tracking-normal text-ash">{tt("Cannot read this as a number yet.", "Das lässt sich noch nicht als Zahl lesen.")}</p>}
              {flagged && (
                <p id={`${id}-clue`} role="status" className="text-micro normal-case tracking-normal text-ink">
                  <span className="font-semibold text-accent">{tt("Check this part.", "Prüfen Sie diesen Teil.")}</span>{" "}
                  {tt("Read it from:", "Lesen Sie ihn ab aus:")}{" "}
                  {p.clue}
                </p>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-md bg-paper px-3 py-2">
        <p className="tnum min-w-0 flex-1 break-words text-caption text-ink">
          {builder.show(filled)} ={" "}
          <strong className="text-body">{result === null ? "…" : num(result, { maximumFractionDigits: 2 })}</strong>
          {result !== null && unit && <span className="text-ash"> {unit}</span>}
        </p>
        {onUse && (
          <button
            type="button"
            onClick={() => {
              if (result !== null) return onUse(result);
              const empty = builder.parts.find((p) => parseAmount(parts[partKey(figure, p.id)] ?? "") === null);
              if (empty) scrollToAndFlash(`part-${figure}-${empty.id}`);
            }}
            aria-disabled={result === null}
            title={result === null ? tt("Fill every part first.", "Füllen Sie zuerst alle Teile.") : undefined}
            className={clsx("btn-ghost btn-sm", result === null && "opacity-60")}
          >
            {tt("Use this result in", "Ergebnis übernehmen in")}{" "}
            {label ?? figure}
          </button>
        )}
      </div>
      {result === null && (
        <p className="text-micro normal-case tracking-normal text-ash">{tt("Fill every part to see the result (▢ marks an empty part).", "Füllen Sie alle Teile, um das Ergebnis zu sehen (▢ markiert einen leeren Teil).")}</p>
      )}
      {wrongHere.length > 0 && (
        <p role="status" className="text-caption text-ink">
          {tt(`${wrongHere.length === 1 ? "1 part is" : `${wrongHere.length} parts are`} outlined above: `, `${wrongHere.length === 1 ? "1 Teil ist" : `${wrongHere.length} Teile sind`} oben markiert: `)}
          {wrongHere.map((p) => p.label).join(", ")}.
        </p>
      )}
    </div>
  );
}
