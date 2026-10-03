"use client";

import { useId, useState } from "react";
import { Insight, Story, ThePoint, Toggles, useStory } from "@/components/materi/kit";
import { LEVEL_LABEL } from "@/data/ladder";
import type { LevelTag } from "@/data/ladder";
import { MOSEL, MOSEL_RESULT, extraOf } from "@/data/forecast";
import { PATTERNS } from "@/data/patterns";
import type { PatternId } from "@/data/patterns";
import { EVIDENCE_LABEL, explainBucket, speedBand } from "@/data/measures";
import { bi, euro, num, pct, t, tt } from "@/lib/lang";

/**
 * The interactive diagrams of Materi A (Route 1). Every one uses the worked-example company Neckar Hosting (a Heilbronn hosting provider,
 * Case assumption), never LiveConnect, so the answer to a task block is never printed. Every control is followed by an always-visible
 * "What this shows" (CLAUDE.md #20), every picture opens with "The point" and carries a three-step "Walk me through it" story that
 * drives the real controls (CLAUDE.md #36); a manual button leaves the story.
 */
/** "In plain words:" leads every reading of a control (CLAUDE.md #36). */
const plain = () => tt("In plain words: ", "In einfachen Worten: ");
const C = { ink: "#1F2328", ash: "#59606A", paper: "#FFFEFA", mist: "#ECE6D6", line: "#D8D1BF", amber: "#8A5A0B", gold: "#D99A2B", teal: "#0F6B6B", tealSoft: "#DFEEEB", rust: "#A4472A", rustSoft: "#F6E3DB", data: "#2F5D62", grey: "#8B9098", soft: "#FBF0D6" };

/* ------------------------------------------------------------------ A1 · what a delay costs */

type Band = "m5" | "h1" | "d1" | "d3";
const BANDS: Band[] = ["m5", "h1", "d1", "d3"];
const BAND = bi({
  m5: { label: t("within 5 minutes", "innerhalb von 5 Minuten"), rate: 30 as number, reading: t("Answered within five minutes, 30% of Neckar's requests closed: the customer is still on the page, the question is still fresh, and no competitor has answered yet.", "Innerhalb von fünf Minuten beantwortet, schlossen 30 % der Anfragen von Neckar ab: Der Kunde ist noch auf der Seite, die Frage ist noch frisch, und kein Wettbewerber hat schon geantwortet.") },
  h1: { label: t("within 1 hour", "innerhalb von 1 Stunde"), rate: 20 as number, reading: t("Within an hour, 20% closed: a third fewer than within five minutes. The customer has moved on to other work, but still remembers the question.", "Innerhalb einer Stunde schlossen 20 % ab: ein Drittel weniger als innerhalb von fünf Minuten. Der Kunde ist bei anderer Arbeit, erinnert sich aber noch an die Frage.") },
  d1: { label: t("within 1 day", "innerhalb von 1 Tag"), rate: 10 as number, reading: t("After up to a day, 10% closed: half of the one-hour rate. Many customers have asked a second provider in the meantime.", "Nach bis zu einem Tag schlossen 10 % ab: die Hälfte der Ein-Stunden-Quote. Viele Kunden haben inzwischen einen zweiten Anbieter gefragt.") },
  d3: { label: t("after 1 to 3 days", "nach 1 bis 3 Tagen"), rate: 5 as number, reading: t("After more than a day, only 5% closed: a sixth of the five-minute rate. The answer arrives when the decision has been made.", "Nach mehr als einem Tag schlossen nur 5 % ab: ein Sechstel der Fünf-Minuten-Quote. Die Antwort kommt, wenn die Entscheidung gefallen ist.") },
});

