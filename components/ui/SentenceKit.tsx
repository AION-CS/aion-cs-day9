"use client";

import clsx from "clsx";
import type { ReactNode } from "react";
import { RevealHint } from "@/components/ui/RevealHint";
import { scrollToAndFlash } from "@/lib/flash";
import { Gloss } from "@/lib/glossify";
import { tt } from "@/lib/lang";

export type KitSource = { label: string; value: string; target: string };
export type KitOption = { text: string; why: string };
export type KitRow = {
  /** The placeholder in the template this row fills, e.g. "[month]". */
  token: string;
  title: string;
  /** What this part is, in a few words (shown under the title). */
  what?: string;
  /** The value the learner can put in, with the reason it is that value. */
  options: KitOption[];
  /** How it comes out, for a number ("120 ÷ 150 × 100 rounded up"). */
  detail?: string;
  /** Every printed input, each a button to its row. */
  sources?: KitSource[];
  /** Shown instead of the options when this part cannot be given yet (it needs the learner's own choice first). */
  notReady?: string;
};

/**
 * A ready-to-use kit for a one-sentence answer with slots (a trigger, a pickup point). CLAUDE.md #44 and the user's Route 2 standard
 * (2026-09-30): under the field, every slot of the sentence says what to write, why, and where each number comes from, and a button puts
 * it into the sentence. The learner adds the parts one at a time and sees the sentence grow, so they learn what each part is while
 * entering it; they can edit the sentence freely. A different value is fine when the learner gives a reason (#38).
 */
export function SentenceKit({
  id,
  label,
  intro,
  template,
  value,
  onChange,
  rows,
  top,
}: {
  id: string;
  label: string;
  intro: string;
  template: string;
  value: string;
  onChange: (v: string) => void;
  rows: KitRow[];
  /** Extra controls shown first inside the panel (e.g. which item a pickup point is for). */
  top?: ReactNode;
}) {
  const put = (token: string, text: string) => {
    const base = value.trim() ? value : template;
    onChange(base.includes(token) ? base.replace(token, text) : `${base.trim()} ${text}`.trim());
  };
  return (
    <RevealHint id={id} label={label} title={label}>
      <div className="space-y-3 text-caption text-ink">
        <p>
          <Gloss>{intro}</Gloss>
        </p>
        {top}
        <p className="rounded-md border border-dashed border-ash/60 bg-paper px-2.5 py-1.5 font-semibold text-ink">{template}</p>
        {rows.map((r, i) => (
          <div key={r.token} className="space-y-1.5 rounded-md border border-line bg-paper p-2.5">
            <p className="smallcaps text-ash">
              {i + 1} · {r.title} <span className="normal-case tracking-normal text-ash">{r.what ? `· ${r.what}` : ""}</span>
            </p>
            {r.notReady ? (
              <p className="text-ash">{r.notReady}</p>
            ) : (
              <>
                {r.detail && <p className="tnum text-ash">{r.detail}</p>}
                <ul className="space-y-2">
                  {r.options.map((o) => (
                    <li key={o.text} className={clsx("rounded border border-line bg-mist/40 p-2", r.options.length > 1 && "border-dashed")}>
                      <p>
                        <strong className="text-ink">{o.text}</strong>
                      </p>
                      <p className="mt-0.5">
                        <span className="smallcaps mr-1.5 text-accent">{tt("Why", "Warum")}</span>
                        <Gloss>{o.why}</Gloss>
                      </p>
                      <button type="button" onClick={() => put(r.token, o.text)} className="btn-ghost btn-sm mt-1.5">
                        {tt("Put into my sentence", "In meinen Satz übernehmen")}
                      </button>
                    </li>
                  ))}
                </ul>
                {r.sources && r.sources.length > 0 && (
                  <div>
                    <p className="smallcaps text-ash">{tt("Where it comes from · click one to see it on the page", "Woher es kommt · klicken Sie eines an, um es auf der Seite zu sehen")}</p>
                    <ul className="mt-1 space-y-0.5">
                      {r.sources.map((s) => (
                        <li key={`${s.label}-${s.target}`}>
                          <button
                            type="button"
                            onClick={() => s.target && scrollToAndFlash(s.target, "ref")}
                            className="flex min-h-[36px] w-full flex-wrap items-baseline gap-x-2 rounded px-2 py-1 text-left hover:bg-accentSoft"
                          >
                            <span className="text-ink">{s.label}:</span>
                            <span className="tnum font-semibold text-ink">{s.value}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </RevealHint>
  );
}
