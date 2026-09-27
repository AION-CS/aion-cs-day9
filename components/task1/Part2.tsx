"use client";

import clsx from "clsx";
import { AnswerBlock } from "@/components/ui/AnswerBlock";
import { AnswerKey } from "@/components/ui/AnswerKey";
import { BudgetBar } from "@/components/ui/BudgetBar";
import { CheckBar, OptionList, Reading, ScorePick, TextBox } from "@/components/ui/Inputs";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { MentorGuide } from "@/components/ui/MentorGuide";
import { PlacementBoard } from "@/components/ui/PlacementBoard";
import { RevealHint } from "@/components/ui/RevealHint";
import { WritingHelp } from "@/components/ui/WritingHelp";
import { AB, AB_PARTS, MEANINGS, OUTCOME_LABEL, PATTERNS, PATTERN_IDS, PATTERN_PAIR_TESTS, PMEASURES, RECORDS, RISK_GLYPH, RISK_LABEL, RISK_RULE, UNCERTAINTIES } from "@/data/patterns";
import type { AbPart, MeaningId, PatternId, PMeasureId, RecId, Risk, UncId } from "@/data/patterns";
import { BUDGET, CHOOSE, EVIDENCE_LABEL, EXPLAIN_RULE, MEASURES, MEASURE_BY_ID, MONTHS, PROBLEM_IDS, PROBLEM_LABEL } from "@/data/measures";
import type { MeasureId, ProblemId } from "@/data/measures";
import { abFlagsOf, aimsHold, allTagged, coverage, expHolds, measureScore, measureScored, orderInversions, rowChecks, tagHolds, tallyOf, totalCost, uncHolds } from "@/lib/checks";
import { scrollToAndFlash } from "@/lib/flash";
import { Gloss } from "@/lib/glossify";
import { euro, tt } from "@/lib/lang";
import { IDS } from "@/lib/missing";
import { abKey, measureKey, orderKey, rowKey, tagKey, uncKey } from "@/lib/answerKey";
import { abGuide, misreadGuide, scoreGuide, whyGuide } from "@/lib/mentorGuide";
import { MIN_LINE, MIN_SENTENCE } from "@/lib/progress";
import { BLOCK_MINUTES } from "@/lib/routes";
import { useStore } from "@/store/useStore";
import type { Score } from "@/store/useStore";

/* ------------------------------------------------------------------ Block 2.1 */

