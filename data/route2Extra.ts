import type { ArchId, KpiId } from "@/data/route2";
import { bi, euro, t, tt } from "@/lib/lang";

/**
 * What the item cards, the trigger kit and the assumption kit of Route 2 print (CLAUDE.md #44, #46, #42). Every number a learner writes in
 * Route 2 is shown, not calculated: it is found from the figures printed on the card (today, aim) by one plain method taught in Materi B5.
 * Case assumptions, like every other figure of Route 2.
 *
 * - `scene`: one line of a normal day at LiveConnect with the item in use, who does what, and what changes for the customer.
 * - `metric`, `today`, `aim`, `unit`, `better`, `aimWord`: the one figure the item is meant to move. `metric` is a phrase that fits
 *   "If … is below N by month M", `today` is where it stands, `aim` is the aim (or, for a guardrail, the limit still accepted: `aimWord`). The
 *   trigger number is halfway between the two (Materi B5).
 * - `reason`: why requests would be lost when the item is missing, for the pickup point of an item that is left out; `pickupAction` is what
 *   happens when it is reached, when that is not simply "we fund it".
 * - `actions`: things its owner can do alone that change this one item; the first one is the model trigger's own action.
 */
export type ArchExtra = {
  scene: string;
  metric: string;
  today: number;
  aim: number;
  unit: string;
  better: "up" | "down";
  aimWord: string;
  reason: string;
  /** What happens when the pickup point is reached, if it is not simply "we fund it" (optional). */
  pickupAction?: string;
  actions: { text: string; why: string }[];
};

const AIM = t("aim", "Ziel");
const LIMIT = t("limit still accepted", "noch akzeptierte Grenze");
const PCT = t("%", " %");

