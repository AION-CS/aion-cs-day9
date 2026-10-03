import { MATERIALS, materialAnchorId } from "@/data/materialIndex";
import type { RouteNo } from "@/lib/routes";
import { isOptionalBlock } from "@/lib/progress";
import type { TaskBlockId } from "@/lib/progress";
import { tt } from "@/lib/lang";

/** The page map on the right of every route (CLAUDE.md #28). Built on call, so it follows the language. */
export type NavItem = {
  id: string;
  short: string;
  title: string;
  done?: { card: string } | { block: TaskBlockId };
  /** Collapsed by default (OptionalSection), and outside the dossier ring's count and total (CLAUDE.md #35). */
  optional?: boolean;
};
export type NavGroup = { label: string; items: NavItem[] };

const cards = (block: "A" | "B"): NavItem[] => MATERIALS.filter((m) => m.block === block).map((m) => ({ id: materialAnchorId(m.id), short: m.id, title: m.title, done: { card: m.id }, optional: m.optional }));
const blk = (n: string, title: string, block: TaskBlockId): NavItem => ({ id: `block-${n.replace(".", "-")}`, short: n, title, done: { block }, optional: isOptionalBlock(block) });

export function pageNav(route: RouteNo): NavGroup[] {
  if (route === 1)
    return [
      { label: "Materi A", items: cards("A") },
      {
        label: "Task 1",
        items: [
          { id: "case-brief", short: tt("Case", "Fall"), title: tt("The case: LiveConnect", "Der Fall: LiveConnect") },
          blk("1.1", tt("Respond, personalise or learn", "Reagieren, personalisieren oder lernen"), "b11"),
          blk("1.2", tt("Read the speed figures: two closing rates", "Die Tempo-Werte lesen: zwei Abschlussquoten"), "b12"),
          blk("1.3", tt("Where to act, three improvements", "Wo handeln, drei Verbesserungen"), "b13"),
          blk("1.4", tt("Coaching reflection", "Coaching-Reflexion"), "b14"),
          blk("2.1", tt("Tag the twelve metrics, name your three KPIs", "Die zwölf Kennzahlen zuordnen, Ihre drei KPIs nennen"), "b21"),
          blk("2.2", tt("What each kind is worth, the uncertainties", "Was jede Art wert ist, die Unsicherheiten"), "b22"),
          blk("2.3", tt("A fair A/B test", "Ein fairer A/B-Test"), "b23"),
          blk("2.4", tt("Three measures, scored and ordered", "Drei Maßnahmen, bewertet und geordnet"), "b24"),
          { id: "export-l1l2", short: "Export", title: tt("Export the Real-Time Analysis File", "Real-Time Analysis File exportieren") },
        ],
      },
    ];
  return [
    { label: "Materi B", items: cards("B") },
    {
      label: "Task 2",
      items: [
        { id: "task-2", short: tt("Case", "Fall"), title: tt("The situation and the budget", "Die Lage und das Budget") },
        blk("3.1", tt("The target vision", "Das Zielbild"), "b31"),
        blk("3.2", tt("Central interaction points", "Zentrale Interaktionspunkte"), "b32"),
        blk("3.3", tt("The KPI and optimisation system", "Das KPI- und Optimierungssystem"), "b33"),
        blk("3.4", tt("Measures, tested", "Maßnahmen, getestet"), "b34"),
        blk("3.5", tt("The implementation architecture", "Die Umsetzungsarchitektur"), "b35"),
        blk("3.6", tt("The decision under time pressure", "Die Entscheidung unter Zeitdruck"), "b36"),
        { id: "export-l3", short: "Export", title: tt("Export the Real-Time Management Memo", "Real-Time Management Memo exportieren") },
      ],
    },
  ];
}
