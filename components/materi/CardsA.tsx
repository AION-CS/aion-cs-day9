"use client";

import { Bul, Diagram } from "@/components/materi/kit";
import { AutomationGrid, DelayCost, FairTest, KpiTree, MomentProfile, PilotExample, ScoreExample } from "@/components/materi/diagramsA";
import { Callout, DataTable, MaterialCard } from "@/components/ui/MaterialCard";
import { ShowMore } from "@/components/ui/ShowMore";
import { LEVEL_TESTS } from "@/data/ladder";
import { PATTERNS, PATTERN_IDS, PATTERN_PAIR_TESTS, RISK_RULE } from "@/data/patterns";
import { EXPLAIN_RULE } from "@/data/measures";
import { MOSEL, MOSEL_RESULT } from "@/data/forecast";
import { euro, num, pct, tt } from "@/lib/lang";

/** Materi A: the seven cards of Route 1 (Levels 1 and 2 on one case). 60 minutes in all. */
const p = "text-body text-ink";

export function CardA1() {
  return (
    <MaterialCard
      id="A1"
      scan={tt("In customer contact, interest cools by the minute. A question answered while the customer is still on the page often becomes a deal; the same answer a day later often arrives after the decision. Speed is not a courtesy, it is part of the offer.", "Im Kundenkontakt kühlt Interesse mit jeder Minute ab. Eine Frage, die beantwortet wird, solange der Kunde noch auf der Seite ist, wird oft zum Auftrag; dieselbe Antwort einen Tag später kommt oft nach der Entscheidung. Tempo ist keine Höflichkeit, es ist Teil des Angebots.")}
      reasoning={[
        tt("Speed is a success factor because a customer's attention and need are strongest at the moment they ask; every hour of waiting gives a competitor the chance to answer first.", "Tempo ist ein Erfolgsfaktor, weil Aufmerksamkeit und Bedarf eines Kunden im Moment der Frage am stärksten sind; jede Stunde Warten gibt einem Wettbewerber die Chance, zuerst zu antworten."),
        tt("Look for delays where the customer waits for you: after a form, on an e-mailed question, on a social media comment, after an outage report. Those are the moments a real-time reaction helps.", "Suchen Sie Verzögerungen dort, wo der Kunde auf Sie wartet: nach einem Formular, bei einer per E-Mail gestellten Frage, bei einem Social-Media-Kommentar, nach einer Störungsmeldung. Das sind die Momente, in denen eine Echtzeit-Reaktion hilft."),
        tt("Three levers work in real time: respond faster (the customer hears from you sooner), personalise the moment (what the customer sees fits them) and learn and adjust (what happened changes the next version).", "Drei Hebel wirken in Echtzeit: schneller reagieren (der Kunde hört früher von Ihnen), den Moment personalisieren (was der Kunde sieht, passt zu ihm) und lernen und anpassen (was passiert ist, ändert die nächste Version)."),
        tt("Speed alone is not quality: a fast answer that does not help is worse than a slightly slower one that does. Watch the quality of fast answers as a guardrail.", "Tempo allein ist keine Qualität: Eine schnelle Antwort, die nicht hilft, ist schlechter als eine etwas langsamere, die hilft. Beobachten Sie die Qualität schneller Antworten als Guardrail."),
      ]}
      sources={["oldroyd2011", "huang2021"]}
    >
      <ShowMore id="A1" part="research" label={tt("Show the research behind this card", "Die Forschung hinter dieser Karte zeigen")}>
        <p className={p}>
          {tt(
            "Oldroyd, McElheran and Elkington (2011) studied how fast firms answered online leads and found that leads contacted within an hour were many times more likely to be qualified than leads contacted later, while most firms answered after a day or more. Huang and Rust (2021) add that machines can take the fast, routine part of the answer, so that people have time for the part that needs judgement.",
            "Oldroyd, McElheran und Elkington (2011) untersuchten, wie schnell Firmen Online-Leads beantworteten, und fanden, dass innerhalb einer Stunde kontaktierte Leads um ein Vielfaches häufiger qualifiziert werden konnten als später kontaktierte, während die meisten Firmen nach einem Tag oder später antworteten. Huang und Rust (2021) ergänzen, dass Maschinen den schnellen, routinemäßigen Teil der Antwort übernehmen können, damit Menschen Zeit für den Teil haben, der Urteil braucht.",
          )}
        </p>
      </ShowMore>
      <Diagram label={tt("What a delay costs · a worked example on Neckar Hosting", "Was eine Verzögerung kostet · ein Beispiel mit Neckar Hosting")} caption={tt("Choose a speed band and read how often requests in that band closed.", "Wählen Sie ein Tempo-Band und lesen Sie, wie oft Anfragen in diesem Band abschlossen.")}>
        <DelayCost />
      </Diagram>
      <ShowMore id="A1" part="notes" label={tt("Show two short notes", "Zwei kurze Hinweise zeigen")}>
        <Bul
          items={[
            tt("Respond faster: chat on a decision page, callback after a request, a reply on social media within the hour.", "Schneller reagieren: Chat auf einer Entscheidungsseite, Rückruf nach einer Anfrage, eine Antwort in Social Media innerhalb der Stunde."),
            tt("Personalise the moment: what the page shows changes with who the visitor is or why they came.", "Den Moment personalisieren: Was die Seite zeigt, ändert sich damit, wer der Besucher ist oder warum er kam."),
            tt("Learn and adjust: tests, ratings and a daily look at what happened decide the next version.", "Lernen und anpassen: Tests, Bewertungen und ein täglicher Blick auf das Geschehene entscheiden die nächste Version."),
          ]}
        />
      </ShowMore>
    </MaterialCard>
  );
}