export const ARCH_EXTRA: Record<ArchId, ArchExtra> = bi({
  foundation: {
    scene: t(
      "A sales rep opens one screen at 9:05 and sees that a visitor from the pricing page chatted twice and opened the quote form. Before the screen, three teams each saw a piece and none saw the whole.",
      "Ein Vertriebsmitarbeiter öffnet um 9:05 Uhr einen Bildschirm und sieht, dass ein Besucher von der Preisseite zweimal gechattet und das Angebotsformular geöffnet hat. Vor dem Bildschirm sah jedes von drei Teams ein Stück und keines das Ganze.",
    ),
    metric: t("the share of customer interactions that appear on the live screen", "der Anteil der Kundeninteraktionen, die auf dem Live-Bildschirm erscheinen"),
    today: 35,
    aim: 95,
    unit: PCT,
    better: "up" as const,
    aimWord: AIM,
    reason: t("nobody could see the whole interaction", "niemand die ganze Interaktion sehen konnte"),
    actions: [
      { text: t("the Head of IT adds the missing channel to the live screen before any other item goes live", "nimmt die IT-Leitung den fehlenden Kanal in den Live-Bildschirm auf, bevor ein anderer Punkt live geht"), why: t("Every other item is read off this screen. A screen that misses a channel shows the wrong picture, so the missing channel is added first, by the owner alone.", "Jeder andere Punkt wird an diesem Bildschirm abgelesen. Ein Bildschirm, dem ein Kanal fehlt, zeigt das falsche Bild, also wird der fehlende Kanal zuerst ergänzt, vom Owner allein.") },
      { text: t("the Head of Data lists each week the interactions that still do not appear", "listet die Leitung Data jede Woche die Interaktionen auf, die noch nicht erscheinen"), why: t("A weekly list turns an unknown gap into a short to-do list. It changes this one item only.", "Eine wöchentliche Liste macht aus einer unbekannten Lücke eine kurze To-do-Liste. Es ändert nur diesen einen Punkt.") },
    ],
  },
  chat: {
    scene: t(
      "A visitor on the pricing page asks whether onboarding is included. The chatbot answers at once; when it cannot, a sales rep takes over within two minutes and sees the conversation so far.",
      "Ein Besucher auf der Preisseite fragt, ob das Onboarding enthalten ist. Der Chatbot antwortet sofort; wenn er es nicht kann, übernimmt innerhalb von zwei Minuten ein Vertriebsmitarbeiter und sieht das bisherige Gespräch.",
    ),
    metric: t("the share of chats rated helpful by the visitor", "der Anteil der Chats, die der Besucher als hilfreich bewertet"),
    today: 70,
    aim: 90,
    unit: PCT,
    better: "up" as const,
    aimWord: AIM,
    reason: t("they left the pricing page with an open question", "sie die Preisseite mit einer offenen Frage verließen"),
    actions: [
      { text: t("marketing rewrites the worst-rated answers and hands those questions to a person at once", "schreibt das Marketing die schlechtest bewerteten Antworten neu und übergibt diese Fragen sofort an einen Menschen"), why: t("A rating below the halfway mark shows which answers fail. Rewriting them and handing the same questions to a person is a change the owner can make alone, and it touches this item only.", "Eine Bewertung unter der Hälfte des Weges zeigt, welche Antworten versagen. Sie neu zu schreiben und dieselben Fragen an einen Menschen zu übergeben, kann der Owner allein tun, und es berührt nur diesen Punkt.") },
      { text: t("the Head of Sales adds a second person to the hand-over rota", "ergänzt die Vertriebsleitung eine zweite Person im Übergabe-Dienstplan"), why: t("If visitors wait for a person, capacity is the first suspect, and the Head of Sales can fix it alone.", "Warten Besucher auf einen Menschen, ist die Kapazität der erste Verdacht, und die Vertriebsleitung kann sie allein beheben.") },
    ],
  },
  personal: {
    scene: t(
      "A returning customer on the pricing page sees the module they already use at the top, with one line saying why. The team can see which rule showed it.",
      "Ein wiederkehrender Kunde sieht auf der Preisseite oben das Modul, das er schon nutzt, mit einer Zeile, warum. Das Team sieht, welche Regel es angezeigt hat.",
    ),
    metric: t("the interaction rate on decision pages", "die Interaktionsrate auf Entscheidungsseiten"),
    today: 2,
    aim: 4,
    unit: PCT,
    better: "up" as const,
    aimWord: AIM,
    reason: t("they saw generic pages while they were comparing options", "sie generische Seiten sahen, während sie Optionen verglichen"),
    actions: [
      { text: t("marketing limits the personalised content to known customers", "beschränkt das Marketing die personalisierten Inhalte auf bekannte Kunden"), why: t("If the rate stays low, the content may be shown to the wrong visitors. Limiting it is a change the owner can make alone.", "Bleibt die Rate niedrig, wird der Inhalt vielleicht den falschen Besuchern gezeigt. Ihn zu beschränken, kann der Owner allein tun.") },
      { text: t("the Head of Data switches off the rule that fired least often", "schaltet die Leitung Data die Regel ab, die am seltensten ausgelöst hat"), why: t("A rule that rarely fires adds noise. Switching it off changes this one item only.", "Eine Regel, die selten auslöst, fügt Rauschen hinzu. Sie abzuschalten, ändert nur diesen einen Punkt.") },
    ],
  },
  routing: {
    scene: t(
      "A quote request arrives at 14:10. The standard says sales answers within 30 minutes; the routing sends it to the rep on duty and raises an alert if nobody takes it.",
      "Eine Angebotsanfrage kommt um 14:10 Uhr an. Der Standard sagt, dass der Vertrieb innerhalb von 30 Minuten antwortet; die Weiterleitung schickt sie an den diensthabenden Mitarbeiter und schlägt Alarm, wenn niemand sie übernimmt.",
    ),
    metric: t("the share of requests answered within the agreed time", "der Anteil der Anfragen, die innerhalb der vereinbarten Zeit beantwortet werden"),
    today: 40,
    aim: 90,
    unit: PCT,
    better: "up" as const,
    aimWord: AIM,
    reason: t("their request waited for hours", "ihre Anfrage stundenlang wartete"),
    actions: [
      { text: t("the Head of Sales adds a back-up rep to the rota", "ergänzt die Vertriebsleitung einen Vertretungs-Mitarbeiter im Dienstplan"), why: t("Late answers usually mean nobody was on duty. A back-up is the change the Head of Sales can make alone.", "Späte Antworten heißen meist, dass niemand Dienst hatte. Eine Vertretung kann die Vertriebsleitung allein einführen.") },
      { text: t("the routing escalates an unanswered request after 15 minutes", "eskaliert die Weiterleitung eine unbeantwortete Anfrage nach 15 Minuten"), why: t("An early escalation catches the request before it goes cold, and it changes this item only.", "Eine frühe Eskalation fängt die Anfrage ab, bevor sie erkaltet, und sie ändert nur diesen Punkt.") },
    ],
  },
  training: {
    scene: t(
      "In a 30-minute session a rep practises taking over a chat in the middle of a conversation and answers a pricing question in plain words. The visitor notices a person who already knows what was asked.",
      "In einer 30-minütigen Einheit übt ein Mitarbeiter, einen Chat mitten im Gespräch zu übernehmen und eine Preisfrage in einfachen Worten zu beantworten. Der Besucher bemerkt einen Menschen, der schon weiß, was gefragt wurde.",
    ),
    metric: t("the share of sales reps who take over a chat within two minutes", "der Anteil der Vertriebsmitarbeiter, die einen Chat innerhalb von zwei Minuten übernehmen"),
    today: 20,
    aim: 80,
    unit: PCT,
    better: "up" as const,
    aimWord: AIM,
    reason: t("reps took too long to take over", "Mitarbeiter zu lange zum Übernehmen brauchten"),
    actions: [
      { text: t("the training moves into the weekly sales meeting", "wandert die Schulung in das wöchentliche Vertriebsmeeting"), why: t("If few reps take over in time, the course is too far from the work. Moving it into a meeting they attend anyway is a change the Head of Sales can make alone.", "Übernehmen wenige rechtzeitig, liegt der Kurs zu weit von der Arbeit entfernt. Ihn in ein Meeting zu verlegen, das sie ohnehin besuchen, kann die Vertriebsleitung allein tun.") },
      { text: t("the Head of Sales adds a five-minute chat drill to every meeting", "ergänzt die Vertriebsleitung in jedem Meeting eine Fünf-Minuten-Chat-Übung"), why: t("A short drill every week builds the habit without a new course.", "Eine kurze Übung jede Woche baut die Gewohnheit ohne neuen Kurs auf.") },
    ],
  },
  tracking: {
    scene: t(
      "Someone closes the gap where onboarding calls and renewal e-mails were not recorded, and checks that every recorded channel has the customer's consent. The team finally sees what happens after the contract is signed.",
      "Jemand schließt die Lücke, in der Onboarding-Anrufe und Verlängerungs-E-Mails nicht erfasst wurden, und prüft, dass jeder erfasste Kanal die Einwilligung des Kunden hat. Das Team sieht endlich, was nach der Vertragsunterschrift passiert.",
    ),
    metric: t("the share of onboarding, renewal and social media interactions that are tracked within consent", "der Anteil der Onboarding-, Verlängerungs- und Social-Media-Interaktionen, die im Rahmen der Einwilligung erfasst werden"),
    today: 50,
    aim: 90,
    unit: PCT,
    better: "up" as const,
    aimWord: AIM,
    reason: t("nobody saw what happened to them after the contract", "niemand sah, was nach dem Vertrag mit ihnen geschah"),
    actions: [
      { text: t("IT pauses the tracking of any channel without consent until it is fixed", "pausiert die IT die Erfassung jedes Kanals ohne Einwilligung, bis es behoben ist"), why: t("Tracking without consent is a risk, not a gain. Pausing one channel is the cleanest change the owner can make alone.", "Erfassung ohne Einwilligung ist ein Risiko, kein Gewinn. Einen Kanal zu pausieren ist die sauberste Änderung, die der Owner allein vornehmen kann.") },
      { text: t("the Head of Data lists the untracked interactions each week", "listet die Leitung Data jede Woche die nicht erfassten Interaktionen auf"), why: t("A list shows where the gaps are, so they can be closed one by one.", "Eine Liste zeigt, wo die Lücken sind, damit sie nacheinander geschlossen werden können.") },
    ],
  },
  suite: {
    scene: t(
      "A vendor platform decides by itself which chat reply, content and offer each visitor gets, with no rules shown. Two visitors with the same question get different answers and nobody at LiveConnect can say why.",
      "Eine Anbieterplattform entscheidet selbst, welche Chat-Antwort, welchen Inhalt und welches Angebot jeder Besucher bekommt, ohne dass Regeln gezeigt werden. Zwei Besucher mit derselben Frage bekommen verschiedene Antworten, und niemand bei LiveConnect kann sagen, warum.",
    ),
    metric: t("the share of replies and offers whose reason someone at LiveConnect can explain", "der Anteil der Antworten und Angebote, deren Grund jemand bei LiveConnect erklären kann"),
    today: 90,
    aim: 100,
    unit: PCT,
    better: "up" as const,
    aimWord: AIM,
    reason: t("nobody could automate more of the interaction", "niemand mehr von der Interaktion automatisieren konnte"),
    actions: [
      { text: t("the Chief Digital Officer pauses the platform until its rules can be shown", "pausiert der Chief Digital Officer die Plattform, bis ihre Regeln gezeigt werden können"), why: t("A black box cannot be steered. Pausing it is the one lever that needs nobody else.", "Eine Black Box lässt sich nicht steuern. Sie zu pausieren ist der eine Hebel, der niemanden sonst braucht.") },
      { text: t("marketing limits it to one page", "beschränkt das Marketing sie auf eine Seite"), why: t("One page is small enough to compare with a control group.", "Eine Seite ist klein genug, um sie mit einer Kontrollgruppe zu vergleichen.") },
    ],
  },
  relaunch: {
    scene: t(
      "A new design goes live on every page at once. The quote form moves, the team cannot tell whether the change helped, and visitors who were mid-comparison find a different site.",
      "Ein neues Design geht auf allen Seiten gleichzeitig live. Das Angebotsformular wandert, das Team kann nicht sagen, ob die Änderung geholfen hat, und Besucher mitten im Vergleich finden eine andere Seite vor.",
    ),
    metric: t("the share of visitors who reach the quote form", "der Anteil der Besucher, die das Angebotsformular erreichen"),
    today: 4,
    aim: 8,
    unit: PCT,
    better: "up" as const,
    aimWord: AIM,
    reason: t("the old pages put them off before they asked", "die alten Seiten sie abschreckten, bevor sie anfragten"),
    pickupAction: t("we relaunch the three pages with the highest exit rate", "gestalten wir die drei Seiten mit der höchsten Absprungrate neu"),
    actions: [
      { text: t("marketing rolls the design out page by page, starting with the pricing page", "führt das Marketing das Design Seite für Seite ein, beginnend mit der Preisseite"), why: t("One page at a time can be compared with the old one, so the gain, if any, is visible.", "Eine Seite nach der anderen lässt sich mit der alten vergleichen, sodass der Gewinn, falls es einen gibt, sichtbar wird.") },
      { text: t("the Chief Digital Officer stops the relaunch until one page shows a gain", "stoppt der Chief Digital Officer den Relaunch, bis eine Seite einen Gewinn zeigt"), why: t("A relaunch with no gain on a test page is money spent before the KPI says what it should achieve.", "Ein Relaunch ohne Gewinn auf einer Testseite ist Geld, das ausgegeben wird, bevor der KPI sagt, was er erreichen soll.") },
    ],
  },
});

