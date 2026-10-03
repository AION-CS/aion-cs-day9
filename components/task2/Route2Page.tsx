"use client";

import { SectionRail } from "@/components/chrome/SectionRail";
import { PageNav } from "@/components/chrome/PageNav";
import { HashFlash } from "@/components/chrome/HashFlash";
import { SuggestedOrderBanner } from "@/components/ui/Banner";
import { MateriB } from "@/components/materi/Materi";
import { Task2 } from "@/components/task2/Task2";
import { ResetRoute } from "@/components/ui/ResetRoute";
import { Gloss } from "@/lib/glossify";
import { tt } from "@/lib/lang";

export function Route2Page() {
  return (
    <div className="space-y-8 pt-4">
      <HashFlash />
      <header className="space-y-3">
        <div className="space-y-1">
          <p className="smallcaps text-accent">{tt("Route 2 · Level 3 · Management decision", "Route 2 · Level 3 · Managemententscheidung")}</p>
          <h1>{tt("Build a real-time management system that connects speed and quality", "Bauen Sie ein Echtzeit-Managementsystem, das Tempo und Qualität verbindet")}</h1>
        </div>
        <blockquote className="max-w-prose space-y-2 border-l-4 border-gold bg-accentSoft px-4 py-3 text-body text-ink">
          <p>
            <Gloss>
              {tt("Route 1 looked at LiveConnect's single moments: where to answer at once, where to personalise, what speed is worth and how to test fairly. Level 3 asks a different question: how does the whole company handle interaction in real time, which points are central, which measures come first, and what do you decide today under time pressure and with incomplete data?", "Route 1 hat einzelne Momente bei LiveConnect betrachtet: wo sofort antworten, wo personalisieren, was Tempo wert ist und wie man fair testet. Level 3 stellt eine andere Frage: Wie steuert das ganze Unternehmen Interaktion in Echtzeit, welche Punkte sind zentral, welche Maßnahmen kommen zuerst, und was entscheiden Sie heute unter Zeitdruck und mit unvollständigen Daten?")}
            </Gloss>
          </p>
        </blockquote>
      </header>
      <SuggestedOrderBanner
        routeKey="r2"
        text={tt(
          "Route 1 first is recommended, because the situation quotes the measures you chose there. Every section stays open, so you can work through this route regardless.",
          "Route 1 zuerst wird empfohlen, weil die Lage die Maßnahmen zitiert, die Sie dort gewählt haben. Jeder Abschnitt bleibt offen, Sie können diese Route trotzdem bearbeiten.",
        )}
      />
      <SectionRail route={2} />
      <PageNav route={2} />
      <MateriB />
      <Task2 />
      <ResetRoute route={2} />
    </div>
  );
}
