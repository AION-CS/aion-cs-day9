"use client";

import { Bul, Diagram } from "@/components/materi/kit";
import { ArchExample, CompProfile, DataStages, LiftCases, SourceGrid } from "@/components/materi/diagramsB";
import { Callout, DataTable, MaterialCard } from "@/components/ui/MaterialCard";
import { ShowMore } from "@/components/ui/ShowMore";
import { CASES_MIN, CRITERIA, LIFT_ACT, LIFT_WATCH, QUALITY_BAR } from "@/data/route2";
import { tt } from "@/lib/lang";

/** Materi B: the five cards of Route 2 (Level 3). 60 minutes in all. */
const p = "text-body text-ink";

export function CardB1() {
  return (
    <MaterialCard
      id="B1"
      scan={tt("A real-time retention system is not a faster channel here and there. It is one live view of every customer interaction, a response standard with an owner for every central point, and a weekly loop that decides on every running measure. It connects speed and quality.", "Ein Echtzeit-Bindungssystem ist kein schnellerer Kanal hier und da. Es ist eine Live-Sicht auf jede Kundeninteraktion, ein Antwortstandard mit Owner für jeden zentralen Punkt und eine wöchentliche Schleife, die über jede laufende Maßnahme entscheidet. Es verbindet Tempo und Qualität.")}
      reasoning={[
        tt("One live view comes first: if every team answers the same customer in its own tool, interaction stays uncoordinated however fast each team is.", "Eine Live-Sicht kommt zuerst: Beantwortet jedes Team denselben Kunden in seinem eigenen Werkzeug, bleibt die Interaktion unabgestimmt, egal wie schnell jedes Team ist."),
        tt("A response standard per central point (how fast, who, when a person takes over) is what turns “responses too slow” into a managed promise.", "Ein Antwortstandard pro zentralem Punkt (wie schnell, wer, wann ein Mensch übernimmt) macht aus „Antworten zu langsam“ ein gesteuertes Versprechen."),
        tt("KPI owners and a weekly feedback loop keep the system honest; both are good additions to the two foundations.", "KPI-Owner und eine wöchentliche Feedbackschleife halten das System ehrlich; beides sind gute Ergänzungen zu den zwei Fundamenten."),
        tt("Automating every contact because the fastest answer always wins is wrong: a contract at stake or an upset customer needs a person, and a fast wrong answer costs more than a slower right one.", "Jeden Kontakt zu automatisieren, weil die schnellste Antwort immer gewinnt, ist falsch: Ein Vertrag auf dem Spiel oder ein verärgerter Kunde braucht einen Menschen, und eine schnelle falsche Antwort kostet mehr als eine langsamere richtige."),
        tt("Waiting for complete data before any real-time measure starts is not a vision: the brief asks for action under an incomplete data situation, and some points are tracked well enough already.", "Auf vollständige Daten zu warten, bevor irgendeine Echtzeit-Maßnahme startet, ist kein Zielbild: Der Auftrag verlangt Handeln bei unvollständiger Datenlage, und manche Punkte werden schon gut genug erfasst."),
      ]}
      sources={["markey2009", "oldroyd2011"]}
    >
      <ShowMore id="B1" part="research" label={tt("Show the research behind this card", "Die Forschung hinter dieser Karte zeigen")}>
        <p className={p}>
          {tt(
            "Markey, Reichheld and Dullweber (2009) describe firms that close the customer feedback loop: front-line teams see what customers say, act within days, and the loop improves the service week by week. Oldroyd and colleagues (2011) show what is at stake when the loop is slow: leads lose value by the hour.",
            "Markey, Reichheld und Dullweber (2009) beschreiben Firmen, die die Feedbackschleife schließen: Teams an der Kundenfront sehen, was Kunden sagen, handeln innerhalb von Tagen, und die Schleife verbessert den Service Woche für Woche. Oldroyd und Kollegen (2011) zeigen, was auf dem Spiel steht, wenn die Schleife langsam ist: Leads verlieren stündlich an Wert.",
          )}
        </p>
      </ShowMore>
      <Diagram label={tt("Four stages towards a real-time system · a worked example on Elster Digital", "Vier Stufen zu einem Echtzeitsystem · ein Beispiel mit Elster Digital")} caption={tt("Click a stage and read what changes for the company at that stage.", "Klicken Sie eine Stufe an und lesen Sie, was sich auf dieser Stufe für das Unternehmen ändert.")}>
        <DataStages />
      </Diagram>
    </MaterialCard>
  );
}

