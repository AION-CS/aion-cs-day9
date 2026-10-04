"use client";

import clsx from "clsx";
import { useId, useState } from "react";
import { Insight, Story, ThePoint, Toggles, useStory } from "@/components/materi/kit";
import { CASES_MIN, LIFT_ACT, LIFT_WATCH } from "@/data/route2";
import { bi, num, t, tt } from "@/lib/lang";
import { Gloss } from "@/lib/glossify";

/**
 * The interactive diagrams of Materi B (Route 2). Every one uses the worked-example company Elster Digital (a Leipzig IT service provider,
 * Case assumption), never LiveConnect. Every control is followed by an always-visible "What this shows" (CLAUDE.md #20), every picture opens with "The point" and carries a three-step "Walk me through it" story that
 * drives the real controls (CLAUDE.md #36); a manual button leaves the story.
 */
/** "In plain words:" leads every reading of a control (CLAUDE.md #36). */
const plain = () => tt("In plain words: ", "In einfachen Worten: ");
const C = { ink: "#1F2328", ash: "#59606A", paper: "#FFFEFA", mist: "#ECE6D6", line: "#D8D1BF", amber: "#8A5A0B", gold: "#D99A2B", teal: "#0F6B6B", tealSoft: "#DFEEEB", data: "#2F5D62", grey: "#8B9098", soft: "#FBF0D6", rust: "#A4472A" };

/* ------------------------------------------------------------------ B1 · four stages towards an AI-based control system */

type Stage = "report" | "dash" | "rules" | "forecast";
const STAGES: Stage[] = ["report", "dash", "rules", "forecast"];
const STAGE_TEXT = bi({
  report: { name: t("Scattered channels", "Verstreute Kanäle"), spree: t("Chat, phone, e-mail and social media are answered by different teams, each in its own tool and at its own pace.", "Chat, Telefon, E-Mail und Social Media werden von verschiedenen Teams beantwortet, jedes im eigenen Werkzeug und im eigenen Tempo."), reading: t("A customer who asks twice gets two different answers at two different speeds; nobody sees the whole interaction.", "Ein Kunde, der zweimal fragt, bekommt zwei verschiedene Antworten in zwei verschiedenen Tempi; niemand sieht die ganze Interaktion.") },
  dash: { name: t("One live view", "Eine Live-Sicht"), spree: t("Every interaction of a customer in one timeline, with response time, interaction and closings on one live screen.", "Jede Interaktion eines Kunden in einer Zeitleiste, mit Antwortzeit, Interaktion und Abschlüssen auf einem Live-Bildschirm."), reading: t("Everyone sees the same customer and the same numbers; how fast each point is answered is still left to chance.", "Alle sehen denselben Kunden und dieselben Zahlen; wie schnell jeder Punkt beantwortet wird, bleibt noch dem Zufall überlassen.") },
  rules: { name: t("Response standards", "Antwortstandards"), spree: t("“Order page: answer within 2 minutes, a person takes over complex questions; contact form: callback within 15 minutes.”", "„Bestellseite: Antwort innerhalb von 2 Minuten, ein Mensch übernimmt komplexe Fragen; Kontaktformular: Rückruf innerhalb von 15 Minuten.“"), reading: t("Speed no longer depends on who is on duty. This is where real time becomes a system, not a lucky day.", "Tempo hängt nicht mehr davon ab, wer Dienst hat. Hier wird Echtzeit zum System, nicht zu einem glücklichen Tag.") },
  forecast: { name: t("Weekly feedback loop", "Wöchentliche Feedbackschleife"), spree: t("Every Friday: which test to roll out, keep testing or stop, and which chat answers to rewrite from the ratings.", "Jeden Freitag: welcher Test ausgerollt, weiter getestet oder gestoppt wird, und welche Chat-Antworten nach den Bewertungen neu geschrieben werden."), reading: t("The system improves itself week by week: speed and quality are measured together, and the next version is better.", "Das System verbessert sich Woche für Woche: Tempo und Qualität werden zusammen gemessen, und die nächste Version ist besser.") },
});

