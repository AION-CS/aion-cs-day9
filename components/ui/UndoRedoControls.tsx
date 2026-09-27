"use client";

import { useState } from "react";
import type { KeyboardEvent } from "react";
import { tt } from "@/lib/lang";


/**
 * Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z and Ctrl+Y for one placement exercise.
 * Attached to the exercise's own wrapper, and ignored while typing in a text
 * field, where the browser's own text undo is the one meant.
 */
export function undoRedoKeyHandler(onUndo: () => void, onRedo: () => void) {
  return (e: KeyboardEvent<HTMLElement>) => {
    if (!(e.ctrlKey || e.metaKey) || e.altKey) return;
    const t = e.target as HTMLElement;
    if (t.closest("textarea, [contenteditable='true'], input:not([type='radio']):not([type='checkbox'])")) return;
    const k = e.key.toLowerCase();
    if (k === "z" && !e.shiftKey) {
      e.preventDefault();
      onUndo();
    } else if ((k === "z" && e.shiftKey) || k === "y") {
      e.preventDefault();
      onRedo();
    }
  };
}

/** Visible undo/redo. Still clickable at a stack boundary — it says so instead of going dead. */
export function UndoRedoControls({
  onUndo,
  onRedo,
  undoCount,
  redoCount,
}: {
  onUndo: () => void;
  onRedo: () => void;
  undoCount: number;
  redoCount: number;
}) {
  const [note, setNote] = useState<string | null>(null);
  const say = (t: string) => {
    setNote(t);
    window.setTimeout(() => setNote(null), 1400);
  };
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => (undoCount ? onUndo() : say(tt("Nothing to undo yet.", "Noch nichts rückgängig zu machen.")))}
        aria-keyshortcuts="Control+Z Meta+Z"
        className="btn-ghost btn-sm"
      >
        ↶ {tt("Undo", "Rückgängig")} <span className="tnum text-ash">({undoCount})</span>
      </button>
      <button
        type="button"
        onClick={() => (redoCount ? onRedo() : say(tt("Nothing to redo.", "Nichts wiederherzustellen.")))}
        aria-keyshortcuts="Control+Shift+Z Meta+Shift+Z Control+Y"
        className="btn-ghost btn-sm"
      >
        ↷ {tt("Redo", "Wiederholen")} <span className="tnum text-ash">({redoCount})</span>
      </button>
      <span aria-live="polite" className="min-w-[8rem] text-micro text-ash">
        {note ?? <span className="hidden sm:inline">Ctrl/⌘+Z · Ctrl/⌘+Shift+Z</span>}
      </span>
    </div>
  );
}
