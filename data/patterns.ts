import { bi, t } from "@/lib/lang";

/**
 * Task 1 · Blocks 2.1–2.3. Four kinds of metric (Materi A5) and twelve metrics LiveConnect reports today, each with whether it moved
 * together with customer value last year; the A/B test card of Block 2.3 (Materi A6). (Identifiers keep the names of the file this was
 * built from: a "pattern" is a kind of metric, a "record" is one metric, and the outcome "left" means "moved with customer value".)
 * Every figure is a Case assumption. `truth` is never printed outside the mentor answer key. Counts are 3/3/3/3.
 */
export type PatternId = "outcome" | "driver" | "guardrail" | "vanity";
export const PATTERN_IDS: PatternId[] = ["outcome", "driver", "guardrail", "vanity"];

export const PATTERNS = bi({
  outcome: {
    id: "outcome" as PatternId,
    label: t("Outcome KPI", "Outcome-KPI"),
    means: t("The result the business is paid for: closed deals, revenue, customers kept. It moves last.", "Das Ergebnis, für das das Unternehmen bezahlt wird: Abschlüsse, Umsatz, gehaltene Kunden. Es bewegt sich zuletzt."),
    shape: t("the top of the tree", "die Spitze des Baums"),
    test: t("Is it money, deals or customers won or kept?", "Ist es Geld, Abschlüsse oder gewonnene oder gehaltene Kunden?"),
  },
  driver: {
    id: "driver" as PatternId,
    label: t("Driver KPI", "Treiber-KPI"),
    means: t("Something that comes before the result and that a team can move this week: how fast we answer, how many visitors start a conversation, how long they stay on a decision page.", "Etwas, das vor dem Ergebnis kommt und das ein Team diese Woche bewegen kann: wie schnell wir antworten, wie viele Besucher ein Gespräch beginnen, wie lange sie auf einer Entscheidungsseite bleiben."),
    shape: t("a branch under the top", "ein Ast unter der Spitze"),
    test: t("Does it come before the deal or the renewal, and can a team change it this week?", "Kommt es vor dem Abschluss oder der Verlängerung, und kann ein Team es diese Woche ändern?"),
  },
  guardrail: {
    id: "guardrail" as PatternId,
    label: t("Guardrail", "Guardrail (Leitplanke)"),
    means: t("Something that must not get worse while you push for speed: unhelpful chats, pushy pop-ups, customers who have to repeat themselves.", "Etwas, das nicht schlechter werden darf, während Sie auf Tempo drängen: nicht hilfreiche Chats, aufdringliche Pop-ups, Kunden, die sich wiederholen müssen."),
    shape: t("a fence beside the tree", "ein Zaun neben dem Baum"),
    test: t("Would you stop a measure if this got worse, even while requests rise?", "Würden Sie eine Maßnahme stoppen, wenn das schlechter wird, auch wenn die Anfragen steigen?"),
  },
  vanity: {
    id: "vanity" as PatternId,
    label: t("Vanity metric", "Vanity Metric"),
    means: t("Counts our own activity or reach: visitors, posts published, pop-ups shown. Looks like progress, decides nothing.", "Zählt unsere eigene Aktivität oder Reichweite: Besucher, veröffentlichte Posts, gezeigte Pop-ups. Sieht nach Fortschritt aus, entscheidet nichts."),
    shape: t("outside the tree", "außerhalb des Baums"),
    test: t("Does it count what we did or how many passed by, rather than what customers did?", "Zählt es, was wir taten oder wie viele vorbeikamen, statt was Kunden taten?"),
  },
});