export function DelayCost() {
  const uid = useId().replace(/:/g, "");
  const [band, setBandRaw] = useState<Band>("h1");
  const story = useStory([
    {
      title: tt("Answered at once", "Sofort beantwortet"),
      say: tt(`Neckar Hosting is an example company, not your case. When it answered a quote request within five minutes, ${BAND.m5.rate}% closed: the customer was still on the page with the question fresh.`, `Neckar Hosting ist ein Beispielunternehmen, nicht Ihr Fall. Wenn es eine Angebotsanfrage innerhalb von fünf Minuten beantwortete, schlossen ${BAND.m5.rate} % ab: Der Kunde war noch auf der Seite, die Frage frisch.`),
      look: tt("the longest bar", "der längste Balken"),
      apply: () => {
        setBandRaw("m5");
      },
    },
    {
      title: tt("Answered too late", "Zu spät beantwortet"),
      say: tt(`After more than a day only ${BAND.d3.rate}% closed. It is like a shop assistant who comes back after you have already left: the answer arrives when the decision has been made.`, `Nach mehr als einem Tag schlossen nur ${BAND.d3.rate} % ab. Es ist wie eine Verkäuferin, die zurückkommt, wenn Sie schon gegangen sind: Die Antwort kommt, wenn die Entscheidung gefallen ist.`),
      look: tt("the shortest bar", "der kürzeste Balken"),
      apply: () => {
        setBandRaw("d3");
      },
    },
    {
      title: tt("The point", "Das Wichtigste"),
      say: tt(`Speed is a success factor because customers decide while their question is fresh. Every step of waiting costs closings. Try the four buttons.`, `Tempo ist ein Erfolgsfaktor, weil Kunden entscheiden, solange ihre Frage frisch ist. Jede Stufe des Wartens kostet Abschlüsse. Probieren Sie die vier Schaltflächen.`),
      look: tt("the bars shrink from top to bottom", "die Balken werden von oben nach unten kürzer"),
      apply: () => {
        setBandRaw("h1");
      },
    },
  ]);
  const setBand = (v: Band) => {
    story.leave();
    setBandRaw(v);
  };
  const b = BAND[band];
  const W = (r: number) => (r / 30) * 330;
  return (
    <div className="space-y-3">
      <ThePoint>{tt("The longer a customer waits for the first answer, the fewer deals close. The loss is steepest in the first minutes and hours, while the customer is still on the page and has not asked anyone else.", "Je länger ein Kunde auf die erste Antwort wartet, desto weniger Abschlüsse kommen zustande. Der Verlust ist in den ersten Minuten und Stunden am steilsten, solange der Kunde noch auf der Seite ist und noch niemand anderen gefragt hat.")}</ThePoint>
      <Story steps={story.plan} step={story.step} onStep={story.go} />
      <svg viewBox="0 0 560 190" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{tt("Neckar Hosting: closing rate of quote requests by speed of the first answer", "Neckar Hosting: Abschlussquote der Angebotsanfragen nach Tempo der ersten Antwort")}</title>
        <desc id={`${uid}-d`}>{BANDS.map((k) => `${BAND[k].label}: ${BAND[k].rate}%`).join(", ")}</desc>
        {BANDS.map((k, i) => {
          const y = 14 + i * 42;
          const on = k === band;
          const r = BAND[k].rate;
          return (
            <g key={k} className="hit" role="button" tabIndex={0} aria-label={BAND[k].label} onClick={() => setBand(k)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setBand(k)}>
              {on && story.step !== null && <rect x="-4" y={y - 4} width="556" height="36" rx="7" fill="none" stroke={C.amber} strokeWidth="2" strokeDasharray="5 4" className="anim-pulse" />}
              <text x="0" y={y + 19} fontSize="12" fontWeight={on ? 700 : 400} fill={C.ink}>{BAND[k].label}</text>
              <rect className="hit-shape" x="170" y={y} width={W(r)} height="28" fill={on ? C.gold : C.data} stroke={C.ink} />
              <text x={176 + W(r)} y={y + 19} fontSize="12.5" fontWeight="700" fill={C.ink}>{pct(r)}</text>
            </g>
          );
        })}
      </svg>
      <Toggles<Band> label={tt("Speed of the first answer", "Tempo der ersten Antwort")} value={band} onChange={setBand} options={BANDS.map((k) => ({ id: k, label: BAND[k].label }))} />
      <Insight>{plain()}{b.reading}</Insight>
      <p className="text-caption text-ash">{tt("Illustration on Neckar Hosting's quote requests (Case assumption).", "Illustration mit den Angebotsanfragen von Neckar Hosting (Fallannahme).")}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ A2 · personalisation in the moment */

type Visitor = "anon" | "campaign" | "customer";
type Depth = "none" | "fit" | "much";
const VISITORS: Visitor[] = ["anon", "campaign", "customer"];
const DEPTHS: Depth[] = ["none", "fit", "much"];
const V_LABEL = bi({ anon: t("First visit, from a search", "Erster Besuch, aus einer Suche"), campaign: t("From the law-firm campaign", "Aus der Kanzlei-Kampagne"), customer: t("Logged-in customer", "Angemeldeter Kunde") });
const D_LABEL = bi({ none: t("No personalisation", "Keine Personalisierung"), fit: t("Fitting", "Passend"), much: t("Too much", "Zu viel") });
const SHOWN = bi({
  anon: {
    none: t("The standard start page.", "Die Standard-Startseite."),
    fit: t("The standard page, with the three questions first-time visitors ask most.", "Die Standardseite, mit den drei Fragen, die Erstbesucher am häufigsten stellen."),
    much: t("“Welcome back from Stuttgart! We saw you read about backup.”", "„Willkommen zurück aus Stuttgart! Wir haben gesehen, dass Sie über Backup gelesen haben.“"),
  },
  campaign: {
    none: t("The standard start page, although the visitor clicked on an ad for law firms.", "Die Standard-Startseite, obwohl der Besucher auf eine Anzeige für Kanzleien geklickt hat."),
    fit: t("Hosting for law firms first: client confidentiality, a case from a Mannheim firm.", "Hosting für Kanzleien zuerst: Mandantengeheimnis, ein Fall einer Mannheimer Kanzlei."),
    much: t("A pop-up asking for the firm's name and number of lawyers before anything is shown.", "Ein Pop-up, das nach Kanzleiname und Zahl der Anwälte fragt, bevor irgendetwas gezeigt wird."),
  },
  customer: {
    none: t("The same start page every visitor sees.", "Dieselbe Startseite, die jeder Besucher sieht."),
    fit: t("Their servers' status, their next renewal date, and the add-on that customers of their size added next.", "Der Status ihrer Server, ihr nächstes Verlängerungsdatum und das Add-on, das Kunden ihrer Größe als Nächstes ergänzten."),
    much: t("A list of every page their employees opened this month, with an offer for each.", "Eine Liste aller Seiten, die ihre Mitarbeitenden diesen Monat geöffnet haben, mit einem Angebot zu jeder."),
  },
});
const READ = bi({
  none: t("Nothing is personalised: nobody is bothered, and nobody is helped. Where Neckar knows why the visitor came or who they are, this leaves value unused.", "Nichts wird personalisiert: Niemand wird gestört, und niemandem wird geholfen. Wo Neckar weiß, warum der Besucher kam oder wer er ist, bleibt so Wert ungenutzt."),
  fit: t("The page uses what the visitor gave: the campaign they clicked, the account they logged into. It helps them decide faster, so it is felt as added value.", "Die Seite nutzt, was der Besucher gab: die geklickte Kampagne, das Konto, in das er sich einloggte. Sie hilft ihm, schneller zu entscheiden, und wird daher als Mehrwert empfunden."),
  much: t("The page shows that Neckar watched the visitor, or asks before it gives. That feels intrusive, and under the GDPR it may also lack a lawful basis.", "Die Seite zeigt, dass Neckar den Besucher beobachtet hat, oder fragt, bevor sie gibt. Das wirkt aufdringlich, und nach der DSGVO fehlt dafür vielleicht auch eine Rechtsgrundlage."),
});

const M_IDEAS = bi([
  { id: "a", text: t("“Answer every chat on the pricing page within two minutes.”", "„Jeden Chat auf der Preisseite innerhalb von zwei Minuten beantworten.“"), tag: "respond" as LevelTag, why: t("The customer hears from Neckar sooner: speed.", "Der Kunde hört früher von Neckar: Tempo.") },
  { id: "b", text: t("“Show law-firm visitors the confidentiality page first.”", "„Kanzlei-Besuchern zuerst die Seite zur Vertraulichkeit zeigen.“"), tag: "personal" as LevelTag, why: t("What this visitor sees changes with why they came: personalisation.", "Was dieser Besucher sieht, ändert sich damit, warum er kam: Personalisierung.") },
  { id: "c", text: t("“Test two versions of the order form for three weeks and keep the better one.”", "„Drei Wochen lang zwei Versionen des Bestellformulars testen und die bessere behalten.“"), tag: "learn" as LevelTag, why: t("It measures which version works and changes the next one: learn and adjust.", "Es misst, welche Version wirkt, und ändert die nächste: lernen und anpassen.") },
]);

export function MomentProfile() {
  const [v, setVRaw] = useState<Visitor>("campaign");
  const [d, setDRaw] = useState<Depth>("fit");
  const story = useStory([
    {
      title: tt("Personalisation that fits", "Personalisierung, die passt"),
      say: tt(`Neckar Hosting is an example company, not your case. A visitor who clicked a law-firm ad lands on hosting for law firms: confidentiality first, a case from a firm like theirs. The page uses what the visitor gave.`, `Neckar Hosting ist ein Beispielunternehmen, nicht Ihr Fall. Ein Besucher, der eine Kanzlei-Anzeige anklickte, landet bei Hosting für Kanzleien: zuerst Vertraulichkeit, ein Fall einer Kanzlei wie seiner. Die Seite nutzt, was der Besucher gab.`),
      look: tt("the highlighted card in the middle", "die hervorgehobene Karte in der Mitte"),
      apply: () => {
        setVRaw("campaign");
        setDRaw("fit");
      },
    },
    {
      title: tt("Personalisation that goes too far", "Personalisierung, die zu weit geht"),
      say: tt(`Now a first-time visitor is greeted with “we saw you read about backup”. Neckar used more than the visitor gave, and it feels like being followed by a shop assistant with notes.`, `Jetzt wird ein Erstbesucher mit „wir haben gesehen, dass Sie über Backup gelesen haben“ begrüßt. Neckar nutzte mehr, als der Besucher gab, und es fühlt sich an, als würde eine Verkäuferin mit Notizen folgen.`),
      look: tt("the dashed frame on the first card", "der gestrichelte Rahmen um die erste Karte"),
      apply: () => {
        setVRaw("anon");
        setDRaw("much");
      },
    },
    {
      title: tt("The point", "Das Wichtigste"),
      say: tt(`Personalisation helps when it uses what the visitor gave and fits the moment; it hurts when it shows that the visitor was watched. Try the buttons.`, `Personalisierung hilft, wenn sie nutzt, was der Besucher gab, und zum Moment passt; sie schadet, wenn sie zeigt, dass der Besucher beobachtet wurde. Probieren Sie die Schaltflächen.`),
      look: tt("the logged-in customer's card", "die Karte des angemeldeten Kunden"),
      apply: () => {
        setVRaw("customer");
        setDRaw("fit");
      },
    },
  ]);
  const setV = (v: Visitor) => {
    story.leave();
    setVRaw(v);
  };
  const setD = (v: Depth) => {
    story.leave();
    setDRaw(v);
  };
  const [open, setOpen] = useState<string[]>([]);
  return (
    <div className="space-y-3">
      <ThePoint>{tt("A page can change what a visitor sees from what the visitor gave: the ad they clicked, the account they logged into. That is felt as help. Using more than they gave, or asking before showing anything, is felt as intrusion.", "Eine Seite kann ändern, was ein Besucher sieht, aus dem, was der Besucher gab: die geklickte Anzeige, das Konto, in das er sich einloggte. Das wird als Hilfe empfunden. Mehr zu nutzen, als er gab, oder zu fragen, bevor etwas gezeigt wird, wird als Aufdringlichkeit empfunden.")}</ThePoint>
      <Story steps={story.plan} step={story.step} onStep={story.go} />
      <div className="grid gap-2 sm:grid-cols-3" role="img" aria-label={tt("What the page shows each kind of visitor", "Was die Seite jeder Art von Besucher zeigt")}>
        {VISITORS.map((x) => (
          <div key={x} className={`rounded-md border px-3 py-2 text-caption ${x === v ? "border-accent bg-accentSoft" : "border-line bg-paper"} ${d === "much" && x === v ? "border-dashed" : ""} ${story.step !== null && x === v ? "outline outline-2 -outline-offset-2 outline-dashed outline-[#8A5A0B] anim-pulse" : ""}`}>
            <p className="smallcaps">{V_LABEL[x]}</p>
            <p className="mt-1 text-ink">{SHOWN[x][d]}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Toggles<Visitor> label={tt("Visitor", "Besucher")} value={v} onChange={setV} options={VISITORS.map((x) => ({ id: x, label: V_LABEL[x] }))} />
        <Toggles<Depth> label={tt("Personalisation", "Personalisierung")} value={d} onChange={setD} options={DEPTHS.map((x) => ({ id: x, label: D_LABEL[x] }))} />
      </div>
      <Insight>{plain()}{`${V_LABEL[v]} · ${D_LABEL[d]}: ${READ[d]}`}</Insight>
      <div className="space-y-1.5">
        <p className="smallcaps">{tt("A worked sort: three ideas at Neckar Hosting", "Eine Beispielsortierung: drei Ideen bei Neckar Hosting")}</p>
        <ul className="space-y-1.5">
          {M_IDEAS.map((x) => {
            const on = open.includes(x.id);
            return (
              <li key={x.id} className="rounded-md border border-line bg-paper px-3 py-2 text-caption">
                <p className="text-ink">{x.text}</p>
                <button type="button" aria-expanded={on} onClick={() => setOpen((o) => (on ? o.filter((y) => y !== x.id) : [...o, x.id]))} className="btn-ghost btn-sm mt-1">
                  {on ? tt("Hide", "Verbergen") : tt("Show the lever and why", "Hebel und Grund zeigen")}
                </button>
                {on && (
                  <p className="mt-1 text-ink">
                    <strong>{LEVEL_LABEL[x.tag]}.</strong> {x.why}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <p className="text-caption text-ash">{tt("Illustration on Neckar Hosting (Case assumption). A dashed frame marks personalisation that goes too far.", "Illustration mit Neckar Hosting (Fallannahme). Ein gestrichelter Rahmen markiert Personalisierung, die zu weit geht.")}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ A3 · where to respond at once, where to personalise */

type Verdict = "respond" | "personal" | "neither";
type NPage = { id: string; name: string; leave: number; decision: boolean; known: 0 | 1 | 2; verdict: Verdict; why: string };
const N_PAGES: NPage[] = bi([
  { id: "n1", name: t("Order page for servers", "Bestellseite für Server"), leave: 64, decision: true, known: 0 as const, verdict: "respond" as Verdict, why: t("A decision page and 64% leave: a question left open here loses the order. Respond at once.", "Eine Entscheidungsseite, und 64 % gehen: Eine offene Frage kostet hier die Bestellung. Sofort reagieren.") },
  { id: "n2", name: t("Contact form", "Kontaktformular"), leave: 52, decision: true, known: 0 as const, verdict: "respond" as Verdict, why: t("The last step before a request, and half abandon it: offer help or a callback at once.", "Der letzte Schritt vor einer Anfrage, und die Hälfte bricht ab: sofort Hilfe oder einen Rückruf anbieten.") },
  { id: "n3", name: t("Law-firm landing page", "Kanzlei-Landingpage"), leave: 55, decision: false, known: 1 as const, verdict: "personal" as Verdict, why: t("We know why they came (the campaign): show law-firm content first. Personalise.", "Wir wissen, warum sie kamen (die Kampagne): zuerst Kanzlei-Inhalte zeigen. Personalisieren.") },
  { id: "n4", name: t("Customer login area", "Kundenbereich"), leave: 15, decision: false, known: 2 as const, verdict: "personal" as Verdict, why: t("We know who logged in: show their servers, their renewal, their next add-on. Personalise.", "Wir wissen, wer sich angemeldet hat: ihre Server, ihre Verlängerung, ihr nächstes Add-on zeigen. Personalisieren.") },
  { id: "n5", name: t("Tech blog", "Tech-Blog"), leave: 85, decision: false, known: 0 as const, verdict: "neither" as Verdict, why: t("85% leave, which is normal for readers who found their answer; nobody decides here.", "85 % gehen, was für Leser normal ist, die ihre Antwort gefunden haben; hier entscheidet niemand.") },
  { id: "n6", name: t("Price comparison table", "Preisvergleichstabelle"), leave: 30, decision: true, known: 0 as const, verdict: "neither" as Verdict, why: t("A decision page, but only 30% leave: visitors compare and move on. Not the first place to act.", "Eine Entscheidungsseite, aber nur 30 % gehen: Besucher vergleichen und gehen weiter. Nicht der erste Ort zum Handeln.") },
]);
const VERDICT_LABEL = bi({ respond: t("Respond at once (chat, callback)", "Sofort reagieren (Chat, Rückruf)"), personal: t("Personalise the moment", "Den Moment personalisieren"), neither: t("Neither comes first", "Keines kommt zuerst") });
const VERDICT_GLYPH: Record<Verdict, string> = { respond: "●", personal: "◐", neither: "○" };

export function AutomationGrid() {
  const uid = useId().replace(/:/g, "");
  const [sel, setSelRaw] = useState<string>("n1");
  const story = useStory([
    {
      title: tt("Respond at once", "Sofort reagieren"),
      say: tt(`Neckar Hosting is an example company, not your case. Its server order page is a decision page and ${N_PAGES[0].leave}% of visitors leave from it. A question left open here loses the order: answer at once.`, `Neckar Hosting ist ein Beispielunternehmen, nicht Ihr Fall. Seine Bestellseite für Server ist eine Entscheidungsseite, und ${N_PAGES[0].leave} % der Besucher gehen von ihr. Eine offene Frage kostet hier die Bestellung: sofort antworten.`),
      look: tt("square 1, in the hatched area at the bottom right", "Quadrat 1, im schraffierten Bereich unten rechts"),
      apply: () => {
        setSelRaw("n1");
      },
    },
    {
      title: tt("Personalise", "Personalisieren"),
      say: tt(`In the customer area Neckar knows exactly who logged in. Only ${N_PAGES[3].leave}% leave, so speed is not the issue; showing their servers and renewal is the chance.`, `Im Kundenbereich weiß Neckar genau, wer sich angemeldet hat. Nur ${N_PAGES[3].leave} % gehen, also ist Tempo nicht das Problem; die Chance ist, ihre Server und ihre Verlängerung zu zeigen.`),
      look: tt("circle 4, in the top row: we know the visitor", "Kreis 4, in der oberen Reihe: Wir kennen den Besucher"),
      apply: () => {
        setSelRaw("n4");
      },
    },
    {
      title: tt("The point", "Das Wichtigste"),
      say: tt(`The tech blog loses ${N_PAGES[4].leave}% of visitors, which is normal: nobody decides there. Neither lever comes first. Squares are decision pages; try the dots.`, `Der Tech-Blog verliert ${N_PAGES[4].leave} % der Besucher, was normal ist: Dort entscheidet niemand. Keiner der beiden Hebel kommt zuerst. Quadrate sind Entscheidungsseiten; probieren Sie die Punkte.`),
      look: tt("circle 5, in the grey area", "Kreis 5, im grauen Bereich"),
      apply: () => {
        setSelRaw("n5");
      },
    },
  ]);
  const setSel = (v: string) => {
    story.leave();
    setSelRaw(v);
  };
  const s = N_PAGES.find((x) => x.id === sel)!;
  const X = (l: number) => 60 + (l / 100) * 440;
  const Y = (k: number) => 250 - k * 85;
  return (
    <div className="space-y-3">
      <ThePoint>{tt("Respond at once where a decision happens and many visitors leave. Personalise where you know who the visitor is or why they came. Where neither is true, fix the page first.", "Reagieren Sie sofort, wo eine Entscheidung fällt und viele Besucher gehen. Personalisieren Sie, wo Sie wissen, wer der Besucher ist oder warum er kam. Wo beides nicht zutrifft, verbessern Sie zuerst die Seite.")}</ThePoint>
      <Story steps={story.plan} step={story.step} onStep={story.go} />
      <svg viewBox="0 0 560 300" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{tt("Neckar Hosting's pages by the share who leave and what Neckar knows about the visitor", "Seiten von Neckar Hosting nach dem Anteil, der geht, und dem, was Neckar über den Besucher weiß")}</title>
        <desc id={`${uid}-d`}>{`${s.name}: ${VERDICT_LABEL[s.verdict]}.`}</desc>
        <defs>
          <pattern id={`${uid}-hatch`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="8" stroke={C.gold} strokeWidth="2" opacity="0.5" />
          </pattern>
        </defs>
        <rect x={X(0)} y="30" width={X(100) - X(0)} height="175" fill={C.tealSoft} opacity="0.7" />
        <rect x={X(50)} y="205" width={X(100) - X(50)} height="80" fill={`url(#${uid}-hatch)`} stroke={C.amber} />
        <rect x={X(0)} y="205" width={X(50) - X(0)} height="80" fill={C.mist} />
        <text x={X(75)} y="222" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={C.amber}>{tt("decision page + 50% leave: respond", "Entscheidungsseite + 50 % gehen: reagieren")}</text>
        <text x={X(50)} y="46" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={C.teal}>{tt("we know the visitor: personalise", "wir kennen den Besucher: personalisieren")}</text>
        <line x1={X(50)} y1="205" x2={X(50)} y2="285" stroke={C.ash} strokeDasharray="4 3" />
        {[0, 25, 50, 75, 100].map((l) => (
          <text key={l} x={X(l)} y="298" textAnchor="middle" fontSize="11" fill={C.ash}>{pct(l)}</text>
        ))}
        {[tt("nothing", "nichts"), tt("campaign", "Kampagne"), tt("customer", "Kunde")].map((l, k) => (
          <text key={k} x="54" y={Y(k) + 4} textAnchor="end" fontSize="11" fill={C.ash}>{l}</text>
        ))}
        <text x="4" y="20" fontSize="11" fill={C.ash}>{tt("what we know", "was wir wissen")}</text>
        {N_PAGES.map((x, i) => {
          const on = x.id === sel;
          const cx = X(x.leave);
          const cy = Y(x.known) + (x.known === 0 ? 10 : 0);
          return (
            <g key={x.id} className="hit" role="button" tabIndex={0} aria-label={x.name} onClick={() => setSel(x.id)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSel(x.id)}>
              {on && story.step !== null && <circle cx={cx} cy={cy} r="21" fill="none" stroke={C.amber} strokeWidth="2" strokeDasharray="5 4" className="anim-pulse" />}
              {x.decision ? <rect className="hit-shape" x={cx - (on ? 14 : 11)} y={cy - (on ? 14 : 11)} width={on ? 28 : 22} height={on ? 28 : 22} rx="3" fill={on ? C.gold : C.data} stroke={C.ink} strokeWidth="1.4" /> : <circle className="hit-shape" cx={cx} cy={cy} r={on ? 14 : 11} fill={on ? C.gold : C.data} stroke={C.ink} strokeWidth="1.4" />}
              <text x={cx} y={cy + 4} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={on ? C.ink : C.paper}>{i + 1}</text>
            </g>
          );
        })}
      </svg>
      <div role="group" aria-label={tt("Pages", "Seiten")} className="flex flex-wrap gap-2">
        {N_PAGES.map((x, i) => (
          <button key={x.id} type="button" aria-pressed={x.id === sel} onClick={() => setSel(x.id)} className={`btn btn-sm min-h-[40px] border ${x.id === sel ? "border-accent bg-accentSoft text-ink" : "border-line bg-paper text-ash hover:border-ash"}`}>
            {`${i + 1} · ${x.name}`}
          </button>
        ))}
      </div>
      <Insight>{plain()}{`${s.name} · ${tt(`${s.leave}% leave`, `${s.leave} % gehen`)} · ${s.decision ? tt("decision page", "Entscheidungsseite") : tt("no decision here", "keine Entscheidung hier")} · ${VERDICT_GLYPH[s.verdict]} ${VERDICT_LABEL[s.verdict]}. ${s.why}`}</Insight>
      <p className="text-caption text-ash">{tt("Illustration on Neckar Hosting (Case assumption). Squares are decision pages, circles are not. Hatched = respond at once; teal = personalise; grey = neither comes first.", "Illustration mit Neckar Hosting (Fallannahme). Quadrate sind Entscheidungsseiten, Kreise nicht. Schraffiert = sofort reagieren; teal = personalisieren; grau = keines kommt zuerst.")}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ A4 · what speed is worth (Neckar Hosting) */

export function PilotExample() {
  const uid = useId().replace(/:/g, "");
  const [yearly, setYearlyRaw] = useState(MOSEL.yearly);
  const story = useStory([
    {
      title: tt("Two groups, two rates", "Zwei Gruppen, zwei Quoten"),
      say: tt(`Neckar Hosting is an example company, not your case. Requests answered within one hour closed at ${pct(MOSEL_RESULT.rate, 1)}, against ${pct(MOSEL_RESULT.other, 1)} after more than a day: ${num(MOSEL_RESULT.lift)} times as often.`, `Neckar Hosting ist ein Beispielunternehmen, nicht Ihr Fall. Innerhalb einer Stunde beantwortete Anfragen schlossen zu ${pct(MOSEL_RESULT.rate, 1)} ab, gegenüber ${pct(MOSEL_RESULT.other, 1)} nach mehr als einem Tag: ${num(MOSEL_RESULT.lift)}-mal so oft.`),
      look: tt("the two bars and the amber line under them", "die zwei Balken und die bernsteinfarbene Zeile darunter"),
      apply: () => {
        setYearlyRaw(MOSEL.yearly);
      },
    },
    {
      title: tt("Only the difference is extra", "Nur der Unterschied ist zusätzlich"),
      say: tt(`Slow answers would have closed ${pct(MOSEL_RESULT.other, 1)} anyway. On ${num(MOSEL.yearly * 2)} requests a year the difference is worth about ${euro(extraOf(MOSEL.yearly * 2, MOSEL_RESULT.rate, MOSEL_RESULT.other, MOSEL.order))}. The app does the arithmetic.`, `Langsame Antworten hätten ohnehin ${pct(MOSEL_RESULT.other, 1)} abgeschlossen. Bei ${num(MOSEL.yearly * 2)} Anfragen pro Jahr ist der Unterschied etwa ${euro(extraOf(MOSEL.yearly * 2, MOSEL_RESULT.rate, MOSEL_RESULT.other, MOSEL.order))} wert. Die Rechnung übernimmt die App.`),
      look: tt("the slider at double the requests, and the sum in “What this shows”", "der Regler bei doppelt so vielen Anfragen und die Rechnung in „Was das zeigt“"),
      apply: () => {
        setYearlyRaw(MOSEL.yearly * 2);
      },
    },
    {
      title: tt("The point", "Das Wichtigste"),
      say: tt(`Two closing rates side by side turn “fast answers seem better” into a figure. But if sales picked which requests to answer fast, the gap may overstate speed: promising, not proven.`, `Zwei Abschlussquoten nebeneinander machen aus „schnelle Antworten scheinen besser“ eine Zahl. Hat der Vertrieb aber gewählt, welche Anfragen er schnell beantwortet, kann der Abstand das Tempo überschätzen: vielversprechend, nicht bewiesen.`),
      look: tt("the orders printed behind each bar", "die Abschlüsse, die hinter jedem Balken stehen"),
      apply: () => {
        setYearlyRaw(MOSEL.yearly);
      },
    },
  ]);
  const setYearly = (v: number) => {
    story.leave();
    setYearlyRaw(v);
  };
  const r = MOSEL_RESULT;
  const extra = extraOf(yearly, r.rate, r.other, MOSEL.order);
  const W = (p: number) => (p / 25) * 300;
  return (
    <div className="space-y-3">
      <ThePoint>{tt("A comparison gives two closing rates, one per group. Their ratio says how many times better the fast answers did, and the difference, over a year of requests, says what it is worth. A comparison that sales chose is promising, not proof.", "Ein Vergleich gibt zwei Abschlussquoten, eine pro Gruppe. Ihr Verhältnis sagt, wie viel Mal besser die schnellen Antworten abschnitten, und der Unterschied, über ein Jahr Anfragen, sagt, was er wert ist. Ein Vergleich, den der Vertrieb gewählt hat, ist vielversprechend, kein Beweis.")}</ThePoint>
      <Story steps={story.plan} step={story.step} onStep={story.go} />
      <svg viewBox="0 0 560 150" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{tt("Neckar Hosting: requests answered within one hour against after more than a day", "Neckar Hosting: innerhalb einer Stunde gegen nach mehr als einem Tag beantwortete Anfragen")}</title>
        <desc id={`${uid}-d`}>{tt(`Fast ${r.rate}%, slow ${r.other}%, lift ${r.lift}.`, `Schnell ${r.rate} %, langsam ${r.other} %, Lift ${r.lift}.`)}</desc>
        {story.step !== null && <rect x="164" y="14" width="396" height="88" rx="8" fill="none" stroke={C.amber} strokeWidth="2" strokeDasharray="5 4" className="anim-pulse" />}
        <text x="0" y="36" fontSize="12" fill={C.ink}>{tt("Within one hour", "Innerhalb einer Stunde")}</text>
        <rect x="170" y="20" width={W(r.rate)} height="26" fill={C.data} stroke={C.ink} />
        <text x={176 + W(r.rate)} y="38" fontSize="12.5" fontWeight="700" fill={C.ink}>{`${pct(r.rate)} (${MOSEL.variant.orders} ${tt("of", "von")} ${num(MOSEL.variant.sent)})`}</text>
        <text x="0" y="86" fontSize="12" fill={C.ink}>{tt("After more than a day", "Nach mehr als einem Tag")}</text>
        <rect x="170" y="70" width={W(r.other)} height="26" fill={C.grey} stroke={C.ink} />
        <text x={176 + W(r.other)} y="88" fontSize="12.5" fontWeight="700" fill={C.ink}>{`${pct(r.other)} (${MOSEL.control.orders} ${tt("of", "von")} ${num(MOSEL.control.sent)})`}</text>
        <text x="170" y="128" fontSize="13" fontWeight="700" fill={C.amber}>{tt(`Lift = ${r.rate} ÷ ${r.other} = ${num(r.lift)} times as often`, `Lift = ${num(r.rate)} ÷ ${num(r.other)} = ${num(r.lift)}-mal so oft`)}</text>
      </svg>
      <div className="space-y-1.5">
        <label htmlFor={`${uid}-y`} className="smallcaps block">
          {tt(`Neckar's quote requests a year: ${num(yearly)}`, `Angebotsanfragen von Neckar pro Jahr: ${num(yearly)}`)}
        </label>
        <input id={`${uid}-y`} type="range" min={200} max={3000} step={100} value={yearly} onChange={(e) => setYearly(Number(e.target.value))} className="w-full max-w-md accent-[#8A5A0B]" />
      </div>
      <Insight>{plain()}
        {tt(
          `${num(yearly)} requests × (${pct(r.rate)} − ${pct(r.other)}) × ${euro(MOSEL.order)} = ${euro(extra)} extra a year if every request were answered within an hour. Only the difference counts: slow answers would have closed ${pct(r.other)} anyway. ${yearly === MOSEL.yearly ? "At 1,000 requests the example gives €100,000." : `More requests use the same lift more often: ${yearly > MOSEL.yearly ? "more" : "less"} extra revenue.`}`,
          `${num(yearly)} Anfragen × (${pct(r.rate)} − ${pct(r.other)}) × ${euro(MOSEL.order)} = ${euro(extra)} zusätzlich pro Jahr, wenn jede Anfrage innerhalb einer Stunde beantwortet würde. Nur der Unterschied zählt: Langsame Antworten hätten ohnehin ${pct(r.other)} abgeschlossen. ${yearly === MOSEL.yearly ? "Bei 1.000 Anfragen ergibt das Beispiel 100.000 €." : `Mehr Anfragen nutzen denselben Lift öfter: ${yearly > MOSEL.yearly ? "mehr" : "weniger"} zusätzlicher Umsatz.`}`,
        )}
      </Insight>
    </div>
  );
}

/* ------------------------------------------------------------------ A5 · a real-time KPI tree (Neckar Hosting) */

type MMetric = { id: string; name: string; kind: PatternId; moved: boolean; why: string };
const M_METRICS: MMetric[] = bi([
  { id: "rev", name: t("Revenue from online requests", "Umsatz aus Online-Anfragen"), kind: "outcome" as PatternId, moved: true, why: t("Money: the result Neckar is paid for. It moves last.", "Geld: das Ergebnis, für das Neckar bezahlt wird. Es bewegt sich zuletzt.") },
  { id: "renew", name: t("Renewal rate", "Verlängerungsrate"), kind: "outcome" as PatternId, moved: true, why: t("Customers kept: a result.", "Gehaltene Kunden: ein Ergebnis.") },
  { id: "resp", name: t("First response time", "Erste Antwortzeit"), kind: "driver" as PatternId, moved: true, why: t("It comes before the deal and the team can move it this week.", "Sie kommt vor dem Abschluss, und das Team kann sie diese Woche bewegen.") },
  { id: "dwell", name: t("Time on the order page", "Zeit auf der Bestellseite"), kind: "driver" as PatternId, moved: false, why: t("A visitor behaviour before the order; it did not move with value last year, which is a finding, not another kind.", "Ein Besucherverhalten vor der Bestellung; es bewegte sich letztes Jahr nicht mit dem Wert, das ist ein Befund, keine andere Art.") },
  { id: "unhelp", name: t("Chats rated “not helpful”", "Als „nicht hilfreich“ bewertete Chats"), kind: "guardrail" as PatternId, moved: true, why: t("It must not rise while Neckar answers faster.", "Sie dürfen nicht steigen, während Neckar schneller antwortet.") },
  { id: "visits", name: t("Website visitors", "Website-Besucher"), kind: "vanity" as PatternId, moved: false, why: t("Reach: it counts who passed by, not who acted.", "Reichweite: Es zählt, wer vorbeikam, nicht wer handelte.") },
]);
const KIND_POS: Record<PatternId, { x: number; y: number }> = { outcome: { x: 150, y: 30 }, driver: { x: 150, y: 150 }, guardrail: { x: 420, y: 90 }, vanity: { x: 420, y: 230 } };
const KIND_DE: Record<PatternId, string> = { outcome: "ein Outcome-KPI", driver: "ein Treiber-KPI", guardrail: "eine Guardrail", vanity: "eine Vanity Metric" };

export function KpiTree() {
  const uid = useId().replace(/:/g, "");
  const [sel, setSelRaw] = useState("resp");
  const [past, setPastRaw] = useState(false);
  const story = useStory([
    {
      title: tt("A driver you can steer by", "Ein Treiber, nach dem Sie steuern"),
      say: tt(`Neckar Hosting is an example company, not your case. First response time comes before the deal, the team can move it this week, and it moved with value last year: a driver.`, `Neckar Hosting ist ein Beispielunternehmen, nicht Ihr Fall. Die erste Antwortzeit kommt vor dem Abschluss, das Team kann sie diese Woche bewegen, und sie bewegte sich letztes Jahr mit dem Wert: ein Treiber.`),
      look: tt("the box under the top, and “moved with value”", "der Kasten unter der Spitze und „mit dem Wert bewegt“"),
      apply: () => {
        setSelRaw("resp");
        setPastRaw(true);
      },
    },
    {
      title: tt("A number that flatters", "Eine Zahl, die schmeichelt"),
      say: tt(`Website visitors counts who passed by, not who acted. It did not move with value. It looks like progress and decides nothing: a vanity metric, a number that only flatters.`, `Website-Besucher zählt, wer vorbeikam, nicht wer handelte. Es bewegte sich nicht mit dem Wert. Es sieht nach Fortschritt aus und entscheidet nichts: eine Vanity Metric, eine Zahl, die nur schmeichelt.`),
      look: tt("the grey box outside the tree", "der graue Kasten außerhalb des Baums"),
      apply: () => {
        setSelRaw("visits");
        setPastRaw(true);
      },
    },
    {
      title: tt("The point", "Das Wichtigste"),
      say: tt(`Steer by the result and the behaviours that lead to it, watch a limit such as chats rated not helpful, and stop reporting numbers that only count reach. Choose any metric.`, `Steuern Sie nach dem Ergebnis und den Verhalten, die dorthin führen, beobachten Sie eine Grenze wie als nicht hilfreich bewertete Chats, und hören Sie auf, Zahlen zu berichten, die nur Reichweite zählen. Wählen Sie eine beliebige Kennzahl.`),
      look: tt("the dashed amber frame: the guardrail", "der gestrichelte bernsteinfarbene Rahmen: die Guardrail"),
      apply: () => {
        setSelRaw("unhelp");
        setPastRaw(true);
      },
    },
  ]);
  const setSel = (v: string) => {
    story.leave();
    setSelRaw(v);
  };
  const setPast = (v: boolean | ((v: boolean) => boolean)) => {
    story.leave();
    setPastRaw(v);
  };
  const m = M_METRICS.find((x) => x.id === sel)!;
  const boxes = M_METRICS.map((x) => {
    const same = M_METRICS.filter((y) => y.kind === x.kind);
    const k = same.indexOf(x);
    const base = KIND_POS[x.kind];
    const w = same.length > 1 ? 130 : 140;
    return { x, bx: base.x - (same.length > 1 ? 140 : 70) + k * 150, by: base.y, w };
  });
  return (
    <div className="space-y-3">
      <ThePoint>{tt("Not every number is a KPI. The result sits at the top, the behaviours that lead to it below, a limit that must not get worse beside it; numbers that only count reach do not belong in the picture.", "Nicht jede Zahl ist ein KPI. Das Ergebnis steht oben, die Verhalten, die dorthin führen, darunter, eine Grenze, die nicht schlechter werden darf, daneben; Zahlen, die nur Reichweite zählen, gehören nicht ins Bild.")}</ThePoint>
      <Story steps={story.plan} step={story.step} onStep={story.go} />
      <svg viewBox="0 0 560 300" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{tt("Neckar Hosting's real-time metrics as a KPI tree", "Die Echtzeit-Kennzahlen von Neckar Hosting als KPI-Baum")}</title>
        <desc id={`${uid}-d`}>{`${m.name}: ${PATTERNS[m.kind].label}.`}</desc>
        <line x1="75" y1="78" x2="75" y2="150" stroke={C.ink} strokeWidth="1.6" />
        <line x1="225" y1="78" x2="225" y2="150" stroke={C.ink} strokeWidth="1.6" />
        <line x1="75" y1="114" x2="225" y2="114" stroke={C.ink} strokeWidth="1.6" />
        <rect x="340" y="80" width="190" height="72" rx="6" fill="none" stroke={C.amber} strokeDasharray="6 4" />
        <rect x="340" y="222" width="190" height="66" rx="6" fill="none" stroke={C.grey} strokeDasharray="3 4" />
        <text x="435" y="76" textAnchor="middle" fontSize="10.5" fill={C.amber}>{tt("guardrail: must not get worse", "Guardrail: darf nicht schlechter werden")}</text>
        <text x="435" y="218" textAnchor="middle" fontSize="10.5" fill={C.ash}>{tt("outside the tree: decides nothing", "außerhalb des Baums: entscheidet nichts")}</text>
        {boxes.map(({ x, bx, by, w }) => {
          const on = x.id === sel;
          return (
            <g key={x.id} className="hit" role="button" tabIndex={0} aria-label={x.name} onClick={() => setSel(x.id)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSel(x.id)}>
              {on && story.step !== null && <rect x={bx - 5} y={by - 5} width={w + 10} height="58" rx="9" fill="none" stroke={C.amber} strokeWidth="2" strokeDasharray="5 4" className="anim-pulse" />}
              <rect className="hit-shape" x={bx} y={by} width={w} height="48" rx="6" fill={on ? C.soft : x.kind === "vanity" ? C.mist : C.paper} stroke={on ? C.amber : C.ink} strokeWidth={on ? 2.4 : 1.2} />
              <foreignObject x={bx + 4} y={by + 4} width={w - 8} height="40">
                <div style={{ fontSize: 11.5, lineHeight: 1.2, color: C.ink, textAlign: "center", fontFamily: "system-ui,sans-serif" }}>{x.name}</div>
              </foreignObject>
              {past && (
                <text x={bx + w - 6} y={by + 60} textAnchor="end" fontSize="10.5" fontWeight="700" fill={x.moved ? C.teal : C.ash}>{x.moved ? tt("● moved with value", "● mit dem Wert bewegt") : tt("○ did not move", "○ nicht bewegt")}</text>
              )}
            </g>
          );
        })}
        <text x="8" y="22" fontSize="10.5" fill={C.ash}>{tt("outcome", "Outcome")}</text>
        <text x="8" y="142" fontSize="10.5" fill={C.ash}>{tt("drivers", "Treiber")}</text>
      </svg>
      <div className="flex flex-wrap items-center gap-3">
        <Toggles<string> label={tt("Metric", "Kennzahl")} value={sel} onChange={setSel} options={M_METRICS.map((x) => ({ id: x.id, label: x.name }))} />
        <Toggles<string> label={tt("Last year", "Letztes Jahr")} value={past ? "on" : null} onChange={() => setPast((v) => !v)} options={[{ id: "on", label: past ? tt("Hide last year", "Letztes Jahr verbergen") : tt("Show whether it moved with value last year", "Zeigen, ob es sich letztes Jahr mit dem Wert bewegte") }]} />
      </div>
      <Insight>{plain()}
        {past
          ? tt(
              `${m.name} → ${PATTERNS[m.kind].label}. ${m.why} Last year it ${m.moved ? "moved" : "did not move"} with customer value. Both outcomes moved, one of two drivers, the guardrail moved, the vanity metric did not: the closer to the top of the tree, the stronger the link.`,
              `${m.name} ist ${KIND_DE[m.kind]}: ${m.why} Letztes Jahr ${m.moved ? "bewegte es sich" : "bewegte es sich nicht"} mit dem Kundenwert. Beide Outcomes bewegten sich, einer von zwei Treibern, die Guardrail bewegte sich, die Vanity Metric nicht: Je näher an der Spitze des Baums, desto stärker die Verbindung.`,
            )
          : tt(`${m.name} → ${PATTERNS[m.kind].label}. ${m.why} Switch on “last year” to see which kinds move with customer value.`, `${m.name} ist ${KIND_DE[m.kind]}. ${m.why} Schalten Sie „letztes Jahr“ ein, um zu sehen, welche Arten sich mit dem Kundenwert bewegen.`)}
      </Insight>
    </div>
  );
}

/* ------------------------------------------------------------------ A6 · a fair A/B test in a digital channel */

type Flaw = "none" | "two" | "time" | "peek";
const FLAWS = bi({
  none: { label: t("Fair test", "Fairer Test"), a: t("Order page without chat · random half · weeks 1–3", "Bestellseite ohne Chat · zufällige Hälfte · Wochen 1–3"), b: t("Order page with chat · other half · weeks 1–3", "Bestellseite mit Chat · andere Hälfte · Wochen 1–3"), reading: t("One change, a random split, the same weeks, a size fixed in advance: a difference between the groups can be put down to the chat.", "Eine Änderung, eine zufällige Aufteilung, dieselben Wochen, eine vorab festgelegte Größe: Ein Unterschied zwischen den Gruppen lässt sich dem Chat zuschreiben.") },
  two: { label: t("Two changes at once", "Zwei Änderungen auf einmal"), a: t("Old order page · random half", "Alte Bestellseite · zufällige Hälfte"), b: t("Chat, new prices and a new layout · other half", "Chat, neue Preise und neues Layout · andere Hälfte"), reading: t("The variant differs in three things. If it wins, nobody can say whether the chat, the prices or the layout did it.", "Die Variante unterscheidet sich in drei Dingen. Gewinnt sie, kann niemand sagen, ob der Chat, die Preise oder das Layout es waren.") },
  time: { label: t("Compared with last month", "Mit dem Vormonat verglichen"), a: t("Order page without chat · all visitors · March", "Bestellseite ohne Chat · alle Besucher · März"), b: t("Order page with chat · all visitors · April", "Bestellseite mit Chat · alle Besucher · April"), reading: t("The groups are different months. A campaign, a holiday or a competitor's outage in April can explain the difference.", "Die Gruppen sind verschiedene Monate. Eine Kampagne, ein Feiertag oder ein Ausfall bei einem Wettbewerber im April können den Unterschied erklären.") },
  peek: { label: t("Stopped when ahead on the live screen", "Gestoppt, sobald live vorn"), a: t("Without chat · random half · stopped on day 2", "Ohne Chat · zufällige Hälfte · an Tag 2 gestoppt"), b: t("With chat · other half · stopped on day 2", "Mit Chat · andere Hälfte · an Tag 2 gestoppt"), reading: t("A live number swings with every visit. Stopping at the first lead picks a lucky moment; real-time data makes this temptation stronger, not weaker.", "Eine Live-Zahl schwankt mit jedem Besuch. Beim ersten Vorsprung zu stoppen, wählt einen glücklichen Moment; Echtzeitdaten machen diese Versuchung stärker, nicht schwächer.") },
});
const FLAW_IDS: Flaw[] = ["none", "two", "time", "peek"];
const rangeOf = (ctl: number, ratio: number) => {
  const se = Math.sqrt(1 / (ctl * ratio) + 1 / ctl);
  const r2 = (x: number) => Math.round(x * 100) / 100;
  return { lo: r2(Math.exp(Math.log(ratio) - 1.96 * se)), hi: r2(Math.exp(Math.log(ratio) + 1.96 * se)) };
};

export function FairTest() {
  const uid = useId().replace(/:/g, "");
  const [flaw, setFlawRaw] = useState<Flaw>("none");
  const [conv, setConvRaw] = useState(30);
  const story = useStory([
    {
      title: tt("A fair test", "Ein fairer Test"),
      say: tt(`Neckar Hosting is an example company, not your case. A fair test is like a race: same track, same start, one runner changed. Neckar adds the chat for a random half of visitors, in the same weeks.`, `Neckar Hosting ist ein Beispielunternehmen, nicht Ihr Fall. Ein fairer Test ist wie ein Rennen: dieselbe Bahn, derselbe Start, ein Läufer ausgetauscht. Neckar fügt den Chat für eine zufällige Hälfte der Besucher hinzu, in denselben Wochen.`),
      look: tt("Group A and Group B: only the chat differs", "Gruppe A und Gruppe B: Nur der Chat unterscheidet sich"),
      apply: () => {
        setFlawRaw("none");
        setConvRaw(30);
      },
    },
    {
      title: tt("An unfair test", "Ein unfairer Test"),
      say: tt(`Now the variant gets the chat, new prices and a new layout together. If it wins, nobody knows which of the three did it.`, `Jetzt bekommt die Variante den Chat, neue Preise und ein neues Layout zugleich. Gewinnt sie, weiß niemand, was von den dreien es war.`),
      look: tt("the dashed amber Group B box", "der gestrichelte bernsteinfarbene Kasten von Gruppe B"),
      apply: () => {
        setFlawRaw("two");
        setConvRaw(30);
      },
    },
    {
      title: tt("The point", "Das Wichtigste"),
      say: tt(`Even a fair test says less than it seems on few results: with 30 conversions per group, the same 1.5× could be ${num(rangeOf(30, 1.5).lo)}×, which is no gain. Move the slider to 100.`, `Selbst ein fairer Test sagt bei wenigen Ergebnissen weniger, als es scheint: Mit 30 Conversions pro Gruppe könnte dasselbe 1,5× ${num(rangeOf(30, 1.5).lo)}× sein, also kein Gewinn. Bewegen Sie den Regler auf 100.`),
      look: tt("the hatched bar crossing the dashed 1× line", "der schraffierte Balken, der die gestrichelte 1×-Linie kreuzt"),
      apply: () => {
        setFlawRaw("none");
        setConvRaw(30);
      },
    },
  ]);
  const setFlaw = (v: Flaw) => {
    story.leave();
    setFlawRaw(v);
  };
  const setConv = (v: number) => {
    story.leave();
    setConvRaw(v);
  };
  const f = FLAWS[flaw];
  const ratio = 1.5;
  const { lo, hi } = rangeOf(conv, ratio);
  const X = (r: number) => 40 + ((r - 0.5) / 2.5) * 480;
  const zero = X(1);
  const proven = lo > 1;
  return (
    <div className="space-y-4">
      <ThePoint>{tt("A test is fair when only one thing differs, chance decides who is in which group, both groups run in the same weeks, and the size is fixed in advance. Even then, a small test tells you less than it seems.", "Ein Test ist fair, wenn sich nur eine Sache unterscheidet, der Zufall entscheidet, wer in welcher Gruppe ist, beide Gruppen in denselben Wochen laufen und die Größe vorab feststeht. Selbst dann sagt ein kleiner Test weniger, als es scheint.")}</ThePoint>
      <Story steps={story.plan} step={story.step} onStep={story.go} />
      <div className="space-y-2">
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-md border border-line bg-paper px-3 py-2 text-caption">
            <p className="smallcaps">{tt("Group A", "Gruppe A")}</p>
            <p className="text-ink">{f.a}</p>
          </div>
          <div className={`rounded-md border px-3 py-2 text-caption ${flaw === "none" ? "border-line bg-paper" : "border-dashed border-accent bg-accentSoft"} ${story.step === 1 ? "outline outline-2 -outline-offset-2 outline-dashed outline-[#8A5A0B] anim-pulse" : ""}`}>
            <p className="smallcaps">{tt("Group B", "Gruppe B")}</p>
            <p className="text-ink">{f.b}</p>
          </div>
        </div>
        <Toggles<Flaw> label={tt("How Neckar runs the test", "Wie Neckar den Test durchführt")} value={flaw} onChange={setFlaw} options={FLAW_IDS.map((k) => ({ id: k, label: FLAWS[k].label }))} />
        <Insight>{plain()}{f.reading}</Insight>
      </div>
      <div className="space-y-2">
        <svg viewBox="0 0 560 120" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
          <title id={`${uid}-t`}>{tt("How sure the test is: the range of uplifts the result is compatible with", "Wie sicher der Test ist: die Spanne der Uplifts, mit denen das Ergebnis vereinbar ist")}</title>
          <desc id={`${uid}-d`}>{tt(`With ${conv} requests in the group without chat, the uplift lies between ${num(lo)} and ${num(hi)} times.`, `Mit ${conv} Anfragen in der Gruppe ohne Chat liegt der Uplift zwischen dem ${num(lo)}- und dem ${num(hi)}-Fachen.`)}</desc>
          <line x1="40" y1="60" x2="520" y2="60" stroke={C.ash} />
          {[0.5, 1, 1.5, 2, 2.5, 3].map((v) => (
            <g key={v}>
              <line x1={X(v)} y1="55" x2={X(v)} y2="65" stroke={C.ash} />
              <text x={X(v)} y="84" textAnchor="middle" fontSize="11" fill={C.ash}>{`${num(v)}×`}</text>
            </g>
          ))}
          <line x1={zero} y1="20" x2={zero} y2="70" stroke={C.rust} strokeDasharray="4 3" />
          <text x={zero + 4} y="22" fontSize="10.5" fill={C.rust}>{tt("1× = no difference", "1× = kein Unterschied")}</text>
          <defs>
            <pattern id={`${uid}-h`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="8" stroke={C.gold} strokeWidth="2" />
            </pattern>
          </defs>
          {story.step === 2 && <rect x={X(Math.max(lo, 0.5)) - 4} y="42" width={Math.max(2, X(Math.min(hi, 3)) - X(Math.max(lo, 0.5))) + 8} height="36" rx="5" fill="none" stroke={C.amber} strokeWidth="2" strokeDasharray="5 4" className="anim-pulse" />}
          <rect x={X(Math.max(lo, 0.5))} y="48" width={Math.max(2, X(Math.min(hi, 3)) - X(Math.max(lo, 0.5)))} height="24" fill={proven ? C.tealSoft : `url(#${uid}-h)`} stroke={proven ? C.teal : C.amber} />
          <circle cx={X(ratio)} cy="60" r="6" fill={C.data} stroke={C.ink} />
          <text x="40" y="110" fontSize="11.5" fill={C.ink}>{tt(`measured: 1.5× · plausible range ${num(lo)}× to ${num(hi)}×`, `gemessen: 1,5× · plausible Spanne ${num(lo)}× bis ${num(hi)}×`)}</text>
        </svg>
        <label htmlFor={`${uid}-c`} className="smallcaps block">
          {tt(`Requests in the group without chat: ${conv} (the chat group has 1.5 times as many)`, `Anfragen in der Gruppe ohne Chat: ${conv} (die Chat-Gruppe hat 1,5-mal so viele)`)}
        </label>
        <input id={`${uid}-c`} type="range" min={10} max={300} step={10} value={conv} onChange={(e) => setConv(Number(e.target.value))} className="w-full max-w-md accent-[#8A5A0B]" />
        <Insight>{plain()}
          {proven
            ? tt(`With ${conv} requests per group, even the low end of the range (${num(lo)}×) is above “no difference”: the uplift is real, though its size is still uncertain (up to ${num(hi)}×). Around 100 per group is where a 1.5× result becomes solid.`, `Mit ${conv} Anfragen pro Gruppe liegt selbst das untere Ende der Spanne (${num(lo)}×) über „kein Unterschied“: Der Uplift ist echt, auch wenn seine Größe noch unsicher ist (bis ${num(hi)}×). Um 100 pro Gruppe wird ein Ergebnis von 1,5× belastbar.`)
            : tt(`With ${conv} requests per group, the same 1.5× could be anything from ${num(lo)}× to ${num(hi)}×, and the range still includes “no difference” (hatched). Promising, not proven: keep the test running, however good the live screen looks.`, `Mit ${conv} Anfragen pro Gruppe könnte dasselbe 1,5× alles zwischen ${num(lo)}× und ${num(hi)}× sein, und die Spanne schließt „kein Unterschied“ noch ein (schraffiert). Vielversprechend, nicht bewiesen: Lassen Sie den Test weiterlaufen, egal wie gut der Live-Bildschirm aussieht.`)}
        </Insight>
      </div>
      <p className="text-caption text-ash">{tt("Illustration on Neckar Hosting (Case assumption). The range is a standard approximation, shown so the effect of the sample size is visible; the task never asks you to compute it.", "Illustration mit Neckar Hosting (Fallannahme). Die Spanne ist eine übliche Näherung, gezeigt, damit die Wirkung der Stichprobengröße sichtbar wird; die Aufgabe verlangt nie, sie zu berechnen.")}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ A7 · scoring: Neckar's three measures */

type WM = { id: string; name: string; cost: number; weeks: number; fea: 1 | 2 | 3; eff: 1 | 2 | 3; note: string };
const M_MEASURES: WM[] = bi([
  { id: "chat", name: t("Live chat on the order page", "Live-Chat auf der Bestellseite"), cost: 20000, weeks: 3, fea: 3 as const, eff: 3 as const, note: t("It answers visitors where they decide, works within a month and serves every visitor once built.", "Er antwortet Besuchern dort, wo sie entscheiden, wirkt innerhalb eines Monats und dient jedem Besucher, einmal gebaut.") },
  { id: "founder", name: t("The founder calls every request back", "Der Gründer ruft jede Anfrage zurück"), cost: 5000, weeks: 1, fea: 1 as const, eff: 2 as const, note: t("Fast and personal, but it stops the day the founder is busy: it grows only with a person's time.", "Schnell und persönlich, aber es endet an dem Tag, an dem der Gründer beschäftigt ist: Es wächst nur mit Personenzeit.") },
  { id: "relaunch", name: t("Website relaunch", "Relaunch der Website"), cost: 90000, weeks: 16, fea: 3 as const, eff: 2 as const, note: t("It may help later, but sixteen weeks leave no time to work in a four-month plan.", "Er hilft vielleicht später, aber sechzehn Wochen lassen in einem Viermonatsplan keine Zeit zu wirken.") },
]);

export function ScoreExample() {
  const uid = useId().replace(/:/g, "");
  const [sel, setSelRaw] = useState("chat");
  const sc = (id: string) => {
    const x = M_MEASURES.find((y) => y.id === id)!;
    return x.eff * explainBucket(speedBand(x.weeks)) * x.fea;
  };
  const story = useStory([
    {
      title: tt("Strong on all three", "Stark in allen dreien"),
      say: tt(`Neckar Hosting is an example company, not your case. Live chat scores ${sc("chat")}: it answers visitors where they decide, works within ${M_MEASURES[0].weeks} weeks and serves every visitor once built.`, `Neckar Hosting ist ein Beispielunternehmen, nicht Ihr Fall. Der Live-Chat erzielt ${sc("chat")}: Er antwortet Besuchern dort, wo sie entscheiden, wirkt innerhalb von ${M_MEASURES[0].weeks} Wochen und dient jedem Besucher, einmal gebaut.`),
      look: tt("the longest bar", "der längste Balken"),
      apply: () => {
        setSelRaw("chat");
      },
    },
    {
      title: tt("One weak factor", "Ein schwacher Faktor"),
      say: tt(`The relaunch scores only ${sc("relaunch")}: it may help, but it needs ${M_MEASURES[2].weeks} weeks and the plan has four months. One weak factor, here speed, pulls the whole product down.`, `Der Relaunch erzielt nur ${sc("relaunch")}: Er hilft vielleicht, braucht aber ${M_MEASURES[2].weeks} Wochen, und der Plan hat vier Monate. Ein schwacher Faktor, hier das Tempo, zieht das ganze Produkt herunter.`),
      look: tt("the short bar, and its three parts in “What this shows”", "der kurze Balken und seine drei Teile in „Was das zeigt“"),
      apply: () => {
        setSelRaw("relaunch");
      },
    },
    {
      title: tt("The point", "Das Wichtigste"),
      say: tt(`Multiply effect, speed and scalability. Speed is read from the printed weeks, never guessed. Choose a measure to read its three parts.`, `Multiplizieren Sie Wirkung, Tempo und Skalierbarkeit. Das Tempo wird aus den gedruckten Wochen gelesen, nie geschätzt. Wählen Sie eine Maßnahme, um ihre drei Teile zu lesen.`),
      look: tt("the founder's calls: fast and personal, but they stop when he is busy", "die Anrufe des Gründers: schnell und persönlich, aber sie enden, wenn er beschäftigt ist"),
      apply: () => {
        setSelRaw("founder");
      },
    },
  ]);
  const setSel = (v: string) => {
    story.leave();
    setSelRaw(v);
  };
  const m = M_MEASURES.find((x) => x.id === sel)!;
  const e = explainBucket(speedBand(m.weeks));
  const score = m.eff * e * m.fea;
  return (
    <div className="space-y-3">
      <ThePoint>{tt("Score a measure on three questions: how much does it move the result, how fast does it work, and does it reach every visitor at no extra cost? The three scores are multiplied, so one weak answer lowers the whole.", "Bewerten Sie eine Maßnahme nach drei Fragen: Wie stark bewegt sie das Ergebnis, wie schnell wirkt sie, und erreicht sie jeden Besucher ohne Zusatzkosten? Die drei Werte werden multipliziert, also senkt eine schwache Antwort das Ganze.")}</ThePoint>
      <Story steps={story.plan} step={story.step} onStep={story.go} />
      <svg viewBox="0 0 560 130" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{tt("Neckar's three measures scored: effect × speed × scalability", "Neckars drei Maßnahmen bewertet: Wirkung × Tempo × Skalierbarkeit")}</title>
        <desc id={`${uid}-d`}>{M_MEASURES.map((x) => `${x.name}: ${x.eff * explainBucket(speedBand(x.weeks)) * x.fea}`).join("; ")}</desc>
        {M_MEASURES.map((x, i) => {
          const s = x.eff * explainBucket(speedBand(x.weeks)) * x.fea;
          const y = 12 + i * 38;
          const on = x.id === sel;
          return (
            <g key={x.id} className="hit" role="button" tabIndex={0} aria-label={x.name} onClick={() => setSel(x.id)} onKeyDown={(ev) => (ev.key === "Enter" || ev.key === " ") && setSel(x.id)}>
              {on && story.step !== null && <rect x="-4" y={y - 4} width="556" height="32" rx="7" fill="none" stroke={C.amber} strokeWidth="2" strokeDasharray="5 4" className="anim-pulse" />}
              <text x="0" y={y + 17} fontSize="12" fontWeight={on ? 700 : 400} fill={C.ink}>{x.name}</text>
              <rect className="hit-shape" x="270" y={y} width={(s / 27) * 240} height="24" fill={on ? C.gold : C.data} stroke={C.ink} />
              <text x={276 + (s / 27) * 240} y={y + 17} fontSize="12.5" fontWeight="700" fill={C.ink}>{s}</text>
            </g>
          );
        })}
      </svg>
      <Toggles<string> label={tt("Measure", "Maßnahme")} value={sel} onChange={setSel} options={M_MEASURES.map((x) => ({ id: x.id, label: x.name }))} />
      <Insight>{plain()}
        {tt(
          `${m.name} (${euro(m.cost)}, ${m.weeks} weeks): effect ${m.eff} × speed ${e} × scalability ${m.fea} = ${score}. It is ${EVIDENCE_LABEL[speedBand(m.weeks)]}, so speed is ${e}. ${m.note}`,
          `${m.name} (${euro(m.cost)}, ${m.weeks} Wochen): Wirkung ${m.eff} × Tempo ${e} × Skalierbarkeit ${m.fea} = ${score}. Sie ist ${EVIDENCE_LABEL[speedBand(m.weeks)]}, also ist das Tempo ${e}. ${m.note}`,
        )}
      </Insight>
    </div>
  );
}
