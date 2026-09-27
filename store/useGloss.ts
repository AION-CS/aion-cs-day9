"use client";

import { create } from "zustand";

/** Which glossary term's explanation is open. Session-only — never persisted. */
type GlossState = { id: string | null; open: (id: string) => void; close: () => void };

export const useGloss = create<GlossState>()((set, get) => ({
  id: null,
  // Pressing the open term again closes it.
  open: (id) => set({ id: get().id === id ? null : id }),
  close: () => set({ id: null }),
}));
