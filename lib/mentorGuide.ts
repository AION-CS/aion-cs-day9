import { BUDGET, EVIDENCE_LABEL, MEASURE_BY_ID, MODEL_COST, MODEL_MEASURES, PROBLEM_LABEL, explainBucket, modelScore } from "@/data/measures";
import type { MeasureId } from "@/data/measures";
import { KEY_L1, KEY_R2 } from "@/data/mentorKey";
import { ARCH_BY_ID, ARCH_IDS, COMP_BY_ID, MODEL_GREATEST, PRINCIPLES, R2_BUDGET, R2_MONTHS } from "@/data/route2";
import type { PrincipleId } from "@/data/route2";
import { MODEL_TIER, PANEL, READY_BAR } from "@/data/route2Panel";
import type { Tier } from "@/data/route2Panel";
import { euro, tt } from "@/lib/lang";
import { inUseOf, monthsOf, planOf, rangeOf } from "@/lib/r2Panel";

/**
 * Mentor-only worked answers for every task question the answer keys (lib/answerKey.ts) do not already cover: the numeric fields,
 * with every step of the calculation written out with its numbers, and the free-text answers, with the model text and what a good
 * answer must contain. Shown only after the mentor bar is unlocked, never exported. Numbers are computed from the same constants as
 * the tables, the calculators and the answer checks, so they cannot drift from the model answers. Mentor tools stay English
 * (CLAUDE.md #32); the model answers quoted follow the site's language, because the fill enters them in that language.
 */
export type WorkedStep = { label: string; calc: string; result: string };
export type MentorGuide = { title: string; answer: string; example?: string; steps?: WorkedStep[]; why?: string; lookFor?: string[]; pitfalls?: string[] };

const n = (v: number) => (Math.round(v * 100) / 100).toLocaleString("en-US");
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

export function meaningGuide(): MentorGuide {
  return {
    title: "1.2 · What speed means",
    answer: L1().meaning ?? "",
    lookFor: ["At least one printed figure (8%, 24%, 3 times, or the 72 closed deals in each group).", "What to change first: answering the quote form and the pricing page fast, then testing it fairly.", "Said as an estimate: sales may have answered the eager customers first."],
    pitfalls: ["A sentence with no figure: the app asks for one.", "“Speed makes the difference”: the comparison is not a fair test yet, because sales chose which requests to answer fast."],
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
    title: "2.1 · Your three KPIs",
    answer: L1().misread ?? "",
    example: tt("Company A (an online software shop) steers its chat by three KPIs. Share of chats that end in a quote request, from the chat tool, aim: up. It is the result the chat is paid for, so it is the outcome. Median first response time, from the chat log, aim: down. Visitors wait less before they decide and the team can move it this month, so it is the driver. Chats rated “not helpful”, from the chat rating, aim: stay under a limit. If it rises we stop, so it is the guardrail. Choose yours from LiveConnect's twelve metrics.", "Unternehmen A (ein Online-Softwarehaus) steuert seinen Chat mit drei KPIs. Anteil der Chats, die in einer Angebotsanfrage enden, aus dem Chat-Tool, Ziel: hoch. Es ist das Ergebnis, für das der Chat bezahlt wird, also der Outcome. Mediane erste Antwortzeit, aus dem Chat-Protokoll, Ziel: runter. Besucher warten weniger, bevor sie entscheiden, und das Team kann es in diesem Monat bewegen, also der Treiber. Als „nicht hilfreich“ bewertete Chats, aus der Chat-Bewertung, Ziel: unter einer Grenze bleiben. Steigt er, stoppen wir, also die Guardrail. Wählen Sie Ihre aus den zwölf Kennzahlen von LiveConnect."),
    lookFor: ["At least one outcome KPI (closing rate, revenue from online leads, renewals).", "At least one driver KPI (first response time, interaction on the pricing page).", "For each: where the number comes from and a target; a guardrail as the third is a strong answer."],
    pitfalls: ["Visitors, posts or pop-ups shown as a KPI: vanity metrics, they count reach or LiveConnect's activity.", "Three outcomes and no driver: the team has nothing it can move this month."],
  };
}

