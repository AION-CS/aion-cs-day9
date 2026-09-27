"use client";

import { scrollToAndFlash } from "@/lib/flash";
import { tt } from "@/lib/lang";


export type MissingItem = {
  id: string;
  label: string;
  /** Runs first — opens whatever container the target lives in, so the click is never dead. */
  before?: () => void;
};

export function jumpTo(m: MissingItem) {
  m.before?.();
  window.setTimeout(() => scrollToAndFlash(m.id), m.before ? 60 : 0);
}

/** A list of concrete, named gaps. Every entry is a button that scrolls to the exact element and flashes it. */
export function MissingList({ items, lead }: { items: MissingItem[]; lead?: string }) {
  if (items.length === 0) return null;
  return (
    <div className="text-caption text-ash">
      <p className="font-semibold text-ink">{lead ?? tt("Still needed:", "Noch nötig:")}</p>
      <ul className="mt-1 list-disc space-y-1 pl-5">
        {items.map((m, i) => (
          <li key={`${m.id}-${i}`}>
            <button
              type="button"
              onClick={() => jumpTo(m)}
              className="text-left underline decoration-dotted underline-offset-2 hover:text-ink"
            >
              {m.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