export function CardA2() {
  return (
    <MaterialCard
      id="A2"
      scan={tt("Personalisation in the moment changes what a visitor sees now, from who they are or what they do: a recommendation, an offer, the first answer on the page. It is felt as value when it uses what the visitor gave you, and as intrusion when it shows you watched them.", "Personalisierung im Moment ändert, was ein Besucher jetzt sieht, aus dem, wer er ist oder was er tut: eine Empfehlung, ein Angebot, die erste Antwort auf der Seite. Sie wird als Mehrwert empfunden, wenn sie nutzt, was der Besucher Ihnen gab, und als Aufdringlichkeit, wenn sie zeigt, dass Sie ihn beobachtet haben.")}
      reasoning={[
        ...LEVEL_TESTS.map((x) => `${x.name}: ${x.test}`),
        tt("Personalisation needs something you know: who logged in, or why the visitor came (the campaign, the search). With an anonymous first visit there is little to personalise; do not pretend otherwise.", "Personalisierung braucht etwas, das Sie wissen: wer sich angemeldet hat, oder warum der Besucher kam (die Kampagne, die Suche). Bei einem anonymen Erstbesuch gibt es wenig zu personalisieren; tun Sie nicht so, als wäre es anders."),
        tt("It is added value when it helps the visitor decide faster with what they gave you. It is intrusive when it reveals tracking (“we saw you read …”), asks before it gives, or offers something for every page a visitor opened.", "Mehrwert ist es, wenn es dem Besucher hilft, mit dem, was er Ihnen gab, schneller zu entscheiden. Aufdringlich ist es, wenn es Tracking verrät („wir haben gesehen, dass Sie … gelesen haben“), fragt, bevor es gibt, oder zu jeder geöffneten Seite etwas anbietet."),
        tt("A real-time opportunity names a moment, what happens there today, and what a real-time reaction would change for the customer.", "Eine Echtzeit-Chance nennt einen Moment, was dort heute passiert, und was eine Echtzeit-Reaktion für den Kunden ändern würde."),
      ]}
      sources={["aguirre2015", "peppers1993"]}
    >
      <ShowMore id="A2" part="research" label={tt("Show the research behind this card", "Die Forschung hinter dieser Karte zeigen")}>
        <p className={p}>
          {tt(
            "Aguirre and colleagues (2015) called it the personalisation paradox: personalised offers work better when customers can see how their data is used, and worse when the data was collected without their knowing. Peppers and Rogers (1993) had argued long before that the point of personalisation is to treat different customers differently from what each one does, not to show them that you watch.",
            "Aguirre und Kollegen (2015) nannten es das Personalisierungs-Paradox: Personalisierte Angebote wirken besser, wenn Kunden sehen, wie ihre Daten genutzt werden, und schlechter, wenn die Daten ohne ihr Wissen erhoben wurden. Peppers und Rogers (1993) hatten lange vorher gefordert, dass der Sinn von Personalisierung ist, verschiedene Kunden nach dem, was jeder tut, verschieden zu behandeln, nicht ihnen zu zeigen, dass man sie beobachtet.",
          )}
        </p>
      </ShowMore>
      <Diagram label={tt("Three visitors, three levels of personalisation · a worked example on Neckar Hosting", "Drei Besucher, drei Stufen der Personalisierung · ein Beispiel mit Neckar Hosting")} caption={tt("Choose a visitor and a level and read what the page shows and how it is felt; then try the worked sort below.", "Wählen Sie einen Besucher und eine Stufe und lesen Sie, was die Seite zeigt und wie es empfunden wird; probieren Sie dann die Beispielsortierung darunter.")}>
        <MomentProfile />
      </Diagram>
      <ShowMore id="A2" part="extra" label={tt("Show: The GDPR still applies", "Zeigen: Die DSGVO gilt weiter")}>
        <Callout label={tt("The GDPR still applies", "Die DSGVO gilt weiter")} tone="rust">
          <p>{tt("Personal data needs a lawful basis (Art. 6), tracking on a website usually needs consent, and customers may object to direct marketing (Art. 21). Real time does not change any of it.", "Personenbezogene Daten brauchen eine Rechtsgrundlage (Art. 6), Tracking auf einer Website braucht meist eine Einwilligung, und Kunden können der Direktwerbung widersprechen (Art. 21). Echtzeit ändert daran nichts.")}</p>
        </Callout>
      </ShowMore>
    </MaterialCard>
  );
}

