"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { tt } from "@/lib/lang";


/**
 * A learner help that stays hidden until asked for, like a clue: a small button, and on click a panel with a
 * Hide link. Used for "Show the formula" and "Show where the numbers are" under calculation fields, so a
 * learner can first try alone. Several sit in one flex-wrap row: closed they line up as buttons, an open
 * panel takes the full width. Session-only state; never exported.
 */
export function RevealHint({
  id,
  label,
  title,
  children,
  forceOpen = false,
}: {
  id: string;
  label: string;
  title: string;
  children: ReactNode;
  /** Opens the panel when it turns true, e.g. after a check flags something inside it, so a flag never sits in a closed panel. */
  forceOpen?: boolean;
}) {
  const [open, setOpen] = useState(forceOpen);
  useEffect(() => {
    if (forceOpen) setOpen(true);
  }, [forceOpen]);
  if (!open) {
    return (
      <button type="button" aria-expanded={false} aria-controls={id} onClick={() => setOpen(true)} className="btn-ghost btn-sm">
        {label}
      </button>
    );
  }
  return (
    <div id={id} className="fade-in basis-full rounded-md border border-line bg-mist/60 p-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="smallcaps text-ash">{title}</p>
        <button
          type="button"
          aria-expanded={true}
          aria-controls={id}
          onClick={() => setOpen(false)}
          className="text-micro font-semibold text-ash underline decoration-dotted underline-offset-2 hover:text-accentHi"
        >
          {tt("Hide", "Ausblenden")}
        </button>
      </div>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
