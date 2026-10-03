import { LINES } from "@/data/ladder";
import { CHURN_TRUTH, FORECAST, INSIGHT_MIN, PILOT, VALUABLE_TRUTH, hasSoWhat } from "@/data/forecast";
import { AB, AB_PARTS, MEASURE_TRUTH, MEANING_TRUTH, PATTERN_IDS, RECORDS, REC_BY_ID, REC_IDS, UNC_BY_ID, hasHypothesis, hasRuleNumber, riskOf } from "@/data/patterns";
import type { AbState, PatternId, Risk, UncId } from "@/data/patterns";
import { MEASURE_BY_ID, PROBLEM_IDS, explainBucket } from "@/data/measures";
import type { MeasureId, ProblemId } from "@/data/measures";
import {
  ARCH_BY_ID,
  ARCH_IDS,
  BASELINE_ITEM,
  COMP_CHOOSE,
  CRIT_IDS,
  KPI_BY_ID,
  OWNER_ACCEPT_LOGIC,
  PRINCIPLE_MUST,
  R2_BUDGET,
  SIT_BY_ID,
  SIT_IDS,
  SOURCES,
  actionOf,
  isEarly,
  maxRating,
  useOf,
} from "@/data/route2";
import type { ArchId, CompId } from "@/data/route2";
import { extractAmounts, parseAmount } from "@/lib/parseAmount";
import type { L1State, R2State, SortMap, TagMap } from "@/store/useStore";

/* ------------------------------------------------------------------ Block 1.1 */

export function sortHolds(sort: SortMap): { holds: number; placed: number } {
  let holds = 0;
  let placed = 0;
  for (const r of LINES) {
    const t = sort[r.id];
    if (!t) continue;
    placed++;
    if (t === r.truth) holds++;
  }
  return { holds, placed };
}

/* ------------------------------------------------------------------ Block 1.2 */

/**
 * Block 1.2 is read-only (CLAUDE.md #44): the app prints both rates and the lift, and the learner writes what they mean. The sentence
 * has to quote at least one printed figure: a rate, the lift (written as a multiple) or a count behind a rate. A floor, not a judge of
 * quality; English and German forms.
 */
export function citesForecastFigure(text: string): boolean {
  const nums = extractAmounts(text);
  if (nums.some((n) => [FORECAST.f1, FORECAST.controlRate].some((d) => Math.abs(n - d) < 0.05) || n === PILOT.control.orders || n === PILOT.variant.orders)) return true;
  const lift = String(FORECAST.f2).replace(".", "[.,]");
  return new RegExp(`\\b${lift}\\s*(times|x|×|-?fach|mal)|\\b${lift}-?(fold|fach)`, "i").test(text);
}
export { PILOT };

/* ------------------------------------------------------------------ Block 1.3 */

export function pickHolds(l1: L1State): { holds: number; total: number } {
  const holds = l1.valuable.filter((c) => VALUABLE_TRUTH.includes(c)).length + l1.churners.filter((c) => CHURN_TRUTH.includes(c)).length;
  return { holds, total: l1.valuable.length + l1.churners.length };
}
/** Insights that do not meet the floor: a data basis, a distinct basis, enough words, and a conclusion. */
export function insightFlags(l1: L1State): number[] {
  return l1.insights
    .map((a, i) => ({ a, i }))
    .filter(({ a, i }) => !a.basis || l1.insights.findIndex((b) => b.basis === a.basis) !== i || a.text.trim().length < INSIGHT_MIN || !hasSoWhat(a.text))
    .map(({ i }) => i);
}

/* ------------------------------------------------------------------ Block 2.1 / 2.2 */

export function tagHolds(tags: TagMap): { holds: number; placed: number } {
  let holds = 0;
  let placed = 0;
  for (const r of RECORDS) {
    const t = tags[r.id];
    if (!t) continue;
    placed++;
    if (t === r.truth) holds++;
  }
  return { holds, placed };
}

