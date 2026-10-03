"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { pageNav } from "@/data/pageNav";
import type { NavItem } from "@/data/pageNav";
import { scrollToAndFlash } from "@/lib/flash";
import { taskBlocks } from "@/lib/progress";
import type { RouteNo } from "@/lib/routes";
import { openOptionalBlock } from "@/store/useOptionalOpen";
import { useHydrated } from "@/store/useStore";
import { usePersisted } from "@/store/usePersisted";
import { tt } from "@/lib/lang";


/**
 * The page map: every material card and task block of the route, in page order. On wide screens a slim
 * column of pills fixed to the right edge (the full name appears on hover or focus); below that, a
 * "Jump to" button that opens the same list with full names. The pill for the part in view is dark
 * (same as the section rail); a card marked read or a block filled in carries a teal dot (a state,
 * never "correct"). A click scrolls to the part and flashes it with the amber reference flash.
 */
export function PageNav({ route }: { route: RouteNo }) {
  const groups = useMemo(() => pageNav(route), [route]);
  const items = useMemo(() => groups.flatMap((g) => g.items), [groups]);
  const hydrated = useHydrated();
  const p = usePersisted();
  const blocks = taskBlocks(p);
  const [active, setActive] = useState(items[0].id);
  const [open, setOpen] = useState(false);

  const isDone = (it: NavItem) =>
    hydrated && !!it.done && ("card" in it.done ? !!p.ui.sectionsRead[it.done.card] : blocks[it.done.block]);
  const doneCount = items.filter((i) => !i.optional && isDone(i)).length;
  const trackable = items.filter((i) => i.done && !i.optional).length;

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        // The part in view is the last one whose top has passed ~45% of the screen; at the very bottom of
        // the page, the last part that is visible at all (the export sits there and never reaches the line).
        const line = Math.max(180, window.innerHeight * 0.45);
        const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
        let cur = items[0].id;
        for (const it of items) {
          const el = document.getElementById(it.id);
          if (!el) continue;
          const top = el.getBoundingClientRect().top;
          if (top <= line || (atBottom && top < window.innerHeight)) cur = it.id;
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
  }, [items]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    setActive(id);
    // An Optional card or block is collapsed until asked for: open it first, then land on it.
    openOptionalBlock(id);
    window.setTimeout(() => scrollToAndFlash(id, "ref", "start"), 60);
  };
  const activeItem = items.find((i) => i.id === active);

  return (
    <>
      {/* Wide screens: fixed column on the right edge, outside the 1100 px content column. */}
      <nav
        aria-label={tt(`Route ${route} page map`, `Seitenübersicht Route ${route}`)}
        className="fixed right-3 top-1/2 z-30 hidden max-h-[calc(100vh-7rem)] -translate-y-1/2 overflow-y-auto py-1 xl:block print:hidden"
      >
        <ol className="flex flex-col items-end gap-2">
          {groups.map((g) => (
            <li key={g.label} className="flex flex-col items-end gap-1">
              <span className="smallcaps pr-1 text-[10px]">{g.label}</span>
              <ol className="flex flex-col items-end gap-1">
                {g.items.map((it) => {
                  const on = it.id === active;
                  const done = isDone(it);
                  return (
                    <li key={it.id} className="group relative flex items-center justify-end gap-1">
                      {/* Always visible, beside the pill, not only on hover/focus: a learner must never have to hover
                          to know Core from Optional, and it must never push the row taller than the pill itself. */}
                      {it.done && (
                        <span aria-hidden className={clsx("whitespace-nowrap text-[9px] font-semibold uppercase leading-none tracking-wide", it.optional ? "text-ash" : "text-signal")}>
                          {it.optional ? tt("optional", "optional") : tt("core", "Kern")}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => go(it.id)}
                        aria-current={on ? "location" : undefined}
                        aria-label={`${it.short} · ${it.title}${it.done ? (it.optional ? tt(" — optional", " — optional") : tt(" — core", " — Kern")) : ""}${done ? tt(" — done", " — erledigt") : ""}`}
                        className={clsx(
                          "relative flex h-7 min-w-[3.25rem] shrink-0 items-center justify-center rounded-full border px-2.5 text-micro font-bold transition-colors",
                          on ? "border-ink bg-ink text-paper" : it.optional ? "border-dashed border-line bg-paper text-ash hover:border-accent hover:text-ink" : "border-line bg-paper text-ash hover:border-accent hover:text-ink",
                        )}
                      >
                        {it.short}
                        {done && (
                          <span aria-hidden className={clsx("absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-canvas", "bg-signal")} />
                        )}
                      </button>
                      <span
                        aria-hidden
                        className="pointer-events-none absolute right-full top-1/2 mr-2 hidden -translate-y-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-micro text-paper shadow-sm group-focus-within:block group-hover:block"
                      >
                        {it.title}{it.done ? (it.optional ? tt(" · Optional", " · Optional") : tt(" · Core", " · Kern")) : ""}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </li>
          ))}
        </ol>
      </nav>

      {/* Smaller screens: a button that opens the same map as a list with full names. */}
      <div className="fixed bottom-20 right-4 z-40 xl:hidden print:hidden">
        {open && (
          <div
            id={`pagemap-${route}`}
            role="dialog"
            aria-label={tt(`Route ${route} page map`, `Seitenübersicht Route ${route}`)}
            className="fade-in absolute bottom-full right-0 mb-2 max-h-[65vh] w-[min(20rem,calc(100vw-2rem))] overflow-y-auto rounded-xl border border-line bg-paper p-3 shadow-lg"
          >
            {groups.map((g) => (
              <div key={g.label} className="mb-2 last:mb-0">
                <p className="smallcaps mb-1">{g.label}</p>
                <ol className="space-y-0.5">
                  {g.items.map((it) => {
                    const on = it.id === active;
                    const done = isDone(it);
                    return (
                      <li key={it.id}>
                        <button
                          type="button"
                          onClick={() => go(it.id)}
                          aria-current={on ? "location" : undefined}
                          className={clsx(
                            "flex min-h-[40px] w-full items-center gap-2 rounded-lg px-2 text-left text-caption",
                            on ? "bg-ink text-paper" : "text-ink hover:bg-mist",
                          )}
                        >
                          <span className={clsx("w-12 shrink-0 font-bold", on ? "text-paper" : "text-ash")}>{it.short}</span>
                          <span className="min-w-0 flex-1">
                            {it.title}
                            {it.done && (
                              <span className={clsx("ml-1 text-micro font-normal", on ? "text-paper/80" : it.optional ? "text-ash" : "text-signal")}>
                                {it.optional ? `(${tt("optional", "optional")})` : `(${tt("core", "Kern")})`}
                              </span>
                            )}
                          </span>
                          {done && (
                            <span className={clsx("text-micro font-semibold", on ? "text-paper" : "text-signal")}>
                              <span aria-hidden>● </span>
                              {it.done && "card" in it.done ? tt("read", "gelesen") : tt("done", "erledigt")}
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </div>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={`pagemap-${route}`}
          className="flex min-h-[44px] items-center gap-2 rounded-full border border-ink bg-ink px-4 text-caption font-semibold text-paper shadow-md"
        >
          <span aria-hidden>☰</span>
          {tt("Jump to", "Springen zu")}
          {activeItem ? ` · ${activeItem.short}` : ""}
          <span className="tnum font-normal opacity-80">
            {doneCount}/{trackable}
          </span>
        </button>
      </div>
    </>
  );
}