export function abGuide(): MentorGuide {
  const k = L1().ab;
  return {
    title: "2.3 · Hypothesis and decision rule",
    answer: k ? `${k.hyp} · ${k.rule}` : "",
    example: tt("Company A tests a checklist e-mail. Hypothesis: if we send a one-page checklist the same hour a visitor downloads the white paper instead of the standard thank-you text, then the share who book a call rises, because the visitor still has the question in mind. Rule, written before the start: roll out if the share is at least 8% above the control group with 80 bookings per group and unsubscribes stay under 2%; keep testing between 3% and 8%; stop below 3%. Write yours for LiveConnect's test card.", "Unternehmen A testet eine Checklisten-E-Mail. Hypothese: Wenn wir in derselben Stunde, in der ein Besucher das Whitepaper herunterlädt, eine einseitige Checkliste statt des üblichen Dankestextes senden, dann steigt der Anteil, der ein Gespräch bucht, weil der Besucher die Frage noch im Kopf hat. Regel, vor dem Start geschrieben: ausrollen, wenn der Anteil bei 80 Buchungen pro Gruppe mindestens 8 % über der Kontrollgruppe liegt und die Abmeldungen unter 2 % bleiben; weiter testen zwischen 3 % und 8 %; stoppen unter 3 %. Schreiben Sie Ihre für die Testkarte von LiveConnect."),
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
      { label: "Price from its parts (printed on the card)", calc: m.costParts.map((c) => n(c.amount)).join(" + "), result: euro(m.cost) },
      { label: "Speed from the weeks until it works (A7)", calc: `${m.weeks} weeks → within 4: 3 · 5 to 10: 2 · more than 10: 1`, result: String(e) },
      { label: "Score = Effect × Speed × Scalability", calc: `${m.model.effect} × ${e} × ${m.model.feasibility}`, result: String(modelScore(id)) },
    ],
    why: `${m.model.note} Answers: ${m.targets.length ? m.targets.map((t) => PROBLEM_LABEL[t]).join(", ") : "none of the three problems"}. A different, well-reasoned effect or scalability score is acceptable: only the score that follows a printed rule is checked.`,
    pitfalls:
      id === "relaunch"
        ? ["Speed 2 or 3 “because it fixes everything”: 16 weeks is more than 10: 1. It has no time to work in four months, and the picture shows no bar of working time.", `Adding it to the chat and the dashboard: ${euro(m.cost + MEASURE_BY_ID.chat.cost + MEASURE_BY_ID.kpi.cost)}, over the ${euro(BUDGET)} budget.`]
        : id === "callback"
          ? ["Scalability 3: every call takes a person's time, so it grows only with people: 1."]
          : id === "popup"
            ? ["Scoring effect 2 or 3 because it “catches leavers”: it pays everyone, also those who would order anyway, and starts no conversation; the picture leaves every problem open."]
            : undefined,
  };
}

/** The reason a learner gives for a measure's two judged scores (CLAUDE.md #45). The mentor's answer is the measure's own model note. */
export function reasonGuide(id: MeasureId): MentorGuide {
  const m = MEASURE_BY_ID[id];
  return {
    title: `2.4 · Why ${m.name} gets its effect and scalability scores`,
    answer: `Effect ${m.model.effect}, scalability ${m.model.feasibility}: ${m.model.note}`,
    example: tt("Company A's “reply within one hour on LinkedIn”: effect 2, because prospects who get an answer the same day stay in the conversation, but it only reaches people who write; scalability 1, because it needs two people on call and stops when they are away. Give your own reason for each score, with a fact printed on the card.", "Die „Antwort innerhalb einer Stunde auf LinkedIn“ von Unternehmen A: Wirkung 2, weil Interessenten, die am selben Tag eine Antwort bekommen, im Gespräch bleiben, aber es erreicht nur Leute, die schreiben; Skalierbarkeit 1, weil es zwei Personen in Bereitschaft braucht und aufhört, wenn sie nicht da sind. Geben Sie für jeden Wert Ihren eigenen Grund an, mit einer auf der Karte gedruckten Tatsache."),
    why: "Effect and scalability are judgements; a different score with a clear reason is as good as the model. The reason should name what changes for the customer or visitor (effect) and whether the measure reaches everyone within the time (scalability).",
    lookFor: ["Effect: what the customer or visitor sees or does differently because of the measure.", "Scalability: whether it works for everyone without more people, and how long it takes (the weeks printed on the card).", "A fact from the card, not only “it is good”."],
  };
}

