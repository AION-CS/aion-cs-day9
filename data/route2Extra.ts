import type { ArchId, KpiId } from "@/data/route2";
import { bi, t } from "@/lib/lang";

/**
 * What the Step A item cards of Route 2 print besides the panel's own facts (CLAUDE.md #47, #46): one line of a normal day at LiveConnect with
 * the item in use, who does what and what changes for the customer. Case assumptions, like every other figure of Route 2.
 */
export type ArchExtra = { scene: string };

export const ARCH_EXTRA: Record<ArchId, ArchExtra> = bi({
  foundation: {
    scene: t(
      "A sales rep opens one screen at 9:05 and sees that a visitor from the pricing page chatted twice and opened the quote form. Before the screen, three teams each saw a piece and none saw the whole.",
      "Ein Vertriebsmitarbeiter öffnet um 9:05 Uhr einen Bildschirm und sieht, dass ein Besucher von der Preisseite zweimal gechattet und das Angebotsformular geöffnet hat. Vor dem Bildschirm sah jedes von drei Teams ein Stück und keines das Ganze.",
    ),
  },
  chat: {
    scene: t(
      "A visitor on the pricing page asks whether onboarding is included. The chatbot answers at once; when it cannot, a sales rep takes over within two minutes and sees the conversation so far.",
      "Ein Besucher auf der Preisseite fragt, ob das Onboarding enthalten ist. Der Chatbot antwortet sofort; wenn er es nicht kann, übernimmt innerhalb von zwei Minuten ein Vertriebsmitarbeiter und sieht das bisherige Gespräch.",
    ),
  },
  personal: {
    scene: t(
      "A returning customer on the pricing page sees the module they already use at the top, with one line saying why. The team can see which rule showed it.",
      "Ein wiederkehrender Kunde sieht auf der Preisseite oben das Modul, das er schon nutzt, mit einer Zeile, warum. Das Team sieht, welche Regel es angezeigt hat.",
    ),
  },
  routing: {
    scene: t(
      "A quote request arrives at 14:10. The standard says sales answers within 30 minutes; the routing sends it to the rep on duty and raises an alert if nobody takes it.",
      "Eine Angebotsanfrage kommt um 14:10 Uhr an. Der Standard sagt, dass der Vertrieb innerhalb von 30 Minuten antwortet; die Weiterleitung schickt sie an den diensthabenden Mitarbeiter und schlägt Alarm, wenn niemand sie übernimmt.",
    ),
  },
  training: {
    scene: t(
      "In a 30-minute session a rep practises taking over a chat in the middle of a conversation and answers a pricing question in plain words. The visitor notices a person who already knows what was asked.",
      "In einer 30-minütigen Einheit übt ein Mitarbeiter, einen Chat mitten im Gespräch zu übernehmen und eine Preisfrage in einfachen Worten zu beantworten. Der Besucher bemerkt einen Menschen, der schon weiß, was gefragt wurde.",
    ),
  },
  tracking: {
    scene: t(
      "Someone closes the gap where onboarding calls and renewal e-mails were not recorded, and checks that every recorded channel has the customer's consent. The team finally sees what happens after the contract is signed.",
      "Jemand schließt die Lücke, in der Onboarding-Anrufe und Verlängerungs-E-Mails nicht erfasst wurden, und prüft, dass jeder erfasste Kanal die Einwilligung des Kunden hat. Das Team sieht endlich, was nach der Vertragsunterschrift passiert.",
    ),
  },
  suite: {
    scene: t(
      "A vendor platform decides by itself which chat reply, content and offer each visitor gets, with no rules shown. Two visitors with the same question get different answers and nobody at LiveConnect can say why.",
      "Eine Anbieterplattform entscheidet selbst, welche Chat-Antwort, welchen Inhalt und welches Angebot jeder Besucher bekommt, ohne dass Regeln gezeigt werden. Zwei Besucher mit derselben Frage bekommen verschiedene Antworten, und niemand bei LiveConnect kann sagen, warum.",
    ),
  },
  relaunch: {
    scene: t(
      "A new design goes live on every page at once. The quote form moves, the team cannot tell whether the change helped, and visitors who were mid-comparison find a different site.",
      "Ein neues Design geht auf allen Seiten gleichzeitig live. Das Angebotsformular wandert, das Team kann nicht sagen, ob die Änderung geholfen hat, und Besucher mitten im Vergleich finden eine andere Seite vor.",
    ),
  },
});

/** The aim printed beside each customer KPI in "the numbers today" (the figure Step B's "what I watch" sentence can quote). */
export const KPI_AIM: Partial<Record<KpiId, number>> = { conv: 12, engage: 4 };
