"use client";

import { AnswerBlock } from "@/components/ui/AnswerBlock";
import { AnswerKey } from "@/components/ui/AnswerKey";
import { BlockMissing } from "@/components/ui/BlockMissing";
import { ExampleAnswer } from "@/components/ui/ExampleAnswer";
import { OptionList, TextBox } from "@/components/ui/Inputs";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { MentorGuide } from "@/components/ui/MentorGuide";
import { WritingHelp } from "@/components/ui/WritingHelp";
import { TODAY_ID } from "@/components/task2/Kits";
import { MentorCategory } from "@/components/task2/MentorCategory";
import { RevealHint } from "@/components/ui/RevealHint";
import { DECISIONS, KPIS } from "@/data/route2";
import type { DecisionId, KpiId } from "@/data/route2";
import { KPI_AIM } from "@/data/route2Extra";
import { ENGINE_IDS, PANEL, READY_BAR, TIER_LABEL } from "@/data/route2Panel";
import { decisionKey } from "@/lib/answerKey";
import { scrollToAndFlash } from "@/lib/flash";
import { euro, num, tt } from "@/lib/lang";
import { decisionWhyGuide, watchGuide } from "@/lib/mentorGuide";
import { IDS } from "@/lib/missing";
import { MIN_LINE } from "@/lib/progress";
import { decisionHint, decisionReading, planOf } from "@/lib/r2Panel";
import type { Scn } from "@/lib/r2Panel";
import { BLOCK_MINUTES } from "@/lib/routes";
import { useR2Tests } from "@/store/useR2Tests";
import { useStore } from "@/store/useStore";

const fmt = (n: number) => num(n, { maximumFractionDigits: 1 });
const kpiValue = (n: number, unit: string) => (unit === "%" ? `${fmt(n)}${tt("%", " %")}` : unit === "€" ? euro(n) : `${fmt(n)} ${unit}`);

