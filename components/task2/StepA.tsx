"use client";

import clsx from "clsx";
import { AnswerBlock } from "@/components/ui/AnswerBlock";
import { AnswerKey } from "@/components/ui/AnswerKey";
import { BlockMissing } from "@/components/ui/BlockMissing";
import { ExampleAnswer } from "@/components/ui/ExampleAnswer";
import { TextBox } from "@/components/ui/Inputs";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { MentorGuide } from "@/components/ui/MentorGuide";
import { RevealHint } from "@/components/ui/RevealHint";
import { WritingHelp } from "@/components/ui/WritingHelp";
import { ArchFacts } from "@/components/task2/Kits";
import { MentorCategory } from "@/components/task2/MentorCategory";
import { ARCH_BY_ID, R2_BUDGET, R2_MONTHS } from "@/data/route2";
import type { ArchId } from "@/data/route2";
import { ARCH_EXTRA } from "@/data/route2Extra";
import { CLEAN_ID, PANEL, TIER_LABEL, WEAK_POINTS } from "@/data/route2Panel";
import type { Tier } from "@/data/route2Panel";
import { architectureKey } from "@/lib/answerKey";
import { scrollToAndFlash } from "@/lib/flash";
import { Gloss } from "@/lib/glossify";
import { euro, tt } from "@/lib/lang";
import { architectureGuide, giveUpGuide, visionGuide } from "@/lib/mentorGuide";
import { IDS } from "@/lib/missing";
import { MIN_LINE, MIN_SENTENCE } from "@/lib/progress";
import { categoryOf, changesFor, planOf, readingOf, standingOf, tierOf } from "@/lib/r2Panel";
import type { Scn } from "@/lib/r2Panel";
import { BLOCK_MINUTES } from "@/lib/routes";
import { useR2Tests } from "@/store/useR2Tests";
import { useStore } from "@/store/useStore";

/** The order the items are built in: the base first, then the people and standards, then the data, then what moves a KPI, then what is held back. */
const BUILD_ORDER: ArchId[] = ["foundation", "routing", "tracking", "training", "chat", "personal", "suite", "relaunch"];

