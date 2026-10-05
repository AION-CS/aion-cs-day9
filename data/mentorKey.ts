import { LINES } from "@/data/ladder";
import type { LevelTag, LineId } from "@/data/ladder";
import { CHURN_TRUTH, FORECAST, PILOT, VALUABLE_TRUTH } from "@/data/forecast";
import type { Basis } from "@/data/forecast";
import { AB_MODEL, MEANING_TRUTH, MEASURE_TRUTH, PATTERN_IDS, RECORDS, TRUTH_COUNTS, TRUTH_LEFT, riskOf } from "@/data/patterns";
import type { PatternId, PatternRow, RecId, UncId } from "@/data/patterns";
import { MEASURE_BY_ID, MODEL_MEASURES, explainBucket } from "@/data/measures";
import type { MeasureId } from "@/data/measures";
import { ARCH_BY_ID, COMP_BY_ID, MODEL_COMPS, MODEL_GREATEST, OWNER_ACCEPT_LOGIC, R2_BUDGET, SITUATIONS, SOURCES, actionOf, useOf } from "@/data/route2";
import { MODEL_ARCH, MODEL_TIER } from "@/data/route2Panel";
import type { Criterion, LogicRow, Use } from "@/data/route2";
import { euro, num, tt } from "@/lib/lang";
import type { L1State, R2State, Score } from "@/store/useStore";

/**
 * Every model answer of the day, in one file. "Fill all model answers" in the mentor bar enters these, so that after one fill every
 * route's missing list is empty and every export downloads at once. Free text follows the site's language. A convenience for
 * facilitators, not security.
 */
export const MENTOR_PASSCODE = "muchson123";
export const MODEL_ORDER: MeasureId[] = ["chat", "kpi", "personal"];

/** The model reason for the two judged scores of each model measure (CLAUDE.md #45): effect, scalability, and a printed fact. */
const MEASURE_REASON: Record<string, () => string> = {
  chat: () =>
    tt(
      "Effect 3: it answers visitors at the moment they are about to leave, on the pages where decisions happen. Scalability 3: once built it serves every visitor, and the card says 4 weeks until it works.",
      "Wirkung 3: Er antwortet Besuchern in dem Moment, in dem sie gehen wollen, auf den Seiten, wo entschieden wird. Skalierbarkeit 3: Einmal gebaut, dient er jedem Besucher, und die Karte nennt 4 Wochen, bis er wirkt.",
    ),
  personal: () =>
    tt(
      "Effect 3: it changes what the visitor sees on the pages where LiveConnect knows who they are or why they came. Scalability 3: once the content variants exist the website serves every visitor, although the card says 8 weeks of set-up.",
      "Wirkung 3: Es ändert, was der Besucher auf den Seiten sieht, auf denen LiveConnect weiß, wer er ist oder warum er kam. Skalierbarkeit 3: Sobald die Inhaltsvarianten existieren, dient die Website jedem Besucher, auch wenn die Karte 8 Wochen Vorlauf nennt.",
    ),
  kpi: () =>
    tt(
      "Effect 2: it raises no deal by itself, but it coordinates the other measures and feeds back what works. Scalability 3: one screen and one weekly routine serve every future measure, for 4 weeks of work.",
      "Wirkung 2: Sie steigert selbst keinen Abschluss, stimmt aber die anderen Maßnahmen ab und meldet zurück, was wirkt. Skalierbarkeit 3: Ein Bildschirm und eine wöchentliche Routine dienen jeder künftigen Maßnahme, für 4 Wochen Arbeit.",
    ),
};