export type Tally = { count: Record<PatternId, number>; left: Record<PatternId, number>; tagged: number };
export function tallyOf(tags: TagMap): Tally {
  const count = { outcome: 0, driver: 0, guardrail: 0, vanity: 0 } as Record<PatternId, number>;
  const left = { outcome: 0, driver: 0, guardrail: 0, vanity: 0 } as Record<PatternId, number>;
  let tagged = 0;
  for (const id of REC_IDS) {
    const t = tags[id];
    if (!t) continue;
    tagged++;
    count[t]++;
    if (REC_BY_ID[id].outcome === "left") left[t]++;
  }
  return { count, left, tagged };
}
export const allTagged = (tags: TagMap) => REC_IDS.every((id) => !!tags[id]);
/** The link to value each kind should get from the learner's own tally (Materi A5). */
export const ownRisk = (p: PatternId, t: Tally): Risk | null => riskOf(t.left[p], t.count[p]);
export const uncHolds = (unc: UncId[]) => ({ holds: unc.filter((w) => UNC_BY_ID[w].real).length, chosen: unc.length });

/** Per row: the link follows the learner's own tally; the meaning and the use follow the kind of metric. */
export function rowChecks(l1: L1State): { holds: number; total: number; flags: string[] } {
  const t = tallyOf(l1.tags);
  let holds = 0;
  const flags: string[] = [];
  for (const p of PATTERN_IDS) {
    const r = l1.rows[p];
    const own = ownRisk(p, t);
    if (r.risk) {
      if (own === null || r.risk === own) holds++;
      else flags.push(`${p}.risk`);
    }
    if (r.meaning) {
      if (r.meaning === MEANING_TRUTH[p]) holds++;
      else flags.push(`${p}.meaning`);
    }
    if (r.measure) {
      if (r.measure === MEASURE_TRUTH[p]) holds++;
      else flags.push(`${p}.measure`);
    }
  }
  return { holds, total: PATTERN_IDS.length * 3, flags };
}

/* ------------------------------------------------------------------ Block 2.3 · the A/B test design */

/** Flags per part: a chosen option that is not the fair one, a hypothesis without "if … because", a rule without a number. */
export function abFlagsOf(ab: AbState): string[] {
  const out: string[] = [];
  for (const p of AB_PARTS) {
    const v = ab[p];
    if (v && !AB[p].options.find((o) => o.id === v)?.right) out.push(p);
  }
  if (ab.hyp.trim() && !hasHypothesis(ab.hyp)) out.push("hyp");
  if (ab.rule.trim() && !hasRuleNumber(ab.rule)) out.push("rule");
  return out;
}
export const abComplete = (ab: AbState) => AB_PARTS.every((p) => !!ab[p]) && ab.hyp.trim().length > 0 && ab.rule.trim().length > 0;

/* ------------------------------------------------------------------ Block 2.4 */


/** True when the problems named are a subset of the problems the measure really answers; "none" holds only for a measure that answers none. */
export function aimsHold(id: MeasureId, aims: ProblemId[]): boolean {
  const real = MEASURE_BY_ID[id].targets;
  if (aims.length === 0) return real.length === 0;
  return aims.every((a) => real.includes(a));
}
export const expHolds = (id: MeasureId, v: number) => v === explainBucket(MEASURE_BY_ID[id].evidence);
export const measureScore = (l1: L1State, id: MeasureId) => (l1.exp[id] || 0) * (l1.fea[id] || 0) * (l1.eff[id] || 0);
export const measureScored = (l1: L1State, id: MeasureId) => !!l1.exp[id] && !!l1.fea[id] && !!l1.eff[id];
export const totalCost = (ids: MeasureId[]) => ids.reduce((s, id) => s + MEASURE_BY_ID[id].cost, 0);
export function coverage(l1: L1State): { pattern: ProblemId; covered: boolean }[] {
  return PROBLEM_IDS.map((p) => ({ pattern: p, covered: l1.chosen.some((id) => MEASURE_BY_ID[id].targets.includes(p)) }));
}
export function orderInversions(l1: L1State): { high: MeasureId; low: MeasureId }[] {
  const out: { high: MeasureId; low: MeasureId }[] = [];
  const o = l1.order;
  for (let i = 0; i < o.length; i++) for (let j = i + 1; j < o.length; j++) if (measureScore(l1, o[i]) < measureScore(l1, o[j])) out.push({ high: o[j], low: o[i] });
  return out;
}

