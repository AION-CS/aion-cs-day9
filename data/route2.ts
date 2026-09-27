import { bi, t } from "@/lib/lang";

/**
 * Route 2 (Level 3) data: the Transfer Project. LiveConnect's Chief Digital Officer builds a real-time customer management system with a
 * limited budget, an incomplete data situation and high time pressure, and decides under time pressure. Every figure is a Case
 * assumption (the plan gives the role, the situation and the constraints, not numbers). (Identifiers keep the names of the file this was
 * built from: a "source" is an interaction point, a "component" is a KPI candidate, a "situation" is a test result.)
 */
export const R2_BUDGET = 190000;
export const R2_MONTHS = 4;
export type Bucket = 1 | 2 | 3;

/* ------------------------------------------------------------------ 3.1 · target vision of a real-time retention system */

export type PrincipleId = "defs" | "rules" | "owners" | "review" | "hoard" | "blackbox";
export const PRINCIPLE_IDS: PrincipleId[] = ["defs", "rules", "owners", "review", "hoard", "blackbox"];
export const PRINCIPLES = bi({
  defs: { id: "defs" as PrincipleId, name: t("One live view of every customer interaction", "Eine Live-Sicht auf jede Kundeninteraktion"), means: t("Chat, calls, forms, e-mails and social media in one timeline per customer, with the same few KPIs for every team.", "Chat, Anrufe, Formulare, E-Mails und Social Media in einer Zeitleiste pro Kunde, mit denselben wenigen KPIs für jedes Team.") },
  rules: { id: "rules" as PrincipleId, name: t("Every central interaction point has a response standard and an owner", "Jeder zentrale Interaktionspunkt hat einen Antwortstandard und einen Owner"), means: t("For each point it is written down how fast the answer comes, who gives it and when a person takes over.", "Für jeden Punkt ist festgelegt, wie schnell die Antwort kommt, wer sie gibt und wann ein Mensch übernimmt.") },
  owners: { id: "owners" as PrincipleId, name: t("Every KPI has an owner who can move it", "Jeder KPI hat einen Owner, der ihn bewegen kann"), means: t("Someone answers for each number and has the means to change it.", "Jemand steht für jede Zahl ein und hat die Mittel, sie zu ändern.") },
  review: { id: "review" as PrincipleId, name: t("A weekly feedback loop decides on every running measure", "Eine wöchentliche Feedbackschleife entscheidet über jede laufende Maßnahme"), means: t("Every week: which test to roll out, which to keep testing, which to stop, and what customers said.", "Jede Woche: welcher Test ausgerollt, welcher weiter getestet, welcher gestoppt wird, und was Kunden gesagt haben.") },
  hoard: { id: "hoard" as PrincipleId, name: t("Automate every contact, because the fastest answer always wins", "Jeden Kontakt automatisieren, weil die schnellste Antwort immer gewinnt"), means: t("A machine answers everything at once, day and night.", "Eine Maschine beantwortet alles sofort, Tag und Nacht.") },
  blackbox: { id: "blackbox" as PrincipleId, name: t("Wait for complete data before any real-time measure starts", "Auf vollständige Daten warten, bevor irgendeine Echtzeit-Maßnahme startet"), means: t("Only when every channel is tracked perfectly will the system act.", "Erst wenn jeder Kanal perfekt erfasst ist, handelt das System.") },
});
/** A real-time system needs both: one live view (so every team sees the same interaction) and response standards (so speed is not left to chance). */
export const PRINCIPLE_MUST: PrincipleId[] = ["defs", "rules"];
export const PRINCIPLE_TRAP: PrincipleId[] = ["hoard", "blackbox"];

/* ------------------------------------------------------------------ 3.2 · central interaction points */