export function CardA3() {
  return (
    <MaterialCard
      id="A3"
      scan={tt("Respond at once where a decision happens and many leave: the order page, the contact form. Personalise where you know the visitor: the logged-in customer, the campaign visitor. Elsewhere neither is the first lever. Chatbots, callbacks, social media replies, dynamic pricing and adaptive content are the tools.", "Sofort reagieren, wo eine Entscheidung fällt und viele gehen: Bestellseite, Kontaktformular. Personalisieren, wo Sie den Besucher kennen: der angemeldete Kunde, der Kampagnenbesucher. Anderswo ist keines der erste Hebel. Chatbots, Rückrufe, Antworten in Social Media, Dynamic Pricing und adaptive Inhalte sind die Werkzeuge.")}
      reasoning={[
        tt("Respond immediately (chat, callback) where two things hold: a decision happens on the page, and 50% or more of visitors leave there. That is where an open question costs the deal.", "Sofort reagieren (Chat, Rückruf), wo zwei Dinge gelten: Auf der Seite fällt eine Entscheidung, und 50 % oder mehr der Besucher gehen dort. Dort kostet eine offene Frage den Auftrag."),
        tt("Personalise where you know the visitor: a logged-in customer (who they are) or a campaign visitor (why they came). Personalisation needs that knowledge.", "Personalisieren, wo Sie den Besucher kennen: ein angemeldeter Kunde (wer er ist) oder ein Kampagnenbesucher (warum er kam). Personalisierung braucht dieses Wissen."),
        tt("Many leaving is not enough: on a blog or a home page nobody decides, and a short visit can be a success. A decision page where few leave is working; it is not the first place to act.", "Dass viele gehen, reicht nicht: Auf einem Blog oder einer Startseite entscheidet niemand, und ein kurzer Besuch kann ein Erfolg sein. Eine Entscheidungsseite, auf der wenige gehen, funktioniert; sie ist nicht der erste Ort zum Handeln."),
        tt("A chatbot gives the immediate answer to common questions and hands the rest to a person within minutes. Without a fast hand-over it becomes a wall.", "Ein Chatbot gibt die sofortige Antwort auf häufige Fragen und übergibt den Rest innerhalb von Minuten an einen Menschen. Ohne schnelle Übergabe wird er zur Wand."),
        tt("Social media is a retention tool when questions there get a fast, named answer; publishing more posts is activity, not retention.", "Social Media ist ein Bindungswerkzeug, wenn Fragen dort eine schnelle Antwort mit Namen bekommen; mehr Posts zu veröffentlichen ist Aktivität, keine Bindung."),
        tt("Dynamic pricing (prices that change with behaviour) and adaptive content (a page that rearranges itself) act in real time too, but business customers compare prices: use limits, and watch complaints.", "Dynamic Pricing (Preise, die sich mit dem Verhalten ändern) und adaptive Inhalte (eine Seite, die sich selbst neu ordnet) wirken auch in Echtzeit, aber Geschäftskunden vergleichen Preise: Grenzen setzen und Beschwerden beobachten."),
      ]}
      sources={["adam2021", "kaplan2010", "denboer2015"]}
    >
      <ShowMore id="A3" part="research" label={tt("Show the research behind this card", "Die Forschung hinter dieser Karte zeigen")}>
        <p className={p}>
          {tt(
            "Adam, Wessel and Benlian (2021) show that chatbots handle first contact well when they are designed for it and know their limits. Kaplan and Haenlein (2010) describe social media as a two-way channel: firms that only publish miss that customers expect an answer there. den Boer (2015) reviews dynamic pricing, where prices are set by rules that learn from demand.",
            "Adam, Wessel und Benlian (2021) zeigen, dass Chatbots den Erstkontakt gut bewältigen, wenn sie dafür gestaltet sind und ihre Grenzen kennen. Kaplan und Haenlein (2010) beschreiben Social Media als Kanal in zwei Richtungen: Firmen, die nur veröffentlichen, übersehen, dass Kunden dort eine Antwort erwarten. den Boer (2015) gibt einen Überblick über Dynamic Pricing, bei dem Preise von Regeln gesetzt werden, die aus der Nachfrage lernen.",
          )}
        </p>
      </ShowMore>
      <Diagram label={tt("Where to respond, where to personalise · a worked example on Neckar Hosting", "Wo reagieren, wo personalisieren · ein Beispiel mit Neckar Hosting")} caption={tt("Choose a page on the grid or in the list and read where it falls and why.", "Wählen Sie eine Seite im Raster oder in der Liste und lesen Sie, wo sie liegt und warum.")}>
        <AutomationGrid />
      </Diagram>
      <ShowMore id="A3" part="table" label={tt("Show the table: the real-time tools", "Tabelle zeigen: Die Echtzeit-Werkzeuge")}>
        <DataTable
          head={[tt("Tool", "Werkzeug"), tt("What it does in real time", "Was es in Echtzeit tut"), tt("Where it fits", "Wo es passt")]}
          rows={[
            [tt("Chatbot and live chat", "Chatbot und Live-Chat"), tt("Answers at once, hands over to a person", "Antwortet sofort, übergibt an einen Menschen"), tt("Decision pages where many leave", "Entscheidungsseiten, auf denen viele gehen")],
            [tt("Callback", "Rückruf"), tt("A person calls within minutes of a request", "Ein Mensch ruft Minuten nach einer Anfrage an"), tt("Large requests, office hours", "Große Anfragen, Bürozeiten")],
            [tt("Social media replies", "Antworten in Social Media"), tt("A named person answers within the hour", "Eine namentliche Person antwortet innerhalb der Stunde"), tt("Where customers ask in public", "Wo Kunden öffentlich fragen")],
            [tt("Dynamic pricing", "Dynamic Pricing"), tt("Changes a price with behaviour and demand", "Ändert einen Preis mit Verhalten und Nachfrage"), tt("Within limits, where changing prices are accepted", "In Grenzen, wo wechselnde Preise akzeptiert sind")],
            [tt("Adaptive content", "Adaptive Inhalte"), tt("Rearranges a page for the visitor", "Ordnet eine Seite für den Besucher neu"), tt("Known visitors: customers, campaigns", "Bekannte Besucher: Kunden, Kampagnen")],
          ]}
          caption={tt("The real-time tools", "Die Echtzeit-Werkzeuge")}
        />
      </ShowMore>
    </MaterialCard>
  );
}