export const PATTERN_PAIR_TESTS = bi([
  { pair: t("Outcome or driver?", "Outcome oder Treiber?"), test: t("Ask whether it is the result itself (money, deals, customers kept) or something that leads to it. The result moves last; the driver moves first.", "Fragen Sie, ob es das Ergebnis selbst ist (Geld, Abschlüsse, gehaltene Kunden) oder etwas, das dazu führt. Das Ergebnis bewegt sich zuletzt; der Treiber zuerst.") },
  { pair: t("Driver or vanity?", "Treiber oder Vanity?"), test: t("Visitors and posts rise without anyone buying. A driver is closer to the deal: an answer given, a conversation started, a request sent.", "Besucher und Posts steigen, ohne dass jemand kauft. Ein Treiber ist näher am Abschluss: eine gegebene Antwort, ein begonnenes Gespräch, eine gesendete Anfrage.") },
  { pair: t("Guardrail or driver?", "Guardrail oder Treiber?"), test: t("A driver is pushed; a guardrail is only watched so that it does not get worse. You would never set a target to raise unhelpful chats.", "Ein Treiber wird vorangetrieben; eine Guardrail wird nur beobachtet, damit sie nicht schlechter wird. Niemand setzt ein Ziel, nicht hilfreiche Chats zu erhöhen.") },
]);

export type RecId = "p01" | "p02" | "p03" | "p04" | "p05" | "p06" | "p07" | "p08" | "p09" | "p10" | "p11" | "p12";
/** outcome "left" = moved with customer value last year; "stayed" = did not move with it. */
export type Record_ = { id: RecId; code: string; text: string; outcome: "stayed" | "left"; truth: PatternId; clue: string; why: string; rejected: Partial<Record<PatternId, string>> };
export const OUTCOME_LABEL = bi({ stayed: t("Did not move with customer value", "Bewegte sich nicht mit dem Kundenwert"), left: t("Moved with customer value", "Bewegte sich mit dem Kundenwert") });