export type SourceId = "pricing" | "quote" | "chat" | "onboarding" | "social" | "renewal" | "blog" | "careers";
export const SOURCE_IDS: SourceId[] = ["pricing", "quote", "chat", "onboarding", "social", "renewal", "blog", "careers"];
export type Use = "core" | "later" | "leave";
export const USE_LABEL = bi({ core: t("Central: real-time now", "Zentral: jetzt in Echtzeit"), later: t("Central: fix the tracking first", "Zentral: zuerst die Erfassung verbessern"), leave: t("Not central", "Nicht zentral") });
/** `decision` is the decision the customer takes at the point (null when none); `complete` is the share of interactions tracked there. */
export type Source = { id: SourceId; name: string; decision: string | null; complete: number; cost: number };
export const SOURCES: Source[] = bi([
  { id: "pricing" as SourceId, name: t("Pricing page", "Preisseite"), decision: t("Choose a plan, or leave", "Einen Tarif wählen, oder gehen"), complete: 90, cost: 8000 },
  { id: "quote" as SourceId, name: t("Quote request form", "Formular für Angebotsanfragen"), decision: t("Send a request, or abandon it", "Eine Anfrage senden, oder abbrechen"), complete: 95, cost: 5000 },
  { id: "chat" as SourceId, name: t("Live chat", "Live-Chat"), decision: t("Ask before buying", "Vor dem Kauf fragen"), complete: 85, cost: 6000 },
  { id: "onboarding" as SourceId, name: t("Onboarding e-mails in the first 30 days", "Onboarding-E-Mails in den ersten 30 Tagen"), decision: t("Start using the product, or not", "Das Produkt zu nutzen beginnen, oder nicht"), complete: 60, cost: 12000 },
  { id: "social" as SourceId, name: t("Questions on LinkedIn and Xing", "Fragen auf LinkedIn und Xing"), decision: t("Ask in public before buying", "Vor dem Kauf öffentlich fragen"), complete: 40, cost: 10000 },
  { id: "renewal" as SourceId, name: t("Renewal notice before the contract ends", "Verlängerungshinweis vor Vertragsende"), decision: t("Renew, or cancel", "Verlängern, oder kündigen"), complete: 50, cost: 9000 },
  { id: "blog" as SourceId, name: t("Blog articles", "Blogartikel"), decision: null, complete: 92, cost: 4000 },
  { id: "careers" as SourceId, name: t("Careers page", "Karriereseite"), decision: null, complete: 99, cost: 3000 },
]);
export const SOURCE_BY_ID = Object.fromEntries(SOURCES.map((s) => [s.id, s])) as Record<SourceId, Source>;
export const QUALITY_BAR = 80;
/** The rule of Materi B2: no customer decision at the point → not central; a decision and ≥ 80% tracked → real-time now; a decision but less tracked → fix the tracking first. */
export const useOf = (s: Source): Use => (!s.decision ? "leave" : s.complete >= QUALITY_BAR ? "core" : "later");

/* ------------------------------------------------------------------ 3.3 · a KPI system for management */

