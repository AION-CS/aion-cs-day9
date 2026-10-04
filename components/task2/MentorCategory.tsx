"use client";

import type { Category } from "@/lib/r2Panel";
import { useStore } from "@/store/useStore";

const NAME: Record<Category, string> = { 1: "safe", 2: "fair", 3: "clearly wrong" };

/**
 * Mentor-only: the internal category of the learner's plan or decision (CLAUDE.md #47). The learner never sees it and it is never exported: it only
 * chooses the wording of the reading and tells the facilitator where the learner stands. Rust styling like the answer key; shown only once unlocked.
 */
export function MentorCategory({ cat, why, label }: { cat: Category; why: string; label: string }) {
  const unlocked = useStore((s) => s.mentorUnlocked);
  if (!unlocked) return null;
  return (
    <aside aria-label={`Mentor: category of ${label}`} className="fade-in rounded-lg border border-rust/50 bg-rustSoft p-3 text-caption text-ink print:hidden">
      <p className="smallcaps text-rust">
        Mentor · {label} · category {cat} ({NAME[cat]})
      </p>
      <p className="mt-1">{why}</p>
      <p className="mt-1 text-ash">Learners never see the category and it is never exported. The reading tells them what to change to reach category 1; a different, well-reasoned choice still exports.</p>
    </aside>
  );
}