export function Block21() {
  const l1 = useStore((s) => s.l1);
  const place = useStore((s) => s.placeTag);
  const undo = useStore((s) => s.undoTags);
  const redo = useStore((s) => s.redoTags);
  const patch = useStore((s) => s.patchL1);
  return (
    <AnswerBlock
      id="block-2-1"
      title={tt("Block 2.1 · Tag LiveConnect's twelve metrics by kind", "Block 2.1 · Die zwölf Kennzahlen von LiveConnect nach Art zuordnen")}
      kind="OBJECTIVE"
      minutes={BLOCK_MINUTES["2.1"]}
      findIt={tt("Route 1 → Task 1 → the twelve metrics on the board below, from LiveConnect's reports, each with whether it moved together with customer value last year. Find the words that decide each one and answer on the board.", "Route 1 → Task 1 → die zwölf Kennzahlen auf der Tafel unten, aus den Berichten von LiveConnect, jede mit der Angabe, ob sie sich letztes Jahr mit dem Kundenwert bewegte. Finden Sie die Worte, die jede entscheiden, und antworten Sie auf der Tafel.")}
    >
      <MaterialRefs refs={["A5"]} />
      <PlacementBoard<PatternId>
        items={RECORDS.map((r) => ({ id: r.id, meta: `${r.code} · ${OUTCOME_LABEL[r.outcome]}`, text: r.text }))}
        bins={PATTERN_IDS.map((p) => ({ id: p, label: PATTERNS[p].label, hint: PATTERNS[p].means }))}
        binCols={2}
        value={l1.tags}
        onPlace={(id, s) => place(id as RecId, s)}
        onUndo={undo}
        onRedo={redo}
        undoCount={l1.tagHistory.length}
        redoCount={l1.tagFuture.length}
        domId={IDS.rec}
        clues={Object.fromEntries(RECORDS.map((o) => [o.id, o.clue]))}
        reasons={Object.fromEntries(RECORDS.map((o) => [o.id, o.why]))}
        result={l1.tagResult}
        checks={l1.tagChecks}
        onCheck={() => patch((s) => ({ checks: s.checks + 1, tagChecks: s.tagChecks + 1, tagResult: tagHolds(s.tags) }))}
        onClue={() => patch({ tagClue: true })}
        clueShown={l1.tagClue}
        reasoningOpened={l1.tagReasoning}
        onOpenReasoning={() => patch({ tagReasoning: true })}
        noun={tt("metric", "Kennzahl")}
        checkLabel={tt("Check my tags", "Meine Zuordnung prüfen")}
        intro={tt("Drag a metric into a kind, or select it and then select a kind. Tag what the metric measures, not whether it moved. One kind per metric.", "Ziehen Sie eine Kennzahl in eine Art, oder wählen Sie sie aus und dann eine Art. Ordnen Sie zu, was die Kennzahl misst, nicht ob sie sich bewegte. Eine Art pro Kennzahl.")}
        tests={
          <RevealHint id="tag-tests" label={tt("Show the test questions", "Testfragen zeigen")} title={tt("Test questions · taught in Materi A5", "Testfragen · aus Materi A5")}>
            <div className="space-y-2 text-caption text-ink">
              <ul className="space-y-1.5">
                {PATTERN_IDS.map((p) => (
                  <li key={p}>
                    <span className="font-semibold">{PATTERNS[p].label}. </span>
                    <Gloss>{PATTERNS[p].test}</Gloss>
                  </li>
                ))}
              </ul>
              <p className="smallcaps text-ash">{tt("When two kinds seem to fit", "Wenn zwei Arten zu passen scheinen")}</p>
              <ul className="space-y-1.5">
                {PATTERN_PAIR_TESTS.map((x) => (
                  <li key={x.pair}>
                    <span className="font-semibold">{x.pair} </span>
                    <Gloss>{x.test}</Gloss>
                  </li>
                ))}
              </ul>
              <MaterialRefs refs={["A5"]} lead={tt("Taught in", "Gelehrt in")} />
            </div>
          </RevealHint>
        }
      />
      <AnswerKey block={tagKey()} />
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 2.2 */

const RISKS: Risk[] = ["high", "mid", "low"];

export function Block22() {
  const l1 = useStore((s) => s.l1);
  const patch = useStore((s) => s.patchL1);
  const mentor = useStore((s) => s.mentorUnlocked);
  const tally = tallyOf(l1.tags);
  const complete = allTagged(l1.tags);
  const toggleUnc = (id: UncId) => patch((s) => ({ unc: s.unc.includes(id) ? s.unc.filter((x) => x !== id) : [...s.unc, id], uncResult: null }));
  const setRow = (p: PatternId, v: Partial<{ risk: Risk | null; meaning: MeaningId | null; measure: PMeasureId | null }>) =>
    patch((s) => ({ rows: { ...s.rows, [p]: { ...s.rows[p], ...v } }, rowResult: null, rowFlags: s.rowFlags.filter((f) => !Object.keys(v).some((k) => f === `${p}.${k}`)) }));
  const check = () =>
    patch((s) => {
      const r = rowChecks(s);
      return { checks: s.checks + 1, rowResult: { holds: r.holds, total: r.total }, rowFlags: r.flags, rowClue: false };
    });
  return (
    <AnswerBlock
      id="block-2-2"
      title={tt("Block 2.2 · What each kind of metric is worth, and your three KPIs", "Block 2.2 · Was jede Art von Kennzahl wert ist, und Ihre drei KPIs")}
      kind="OBJECTIVE + JUDGED"
      minutes={BLOCK_MINUTES["2.2"]}
      findIt={tt("Route 1 → Task 1 → “Your tally” below (from your own tags in Block 2.1) and the rules in Materi A5 and A6. Answer in the four rows and the fields under them.", "Route 1 → Task 1 → „Ihre Auszählung“ unten (aus Ihren eigenen Zuordnungen in Block 2.1) und die Regeln in Materi A5 und A6. Antworten Sie in den vier Zeilen und den Feldern darunter.")}
    >
      <MaterialRefs refs={["A5", "A6"]} />
      <div id="tally-panel" className="space-y-2 rounded-lg border border-line bg-mist/50 p-3">
        <p className="smallcaps">{tt("Your tally · from your tags in Block 2.1", "Ihre Auszählung · aus Ihren Zuordnungen in Block 2.1")}</p>
        {!complete && (
          <p className="text-caption text-ash">
            {tt(`${tally.tagged} of 12 metrics are tagged. `, `${tally.tagged} von 12 Kennzahlen sind zugeordnet. `)}
            <button type="button" onClick={() => scrollToAndFlash("block-2-1", "ref", "start")} className="font-semibold text-ink underline decoration-dotted underline-offset-2">
              {tt("Go to Block 2.1", "Zu Block 2.1")}
            </button>
            {tt(". Nothing is blocked.", ". Nichts ist gesperrt.")}
          </p>
        )}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[22rem] border-collapse text-caption">
            <caption className="sr-only">{tt("Metrics per kind, and how many moved with customer value", "Kennzahlen pro Art, und wie viele sich mit dem Kundenwert bewegten")}</caption>
            <thead>
              <tr className="text-left text-micro uppercase text-ash">
                <th className="py-1 pr-2">{tt("Kind", "Art")}</th>
                <th className="py-1 pr-2 text-right">{tt("Metrics", "Kennzahlen")}</th>
                <th className="py-1 pr-2 text-right">{tt("Of those, moved with value", "Davon mit dem Wert bewegt")}</th>
              </tr>
            </thead>
            <tbody>
              {PATTERN_IDS.map((p) => (
                <tr key={p} className="border-t border-line">
                  <td className="py-1 pr-2 font-semibold">{PATTERNS[p].label}</td>
                  <td className="tnum py-1 pr-2 text-right">{tally.count[p]}</td>
                  <td className="tnum py-1 pr-2 text-right">{tally.left[p]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-caption text-ash">{RISK_RULE.v}</p>
      </div>

      {PATTERN_IDS.map((p) => {
        const r = l1.rows[p];
        const fl = (k: string) => l1.rowFlags.includes(`${p}.${k}`);
        const any = fl("risk") || fl("meaning") || fl("measure");
        return (
          <div key={p} id={IDS.row(p)} className={clsx("space-y-3 rounded-lg border border-line bg-paper p-3.5", any && "is-flagged")}>
            <p className="font-semibold text-ink">
              {PATTERNS[p].label} <span className="font-normal text-ash">· {tt(`your tally: ${tally.count[p]} metrics, ${tally.left[p]} moved with value`, `Ihre Auszählung: ${tally.count[p]} Kennzahlen, ${tally.left[p]} mit dem Wert bewegt`)}</span>
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <p className="smallcaps">{tt("Link to customer value (from your tally)", "Verbindung zum Kundenwert (aus Ihrer Auszählung)")}</p>
                <OptionList<Risk> label={tt(`Link to value of ${PATTERNS[p].label}`, `Verbindung zum Wert von ${PATTERNS[p].label}`)} value={r.risk} onChange={(v) => setRow(p, { risk: v })} options={RISKS.map((x) => ({ id: x, label: `${RISK_GLYPH[x]} ${RISK_LABEL[x]}` }))} />
                {fl("risk") && <p className="mt-1 text-caption text-ink"><span className="smallcaps mr-1 text-accent">{tt("Clue", "Hinweis")}</span>{tt("Read your own tally for this kind against the rule above: what share of its metrics moved with customer value?", "Lesen Sie Ihre eigene Auszählung für diese Art gegen die Regel oben: Welcher Anteil ihrer Kennzahlen bewegte sich mit dem Kundenwert?")}</p>}
              </div>
              <div>
                <label htmlFor={`meaning-${p}`} className="smallcaps block">
                  {tt("What it tells management", "Was es dem Management sagt")}
                </label>
                <select id={`meaning-${p}`} className="field mt-1" value={r.meaning ?? ""} onChange={(e) => setRow(p, { meaning: (e.target.value || null) as MeaningId | null })}>
                  <option value="">{tt("Choose…", "Wählen…")}</option>
                  {MEANINGS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                </select>
                {fl("meaning") && <p className="mt-1 text-caption text-ink"><span className="smallcaps mr-1 text-accent">{tt("Clue", "Hinweis")}</span>{tt("Ask the kind's test question from Materi A5: who acts, and does it come before the result, is it the result, or is it a limit?", "Stellen Sie die Testfrage der Art aus Materi A5: Wer handelt, und kommt es vor dem Ergebnis, ist es das Ergebnis, oder ist es eine Grenze?")}</p>}
              </div>
            </div>
            <div>
              <p className="smallcaps">{tt("How to use it", "Wie man sie nutzt")}</p>
              <OptionList<PMeasureId> label={tt(`Use of ${PATTERNS[p].label}`, `Nutzung von ${PATTERNS[p].label}`)} value={r.measure} onChange={(v) => setRow(p, { measure: v })} options={PMEASURES.map((x) => ({ id: x.id, label: x.label }))} />
              {fl("measure") && <p className="mt-1 text-caption text-ink"><span className="smallcaps mr-1 text-accent">{tt("Clue", "Hinweis")}</span>{tt("Which use fits what this kind tells management (Materi A5)? A bonus paid on a number rewards reporting it, not moving it.", "Welche Nutzung passt zu dem, was diese Art dem Management sagt (Materi A5)? Ein Bonus auf eine Zahl belohnt, dass sie berichtet wird, nicht dass sie bewegt wird.")}</p>}
            </div>
          </div>
        );
      })}
      <CheckBar onCheck={check} checkLabel={tt("Check my rows", "Meine Zeilen prüfen")} checks={l1.checks} />
      {l1.rowResult && (
        <Reading>
          {tt(`${l1.rowResult.holds} of ${l1.rowResult.total} settings hold (link against your own tally, meaning and use for each kind). Rows with a setting that does not hold are outlined; each outlined part has a clue.`, `${l1.rowResult.holds} von ${l1.rowResult.total} Einstellungen stimmen (Verbindung gegen Ihre eigene Auszählung, Bedeutung und Nutzung für jede Art). Zeilen mit einer nicht stimmenden Einstellung sind markiert; jeder markierte Teil hat einen Hinweis.`)}
        </Reading>
      )}
      <AnswerKey block={rowKey()} />

      <div id={IDS.unc} className="space-y-2 border-t border-line pt-3">
        <p className="font-semibold text-ink">{tt("Which uncertainties sit in the speed figures?", "Welche Unsicherheiten stecken in den Tempo-Werten?")}</p>
        <p className="text-caption text-ash">{tt("Choose two or more that are real uncertainties of LiveConnect's speed figures (Block 1.2) and web data.", "Wählen Sie zwei oder mehr, die echte Unsicherheiten der Tempo-Werte von LiveConnect (Block 1.2) und seiner Webdaten sind.")}</p>
        <OptionList<UncId> multi label={tt("Uncertainties", "Unsicherheiten")} options={UNCERTAINTIES.map((w) => ({ id: w.id, label: w.label }))} value={l1.unc} onChange={toggleUnc} />
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => patch((s) => ({ checks: s.checks + 1, uncResult: uncHolds(s.unc) }))} className="btn-ghost btn-sm">
            {tt("Check my choices", "Meine Auswahl prüfen")}
          </button>
          {l1.uncResult && (
            <span role="status" className="text-caption text-ink">
              {l1.uncResult.chosen === 0 ? tt("Nothing chosen yet.", "Noch nichts gewählt.") : tt(`${l1.uncResult.holds} of ${l1.uncResult.chosen} chosen are real uncertainties. The others are beliefs about measurement that Materi A5 and A6 show to be wrong.`, `${l1.uncResult.holds} von ${l1.uncResult.chosen} gewählten sind echte Unsicherheiten. Die anderen sind Annahmen über Messung, die Materi A5 und A6 als falsch zeigen.`)}
            </span>
          )}
        </div>
        <AnswerKey block={uncKey()} />
      </div>
      <TextBox
        id={IDS.misread}
        label={tt("Your three KPIs for LiveConnect", "Ihre drei KPIs für LiveConnect")}
        help={tt(`Name three KPIs from the twelve metrics: at least one outcome and one driver (a guardrail may be the third). For each, say where the number comes from and a target. At least ${MIN_SENTENCE} characters.`, `Nennen Sie drei KPIs aus den zwölf Kennzahlen: mindestens ein Outcome und einen Treiber (eine Guardrail kann der dritte sein). Sagen Sie für jeden, woher die Zahl kommt, und ein Ziel. Mindestens ${MIN_SENTENCE} Zeichen.`)}
        value={l1.misread}
        onChange={(v) => patch({ misread: v })}
        min={MIN_SENTENCE}
        rows={4}
      />
      {mentor && <MentorGuide guide={misreadGuide()} />}
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 2.3 */

const AB_CLUE_TEXT = {
  hyp: () => tt("Write it as “If we …, then … rises, because …”: the change, the KPI you expect to move, and why.", "Schreiben Sie es als „Wenn wir …, dann steigt …, weil …“: die Änderung, den KPI, der sich bewegen soll, und warum."),
  rule: () => tt("A decision rule needs a number to decide by: from what uplift do you roll out, and when do you stop?", "Eine Entscheidungsregel braucht eine Zahl, nach der entschieden wird: Ab welchem Uplift rollen Sie aus, und wann stoppen Sie?"),
};

export function Block23() {
  const l1 = useStore((s) => s.l1);
  const patch = useStore((s) => s.patchL1);
  const mentor = useStore((s) => s.mentorUnlocked);
  const ab = l1.ab;
  const set = (k: AbPart | "hyp" | "rule", v: string | null) => patch((s) => ({ ab: { ...s.ab, [k]: v }, abFlags: s.abFlags.filter((f) => f !== k) }));
  const check = () => patch((s) => ({ checks: s.checks + 1, abFlags: abFlagsOf(s.ab), abChecked: true, abClue: false }));
  const flagged = (k: string) => l1.abFlags.includes(k);
  const nParts = AB_PARTS.filter((k) => !!ab[k]).length;
  const nWrong = AB_PARTS.filter((k) => flagged(k)).length;
  return (
    <AnswerBlock
      id="block-2-3"
      title={tt("Block 2.3 · Design a fair A/B test", "Block 2.3 · Einen fairen A/B-Test entwerfen")}
      kind="OBJECTIVE + JUDGED"
      minutes={BLOCK_MINUTES["2.3"]}
      findIt={tt("Route 1 → Task 1 → the test card below, and the pricing page in Block 1.3. Answer on the test card.", "Route 1 → Task 1 → die Testkarte unten und die Preisseite in Block 1.3. Antworten Sie auf der Testkarte.")}
    >
      <MaterialRefs refs={["A6"]} />
      <p className="text-body text-ink">
        <Gloss>{tt("The speed figures in Block 1.2 compare requests that sales chose to answer fast or slowly, so they are not a fair test. Design the test that would let LiveConnect decide whether a chat on the pricing page works: what changes, who is compared, which KPI decides, and when the test is read. Write a hypothesis and a decision rule.", "Die Tempo-Werte in Block 1.2 vergleichen Anfragen, die der Vertrieb schnell oder langsam beantworten wollte, sind also kein fairer Test. Entwerfen Sie den Test, mit dem LiveConnect entscheiden kann, ob ein Chat auf der Preisseite wirkt: was sich ändert, wer verglichen wird, welcher KPI entscheidet und wann der Test gelesen wird. Schreiben Sie eine Hypothese und eine Entscheidungsregel.")}</Gloss>
      </p>
      <TextBox
        id={IDS.abPart("hyp")}
        label={tt("Hypothesis", "Hypothese")}
        help={tt("One sentence: “If we …, then … rises, because …”.", "Ein Satz: „Wenn wir …, dann steigt …, weil …“.")}
        value={ab.hyp}
        onChange={(v) => set("hyp", v)}
        min={MIN_LINE}
        rows={2}
        flagged={flagged("hyp")}
        clue={AB_CLUE_TEXT.hyp()}
        clueShown={l1.abClue}
        onShowClue={() => patch({ abClue: true })}
      />
      <div className="grid gap-3 md:grid-cols-2">
        {AB_PARTS.map((k) => {
          const part = AB[k];
          const opt = part.options.find((o) => o.id === ab[k]);
          return (
            <div key={k} id={IDS.abPart(k)} className={clsx("space-y-1.5 rounded-lg border border-line bg-paper p-3", flagged(k) && "is-flagged")}>
              <p className="font-semibold text-ink">{part.label}</p>
              <p className="text-caption text-ash">{part.help}</p>
              <OptionList<string> label={part.label} value={ab[k]} onChange={(v) => set(k, v)} options={part.options.map((o) => ({ id: o.id, label: o.label }))} />
              {flagged(k) && opt && (
                <p className="text-caption text-ink">
                  <span className="smallcaps mr-1 text-accent">{tt("Clue", "Hinweis")}</span>
                  {opt.clue}
                </p>
              )}
            </div>
          );
        })}
      </div>
      <TextBox
        id={IDS.abPart("rule")}
        label={tt("Decision rule", "Entscheidungsregel")}
        help={tt("Written before the test starts: when you roll out, when you keep testing, when you stop, and which guardrail must hold. Use numbers.", "Vor dem Teststart geschrieben: wann Sie ausrollen, wann Sie weiter testen, wann Sie stoppen, und welche Guardrail halten muss. Nutzen Sie Zahlen.")}
        value={ab.rule}
        onChange={(v) => set("rule", v)}
        min={MIN_LINE}
        rows={3}
        flagged={flagged("rule")}
        clue={AB_CLUE_TEXT.rule()}
        clueShown={l1.abClue}
        onShowClue={() => patch({ abClue: true })}
      />
      <CheckBar onCheck={check} checkLabel={tt("Check my test card", "Meine Testkarte prüfen")} checks={l1.checks} />
      {l1.abChecked && (
        <Reading>
          {nParts === 0
            ? tt("No part of the test card is chosen yet.", "Noch ist kein Teil der Testkarte gewählt.")
            : tt(`${nParts - nWrong} of ${nParts} chosen parts make the test fair.`, `${nParts - nWrong} von ${nParts} gewählten Teilen machen den Test fair.`)}
          {flagged("hyp") ? tt(" The hypothesis needs “if … because …”.", " Die Hypothese braucht „wenn … weil …“.") : ""}
          {flagged("rule") ? tt(" The decision rule needs a number.", " Die Entscheidungsregel braucht eine Zahl.") : ""}
          {l1.abFlags.length > 0 ? tt(" Each outlined part has a clue.", " Jeder markierte Teil hat einen Hinweis.") : ""}
        </Reading>
      )}
      <AnswerKey block={abKey()} />
      {mentor && <MentorGuide guide={abGuide()} />}
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 2.4 */

export function Block24() {
  const l1 = useStore((s) => s.l1);
  const patch = useStore((s) => s.patchL1);
  const mentor = useStore((s) => s.mentorUnlocked);
  const chosen = l1.chosen;
  const cost = totalCost(chosen);
  const cov = coverage(l1);
  const shown = l1.order.length === chosen.length && chosen.every((id) => l1.order.includes(id)) ? l1.order : chosen;
  const inv = orderInversions({ ...l1, order: shown });
  const toggle = (id: MeasureId) =>
    patch((s) => {
      const next = s.chosen.includes(id) ? s.chosen.filter((x) => x !== id) : [...s.chosen, id];
      return { chosen: next, order: s.order.filter((x) => next.includes(x)), measureFlags: [] };
    });
  const setAims = (id: MeasureId, aims: ProblemId[]) => patch((s) => ({ aims: { ...s.aims, [id]: aims }, measureFlags: s.measureFlags.filter((f) => f !== `${id}.aims`) }));
  const setScore = (k: "exp" | "fea" | "eff", id: MeasureId, v: Score) => patch((s) => ({ [k]: { ...s[k], [id]: v }, measureFlags: k === "exp" ? s.measureFlags.filter((f) => f !== `${id}.exp`) : s.measureFlags }) as Partial<typeof s>);
  const move = (id: MeasureId, d: -1 | 1) => {
    const list = [...shown];
    const i = list.indexOf(id);
    const j = i + d;
    if (j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
    patch({ order: list });
  };
  const check = () =>
    patch((s) => {
      const flags: string[] = [];
      for (const id of s.chosen) {
        if (s.aims[id] !== undefined && !aimsHold(id, s.aims[id])) flags.push(`${id}.aims`);
        if (s.exp[id] && !expHolds(id, s.exp[id])) flags.push(`${id}.exp`);
      }
      return { checks: s.checks + 1, measureFlags: flags };
    });
  const nA = l1.measureFlags.filter((f) => f.endsWith(".aims")).length;
  const nE = l1.measureFlags.filter((f) => f.endsWith(".exp")).length;
  return (
    <AnswerBlock
      id="block-2-4"
      title={tt("Block 2.4 · Choose three measures, score them, put them in order", "Block 2.4 · Drei Maßnahmen wählen, bewerten, in eine Reihenfolge bringen")}
      kind="OBJECTIVE + JUDGED"
      minutes={BLOCK_MINUTES["2.4"]}
      findIt={tt(`Route 1 → Task 1 → “The limits” in the case above (${euro(BUDGET)}, ${MONTHS} months) and the nine measures below. Answer by choosing three and filling their cards.`, `Route 1 → Task 1 → „Die Grenzen“ im Fall oben (${euro(BUDGET)}, ${MONTHS} Monate) und die neun Maßnahmen unten. Antworten Sie, indem Sie drei wählen und ihre Karten ausfüllen.`)}
    >
      <MaterialRefs refs={["A7"]} />
      <div id={IDS.measurePick} className="space-y-2">
        <p className="text-body text-ink">
          <Gloss>{tt("Choose exactly three of the nine measures. Each says what it does and after how many weeks it works; it does not say which problem of the brief it answers. That is your job.", "Wählen Sie genau drei der neun Maßnahmen. Jede sagt, was sie tut und nach wie vielen Wochen sie wirkt; sie sagt nicht, welches Problem des Auftrags sie beantwortet. Das ist Ihre Aufgabe.")}</Gloss>
        </p>
        <OptionList<MeasureId>
          multi
          label={tt("Measures", "Maßnahmen")}
          value={chosen}
          onChange={toggle}
          disabledIds={chosen.length >= CHOOSE ? MEASURES.map((m) => m.id) : []}
          onDisabledClick={() => scrollToAndFlash(IDS.measurePick, "warn")}
          options={MEASURES.map((m) => ({ id: m.id, label: tt(`${m.name} · ${euro(m.cost)} · ${m.weeks === 1 ? "1 week" : `${m.weeks} weeks`}`, `${m.name} · ${euro(m.cost)} · ${m.weeks === 1 ? "1 Woche" : `${m.weeks} Wochen`}`), sub: `${m.what} ${m.basis}` }))}
        />
        <p role="status" className="text-caption text-ash">
          {tt(`${chosen.length} of ${CHOOSE} chosen.`, `${chosen.length} von ${CHOOSE} gewählt.`)}
          {chosen.length >= CHOOSE ? tt(" To choose another, first remove one.", " Um eine andere zu wählen, entfernen Sie zuerst eine.") : ""}
        </p>
        <RevealHint id="aims-help" label={tt("Show the test questions", "Testfragen zeigen")} title={tt("How to match and score a measure · taught in Materi A7", "Wie man eine Maßnahme zuordnet und bewertet · aus Materi A7")}>
          <div className="space-y-2 text-caption text-ink">
            <p>{tt("Which problem of the brief does it answer? High bounce rates are answered by what keeps visitors on the page at the moment they would leave; low interaction by what gets them talking or asking; “measures not coordinated” only by what brings all measures onto one screen and one weekly decision. A measure can answer none.", "Welches Problem des Auftrags beantwortet sie? Hohe Absprungraten beantwortet, was Besucher in dem Moment hält, in dem sie gehen würden; geringe Interaktion, was sie ins Gespräch oder zum Fragen bringt; „Maßnahmen nicht abgestimmt“ nur, was alle Maßnahmen auf einen Bildschirm und eine wöchentliche Entscheidung bringt. Eine Maßnahme kann keines beantworten.")}</p>
            <p>{EXPLAIN_RULE.v}</p>
            <MaterialRefs refs={["A7"]} lead={tt("Taught in", "Gelehrt in")} />
          </div>
        </RevealHint>
      </div>
      {chosen.length > 0 && (
        <div className="space-y-3">
          <BudgetBar items={chosen.map((id) => ({ id, short: MEASURE_BY_ID[id].name.split(" ")[0], cost: MEASURE_BY_ID[id].cost }))} budget={BUDGET} title={tt(`Chosen measures against the ${euro(BUDGET)} budget`, `Gewählte Maßnahmen gegen das Budget von ${euro(BUDGET)}`)} />
          <p className="text-caption text-ash">
            {tt(`${chosen.length} measure${chosen.length === 1 ? "" : "s"} cost ${euro(cost)} of ${euro(BUDGET)}.`, `${chosen.length} ${chosen.length === 1 ? "Maßnahme kostet" : "Maßnahmen kosten"} ${euro(cost)} von ${euro(BUDGET)}.`)}
            {cost > BUDGET ? tt(` That is ${euro(cost - BUDGET)} over: leave out the lowest score.`, ` Das sind ${euro(cost - BUDGET)} zu viel: Lassen Sie den niedrigsten Wert weg.`) : tt(` ${euro(BUDGET - cost)} is left.`, ` ${euro(BUDGET - cost)} bleiben übrig.`)}
          </p>
        </div>
      )}
      {chosen.map((id) => {
        const m = MEASURE_BY_ID[id];
        const aims = l1.aims[id];
        const aF = l1.measureFlags.includes(`${id}.aims`);
        const eF = l1.measureFlags.includes(`${id}.exp`);
        return (
          <div key={id} id={IDS.measure(id)} className={clsx("space-y-3 rounded-lg border border-line bg-paper p-3.5", (aF || eF) && "is-flagged")}>
            <p className="font-semibold text-ink">
              {m.name} <span className="font-normal text-ash">· {euro(m.cost)} · {EVIDENCE_LABEL[m.evidence]} ({m.weeks} {tt("weeks", "Wochen")})</span>
            </p>
            <div>
              <p className="smallcaps">{tt("Which problems of the brief does it answer? (choose the ones it really answers, or none)", "Welche Probleme des Auftrags beantwortet sie? (wählen Sie die, die sie wirklich beantwortet, oder keines)")}</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {PROBLEM_IDS.map((f) => {
                  const on = aims?.includes(f) ?? false;
                  return (
                    <button key={f} type="button" aria-pressed={on} onClick={() => setAims(id, on ? (aims ?? []).filter((x) => x !== f) : [...(aims ?? []), f])} className={clsx("btn btn-sm min-h-[40px] border", on ? "border-accent bg-accentSoft text-ink" : "border-line bg-paper text-ash hover:border-ash")}>
                      {on ? "☑ " : "☐ "}
                      {PROBLEM_LABEL[f]}
                    </button>
                  );
                })}
                <button type="button" aria-pressed={aims !== undefined && aims.length === 0} onClick={() => setAims(id, [])} className={clsx("btn btn-sm min-h-[40px] border", aims !== undefined && aims.length === 0 ? "border-accent bg-accentSoft text-ink" : "border-line bg-paper text-ash hover:border-ash")}>
                  {tt("None of the three", "Keines der drei")}
                </button>
              </div>
              {aF && (
                <p className="mt-1 text-caption text-ink">
                  <span className="smallcaps mr-1 text-accent">{tt("Clue", "Hinweis")}</span>
                  {tt("Read what this measure does: does it keep visitors at the moment they would leave, get them to interact, or coordinate the other measures? Name only what it really does.", "Lesen Sie, was diese Maßnahme tut: Hält sie Besucher in dem Moment, in dem sie gehen würden, bringt sie sie zur Interaktion, oder stimmt sie die anderen Maßnahmen ab? Nennen Sie nur, was sie wirklich tut.")}
                </p>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <p className="smallcaps">{tt("Speed (from the weeks until it works)", "Tempo (aus den Wochen, bis sie wirkt)")}</p>
                <ScorePick label={tt(`Speed of ${m.name}`, `Tempo von ${m.name}`)} value={l1.exp[id] || 0} onChange={(v) => setScore("exp", id, v)} flagged={eF} />
                {eF && <p className="mt-1 text-micro normal-case tracking-normal text-ink">{tt(`It is ${EVIDENCE_LABEL[m.evidence]} (${m.weeks === 1 ? "1 week" : `${m.weeks} weeks`}). Read that against the rule in Materi A7.`, `Sie ist ${EVIDENCE_LABEL[m.evidence]} (${m.weeks} Wochen). Lesen Sie das gegen die Regel in Materi A7.`)}</p>}
              </div>
              <div>
                <p className="smallcaps">{tt("Scalability", "Skalierbarkeit")}</p>
                <ScorePick label={tt(`Scalability of ${m.name}`, `Skalierbarkeit von ${m.name}`)} value={l1.fea[id] || 0} onChange={(v) => setScore("fea", id, v)} />
              </div>
              <div>
                <p className="smallcaps">{tt("Effect", "Wirkung")}</p>
                <ScorePick label={tt(`Effect of ${m.name}`, `Wirkung von ${m.name}`)} value={l1.eff[id] || 0} onChange={(v) => setScore("eff", id, v)} />
              </div>
            </div>
            <p className="tnum text-caption text-ink" aria-live="polite">
              {tt("Score: ", "Wert: ")}
              {measureScored(l1, id) ? `${l1.eff[id]} × ${l1.exp[id]} × ${l1.fea[id]} = ` : tt("fill all three scores · ", "alle drei Werte ausfüllen · ")}
              <strong>{measureScore(l1, id) || "—"}</strong>
            </p>
            {mentor && <MentorGuide guide={scoreGuide(id)} />}
          </div>
        );
      })}
      {chosen.length > 0 && (
        <div className="space-y-2">
          <p className="smallcaps">{tt("Which problems of the brief do your measures answer? (from what each really answers)", "Welche Probleme des Auftrags beantworten Ihre Maßnahmen? (aus dem, was jede wirklich beantwortet)")}</p>
          <ul className="grid gap-1.5 sm:grid-cols-2">
            {cov.map((c) => (
              <li key={c.pattern} className={clsx("rounded-md border px-3 py-1.5 text-caption", c.covered ? "border-signal/40 bg-signalSoft text-ink" : "border-dashed border-ash bg-mist text-ink")}>
                <span aria-hidden>{c.covered ? "● " : "○ "}</span>
                <strong>{PROBLEM_LABEL[c.pattern]}</strong>: {c.covered ? tt("at least one chosen measure answers it", "mindestens eine gewählte Maßnahme beantwortet es") : tt("nothing you chose answers it", "nichts Gewähltes beantwortet es")}
              </li>
            ))}
          </ul>
        </div>
      )}
      <CheckBar onCheck={check} checkLabel={tt("Check my measures", "Meine Maßnahmen prüfen")} checks={l1.checks} />
      {chosen.length > 0 && l1.checks > 0 && (
        <Reading>
          {l1.measureFlags.length > 0
            ? tt(`${nA} measure${nA === 1 ? " names" : "s name"} problems it does not answer, and ${nE} speed score${nE === 1 ? " does not" : "s do not"} follow the weeks printed. They are outlined above.`, `${nA} ${nA === 1 ? "Maßnahme nennt" : "Maßnahmen nennen"} Probleme, die sie nicht beantworten, und ${nE} ${nE === 1 ? "Wert für Tempo folgt" : "Werte für Tempo folgen"} nicht den gedruckten Wochen. Sie sind oben markiert.`)
            : tt("The problems you named and the speed scores match the measures. Effect and scalability are your judgement.", "Die genannten Probleme und die Werte für Tempo passen zu den Maßnahmen. Wirkung und Skalierbarkeit sind Ihr Urteil.")}
          {cost > BUDGET ? tt(` The plan is ${euro(cost - BUDGET)} over the budget.`, ` Der Plan liegt ${euro(cost - BUDGET)} über dem Budget.`) : ""}
        </Reading>
      )}
      <AnswerKey block={measureKey()} />
      {chosen.length === CHOOSE && (
        <div id={IDS.order} className="space-y-2 border-t border-line pt-3">
          <p className="font-semibold text-ink">{tt("Put your three measures in priority order", "Bringen Sie Ihre drei Maßnahmen in eine Reihenfolge")}</p>
          <ol className="space-y-1.5">
            {shown.map((id, i) => (
              <li key={id} className="flex items-center gap-2 rounded-lg border border-line bg-paper px-3 py-1.5">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink text-caption font-bold text-paper">{i + 1}</span>
                <span className="min-w-0 flex-1 text-caption text-ink">
                  {MEASURE_BY_ID[id].name} <span className="tnum text-ash">· {tt("score", "Wert")} {measureScore(l1, id) || "—"}</span>
                </span>
                <button type="button" onClick={() => move(id, -1)} aria-label={tt(`Move ${MEASURE_BY_ID[id].name} up`, `${MEASURE_BY_ID[id].name} nach oben`)} className="btn-ghost btn-sm min-w-[40px]">
                  ↑
                </button>
                <button type="button" onClick={() => move(id, 1)} aria-label={tt(`Move ${MEASURE_BY_ID[id].name} down`, `${MEASURE_BY_ID[id].name} nach unten`)} className="btn-ghost btn-sm min-w-[40px]">
                  ↓
                </button>
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => patch({ order: [...shown] })} className={clsx("btn-sm", l1.order.length === CHOOSE ? "btn-ghost" : "btn-primary")}>
              {l1.order.length === CHOOSE && chosen.every((id) => l1.order.includes(id)) ? tt("✓ Order kept", "✓ Reihenfolge übernommen") : tt("Keep this order", "Diese Reihenfolge übernehmen")}
            </button>
            {inv.length > 0 && (
              <span role="status" className="text-caption text-ink">
                <span className="smallcaps mr-1 text-accent">{tt("Check", "Prüfung")}</span>
                {tt(`${inv.length} measure${inv.length === 1 ? " sits" : "s sit"} above one with a higher score. If deliberate, say why below.`, `${inv.length} ${inv.length === 1 ? "Maßnahme steht" : "Maßnahmen stehen"} über einer mit höherem Wert. Ist das Absicht, sagen Sie unten, warum.`)}
              </span>
            )}
          </div>
          <AnswerKey block={orderKey()} />
          <TextBox
            id={IDS.why}
            label={tt("Why does your first priority go first?", "Warum kommt Ihre erste Priorität zuerst?")}
            help={tt("Give the order, name the score or the speed figure that decides it, say what the plan costs against the budget, and what you left out. At least 60 characters.", "Nennen Sie die Reihenfolge, den Wert oder die Tempozahl, die sie entscheidet, was der Plan gegen das Budget kostet und was Sie weggelassen haben. Mindestens 60 Zeichen.")}
            value={l1.why}
            onChange={(v) => patch({ why: v })}
            min={60}
            rows={4}
          >
            <WritingHelp
              id="why-help"
              steps={[
                tt("Say which measure goes first and why: its score, or the extra revenue from Block 1.2.", "Sagen Sie, welche Maßnahme zuerst kommt und warum: ihr Wert, oder der zusätzliche Umsatz aus Block 1.2."),
                tt("Say what the three cost against the €170,000.", "Sagen Sie, was die drei gegen die 170.000 € kosten."),
                tt("Say what you left out and why.", "Sagen Sie, was Sie weggelassen haben und warum."),
              ]}
              refs={[{ label: tt("Budget", "Budget"), value: euro(BUDGET), target: IDS.measurePick }]}
            />
          </TextBox>
          {mentor && <MentorGuide guide={whyGuide()} />}
        </div>
      )}
    </AnswerBlock>
  );
}
