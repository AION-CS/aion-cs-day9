"use client";

import type { ReactNode } from "react";
import { useCardMore } from "@/store/useCardMore";
import { tt } from "@/lib/lang";

/**
 * A quiet "Show" row that keeps text the task does not need out of sight until it is asked for (CLAUDE.md #37). Closed: one line,
 * a button. Open: the content, with a small "Hide". The state lives in `useCardMore` (session-only) so a task chip can open a part
 * before it scrolls there.
 */
export function ShowMore({ id, part, label, children }: { id: string; part: string; label: string; children: ReactNode }) {
  const key = `${id}:${part}`;
  const all = useCardMore((s) => s.all);
  const on = useCardMore((s) => s.all || !!s.open[key]);
  const set = useCardMore((s) => s.set);
  if (!on)
    return (
      <button
        type="button"
        id={`${key.replace(":", "-")}-show`}
        aria-expanded={false}
        onClick={() => set(key, true)}
        className="tap-chip flex min-h-[40px] w-full items-center gap-2 rounded-lg border border-dashed border-line bg-paper px-3 text-left text-caption font-semibold text-ash transition-colors hover:border-accent hover:text-accentHi"
      >
        <span aria-hidden>＋</span>
        {label}
      </button>
    );
  return (
    <div id={key.replace(":", "-")} className="space-y-1.5">
      <div className="flex justify-end">
        {!all && <button type="button" aria-expanded={true} onClick={() => set(key, false)} className="text-micro font-semibold text-ash underline decoration-dotted underline-offset-2 hover:text-accentHi">
          {tt("Hide", "Ausblenden")}
        </button>}
      </div>
      {children}
    </div>
  );
}