export function whyGuide(): MentorGuide {
  return {
    title: "2.4 · Why the first priority goes first",
    answer: L1().why ?? "",
    example: tt("Company A puts the fast-reply routine first: it scores 18 and it answers the problem that visitors leave while they wait. The weekly test routine comes second and starts alongside it, so the reply routine is measured from the first week. Together they cost €45,000 of the €80,000. The animated greeter stays out: it scores 4 and nothing shows that a greeting keeps visitors. Make the same three statements about your own measures.", "Unternehmen A setzt die Routine für schnelle Antworten an die erste Stelle: Sie erzielt 18 und beantwortet das Problem, dass Besucher gehen, während sie warten. Die wöchentliche Test-Routine kommt zweite und startet gleichzeitig, damit die Antwort-Routine ab der ersten Woche gemessen wird. Zusammen kosten sie 45.000 € von 80.000 €. Der animierte Begrüßer bleibt draußen: Er erzielt 4, und nichts zeigt, dass eine Begrüßung Besucher hält. Machen Sie dieselben drei Aussagen über Ihre eigenen Maßnahmen."),
    steps: [
      { label: "Model plan cost", calc: MODEL_MEASURES.map((id) => n(MEASURE_BY_ID[id].cost)).join(" + "), result: euro(MODEL_COST) },
      { label: "Left of the budget", calc: `${n(BUDGET)} − ${n(MODEL_COST)}`, result: euro(BUDGET - MODEL_COST) },
    ],
    lookFor: ["The order and what decides it (the score, or the problem of the brief it answers).", "The cost against €170,000.", "What was left out, said as a decision (too slow, or no problem answered)."],
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
    example: tt("Company A picks “share of chats answered within two minutes” as its greatest-leverage KPI: it is linked to closings and counted live for every chat by the systems, so every change can be judged within a week, and it answers the problem that answers come too slowly. Name your own KPI, the tests it passes best and the problem of the brief it answers.", "Unternehmen A wählt „Anteil der Chats, die innerhalb von zwei Minuten beantwortet werden“ als KPI mit der größten Hebelwirkung: Er ist mit den Abschlüssen verbunden und wird live für jeden Chat von den Systemen gezählt, sodass sich jede Änderung innerhalb einer Woche beurteilen lässt, und er beantwortet das Problem, dass Antworten zu langsam kommen. Nennen Sie Ihren eigenen KPI, die Tests, die er am besten besteht, und das Problem des Auftrags, das er beantwortet."),
    lookFor: ["One of the learner's three KPIs.", "The tests that decide it (early and linked to value together).", "The problem of the brief it answers (responses too slow)."],
    pitfalls: ["Website visitors as greatest “because they are live and complete”: they are not linked to value."],
  };
}

const ids = (m: Record<string, Tier>, f: (t: Tier) => boolean) => ARCH_IDS.filter((id) => f(m[id] ?? "not"));

