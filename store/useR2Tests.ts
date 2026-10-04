"use client";

import { create } from "zustand";

/** Whether the four tests under the Route 2 panel are shown (session-only). They stay hidden until the learner asks for them (CLAUDE.md #47). */
export const useR2Tests = create<{ open: boolean; setOpen: (v: boolean) => void }>()((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));
