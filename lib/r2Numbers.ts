import { ARCH_BY_ID, KPI_BY_ID, MODEL_START, R2_MONTHS } from "@/data/route2";
import type { ArchId, KpiId } from "@/data/route2";
import { ARCH_EXTRA, ASSUMPTION_KIT, KPI_AIM, UNIT_VALUE, pickupWhen } from "@/data/route2Extra";
import { num, tt } from "@/lib/lang";

/**
 * The numbers Route 2 shows (CLAUDE.md #44): the learner does not calculate them in the task, Materi B5 teaches how they are found, and the
 * trigger kit, the assumption kit, the tripwire hint, the model answers and the mentor's worked answers all read them from here, so they cannot
 * drift apart. Each is found from figures printed on the item card or in the "today" table by one plain method:
 *  - halfway: today's figure + half the gap to the aim (or the limit still accepted);
 *  - month: the start month + the weeks the item needs to be in use, in months (rounded up), never later than the plan's last month;
 *  - cost of waiting: the item's cost ÷ what one customer kept is worth a year, rounded up.
 */
export const halfway = (today: number, aim: number) => Math.round((today + (aim - today) / 2) * 10) / 10;
const fmt = (n: number) => num(n, { maximumFractionDigits: 1 });

/** The month an item that starts in `start` is in use, and so the first month its figure can be read. */
export const monthOf = (id: ArchId, start: number) => Math.min(R2_MONTHS, start + Math.ceil(ARCH_BY_ID[id].weeks / 4));
export const modelStart = (id: ArchId) => MODEL_START[id] ?? 1;

export const triggerNumber = (id: ArchId) => halfway(ARCH_EXTRA[id].today, ARCH_EXTRA[id].aim);
export const withUnit = (id: ArchId, n: number) => `${fmt(n)}${ARCH_EXTRA[id].unit}`;
/** "is below 60%" / "is above 0.5%" (German: "unter 60 % liegt" / "über 0,5 % liegt"). */
export const worse = (id: ArchId, n: number) => {
  const x = ARCH_EXTRA[id];
  const v = withUnit(id, n);
  return x.better === "up" ? tt(`is below ${v}`, `unter ${v} liegt`) : tt(`is above ${v}`, `über ${v} liegt`);
};
export const cap1 = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const lc = (s: string) => tt(s.charAt(0).toLowerCase() + s.slice(1), s);

/** The cost-of-waiting count of an item that is left out: how many customers must leave before waiting has cost as much as the item. */
export const paybackCount = (id: ArchId) => Math.ceil(ARCH_BY_ID[id].cost / UNIT_VALUE.value);

/** The tripwire threshold for a behaviour KPI: halfway between today's baseline and its printed aim. */
export const tripNumber = (k: KpiId) => {
  const aim = KPI_AIM[k];
  return aim === undefined ? null : halfway(KPI_BY_ID[k].baseline, aim);
};

export const triggerSentence = (id: ArchId, start: number = modelStart(id), action = 0) => {
  const x = ARCH_EXTRA[id];
  const n = triggerNumber(id);
  const m = monthOf(id, start);
  return tt(`If ${x.metric} ${worse(id, n)} by month ${m}, then ${x.actions[action].text}.`, `Wenn ${x.metric} bis Monat ${m} ${worse(id, n)}, ${x.actions[action].text}.`);
};

export const pickupAction = (id: ArchId) => ARCH_EXTRA[id].pickupAction ?? tt(`we fund ${ARCH_BY_ID[id].name} from the next budget round`, `finanzieren wir „${ARCH_BY_ID[id].name}“ aus der nächsten Budgetrunde`);
export const pickupSentence = (id: ArchId) => {
  const when = pickupWhen(paybackCount(id), R2_MONTHS, ARCH_EXTRA[id].reason);
  return tt(`${when}, then ${pickupAction(id)}.`, `${when}, ${pickupAction(id)}.`);
};

/** The sign of one model assumption: what is watched, the number and the month, all found by the methods above. */
export function assumptionSign(i: number) {
  const k = ASSUMPTION_KIT[i];
  const month = monthOf(k.item, modelStart(k.item));
  let subject: string;
  let pred: string;
  let n: number;
  let steps: string;
  if (k.kind === "kpi") {
    const kid = k.ref as KpiId;
    n = tripNumber(kid)!;
    const unit = KPI_BY_ID[kid].unit;
    const v = `${fmt(n)}${unit === "%" ? tt("%", " %") : unit === "€" ? tt("", " €") : ` ${unit}`}`;
    subject = tt(`the ${lc(KPI_BY_ID[kid].label)}`, `der Wert „${KPI_BY_ID[kid].label}“`);
    pred = tt(`is below ${v}`, `unter ${v} liegt`);
    steps = halfSteps(KPI_BY_ID[kid].baseline, KPI_AIM[kid]!, unit === "%" ? "%" : "");
  } else {
    const id = k.ref as ArchId;
    n = triggerNumber(id);
    subject = ARCH_EXTRA[id].metric;
    pred = worse(id, n);
    steps = halfSteps(ARCH_EXTRA[id].today, ARCH_EXTRA[id].aim, "");
  }
  return { month, n, subject, pred, steps, text: tt(`${subject} ${pred} by month ${month}`, `${subject} bis Monat ${month} ${pred}`) };
}
const halfSteps = (today: number, aim: number, suffix: string) => `${fmt(today)}${suffix} + (${fmt(aim)}${suffix} − ${fmt(today)}${suffix}) ÷ 2 = ${fmt(halfway(today, aim))}${suffix}`;

export const assumptionSentence = (i: number) => {
  const k = ASSUMPTION_KIT[i];
  const s = assumptionSign(i);
  return tt(`I assume ${k.text}. I am wrong if ${s.text}.`, `Ich nehme an, ${k.text}. Das ist falsch, wenn ${s.text}.`);
};

