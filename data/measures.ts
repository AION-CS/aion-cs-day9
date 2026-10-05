import { bi, t } from "@/lib/lang";

/**
 * Task 1 · Block 2.4. Six measures LiveConnect could fund inside €170,000 and four months (the plan's framework). Costs and weeks are
 * Case assumptions; every price is built from parts (a tool, a licence for four months, hours of staff time) so a learner sees why it
 * is that number. What each measure does is written without naming the problem it answers, so the learner has to match them
 * (Materi A7). The score is the plan's own evaluation: Effect × Speed × Scalability. Speed follows from the printed weeks until the
 * measure takes effect, so it is checkable; effect and scalability are the learner's judgement. (Field names keep the earlier ones:
 * `exp` = Speed, `fea` = Scalability, `eff` = Effect; `evidence` is the speed band; `targets` are the problems a measure answers.)
 *
 * Three are strong, three are traps of different kinds: the pop-up is fast and cheap on paper but answers no problem, the callback is
 * fast but grows only with people, the relaunch is the dearest and needs the whole frame.
 */
export type MeasureId = "chat" | "personal" | "kpi" | "callback" | "popup" | "relaunch";
export const BUDGET = 170000;
export const MONTHS = 4;
/** The four months in weeks: the frame in which a measure has to start working. */
export const FRAME_WEEKS = MONTHS * 4;
export type Bucket = 1 | 2 | 3;

/**
 * The category printed after the weeks (CLAUDE.md #45): which of the three levers taught in Materi A1 to A3 a measure pulls (respond
 * faster, personalise the moment, learn and adjust), or none of them. A fact about the measure taken from those cards' own tests, never
 * a score and never the problem it answers (that stays the learner's job).
 */
export type MeasureArea = "respond" | "personal" | "learn" | "none";
export const MEASURE_AREA_LABEL = bi({
  respond: t("Answers visitors faster", "Antwortet Besuchern schneller"),
  personal: t("Fits the page to the visitor", "Passt die Seite an den Besucher an"),
  learn: t("Learns what works", "Lernt, was wirkt"),
  none: t("Not one of the three levers", "Keiner der drei Hebel"),
});
export const AREA_NOTE = bi({
  v: t(
    "The brief names three problems. Each card carries a small label with the lever it pulls (taught in Materi A1 to A3); a card with “Not one of the three levers” pulls none of them.",
    "Der Auftrag nennt drei Probleme. Jede Karte trägt ein kleines Etikett mit dem Hebel, an dem sie zieht (gelehrt in Materi A1 bis A3); eine Karte mit „Keiner der drei Hebel“ zieht an keinem.",
  ),
});

export type ProblemId = "bounce" | "interaction" | "coordination";
export const PROBLEM_IDS: ProblemId[] = ["bounce", "interaction", "coordination"];
export const PROBLEM_LABEL = bi({
  bounce: t("High bounce rates", "Hohe Absprungraten"),
  interaction: t("Low interaction", "Geringe Interaktion"),
  coordination: t("Measures not coordinated", "Maßnahmen nicht abgestimmt"),
});
/** The three problems in everyday words, for the picture under the cards. */
export const PROBLEM_PLAIN = bi({
  bounce: t("Visitors leave after a few seconds", "Besucher gehen nach wenigen Sekunden"),
  interaction: t("Visitors do not ask or click", "Besucher fragen und klicken nicht"),
  coordination: t("Nobody sees what works", "Niemand sieht, was wirkt"),
});

export type Evidence = "fast" | "mid" | "slow";
export const speedBand = (weeks: number): Evidence => (weeks <= 4 ? "fast" : weeks <= 10 ? "mid" : "slow");
export const EVIDENCE_LABEL = bi({
  fast: t("working within 4 weeks", "wirksam innerhalb von 4 Wochen"),
  mid: t("working after 5 to 10 weeks", "wirksam nach 5 bis 10 Wochen"),
  slow: t("working only after more than 10 weeks", "wirksam erst nach mehr als 10 Wochen"),
});
export const explainBucket = (e: Evidence): Bucket => (e === "fast" ? 3 : e === "mid" ? 2 : 1);
export const EXPLAIN_RULE = bi({
  v: t(
    "Speed follows from the printed weeks until a measure takes effect: within 4 weeks scores 3, 5 to 10 weeks scores 2, more than 10 weeks scores 1. With four months (16 weeks) in total, a measure that needs 16 weeks has no time left to work.",
    "Das Tempo folgt aus den gedruckten Wochen, bis eine Maßnahme wirkt: innerhalb von 4 Wochen ergibt 3, 5 bis 10 Wochen ergibt 2, mehr als 10 Wochen ergibt 1. Bei vier Monaten (16 Wochen) insgesamt bleibt einer Maßnahme, die 16 Wochen braucht, keine Zeit mehr zu wirken.",
  ),
});

