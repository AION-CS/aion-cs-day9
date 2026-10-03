"use client";

import type { ReactNode } from "react";
import { CorePill } from "@/components/ui/AnswerBlock";
import { useOptionalOpen } from "@/store/useOptionalOpen";
import { tt } from "@/lib/lang";

/**
 * Collapses a material card or task block that is optional — not on the shortest path to the route's own
 * objective — behind one quiet line, so the route reads shorter without removing or gating anything (CLAUDE.md
 * #6: nothing is ever a hard lock). Renders a placeholder at the same `id` the page already anchors to
 * (PageNav, scrollToAndFlash), so a jump still lands somewhere even while collapsed. One click reveals the
 * real card/block in full, exactly as if this wrapper were never there; nothing is deleted, only folded.
 *
 * Open/closed state lives in the shared `useOptionalOpen` store, not a local `useState`, so a PageNav jump (or
 * any other `openOptionalBlock(id)` call) can open an item before landing on it — a jump never lands on a
 * closed container (CLAUDE.md #12). Once open, a small "Hide" puts it back to one quiet line.
 */
export function OptionalSection({
  id,
  title,
  minutes,
  reason,
  children,
}: {
  id: string;
  title: string;
  minutes?: number;
  /** One line saying what this deepens or repeats, so the choice to skip it is informed. */
  reason: string;
  children: ReactNode;
}) {
  const open = useOptionalOpen((s) => !!s.open[id]);
  const show = useOptionalOpen((s) => s.show);
  const hide = useOptionalOpen((s) => s.hide);

  if (open)
    return (
      <div className="space-y-1.5">
        <div className="flex justify-end">
          <button type="button" onClick={() => hide(id)} className="text-micro normal-case tracking-normal text-ash/70 underline decoration-dotted underline-offset-2 hover:text-ash">
            {tt("Hide", "Ausblenden")}
          </button>
        </div>
        {children}
      </div>
    );
  return (
    <div id={id} data-optional-closed="true" className="card flex flex-wrap items-center justify-between gap-3 border-dashed border-line bg-mist/40 p-4">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <CorePill core={false} />
          <span className="font-semibold text-ink">{title}</span>
          {minutes ? <span className="smallcaps text-ash">{minutes} {tt("min", "Min.")}</span> : null}
        </div>
        <p className="mt-1 text-caption text-ash">{reason}</p>
      </div>
      <button type="button" onClick={() => show(id)} className="btn-ghost btn-sm shrink-0">
        {tt("Show this", "Diese anzeigen")}
      </button>
    </div>
  );
}