export type CompId = "conv" | "cv" | "engage" | "nps" | "churn" | "emails" | "followers" | "stories";
export const COMP_IDS: CompId[] = ["conv", "cv", "engage", "nps", "churn", "emails", "followers", "stories"];
export type Criterion = "explain" | "timely" | "reach" | "scale";
export const CRIT_IDS: Criterion[] = ["explain", "timely", "reach", "scale"];
export const CRITERIA = bi([
  { id: "explain" as Criterion, name: t("Link to value", "Verbindung zum Wert"), test: t("Does it move with deals, revenue or customers kept?", "Bewegt er sich mit Abschlüssen, Umsatz oder gehaltenen Kunden?"), low: t("It counts our activity or reach.", "Er zählt unsere Aktivität oder Reichweite."), high: t("It is, or leads directly to, deals or customers kept.", "Er ist Abschlüsse oder gehaltene Kunden, oder führt direkt dazu.") },
  { id: "timely" as Criterion, name: t("Early", "Früh"), test: t("How early does it show a change, before the deal is lost?", "Wie früh zeigt er eine Veränderung, bevor der Abschluss verloren ist?"), low: t("After the customer has left, or twice a year.", "Nachdem der Kunde gegangen ist, oder zweimal im Jahr."), high: t("Daily or faster.", "Täglich oder schneller.") },
  { id: "reach" as Criterion, name: t("Reach", "Reichweite"), test: t("Does it cover every customer and visitor?", "Deckt er jeden Kunden und Besucher ab?"), low: t("Some customers only.", "Nur einige Kunden."), high: t("Every customer.", "Jeden Kunden.") },
  { id: "scale" as Criterion, name: t("Measured automatically", "Automatisch gemessen"), test: t("Is it counted by the systems, without anyone collecting it?", "Wird er von den Systemen gezählt, ohne dass jemand ihn sammelt?"), low: t("Someone collects it by hand each time.", "Jemand sammelt ihn jedes Mal von Hand."), high: t("The systems count it by themselves.", "Die Systeme zählen ihn selbst.") },
]);
export type Cadence = "weekly" | "monthly" | "after" | "halfyear";
export type CostShape = "one-off" | "per customer" | "per analysis";
export type Comp = { id: CompId; name: string; what: string; explains: boolean; cadence: Cadence; coversAll: boolean; costShape: CostShape; model: Record<Criterion, Bucket>; note: string };
export const CADENCE_LABEL = bi({ weekly: t("live or daily", "live oder täglich"), monthly: t("monthly", "monatlich"), after: t("after the customer has left", "nachdem der Kunde gegangen ist"), halfyear: t("twice a year", "zweimal im Jahr") });
export const COST_SHAPE_LABEL = bi({ "one-off": t("counted by the systems", "von den Systemen gezählt"), "per customer": t("by a survey", "über eine Befragung"), "per analysis": t("collected by hand", "von Hand gesammelt") });
export const LINK_LABEL = bi({ yes: t("linked to value", "mit dem Wert verbunden"), no: t("not linked to value", "nicht mit dem Wert verbunden") });
export const COMPS: Comp[] = bi([
  { id: "conv" as CompId, name: t("Closing rate of quote requests", "Abschlussquote der Angebotsanfragen"), what: t("Deals ÷ quote requests, per channel.", "Abschlüsse ÷ Angebotsanfragen, pro Kanal."), explains: true, cadence: "weekly" as Cadence, coversAll: true, costShape: "one-off" as CostShape, model: { explain: 3, timely: 3, reach: 3, scale: 3 }, note: t("The result the brief is about, counted daily by the CRM.", "Das Ergebnis, um das es im Auftrag geht, täglich vom CRM gezählt.") },
  { id: "cv" as CompId, name: t("First response time", "Erste Antwortzeit"), what: t("Minutes from a chat, form or social media question to the first real answer.", "Minuten von einer Chat-, Formular- oder Social-Media-Frage bis zur ersten echten Antwort."), explains: true, cadence: "weekly" as Cadence, coversAll: true, costShape: "one-off" as CostShape, model: { explain: 3, timely: 3, reach: 3, scale: 3 }, note: t("The driver the brief names (responses too slow): it moves live, for every request, and last quarter's data link it to closings.", "Der Treiber, den der Auftrag nennt (Antworten zu langsam): Er bewegt sich live, für jede Anfrage, und die Daten des letzten Quartals verbinden ihn mit Abschlüssen.") },
  { id: "engage" as CompId, name: t("Interaction rate on decision pages", "Interaktionsrate auf Entscheidungsseiten"), what: t("Share of visitors to pricing and quote pages who start a chat or send a request.", "Anteil der Besucher von Preis- und Angebotsseite, die einen Chat beginnen oder eine Anfrage senden."), explains: true, cadence: "weekly" as Cadence, coversAll: true, costShape: "one-off" as CostShape, model: { explain: 3, timely: 3, reach: 3, scale: 3 }, note: t("The earliest customer signal: it rises or falls the same day a page changes.", "Das früheste Kundensignal: Es steigt oder fällt am selben Tag, an dem sich eine Seite ändert.") },
  { id: "nps" as CompId, name: t("Satisfaction score from a survey", "Zufriedenheitswert aus einer Befragung"), what: t("How satisfied customers say they are; about 20% answer.", "Wie zufrieden Kunden nach eigener Aussage sind; etwa 20 % antworten."), explains: true, cadence: "halfyear" as Cadence, coversAll: false, costShape: "per customer" as CostShape, model: { explain: 3, timely: 1, reach: 2, scale: 2 }, note: t("Linked to value, but twice a year is far from real time.", "Mit dem Wert verbunden, aber zweimal im Jahr ist weit von Echtzeit entfernt.") },
  { id: "churn" as CompId, name: t("Cancellations per quarter", "Kündigungen pro Quartal"), what: t("Customers who cancelled in the quarter.", "Kunden, die im Quartal gekündigt haben."), explains: true, cadence: "after" as Cadence, coversAll: true, costShape: "one-off" as CostShape, model: { explain: 3, timely: 1, reach: 3, scale: 3 }, note: t("Counts the loss exactly, after it is too late to act.", "Zählt den Verlust genau, wenn es zu spät zum Handeln ist.") },
  { id: "emails" as CompId, name: t("Website visitors", "Website-Besucher"), what: t("Visitors per day.", "Besucher pro Tag."), explains: false, cadence: "weekly" as Cadence, coversAll: true, costShape: "one-off" as CostShape, model: { explain: 1, timely: 3, reach: 3, scale: 3 }, note: t("Live and automatic, and it rose while closings did not.", "Live und automatisch, und sie stiegen, während die Abschlüsse es nicht taten.") },
  { id: "followers" as CompId, name: t("Social media followers", "Social-Media-Follower"), what: t("Followers of LiveConnect's company pages.", "Follower der Unternehmensseiten von LiveConnect."), explains: false, cadence: "weekly" as Cadence, coversAll: false, costShape: "one-off" as CostShape, model: { explain: 1, timely: 3, reach: 2, scale: 3 }, note: t("Reach among whoever follows, not the behaviour of buyers.", "Reichweite bei denen, die folgen, nicht das Verhalten von Käufern.") },
  { id: "stories" as CompId, name: t("Sales team's monthly success stories", "Monatliche Erfolgsgeschichten des Vertriebs"), what: t("Each month, salespeople report the chats that turned into deals.", "Jeden Monat berichten Vertriebsleute die Chats, die zu Abschlüssen wurden."), explains: false, cadence: "monthly" as Cadence, coversAll: false, costShape: "per analysis" as CostShape, model: { explain: 1, timely: 2, reach: 2, scale: 1 }, note: t("Vivid, but it counts the wins someone chose to tell, without a comparison.", "Anschaulich, aber sie zählt die Erfolge, die jemand erzählen wollte, ohne Vergleich.") },
]);
export const COMP_BY_ID = Object.fromEntries(COMPS.map((c) => [c.id, c])) as Record<CompId, Comp>;
export const COMP_CHOOSE = 3;
export const MODEL_COMPS: CompId[] = ["conv", "cv", "engage"];
export const MODEL_GREATEST: CompId = "cv";
export function maxRating(id: CompId, c: Criterion): Bucket {
  const x = COMP_BY_ID[id];
  if (c === "explain") return x.explains ? 3 : 1;
  if (c === "timely") return x.cadence === "weekly" ? 3 : x.cadence === "monthly" ? 2 : 1;
  if (c === "reach") return x.coversAll ? 3 : 2;
  return x.costShape === "one-off" ? 3 : x.costShape === "per customer" ? 2 : 1;
}
export const isEarly = (id: CompId) => COMP_BY_ID[id].cadence === "weekly" || COMP_BY_ID[id].cadence === "monthly";

