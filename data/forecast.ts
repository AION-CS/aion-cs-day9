import { bi, t } from "@/lib/lang";

/**
 * Task 1 · Block 1.2, and the worked example of Materi A4: what speed is worth. LiveConnect's quote requests last quarter, split by how
 * fast they were answered (Case assumption). The method is
 *
 *   closing rate                 = closings ÷ requests × 100
 *   lift (how many times)        = closing rate of fast answers ÷ closing rate of slow answers
 *   extra revenue a year         = requests a year × (fast rate − slow rate, as a share of one) × average deal value
 *
 * (Identifiers keep the names of the file this was built from: `control` = slow answers, `variant` = fast answers, `sent` = requests,
 * `orders` = closings, `order` = average deal value.) Results are rounded to two decimals.
 */
export const PILOT = {
  control: { sent: 900, orders: 72 },
  variant: { sent: 300, orders: 72 },
  yearly: 1600,
  order: 1500,
};

const r2 = (x: number) => Math.round(x * 100) / 100;
export const rateOf = (orders: number, sent: number) => r2((orders / sent) * 100);
export const liftOf = (a: number, b: number) => r2(a / b);
export const extraOf = (yearly: number, variantRate: number, controlRate: number, order: number) => r2(yearly * ((variantRate - controlRate) / 100) * order);

export const FORECAST = {
  f1: rateOf(PILOT.variant.orders, PILOT.variant.sent),
  controlRate: rateOf(PILOT.control.orders, PILOT.control.sent),
  get f2() {
    return liftOf(this.f1, this.controlRate);
  },
  get f3() {
    return extraOf(PILOT.yearly, this.f1, this.controlRate, PILOT.order);
  },
};

export type FigureId = "F1" | "F2" | "F3";
export const FIGURE_IDS: FigureId[] = ["F1", "F2", "F3"];

export const FIGURES = bi({
  F1: {
    id: "F1" as FigureId,
    label: t("F1 · Closing rate of requests answered within one hour, %", "F1 · Abschlussquote der innerhalb einer Stunde beantworteten Anfragen, %"),
    question: t("Of the quote requests answered within one hour, what share became a closed deal?", "Welcher Anteil der innerhalb einer Stunde beantworteten Angebotsanfragen wurde zu einem Abschluss?"),
    unit: "%",
    example: "12.5",
    answer: FORECAST.f1,
    formula: t("Closing rate = closings ÷ requests × 100. Use the two rows of the requests answered within one hour.", "Abschlussquote = Abschlüsse ÷ Anfragen × 100. Nutzen Sie die zwei Zeilen der innerhalb einer Stunde beantworteten Anfragen."),
    taughtIn: "A4" as const,
    clue: t("Did you divide the closings by the requests of the same speed band, and multiply by 100?", "Haben Sie die Abschlüsse durch die Anfragen desselben Tempo-Bands geteilt und mit 100 multipliziert?"),
    sources: [
      { label: t("Last quarter · answered within one hour · requests", "Letztes Quartal · innerhalb einer Stunde beantwortet · Anfragen"), value: "300", target: "fc-var-sent" },
      { label: t("Last quarter · answered within one hour · closings", "Letztes Quartal · innerhalb einer Stunde beantwortet · Abschlüsse"), value: "72", target: "fc-var-orders" },
    ],
  },
  F2: {
    id: "F2" as FigureId,
    label: t("F2 · Lift: how many times the slow closing rate", "F2 · Lift: wie viel Mal die langsame Abschlussquote"),
    question: t("How many times higher is the closing rate of requests answered within one hour than that of requests answered after more than a day?", "Wie viel Mal höher ist die Abschlussquote der innerhalb einer Stunde beantworteten Anfragen als die der nach mehr als einem Tag beantworteten?"),
    unit: "×",
    example: "1.5",
    answer: FORECAST.f2,
    formula: t("Lift = closing rate of fast answers ÷ closing rate of slow answers. Work out the slow rate from its rows first.", "Lift = Abschlussquote der schnellen Antworten ÷ Abschlussquote der langsamen Antworten. Berechnen Sie die langsame Quote zuerst aus ihren Zeilen."),
    taughtIn: "A4" as const,
    clue: t("You need two rates from two pairs of rows. Is the second one worked out from the slow rows, the same way as F1?", "Sie brauchen zwei Quoten aus zwei Zeilenpaaren. Ist die zweite aus den langsamen Zeilen berechnet, genauso wie F1?"),
    sources: [
      { label: t("Your F1 (closing rate, answered within one hour)", "Ihr F1 (Abschlussquote, innerhalb einer Stunde beantwortet)"), value: "F1", target: "fig-F1" },
      { label: t("Last quarter · answered after more than a day · requests", "Letztes Quartal · nach mehr als einem Tag beantwortet · Anfragen"), value: "900", target: "fc-ctl-sent" },
      { label: t("Last quarter · answered after more than a day · closings", "Letztes Quartal · nach mehr als einem Tag beantwortet · Abschlüsse"), value: "72", target: "fc-ctl-orders" },
    ],
  },
  F3: {
    id: "F3" as FigureId,
    label: t("F3 · Extra revenue a year, €", "F3 · Zusätzlicher Umsatz pro Jahr, €"),
    question: t("If every quote request next year were answered within one hour and customers behaved as last quarter, how much extra revenue would it bring in a year?", "Wenn jede Angebotsanfrage im nächsten Jahr innerhalb einer Stunde beantwortet würde und Kunden sich wie im letzten Quartal verhielten: Wie viel zusätzlichen Umsatz brächte das in einem Jahr?"),
    unit: "€",
    example: "12500",
    answer: FORECAST.f3,
    formula: t("Extra revenue = quote requests a year × (closing rate of fast answers − closing rate of slow answers, as a share of one) × average deal value.", "Zusätzlicher Umsatz = Angebotsanfragen pro Jahr × (Abschlussquote schneller Antworten − Abschlussquote langsamer Antworten, als Anteil von eins) × durchschnittlicher Auftragswert."),
    taughtIn: "A4" as const,
    clue: t("Only the difference between the two rates is extra, and it has to be a share of one (1 point = 0.01) before you multiply.", "Nur der Unterschied zwischen den beiden Quoten ist zusätzlich, und er muss ein Anteil von eins sein (1 Punkt = 0,01), bevor Sie multiplizieren."),
    sources: [
      { label: t("Next year · quote requests a year", "Nächstes Jahr · Angebotsanfragen pro Jahr"), value: "1,600", target: "fc-yearly" },
      { label: t("Your F1 (closing rate, answered within one hour)", "Ihr F1 (Abschlussquote, innerhalb einer Stunde beantwortet)"), value: "F1", target: "fig-F1" },
      { label: t("Last quarter · answered after more than a day · requests and closings (its rate)", "Letztes Quartal · nach mehr als einem Tag beantwortet · Anfragen und Abschlüsse (ihre Quote)"), value: "72 ÷ 900", target: "fc-ctl-orders" },
      { label: t("All deals · average deal value", "Alle Aufträge · durchschnittlicher Auftragswert"), value: t("€1,500", "1.500 €"), target: "fc-order" },
    ],
  },
});

