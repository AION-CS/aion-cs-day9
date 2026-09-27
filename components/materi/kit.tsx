"use client";

import type { ReactNode } from "react";
import clsx from "clsx";
import { glossify } from "@/lib/glossify";
import { tt } from "@/lib/lang";


/** Short bullet list used inside cards. */
export function Bul({ items }: { items: ReactNode[] }) {
  const seen = new Set<string>();
  return (
    <ul className="list-disc space-y-1.5 pl-5 text-body">
      {items.map((it, i) => (
        <li key={i}>{glossify(it, seen)}</li>
      ))}
    </ul>
  );
}

/** A framed figure: the SVG is the teaching instrument, so it gets its own quiet frame and caption. */
export function Diagram({ label, children, caption }: { label: string; children: ReactNode; caption?: ReactNode }) {
  return (
    <figure className="rounded-xl border border-line bg-canvas/50 p-3 md:p-4" aria-label={label}>
      <p className="smallcaps mb-2">{label}</p>
      {children}
      {caption && <figcaption className="mt-2 text-caption text-ash">{glossify(caption)}</figcaption>}
    </figure>
  );
}

/** A row of toggle / scenario buttons. Every one is a real button with a pressed state. */
export function Toggles<T extends string>({
  options,
  value,
  onChange,
  label,
  multi,
}: {
  options: { id: T; label: string }[];
  value: T | T[] | null;
  onChange: (id: T) => void;
  label: string;
  multi?: boolean;
}) {
  const isOn = (id: T) => (Array.isArray(value) ? value.includes(id) : value === id);
  return (
    <div role={multi ? "group" : "radiogroup"} aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={isOn(o.id)}
          onClick={() => onChange(o.id)}
          className={clsx(
            "btn btn-sm min-h-[40px] border",
            isOn(o.id) ? "border-accent bg-accentSoft text-ink" : "border-line bg-paper text-ash hover:border-ash",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Exploratory marker — ungraded and never exported. */
export function Exploratory() {
  return <span className="pill border-line bg-mist text-ash">{tt("Exploratory · not graded", "Explorativ · nicht bewertet")}</span>;
}

/**
 * Always-visible, live-updating reading of what the control above just showed — not the raw
 * value, but what it demonstrates. Place directly under the interactive element it explains.
 */
export function Insight({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p aria-live="polite" className={clsx("insight rounded-md bg-mist px-3 py-2 text-caption text-ink", className)}>
      <span className="smallcaps mr-1.5 text-ash">{tt("What this shows", "Was das zeigt")}</span>
      {children}
    </p>
  );
}
