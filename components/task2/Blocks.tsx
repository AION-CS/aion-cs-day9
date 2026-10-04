"use client";

import clsx from "clsx";
import { AnswerBlock } from "@/components/ui/AnswerBlock";
import { AnswerKey } from "@/components/ui/AnswerKey";
import { BlockMissing } from "@/components/ui/BlockMissing";
import { ExampleAnswer } from "@/components/ui/ExampleAnswer";
import { CheckBar, OptionList, Reading, ScorePick, TextBox } from "@/components/ui/Inputs";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { MentorGuide } from "@/components/ui/MentorGuide";
import { RevealHint } from "@/components/ui/RevealHint";
import { WritingHelp } from "@/components/ui/WritingHelp";
import { ACTION_LABEL, CADENCE_LABEL, CASES_MIN, COMPS, COMP_BY_ID, COMP_CHOOSE, COMP_IDS, COST_SHAPE_LABEL, CRITERIA, CRIT_IDS, LIFT_ACT, LIFT_WATCH, LOGIC_OWNERS, LOGIC_OWNER_LABEL, PRINCIPLES, PRINCIPLE_IDS, QUALITY_BAR, R2_MONTHS, SITUATIONS, SOURCES, USE_LABEL } from "@/data/route2";
import type { Action, CompId, Criterion, LogicOwner, PrincipleId, SitId, SourceId, Use } from "@/data/route2";
import { compTotal, earlyCount, logicHolds, principlesHold, ratingFlags, sourceHolds } from "@/lib/checks";
import { scrollToAndFlash } from "@/lib/flash";
import { Gloss } from "@/lib/glossify";
import { euro, num, pct, tt } from "@/lib/lang";
import { IDS } from "@/lib/missing";
import { greatestGuide, principleTextGuide } from "@/lib/mentorGuide";
import { compKey, logicKey, principleKey, sourceKey } from "@/lib/answerKey";
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
