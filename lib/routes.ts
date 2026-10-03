import { bi, t } from "@/lib/lang";

/**
 * Day 9 route registry: Customer Retention & Buying Behaviour in B2B IT Sales, Module 5, Day 1 (customer retention in real time:
 * personalisation, automation and optimisation). From Day 3 on, a day has TWO routes (CLAUDE.md #30): Route 1 merges Level 1 and
 * Level 2 on one case, Route 2 is Level 3.
 */
export const COURSE = bi({
  title: t("Customer Retention in Real Time: Personalisation, Automation and Optimisation", "Kundenbindung in Echtzeit: Personalisierung, Automatisierung und Optimierung"),
  site: t("Retention Lab · Day 9", "Retention Lab · Tag 9"),
  module: t("Module 5, Day 1 of 2", "Modul 5, Tag 1 von 2"),
  course: t("Customer Retention & Buying Behaviour in B2B IT Sales", "Customer Retention & Kaufverhalten im B2B-IT-Vertrieb"),
  day: 9,
  company: "LiveConnect IT Services GmbH",
});

export type RouteNo = 1 | 2;

export const BLOCK_MINUTES = { "1.1": 6, "1.2": 5, "1.3": 9, "1.4": 5, "2.1": 11, "2.2": 6, "2.3": 8, "2.4": 14, "3.1": 5, "3.2": 8, "3.3": 10, "3.4": 8, "3.5": 10, "3.6": 9 } as const;
const sum = (keys: (keyof typeof BLOCK_MINUTES)[]) => keys.reduce((s, k) => s + BLOCK_MINUTES[k], 0);
export const TASK1_MINUTES = sum(["1.1", "1.2", "1.3", "1.4", "2.1", "2.2", "2.3", "2.4"]);
export const TASK2_MINUTES = sum(["3.1", "3.2", "3.3", "3.4", "3.5", "3.6"]);

export type RouteInfo = { n: RouteNo; href: string; short: string; title: string; level: string; blurb: string; plan: { label: string; minutes: number }[]; built: boolean };

export const ROUTES: RouteInfo[] = bi([
  {
    n: 1 as RouteNo,
    href: "/route-1/",
    short: t("Real time", "Echtzeit"),
    title: t("Route 1 · Respond, personalise, measure", "Route 1 · Reagieren, personalisieren, messen"),
    level: t("Levels 1 + 2 · Knowledge and application", "Level 1 + 2 · Wissen und Anwendung"),
    blurb: t(
      "One case, two levels: LiveConnect IT Services has many website visitors, but they leave quickly, few interact and quote requests wait a day for an answer. You learn why speed matters in customer contact, how to personalise the moment without being intrusive, where chatbots, dynamic pricing and adaptive content fit, and how KPIs, A/B tests and feedback loops make real-time measures measurable. Then four core blocks: you sort nine ideas, decide where to answer at once and where to personalise and write three concrete improvements, tag twelve metrics and name your three KPIs, and choose three measures inside €170,000 and four months. Four optional blocks add a read of the speed figures, a coaching reflection, what each kind of metric is worth and a fair test. Material first, then one task that ends in a Real-Time Analysis File.",
      "Ein Fall, zwei Level: LiveConnect IT Services hat viele Website-Besucher, aber sie gehen schnell, wenige interagieren, und Angebotsanfragen warten einen Tag auf Antwort. Sie lernen, warum Tempo im Kundenkontakt zählt, wie man den Moment personalisiert, ohne aufdringlich zu sein, wo Chatbots, Dynamic Pricing und adaptive Inhalte passen, und wie KPIs, A/B-Tests und Feedbackschleifen Echtzeit-Maßnahmen messbar machen. Dann vier Kernblöcke: Sie sortieren neun Ideen, entscheiden, wo sofort geantwortet und wo personalisiert wird, und schreiben drei konkrete Verbesserungen, ordnen zwölf Kennzahlen zu und nennen Ihre drei KPIs, und wählen drei Maßnahmen innerhalb von 170.000 € und vier Monaten. Vier optionale Blöcke ergänzen eine Lektüre der Tempo-Werte, eine Coaching-Reflexion, was jede Art von Kennzahl wert ist, und einen fairen Test. Erst das Material, dann eine Aufgabe, die mit einer Real-Time Analysis File endet.",
    ),
    plan: [
      { label: t("Materi A · seven cards, Levels 1 and 2", "Materi A · sieben Karten, Level 1 und 2"), minutes: 60 },
      { label: t("Task 1 · Real-Time Retention, one task", "Task 1 · Real-Time Retention, eine Aufgabe"), minutes: TASK1_MINUTES },
    ],
    built: true,
  },
  {
    n: 2 as RouteNo,
    href: "/route-2/",
    short: t("Decide", "Entscheiden"),
    title: t("Route 2 · Management decision", "Route 2 · Managemententscheidung"),
    level: t("Level 3 · Management decision", "Level 3 · Managemententscheidung"),
    blurb: t(
      "You are now LiveConnect's Chief Digital Officer. Customer interaction is not coordinated, responses are too slow and measures are not measurable. You set the target vision of a real-time retention system, define the central interaction points, build a KPI and optimisation system, decide on tested measures, and commit to a plan under time pressure with incomplete data. Material first, then a Real-Time Management Memo that assembles itself beside your answers.",
      "Sie sind jetzt Chief Digital Officer von LiveConnect. Die Kundeninteraktion ist nicht abgestimmt, Antworten sind zu langsam, und Maßnahmen sind nicht messbar. Sie legen das Zielbild eines Echtzeit-Bindungssystems fest, bestimmen die zentralen Interaktionspunkte, bauen ein KPI- und Optimierungssystem, entscheiden über getestete Maßnahmen und legen sich unter Zeitdruck und mit unvollständigen Daten auf einen Plan fest. Erst das Material, dann ein Real-Time Management Memo, das sich neben Ihren Antworten selbst zusammensetzt.",
    ),
    plan: [
      { label: t("Materi B · five cards, Level 3", "Materi B · fünf Karten, Level 3"), minutes: 60 },
      { label: t("Task 2 · Real-Time Management Memo", "Task 2 · Real-Time Management Memo"), minutes: TASK2_MINUTES },
    ],
    built: true,
  },
]);