export function CardA4() {
  const r = MOSEL_RESULT;
  return (
    <MaterialCard
      id="A4"
      scan={tt("To put a euro figure on speed, compare how often requests closed when they were answered fast and when they were answered slowly. Three figures read it: the closing rate of each group, the lift, and the extra revenue a year if every request were answered fast.", "Um Tempo einen Euro-Wert zu geben, vergleichen Sie, wie oft Anfragen abschlossen, wenn sie schnell, und wenn sie langsam beantwortet wurden. Drei Werte lesen es: die Abschlussquote jeder Gruppe, der Lift und der zusätzliche Umsatz pro Jahr, wenn jede Anfrage schnell beantwortet würde.")}
      reasoning={[
        tt("Closing rate = closed deals ÷ requests × 100. Take both numbers from the same speed band's rows.", "Abschlussquote = Abschlüsse ÷ Anfragen × 100. Nehmen Sie beide Zahlen aus den Zeilen desselben Tempo-Bands."),
        tt("Lift = closing rate of fast answers ÷ closing rate of slow answers. Work out the slow rate from its own rows first; the groups are not the same size, so compare rates, never counts.", "Lift = Abschlussquote schneller Antworten ÷ Abschlussquote langsamer Antworten. Berechnen Sie die langsame Quote zuerst aus ihren eigenen Zeilen; die Gruppen sind nicht gleich groß, also vergleichen Sie Quoten, nie Zahlen."),
        tt("Extra revenue a year = requests a year × (fast rate − slow rate, as a share of one) × average deal value. Only the difference counts: slow answers would have closed their share anyway. One point is 0.01.", "Zusätzlicher Umsatz pro Jahr = Anfragen pro Jahr × (schnelle Quote − langsame Quote, als Anteil von eins) × durchschnittlicher Auftragswert. Nur der Unterschied zählt: Langsame Antworten hätten ihren Anteil ohnehin abgeschlossen. Ein Punkt ist 0,01."),
        tt("Use the requests of a whole year, not those of one quarter's speed band.", "Nehmen Sie die Anfragen eines ganzen Jahres, nicht die eines Tempo-Bands aus einem Quartal."),
        tt("These figures compare requests someone chose to answer fast or slowly, so they are not yet a fair test: say them as an estimate, and test fairly before you promise the full amount (Materi A6).", "Diese Werte vergleichen Anfragen, die jemand schnell oder langsam beantworten wollte, sind also noch kein fairer Test: Sagen Sie sie als Schätzung, und testen Sie fair, bevor Sie den ganzen Betrag versprechen (Materi A6)."),
        tt("A sentence about speed quotes at least one figure, says what to change first, and how sure it can be.", "Ein Satz über Tempo nennt mindestens einen Wert, sagt, was zuerst zu ändern ist, und wie sicher man sein kann."),
      ]}
      sources={["provost2013", "oldroyd2011"]}
    >
      <ShowMore id="A4" part="research" label={tt("Show the research behind this card", "Die Forschung hinter dieser Karte zeigen")}>
        <p className={p}>
          {tt(
            "Provost and Fawcett (2013) name rates, lift and expected value as the basic tools for reading any comparison: compare two groups, and put a value on the difference. Applied to speed, as Oldroyd and colleagues (2011) did, the groups are fast and slow answers. The worked example uses Neckar Hosting's numbers; the steps are the same for any company.",
            "Provost und Fawcett (2013) nennen Raten, Lift und Erwartungswert als Grundwerkzeuge, um jeden Vergleich zu lesen: zwei Gruppen vergleichen und dem Unterschied einen Wert geben. Auf Tempo angewandt, wie bei Oldroyd und Kollegen (2011), sind die Gruppen schnelle und langsame Antworten. Das Beispiel nutzt die Zahlen von Neckar Hosting; die Schritte sind für jedes Unternehmen gleich.",
          )}
        </p>
      </ShowMore>
      <Diagram label={tt("What speed is worth · worked example on Neckar Hosting (Case assumption)", "Was Tempo wert ist · Beispiel mit Neckar Hosting (Fallannahme)")} caption={tt("Move the slider to change how many quote requests Neckar receives in a year.", "Bewegen Sie den Regler, um zu ändern, wie viele Angebotsanfragen Neckar pro Jahr erhält.")}>
        <PilotExample />
      </Diagram>
      <ShowMore id="A4" part="calc" label={tt("Show the table: the four steps, on other numbers than the task", "Tabelle zeigen: Die vier Schritte, mit anderen Zahlen als in der Aufgabe")}>
        <DataTable
          head={[tt("Step", "Schritt"), tt("Calculation · Neckar Hosting", "Rechnung · Neckar Hosting"), tt("Result", "Ergebnis")]}
          rows={[
            [tt("1 · Closing rate, answered within one hour", "1 · Abschlussquote, innerhalb einer Stunde"), `${MOSEL.variant.orders} ÷ ${num(MOSEL.variant.sent)} × 100`, pct(r.rate)],
            [tt("2 · Closing rate, answered after more than a day", "2 · Abschlussquote, nach mehr als einem Tag"), `${MOSEL.control.orders} ÷ ${num(MOSEL.control.sent)} × 100`, pct(r.other)],
            [tt("3 · Lift", "3 · Lift"), `${num(r.rate)} ÷ ${num(r.other)}`, tt(`${num(r.lift)} times`, `${num(r.lift)}-mal`)],
            [tt("4 · Extra revenue a year", "4 · Zusätzlicher Umsatz pro Jahr"), `${num(MOSEL.yearly)} × ${num((r.rate - r.other) / 100)} × ${euro(MOSEL.order)}`, euro(r.extra)],
          ]}
          caption={tt("The four steps, on other numbers than the task", "Die vier Schritte, mit anderen Zahlen als in der Aufgabe")}
        />
      </ShowMore>
    </MaterialCard>
  );
}

