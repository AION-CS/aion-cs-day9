import { bi, t } from "@/lib/lang";

/**
 * Task 1 · Block 2.4. Nine measures LiveConnect could fund inside €170,000 and four months (the plan's framework). Costs and weeks are
 * Case assumptions. What each measure does is written without naming the problem it answers, so the learner has to match them
 * (Materi A7). The score is the plan's own evaluation: Effect × Speed × Scalability. Speed follows from the printed weeks until the
 * measure takes effect, so it is checkable; effect and scalability are the learner's judgement. (Field names keep the earlier ones:
 * `exp` = Speed, `fea` = Scalability, `eff` = Effect; `evidence` is the speed band; `targets` are the problems a measure answers.)
 */
export type MeasureId = "chat" | "personal" | "kpi" | "callback" | "pricing" | "popup" | "relaunch" | "social" | "avatar";
export const BUDGET = 170000;
export const MONTHS = 4;
export type Bucket = 1 | 2 | 3;

/**
 * The category printed after the weeks (CLAUDE.md #45): which of the three levers taught in Materi A1 to A3 a measure pulls (respond
 * faster, personalise the moment, learn and adjust), or none of them. A fact about the measure taken from those cards' own tests, never
 * a score and never the problem it answers (that stays the learner's job).
 */
export type MeasureArea = "respond" | "personal" | "learn" | "none";
export const MEASURE_AREA_LABEL = bi({
  respond: t("Respond faster", "Schneller reagieren"),
  personal: t("Personalise the moment", "Den Moment personalisieren"),
  learn: t("Learn and adjust", "Lernen und anpassen"),
  none: t("None of the three levers", "Keiner der drei Hebel"),
});
export const AREA_NOTE = bi({
  v: t(
    "The brief names three problems: high bounce rates, low interaction and measures that are not coordinated. They call for shorter waits, a page that fits the visitor, and a routine that learns from tests. A discount, a redesign or an avatar that greets everyone the same way pulls none of the three levers taught in Materi A1 to A3.",
    "Der Auftrag nennt drei Probleme: hohe Absprungraten, geringe Interaktion und nicht abgestimmte Maßnahmen. Sie verlangen kürzere Wartezeiten, eine Seite, die zum Besucher passt, und eine Routine, die aus Tests lernt. Ein Rabatt, ein Relaunch oder ein Avatar, der alle gleich begrüßt, zieht an keinem der drei Hebel aus Materi A1 bis A3.",
  ),
});

export type ProblemId = "bounce" | "interaction" | "coordination";
export const PROBLEM_IDS: ProblemId[] = ["bounce", "interaction", "coordination"];
export const PROBLEM_LABEL = bi({
  bounce: t("High bounce rates", "Hohe Absprungraten"),
  interaction: t("Low interaction", "Geringe Interaktion"),
  coordination: t("Measures not coordinated", "Maßnahmen nicht abgestimmt"),
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
    "Speed follows from the printed weeks until a measure takes effect: within 4 weeks scores 3, 5 to 10 weeks scores 2, more than 10 weeks scores 1. With four months in total, a measure that needs 16 weeks has no time left to work.",
    "Das Tempo folgt aus den gedruckten Wochen, bis eine Maßnahme wirkt: innerhalb von 4 Wochen ergibt 3, 5 bis 10 Wochen ergibt 2, mehr als 10 Wochen ergibt 1. Bei vier Monaten insgesamt bleibt einer Maßnahme, die 16 Wochen braucht, keine Zeit mehr zu wirken.",
  ),
});