export function DataStages() {
  const uid = useId().replace(/:/g, "");
  const [st, setStRaw] = useState<Stage>("dash");
  const story = useStory([
    {
      title: tt("A loop that learns", "Eine Schleife, die lernt"),
      say: tt(`Elster Digital is an example company, not your case. Every Friday it decides which test to roll out, keep testing or stop, and which chat answers to rewrite from the ratings.`, `Elster Digital ist ein Beispielunternehmen, nicht Ihr Fall. Jeden Freitag entscheidet es, welcher Test ausgerollt, weiter getestet oder gestoppt wird und welche Chat-Antworten nach den Bewertungen neu geschrieben werden.`),
      look: tt("the last, tallest bar", "der letzte, höchste Balken"),
      apply: () => {
        setStRaw("forecast");
      },
    },
    {
      title: tt("Scattered channels", "Verstreute Kanäle"),
      say: tt(`Before that, chat, phone, e-mail and social media were answered by different teams, each in its own tool and at its own pace. Nobody saw the whole customer.`, `Davor wurden Chat, Telefon, E-Mail und Social Media von verschiedenen Teams beantwortet, jedes im eigenen Werkzeug und im eigenen Tempo. Niemand sah den ganzen Kunden.`),
      look: tt("the first, shortest bar", "der erste, niedrigste Balken"),
      apply: () => {
        setStRaw("report");
      },
    },
    {
      title: tt("The point", "Das Wichtigste"),
      say: tt(`The jump from scattered channels to a system is one live view: every interaction of a customer in one timeline. Try the four stages.`, `Der Sprung von verstreuten Kanälen zu einem System ist eine Live-Sicht: jede Interaktion eines Kunden in einer Zeitleiste. Probieren Sie die vier Stufen.`),
      look: tt("the second bar", "der zweite Balken"),
      apply: () => {
        setStRaw("dash");
      },
    },
  ]);
  const setSt = (v: Stage) => {
    story.leave();
    setStRaw(v);
  };
  const idx = STAGES.indexOf(st);
  const s = STAGE_TEXT[st];
  return (
    <div className="space-y-3">
      <ThePoint>{tt("A real-time retention system is not a set of busy channels. It is one live view everyone reads, answers that arrive within an agreed time, and a weekly loop that keeps learning.", "Ein Echtzeit-Bindungssystem ist keine Ansammlung beschäftigter Kanäle. Es ist eine Live-Sicht, die alle lesen, Antworten innerhalb einer vereinbarten Zeit und eine wöchentliche Schleife, die weiter lernt.")}</ThePoint>
      <Story steps={story.plan} step={story.step} onStep={story.go} />
      <svg viewBox="0 0 560 170" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{tt("Four stages towards a real-time management system", "Vier Stufen zu einem Echtzeit-Managementsystem")}</title>
        <desc id={`${uid}-d`}>{tt(`Stage shown: ${s.name}.`, `Gezeigte Stufe: ${s.name}.`)}</desc>
        {STAGES.map((k, i) => {
          const x = 10 + i * 137;
          const h = 40 + i * 25;
          const on = i <= idx;
          return (
            <g key={k} className="hit" role="button" tabIndex={0} aria-label={STAGE_TEXT[k].name} onClick={() => setSt(k)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSt(k)}>
              {k === st && story.step !== null && <rect x={x - 4} y={150 - h - 4} width="136" height={h + 8} rx="6" fill="none" stroke={C.amber} strokeWidth="2" strokeDasharray="5 4" className="anim-pulse" />}
              <rect className="hit-shape" x={x} y={150 - h} width="128" height={h} fill={k === st ? C.gold : on ? C.data : C.paper} stroke={C.ink} strokeWidth="1.4" />
              <text x={x + 64} y={166} textAnchor="middle" fontSize="11" fill={C.ash}>{`${i + 1}`}</text>
            </g>
          );
        })}
        <text x="10" y="18" fontSize="11.5" fill={C.ash}>{tt("from scattered channels → to one live view → to response standards → to a system that learns", "von verstreuten Kanälen → zu einer Live-Sicht → zu Antwortstandards → zu einem System, das lernt")}</text>
      </svg>
      <Toggles<Stage> label={tt("Stage", "Stufe")} value={st} onChange={setSt} options={STAGES.map((k, i) => ({ id: k, label: `${i + 1} · ${STAGE_TEXT[k].name}` }))} />
      <p className="rounded-md border border-line bg-paper px-3 py-2 text-caption text-ink">
        <span className="smallcaps mr-1.5">Elster Digital</span>
        {s.spree}
      </p>
      <Insight>{plain()}{s.reading}</Insight>
    </div>
  );
}

/* ------------------------------------------------------------------ B2 · the KPI first, then the tool */

