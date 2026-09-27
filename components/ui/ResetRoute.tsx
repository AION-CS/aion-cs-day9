"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import type { RouteNo } from "@/lib/routes";
import { tt } from "@/lib/lang";


/** Clears one route's state only — the participant strip and the other route stay. Inline two-step confirm. */
export function ResetRoute({ route }: { route: RouteNo }) {
  const reset = useStore((s) => s.resetRoute);
  const [ask, setAsk] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-3 border-t border-line pt-4 print:hidden">
      {!ask ? (
        <button type="button" onClick={() => setAsk(true)} className="btn-ghost btn-sm">
          {tt(`Reset Route ${route}`, `Route ${route} zurücksetzen`)}
        </button>
      ) : (
        <>
          <p className="text-caption text-ink">
            {tt(`Clear every Route ${route} answer, mark and check count? Your name and the other route stay.`, `Alle Antworten, Markierungen und Prüfzähler von Route ${route} löschen? Ihr Name und die andere Route bleiben.`)}
          </p>
          <button
            type="button"
            onClick={() => {
              reset(route);
              setAsk(false);
              window.scrollTo({ top: 0 });
            }}
            className="btn-primary btn-sm"
          >
            {tt(`Yes, reset Route ${route}`, `Ja, Route ${route} zurücksetzen`)}
          </button>
          <button type="button" onClick={() => setAsk(false)} className="btn-ghost btn-sm">
            {tt("Cancel", "Abbrechen")}
          </button>
        </>
      )}
    </div>
  );
}
