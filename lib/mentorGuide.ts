import { BUDGET, EVIDENCE_LABEL, MEASURE_BY_ID, MODEL_COST, MODEL_MEASURES, PROBLEM_LABEL, explainBucket, modelScore } from "@/data/measures";
import type { MeasureId } from "@/data/measures";
import { KEY_L1, KEY_R2 } from "@/data/mentorKey";
import { ARCH_BY_ID, COMP_BY_ID, MODEL_ARCH, MODEL_GREATEST, OWNERS, OWNER_ACCEPT, PRINCIPLES, R2_BUDGET } from "@/data/route2";
import type { ArchId, PrincipleId } from "@/data/route2";
import { ARCH_EXTRA, ASSUMPTION_KIT, MODEL_PICKUP, UNIT_VALUE } from "@/data/route2Extra";
import { euro, tt } from "@/lib/lang";
import { assumptionSign, modelStart, monthOf, paybackCount, pickupSentence, triggerNumber, triggerSentence, withUnit } from "@/lib/r2Numbers";

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
      { label: "Speed from the weeks until it works (A7)", calc: `${m.weeks} weeks → within 4: 3 · 5 to 10: 2 · more than 10: 1`, result: String(e) },
      { label: "Score = Effect × Speed × Scalability", calc: `${m.model.effect} × ${e} × ${m.model.feasibility}`, result: String(modelScore(id)) },
    ],
    why: `${m.model.note} Answers: ${m.targets.length ? m.targets.map((t) => PROBLEM_LABEL[t]).join(", ") : "none of the three problems"}. A different, well-reasoned effect or scalability score is acceptable: only the score that follows a printed rule is checked.`,
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

export function triggerGuide(id: ArchId): MentorGuide {
  const x = ARCH_EXTRA[id];
  const start = modelStart(id);
  const weeks = ARCH_BY_ID[id].weeks;
  return {
    title: `3.5 · ${ARCH_BY_ID[id].name}`,
    answer: triggerSentence(id),
    example: tt("Company A's callback standard: If the share of callbacks within 30 minutes is below 55% by month 3, then the Head of Sales adds a back-up caller to the rota. Write yours with the figure, the number and the month from your own item's card.", "Der Rückruf-Standard von Unternehmen A: Wenn der Anteil der Rückrufe innerhalb von 30 Minuten bis Monat 3 unter 55 % liegt, ergänzt die Vertriebsleitung einen Vertretungs-Anrufer im Dienstplan. Schreiben Sie Ihren mit der Zahl, dem Wert und dem Monat von der Karte Ihres eigenen Punkts."),
    steps: [
      { label: `Number: halfway between today and the ${x.aimWord} printed on the card`, calc: `${n(x.today)} + (${n(x.aim)} − ${n(x.today)}) ÷ 2`, result: withUnit(id, triggerNumber(id)) },
      { label: "Month: the start month + the weeks until it is in use, in months, rounded up", calc: `${start} + ${weeks} ÷ 4 = ${start} + ${Math.ceil(weeks / 4)}`, result: String(monthOf(id, start)) },
    ],
    why: `Owner that defends: ${OWNER_ACCEPT[id].map((o) => OWNERS[o].name).join(" or ")}. The action is one the owner can take alone and it changes only this item. A different number or month is fine if the learner says why.`,
    lookFor: ["A metric about the item's own effect (the figure on its card), not about activity.", "A number worse than today's figure and a month; the model uses halfway to the aim.", "An action the owner can take alone."],
  };
}

export function postponedGuide(): MentorGuide {
  const cost = MODEL_ARCH.reduce((s, id) => s + ARCH_BY_ID[id].cost, 0);
  return {
    title: "3.5 · What is left out",
    answer: R2().postponed ?? "",
    example: tt("Company A leaves out the voice assistant (€45,000): the funded items cost €120,000 of the €140,000, the assistant would push the plan to €165,000, and its data is only 30% ready. Name your own item, what it costs and why this one goes.", "Unternehmen A lässt den Sprachassistenten (45.000 €) weg: Die finanzierten Punkte kosten 120.000 € von 140.000 €, der Assistent brächte den Plan auf 165.000 €, und seine Daten sind erst zu 30 % bereit. Nennen Sie Ihren eigenen Punkt, was er kostet und warum gerade dieser wegfällt."),
    steps: [
      { label: "Model funded items", calc: MODEL_ARCH.map((id) => n(ARCH_BY_ID[id].cost)).join(" + "), result: euro(cost) },
      { label: "Left", calc: `${n(R2_BUDGET)} − ${n(cost)}`, result: euro(R2_BUDGET - cost) },
      { label: "With the AI suite added", calc: `${n(cost)} + ${n(ARCH_BY_ID.suite.cost)}`, result: euro(cost + ARCH_BY_ID.suite.cost) },
    ],
    why: "Going over the budget is allowed in a decision part if the learner says why (CLAUDE.md #38); the budget is a hint, not a lock.",
    lookFor: ["The item named, with its cost.", "Why this one (the budget, a black box, data not ready).", "Said as a decision, not as an omission."],
  };
}

