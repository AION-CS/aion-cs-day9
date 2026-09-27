"use client";

import type { ReactNode } from "react";
import clsx from "clsx";
import { glossify } from "@/lib/glossify";
import { tt } from "@/lib/lang";


/**
 * A labelled field. The instruction lives under the label and stays visible —
 * a placeholder may only show the *form* of an answer. When a check has
 * flagged the field it is outlined in amber and offers one clue.
 */
export function Field({
  id,
  htmlFor,
  label,
  help,
  children,
  flagged,
  clue,
  clueShown,
  onShowClue,
  meta,
}: {
  /** Wrapper id — what the missing list scrolls to and flashes. */
  id: string;
  htmlFor?: string;
  label: ReactNode;
  help: ReactNode;
  children: ReactNode;
  flagged?: boolean;
  clue?: string;
  clueShown?: boolean;
  onShowClue?: () => void;
  meta?: ReactNode;
}) {
  return (
    <div id={id} className={clsx("space-y-1.5 p-1", flagged && "is-flagged")}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <label htmlFor={htmlFor} className="font-semibold text-ink">
          {label}
        </label>
        {meta}
      </div>
      <p id={htmlFor ? `${htmlFor}-help` : undefined} className="text-caption text-ash">
        {glossify(help)}
      </p>
      {children}
      {flagged && clue && (
        <div className="fade-in text-caption">
          {clueShown ? (
            <p role="status" className="rounded-md border border-gold bg-accentSoft px-3 py-2 text-ink">
              <span className="smallcaps mr-1 text-accent">{tt("Clue", "Hinweis")}</span>
              {clue}
            </p>
          ) : (
            <button type="button" onClick={onShowClue} className="btn-ghost btn-sm border-gold">
              {tt("Show clue", "Hinweis zeigen")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