export function CardB2() {
  return (
    <MaterialCard
      id="B2"
      scan={tt("Not every touchpoint needs real time. A point is central when the customer decides something there (buy, ask, renew, cancel); it is ready for real time when enough of its interactions are tracked. Traffic is not the test.", "Nicht jeder Touchpoint braucht Echtzeit. Ein Punkt ist zentral, wenn der Kunde dort etwas entscheidet (kaufen, fragen, verlängern, kündigen); er ist bereit für Echtzeit, wenn genug seiner Interaktionen erfasst werden. Traffic ist nicht der Test.")}
      reasoning={[
        tt("No customer decision happens at the point → not central, however busy or well tracked.", "Am Punkt fällt keine Kundenentscheidung → nicht zentral, egal wie viel los ist oder wie gut er erfasst wird."),
        tt(`A decision happens there and at least ${QUALITY_BAR}% of interactions are tracked → central: real-time now, with a response standard.`, `Dort fällt eine Entscheidung, und mindestens ${QUALITY_BAR} % der Interaktionen werden erfasst → zentral: jetzt in Echtzeit, mit Antwortstandard.`),
        tt(`A decision happens there but less than ${QUALITY_BAR}% is tracked → central, but fix the tracking first: steering it live now would steer by the gaps.`, `Dort fällt eine Entscheidung, aber weniger als ${QUALITY_BAR} % werden erfasst → zentral, aber zuerst die Erfassung verbessern: Es jetzt live zu steuern, hieße nach den Lücken zu steuern.`),
        tt("Cost and traffic are not the test: a quiet renewal notice is central, a busy blog is not.", "Kosten und Traffic sind nicht der Test: Ein ruhiger Verlängerungshinweis ist zentral, ein viel besuchter Blog nicht."),
      ]}
      sources={["hubbard2014", "gdpr2016"]}
    >
      <ShowMore id="B2" part="research" label={tt("Show the research behind this card", "Die Forschung hinter dieser Karte zeigen")}>
        <p className={p}>
          {tt(
            "Hubbard (2014) argues that measuring is worth it only where it could change a decision; the same holds for reacting in real time. Tracking itself has limits: under the GDPR, much website tracking needs consent, so an incomplete data situation is normal, not a failure. Start where the decision is and the data is good enough.",
            "Hubbard (2014) argumentiert, dass Messen sich nur dort lohnt, wo es eine Entscheidung ändern könnte; dasselbe gilt für Reagieren in Echtzeit. Auch die Erfassung hat Grenzen: Nach der DSGVO braucht viel Website-Tracking eine Einwilligung, also ist eine unvollständige Datenlage normal, kein Versagen. Beginnen Sie dort, wo die Entscheidung fällt und die Daten gut genug sind.",
          )}
        </p>
      </ShowMore>
      <Diagram label={tt("Elster Digital's interaction points, sorted by customer decision and tracking", "Interaktionspunkte von Elster Digital, nach Kundenentscheidung und Erfassung sortiert")} caption={tt("Click a point to read where it goes and why.", "Klicken Sie einen Punkt an, um zu lesen, wohin er gehört und warum.")}>
        <SourceGrid />
      </Diagram>
    </MaterialCard>
  );
}

