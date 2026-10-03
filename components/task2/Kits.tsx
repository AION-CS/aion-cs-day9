"use client";

import { useState } from "react";
import { RevealHint } from "@/components/ui/RevealHint";
import { SentenceKit } from "@/components/ui/SentenceKit";
import type { KitRow } from "@/components/ui/SentenceKit";
import { scrollToAndFlash } from "@/lib/flash";
import { ARCH_BY_ID, BASELINE_ITEM, KPIS, KPI_BY_ID, OWNERS, R2_MONTHS } from "@/data/route2";
import type { ArchId, KpiId } from "@/data/route2";
import { ARCH_EXTRA, ASSUMPTION_KIT, KPI_AIM, UNIT_VALUE, payText, pickupWhen, waitWhy } from "@/data/route2Extra";
import { assumptionSign, monthOf, paybackCount, pickupAction, pickupSentence, triggerNumber, tripNumber, withUnit, worse } from "@/lib/r2Numbers";
import { Gloss } from "@/lib/glossify";
import { euro, num, tt } from "@/lib/lang";
import { IDS } from "@/lib/missing";
import type { R2State } from "@/store/useStore";

/**
 * The numbers Route 2 shows (CLAUDE.md #44): every number a learner writes is shown with the reason it is that number and where each input is
 * printed (a button to its row), and a button puts it into the answer. Nothing here asks the learner to calculate; the material (Materi B5)
 * teaches how such numbers are found so the learner can say why they chose one. The numbers come from `lib/r2Numbers.ts`, the same place the
 * model answers and the mentor's worked answers read them from.
 */
const fmt = (n: number) => num(n, { maximumFractionDigits: 1 });

/** Where each printed figure sits, so a kit entry can flash its source. */
export const TODAY_ID = { kpi: (id: string) => `r2fig-kpi-${id}`, unit: "r2fig-unit" } as const;

const halfDetail = (today: string, aim: string, n: string) => `${today} + (${aim} − ${today}) ÷ 2 = ${n}`;