/* ------------------------------------------------------------------ 3.4 · the optimisation loop: roll out, keep testing, stop */

export type SitId = "reco" | "renewal" | "botname" | "subject" | "price" | "winback";
export const SIT_IDS: SitId[] = ["reco", "renewal", "botname", "subject", "price", "winback"];
export type Action = "intervene" | "watch" | "none";
export const ACTION_LABEL = bi({ intervene: t("Roll out", "Ausrollen"), watch: t("Keep testing", "Weiter testen"), none: t("Stop", "Stoppen") });
export type LogicOwner = "csm" | "sales" | "data" | "nobody";
export const LOGIC_OWNERS: LogicOwner[] = ["csm", "sales", "data", "nobody"];
export const LOGIC_OWNER_LABEL = bi({ csm: t("Marketing", "Marketing"), sales: t("Sales", "Vertrieb"), data: t("Data team", "Datenteam"), nobody: t("No one (stopped)", "Niemand (gestoppt)") });
export type Situation = { id: SitId; signal: string; lift: number; cases: number; revenue: number; note: string };
export const SITUATIONS: Situation[] = bi([
  { id: "reco" as SitId, signal: t("Chat opens after 30 seconds on the pricing page", "Chat öffnet nach 30 Sekunden auf der Preisseite"), lift: 45, cases: 180, revenue: 210000, note: t("“Not helpful” ratings unchanged.", "„Nicht hilfreich“-Bewertungen unverändert.") },
  { id: "renewal" as SitId, signal: t("Personal start page for returning customers", "Persönliche Startseite für wiederkehrende Kunden"), lift: 22, cases: 50, revenue: 60000, note: t("Few returning customers in the test weeks.", "In den Testwochen wenige wiederkehrende Kunden.") },
  { id: "botname" as SitId, signal: t("Exit pop-up with a 10% discount", "Exit-Pop-up mit 10 % Rabatt"), lift: 2, cases: 500, revenue: 5000, note: t("Many clicks, almost no extra requests.", "Viele Klicks, fast keine zusätzlichen Anfragen.") },
  { id: "subject" as SitId, signal: t("Industry case studies on the landing pages", "Branchen-Fallstudien auf den Landingpages"), lift: 7, cases: 260, revenue: 35000, note: t("A small, steady difference.", "Ein kleiner, stabiler Unterschied.") },
  { id: "price" as SitId, signal: t("Dynamic price shown to returning visitors", "Dynamischer Preis für wiederkehrende Besucher"), lift: -5, cases: 140, revenue: -15000, note: t("Three complaints about changing prices.", "Drei Beschwerden über wechselnde Preise.") },
  { id: "winback" as SitId, signal: t("Callback within 15 minutes after a quote request", "Rückruf innerhalb von 15 Minuten nach einer Angebotsanfrage"), lift: 35, cases: 110, revenue: 95000, note: t("Guardrail: no complaints.", "Guardrail: keine Beschwerden.") },
]);
export const SIT_BY_ID = Object.fromEntries(SITUATIONS.map((s) => [s.id, s])) as Record<SitId, Situation>;
export const LIFT_ACT = 10;
export const LIFT_WATCH = 3;
export const CASES_MIN = 100;
export const actionOf = (s: Situation): Action => (s.lift >= LIFT_ACT && s.cases >= CASES_MIN ? "intervene" : s.lift >= LIFT_WATCH ? "watch" : "none");
export const OWNER_ACCEPT_LOGIC: Record<SitId, LogicOwner[]> = { reco: ["csm"], renewal: ["data"], botname: ["nobody"], subject: ["data"], price: ["nobody"], winback: ["sales"] };
export type LogicRow = { action: Action | null; owner: LogicOwner | null };