export function architectureGuide(): MentorGuide {
  const model = MODEL_TIER;
  const funded = ids(model, (t) => t !== "not");
  const mr2 = { tier: model };
  const plan = planOf(mr2, 0);
  const weak = planOf(mr2, 1);
  const r = rangeOf(mr2);
  const cost = funded.reduce((x, id) => x + ARCH_BY_ID[id].cost, 0);
  const meas = (p: typeof plan) => funded.filter((id) => PANEL[id].measured && p.items[id].measOk && p.items[id].dataOk && !p.items[id].late && !PANEL[id].blackBox);
  const sum = (list: (keyof typeof ARCH_BY_ID)[]) => list.reduce((x, id) => x + ARCH_BY_ID[id].cost, 0);
  const measuredIds = meas(plan);
  const measuredWeakIds = meas(weak);
  const riskWeak = funded.filter((id) => PANEL[id].blackBox || !weak.items[id].dataOk || weak.items[id].late);
  const plus = (list: string[]) => list.join(" + ");
  const sp = planOf({ tier: { ...model, suite: "now" as const } }, 0);
  const rl = planOf({ tier: { ...model, relaunch: "now" as const } }, 0);
  const pn = planOf({ tier: { ...model, personal: "now" as const } }, 0);
  return {
    title: "Step A · The architecture and what the panel shows for it",
    answer: `Now: ${ids(model, (t) => t === "now").map((id) => PANEL[id].short).join(", ")}. After data is ready: ${ids(model, (t) => t === "later").map((id) => PANEL[id].short).join(", ")}. Not now: ${ids(model, (t) => t === "not").map((id) => PANEL[id].short).join(", ")}.`,
    steps: [
      { label: "Funded items (every Now and After data item)", calc: plus(funded.map((id) => n(ARCH_BY_ID[id].cost))), result: euro(cost) },
      { label: "Budget left", calc: `${n(R2_BUDGET)} − ${n(cost)}`, result: euro(R2_BUDGET - cost) },
      { label: `Month in use = start + weeks ÷ 4, rounded up (Now starts in month 1; After data starts when the tracking clean-up is in use, month ${1 + monthsOf("tracking")})`, calc: funded.map((id) => `${PANEL[id].short}: ${plan.items[id].start} + ${ARCH_BY_ID[id].weeks} ÷ 4 → ${inUseOf(mr2, id)}`).join(" · "), result: `all by month ${Math.max(...funded.map((id) => inUseOf(mr2, id)!))} of ${R2_MONTHS}` },
      { label: "Measurable, brief's data: money on measured items with data ready and in use in time ÷ funded money", calc: `(${plus(measuredIds.map((id) => n(ARCH_BY_ID[id].cost)))}) ÷ ${n(cost)} = ${n(sum(measuredIds))} ÷ ${n(cost)}`, result: `${r.meas[0]}%` },
      { label: `Measurable, data 15 points weaker (the chat drops to ${(PANEL.chat.data ?? 0) - 15}%)`, calc: `${n(sum(measuredWeakIds))} ÷ ${n(cost)}`, result: `${r.meas[1]}%` },
      { label: "Risk: money on a black box, on data below 80% or in use after the months ÷ funded money", calc: `0 ÷ ${n(cost)} (brief) · ${n(sum(riskWeak))} ÷ ${n(cost)} (weaker)`, result: `${r.risk[0]}% · ${r.risk[1]}%` },
    ],
    why: `The model set holds all four tests with the brief's data (${plan.holding} of ${plan.applicable}) and opens the data test when the data is 15 points weaker (${weak.holding} of ${weak.applicable}). That open test is the reason Step B asks what the learner watches. The numbers on screen are computed from one data file, so this table equals the panel.`,
    lookFor: ["At least one item Now (the task asks for an architecture).", "The live view and KPI system are in place no later than any engine.", "Nothing the learner cannot explain or measure is funded without a reason, and nothing arrives after the four months without one."],
    pitfalls: [
      `Adding the all-in-one platform: ${euro(sp.bars.spent)} funded, ${euro(sp.bars.over)} over the budget, Risk ${sp.bars.risk}% (a black box, in use only in month ${sp.items.suite.inUse}), and ${sp.holding} of ${sp.applicable} tests hold.`,
      `Adding the relaunch: ${euro(rl.bars.spent)} funded, ${euro(rl.bars.over)} over the budget; it names no KPI and is in use only in month ${rl.items.relaunch.inUse}, so ${rl.holding} of ${rl.applicable} tests hold.`,
      `Setting personalisation to Now beside the model set: it starts in month 1 on data ${PANEL.personal.data}% tracked, below ${READY_BAR}%, so the data test opens (${pn.holding} of ${pn.applicable} hold); After data with the clean-up Now starts it in month ${1 + monthsOf("tracking")}.`,
      "Leaving the live view out: every engine loses its link to measurement, so the Measurable bar falls to nothing.",
    ],
  };
}

export function visionGuide(): MentorGuide {
  return {
    title: "Step A · The target vision",
    answer: R2().vision ?? "",
    example: tt(
      "Company A will answer every customer request within an agreed time, from one screen that sales and service read together, and steer by two KPIs. Every new tool has to move one of them before it grows. Write your own target vision for LiveConnect.",
      "Unternehmen A wird jede Kundenanfrage innerhalb einer vereinbarten Zeit beantworten, von einem Bildschirm aus, den Vertrieb und Service gemeinsam lesen, und nach zwei KPIs steuern. Jedes neue Werkzeug muss einen davon bewegen, bevor es wächst. Schreiben Sie Ihr eigenes Zielbild für LiveConnect.",
    ),
    why: "The plan asks for a target vision of a real-time retention system. It is the one place the learner says, in two sentences, what the whole architecture is for, before the items.",
    lookFor: ["What the system does for the company and its customers (speed and quality together).", "Steering by a few KPIs, not by single tools.", "Two sentences, in the learner's own words."],
  };
}

