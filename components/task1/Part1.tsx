"use client";

import clsx from "clsx";
import { AnswerBlock } from "@/components/ui/AnswerBlock";
import { AnswerKey } from "@/components/ui/AnswerKey";
import { BlockMissing } from "@/components/ui/BlockMissing";
import { ExampleAnswer } from "@/components/ui/ExampleAnswer";
import { CheckBar, OptionList, Reading, TextBox } from "@/components/ui/Inputs";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { MentorGuide } from "@/components/ui/MentorGuide";
import { PlacementBoard } from "@/components/ui/PlacementBoard";
import { RevealHint } from "@/components/ui/RevealHint";
import { WritingHelp } from "@/components/ui/WritingHelp";
import { LEVEL_TAGS, LEVEL_TESTS, LINES, LINE_KEY } from "@/data/ladder";
import type { LevelTag, LineId } from "@/data/ladder";
import { BASES, BASIS_LABEL, CUSTOMERS, DECISION_LABEL, INSIGHT_COUNT, INSIGHT_FRAME, INSIGHT_MIN, KNOWN_LABEL, LEAVE_MIN, PICK, PILOT, FORECAST } from "@/data/forecast";
import type { Basis, CustId, } from "@/data/forecast";
import { citesForecastFigure, insightFlags, pickHolds, sortHolds } from "@/lib/checks";
import { scrollToAndFlash } from "@/lib/flash";
import { Gloss } from "@/lib/glossify";
import { IDS } from "@/lib/missing";
import { euro, num, pct, tt } from "@/lib/lang";
import { extraInsightGuide, insightGuide, meaningGuide, reflectGuide } from "@/lib/mentorGuide";
import { pickKey, sortKey } from "@/lib/answerKey";
import { MIN_LINE, MIN_SENTENCE } from "@/lib/progress";
import { BLOCK_MINUTES } from "@/lib/routes";
import { useStore } from "@/store/useStore";

/* ------------------------------------------------------------------ Block 1.1 */