/* ------------------------------------------------------------------ 3.5 · prioritised implementation architecture */

export type ArchId = "foundation" | "chat" | "personal" | "routing" | "training" | "tracking" | "suite" | "relaunch";
export const ARCH_IDS: ArchId[] = ["foundation", "chat", "personal", "routing", "training", "tracking", "suite", "relaunch"];
export type ArchItem = { id: ArchId; name: string; what: string; cost: number; weeks: number; blackBox: boolean };
export const ARCH: ArchItem[] = bi([
  { id: "foundation" as ArchId, name: t("Live interaction view and real-time KPI system", "Live-Interaktionssicht und Echtzeit-KPI-System"), what: t("Chat, form, call and social media interactions joined per customer, with the three KPIs on one live screen.", "Chat-, Formular-, Anruf- und Social-Media-Interaktionen pro Kunde verbunden, mit den drei KPIs auf einem Live-Bildschirm."), cost: 40000, weeks: 6, blackBox: false },
  { id: "chat" as ArchId, name: t("Chatbot and live chat on the decision pages", "Chatbot und Live-Chat auf den Entscheidungsseiten"), what: t("Immediate answers on the pricing page and the quote form, with a hand-over to sales within two minutes.", "Sofortige Antworten auf der Preisseite und im Angebotsformular, mit Übergabe an den Vertrieb innerhalb von zwei Minuten."), cost: 40000, weeks: 4, blackBox: false },
  { id: "personal" as ArchId, name: t("Real-time personalisation for known visitors", "Echtzeit-Personalisierung für bekannte Besucher"), what: t("Content that fits logged-in customers and campaign visitors, with the reason visible to the team.", "Inhalte, die zu angemeldeten Kunden und Kampagnenbesuchern passen, mit für das Team sichtbarem Grund."), cost: 45000, weeks: 8, blackBox: false },
  { id: "routing" as ArchId, name: t("Response standards and routing", "Antwortstandards und Weiterleitung"), what: t("Who answers which interaction point within how long, and when a person takes over.", "Wer welchen Interaktionspunkt innerhalb welcher Zeit beantwortet, und wann ein Mensch übernimmt."), cost: 15000, weeks: 3, blackBox: false },
  { id: "training" as ArchId, name: t("Real-time selling training for the sales team", "Echtzeit-Vertriebstraining für das Vertriebsteam"), what: t("How to take over a chat, answer within minutes and read the live screen.", "Wie man einen Chat übernimmt, innerhalb von Minuten antwortet und den Live-Bildschirm liest."), cost: 20000, weeks: 3, blackBox: false },
  { id: "tracking" as ArchId, name: t("Tracking and consent clean-up", "Bereinigung von Erfassung und Einwilligung"), what: t("Closes the tracking gaps on onboarding, renewal and social media, within what customers have consented to.", "Schließt die Erfassungslücken bei Onboarding, Verlängerung und Social Media, im Rahmen dessen, wozu Kunden eingewilligt haben."), cost: 20000, weeks: 4, blackBox: false },
  { id: "suite" as ArchId, name: t("All-in-one AI experience platform", "All-in-one-KI-Experience-Plattform"), what: t("A vendor platform that runs chat, content and offers by itself; its rules and results are not shown.", "Eine Anbieterplattform, die Chat, Inhalte und Angebote selbst steuert; ihre Regeln und Ergebnisse werden nicht gezeigt."), cost: 90000, weeks: 14, blackBox: true },
  { id: "relaunch" as ArchId, name: t("Website relaunch", "Relaunch der Website"), what: t("A new design for every page.", "Ein neues Design für jede Seite."), cost: 80000, weeks: 16, blackBox: false },
]);
export const ARCH_BY_ID = Object.fromEntries(ARCH.map((a) => [a.id, a])) as Record<ArchId, ArchItem>;
export const BASELINE_ITEM: ArchId = "foundation";