export function pickupGuide(): MentorGuide {
  const id = MODEL_PICKUP;
  const a = ARCH_BY_ID[id];
  return {
    title: `3.5 · The pickup point (${a.name})`,
    answer: pickupSentence(id),
    example: tt("Company A leaves out a redesign of its contact page (€36,000), and a closed quote request is worth €12,000, so 36,000 ÷ 12,000 = 3. If 3 or more quote requests are lost by month 4 because visitors could not find the form, then we redesign the page. Use your own item's cost and the value of a closed request.", "Unternehmen A lässt eine Neugestaltung seiner Kontaktseite (36.000 €) weg, und eine abgeschlossene Angebotsanfrage ist 12.000 € wert, also 36.000 ÷ 12.000 = 3. Gehen bis Monat 4 mindestens 3 Angebotsanfragen verloren, weil Besucher das Formular nicht fanden, gestalten wir die Seite neu. Nutzen Sie die Kosten Ihres eigenen Punkts und den Wert einer abgeschlossenen Anfrage."),
    steps: [
      { label: "Number: the cost of waiting = item cost ÷ what one customer kept is worth a year, rounded up", calc: `${n(a.cost)} ÷ ${n(UNIT_VALUE.value)} = ${n(a.cost / UNIT_VALUE.value)}`, result: String(paybackCount(id)) },
    ],
    why: "A pickup point turns “not now” into a plan: the count at which waiting has cost as much as the item, and the month by which you look again.",
    lookFor: ["A number of customers and a month.", "A reason that only counts leavers the item would have kept.", "An action: fund the item."],
  };
}

export function assumptionGuide(i: number): MentorGuide {
  const k = ASSUMPTION_KIT[i];
  const s = assumptionSign(i);
  return {
    title: `3.6 · Assumption ${i + 1}`,
    answer: (R2().assumptions ?? [])[i] ?? "",
    example: tt("Company A assumes its callback standard works for every request, not only for the pilot group. It is wrong if the closing rate is below 8% by month 3: today it is 6%, the aim is 10%, and halfway is 8%. Write yours about your own plan, with your own figures.", "Unternehmen A nimmt an, dass sein Rückruf-Standard für jede Anfrage wirkt, nicht nur für die Pilotgruppe. Das ist falsch, wenn die Abschlussquote bis Monat 3 unter 8 % liegt: Heute sind es 6 %, das Ziel ist 10 %, und die Hälfte des Weges ist 8 %. Schreiben Sie Ihre über Ihren eigenen Plan, mit Ihren eigenen Zahlen."),
    steps: [{ label: `Number: halfway between today and the aim`, calc: s.steps, result: n(s.n) }, { label: "Month: start + weeks in use, in months, rounded up", calc: `${ARCH_BY_ID[k.item].name}`, result: String(s.month) }],
    why: `Doubt: ${k.why} ${k.signWhy}`,
    lookFor: ["One thing the plan bets on, tied to what the learner funded.", "A sign the learner can watch themselves, with a number and a month; never a market figure."],
  };
}

export function challengeGuide(): MentorGuide {
  return {
    title: "3.6 · The board's challenge",
    answer: R2().challenge ?? "",
    example: tt("Month 2: Company A's chat answers within a minute against an aim of two, but only 5% more requests close, and 25% of chats are rated not helpful. I keep the chat and change one thing. I first check the 5% against a group without the chat, on enough requests to trust it, then I rewrite the worst answers and hand those questions to a person at once. Switching the chat off would bring back the wait, and a bigger platform would swap a measured tool for one nobody can measure. The tripwire I set at the start decides. Write your own answer to LiveConnect's numbers.", "Monat 2: Der Chat von Unternehmen A antwortet innerhalb einer Minute bei einem Ziel von zwei, aber nur 5 % mehr Anfragen werden abgeschlossen, und 25 % der Chats werden als nicht hilfreich bewertet. Ich behalte den Chat und ändere eine Sache. Zuerst vergleiche ich die 5 % mit einer Gruppe ohne Chat, bei genug Anfragen, um ihnen zu trauen, dann schreibe ich die schlechtesten Antworten neu und übergebe diese Fragen sofort an einen Menschen. Den Chat abzuschalten, brächte die Wartezeit zurück, und eine größere Plattform ersetzte ein gemessenes Werkzeug durch eines, das niemand messen kann. Der Tripwire, den ich am Anfang gesetzt habe, entscheidet. Schreiben Sie Ihre eigene Antwort auf die Zahlen von LiveConnect."),
    why: "Speed is solved (4 hours to 2 minutes); what broke is quality: 20% “not helpful” is the chat's guardrail. Two months and 6.0% to 6.3% are too little to judge closings. Fix the answers; do not switch off the speed or buy a platform nobody can measure.",
    lookFor: ["What is checked first (which chats are rated not helpful; whether 6.0 to 6.3% rests on enough requests).", "What is kept (the chat, the response standards, the tripwire date).", "One change: rewrite the worst answers and hand those questions to a person at once."],
    pitfalls: ["Switching the chatbot off: the wait comes back, which is the problem the case started with.", "Buying the platform: fourteen weeks, a black box, and it cannot be measured."],
  };
}