/** The worked example of Materi A4: a different provider (Neckar Hosting), the same method on other numbers. Case assumption. */
export const MOSEL = { control: { sent: 400, orders: 40 }, variant: { sent: 200, orders: 40 }, yearly: 1000, order: 1000 };
export const MOSEL_RESULT = (() => {
  const rate = rateOf(MOSEL.variant.orders, MOSEL.variant.sent);
  const other = rateOf(MOSEL.control.orders, MOSEL.control.sent);
  return { rate, other, lift: liftOf(rate, other), extra: extraOf(MOSEL.yearly, rate, other, MOSEL.order) };
})();

/* ------------------------------------------------------------------ Block 1.3a · eight moments on the website */

/**
 * Eight moments on LiveConnect's website. (The type keeps the name "customer" of the file it was built from.) The rule of Materi A3:
 * respond immediately (chat, callback) where visitors are about to decide and many leave (a decision page with 50% or more leaving);
 * personalise where you already know who the visitor is or why they came (a customer, a campaign); elsewhere, neither is the first lever.
 */
export type CustId = "c1" | "c2" | "c3" | "c4" | "c5" | "c6" | "c7" | "c8";
export type Known = "none" | "campaign" | "customer";
export type Customer = { id: CustId; name: string; volume: number; leave: number; decision: boolean; known: Known };
export const KNOWN_LABEL = bi({ none: t("Nothing: an anonymous visitor", "Nichts: ein anonymer Besucher"), campaign: t("Why they came: the campaign they clicked", "Warum er kam: die geklickte Kampagne"), customer: t("Who they are: a logged-in customer", "Wer er ist: ein angemeldeter Kunde") });
export const DECISION_LABEL = bi({ yes: t("Yes", "Ja"), no: t("No", "Nein") });
export const LEAVE_MIN = 50;
export const CUSTOMERS: Customer[] = bi([
  { id: "c1" as CustId, name: t("Pricing page", "Preisseite"), volume: 6000, leave: 62, decision: true, known: "none" as Known },
  { id: "c2" as CustId, name: t("Quote request form", "Formular für Angebotsanfragen"), volume: 1200, leave: 55, decision: true, known: "none" as Known },
  { id: "c3" as CustId, name: t("Home page", "Startseite"), volume: 18000, leave: 70, decision: false, known: "none" as Known },
  { id: "c4" as CustId, name: t("Customer portal start page", "Startseite des Kundenportals"), volume: 3000, leave: 20, decision: false, known: "customer" as Known },
  { id: "c5" as CustId, name: t("Landing page of the hospital campaign", "Landingpage der Krankenhaus-Kampagne"), volume: 900, leave: 58, decision: false, known: "campaign" as Known },
  { id: "c6" as CustId, name: t("Blog article on cloud security", "Blogartikel zu Cloud-Sicherheit"), volume: 9000, leave: 82, decision: false, known: "none" as Known },
  { id: "c7" as CustId, name: t("Plan comparison page", "Tarifvergleichsseite"), volume: 2500, leave: 38, decision: true, known: "none" as Known },
  { id: "c8" as CustId, name: t("Careers page", "Karriereseite"), volume: 1500, leave: 60, decision: false, known: "none" as Known },
]);
export const CUST_BY_ID = Object.fromEntries(CUSTOMERS.map((c) => [c.id, c])) as Record<CustId, Customer>;
export const PICK = 2;
export const AUTO_MIN_VOLUME = LEAVE_MIN;
/** Respond immediately: a decision page where 50% or more leave (Materi A3). */
export const VALUABLE_TRUTH: CustId[] = ["c1", "c2"];
/** Personalise: we know who the visitor is or why they came (Materi A3). */
export const CHURN_TRUTH: CustId[] = ["c4", "c5"];
export const PICK_WHY = bi({
  c1: t("A decision page and 62% leave: a question left open here loses the deal. Respond immediately (chat).", "Eine Entscheidungsseite, und 62 % gehen: Eine offene Frage kostet hier den Auftrag. Sofort reagieren (Chat)."),
  c2: t("The form is the last step before a request and 55% abandon it: an immediate offer of help, or a callback, catches them. Respond immediately.", "Das Formular ist der letzte Schritt vor einer Anfrage, und 55 % brechen ab: ein sofortiges Hilfeangebot oder ein Rückruf fängt sie auf. Sofort reagieren."),
  c3: t("Many leave, but nobody decides on the home page and we know nothing about the visitor: first make the page clearer; neither lever comes first.", "Viele gehen, aber auf der Startseite entscheidet niemand, und wir wissen nichts über den Besucher: zuerst die Seite klarer machen; keiner der beiden Hebel kommt zuerst."),
  c4: t("We know exactly who logged in and what they use: personalise what the start page shows.", "Wir wissen genau, wer sich angemeldet hat und was er nutzt: personalisieren, was die Startseite zeigt."),
  c5: t("We know why they came (the hospital campaign): show hospital cases and data protection answers first. Personalise.", "Wir wissen, warum sie kamen (die Krankenhaus-Kampagne): zuerst Krankenhausfälle und Datenschutzantworten zeigen. Personalisieren."),
  c6: t("82% leave after an article, which is normal for readers who found their answer; no decision happens here.", "82 % gehen nach einem Artikel, was für Leser normal ist, die ihre Antwort gefunden haben; hier fällt keine Entscheidung."),
  c7: t("A decision page, but only 38% leave: visitors compare and move on to the quote form. Not the first place to act.", "Eine Entscheidungsseite, aber nur 38 % gehen: Besucher vergleichen und gehen weiter zum Angebotsformular. Nicht der erste Ort zum Handeln."),
  c8: t("Applicants, not customers: no buying decision, and nothing to retain.", "Bewerber, keine Kunden: keine Kaufentscheidung, und nichts zu binden."),
});

