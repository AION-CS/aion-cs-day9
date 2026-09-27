"use client";

import type { ReactNode } from "react";
import clsx from "clsx";
import { MATERIAL_BY_ID, materialAnchorId } from "@/data/materialIndex";
import type { MaterialId } from "@/data/materialIndex";
import { plainOf } from "@/data/materialPlain";

import { REFERENCES, refFull } from "@/data/references";
import type { RefKey } from "@/data/references";
import { scrollToAndFlash } from "@/lib/flash";
import { glossify } from "@/lib/glossify";
import { useHydrated, useStore } from "@/store/useStore";
import { tt } from "@/lib/lang";

/** A source chip: "Author Year". Click opens the block's References accordion and flashes the full citation. */
export function SourceChip({ refKey, block }: { refKey: RefKey; block: "A" | "B" }) {
  const r = REFERENCES[refKey];
  return (
    <button
      type="button"
      title={refFull(r.key)}
      onClick={() => {
        const acc = document.getElementById(`refs-${block}`) as HTMLDetailsElement | null;
        if (acc) acc.open = true;
        window.setTimeout(() => scrollToAndFlash(`ref-${block}-${refKey}`, "ref"), 50);
      }}
      className="tap-chip rounded-full border border-line bg-canvas px-2.5 py-0.5 text-micro font-medium text-ash transition-colors hover:border-accent hover:text-accent"
    >
      {r.chip}
    </button>
  );
}

/**
 * One study card. Order is fixed: title → scan line → "In plain words" box (data/materialPlain.ts) → body (the SVG is the
 * instrument) → decision rules → sources → Mark as read. Cards are short blocks
 * that carry a named framework, a real figure or a real case.
 */
export function MaterialCard({
  id,
  scan,
  children,
  reasoning,
  sources,
}: {
  id: MaterialId;
  scan: string;
  children: ReactNode;
  /** Decision rules, phrased the way the task will need them, including the rule that rules out the plausible wrong option. */
  reasoning?: string[];
  sources: RefKey[];
}) {
  const meta = MATERIAL_BY_ID[id];
  const hydrated = useHydrated();
  const read = useStore((s) => !!s.ui.sectionsRead[id]);
  const toggleRead = useStore((s) => s.toggleRead);
  const isRead = hydrated && read;
  // Technical terms become clickable once per card: the scan line first, then the body, then the rules.
  const seen = new Set<string>();
  const scanG = glossify(scan, seen);
  const plain = plainOf(id);
  const plainRows = [
    { label: tt("In plain words", "In einfachen Worten"), text: plain.idea },
    { label: tt("Why it matters", "Warum es zählt"), text: plain.why },
    ...(plain.picture ? [{ label: tt("How to read the picture below", "So lesen Sie das Bild unten"), text: plain.picture }] : []),
  ].map((r) => ({ ...r, g: glossify(r.text, seen) }));
  const bodyG = glossify(children, seen);
  const rulesG = reasoning?.map((r) => glossify(r, seen));

  return (
    <article id={materialAnchorId(id)} className={clsx("card p-4 md:p-6", isRead && "border-signal/40")}>
      <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="rounded bg-ink px-2 py-0.5 text-micro font-bold text-paper">{id}</span>
        <h3 className="min-w-0 flex-1">{meta.title}</h3>
        <span className="smallcaps whitespace-nowrap">
          {meta.minutes} {tt("min", "Min.")}
        </span>
      </header>
      <p className="mt-2 font-semibold text-ink">{scanG}</p>
      <div className="mt-3 space-y-2.5 rounded-lg border border-line bg-mist/50 p-3.5">
        {plainRows.map((r) => (
          <div key={r.label}>
            <p className="smallcaps text-ash">{r.label}</p>
            <p className="mt-0.5 text-body text-ink">{r.g}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-4">{bodyG}</div>

      {reasoning && reasoning.length > 0 && (
        <div className="mt-5 rounded-lg border border-accent/30 bg-accentSoft p-3.5">
          <p className="smallcaps text-accent">{tt("How to decide when this comes up in the task", "So entscheiden Sie, wenn das in der Aufgabe vorkommt")}</p>
          <ul className="mt-1.5 list-disc space-y-1 pl-5 text-caption text-ink">
            {reasoning.map((r, i) => (
              <li key={r}>{rulesG?.[i] ?? r}</li>
            ))}
          </ul>
        </div>
      )}

      <footer className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {sources.length > 0 && <span className="smallcaps mr-1">{tt("Sources", "Quellen")}</span>}
          {sources.map((s) => (
            <SourceChip key={s} refKey={s} block={meta.block} />
          ))}
        </div>
        <button
          type="button"
          aria-pressed={isRead}
          onClick={() => toggleRead(id)}
          className={clsx(
            "btn btn-sm border",
            isRead ? "border-signal bg-signalSoft text-signal" : "border-line bg-paper text-ink hover:border-ash",
          )}
        >
          {isRead ? tt("✓ Read", "✓ Gelesen") : tt("Mark as read", "Als gelesen markieren")}
        </button>
      </footer>
    </article>
  );
}

/** A dense, scannable table used inside cards. */
export function DataTable({
  head,
  rows,
  caption,
}: {
  head: string[];
  rows: ReactNode[][];
  caption?: string;
}) {
  const seen = new Set<string>();
  return (
    <div className="relative overflow-x-auto rounded-lg border border-line">
      <table className="w-full min-w-[34rem] border-collapse text-caption">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr className="bg-mist text-left">
            {head.map((h) => (
              <th key={h} scope="col" className="px-3 py-2 text-micro font-semibold uppercase text-ash">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-line align-top">
              {r.map((c, j) => (
                <td key={j} className={clsx("px-3 py-2", j === 0 && "font-semibold")}>
                  {glossify(c, seen)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Callout({ label, tone = "amber", children }: { label: string; tone?: "amber" | "rust" | "signal"; children: ReactNode }) {
  const cls =
    tone === "rust"
      ? "border-rust/40 bg-rustSoft"
      : tone === "signal"
        ? "border-signal/40 bg-signalSoft"
        : "border-gold/70 bg-accentSoft";
  return (
    <div className={clsx("rounded-lg border p-3.5 text-caption", cls)}>
      <p className="smallcaps mb-1 text-ink">{label}</p>
      <div className="space-y-1.5 text-ink">{glossify(children)}</div>
    </div>
  );
}