export type OwnerId = "cdo" | "datalead" | "cslead" | "saleslead" | "it";
export const OWNER_IDS: OwnerId[] = ["cdo", "datalead", "cslead", "saleslead", "it"];
export const OWNERS = bi({
  cdo: { name: t("Chief Digital Officer (you)", "Chief Digital Officer (Sie)"), profile: t("Decides across teams and answers to the board. Should hold few items.", "Entscheidet über Teams hinweg und berichtet an den Vorstand. Sollte wenige Punkte halten.") },
  datalead: { name: t("Head of Data & Analytics", "Leitung Data & Analytics"), profile: t("Owns the data, the KPIs and their definitions, the live screen and the test routine.", "Verantwortet die Daten, die KPIs und ihre Definitionen, den Live-Bildschirm und die Test-Routine.") },
  cslead: { name: t("Head of Marketing", "Marketingleitung"), profile: t("Owns the website, the chat content, the campaigns and the social media pages.", "Verantwortet die Website, die Chat-Inhalte, die Kampagnen und die Social-Media-Seiten.") },
  saleslead: { name: t("Head of Sales", "Vertriebsleitung"), profile: t("Leads the salespeople who take over chats, call back and close.", "Führt die Vertriebsleute, die Chats übernehmen, zurückrufen und abschließen.") },
  it: { name: t("Head of IT", "IT-Leitung"), profile: t("Owns the systems, the interfaces between them, tracking and consent.", "Verantwortet die Systeme, die Schnittstellen dazwischen, Erfassung und Einwilligung.") },
});
export const OWNER_ACCEPT: Record<ArchId, OwnerId[]> = {
  foundation: ["datalead", "it"],
  chat: ["cslead", "saleslead"],
  personal: ["cslead", "datalead"],
  routing: ["saleslead", "cdo"],
  training: ["saleslead"],
  tracking: ["it", "datalead"],
  suite: ["cdo", "cslead"],
  relaunch: ["cslead"],
};
export const MODEL_ARCH: ArchId[] = ["foundation", "chat", "personal", "routing", "training", "tracking"];
export const MODEL_START: Partial<Record<ArchId, number>> = { foundation: 1, chat: 1, routing: 1, tracking: 1, personal: 2, training: 2 };
export const MODEL_TRIGGER = bi({
  foundation: t("If the live screen does not show response time, interaction and closings for every channel by the end of month 1, the personalisation waits until it does.", "Zeigt der Live-Bildschirm bis Ende Monat 1 nicht Antwortzeit, Interaktion und Abschlüsse für jeden Kanal, wartet die Personalisierung, bis er es tut."),
  chat: t("If more than 20% of chats are rated “not helpful” in any week, marketing rewrites the five worst answers before the chat is widened.", "Werden in einer Woche mehr als 20 % der Chats als „nicht hilfreich“ bewertet, schreibt das Marketing die fünf schlechtesten Antworten neu, bevor der Chat ausgeweitet wird."),
  personal: t("If the interaction rate of personalised pages is not at least 1.2 times the standard pages' on 100 interactions per group by month 3, the rules are changed before any rollout.", "Liegt die Interaktionsrate personalisierter Seiten bis Monat 3 bei 100 Interaktionen pro Gruppe nicht bei mindestens dem 1,2-Fachen der Standardseiten, werden die Regeln vor jedem Rollout geändert."),
  routing: t("If the first response time on decision pages is above 5 minutes in any week, the Head of Sales moves a second person onto the chat.", "Liegt die erste Antwortzeit auf Entscheidungsseiten in einer Woche über 5 Minuten, setzt die Vertriebsleitung eine zweite Person auf den Chat."),
  training: t("If fewer than 80% of chat hand-overs are taken within two minutes by month 2, the training is repeated in the team.", "Werden bis Monat 2 weniger als 80 % der Chat-Übergaben innerhalb von zwei Minuten angenommen, wird das Training im Team wiederholt."),
  tracking: t("If tracking on onboarding and renewal is still below 80% by month 3, those points stay out of the real-time system this half-year.", "Liegt die Erfassung bei Onboarding und Verlängerung bis Monat 3 noch unter 80 %, bleiben diese Punkte dieses Halbjahr außerhalb des Echtzeitsystems."),
});

