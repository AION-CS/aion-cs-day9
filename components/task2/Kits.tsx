"use client";

import { ARCH, ARCH_BY_ID, KPIS, R2_MONTHS } from "@/data/route2";
import type { ArchId, KpiId } from "@/data/route2";
import { KPI_AIM } from "@/data/route2Extra";
import { PANEL, READY_BAR } from "@/data/route2Panel";
import { euro, num, tt } from "@/lib/lang";
import { monthsOf } from "@/lib/r2Panel";

/**
 * What Route 2 prints before the learner decides (CLAUDE.md #47, #44, #40): the customer figures today and, for every item, what it costs, how long it
 * takes to be in use, how much of the data it needs is ready and the KPI it moves. Printed in Core, so a Core block never reads an Optional block's
 * table. Nothing here asks the learner to calculate: the panel does that and says what it means.
 */
const fmt = (n: number) => num(n, { maximumFractionDigits: 1 });
const kpiValue = (n: number, unit: string) => (unit === "%" ? `${fmt(n)}${tt("%", " %")}` : unit === "€" ? euro(n) : `${fmt(n)} ${unit}`);

/** Where each printed figure sits, so a clue can flash its source. */
export const TODAY_ID = { kpi: (id: string) => `r2fig-kpi-${id}`, item: (id: string) => `r2fig-item-${id}` } as const;

/** The facts printed on every item card before the learner decides: what it moves, how much of its data is ready, how long it takes. */
export function ArchFacts({ id }: { id: ArchId }) {
  const p = PANEL[id];
  const a = ARCH_BY_ID[id];
  return (
    <dl className="grid gap-x-4 gap-y-1 rounded-md border border-line bg-mist/40 px-3 py-2 text-caption sm:grid-cols-3">
      <div>
        <dt className="smallcaps text-ash">{tt("Moves", "Bewegt")}</dt>
        <dd className="text-ink">{p.moves}</dd>
      </div>
      <div>
        <dt className="smallcaps text-ash">{tt("Data it needs, tracked and clean today", "Daten, die es braucht, heute erfasst und sauber")}</dt>
        <dd className="text-ink">
          {p.data === null ? tt("none: it can start without data", "keine: Es kann ohne Daten starten") : <span className="tnum font-semibold">{`${p.data}${tt("%", " %")}`}</span>}
          {p.blackBox ? ` · ${tt("its results are not shown", "seine Ergebnisse werden nicht gezeigt")}` : ""}
        </dd>
      </div>
      <div>
        <dt className="smallcaps text-ash">{tt("Time to be in use", "Zeit bis zum Einsatz")}</dt>
        <dd className="text-ink">
          <span className="tnum font-semibold">{tt(`${a.weeks} weeks`, `${a.weeks} Wochen`)}</span> · {tt(`${monthsOf(id)} months`, `${monthsOf(id)} Monate`)}
        </dd>
      </div>
    </dl>
  );
}

/** What LiveConnect looks like today, printed once so the frame never has to read an Optional block's table (CLAUDE.md #40). */
export function TodayTable() {
  return (
    <div id="r2-today" className="space-y-3 rounded-lg border border-line bg-canvas p-3 text-caption">
      <p className="smallcaps">{tt("The numbers today · used in Step A and Step B", "Die Zahlen heute · genutzt in Schritt A und Schritt B")}</p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[34rem] text-left">
          <thead>
            <tr className="text-ash">
              <th className="py-1 pr-3 font-normal">{tt("Item", "Punkt")}</th>
              <th className="py-1 pr-3 font-normal">{tt("Cost", "Kosten")}</th>
              <th className="py-1 pr-3 font-normal">{tt("To be in use", "Bis zum Einsatz")}</th>
              <th className="py-1 pr-3 font-normal">{tt("Data ready", "Daten bereit")}</th>
              <th className="py-1 font-normal">{tt("It moves", "Es bewegt")}</th>
            </tr>
          </thead>
          <tbody>
            {ARCH.map((a) => (
              <tr key={a.id} id={TODAY_ID.item(a.id)} className="border-t border-line align-top">
                <td className="py-1 pr-3 text-ink">{a.name}</td>
                <td className="tnum py-1 pr-3 font-semibold text-ink">{euro(a.cost)}</td>
                <td className="tnum py-1 pr-3 text-ink">{tt(`${a.weeks} weeks`, `${a.weeks} Wochen`)}</td>
                <td className="tnum py-1 pr-3 font-semibold text-ink">{PANEL[a.id].data === null ? "—" : `${PANEL[a.id].data}${tt("%", " %")}`}</td>
                <td className="py-1 text-ink">{PANEL[a.id].named ? PANEL[a.id].moves : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[22rem] text-left">
          <thead>
            <tr className="text-ash">
              <th className="py-1 pr-3 font-normal">{tt("Customer figure", "Kundenzahl")}</th>
              <th className="py-1 pr-3 font-normal">{tt("Today", "Heute")}</th>
              <th className="py-1 font-normal">{tt("Aim", "Ziel")}</th>
            </tr>
          </thead>
          <tbody>
            {KPIS.filter((k) => k.behaviour).map((k) => (
              <tr key={k.id} id={TODAY_ID.kpi(k.id)} className="border-t border-line">
                <td className="py-1 pr-3 text-ink">{k.label}</td>
                <td className="tnum py-1 pr-3 font-semibold text-ink">{kpiValue(k.baseline, k.unit)}</td>
                <td className="tnum py-1 font-semibold text-ink">{KPI_AIM[k.id as KpiId] !== undefined ? kpiValue(KPI_AIM[k.id as KpiId]!, k.unit) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-ash">
        {tt(
          `Case assumptions. “Data ready” is the share of the interactions an item needs that are tracked and clean today; an engine should start on at least ${READY_BAR}%. The plan has ${R2_MONTHS} months, and an item is in use after its weeks to be in use.`,
          `Fallannahmen. „Daten bereit“ ist der Anteil der Interaktionen, die ein Punkt braucht und die heute erfasst und sauber sind; eine Engine sollte auf mindestens ${READY_BAR} % starten. Der Plan hat ${R2_MONTHS} Monate, und ein Punkt ist nach seinen Wochen bis zum Einsatz im Einsatz.`,
        )}
      </p>
    </div>
  );
}
