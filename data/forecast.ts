import { bi, t } from "@/lib/lang";

/**
 * Task 1 · Block 1.2 (Optional, read-only: the rates are PRINTED, no figure is asked for, CLAUDE.md #44) and the worked example of Materi A4: what speed is worth. LiveConnect's quote requests last quarter, split by how
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
