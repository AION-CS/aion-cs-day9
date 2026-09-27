"use client";

import Link from "next/link";
import { COURSE, ROUTES } from "@/lib/routes";
import { RouteCards } from "@/components/chrome/RouteCards";
import { DAY_INTRO } from "@/data/dayIntro";
import { Gloss } from "@/lib/glossify";
import { tt } from "@/lib/lang";

export default function Home() {
  const total = ROUTES.reduce((s, r) => s + r.plan.reduce((t, p) => t + p.minutes, 0), 0);
  return (
    <div className="space-y-8 pt-6">
      <header className="space-y-2">
        <p className="smallcaps text-accent">{COURSE.module}</p>
        <h1 className="text-display">{COURSE.site}</h1>
        <p className="max-w-prose text-body text-ash">
          {tt(`${COURSE.title}. Two routes: on one case, see where LiveConnect should answer at once, what speed is worth and how to measure it, then decide as Chief Digital Officer how the whole company handles interaction in real time. Study on your own, work a document from the case, and export it.`, `${COURSE.title}. Zwei Routen: an einem Fall sehen, wo LiveConnect sofort antworten sollte, was Tempo wert ist und wie man es misst, dann als Chief Digital Officer entscheiden, wie das ganze Unternehmen Interaktion in Echtzeit steuert. Selbst lernen, aus dem Fall ein Dokument erarbeiten und exportieren.`)}
        </p>
      </header>

      <section aria-labelledby="today-h" className="card space-y-4 p-5">
        <div className="space-y-2">
          <h2 id="today-h" className="text-h2">
            {tt("What today is about", "Worum es heute geht")}
          </h2>
          <p className="max-w-prose text-body text-ink">
            <Gloss>{DAY_INTRO.about}</Gloss>
          </p>
          <p className="max-w-prose text-body text-ink">
            <Gloss>{DAY_INTRO.caseLine}</Gloss>
          </p>
        </div>
        <div className="space-y-2">
          <p className="smallcaps">{tt("One story, two routes", "Eine Geschichte, zwei Routen")}</p>
          <ol className="grid gap-3 md:grid-cols-2">
            {DAY_INTRO.story.map((st) => (
              <li key={st.route}>
                <Link href={`/route-${st.route}/`} className="block h-full space-y-1.5 rounded-lg border border-line bg-canvas p-3 transition-colors hover:border-accent">
                  <p className="smallcaps text-accent">
                    Route {st.route} · {st.verb}
                  </p>
                  <p className="text-body text-ink">
                    <Gloss>{st.question}</Gloss>
                  </p>
                  <p className="text-caption text-ash">
                    {tt("You finish with:", "Sie schließen ab mit:")} <strong className="text-ink">{st.output}</strong>
                  </p>
                </Link>
              </li>
            ))}
          </ol>
          <p className="text-caption text-ash">
            {tt(
              `${total} minutes in total across both routes: about two hours of material and one and three-quarter hours of task, facilitator-led. You finish with two documents.`,
              `Insgesamt ${total} Minuten über beide Routen: etwa zwei Stunden Material und eindreiviertel Stunden Aufgabe, moderiert. Sie schließen mit zwei Dokumenten ab.`,
            )}
          </p>
        </div>
      </section>

      <section aria-labelledby="wiifm-h" className="card space-y-3 border-accent/40 bg-accentSoft p-5">
        <div className="space-y-1">
          <h2 id="wiifm-h" className="text-h2">
            {tt("What's in it for you", "Was Sie davon haben")}
          </h2>
          <p className="max-w-prose text-body text-ink">
            {tt(
              "Why this is worth your day, whatever your role: each skill below is one you can use at work next week, not only in this case.",
              "Warum sich der Tag lohnt, egal in welcher Rolle: Jede Fähigkeit unten können Sie nächste Woche im Job nutzen, nicht nur in diesem Fall.",
            )}
          </p>
        </div>
        <ul className="grid gap-3 md:grid-cols-2">
          {DAY_INTRO.wiifm.map((w) => (
            <li key={w.skill} className="space-y-1 rounded-lg border border-line bg-paper p-3">
              <p className="flex flex-wrap items-baseline justify-between gap-x-2">
                <span className="font-semibold text-ink">{w.skill}</span>
                <span className="text-micro font-semibold uppercase text-ash">Route {w.route}</span>
              </p>
              <p className="text-caption text-ink">
                <Gloss>{w.payoff}</Gloss>
              </p>
            </li>
          ))}
        </ul>
      </section>

      <RouteCards />

      <section aria-labelledby="how-h" className="card space-y-2 p-5">
        <h2 id="how-h" className="text-h3">
          {tt("How this site works", "So funktioniert diese Seite")}
        </h2>
        <ol className="list-decimal space-y-1 pl-5 text-body">
          <li>{tt("Study, then task, then export: each route ends as one working document, not a quiz score. Route 1 merges Levels 1 and 2 on one case; Route 2 is Level 3.", "Lernen, dann Aufgabe, dann Export: Jede Route endet mit einem Arbeitsdokument, nicht mit einem Quiz-Ergebnis. Route 1 verbindet Level 1 und 2 an einem Fall; Route 2 ist Level 3.")}</li>
          <li>{tt("Nothing is locked. Every section and route stays open, and a suggested order is only a suggestion.", "Nichts ist gesperrt. Jeder Abschnitt und jede Route bleibt offen, und eine empfohlene Reihenfolge ist nur eine Empfehlung.")}</li>
          <li>{tt("The app shows consequences, not verdicts. It marks something only when you press a Check button, and then it gives a question, not the answer.", "Die App zeigt Folgen, keine Urteile. Sie markiert etwas nur, wenn Sie eine Prüfen-Schaltfläche drücken, und dann gibt sie eine Frage, nicht die Antwort.")}</li>
          <li>{tt("EN | DE in the top bar switches the whole site to German. Common technical terms stay in English; every explanation is in German.", "EN | DE oben in der Leiste schaltet die ganze Seite auf Deutsch. Gängige Fachbegriffe bleiben Englisch; jede Erklärung ist auf Deutsch.")}</li>
        </ol>
      </section>
    </div>
  );
}