/** The plain-word anchors for the two judged scores, printed under the score buttons and taught in Materi A7. */
export const EFFECT_ANCHOR = bi({
  v: t(
    "3 = it changes what most visitors do on the pages where they decide. 2 = it helps, but only some visitors or only indirectly. 1 = it hardly changes what customers do.",
    "3 = Sie ändert, was die meisten Besucher auf den Seiten tun, auf denen sie entscheiden. 2 = Sie hilft, aber nur einigen Besuchern oder nur indirekt. 1 = Sie ändert kaum, was Kunden tun.",
  ),
});
export const SCALE_ANCHOR = bi({
  v: t(
    "3 = once built, it serves every visitor with no extra people. 2 = it needs some extra people or cost as it grows. 1 = it grows only by adding people.",
    "3 = Einmal gebaut, dient sie jedem Besucher ohne zusätzliche Personen. 2 = Sie braucht beim Wachsen etwas mehr Personal oder Kosten. 1 = Sie wächst nur, indem man Personal ergänzt.",
  ),
});

export type CostPart = { label: string; amount: number };

export type Measure = {
  id: MeasureId;
  name: string;
  /** A short name for bars and rows. */
  short: string;
  /** In everyday words: what it is. */
  what: string;
  /** One concrete scene from LiveConnect's day (CLAUDE.md #46). */
  scene: string;
  /** Who does what, and what the visitor or customer notices. */
  who: string;
  area: MeasureArea;
  basis: string;
  evidence: Evidence;
  /** What the price is made of; `cost` is their sum. */
  costParts: CostPart[];
  cost: number;
  weeks: number;
  targets: ProblemId[];
  model: { feasibility: Bucket; effect: Bucket; note: string };
  verdict: string;
};