export function CardB3() {
  return (
    <MaterialCard
      id="B3"
      scan={tt("A KPI and optimisation system needs a few KPIs that pass four tests: linked to value, early, covering every customer, and measured automatically. In real time, early means live or daily. Rate each candidate, capped by its printed facts.", "Ein KPI- und Optimierungssystem braucht wenige KPIs, die vier Tests bestehen: mit dem Wert verbunden, früh, jeden Kunden abdeckend und automatisch gemessen. In Echtzeit heißt früh: live oder täglich. Bewerten Sie jeden Kandidaten, gedeckelt durch seine gedruckten Fakten.")}
      reasoning={[
        ...CRITERIA.map((c) => `${c.name}: ${c.test} ${tt("Low", "Niedrig")}: ${c.low} ${tt("High", "Hoch")}: ${c.high}`),
        tt("The printed facts cap the ratings: not linked to value → link Low; after the customer has left or twice a year → early Low, monthly → at most Mid; only some customers → reach at most Mid; by a survey → measured automatically at most Mid, collected by hand → Low.", "Die gedruckten Fakten deckeln die Bewertungen: nicht mit dem Wert verbunden → Verbindung Niedrig; nachdem der Kunde gegangen ist oder zweimal im Jahr → früh Niedrig, monatlich → höchstens Mittel; nur einige Kunden → Reichweite höchstens Mittel; über eine Befragung → automatisch gemessen höchstens Mittel, von Hand gesammelt → Niedrig."),
        tt("A real-time system needs most of its KPIs to show a change live or within days; a number that counts the loss afterwards is for learning, not for steering.", "Ein Echtzeitsystem braucht die meisten KPIs so, dass sie eine Veränderung live oder innerhalb von Tagen zeigen; eine Zahl, die den Verlust hinterher zählt, dient dem Lernen, nicht dem Steuern."),
        tt("The KPI with the greatest leverage is usually the driver the problem names, if it is also linked to value and automatic: every measure can be steered by it within days.", "Der KPI mit der größten Hebelwirkung ist meist der Treiber, den das Problem nennt, wenn er zugleich mit dem Wert verbunden und automatisch ist: Jede Maßnahme lässt sich innerhalb von Tagen daran steuern."),
      ]}
      sources={["kaplan1992", "ries2011"]}
    >
      <ShowMore id="B3" part="research" label={tt("Show the research behind this card", "Die Forschung hinter dieser Karte zeigen")}>
        <p className={p}>
          {tt(
            "Kaplan and Norton (1992) showed that managers steer better by a few linked measures, results and the drivers behind them, than by many unrelated ones. Ries (2011) warned against numbers that rise whatever you do. A live visitor counter is the purest example: it moves every second and tells you nothing about whether anyone will buy.",
            "Kaplan und Norton (1992) zeigten, dass Führungskräfte besser nach wenigen verbundenen Kennzahlen steuern, Ergebnissen und den Treibern dahinter, als nach vielen unverbundenen. Ries (2011) warnte vor Zahlen, die steigen, egal was man tut. Ein Live-Besucherzähler ist das reinste Beispiel: Er bewegt sich jede Sekunde und sagt nichts darüber, ob jemand kaufen wird.",
          )}
        </p>
      </ShowMore>
      <Diagram label={tt("Four KPI candidates of Elster Digital on four tests", "Vier KPI-Kandidaten von Elster Digital nach vier Tests")} caption={tt("Choose a candidate and compare its profile with the printed facts under it.", "Wählen Sie einen Kandidaten und vergleichen Sie sein Profil mit den gedruckten Fakten darunter.")}>
        <CompProfile />
      </Diagram>
    </MaterialCard>
  );
}