export function Block11() {
  const l1 = useStore((s) => s.l1);
  const place = useStore((s) => s.placeLine);
  const undo = useStore((s) => s.undoSort);
  const redo = useStore((s) => s.redoSort);
  const patch = useStore((s) => s.patchL1);
  const mentor = useStore((s) => s.mentorUnlocked);
  return (
    <AnswerBlock
      id="block-1-1"
      title={tt("Block 1.1 · Respond, personalise or learn?", "Block 1.1 · Reagieren, personalisieren oder lernen?")}
      kind="OBJECTIVE"
      core
      minutes={BLOCK_MINUTES["1.1"]}
      findIt={tt("Route 1 → Task 1 → the nine real-time ideas on the sort board below, from LiveConnect's service, sales, marketing and product teams. Answer on the sort board.", "Route 1 → Task 1 → die neun Echtzeit-Ideen auf der Sortiertafel unten, aus Service, Vertrieb, Marketing und Produkt von LiveConnect. Antworten Sie auf der Sortiertafel.")}
    >
      <MaterialRefs refs={["A1", "A2", "A3"]} />
      <PlacementBoard<LevelTag>
        items={LINES.map((r) => ({ id: r.id, meta: r.source, text: r.text }))}
        bins={LEVEL_TAGS.map((t) => ({ id: t.id, label: t.label, hint: t.hint }))}
        value={l1.sort}
        onPlace={(id, tag) => place(id as LineId, tag)}
        onUndo={undo}
        onRedo={redo}
        undoCount={l1.sortHistory.length}
        redoCount={l1.sortFuture.length}
        domId={IDS.line}
        keyPhrases={LINE_KEY}
        clues={Object.fromEntries(LINES.map((r) => [r.id, r.clue]))}
        reasons={Object.fromEntries(LINES.map((r) => [r.id, r.why]))}
        result={l1.sortResult}
        checks={l1.sortChecks}
        onCheck={() => patch((s) => ({ checks: s.checks + 1, sortChecks: s.sortChecks + 1, sortResult: sortHolds(s.sort) }))}
        onClue={() => patch({ sortClue: true })}
        clueShown={l1.sortClue}
        reasoningOpened={l1.sortReasoning}
        onOpenReasoning={() => patch({ sortReasoning: true })}
        noun={tt("idea", "Idee")}
        intro={tt("Drag an idea onto a lever, or select it and then select a lever. Select a placed one to move it again. One lever per idea: the one the idea mainly pulls.", "Ziehen Sie eine Idee auf einen Hebel, oder wählen Sie sie aus und dann einen Hebel. Wählen Sie eine platzierte Idee, um sie zu verschieben. Ein Hebel pro Idee: der, an dem die Idee vor allem zieht.")}
        tests={
          <RevealHint id="sort-tests" label={tt("Show the test questions", "Testfragen zeigen")} title={tt("Test questions · taught in Materi A1 to A3", "Testfragen · aus Materi A1 bis A3")}>
            <div className="space-y-2 text-caption text-ink">
              <p>{tt("Ask these of every idea. They repeat the tests from Materi A1 to A3; they never say which idea goes where.", "Stellen Sie diese Fragen zu jeder Idee. Sie wiederholen die Tests aus Materi A1 bis A3; sie sagen nie, welche Idee wohin gehört.")}</p>
              <ul className="space-y-1.5">
                {LEVEL_TESTS.map((c) => (
                  <li key={c.name}>
                    <span className="font-semibold">{c.name}. </span>
                    <Gloss>{c.test}</Gloss>
                  </li>
                ))}
              </ul>
              <MaterialRefs refs={["A2", "A3"]} lead={tt("Taught in", "Gelehrt in")} />
            </div>
          </RevealHint>
        }
      />
      <TextBox
        id={IDS.extraInsight}
        label={tt("One real-time opportunity of your own", "Eine eigene Echtzeit-Chance")}
        help={tt("Name a moment in LiveConnect's customer contact, what happens there today, and what a real-time reaction would change (“so …”). At least 30 characters.", "Nennen Sie einen Moment im Kundenkontakt von LiveConnect, was dort heute passiert, und was eine Echtzeit-Reaktion ändern würde („also …“). Mindestens 30 Zeichen.")}
        value={l1.extraInsight}
        onChange={(v) => patch({ extraInsight: v })}
        min={MIN_LINE}
        rows={2}
      >
        <WritingHelp
          id="extra-insight-kit"
          refs={[
            { label: tt("Where visitors struggle today (the case)", "Wo Besucher heute Probleme haben (der Fall)"), value: tt("high bounce rates, low interaction, measures not coordinated", "hohe Absprungraten, geringe Interaktion, nicht abgestimmte Maßnahmen"), target: "case-brief" },
            { label: tt("The three levers (Materi A1 to A3)", "Die drei Hebel (Materi A1 bis A3)"), value: tt("respond faster · personalise the moment · learn and adjust", "schneller reagieren · den Moment personalisieren · lernen und anpassen"), target: "mat-A2" },
            { label: tt("The nine ideas above", "Die neun Ideen oben"), value: tt("see which moments the teams already name", "sehen Sie, welche Momente die Teams schon nennen"), target: IDS.line(LINES[0].id) },
          ]}
          steps={[
            tt("Name a moment in the customer contact: a page, a form or a reply (not “the whole site”).", "Nennen Sie einen Moment im Kundenkontakt: eine Seite, ein Formular oder eine Antwort (nicht „die ganze Website“)."),
            tt("Say what happens there today (visitors leave, a request waits).", "Sagen Sie, was dort heute passiert (Besucher gehen, eine Anfrage wartet)."),
            tt("Finish with “so …”: what a real-time reaction would change for the visitor.", "Schließen Sie mit „also …“: was eine Echtzeit-Reaktion für den Besucher ändern würde."),
          ]}
        />
      </TextBox>
      <ExampleAnswer id="extra-insight-example" guide={extraInsightGuide()} />
      {mentor && <MentorGuide guide={extraInsightGuide()} />}
      <AnswerKey block={sortKey()} />
      <BlockMissing block="1.1" route={1} />
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 1.2 (Optional, read-only) */

const row = (id: string, cells: string[]) => (
  <tr id={id} className="border-t border-line">
    <td className="px-3 py-2 font-semibold">{cells[0]}</td>
    {cells.slice(1).map((c, i) => (
      <td key={i} className="tnum px-3 py-2 text-right">
        {c}
      </td>
    ))}
  </tr>
);

export function Block12() {
  const l1 = useStore((s) => s.l1);
  const patch = useStore((s) => s.patchL1);
  const mentor = useStore((s) => s.mentorUnlocked);
  const check = () =>
    patch((s) => {
      const w = s.meaning.trim();
      return { checks: s.checks + 1, meaningFlagged: w !== "" && (w.length < MIN_SENTENCE || !citesForecastFigure(w)), meaningClue: false };
    });
  const pct1 = (v: number) => `${num(v, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`;
  return (
    <AnswerBlock
      id="block-1-2"
      title={tt("Block 1.2 · Read the speed figures: two closing rates side by side", "Block 1.2 · Die Tempo-Werte lesen: zwei Abschlussquoten nebeneinander")}
      kind="JUDGED"
      core={false}
      minutes={BLOCK_MINUTES["1.2"]}
      findIt={tt("Route 1 → Task 1 → the table “Last quarter” directly below, with the two closing rates the app prints. Answer in the field under the table.", "Route 1 → Task 1 → die Tabelle „Letztes Quartal“ direkt darunter, mit den zwei Abschlussquoten, die die App druckt. Antworten Sie im Feld unter der Tabelle.")}
    >
      <MaterialRefs refs={["A4"]} />
      <p className="text-body text-ink">
        <Gloss>
          {tt("LiveConnect's CRM shows how quote requests closed last quarter, split by how fast sales answered them. The app divides closed deals by requests and prints both closing rates for you; nothing is left to calculate. Your job is to read them side by side and say what they do and do not tell LiveConnect. How such a rate is worked out is shown in", "Das CRM von LiveConnect zeigt, wie Angebotsanfragen im letzten Quartal abgeschlossen wurden, aufgeteilt danach, wie schnell der Vertrieb sie beantwortete. Die App teilt Abschlüsse durch Anfragen und druckt beide Abschlussquoten für Sie; es bleibt nichts zu rechnen. Ihre Aufgabe ist, sie nebeneinander zu lesen und zu sagen, was sie LiveConnect sagen und was nicht. Wie eine solche Quote entsteht, zeigt")}
        </Gloss>{" "}
        <button type="button" onClick={() => scrollToAndFlash("mat-A4", "ref")} className="font-semibold text-accent underline decoration-dotted underline-offset-2">
          Materi A4
        </button>
        .
      </p>
      <div className="relative overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[30rem] border-collapse text-caption">
          <caption className="bg-mist px-3 py-2 text-left text-micro font-semibold uppercase text-ash">{tt("Last quarter · quote requests by speed of answer (Case assumption)", "Letztes Quartal · Angebotsanfragen nach Antworttempo (Fallannahme)")}</caption>
          <thead>
            <tr className="text-left text-micro uppercase text-ash">
              <th className="px-3 py-2">{tt("Group", "Gruppe")}</th>
              <th className="px-3 py-2 text-right">{tt("Requests", "Anfragen")}</th>
              <th className="px-3 py-2 text-right">{tt("Closed deals", "Abschlüsse")}</th>
              <th className="px-3 py-2 text-right">{tt("Closing rate (printed)", "Abschlussquote (gedruckt)")}</th>
            </tr>
          </thead>
          <tbody>
            {row("fc-ctl", [tt("Answered after more than a day", "Nach mehr als einem Tag beantwortet"), num(PILOT.control.sent), num(PILOT.control.orders), pct1(FORECAST.controlRate)])}
            {row("fc-var", [tt("Answered within one hour", "Innerhalb einer Stunde beantwortet"), num(PILOT.variant.sent), num(PILOT.variant.orders), pct1(FORECAST.f1)])}
          </tbody>
        </table>
      </div>
      <p className="text-caption text-ash">
        {tt(`Read it like this: of every 100 requests, ${num(FORECAST.controlRate, { maximumFractionDigits: 1 })} closed when answered after more than a day and ${num(FORECAST.f1, { maximumFractionDigits: 1 })} when answered within one hour, so fast answers closed ${num(FORECAST.f2)} times as often. But sales picked which requests to answer fast, so speed may not be the whole reason.`, `So lesen Sie es: Von je 100 Anfragen wurden ${num(FORECAST.controlRate, { maximumFractionDigits: 1 })} abgeschlossen, wenn sie nach mehr als einem Tag beantwortet wurden, und ${num(FORECAST.f1, { maximumFractionDigits: 1 })}, wenn sie innerhalb einer Stunde beantwortet wurden; schnelle Antworten schlossen also ${num(FORECAST.f2)}-mal so oft ab. Aber der Vertrieb wählte, welche Anfragen er schnell beantwortete, also ist Tempo vielleicht nicht der ganze Grund.`)}
      </p>
      <TextBox
        id={IDS.meaning}
        label={tt("What do the speed figures mean for LiveConnect?", "Was bedeuten die Tempo-Werte für LiveConnect?")}
        help={tt("One or two sentences. Quote at least one printed figure, say what LiveConnect should do next, and why it cannot be sure yet that speed alone made the difference.", "Ein oder zwei Sätze. Zitieren Sie mindestens einen gedruckten Wert, sagen Sie, was LiveConnect als Nächstes tun sollte, und warum es noch nicht sicher sein kann, dass allein das Tempo den Unterschied machte.")}
        value={l1.meaning}
        onChange={(v) => patch({ meaning: v, meaningFlagged: false })}
        min={MIN_SENTENCE}
        rows={4}
        flagged={l1.meaningFlagged}
        clue={tt("Which printed figure says how much more often fast answers closed, and who decided which requests were answered fast? Quote one figure and say what follows.", "Welcher gedruckte Wert sagt, wie viel öfter schnelle Antworten abschlossen, und wer entschied, welche Anfragen schnell beantwortet wurden? Zitieren Sie einen Wert und sagen Sie, was folgt.")}
        clueShown={l1.meaningClue}
        onShowClue={() => patch({ meaningClue: true })}
      >
        <WritingHelp
          id="meaning-help"
          refs={[
            { label: tt("Closing rates, slow and fast", "Abschlussquoten, langsam und schnell"), value: `${pct1(FORECAST.controlRate)} · ${pct1(FORECAST.f1)}`, target: "fc-var" },
            { label: tt("Closed deals behind each group", "Abschlüsse hinter jeder Gruppe"), value: `${PILOT.control.orders} · ${PILOT.variant.orders}`, target: "fc-ctl" },
            { label: tt("Why a comparison like this is not yet proof (Materi A6)", "Warum ein solcher Vergleich noch kein Beweis ist (Materi A6)"), value: tt("sales chose which requests to answer fast", "der Vertrieb wählte, welche Anfragen schnell beantwortet wurden"), target: "mat-A6" },
          ]}
          steps={[
            tt("Say how much more often fast answers closed (the two rates, or “3 times”).", "Sagen Sie, wie viel öfter schnelle Antworten abschlossen (die zwei Quoten, oder „3-mal“)."),
            tt("Say what LiveConnect should do next, for example test answer speed fairly.", "Sagen Sie, was LiveConnect als Nächstes tun sollte, zum Beispiel das Antworttempo fair testen."),
            tt("Say it as an estimate: sales picked which requests to answer fast.", "Sagen Sie es als Schätzung: Der Vertrieb wählte, welche Anfragen er schnell beantwortete."),
          ]}
        />
      </TextBox>
      <ExampleAnswer id="meaning-example" guide={meaningGuide()} />
      {mentor && <MentorGuide guide={meaningGuide()} />}
      <CheckBar onCheck={check} checkLabel={tt("Check my sentence", "Meinen Satz prüfen")} checks={l1.checks} />
      {l1.checks > 0 && (
        <Reading>
          {!l1.meaningFlagged
            ? tt("Nothing is outlined by the last check.", "Die letzte Prüfung hat nichts markiert.")
            : tt("The sentence is outlined: it needs at least one printed figure and a few words more.", "Der Satz ist markiert: Er braucht mindestens einen gedruckten Wert und ein paar Worte mehr.")}
        </Reading>
      )}
      <BlockMissing block="1.2" route={1} />
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 1.3 */

export function Block13() {
  const l1 = useStore((s) => s.l1);
  const patch = useStore((s) => s.patchL1);
  const mentor = useStore((s) => s.mentorUnlocked);
  const toggle = (k: "valuable" | "churners", id: CustId) => patch((s) => ({ [k]: s[k].includes(id) ? s[k].filter((x) => x !== id) : [...s[k], id], pickResult: null }) as Partial<typeof s>);
  const setRow = (i: number, p: Partial<{ basis: Basis | null; text: string }>) => patch((s) => ({ insights: s.insights.map((h, j) => (j === i ? { ...h, ...p } : h)), insFlagged: s.insFlagged.filter((x) => x !== i) }));
  const check = () => patch((s) => ({ checks: s.checks + 1, insChecked: true, insClue: false, insFlagged: insightFlags(s), pickResult: pickHolds(s), pickClue: false }));
  const opts = CUSTOMERS.map((c) => ({ id: c.id, label: c.name }));
  return (
    <AnswerBlock
      id="block-1-3"
      title={tt("Block 1.3 · Where to respond at once, where to personalise, and three improvements", "Block 1.3 · Wo sofort reagieren, wo personalisieren, und drei Verbesserungen")}
      kind="OBJECTIVE + JUDGED"
      core
      minutes={BLOCK_MINUTES["1.3"]}
      findIt={tt("Route 1 → Task 1 → the table “Eight moments on the website” below: visitors a month, the share who leave there, whether a decision happens there, and what LiveConnect knows about the visitor. Answer in the two lists and the three fields under it.", "Route 1 → Task 1 → die Tabelle „Acht Momente auf der Website“ unten: Besucher pro Monat, der Anteil, der dort geht, ob dort eine Entscheidung fällt, und was LiveConnect über den Besucher weiß. Antworten Sie in den zwei Listen und den drei Feldern darunter.")}
    >
      <MaterialRefs refs={["A3"]} />
      <p className="rounded-md border border-line bg-mist/40 px-3 py-2 text-caption text-ink">
        <Gloss>
          {tt("How to read the table. Each row is one page or moment on LiveConnect's website. “Visitors a month” says how many people reach it. “Leave from here” says what share of them leave the website on that page (bold means 50% or more). “Decision here? · What we know” says whether visitors decide something there, such as asking for a quote, and what LiveConnect knows about the visitor: nothing, why they came, or who they are.", "So lesen Sie die Tabelle. Jede Zeile ist eine Seite oder ein Moment auf der Website von LiveConnect. „Besucher pro Monat“ sagt, wie viele Menschen sie erreichen. „Gehen von hier“ sagt, welcher Anteil von ihnen die Website auf dieser Seite verlässt (fett heißt 50 % oder mehr). „Entscheidung hier? · Was wir wissen“ sagt, ob Besucher dort etwas entscheiden, etwa ein Angebot anfragen, und was LiveConnect über den Besucher weiß: nichts, warum er kam, oder wer er ist.")}
        </Gloss>
      </p>
      <div className="relative overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[36rem] border-collapse text-caption">
          <caption className="bg-mist px-3 py-2 text-left text-micro font-semibold uppercase text-ash">{tt("Eight moments on the website · LiveConnect's web analytics (Case assumption)", "Acht Momente auf der Website · Web-Analyse von LiveConnect (Fallannahme)")}</caption>
          <thead>
            <tr className="text-left text-micro uppercase text-ash">
              <th className="px-3 py-2">{tt("Page", "Seite")}</th>
              <th className="px-3 py-2 text-right">{tt("Visitors a month", "Besucher pro Monat")}</th>
              <th className="px-3 py-2">{tt("Leave from here", "Gehen von hier")}</th>
              <th className="px-3 py-2">{tt("Decision here? · What we know", "Entscheidung hier? · Was wir wissen")}</th>
            </tr>
          </thead>
          <tbody>
            {CUSTOMERS.map((c) => (
              <tr key={c.id} id={`cust-${c.id}`} className="border-t border-line">
                <td className="px-3 py-2 font-semibold">{c.name}</td>
                <td className="tnum px-3 py-2 text-right">{num(c.volume)}</td>
                <td className={clsx("tnum px-3 py-2", c.leave >= LEAVE_MIN && "font-semibold")}>{pct(c.leave)}</td>
                <td className="px-3 py-2">{`${DECISION_LABEL[c.decision ? "yes" : "no"]} · ${KNOWN_LABEL[c.known]}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div id={IDS.valuable} className="space-y-1.5">
          <p className="font-semibold text-ink">{tt(`a · The ${PICK} moments where an immediate response matters most`, `a · Die ${PICK} Momente, in denen eine sofortige Reaktion am meisten zählt`)}</p>
          <OptionList<CustId> multi label={tt("Respond immediately", "Sofort reagieren")} value={l1.valuable} onChange={(id) => toggle("valuable", id)} disabledIds={l1.valuable.length >= PICK ? CUSTOMERS.map((c) => c.id) : []} onDisabledClick={() => scrollToAndFlash(IDS.valuable, "warn")} options={opts} />
          <p role="status" className="text-caption text-ash">{tt(`${l1.valuable.length} of ${PICK} chosen.`, `${l1.valuable.length} von ${PICK} gewählt.`)}</p>
        </div>
        <div id={IDS.churners} className="space-y-1.5">
          <p className="font-semibold text-ink">{tt(`b · The ${PICK} moments where personalisation helps most`, `b · Die ${PICK} Momente, in denen Personalisierung am meisten hilft`)}</p>
          <OptionList<CustId> multi label={tt("Personalise", "Personalisieren")} value={l1.churners} onChange={(id) => toggle("churners", id)} disabledIds={l1.churners.length >= PICK ? CUSTOMERS.map((c) => c.id) : []} onDisabledClick={() => scrollToAndFlash(IDS.churners, "warn")} options={opts} />
          <p role="status" className="text-caption text-ash">{tt(`${l1.churners.length} of ${PICK} chosen.`, `${l1.churners.length} von ${PICK} gewählt.`)}</p>
        </div>
      </div>
      {l1.pickResult && (
        <Reading>
          {tt(`${l1.pickResult.holds} of ${l1.pickResult.total} picks hold. A check never says which. `, `${l1.pickResult.holds} von ${l1.pickResult.total} Wahlen stimmen. Eine Prüfung sagt nie, welche. `)}
          {l1.pickClue ? (
            tt("Clue: an immediate response pays where a decision happens and many leave. Personalisation needs something you know about the visitor. Which pages have a decision and 50% or more leaving? Where do you know who the visitor is, or why they came?", "Hinweis: Eine sofortige Reaktion lohnt sich, wo eine Entscheidung fällt und viele gehen. Personalisierung braucht etwas, das Sie über den Besucher wissen. Welche Seiten haben eine Entscheidung und 50 % oder mehr, die gehen? Wo wissen Sie, wer der Besucher ist oder warum er kam?")
          ) : l1.pickResult.holds < l1.pickResult.total ? (
            <button type="button" onClick={() => patch({ pickClue: true })} className="btn-ghost btn-sm border-gold">
              {tt("Show clue", "Hinweis zeigen")}
            </button>
          ) : null}
        </Reading>
      )}
      <AnswerKey block={pickKey()} />
      <div className="space-y-3 border-t border-line pt-3">
        <p className="font-semibold text-ink">{tt("c · Three concrete improvements", "c · Drei konkrete Verbesserungen")}</p>
        <p className="text-body text-ink">
          <Gloss>{tt("Write three concrete improvements for LiveConnect, each pulling a different lever: respond faster, personalise the moment, or learn and adjust. Say what each gives the visitor.", "Schreiben Sie drei konkrete Verbesserungen für LiveConnect, jede an einem anderen Hebel: schneller reagieren, den Moment personalisieren oder lernen und anpassen. Sagen Sie, was jede dem Besucher bringt.")}</Gloss>
        </p>
        <p className="text-caption text-ash">
          {tt("The frame: ", "Der Rahmen: ")}
          {INSIGHT_FRAME.v}
        </p>
        {l1.insights.map((a, i) => (
          <div key={i} className="space-y-1.5">
            <TextBox
              id={IDS.insight(i)}
              label={tt(`Improvement ${i + 1}`, `Verbesserung ${i + 1}`)}
              help={tt(`Choose the lever, then write the improvement and what it gives the visitor in one or two sentences (“…, so …”), at least ${INSIGHT_MIN} characters.`, `Wählen Sie den Hebel und schreiben Sie dann die Verbesserung und was sie dem Besucher bringt in ein oder zwei Sätzen („…, sodass …“), mindestens ${INSIGHT_MIN} Zeichen.`)}
              value={a.text}
              onChange={(v) => setRow(i, { text: v })}
              min={INSIGHT_MIN}
              flagged={l1.insFlagged.includes(i)}
              clue={tt(`Use the frame: ${INSIGHT_FRAME.v} Choose a lever no other row uses, and finish with “so” and what the visitor gets.`, `Nutzen Sie den Rahmen: ${INSIGHT_FRAME.v} Wählen Sie einen Hebel, den keine andere Zeile nutzt, und schließen Sie mit „sodass“ und dem, was der Besucher bekommt.`)}
              clueShown={l1.insClue}
              onShowClue={() => patch({ insClue: true })}
            >
              <div>
                <label htmlFor={`insight-${i}-basis`} className="smallcaps block">
                  {tt("Lever", "Hebel")}
                </label>
                <select id={`insight-${i}-basis`} className="field mt-1 max-w-md" value={a.basis ?? ""} onChange={(e) => setRow(i, { basis: (e.target.value || null) as Basis | null })}>
                  <option value="">{tt("Choose the lever…", "Hebel wählen…")}</option>
                  {BASES.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                </select>
                {a.basis && <p className="mt-1 text-micro normal-case tracking-normal text-ash">{tt("Chosen: ", "Gewählt: ")}{BASIS_LABEL[a.basis]}</p>}
              </div>
            </TextBox>
            {i === 0 && (
          <WritingHelp
            id="insight-kit"
            refs={[
              { label: tt("What each lever does (Materi A1 to A3)", "Was jeder Hebel tut (Materi A1 bis A3)"), value: tt("a shorter wait · a page that fits the visitor · learning from results", "eine kürzere Wartezeit · eine Seite, die zum Besucher passt · Lernen aus Ergebnissen"), target: "mat-A3" },
              { label: tt("The moments on the website (table above)", "Die Momente auf der Website (Tabelle oben)"), value: tt("which pages lose visitors and what LiveConnect knows about them", "welche Seiten Besucher verlieren und was LiveConnect über sie weiß"), target: "cust-c1" },
            ]}
            steps={[
              tt("Choose the lever and name the page or moment you would change.", "Wählen Sie den Hebel und nennen Sie die Seite oder den Moment, den Sie ändern würden."),
              tt("Say the change in one sentence, concretely.", "Sagen Sie die Änderung in einem Satz, konkret."),
              tt("Finish with “so” and what the visitor gets.", "Schließen Sie mit „sodass“ und dem, was der Besucher bekommt."),
            ]}
          />
            )}
            <ExampleAnswer id={`insight-${i}-example`} guide={insightGuide(i)} />
            {mentor && <MentorGuide guide={insightGuide(i)} />}
          </div>
        ))}
      </div>
      <CheckBar onCheck={check} checkLabel={tt("Check my picks and improvements", "Meine Wahl und Verbesserungen prüfen")} checks={l1.checks} />
      {l1.insChecked && (
        <Reading>
          {l1.insFlagged.length === 0
            ? tt(`Nothing is outlined among the improvements. All ${INSIGHT_COUNT} pull different levers and say what the visitor gets; whether they are good is for you and your facilitator to judge.`, `Bei den Verbesserungen ist nichts markiert. Alle ${INSIGHT_COUNT} ziehen an verschiedenen Hebeln und sagen, was der Besucher bekommt; ob sie gut sind, beurteilen Sie und Ihre Moderation.`)
            : tt(`${l1.insFlagged.length} improvement${l1.insFlagged.length === 1 ? " is" : "s are"} outlined: the lever is missing or repeated, the text is short, or it does not say what the visitor gets.`, `${l1.insFlagged.length} ${l1.insFlagged.length === 1 ? "Verbesserung ist" : "Verbesserungen sind"} markiert: Der Hebel fehlt oder wiederholt sich, der Text ist kurz, oder er sagt nicht, was der Besucher bekommt.`)}
        </Reading>
      )}
      <BlockMissing block="1.3" route={1} />
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 1.4 */

export function Block14() {
  const l1 = useStore((s) => s.l1);
  const patch = useStore((s) => s.patchL1);
  const mentor = useStore((s) => s.mentorUnlocked);
  const fields: { k: "interpret" | "causation" | "decider"; label: string; help: string }[] = [
    { k: "interpret", label: tt("Why is speed a success factor, and where do delays occur in LiveConnect's customer contact?", "Warum ist Tempo ein Erfolgsfaktor, und wo entstehen Verzögerungen im Kundenkontakt von LiveConnect?"), help: tt("One or two sentences, using one moment from the table in Block 1.3 where visitors wait or leave today.", "Ein oder zwei Sätze, mit einem Moment aus der Tabelle in Block 1.3, in dem Besucher heute warten oder gehen.") },
    { k: "causation", label: tt("When is personalisation felt as added value, and when as intrusive?", "Wann wird Personalisierung als Mehrwert empfunden, und wann als aufdringlich?"), help: tt("Name one example of each from LiveConnect's pages, and what makes the difference.", "Nennen Sie je ein Beispiel von den Seiten von LiveConnect, und was den Unterschied macht.") },
    { k: "decider", label: tt("Which measures work immediately, and how would a strategic decision-maker prioritise?", "Welche Maßnahmen wirken sofort, und wie würde eine strategische Entscheiderin priorisieren?"), help: tt("Name what works this month, what takes longer but lasts, and in which order you would do them. Be concrete.", "Nennen Sie, was diesen Monat wirkt, was länger dauert, aber hält, und in welcher Reihenfolge Sie beides angehen. Seien Sie konkret.") },
  ];
  return (
    <AnswerBlock
      id="block-1-4"
      title={tt("Block 1.4 · Coaching reflection: from Level 1 to Level 2", "Block 1.4 · Coaching-Reflexion: von Level 1 zu Level 2")}
      kind="JUDGED"
      core={false}
      minutes={BLOCK_MINUTES["1.4"]}
      findIt={tt("Route 1 → Task 1 → your own answers in Blocks 1.1 and 1.3, and the cost of delay in Materi A1. Answer in the three fields below.", "Route 1 → Task 1 → Ihre eigenen Antworten in den Blöcken 1.1 und 1.3 und die Kosten der Verzögerung in Materi A1. Antworten Sie in den drei Feldern unten.")}
    >
      <MaterialRefs refs={["A1", "A2", "A3"]} />
      <p className="text-body text-ink">
        <Gloss>{tt("Before you make it measurable: why does speed matter, when is personalisation welcome, and what works first?", "Bevor Sie es messbar machen: Warum zählt Tempo, wann ist Personalisierung willkommen, und was wirkt zuerst?")}</Gloss>
      </p>
      {fields.map((f) => (
        <div key={f.k} className="space-y-1.5">
          <TextBox id={IDS.reflect(f.k)} label={f.label} help={f.help} value={l1.reflect[f.k]} onChange={(v) => patch((s) => ({ reflect: { ...s.reflect, [f.k]: v } }))} min={MIN_LINE} rows={3} />
          <ExampleAnswer id={`reflect-${f.k}-example`} guide={reflectGuide(f.k)} />
          {mentor && <MentorGuide guide={reflectGuide(f.k)} />}
        </div>
      ))}
      <BlockMissing block="1.4" route={1} />
    </AnswerBlock>
  );
}