export function CardA5() {
  return (
    <MaterialCard
      id="A5"
      scan={tt("Real-time screens show many numbers; few of them steer. An outcome KPI is the result (deals, revenue, customers kept); a driver KPI comes before it and moves this week (response time, interaction); a guardrail must not get worse (unhelpful chats); a vanity metric counts reach or activity (visitors, posts).", "Echtzeit-Bildschirme zeigen viele Zahlen; wenige davon steuern. Ein Outcome-KPI ist das Ergebnis (Abschlüsse, Umsatz, gehaltene Kunden); ein Treiber-KPI kommt davor und bewegt sich diese Woche (Antwortzeit, Interaktion); eine Guardrail darf nicht schlechter werden (nicht hilfreiche Chats); eine Vanity Metric zählt Reichweite oder Aktivität (Besucher, Posts).")}
      reasoning={[
        ...PATTERN_IDS.map((x) => `${PATTERNS[x].label}: ${PATTERNS[x].test}`),
        ...PATTERN_PAIR_TESTS.map((x) => `${x.pair} ${x.test}`),
        tt("Tag what a metric measures, not how it behaved last year: a driver that did not move with value is still a driver. Response time counts as a driver although it measures your speed: it comes before the deal and your team moves it.", "Ordnen Sie zu, was eine Kennzahl misst, nicht wie sie sich letztes Jahr verhielt: Ein Treiber, der sich nicht mit dem Wert bewegte, ist trotzdem ein Treiber. Die Antwortzeit zählt als Treiber, obwohl sie Ihr Tempo misst: Sie kommt vor dem Abschluss, und Ihr Team bewegt sie."),
        RISK_RULE.v,
        tt("How to use each kind: outcome → the target on the management dashboard; driver → a live screen for the team that can move it, reviewed weekly; guardrail → a limit that stops a test or a rollout; vanity → stop reporting it as success. A bonus on a number rewards reporting it, not moving it.", "Wie man jede Art nutzt: Outcome → das Ziel im Management-Dashboard; Treiber → ein Live-Bildschirm für das Team, das ihn bewegen kann, wöchentlich geprüft; Guardrail → eine Grenze, die einen Test oder Rollout stoppt; Vanity → nicht mehr als Erfolg berichten. Ein Bonus auf eine Zahl belohnt, dass sie berichtet wird, nicht dass sie bewegt wird."),
        tt("A good set of three KPIs has at least one outcome and one driver, each with where the number comes from, what you would aim for and why it is a KPI; a guardrail is a strong third.", "Ein gutes Set aus drei KPIs hat mindestens ein Outcome und einen Treiber, jeder mit Quelle der Zahl, dem, was Sie anstreben würden, und warum er ein KPI ist; eine Guardrail ist ein starker dritter."),
        tt("How you recognise an improvement: the outcome or driver moves in the right direction against a control group, on enough cases, while the guardrail holds.", "Woran Sie eine Verbesserung erkennen: Outcome oder Treiber bewegen sich gegen eine Kontrollgruppe in die richtige Richtung, bei genug Fällen, während die Guardrail hält."),
      ]}
      sources={["kaplan1992", "ries2011"]}
    >
      <ShowMore id="A5" part="research" label={tt("Show the research behind this card", "Die Forschung hinter dieser Karte zeigen")}>
        <p className={p}>
          {tt(
            "Kaplan and Norton (1992) argued that managers should steer by a few linked measures: the results, and the drivers that lead to them. Ries (2011) called the numbers that go up whatever you do “vanity metrics”. Real-time dashboards make both points sharper: a live visitor counter is exciting and decides nothing.",
            "Kaplan und Norton (1992) forderten, dass Führungskräfte nach wenigen verbundenen Kennzahlen steuern: den Ergebnissen und den Treibern, die zu ihnen führen. Ries (2011) nannte die Zahlen, die steigen, egal was man tut, „Vanity Metrics“. Echtzeit-Dashboards machen beide Punkte schärfer: Ein Live-Besucherzähler ist spannend und entscheidet nichts.",
          )}
        </p>
      </ShowMore>
      <Diagram label={tt("A real-time KPI tree · a worked example on Neckar Hosting", "Ein Echtzeit-KPI-Baum · ein Beispiel mit Neckar Hosting")} caption={tt("Choose a metric to read its kind, then show whether each moved with customer value last year.", "Wählen Sie eine Kennzahl, um ihre Art zu lesen, und zeigen Sie dann, ob sich jede letztes Jahr mit dem Kundenwert bewegte.")}>
        <KpiTree />
      </Diagram>
      <ShowMore id="A5" part="table" label={tt("Show the table: the four kinds of metric", "Tabelle zeigen: Die vier Arten von Kennzahlen")}>
        <DataTable
          head={[tt("Kind", "Art"), tt("What it is", "Was es ist"), tt("Where it sits", "Wo es steht")]}
          rows={PATTERN_IDS.map((x) => [PATTERNS[x].label, PATTERNS[x].means, PATTERNS[x].shape])}
          caption={tt("The four kinds of metric", "Die vier Arten von Kennzahlen")}
        />
      </ShowMore>
    </MaterialCard>
  );
}

