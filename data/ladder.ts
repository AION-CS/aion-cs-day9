import { bi, t } from "@/lib/lang";

/**
 * Task 1 · Block 1.1. Nine real-time ideas from LiveConnect's teams. The learner tags each with the lever it mainly pulls (Materi A1–A3):
 * respond faster, personalise the moment, or learn and adjust. (The identifiers keep the names of the sort board this file was built
 * from: a "line" is one idea, a "level tag" is its lever.) `truth` is never shown outside the mentor answer key.
 */
export type LevelTag = "respond" | "personal" | "learn";
export const LEVEL_TAGS = bi([
  { id: "respond" as LevelTag, label: t("Respond faster", "Schneller reagieren"), hint: t("It shortens the time until the customer gets an answer or a reaction.", "Es verkürzt die Zeit, bis der Kunde eine Antwort oder Reaktion bekommt.") },
  { id: "personal" as LevelTag, label: t("Personalise the moment", "Den Moment personalisieren"), hint: t("It changes what this visitor sees or is offered now, from what they do or who they are.", "Es ändert, was dieser Besucher jetzt sieht oder angeboten bekommt, aus dem, was er tut oder wer er ist.") },
  { id: "learn" as LevelTag, label: t("Learn and adjust", "Lernen und anpassen"), hint: t("It measures what happened and changes the next version: a test, a feedback loop.", "Es misst, was passiert ist, und ändert die nächste Version: ein Test, eine Feedbackschleife.") },
]);
export const LEVEL_LABEL = bi({ respond: t("Respond faster", "Schneller reagieren"), personal: t("Personalise the moment", "Den Moment personalisieren"), learn: t("Learn and adjust", "Lernen und anpassen") });

export type LineId = "l1" | "l2" | "l3" | "l4" | "l5" | "l6" | "l7" | "l8" | "l9";
export type Line = { id: LineId; text: string; source: string; truth: LevelTag; clue: string; why: string; rejected: Partial<Record<LevelTag, string>> };

