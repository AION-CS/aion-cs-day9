"use client";

import { useId, useState } from "react";
import { Insight, Toggles } from "@/components/materi/kit";
import { CASES_MIN, LIFT_ACT, LIFT_WATCH } from "@/data/route2";
import { bi, num, t, tt } from "@/lib/lang";
import { Gloss } from "@/lib/glossify";

/**
 * The interactive diagrams of Materi B (Route 2). Every one uses the worked-example company Elster Digital (a Leipzig IT service provider,
 * Case assumption), never LiveConnect. Every control is followed by an always-visible "What this shows" (CLAUDE.md #20).
 */
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
  const [st, setSt] = useState<Stage>("dash");
  const idx = STAGES.indexOf(st);
  const s = STAGE_TEXT[st];
  return (
    <div className="space-y-3">
      <svg viewBox="0 0 560 170" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{tt("Four stages towards a real-time management system", "Vier Stufen zu einem Echtzeit-Managementsystem")}</title>
        <desc id={`${uid}-d`}>{tt(`Stage shown: ${s.name}.`, `Gezeigte Stufe: ${s.name}.`)}</desc>
        {STAGES.map((k, i) => {
          const x = 10 + i * 137;
          const h = 40 + i * 25;
          const on = i <= idx;
          return (
            <g key={k} className="hit" role="button" tabIndex={0} aria-label={STAGE_TEXT[k].name} onClick={() => setSt(k)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSt(k)}>
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
      <Insight>{s.reading}</Insight>
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
  const [sel, setSel] = useState("voice");
  const s = I_SRC.find((x) => x.id === sel)!;
  const u = useOfI(s);
  const POS: Record<string, { cx: number; cy: number }> = { upsell: { cx: 300, cy: 58 }, winback: { cx: 300, cy: 88 }, voice: { cx: 90, cy: 72 }, sentiment: { cx: 90, cy: 138 }, images: { cx: 300, cy: 138 } };
  const pos = (x: ISrc, _i: number) => POS[x.id];
  return (
    <div className="space-y-3">
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
              <circle className="hit-shape" cx={p.cx} cy={p.cy} r={on ? 11 : 8} fill={on ? C.gold : C.paper} stroke={C.ink} strokeWidth="1.6" />
              <text x={p.cx + 14} y={p.cy + 4} fontSize="11.5" fontWeight={on ? 800 : 500} fill={C.ink}>{x.name}</text>
            </g>
          );
        })}
      </svg>
      <Toggles<string> label={tt("Interaction point", "Interaktionspunkt")} value={sel} onChange={setSel} options={I_SRC.map((x) => ({ id: x.id, label: x.name }))} />
      <Insight>
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
  const [sel, setSel] = useState("views");
  const c = I_COMPS.find((x) => x.id === sel)!;
  const total = I_CRITS.reduce((s, k) => s + c.r[k], 0);
  return (
    <div className="space-y-3">
      <svg viewBox="0 0 560 170" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{tt("One KPI candidate of Elster Digital on four tests", "Ein KPI-Kandidat von Elster Digital nach vier Tests")}</title>
        <desc id={`${uid}-d`}>{I_CRITS.map((k) => `${I_CRIT_NAME[k]} ${c.r[k]}`).join(", ")}</desc>
        {I_CRITS.map((k, i) => {
          const y = 14 + i * 38;
          const v = c.r[k];
          return (
            <g key={k}>
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
      <Insight>
        {tt(`${c.name}: ${total} of 12. ${c.note} Each rating is capped by a printed fact: “not linked to value” caps the link at Low; “after the customer has left” or “yearly” caps early at Low; “some customers” caps reach at Mid; “collected by hand” caps measured automatically at Low.`, `${c.name}: ${total} von 12. ${c.note} Jede Bewertung ist durch einen gedruckten Fakt gedeckelt: „nicht mit dem Wert verbunden“ deckelt die Verbindung bei Niedrig; „nachdem der Kunde gegangen ist“ oder „jährlich“ deckeln früh bei Niedrig; „einige Kunden“ deckelt die Reichweite bei Mittel; „von Hand gesammelt“ deckelt automatisch gemessen bei Niedrig.`)}
      </Insight>
    </div>
  );
}

/* ------------------------------------------------------------------ B4 · roll out, keep testing or stop: uplift and conversions */

export function LiftCases() {
  const uid = useId().replace(/:/g, "");
  const [lift, setLift] = useState(20);
  const [cases, setCases] = useState(40);
  const act = lift >= LIFT_ACT && cases >= CASES_MIN ? "intervene" : lift >= LIFT_WATCH ? "watch" : "none";
  const X = (c: number) => 60 + (Math.min(c, 300) / 300) * 460;
  const Y = (l: number) => 170 - ((Math.min(Math.max(l, -10), 60) + 10) / 70) * 150;
  return (
    <div className="space-y-3">
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
      <Insight>
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

/* ------------------------------------------------------------------ B5 · Elster's architecture over four months */

const I_ARCH = bi([
  { id: "base", name: t("Live interaction view", "Live-Interaktionssicht"), start: 1, owner: t("Head of Data", "Leitung Data"), trigger: t("If the live screen does not show response times for 90% of requests by week 4, the chat widening waits.", "Zeigt der Live-Bildschirm bis Woche 4 nicht für 90 % der Anfragen Antwortzeiten, wartet die Ausweitung des Chats."), why: t("Starts first: every other item is measured by it.", "Startet zuerst: Jeder andere Punkt wird daran gemessen.") },
  { id: "score", name: t("Chat on the order page", "Chat auf der Bestellseite"), start: 1, owner: t("Head of Marketing", "Marketingleitung"), trigger: t("If more than 20% of chats are rated “not helpful” in any week, the five worst answers are rewritten before the chat is widened.", "Werden in einer Woche mehr als 20 % der Chats als „nicht hilfreich“ bewertet, werden die fünf schlechtesten Antworten neu geschrieben, bevor der Chat ausgeweitet wird."), why: t("Starts in the same month: the order page is tracked well enough, and every week of waiting costs orders.", "Startet im selben Monat: Die Bestellseite wird gut genug erfasst, und jede Woche Warten kostet Bestellungen.") },
  { id: "calls", name: t("Response standards and routing", "Antwortstandards und Weiterleitung"), start: 2, owner: t("Head of Sales", "Vertriebsleitung"), trigger: t("If the first response time on the order page is above 5 minutes in any week, a second person moves onto the chat.", "Liegt die erste Antwortzeit auf der Bestellseite in einer Woche über 5 Minuten, geht eine zweite Person auf den Chat."), why: t("Starts once the live view shows where answers are slow.", "Startet, sobald die Live-Sicht zeigt, wo Antworten langsam sind.") },
]);
export function ArchExample() {
  const uid = useId().replace(/:/g, "");
  const [sel, setSel] = useState("base");
  const r = I_ARCH.find((x) => x.id === sel)!;
  const X = (m: number) => 250 + (m - 1) * 76;
  return (
    <div className="space-y-3">
      <svg viewBox="0 0 560 170" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{tt("Elster's three funded items by start month", "Die drei finanzierten Punkte von Elster nach Startmonat")}</title>
        <desc id={`${uid}-d`}>{I_ARCH.map((a) => `${a.name}: ${a.start}`).join(". ")}</desc>
        {[1, 2, 3, 4].map((m) => (
          <text key={m} x={X(m) + 37} y="14" textAnchor="middle" fontSize="11.5" fill={C.ash}>{`M${m}`}</text>
        ))}
        {I_ARCH.map((a, i) => {
          const y = 24 + i * 44;
          const on = a.id === sel;
          return (
            <g key={a.id} className="hit" role="button" tabIndex={0} aria-label={a.name} onClick={() => setSel(a.id)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSel(a.id)}>
              <text x="4" y={y + 22} fontSize="12" fontWeight={on ? 800 : 600} fill={C.ink}>{a.name.length > 36 ? `${a.name.slice(0, 35)}…` : a.name}</text>
              {[1, 2, 3, 4].map((m) => (
                <rect key={m} className={m === a.start ? "hit-shape" : undefined} x={X(m) + 2} y={y + 6} width="72" height="24" rx="3" fill={m === a.start ? C.data : m > a.start ? C.tealSoft : C.paper} stroke={on && m === a.start ? C.amber : C.line} strokeWidth={on && m === a.start ? 2.5 : 1} />
              ))}
            </g>
          );
        })}
      </svg>
      <div className="space-y-1.5">
        <p className="smallcaps">{tt("Read one item", "Einen Punkt lesen")}</p>
        <Toggles<string> label={tt("Item", "Punkt")} value={sel} onChange={setSel} options={I_ARCH.map((a) => ({ id: a.id, label: a.name }))} />
      </div>
      <div className="rounded-lg border border-line bg-paper p-3.5 text-caption" aria-live="polite">
        <p className="smallcaps">{r.name}</p>
        <p className="mt-1">
          <span className="font-semibold text-ink">Owner. </span>
          {r.owner}
        </p>
        <p className="mt-1">
          <span className="font-semibold text-ink">Trigger. </span>
          <Gloss>{r.trigger}</Gloss>
        </p>
        <p className="mt-1 text-ash">{r.why}</p>
      </div>
      <Insight>
        {tt("The live view starts first, together with the chat on the well-tracked order page, because every other item is measured by it and every week of waiting costs orders. Each item has one owner who can change it alone and a trigger with a number, a date and an action. Elster left out an all-in-one experience platform on purpose: it would have taken fourteen weeks, and nobody at Elster could have explained or measured it.", "Die Live-Sicht startet zuerst, zusammen mit dem Chat auf der gut erfassten Bestellseite, weil jeder andere Punkt daran gemessen wird und jede Woche Warten Bestellungen kostet. Jeder Punkt hat einen Owner, der ihn allein ändern kann, und einen Trigger mit Zahl, Datum und Aktion. Elster hat eine All-in-one-Experience-Plattform bewusst weggelassen: Sie hätte vierzehn Wochen gebraucht, und niemand bei Elster hätte sie erklären oder messen können.")}
      </Insight>
    </div>
  );
}