export function CardA6() {
  return (
    <MaterialCard
      id="A6"
      scan={tt("Digital channels make testing easy and reading the result tempting too early. A fair A/B test changes one thing, splits visitors by chance in the same weeks, is judged by the result, and has a size fixed before the start. Feedback loops keep improving what the test found.", "Digitale Kanäle machen Testen leicht und das zu frühe Lesen des Ergebnisses verlockend. Ein fairer A/B-Test ändert eine Sache, teilt Besucher per Zufall in denselben Wochen, wird am Ergebnis gemessen und hat eine vor dem Start festgelegte Größe. Feedbackschleifen verbessern weiter, was der Test gefunden hat.")}
      reasoning={[
        tt("One change: if the variant differs in two things and wins, nobody knows which one did it.", "Eine Änderung: Unterscheidet sich die Variante in zwei Dingen und gewinnt, weiß niemand, welches es war."),
        tt("A random split in the same weeks: comparing with last month, with phone against computer visitors, or with visitors who closed the chat lets something other than the change explain the difference.", "Eine zufällige Aufteilung in denselben Wochen: Der Vergleich mit dem Vormonat, von Handy- mit Computer-Besuchern oder mit Besuchern, die den Chat schlossen, lässt etwas anderes als die Änderung den Unterschied erklären."),
        tt("The KPI that decides is the result the problem is about (for few closings: quote requests or deals per visitor), not chat windows opened and not page views.", "Der KPI, der entscheidet, ist das Ergebnis, um das es beim Problem geht (bei wenigen Abschlüssen: Angebotsanfragen oder Abschlüsse pro Besucher), nicht geöffnete Chatfenster und nicht Seitenaufrufe."),
        tt("Fix the size before you start: about 100 requests per group and at least two full weeks. A live screen swings with every visit; stopping when the variant is ahead picks a lucky moment.", "Legen Sie die Größe vor dem Start fest: etwa 100 Anfragen pro Gruppe und mindestens zwei volle Wochen. Ein Live-Bildschirm schwankt mit jedem Besuch; zu stoppen, wenn die Variante vorn liegt, wählt einen glücklichen Moment."),
        tt("Write the hypothesis (“if we …, then … rises, because …”) and the decision rule (roll out, keep testing, stop, and which guardrail must hold) before the test starts.", "Schreiben Sie die Hypothese („wenn wir …, dann steigt …, weil …“) und die Entscheidungsregel (ausrollen, weiter testen, stoppen, und welche Guardrail halten muss) vor dem Teststart auf."),
        tt("A feedback loop closes the circle: ratings and results are read every week and the worst parts are changed first.", "Eine Feedbackschleife schließt den Kreis: Bewertungen und Ergebnisse werden jede Woche gelesen, und die schlechtesten Teile werden zuerst geändert."),
        tt("Real uncertainties: a small base, fast answers given to the more eager customers (not a fair split), visitors not tracked because they refused cookies, and a season or campaign that changes who visits. “Lower bounce always means more sales”, “real-time data is always right” and “more live KPIs measure better” are mistakes, not uncertainties.", "Echte Unsicherheiten: eine kleine Basis, schnelle Antworten an die interessierteren Kunden (keine faire Aufteilung), Besucher, die wegen abgelehnter Cookies nicht erfasst werden, und eine Saison oder Kampagne, die ändert, wer die Seite besucht. „Weniger Absprünge heißt immer mehr Umsatz“, „Echtzeitdaten stimmen immer“ und „mehr Live-KPIs messen besser“ sind Fehler, keine Unsicherheiten."),
      ]}
      sources={["kohavi2020", "markey2009"]}
    >
      <ShowMore id="A6" part="research" label={tt("Show the research behind this card", "Die Forschung hinter dieser Karte zeigen")}>
        <p className={p}>
          {tt(
            "Kohavi, Tang and Xu (2020) collected what makes online experiments trustworthy: a random split, one change at a time, a size fixed in advance, guardrail metrics, and no peeking to stop early. Markey, Reichheld and Dullweber (2009) describe how firms close the feedback loop: act on what customers say quickly, and report back.",
            "Kohavi, Tang und Xu (2020) haben gesammelt, was Online-Experimente vertrauenswürdig macht: eine zufällige Aufteilung, eine Änderung auf einmal, eine vorab festgelegte Größe, Guardrail-Kennzahlen und kein vorzeitiges Hinschauen, um früh zu stoppen. Markey, Reichheld und Dullweber (2009) beschreiben, wie Firmen die Feedbackschleife schließen: schnell auf das handeln, was Kunden sagen, und zurückmelden.",
          )}
        </p>
      </ShowMore>
      <Diagram label={tt("A fair test in a digital channel, and how sure it is · a worked example on Neckar Hosting", "Ein fairer Test in einem digitalen Kanal, und wie sicher er ist · ein Beispiel mit Neckar Hosting")} caption={tt("Switch between the four ways of running the test, then move the slider to change how many requests each group has.", "Wechseln Sie zwischen den vier Arten, den Test durchzuführen, und bewegen Sie dann den Regler, um zu ändern, wie viele Anfragen jede Gruppe hat.")}>
        <FairTest />
      </Diagram>
      <ShowMore id="A6" part="table" label={tt("Show the table: the test card, part by part", "Tabelle zeigen: Die Testkarte, Teil für Teil")}>
        <DataTable
          head={[tt("Part of the test card", "Teil der Testkarte"), tt("Fair", "Fair"), tt("What goes wrong otherwise", "Was sonst schiefgeht")]}
          rows={[
            [tt("What changes", "Was sich ändert"), tt("One thing only", "Nur eine Sache"), tt("A win cannot be put down to anything", "Ein Gewinn lässt sich nichts zuschreiben")],
            [tt("Control group", "Kontrollgruppe"), tt("Random half, same weeks", "Zufällige Hälfte, dieselben Wochen"), tt("Another month, another device or self-chosen visitors explain the difference", "Ein anderer Monat, ein anderes Gerät oder selbst gewählte Besucher erklären den Unterschied")],
            [tt("Success KPI", "Erfolgs-KPI"), tt("The result: requests or deals per visitor", "Das Ergebnis: Anfragen oder Abschlüsse pro Besucher"), tt("Chat windows open and nobody asks for a quote", "Chatfenster öffnen sich, und niemand fragt ein Angebot an")],
            [tt("Size and duration", "Größe und Dauer"), tt("Fixed: about 100 requests per group, two full weeks", "Fest: etwa 100 Anfragen pro Gruppe, zwei volle Wochen"), tt("A lucky moment on the live screen is taken for a result", "Ein glücklicher Moment auf dem Live-Bildschirm wird für ein Ergebnis gehalten")],
          ]}
          caption={tt("The test card, part by part", "Die Testkarte, Teil für Teil")}
        />
      </ShowMore>
    </MaterialCard>
  );
}

