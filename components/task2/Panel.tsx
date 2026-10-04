"use client";

import clsx from "clsx";
import { Insight } from "@/components/materi/kit";
import { ARCH_BY_ID, R2_BUDGET, R2_MONTHS } from "@/data/route2";
import type { ArchId } from "@/data/route2";
import { PANEL, READY_BAR, WEAK_POINTS, CLEAN_ID, TIER_LABEL } from "@/data/route2Panel";
import type { Tier } from "@/data/route2Panel";
import { euro, tt } from "@/lib/lang";
import { scrollToAndFlash } from "@/lib/flash";
import { IDS } from "@/lib/missing";
import { planOf, rangeOf } from "@/lib/r2Panel";
import type { ItemView, Scn } from "@/lib/r2Panel";
import { useR2Tests } from "@/store/useR2Tests";
import { useStore } from "@/store/useStore";

/**
 * The control panel of Route 2 (CLAUDE.md #47): an architecture diagram with links that can break, three range bars (Budget, Measurable, Risk) and
 * the four tests, all drawn from the learner's own choices in Step A and redrawn at once. It shows consequences, never a verdict: every state has a
 * text or pattern channel besides colour, and a position outside a limit is a fact, not a missing item.
 */

/**
 * One box of the diagram: solid teal = Now, dashed amber = the "after" tier, faded = Not now; a black box is drawn dark and marked “?”.
 * The small switch inside the box sets the same tier as the buttons on the item's card in Step A (one state, two places to change it).
 */
function Box({ id, v }: { id: ArchId; v: ItemView }) {
  const p = PANEL[id];
  const a = ARCH_BY_ID[id];
  const patch = useStore((s) => s.patchR2);
  const setTier = (t: Tier) => patch((s) => ({ tier: { ...s.tier, [id]: t } }));
  const opts: Tier[] = id === CLEAN_ID ? ["now", "not"] : ["now", "later", "not"];
  const short: Record<Tier, string> = { now: tt("Now", "Jetzt"), later: tt("Later", "Später"), not: tt("Not now", "Jetzt nicht") };
  const cls =
    v.tier === "now" ? (p.blackBox ? "border-ink bg-mist" : "border-signal bg-signalSoft") : v.tier === "later" ? "border-2 border-dashed border-gold bg-paper" : "border-line bg-paper";
  const status =
    v.tier === "now"
      ? tt(`Now · in use month ${v.inUse}`, `Jetzt · im Einsatz ab Monat ${v.inUse}`)
      : v.tier === "later"
        ? v.never
          ? tt("After data is ready · never starts", "Wenn die Daten bereit sind · startet nie")
          : tt(`After data is ready · starts month ${v.start}, in use month ${v.inUse}`, `Wenn die Daten bereit sind · Start Monat ${v.start}, im Einsatz ab Monat ${v.inUse}`)
        : tt("Not now", "Jetzt nicht");
  return (
    <div id={`arch-box-${id}`} role="group" aria-label={tt(`${p.short}: ${TIER_LABEL[v.tier]}`, `${p.short}: ${TIER_LABEL[v.tier]}`)} className={clsx("min-h-[3.5rem] w-full rounded-lg border p-2 text-left text-caption leading-snug", cls)}>
      <div className={clsx(v.tier === "not" && "opacity-60")}>
        <span className="block font-semibold text-ink">
          {p.blackBox && v.tier !== "not" ? "? " : ""}
          {p.short} <span className="font-normal text-ash">· {euro(a.cost)}</span>
        </span>
        <span className="block text-ash">{status}</span>
        {v.notes.map((n) => (
          <span key={n} className="block text-accent">
            {n}
          </span>
        ))}
      </div>
      <div className="mt-1.5 flex flex-wrap gap-1" role="group" aria-label={tt(`When does ${p.short} happen?`, `Wann findet ${p.short} statt?`)}>
        {opts.map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={v.tier === t}
            title={TIER_LABEL[t]}
            onClick={() => setTier(t)}
            className={clsx(
              "min-h-[32px] rounded border px-2 text-micro normal-case tracking-normal focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent",
              v.tier === t ? "border-accent bg-accentSoft font-semibold text-ink" : "border-line bg-paper text-ash hover:border-ash",
            )}
          >
            {short[t]}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => scrollToAndFlash(IDS.arch(id), "ref", "start")}
        aria-label={tt(`${p.short}: go to its card in Step A`, `${p.short}: zur Karte in Schritt A`)}
        className="mt-1 block text-micro normal-case tracking-normal text-ash underline decoration-dotted underline-offset-2 hover:text-accentHi"
      >
        {tt("Details on its card ↓", "Details auf der Karte ↓")}
      </button>
    </div>
  );
}