/* ------------------------------------------------------------------ Block 1.3b · three concrete improvements */

/** The three levers from Block 1.1; each improvement pulls a different one. (The type keeps its earlier name, "basis".) */
export type Basis = "respond" | "personal" | "learn";
export const BASES = bi([
  { id: "respond" as Basis, label: t("Respond faster", "Schneller reagieren"), short: t("Speed", "Tempo") },
  { id: "personal" as Basis, label: t("Personalise the moment", "Den Moment personalisieren"), short: t("Personalisation", "Personalisierung") },
  { id: "learn" as Basis, label: t("Learn and adjust", "Lernen und anpassen"), short: t("Learning", "Lernen") },
]);
export const BASIS_LABEL = bi({ respond: t("Respond faster", "Schneller reagieren"), personal: t("Personalise the moment", "Den Moment personalisieren"), learn: t("Learn and adjust", "Lernen und anpassen") });
export const INSIGHT_COUNT = 3;
export const INSIGHT_MIN = 45;
export const INSIGHT_FRAME = bi({ v: t("[What we change] on [which page or moment], so [what the visitor gets].", "[Was wir ändern] auf [welcher Seite oder in welchem Moment], sodass [was der Besucher bekommt].") });
/** True when the sentence says what the change gives. A floor, not a judge of quality; English and German forms. */
export const hasSoWhat = (s: string) => /\b(so|therefore|which means|because|means|so that|thus|hence|daher|deshalb|weil|das heißt|bedeutet|sodass|damit|also)\b/i.test(s);