export function CardA7() {
  return (
    <MaterialCard
      id="A7"
      scan={tt("Choose measures by the plan's three tests, each Low (1) to High (3), multiplied: effect (how much it moves the result), speed (how soon it works) and scalability (does it reach every visitor without extra cost). Then check the budget and which problems you answer.", "Wählen Sie Maßnahmen nach den drei Tests des Plans, jeweils Niedrig (1) bis Hoch (3), multipliziert: Wirkung (wie stark sie das Ergebnis bewegt), Tempo (wie bald sie wirkt) und Skalierbarkeit (erreicht sie jeden Besucher ohne Zusatzkosten). Prüfen Sie dann das Budget und welche Probleme Sie beantworten.")}
      reasoning={[
        EXPLAIN_RULE.v,
        tt("Effect: 3 if it changes what most visitors do on the pages where they decide (stay, ask, request a quote); 2 if it helps but only some visitors or only indirectly; 1 if it hardly changes what customers do, or only for a moment.", "Wirkung: 3, wenn sie ändert, was die meisten Besucher auf den Seiten tun, auf denen sie entscheiden (bleiben, fragen, ein Angebot anfragen); 2, wenn sie hilft, aber nur einigen Besuchern oder nur indirekt; 1, wenn sie kaum ändert, was Kunden tun, oder nur für einen Moment."),
        tt("Scalability: 3 if, once built, it serves every visitor with no extra people; 2 if it needs some extra people or cost as it grows; 1 if it grows only by adding people (a callback needs a person for every call).", "Skalierbarkeit: 3, wenn sie, einmal gebaut, jedem Besucher ohne zusätzliche Personen dient; 2, wenn sie beim Wachsen etwas mehr Personal oder Kosten braucht; 1, wenn sie nur wächst, indem man Personal ergänzt (ein Rückruf braucht für jeden Anruf eine Person)."),
        tt("A price is built from parts: set-up, a licence for the months, and hours of staff time × the hourly cost. Add the parts to check a price, and ask what part recurs: people and discounts grow with volume, a tool built once does not.", "Ein Preis besteht aus Teilen: Einrichtung, eine Lizenz für die Monate und Arbeitsstunden × Stundenkosten. Addieren Sie die Teile, um einen Preis zu prüfen, und fragen Sie, welcher Teil wiederkehrt: Personal und Rabatte wachsen mit der Menge, ein einmal gebautes Tool nicht."),
        tt("Match each measure to the problems it really answers: keeping visitors at the moment they would leave answers high bounce; getting them to talk or ask answers low interaction; one screen and one weekly decision for all measures answers “not coordinated”. A discount pop-up answers none of these: it pays everyone and starts no conversation.", "Ordnen Sie jede Maßnahme den Problemen zu, die sie wirklich beantwortet: Besucher in dem Moment zu halten, in dem sie gehen würden, beantwortet hohe Absprünge; sie zum Reden oder Fragen zu bringen, beantwortet geringe Interaktion; ein Bildschirm und eine wöchentliche Entscheidung für alle Maßnahmen beantwortet „nicht abgestimmt“. Ein Rabatt-Pop-up beantwortet keines davon: Es bezahlt jeden und beginnt kein Gespräch."),
        tt("The label after the weeks says which lever a measure pulls: respond faster, personalise the moment, learn and adjust, or none of them. The brief's three problems call for shorter waits, a page that fits the visitor, and a routine that learns from tests; a discount or a redesign pulls none of the three levers taught in Materi A2.", "Das Etikett hinter den Wochen sagt, an welchem Hebel eine Maßnahme zieht: schneller reagieren, den Moment personalisieren, lernen und anpassen, oder an keinem. Die drei Probleme des Auftrags verlangen kürzere Wartezeiten, eine Seite, die zum Besucher passt, und eine Routine, die aus Tests lernt; ein Rabatt oder ein Relaunch zieht an keinem der drei Hebel aus Materi A2."),
        tt("Give a reason for the two judged scores, in your own words and with a fact from the card: for effect, what the customer or visitor sees or does differently; for scalability, whether it reaches everyone without more people, and the weeks it needs.", "Geben Sie für die zwei beurteilten Werte einen Grund, in eigenen Worten und mit einer Tatsache von der Karte: bei der Wirkung, was der Kunde oder Besucher anders sieht oder tut; bei der Skalierbarkeit, ob es alle ohne mehr Personal erreicht, und die Wochen, die es braucht."),
        tt("The budget is a limit to weigh, not a lock. If the plan is over, the rule is to leave out the lowest score rather than trim every measure a little; if you keep it anyway, say why.", "Das Budget ist eine Grenze zum Abwägen, keine Sperre. Liegt der Plan darüber, ist die Regel, den niedrigsten Wert wegzulassen, statt jede Maßnahme ein bisschen zu kürzen; behalten Sie ihn trotzdem, sagen Sie warum."),
        tt("Order by score; if you put a lower score first, say why (it coordinates the others, or it needs the longest set-up).", "Ordnen Sie nach Wert; setzen Sie einen niedrigeren Wert nach vorn, sagen Sie warum (sie stimmt die anderen ab, oder sie braucht die längste Vorlaufzeit)."),
      ]}
      sources={["hubbard2014", "davenport2018"]}
    >
      <ShowMore id="A7" part="research" label={tt("Show the research behind this card", "Die Forschung hinter dieser Karte zeigen")}>
        <p className={p}>
          {tt(
            "Hubbard (2014) advises measuring what would change a decision; under time pressure, the time until a measure works is one of those things. Davenport and Ronanki (2018) add that the projects that scale are built once and used across many customers. The plan names the evaluation for this day: effect × speed × scalability.",
            "Hubbard (2014) rät, zu messen, was eine Entscheidung ändern würde; unter Zeitdruck gehört die Zeit, bis eine Maßnahme wirkt, dazu. Davenport und Ronanki (2018) ergänzen, dass die Projekte skalieren, die einmal gebaut und über viele Kunden genutzt werden. Der Plan nennt die Bewertung für diesen Tag: Wirkung × Tempo × Skalierbarkeit.",
          )}
        </p>
      </ShowMore>
      <Diagram label={tt("Three measures of Neckar Hosting, scored", "Drei Maßnahmen von Neckar Hosting, bewertet")} caption={tt("Choose a measure to read its three scores and why each one is what it is.", "Wählen Sie eine Maßnahme, um ihre drei Werte zu lesen und warum jeder so ist.")}>
        <ScoreExample />
      </Diagram>
      <ShowMore id="A7" part="notes" label={tt("Show two short notes", "Zwei kurze Hinweise zeigen")}>
        <Bul
          items={[
            tt("Speed is read from the printed weeks, never guessed.", "Das Tempo wird aus den gedruckten Wochen gelesen, nie geschätzt."),
            tt("A fast, personal measure can still score low when it depends on one person's time.", "Eine schnelle, persönliche Maßnahme kann trotzdem niedrig punkten, wenn sie von der Zeit einer Person abhängt."),
          ]}
        />
      </ShowMore>
    </MaterialCard>
  );
}

export const CARDS_A = [CardA1, CardA2, CardA3, CardA4, CardA5, CardA6, CardA7];