export const RECORDS: Record_[] = bi([
  { id: "p01" as RecId, code: "M-01", outcome: "left" as const, text: t("Closing rate of quote requests: deals ÷ requests.", "Abschlussquote der Angebotsanfragen: Abschlüsse ÷ Anfragen."), truth: "outcome" as PatternId, clue: t("Does it count deals, or something that comes before a deal?", "Zählt es Abschlüsse, oder etwas, das vor einem Abschluss kommt?"), why: t("It counts closed deals, the result LiveConnect is paid for: an outcome KPI.", "Es zählt Abschlüsse, das Ergebnis, für das LiveConnect bezahlt wird: ein Outcome-KPI."), rejected: { driver: t("A request comes before a deal; this one counts the deal itself.", "Eine Anfrage kommt vor einem Abschluss; diese zählt den Abschluss selbst.") } },
  { id: "p02" as RecId, code: "M-02", outcome: "left" as const, text: t("Revenue from online leads per month.", "Umsatz aus Online-Leads pro Monat."), truth: "outcome" as PatternId, clue: t("Is this money, or a behaviour that may lead to money?", "Ist das Geld, oder ein Verhalten, das zu Geld führen kann?"), why: t("Revenue is money: an outcome KPI, and it moves last.", "Umsatz ist Geld: ein Outcome-KPI, und er bewegt sich zuletzt."), rejected: { driver: t("Nobody can raise revenue this week directly; it follows the drivers.", "Niemand kann den Umsatz diese Woche direkt erhöhen; er folgt den Treibern.") } },
  { id: "p03" as RecId, code: "M-03", outcome: "left" as const, text: t("Share of new customers who renew after the first year.", "Anteil der Neukunden, die nach dem ersten Jahr verlängern."), truth: "outcome" as PatternId, clue: t("Customers kept: result or step on the way?", "Gehaltene Kunden: Ergebnis oder Schritt auf dem Weg?"), why: t("Customers kept are a result: an outcome KPI.", "Gehaltene Kunden sind ein Ergebnis: ein Outcome-KPI."), rejected: { guardrail: t("Renewals are pushed up, not only watched.", "Verlängerungen werden nach oben getrieben, nicht nur beobachtet.") } },
  { id: "p04" as RecId, code: "M-04", outcome: "left" as const, text: t("First response time to chats and quote requests (minutes).", "Erste Antwortzeit auf Chats und Angebotsanfragen (Minuten)."), truth: "driver" as PatternId, clue: t("Does it come before the deal, and can a team move it this week?", "Kommt es vor dem Abschluss, und kann ein Team es diese Woche bewegen?"), why: t("Speed of the first answer comes before the deal and the team can change it at once: a driver KPI.", "Das Tempo der ersten Antwort kommt vor dem Abschluss, und das Team kann es sofort ändern: ein Treiber-KPI."), rejected: { vanity: t("It is not reach or activity; it decides whether the customer is still interested when we answer.", "Es ist keine Reichweite oder Aktivität; es entscheidet, ob der Kunde noch interessiert ist, wenn wir antworten.") } },
  { id: "p05" as RecId, code: "M-05", outcome: "left" as const, text: t("Share of visitors to the pricing page who start a chat or request a quote.", "Anteil der Besucher der Preisseite, die einen Chat beginnen oder ein Angebot anfragen."), truth: "driver" as PatternId, clue: t("A customer action on the way to a deal. Is it the deal?", "Eine Kundenhandlung auf dem Weg zum Abschluss. Ist es der Abschluss?"), why: t("Visitors interact before they buy, and the page can be improved: a driver KPI.", "Besucher interagieren, bevor sie kaufen, und die Seite lässt sich verbessern: ein Treiber-KPI."), rejected: { outcome: t("A started chat is not yet a deal.", "Ein begonnener Chat ist noch kein Abschluss.") } },
  { id: "p06" as RecId, code: "M-06", outcome: "stayed" as const, text: t("Average time visitors spend on the pricing page.", "Durchschnittliche Verweildauer der Besucher auf der Preisseite."), truth: "driver" as PatternId, clue: t("Tag what it measures, not whether it moved. Whose behaviour, and on which page?", "Ordnen Sie zu, was es misst, nicht ob es sich bewegte. Wessen Verhalten, und auf welcher Seite?"), why: t("Time on a decision page is a customer behaviour before the deal that the page can change: a driver KPI. It did not move with value last year, which is a finding, not another kind.", "Zeit auf einer Entscheidungsseite ist ein Kundenverhalten vor dem Abschluss, das die Seite ändern kann: ein Treiber-KPI. Es bewegte sich letztes Jahr nicht mit dem Wert; das ist ein Befund, keine andere Art."), rejected: { vanity: t("Customers spend the time, not LiveConnect; that makes it more than reach.", "Kunden verbringen die Zeit, nicht LiveConnect; das macht es zu mehr als Reichweite.") } },
  { id: "p07" as RecId, code: "M-07", outcome: "left" as const, text: t("Share of chats the customer rates “not helpful”.", "Anteil der Chats, die der Kunde als „nicht hilfreich“ bewertet."), truth: "guardrail" as PatternId, clue: t("Would anyone set a target to raise it, or only watch that it does not rise?", "Würde jemand ein Ziel setzen, es zu erhöhen, oder nur darauf achten, dass es nicht steigt?"), why: t("A fast answer that does not help is worse than none: a guardrail for the chat.", "Eine schnelle Antwort, die nicht hilft, ist schlechter als keine: eine Guardrail für den Chat."), rejected: { driver: t("Nobody pushes unhelpful chats up; you watch them as a limit.", "Niemand treibt nicht hilfreiche Chats nach oben; man beobachtet sie als Grenze.") } },
  { id: "p08" as RecId, code: "M-08", outcome: "stayed" as const, text: t("Complaints about pushy pop-ups per 1,000 visits.", "Beschwerden über aufdringliche Pop-ups pro 1.000 Besuche."), truth: "guardrail" as PatternId, clue: t("If this rose while requests rose, would you stop?", "Würden Sie stoppen, wenn das stiege, während die Anfragen steigen?"), why: t("A limit on real-time offers: if pop-ups annoy, speed turns against the customer. A guardrail.", "Eine Grenze für Echtzeit-Angebote: Stören die Pop-ups, wendet sich das Tempo gegen den Kunden. Eine Guardrail."), rejected: { outcome: t("It is not the result LiveConnect is paid for; it is what must not get worse.", "Es ist nicht das Ergebnis, für das LiveConnect bezahlt wird; es ist, was nicht schlechter werden darf.") } },
  { id: "p09" as RecId, code: "M-09", outcome: "stayed" as const, text: t("Share of hand-overs from the chatbot where the customer has to repeat the question.", "Anteil der Übergaben vom Chatbot, bei denen der Kunde die Frage wiederholen muss."), truth: "guardrail" as PatternId, clue: t("Is this a result, something you push, or a limit you watch?", "Ist das ein Ergebnis, etwas, das Sie vorantreiben, oder eine Grenze, die Sie beobachten?"), why: t("A limit on automation: when customers repeat themselves, the fast channel wastes their time. A guardrail.", "Eine Grenze für die Automatisierung: Müssen sich Kunden wiederholen, verschwendet der schnelle Kanal ihre Zeit. Eine Guardrail."), rejected: { vanity: t("It says something about the customer's experience, not about LiveConnect's activity.", "Es sagt etwas über das Erlebnis der Kunden, nicht über die Aktivität von LiveConnect.") } },
  { id: "p10" as RecId, code: "M-10", outcome: "stayed" as const, text: t("Website visitors per month.", "Website-Besucher pro Monat."), truth: "vanity" as PatternId, clue: t("Visitors came. Did anyone do anything?", "Besucher kamen. Hat jemand etwas getan?"), why: t("Reach: visitors rose last year while deals did not. A vanity metric.", "Reichweite: Die Besucher stiegen letztes Jahr, die Abschlüsse nicht. Eine Vanity Metric."), rejected: { driver: t("Arriving is not acting; the high bounce rate shows how many leave at once.", "Ankommen ist nicht Handeln; die hohe Absprungrate zeigt, wie viele sofort gehen.") } },
  { id: "p11" as RecId, code: "M-11", outcome: "stayed" as const, text: t("Social media posts published per month.", "Veröffentlichte Social-Media-Posts pro Monat."), truth: "vanity" as PatternId, clue: t("Who acted: customers, or LiveConnect?", "Wer hat gehandelt: Kunden oder LiveConnect?"), why: t("It counts LiveConnect's own activity: a vanity metric. The answers to customers' questions are what count (M-04).", "Es zählt die eigene Aktivität von LiveConnect: eine Vanity Metric. Was zählt, sind die Antworten auf Kundenfragen (M-04)."), rejected: { driver: t("Posting is what LiveConnect does; a driver is closer to what customers do.", "Posten ist, was LiveConnect tut; ein Treiber ist näher an dem, was Kunden tun.") } },
  { id: "p12" as RecId, code: "M-12", outcome: "stayed" as const, text: t("Pop-ups shown per day.", "Gezeigte Pop-ups pro Tag."), truth: "vanity" as PatternId, clue: t("Does showing something count what customers did?", "Zählt das Zeigen, was Kunden taten?"), why: t("It counts what the system displayed: a vanity metric.", "Es zählt, was das System anzeigte: eine Vanity Metric."), rejected: { guardrail: t("The complaints about pop-ups are the limit (M-08); the number shown is only activity.", "Die Beschwerden über Pop-ups sind die Grenze (M-08); die gezeigte Zahl ist nur Aktivität.") } },
]);
export const REC_IDS: RecId[] = ["p01", "p02", "p03", "p04", "p05", "p06", "p07", "p08", "p09", "p10", "p11", "p12"];
export const REC_BY_ID = Object.fromEntries(RECORDS.map((r) => [r.id, r])) as Record<RecId, Record_>;

