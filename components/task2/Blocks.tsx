"use client";

import clsx from "clsx";
import { AnswerBlock } from "@/components/ui/AnswerBlock";
import { AnswerKey } from "@/components/ui/AnswerKey";
import { BlockMissing } from "@/components/ui/BlockMissing";
import { ExampleAnswer } from "@/components/ui/ExampleAnswer";
import { BudgetBar } from "@/components/ui/BudgetBar";
import { CheckBar, OptionList, Reading, ScorePick, TextBox } from "@/components/ui/Inputs";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { MentorGuide } from "@/components/ui/MentorGuide";
import { RevealHint } from "@/components/ui/RevealHint";
import { WritingHelp } from "@/components/ui/WritingHelp";
import { ArchFacts, AssumptionKitFor, PickupKitFor, TriggerKitFor, TripNumberHint } from "@/components/task2/Kits";
import { ARCH_EXTRA, KPI_AIM } from "@/data/route2Extra";
import {
  ACTION_LABEL,
  ARCH,
  ARCH_BY_ID,
  ARCH_IDS,
  BASELINE_ITEM,
  BOARD_CHALLENGE,
  CADENCE_LABEL,
  CASES_MIN,
  COMPS,
  COMP_BY_ID,
  COMP_CHOOSE,
  COMP_IDS,
  COST_SHAPE_LABEL,
  CRITERIA,
  CRIT_IDS,
  DECISIONS,
  KPIS,
  LIFT_ACT,
  LIFT_WATCH,
  LOGIC_OWNERS,
  LOGIC_OWNER_LABEL,
  OWNERS,
  OWNER_IDS,
  PRINCIPLES,
  PRINCIPLE_IDS,
  QUALITY_BAR,
  R2_BASELINE_NOTE,
  R2_BUDGET,
  R2_MONTHS,
  SITUATIONS,
  SOURCES,
  USE_LABEL,
} from "@/data/route2";
import type { Action, ArchId, CompId, Criterion, DecisionId, KpiId, LogicOwner, OwnerId, PrincipleId, SitId, SourceId, Use } from "@/data/route2";
import { archCost, archLeft, archOver, blackBoxFunded, compTotal, earlyCount, funded, logicHolds, principlesHold, ratingFlags, seqRules, sourceHolds, tripFlagsOf } from "@/lib/checks";
import { scrollToAndFlash } from "@/lib/flash";
import { Gloss } from "@/lib/glossify";
import { euro, num, pct, tt } from "@/lib/lang";
import { IDS } from "@/lib/missing";
import { assumptionGuide, challengeGuide, greatestGuide, postponedGuide, principleTextGuide, pickupGuide, triggerGuide } from "@/lib/mentorGuide";
import { compKey, decisionKey, logicKey, ownerKey, principleKey, sourceKey, tripKey } from "@/lib/answerKey";
import { MIN_LINE } from "@/lib/progress";
import { BLOCK_MINUTES } from "@/lib/routes";
import { useStore } from "@/store/useStore";
import type { Score } from "@/store/useStore";

const MONTHS_LIST = Array.from({ length: R2_MONTHS }, (_, i) => i + 1);
const PRINCIPLE_CHOOSE = 3;
const USES: Use[] = ["core", "later", "leave"];
const ACTIONS: Action[] = ["intervene", "watch", "none"];

/* ------------------------------------------------------------------ Block 3.1 */

