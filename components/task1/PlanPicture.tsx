"use client";

import clsx from "clsx";
import { Gloss } from "@/lib/glossify";
import { tt } from "@/lib/lang";
import { FRAME_WEEKS, MEASURE_BY_ID, PROBLEM_IDS, PROBLEM_LABEL, PROBLEM_PLAIN, workingWeeks } from "@/data/measures";
import type { MeasureId } from "@/data/measures";
import { coverage } from "@/lib/checks";
import type { L1State } from "@/store/useStore";

/**
 * The consequence picture of Block 2.4 (CLAUDE.md #16): what the three chosen measures do to LiveConnect's three problems and to the
 * four months. Two parts, both drawn from the printed weeks and the measures' facts, never from the learner's scores:
 *  - three boxes, one per problem of the brief: solid when a chosen measure answers it AND has time left to work, dashed when not;
 *  - one bar per chosen measure on a 16-week line: hatched while it is being built, solid once it works.
 * It names no right answer and marks nothing wrong: the learner sees what the plan leaves open and decides.
 */
export function PlanPicture({ l1 }: { l1: Pick<L1State, "chosen"> }) {
  const chosen = l1.chosen;
  const cov = coverage(l1 as L1State);
  const open = cov.filter((c) => !c.covered);
  const weeks = Array.from({ length: FRAME_WEEKS / 4 + 1 }, (_, i) => i * 4);
  const reading = (() => {
    if (chosen.length === 0) return tt("Choose a measure and the three boxes show which problem it answers; the bars show when it starts working.", "Wählen Sie eine Maßnahme, und die drei Kästen zeigen, welches Problem sie beantwortet; die Balken zeigen, wann sie zu wirken beginnt.");
    const parts: string[] = [];
    parts.push(tt(`Your ${chosen.length === 1 ? "measure answers" : `${chosen.length} measures answer`} ${3 - open.length} of the 3 problems.`, `${chosen.length === 1 ? "Ihre Maßnahme beantwortet" : `Ihre ${chosen.length} Maßnahmen beantworten`} ${3 - open.length} der 3 Probleme.`));
    for (const c of open) {
      parts.push(
        c.tooLate
          ? tt(`“${PROBLEM_PLAIN[c.pattern]}” is answered only by a measure that starts working in week ${FRAME_WEEKS}: no time is left.`, `„${PROBLEM_PLAIN[c.pattern]}“ beantwortet nur eine Maßnahme, die erst in Woche ${FRAME_WEEKS} zu wirken beginnt: Es bleibt keine Zeit.`)
          : tt(`“${PROBLEM_PLAIN[c.pattern]}” stays open: nothing you chose answers it.`, `„${PROBLEM_PLAIN[c.pattern]}“ bleibt offen: Nichts, was Sie gewählt haben, beantwortet es.`),
      );
    }
    const never = chosen.filter((id) => workingWeeks(id) === 0);
    const late = chosen.filter((id) => workingWeeks(id) > 0 && workingWeeks(id) < FRAME_WEEKS / 2);
    const names = (ids: MeasureId[]) => ids.map((id) => MEASURE_BY_ID[id].short).join(tt(" and ", " und "));
    if (never.length) parts.push(tt(`${names(never)} starts working only in week ${FRAME_WEEKS}, so for all four months it changes nothing for the customer.`, `${names(never)} beginnt erst in Woche ${FRAME_WEEKS} zu wirken, also ändert es in allen vier Monaten nichts für den Kunden.`));
    if (late.length) parts.push(tt(`${names(late)} works for less than half of the four months.`, `${names(late)} wirkt weniger als die Hälfte der vier Monate.`));
    return parts.join(" ");
  })();
  return (
    <div id="plan-picture" className="space-y-3 rounded-lg border border-line bg-mist/40 p-3">
      <p className="smallcaps">{tt("What your plan does to the three problems", "Was Ihr Plan mit den drei Problemen macht")}</p>
      <ul className="grid gap-2 sm:grid-cols-3">
        {PROBLEM_IDS.map((p) => {
          const c = cov.find((x) => x.pattern === p)!;
          const on = chosen.length > 0 && c.covered;
          return (
            <li key={p} className={clsx("rounded-md border px-3 py-2 text-caption", on ? "border-signal/50 bg-signalSoft text-ink" : "border-dashed border-ash bg-paper text-ink")}>
              <span aria-hidden>{on ? "● " : "○ "}</span>
              <strong>{PROBLEM_LABEL[p]}</strong>
              <span className="block text-ash">{PROBLEM_PLAIN[p]}</span>
              <span className="mt-0.5 block font-semibold">{on ? tt("Answered in time", "Rechtzeitig beantwortet") : chosen.length === 0 ? tt("Not answered yet", "Noch nicht beantwortet") : c.tooLate ? tt("Answered too late", "Zu spät beantwortet") : tt("Open", "Offen")}</span>
            </li>
          );
        })}
      </ul>
      <div className="space-y-1">
        <p className="smallcaps">{tt(`When each measure starts working (${FRAME_WEEKS} weeks = 4 months)`, `Wann jede Maßnahme zu wirken beginnt (${FRAME_WEEKS} Wochen = 4 Monate)`)}</p>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-[8rem] right-[7.5rem] hidden sm:block" aria-hidden>
            {weeks.map((w) => (
              <span key={w} className="absolute inset-y-0 border-l border-line" style={{ left: `${(w / FRAME_WEEKS) * 100}%` }}>
                <span className="absolute -top-0.5 left-1 text-micro text-ash">{w}</span>
              </span>
            ))}
          </div>
          <ul className="space-y-1.5 pt-3">
            {chosen.length === 0 && <li className="text-caption text-ash">{tt("No measure chosen yet.", "Noch keine Maßnahme gewählt.")}</li>}
            {chosen.map((id: MeasureId) => {
              const m = MEASURE_BY_ID[id];
              const work = workingWeeks(id);
              return (
                <li key={id} className="grid grid-cols-[6.5rem_1fr] items-center gap-2 sm:grid-cols-[7.5rem_1fr_7rem]">
                  <span className="text-caption font-semibold text-ink">{m.short}</span>
                  <span className="relative flex h-6 overflow-hidden rounded border border-line bg-paper" role="img" aria-label={tt(`${m.short}: set-up ${m.weeks} weeks, then working ${work} of ${FRAME_WEEKS} weeks`, `${m.short}: Aufbau ${m.weeks} Wochen, dann wirksam ${work} von ${FRAME_WEEKS} Wochen`)}>
                    <span style={{ width: `${(Math.min(m.weeks, FRAME_WEEKS) / FRAME_WEEKS) * 100}%`, backgroundImage: "repeating-linear-gradient(45deg,#FBF0D6,#FBF0D6 4px,#D99A2B 4px,#D99A2B 6px)" }} className="h-full border-r border-accent" />
                    {work > 0 && <span style={{ width: `${(work / FRAME_WEEKS) * 100}%` }} className="h-full bg-[#2F5D62]" />}
                  </span>
                  <span className="col-span-2 pl-1 text-micro text-ash sm:col-span-1 sm:pl-0">
                    {tt(`building ${m.weeks} wk`, `Aufbau ${m.weeks} Wo.`)} · <strong className="text-ink">{work > 0 ? tt(`works ${work} wk`, `wirkt ${work} Wo.`) : tt("no time to work", "keine Zeit zu wirken")}</strong>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
        <p className="text-micro text-ash">{tt("Hatched = being built, nothing changes for the customer yet. Solid = working.", "Schraffiert = im Aufbau, für den Kunden ändert sich noch nichts. Voll = wirksam.")}</p>
      </div>
      <p role="status" aria-live="polite" className="insight pl-3 text-caption text-ink">
        <span className="smallcaps mr-1 text-accent">{tt("What this shows", "Was das zeigt")}</span>
        <Gloss>{tt("In plain words: ", "In einfachen Worten: ") + reading}</Gloss>
      </p>
    </div>
  );
}