export function KEY_L1(): Partial<L1State> {
  return {
    sort: Object.fromEntries(LINES.map((r) => [r.id, r.truth])) as Record<LineId, LevelTag>,
    extraInsight: tt(
      "A customer who reports an outage by e-mail today waits until someone reads the inbox, so a status message within minutes and a named contact would keep them calm and informed.",
      "Ein Kunde, der heute eine Störung per E-Mail meldet, wartet, bis jemand das Postfach liest, also würden eine Statusmeldung innerhalb von Minuten und eine benannte Ansprechperson ihn ruhig und informiert halten.",
    ),
    meaning: tt(
      `Requests answered within one hour closed at ${FORECAST.f1}% against ${FORECAST.controlRate}%, ${FORECAST.f2} times as often, so LiveConnect should answer the quote form and the pricing page fast first, and test it fairly, because sales may have answered the eager customers first.`,
      `Innerhalb einer Stunde beantwortete Anfragen schlossen zu ${num(FORECAST.f1)} % gegenüber ${num(FORECAST.controlRate)} % ab, ${num(FORECAST.f2)}-mal so oft, also sollte LiveConnect zuerst Angebotsformular und Preisseite schnell beantworten und das fair testen, weil der Vertrieb vielleicht die interessierten Kunden zuerst beantwortete.`,
    ),
    valuable: [...VALUABLE_TRUTH],
    churners: [...CHURN_TRUTH],
    insights: [
      { basis: "respond" as Basis, text: tt("A chatbot on the pricing page answers the five common questions at once and hands over to sales within two minutes, so visitors get an answer before they leave.", "Ein Chatbot auf der Preisseite beantwortet die fünf häufigen Fragen sofort und übergibt innerhalb von zwei Minuten an den Vertrieb, sodass Besucher eine Antwort bekommen, bevor sie gehen.") },
      { basis: "personal" as Basis, text: tt("Visitors from the hospital campaign see hospital case studies and data protection answers first, so they find what they came for without searching.", "Besucher aus der Krankenhaus-Kampagne sehen zuerst Krankenhaus-Fallstudien und Datenschutzantworten, sodass sie finden, weswegen sie kamen, ohne zu suchen.") },
      { basis: "learn" as Basis, text: tt("Every Friday the team rewrites the three chat answers rated worst, so the chat gets more helpful every week instead of staying as it was built.", "Jeden Freitag schreibt das Team die drei am schlechtesten bewerteten Chat-Antworten neu, sodass der Chat jede Woche hilfreicher wird, statt so zu bleiben, wie er gebaut wurde.") },
    ],
    reflect: {
      interpret: tt("Requests answered within an hour closed three times as often as those answered after a day: interest cools fast. Today customers wait longest after the quote form and on e-mailed questions.", "Innerhalb einer Stunde beantwortete Anfragen schlossen dreimal so oft ab wie nach einem Tag beantwortete: Interesse kühlt schnell ab. Heute warten Kunden am längsten nach dem Angebotsformular und bei per E-Mail gestellten Fragen."),
      causation: tt("It is value when it uses what the visitor gave us, like the hospital campaign they clicked. It feels intrusive when it shows we watched them, like a pop-up naming the pages they read yesterday.", "Mehrwert ist es, wenn es nutzt, was der Besucher uns gab, etwa die geklickte Krankenhaus-Kampagne. Aufdringlich wirkt es, wenn es zeigt, dass wir ihn beobachtet haben, etwa ein Pop-up, das die gestern gelesenen Seiten nennt."),
      decider: tt("The chat on the decision pages works this month; personalisation takes longer but lasts. A strategic decision-maker starts the chat and the live view now, adds personalisation next, and tests each before scaling.", "Der Chat auf den Entscheidungsseiten wirkt diesen Monat; Personalisierung dauert länger, hält aber. Eine strategische Entscheiderin startet Chat und Live-Sicht jetzt, ergänzt als Nächstes die Personalisierung und testet jedes vor dem Ausweiten."),
    },
    tags: Object.fromEntries(RECORDS.map((r) => [r.id, r.truth])) as Record<RecId, PatternId>,
    unc: ["sample", "cause", "missing", "shift"] as UncId[],
    rows: Object.fromEntries(PATTERN_IDS.map((x) => [x, { risk: riskOf(TRUTH_LEFT[x], TRUTH_COUNTS[x]), meaning: MEANING_TRUTH[x], measure: MEASURE_TRUTH[x] }])) as Record<PatternId, PatternRow>,
    misread: tt(
      "1) Closing rate of quote requests (outcome), from the CRM, aim: up, above today's rate. 2) First response time (driver), from chat and CRM timestamps, aim: down, fast on the decision pages. 3) Share of chats rated “not helpful” (guardrail), from the chat ratings, aim: stay under a limit.",
      "1) Abschlussquote der Angebotsanfragen (Outcome), aus dem CRM, Ziel: hoch, über der heutigen Quote. 2) Erste Antwortzeit (Treiber), aus Chat- und CRM-Zeitstempeln, Ziel: runter, schnell auf den Entscheidungsseiten. 3) Anteil der als „nicht hilfreich“ bewerteten Chats (Guardrail), aus den Chat-Bewertungen, Ziel: unter einer Grenze bleiben.",
    ),
    ab: {
      ...AB_MODEL,
      hyp: tt("If a chat opens after 30 seconds on the pricing page, then more visitors request a quote, because their open questions are answered before they leave.", "Wenn sich nach 30 Sekunden auf der Preisseite ein Chat öffnet, dann fragen mehr Besucher ein Angebot an, weil ihre offenen Fragen beantwortet werden, bevor sie gehen."),
      rule: tt("Roll out if quote requests per visitor are at least 10% higher than the control group with 100 requests per group and “not helpful” ratings stay below 20%; keep testing if 3 to 10% higher; stop if less than 3% higher.", "Ausrollen, wenn die Angebotsanfragen pro Besucher bei 100 Anfragen pro Gruppe mindestens 10 % über der Kontrollgruppe liegen und „nicht hilfreich“-Bewertungen unter 20 % bleiben; weiter testen bei 3 bis 10 % darüber; stoppen bei weniger als 3 % darüber."),
    },
    chosen: [...MODEL_MEASURES],
    exp: Object.fromEntries(MODEL_MEASURES.map((id) => [id, explainBucket(MEASURE_BY_ID[id].evidence)])) as Record<string, Score>,
    fea: Object.fromEntries(MODEL_MEASURES.map((id) => [id, MEASURE_BY_ID[id].model.feasibility])) as Record<string, Score>,
    eff: Object.fromEntries(MODEL_MEASURES.map((id) => [id, MEASURE_BY_ID[id].model.effect])) as Record<string, Score>,
    reasons: Object.fromEntries(MODEL_MEASURES.map((id) => [id, MEASURE_REASON[id]()])) as Record<string, string>,
    order: [...MODEL_ORDER],
    why: tt(
      "The chat goes first: it scores 27, works within four weeks and answers visitors on the pages where they decide, where fast answers closed three times as often. The KPI dashboard and weekly test routine come second and start with it, so the chat is measured from its first week. Real-time personalisation comes third because it needs eight weeks. The three cost €132,000 of the €170,000; the website relaunch (€110,000, 16 weeks) has no time left to work, and the callback and the discount pop-up each answer less.",
      "Der Chat kommt zuerst: Er erzielt 27, wirkt innerhalb von vier Wochen und beantwortet Besucher auf den Seiten, auf denen sie entscheiden, wo schnelle Antworten dreimal so oft abschlossen. KPI-Dashboard und wöchentliche Test-Routine kommen als Zweites und starten mit ihm, damit der Chat ab seiner ersten Woche gemessen wird. Echtzeit-Personalisierung kommt als Drittes, weil sie acht Wochen braucht. Die drei kosten 132.000 € von 170.000 €; der Website-Relaunch (110.000 €, 16 Wochen) hat keine Zeit mehr zu wirken, und Rückruf und Rabatt-Pop-up beantworten weniger.",
    ),
  };
}