export function CardB4() {
  return (
    <MaterialCard
      id="B4"
      scan={tt("Automation and personalisation measures are chosen by testing them: every test ends in a decision, roll out, keep testing or stop, and who acts. Two numbers decide it: the uplift over the control group, and how many conversions it rests on.", "Automatisierungs- und Personalisierungsmaßnahmen werden ausgewählt, indem man sie testet: Jeder Test endet in einer Entscheidung, ausrollen, weiter testen oder stoppen, und wer handelt. Zwei Zahlen entscheiden: der Uplift gegenüber der Kontrollgruppe und auf wie vielen Conversions er beruht.")}
      reasoning={[
        tt(`Roll out when the uplift is ${LIFT_ACT}% or more and each group has at least ${CASES_MIN} conversions: the gain is clear and proven.`, `Ausrollen, wenn der Uplift ${LIFT_ACT} % oder mehr beträgt und jede Gruppe mindestens ${CASES_MIN} Conversions hat: Der Gewinn ist klar und belegt.`),
        tt(`Keep testing when the uplift is ${LIFT_ACT}% or more but on fewer than ${CASES_MIN} conversions, or when it is between ${LIFT_WATCH}% and ${LIFT_ACT}%.`, `Weiter testen, wenn der Uplift ${LIFT_ACT} % oder mehr beträgt, aber auf weniger als ${CASES_MIN} Conversions beruht, oder wenn er zwischen ${LIFT_WATCH} % und ${LIFT_ACT} % liegt.`),
        tt(`Stop when the uplift is below ${LIFT_WATCH}% or negative. Many conversions do not rescue a tiny uplift: they prove it is tiny.`, `Stoppen, wenn der Uplift unter ${LIFT_WATCH} % liegt oder negativ ist. Viele Conversions retten keinen winzigen Uplift: Sie belegen, dass er winzig ist.`),
        tt("A guardrail can stop a winner: if “not helpful” ratings or complaints rise, the uplift is not rolled out until the cause is fixed.", "Eine Guardrail kann einen Gewinner stoppen: Steigen „nicht hilfreich“-Bewertungen oder Beschwerden, wird der Uplift nicht ausgerollt, bis die Ursache behoben ist."),
        tt("Who acts follows from what the test is about: a rollout on the website goes to marketing, one done by salespeople (callbacks) to sales; keep testing belongs to the data team; a stopped test has no owner.", "Wer handelt, folgt daraus, worum es im Test geht: Ein Rollout auf der Website geht an das Marketing, einer durch Vertriebsleute (Rückrufe) an den Vertrieb; Weitertesten gehört dem Datenteam; ein gestoppter Test hat keinen Owner."),
      ]}
      sources={["kohavi2020", "markey2009"]}
    >
      <ShowMore id="B4" part="research" label={tt("Show the research behind this card", "Die Forschung hinter dieser Karte zeigen")}>
        <p className={p}>
          {tt(
            "Kohavi, Tang and Xu (2020) describe how firms that test continuously decide on each result with rules agreed before the test: a minimum effect worth shipping, a minimum sample, and guardrail metrics that veto a rollout. The weekly loop of Markey and colleagues (2009) is where those decisions are taken.",
            "Kohavi, Tang und Xu (2020) beschreiben, wie Firmen, die laufend testen, über jedes Ergebnis mit Regeln entscheiden, die vor dem Test vereinbart sind: ein Mindesteffekt, der einen Rollout lohnt, eine Mindeststichprobe und Guardrail-Kennzahlen, die einen Rollout verhindern können. Die wöchentliche Schleife von Markey und Kollegen (2009) ist der Ort, an dem diese Entscheidungen fallen.",
          )}
        </p>
      </ShowMore>
      <Diagram label={tt("Roll out, keep testing or stop · move the two sliders", "Ausrollen, weiter testen oder stoppen · die zwei Regler bewegen")} caption={tt("Set an uplift and a number of conversions and read which decision the rule gives.", "Stellen Sie einen Uplift und eine Zahl von Conversions ein und lesen Sie, welche Entscheidung die Regel ergibt.")}>
        <LiftCases />
      </Diagram>
      <ShowMore id="B4" part="table" label={tt("Show the table: a worked decision on other tests (Case assumption)", "Tabelle zeigen: Eine Beispielentscheidung mit anderen Tests (Fallannahme)")}>
        <DataTable
          head={[tt("Elster test", "Test bei Elster"), tt("Uplift", "Uplift"), tt("Conversions", "Conversions"), tt("Rule gives", "Regel ergibt"), tt("Who acts", "Wer handelt")]}
          rows={[
            [tt("Chat on the order page", "Chat auf der Bestellseite"), "+38%", "160", tt("Roll out", "Ausrollen"), tt("Marketing", "Marketing")],
            [tt("Personal greeting for logged-in customers", "Persönliche Begrüßung für angemeldete Kunden"), "+30%", "25", tt("Keep testing", "Weiter testen"), tt("Data team", "Datenteam")],
            [tt("Countdown timer on offers", "Countdown-Timer bei Angeboten"), "+1%", "600", tt("Stop", "Stoppen"), tt("No one", "Niemand")],
          ]}
          caption={tt("A worked decision on other tests (Case assumption)", "Eine Beispielentscheidung mit anderen Tests (Fallannahme)")}
        />
      </ShowMore>
    </MaterialCard>
  );
}