export function giveUpGuide(): MentorGuide {
  return {
    title: "Step A · What the plan gives, and what the learner gives up",
    answer: R2().giveUp ?? "",
    example: tt(
      "Company A's plan gives it one screen, a response standard for every central point and a chat that runs on data that is tracked well enough. It gives up a redesign of its site, which names no KPI and is in use only after the four months, and €10,000 stay unspent. If its data is worse than expected, the chat rests on data below 80%, so it is watched first. Write yours about your own plan: what it gives, what it leaves open, what you gave up.",
      "Der Plan von Unternehmen A gibt ihm einen Bildschirm, einen Antwortstandard für jeden zentralen Punkt und einen Chat, der auf gut genug erfassten Daten läuft. Es verzichtet auf eine Neugestaltung seiner Website, die keinen KPI nennt und erst nach den vier Monaten im Einsatz ist, und 10.000 € bleiben ungenutzt. Sind seine Daten schlechter als erwartet, beruht der Chat auf Daten unter 80 %, also wird er zuerst beobachtet. Schreiben Sie Ihre über Ihren eigenen Plan: was er gibt, was er offen lässt, worauf Sie verzichtet haben.",
    ),
    why: "Every plan gives something and costs something. Writing it first, before the system's reading is opened, is what makes the learner think about the trade-off instead of reading it off.",
    lookFor: ["One thing the plan gives (measured, ready, in budget, in time).", "One thing it costs or leaves open (an item not now, data below 80%, an item after the four months, budget unspent).", "A link to the two data scenarios if the learner saw them."],
  };
}

export function decisionWhyGuide(): MentorGuide {
  return {
    title: "Step B · Why this decision",
    answer: R2().decisionWhy ?? "",
    example: tt(
      "Company A decides now but builds in stages: the screen and the response standards start first, so every tool is measured from its first week, and the redesign waits because nobody could say what it changes for customers. Write your reason for your own decision.",
      "Unternehmen A entscheidet jetzt, baut aber in Stufen: Bildschirm und Antwortstandards starten zuerst, damit jedes Werkzeug ab seiner ersten Woche gemessen wird, und die Neugestaltung wartet, weil niemand sagen könnte, was sie für Kunden ändert. Schreiben Sie Ihre Begründung für Ihre eigene Entscheidung.",
    ),
    why: "A decision part has no single right answer (CLAUDE.md #38): what counts is a clear reason, and that it fits the learner's own Step A. If the decision and Step A disagree, the panel hints and the reason should explain it.",
    lookFor: ["Names the decision and one rule from Materi B5 it rests on.", "Fits the learner's own Step A, or says why it does not.", "Says how the time pressure and the incomplete data are handled (act where the data is good enough, measure from week one)."],
  };
}

export function watchGuide(): MentorGuide {
  const chatMonth = inUseOf({ tier: MODEL_TIER }, "chat") ?? 0;
  return {
    title: "Step B · What the learner watches, and when they would stop",
    answer: R2().watch ?? "",
    example: tt(
      "Company A watches the closing rate of its quote requests: today it is 5%, and if it is not clearly above that by month 3 on enough requests, it stops widening the chat and keeps the screen. It also watches the data behind the chat: if it stays below 80%, it pauses the chat. Write yours with the figure from your own plan.",
      "Unternehmen A beobachtet die Abschlussquote seiner Angebotsanfragen: Heute liegt sie bei 5 %, und liegt sie bis Monat 3 bei genug Anfragen nicht deutlich darüber, hört es auf, den Chat auszuweiten, und behält den Bildschirm. Es beobachtet auch die Daten hinter dem Chat: Bleiben sie unter 80 %, pausiert es den Chat. Schreiben Sie Ihre mit der Zahl aus Ihrem eigenen Plan.",
    ),
    why: `A figure about customers (the closing rate or the interaction rate on decision pages), not the company's own speed or output, a month in which it can first be read (the chat is in use from month ${chatMonth} in the model, so month ${chatMonth + 1}), and an action. The numbers are the ones printed in “the numbers today”: closing rate 6% today with an aim of 12%; the data bar is ${READY_BAR}%.`,
    lookFor: ["A customer figure, with today's value.", "A month by which it can be read.", "What the learner does if it falls short (stop, pause, change one thing)."],
    pitfalls: ["First response time or posts as the figure: that counts the company's own speed or output.", "No month: a sign nobody can act on."],
  };
}