export const MEASURES: Measure[] = [];
const RAW = bi([
  {
    id: "chat" as MeasureId,
    short: t("Chat", "Chat"),
    name: t("Chatbot and live chat on the pricing and quote pages", "Chatbot und Live-Chat auf Preis- und Angebotsseite"),
    what: t(
      "A small chat window on the pricing and quote pages. It answers the usual questions straight away and passes everything else to a salesperson.",
      "Ein kleines Chatfenster auf der Preis- und der Angebotsseite. Es beantwortet die üblichen Fragen sofort und gibt alles andere an eine Vertriebsperson weiter.",
    ),
    scene: t(
      "A visitor has read the pricing page for 30 seconds and asks whether the licence includes backup. The chat answers at once. A question about a special contract goes to a salesperson, who replies within two minutes.",
      "Ein Besucher liest seit 30 Sekunden die Preisseite und fragt, ob die Lizenz Backup enthält. Der Chat antwortet sofort. Eine Frage zu einem Sondervertrag geht an eine Vertriebsperson, die innerhalb von zwei Minuten antwortet.",
    ),
    who: t(
      "Service writes the answers once. The chatbot talks to the visitors. A salesperson takes over what it cannot answer. The visitor gets an answer before leaving.",
      "Der Service schreibt die Antworten einmal. Der Chatbot spricht mit den Besuchern. Eine Vertriebsperson übernimmt, was er nicht beantworten kann. Der Besucher bekommt eine Antwort, bevor er geht.",
    ),
    area: "respond" as MeasureArea,
    basis: t("Measured by quote requests against pages without chat.", "Gemessen an Angebotsanfragen gegen Seiten ohne Chat."),
    costParts: [
      { label: t("tool set-up and link to the CRM", "Einrichtung des Tools und Anbindung an das CRM"), amount: 22000 },
      { label: t("licence, 4 months × €2,500", "Lizenz, 4 Monate × 2.500 €"), amount: 10000 },
      { label: t("Service writes and updates the answers, 150 h × €80", "Service schreibt und pflegt die Antworten, 150 Std. × 80 €"), amount: 12000 },
    ],
    cost: 0,
    weeks: 4,
    targets: ["bounce", "interaction"] as ProblemId[],
    model: { feasibility: 3, effect: 3, note: t("Answers visitors at the moment they are about to leave, on the pages where decisions happen; once built it serves every visitor.", "Antwortet Besuchern in dem Moment, in dem sie gehen wollen, auf den Seiten, wo entschieden wird; einmal gebaut, dient es jedem Besucher.") },
    verdict: t("A model measure: it answers the two problems the visitor feels, and it works within the first month.", "Eine Modellmaßnahme: Sie beantwortet die beiden Probleme, die der Besucher spürt, und wirkt im ersten Monat."),
  },
  {
    id: "personal" as MeasureId,
    short: t("Personalised pages", "Personalisierte Seiten"),
    name: t("Real-time content for returning customers and campaign visitors", "Echtzeit-Inhalte für wiederkehrende Kunden und Kampagnenbesucher"),
    what: t(
      "The start page of the customer portal and the campaign pages change to fit the visitor: who logged in, or which campaign they came from.",
      "Die Startseite des Kundenportals und die Kampagnenseiten ändern sich passend zum Besucher: wer sich angemeldet hat oder aus welcher Kampagne er kam.",
    ),
    scene: t(
      "A visitor from the hospital campaign lands on a page that opens with a hospital case study and the data protection answers hospitals ask for, not on the standard page.",
      "Ein Besucher aus der Krankenhaus-Kampagne landet nicht auf der Standardseite, sondern auf einer Seite, die mit einer Krankenhaus-Fallstudie und den Datenschutzantworten beginnt, nach denen Krankenhäuser fragen.",
    ),
    who: t(
      "Marketing writes the page variants once. The website picks the right one for each visitor. The visitor finds what they came for without searching.",
      "Das Marketing schreibt die Seitenvarianten einmal. Die Website wählt für jeden Besucher die passende. Der Besucher findet, weswegen er kam, ohne zu suchen.",
    ),
    area: "personal" as MeasureArea,
    basis: t("Measured by interaction against the standard page.", "Gemessen an der Interaktion gegen die Standardseite."),
    costParts: [
      { label: t("content tool licence, 4 months × €3,500", "Lizenz des Inhalts-Tools, 4 Monate × 3.500 €"), amount: 14000 },
      { label: t("link to the portal login and the CRM", "Anbindung an Portal-Login und CRM"), amount: 26000 },
      { label: t("Marketing writes the page variants, 200 h × €80", "Marketing schreibt die Seitenvarianten, 200 Std. × 80 €"), amount: 16000 },
    ],
    cost: 0,
    weeks: 8,
    targets: ["bounce", "interaction"] as ProblemId[],
    model: { feasibility: 3, effect: 3, note: t("Strong where LiveConnect knows the visitor; it needs eight weeks of set-up, so speed 2.", "Stark, wo LiveConnect den Besucher kennt; es braucht acht Wochen Vorlauf, daher Tempo 2.") },
    verdict: t("A model measure: it makes the moment personal where the data allows it.", "Eine Modellmaßnahme: Sie macht den Moment persönlich, wo die Daten es erlauben."),
  },
  {
    id: "kpi" as MeasureId,
    short: t("KPI dashboard", "KPI-Dashboard"),
    name: t("Real-time KPI dashboard and weekly test routine", "Echtzeit-KPI-Dashboard und wöchentliche Test-Routine"),
    what: t(
      "One live screen with response time, interaction and closings for all channels, and a short weekly meeting where the team decides what to do with each running test.",
      "Ein Live-Bildschirm mit Antwortzeit, Interaktion und Abschlüssen für alle Kanäle und ein kurzes wöchentliches Meeting, in dem das Team entscheidet, was mit jedem laufenden Test geschieht.",
    ),
    scene: t(
      "Every Monday the team looks at the same screen. For each running test they decide: roll it out, keep testing or stop it.",
      "Jeden Montag schaut das Team auf denselben Bildschirm. Für jeden laufenden Test entscheidet es: ausrollen, weiter testen oder stoppen.",
    ),
    who: t(
      "A data analyst builds the screen. Each person who owns a measure brings a test and a stop rule to the meeting. Customers notice nothing directly; the other measures get better week by week.",
      "Ein Datenanalyst baut den Bildschirm. Jede Person, der eine Maßnahme gehört, bringt einen Test und eine Stoppregel in das Meeting. Kunden merken nichts direkt; die anderen Maßnahmen werden Woche für Woche besser.",
    ),
    area: "learn" as MeasureArea,
    basis: t("Measured by the share of measures with a test and a decision each week.", "Gemessen am Anteil der Maßnahmen mit Test und wöchentlicher Entscheidung."),
    costParts: [
      { label: t("analyst builds the screen, 25 days × €800", "Analyst baut den Bildschirm, 25 Tage × 800 €"), amount: 20000 },
      { label: t("dashboard licence, 4 months × €1,500", "Dashboard-Lizenz, 4 Monate × 1.500 €"), amount: 6000 },
      { label: t("weekly meeting, 5 people × 1 h × 15 weeks × €80", "wöchentliches Meeting, 5 Personen × 1 Std. × 15 Wochen × 80 €"), amount: 6000 },
    ],
    cost: 0,
    weeks: 4,
    targets: ["coordination"] as ProblemId[],
    model: { feasibility: 3, effect: 2, note: t("It raises no deal by itself, but it is the only measure that coordinates the others and feeds back what works.", "Sie steigert selbst keinen Abschluss, ist aber die einzige Maßnahme, die die anderen abstimmt und zurückmeldet, was wirkt.") },
    verdict: t("A model measure: it is the only one that answers “measures not coordinated”.", "Eine Modellmaßnahme: Sie ist die einzige, die „Maßnahmen nicht abgestimmt“ beantwortet."),
  },
  {
    id: "callback" as MeasureId,
    short: t("Callback", "Rückruf"),
    name: t("Callback within 15 minutes by the sales team", "Rückruf innerhalb von 15 Minuten durch den Vertrieb"),
    what: t(
      "Every quote request gets a phone call from a salesperson within 15 minutes, during office hours.",
      "Jede Angebotsanfrage bekommt während der Bürozeiten innerhalb von 15 Minuten einen Anruf von einer Vertriebsperson.",
    ),
    scene: t(
      "A quote request arrives at 10:05. At 10:17 a salesperson calls the customer back while the question is still fresh.",
      "Eine Angebotsanfrage kommt um 10:05 an. Um 10:17 ruft eine Vertriebsperson den Kunden zurück, solange die Frage noch frisch ist.",
    ),
    who: t(
      "Two extra salespeople are hired for the four months to make the calls. The customer notices a person calling within minutes. If requests double, more people are needed.",
      "Zwei zusätzliche Vertriebspersonen werden für die vier Monate eingestellt, um anzurufen. Der Kunde merkt, dass sich innerhalb von Minuten ein Mensch meldet. Verdoppeln sich die Anfragen, braucht es mehr Personal.",
    ),
    area: "respond" as MeasureArea,
    basis: t("Measured by closings of called-back requests.", "Gemessen an den Abschlüssen zurückgerufener Anfragen."),
    costParts: [
      { label: t("2 extra salespeople, 4 months × €7,000 each", "2 zusätzliche Vertriebspersonen, 4 Monate × je 7.000 €"), amount: 56000 },
      { label: t("call list and alerts in the CRM", "Anrufliste und Hinweise im CRM"), amount: 9000 },
    ],
    cost: 0,
    weeks: 3,
    targets: ["interaction"] as ProblemId[],
    model: { feasibility: 1, effect: 2, note: t("Fast and personal, but every call costs a person's time, so it does not scale beyond office hours and the current volume.", "Schnell und persönlich, aber jeder Anruf kostet Personenzeit, also skaliert es nicht über die Bürozeiten und die heutige Menge hinaus.") },
    verdict: t("Not in the model three: 6 points. A good add-on for large requests once the chat routes them.", "Nicht unter den drei Modellmaßnahmen: 6 Punkte. Eine gute Ergänzung für große Anfragen, sobald der Chat sie weiterleitet."),
  },
  {
    id: "popup" as MeasureId,
    short: t("Discount pop-up", "Rabatt-Pop-up"),
    name: t("Exit pop-up with a 10% discount", "Exit-Pop-up mit 10 % Rabatt"),
    what: t(
      "When a visitor moves the mouse to close the page, a window offers 10% off.",
      "Wenn ein Besucher mit der Maus zum Schließen der Seite fährt, bietet ein Fenster 10 % Rabatt an.",
    ),
    scene: t(
      "A visitor moves the mouse towards the close button and a window offers 10% off, whether the visitor was about to order or not.",
      "Ein Besucher fährt mit der Maus zum Schließen-Knopf, und ein Fenster bietet 10 % Rabatt an, egal ob der Besucher bestellen wollte oder nicht.",
    ),
    who: t(
      "Marketing switches it on. Finance pays the discount on every order that uses it, also from customers who would have ordered anyway.",
      "Das Marketing schaltet es ein. Die Finanzabteilung zahlt den Rabatt bei jeder Bestellung, die ihn nutzt, auch von Kunden, die sowieso bestellt hätten.",
    ),
    area: "none" as MeasureArea,
    basis: t("Measured by pop-ups clicked.", "Gemessen an geklickten Pop-ups."),
    costParts: [
      { label: t("pop-up tool and design", "Pop-up-Tool und Gestaltung"), amount: 10000 },
      { label: t("discount reserve: 10% of about €300,000 of orders in four months (Case assumption)", "Rabattreserve: 10 % von rund 300.000 € Bestellungen in vier Monaten (Fallannahme)"), amount: 30000 },
    ],
    cost: 0,
    weeks: 1,
    targets: [] as ProblemId[],
    model: { feasibility: 3, effect: 1, note: t("Fast, but it pays everyone, annoys many and trains visitors to wait for discounts. It starts no conversation and shows nobody what works.", "Schnell, aber es bezahlt jeden, stört viele und gewöhnt Besucher daran, auf Rabatte zu warten. Es beginnt kein Gespräch und zeigt niemandem, was wirkt.") },
    verdict: t("Rejected: 9 points. Speed without relevance: a guardrail (complaints about pop-ups) would soon stop it.", "Verworfen: 9 Punkte. Tempo ohne Relevanz: Eine Guardrail (Beschwerden über Pop-ups) würde es bald stoppen."),
  },
  {
    id: "relaunch" as MeasureId,
    short: t("Relaunch", "Relaunch"),
    name: t("Complete website relaunch", "Kompletter Relaunch der Website"),
    what: t(
      "A new design and new texts for every page of the website, built by an agency and launched in one go.",
      "Ein neues Design und neue Texte für jede Seite der Website, von einer Agentur gebaut und auf einmal veröffentlicht.",
    ),
    scene: t(
      "For four months nothing changes. Then on one day every page looks new, and nobody can say which change helped, because they all arrived together.",
      "Vier Monate ändert sich nichts. Dann sieht an einem Tag jede Seite neu aus, und niemand kann sagen, welche Änderung geholfen hat, weil alle zusammen kamen.",
    ),
    who: t(
      "An agency designs and builds it. LiveConnect's teams review it at the end. Visitors see nothing new until the launch day.",
      "Eine Agentur entwirft und baut sie. Die Teams von LiveConnect prüfen sie am Ende. Besucher sehen bis zum Starttag nichts Neues.",
    ),
    area: "none" as MeasureArea,
    basis: t("Measured by bounce rate before and after.", "Gemessen an der Absprungrate vorher und nachher."),
    costParts: [
      { label: t("agency designs and builds", "Agentur entwirft und baut"), amount: 72000 },
      { label: t("rewriting all texts, 400 h × €80", "alle Texte neu schreiben, 400 Std. × 80 €"), amount: 32000 },
      { label: t("moving the content and testing", "Inhalte umziehen und testen"), amount: 6000 },
    ],
    cost: 0,
    weeks: 16,
    targets: ["bounce", "interaction"] as ProblemId[],
    model: { feasibility: 3, effect: 2, note: t("It might help, but sixteen weeks leave no time in a four-month frame, and €110,000 leaves little for anything else.", "Er könnte helfen, aber sechzehn Wochen lassen in einem Rahmen von vier Monaten keine Zeit, und 110.000 € lassen wenig für anderes.") },
    verdict: t("Rejected: 6 points. Too slow for the brief.", "Verworfen: 6 Punkte. Zu langsam für den Auftrag."),
  },
]);
for (const m of RAW) {
  MEASURES.push(Object.assign(m, { evidence: speedBand(m.weeks), cost: m.costParts.reduce((s, p) => s + p.amount, 0) }) as Measure);
}

export const MEASURE_BY_ID = Object.fromEntries(MEASURES.map((m) => [m.id, m])) as Record<MeasureId, Measure>;
export const MEASURE_IDS = MEASURES.map((m) => m.id);
export const CHOOSE = 3;
export const modelScore = (id: MeasureId) => {
  const m = MEASURE_BY_ID[id];
  return explainBucket(m.evidence) * m.model.feasibility * m.model.effect;
};
export const MODEL_MEASURES: MeasureId[] = ["chat", "personal", "kpi"];
export const MODEL_COST = MODEL_MEASURES.reduce((s, id) => s + MEASURE_BY_ID[id].cost, 0);

/** Weeks a measure is actually working inside the four months (0 when it only starts at the very end). */
export const workingWeeks = (id: MeasureId) => Math.max(0, FRAME_WEEKS - MEASURE_BY_ID[id].weeks);