/** A link between two layers: solid teal when it works, dashed amber with its reason in words when it does not; invisible when there is nothing to link. */
function Lk({ state, text }: { state: "ok" | "no" | "off"; text: string }) {
  return (
    <div className={clsx("flex h-7 items-center justify-center gap-2 text-micro normal-case tracking-normal", state === "no" ? "text-accent" : "text-ash", state === "off" && "invisible")}>
      <span aria-hidden className={clsx("block h-full w-0 border-l-[3px]", state === "no" ? "border-dashed border-gold" : "border-solid border-signal")} />
      <span>{text}</span>
    </div>
  );
}

/** A range bar: the pale band spans the two data scenarios, the marker is the active one. */
function RangeBar({ label, lo, hi, cur, tone, sentence }: { label: string; lo: number | null; hi: number | null; cur: number | null; tone: "signal" | "gold"; sentence: string }) {
  const l = lo === null || hi === null ? 0 : Math.min(lo, hi);
  const h = lo === null || hi === null ? 0 : Math.max(lo, hi);
  return (
    <div className="space-y-1">
      <p className="text-caption font-semibold text-ink">{label}</p>
      <div className="relative h-3 rounded border border-line bg-mist" role="img" aria-label={`${label}: ${sentence}`}>
        {cur !== null && (
          <>
            <div className={clsx("absolute inset-y-0 rounded", tone === "signal" ? "bg-signal/35" : "bg-gold/50")} style={{ left: `${l}%`, width: `${Math.max(1, h - l)}%` }} />
            <div className={clsx("absolute -inset-y-[3px] w-[3px] rounded", tone === "signal" ? "bg-signal" : "bg-accent")} style={{ left: `calc(${cur}% - 1.5px)` }} />
          </>
        )}
      </div>
      <p className="text-micro normal-case tracking-normal text-ash" aria-live="polite">
        {sentence}
      </p>
    </div>
  );
}