const zero = () => ({ outcome: 0, driver: 0, guardrail: 0, vanity: 0 }) as Record<PatternId, number>;
export const TRUTH_COUNTS: Record<PatternId, number> = RECORDS.reduce((o, x) => ({ ...o, [x.truth]: o[x.truth] + 1 }), zero());
export const TRUTH_LEFT: Record<PatternId, number> = RECORDS.reduce((o, x) => ({ ...o, [x.truth]: o[x.truth] + (x.outcome === "left" ? 1 : 0) }), zero());

/* ------------------------------------------------------------------ Block 2.2 · link to value, what each kind tells management, how to use it */

export type Risk = "high" | "mid" | "low";
export const RISK_LABEL = bi({ high: t("Strong", "Stark"), mid: t("Partial", "Teilweise"), low: t("None", "Keine") });
export const RISK_GLYPH: Record<Risk, string> = { high: "●", mid: "◐", low: "○" };
export const riskOf = (moved: number, count: number): Risk | null => (count === 0 ? null : moved / count >= 0.5 ? "high" : moved > 0 ? "mid" : "low");
export const RISK_RULE = bi({ v: t("Link to customer value from last year: half or more of the kind's metrics moved with customer value = Strong; some did = Partial; none did = None.", "Verbindung zum Kundenwert aus dem letzten Jahr: Die Hälfte oder mehr der Kennzahlen dieser Art bewegte sich mit dem Kundenwert = Stark; einige = Teilweise; keine = Keine.") });

