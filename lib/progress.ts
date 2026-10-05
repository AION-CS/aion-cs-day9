import { MATERIALS } from "@/data/materialIndex";
import { LINE_IDS } from "@/data/ladder";
import { PICK } from "@/data/forecast";
import { PATTERN_IDS, REC_IDS } from "@/data/patterns";
import { CHOOSE } from "@/data/measures";
import { COMP_CHOOSE, CRIT_IDS, SIT_IDS, SOURCE_IDS } from "@/data/route2";
import { abComplete, citesForecastFigure, insightFlags } from "@/lib/checks";
import { nowIds } from "@/lib/r2Panel";
import type { RouteNo } from "@/lib/routes";
import type { Persisted } from "@/store/useStore";

export type TaskBlockId = "b11" | "b12" | "b13" | "b14" | "b21" | "b22" | "b23" | "b24" | "b31" | "b32" | "b33" | "b34" | "b35" | "b36";

/**
 * Blocks that deepen or repeat a skill a Core block already teaches, rather than sit on the shortest path to their route's own
 * objective. Collapsed by default via OptionalSection, never removed (CLAUDE.md #6), never required by the missing list or the
 * dossier ring (#35).
 * Route 1 ("understand real-time interaction, then make the measures measurable and choose which to fund"): Core 1.1 (the first
 * tagging and the own opportunity: plan Task 1 questions 1 to 3), 1.3 (where to act and three improvements: Task 1 question 4), 2.1
 * (tag the twelve metrics by kind and name your three KPIs: case task 3) and 2.4 (choose, score and order three of six measures: case
 * tasks 2 and 5): four blocks at most. Optional 1.2, 1.4, 2.2 and 2.3 (the A/B test concept: case task 4).
 * Route 2 ("decide a real-time management system under time pressure and with incomplete data", CLAUDE.md #47): one frame with two Core
 * steps. Step A (block 3.5: the target vision, the selection of measures and the prioritised implementation architecture, plan items 1, 3
 * and 5, with the live view and KPI system seen in the Measurable bar) and Step B (block 3.6: the decision under time pressure and
 * uncertain data, with its reason and what to watch). Optional 3.1 to 3.4 ("Go deeper"): self-contained, never read by the frame.
 */
export const OPTIONAL_BLOCKS: TaskBlockId[] = ["b12", "b14", "b22", "b23", "b31", "b32", "b33", "b34"];
export const isOptionalBlock = (b: TaskBlockId) => (OPTIONAL_BLOCKS as string[]).includes(b);
const len = (t: string) => t.trim().length;
export const MIN_SENTENCE = 40;
export const MIN_LINE = 30;

/** Which task blocks are complete. Complete means filled in, never correct. */
export function taskBlocks(p: Persisted): Record<TaskBlockId, boolean> {
  const { l1, r2 } = p;
  return {
    b11: LINE_IDS.every((id) => l1.sort[id] !== null) && len(l1.extraInsight) >= MIN_LINE,
    b12: len(l1.meaning) >= MIN_SENTENCE && citesForecastFigure(l1.meaning),
    b13: l1.valuable.length === PICK && l1.churners.length === PICK && insightFlags(l1).length === 0,
    b14: len(l1.reflect.interpret) >= MIN_LINE && len(l1.reflect.causation) >= MIN_LINE && len(l1.reflect.decider) >= MIN_LINE,
    b21: REC_IDS.every((id) => l1.tags[id] !== null) && len(l1.misread) >= MIN_SENTENCE,
    b22: l1.unc.length >= 2 && PATTERN_IDS.every((x) => !!l1.rows[x].risk && !!l1.rows[x].meaning && !!l1.rows[x].measure),
    b23: abComplete(l1.ab) && /\d/.test(l1.ab.rule),
    b24:
      l1.chosen.length === CHOOSE &&
      l1.chosen.every((id) => !!l1.exp[id] && !!l1.fea[id] && !!l1.eff[id] && len(l1.reasons[id] ?? "") >= MIN_LINE) &&
      l1.order.length === CHOOSE &&
      l1.chosen.every((id) => l1.order.includes(id)) &&
      len(l1.why) >= 60,
    b31: r2.principles.length === 3 && r2.principles.every((k) => len(r2.principleText[k] ?? "") >= MIN_LINE),
    b32: SOURCE_IDS.every((s) => !!r2.sources[s]),
    b33: r2.comps.length === COMP_CHOOSE && r2.comps.every((id) => CRIT_IDS.every((c) => !!r2.rate[`${id}.${c}`])) && !!r2.greatest && len(r2.greatestWhy) >= 40,
    b34: SIT_IDS.every((s) => !!r2.logic[s]?.action && !!r2.logic[s]?.owner),
    b35: nowIds(r2).length > 0 && len(r2.vision) >= MIN_SENTENCE && len(r2.giveUp) >= MIN_LINE,
    b36: !!r2.decision && len(r2.decisionWhy) >= MIN_LINE && len(r2.watch) >= MIN_LINE,
  };
}

const BLOCKS_OF: Record<RouteNo, TaskBlockId[]> = { 1: ["b11", "b12", "b13", "b14", "b21", "b22", "b23", "b24"], 2: ["b31", "b32", "b33", "b34", "b35", "b36"] };

/** Dossier progress for one route: its Core cards marked read + its Core task blocks completed (Optional ones sit outside the ring, #35). */
export function dossierProgress(p: Persisted, route: RouteNo): { done: number; total: number } {
  const block = route === 1 ? "A" : "B";
  const cards = MATERIALS.filter((m) => m.block === block && !m.optional);
  const read = cards.filter((m) => p.ui.sectionsRead[m.id]).length;
  const tb = taskBlocks(p);
  const coreBlocks = BLOCKS_OF[route].filter((b) => !isOptionalBlock(b));
  return { done: read + coreBlocks.filter((b) => tb[b]).length, total: cards.length + coreBlocks.length };
}
