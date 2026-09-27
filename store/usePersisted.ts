"use client";

import { useMemo } from "react";
import { useStore } from "@/store/useStore";
import type { Persisted } from "@/store/useStore";

/** The persisted slice as one stable object — for the pure helpers (missing lists, export bodies) that take it whole. */
export function usePersisted(): Persisted {
  const participant = useStore((s) => s.participant);
  const ui = useStore((s) => s.ui);
  const l1 = useStore((s) => s.l1);
  const r2 = useStore((s) => s.r2);
  return useMemo(() => ({ participant, ui, l1, r2 }), [participant, ui, l1, r2]);
}