export function KEY_R2(): Partial<R2State> {
  const rate: Record<string, Score> = {};
  for (const id of MODEL_COMPS) for (const c of ["explain", "timely", "reach", "scale"] as Criterion[]) rate[`${id}.${c}`] = COMP_BY_ID[id].model[c];
  const logic: Record<string, LogicRow> = {};
  for (const s of SITUATIONS) logic[s.id] = { action: actionOf(s), owner: OWNER_ACCEPT_LOGIC[s.id][0] };
  return {
    principles: ["defs", "rules", "review"],
    principleText: {
      defs: tt("Sales, marketing and service see every chat, form, call and social media question of a customer in one timeline, so nobody asks a customer something another team already answered.", "Vertrieb, Marketing und Service sehen jeden Chat, jedes Formular, jeden Anruf und jede Social-Media-Frage eines Kunden in einer Zeitleiste, damit niemand einen Kunden etwas fragt, das ein anderes Team schon beantwortet hat."),
      rules: tt("The pricing page and the quote form get an answer within five minutes and the chat a person within two, each with a named owner, which answers “responses too slow”.", "Preisseite und Angebotsformular bekommen innerhalb von fünf Minuten eine Antwort und der Chat innerhalb von zwei Minuten einen Menschen, jeweils mit benanntem Owner, was „Antworten zu langsam“ beantwortet."),
      review: tt("Every Friday the team decides on each running test and rewrites the worst-rated chat answers, so measures are coordinated and measurable instead of running side by side.", "Jeden Freitag entscheidet das Team über jeden laufenden Test und schreibt die am schlechtesten bewerteten Chat-Antworten neu, damit Maßnahmen abgestimmt und messbar sind, statt nebeneinander zu laufen."),
    },
    sources: Object.fromEntries(SOURCES.map((s) => [s.id, useOf(s)])) as Record<string, Use>,
    comps: [...MODEL_COMPS],
    rate,
    greatest: MODEL_GREATEST,
    greatestWhy: tt(
      "First response time is the driver the brief names as the problem (responses too slow). It is linked to closings, moves live for every request and is counted by the systems, so every measure can be steered by it within days.",
      "Die erste Antwortzeit ist der Treiber, den der Auftrag als Problem nennt (Antworten zu langsam). Sie ist mit Abschlüssen verbunden, bewegt sich live für jede Anfrage und wird von den Systemen gezählt, sodass sich jede Maßnahme innerhalb von Tagen daran steuern lässt.",
    ),
    logic,
    tier: { ...MODEL_TIER },
    vision: tt(
      "LiveConnect answers every customer interaction within an agreed time, from one live view that every team reads, and steers by three KPIs. Every new tool has to move one of them before it grows, so speed and quality grow together.",
      "LiveConnect beantwortet jede Kundeninteraktion innerhalb einer vereinbarten Zeit, aus einer Live-Sicht, die jedes Team liest, und steuert über drei KPIs. Jedes neue Werkzeug muss einen davon bewegen, bevor es wächst, sodass Tempo und Qualität gemeinsam wachsen.",
    ),
    giveUp: tt(
      `The plan gives me one live view with the KPIs, response standards with a named owner, a sales team that can take over a chat, and the chat on the pages that are tracked well enough. Personalisation starts when the tracking is clean. It costs me the all-in-one platform and the relaunch, which are in use only in month 5 and name no KPI. ${euro(R2_BUDGET - MODEL_ARCH.reduce((x, id) => x + ARCH_BY_ID[id].cost, 0))} stay unspent. If the data turns out weaker, the chat rests on data below 80%, so I watch it first.`,
      `Der Plan gibt mir eine Live-Sicht mit den KPIs, Antwortstandards mit benanntem Owner, ein Vertriebsteam, das einen Chat übernehmen kann, und den Chat auf den Seiten, die gut genug erfasst sind. Die Personalisierung startet, wenn die Erfassung sauber ist. Er kostet mich die All-in-one-Plattform und den Relaunch, die erst in Monat 5 im Einsatz sind und keinen KPI nennen. ${euro(R2_BUDGET - MODEL_ARCH.reduce((x, id) => x + ARCH_BY_ID[id].cost, 0))} bleiben ungenutzt. Fallen die Daten schwächer aus, beruht der Chat auf Daten unter 80 %, also beobachte ich ihn zuerst.`,
    ),
    decision: "stage",
    decisionWhy: tt(
      "It makes the decision the brief asks for under time pressure: act within weeks where the data is good enough, with the chat on the decision pages, and measure from the first week through the live view. Personalisation waits for clean tracking, and the platform and the relaunch stay out because neither names a KPI and both arrive after the four months.",
      "Es trifft die Entscheidung, die der Auftrag unter Zeitdruck verlangt: innerhalb von Wochen dort handeln, wo die Daten gut genug sind, mit dem Chat auf den Entscheidungsseiten, und ab der ersten Woche über die Live-Sicht messen. Die Personalisierung wartet auf saubere Erfassung, und Plattform und Relaunch bleiben draußen, weil keiner einen KPI nennt und beide nach den vier Monaten ankommen.",
    ),
    watch: tt(
      "I watch the closing rate of quote requests: today it is 6%, and if it is not clearly above that by month 3 on enough requests, I stop widening the chat and keep the live view and the response standards. I also watch the data behind the chat: if it stays below 80%, I pause it until the tracking is better.",
      "Ich beobachte die Abschlussquote der Angebotsanfragen: Heute liegt sie bei 6 %, und liegt sie bis Monat 3 bei genug Anfragen nicht deutlich darüber, höre ich auf, den Chat auszuweiten, und behalte Live-Sicht und Antwortstandards. Ich beobachte auch die Daten hinter dem Chat: Bleiben sie unter 80 %, pausiere ich ihn, bis die Erfassung besser ist.",
    ),
  };
}