export function CardB5() {
  return (
    <MaterialCard
      id="B5"
      scan={tt("An architecture is built in order: the base first, then the people and standards, then the data, then the engines on ready data, and the rest held back. Four tests tell you whether it holds, and with four months the time test matters. Decide now, in stages, and say what you will watch and when you would stop.", "Eine Architektur wird der Reihe nach gebaut: zuerst die Basis, dann die Menschen und Standards, dann die Daten, dann die Engines auf bereiten Daten, und der Rest wird zurückgehalten. Vier Tests sagen Ihnen, ob sie hält, und bei vier Monaten zählt der Zeittest. Entscheiden Sie jetzt, in Stufen, und sagen Sie, was Sie beobachten und wann Sie aufhören würden.")}
      reasoning={[
        tt("Build in this order. The base first: the live view and KPI system, with the interactions it joins. Then the standards and the people: who answers each central point within how long, and a sales team that can take over a chat. Then the tracking an engine needs, cleaned. Then the engines that move a named KPI, on data that is ready. Hold back the rest.", "Bauen Sie in dieser Reihenfolge. Zuerst die Basis: Live-Sicht und KPI-System mit den Interaktionen, die sie verbinden. Dann die Standards und die Menschen: wer jeden zentralen Punkt innerhalb welcher Zeit beantwortet, und ein Vertriebsteam, das einen Chat übernehmen kann. Dann die Erfassung, die eine Engine braucht, bereinigt. Dann die Engines, die einen benannten KPI bewegen, auf bereiten Daten. Den Rest halten Sie zurück."),
        tt("Four tests check an architecture. Measurement first: the live view and KPI system start no later than the first engine. Every funded item has a purpose: it moves a named KPI or makes one measurable; a black box and a redesign that names no KPI do neither. Data ready: an engine starts on data that is at least 80% tracked and clean. It fits: inside the budget and in use by month 4.", "Vier Tests prüfen eine Architektur. Messung zuerst: Live-Sicht und KPI-System starten nicht später als die erste Engine. Jeder finanzierte Punkt hat einen Zweck: Er bewegt einen benannten KPI oder macht einen messbar; eine Black Box und ein Relaunch, der keinen KPI nennt, tun keines von beidem. Daten bereit: Eine Engine startet auf Daten, die zu mindestens 80 % erfasst und sauber sind. Es passt: innerhalb des Budgets und bis Monat 4 im Einsatz."),
        tt("Time: an item is in use in the month = start + weeks ÷ 4, rounded up. A Now item starts in month 1; an After data is ready item starts in the month the tracking clean-up is in use, so the clean-up has to be Now itself. With only four months, an item of 14 or 16 weeks is in use only in month 5.", "Zeit: Ein Punkt ist im Monat = Start + Wochen ÷ 4, aufgerundet, im Einsatz. Ein Jetzt-Punkt startet in Monat 1; ein Punkt „Wenn die Daten bereit sind“ startet in dem Monat, in dem die Bereinigung der Erfassung im Einsatz ist, die Bereinigung muss also selbst auf Jetzt stehen. Bei nur vier Monaten ist ein Punkt mit 14 oder 16 Wochen erst in Monat 5 im Einsatz."),
        tt("Three bars show where the money sits: Budget (the money against the limit), Measurable (the share on items that are measured, whose data is ready and that are in use within the four months) and Risk (the share on a black box, on data below 80% or on an item in use only after the four months). Measurable and Risk are ranges, because the data may be weaker than the brief says: a plan that holds at both ends is the safer one.", "Drei Balken zeigen, wo das Geld liegt: Budget (das Geld gegen die Grenze), Messbar (der Anteil auf Punkten, die gemessen werden, deren Daten bereit sind und die innerhalb der vier Monate im Einsatz sind) und Risiko (der Anteil auf einer Black Box, auf Daten unter 80 % oder auf einem Punkt, der erst nach den vier Monaten im Einsatz ist). Messbar und Risiko sind Spannen, weil die Daten schwächer sein können, als der Auftrag sagt: Ein Plan, der an beiden Enden hält, ist der sicherere."),
        tt("Waiting until the data is complete is also a decision: every answer stays slow in the meantime, and the decision pages are usually tracked well enough already. The brief asks for a decision under time pressure.", "Zu warten, bis die Daten vollständig sind, ist auch eine Entscheidung: Jede Antwort bleibt in der Zwischenzeit langsam, und die Entscheidungsseiten werden meist schon gut genug erfasst. Der Auftrag verlangt eine Entscheidung unter Zeitdruck."),
        tt("Launching everything at once is fast on paper, but the slow items (a relaunch, a platform) do not work inside a few months, and nothing is measured before the money is spent. Staging acts within weeks where it pays and spends the rest as the evidence arrives.", "Alles auf einmal zu starten ist auf dem Papier schnell, aber die langsamen Punkte (ein Relaunch, eine Plattform) wirken nicht in wenigen Monaten, und nichts wird gemessen, bevor das Geld ausgegeben ist. Stufenweise handelt innerhalb von Wochen dort, wo es sich lohnt, und gibt den Rest aus, wie die Evidenz kommt."),
        tt("Fund inside the budget, and fund nothing nobody at the company can explain or measure: a black box cannot be steered.", "Finanzieren Sie innerhalb des Budgets, und nichts, was im Unternehmen niemand erklären oder messen kann: Eine Black Box lässt sich nicht steuern."),
        tt("What you will watch is one figure about customers (the closing rate of quote requests, the interaction rate on decision pages), not your own speed or output (response time, posts), the month it can first be read, and what you do if it falls short: stop, pause or change one thing.", "Was Sie beobachten, ist eine Zahl über Kunden (die Abschlussquote der Angebotsanfragen, die Interaktionsrate auf Entscheidungsseiten), nicht Ihr eigenes Tempo oder Ihr Output (Antwortzeit, Posts), der Monat, in dem sie sich zuerst lesen lässt, und was Sie tun, wenn sie zu kurz greift: stoppen, pausieren oder eine Sache ändern."),
        tt("Every plan gives something and costs something. Say what it gives (measured, ready, inside the budget and the months) and what it leaves open (an item not now, data below 80% if the data is weaker, budget left unspent). A plan that differs from this order can still be argued: say why.", "Jeder Plan gibt etwas und kostet etwas. Sagen Sie, was er gibt (gemessen, bereit, innerhalb von Budget und Monaten) und was er offen lässt (ein Punkt, der jetzt nicht kommt, Daten unter 80 %, wenn die Daten schwächer sind, ungenutztes Budget). Ein Plan, der von dieser Reihenfolge abweicht, lässt sich trotzdem vertreten: Sagen Sie, warum."),
      ]}
      sources={["courtney1997", "klein2007"]}
    >
      <Diagram label={tt("A chat and its base · a worked example on Elster Digital", "Ein Chat und seine Basis · ein Beispiel mit Elster Digital")} caption={tt("Change when measurement starts and how well the data is tracked, and watch the links.", "Ändern Sie, wann die Messung startet und wie gut die Daten erfasst sind, und beobachten Sie die Verbindungen.")}>
        <ArchExample />
      </Diagram>
      <ShowMore id="B5" part="calc" label={tt("Show the worked numbers on another company (Case assumption)", "Die Rechenwege an einem anderen Unternehmen zeigen (Fallannahme)")}>
        <DataTable
          head={[tt("Rule", "Regel"), tt("Elster's figures", "Zahlen von Elster"), tt("Result", "Ergebnis")]}
          rows={[
            [tt("Month in use: starts in month 1, needs 6 weeks", "Monat im Einsatz: startet in Monat 1, braucht 6 Wochen"), "1 + 6 ÷ 4 = 1 + 2", tt("month 3", "Monat 3")],
            [tt("After data is ready: the tracking clean-up is in use in month 2, the item needs 8 weeks", "Wenn die Daten bereit sind: Die Bereinigung der Erfassung ist in Monat 2 im Einsatz, der Punkt braucht 8 Wochen"), "2 + 8 ÷ 4 = 2 + 2", tt("starts month 2, in use month 4", "Start Monat 2, im Einsatz Monat 4")],
            [tt("Time: a platform of 14 weeks that starts in month 1, in a plan of 4 months", "Zeit: eine Plattform mit 14 Wochen, die in Monat 1 startet, in einem Plan von 4 Monaten"), "1 + 14 ÷ 4 = 1 + 4", tt("month 5: too late", "Monat 5: zu spät")],
            [tt("Data ready: the chat's data is 93% tracked, the bar is 80%", "Daten bereit: Die Daten des Chats sind zu 93 % erfasst, die Grenze ist 80 %"), "93 ≥ 80", tt("ready", "bereit")],
            [tt("The same chat when the data is 15 points weaker", "Derselbe Chat, wenn die Daten 15 Punkte schwächer sind"), "93 − 15 = 78 < 80", tt("not ready", "nicht bereit")],
            [tt("Money: three funded items against Elster's €120,000", "Geld: drei finanzierte Punkte gegen Elsters 120.000 €"), "40,000 + 35,000 + 15,000", tt("€90,000, €30,000 left", "90.000 €, 30.000 € übrig")],
          ]}
          caption={tt("Elster's numbers (Case assumption). The panel in the task does this for you and says what it means.", "Zahlen von Elster (Fallannahme). Das Panel in der Aufgabe macht das für Sie und sagt, was es bedeutet.")}
        />
      </ShowMore>
      <ShowMore id="B5" part="notes" label={tt("Show two short notes", "Zwei kurze Hinweise zeigen")}>
        <Bul
          items={[
            tt("Stage it: the no-regret items first (the live view, the chat on the well-tracked decision pages), the engines that need cleaner data when the tracking is clean.", "Stufenweise: die No-regret-Punkte zuerst (die Live-Sicht, der Chat auf den gut erfassten Entscheidungsseiten), die Engines, die sauberere Daten brauchen, wenn die Erfassung sauber ist."),
            tt("Premortem: imagine the plan failed after four months, and write down why. Those reasons are what you watch.", "Premortem: Stellen Sie sich vor, der Plan sei nach vier Monaten gescheitert, und schreiben Sie auf, warum. Diese Gründe beobachten Sie."),
          ]}
        />
      </ShowMore>
      <ShowMore id="B5" part="extra" label={tt("Show: Time pressure is not a reason to guess", "Zeigen: Zeitdruck ist kein Grund zu raten")}>
        <Callout label={tt("Time pressure is not a reason to guess", "Zeitdruck ist kein Grund zu raten")} tone="signal">
          <p>{tt("Under time pressure, act where the evidence is good enough and the delay costs most, and measure from the first day. A staged decision with a sentence on what you watch is fast and still honest about what you do not know yet.", "Unter Zeitdruck handeln Sie dort, wo die Evidenz gut genug ist und die Verzögerung am meisten kostet, und messen ab dem ersten Tag. Eine gestufte Entscheidung mit einem Satz dazu, was Sie beobachten, ist schnell und trotzdem ehrlich darüber, was Sie noch nicht wissen.")}</p>
        </Callout>
      </ShowMore>
    </MaterialCard>
  );
}

export const CARDS_B = [CardB1, CardB2, CardB3, CardB4, CardB5];