/** The trigger of one funded item: four slots, each with what to write, why and where its numbers are printed. */
export function TriggerKitFor({ id, r2, value, onChange }: { id: ArchId; r2: R2State; value: string; onChange: (v: string) => void }) {
  const x = ARCH_EXTRA[id];
  const a = ARCH_BY_ID[id];
  const start = r2.start[id];
  const n = triggerNumber(id);
  const owner = r2.owner[id] ? OWNERS[r2.owner[id]!] : null;
  const rows: KitRow[] = [
    {
      token: tt("[metric]", "[Kennzahl]"),
      title: tt("The metric: what you count", "Die Kennzahl: was Sie zählen"),
      what: tt("about customers or a result, not about your own activity", "über Kunden oder ein Ergebnis, nicht über Ihre eigene Aktivität"),
      options: [{ text: x.metric, why: tt("This is the one figure the item is meant to move, printed on its card. A trigger watches the item's own effect, not how many meetings or e-mails it produced.", "Das ist die eine Zahl, die der Punkt bewegen soll, gedruckt auf seiner Karte. Ein Trigger beobachtet die Wirkung des Punkts selbst, nicht wie viele Meetings oder E-Mails er erzeugt hat.") }],
      sources: [{ label: tt("The figure this item moves", "Die Zahl, die dieser Punkt bewegt"), value: x.metric, target: IDS.arch(id) }],
    },
    {
      token: tt("[worse than]", "[schlechter als]"),
      title: tt("Worse than: the number", "Schlechter als: die Zahl"),
      what: tt("halfway between today and the aim, both printed on the card", "die Hälfte des Weges zwischen heute und Ziel, beide auf der Karte gedruckt"),
      detail: halfDetail(withUnit(id, x.today), withUnit(id, x.aim), withUnit(id, n)),
      options: [
        {
          text: worse(id, n),
          why:
            x.better === "up"
              ? tt("Below the halfway mark, the item has delivered less than half of what it was bought for, so it is time to act. Below today's figure it would have done nothing at all.", "Unter der Hälfte des Weges hat der Punkt weniger als die Hälfte von dem geliefert, wofür er gekauft wurde, also ist es Zeit zu handeln. Unter dem heutigen Wert hätte er gar nichts bewirkt.")
              : tt("This is a limit, not an aim: above the halfway mark between today and the limit still accepted, acting is cheap; at the limit it is late.", "Das ist eine Grenze, kein Ziel: Über der Hälfte des Weges zwischen heute und der noch akzeptierten Grenze ist Handeln günstig; an der Grenze ist es spät."),
        },
      ],
      sources: [
        { label: tt("Today", "Heute"), value: withUnit(id, x.today), target: IDS.arch(id) },
        { label: x.aimWord === "aim" || x.aimWord === "Ziel" ? tt("The aim", "Das Ziel") : tt("The limit still accepted", "Die noch akzeptierte Grenze"), value: withUnit(id, x.aim), target: IDS.arch(id) },
      ],
    },
    {
      token: tt("[month]", "[Monat]"),
      title: tt("By month: when it can first be read", "Bis Monat: wann er sich zuerst lesen lässt"),
      what: tt(`never later than month ${R2_MONTHS}`, `nie später als Monat ${R2_MONTHS}`),
      detail: start == null ? undefined : `${tt("month", "Monat")} ${monthOf(id, start)} = ${start} + ${a.weeks} ${tt("weeks", "Wochen")} ÷ 4 ${tt("rounded up", "aufgerundet")}`,
      notReady: start == null ? tt("Choose this item's start month first (above); the month it can be read follows from it.", "Wählen Sie zuerst den Startmonat dieses Punkts (oben); der Monat, in dem er sich lesen lässt, folgt daraus.") : undefined,
      options: start == null ? [] : [{ text: String(monthOf(id, start)), why: tt("A figure can only be read once the item is in use. It is in use after the weeks it needs, counted in months from its start.", "Eine Zahl lässt sich erst lesen, wenn der Punkt im Einsatz ist. Das ist nach den Wochen, die er braucht, in Monaten ab seinem Start gerechnet.") }],
      sources: [
        { label: tt("Start month you chose", "Von Ihnen gewählter Startmonat"), value: start == null ? "—" : String(start), target: `start-${id}` },
        { label: tt("Weeks until it is in use", "Wochen bis zum Einsatz"), value: String(a.weeks), target: IDS.arch(id) },
      ],
    },
    {
      token: tt("[action]", "[Aktion]"),
      title: tt("The action: what the owner does alone", "Die Aktion: was der Owner allein tut"),
      what: tt("change this one item, not the whole system", "diesen einen Punkt ändern, nicht das ganze System"),
      options: x.actions,
      sources: [{ label: tt("The owner you chose for this item", "Der Owner, den Sie für diesen Punkt gewählt haben"), value: owner ? owner.name : tt("not chosen yet", "noch nicht gewählt"), target: `owner-${id}` }],
    },
  ];
  return (
    <SentenceKit
      id={`trigger-kit-${id}`}
      label={tt("Show the trigger kit", "Den Trigger-Baukasten zeigen")}
      intro={tt(
        "A trigger is one sentence with four parts. Each part below says what to write, why, and where its numbers are printed. Put them into the sentence one at a time and read it grow; you can edit it freely. A different choice is fine if you say why.",
        "Ein Trigger ist ein Satz mit vier Teilen. Jeder Teil unten sagt, was Sie schreiben, warum, und wo seine Zahlen gedruckt stehen. Übernehmen Sie sie einzeln in den Satz und lesen Sie mit, wie er wächst; Sie können ihn frei ändern. Eine andere Wahl ist in Ordnung, wenn Sie sagen, warum.",
      )}
      template={tt("If [metric] [worse than] by month [month], then [action].", "Wenn [Kennzahl] bis Monat [Monat] [schlechter als], [Aktion].")}
      value={value}
      onChange={onChange}
      rows={rows}
    />
  );
}

