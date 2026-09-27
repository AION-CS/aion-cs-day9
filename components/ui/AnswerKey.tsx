"use client";

import type { AnswerKeyBlock } from "@/lib/answerKey";
import { useStore } from "@/store/useStore";

/**
 * Mentor-only answer key, shown next to an exercise with fixed options once the passcode has been entered in
 * the top bar. Styled in rust (`warn`), never the amber accent, so it never reads as learner content. The
 * unlock flag is session-only: a reload locks it again. A convenience gate, not security.
 */
export function AnswerKey({ block }: { block: AnswerKeyBlock }) {
  const unlocked = useStore((s) => s.mentorUnlocked);
  if (!unlocked) return null;
  return (
    <aside aria-label={`Mentor answer key: ${block.title}`} className="fade-in rounded-lg border border-rust/50 bg-rustSoft p-3.5 text-caption text-ink print:hidden">
      <p className="smallcaps text-rust">Mentor · answer key · {block.title}</p>
      <p className="mt-1">
        <span className="font-semibold">Expected: </span>
        {block.expected}
      </p>
      <ul className="mt-2 space-y-1">
        {block.options.map((o, i) => (
          <li key={`${o.label}-${i}`} className="flex gap-2">
            <span aria-hidden className="w-16 shrink-0 font-semibold text-rust">
              {o.expected ? "EXPECTED" : "REJECTED"}
            </span>
            <span>
              <span className="font-semibold">{o.label}.</span> {o.why}
            </span>
          </li>
        ))}
      </ul>
      {block.teachingNote && (
        <p className="mt-2 border-t border-rust/30 pt-2">
          <span className="font-semibold">Teaching note: </span>
          {block.teachingNote}
        </p>
      )}
    </aside>
  );
}
