import { FORECAST, PILOT } from "@/data/forecast";
import type { FigureId } from "@/data/forecast";
import { BUDGET, EVIDENCE_LABEL, MEASURE_BY_ID, MODEL_COST, MODEL_MEASURES, PROBLEM_LABEL, explainBucket, modelScore } from "@/data/measures";
import type { MeasureId } from "@/data/measures";
import { KEY_L1, KEY_R2 } from "@/data/mentorKey";
import { ARCH_BY_ID, COMP_BY_ID, MODEL_ARCH, MODEL_GREATEST, MODEL_TRIGGER, OWNERS, OWNER_ACCEPT, PRINCIPLES, R2_BUDGET } from "@/data/route2";
import type { ArchId, PrincipleId } from "@/data/route2";
import { euro } from "@/lib/lang";

/**
 * Mentor-only worked answers for every task question the answer keys (lib/answerKey.ts) do not already cover: the numeric fields,
 * with every step of the calculation written out with its numbers, and the free-text answers, with the model text and what a good
 * answer must contain. Shown only after the mentor bar is unlocked, never exported. Numbers are computed from the same constants as
 * the tables, the calculators and the answer checks, so they cannot drift from the model answers. Mentor tools stay English
 * (CLAUDE.md #32); the model answers quoted follow the site's language, because the fill enters them in that language.
 */
export type WorkedStep = { label: string; calc: string; result: string };
export type MentorGuide = { title: string; answer: string; steps?: WorkedStep[]; why?: string; lookFor?: string[]; pitfalls?: string[] };

const n = (v: number) => (Math.round(v * 100) / 100).toLocaleString("en-US");
const n3 = (v: number) => (Math.round(v * 1000) / 1000).toLocaleString("en-US");
const L1 = () => KEY_L1();
const R2 = () => KEY_R2();

/* ------------------------------------------------------------------ Route 1 */

export function extraInsightGuide(): MentorGuide {
  return {
    title: "1.1 · A real-time opportunity of your own",
    answer: L1().extraInsight ?? "",
    why: "An opportunity names a moment in the customer contact, what happens there today (usually a wait), and what a real-time reaction would change.",
    lookFor: ["A concrete moment (a page, a request, an outage, a question on social media).", "What happens today: a wait, a standard answer, silence.", "What a real-time reaction changes for the customer (“so …”)."],
    pitfalls: ["A technology with no moment (“use a chatbot”): ask where, and for whom.", "Speed for its own sake: ask what the customer gains."],
  };
}

export function figureGuide(id: FigureId): MentorGuide {
  const v = PILOT.variant;
  const c = PILOT.control;
  if (id === "F1")
    return {
      title: "1.2 · F1 Closing rate, answered within one hour",
      answer: n(FORECAST.f1),
      steps: [
        { label: "Closings ÷ requests", calc: `${v.orders} ÷ ${v.sent}`, result: n(v.orders / v.sent) },
        { label: "× 100", calc: `${n(v.orders / v.sent)} × 100`, result: `${n(FORECAST.f1)}%` },
      ],
      why: "Both numbers come from the fast rows: of 300 requests answered within one hour, 72 closed.",
      pitfalls: [`Share left as a fraction (0.24 instead of 24): ${n(v.orders / v.sent)}.`, `Slow rows used: ${n(FORECAST.controlRate)}.`, `All closings over all requests: ${n(((v.orders + c.orders) / (v.sent + c.sent)) * 100)}.`],
    };
  if (id === "F2")
    return {
      title: "1.2 · F2 Lift",
      answer: n(FORECAST.f2),
      steps: [
        { label: "Closing rate of slow answers", calc: `${c.orders} ÷ ${c.sent} × 100`, result: `${n(FORECAST.controlRate)}%` },
        { label: "Lift = F1 ÷ that rate", calc: `${n(FORECAST.f1)} ÷ ${n(FORECAST.controlRate)}`, result: n(FORECAST.f2) },
      ],
      why: "Requests answered within an hour closed three times as often as those answered after a day.",
      pitfalls: [`Subtracted instead of divided (24 − 8): ${n(FORECAST.f1 - FORECAST.controlRate)}.`, `Divided the closings (72 ÷ 72): 1 — the groups are not the same size, so the counts must become rates first.`, `Divided the requests (900 ÷ 300): 3 by coincidence; the method is still wrong.`],
    };
  const diff = (FORECAST.f1 - FORECAST.controlRate) / 100;
  return {
    title: "1.2 · F3 Extra revenue a year",
    answer: n(FORECAST.f3),
    steps: [
      { label: "Difference between the two rates, as a share of one", calc: `(${n(FORECAST.f1)} − ${n(FORECAST.controlRate)}) ÷ 100`, result: n3(diff) },
      { label: "Extra deals a year", calc: `${n(PILOT.yearly)} × ${n3(diff)}`, result: n(PILOT.yearly * diff) },
      { label: "× average deal value", calc: `${n(PILOT.yearly * diff)} × ${n(PILOT.order)}`, result: euro(FORECAST.f3) },
    ],
    why: "Only the deals fast answers add on top of slow answers are extra: 256 more deals a year at €1,500 each.",
    pitfalls: [`All deals at the fast rate counted as extra (1,600 × 0.24 × 1,500): ${n(PILOT.yearly * 0.24 * PILOT.order)}.`, `Difference not turned into a share (1,600 × 16 × 1,500): ${n(PILOT.yearly * 16 * PILOT.order)}.`, `Last quarter's 300 fast requests used instead of a year's 1,600: ${n(300 * diff * PILOT.order)}.`],
  };
}