/** The pickup point: which item left out, and the sentence that says when it is funded after all. */
export function PickupKitFor({ notFunded, value, onChange }: { notFunded: ArchId[]; value: string; onChange: (v: string) => void }) {
  const [item, setItem] = useState<ArchId | null>(null);
  const id = item && notFunded.includes(item) ? item : notFunded[0];
  if (!id) return null;
  const a = ARCH_BY_ID[id];
  const x = ARCH_EXTRA[id];
  const n = paybackCount(id);
  const rows: KitRow[] = [
    {
      token: tt("[number]", "[Zahl]"),
      title: tt("How many: the cost of waiting", "Wie viele: die Kosten des Wartens"),
      what: tt("the count at which waiting has cost as much as the item", "die Zahl, bei der das Warten so viel gekostet hat wie der Punkt"),
      detail: `${n} = ${euro(a.cost)} ÷ ${euro(UNIT_VALUE.value)} ${tt("rounded up", "aufgerundet")}`,
      options: [{ text: String(n), why: waitWhy(n) }],
      sources: [
        { label: tt(`Cost of ${a.name}`, `Kosten von ${a.name}`), value: euro(a.cost), target: IDS.arch(id) },
        { label: UNIT_VALUE.label, value: euro(UNIT_VALUE.value), target: TODAY_ID.unit },
      ],
    },
    {
      token: tt("[month]", "[Monat]"),
      title: tt("By month: when you look again", "Bis Monat: wann Sie wieder hinsehen"),
      what: tt("the plan's last month or earlier", "der letzte Monat des Plans oder früher"),
      options: [{ text: String(R2_MONTHS), why: tt("Look no later than the plan's last month, so there is still time to act on what you see.", "Schauen Sie spätestens im letzten Monat des Plans hin, damit noch Zeit bleibt, auf das Gesehene zu reagieren.") }],
      sources: [{ label: tt("The plan's last month", "Der letzte Monat des Plans"), value: String(R2_MONTHS), target: "task-2" }],
    },
    {
      token: tt("[reason]", "[Grund]"),
      title: tt("The reason that counts", "Der Grund, der zählt"),
      what: tt("only cases the item would have kept or won", "nur Fälle, die der Punkt gehalten oder gewonnen hätte"),
      options: [{ text: x.reason, why: tt("Count only the cases that are lost for the reason this item would fix. Others would have been lost anyway and would not show that waiting cost something.", "Zählen Sie nur die Fälle, die aus dem Grund verloren gehen, den dieser Punkt beheben würde. Andere wären ohnehin verloren gegangen und würden nicht zeigen, dass das Warten etwas gekostet hat.") }],
      sources: [{ label: tt("What the item does", "Was der Punkt tut"), value: x.scene.split(". ")[0], target: IDS.arch(id) }],
    },
    {
      token: tt("[action]", "[Aktion]"),
      title: tt("The action: what happens then", "Die Aktion: was dann passiert"),
      what: tt("the next step for the item you left out", "der nächste Schritt für den weggelassenen Punkt"),
      options: [{ text: pickupAction(id), why: tt("A pickup point is the agreed moment when a postponed item gets its money, or its next step. Saying it now turns “not now” into a plan, not a no.", "Ein Pickup Point ist der vereinbarte Moment, in dem ein zurückgestellter Punkt sein Geld oder seinen nächsten Schritt bekommt. Es jetzt zu sagen, macht aus „jetzt nicht“ einen Plan, kein Nein.") }],
    },
  ];
  const chooser =
    notFunded.length > 1 ? (
      <div role="group" aria-label={tt("The item the pickup point is for", "Der Punkt, für den der Pickup Point gilt")} className="flex flex-wrap items-center gap-1.5">
        <span className="smallcaps text-ash">{tt("The item you left out", "Der weggelassene Punkt")}</span>
        {notFunded.map((y) => (
          <button key={y} type="button" aria-pressed={y === id} onClick={() => setItem(y)} className={y === id ? "btn btn-sm border border-accent bg-accentSoft" : "btn-ghost btn-sm"}>
            {ARCH_BY_ID[y].name}
          </button>
        ))}
      </div>
    ) : (
      <p className="text-ash">
        {tt("The item you left out: ", "Der weggelassene Punkt: ")}
        <strong className="text-ink">{a.name}</strong>
      </p>
    );
  return (
    <SentenceKit
      id="pickup-kit"
      label={tt("Show the pickup point kit", "Den Pickup-Point-Baukasten zeigen")}
      intro={tt(
        "A pickup point is one sentence: when this many cases have been lost for the reason an item would fix, you take its next step after all. Choose which item you left out, then put the parts into the sentence.",
        "Ein Pickup Point ist ein Satz: Wenn so viele Fälle aus dem Grund verloren gegangen sind, den ein Punkt beheben würde, gehen Sie seinen nächsten Schritt doch. Wählen Sie den weggelassenen Punkt und übernehmen Sie dann die Teile in den Satz.",
      )}
      template={tt(`${pickupWhen("[number]", "[month]", "[reason]")}, then [action].`, `${pickupWhen("[Zahl]", "[Monat]", "[Grund]")}, [Aktion].`)}
      value={value}
      onChange={onChange}
      rows={rows}
      top={chooser}
    />
  );
}

