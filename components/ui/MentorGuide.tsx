"use client";

import type { MentorGuide as Guide } from "@/lib/mentorGuide";
import { useStore } from "@/store/useStore";

/**
 * Mentor-only worked answer under a task question, shown once the passcode has been entered in the mentor
 * bar. For a calculation it lists every step with its numbers; for free text it gives the model answer and
 * what a good answer must contain. Same rust styling as <AnswerKey> so it never reads as learner content;
 * session-only unlock, never exported, never printed. A convenience for facilitation, not security.
 */
export function MentorGuide({ guide }: { guide: Guide }) {
  const unlocked = useStore((s) => s.mentorUnlocked);
  if (!unlocked) return null;
  return (
    <aside aria-label={`Mentor worked answer: ${guide.title}`} className="fade-in rounded-lg border border-rust/50 bg-rustSoft p-3.5 text-caption text-ink print:hidden">
      <p className="smallcaps text-rust">Mentor · worked answer · {guide.title}</p>
      <p className="mt-1">
        <span className="font-semibold">Model answer: </span>
        {guide.answer}
      </p>
      {guide.steps && guide.steps.length > 0 && (
        <div className="mt-2 overflow-x-auto">
          <table className="w-full border-collapse">
            <caption className="sr-only">Calculation steps</caption>
            <thead>
              <tr className="text-left text-micro uppercase text-rust">
                <th scope="col" className="w-6 py-1 pr-2 font-semibold">#</th>
                <th scope="col" className="py-1 pr-2 font-semibold">Step</th>
                <th scope="col" className="py-1 pr-2 font-semibold">Calculation</th>
                <th scope="col" className="py-1 text-right font-semibold">Result</th>
              </tr>
            </thead>
            <tbody>
              {guide.steps.map((s, i) => (
                <tr key={i} className="border-t border-rust/20 align-top">
                  <td className="py-1 pr-2 font-semibold">{i + 1}</td>
                  <td className="py-1 pr-2">{s.label}</td>
                  <td className="tnum py-1 pr-2">{s.calc}</td>
                  <td className="tnum py-1 text-right font-semibold">{s.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {guide.why && (
        <p className="mt-2">
          <span className="font-semibold">Why: </span>
          {guide.why}
        </p>
      )}
      {guide.lookFor && guide.lookFor.length > 0 && (
        <div className="mt-2">
          <p className="font-semibold">A good answer:</p>
          <ul className="list-disc space-y-0.5 pl-5">
            {guide.lookFor.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>
      )}
      {guide.pitfalls && guide.pitfalls.length > 0 && (
        <div className="mt-2 border-t border-rust/30 pt-2">
          <p className="font-semibold">Common mistakes:</p>
          <ul className="list-disc space-y-0.5 pl-5">
            {guide.pitfalls.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