export function meaningGuide(): MentorGuide {
  return {
    title: "1.2 · What speed means",
    answer: L1().meaning ?? "",
    lookFor: ["At least one of the learner's own figures (24%, 3 times, €384,000, or 8%).", "What to change first: answering the quote form and the pricing page fast.", "Said as an estimate: sales may have answered the eager customers first."],
    pitfalls: ["A sentence with no figure: the app asks for one.", "“Speed makes €384,000”: the figures are not a fair test yet."],
  };
}

export function insightGuide(i: number): MentorGuide {
  const a = (L1().insights ?? [])[i];
  return {
    title: `1.3 · Improvement ${i + 1}`,
    answer: a ? `${a.basis ?? ""} · ${a.text}` : "",
    why: "Three concrete improvements on three different levers, each saying what the visitor gets. The app checks only that each names a lever, is long enough and says what follows.",
    lookFor: ["A concrete change on a named page or moment.", "The lever it pulls (respond, personalise, learn).", "What the visitor gets (“so …”)."],
    pitfalls: ["A goal instead of a change (“be faster”): ask what exactly changes, where.", "Two improvements on the same lever."],
  };
}

export function reflectGuide(k: "interpret" | "causation" | "decider"): MentorGuide {
  const r = L1().reflect;
  return {
    title: k === "interpret" ? "1.4 · Why speed is a success factor" : k === "causation" ? "1.4 · When personalisation is value" : "1.4 · What works first, and priorities",
    answer: r ? r[k] : "",
    lookFor:
      k === "interpret"
        ? ["A figure from 1.2 (three times as often).", "A concrete moment where customers wait today."]
        : k === "causation"
          ? ["An example that uses what the visitor gave (campaign, login).", "An example that shows we watched them, and why that feels intrusive."]
          : ["What works this month (the chat on decision pages).", "What takes longer but lasts (personalisation, the feedback loop).", "An order, with testing before scaling."],
  };
}

export function misreadGuide(): MentorGuide {
  return {
    title: "2.2 · Your three KPIs",
    answer: L1().misread ?? "",
    lookFor: ["At least one outcome KPI (closing rate, revenue from online leads, renewals).", "At least one driver KPI (first response time, interaction on the pricing page).", "For each: where the number comes from and a target; a guardrail as the third is a strong answer."],
    pitfalls: ["Visitors, posts or pop-ups shown as a KPI: vanity metrics, they count reach or LiveConnect's activity.", "Three outcomes and no driver: the team has nothing it can move this month."],
  };
}

export function abGuide(): MentorGuide {
  const k = L1().ab;
  return {
    title: "2.3 · Hypothesis and decision rule",
    answer: k ? `${k.hyp} · ${k.rule}` : "",
    lookFor: ["Hypothesis: one change, the KPI expected to move, and a reason (“because …”).", "Decision rule written before the test: a threshold to roll out, a band to keep testing, a point to stop.", "A guardrail in the rule (“not helpful” ratings, pop-up complaints)."],
    pitfalls: ["“The chat will help”: no KPI, no reason.", "A rule without numbers, or one decided after looking at the result."],
  };
}

export function scoreGuide(id: MeasureId): MentorGuide {
  const m = MEASURE_BY_ID[id];
  const e = explainBucket(m.evidence);
  return {
    title: `2.4 · ${m.name}`,
    answer: `${m.model.effect} × ${e} × ${m.model.feasibility} = ${modelScore(id)}`,
    steps: [
      { label: "Speed from the weeks until it works (A7)", calc: `${m.weeks} weeks → within 4: 3 · 5 to 10: 2 · more than 10: 1`, result: String(e) },
      { label: "Score = Effect × Speed × Scalability", calc: `${m.model.effect} × ${e} × ${m.model.feasibility}`, result: String(modelScore(id)) },
    ],
    why: `${m.model.note} Answers: ${m.targets.length ? m.targets.map((t) => PROBLEM_LABEL[t]).join(", ") : "none of the three problems"}.`,
    pitfalls:
      id === "relaunch"
        ? ["Speed 2 or 3 “because it fixes everything”: 16 weeks is more than 10: 1. It has almost no time to work in four months."]
        : id === "callback"
          ? ["Scalability 3: every call takes a person's time, so it grows only with people: 1."]
          : id === "popup"
            ? ["Answering “low interaction”: a discount pop-up keeps some visitors, it does not start a conversation."]
            : undefined,
  };
}