export function Panel({ scn, setScn }: { scn: Scn; setScn: (s: Scn) => void }) {
  const r2 = useStore((s) => s.r2);
  const open = useR2Tests((s) => s.open);
  const setOpen = useR2Tests((s) => s.setOpen);
  const plan = planOf(r2, scn);
  const rng = rangeOf(r2);
  const it = plan.items;
  const b = plan.bars;
  const none = plan.funded.length === 0;
  const range = (x: [number | null, number | null]) => (x[0] === null || x[1] === null ? "" : tt(` Range ${Math.min(x[0], x[1])}–${Math.max(x[0], x[1])}%.`, ` Spanne ${Math.min(x[0], x[1])}–${Math.max(x[0], x[1])} %.`));
  const pct = (n: number | null) => (n === null ? "" : `${n}${tt("%", " %")}`);
  const spent = Math.min(100, (b.spent / 360000) * 100);

  const engineLink = (id: ArchId): { state: "ok" | "no" | "off"; text: string } => {
    const v = it[id];
    if (v.tier === "not") return { state: "off", text: "." };
    if (v.never) return { state: "no", text: tt(`${PANEL[id].short}: never starts`, `${PANEL[id].short}: startet nie`) };
    return v.measOk ? { state: "ok", text: tt(`${PANEL[id].short}: measured`, `${PANEL[id].short}: gemessen`) } : { state: "no", text: tt(`${PANEL[id].short}: not measured`, `${PANEL[id].short}: nicht gemessen`) };
  };
  const peopleOn = it.routing.tier !== "not" || it.training.tier !== "not";
  const people: { state: "ok" | "no" | "off"; text: string } =
    !peopleOn ? { state: "off", text: "." } : it.foundation.tier !== "not" && (["routing", "training"] as ArchId[]).every((id) => it[id].tier === "not" || it[id].measOk) ? { state: "ok", text: tt("read off the live view", "am Live-Sicht abgelesen") } : { state: "no", text: tt("no live view to read", "keine Live-Sicht zum Ablesen") };
  const clean: { state: "ok" | "no" | "off"; text: string } =
    it.tracking.tier === "now" ? { state: "ok", text: tt("cleaner tracking", "sauberere Erfassung") } : it.personal.tier !== "not" ? { state: "no", text: tt("tracking used as it is", "Erfassung, wie sie ist") } : { state: "off", text: "." };
  const suiteLink: { state: "ok" | "no" | "off"; text: string } = it.suite.tier === "not" ? { state: "off", text: "." } : { state: "no", text: tt("no link to the KPI system", "keine Verbindung zum KPI-System") };
  const siteLink: { state: "ok" | "no" | "off"; text: string } = it.relaunch.tier === "not" ? { state: "off", text: "." } : { state: "no", text: tt("no KPI named", "kein KPI genannt") };

  const applicable = plan.tests.filter((x) => x.applies);
  const insight = none
    ? tt("Nothing is funded yet. Set an item to Now in Step A and the diagram, the three bars and the tests draw it.", "Noch nichts ist finanziert. Setzen Sie in Schritt A einen Punkt auf „Jetzt“, und Diagramm, drei Balken und Tests zeichnen es.")
    : tt(
        `${plan.holding} of ${plan.applicable} tests hold${scn === 1 ? ` with the data ${WEAK_POINTS} points weaker` : ""}. ${plan.holding === plan.applicable ? "Nothing is open under the course's four tests; a plan that holds them can still be argued against, so say in your reasons what it gives and what you give up." : "Open “Show the four tests” to see what each open test means and two ways to act. You decide; a different choice with a clear reason still exports."} The bars show where the money sits; the pale part of Measurable and Risk is the range across both data scenarios.`,
        `${plan.holding} von ${plan.applicable} Tests stimmen${scn === 1 ? ` bei um ${WEAK_POINTS} Punkte schwächeren Daten` : ""}. ${plan.holding === plan.applicable ? "Unter den vier Tests des Kurses ist nichts offen; ein Plan, der sie hält, lässt sich trotzdem hinterfragen, sagen Sie also in Ihren Begründungen, was er gibt und worauf Sie verzichten." : "Öffnen Sie „Die vier Tests zeigen“, um zu sehen, was jeder offene Test bedeutet und welche zwei Wege es gibt. Sie entscheiden; eine andere Wahl mit klarer Begründung lässt sich trotzdem exportieren."} Die Balken zeigen, wo das Geld liegt; der helle Teil bei Messbar und Risiko ist die Spanne über beide Datenszenarien.`,
      );

  return (
    <section id={IDS.panel} aria-label={tt("Your architecture, live", "Ihre Architektur, live")} className="card space-y-4 p-4 md:p-5">
      <div className="flex flex-wrap items-center gap-3">
        <p className="smallcaps text-accent">{tt(`Your architecture · live · budget ${euro(R2_BUDGET)} · ${R2_MONTHS} months`, `Ihre Architektur · live · Budget ${euro(R2_BUDGET)} · ${R2_MONTHS} Monate`)}</p>
        <div className="ml-auto flex flex-wrap items-center gap-2" role="group" aria-label={tt("Data quality", "Datenqualität")}>
          <span className="text-caption text-ash">{tt("Data quality", "Datenqualität")}:</span>
          {([0, 1] as Scn[]).map((s) => (
            <button key={s} type="button" aria-pressed={scn === s} onClick={() => setScn(s)} className={clsx("btn btn-sm min-h-[40px] border", scn === s ? "border-accent bg-accentSoft font-semibold text-ink" : "border-line bg-paper text-ash hover:border-ash")}>
              {s === 0 ? tt("As the brief says", "Wie im Auftrag") : tt(`${WEAK_POINTS} points weaker`, `${WEAK_POINTS} Punkte schwächer`)}
            </button>
          ))}
        </div>
      </div>

      <div role="group" aria-label={tt("The architecture diagram", "Das Architekturdiagramm")}>
        <div className="rounded-lg border border-dashed border-line bg-canvas px-3 py-1.5 text-center text-caption text-ash">{tt("What customers meet: pricing page · quote form · live chat · social media", "Was Kunden erleben: Preisseite · Angebotsformular · Live-Chat · Social Media")}</div>
        <div className="grid gap-x-2 sm:grid-cols-2">
          <Lk {...suiteLink} />
          <Lk {...siteLink} />
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <Box id="suite" v={it.suite} />
          <Box id="relaunch" v={it.relaunch} />
        </div>
        <Lk state="off" text="." />
        <div className="grid gap-2 sm:grid-cols-2">
          <Box id="chat" v={it.chat} />
          <Box id="personal" v={it.personal} />
        </div>
        <div className="grid gap-x-2 sm:grid-cols-2">
          {(["chat", "personal"] as ArchId[]).map((id) => (
            <Lk key={id} {...engineLink(id)} />
          ))}
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <Box id="routing" v={it.routing} />
          <Box id="training" v={it.training} />
        </div>
        <Lk {...people} />
        <Box id="foundation" v={it.foundation} />
        <Lk {...clean} />
        <Box id="tracking" v={it.tracking} />
        <Lk state="ok" text={tt("raw interactions flow up", "Rohe Interaktionen fließen nach oben")} />
        <div className="rounded-lg border border-dashed border-line bg-canvas px-3 py-1.5 text-center text-caption text-ash">{tt("Where the data lives today: website · chat · CRM · social media", "Wo die Daten heute liegen: Website · Chat · CRM · Social Media")}</div>
        <p className="mt-2 text-micro normal-case tracking-normal text-ash">
          {tt("Solid teal box: Now. Dashed amber box: After data is ready (it starts in the month the tracking clean-up is in use). Faded box: Not now. Change the timing with the small switch in each box (“Later” is the after-tier) or on the item's card. A solid teal link works; a dashed amber link says in words why it does not.", "Durchgezogener teal Kasten: Jetzt. Gestrichelter amberfarbener Kasten: Wenn die Daten bereit sind (er startet in dem Monat, in dem die Bereinigung der Erfassung im Einsatz ist). Blasser Kasten: Jetzt nicht. Ändern Sie den Zeitpunkt mit dem kleinen Schalter in jedem Kasten („Später“ ist die Wenn-Stufe) oder auf der Karte des Punkts. Eine durchgezogene teal Verbindung funktioniert; eine gestrichelte amberfarbene sagt in Worten, warum nicht.")}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-1">
          <p className="text-caption font-semibold text-ink">{tt("Budget", "Budget")}</p>
          <div className="relative h-3 rounded border border-line bg-mist" role="img" aria-label={tt(`Budget: ${euro(b.spent)} of ${euro(R2_BUDGET)}`, `Budget: ${euro(b.spent)} von ${euro(R2_BUDGET)}`)}>
            <div className="absolute inset-y-0 left-0 rounded bg-signal/50" style={{ width: `${spent}%` }} />
            <div className="absolute -inset-y-1 border-l-[1.5px] border-dashed border-ash" style={{ left: `${(R2_BUDGET / 360000) * 100}%` }} />
          </div>
          <p className="text-micro normal-case tracking-normal text-ash" aria-live="polite">
            {b.over > 0 ? tt(`${euro(b.over)} over the budget (dashed line). Keep it only with a reason.`, `${euro(b.over)} über dem Budget (gestrichelte Linie). Behalten Sie es nur mit einer Begründung.`) : tt(`${euro(b.spent)} of ${euro(R2_BUDGET)}. ${euro(b.left)} left.`, `${euro(b.spent)} von ${euro(R2_BUDGET)}. ${euro(b.left)} übrig.`)}
          </p>
        </div>
        <RangeBar
          label={tt("Measurable", "Messbar")}
          lo={rng.meas[0]}
          hi={rng.meas[1]}
          cur={b.meas}
          tone="signal"
          sentence={none ? tt("Nothing is funded, so nothing is measured and the brief's three problems stay.", "Nichts ist finanziert, also wird nichts gemessen, und die drei Probleme des Auftrags bleiben.") : tt(`${pct(b.meas)} of the money sits on items that are measured, whose data is ready and that are in use within the ${R2_MONTHS} months.${range(rng.meas)}`, `${pct(b.meas)} des Geldes liegen auf Punkten, die gemessen werden, deren Daten bereit sind und die innerhalb der ${R2_MONTHS} Monate im Einsatz sind.${range(rng.meas)}`)}
        />
        <RangeBar
          label={tt("Risk", "Risiko")}
          lo={rng.risk[0]}
          hi={rng.risk[1]}
          cur={b.risk}
          tone="gold"
          sentence={none ? tt("Nothing is funded yet.", "Noch nichts ist finanziert.") : tt(`${pct(b.risk)} of the money rests on a black box, on data below ${READY_BAR}% when the item starts, or on an item in use only after the ${R2_MONTHS} months.${range(rng.risk)}`, `${pct(b.risk)} des Geldes beruhen auf einer Black Box, auf Daten unter ${READY_BAR} %, wenn der Punkt startet, oder auf einem Punkt, der erst nach den ${R2_MONTHS} Monaten im Einsatz ist.${range(rng.risk)}`)}
        />
      </div>

      <div id="r2-tests" className="space-y-2">
        <button type="button" aria-expanded={open} aria-controls="r2-tests-body" onClick={() => setOpen(!open)} className="btn-ghost btn-sm">
          {open ? tt("Hide the four tests", "Die vier Tests ausblenden") : tt("Show the four tests", "Die vier Tests zeigen")}
          {applicable.length > 0 ? ` · ${tt(`${plan.holding} of ${plan.applicable} hold`, `${plan.holding} von ${plan.applicable} stimmen`)}` : ""}
        </button>
        {open && (
          <div id="r2-tests-body" className="fade-in space-y-2">
            <p className="smallcaps text-ash">{tt("Four tests the course teaches", "Vier Tests, die der Kurs lehrt")}</p>
            {applicable.length === 0 ? (
              <p className="text-caption text-ash">{tt("No tests yet. Set at least one item to Now in Step A.", "Noch keine Tests. Setzen Sie in Schritt A mindestens einen Punkt auf „Jetzt“.")}</p>
            ) : (
              <ul className="space-y-2">
                {applicable.map((x) => (
                  <li key={x.id} className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-caption font-semibold text-ink">{x.name}</span>
                      <span className={clsx("pill", x.holds ? "border-signal/50 bg-signalSoft text-signal" : "border-gold bg-accentSoft text-accent")}>{x.holds ? tt("Holds", "Stimmt") : tt("Open", "Offen")}</span>
                    </div>
                    {!x.holds &&
                      x.open.map((o, i) => (
                        <div key={i} className="space-y-2 rounded-md border border-gold bg-accentSoft p-3 text-caption text-ink">
                          <div>
                            <p className="smallcaps text-accent">{tt("What is off", "Was nicht passt")}</p>
                            <p className="font-semibold">{o.fact}</p>
                          </div>
                          <p>
                            <span className="smallcaps mr-1 text-ash">{tt("In plain words", "In einfachen Worten")}</span>
                            {o.plain}
                          </p>
                          {o.where.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="smallcaps text-ash">{tt("Where in the diagram", "Wo im Diagramm")}</span>
                              {o.where.map((id) => (
                                <button key={id} type="button" onClick={() => scrollToAndFlash(`arch-box-${id}`, "ref", "center")} className="min-h-[32px] rounded border border-line bg-paper px-2 text-caption text-ink underline decoration-dotted underline-offset-2 hover:border-accent">
                                  {PANEL[id].short} ↑
                                </button>
                              ))}
                            </div>
                          )}
                          <p className="text-ash">
                            <span className="smallcaps mr-1">{tt("Why it matters", "Warum es zählt")}</span>
                            {o.rule}
                          </p>
                          <div>
                            <p className="smallcaps text-accent">{tt("What you can do (you decide)", "Was Sie tun können (Sie entscheiden)")}</p>
                            <ol className="mt-1 list-decimal space-y-1.5 pl-5">
                              {o.ways.map((w) => (
                                <li key={w.text}>
                                  <span>{w.text}</span>
                                  {w.go.length > 0 && (
                                    <span className="mt-1 flex flex-wrap gap-1.5">
                                      {w.go.map((id) => (
                                        <button
                                          key={id}
                                          type="button"
                                          onClick={() => scrollToAndFlash(IDS.arch(id), "ref", "start")}
                                          aria-label={tt(`Go to the card ${ARCH_BY_ID[id].name} in Step A`, `Zur Karte ${ARCH_BY_ID[id].name} in Schritt A`)}
                                          className="min-h-[36px] rounded-md border border-accent bg-paper px-2.5 text-caption font-semibold text-accentHi hover:bg-accentSoft focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                                        >
                                          {tt("Go to card", "Zur Karte")}: {ARCH_BY_ID[id].name} · {euro(ARCH_BY_ID[id].cost)} ↓
                                        </button>
                                      ))}
                                    </span>
                                  )}
                                </li>
                              ))}
                            </ol>
                          </div>
                        </div>
                      ))}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <Insight>
        {tt("In plain words: ", "In einfachen Worten: ")}
        {insight}
      </Insight>
    </section>
  );
}