/* ------------------------------------------------------------------ Route 2 */

export const hasNumber = (t: string) => /\d/.test(t);
export const principlesHold = (r2: R2State) => ({ defs: r2.principles.includes(PRINCIPLE_MUST[0]), rules: r2.principles.includes(PRINCIPLE_MUST[1]) });

export function sourceHolds(r2: R2State): { holds: number; total: number } {
  const holds = SOURCES.filter((s) => r2.sources[s.id] && r2.sources[s.id] === useOf(s)).length;
  return { holds, total: SOURCES.length };
}

export function ratingFlags(r2: R2State): string[] {
  const out: string[] = [];
  for (const l of r2.comps) for (const c of CRIT_IDS) if ((r2.rate[`${l}.${c}`] || 0) > maxRating(l, c)) out.push(`${l}.${c}`);
  return out;
}
export const compTotal = (r2: R2State, id: CompId) => CRIT_IDS.reduce((s, c) => s + (r2.rate[`${id}.${c}`] || 0), 0);
export const earlyCount = (comps: CompId[]) => comps.filter(isEarly).length;
export { COMP_CHOOSE };

/** Decision logic: how many settings hold (action per rule, owner where the action needs one). */
export function logicHolds(r2: R2State): { holds: number; total: number } {
  let holds = 0;
  for (const s of SIT_IDS) {
    const r = r2.logic[s];
    if (!r) continue;
    if (r.action && r.action === actionOf(SIT_BY_ID[s])) holds++;
    if (r.owner && OWNER_ACCEPT_LOGIC[s].includes(r.owner)) holds++;
  }
  return { holds, total: SIT_IDS.length * 2 };
}

export const funded = (r2: R2State): ArchId[] => ARCH_IDS.filter((id) => r2.alloc[id]);
export const archCost = (r2: R2State) => funded(r2).reduce((s, id) => s + ARCH_BY_ID[id].cost, 0);
export const archOver = (r2: R2State) => Math.max(0, archCost(r2) - R2_BUDGET);
export const archLeft = (r2: R2State) => R2_BUDGET - archCost(r2);
export const blackBoxFunded = (r2: R2State): ArchId[] => funded(r2).filter((id) => ARCH_BY_ID[id].blackBox);
/** Three rules of Materi B5: the data foundation starts no later than the first other item; the budget holds; nothing funded is a black box. */
export function seqRules(r2: R2State): { baseline: boolean; budget: boolean; explainable: boolean; hasBaseline: boolean } {
  const f = funded(r2);
  const hasBaseline = f.includes(BASELINE_ITEM);
  const others = f.filter((id) => id !== BASELINE_ITEM);
  const base = r2.start[BASELINE_ITEM];
  const first = Math.min(...others.map((id) => r2.start[id] ?? 99));
  const baseline = hasBaseline && base != null && (others.length === 0 || base <= first);
  return { baseline, budget: archOver(r2) === 0 && f.length > 0, explainable: blackBoxFunded(r2).length === 0, hasBaseline };
}

export function tripFlagsOf(r2: R2State): string[] {
  const out: string[] = [];
  if (r2.tripKpi && !KPI_BY_ID[r2.tripKpi].behaviour) out.push("kpi");
  if (r2.tripKpi && r2.tripThreshold.trim()) {
    const v = parseAmount(r2.tripThreshold);
    const k = KPI_BY_ID[r2.tripKpi];
    if (v !== null && (k.better === "up" ? v <= k.baseline : v >= k.baseline)) out.push("threshold");
  }
  return out;
}