export function whyGuide(): MentorGuide {
  return {
    title: "2.4 · Why the first priority goes first",
    answer: L1().why ?? "",
    steps: [
      { label: "Model plan cost", calc: MODEL_MEASURES.map((id) => n(MEASURE_BY_ID[id].cost)).join(" + "), result: euro(MODEL_COST) },
      { label: "Left of the budget", calc: `${n(BUDGET)} − ${n(MODEL_COST)}`, result: euro(BUDGET - MODEL_COST) },
    ],
    lookFor: ["The order and what decides it (the score, or the extra revenue from 1.2).", "The cost against €170,000.", "What was left out, said as a decision (too slow, or no problem answered)."],
  };
}

/* ------------------------------------------------------------------ Route 2 */

export function principleTextGuide(c: PrincipleId): MentorGuide {
  return {
    title: `3.1 · ${PRINCIPLES[c].name}`,
    answer: (R2().principleText ?? {})[c] ?? PRINCIPLES[c].means,
    lookFor: ["What changes for LiveConnect's teams or customers.", "Which problem of the brief it answers (interaction not coordinated, responses too slow, measures not measurable)."],
    pitfalls: c === "hoard" || c === "blackbox" ? ["This principle is one the key rejects; if the learner kept it, ask what happens with an upset customer, or how long waiting for complete data takes."] : undefined,
  };
}

export function greatestGuide(): MentorGuide {
  return {
    title: "3.3 · The KPI with the greatest leverage",
    answer: `${COMP_BY_ID[MODEL_GREATEST].name} · ${R2().greatestWhy ?? ""}`,
    lookFor: ["One of the learner's three KPIs.", "The tests that decide it (early and linked to value together).", "The problem of the brief it answers (responses too slow)."],
    pitfalls: ["Website visitors as greatest “because they are live and complete”: they are not linked to value."],
  };
}

export function triggerGuide(id: ArchId): MentorGuide {
  const model = MODEL_TRIGGER[id as keyof typeof MODEL_TRIGGER];
  return {
    title: `3.5 · ${ARCH_BY_ID[id].name}`,
    answer: model ?? "A metric, a number, a date and an action for this item.",
    why: `Owner that defends: ${OWNER_ACCEPT[id].map((o) => OWNERS[o].name).join(" or ")}.`,
    lookFor: ["A metric about the item's effect.", "A number and a month.", "An action the owner can take alone."],
  };
}

export function postponedGuide(): MentorGuide {
  const cost = MODEL_ARCH.reduce((s, id) => s + ARCH_BY_ID[id].cost, 0);
  return {
    title: "3.5 · What is left out, and the pickup point",
    answer: `${R2().postponed} · ${R2().pickup}`,
    steps: [
      { label: "Model funded items", calc: MODEL_ARCH.map((id) => n(ARCH_BY_ID[id].cost)).join(" + "), result: euro(cost) },
      { label: "Left", calc: `${n(R2_BUDGET)} − ${n(cost)}`, result: euro(R2_BUDGET - cost) },
      { label: "With the AI platform added", calc: `${n(cost)} + ${n(ARCH_BY_ID.suite.cost)}`, result: euro(cost + ARCH_BY_ID.suite.cost) },
    ],
    lookFor: ["The item named, with its cost.", "Why this one (budget, too slow, a black box).", "A pickup point with a number and a date."],
  };
}

export function assumptionGuide(i: number): MentorGuide {
  return {
    title: `3.6 · Assumption ${i + 1}`,
    answer: (R2().assumptions ?? [])[i] ?? "",
    lookFor: ["What is assumed about the data, the customers or the teams.", "The sign that would show it is wrong, with a number or a date."],
  };
}

export function challengeGuide(): MentorGuide {
  return {
    title: "3.6 · The board's challenge",
    answer: R2().challenge ?? "",
    why: "Speed is solved (4 hours to 2 minutes); what broke is quality: 20% “not helpful” is the chat's guardrail. Two months and 6.0% to 6.3% are too little to judge closings. Fix the answers; do not switch off the speed or buy a platform nobody can measure.",
    lookFor: ["What is checked first (which chats are rated not helpful; whether 6.0 to 6.3% rests on enough requests).", "What is kept (the chat, the response standards, the tripwire date).", "One change: rewrite the worst answers and hand those questions to a person at once."],
    pitfalls: ["Switching the chatbot off: the wait comes back, which is the problem the case started with.", "Buying the platform: fourteen weeks, a black box, and it cannot be measured."],
  };
}