export type MeaningId = "result" | "early" | "limit" | "activity";
export const MEANINGS = bi([
  { id: "result" as MeaningId, label: t("The result we are paid for; it moves last", "Das Ergebnis, für das wir bezahlt werden; es bewegt sich zuletzt") },
  { id: "early" as MeaningId, label: t("An early signal a team can move this week", "Ein frühes Signal, das ein Team diese Woche bewegen kann") },
  { id: "limit" as MeaningId, label: t("A limit: it must not get worse while we push for speed", "Eine Grenze: Sie darf nicht schlechter werden, während wir auf Tempo drängen") },
  { id: "activity" as MeaningId, label: t("Our own activity or reach; it says nothing about customers", "Unsere eigene Aktivität oder Reichweite; sie sagt nichts über Kunden") },
]);
export const MEANING_TRUTH: Record<PatternId, MeaningId> = { outcome: "result", driver: "early", guardrail: "limit", vanity: "activity" };

export type PMeasureId = "target" | "weekly" | "stop" | "drop" | "bonus";
export const PMEASURES = bi([
  { id: "target" as PMeasureId, label: t("Set the target on the management dashboard and judge every measure by it", "Das Ziel im Management-Dashboard setzen und jede Maßnahme daran messen") },
  { id: "weekly" as PMeasureId, label: t("Put it on a live screen for the team that can move it and review it every week", "Es auf einen Live-Bildschirm des Teams legen, das es bewegen kann, und jede Woche prüfen") },
  { id: "stop" as PMeasureId, label: t("Set a limit that stops a test or a rollout when it is crossed", "Eine Grenze setzen, die einen Test oder Rollout stoppt, wenn sie überschritten wird") },
  { id: "drop" as PMeasureId, label: t("Stop reporting it as success", "Aufhören, es als Erfolg zu berichten") },
  { id: "bonus" as PMeasureId, label: t("Pay a bonus on it to the team that reports it", "Dem Team, das es berichtet, einen Bonus darauf zahlen") },
]);
export const MEASURE_TRUTH: Record<PatternId, PMeasureId> = { outcome: "target", driver: "weekly", guardrail: "stop", vanity: "drop" };
export type PatternRow = { risk: Risk | null; meaning: MeaningId | null; measure: PMeasureId | null };

