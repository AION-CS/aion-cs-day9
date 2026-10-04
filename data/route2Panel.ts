import { ARCH_IDS } from "@/data/route2";
import type { ArchId } from "@/data/route2";
import { bi, t } from "@/lib/lang";

/**
 * What the Route 2 control panel reads (CLAUDE.md #47). Every figure is a Case assumption and is printed on the item cards and in "the
 * numbers today", so a Core block never reads an Optional one (#40): `data` is the share of the interactions the item needs that are tracked
 * and clean today, the same figure the interaction-point list of the “Go deeper” part prints for the points it also names (a check in
 * `npm run verify:calc` keeps them equal). Nothing here asks the learner to calculate (#44): the panel computes it and says what it means.
 */
export type Tier = "now" | "later" | "not";
export const TIER_IDS: Tier[] = ["now", "later", "not"];
export const TIER_LABEL = bi({ now: t("Now", "Jetzt"), later: t("After data is ready", "Wenn die Daten bereit sind"), not: t("Not now", "Jetzt nicht") });

/** The "weaker data" scenario: every readiness figure is this many points lower (the plan's “incomplete data situation”). */
export const WEAK_POINTS = 15;
/** An engine starts on data that is at least this ready (the rule of Materi B5; the same bar as the “Go deeper” part's). */
export const READY_BAR = 80;

/** Where an item sits in the architecture diagram. */
export type Layer = "suite" | "site" | "engine" | "people" | "base" | "clean";

export type PanelFacts = {
  layer: Layer;
  /** Short name for the diagram. */
  short: string;
  /** What the item does for the system, in one phrase after "Moves". */
  moves: string;
  /** It moves a named KPI of customers (a rate customers' behaviour changes). */
  named: boolean;
  /** It makes the other items measurable or usable (the live view and KPI system, the response standards, the training, the tracking clean-up). */
  enabler: boolean;
  /** Its effect can be measured once it is in place (a named KPI, or the measurement system itself). */
  measured: boolean;
  /** Share of the interactions it needs that are tracked and clean today (percent), or null when it needs no data to start. */
  data: number | null;
  /** The tracking clean-up prepares the data this item needs: it is ready when the clean-up is in use before the item starts. */
  cleaned: boolean;
  blackBox: boolean;
};

export const PANEL: Record<ArchId, PanelFacts> = bi({
  foundation: { layer: "base" as Layer, short: t("Live view and KPI system", "Live-Sicht und KPI-System"), moves: t("no KPI by itself: every KPI is defined once and read from the live screen", "keinen KPI selbst: Jeder KPI wird einmal definiert und am Live-Bildschirm gelesen"), named: false, enabler: true, measured: true, data: null, cleaned: false, blackBox: false },
  chat: { layer: "engine" as Layer, short: t("Chatbot and live chat", "Chatbot und Live-Chat"), moves: t("the closing rate of quote requests", "die Abschlussquote der Angebotsanfragen"), named: true, enabler: false, measured: true, data: 85, cleaned: false, blackBox: false },
  personal: { layer: "engine" as Layer, short: t("Real-time personalisation", "Echtzeit-Personalisierung"), moves: t("the interaction rate on decision pages", "die Interaktionsrate auf Entscheidungsseiten"), named: true, enabler: false, measured: true, data: 50, cleaned: true, blackBox: false },
  routing: { layer: "people" as Layer, short: t("Response standards and routing", "Antwortstandards und Weiterleitung"), moves: t("no KPI by itself: it fixes how fast each point answers and who takes over", "keinen KPI selbst: Es legt fest, wie schnell jeder Punkt antwortet und wer übernimmt"), named: false, enabler: true, measured: false, data: null, cleaned: false, blackBox: false },
  training: { layer: "people" as Layer, short: t("Real-time selling training", "Echtzeit-Vertriebstraining"), moves: t("no KPI by itself: the sales team takes over a chat and reads the live screen", "keinen KPI selbst: Das Vertriebsteam übernimmt einen Chat und liest den Live-Bildschirm"), named: false, enabler: true, measured: false, data: null, cleaned: false, blackBox: false },
  tracking: { layer: "clean" as Layer, short: t("Tracking and consent clean-up", "Bereinigung von Erfassung und Einwilligung"), moves: t("no KPI by itself: it closes the tracking gaps that personalisation needs", "keinen KPI selbst: Es schließt die Erfassungslücken, die die Personalisierung braucht"), named: false, enabler: true, measured: false, data: null, cleaned: false, blackBox: false },
  suite: { layer: "suite" as Layer, short: t("All-in-one AI platform", "All-in-one-KI-Plattform"), moves: t("no KPI it reports: its rules and results are not shown", "keinen KPI, den sie berichtet: Ihre Regeln und Ergebnisse werden nicht gezeigt"), named: false, enabler: false, measured: false, data: null, cleaned: false, blackBox: true },
  relaunch: { layer: "site" as Layer, short: t("Website relaunch", "Website-Relaunch"), moves: t("no KPI it names: a new design for every page", "keinen KPI, den er nennt: ein neues Design für jede Seite"), named: false, enabler: false, measured: false, data: null, cleaned: false, blackBox: false },
});

export const ENGINE_IDS: ArchId[] = ["chat", "personal"];
/** The item the "After data is ready" tier waits for, and the one that makes everything else measurable. */
export const CLEAN_ID: ArchId = "tracking";
export const KPI_SYSTEM_ID: ArchId = "foundation";

/**
 * The model plan (CLAUDE.md #47): the six items that fit the budget; personalisation waits for the tracking clean-up; the all-in-one platform
 * and the relaunch stay out (both are in use only in month 5, after the 4 months, and neither names a KPI).
 */
export const MODEL_TIER: Record<ArchId, Tier> = { foundation: "now", chat: "now", personal: "later", routing: "now", training: "now", tracking: "now", suite: "not", relaunch: "not" };
export const MODEL_ARCH: ArchId[] = ARCH_IDS.filter((id) => MODEL_TIER[id] !== "not");