type ISrc = { id: string; name: string; decision: boolean; complete: number };
const I_SRC: ISrc[] = bi([
  { id: "upsell", name: t("Order page", "Bestellseite"), decision: true, complete: 93 },
  { id: "winback", name: t("Support chat", "Support-Chat"), decision: true, complete: 88 },
  { id: "voice", name: t("Onboarding calls", "Onboarding-Anrufe"), decision: true, complete: 55 },
  { id: "sentiment", name: t("Events page", "Veranstaltungsseite"), decision: false, complete: 70 },
  { id: "images", name: t("Newsletter archive", "Newsletter-Archiv"), decision: false, complete: 97 },
]);
const useOfI = (s: ISrc) => (!s.decision ? "leave" : s.complete >= 80 ? "core" : "later");
export function SourceGrid() {
  const uid = useId().replace(/:/g, "");
  const [sel, setSelRaw] = useState("voice");
  const story = useStory([
    {
      title: tt("Select now", "Jetzt auswählen"),
      say: tt(`Elster Digital is an example company, not your case. Its order page names a KPI it should move, and ${I_SRC[0].complete}% of its data is ready: select now, and test it against a control group.`, `Elster Digital ist ein Beispielunternehmen, nicht Ihr Fall. Seine Bestellseite nennt einen KPI, den sie bewegen soll, und ${I_SRC[0].complete} % ihrer Daten sind bereit: jetzt auswählen und gegen eine Kontrollgruppe testen.`),
      look: tt("the dot in the teal area", "der Punkt im türkisen Feld"),
      apply: () => {
        setSelRaw("upsell");
      },
    },
    {
      title: tt("Data first", "Erst die Daten"),
      say: tt(`The onboarding calls would move a KPI too, but only ${I_SRC[2].complete}% of their data is ready. Built on now, they would learn the gaps. Fix the data first.`, `Die Onboarding-Anrufe würden auch einen KPI bewegen, aber nur ${I_SRC[2].complete} % ihrer Daten sind bereit. Jetzt darauf gebaut, würden sie die Lücken lernen. Erst die Daten verbessern.`),
      look: tt("the dot in the amber area", "der Punkt im bernsteinfarbenen Feld"),
      apply: () => {
        setSelRaw("voice");
      },
    },
    {
      title: tt("The point", "Das Wichtigste"),
      say: tt(`The newsletter archive has ${I_SRC[4].complete}% of its data ready, but it moves no KPI of the system. However complete, not now. Try the other interaction points.`, `Das Newsletter-Archiv hat ${I_SRC[4].complete} % seiner Daten bereit, bewegt aber keinen KPI des Systems. Egal wie vollständig: jetzt nicht. Probieren Sie die anderen Interaktionspunkte.`),
      look: tt("the dot in the grey area", "der Punkt im grauen Feld"),
      apply: () => {
        setSelRaw("images");
      },
    },
  ]);
  const setSel = (v: string) => {
    story.leave();
    setSelRaw(v);
  };
  const s = I_SRC.find((x) => x.id === sel)!;
  const u = useOfI(s);
  const POS: Record<string, { cx: number; cy: number }> = { upsell: { cx: 300, cy: 58 }, winback: { cx: 300, cy: 88 }, voice: { cx: 90, cy: 72 }, sentiment: { cx: 90, cy: 138 }, images: { cx: 300, cy: 138 } };
  const pos = (x: ISrc, _i: number) => POS[x.id];
  return (
    <div className="space-y-3">
      <ThePoint>{tt("Start from the KPI, not from the tool. An interaction point that names a KPI and has its data ready is selected now; with data not ready it waits; with no KPI it is not now.", "Gehen Sie vom KPI aus, nicht vom Werkzeug. Ein Interaktionspunkt, der einen KPI nennt und dessen Daten bereit sind, wird jetzt gewählt; mit nicht bereiten Daten wartet er; ohne KPI ist er jetzt nicht dran.")}</ThePoint>
      <Story steps={story.plan} step={story.step} onStep={story.go} />
      <svg viewBox="0 0 560 210" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{tt("Elster Digital's interaction points by customer decision and tracking", "Interaktionspunkte von Elster Digital nach Kundenentscheidung und Erfassung")}</title>
        <desc id={`${uid}-d`}>{I_SRC.map((x) => `${x.name}: ${useOfI(x)}`).join(", ")}</desc>
        <rect x="60" y="20" width="220" height="90" fill={C.soft} stroke={C.line} />
        <rect x="280" y="20" width="240" height="90" fill={C.tealSoft} stroke={C.line} />
        <rect x="60" y="110" width="460" height="80" fill={C.mist} stroke={C.line} />
        <text x="170" y="36" textAnchor="middle" fontSize="11.5" fontWeight="700" fill={C.amber}>{tt("Central: fix the tracking first", "Zentral: erst die Erfassung verbessern")}</text>
        <text x="400" y="36" textAnchor="middle" fontSize="11.5" fontWeight="700" fill={C.teal}>{tt("Central: real-time now", "Zentral: jetzt in Echtzeit")}</text>
        <text x="290" y="182" textAnchor="middle" fontSize="11.5" fontWeight="700" fill={C.ash}>{tt("Not central: no customer decision", "Nicht zentral: keine Kundenentscheidung")}</text>
        <text x="30" y="70" textAnchor="middle" fontSize="11" fill={C.ash} transform="rotate(-90 30 70)">{tt("customer decides", "Kunde entscheidet")}</text>
        <text x="170" y="206" textAnchor="middle" fontSize="11" fill={C.ash}>{tt("< 80% tracked", "< 80 % erfasst")}</text>
        <text x="400" y="206" textAnchor="middle" fontSize="11" fill={C.ash}>{tt("≥ 80% tracked", "≥ 80 % erfasst")}</text>
        {I_SRC.map((x, i) => {
          const p = pos(x, i);
          const on = x.id === sel;
          return (
            <g key={x.id} className="hit" role="button" tabIndex={0} aria-label={x.name} onClick={() => setSel(x.id)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSel(x.id)}>
              {on && story.step !== null && <circle cx={p.cx} cy={p.cy} r="17" fill="none" stroke={C.amber} strokeWidth="2" strokeDasharray="5 4" className="anim-pulse" />}
              <circle className="hit-shape" cx={p.cx} cy={p.cy} r={on ? 11 : 8} fill={on ? C.gold : C.paper} stroke={C.ink} strokeWidth="1.6" />
              <text x={p.cx + 14} y={p.cy + 4} fontSize="11.5" fontWeight={on ? 800 : 500} fill={C.ink}>{x.name}</text>
            </g>
          );
        })}
      </svg>
      <Toggles<string> label={tt("Interaction point", "Interaktionspunkt")} value={sel} onChange={setSel} options={I_SRC.map((x) => ({ id: x.id, label: x.name }))} />
      <Insight>{plain()}
        {u === "core"
          ? tt(`${s.name}: the customer decides something there and ${s.complete}% of interactions are tracked. Central: bring it into real time now, with a response standard.`, `${s.name}: Der Kunde entscheidet dort etwas, und ${s.complete} % der Interaktionen werden erfasst. Zentral: jetzt in Echtzeit bringen, mit einem Antwortstandard.`)
          : u === "later"
            ? tt(`${s.name}: the customer decides something there, but only ${s.complete}% is tracked. Steering it live now would steer by the gaps. Fix the tracking first.`, `${s.name}: Der Kunde entscheidet dort etwas, aber nur ${s.complete} % werden erfasst. Es jetzt live zu steuern, hieße nach den Lücken zu steuern. Erst die Erfassung verbessern.`)
            : tt(`${s.name}: ${s.complete}% tracked and busy enough, but no buying or renewal decision happens there. Not central, however well measured.`, `${s.name}: ${s.complete} % erfasst und gut besucht, aber dort fällt keine Kauf- oder Verlängerungsentscheidung. Nicht zentral, egal wie gut gemessen.`)}
      </Insight>
    </div>
  );
}

