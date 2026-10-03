"use client";

import { Block31, Block32, Block33, Block34, Block35, Block36 } from "@/components/task2/Blocks";
import { MemoPanel } from "@/components/task2/MemoPanel";
import { TodayTable } from "@/components/task2/Kits";
import { ExportBar } from "@/components/ui/ExportBar";
import { Callout } from "@/components/ui/MaterialCard";
import { OptionalSection } from "@/components/ui/OptionalSection";
import { MEASURE_BY_ID } from "@/data/measures";
import { R2_BUDGET, R2_MONTHS } from "@/data/route2";
import { Gloss } from "@/lib/glossify";
import { euro, tt } from "@/lib/lang";
import { memoBody } from "@/lib/exportDoc";
import { r2Missing } from "@/lib/missing";
import { BLOCK_MINUTES, TASK2_MINUTES } from "@/lib/routes";
import { exportName } from "@/lib/slug";
import { useJumpTo } from "@/lib/useJumpTo";
import { usePersisted } from "@/store/usePersisted";
import { useHydrated } from "@/store/useStore";

/** The situation of Route 2, stated once, directly above the task, with a soft pointer to the learner's own Route 1 answers. */
function CaseBrief() {
  const hydrated = useHydrated();
  const p = usePersisted();
  const jump = useJumpTo();
  const chosen = p.l1.chosen.map((id) => MEASURE_BY_ID[id].name);
  const has = hydrated && chosen.length > 0;
  return (
    <section id="task-2" aria-labelledby="task2-h" className="card space-y-3 p-4 md:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="task2-h">{tt("The situation: you are the Chief Digital Officer", "Die Lage: Sie sind Chief Digital Officer")}</h2>
        <span className="smallcaps">{tt("Read once · about 4 min", "Einmal lesen · ca. 4 Min.")}</span>
      </div>
      <p className="max-w-prose text-body text-ink">
        <Gloss>
          {tt("LiveConnect has seen that fast answers close far more often. You now answer for how the whole company handles customer interaction in real time. Interaction is not coordinated, responses are too slow and measures are not measurable. The budget is limited, the data situation is incomplete and time is short. The board wants a real-time customer management system, and a decision now, under time pressure and with uncertain data.", "LiveConnect hat gesehen, dass schnelle Antworten weit öfter abschließen. Sie verantworten jetzt, wie das ganze Unternehmen Kundeninteraktion in Echtzeit steuert. Die Interaktion ist nicht abgestimmt, Antworten sind zu langsam, und Maßnahmen sind nicht messbar. Das Budget ist begrenzt, die Datenlage unvollständig und die Zeit knapp. Der Vorstand will ein Echtzeit-Kundenmanagementsystem, und eine Entscheidung jetzt, unter Zeitdruck und mit unsicheren Daten.")}
        </Gloss>
      </p>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-line bg-canvas p-3 text-caption">
          <p className="smallcaps">{tt("The limits", "Die Grenzen")}</p>
          <ul className="mt-1 list-disc space-y-1 pl-4 text-ink">
            <li>
              {tt("Budget: ", "Budget: ")}
              <strong>{euro(R2_BUDGET)}</strong> {tt("(Case assumption)", "(Fallannahme)")}
            </li>
            <li>
              {tt("Time: ", "Zeit: ")}
              <strong>{tt(`${R2_MONTHS} months`, `${R2_MONTHS} Monate`)}</strong>
            </li>
            <li>{tt("The items and their costs are in Block 3.5; the numbers today are in the table below.", "Die Punkte und ihre Kosten stehen in Block 3.5; die Zahlen heute stehen in der Tabelle darunter.")}</li>
          </ul>
        </div>
        <div className="rounded-lg border border-line bg-canvas p-3 text-caption md:col-span-2">
          <p className="smallcaps">{tt(`What you build · about ${TASK2_MINUTES} min`, `Was Sie bauen · ca. ${TASK2_MINUTES} Min.`)}</p>
          <ol className="mt-1 grid list-decimal gap-x-6 pl-4 text-ink sm:grid-cols-2">
            <li>{tt("The target vision of a real-time customer retention system", "Das Zielbild eines Echtzeit-Kundenbindungssystems")}</li>
            <li>{tt("The definition of central interaction points", "Die Festlegung zentraler Interaktionspunkte")}</li>
            <li>{tt("A KPI and optimisation system", "Ein KPI- und Optimierungssystem")}</li>
            <li>{tt("The selection of automation and personalisation measures (tested)", "Die Auswahl von Automatisierungs- und Personalisierungsmaßnahmen (getestet)")}</li>
            <li>{tt("A prioritised implementation architecture", "Eine priorisierte Umsetzungsarchitektur")}</li>
            <li>{tt("A decision under time pressure and uncertain data", "Eine Entscheidung unter Zeitdruck und unsicherer Datenlage")}</li>
          </ol>
        </div>
      </div>
      <TodayTable />
      <div role="note" className="rounded-lg border border-gold bg-accentSoft p-3 text-caption text-ink" id="task1-quote">
        <p className="smallcaps text-accent">{tt("Where Route 1 left off · your own answers", "Wo Route 1 aufgehört hat · Ihre eigenen Antworten")}</p>
        {has ? (
          <p className="mt-1">
            {tt("Measures you chose in Route 1: ", "Von Ihnen in Route 1 gewählte Maßnahmen: ")}
            <strong>{chosen.join(", ")}</strong>.
          </p>
        ) : (
          <p className="mt-1">{tt("You have not answered Route 1 yet. That is fine: nothing here is blocked, and this box fills in when you do.", "Sie haben Route 1 noch nicht beantwortet. Das ist in Ordnung: Hier ist nichts gesperrt, und dieses Feld füllt sich, sobald Sie es tun.")}</p>
        )}
        <button type="button" onClick={() => jump("block-2-4", "/route-1/")} className="btn-ghost btn-sm mt-2">
          {tt("Go to Block 2.4 in Route 1", "Zu Block 2.4 in Route 1")}
        </button>
      </div>
      <Callout label={tt("Case assumption", "Fallannahme")} tone="amber">
        <p>
          {tt("The brief gives the role (Chief Digital Officer or sales manager) and the situation: customer interaction not coordinated, responses too slow, measures not measurable, a limited budget, an incomplete data situation and high time pressure, and a decision under time pressure and an uncertain data situation. The budget, the interaction points, the uplifts, the costs and the baselines are made up for this exercise.", "Der Auftrag gibt Rolle (Chief Digital Officer oder Vertriebsleitung) und Lage vor: nicht abgestimmte Kundeninteraktion, zu langsame Antworten, nicht messbare Maßnahmen, begrenztes Budget, unvollständige Datenlage und hoher Zeitdruck, und eine Entscheidung unter Zeitdruck und unsicherer Datenlage. Budget, Interaktionspunkte, Uplifts, Kosten und Ausgangswerte sind für diese Übung erfunden.")}
        </p>
      </Callout>
    </section>
  );
}

