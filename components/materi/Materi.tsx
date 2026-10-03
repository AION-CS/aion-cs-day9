"use client";

import { CARDS_A } from "@/components/materi/CardsA";
import { CARDS_B } from "@/components/materi/CardsB";
import { useCardMore } from "@/store/useCardMore";
import { OptionalSection } from "@/components/ui/OptionalSection";
import { ReferencesAccordion } from "@/components/ui/ReferencesAccordion";
import { MATERIALS, SECTIONS, materialAnchorId } from "@/data/materialIndex";
import type { RefKey } from "@/data/references";
import { tt } from "@/lib/lang";

const REFS_A: RefKey[] = ["oldroyd2011", "huang2021", "aguirre2015", "peppers1993", "gdpr2016", "adam2021", "kaplan2010", "denboer2015", "provost2013", "kaplan1992", "ries2011", "kohavi2020", "markey2009", "hubbard2014", "davenport2018"];
const REFS_B: RefKey[] = ["markey2009", "oldroyd2011", "hubbard2014", "gdpr2016", "kaplan1992", "ries2011", "kohavi2020", "courtney1997", "klein2007"];

const CARDS_A_META = MATERIALS.filter((m) => m.block === "A");
const CARDS_B_META = MATERIALS.filter((m) => m.block === "B");

function Block({ id, title, intro, children }: { id: string; title: string; intro: string; children: React.ReactNode }) {
  const all = useCardMore((s) => s.all);
  const setAll = useCardMore((s) => s.setAll);
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="space-y-4">
      <header className="space-y-1">
        <p className="smallcaps text-accent">{title}</p>
        <h2 id={`${id}-h`}>{intro}</h2>
        <button type="button" aria-pressed={all} onClick={() => setAll(!all)} className="btn-ghost btn-sm">
          {all ? tt("Hide the extra explanations", "Zusatzerklärungen ausblenden") : tt("Show every extra explanation, video and rule", "Alle Zusatzerklärungen, Videos und Regeln zeigen")}
        </button>
      </header>
      {children}
    </section>
  );
}
const NOTE = () => tt("Check every source before you teach from it: page numbers and editions differ between printings.", "Prüfen Sie jede Quelle, bevor Sie damit unterrichten: Seitenzahlen und Auflagen unterscheiden sich.");

export function MateriA() {
  const s = SECTIONS[1][0];
  return (
    <Block id={s.id} title={tt(`Materi A · ${s.minutes} minutes, facilitator-led`, `Materi A · ${s.minutes} Minuten, moderiert`)} intro={tt("Customer retention in real time: why speed matters, where to respond and personalise, and how to measure it", "Kundenbindung in Echtzeit: warum Tempo zählt, wo reagieren und personalisieren, und wie man es misst")}>
      <p className="max-w-prose text-body text-ash">
        {tt("Seven cards, Level 1 and Level 2 in one run: knowledge first (what a delay costs, personalisation in the moment, where to respond at once, what speed is worth), then application (KPIs in real time, testing and feedback loops, choosing measures). Every diagram uses Neckar Hosting, another provider, so the task is never answered for you.", "Sieben Karten, Level 1 und Level 2 in einem Durchgang: zuerst Wissen (was Verzögerung kostet, Personalisierung im Moment, wo sofort reagieren, was Tempo wert ist), dann Anwendung (KPIs in Echtzeit, Testen und Feedbackschleifen, Maßnahmen wählen). Jedes Diagramm nutzt Neckar Hosting, einen anderen Anbieter, damit die Aufgabe nie für Sie gelöst wird.")}
      </p>
      {CARDS_A.map((C, i) => {
        const m = CARDS_A_META[i];
        return m.optional ? (
          <OptionalSection
            key={i}
            id={materialAnchorId(m.id)}
            title={`${m.id} · ${m.title}`}
            minutes={m.minutes}
            reason={tt("Deepens a card a Core task block already covers. Not needed to complete the Real-Time Analysis File.", "Vertieft eine Karte, die ein Kern-Block schon abdeckt. Für die Real-Time Analysis File nicht nötig.")}
          >
            <C />
          </OptionalSection>
        ) : (
          <C key={i} />
        );
      })}
      <ReferencesAccordion block="A" keys={REFS_A} note={NOTE()} />
    </Block>
  );
}

export function MateriB() {
  const s = SECTIONS[2][0];
  return (
    <Block id={s.id} title={tt(`Materi B · ${s.minutes} minutes, facilitator-led`, `Materi B · ${s.minutes} Minuten, moderiert`)} intro={tt("A real-time management system: the vision, the central interaction points, the KPI and optimisation system, tested measures, and a decision under time pressure", "Ein Echtzeit-Managementsystem: das Zielbild, die zentralen Interaktionspunkte, das KPI- und Optimierungssystem, getestete Maßnahmen und eine Entscheidung unter Zeitdruck")}>
      <p className="max-w-prose text-body text-ash">
        {tt("Five cards for Level 3. You stop fixing single moments and start designing how the whole company handles interaction in real time. Each card ends in rules the task uses; each diagram uses Elster Digital, another provider.", "Fünf Karten für Level 3. Sie beheben keine einzelnen Momente mehr, sondern gestalten, wie das ganze Unternehmen Interaktion in Echtzeit steuert. Jede Karte endet mit Regeln, die die Aufgabe nutzt; jedes Diagramm nutzt Elster Digital, einen anderen Anbieter.")}
      </p>
      {CARDS_B.map((C, i) => {
        const m = CARDS_B_META[i];
        return m.optional ? (
          <OptionalSection
            key={i}
            id={materialAnchorId(m.id)}
            title={`${m.id} · ${m.title}`}
            minutes={m.minutes}
            reason={tt("Deepens a card a Core task block already covers. Not needed to complete the Real-Time Management Memo.", "Vertieft eine Karte, die ein Kern-Block schon abdeckt. Für das Real-Time Management Memo nicht nötig.")}
          >
            <C />
          </OptionalSection>
        ) : (
          <C key={i} />
        );
      })}
      <ReferencesAccordion block="B" keys={REFS_B} note={NOTE()} />
    </Block>
  );
}