export type UncId = "sample" | "cause" | "missing" | "shift" | "objective" | "highsafe" | "moredata";
export const UNCERTAINTIES = bi([
  { id: "sample" as UncId, label: t("72 closings in each speed band is a small base; a second quarter would confirm the lift", "72 Abschlüsse pro Tempo-Band sind eine kleine Basis; ein zweites Quartal würde den Lift bestätigen"), real: true, why: t("With fewer than about 100 closings per group, a few deals more or less move the lift a lot (Materi A6).", "Bei weniger als etwa 100 Abschlüssen pro Gruppe verschieben ein paar Aufträge mehr oder weniger den Lift stark (Materi A6).") },
  { id: "cause" as UncId, label: t("Fast answers may have gone to the more eager customers, so speed may not be the whole cause", "Schnelle Antworten gingen vielleicht an die interessierteren Kunden, also ist Tempo vielleicht nicht die ganze Ursache"), real: true, why: t("Sales may have answered the promising requests first. Only a fair test (a random split) shows how much speed alone adds.", "Der Vertrieb hat vielleicht die vielversprechenden Anfragen zuerst beantwortet. Nur ein fairer Test (eine zufällige Aufteilung) zeigt, wie viel Tempo allein bringt.") },
  { id: "missing" as UncId, label: t("Visitors who refuse cookies are not tracked, so bounce and interaction figures miss part of the traffic", "Besucher, die Cookies ablehnen, werden nicht erfasst, also fehlt bei Absprung- und Interaktionszahlen ein Teil des Traffics"), real: true, why: t("What is not recorded cannot be counted; the real figures may differ in either direction.", "Was nicht erfasst wird, kann nicht gezählt werden; die echten Zahlen können in beide Richtungen abweichen.") },
  { id: "shift" as UncId, label: t("A season or a campaign can change who visits, so next quarter's visitors may behave differently", "Eine Saison oder Kampagne kann ändern, wer die Seite besucht, also verhalten sich die Besucher im nächsten Quartal vielleicht anders"), real: true, why: t("A forecast assumes the past repeats; a new campaign brings different visitors.", "Eine Prognose nimmt an, dass sich die Vergangenheit wiederholt; eine neue Kampagne bringt andere Besucher.") },
  { id: "objective" as UncId, label: t("A lower bounce rate always means more sales", "Eine niedrigere Absprungrate bedeutet immer mehr Umsatz"), real: false, why: t("A visitor who finds a phone number and calls leaves after one page: a bounce that is a success. Bounce is not a result.", "Ein Besucher, der eine Telefonnummer findet und anruft, geht nach einer Seite: ein Absprung, der ein Erfolg ist. Absprung ist kein Ergebnis.") },
  { id: "highsafe" as UncId, label: t("Real-time data is always right because it is fresh", "Echtzeitdaten stimmen immer, weil sie frisch sind"), real: false, why: t("Fresh data can be incomplete (cookies), noisy (bots) or read too early (one good hour is not a trend).", "Frische Daten können unvollständig sein (Cookies), verrauscht (Bots) oder zu früh gelesen (eine gute Stunde ist kein Trend).") },
  { id: "moredata" as UncId, label: t("The more KPIs we track live, the better we measure success", "Je mehr KPIs wir live verfolgen, desto besser messen wir den Erfolg"), real: false, why: t("A wall of live numbers hides the few that matter. A small KPI system is easier to steer by (Materi A5).", "Eine Wand aus Live-Zahlen verdeckt die wenigen, die zählen. Ein kleines KPI-System lässt sich leichter steuern (Materi A5).") },
]);
export const UNC_BY_ID = Object.fromEntries(UNCERTAINTIES.map((w) => [w.id, w])) as Record<UncId, (typeof UNCERTAINTIES)[number]>;

/* ------------------------------------------------------------------ Block 2.3 · an A/B test design */