export function Task2() {
  const p = usePersisted();
  const missing = r2Missing(p);
  const filename = exportName(p.participant.name, "l3-real-time-memo");
  return (
    <div className="space-y-6">
      <CaseBrief />
      <OptionalSection
        id="block-3-1"
        title={tt("Block 3.1 · The target vision of a real-time retention system", "Block 3.1 · Das Zielbild eines Echtzeit-Bindungssystems")}
        minutes={BLOCK_MINUTES["3.1"]}
        reason={tt("Names the principles behind a real-time retention system; the plan in Block 3.5 can be set without them.", "Benennt die Prinzipien hinter einem Echtzeit-Bindungssystem; der Plan in Block 3.5 lässt sich auch ohne sie festlegen.")}
      >
        <Block31 />
      </OptionalSection>
      <OptionalSection
        id="block-3-2"
        title={tt("Block 3.2 · Definition of central interaction points", "Block 3.2 · Festlegung zentraler Interaktionspunkte")}
        minutes={BLOCK_MINUTES["3.2"]}
        reason={tt("Sorts eight interaction points into select now, data first or not now; Block 3.5 prints the figures it needs itself.", "Sortiert acht Interaktionspunkte in jetzt auswählen, erst die Daten oder jetzt nicht; Block 3.5 druckt die Zahlen, die er braucht, selbst.")}
      >
        <Block32 />
      </OptionalSection>
      <OptionalSection
        id="block-3-3"
        title={tt("Block 3.3 · A KPI and optimisation system", "Block 3.3 · Ein KPI- und Optimierungssystem")}
        minutes={BLOCK_MINUTES["3.3"]}
        reason={tt("Rates KPI candidates on four tests; Block 3.6 prints the baselines of its own metrics, so the decision does not need the ratings.", "Bewertet KPI-Kandidaten nach vier Tests; Block 3.6 druckt die Ausgangswerte seiner eigenen Kennzahlen, die Entscheidung braucht die Bewertungen also nicht.")}
      >
        <Block33 />
      </OptionalSection>
      <OptionalSection
        id="block-3-4"
        title={tt("Block 3.4 · Automation and personalisation measures, tested: roll out, keep testing or stop", "Block 3.4 · Automatisierungs- und Personalisierungsmaßnahmen, getestet: ausrollen, weiter testen oder stoppen")}
        minutes={BLOCK_MINUTES["3.4"]}
        reason={tt("Decides roll out, keep testing or stop for six test results; Block 3.5 already names one owner per funded item.", "Entscheidet für sechs Testergebnisse über Ausrollen, Weitertesten oder Stoppen; Block 3.5 benennt schon einen Owner pro finanziertem Punkt.")}
      >
        <Block34 />
      </OptionalSection>
      <Block35 />
      <Block36 />
      <MemoPanel />
      <ExportBar
        id="export-l3"
        previewTitle={tt("Preview of your memo", "Vorschau Ihres Memos")}
        exportLabel={tt("Export the Real-Time Management Memo", "Real-Time Management Memo exportieren")}
        docTitle="Real-Time Management Memo"
        filename={filename}
        missing={missing}
        buildBody={() => memoBody(p)}
        showPreview={false}
      />
    </div>
  );
}
