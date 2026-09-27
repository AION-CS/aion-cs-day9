import { bi, t } from "@/lib/lang";

/**
 * Day 9 reference list. Cards cite by key; each `References` accordion shows the union of what its own cards cite. Every entry is a
 * published work or an official legal text cited by its usual reference; the bracketed note says what the card takes from it.
 */
export type RefKey =
  | "davenport2020"
  | "oldroyd2011"
  | "aguirre2015"
  | "kaplan2010"
  | "markey2009"
  | "davenport2018"
  | "linden2003"
  | "peppers1993"
  | "adam2021"
  | "huang2021"
  | "denboer2015"
  | "provost2013"
  | "kaplan1992"
  | "ries2011"
  | "kohavi2020"
  | "hubbard2014"
  | "gdpr2016"
  | "courtney1997"
  | "klein2007"
  | "tetlock2015";

export type Reference = { key: RefKey; chip: string; full: string };

const r = (key: RefKey, chip: string, en: string, de: string) => ({ key, chip, full: t(en, de) });

export const REFERENCES: Record<RefKey, Reference> = bi({
  oldroyd2011: r("oldroyd2011", "Oldroyd et al. 2011", "Oldroyd, J. B., McElheran, K., & Elkington, D. (2011). The short life of online sales leads. Harvard Business Review, 89(3), 28. (Leads contacted within an hour are far more likely to be qualified than leads contacted later.)", "Oldroyd, J. B., McElheran, K., & Elkington, D. (2011). The short life of online sales leads. Harvard Business Review, 89(3), 28. (Leads, die innerhalb einer Stunde kontaktiert werden, lassen sich weit häufiger qualifizieren als später kontaktierte.)"),
  aguirre2015: r("aguirre2015", "Aguirre et al. 2015", "Aguirre, E., Mahr, D., Grewal, D., de Ruyter, K., & Wetzels, M. (2015). Unraveling the personalization paradox: The effect of information collection and trust-building strategies on online advertisement effectiveness. Journal of Retailing, 91(1), 34–49. (Personalisation helps when customers see how their data is used; covert collection makes it feel intrusive.)", "Aguirre, E., Mahr, D., Grewal, D., de Ruyter, K., & Wetzels, M. (2015). Unraveling the personalization paradox: The effect of information collection and trust-building strategies on online advertisement effectiveness. Journal of Retailing, 91(1), 34–49. (Personalisierung hilft, wenn Kunden sehen, wie ihre Daten genutzt werden; verdeckte Erhebung wirkt aufdringlich.)"),
  kaplan2010: r("kaplan2010", "Kaplan & Haenlein 2010", "Kaplan, A. M., & Haenlein, M. (2010). Users of the world, unite! The challenges and opportunities of social media. Business Horizons, 53(1), 59–68. (Social media as a two-way channel in which firms must listen and respond.)", "Kaplan, A. M., & Haenlein, M. (2010). Users of the world, unite! The challenges and opportunities of social media. Business Horizons, 53(1), 59–68. (Social Media als Kanal in zwei Richtungen, in dem Unternehmen zuhören und antworten müssen.)"),
  markey2009: r("markey2009", "Markey et al. 2009", "Markey, R., Reichheld, F., & Dullweber, A. (2009). Closing the customer feedback loop. Harvard Business Review, 87(12), 43–47. (Act on customer feedback quickly and report back; the loop is what improves the service.)", "Markey, R., Reichheld, F., & Dullweber, A. (2009). Closing the customer feedback loop. Harvard Business Review, 87(12), 43–47. (Schnell auf Kundenfeedback handeln und zurückmelden; die Schleife ist das, was den Service verbessert.)"),
  davenport2020: r("davenport2020", "Davenport et al. 2020", "Davenport, T., Guha, A., Grewal, D., & Bressgott, T. (2020). How artificial intelligence will change the future of marketing. Journal of the Academy of Marketing Science, 48, 24–42. (Where AI adds value in marketing and sales, and where it does not.)", "Davenport, T., Guha, A., Grewal, D., & Bressgott, T. (2020). How artificial intelligence will change the future of marketing. Journal of the Academy of Marketing Science, 48, 24–42. (Wo KI in Marketing und Vertrieb Mehrwert bringt, und wo nicht.)"),
  davenport2018: r("davenport2018", "Davenport & Ronanki 2018", "Davenport, T. H., & Ronanki, R. (2018). Artificial intelligence for the real world. Harvard Business Review, 96(1), 108–116. (Start from a business problem with small, measurable projects, not from the most ambitious technology.)", "Davenport, T. H., & Ronanki, R. (2018). Artificial intelligence for the real world. Harvard Business Review, 96(1), 108–116. (Bei einem Geschäftsproblem mit kleinen, messbaren Projekten anfangen, nicht bei der ehrgeizigsten Technologie.)"),
  linden2003: r("linden2003", "Linden et al. 2003", "Linden, G., Smith, B., & York, J. (2003). Amazon.com recommendations: Item-to-item collaborative filtering. IEEE Internet Computing, 7(1), 76–80. (How “customers who bought this also bought” is computed from items bought together.)", "Linden, G., Smith, B., & York, J. (2003). Amazon.com recommendations: Item-to-item collaborative filtering. IEEE Internet Computing, 7(1), 76–80. (Wie „Kunden, die das kauften, kauften auch“ aus zusammen gekauften Artikeln berechnet wird.)"),
  peppers1993: r("peppers1993", "Peppers & Rogers 1993", "Peppers, D., & Rogers, M. (1993). The One to One Future: Building Relationships One Customer at a Time. Currency Doubleday. (Treating different customers differently, from what each one does.)", "Peppers, D., & Rogers, M. (1993). The One to One Future: Building Relationships One Customer at a Time. Currency Doubleday. (Verschiedene Kunden verschieden behandeln, aus dem, was jeder tut.)"),
  adam2021: r("adam2021", "Adam et al. 2021", "Adam, M., Wessel, M., & Benlian, A. (2021). AI-based chatbots in customer service and their effects on user compliance. Electronic Markets, 31, 427–445. (What chatbots do well in first contact, and how their design affects customers.)", "Adam, M., Wessel, M., & Benlian, A. (2021). AI-based chatbots in customer service and their effects on user compliance. Electronic Markets, 31, 427–445. (Was Chatbots im Erstkontakt gut können, und wie ihre Gestaltung auf Kunden wirkt.)"),
  huang2021: r("huang2021", "Huang & Rust 2021", "Huang, M.-H., & Rust, R. T. (2021). Engaged to a robot? The role of AI in service. Journal of Service Research, 24(1), 30–41. (Machines take routine tasks; feeling and judgement stay with people.)", "Huang, M.-H., & Rust, R. T. (2021). Engaged to a robot? The role of AI in service. Journal of Service Research, 24(1), 30–41. (Maschinen übernehmen Routineaufgaben; Gefühl und Urteil bleiben bei Menschen.)"),
  denboer2015: r("denboer2015", "den Boer 2015", "den Boer, A. V. (2015). Dynamic pricing and learning: Historical origins, current research, and new directions. Surveys in Operations Research and Management Science, 20(1), 1–18. (How prices are set by rules that learn from demand.)", "den Boer, A. V. (2015). Dynamic pricing and learning: Historical origins, current research, and new directions. Surveys in Operations Research and Management Science, 20(1), 1–18. (Wie Preise durch Regeln gesetzt werden, die aus der Nachfrage lernen.)"),
  provost2013: r("provost2013", "Provost & Fawcett 2013", "Provost, F., & Fawcett, T. (2013). Data Science for Business. O'Reilly. (Rates, lift and expected value as the basic tools for reading a result.)", "Provost, F., & Fawcett, T. (2013). Data Science for Business. O'Reilly. (Raten, Lift und Erwartungswert als Grundwerkzeuge, um ein Ergebnis zu lesen.)"),
  kaplan1992: r("kaplan1992", "Kaplan & Norton 1992", "Kaplan, R. S., & Norton, D. P. (1992). The balanced scorecard: Measures that drive performance. Harvard Business Review, 70(1), 71–79. (A few linked measures, results and the drivers behind them, instead of many unrelated ones.)", "Kaplan, R. S., & Norton, D. P. (1992). The balanced scorecard: Measures that drive performance. Harvard Business Review, 70(1), 71–79. (Wenige verbundene Kennzahlen, Ergebnisse und ihre Treiber, statt vieler unverbundener.)"),
  ries2011: r("ries2011", "Ries 2011", "Ries, E. (2011). The Lean Startup. Crown Business. (Vanity metrics against actionable metrics; learning through controlled experiments.)", "Ries, E. (2011). The Lean Startup. Crown Business. (Vanity Metrics gegenüber handlungsleitenden Kennzahlen; Lernen durch kontrollierte Experimente.)"),
  kohavi2020: r("kohavi2020", "Kohavi et al. 2020", "Kohavi, R., Tang, D., & Xu, Y. (2020). Trustworthy Online Controlled Experiments. Cambridge University Press. (Random split, one change, a size fixed in advance, guardrail metrics, and the danger of stopping early.)", "Kohavi, R., Tang, D., & Xu, Y. (2020). Trustworthy Online Controlled Experiments. Cambridge University Press. (Zufällige Aufteilung, eine Änderung, eine vorab festgelegte Größe, Guardrail-Kennzahlen und die Gefahr, zu früh zu stoppen.)"),
  hubbard2014: r("hubbard2014", "Hubbard 2014", "Hubbard, D. W. (2014). How to Measure Anything, 3rd ed. Wiley. (Start from the decision; measure what would change it.)", "Hubbard, D. W. (2014). How to Measure Anything, 3. Aufl. Wiley. (Von der Entscheidung ausgehen; messen, was sie ändern würde.)"),
  gdpr2016: r("gdpr2016", "GDPR 2016", "Regulation (EU) 2016/679 of the European Parliament and of the Council (General Data Protection Regulation), Art. 6 (lawful basis), Art. 21 (objection to direct marketing) and Art. 22 (automated individual decisions).", "Verordnung (EU) 2016/679 des Europäischen Parlaments und des Rates (Datenschutz-Grundverordnung, DSGVO), Art. 6 (Rechtsgrundlage), Art. 21 (Widerspruch gegen Direktwerbung) und Art. 22 (automatisierte Einzelentscheidungen)."),
  courtney1997: r("courtney1997", "Courtney et al. 1997", "Courtney, H., Kirkland, J., & Viguerie, P. (1997). Strategy under uncertainty. Harvard Business Review, 75(6), 67–79. (Match the commitment to how much is known; no-regret moves first.)", "Courtney, H., Kirkland, J., & Viguerie, P. (1997). Strategy under uncertainty. Harvard Business Review, 75(6), 67–79. (Die Festlegung daran ausrichten, wie viel man weiß; No-regret-Schritte zuerst.)"),
  klein2007: r("klein2007", "Klein 2007", "Klein, G. (2007). Performing a project premortem. Harvard Business Review, 85(9), 18–19. (Imagine the plan has failed and write down why, before it starts.)", "Klein, G. (2007). Performing a project premortem. Harvard Business Review, 85(9), 18–19. (Sich vorstellen, der Plan sei gescheitert, und aufschreiben warum, bevor er startet.)"),
  tetlock2015: r("tetlock2015", "Tetlock & Gardner 2015", "Tetlock, P. E., & Gardner, D. (2015). Superforecasting: The Art and Science of Prediction. Crown. (Forecasts improve only when they are checked against outcomes.)", "Tetlock, P. E., & Gardner, D. (2015). Superforecasting: The Art and Science of Prediction. Crown. (Prognosen werden nur besser, wenn sie mit Ergebnissen abgeglichen werden.)"),
});

export const refFull = (key: RefKey) => REFERENCES[key].full;
export const REFERENCE_ORDER: RefKey[] = Object.keys(REFERENCES) as RefKey[];