export type AbPart = "change" | "control" | "kpi" | "size";
export const AB_PARTS: AbPart[] = ["change", "control", "kpi", "size"];
export type AbOption = { id: string; label: string; right: boolean; clue: string };
export const AB = bi({
  change: {
    label: t("What changes in the variant", "Was sich in der Variante ändert"),
    help: t("The one thing the test compares.", "Das eine, was der Test vergleicht."),
    options: [
      { id: "one", label: t("Only the chat window: it opens after 30 seconds on the pricing page", "Nur das Chatfenster: Es öffnet sich nach 30 Sekunden auf der Preisseite"), right: true, clue: t("", "") },
      { id: "three", label: t("The chat window, new prices and a new page layout, all at once", "Chatfenster, neue Preise und ein neues Seitenlayout, alles auf einmal"), right: false, clue: t("If the variant wins, which of the changes made it win?", "Wenn die Variante gewinnt: Welche der Änderungen hat sie gewinnen lassen?") },
      { id: "channel", label: t("The chat for visitors on phones, none for visitors on computers", "Der Chat für Besucher am Handy, keiner für Besucher am Computer"), right: false, clue: t("Are visitors on phones and on computers the same people in the same situation?", "Sind Besucher am Handy und am Computer dieselben Menschen in derselben Lage?") },
    ],
  },
  control: {
    label: t("The control group", "Die Kontrollgruppe"),
    help: t("Who sees the page without the chat, to compare against.", "Wer die Seite ohne Chat sieht, als Vergleich."),
    options: [
      { id: "random", label: t("A random half of the visitors, in the same weeks", "Eine zufällige Hälfte der Besucher, in denselben Wochen"), right: true, clue: t("", "") },
      { id: "lastyear", label: t("Last month's visitors, before the chat existed", "Die Besucher des Vormonats, bevor es den Chat gab"), right: false, clue: t("Are these the same visitors, at the same time, under the same conditions?", "Sind das dieselben Besucher, zur selben Zeit, unter denselben Bedingungen?") },
      { id: "nonopen", label: t("Visitors who closed the chat window", "Besucher, die das Chatfenster geschlossen haben"), right: false, clue: t("Who chose to be in this group: chance, or the visitors themselves?", "Wer hat entschieden, in dieser Gruppe zu sein: der Zufall oder die Besucher selbst?") },
    ],
  },
  kpi: {
    label: t("The success KPI", "Der Erfolgs-KPI"),
    help: t("The number that decides whether the variant won.", "Die Zahl, die entscheidet, ob die Variante gewonnen hat."),
    options: [
      { id: "conv", label: t("Quote requests per pricing-page visitor, within 7 days", "Angebotsanfragen pro Besucher der Preisseite, innerhalb von 7 Tagen"), right: true, clue: t("", "") },
      { id: "opens", label: t("Chat windows opened", "Geöffnete Chatfenster"), right: false, clue: t("The problem in the brief is few closings. Does an opened chat window tell you whether more visitors asked for a quote?", "Das Problem im Auftrag sind wenige Abschlüsse. Sagt ein geöffnetes Chatfenster, ob mehr Besucher ein Angebot angefragt haben?") },
      { id: "sent", label: t("Page views per visit", "Seitenaufrufe pro Besuch"), right: false, clue: t("Which kind of metric counts how much visitors clicked around rather than whether they moved towards a deal?", "Welche Art von Kennzahl zählt, wie viel Besucher herumklickten, statt ob sie sich einem Abschluss näherten?") },
    ],
  },
  size: {
    label: t("Size and duration", "Größe und Dauer"),
    help: t("When the test has enough cases to read.", "Wann der Test genug Fälle hat, um ihn zu lesen."),
    options: [
      { id: "fixed", label: t("Fixed in advance: until each group has about 100 quote requests, and at least two full weeks", "Vorab festgelegt: bis jede Gruppe etwa 100 Angebotsanfragen hat, und mindestens zwei volle Wochen"), right: true, clue: t("", "") },
      { id: "peek", label: t("Stop as soon as the variant is ahead on the live dashboard", "Stoppen, sobald die Variante im Live-Dashboard vorn liegt"), right: false, clue: t("A live number swings with every visit. What happens if you stop at a lucky moment?", "Eine Live-Zahl schwankt mit jedem Besuch. Was passiert, wenn Sie in einem glücklichen Moment stoppen?") },
      { id: "day", label: t("One day, for a fast answer", "Einen Tag, für eine schnelle Antwort"), right: false, clue: t("How many quote requests arrive in one day, and are Mondays like Fridays?", "Wie viele Angebotsanfragen kommen an einem Tag an, und sind Montage wie Freitage?") },
    ],
  },
});
export type AbState = { change: string | null; control: string | null; kpi: string | null; size: string | null; hyp: string; rule: string };
export const emptyAb = (): AbState => ({ change: null, control: null, kpi: null, size: null, hyp: "", rule: "" });
export const AB_MODEL = { change: "one", control: "random", kpi: "conv", size: "fixed" };
/** A hypothesis states a change, an expected effect and a reason. A floor, not a judge: it needs "if … because". */
export const hasHypothesis = (s: string) => /\b(if|wenn|falls)\b/i.test(s) && /\b(because|since|as|weil|da|denn)\b/i.test(s);
/** A decision rule names a number to decide by. */
export const hasRuleNumber = (s: string) => /\d/.test(s);