export const LINES: Line[] = bi([
  {
    id: "l1" as LineId,
    source: t("Service", "Service"),
    text: t("A chatbot opens on the pricing page after 30 seconds and answers the five most common questions at once.", "Ein Chatbot öffnet sich nach 30 Sekunden auf der Preisseite und beantwortet die fünf häufigsten Fragen sofort."),
    truth: "respond" as LevelTag,
    clue: t("What does the visitor get sooner than before?", "Was bekommt der Besucher früher als vorher?"),
    why: t("The visitor gets an answer in seconds instead of waiting for an e-mail: the lever is speed.", "Der Besucher bekommt in Sekunden eine Antwort, statt auf eine E-Mail zu warten: Der Hebel ist Tempo."),
    rejected: { personal: t("Every visitor gets the same five answers; nothing is tailored to who they are.", "Jeder Besucher bekommt dieselben fünf Antworten; nichts ist auf die Person zugeschnitten.") },
  },
  {
    id: "l2" as LineId,
    source: t("Sales", "Vertrieb"),
    text: t("Every quote request is called back within 15 minutes during office hours.", "Jede Angebotsanfrage wird während der Bürozeiten innerhalb von 15 Minuten zurückgerufen."),
    truth: "respond" as LevelTag,
    clue: t("Does the call change the offer, or when the customer hears from us?", "Ändert der Anruf das Angebot, oder wann der Kunde von uns hört?"),
    why: t("It cuts the wait after a request from a day to minutes: respond faster.", "Es verkürzt das Warten nach einer Anfrage von einem Tag auf Minuten: schneller reagieren."),
    rejected: { learn: t("Nothing is measured or tested; the change is the speed of the answer.", "Nichts wird gemessen oder getestet; die Änderung ist das Tempo der Antwort.") },
  },
  {
    id: "l3" as LineId,
    source: t("Marketing", "Marketing"),
    text: t("Questions and complaints on LinkedIn and Xing get a reply from a named person within one hour.", "Fragen und Beschwerden auf LinkedIn und Xing bekommen innerhalb einer Stunde eine Antwort von einer namentlich genannten Person."),
    truth: "respond" as LevelTag,
    clue: t("Social media is the channel. What is the change?", "Social Media ist der Kanal. Was ist die Änderung?"),
    why: t("Social media becomes a retention tool when questions there are answered fast and by a person: the lever is speed.", "Social Media wird zum Bindungswerkzeug, wenn Fragen dort schnell und von einer Person beantwortet werden: Der Hebel ist Tempo."),
    rejected: { personal: t("A named sender is friendly, but the idea is about how fast the reply comes.", "Ein namentlicher Absender ist freundlich, aber die Idee betrifft, wie schnell die Antwort kommt.") },
  },
  {
    id: "l4" as LineId,
    source: t("Product", "Produkt"),
    text: t("A returning customer who logs in sees the add-on that customers of the same size added next, on the start page.", "Ein wiederkehrender Kunde, der sich anmeldet, sieht auf der Startseite das Add-on, das Kunden gleicher Größe als Nächstes ergänzten."),
    truth: "personal" as LevelTag,
    clue: t("Would two customers see the same start page?", "Würden zwei Kunden dieselbe Startseite sehen?"),
    why: t("What is shown depends on who logs in and what similar customers did: personalisation in the moment.", "Was gezeigt wird, hängt davon ab, wer sich anmeldet und was ähnliche Kunden taten: Personalisierung im Moment."),
    rejected: { respond: t("Nothing is answered faster; the page shows something different to each customer.", "Nichts wird schneller beantwortet; die Seite zeigt jedem Kunden etwas anderes.") },
  },
  {
    id: "l5" as LineId,
    source: t("Marketing", "Marketing"),
    text: t("Visitors who arrive from the hospital campaign see case studies and data protection answers for hospitals first.", "Besucher, die über die Krankenhaus-Kampagne kommen, sehen zuerst Fallstudien und Datenschutzantworten für Krankenhäuser."),
    truth: "personal" as LevelTag,
    clue: t("What decides what this visitor sees first?", "Was entscheidet, was dieser Besucher zuerst sieht?"),
    why: t("The page follows where the visitor came from: personalisation from what we know at that moment.", "Die Seite folgt dem, woher der Besucher kam: Personalisierung aus dem, was wir in dem Moment wissen."),
    rejected: { learn: t("It is not a test; it is a different page for a known kind of visitor.", "Es ist kein Test; es ist eine andere Seite für eine bekannte Art von Besucher.") },
  },
  {
    id: "l6" as LineId,
    source: t("Sales", "Vertrieb"),
    text: t("When a visitor compares two plans for a long time, the page offers a short comparison that fits the size of their company.", "Wenn ein Besucher lange zwei Tarife vergleicht, bietet die Seite einen kurzen Vergleich an, der zur Größe seines Unternehmens passt."),
    truth: "personal" as LevelTag,
    clue: t("The trigger is behaviour. Is the point speed, or what is shown to this visitor?", "Der Auslöser ist Verhalten. Geht es um Tempo, oder darum, was diesem Besucher gezeigt wird?"),
    why: t("The content is chosen from what this visitor is doing right now: personalisation in the moment.", "Der Inhalt wird aus dem gewählt, was dieser Besucher gerade tut: Personalisierung im Moment."),
    rejected: { respond: t("There is no question waiting for an answer; the page adapts its content.", "Es wartet keine Frage auf eine Antwort; die Seite passt ihren Inhalt an.") },
  },
  {
    id: "l7" as LineId,
    source: t("Marketing", "Marketing"),
    text: t("Half of the visitors to the pricing page see the new layout, half the old one, for three weeks; the layout with more quote requests stays.", "Die Hälfte der Besucher der Preisseite sieht drei Wochen lang das neue Layout, die andere Hälfte das alte; das Layout mit mehr Angebotsanfragen bleibt."),
    truth: "learn" as LevelTag,
    clue: t("Is the point to change the page, or to find out which version works?", "Geht es darum, die Seite zu ändern, oder herauszufinden, welche Version wirkt?"),
    why: t("An A/B test: it measures which version brings more requests and keeps the better one.", "Ein A/B-Test: Er misst, welche Version mehr Anfragen bringt, und behält die bessere."),
    rejected: { personal: t("Visitors are split by chance, not by who they are.", "Besucher werden per Zufall aufgeteilt, nicht danach, wer sie sind.") },
  },
  {
    id: "l8" as LineId,
    source: t("Service", "Service"),
    text: t("After every chat the customer rates the answer; every Friday the team rewrites the three answers rated worst.", "Nach jedem Chat bewertet der Kunde die Antwort; jeden Freitag schreibt das Team die drei am schlechtesten bewerteten Antworten neu."),
    truth: "learn" as LevelTag,
    clue: t("What happens with the ratings every week?", "Was passiert jede Woche mit den Bewertungen?"),
    why: t("A feedback loop: what customers say is measured and changes the next version of the answers.", "Eine Feedbackschleife: Was Kunden sagen, wird gemessen und ändert die nächste Version der Antworten."),
    rejected: { respond: t("The chat is already there; the idea is about improving it from feedback.", "Der Chat ist schon da; die Idee betrifft, ihn aus Feedback zu verbessern.") },
  },
  {
    id: "l9" as LineId,
    source: t("Product", "Produkt"),
    text: t("A dashboard shows every morning which page lost the most visitors yesterday, and that page is fixed first.", "Ein Dashboard zeigt jeden Morgen, welche Seite gestern die meisten Besucher verlor, und diese Seite wird zuerst verbessert."),
    truth: "learn" as LevelTag,
    clue: t("Does the visitor see anything different today because of it?", "Sieht der Besucher deswegen heute etwas anderes?"),
    why: t("It reads the result every day and decides what to change next: learn and adjust.", "Es liest das Ergebnis jeden Tag und entscheidet, was als Nächstes geändert wird: lernen und anpassen."),
    rejected: { respond: t("It speeds up the team's reaction to data, not the answer a customer gets.", "Es beschleunigt die Reaktion des Teams auf Daten, nicht die Antwort, die ein Kunde bekommt.") },
  },
]);
export const LINE_IDS: LineId[] = ["l1", "l2", "l3", "l4", "l5", "l6", "l7", "l8", "l9"];