/** Step B (block 3.6, Core): the decision under time pressure and with incomplete data, why, and what the learner will watch and when they would stop (CLAUDE.md #47). */
export function StepB({ scn }: { scn: Scn }) {
  const r2 = useStore((s) => s.r2);
  const patch = useStore((s) => s.patchR2);
  const mentor = useStore((s) => s.mentorUnlocked);
  const plan = planOf(r2, scn);
  const hint = decisionHint(r2);
  const reading = decisionReading(r2, scn);
  const d = DECISIONS.find((x) => x.id === r2.decision);
  const firstEngine = ENGINE_IDS.filter((id) => plan.items[id].tier !== "not" && plan.items[id].inUse !== null).map((id) => plan.items[id].inUse!);
  const engineMonth = firstEngine.length ? Math.min(...firstEngine) : null;
  const customerKpis = KPIS.filter((k) => k.behaviour);

  return (
    <AnswerBlock
      id="block-3-6"
      title={tt("Step B · Decide", "Schritt B · Entscheiden")}
      kind="OBJECTIVE + JUDGED"
      minutes={BLOCK_MINUTES["3.6"]}
      core
      findIt={tt(
        "Route 2 → Task 2 → your own plan in Step A (quoted below), the numbers today in the situation above, and the decision rules in Materi B5. Answer in the fields below.",
        "Route 2 → Task 2 → Ihr eigener Plan in Schritt A (unten zitiert), die Zahlen heute in der Lage oben und die Entscheidungsregeln in Materi B5. Antworten Sie in den Feldern unten.",
      )}
    >
      <MaterialRefs refs={["B5"]} />
      <div id="plan-quote" className="rounded-lg border border-line bg-mist/50 p-3 text-caption text-ink">
        <p className="smallcaps">{tt("Your plan from Step A · what your decision rests on", "Ihr Plan aus Schritt A · worauf Ihre Entscheidung beruht")}</p>
        {plan.funded.length === 0 ? (
          <p className="mt-1 text-ash">{tt("You have not set any item to Now or After data yet. That is fine: nothing here is blocked, and this box fills in when you do.", "Sie haben noch keinen Punkt auf „Jetzt“ oder „Wenn die Daten bereit sind“ gesetzt. Das ist in Ordnung: Hier ist nichts gesperrt, und dieses Feld füllt sich, sobald Sie es tun.")}</p>
        ) : (
          <>
            <ul className="mt-1 list-disc space-y-0.5 pl-4">
              {plan.funded.map((id) => (
                <li key={id}>
                  <button type="button" onClick={() => scrollToAndFlash(IDS.arch(id), "ref")} className="text-left underline decoration-dotted underline-offset-2 hover:text-accentHi">
                    {PANEL[id].short}
                  </button>{" "}
                  · {TIER_LABEL[plan.items[id].tier]} · {tt(`in use from month ${plan.items[id].inUse}`, `im Einsatz ab Monat ${plan.items[id].inUse}`)}
                </li>
              ))}
            </ul>
            <p className="mt-1 text-ash">
              {plan.applicable > 0 ? tt(`${plan.holding} of ${plan.applicable} tests hold.`, `${plan.holding} von ${plan.applicable} Tests stimmen.`) : ""}{" "}
              <button type="button" onClick={() => scrollToAndFlash(IDS.panel, "ref")} className="underline decoration-dotted underline-offset-2 hover:text-accentHi">
                {tt("See the panel", "Zum Panel")}
              </button>
            </p>
          </>
        )}
      </div>

      <div id={IDS.decision} className="space-y-2 rounded-lg p-1">
        <p className="font-semibold text-ink">{tt("Your decision under time pressure", "Ihre Entscheidung unter Zeitdruck")}</p>
        <p className="text-caption text-ash">{tt("The brief asks you to decide under time pressure and with an incomplete data situation. Choose one. All three can be chosen; what counts is your reason.", "Der Auftrag verlangt, dass Sie unter Zeitdruck und bei unvollständiger Datenlage entscheiden. Wählen Sie eine. Alle drei lassen sich wählen; was zählt, ist Ihre Begründung.")}</p>
        <OptionList<DecisionId> label={tt("Decision", "Entscheidung")} value={r2.decision} onChange={(v) => patch({ decision: v })} options={DECISIONS.map((x) => ({ id: x.id, label: x.label, sub: x.detail }))} />
        {hint && (
          <p role="status" className="fade-in rounded-md border border-gold bg-accentSoft p-2.5 text-caption text-ink">
            <span className="smallcaps mr-1 text-accent">{tt("Note", "Hinweis")}</span>
            {hint}
          </p>
        )}
        <div className="flex flex-wrap items-start gap-2">
          <RevealHint id="decision-reading" label={tt("Show how the system reads my decision", "Zeigen, wie das System meine Entscheidung liest")} title={tt("The system's reading of your decision · information, not a grade", "Das Lesen des Systems zu Ihrer Entscheidung · Information, keine Note")}>
            {reading ? (
              <div className="space-y-2 text-caption text-ink">
                <p>{reading.text}</p>
                <div className="rounded-md border border-gold bg-accentSoft p-2.5">
                  <p className="smallcaps text-accent">{tt("To make it hold", "Damit es hält")}</p>
                  <p className="mt-1">{reading.change}</p>
                </div>
              </div>
            ) : (
              <p className="text-caption text-ash">{tt("Choose a decision first; this then says how it reads against your plan in Step A.", "Wählen Sie zuerst eine Entscheidung; dies sagt dann, wie sie sich gegen Ihren Plan in Schritt A liest.")}</p>
            )}
          </RevealHint>
        </div>
        {reading && <MentorCategory cat={reading.cat} why={reading.why} label="Step B decision" />}
      </div>

      <TextBox
        id={IDS.decisionWhy}
        label={tt("Why you decide this way", "Warum Sie so entscheiden")}
        help={tt(
          `One or two sentences: the rule of Materi B5 your decision rests on, and how it fits your plan in Step A (or why it does not). At least ${MIN_LINE} characters.`,
          `Ein oder zwei Sätze: die Regel aus Materi B5, auf der Ihre Entscheidung beruht, und wie sie zu Ihrem Plan in Schritt A passt (oder warum nicht). Mindestens ${MIN_LINE} Zeichen.`,
        )}
        value={r2.decisionWhy}
        onChange={(v) => patch({ decisionWhy: v })}
        min={MIN_LINE}
        rows={3}
      >
        <WritingHelp
          id="decisionwhy-help"
          refs={[
            { label: tt("Your decision", "Ihre Entscheidung"), value: d ? d.label : tt("not chosen yet", "noch nicht gewählt"), target: IDS.decision },
            { label: tt("Tests that hold in your plan", "Tests, die in Ihrem Plan stimmen"), value: plan.applicable ? tt(`${plan.holding} of ${plan.applicable}`, `${plan.holding} von ${plan.applicable}`) : tt("none yet", "noch keine"), target: "r2-tests", before: () => useR2Tests.getState().setOpen(true) },
          ]}
          steps={[
            tt("Name the rule of Materi B5 the decision rests on: waiting for complete data is also a decision, launching everything at once spends the budget before any KPI shows what works, staging decides now and measures before it scales.", "Nennen Sie die Regel aus Materi B5, auf der die Entscheidung beruht: Auf vollständige Daten zu warten ist auch eine Entscheidung, alles auf einmal zu starten gibt das Budget aus, bevor ein KPI zeigt, was wirkt, stufenweise entscheidet jetzt und misst, bevor es skaliert."),
            tt("Say how it fits your Step A, or why it does not.", "Sagen Sie, wie sie zu Ihrem Schritt A passt oder warum nicht."),
          ]}
        />
      </TextBox>
      <ExampleAnswer id="decisionwhy-example" guide={decisionWhyGuide()} />
      {mentor && <MentorGuide guide={decisionWhyGuide()} />}

      <TextBox
        id={IDS.watch}
        label={tt("What you will watch, and when you would stop", "Was Sie beobachten, und wann Sie aufhören würden")}
        help={tt(
          `One figure about customers (not your own output), the month it can first be read, and what you do if it falls short. At least ${MIN_LINE} characters.`,
          `Eine Zahl über Kunden (nicht Ihren eigenen Output), der Monat, in dem sie sich zuerst lesen lässt, und was Sie tun, wenn sie zu kurz greift. Mindestens ${MIN_LINE} Zeichen.`,
        )}
        value={r2.watch}
        onChange={(v) => patch({ watch: v })}
        min={MIN_LINE}
        rows={3}
      >
        <WritingHelp
          id="watch-help"
          refs={[
            ...customerKpis.map((k) => ({
              label: tt(`${k.label}, today and aim`, `${k.label}, heute und Ziel`),
              value: `${kpiValue(k.baseline, k.unit)} → ${KPI_AIM[k.id as KpiId] !== undefined ? kpiValue(KPI_AIM[k.id as KpiId]!, k.unit) : "—"}`,
              target: TODAY_ID.kpi(k.id),
            })),
            { label: tt("First month an engine of yours is in use", "Erster Monat, in dem eine Ihrer Engines im Einsatz ist"), value: engineMonth !== null ? tt(`month ${engineMonth}`, `Monat ${engineMonth}`) : tt("no engine in your plan yet", "noch keine Engine in Ihrem Plan"), target: IDS.panel },
            { label: tt("The bar for data an engine starts on", "Die Grenze für Daten, auf denen eine Engine startet"), value: `${READY_BAR}${tt("%", " %")}`, target: TODAY_ID.item("chat") },
          ]}
          steps={[
            tt("Pick one figure about customers: the closing rate of quote requests or the interaction rate on decision pages, not response time or posts.", "Wählen Sie eine Zahl über Kunden: die Abschlussquote der Angebotsanfragen oder die Interaktionsrate auf Entscheidungsseiten, nicht Antwortzeit oder Posts."),
            tt("Say the month it can first be read: the month the item that moves it is in use, plus about a month.", "Sagen Sie den Monat, in dem sie sich zuerst lesen lässt: der Monat, in dem der Punkt im Einsatz ist, der sie bewegt, plus etwa ein Monat."),
            tt("Say what you do if it falls short: stop, pause or change one thing.", "Sagen Sie, was Sie tun, wenn sie zu kurz greift: stoppen, pausieren oder eine Sache ändern."),
          ]}
        />
      </TextBox>
      <ExampleAnswer id="watch-example" guide={watchGuide()} />
      {mentor && <MentorGuide guide={watchGuide()} />}

      <AnswerKey block={decisionKey()} />
      <BlockMissing block="3.6" route={2} prefix={tt("Step B", "Schritt B")} />
    </AnswerBlock>
  );
}
