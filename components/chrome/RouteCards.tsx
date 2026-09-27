"use client";

import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import { tt } from "@/lib/lang";

/** The two route cards on the home page. Both are always open: a suggested order is only a suggestion. */
export function RouteCards() {
  return (
    <section aria-labelledby="routes-h" className="space-y-3">
      <h2 id="routes-h" className="sr-only">
        {tt("Routes", "Routen")}
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        {ROUTES.map((r) => (
          <Link key={r.n} href={r.href} className="card group block space-y-3 p-5 transition-shadow hover:shadow-md">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <span className="smallcaps text-accent">Route {r.n}</span>
              <span className="text-micro font-semibold uppercase text-ash">{r.level}</span>
            </div>
            <h3 className="text-h2">{r.title}</h3>
            <p className="text-caption text-ash">{r.blurb}</p>
            <table className="w-full text-caption">
              <caption className="sr-only">{tt(`Time plan for Route ${r.n}`, `Zeitplan für Route ${r.n}`)}</caption>
              <tbody>
                {r.plan.map((p) => (
                  <tr key={p.label} className="border-t border-line">
                    <td className="py-1.5">{p.label}</td>
                    <td className="tnum py-1.5 text-right text-ash">
                      {p.minutes} {tt("min", "Min.")}
                    </td>
                  </tr>
                ))}
                <tr className="border-t-2 border-ink font-semibold">
                  <td className="py-1.5">{tt("Total", "Gesamt")}</td>
                  <td className="tnum py-1.5 text-right">
                    {r.plan.reduce((s, p) => s + p.minutes, 0)} {tt("min", "Min.")}
                  </td>
                </tr>
              </tbody>
            </table>
            <span className="inline-block text-caption font-semibold text-accent group-hover:underline">{tt(`Open Route ${r.n} →`, `Route ${r.n} öffnen →`)}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
