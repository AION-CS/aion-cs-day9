"use client";

import { ExportBar } from "@/components/ui/ExportBar";
import { Block11, Block12, Block13, Block14 } from "@/components/task1/Part1";
import { Block21, Block22, Block23, Block24 } from "@/components/task1/Part2";
import { Callout } from "@/components/ui/MaterialCard";
import { BUDGET, MONTHS } from "@/data/measures";
import { analysisBody } from "@/lib/exportDoc";
import { l1Missing } from "@/lib/missing";
import { euro, tt } from "@/lib/lang";
import { exportName } from "@/lib/slug";
import { usePersisted } from "@/store/usePersisted";
import { Gloss } from "@/lib/glossify";
import { TASK1_MINUTES } from "@/lib/routes";

function CaseBrief() {
  return (
    <section id="case-brief" aria-labelledby="case-h" className="card space-y-3 p-4 md:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="case-h">{tt("The case: LiveConnect IT Services GmbH", "Der Fall: LiveConnect IT Services GmbH")}</h2>
        <span className="smallcaps">{tt("Read once · about 5 min", "Einmal lesen · ca. 5 Min.")}</span>
      </div>
      <p className="max-w-prose text-body text-ink">
        <Gloss>
          {tt("LiveConnect IT Services GmbH sells managed IT and cloud services to the Mittelstand. Its website draws many visitors, but most leave within seconds, few start a conversation, and a quote request waits a day or more for an answer. Chat, e-mail, campaigns and social media are run by different teams, and nobody coordinates them or knows which of them works.", "LiveConnect IT Services GmbH verkauft dem Mittelstand Managed-IT- und Cloud-Services. Die Website zieht viele Besucher an, aber die meisten gehen nach Sekunden, wenige beginnen ein Gespräch, und eine Angebotsanfrage wartet einen Tag oder länger auf Antwort. Chat, E-Mail, Kampagnen und Social Media laufen in verschiedenen Teams, und niemand stimmt sie ab oder weiß, welche davon wirken.")}
        </Gloss>
      </p>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-line bg-canvas p-3 text-caption">
          <p className="smallcaps">{tt("What you have", "Was Sie haben")}</p>
          <ul className="mt-1 list-disc space-y-1 pl-4 text-ink">
            <li>{tt("Nine real-time ideas from LiveConnect's teams (Block 1.1).", "Neun Echtzeit-Ideen aus den Teams von LiveConnect (Block 1.1).")}</li>
            <li>{tt("Last quarter's quote requests by speed of answer, and eight moments on the website (Blocks 1.2 and 1.3).", "Die Angebotsanfragen des letzten Quartals nach Antworttempo und acht Momente auf der Website (Blöcke 1.2 und 1.3).")}</li>
            <li>{tt("Twelve metrics LiveConnect reports today (Block 2.1).", "Zwölf Kennzahlen, die LiveConnect heute berichtet (Block 2.1).")}</li>
          </ul>
        </div>
        <div className="rounded-lg border border-line bg-canvas p-3 text-caption">
          <p className="smallcaps">{tt("The limits", "Die Grenzen")}</p>
          <ul className="mt-1 list-disc space-y-1 pl-4 text-ink">
            <li>
              {tt("Budget: ", "Budget: ")}
              <strong>{euro(BUDGET)}</strong>
            </li>
            <li>
              {tt("Time: ", "Zeit: ")}
              <strong>{tt(`${MONTHS} months`, `${MONTHS} Monate`)}</strong>
            </li>
            <li>{tt("The cost and weeks of every measure are printed in Block 2.4.", "Kosten und Wochen jeder Maßnahme stehen in Block 2.4.")}</li>
          </ul>
        </div>
        <div className="rounded-lg border border-line bg-canvas p-3 text-caption">
          <p className="smallcaps">{tt(`How the task runs · about ${TASK1_MINUTES} min`, `So läuft die Aufgabe · ca. ${TASK1_MINUTES} Min.`)}</p>
          <ol className="mt-1 list-decimal space-y-1 pl-4 text-ink">
            <li>{tt("See where speed and personalisation help, what a fast answer is worth, and three concrete improvements (Level 1).", "Sehen, wo Tempo und Personalisierung helfen, was eine schnelle Antwort wert ist, und drei konkrete Verbesserungen (Level 1).")}</li>
            <li>{tt("Define KPIs and design a fair A/B test (Level 2).", "KPIs festlegen und einen fairen A/B-Test entwerfen (Level 2).")}</li>
            <li>{tt("Choose three measures and defend the order.", "Drei Maßnahmen wählen und die Reihenfolge begründen.")}</li>
          </ol>
        </div>
      </div>
      <Callout label={tt("Case assumption", "Fallannahme")} tone="amber">
        <p>
          {tt("The brief says: high visitor numbers, low dwell time and few closings; high bounce rates, low interaction and measures not coordinated; €170,000 and four months. Everything else is made up for this exercise: the pages, the speed figures, the metrics, the rates and the costs.", "Der Auftrag sagt: hohe Besucherzahlen, geringe Verweildauer und wenige Abschlüsse; hohe Absprungraten, geringe Interaktion und nicht abgestimmte Maßnahmen; 170.000 € und vier Monate. Alles andere ist für diese Übung erfunden: die Seiten, die Tempo-Werte, die Kennzahlen, die Quoten und die Kosten.")}
        </p>
      </Callout>
    </section>
  );
}

function PartHeading({ id, n, title, level }: { id: string; n: number; title: string; level: string }) {
  return (
    <div id={id} className="flex flex-wrap items-baseline gap-x-3 border-b-2 border-ink pb-1 pt-2">
      <span className="smallcaps text-accent">{tt(`Part ${n}`, `Teil ${n}`)}</span>
      <h2>{title}</h2>
      <span className="smallcaps ml-auto">{level}</span>
    </div>
  );
}

export function Task1() {
  const p = usePersisted();
  const missing = l1Missing(p);
  const filename = exportName(p.participant.name, "l1l2-real-time-file");
  return (
    <section id="task-1" aria-labelledby="task1-h" className="space-y-6">
      <header className="space-y-1">
        <p className="smallcaps text-accent">{tt(`Task 1 · about ${TASK1_MINUTES} minutes`, `Task 1 · ca. ${TASK1_MINUTES} Minuten`)}</p>
        <h2 id="task1-h">{tt("Real-Time Retention: respond, personalise, measure", "Real-Time Retention: reagieren, personalisieren, messen")}</h2>
      </header>
      <CaseBrief />
      <PartHeading id="part-1" n={1} title={tt("Understand the real-time effect", "Die Echtzeit-Wirkung verstehen")} level={tt("Level 1 · Knowledge", "Level 1 · Wissen")} />
      <Block11 />
      <Block12 />
      <Block13 />
      <Block14 />
      <PartHeading id="part-2" n={2} title={tt("Make it measurable and choose", "Messbar machen und auswählen")} level={tt("Level 2 · Application", "Level 2 · Anwendung")} />
      <Block21 />
      <Block22 />
      <Block23 />
      <Block24 />
      <ExportBar
        id="export-l1l2"
        previewTitle={tt("Preview of your Real-Time Analysis File", "Vorschau Ihrer Real-Time Analysis File")}
        exportLabel={tt("Export the Real-Time Analysis File", "Real-Time Analysis File exportieren")}
        docTitle="Real-Time Analysis File"
        filename={filename}
        missing={missing}
        buildBody={() => analysisBody(p)}
      />
    </section>
  );
}