/* ------------------------------------------------------------------ B3 · four tests for a management KPI */

type ICrit = "explain" | "timely" | "reach" | "scale";
const I_CRITS: ICrit[] = ["explain", "timely", "reach", "scale"];
const I_CRIT_NAME = bi({ explain: t("Link to value", "Verbindung zum Wert"), timely: t("Early", "Früh"), reach: t("Reach", "Reichweite"), scale: t("Measured automatically", "Automatisch gemessen") });
const I_COMPS = bi([
  { id: "upgrade", name: t("First response time", "Erste Antwortzeit"), facts: t("linked to value · live · every request · counted by the systems", "mit dem Wert verbunden · live · jede Anfrage · von den Systemen gezählt"), r: { explain: 3, timely: 3, reach: 3, scale: 3 }, note: t("High on all four: speed is linked to closings, it moves live, it covers every request and nobody has to collect it.", "Hoch auf allen vier: Tempo ist mit Abschlüssen verbunden, es bewegt sich live, deckt jede Anfrage ab, und niemand muss es sammeln.") },
  { id: "survey", name: t("Yearly survey score", "Jährlicher Befragungswert"), facts: t("linked to value · yearly · those who answer · by a survey", "mit dem Wert verbunden · jährlich · wer antwortet · über eine Befragung"), r: { explain: 3, timely: 1, reach: 2, scale: 2 }, note: t("Linked to loyalty, but once a year is the opposite of real time.", "Mit Loyalität verbunden, aber einmal im Jahr ist das Gegenteil von Echtzeit.") },
  { id: "views", name: t("Live visitor counter", "Live-Besucherzähler"), facts: t("not linked to value · live · every visitor · counted by the systems", "nicht mit dem Wert verbunden · live · jeder Besucher · von den Systemen gezählt"), r: { explain: 1, timely: 3, reach: 3, scale: 3 }, note: t("Fast, complete and exciting, and it rose while closings fell: visitors are not buyers.", "Schnell, vollständig und spannend, und er stieg, während die Abschlüsse fielen: Besucher sind keine Käufer.") },
  { id: "wins", name: t("Agents' weekly best chats", "Beste Chats der Woche aus dem Team"), facts: t("not linked to value · weekly · chats someone picks · collected by hand", "nicht mit dem Wert verbunden · wöchentlich · von jemandem ausgewählte Chats · von Hand gesammelt"), r: { explain: 1, timely: 2, reach: 2, scale: 1 }, note: t("Good for learning, but chosen by the teller, without a comparison, and collected by hand.", "Gut zum Lernen, aber vom Erzähler ausgewählt, ohne Vergleich, und von Hand gesammelt.") },
]);
export function CompProfile() {
  const uid = useId().replace(/:/g, "");
  const [sel, setSelRaw] = useState("views");
  const story = useStory([
    {
      title: tt("A KPI that passes", "Ein KPI, der besteht"),
      say: tt(`Elster Digital is an example company, not your case. Its first response time is linked to closings, live, covers every request and is counted by the systems: High on all four, 12 of 12.`, `Elster Digital ist ein Beispielunternehmen, nicht Ihr Fall. Seine erste Antwortzeit ist mit den Abschlüssen verbunden, live, deckt jede Anfrage ab und wird von den Systemen gezählt: Hoch auf allen vier, 12 von 12.`),
      look: tt("all four rows filled to High", "alle vier Zeilen bis Hoch gefüllt"),
      apply: () => {
        setSelRaw("upgrade");
      },
    },
    {
      title: tt("A number that does not", "Eine Zahl, die nicht besteht"),
      say: tt(`The live visitor counter is automatic and exciting, but visitors are not closings. The link to value stays Low, whatever the rest.`, `Der Live-Besucherzähler ist automatisch und spannend, aber Besucher sind keine Abschlüsse. Die Verbindung zum Wert bleibt Niedrig, egal wie der Rest ist.`),
      look: tt("the first row, Link to value", "die erste Zeile, Verbindung zum Wert"),
      apply: () => {
        setSelRaw("views");
      },
    },
    {
      title: tt("The point", "Das Wichtigste"),
      say: tt(`The yearly survey score is linked to value but arrives once a year, so it is Low on early: a number for learning, not for steering. Try the other candidates.`, `Der jährliche Befragungswert ist mit dem Wert verbunden, kommt aber einmal im Jahr und ist daher bei „früh“ Niedrig: eine Zahl zum Lernen, nicht zum Steuern. Probieren Sie die anderen Kandidaten.`),
      look: tt("the second row, Early", "die zweite Zeile, Früh"),
      apply: () => {
        setSelRaw("survey");
      },
    },
  ]);
  const setSel = (v: string) => {
    story.leave();
    setSelRaw(v);
  };
  const c = I_COMPS.find((x) => x.id === sel)!;
  const total = I_CRITS.reduce((s, k) => s + c.r[k], 0);
  return (
    <div className="space-y-3">
      <ThePoint>{tt("A KPI worth steering by is linked to value, shows a change early, covers every request and is counted by the systems. The printed facts cap each rating.", "Ein KPI, nach dem es sich zu steuern lohnt, ist mit dem Wert verbunden, zeigt früh eine Veränderung, deckt jede Anfrage ab und wird von den Systemen gezählt. Die gedruckten Fakten deckeln jede Bewertung.")}</ThePoint>
      <Story steps={story.plan} step={story.step} onStep={story.go} />
      <svg viewBox="0 0 560 170" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{tt("One KPI candidate of Elster Digital on four tests", "Ein KPI-Kandidat von Elster Digital nach vier Tests")}</title>
        <desc id={`${uid}-d`}>{I_CRITS.map((k) => `${I_CRIT_NAME[k]} ${c.r[k]}`).join(", ")}</desc>
        {I_CRITS.map((k, i) => {
          const y = 14 + i * 38;
          const v = c.r[k];
          return (
            <g key={k}>
              {((story.step === 1 && k === "explain") || (story.step === 2 && k === "timely")) && <rect x="-4" y={y - 3} width="556" height="32" rx="6" fill="none" stroke={C.amber} strokeWidth="2" strokeDasharray="5 4" className="anim-pulse" />}
              <text x="0" y={y + 18} fontSize="12" fill={C.ink}>{I_CRIT_NAME[k]}</text>
              {[1, 2, 3].map((b) => (
                <rect key={b} x={160 + (b - 1) * 110} y={y} width="104" height="26" fill={b <= v ? (v === 1 ? C.grey : C.data) : C.paper} stroke={C.ink} strokeDasharray={b <= v ? undefined : "4 3"} />
              ))}
              <text x="500" y={y + 18} fontSize="12.5" fontWeight="700" fill={C.ink}>{["", tt("Low", "Niedrig"), tt("Mid", "Mittel"), tt("High", "Hoch")][v]}</text>
            </g>
          );
        })}
      </svg>
      <Toggles<string> label={tt("KPI candidate", "KPI-Kandidat")} value={sel} onChange={setSel} options={I_COMPS.map((x) => ({ id: x.id, label: x.name }))} />
      <p className="text-caption text-ash">
        <span className="font-semibold text-ink">{tt("Printed facts: ", "Gedruckte Fakten: ")}</span>
        {c.facts}
      </p>
      <Insight>{plain()}
        {tt(`${c.name}: ${total} of 12. ${c.note} Each rating is capped by a printed fact: “not linked to value” caps the link at Low; “after the customer has left” or “yearly” caps early at Low; “some customers” caps reach at Mid; “collected by hand” caps measured automatically at Low.`, `${c.name}: ${total} von 12. ${c.note} Jede Bewertung ist durch einen gedruckten Fakt gedeckelt: „nicht mit dem Wert verbunden“ deckelt die Verbindung bei Niedrig; „nachdem der Kunde gegangen ist“ oder „jährlich“ deckeln früh bei Niedrig; „einige Kunden“ deckelt die Reichweite bei Mittel; „von Hand gesammelt“ deckelt automatisch gemessen bei Niedrig.`)}
      </Insight>
    </div>
  );
}

