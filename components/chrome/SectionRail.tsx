"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { SECTIONS } from "@/data/materialIndex";
import type { RouteNo } from "@/lib/routes";
import { dossierProgress } from "@/lib/progress";
import { useHydrated } from "@/store/useStore";
import { usePersisted } from "@/store/usePersisted";
import { tt } from "@/lib/lang";


function Ring({ done, total }: { done: number; total: number }) {
  const pct = total ? (done / total) * 100 : 0;
  return (
    <svg viewBox="0 0 40 40" className="h-9 w-9 shrink-0" role="img" aria-label={tt(`Dossier progress: ${done} of ${total}`, `Dossier-Fortschritt: ${done} von ${total}`)}>
      <title>{tt("Dossier progress", "Dossier-Fortschritt")}</title>
      <desc>{tt(`${done} of ${total} cards read or task blocks completed`, `${done} von ${total} Karten gelesen oder Aufgabenblöcke ausgefüllt`)}</desc>
      <circle cx="20" cy="20" r="16" fill="none" stroke="#D8D1BF" strokeWidth="4" />
      <circle
        cx="20"
        cy="20"
        r="16"
        fill="none"
        stroke="#0F6B6B"
        strokeWidth="4"
        strokeLinecap="round"
        pathLength={100}
        strokeDasharray={`${pct} 100`}
        transform="rotate(-90 20 20)"
        style={{ transition: "stroke-dasharray .45s ease-out" }}
      />
      <text x="20" y="24" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1F2328">
        {done}
      </text>
    </svg>
  );
}

/** Sticky section rail with hash anchors, minutes per section and the Dossier progress ring. */
export function SectionRail({ route }: { route: RouteNo }) {
  const hydrated = useHydrated();
  const progress = dossierProgress(usePersisted(), route);
  const sections = SECTIONS[route];
  const [active, setActive] = useState<string>(sections[0].id);
  const { done, total } = hydrated ? progress : { done: 0, total: progress.total };

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        let cur: string = sections[0].id;
        for (const s of sections) {
          const el = document.getElementById(s.id);
          if (el && el.getBoundingClientRect().top <= 140) cur = s.id;
        }
        setActive(cur);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [sections]);

  return (
    <nav
      aria-label={tt(`Route ${route} sections`, `Abschnitte von Route ${route}`)}
      className="sticky top-12 z-30 -mx-4 border-b border-line bg-canvas/95 px-4 backdrop-blur md:-mx-6 md:px-6 print:hidden"
    >
      <div className="flex items-center gap-2 py-1.5">
        <ol className="flex min-w-0 flex-1 gap-1 overflow-x-auto">
          {sections.map((s) => (
            <li key={s.id} className="min-w-0 flex-1">
              <a
                href={`#${s.id}`}
                aria-current={active === s.id ? "location" : undefined}
                className={clsx(
                  "block rounded-lg px-2 py-1 text-center transition-colors md:px-3 md:text-left",
                  active === s.id ? "bg-ink text-paper" : "text-ash hover:bg-mist hover:text-ink",
                )}
              >
                <span className="block truncate text-caption font-semibold leading-tight">{s.label}</span>
                <span className="block truncate text-micro leading-tight opacity-80">
                  <span className="hidden md:inline">{s.sub} · </span>
                  {s.minutes} {tt("min", "Min.")}
                </span>
              </a>
            </li>
          ))}
        </ol>
        <div className="flex shrink-0 items-center gap-2" title={tt("Cards marked read + task blocks completed", "Gelesene Karten + ausgefüllte Aufgabenblöcke")}>
          <Ring done={done} total={total} />
          <span className="hidden text-micro leading-tight text-ash lg:block">
            Dossier
            <br />
            {done}/{total}
          </span>
        </div>
      </div>
    </nav>
  );
}
