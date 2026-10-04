"use client";

import { l1Missing, r2Missing } from "@/lib/missing";
import { jumpTo } from "@/components/ui/MissingList";
import { usePersisted } from "@/store/usePersisted";
import { tt } from "@/lib/lang";

/**
 * A live, rust "still missing" note under one answer block: every still-open item of that block, named
 * concretely (CLAUDE.md #1), each clickable to its exact field (#2). Reuses the same MissingEntry list the
 * Export bar's notice builds (lib/missing.ts) — every label already starts "Block X.Y: …", so filtering by
 * that prefix needs no new ids. Never gated by a Check (#4/#16 unchanged): this reports presence, length or
 * count, never a classification's correctness, so it is never the forbidden literal answer. Disappears the
 * instant the block's own requirement is met; reappears if a value is cleared below it again. An Optional
 * block's fields are already excluded from the missing computation (they are not required), so this renders
 * nothing there.
 */
export function BlockMissing({ block, route, prefix }: { block: string; route: 1 | 2; /** For a part that is not "Block X.Y" (Route 2's Step A and Step B): the word its labels start with, in the active language. */ prefix?: string }) {
  const p = usePersisted();
  const all = route === 1 ? l1Missing(p) : r2Missing(p);
  const lead = prefix ?? `Block ${block}`;
  const items = all.filter((m) => m.label.startsWith(`${lead}:`));
  if (items.length === 0) return null;
  return (
    <div className="fade-in rounded-md border border-rust/40 bg-rustSoft p-3" role="status">
      <p className="smallcaps text-rust">{tt(`Still missing in ${lead}`, `Noch offen in ${lead}`)}</p>
      <ul className="mt-1.5 space-y-1">
        {items.map((m, i) => (
          <li key={`${m.id}-${i}`}>
            <button type="button" onClick={() => jumpTo(m)} className="text-left text-caption text-ink underline decoration-dotted underline-offset-2 hover:text-rust">
              {m.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