/**
 * The value the pickup point's cost-of-waiting count is found from (Materi B5): one unit and what it is worth, printed in "the numbers today".
 * `payText` is the line on every item card, `waitWhy` the reason in the pickup kit, `pickupWhen` the opening of the pickup sentence.
 */
export const UNIT_VALUE = bi({
  value: 1500,
  label: t("What one closed quote request is worth (average deal value)", "Was eine abgeschlossene Angebotsanfrage wert ist (durchschnittlicher Abschlusswert)"),
  payLabel: t("To pay back, it must close", "Zum Bezahltmachen muss er abschließen helfen"),
});
export const payText = (cost: number, n: number) =>
  tt(`more quote requests that would otherwise be lost (${euro(cost)} ÷ ${euro(UNIT_VALUE.value)} a deal, rounded up)`, `Angebotsanfragen mehr, die sonst verloren gingen (${euro(cost)} ÷ je ${euro(UNIT_VALUE.value)} pro Abschluss, aufgerundet)`);
export const waitWhy = (n: number) =>
  tt(`Each quote request lost for this reason takes ${euro(UNIT_VALUE.value)} with it. After ${n} of them, waiting has cost as much as the item would have.`, `Jede Angebotsanfrage, die aus diesem Grund verloren geht, nimmt ${euro(UNIT_VALUE.value)} mit. Nach ${n} von ihnen hat das Warten so viel gekostet, wie der Punkt gekostet hätte.`);
