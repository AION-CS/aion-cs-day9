import { bi, t } from "@/lib/lang";
import { TASK1_MINUTES, TASK2_MINUTES } from "@/lib/routes";

/** One registry for every material card: the rail, the cards and the task chips all read it. */
export type MaterialId = "A1" | "A2" | "A3" | "A4" | "A5" | "A6" | "A7" | "B1" | "B2" | "B3" | "B4" | "B5";
export type Block = "A" | "B";
export type MaterialMeta = { id: MaterialId; block: Block; title: string; minutes: number; optional?: boolean };

/**
 * `optional: true` marks a card that no Core task block draws on (lib/progress.ts OPTIONAL_BLOCKS): collapsed by default via OptionalSection,
 * never removed (CLAUDE.md #35). A card a Core block needs stays Core even if an Optional block also cites it. Route 1 Core cards: A2 (block 1.1) and A7 (block 2.4); Route 1 Optional cards: A1, A3, A4, A5, A6.
 *
 * Day 9: Materi A (Route 1, Levels 1 and 2) seven cards, 60 minutes; Materi B (Route 2, Level 3) five cards, 60 minutes. */
export const MATERIALS: MaterialMeta[] = bi([
  { id: "A1" as MaterialId, block: "A" as Block, title: t("Why real time matters: what a delay costs", "Warum Echtzeit zählt: was eine Verzögerung kostet"), minutes: 8, optional: true },
  { id: "A2" as MaterialId, block: "A" as Block, title: t("Personalisation in the moment: value or intrusion", "Personalisierung im Moment: Mehrwert oder Aufdringlichkeit"), minutes: 9 },
  { id: "A3" as MaterialId, block: "A" as Block, title: t("Where to respond at once: chatbots, callbacks, social media and adaptive content", "Wo sofort reagieren: Chatbots, Rückrufe, Social Media und adaptive Inhalte"), minutes: 9, optional: true },
  { id: "A4" as MaterialId, block: "A" as Block, title: t("What speed is worth: closing rate, lift and extra revenue", "Was Tempo wert ist: Abschlussquote, Lift und zusätzlicher Umsatz"), minutes: 9, optional: true },
  { id: "A5" as MaterialId, block: "A" as Block, title: t("KPIs in real time: outcome, driver, guardrail and vanity metrics", "KPIs in Echtzeit: Outcome, Treiber, Guardrail und Vanity Metrics"), minutes: 8, optional: true },
  { id: "A6" as MaterialId, block: "A" as Block, title: t("A/B testing in digital channels and feedback loops", "A/B-Testing in digitalen Kanälen und Feedbackschleifen"), minutes: 9, optional: true },
  { id: "A7" as MaterialId, block: "A" as Block, title: t("Prioritising measures: effect, speed, scalability", "Maßnahmen priorisieren: Wirkung, Tempo, Skalierbarkeit"), minutes: 8 },
  { id: "B1" as MaterialId, block: "B" as Block, title: t("A real-time retention system: the target vision", "Ein Echtzeit-Bindungssystem: das Zielbild"), minutes: 12, optional: true },
  { id: "B2" as MaterialId, block: "B" as Block, title: t("Central interaction points: the decision first, then the tracking", "Zentrale Interaktionspunkte: zuerst die Entscheidung, dann die Erfassung"), minutes: 12, optional: true },
  { id: "B3" as MaterialId, block: "B" as Block, title: t("A KPI and optimisation system: four tests", "Ein KPI- und Optimierungssystem: vier Tests"), minutes: 12, optional: true },
  { id: "B4" as MaterialId, block: "B" as Block, title: t("The optimisation loop: roll out, keep testing or stop", "Die Optimierungsschleife: ausrollen, weiter testen oder stoppen"), minutes: 12, optional: true },
  { id: "B5" as MaterialId, block: "B" as Block, title: t("Deciding under time pressure, and the architecture", "Unter Zeitdruck entscheiden, und die Architektur"), minutes: 12 },
]);

export const MATERIAL_BY_ID = Object.fromEntries(MATERIALS.map((m) => [m.id, m])) as Record<MaterialId, MaterialMeta>;
export const materialAnchorId = (id: MaterialId) => `mat-${id}`;

export type RailSection = { id: string; label: string; sub: string; minutes: number };
export const SECTIONS: Record<1 | 2, RailSection[]> = bi({
  1: [
    { id: "materi-a", label: t("Materi A", "Materi A"), sub: t("Levels 1 + 2 · respond, personalise, measure", "Level 1 + 2 · reagieren, personalisieren, messen"), minutes: 60 },
    { id: "task-1", label: t("Task 1", "Task 1"), sub: t("Real-Time Retention · one case", "Real-Time Retention · ein Fall"), minutes: TASK1_MINUTES },
  ],
  2: [
    { id: "materi-b", label: t("Materi B", "Materi B"), sub: t("Level 3 · real-time management system", "Level 3 · Echtzeit-Managementsystem"), minutes: 60 },
    { id: "task-2", label: t("Task 2", "Task 2"), sub: t("Real-Time Management Memo · CDO", "Real-Time Management Memo · CDO"), minutes: TASK2_MINUTES },
  ],
});
