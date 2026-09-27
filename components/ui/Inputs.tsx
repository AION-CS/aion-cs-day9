"use client";

import clsx from "clsx";
import type { ReactNode } from "react";
import { Field } from "@/components/ui/Field";
import { tt } from "@/lib/lang";

/**
 * A free-text answer: the Field (label, instruction under the label, amber outline when flagged) around a textarea,
 * with a live character count against the minimum the missing list asks for.
 */
export function TextBox({
  id,
  label,
  help,
  value,
  onChange,
  min,
  rows = 3,
  placeholder,
  flagged,
  clue,
  clueShown,
  onShowClue,
  children,
}: {
  id: string;
  label: ReactNode;
  help: ReactNode;
  value: string;
  onChange: (v: string) => void;
  min?: number;
  rows?: number;
  placeholder?: string;
  flagged?: boolean;
  clue?: string;
  clueShown?: boolean;
  onShowClue?: () => void;
  children?: ReactNode;
}) {
  const len = value.trim().length;
  return (
    <Field
      id={id}
      htmlFor={`${id}-in`}
      label={label}
      help={help}
      flagged={flagged}
      clue={clue}
      clueShown={clueShown}
      onShowClue={onShowClue}
      meta={min ? <span className={clsx("tnum text-micro normal-case tracking-normal", len >= min ? "text-signal" : "text-ash")}>{`${len} / ${min} ${tt("characters", "Zeichen")}`}</span> : null}
    >
      <textarea
        id={`${id}-in`}
        rows={rows}
        className="field"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={flagged || undefined}
        aria-describedby={`${id}-in-help`}
      />
      {children}
    </Field>
  );
}

export type Opt<T extends string> = { id: T; label: string; sub?: string };

/** A vertical list of options, each a real button with a pressed state. Single or multiple choice; 44 px tall at least. */
export function OptionList<T extends string>({
  options,
  value,
  onChange,
  multi,
  label,
  cols = 1,
  disabledIds = [],
  onDisabledClick,
}: {
  options: Opt<T>[];
  value: T | T[] | null;
  onChange: (id: T) => void;
  multi?: boolean;
  label: string;
  cols?: 1 | 2;
  /** Options that cannot be added right now (a limit was reached). They stay clickable: the click explains. */
  disabledIds?: T[];
  onDisabledClick?: (id: T) => void;
}) {
  const on = (id: T) => (Array.isArray(value) ? value.includes(id) : value === id);
  return (
    <div role={multi ? "group" : "radiogroup"} aria-label={label} className={clsx("grid gap-2", cols === 2 && "sm:grid-cols-2")}>
      {options.map((o) => {
        const locked = disabledIds.includes(o.id) && !on(o.id);
        return (
          <button
            key={o.id}
            type="button"
            aria-pressed={on(o.id)}
            aria-disabled={locked || undefined}
            onClick={() => (locked ? onDisabledClick?.(o.id) : onChange(o.id))}
            className={clsx(
              "flex min-h-[44px] w-full flex-col items-start justify-center rounded-lg border px-3 py-2 text-left text-caption transition-colors",
              on(o.id) ? "border-accent bg-accentSoft ring-2 ring-gold" : "border-line bg-paper hover:border-ash",
              locked && "opacity-60",
            )}
          >
            <span className="font-semibold text-ink">
              <span aria-hidden className="mr-1.5">
                {multi ? (on(o.id) ? "☑" : "☐") : on(o.id) ? "◉" : "○"}
              </span>
              {o.label}
            </span>
            {o.sub && <span className="mt-0.5 pl-5 text-ash">{o.sub}</span>}
          </button>
        );
      })}
    </div>
  );
}

const GLYPH = ["", "●○○", "●●○", "●●●"];
const NAME = () => [tt("not set", "nicht gesetzt"), tt("Low", "Niedrig"), tt("Mid", "Mittel"), tt("High", "Hoch")];

/** A 1-to-3 score: three buttons, each with a glyph and a label so the level is never colour alone. */
export function ScorePick({ value, onChange, label, flagged }: { value: number; onChange: (v: 1 | 2 | 3) => void; label: string; flagged?: boolean }) {
  return (
    <div role="radiogroup" aria-label={label} className={clsx("inline-flex gap-1 rounded-lg p-0.5", flagged && "is-flagged")}>
      {([1, 2, 3] as const).map((v) => (
        <button
          key={v}
          type="button"
          aria-pressed={value === v}
          aria-label={`${label}: ${NAME()[v]} (${v})`}
          onClick={() => onChange(v)}
          className={clsx("min-h-[40px] min-w-[3.4rem] rounded-md border px-2 text-caption font-semibold tracking-wider transition-colors", value === v ? "border-accent bg-accentSoft text-ink ring-2 ring-gold" : "border-line bg-paper text-ash hover:border-ash")}
        >
          <span aria-hidden>{GLYPH[v]}</span>
          <span className="sr-only">{NAME()[v]}</span>
        </button>
      ))}
    </div>
  );
}

/** The "Check" line under a checked exercise: the button, the clue button, and the counter of checks requested. */
export function CheckBar({
  onCheck,
  checkLabel,
  clueShown,
  onClue,
  checks,
  children,
}: {
  onCheck: () => void;
  checkLabel: string;
  clueShown?: boolean;
  onClue?: () => void;
  checks: number;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" onClick={onCheck} className="btn-primary">
        {checkLabel}
      </button>
      {onClue && !clueShown && (
        <button type="button" onClick={onClue} className="btn-ghost btn-sm border-gold">
          {tt("Show clue", "Hinweis zeigen")}
        </button>
      )}
      <span className="text-caption text-ash">
        {tt("Checks requested:", "Angeforderte Prüfungen:")} <span className="tnum font-semibold text-ink">{checks}</span>
      </span>
      {children}
    </div>
  );
}

/** A clue or a check reading, in the amber panel style. */
export function Reading({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <p role="status" className="fade-in rounded-md border border-gold bg-accentSoft px-3 py-2 text-caption text-ink">
      <span className="smallcaps mr-1.5 text-accent">{label ?? tt("Check", "Prüfung")}</span>
      {children}
    </p>
  );
}