/* ------------------------------------------------------------------ 3.6 · a decision under time pressure and uncertain data */

export type DecisionId = "commit" | "stage" | "wait";
export const DECISIONS = bi([
  { id: "commit" as DecisionId, label: t("Launch everything at once in month 1", "Alles auf einmal in Monat 1 starten"), detail: t("Buy the all-in-one platform, switch on chat, personalisation and offers everywhere, and relaunch the site in parallel.", "Die All-in-one-Plattform kaufen, Chat, Personalisierung und Angebote überall einschalten und parallel die Website neu starten."), why: t("Fast on paper, and it defends only if the platform works on LiveConnect's incomplete data from day one.", "Auf dem Papier schnell, und nur vertretbar, wenn die Plattform vom ersten Tag an mit den unvollständigen Daten von LiveConnect funktioniert."), rejected: t("The budget is spent before any KPI shows what works, and the relaunch and the platform take longer than the four months.", "Das Budget ist ausgegeben, bevor ein KPI zeigt, was wirkt, und Relaunch und Plattform brauchen länger als die vier Monate.") },
  { id: "stage" as DecisionId, label: t("Decide now: fix the slowest decision points first, with a tripwire", "Jetzt entscheiden: zuerst die langsamsten Entscheidungspunkte beheben, mit Tripwire"), detail: t("Start in month 1 with the live view, the chat and response standards on the well-tracked decision pages; add personalisation in month 2; scale only if the tripwire is met.", "In Monat 1 mit Live-Sicht, Chat und Antwortstandards auf den gut erfassten Entscheidungsseiten starten; in Monat 2 die Personalisierung ergänzen; nur skalieren, wenn der Tripwire erreicht ist."), why: t("It acts within weeks where the data is good enough and the delay costs most, and it measures before it spends the rest.", "Es handelt innerhalb von Wochen dort, wo die Daten gut genug sind und die Verzögerung am meisten kostet, und misst, bevor es den Rest ausgibt."), rejected: t("", "") },
  { id: "wait" as DecisionId, label: t("Wait until the data is complete", "Warten, bis die Daten vollständig sind"), detail: t("Spend the four months on tracking every channel before any real-time measure starts.", "Die vier Monate damit verbringen, jeden Kanal zu erfassen, bevor irgendeine Echtzeit-Maßnahme startet."), why: t("", ""), rejected: t("The brief asks for a decision under time pressure. Waiting keeps every answer slow for four more months, while the decision pages are already tracked well enough.", "Der Auftrag verlangt eine Entscheidung unter Zeitdruck. Warten hält jede Antwort vier weitere Monate langsam, obwohl die Entscheidungsseiten schon gut genug erfasst sind.") },
]);
export const MODEL_DECISION: DecisionId = "stage";

