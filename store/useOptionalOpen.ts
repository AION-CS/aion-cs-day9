"use client";

import { create } from "zustand";

/**
 * Which Optional material cards and task blocks the learner has opened (CLAUDE.md #35). An Optional item starts
 * collapsed to one quiet line so attention stays on Core; opening one is a click, never a lock. Session-only,
 * never persisted: the answers inside stay persisted as usual (Zustand + persist, CLAUDE.md #9), only the
 * open/closed state is not — a reload re-collapses everything, same as the mentor bar's own unlock flag.
 */
type OptionalOpenState = {
  open: Record<string, boolean>;
  show: (id: string) => void;
  hide: (id: string) => void;
};

export const useOptionalOpen = create<OptionalOpenState>()((set) => ({
  open: {},
  show: (id) => set((s) => ({ open: { ...s.open, [id]: true } })),
  hide: (id) => set((s) => ({ open: { ...s.open, [id]: false } })),
}));

/** Opens an Optional item by its element id (a no-op for any other id), so a jump to it never lands on a closed item. */
export const openOptionalBlock = (id: string) => useOptionalOpen.getState().show(id);