export const pickupWhen = (n: number | string, month: number | string, reason: string) =>
  tt(`If ${n} or more quote requests are lost by month ${month} because ${reason}`, `Gehen bis Monat ${month} mindestens ${n} Angebotsanfragen verloren, weil ${reason}`);

/** The aim printed beside each KPI of the tripwire; the threshold is halfway between today's figure and this (Materi B5). */
export const KPI_AIM: Partial<Record<KpiId, number>> = { conv: 12, engage: 4 };

/** The three assumptions of the model decision (CLAUDE.md #41): what is assumed, why it is uncertain, the sign that shows it wrong. */
export type AssumptionKit = { item: ArchId; text: string; why: string; kind: "kpi" | "item"; ref: string; signWhy: string };
export const ASSUMPTION_KIT: AssumptionKit[] = bi([
  {
    item: "chat" as ArchId,
    text: t("fast answers close more quote requests, not only the requests of eager customers", "schnelle Antworten schließen mehr Angebotsanfragen ab, nicht nur die Anfragen eifriger Kunden"),
    why: t("Fast answers and eager customers go together, so part of the gain may be selection. Your plan funds the chat and the routing, so it rests on speed itself paying.", "Schnelle Antworten und eifrige Kunden gehören zusammen, ein Teil des Gewinns kann also Auswahl sein. Ihr Plan finanziert Chat und Weiterleitung, also beruht er darauf, dass Tempo selbst sich auszahlt."),
    kind: "kpi" as const,
    ref: "conv",
    signWhy: t("The closing rate is counted weekly by the CRM, so you can watch it yourself. Halfway between today's rate and the aim is the least that shows speed pays.", "Die Abschlussquote wird wöchentlich vom CRM gezählt, Sie können sie also selbst beobachten. Die Hälfte des Weges zwischen heutiger Quote und Ziel ist das Mindeste, das zeigt, dass Tempo sich auszahlt."),
  },
  {
    item: "chat" as ArchId,
    text: t("visitors accept a chat that opens by itself", "Besucher akzeptieren einen Chat, der sich selbst öffnet"),
    why: t("A chat that pops up can feel pushy. Your plan funds the chat on the decision pages, so it rests on visitors welcoming it.", "Ein Chat, der aufpoppt, kann aufdringlich wirken. Ihr Plan finanziert den Chat auf den Entscheidungsseiten, also beruht er darauf, dass Besucher ihn begrüßen."),
    kind: "item" as const,
    ref: "chat",
    signWhy: t("The chat ratings are counted for every chat, so you see them in the first month. Halfway between today's share and the aim is the point where acting is still cheap.", "Die Chat-Bewertungen werden bei jedem Chat gezählt, Sie sehen sie also im ersten Monat. Die Hälfte des Weges zwischen heutigem Anteil und Ziel ist der Punkt, an dem Handeln noch günstig ist."),
  },
  {
    item: "foundation" as ArchId,
    text: t("the decision pages are tracked well enough to steer by", "die Entscheidungsseiten werden gut genug erfasst, um danach zu steuern"),
    why: t("The brief names uncertain data. Every other item is read off the live screen, so your whole plan rests on it showing the interactions.", "Der Auftrag nennt unsichere Daten. Jeder andere Punkt wird am Live-Bildschirm abgelesen, also beruht Ihr ganzer Plan darauf, dass er die Interaktionen zeigt."),
    kind: "item" as const,
    ref: "foundation",
    signWhy: t("The share of interactions on the live screen is a count you can read yourself. Halfway between today's share and the aim is the least that lets the other items start.", "Der Anteil der Interaktionen auf dem Live-Bildschirm ist eine Zählung, die Sie selbst lesen können. Die Hälfte des Weges zwischen heutigem Anteil und Ziel ist das Mindeste, das den anderen Punkten den Start erlaubt."),
  },
]);

/** The item the model plan leaves out and gives a pickup point (the one that waits). */
export const MODEL_PICKUP: ArchId = "relaunch";
