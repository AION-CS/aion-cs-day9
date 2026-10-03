"use client";

import { create } from "zustand";

/**
 * Which "Show" parts of the material cards are open (CLAUDE.md #37). Everything that is not needed to answer a task starts
 * closed, so a card reads short; one click opens a part, "Hide" closes it again, and `all` opens every part at once (mentor
 * or print view). Session-only, never persisted: a reload closes them again, and the learner's answers are unaffected.
 */
type CardMoreState = {
  open: Record<string, boolean>;
  all: boolean;
  set: (key: string, on: boolean) => void;
  setAll: (on: boolean) => void;
};

export const useCardMore = create<CardMoreState>()((set) => ({
  open: {},
  all: false,
  set: (key, on) => set((s) => ({ open: { ...s.open, [key]: on } })),
  setAll: (on) => set({ all: on, open: {} }),
}));

/** Opens one part of a card, e.g. `showCardPart("A4", "rules")`: a task chip uses this so a jump never lands on a closed part. */
export const showCardPart = (cardId: string, part: string) => useCardMore.getState().set(`${cardId}:${part}`, true);