export function Block31() {
  const r2 = useStore((s) => s.r2);
  const patch = useStore((s) => s.patchR2);
  const mentor = useStore((s) => s.mentorUnlocked);
  const toggle = (c: PrincipleId) => patch((s) => ({ principles: s.principles.includes(c) ? s.principles.filter((x) => x !== c) : [...s.principles, c], principleFlagged: false }));
  const check = () =>
    patch((s) => {
      const h = principlesHold(s);
      return { checks: s.checks + 1, principleFlagged: !(h.defs && h.rules), principleClue: false };
    });
  const h = principlesHold(r2);
  return (
    <AnswerBlock
      id="block-3-1"
      title={tt("Block 3.1 · The target vision of a real-time retention system", "Block 3.1 · Das Zielbild eines Echtzeit-Bindungssystems")}
      kind="OBJECTIVE + JUDGED"
      minutes={BLOCK_MINUTES["3.1"]}
      findIt={tt("Route 2 → Task 2 → the six principles below. Answer by choosing three and saying what each means for LiveConnect.", "Route 2 → Task 2 → die sechs Prinzipien unten. Antworten Sie, indem Sie drei wählen und sagen, was jedes für LiveConnect bedeutet.")}
    >
      <MaterialRefs refs={["B1"]} />
      <div id={IDS.principlePick} className={clsx("space-y-2 rounded-lg p-1", r2.principleFlagged && "is-flagged")}>
        <p className="text-body text-ink">
          <Gloss>{tt("Choose the three principles your real-time system will stand on. Test each against Materi B1: does it connect speed and quality across every channel, rather than speed in one channel and chaos in the others?", "Wählen Sie die drei Prinzipien, auf denen Ihr Echtzeitsystem stehen wird. Prüfen Sie jedes an Materi B1: Verbindet es Tempo und Qualität über jeden Kanal, statt Tempo in einem Kanal und Chaos in den anderen?")}</Gloss>
        </p>
        <OptionList<PrincipleId>
          multi
          cols={2}
          label={tt("Principles", "Prinzipien")}
          value={r2.principles}
          onChange={toggle}
          disabledIds={r2.principles.length >= PRINCIPLE_CHOOSE ? PRINCIPLE_IDS : []}
          onDisabledClick={() => scrollToAndFlash(IDS.principlePick, "warn")}
          options={PRINCIPLE_IDS.map((c) => ({ id: c, label: PRINCIPLES[c].name, sub: PRINCIPLES[c].means }))}
        />
        <p role="status" className="text-caption text-ash">
          {tt(`${r2.principles.length} of ${PRINCIPLE_CHOOSE} chosen.`, `${r2.principles.length} von ${PRINCIPLE_CHOOSE} gewählt.`)}
          {r2.principles.length >= PRINCIPLE_CHOOSE ? tt(" To choose another, first remove one.", " Um ein anderes zu wählen, entfernen Sie zuerst eines.") : ""}
        </p>
        {r2.principleFlagged && (
          <p className="text-caption text-ink">
            <span className="smallcaps mr-1 text-accent">{tt("Check", "Prüfung")}</span>
            {tt(`${[h.defs, h.rules].filter(Boolean).length} of the 2 foundations a real-time system needs are among your three. `, `${[h.defs, h.rules].filter(Boolean).length} der 2 Fundamente, die ein Echtzeitsystem braucht, sind unter Ihren dreien. `)}
            {r2.principleClue ? (
              tt("Which principle lets every team see the same interaction as it happens, and which makes sure every central point is answered in a set time by a named person?", "Welches Prinzip lässt jedes Team dieselbe Interaktion sehen, während sie passiert, und welches stellt sicher, dass jeder zentrale Punkt in festgelegter Zeit von einer benannten Person beantwortet wird?")
            ) : (
              <button type="button" onClick={() => patch({ principleClue: true })} className="btn-ghost btn-sm border-gold">
                {tt("Show clue", "Hinweis zeigen")}
              </button>
            )}
          </p>
        )}
      </div>
      {r2.principles.map((c) => (
        <div key={c} className="space-y-1.5">
          <TextBox
            id={IDS.principle(c)}
            label={tt(`${PRINCIPLES[c].name}: what it means at LiveConnect`, `${PRINCIPLES[c].name}: was es bei LiveConnect bedeutet`)}
            help={tt(`One or two sentences: what changes for LiveConnect's teams or customers, and which problem of the brief it answers. At least ${MIN_LINE} characters.`, `Ein oder zwei Sätze: was sich für Teams oder Kunden von LiveConnect ändert, und welches Problem des Auftrags es beantwortet. Mindestens ${MIN_LINE} Zeichen.`)}
            value={r2.principleText[c] ?? ""}
            onChange={(v) => patch((s) => ({ principleText: { ...s.principleText, [c]: v } }))}
            min={MIN_LINE}
            rows={2}
          >
            <WritingHelp
              id={`principle-kit-${c}`}
              refs={[
                { label: tt("The principle as printed", "Das Prinzip, wie gedruckt"), value: PRINCIPLES[c].means, target: IDS.principlePick },
                { label: tt("The problems the brief names", "Die Probleme, die der Auftrag nennt"), value: tt("interaction not coordinated · responses too slow · automation and personalisation potential unused", "nicht koordinierte Interaktion · zu langsame Reaktionen · ungenutztes Potenzial von Automatisierung und Personalisierung"), target: "task-2" },
              ]}
              steps={[
                tt("Say what changes for a team or a customer once everyone works by this principle.", "Sagen Sie, was sich für ein Team oder einen Kunden ändert, wenn alle nach diesem Prinzip arbeiten."),
                tt("Name the problem of the brief it answers.", "Nennen Sie das Problem des Auftrags, das es beantwortet."),
              ]}
            />
          </TextBox>
          <ExampleAnswer id={`principle-example-${c}`} guide={principleTextGuide(c)} />
          {mentor && <MentorGuide guide={principleTextGuide(c)} />}
        </div>
      ))}
      <CheckBar onCheck={check} checkLabel={tt("Check my principles", "Meine Prinzipien prüfen")} checks={r2.checks} />
      <AnswerKey block={principleKey()} />
      <BlockMissing block="3.1" route={2} />
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 3.2 */

export function Block32() {
  const r2 = useStore((s) => s.r2);
  const patch = useStore((s) => s.patchR2);
  const setUse = (id: SourceId, u: Use) => patch((s) => ({ sources: { ...s.sources, [id]: u }, sourceResult: null }));
  const check = () => patch((s) => ({ checks: s.checks + 1, sourceResult: sourceHolds(s), sourceClue: false }));
  return (
    <AnswerBlock
      id="block-3-2"
      title={tt("Block 3.2 · Definition of central interaction points", "Block 3.2 · Festlegung zentraler Interaktionspunkte")}
      kind="OBJECTIVE"
      minutes={BLOCK_MINUTES["3.2"]}
      findIt={tt("Route 2 → Task 2 → the eight interaction points below, each with the decision the customer takes there and how much of it is tracked today. Answer by choosing a decision for each.", "Route 2 → Task 2 → die acht Interaktionspunkte unten, jeder mit der Entscheidung, die der Kunde dort trifft, und wie viel davon heute erfasst wird. Antworten Sie, indem Sie für jeden eine Entscheidung wählen.")}
    >
      <MaterialRefs refs={["B2"]} />
      <p className="text-body text-ink">
        <Gloss>{tt("For each interaction point decide: central and in real time now, central but fix the tracking first, or not central. Start from the decision the customer takes there, not from how busy the point is.", "Entscheiden Sie für jeden Interaktionspunkt: zentral und jetzt in Echtzeit, zentral, aber zuerst die Erfassung verbessern, oder nicht zentral. Gehen Sie von der Entscheidung aus, die der Kunde dort trifft, nicht davon, wie viel dort los ist.")}</Gloss>
      </p>
      <RevealHint id="source-tests" label={tt("Show the test questions", "Testfragen zeigen")} title={tt("The rule · taught in Materi B2", "Die Regel · aus Materi B2")}>
        <ul className="space-y-1.5 text-caption text-ink">
          <li>{tt("Does the customer take a decision there (buy, ask, renew, cancel)? If not, not central.", "Trifft der Kunde dort eine Entscheidung (kaufen, fragen, verlängern, kündigen)? Wenn nicht, nicht zentral.")}</li>
          <li>{tt(`Is at least ${QUALITY_BAR}% of the interactions there tracked? Then real-time now; if not, fix the tracking first.`, `Werden dort mindestens ${QUALITY_BAR} % der Interaktionen erfasst? Dann jetzt in Echtzeit; wenn nicht, zuerst die Erfassung verbessern.`)}</li>
          <li>{tt("Traffic and cost are not the test: a busy blog with no decision is not central; a quiet renewal notice is.", "Traffic und Kosten sind nicht der Test: Ein viel besuchter Blog ohne Entscheidung ist nicht zentral; ein ruhiger Verlängerungshinweis schon.")}</li>
          <li>
            <MaterialRefs refs={["B2"]} lead={tt("Taught in", "Gelehrt in")} />
          </li>
        </ul>
      </RevealHint>
      {SOURCES.map((s) => (
        <div key={s.id} id={IDS.source(s.id)} className="space-y-2 rounded-lg border border-line bg-paper p-3">
          <p className="font-semibold text-ink">{s.name}</p>
          <p className="text-caption text-ash">
            <span className="font-semibold text-ink">{tt("Customer decision: ", "Entscheidung des Kunden: ")}</span>
            {s.decision ?? tt("none", "keine")} · <span className="font-semibold text-ink">{tt("Tracked: ", "Erfasst: ")}</span>
            {pct(s.complete)} · <span className="font-semibold text-ink">{tt("Cost to connect: ", "Kosten der Anbindung: ")}</span>
            {euro(s.cost)}
          </p>
          <OptionList<Use> label={tt(`Decision on ${s.name}`, `Entscheidung zu ${s.name}`)} value={r2.sources[s.id] ?? null} onChange={(v) => setUse(s.id, v)} options={USES.map((u) => ({ id: u, label: USE_LABEL[u] }))} />
        </div>
      ))}
      <CheckBar onCheck={check} checkLabel={tt("Check my interaction points", "Meine Interaktionspunkte prüfen")} checks={r2.checks} clueShown={r2.sourceClue} onClue={() => patch({ sourceClue: true })} />
      {r2.sourceResult && (
        <Reading>
          {tt(`${r2.sourceResult.holds} of ${r2.sourceResult.total} interaction points are placed by the rule of Materi B2. A check never says which.`, `${r2.sourceResult.holds} von ${r2.sourceResult.total} Interaktionspunkten sind nach der Regel aus Materi B2 eingeordnet. Eine Prüfung sagt nie, welche.`)}
          {r2.sourceClue ? tt(" Clue: first cover the “tracked” figure and ask only whether the customer decides something there; then look at the figure.", " Hinweis: Verdecken Sie zuerst die Zahl bei „Erfasst“ und fragen Sie nur, ob der Kunde dort etwas entscheidet; schauen Sie dann auf die Zahl.") : ""}
        </Reading>
      )}
      <AnswerKey block={sourceKey()} />
      <BlockMissing block="3.2" route={2} />
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 3.3 */

export function Block33() {
  const r2 = useStore((s) => s.r2);
  const patch = useStore((s) => s.patchR2);
  const mentor = useStore((s) => s.mentorUnlocked);
  const toggle = (id: CompId) =>
    patch((s) => {
      const next = s.comps.includes(id) ? s.comps.filter((x) => x !== id) : [...s.comps, id];
      return { comps: next, greatest: s.greatest && next.includes(s.greatest) ? s.greatest : null, rateFlags: [], compResult: null };
    });
  const setRate = (id: CompId, c: Criterion, v: Score) => patch((s) => ({ rate: { ...s.rate, [`${id}.${c}`]: v }, rateFlags: s.rateFlags.filter((x) => x !== `${id}.${c}`) }));
  const check = () => patch((s) => ({ checks: s.checks + 1, rateFlags: ratingFlags(s), compResult: { early: earlyCount(s.comps) } }));
  return (
    <AnswerBlock
      id="block-3-3"
      title={tt("Block 3.3 · A KPI and optimisation system", "Block 3.3 · Ein KPI- und Optimierungssystem")}
      kind="OBJECTIVE + JUDGED"
      minutes={BLOCK_MINUTES["3.3"]}
      findIt={tt("Route 2 → Task 2 → the eight KPI candidates below, each with whether it is linked to value, how often it is counted, whom it covers and how it is collected. Answer by choosing three and rating them on the four tests of Materi B3.", "Route 2 → Task 2 → die acht KPI-Kandidaten unten, jeder damit, ob er mit dem Wert verbunden ist, wie oft er gezählt wird, wen er abdeckt und wie er erhoben wird. Antworten Sie, indem Sie drei wählen und nach den vier Tests aus Materi B3 bewerten.")}
    >
      <MaterialRefs refs={["B3"]} />
      <div id={IDS.compPick} className="space-y-2">
        <OptionList<CompId>
          multi
          label={tt("KPI candidates", "KPI-Kandidaten")}
          value={r2.comps}
          onChange={toggle}
          disabledIds={r2.comps.length >= COMP_CHOOSE ? COMP_IDS : []}
          onDisabledClick={() => scrollToAndFlash(IDS.compPick, "warn")}
          options={COMPS.map((c) => ({
            id: c.id,
            label: c.name,
            sub: `${c.what} ${c.explains ? tt("Linked to value", "Mit dem Wert verbunden") : tt("Not linked to value", "Nicht mit dem Wert verbunden")} · ${CADENCE_LABEL[c.cadence]} · ${c.coversAll ? tt("every customer", "jeder Kunde") : tt("some customers", "einige Kunden")} · ${COST_SHAPE_LABEL[c.costShape]}.`,
          }))}
        />
        <p role="status" className="text-caption text-ash">
          {tt(`${r2.comps.length} of ${COMP_CHOOSE} chosen.`, `${r2.comps.length} von ${COMP_CHOOSE} gewählt.`)}
          {r2.comps.length >= COMP_CHOOSE ? tt(" To choose another, first remove one.", " Um einen anderen zu wählen, entfernen Sie zuerst einen.") : ""}
        </p>
        <RevealHint id="comp-tests" label={tt("Show the test questions", "Testfragen zeigen")} title={tt("The four tests · taught in Materi B3", "Die vier Tests · aus Materi B3")}>
          <ul className="space-y-1.5 text-caption text-ink">
            {CRITERIA.map((c) => (
              <li key={c.id}>
                <span className="font-semibold">{c.name}. </span>
                {c.test} {tt("Low:", "Niedrig:")} {c.low} {tt("High:", "Hoch:")} {c.high}
              </li>
            ))}
            <li>
              <MaterialRefs refs={["B3"]} lead={tt("Taught in", "Gelehrt in")} />
            </li>
          </ul>
        </RevealHint>
      </div>
      {r2.comps.map((id) => {
        const c = COMP_BY_ID[id];
        return (
          <div key={id} id={IDS.comp(id)} className="space-y-3 rounded-lg border border-line bg-paper p-3.5">
            <p className="font-semibold text-ink">
              {c.name} <span className="font-normal text-ash">· {c.explains ? tt("linked to value", "mit dem Wert verbunden") : tt("not linked to value", "nicht mit dem Wert verbunden")} · {CADENCE_LABEL[c.cadence]} · {c.coversAll ? tt("every customer", "jeder Kunde") : tt("some customers", "einige Kunden")} · {COST_SHAPE_LABEL[c.costShape]}</span>
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {CRIT_IDS.map((k) => {
                const key = `${id}.${k}`;
                const flagged = r2.rateFlags.includes(key);
                const crit = CRITERIA.find((x) => x.id === k)!;
                return (
                  <div key={k}>
                    <p className="smallcaps">{crit.name}</p>
                    <ScorePick label={tt(`${crit.name} of ${c.name}`, `${crit.name} von ${c.name}`)} value={r2.rate[key] || 0} onChange={(v) => setRate(id, k, v)} flagged={flagged} />
                    {flagged && <p className="mt-1 text-micro normal-case tracking-normal text-ink">{tt("Higher than the printed facts allow. Read the KPI's line above against this test.", "Höher, als die gedruckten Fakten erlauben. Lesen Sie die Zeile des KPIs oben gegen diesen Test.")}</p>}
                  </div>
                );
              })}
            </div>
            <p className="tnum text-caption text-ink" aria-live="polite">
              {tt("Total of the four tests: ", "Summe der vier Tests: ")}
              <strong>{compTotal(r2, id) || "—"}</strong> / 12
            </p>
          </div>
        );
      })}
      <CheckBar onCheck={check} checkLabel={tt("Check my ratings", "Meine Bewertungen prüfen")} checks={r2.checks} />
      {r2.compResult && (
        <Reading>
          {r2.rateFlags.length > 0
            ? tt(`${r2.rateFlags.length} rating${r2.rateFlags.length === 1 ? " is" : "s are"} higher than the printed facts allow and ${r2.rateFlags.length === 1 ? "is" : "are"} outlined. `, `${r2.rateFlags.length} ${r2.rateFlags.length === 1 ? "Bewertung ist" : "Bewertungen sind"} höher, als die gedruckten Fakten erlauben, und markiert. `)
            : tt("No rating exceeds what the printed facts allow. ", "Keine Bewertung übersteigt, was die gedruckten Fakten erlauben. ")}
          {tt(`${r2.compResult.early} of your ${r2.comps.length} KPIs show a change before the result is lost (weekly or monthly); a management system needs most of them to (Materi B3).`, `${r2.compResult.early} Ihrer ${r2.comps.length} KPIs zeigen eine Veränderung, bevor das Ergebnis verloren ist (wöchentlich oder monatlich); ein Managementsystem braucht die meisten davon so (Materi B3).`)}
        </Reading>
      )}
      <AnswerKey block={compKey()} />
      <div className="space-y-2 border-t border-line pt-3">
        <div id={IDS.greatest}>
          <p className="font-semibold text-ink">{tt("Which of your KPIs has the greatest leverage?", "Welcher Ihrer KPIs hat die größte Hebelwirkung?")}</p>
          {r2.comps.length === 0 ? (
            <p className="text-caption text-ash">{tt("Choose your KPIs above first; nothing is blocked.", "Wählen Sie zuerst oben Ihre KPIs; nichts ist gesperrt.")}</p>
          ) : (
            <OptionList<CompId> label={tt("Greatest leverage", "Größte Hebelwirkung")} value={r2.greatest} onChange={(v) => patch({ greatest: v })} options={r2.comps.map((id) => ({ id, label: COMP_BY_ID[id].name }))} />
          )}
        </div>
        <TextBox
          id={IDS.greatestWhy}
          label={tt("Why this one?", "Warum dieser?")}
          help={tt("Name the tests that decide it and the problem of the brief it answers. At least 40 characters.", "Nennen Sie die Tests, die es entscheiden, und das Problem des Auftrags, das er beantwortet. Mindestens 40 Zeichen.")}
          value={r2.greatestWhy}
          onChange={(v) => patch({ greatestWhy: v })}
          min={40}
          rows={3}
        >
          <WritingHelp
            id="greatest-kit"
            refs={[
              { label: tt("Your three KPIs", "Ihre drei KPIs"), value: r2.comps.map((id) => COMP_BY_ID[id].name).join(" · ") || tt("not chosen yet", "noch nicht gewählt"), target: IDS.compPick },
              { label: tt("The four tests", "Die vier Tests"), value: CRITERIA.map((c) => c.name).join(" · "), target: IDS.compPick },
            ]}
            steps={[
              tt("Name the one KPI and the tests it passes best (linked to value and early together).", "Nennen Sie den einen KPI und die Tests, die er am besten besteht (mit dem Wert verbunden und früh zugleich)."),
              tt("Say which problem of the brief it answers.", "Sagen Sie, welches Problem des Auftrags er beantwortet."),
            ]}
          />
        </TextBox>
        <ExampleAnswer id="greatest-example" guide={greatestGuide()} />
        {mentor && <MentorGuide guide={greatestGuide()} />}
      </div>
      <BlockMissing block="3.3" route={2} />
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 3.4 */

export function Block34() {
  const r2 = useStore((s) => s.r2);
  const patch = useStore((s) => s.patchR2);
  const setRow = (id: SitId, p: Partial<{ action: Action | null; owner: LogicOwner | null }>) => patch((s) => ({ logic: { ...s.logic, [id]: { ...(s.logic[id] ?? { action: null, owner: null }), ...p } }, logicResult: null }));
  const check = () => patch((s) => ({ checks: s.checks + 1, logicResult: logicHolds(s), logicClue: false }));
  return (
    <AnswerBlock
      id="block-3-4"
      title={tt("Block 3.4 · Automation and personalisation measures, tested: roll out, keep testing or stop", "Block 3.4 · Automatisierungs- und Personalisierungsmaßnahmen, getestet: ausrollen, weiter testen oder stoppen")}
      kind="OBJECTIVE"
      minutes={BLOCK_MINUTES["3.4"]}
      findIt={tt("Route 2 → Task 2 → the six A/B test results below, each with its uplift, its number of conversions and the extra revenue at stake. Answer with an action and an owner for each.", "Route 2 → Task 2 → die sechs A/B-Testergebnisse unten, jedes mit Uplift, Zahl der Conversions und dem zusätzlichen Umsatz, um den es geht. Antworten Sie mit einer Aktion und einem Owner für jedes.")}
    >
      <MaterialRefs refs={["B4"]} />
      <RevealHint id="logic-tests" label={tt("Show the test questions", "Testfragen zeigen")} title={tt("The rule · taught in Materi B4", "Die Regel · aus Materi B4")}>
        <ul className="space-y-1.5 text-caption text-ink">
          <li>{tt(`Roll out: an uplift of ${LIFT_ACT}% or more and at least ${CASES_MIN} conversions in each group.`, `Ausrollen: ein Uplift von ${LIFT_ACT} % oder mehr und mindestens ${CASES_MIN} Conversions in jeder Gruppe.`)}</li>
          <li>{tt(`Keep testing: an uplift of ${LIFT_ACT}% or more on fewer than ${CASES_MIN} conversions, or an uplift between ${LIFT_WATCH}% and ${LIFT_ACT}%.`, `Weiter testen: ein Uplift von ${LIFT_ACT} % oder mehr bei weniger als ${CASES_MIN} Conversions, oder ein Uplift zwischen ${LIFT_WATCH} % und ${LIFT_ACT} %.`)}</li>
          <li>{tt(`Stop: an uplift below ${LIFT_WATCH}%, or a negative one.`, `Stoppen: ein Uplift unter ${LIFT_WATCH} %, oder ein negativer.`)}</li>
          <li>{tt("Who acts follows from what the test is about: a rollout on the website goes to marketing, one done by salespeople goes to sales; keep testing belongs to the data team; a stopped test has no owner.", "Wer handelt, folgt daraus, worum es im Test geht: Ein Rollout auf der Website geht an das Marketing, einer durch Vertriebsleute an den Vertrieb; Weitertesten gehört dem Datenteam; ein gestoppter Test hat keinen Owner.")}</li>
          <li>
            <MaterialRefs refs={["B4"]} lead={tt("Taught in", "Gelehrt in")} />
          </li>
        </ul>
      </RevealHint>
      {SITUATIONS.map((s) => {
        const r = r2.logic[s.id] ?? { action: null, owner: null };
        return (
          <div key={s.id} id={IDS.logic(s.id)} className="space-y-3 rounded-lg border border-line bg-paper p-3.5">
            <p className="font-semibold text-ink">{s.signal}</p>
            <p className="tnum text-caption text-ash">
              {tt(`Uplift ${s.lift > 0 ? "+" : s.lift < 0 ? "−" : ""}${num(Math.abs(s.lift))}% · ${s.cases} conversions in the smaller group · extra revenue a year if rolled out ${s.revenue < 0 ? "−" : ""}${euro(Math.abs(s.revenue))} · ${s.note}`, `Uplift ${s.lift > 0 ? "+" : s.lift < 0 ? "−" : ""}${num(Math.abs(s.lift))} % · ${s.cases} Conversions in der kleineren Gruppe · zusätzlicher Umsatz pro Jahr bei Rollout ${s.revenue < 0 ? "−" : ""}${euro(Math.abs(s.revenue))} · ${s.note}`)}
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <p className="smallcaps">{tt("What happens", "Was passiert")}</p>
                <OptionList<Action> label={tt(`Action for “${s.signal}”`, `Aktion für „${s.signal}“`)} value={r.action} onChange={(v) => setRow(s.id, { action: v })} options={ACTIONS.map((a) => ({ id: a, label: ACTION_LABEL[a] }))} />
              </div>
              <div>
                <label htmlFor={`logic-owner-${s.id}`} className="smallcaps block">
                  {tt("Who acts", "Wer handelt")}
                </label>
                <select id={`logic-owner-${s.id}`} className="field mt-1" value={r.owner ?? ""} onChange={(e) => setRow(s.id, { owner: (e.target.value || null) as LogicOwner | null })}>
                  <option value="">{tt("Choose…", "Wählen…")}</option>
                  {LOGIC_OWNERS.map((o) => (
                    <option key={o} value={o}>
                      {LOGIC_OWNER_LABEL[o]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );
      })}
      <CheckBar onCheck={check} checkLabel={tt("Check my test decisions", "Meine Testentscheidungen prüfen")} checks={r2.checks} clueShown={r2.logicClue} onClue={() => patch({ logicClue: true })} />
      {r2.logicResult && (
        <Reading>
          {tt(`${r2.logicResult.holds} of ${r2.logicResult.total} settings hold (an action and an owner for each of the six test results). A check never says which.`, `${r2.logicResult.holds} von ${r2.logicResult.total} Einstellungen stimmen (eine Aktion und ein Owner für jedes der sechs Testergebnisse). Eine Prüfung sagt nie, welche.`)}
          {r2.logicClue ? tt(" Clue: look at the number of conversions before you look at the uplift. A strong uplift on fifty conversions may be chance.", " Hinweis: Schauen Sie auf die Zahl der Conversions, bevor Sie auf den Uplift schauen. Ein starker Uplift bei fünfzig Conversions kann Zufall sein.") : ""}
        </Reading>
      )}
      <AnswerKey block={logicKey()} />
      <BlockMissing block="3.4" route={2} />
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 3.5 */

export function Block35() {
  const r2 = useStore((s) => s.r2);
  const patch = useStore((s) => s.patchR2);
  const mentor = useStore((s) => s.mentorUnlocked);
  const f = funded(r2);
  const over = archOver(r2);
  const rules = seqRules(r2);
  const box = blackBoxFunded(r2);
  const setItem = (id: ArchId, p: Partial<{ alloc: boolean; start: number | null; owner: OwnerId | null; trigger: string }>) =>
    patch((s) => ({
      alloc: p.alloc !== undefined ? { ...s.alloc, [id]: p.alloc } : s.alloc,
      start: p.start !== undefined ? { ...s.start, [id]: p.start } : p.alloc === false ? { ...s.start, [id]: null } : s.start,
      owner: p.owner !== undefined ? { ...s.owner, [id]: p.owner } : s.owner,
      trigger: p.trigger !== undefined ? { ...s.trigger, [id]: p.trigger } : s.trigger,
      seqResult: null,
    }));
  const check = () =>
    patch((s) => {
      const r = seqRules(s);
      return { checks: s.checks + 1, seqResult: { holds: Number(r.baseline) + Number(r.budget) + Number(r.explainable), total: 3 }, seqClue: false };
    });
  const base = r2.start[BASELINE_ITEM];
  const others = f.filter((id) => id !== BASELINE_ITEM);
  const firstOther = others.length ? Math.min(...others.map((id) => r2.start[id] ?? 99)) : null;
  const notAllFunded = !ARCH_IDS.every((id) => r2.alloc[id]);
  return (
    <AnswerBlock
      id="block-3-5"
      title={tt("Block 3.5 · Prioritised implementation architecture: fund, sequence, own", "Block 3.5 · Priorisierte Umsetzungsarchitektur: finanzieren, ordnen, verantworten")}
      kind="OBJECTIVE + JUDGED"
      minutes={BLOCK_MINUTES["3.5"]}
      findIt={tt(`Route 2 → Task 2 → the eight items below. The budget is ${euro(R2_BUDGET)} over ${R2_MONTHS} months. Answer in the item cards.`, `Route 2 → Task 2 → die acht Punkte unten. Das Budget beträgt ${euro(R2_BUDGET)} über ${R2_MONTHS} Monate. Antworten Sie in den Karten der Punkte.`)}
    >
      <MaterialRefs refs={["B5"]} />
      <div className="flex flex-wrap items-start gap-2">
        <RevealHint id="owner-help" label={tt("Show the owner test", "Owner-Test zeigen")} title={tt("The tests · taught in Materi B5", "Die Tests · aus Materi B5")}>
          <div className="space-y-2 text-caption text-ink">
            <ul className="list-disc space-y-1 pl-5">
              <li>{tt("Owner: who can change it without asking anyone else?", "Owner: Wer kann es ändern, ohne jemanden zu fragen?")}</li>
              <li>{tt("Start: does something have to exist before it, such as the live interaction view?", "Start: Muss vorher etwas existieren, etwa die Live-Interaktionssicht?")}</li>
              <li>{tt("Explainable: could anyone at LiveConnect say why it answered or offered something, and measure what it did?", "Erklärbar: Könnte bei LiveConnect jemand sagen, warum es etwas antwortete oder anbot, und messen, was es bewirkt hat?")}</li>
              <li>{tt("Trigger: does it have a metric, a number, a date and an action?", "Trigger: Hat er eine Kennzahl, eine Zahl, ein Datum und eine Aktion?")}</li>
            </ul>
            <p className="smallcaps text-ash">{tt("What each role can change", "Was jede Rolle ändern kann")}</p>
            <ul className="space-y-1">
              {OWNER_IDS.map((o) => (
                <li key={o}>
                  <span className="font-semibold">{OWNERS[o].name}. </span>
                  {OWNERS[o].profile}
                </li>
              ))}
            </ul>
            <MaterialRefs refs={["B5"]} lead={tt("Taught in", "Gelehrt in")} />
          </div>
        </RevealHint>
      </div>
      <p className="text-body text-ink">
        <Gloss>
          {tt(
            "Fund the items you will carry out inside the budget. For each funded item choose the month it starts, one owner who can change it without asking anyone else, and a trigger: a number, a date and an action. Leave out what does not fit, on purpose, and fund nothing whose forecasts nobody can explain.",
            "Finanzieren Sie die Punkte, die Sie innerhalb des Budgets umsetzen. Wählen Sie für jeden finanzierten Punkt den Startmonat, einen Owner, der ihn ändern kann, ohne jemanden zu fragen, und einen Trigger: eine Zahl, ein Datum und eine Aktion. Lassen Sie weg, was nicht passt, bewusst, und finanzieren Sie nichts, dessen Prognosen niemand erklären kann.",
          )}
        </Gloss>
      </p>
      <div id={IDS.archTotal} className="space-y-2">
        <BudgetBar items={f.map((id) => ({ id, short: ARCH_BY_ID[id].name.split(" ")[0], cost: ARCH_BY_ID[id].cost }))} budget={R2_BUDGET} title={tt(`Funded items against the ${euro(R2_BUDGET)} budget`, `Finanzierte Punkte gegen das Budget von ${euro(R2_BUDGET)}`)} />
        <p className="text-caption text-ash" aria-live="polite">
          {tt(`Funded ${euro(archCost(r2))} of ${euro(R2_BUDGET)}. `, `Finanziert ${euro(archCost(r2))} von ${euro(R2_BUDGET)}. `)}
          {over > 0 ? tt(`${euro(over)} over: leave out the item with the weakest case, do not trim every item a little.`, `${euro(over)} darüber: Lassen Sie den Punkt mit der schwächsten Begründung weg, kürzen Sie nicht jeden ein bisschen.`) : tt(`${euro(archLeft(r2))} left.`, `${euro(archLeft(r2))} übrig.`)}
        </p>
      </div>
      <p className="text-caption text-ash">
        {tt(
          "How to read an item card. The line under the name says what it does, then a scene from a normal day. “Aims to move” is the one figure it is meant to change, with today's value and the aim (or, for a guardrail, the limit still accepted): your trigger watches that figure. “Needs first” says what must be in use before its effect can be measured. “To pay back, it must keep” is how many customers it has to stop from leaving to earn back its cost, found by dividing the cost by what one customer is worth a year.",
          "So lesen Sie eine Karte. Die Zeile unter dem Namen sagt, was er tut, dann folgt eine Szene aus einem normalen Tag. „Soll bewegen“ ist die eine Zahl, die er verändern soll, mit dem heutigen Wert und dem Ziel (oder bei einer Guardrail der noch akzeptierten Grenze): Ihr Trigger beobachtet diese Zahl. „Braucht zuerst“ sagt, was im Einsatz sein muss, bevor sich seine Wirkung messen lässt. „Zum Bezahltmachen muss er halten“ ist die Zahl der Kunden, die er vom Gehen abhalten muss, um seine Kosten zurückzuverdienen, gefunden, indem die Kosten durch den Jahreswert eines Kunden geteilt werden.",
        )}
      </p>
      {ARCH.map((a) => {
        const on = !!r2.alloc[a.id];
        return (
          <div key={a.id} id={IDS.arch(a.id)} className={clsx("space-y-3 rounded-lg border p-3.5", on ? "border-line bg-paper" : "border-dashed border-ash/60 bg-mist/40")}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold text-ink">
                {a.name} <span className="font-normal text-ash">· {euro(a.cost)} · {tt(`${a.weeks} weeks to be in use`, `${a.weeks} Wochen bis zum Einsatz`)}</span>
              </p>
              <button type="button" aria-pressed={on} onClick={() => setItem(a.id, { alloc: !on })} className={clsx("btn btn-sm min-h-[40px] border", on ? "border-accent bg-accentSoft text-ink" : "border-line bg-paper text-ash hover:border-ash")}>
                {on ? tt("☑ Funded", "☑ Finanziert") : tt("☐ Not funded", "☐ Nicht finanziert")}
              </button>
            </div>
            <p className="text-caption text-ash">{a.what}</p>
            <p className="text-caption text-ink">{ARCH_EXTRA[a.id].scene}</p>
            <ArchFacts id={a.id} />
            {on && (
              <>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label htmlFor={`start-${a.id}`} className="smallcaps block">
                      {tt("Starts in month", "Startet in Monat")}
                    </label>
                    <select id={`start-${a.id}`} className="field mt-1 max-w-[10rem]" value={r2.start[a.id] ?? ""} onChange={(e) => setItem(a.id, { start: e.target.value ? Number(e.target.value) : null })}>
                      <option value="">{tt("Choose…", "Wählen…")}</option>
                      {MONTHS_LIST.map((m) => (
                        <option key={m} value={m}>
                          {tt(`Month ${m}`, `Monat ${m}`)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor={`owner-${a.id}`} className="smallcaps block">
                      {tt("Owner (who can change it without asking anyone else)", "Owner (wer es ändern kann, ohne jemanden zu fragen)")}
                    </label>
                    <select id={`owner-${a.id}`} className="field mt-1" value={r2.owner[a.id] ?? ""} onChange={(e) => setItem(a.id, { owner: (e.target.value || null) as OwnerId | null })}>
                      <option value="">{tt("Choose an owner…", "Owner wählen…")}</option>
                      {OWNER_IDS.map((o) => (
                        <option key={o} value={o}>
                          {OWNERS[o].name}
                        </option>
                      ))}
                    </select>
                    {r2.owner[a.id] && <p className="mt-1 text-micro normal-case tracking-normal text-ash">{OWNERS[r2.owner[a.id]!].profile}</p>}
                  </div>
                </div>
                <TextBox
                  id={`${IDS.arch(a.id)}-trigger`}
                  label={tt("Trigger", "Trigger")}
                  help={tt("If [metric] is [worse than a number] by [month], then [action]. At least 20 characters, with a number.", "Wenn [Kennzahl] bis [Monat] [schlechter als eine Zahl] ist, dann [Aktion]. Mindestens 20 Zeichen, mit einer Zahl.")}
                  value={r2.trigger[a.id] ?? ""}
                  onChange={(v) => setItem(a.id, { trigger: v })}
                  min={20}
                  rows={2}
                >
                  <TriggerKitFor id={a.id} r2={r2} value={r2.trigger[a.id] ?? ""} onChange={(v) => setItem(a.id, { trigger: v })} />
                </TextBox>
                <ExampleAnswer id={`trigger-example-${a.id}`} guide={triggerGuide(a.id)} />
                {mentor && <MentorGuide guide={triggerGuide(a.id)} />}
              </>
            )}
          </div>
        );
      })}

      <div className="space-y-1 rounded-lg border border-line bg-mist/50 p-3 text-caption text-ink" aria-live="polite">
        <p className="smallcaps">{tt("What your plan means", "Was Ihr Plan bedeutet")}</p>
        {f.length === 0 && <p>{tt("Nothing is funded yet.", "Noch nichts ist finanziert.")}</p>}
        {f.length > 0 && !rules.hasBaseline && <p>{tt("The live interaction view is not funded, so no item can be measured against the same numbers, and no team sees the whole interaction.", "Die Live-Interaktionssicht ist nicht finanziert, also lässt sich kein Punkt an denselben Zahlen messen, und kein Team sieht die ganze Interaktion.")}</p>}
        {rules.hasBaseline && base != null && firstOther !== null && base > firstOther && <p>{tt(`The first item starts in month ${firstOther}, before the live view in month ${base}: its first weeks cannot be measured.`, `Der erste Punkt startet in Monat ${firstOther}, vor der Live-Sicht in Monat ${base}: Seine ersten Wochen lassen sich nicht messen.`)}</p>}
        {rules.hasBaseline && base != null && firstOther !== null && base <= firstOther && <p>{tt(`The live view starts in month ${base}, no later than the first other item (month ${firstOther}), so every item is measured from its first week.`, `Die Live-Sicht startet in Monat ${base}, nicht später als der erste andere Punkt (Monat ${firstOther}), also wird jeder Punkt ab seiner ersten Woche gemessen.`)}</p>}
        {box.length > 0 && <p>{tt(`Funded without explanation: ${box.map((id) => ARCH_BY_ID[id].name).join(", ")}. Nobody at LiveConnect will be able to say what it does or measure its effect.`, `Ohne Erklärung finanziert: ${box.map((id) => ARCH_BY_ID[id].name).join(", ")}. Niemand bei LiveConnect wird sagen können, was es tut, oder seine Wirkung messen.`)}</p>}
        {over > 0 && <p>{tt(`The funded items are ${euro(over)} over the budget.`, `Die finanzierten Punkte liegen ${euro(over)} über dem Budget.`)}</p>}
      </div>

      {notAllFunded && (
        <div className="space-y-3 border-t border-line pt-3">
          <TextBox
            id={IDS.postponed}
            label={tt("What you leave out, and why", "Was Sie weglassen, und warum")}
            help={tt("Name the item and say why it is the one that goes: the budget, it is too slow for four months, or nobody can explain or measure it. At least 30 characters.", "Nennen Sie den Punkt und sagen Sie, warum gerade er wegfällt: das Budget, er ist zu langsam für vier Monate, oder niemand kann ihn erklären oder messen. Mindestens 30 Zeichen.")}
            value={r2.postponed}
            onChange={(v) => patch({ postponed: v })}
            min={MIN_LINE}
            rows={3}
          >
            <WritingHelp
              id="postponed-help"
              steps={[
                tt("Name the item you leave out.", "Nennen Sie den Punkt, den Sie weglassen."),
                tt("Say what it would have cost and what that would have pushed the total to.", "Sagen Sie, was er gekostet hätte und auf welche Summe das den Plan gebracht hätte."),
                tt("Say why this one: is it too slow, and can it be explained and measured?", "Sagen Sie, warum gerade dieser: Ist er zu langsam, und lässt er sich erklären und messen?"),
              ]}
              refs={[{ label: tt("Budget", "Budget"), value: euro(R2_BUDGET), target: IDS.archTotal }]}
            />
          </TextBox>
          <ExampleAnswer id="postponed-example" guide={postponedGuide()} />
          <TextBox
            id={IDS.pickup}
            label={tt("The pickup point", "Der Pickup Point")}
            help={tt("The number and the date at which you look at it again: if [metric] is [number] by [month], we revisit it. At least 15 characters, with a number.", "Die Zahl und das Datum, zu dem Sie es wieder ansehen: Wenn [Kennzahl] bis [Monat] [Zahl] ist, prüfen wir es neu. Mindestens 15 Zeichen, mit einer Zahl.")}
            value={r2.pickup}
            onChange={(v) => patch({ pickup: v })}
            min={15}
            rows={2}
          >
            <PickupKitFor notFunded={ARCH_IDS.filter((id) => !r2.alloc[id])} value={r2.pickup} onChange={(v) => patch({ pickup: v })} />
          </TextBox>
          <ExampleAnswer id="pickup-example" guide={pickupGuide()} />
          {mentor && <MentorGuide guide={postponedGuide()} />}
          {mentor && <MentorGuide guide={pickupGuide()} />}
        </div>
      )}

      <CheckBar onCheck={check} checkLabel={tt("Check my architecture", "Meine Architektur prüfen")} checks={r2.checks} clueShown={r2.seqClue} onClue={() => patch({ seqClue: true })} />
      {r2.seqResult && (
        <Reading>
          {tt(`${r2.seqResult.holds} of ${r2.seqResult.total} rules hold (the live view starts no later than the first other item, the funded items fit the budget, nothing funded is a black box).`, `${r2.seqResult.holds} von ${r2.seqResult.total} Regeln stimmen (die Live-Sicht startet nicht später als der erste andere Punkt, die finanzierten Punkte passen ins Budget, nichts Finanziertes ist eine Black Box).`)}
          {r2.seqClue ? tt(" Clue: which item are all the others measured by? And which item could nobody at LiveConnect explain or measure?", " Hinweis: An welchem Punkt werden alle anderen gemessen? Und welchen Punkt könnte bei LiveConnect niemand erklären oder messen?") : ""}
        </Reading>
      )}
      <AnswerKey block={ownerKey(f)} />
      <BlockMissing block="3.5" route={2} />
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 3.6 */

export function Block36() {
  const r2 = useStore((s) => s.r2);
  const patch = useStore((s) => s.patchR2);
  const mentor = useStore((s) => s.mentorUnlocked);
  const k = r2.tripKpi ? KPIS.find((x) => x.id === r2.tripKpi)! : null;
  const flags = tripFlagsOf(r2);
  const check = () => patch((s) => ({ checks: s.checks + 1, decisionFlagged: s.decision === "wait", tripFlags: tripFlagsOf(s) }));
  const unit = (x: (typeof KPIS)[number]) => (x.unit === "%" ? tt("%", " %") : ` ${x.unit}`);
  return (
    <AnswerBlock
      id="block-3-6"
      title={tt("Block 3.6 · A decision under time pressure and uncertain data", "Block 3.6 · Eine Entscheidung unter Zeitdruck und unsicherer Datenlage")}
      kind="OBJECTIVE + JUDGED"
      minutes={BLOCK_MINUTES["3.6"]}
      findIt={tt("Route 2 → Task 2 → your own plan in Block 3.5 (quoted below), the numbers today in the situation above, and the decision rules in Materi B5. Answer in the fields below.", "Route 2 → Task 2 → Ihr eigener Plan in Block 3.5 (unten zitiert), die Zahlen heute in der Lage oben und die Entscheidungsregeln in Materi B5. Antworten Sie in den Feldern unten.")}
    >
      <MaterialRefs refs={["B5"]} />
      <div id="plan-quote" className="rounded-lg border border-line bg-mist/50 p-3 text-caption text-ink">
        <p className="smallcaps">{tt("Your plan from Block 3.5 · what your decision rests on", "Ihr Plan aus Block 3.5 · worauf Ihre Entscheidung beruht")}</p>
        {funded(r2).length === 0 ? (
          <p className="mt-1 text-ash">{tt("You have not funded any item yet. That is fine: nothing here is blocked, and this box fills in when you do.", "Sie haben noch keinen Punkt finanziert. Das ist in Ordnung: Hier ist nichts gesperrt, und dieses Feld füllt sich, sobald Sie es tun.")}</p>
        ) : (
          <ul className="mt-1 list-disc space-y-0.5 pl-4">
            {funded(r2).map((id) => (
              <li key={id}>
                <button type="button" onClick={() => scrollToAndFlash(IDS.arch(id), "ref")} className="text-left underline decoration-dotted underline-offset-2 hover:text-accentHi">
                  {ARCH_BY_ID[id].name}
                </button>{" "}
                · {r2.start[id] ? tt(`starts in month ${r2.start[id]}`, `startet in Monat ${r2.start[id]}`) : tt("no start month yet", "noch kein Startmonat")} · {tt("aims to move", "soll bewegen")}: {ARCH_EXTRA[id].metric}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div id={IDS.decision} className={clsx("space-y-2 rounded-lg p-1", r2.decisionFlagged && "is-flagged")}>
        <p className="font-semibold text-ink">{tt("Your decision", "Ihre Entscheidung")}</p>
        <p className="text-caption text-ash">{tt("The brief asks you to decide under time pressure and with an uncertain data situation. Choose one.", "Der Auftrag verlangt, dass Sie unter Zeitdruck und mit unsicherer Datenlage entscheiden. Wählen Sie eine.")}</p>
        <OptionList<DecisionId> label={tt("Decision", "Entscheidung")} value={r2.decision} onChange={(v) => patch({ decision: v, decisionFlagged: false })} options={DECISIONS.map((d) => ({ id: d.id, label: d.label, sub: d.detail }))} />
        {r2.decisionFlagged && (
          <p className="text-caption text-ink">
            <span className="smallcaps mr-1 text-accent">{tt("Clue", "Hinweis")}</span>
            {tt("Which option acts within weeks where the data is good enough, and still measures before it spends most of the budget? Read the first two decision rules of Materi B5.", "Welche Option handelt innerhalb von Wochen, wo die Daten gut genug sind, und misst trotzdem, bevor sie den Großteil des Budgets ausgibt? Lesen Sie die ersten zwei Entscheidungsregeln aus Materi B5.")}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <p className="font-semibold text-ink">{tt("Three assumptions your decision rests on", "Drei Annahmen, auf denen Ihre Entscheidung beruht")}</p>
        {r2.assumptions.map((a, i) => (
          <div key={i} className="space-y-1.5">
            <TextBox
              id={IDS.assumption(i)}
              label={tt(`Assumption ${i + 1}`, `Annahme ${i + 1}`)}
              help={tt("What you assume about the data, the customers or the teams, and the sign that would show you are wrong (a number or something you could see, and when). At least 30 characters.", "Was Sie über die Daten, die Kunden oder die Teams annehmen, und das Anzeichen, das zeigen würde, dass Sie falsch liegen (eine Zahl oder etwas Sichtbares, und wann). Mindestens 30 Zeichen.")}
              value={a}
              onChange={(v) => patch((s) => ({ assumptions: s.assumptions.map((x, j) => (j === i ? v : x)) }))}
              min={MIN_LINE}
              rows={2}
            >
              <AssumptionKitFor index={i} value={a} onChange={(v) => patch((s) => ({ assumptions: s.assumptions.map((x, j) => (j === i ? v : x)) }))} />
            </TextBox>
            <ExampleAnswer id={`assumption-example-${i}`} guide={assumptionGuide(i)} />
            {mentor && <MentorGuide guide={assumptionGuide(i)} />}
          </div>
        ))}
      </div>

      <div id={IDS.trip} className="space-y-3 rounded-lg border border-line bg-paper p-3.5">
        <p className="font-semibold text-ink">{tt("The tripwire", "Der Tripwire")}</p>
        <p className="text-caption text-ash">
          {tt("A metric of how customers behave, a threshold better than today's baseline, a month and an action agreed now. ", "Eine Kennzahl dafür, wie Kunden sich verhalten, ein Schwellenwert besser als die heutige Baseline, ein Monat und eine jetzt vereinbarte Aktion. ")}
          {R2_BASELINE_NOTE.v}
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <div className={clsx(flags.includes("kpi") && r2.tripFlags.includes("kpi") && "is-flagged p-1")}>
            <label htmlFor="trip-kpi" className="smallcaps block">
              {tt("Metric", "Kennzahl")}
            </label>
            <select id="trip-kpi" className="field mt-1" value={r2.tripKpi ?? ""} onChange={(e) => patch({ tripKpi: (e.target.value || null) as KpiId | null, tripFlags: [] })}>
              <option value="">{tt("Choose a metric…", "Kennzahl wählen…")}</option>
              {KPIS.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.label} ({tt("today", "heute")}: {num(x.baseline)}
                  {unit(x)}{KPI_AIM[x.id] !== undefined ? tt(`, aim ${num(KPI_AIM[x.id]!)}`, `, Ziel ${num(KPI_AIM[x.id]!)}`) : ""})
                </option>
              ))}
            </select>
            {flags.includes("kpi") && r2.tripFlags.includes("kpi") && (
              <p className="mt-1 text-micro normal-case tracking-normal text-ink">
                <span className="font-semibold text-accent">{tt("Clue. ", "Hinweis. ")}</span>
                {tt("Does this metric measure how customers behave, or how fast or how much LiveConnect worked?", "Misst diese Kennzahl, wie Kunden sich verhalten, oder wie schnell oder wie viel LiveConnect gearbeitet hat?")}
              </p>
            )}
          </div>
          <div className={clsx(flags.includes("threshold") && r2.tripFlags.includes("threshold") && "is-flagged p-1")}>
            <label htmlFor="trip-threshold" className="smallcaps block">
              {tt("Threshold", "Schwellenwert")}
              {k ? tt(` (${k.unit}; better is ${k.better === "up" ? "higher" : "lower"})`, ` (${k.unit}; besser ist ${k.better === "up" ? "höher" : "niedriger"})`) : ""}
            </label>
            <input id="trip-threshold" className="field tnum mt-1" inputMode="decimal" value={r2.tripThreshold} onChange={(e) => patch({ tripThreshold: e.target.value, tripFlags: [] })} />
            <TripNumberHint kpi={r2.tripKpi} onUse={(v) => patch({ tripThreshold: v, tripFlags: [] })} />
            {flags.includes("threshold") && r2.tripFlags.includes("threshold") && k && (
              <p className="mt-1 text-micro normal-case tracking-normal text-ink">
                <span className="font-semibold text-accent">{tt("Clue. ", "Hinweis. ")}</span>
                {tt(`Compare it with today's figure, ${num(k.baseline)}${unit(k)}. Would reaching it show a real change?`, `Vergleichen Sie ihn mit dem heutigen Wert, ${num(k.baseline)}${unit(k)}. Würde das Erreichen eine echte Veränderung zeigen?`)}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="trip-month" className="smallcaps block">
              {tt("By month", "Bis Monat")}
            </label>
            <select id="trip-month" className="field mt-1 max-w-[10rem]" value={r2.tripMonth ?? ""} onChange={(e) => patch({ tripMonth: e.target.value ? Number(e.target.value) : null })}>
              <option value="">{tt("Choose…", "Wählen…")}</option>
              {MONTHS_LIST.map((m) => (
                <option key={m} value={m}>
                  {tt(`Month ${m}`, `Monat ${m}`)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="trip-action" className="smallcaps block">
              {tt("If it is missed", "Wenn er verfehlt wird")}
            </label>
            <select id="trip-action" className="field mt-1" value={r2.tripAction} onChange={(e) => patch({ tripAction: e.target.value as "" | "scale" | "adjust" | "stop" })}>
              <option value="">{tt("Choose an action…", "Aktion wählen…")}</option>
              <option value="adjust">{tt("Adjust one rule and continue", "Eine Regel anpassen und weitermachen")}</option>
              <option value="stop">{tt("Stop the rollout and reconsider the architecture", "Den Rollout stoppen und die Architektur überdenken")}</option>
              <option value="scale">{tt("Scale up anyway", "Trotzdem ausweiten")}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="rounded-lg border border-gold bg-accentSoft p-3.5 text-caption text-ink">
          <p className="smallcaps text-accent">{tt("The board's challenge", "Die Frage des Vorstands")}</p>
          <p className="mt-1">
            <Gloss>{BOARD_CHALLENGE.v}</Gloss>
          </p>
        </div>
        <TextBox
          id={IDS.challenge}
          label={tt("What do you do?", "Was tun Sie?")}
          help={tt("Say what you check first, what you keep, and the one thing you change. At least 60 characters.", "Sagen Sie, was Sie zuerst prüfen, was Sie behalten und was Sie als Einziges ändern. Mindestens 60 Zeichen.")}
          value={r2.challenge}
          onChange={(v) => patch({ challenge: v })}
          min={60}
          rows={4}
        >
          <WritingHelp
            id="challenge-help"
            refs={[
              { label: tt("Your decision in this block", "Ihre Entscheidung in diesem Block"), value: DECISIONS.find((d) => d.id === r2.decision)?.label ?? tt("not chosen yet", "noch nicht gewählt"), target: IDS.decision },
              { label: tt("Your tripwire", "Ihr Tripwire"), value: k ? `${k.label} · ${r2.tripThreshold || "—"} · ${r2.tripMonth ? tt("month", "Monat") + " " + r2.tripMonth : "—"}` : tt("not chosen yet", "noch nicht gewählt"), target: IDS.trip },
            ]}
            steps={[
              tt("Look at the numbers first: which chats are rated “not helpful”, and is 6.0% to 6.3% after two months on enough requests to judge?", "Schauen Sie zuerst auf die Zahlen: Welche Chats werden als „nicht hilfreich“ bewertet, und reichen 6,0 % zu 6,3 % nach zwei Monaten bei genug Anfragen für ein Urteil?"),
              tt("Say what still holds: speed is solved and measured, while the platform could not be measured at all (Materi B5).", "Sagen Sie, was noch gilt: Das Tempo ist gelöst und gemessen, während sich die Plattform gar nicht messen ließe (Materi B5)."),
              tt("Change one thing, not the programme, and say when the tripwire will tell you whether you were right.", "Ändern Sie eine Sache, nicht das Programm, und sagen Sie, wann der Tripwire zeigt, ob Sie recht hatten."),
            ]}
          />
        </TextBox>
        <ExampleAnswer id="challenge-example" guide={challengeGuide()} />
        {mentor && <MentorGuide guide={challengeGuide()} />}
      </div>

      <CheckBar onCheck={check} checkLabel={tt("Check my decision", "Meine Entscheidung prüfen")} checks={r2.checks} />
      {r2.checks > 0 && (r2.decisionFlagged || r2.tripFlags.length > 0) && (
        <Reading>
          {r2.decisionFlagged ? tt("Your decision is outlined.", "Ihre Entscheidung ist markiert.") : ""}
          {r2.tripFlags.length > 0 ? tt(` ${r2.tripFlags.length} part${r2.tripFlags.length === 1 ? "" : "s"} of the tripwire ${r2.tripFlags.length === 1 ? "is" : "are"} outlined.`, ` ${r2.tripFlags.length} ${r2.tripFlags.length === 1 ? "Teil" : "Teile"} des Tripwires ${r2.tripFlags.length === 1 ? "ist" : "sind"} markiert.`) : ""}
        </Reading>
      )}
      <AnswerKey block={decisionKey()} />
      <AnswerKey block={tripKey()} />
      <BlockMissing block="3.6" route={2} />
    </AnswerBlock>
  );
}