export type Measure = {
  id: MeasureId;
  name: string;
  what: string;
  /** One concrete scene from LiveConnect's day, and who does what (CLAUDE.md #46). */
  scene: string;
  who: string;
  area: MeasureArea;
  basis: string;
  evidence: Evidence;
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
    name: t("Chatbot and live chat on the pricing and quote pages", "Chatbot und Live-Chat auf Preis- und Angebotsseite"),
    what: t("A chatbot answers the common questions at once and hands the rest to a salesperson within two minutes during office hours.", "Ein Chatbot beantwortet die häufigen Fragen sofort und übergibt den Rest während der Bürozeiten innerhalb von zwei Minuten an eine Vertriebsperson."),
    scene: t("A visitor reads the pricing page for 30 seconds, asks the chat whether the licence includes backup and gets the answer at once; a question about a custom contract goes to a salesperson within two minutes.", "Ein Besucher liest 30 Sekunden die Preisseite, fragt den Chat, ob die Lizenz Backup enthält, und bekommt die Antwort sofort; eine Frage zu einem individuellen Vertrag geht innerhalb von zwei Minuten an eine Vertriebsperson."),
    who: t("Service writes the answers; the chatbot talks to visitors; a salesperson takes over what it cannot answer.", "Der Service schreibt die Antworten; der Chatbot spricht mit den Besuchern; eine Vertriebsperson übernimmt, was er nicht beantworten kann."),
    area: "respond" as MeasureArea,
    basis: t("In use after 4 weeks; measured by quote requests against pages without chat.", "In Betrieb nach 4 Wochen; gemessen an Angebotsanfragen gegen Seiten ohne Chat."),
    cost: 40000,
    weeks: 4,
    targets: ["bounce", "interaction"] as ProblemId[],
    model: { feasibility: 3, effect: 3, note: t("Answers visitors at the moment they are about to leave, on the pages where decisions happen; once built it serves every visitor.", "Antwortet Besuchern in dem Moment, in dem sie gehen wollen, auf den Seiten, wo entschieden wird; einmal gebaut, dient es jedem Besucher.") },
    verdict: t("A model measure: it answers the two problems the visitor feels, and it works within the first month.", "Eine Modellmaßnahme: Sie beantwortet die beiden Probleme, die der Besucher spürt, und wirkt im ersten Monat."),
  },
  {
    id: "personal" as MeasureId,
    name: t("Real-time content for returning customers and campaign visitors", "Echtzeit-Inhalte für wiederkehrende Kunden und Kampagnenbesucher"),
    what: t("The portal start page and the campaign landing pages show content that fits who logged in or why the visitor came.", "Die Startseite des Portals und die Kampagnen-Landingpages zeigen Inhalte, die dazu passen, wer sich angemeldet hat oder warum der Besucher kam."),
    scene: t("A visitor who comes from the hospital campaign lands on a page that opens with a hospital case study and the data protection answers hospitals ask for.", "Ein Besucher aus der Krankenhaus-Kampagne landet auf einer Seite, die mit einer Krankenhaus-Fallstudie und den Datenschutzantworten beginnt, nach denen Krankenhäuser fragen."),
    who: t("Marketing writes the content variants once; the website picks the fitting one for each visitor.", "Das Marketing schreibt die Inhaltsvarianten einmal; die Website wählt für jeden Besucher die passende."),
    area: "personal" as MeasureArea,
    basis: t("In use after 8 weeks; measured by interaction against the standard page.", "In Betrieb nach 8 Wochen; gemessen an der Interaktion gegen die Standardseite."),
    cost: 45000,
    weeks: 8,
    targets: ["bounce", "interaction"] as ProblemId[],
    model: { feasibility: 3, effect: 3, note: t("Strong where LiveConnect knows the visitor; it needs eight weeks of set-up, so speed 2.", "Stark, wo LiveConnect den Besucher kennt; es braucht acht Wochen Vorlauf, daher Tempo 2.") },
    verdict: t("A model measure: it makes the moment personal where the data allows it.", "Eine Modellmaßnahme: Sie macht den Moment persönlich, wo die Daten es erlauben."),
  },
  {
    id: "kpi" as MeasureId,
    name: t("Real-time KPI dashboard and weekly test routine", "Echtzeit-KPI-Dashboard und wöchentliche Test-Routine"),
    what: t("One live screen with response time, interaction and closings for all channels, and a weekly meeting that decides on each running test.", "Ein Live-Bildschirm mit Antwortzeit, Interaktion und Abschlüssen für alle Kanäle, und ein wöchentliches Meeting, das über jeden laufenden Test entscheidet."),
    scene: t("Every Monday the team looks at one screen: response time, interaction and closings, and decides for each running test whether to roll it out, keep testing or stop.", "Jeden Montag schaut das Team auf einen Bildschirm: Antwortzeit, Interaktion und Abschlüsse, und entscheidet für jeden laufenden Test, ob er ausgerollt, weitergetestet oder gestoppt wird."),
    who: t("A data analyst builds the screen; every measure owner brings a test and a decision rule to the weekly meeting.", "Ein Datenanalyst baut den Bildschirm; jeder Maßnahmen-Owner bringt einen Test und eine Entscheidungsregel in das wöchentliche Meeting."),
    area: "learn" as MeasureArea,
    basis: t("In use after 4 weeks; measured by the share of measures with a test and a decision each week.", "In Betrieb nach 4 Wochen; gemessen am Anteil der Maßnahmen mit Test und wöchentlicher Entscheidung."),
    cost: 30000,
    weeks: 4,
    targets: ["coordination"] as ProblemId[],
    model: { feasibility: 3, effect: 2, note: t("It raises no deal by itself, but it is the only measure that coordinates the others and feeds back what works.", "Sie steigert selbst keinen Abschluss, ist aber die einzige Maßnahme, die die anderen abstimmt und zurückmeldet, was wirkt.") },
    verdict: t("A model measure: it is the only one that answers “measures not coordinated”.", "Eine Modellmaßnahme: Sie ist die einzige, die „Maßnahmen nicht abgestimmt“ beantwortet."),
  },
  {
    id: "callback" as MeasureId,
    name: t("Callback within 15 minutes by the sales team", "Rückruf innerhalb von 15 Minuten durch den Vertrieb"),
    what: t("Every quote request is called back by a salesperson within 15 minutes during office hours.", "Jede Angebotsanfrage wird während der Bürozeiten innerhalb von 15 Minuten von einer Vertriebsperson zurückgerufen."),
    scene: t("A quote request arrives at 10:05; at 10:17 a salesperson calls the customer back while the question is still fresh.", "Eine Angebotsanfrage kommt um 10:05 an; um 10:17 ruft eine Vertriebsperson den Kunden zurück, solange die Frage noch frisch ist."),
    who: t("The sales team answers by phone; the customer notices that someone reacts within minutes.", "Das Vertriebsteam antwortet telefonisch; der Kunde merkt, dass jemand innerhalb von Minuten reagiert."),
    area: "respond" as MeasureArea,
    basis: t("In use after 2 weeks; measured by closings of called-back requests.", "In Betrieb nach 2 Wochen; gemessen an den Abschlüssen zurückgerufener Anfragen."),
    cost: 35000,
    weeks: 2,
    targets: ["interaction"] as ProblemId[],
    model: { feasibility: 1, effect: 2, note: t("Fast and personal, but every call costs a person's time, so it does not scale beyond office hours and the current volume.", "Schnell und persönlich, aber jeder Anruf kostet Personenzeit, also skaliert es nicht über die Bürozeiten und die heutige Menge hinaus.") },
    verdict: t("Not in the model three: 6 points. A good add-on for large requests once the chat routes them.", "Nicht unter den drei Modellmaßnahmen: 6 Punkte. Eine gute Ergänzung für große Anfragen, sobald der Chat sie weiterleitet."),
  },
  {
    id: "pricing" as MeasureId,
    name: t("Dynamic pricing in the web shop", "Dynamic Pricing im Webshop"),
    what: t("Prices of add-ons change with demand and with what the visitor has looked at.", "Preise der Add-ons ändern sich mit der Nachfrage und mit dem, was sich der Besucher angesehen hat."),
    scene: t("A visitor who has looked at the archive add-on three times sees a different price from a first-time visitor.", "Ein Besucher, der sich das Archiv-Add-on dreimal angesehen hat, sieht einen anderen Preis als ein Erstbesucher."),
    who: t("Sales sets a price band; the web shop's system picks the price inside it for each visitor.", "Der Vertrieb legt eine Preisspanne fest; das System des Webshops wählt darin für jeden Besucher den Preis."),
    area: "personal" as MeasureArea,
    basis: t("In use after 10 weeks; measured by revenue per order before and after.", "In Betrieb nach 10 Wochen; gemessen am Umsatz pro Bestellung vorher und nachher."),
    cost: 50000,
    weeks: 10,
    targets: [] as ProblemId[],
    model: { feasibility: 3, effect: 1, note: t("It may lift revenue per order, but it answers none of the three problems and business customers who compare prices may lose trust.", "Er hebt vielleicht den Umsatz pro Bestellung, beantwortet aber keines der drei Probleme, und Geschäftskunden, die Preise vergleichen, verlieren vielleicht Vertrauen.") },
    verdict: t("Rejected: 6 points. Not a real-time retention measure for this brief.", "Verworfen: 6 Punkte. Keine Echtzeit-Bindungsmaßnahme für diesen Auftrag."),
  },
  {
    id: "popup" as MeasureId,
    name: t("Exit pop-up with a 10% discount", "Exit-Pop-up mit 10 % Rabatt"),
    what: t("When the mouse moves towards closing the page, a pop-up offers 10% off.", "Wenn die Maus zum Schließen der Seite fährt, bietet ein Pop-up 10 % Rabatt an."),
    scene: t("A visitor moves the mouse towards the close button and a window offers 10% off, whether the visitor was about to order or not.", "Ein Besucher fährt mit der Maus zum Schließen-Knopf, und ein Fenster bietet 10 % Rabatt an, egal ob der Besucher bestellen wollte oder nicht."),
    who: t("Marketing switches the pop-up on; finance pays the discount on every order that uses it.", "Das Marketing schaltet das Pop-up ein; die Finanzabteilung zahlt den Rabatt bei jeder Bestellung, die ihn nutzt."),
    area: "none" as MeasureArea,
    basis: t("In use after 1 week; measured by pop-ups clicked.", "In Betrieb nach 1 Woche; gemessen an geklickten Pop-ups."),
    cost: 10000,
    weeks: 1,
    targets: ["bounce"] as ProblemId[],
    model: { feasibility: 3, effect: 1, note: t("Fast and cheap, but it pays everyone, annoys many and trains visitors to wait for discounts.", "Schnell und günstig, aber es bezahlt jeden, stört viele und gewöhnt Besucher daran, auf Rabatte zu warten.") },
    verdict: t("Rejected: 9 points. Speed without relevance: a guardrail (complaints about pop-ups) would soon stop it.", "Verworfen: 9 Punkte. Tempo ohne Relevanz: Eine Guardrail (Beschwerden über Pop-ups) würde es bald stoppen."),
  },
  {
    id: "relaunch" as MeasureId,
    name: t("Complete website relaunch", "Kompletter Relaunch der Website"),
    what: t("A new design and new texts for every page.", "Ein neues Design und neue Texte für jede Seite."),
    scene: t("For four months nothing visible changes; then every page looks new on one day, and nobody can tell which change helped.", "Vier Monate ändert sich nichts Sichtbares; dann sieht an einem Tag jede Seite neu aus, und niemand kann sagen, welche Änderung geholfen hat."),
    who: t("An agency designs and builds the new site; the company's teams review it at the end.", "Eine Agentur entwirft und baut die neue Website; die Teams des Unternehmens prüfen sie am Ende."),
    area: "none" as MeasureArea,
    basis: t("In use after 16 weeks; measured by bounce rate before and after.", "In Betrieb nach 16 Wochen; gemessen an der Absprungrate vorher und nachher."),
    cost: 120000,
    weeks: 16,
    targets: ["bounce", "interaction"] as ProblemId[],
    model: { feasibility: 3, effect: 2, note: t("It might help, but sixteen weeks leave no time in a four-month frame, and €120,000 leaves little for anything else.", "Er könnte helfen, aber sechzehn Wochen lassen in einem Rahmen von vier Monaten keine Zeit, und 120.000 € lassen wenig für anderes.") },
    verdict: t("Rejected: 6 points. Too slow for the brief.", "Verworfen: 6 Punkte. Zu langsam für den Auftrag."),
  },
  {
    id: "social" as MeasureId,
    name: t("Social media team answering within one hour", "Social-Media-Team antwortet innerhalb einer Stunde"),
    what: t("Two people answer questions and comments on LinkedIn and Xing within one hour.", "Zwei Personen beantworten Fragen und Kommentare auf LinkedIn und Xing innerhalb einer Stunde."),
    scene: t("A prospect comments on LinkedIn at lunchtime and gets a reply from a named person before the break is over.", "Ein Interessent kommentiert mittags auf LinkedIn und bekommt eine Antwort von einer namentlich genannten Person, bevor die Pause vorbei ist."),
    who: t("Two people from marketing answer; they hand technical questions to service.", "Zwei Personen aus dem Marketing antworten; technische Fragen geben sie an den Service weiter."),
    area: "respond" as MeasureArea,
    basis: t("In use after 3 weeks; measured by replies sent.", "In Betrieb nach 3 Wochen; gemessen an gesendeten Antworten."),
    cost: 30000,
    weeks: 3,
    targets: ["interaction"] as ProblemId[],
    model: { feasibility: 1, effect: 1, note: t("A good retention tool where customers ask on social media, but few of LiveConnect's buyers do, and it grows only with people.", "Ein gutes Bindungswerkzeug, wo Kunden in Social Media fragen, aber wenige Käufer von LiveConnect tun das, und es wächst nur mit Personal.") },
    verdict: t("Rejected: 3 points. Fast, but in the wrong place for this case.", "Verworfen: 3 Punkte. Schnell, aber am falschen Ort für diesen Fall."),
  },
  {
    id: "avatar" as MeasureId,
    name: t("AI video avatar greeting every visitor", "KI-Videoavatar, der jeden Besucher begrüßt"),
    what: t("An animated avatar greets every visitor by voice and explains the company.", "Ein animierter Avatar begrüßt jeden Besucher per Stimme und erklärt das Unternehmen."),
    scene: t("Every visitor, first-timer or long-time customer, is greeted by the same animated figure that explains the company.", "Jeden Besucher, ob Erstbesucher oder langjähriger Kunde, begrüßt dieselbe animierte Figur, die das Unternehmen erklärt."),
    who: t("A vendor builds and runs the avatar; LiveConnect staff only read the vendor's view counts.", "Ein Anbieter baut und betreibt den Avatar; die Mitarbeiter von LiveConnect lesen nur die Aufrufzahlen des Anbieters."),
    area: "none" as MeasureArea,
    basis: t("In use after 12 weeks; measured by the vendor's view counts.", "In Betrieb nach 12 Wochen; gemessen an den Aufrufzahlen des Anbieters."),
    cost: 60000,
    weeks: 12,
    targets: [] as ProblemId[],
    model: { feasibility: 3, effect: 1, note: t("Technology without strategy: it is new and visible, it answers no question a visitor has, and it is slow.", "Technologie ohne Strategie: Sie ist neu und sichtbar, beantwortet keine Frage eines Besuchers und ist langsam.") },
    verdict: t("Rejected: 3 points.", "Verworfen: 3 Punkte."),
  },
]);
for (const m of RAW) MEASURES.push(Object.assign(m, { evidence: speedBand(m.weeks) }) as Measure);

export const MEASURE_BY_ID = Object.fromEntries(MEASURES.map((m) => [m.id, m])) as Record<MeasureId, Measure>;
export const MEASURE_IDS = MEASURES.map((m) => m.id);
export const CHOOSE = 3;
export const modelScore = (id: MeasureId) => {
  const m = MEASURE_BY_ID[id];
  return explainBucket(m.evidence) * m.model.feasibility * m.model.effect;
};
export const MODEL_MEASURES: MeasureId[] = ["chat", "personal", "kpi"];
export const MODEL_COST = MODEL_MEASURES.reduce((s, id) => s + MEASURE_BY_ID[id].cost, 0);