export type KpiId = "conv" | "engage" | "cv" | "dashboards" | "emails";
export const KPIS = bi([
  { id: "conv" as KpiId, label: t("Closing rate of quote requests", "Abschlussquote der Angebotsanfragen"), unit: "%", baseline: 6, better: "up" as const, behaviour: true },
  { id: "engage" as KpiId, label: t("Interaction rate on decision pages", "Interaktionsrate auf Entscheidungsseiten"), unit: "%", baseline: 2, better: "up" as const, behaviour: true },
  { id: "cv" as KpiId, label: t("First response time", "Erste Antwortzeit"), unit: t("minutes", "Minuten"), baseline: 240, better: "down" as const, behaviour: false },
  { id: "dashboards" as KpiId, label: t("Live screens in use", "Genutzte Live-Bildschirme"), unit: t("screens", "Bildschirme"), baseline: 1, better: "up" as const, behaviour: false },
  { id: "emails" as KpiId, label: t("Social media posts per month", "Social-Media-Posts pro Monat"), unit: t("posts", "Posts"), baseline: 40, better: "up" as const, behaviour: false },
]);
export const KPI_BY_ID = Object.fromEntries(KPIS.map((k) => [k.id, k])) as Record<KpiId, (typeof KPIS)[number]>;
export const MODEL_TRIPWIRE = { kpi: "conv" as KpiId, threshold: 9, month: 4 };
export const R2_BASELINE_NOTE = bi({ v: t("Baselines are Case assumptions from LiveConnect's CRM, website and chat data of the last twelve months.", "Die Ausgangswerte sind Fallannahmen aus den CRM-, Website- und Chatdaten von LiveConnect der letzten zwölf Monate.") });
export const BOARD_CHALLENGE = bi({
  v: t(
    "It is month 2. The chat is live: the first response time fell from 4 hours to 2 minutes, but the closing rate only rose from 6.0% to 6.3%, and 20% of chats are rated “not helpful”. The Head of Sales wants to switch the chatbot off and hire two more callers; marketing wants to buy the all-in-one AI platform. The board asks what you do.",
    "Es ist Monat 2. Der Chat läuft: Die erste Antwortzeit fiel von 4 Stunden auf 2 Minuten, aber die Abschlussquote stieg nur von 6,0 % auf 6,3 %, und 20 % der Chats werden als „nicht hilfreich“ bewertet. Die Vertriebsleitung will den Chatbot abschalten und zwei weitere Anrufer einstellen; das Marketing will die All-in-one-KI-Plattform kaufen. Der Vorstand fragt, was Sie tun.",
  ),
});