/* ------------------------------------------------------------------ B4 · roll out, keep testing or stop: uplift and conversions */

export function LiftCases() {
  const uid = useId().replace(/:/g, "");
  const [lift, setLiftRaw] = useState(20);
  const [cases, setCasesRaw] = useState(40);
  const story = useStory([
    {
      title: tt("Roll out", "Ausrollen"),
      say: tt(`Elster Digital is an example company, not your case. A test of a callback standard shows +30% on 200 conversions per group: clear and proven. Roll out.`, `Elster Digital ist ein Beispielunternehmen, nicht Ihr Fall. Ein Test eines Rückruf-Standards zeigt +30 % bei 200 Conversions pro Gruppe: klar und belegt. Ausrollen.`),
      look: tt("the dot in the teal area", "der Punkt im türkisen Feld"),
      apply: () => {
        setLiftRaw(30);
        setCasesRaw(200);
      },
    },
    {
      title: tt("Keep testing", "Weiter testen"),
      say: tt(`Another test also shows +30%, but on only 40 conversions per group, fewer than ${CASES_MIN}. Too few to trust it: keep testing.`, `Ein anderer Test zeigt auch +30 %, aber nur bei 40 Conversions pro Gruppe, weniger als ${CASES_MIN}. Zu wenig, um ihm zu trauen: weiter testen.`),
      look: tt("the dot in the left amber strip", "der Punkt im linken bernsteinfarbenen Streifen"),
      apply: () => {
        setLiftRaw(30);
        setCasesRaw(40);
      },
    },
    {
      title: tt("The point", "Das Wichtigste"),
      say: tt(`A third test shows +2% on 300 conversions. Many conversions do not rescue a tiny uplift: they prove it is tiny. Stop. Move the two sliders to try your own.`, `Ein dritter Test zeigt +2 % bei 300 Conversions. Viele Conversions retten keinen winzigen Uplift: Sie beweisen, dass er winzig ist. Stoppen. Bewegen Sie die beiden Regler, um eigene Werte zu probieren.`),
      look: tt("the dot in the grey area", "der Punkt im grauen Feld"),
      apply: () => {
        setLiftRaw(2);
        setCasesRaw(300);
      },
    },
  ]);
  const setLift = (v: number) => {
    story.leave();
    setLiftRaw(v);
  };
  const setCases = (v: number) => {
    story.leave();
    setCasesRaw(v);
  };
  const act = lift >= LIFT_ACT && cases >= CASES_MIN ? "intervene" : lift >= LIFT_WATCH ? "watch" : "none";
  const X = (c: number) => 60 + (Math.min(c, 300) / 300) * 460;
  const Y = (l: number) => 170 - ((Math.min(Math.max(l, -10), 60) + 10) / 70) * 150;
  return (
    <div className="space-y-3">
      <ThePoint>{tt("Every test ends in a decision. A clear uplift on enough conversions: roll out. A strong uplift on too few, or a small one: keep testing. No real uplift: stop.", "Jeder Test endet in einer Entscheidung. Ein klarer Uplift bei genug Conversions: ausrollen. Ein starker Uplift bei zu wenigen oder ein kleiner: weiter testen. Kein echter Uplift: stoppen.")}</ThePoint>
      <Story steps={story.plan} step={story.step} onStep={story.go} />
      <svg viewBox="0 0 560 200" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{tt("Roll out, keep testing or stop, by uplift and conversions per group", "Ausrollen, weiter testen oder stoppen, nach Uplift und Conversions pro Gruppe")}</title>
        <desc id={`${uid}-d`}>{tt(`Uplift ${lift}%, ${cases} conversions: ${act}.`, `Uplift ${lift} %, ${cases} Conversions: ${act}.`)}</desc>
        <rect x={X(CASES_MIN)} y={Y(60)} width={X(300) - X(CASES_MIN)} height={Y(LIFT_ACT) - Y(60)} fill={C.tealSoft} />
        <rect x={X(0)} y={Y(60)} width={X(CASES_MIN) - X(0)} height={Y(LIFT_ACT) - Y(60)} fill={C.soft} />
        <rect x={X(0)} y={Y(LIFT_ACT)} width={X(300) - X(0)} height={Y(LIFT_WATCH) - Y(LIFT_ACT)} fill={C.soft} />
        <rect x={X(0)} y={Y(LIFT_WATCH)} width={X(300) - X(0)} height={Y(-10) - Y(LIFT_WATCH)} fill={C.mist} />
        <text x={X(200)} y={Y(45)} textAnchor="middle" fontSize="12" fontWeight="700" fill={C.teal}>{tt("roll out", "ausrollen")}</text>
        <text x={X(50)} y={Y(45)} textAnchor="middle" fontSize="11" fontWeight="700" fill={C.amber}>{tt("keep testing", "weiter testen")}</text>
        <text x={X(200)} y={Y(6)} textAnchor="middle" fontSize="11" fontWeight="700" fill={C.amber}>{tt("keep testing", "weiter testen")}</text>
        <text x={X(200)} y={Y(-4)} textAnchor="middle" fontSize="11.5" fontWeight="700" fill={C.ash}>{tt("stop", "stoppen")}</text>
        <line x1={X(0)} y1={Y(0)} x2={X(300)} y2={Y(0)} stroke={C.rust} strokeDasharray="4 3" />
        <line x1={X(0)} y1={Y(-10)} x2={X(0)} y2={Y(60)} stroke={C.ash} />
        <text x={X(150)} y="196" textAnchor="middle" fontSize="11" fill={C.ash}>{tt("conversions in the smaller group →", "Conversions in der kleineren Gruppe →")}</text>
        <text x="16" y={Y(25)} textAnchor="middle" fontSize="11" fill={C.ash} transform={`rotate(-90 16 ${Y(25)})`}>{tt("uplift % →", "Uplift % →")}</text>
        {story.step !== null && <circle cx={X(cases)} cy={Y(lift)} r="17" fill="none" stroke={C.amber} strokeWidth="2" strokeDasharray="5 4" className="anim-pulse" />}
        <circle cx={X(cases)} cy={Y(lift)} r="9" fill={C.gold} stroke={C.ink} strokeWidth="2" />
      </svg>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor={`${uid}-lift`} className="smallcaps block">{tt(`Uplift over the control group: ${lift > 0 ? "+" : ""}${lift}%`, `Uplift gegenüber der Kontrollgruppe: ${lift > 0 ? "+" : ""}${lift} %`)}</label>
          <input id={`${uid}-lift`} type="range" min={-10} max={60} step={1} value={lift} onChange={(e) => setLift(Number(e.target.value))} className="w-full accent-[#8A5A0B]" />
        </div>
        <div>
          <label htmlFor={`${uid}-cases`} className="smallcaps block">{tt(`Conversions per group: ${cases}`, `Conversions pro Gruppe: ${cases}`)}</label>
          <input id={`${uid}-cases`} type="range" min={10} max={300} step={10} value={cases} onChange={(e) => setCases(Number(e.target.value))} className="w-full accent-[#8A5A0B]" />
        </div>
      </div>
      <Insight>{plain()}
        {act === "intervene"
          ? tt(`An uplift of ${lift}% on ${cases} conversions per group: clear and proven. Roll out, and hand it to the team that owns the channel.`, `Ein Uplift von ${lift} % bei ${cases} Conversions pro Gruppe: klar und belegt. Ausrollen, und dem Team übergeben, dem der Kanal gehört.`)
          : act === "watch"
            ? lift >= LIFT_ACT
              ? tt(`An uplift of ${lift}% looks strong, but ${cases} conversions are too few to trust it (fewer than ${CASES_MIN}). Keep testing; the data team runs it until the size is reached.`, `Ein Uplift von ${lift} % sieht stark aus, aber ${cases} Conversions sind zu wenig, um ihm zu trauen (weniger als ${CASES_MIN}). Weiter testen; das Datenteam lässt ihn laufen, bis die Größe erreicht ist.`)
              : tt(`An uplift of ${lift}%: a small difference. Not worth a rollout yet; keep testing a stronger variant.`, `Ein Uplift von ${lift} %: ein kleiner Unterschied. Noch keinen Rollout wert; eine stärkere Variante weiter testen.`)
            : tt(`An uplift of ${lift}%: the variant does about as well as the control, or worse. Stop; running it on costs money and attention for nothing.`, `Ein Uplift von ${lift} %: Die Variante schneidet etwa so gut ab wie die Kontrolle, oder schlechter. Stoppen; sie weiterlaufen zu lassen kostet Geld und Aufmerksamkeit für nichts.`)}
      </Insight>
    </div>
  );
}