/** Step A (block 3.5, Core): when does each item happen, the target vision, and what the plan gives and what the learner gives up (CLAUDE.md #47). */
export function StepA({ scn }: { scn: Scn }) {
  const r2 = useStore((s) => s.r2);
  const patch = useStore((s) => s.patchR2);
  const mentor = useStore((s) => s.mentorUnlocked);
  const plan = planOf(r2, scn);
  const reading = readingOf(r2, scn);
  const standing = standingOf(r2, scn);
  const fix = changesFor(r2, scn);
  const cat = categoryOf(r2, 0);
  const setTier = (id: ArchId, tier: Tier) => patch((s) => ({ tier: { ...s.tier, [id]: tier } }));
  const nowNames = BUILD_ORDER.filter((id) => tierOf(r2, id) === "now").map((id) => PANEL[id].short);
  const notNames = BUILD_ORDER.filter((id) => tierOf(r2, id) === "not").map((id) => PANEL[id].short);
  const tiers = (id: ArchId): Tier[] => (id === CLEAN_ID ? ["now", "not"] : ["now", "later", "not"]);

  return (
    <AnswerBlock
      id="block-3-5"
      title={tt("Step A · Build the system", "Schritt A · Das System bauen")}
      kind="OBJECTIVE + JUDGED"
      minutes={BLOCK_MINUTES["3.5"]}
      core
      findIt={tt(
        `Route 2 → Task 2 → the panel above (the diagram and the three bars) and the eight item cards below. The budget is ${euro(R2_BUDGET)} over ${R2_MONTHS} months. Answer by setting each card, then in the two fields under the cards.`,
        `Route 2 → Task 2 → das Panel oben (das Diagramm und die drei Balken) und die acht Karten darunter. Das Budget beträgt ${euro(R2_BUDGET)} über ${R2_MONTHS} Monate. Antworten Sie, indem Sie jede Karte einstellen, dann in den zwei Feldern unter den Karten.`,
      )}
    >
      <MaterialRefs refs={["B5"]} />
      <p className="text-body text-ink">
        <Gloss>
          {tt(
            "Set each item to when it happens: Now (it starts in month 1), After data is ready (it starts in the month the tracking clean-up is in use) or Not now. The diagram and the three bars above redraw at once, and the tests say what is open. You decide: a different choice with a clear reason can still be exported.",
            "Stellen Sie für jeden Punkt ein, wann er stattfindet: Jetzt (er startet in Monat 1), Wenn die Daten bereit sind (er startet in dem Monat, in dem die Bereinigung der Erfassung im Einsatz ist) oder Jetzt nicht. Diagramm und drei Balken oben zeichnen sich sofort neu, und die Tests sagen, was offen ist. Sie entscheiden: Eine andere Wahl mit klarer Begründung lässt sich trotzdem exportieren.",
          )}
        </Gloss>
      </p>
      <div className="flex flex-wrap items-start gap-2">
        <RevealHint id="build-steps" label={tt("Show how an architecture is built", "Zeigen, wie eine Architektur gebaut wird")} title={tt("Five building steps · taught in Materi B5", "Fünf Bauschritte · aus Materi B5")}>
          <div className="space-y-2 text-caption text-ink">
            <ol className="list-decimal space-y-1 pl-5">
              <li>{tt("The base first: the live view and KPI system, with every interaction in one timeline, starts in month 1.", "Zuerst die Basis: Live-Sicht und KPI-System, mit jeder Interaktion in einer Zeitleiste, starten in Monat 1.")}</li>
              <li>{tt("Then the standards and the people: who answers each central point within how long, and a sales team that can take over a chat.", "Dann die Standards und die Menschen: wer jeden zentralen Punkt innerhalb welcher Zeit beantwortet, und ein Vertriebsteam, das einen Chat übernehmen kann.")}</li>
              <li>{tt("Clean the tracking an engine needs: onboarding, renewal and social media, within consent. An engine starts on data that is at least 80% tracked and clean.", "Die Erfassung bereinigen, die eine Engine braucht: Onboarding, Verlängerung und Social Media, im Rahmen der Einwilligung. Eine Engine startet auf Daten, die zu mindestens 80 % erfasst und sauber sind.")}</li>
              <li>{tt("Add the engines that move a named KPI on data that is ready: the chat first, personalisation when its tracking is clean.", "Die Engines hinzufügen, die einen benannten KPI bewegen, auf Daten, die bereit sind: zuerst den Chat, die Personalisierung, wenn ihre Erfassung sauber ist.")}</li>
              <li>{tt("Hold back the rest: what nobody can explain or measure, and what is in use only after the four months (the platform at 14 weeks, the relaunch at 16).", "Den Rest zurückhalten: was niemand erklären oder messen kann und was erst nach den vier Monaten im Einsatz ist (die Plattform mit 14 Wochen, der Relaunch mit 16).")}</li>
            </ol>
            <MaterialRefs refs={["B5"]} lead={tt("Taught in", "Gelehrt in")} />
          </div>
        </RevealHint>
      </div>

      <div className="space-y-3">
        {BUILD_ORDER.map((id) => {
          const a = ARCH_BY_ID[id];
          const v = plan.items[id];
          const on = v.tier !== "not";
          return (
            <div key={id} id={IDS.arch(id)} className={clsx("space-y-2 rounded-lg border p-3.5", on ? "border-line bg-paper" : "border-dashed border-ash/60 bg-mist/40")}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-ink">
                  {a.name} <span className="font-normal text-ash">· {euro(a.cost)}</span>
                </p>
                <div className="flex flex-wrap gap-1.5" role="group" aria-label={tt(`When does ${a.name} happen?`, `Wann findet ${a.name} statt?`)}>
                  {tiers(id).map((t) => (
                    <button
                      key={t}
                      type="button"
                      aria-pressed={v.tier === t}
                      onClick={() => setTier(id, t)}
                      className={clsx("btn btn-sm min-h-[40px] border", v.tier === t ? "border-accent bg-accentSoft font-semibold text-ink" : "border-line bg-paper text-ash hover:border-ash")}
                    >
                      {TIER_LABEL[t]}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-caption text-ash">{a.what}</p>
              <p className="text-caption text-ink">{ARCH_EXTRA[id].scene}</p>
              <ArchFacts id={id} />
              <p className="text-caption text-ash" aria-live="polite">
                {v.tier === "now"
                  ? tt(`Starts in month 1 and is in use from month ${v.inUse}.`, `Startet in Monat 1 und ist ab Monat ${v.inUse} im Einsatz.`)
                  : v.tier === "later"
                    ? v.never
                      ? tt("Waits for a tracking clean-up that is not set to Now, so it never starts.", "Wartet auf eine Bereinigung der Erfassung, die nicht auf „Jetzt“ steht, und startet daher nie.")
                      : tt(`Starts in month ${v.start}, when the tracking clean-up is in use, and is in use from month ${v.inUse}.`, `Startet in Monat ${v.start}, wenn die Bereinigung der Erfassung im Einsatz ist, und ist ab Monat ${v.inUse} im Einsatz.`)
                    : tt("Not part of the plan.", "Nicht Teil des Plans.")}{" "}
                <button type="button" onClick={() => scrollToAndFlash(`arch-box-${id}`, "ref", "center")} className="underline decoration-dotted underline-offset-2 hover:text-accentHi">
                  {tt("See it in the diagram ↑", "Im Diagramm ansehen ↑")}
                </button>
              </p>
            </div>
          );
        })}
      </div>
      {mentor && <MentorGuide guide={architectureGuide()} />}

      <div className="space-y-3 border-t border-line pt-3">
        <TextBox
          id={IDS.vision}
          label={tt("Your target vision", "Ihr Zielbild")}
          help={tt(
            `Two sentences: what the system should do for LiveConnect and its customers once it runs, and how the company will steer it. At least ${MIN_SENTENCE} characters.`,
            `Zwei Sätze: was das System für LiveConnect und seine Kunden tun soll, wenn es läuft, und wie das Unternehmen es steuert. Mindestens ${MIN_SENTENCE} Zeichen.`,
          )}
          value={r2.vision}
          onChange={(v) => patch({ vision: v })}
          min={MIN_SENTENCE}
          rows={3}
        >
          <WritingHelp
            id="vision-help"
            refs={[
              { label: tt("The problems the brief names", "Die Probleme, die der Auftrag nennt"), value: tt("interaction not coordinated · responses too slow · measures that cannot be measured", "nicht koordinierte Interaktion · zu langsame Reaktionen · nicht messbare Maßnahmen"), target: "task-2" },
              { label: tt("Your plan so far", "Ihr Plan bisher"), value: nowNames.length ? nowNames.join(", ") : tt("nothing set to Now yet", "noch nichts auf „Jetzt“"), target: IDS.panel },
            ]}
            steps={[
              tt("Say what changes for customers or teams once the system runs.", "Sagen Sie, was sich für Kunden oder Teams ändert, wenn das System läuft."),
              tt("Say how the company will steer it: by which few KPIs, and what every new tool has to do before it grows.", "Sagen Sie, wie das Unternehmen es steuert: nach welchen wenigen KPIs, und was jedes neue Werkzeug tun muss, bevor es wächst."),
            ]}
          />
        </TextBox>
        <ExampleAnswer id="vision-example" guide={visionGuide()} />
        {mentor && <MentorGuide guide={visionGuide()} />}

        <TextBox
          id={IDS.giveUp}
          label={tt("What my plan gives me, and what I give up", "Was mein Plan mir gibt, und worauf ich verzichte")}
          help={tt(
            `In your own words, before you open the system's reading below: one thing the plan gives you and one thing it costs or leaves open. At least ${MIN_LINE} characters.`,
            `In eigenen Worten, bevor Sie unten das Lesen des Systems öffnen: eine Sache, die der Plan Ihnen gibt, und eine, die er kostet oder offen lässt. Mindestens ${MIN_LINE} Zeichen.`,
          )}
          value={r2.giveUp}
          onChange={(v) => patch({ giveUp: v })}
          min={MIN_LINE}
          rows={3}
        >
          <WritingHelp
            id="giveup-help"
            refs={[
              { label: tt("Tests that hold", "Tests, die stimmen"), value: plan.applicable ? tt(`${plan.holding} of ${plan.applicable}`, `${plan.holding} von ${plan.applicable}`) : tt("none yet", "noch keine"), target: "r2-tests", before: () => useR2Tests.getState().setOpen(true) },
              { label: tt("Budget", "Budget"), value: tt(`${euro(plan.bars.spent)} of ${euro(R2_BUDGET)}`, `${euro(plan.bars.spent)} von ${euro(R2_BUDGET)}`), target: IDS.panel },
              { label: tt("Items not in the plan", "Punkte, die nicht im Plan sind"), value: notNames.length ? notNames.join(", ") : tt("none", "keine"), target: IDS.arch(BUILD_ORDER[0]) },
            ]}
            steps={[
              tt("Name one thing the plan gives you: something measured, ready or inside the budget.", "Nennen Sie eine Sache, die der Plan Ihnen gibt: etwas Gemessenes, Bereites oder Innerhalb-des-Budgets."),
              tt(`Name one thing it costs or leaves open: an item not now, data below 80%, an item in use only after the four months, or budget left unspent. The data switch above shows how it stands with the data ${WEAK_POINTS} points weaker.`, `Nennen Sie eine Sache, die er kostet oder offen lässt: einen Punkt, der jetzt nicht kommt, Daten unter 80 %, einen Punkt, der erst nach den vier Monaten im Einsatz ist, oder ungenutztes Budget. Der Datenschalter oben zeigt, wie es bei um ${WEAK_POINTS} Punkte schwächeren Daten steht.`),
            ]}
          />
        </TextBox>
        <ExampleAnswer id="giveup-example" guide={giveUpGuide()} />
        {mentor && <MentorGuide guide={giveUpGuide()} />}

        <div className="flex flex-wrap items-start gap-2">
          <RevealHint id="plan-reading" label={tt("Show how the system reads my plan", "Zeigen, wie das System meinen Plan liest")} title={tt("The system's reading of your plan · facts, not a grade", "Das Lesen des Systems zu Ihrem Plan · Fakten, keine Note")}>
            <div className="space-y-2 text-caption text-ink">
              <p className="text-ash">{tt("Compare it with what you wrote. It follows the same rules as the diagram, the bars and the tests, with the data as set above.", "Vergleichen Sie es mit dem, was Sie geschrieben haben. Es folgt denselben Regeln wie Diagramm, Balken und Tests, mit den Daten, wie oben eingestellt.")}</p>
              <p>
                <Gloss>{standing}</Gloss>
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-md border border-line bg-paper p-2.5">
                  <p className="smallcaps text-ash">{tt("What your plan gives you", "Was Ihr Plan Ihnen gibt")}</p>
                  <ul className="mt-1 list-disc space-y-1 pl-4">
                    {reading.gives.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-md border border-dashed border-gold bg-paper p-2.5">
                  <p className="smallcaps text-accent">{tt("What it costs or leaves open", "Was er kostet oder offen lässt")}</p>
                  <ul className="mt-1 list-disc space-y-1 pl-4">
                    {(reading.costs.length ? reading.costs : [tt("Nothing open.", "Nichts offen.")]).map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="rounded-md border border-gold bg-accentSoft p-2.5">
                <p className="smallcaps text-accent">{tt("To make it hold", "Damit es hält")}</p>
                {fix.changes.length === 0 ? (
                  <p className="mt-1">{tt("Nothing to change under the four tests. A different plan can hold too; what is left is to say in your own words what it gives and what you give up.", "Unter den vier Tests ist nichts zu ändern. Auch ein anderer Plan kann halten; es bleibt, in eigenen Worten zu sagen, was er gibt und worauf Sie verzichten.")}</p>
                ) : (
                  <>
                    <ol className="mt-1 list-decimal space-y-1 pl-5">
                      {fix.changes.map((c) => (
                        <li key={`${c.id}-${c.to}`}>{c.text}</li>
                      ))}
                    </ol>
                    <p className="mt-1.5 text-ash">
                      {tt(
                        `With these changes ${fix.after.holding} of ${fix.after.applicable} tests hold, ${euro(fix.after.bars.spent)} of ${euro(R2_BUDGET)} is used, Measurable is ${fix.after.bars.meas ?? 0}% and Risk ${fix.after.bars.risk ?? 0}%. Whether to make them is your decision: a different plan with a clear reason still exports.`,
                        `Mit diesen Änderungen stimmen ${fix.after.holding} von ${fix.after.applicable} Tests, ${euro(fix.after.bars.spent)} von ${euro(R2_BUDGET)} sind genutzt, Messbar liegt bei ${fix.after.bars.meas ?? 0} % und Risiko bei ${fix.after.bars.risk ?? 0} %. Ob Sie sie umsetzen, entscheiden Sie: Ein anderer Plan mit klarer Begründung lässt sich trotzdem exportieren.`,
                      )}
                    </p>
                  </>
                )}
              </div>
            </div>
          </RevealHint>
        </div>
      </div>
      <MentorCategory cat={cat.cat} why={cat.why} label="Step A plan" />
      <AnswerKey block={architectureKey()} />
      <BlockMissing block="3.5" route={2} prefix={tt("Step A", "Schritt A")} />
    </AnswerBlock>
  );
}