/** One assumption: "I assume … I am wrong if …", with the doubts the case prints and the sign you can watch yourself (CLAUDE.md #41). */
export function AssumptionKitFor({ index, value, onChange }: { index: number; value: string; onChange: (v: string) => void }) {
  const rows: KitRow[] = [
    {
      token: tt("[assumption]", "[Annahme]"),
      title: tt("The assumption: what is still uncertain", "Die Annahme: was noch unsicher ist"),
      what: tt("one thing your plan bets on", "eine Sache, auf die Ihr Plan setzt"),
      options: ASSUMPTION_KIT.map((k) => ({ text: k.text, why: k.why })),
      sources: [
        { label: tt("The uncertain data and what you fund", "Die unsichere Datenlage und was Sie finanzieren"), value: tt("see the item cards", "siehe die Karten der Punkte"), target: IDS.archTotal },
      ],
    },
    {
      token: tt("[sign]", "[Anzeichen]"),
      title: tt("The sign: a number you can watch yourself", "Das Anzeichen: eine Zahl, die Sie selbst beobachten können"),
      what: tt("halfway between today and the aim, and the month it can first be read", "die Hälfte des Weges zwischen heute und Ziel, und der Monat, in dem sie sich zuerst lesen lässt"),
      options: ASSUMPTION_KIT.map((k, i) => {
        const s = assumptionSign(i);
        return { text: s.text, why: `${k.signWhy} (${s.steps})` };
      }),
      sources: [
        ...KPIS.filter((k) => k.behaviour && KPI_AIM[k.id as KpiId] !== undefined).map((k) => ({ label: `${k.label}`, value: `${fmt(k.baseline)}${k.unit === "%" ? tt("%", " %") : k.unit === "€" ? "€" : ` ${k.unit}`}`, target: TODAY_ID.kpi(k.id) })),
      ],
    },
  ];
  return (
    <SentenceKit
      id={`assumption-kit-${index}`}
      label={tt("Show the numbers you can use", "Die Zahlen zeigen, die Sie nutzen können")}
      intro={tt(
        "An assumption is two sentences: what you assume is true although it is still uncertain, and the sign that would show you were wrong, a number you can watch yourself, by a month. Pick the parts that match your plan and put them into the sentence; a different one is fine with a reason.",
        "Eine Annahme sind zwei Sätze: was Sie als wahr annehmen, obwohl es noch unsicher ist, und das Anzeichen, das zeigen würde, dass Sie falsch lagen, eine Zahl, die Sie selbst beobachten können, bis zu einem Monat. Wählen Sie die Teile, die zu Ihrem Plan passen, und übernehmen Sie sie in den Satz; ein anderer ist mit Begründung in Ordnung.",
      )}
      template={tt("I assume [assumption]. I am wrong if [sign].", "Ich nehme an, [Annahme]. Das ist falsch, wenn [Anzeichen].")}
      value={value}
      onChange={onChange}
      rows={rows}
    />
  );
}

/** The tripwire threshold: the number for the chosen metric, halfway between today's baseline and its aim. */
export function TripNumberHint({ kpi, onUse }: { kpi: KpiId | null; onUse: (v: string) => void }) {
  const k = kpi ? KPI_BY_ID[kpi] : null;
  const n = kpi ? tripNumber(kpi) : null;
  const aim = kpi ? KPI_AIM[kpi] : undefined;
  return (
    <RevealHint id="trip-number" label={tt("Show the number you can use", "Die Zahl zeigen, die Sie nutzen können")} title={tt("The number · found from the printed figures", "Die Zahl · aus den gedruckten Zahlen gefunden")}>
      <div className="space-y-2 text-caption text-ink">
        {!k || n === null || aim === undefined ? (
          <p className="text-ash">{tt("Choose a metric that measures how customers behave first; the number follows from its printed figures.", "Wählen Sie zuerst eine Kennzahl, die misst, wie Kunden sich verhalten; die Zahl folgt aus ihren gedruckten Zahlen.")}</p>
        ) : (
          <>
            <p className="tnum text-ash">
              {fmt(n)} = {halfDetail(fmt(k.baseline), fmt(aim), fmt(n))}
            </p>
            <p>
              <span className="smallcaps mr-1.5 text-accent">{tt("Why", "Warum")}</span>
              <Gloss>{tt("Halfway between today and the aim is the least that shows a real change. Today's figure alone would show nothing; the aim itself is a hope, not yet a warning.", "Die Hälfte des Weges zwischen heute und Ziel ist das Mindeste, das eine echte Veränderung zeigt. Der heutige Wert allein würde nichts zeigen; das Ziel selbst ist eine Hoffnung, noch keine Warnung.")}</Gloss>
            </p>
            <ul className="space-y-0.5">
              <li>
                <button type="button" onClick={() => scrollToAndFlash(TODAY_ID.kpi(k.id), "ref")} className="flex min-h-[36px] w-full flex-wrap items-baseline gap-x-2 rounded px-2 py-1 text-left hover:bg-accentSoft">
                  <span>{tt("Today", "Heute")}:</span>
                  <span className="tnum font-semibold">{fmt(k.baseline)}</span>
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToAndFlash(TODAY_ID.kpi(k.id), "ref")} className="flex min-h-[36px] w-full flex-wrap items-baseline gap-x-2 rounded px-2 py-1 text-left hover:bg-accentSoft">
                  <span>{tt("The aim", "Das Ziel")}:</span>
                  <span className="tnum font-semibold">{fmt(aim)}</span>
                </button>
              </li>
            </ul>
            <button type="button" onClick={() => onUse(String(n))} className="btn-ghost btn-sm">
              {tt("Put into the threshold", "In den Schwellenwert übernehmen")}
            </button>
          </>
        )}
      </div>
    </RevealHint>
  );
}

