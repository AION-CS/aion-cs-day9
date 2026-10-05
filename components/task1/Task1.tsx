"use client";

import { ExportBar } from "@/components/ui/ExportBar";
import { OptionalSection } from "@/components/ui/OptionalSection";
import { Block11, Block12, Block13, Block14 } from "@/components/task1/Part1";
import { Block21, Block22, Block23, Block24 } from "@/components/task1/Part2";
import { Callout } from "@/components/ui/MaterialCard";
import { BUDGET, MONTHS } from "@/data/measures";
import { analysisBody } from "@/lib/exportDoc";
import { l1Missing } from "@/lib/missing";
import { euro, num, tt } from "@/lib/lang";
import { FORECAST, PILOT } from "@/data/forecast";
import { exportName } from "@/lib/slug";
import { usePersisted } from "@/store/usePersisted";
import { Gloss } from "@/lib/glossify";
import { BLOCK_MINUTES, TASK1_MINUTES } from "@/lib/routes";

const CORE_MIN = BLOCK_MINUTES["1.1"] + BLOCK_MINUTES["1.3"] + BLOCK_MINUTES["2.1"] + BLOCK_MINUTES["2.4"];

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
      <p className="max-w-prose text-body text-ink">
        <Gloss>
          {tt(
            `One first sign: last quarter ${num(PILOT.control.sent)} quote requests were answered after more than a day and closed at ${num(FORECAST.controlRate, { maximumFractionDigits: 1 })}%, while ${num(PILOT.variant.sent)} answered within one hour closed at ${num(FORECAST.f1, { maximumFractionDigits: 1 })}%. Fast answers closed ${num(FORECAST.f2)} times as often, but sales chose which requests to answer fast, so it is a hint, not proof.`,
            `Ein erstes Zeichen: Im letzten Quartal wurden ${num(PILOT.control.sent)} Angebotsanfragen nach mehr als einem Tag beantwortet und schlossen mit ${num(FORECAST.controlRate, { maximumFractionDigits: 1 })} % ab, während ${num(PILOT.variant.sent)} innerhalb einer Stunde beantwortete mit ${num(FORECAST.f1, { maximumFractionDigits: 1 })} % abschlossen. Schnelle Antworten schlossen ${num(FORECAST.f2)}-mal so oft ab, aber der Vertrieb wählte, welche Anfragen er schnell beantwortete, also ist es ein Hinweis, kein Beweis.`,
          )}
        </Gloss>
      </p>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-line bg-canvas p-3 text-caption">
          <p className="smallcaps">{tt("What you have", "Was Sie haben")}</p>
          <ul className="mt-1 list-disc space-y-1 pl-4 text-ink">
            <li>{tt("Nine real-time ideas from LiveConnect's teams (Block 1.1).", "Neun Echtzeit-Ideen aus den Teams von LiveConnect (Block 1.1).")}</li>
            <li>{tt("Eight moments on the website (Block 1.3); last quarter's speed figures (optional Block 1.2).", "Acht Momente auf der Website (Block 1.3); die Tempo-Werte des letzten Quartals (optionaler Block 1.2).")}</li>
            <li>{tt("Twelve metrics LiveConnect reports today (Block 2.1) and six measures it could fund (Block 2.4).", "Zwölf Kennzahlen, die LiveConnect heute berichtet (Block 2.1), und sechs Maßnahmen, die es finanzieren könnte (Block 2.4).")}</li>
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
          <p className="smallcaps">{tt(`How the task runs · four core blocks, about ${CORE_MIN} min`, `So läuft die Aufgabe · vier Kernblöcke, ca. ${CORE_MIN} Min.`)}</p>
          <ol className="mt-1 list-decimal space-y-1 pl-4 text-ink">
            <li>{tt("Block 1.1: sort nine real-time ideas into respond, personalise or learn, and name an opportunity of your own (Level 1).", "Block 1.1: neun Echtzeit-Ideen in reagieren, personalisieren oder lernen sortieren und eine eigene Chance nennen (Level 1).")}</li>
            <li>{tt("Block 1.3: choose where to respond at once and where to personalise, and write three concrete improvements (Level 1).", "Block 1.3: wählen, wo sofort reagiert und wo personalisiert wird, und drei konkrete Verbesserungen schreiben (Level 1).")}</li>
            <li>{tt("Block 2.1: tag twelve metrics by kind and name your three KPIs (Level 2).", "Block 2.1: zwölf Kennzahlen nach Art zuordnen und Ihre drei KPIs nennen (Level 2).")}</li>
            <li>{tt("Block 2.4: choose three measures, score them and defend the order (Level 2).", "Block 2.4: drei Maßnahmen wählen, bewerten und die Reihenfolge begründen (Level 2).")}</li>
          </ol>
          <p className="mt-1 text-ash">{tt(`Four more blocks (about ${TASK1_MINUTES - CORE_MIN} min) are optional and folded.`, `Vier weitere Blöcke (ca. ${TASK1_MINUTES - CORE_MIN} Min.) sind optional und eingeklappt.`)}</p>
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
        <p className="smallcaps text-accent">{tt(`Task 1 · four core blocks, optional blocks folded`, `Task 1 · vier Kernblöcke, optionale Blöcke eingeklappt`)}</p>
        <h2 id="task1-h">{tt("Real-Time Retention: respond, personalise, measure", "Real-Time Retention: reagieren, personalisieren, messen")}</h2>
      </header>
      <CaseBrief />
      <PartHeading id="part-1" n={1} title={tt("Understand the real-time effect", "Die Echtzeit-Wirkung verstehen")} level={tt("Level 1 · Knowledge", "Level 1 · Wissen")} />
      <Block11 />
      <OptionalSection
        id="block-1-2"
        title={tt("Block 1.2 · Read the speed figures: two closing rates side by side", "Block 1.2 · Die Tempo-Werte lesen: zwei Abschlussquoten nebeneinander")}
        minutes={BLOCK_MINUTES["1.2"]}
        reason={tt("Practises reading one comparison without being fooled by it (sales chose which requests to answer fast); the choices of Block 2.4 do not need it.", "Übt, einen Vergleich zu lesen, ohne sich täuschen zu lassen (der Vertrieb wählte, welche Anfragen er schnell beantwortete); die Entscheidungen in Block 2.4 brauchen es nicht.")}
      >
        <Block12 />
      </OptionalSection>
      <Block13 />
      <OptionalSection
        id="block-1-4"
        title={tt("Block 1.4 · Coaching reflection: from Level 1 to Level 2", "Block 1.4 · Coaching-Reflexion: von Level 1 zu Level 2")}
        minutes={BLOCK_MINUTES["1.4"]}
        reason={tt("A reflective bridge between Level 1 and Level 2, not content the Real-Time Analysis File itself needs.", "Eine reflektierende Brücke zwischen Level 1 und Level 2, kein Inhalt, den die Real-Time Analysis File selbst braucht.")}
      >
        <Block14 />
      </OptionalSection>
      <PartHeading id="part-2" n={2} title={tt("Make it measurable and choose", "Messbar machen und auswählen")} level={tt("Level 2 · Application", "Level 2 · Anwendung")} />
      <Block21 />
      <OptionalSection
        id="block-2-2"
        title={tt("Block 2.2 · What each kind of metric is worth, and the uncertainties", "Block 2.2 · Was jede Art von Kennzahl wert ist, und die Unsicherheiten")}
        minutes={BLOCK_MINUTES["2.2"]}
        reason={tt("Reads what each kind of metric tells management, from your tags in Block 2.1, and what can mislead a measurement; Block 2.4 can be answered without it.", "Liest, was jede Art von Kennzahl dem Management sagt, aus Ihren Zuordnungen in Block 2.1, und was eine Messung in die Irre führen kann; Block 2.4 lässt sich auch ohne es beantworten.")}
      >
        <Block22 />
      </OptionalSection>
      <OptionalSection
        id="block-2-3"
        title={tt("Block 2.3 · Design a fair A/B test", "Block 2.3 · Einen fairen A/B-Test entwerfen")}
        minutes={BLOCK_MINUTES["2.3"]}
        reason={tt("Applies the fair-test rules of Materi A6 to a chat on the pricing page; the measures of Block 2.4 are chosen and scored without it.", "Wendet die Regeln eines fairen Tests aus Materi A6 auf einen Chat auf der Preisseite an; die Maßnahmen in Block 2.4 werden auch ohne ihn gewählt und bewertet.")}
      >
        <Block23 />
      </OptionalSection>
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
