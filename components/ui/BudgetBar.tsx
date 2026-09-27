"use client";

import { useId } from "react";
import { euro, tt } from "@/lib/lang";

const W = 560;
const X0 = 8;
const X1 = 552;
const H = 108;

/**
 * A budget bar: one segment per funded item, drawn to scale against the budget line. An amount beyond the budget is drawn as an
 * amber hatch, so the over-cap part is read by pattern and label, not by colour. Each segment carries its item's short label.
 */
export function BudgetBar({ items, budget, title }: { items: { id: string; short: string; cost: number }[]; budget: number; title: string }) {
  const uid = useId().replace(/:/g, "");
  const total = items.reduce((s, i) => s + i.cost, 0);
  const over = Math.max(0, total - budget);
  const max = Math.max(budget, total) * 1.04;
  const x = (v: number) => X0 + (v / max) * (X1 - X0);
  let acc = 0;
  const segs = items.map((it, i) => {
    const s = { it, from: acc, to: acc + it.cost, i };
    acc += it.cost;
    return s;
  });
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
      <title id={`${uid}-t`}>{title}</title>
      <desc id={`${uid}-d`}>{tt(`${items.length} items funded, ${euro(total)} of ${euro(budget)}${over > 0 ? `, ${euro(over)} over budget` : ""}.`, `${items.length} Punkte finanziert, ${euro(total)} von ${euro(budget)}${over > 0 ? `, ${euro(over)} über dem Budget` : ""}.`)}</desc>
      <defs>
        <pattern id={`${uid}-over`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="7" height="7" fill="#FBF0D6" />
          <line x1="0" y1="0" x2="0" y2="7" stroke="#8A5A0B" strokeWidth="2.8" />
        </pattern>
        <pattern id={`${uid}-dots`} width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="#DFEEEB" />
          <circle cx="4" cy="4" r="1.8" fill="#0F6B6B" />
        </pattern>
      </defs>
      <rect x={X0} y="30" width={X1 - X0} height="34" rx="3" fill="#ECE6D6" stroke="#D8D1BF" />
      {segs.map(({ it, from, to, i }) => {
        const w = x(to) - x(from);
        const dark = i % 3 === 0;
        return (
          <g key={it.id}>
            <rect x={x(from)} y="30" width={Math.max(w, 0.5)} height="34" fill={dark ? "#2F5D62" : i % 3 === 1 ? "#8B9098" : `url(#${uid}-dots)`} stroke="#1F2328" strokeWidth="1" className="anim-grow-x" />
            {w > 30 && (
              <text x={x(from) + w / 2} y="52" textAnchor="middle" fontSize="13" fontWeight="700" fill={dark ? "#FFFEFA" : "#1F2328"} stroke={dark ? "none" : "#FFFEFA"} strokeWidth="3" paintOrder="stroke">
                {it.short}
              </text>
            )}
          </g>
        );
      })}
      {over > 0 && <rect x={x(budget)} y="30" width={x(total) - x(budget)} height="34" fill={`url(#${uid}-over)`} stroke="#8A5A0B" strokeWidth="1.6" />}
      <line x1={x(budget)} x2={x(budget)} y1="18" y2="76" stroke="#1F2328" strokeWidth="2.2" />
      <text x={x(budget) > W - 80 ? x(budget) + 4 : x(budget)} y="13" textAnchor={x(budget) > W - 80 ? "end" : "middle"} fontSize="13" fontWeight="700" fill="#1F2328">
        {`${tt("Budget", "Budget")} ${euro(budget)}`}
      </text>
      <text x={X0 + 2} y="92" fontSize="12" fill="#59606A">
        {euro(0)}
      </text>
      <text x={x(budget) > W - 60 ? x(budget) + 4 : x(budget)} y="92" textAnchor={x(budget) > W - 60 ? "end" : "middle"} fontSize="12" fill="#59606A">
        {euro(budget)}
      </text>
      <text x={X0 + 2} y="104" fontSize="12.5" fontWeight="700" fill="#1F2328">
        {`${tt("Plan", "Plan")} ${euro(total)}`}
      </text>
      {over > 0 && (
        <text x={Math.min(x(total), X1)} y="104" textAnchor="end" fontSize="13" fontWeight="700" fill="#8A5A0B">
          {tt(`${euro(over)} over`, `${euro(over)} darüber`)}
        </text>
      )}
    </svg>
  );
}
