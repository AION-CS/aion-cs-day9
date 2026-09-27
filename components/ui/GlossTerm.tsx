"use client";

import type { ReactNode } from "react";
import { useGloss } from "@/store/useGloss";

/** A technical term in running text: a dotted-underlined button that opens its plain-language explanation. */
export function GlossTerm({ id, children }: { id: string; children: ReactNode }) {
  const open = useGloss((s) => s.open);
  const active = useGloss((s) => s.id === id);
  return (
    <button
      type="button"
      className="gloss"
      aria-expanded={active}
      aria-controls="gloss-panel"
      onClick={() => open(id)}
    >
      {children}
    </button>
  );
}