/** The facts printed on every item card before the learner decides: what it moves, what it needs first, what it must keep to pay back. */
export function ArchFacts({ id }: { id: ArchId }) {
  const x = ARCH_EXTRA[id];
  const n = paybackCount(id);
  const word = x.aimWord === "aim" || x.aimWord === "Ziel" ? tt("aim", "Ziel") : tt("limit still accepted", "noch akzeptierte Grenze");
  return (
    <dl className="grid gap-x-4 gap-y-1 rounded-md border border-line bg-mist/40 px-3 py-2 text-caption sm:grid-cols-3">
      <div>
        <dt className="smallcaps text-ash">{tt("Aims to move", "Soll bewegen")}</dt>
        <dd className="text-ink">
          {x.metric}: <span className="tnum font-semibold">{withUnit(id, x.today)}</span> {tt("today", "heute")} → <span className="tnum font-semibold">{withUnit(id, x.aim)}</span> ({word})
        </dd>
      </div>
      <div>
        <dt className="smallcaps text-ash">{tt("Needs first", "Braucht zuerst")}</dt>
        <dd className="text-ink">{id === BASELINE_ITEM ? tt("nothing: everything else is measured by it", "nichts: alles andere wird daran gemessen") : tt("the KPI system in use, so its effect can be measured", "das KPI-System im Einsatz, damit sich seine Wirkung messen lässt")}</dd>
      </div>
      <div>
        <dt className="smallcaps text-ash">{UNIT_VALUE.payLabel}</dt>
        <dd className="text-ink">
          <span className="tnum font-semibold">{n}</span> {payText(ARCH_BY_ID[id].cost, n)}
        </dd>
      </div>
    </dl>
  );
}

/** What AIConnect looks like today, printed once so a Core block never has to read an Optional block's table (CLAUDE.md #40, #42). */
/** A KPI value with its unit as the KPI table prints it: 4 %, €9,600, 240 minutes. */
const kpiValue = (n: number, unit: string) => (unit === "%" ? `${fmt(n)}${tt("%", " %")}` : unit === "€" ? euro(n) : `${fmt(n)} ${unit}`);

export function TodayTable() {
  return (
    <div id="r2-today" className="rounded-lg border border-line bg-canvas p-3 text-caption">
      <p className="smallcaps">{tt("The numbers today · used in Blocks 3.5 and 3.6", "Die Zahlen heute · genutzt in den Blöcken 3.5 und 3.6")}</p>
      <div className="mt-1 overflow-x-auto">
        <table className="w-full min-w-[26rem] text-left">
          <thead>
            <tr className="text-ash">
              <th className="py-1 pr-3 font-normal">{tt("Figure", "Zahl")}</th>
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
            <tr id={TODAY_ID.unit} className="border-t border-line">
              <td className="py-1 pr-3 text-ink">{UNIT_VALUE.label}</td>
              <td className="tnum py-1 pr-3 font-semibold text-ink">{euro(UNIT_VALUE.value)}</td>
              <td className="py-1 text-ash">—</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-1 text-ash">{tt("Case assumptions. The aim of each item (and the figure it moves) is printed on its own card in Block 3.5.", "Fallannahmen. Das Ziel jedes Punkts (und die Zahl, die er bewegt) steht auf seiner eigenen Karte in Block 3.5.")}</p>
    </div>
  );
}

/** The model trigger / pickup sentences are generated, never retyped; this is only re-exported for the mentor files. */
export { pickupSentence };