/** The tests taught in Materi A1–A3 for each lever, and the pair tests. */
export const LEVEL_TESTS = bi([
  { name: t("Respond faster", "Schneller reagieren"), test: t("Does it shorten the time until the customer gets an answer or a reaction (chat, callback, reply on social media)?", "Verkürzt es die Zeit, bis der Kunde eine Antwort oder Reaktion bekommt (Chat, Rückruf, Antwort in Social Media)?") },
  { name: t("Personalise the moment", "Den Moment personalisieren"), test: t("Does it change what this visitor sees or is offered now, from what they do or who they are?", "Ändert es, was dieser Besucher jetzt sieht oder angeboten bekommt, aus dem, was er tut oder wer er ist?") },
  { name: t("Learn and adjust", "Lernen und anpassen"), test: t("Does it measure what happened and change the next version (a test, ratings, a daily review)?", "Misst es, was passiert ist, und ändert die nächste Version (ein Test, Bewertungen, ein tägliches Review)?") },
  { name: t("Respond or personalise?", "Reagieren oder personalisieren?"), test: t("Ask what changes. If it is how soon the customer hears from you, it is speed; if it is what the customer sees, it is personalisation.", "Fragen Sie, was sich ändert. Ist es, wie bald der Kunde von Ihnen hört, ist es Tempo; ist es, was der Kunde sieht, ist es Personalisierung.") },
  { name: t("Personalise or learn?", "Personalisieren oder lernen?"), test: t("Personalisation shows different visitors different things on purpose. A test shows them different things by chance, to find out which works.", "Personalisierung zeigt verschiedenen Besuchern bewusst Verschiedenes. Ein Test zeigt ihnen per Zufall Verschiedenes, um herauszufinden, was wirkt.") },
]);