/* ------------------------------------------------------------------ B5 · how an architecture is built: Elster's chat and its base */

/**
 * The worked example of Materi B5 on the example company Elster Digital (a Leipzig IT service provider, Case assumption): a small version of the Route 2
 * panel. Two controls set the same two facts the panel reads: does measurement start before the chat, and is its data ready. The links in
 * the picture break the way the panel's do, and "What this shows" says what the break means.
 */
export function ArchExample() {
  const [measFirst, setMeasFirstRaw] = useState(true);
  const [ready, setReadyRaw] = useState(true);
  const story = useStory([
    {
      title: tt("The base first", "Die Basis zuerst"),
      say: tt("Elster Digital is an example company, not your case. It builds its live view and KPI system first, so its chat is measured from its first week.", "Elster Digital ist ein Beispielunternehmen, nicht Ihr Fall. Es baut zuerst seine Live-Sicht und sein KPI-System, damit sein Chat ab der ersten Woche gemessen wird."),
      look: tt("the solid teal link between the chat and the base", "die durchgezogene teal Verbindung zwischen Chat und Basis"),
      apply: () => {
        setMeasFirstRaw(true);
        setReadyRaw(true);
      },
    },
    {
      title: tt("The tool before the base", "Das Werkzeug vor der Basis"),
      say: tt("Now the chat starts first. Nothing measures it, so nobody can say whether it closes more requests. Its link is dashed.", "Jetzt startet der Chat zuerst. Nichts misst ihn, also kann niemand sagen, ob er mehr Anfragen abschließt. Seine Verbindung ist gestrichelt."),
      look: tt("the dashed amber link and the note on the chat", "die gestrichelte amberfarbene Verbindung und der Vermerk am Chat"),
      apply: () => {
        setMeasFirstRaw(false);
        setReadyRaw(true);
      },
    },
    {
      title: tt("The point", "Das Wichtigste"),
      say: tt("Measured, but on data only 78% tracked, the chat would learn the gaps. Base first, then an engine on ready data. Try the two buttons.", "Gemessen, aber auf nur zu 78 % erfassten Daten würde der Chat die Lücken lernen. Zuerst die Basis, dann eine Engine auf bereiten Daten. Probieren Sie die beiden Schaltflächen."),
      look: tt("the data note under the chat", "den Datenvermerk unter dem Chat"),
      apply: () => {
        setMeasFirstRaw(true);
        setReadyRaw(false);
      },
    },
  ]);
  const setMeasFirst = (v: boolean) => {
    story.leave();
    setMeasFirstRaw(v);
  };
  const setReady = (v: boolean) => {
    story.leave();
    setReadyRaw(v);
  };
  const dataPct = ready ? 93 : 78;
  const dataOk = dataPct >= 80;
  return (
    <div className="space-y-3">
      <ThePoint>{tt("An architecture is built in order: the base first, then measurement, then the data, then the engines. Where a link in that chain is missing, the tool above it cannot be trusted.", "Eine Architektur wird der Reihe nach gebaut: zuerst die Basis, dann die Messung, dann die Daten, dann die Engines. Wo ein Glied dieser Kette fehlt, lässt sich dem Werkzeug darüber nicht trauen.")}</ThePoint>
      <Story steps={story.plan} step={story.step} onStep={story.go} />
      <div role="group" aria-label={tt("Elster's chat and its base", "Der Chat von Elster und seine Basis")} className="mx-auto max-w-xl">
        <div className="rounded-lg border border-dashed border-line bg-canvas px-3 py-1.5 text-center text-caption text-ash">{tt("What customers meet: the order page", "Was Kunden erleben: die Bestellseite")}</div>
        <div className="my-1 flex h-7 items-center justify-center" aria-hidden />
        <div className={clsx("rounded-lg border p-2 text-caption leading-snug", "border-signal bg-signalSoft")}>
          <p className="font-semibold text-ink">{tt("Chat on the order page", "Chat auf der Bestellseite")}</p>
          <p className="text-ash">{tt(measFirst ? "Starts in month 1" : "Starts in month 1, before the base", measFirst ? "Startet in Monat 1" : "Startet in Monat 1, vor der Basis")}</p>
          {!measFirst && <p className="text-accent">{tt("nothing measures it yet", "noch misst es nichts")}</p>}
          {!dataOk && <p className="text-accent">{tt(`its data is ${dataPct}% tracked, below 80%, when it starts`, `seine Daten sind zu ${dataPct} % erfasst, unter 80 %, wenn es startet`)}</p>}
        </div>
        <div className={clsx("flex h-7 items-center justify-center gap-2 text-micro normal-case tracking-normal", measFirst ? "text-ash" : "text-accent")}>
          <span aria-hidden className={clsx("block h-full w-0 border-l-[3px]", measFirst ? "border-solid border-signal" : "border-dashed border-gold")} />
          <span>{measFirst ? tt("measured", "gemessen") : tt("not measured", "nicht gemessen")}</span>
        </div>
        <div className={clsx("rounded-lg border p-2 text-caption leading-snug", measFirst ? "border-signal bg-signalSoft" : "border-signal bg-signalSoft")}>
          <p className="font-semibold text-ink">{tt("Live view and KPI system", "Live-Sicht und KPI-System")}</p>
          <p className="text-ash">{measFirst ? tt("Starts in month 1", "Startet in Monat 1") : tt("Starts in month 3, after the chat", "Startet in Monat 3, nach dem Chat")}</p>
        </div>
        <div className="flex h-7 items-center justify-center gap-2 text-micro normal-case tracking-normal text-ash">
          <span aria-hidden className="block h-full w-0 border-l-[3px] border-solid border-signal" />
          <span>{tt("raw data flows up", "Rohdaten fließen nach oben")}</span>
        </div>
        <div className="rounded-lg border border-dashed border-line bg-canvas px-3 py-1.5 text-center text-caption text-ash">{tt(`Where the data lives: CRM and website, ${dataPct}% of what the chat needs is tracked`, `Wo die Daten liegen: CRM und Website, ${dataPct} % dessen, was der Chat braucht, sind erfasst`)}</div>
      </div>
      <div className="space-y-1.5">
        <p className="smallcaps">{tt("Two things to change", "Zwei Dinge zum Ändern")}</p>
        <Toggles<string> label={tt("Measurement starts", "Die Messung startet")} value={measFirst ? "first" : "after"} onChange={(v) => setMeasFirst(v === "first")} options={[{ id: "first", label: tt("Before the chat", "Vor dem Chat") }, { id: "after", label: tt("After the chat", "Nach dem Chat") }]} />
        <Toggles<string> label={tt("Data behind the chat", "Daten hinter dem Chat")} value={ready ? "ready" : "weak"} onChange={(v) => setReady(v === "ready")} options={[{ id: "ready", label: tt("93% tracked", "93 % erfasst") }, { id: "weak", label: tt("78% tracked", "78 % erfasst") }]} />
      </div>
      <Insight>{plain()}
        {measFirst && dataOk
          ? tt("The base exists before the tool and the tool runs on data that is ready. Elster can say whether the chat closes more requests, and its data does not teach it gaps. This is what a plan that holds looks like.", "Die Basis steht vor dem Werkzeug, und das Werkzeug läuft auf bereiten Daten. Elster kann sagen, ob der Chat mehr Anfragen abschließt, und seine Daten lehren ihn keine Lücken. So sieht ein Plan aus, der hält.")
          : !measFirst
            ? tt("The chat starts before anything can measure it. Its link to the base is dashed: Elster would pay for a tool and never know whether it works. The fix is the order: the live view and KPI system first.", "Der Chat startet, bevor etwas ihn messen kann. Seine Verbindung zur Basis ist gestrichelt: Elster würde für ein Werkzeug zahlen und nie wissen, ob es wirkt. Die Lösung ist die Reihenfolge: zuerst Live-Sicht und KPI-System.")
            : tt("It is measured, but its data is only 78% tracked, below the 80% an engine should start on. It would learn the gaps. The fix is to clean the data first, or to hold the engine back until it is ready.", "Er wird gemessen, aber seine Daten sind nur zu 78 % erfasst, unter den 80 %, auf denen eine Engine starten sollte. Er würde die Lücken lernen. Die Lösung ist, zuerst die Daten zu bereinigen oder die Engine zurückzuhalten, bis sie bereit sind.")}
      </Insight>
    </div>
  );
}
