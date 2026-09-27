import { LEVEL_LABEL, LINES } from "@/data/ladder";
import { BASIS_LABEL, CUST_BY_ID, FIGURES, FIGURE_IDS, PILOT } from "@/data/forecast";
import { AB, AB_PARTS, MEANINGS, OUTCOME_LABEL, PATTERNS, PATTERN_IDS, PMEASURES, RECORDS, RISK_LABEL, UNC_BY_ID } from "@/data/patterns";
import { BUDGET, MEASURE_BY_ID, MONTHS, PROBLEM_LABEL } from "@/data/measures";
import { ACTION_LABEL, ARCH, ARCH_BY_ID, ARCH_IDS, COMP_BY_ID, CRITERIA, CRIT_IDS, DECISIONS, KPI_BY_ID, LOGIC_OWNER_LABEL, OWNERS, PRINCIPLES, R2_BUDGET, R2_MONTHS, SITUATIONS, SOURCES, USE_LABEL } from "@/data/route2";
import { archCost, archLeft, coverage, funded, measureScore, tallyOf, totalCost } from "@/lib/checks";
import { euro, getLang, num, pct, tt } from "@/lib/lang";
import { parseAmount } from "@/lib/parseAmount";
import { COURSE } from "@/lib/routes";
import { esc } from "@/lib/svg";
import type { Persisted } from "@/store/useStore";

/**
 * Each exported document is built here as a self-contained HTML string (inline CSS + inline SVG), in the active language. The
 * on-screen "Preview of your ..." renders this same body, so what the participant reads is what they download. It never prints
 * answer keys, ticks, crosses or scores (a measure's effect × measurability × scalability is the learner's own priority
 * score, not a mark).
 */

export const DOC_CSS = `
.doc{font-family:Georgia,Cambria,"Times New Roman",serif;color:#1F2328;background:#FFFEFA;line-height:1.5;font-size:14px}
.doc *{box-sizing:border-box}
.doc h1{font-size:22px;margin:0 0 4px;font-weight:600}
.doc h2{font-size:15px;margin:22px 0 8px;padding-bottom:4px;border-bottom:1px solid #D8D1BF;font-weight:600;letter-spacing:.01em}
.doc h3{font-size:13.5px;margin:14px 0 4px;font-weight:600}
.doc .meta{display:grid;grid-template-columns:auto 1fr;gap:2px 14px;margin:12px 0 4px;font-family:system-ui,sans-serif;font-size:12.5px}
.doc .meta dt{color:#59606A}.doc .meta dd{margin:0}
.doc .kicker{font-family:system-ui,sans-serif;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#8A5A0B}
.doc table{width:100%;border-collapse:collapse;font-size:12.5px;font-family:system-ui,sans-serif}
.doc th{text-align:left;font-weight:600;color:#59606A;border-bottom:1px solid #59606A;padding:4px 8px 4px 0;font-size:11px;letter-spacing:.04em;text-transform:uppercase}
.doc td{border-bottom:1px solid #ECE6D6;padding:6px 8px 6px 0;vertical-align:top}
.doc td.num{text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums}
.doc td.id{font-weight:700}
.doc table{table-layout:auto}.doc td,.doc th{overflow-wrap:anywhere}
.doc blockquote{margin:6px 0;padding:6px 12px;border-left:3px solid #D99A2B;background:#FBF0D6}
.doc .muted{color:#59606A}
.doc .foot{margin-top:26px;padding-top:8px;border-top:1px solid #59606A;font-family:system-ui,sans-serif;font-size:12px;color:#59606A}
.doc .legend{font-family:system-ui,sans-serif;font-size:11.5px;color:#59606A;margin:4px 0 0}
.doc svg{display:block;margin:8px 0}
@media print{.doc{font-size:12px}.doc h2{break-after:avoid}.doc table,.doc svg,.doc blockquote{break-inside:avoid}}
`;

const dateLabel = () => new Date().toLocaleDateString(getLang() === "de" ? "de-DE" : "en-GB", { day: "numeric", month: "long", year: "numeric" });

function header(title: string, level: string, p: Persisted): string {
  return `
<div class="kicker">${esc(COURSE.course)} · ${esc(COURSE.company)}</div>
<h1>${esc(title)}</h1>
<dl class="meta">
  <dt>${esc(tt("Course", "Kurs"))}</dt><dd>${esc(COURSE.course)} · ${esc(tt(`Day ${COURSE.day}`, `Tag ${COURSE.day}`))}</dd>
  <dt>${esc(tt("Position", "Einordnung"))}</dt><dd>${esc(level)}</dd>
  <dt>${esc(tt("Participant", "Teilnehmer/in"))}</dt><dd>${esc(p.participant.name.trim() || "—")}</dd>
  <dt>${esc(tt("Date", "Datum"))}</dt><dd>${esc(dateLabel())}</dd>
</dl>`;
}

const para = (s: string) => `<blockquote>${esc(s.trim()) || "—"}</blockquote>`;
const cell = (s: string) => esc(s.trim()) || "—";

export function wrapDocument(title: string, body: string): string {
  return `<!doctype html>
<html lang="${getLang()}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<style>body{margin:0;background:#F3EFE4}.sheet{max-width:820px;margin:0 auto;padding:36px 40px;background:#FFFEFA}@media print{body{background:#fff}.sheet{padding:0;max-width:none}@page{margin:16mm}}${DOC_CSS}</style>
</head><body><div class="sheet"><div class="doc">${body}</div></div></body></html>`;
}

export function downloadHtml(filename: string, html: string) {
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".html") ? filename : `${filename}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Opens the same document in a new window and prints it (no PDF library). Falls back to a hidden frame if pop-ups are blocked. */
export function printDocument(title: string, html: string) {
  const win = window.open("", "_blank");
  if (win) {
    win.document.open();
    win.document.write(html);
    win.document.close();
    win.document.title = title;
    win.focus();
    window.setTimeout(() => win.print(), 250);
    return;
  }
  const iframe = document.createElement("iframe");
  iframe.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden";
  document.body.appendChild(iframe);
  const w = iframe.contentWindow;
  if (!w) return iframe.remove();
  w.document.open();
  w.document.write(html);
  w.document.close();
  window.setTimeout(() => {
    w.focus();
    w.print();
    window.setTimeout(() => iframe.remove(), 1000);
  }, 250);
}

/* ------------------------------------------------------------------ Route 1 · the Real-Time Analysis File */

/** Bars of the learner's own tally: metrics per kind and how many moved with customer value, as an inline SVG. */
function tallySvg(p: Persisted): string {
  const t = tallyOf(p.l1.tags);
  const W = 560;
  const rowH = 28;
  const rows = PATTERN_IDS.map((s, i) => {
    const y = 8 + i * rowH;
    const w = (t.count[s] / 6) * 300;
    const wl = (t.left[s] / 6) * 300;
    return `<text x="0" y="${y + 13}" font-size="11.5" fill="#1F2328" font-family="system-ui,sans-serif">${esc(PATTERNS[s].label)}</text>
<rect x="140" y="${y}" width="${Math.max(w, 1.5).toFixed(1)}" height="16" fill="#8B9098" stroke="#1F2328"/>
<rect x="140" y="${y}" width="${wl.toFixed(1)}" height="16" fill="#2F5D62" stroke="#1F2328"/>
<text x="${(146 + w).toFixed(1)}" y="${y + 13}" font-size="11.5" fill="#1F2328" font-family="system-ui,sans-serif">${esc(tt(`${t.count[s]} · ${t.left[s]} moved with value`, `${t.count[s]} · ${t.left[s]} mit dem Wert bewegt`))}</text>`;
  }).join("\n");
  const H = 8 + PATTERN_IDS.length * rowH;
  const title = tt("Metrics per kind, as you tagged them; the dark part moved with customer value", "Kennzahlen pro Art, wie Sie sie zugeordnet haben; der dunkle Teil bewegte sich mit dem Kundenwert");
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="${esc(title)}"><title>${esc(title)}</title>${rows}</svg>`;
}

export function analysisBody(p: Persisted): string {
  const { l1 } = p;
  const sortRows = LINES.map((r, i) => `<tr><td class="id">${i + 1}</td><td>${esc(r.text)}</td><td>${l1.sort[r.id] ? esc(LEVEL_LABEL[l1.sort[r.id]!]) : "—"}</td></tr>`).join("");
  const sortNote = l1.sortReasoning ? `<p class="legend">${esc(tt(`The reasoning for the sort was opened after ${l1.sortChecks} checks.`, `Die Begründung zur Sortierung wurde nach ${l1.sortChecks} Prüfungen geöffnet.`))}</p>` : "";
  const fig = (v: string) => (v.trim() ? esc(v.trim()) : "—");
  const figTable = `<table><thead><tr><th>${esc(tt("Figure", "Wert"))}</th><th class="num">${esc(tt("Your figure", "Ihr Wert"))}</th></tr></thead><tbody>
${FIGURE_IDS.map((f) => `<tr><td class="id">${esc(FIGURES[f].label)}</td><td class="num">${fig(l1.fig[f])}</td></tr>`).join("")}</tbody></table>
<p class="legend">${esc(tt(`As briefed (last quarter, Case assumption): answered after more than a day ${PILOT.control.orders} deals from ${num(PILOT.control.sent)} requests, answered within one hour ${PILOT.variant.orders} deals from ${num(PILOT.variant.sent)} requests; ${num(PILOT.yearly)} quote requests a year; average deal value ${euro(PILOT.order)}.`, `Laut Auftrag (letztes Quartal, Fallannahme): nach mehr als einem Tag beantwortet ${PILOT.control.orders} Abschlüsse aus ${num(PILOT.control.sent)} Anfragen, innerhalb einer Stunde beantwortet ${PILOT.variant.orders} Abschlüsse aus ${num(PILOT.variant.sent)} Anfragen; ${num(PILOT.yearly)} Angebotsanfragen pro Jahr; durchschnittlicher Auftragswert ${euro(PILOT.order)}.`))}</p>`;
  const names = (ids: string[]) => esc(ids.map((c) => CUST_BY_ID[c as keyof typeof CUST_BY_ID].name).join(", ") || "—");
  const insights = l1.insights.map((a, i) => `<h3>${esc(tt(`Improvement ${i + 1}`, `Verbesserung ${i + 1}`))} · ${a.basis ? esc(BASIS_LABEL[a.basis]) : "—"}</h3>${para(a.text)}`).join("");
  const tagRows = RECORDS.map((o) => `<tr><td class="id">${esc(o.code)}</td><td>${esc(o.text)}</td><td>${esc(OUTCOME_LABEL[o.outcome])}</td><td>${l1.tags[o.id] ? esc(PATTERNS[l1.tags[o.id]!].label) : "—"}</td></tr>`).join("");
  const tagNote = l1.tagReasoning ? `<p class="legend">${esc(tt(`The reasoning for the tags was opened after ${l1.tagChecks} checks.`, `Die Begründung zur Zuordnung wurde nach ${l1.tagChecks} Prüfungen geöffnet.`))}</p>` : "";
  const meaningLabel = (id: string | null) => MEANINGS.find((m) => m.id === id)?.label ?? "—";
  const measureLabel = (id: string | null) => PMEASURES.find((m) => m.id === id)?.label ?? "—";
  const rowRows = PATTERN_IDS.map((x) => {
    const r = l1.rows[x];
    return `<tr><td class="id">${esc(PATTERNS[x].label)}</td><td>${r.risk ? esc(RISK_LABEL[r.risk]) : "—"}</td><td>${esc(meaningLabel(r.meaning))}</td><td>${esc(measureLabel(r.measure))}</td></tr>`;
  }).join("");
  const uncList = l1.unc.length ? `<ul>${l1.unc.map((w) => `<li>${esc(UNC_BY_ID[w].label)}</li>`).join("")}</ul>` : `<p class="muted">—</p>`;
  const abRows = AB_PARTS.map((k) => `<tr><td class="id">${esc(AB[k].label)}</td><td>${esc(AB[k].options.find((o) => o.id === l1.ab[k])?.label ?? "—")}</td></tr>`).join("");
  const chosen = l1.chosen;
  const measureRows = chosen
    .map((id) => {
      const m = MEASURE_BY_ID[id];
      const aims = l1.aims[id];
      return `<tr><td class="id">${esc(m.name)}</td><td>${aims === undefined ? "—" : aims.length ? esc(aims.map((a) => PROBLEM_LABEL[a]).join(", ")) : esc(tt("none of the three", "keines der drei"))}</td><td class="num">${l1.eff[id] || "—"} × ${l1.exp[id] || "—"} × ${l1.fea[id] || "—"} = ${measureScore(l1, id) || "—"}</td><td class="num">${esc(euro(m.cost))}</td></tr>`;
    })
    .join("");
  const cov = coverage(l1);
  const notServed = cov.filter((c) => !c.covered).map((c) => PROBLEM_LABEL[c.pattern]).join(", ");
  const covLine = chosen.length
    ? tt(`Problems of the brief at least one chosen measure answers: ${cov.filter((c) => c.covered).length} of 3${notServed ? ` (not answered: ${notServed})` : ""}.`, `Probleme des Auftrags, die mindestens eine gewählte Maßnahme beantwortet: ${cov.filter((c) => c.covered).length} von 3${notServed ? ` (nicht beantwortet: ${notServed})` : ""}.`)
    : "";
  const cost = totalCost(chosen);
  const order = l1.order.filter((id) => chosen.includes(id));

  return `${header("Real-Time Analysis File", tt("Levels 1 and 2 · Knowledge and application", "Level 1 und 2 · Wissen und Anwendung"), p)}
<h2>${esc(tt("The case", "Der Fall"))}</h2>
<p>${esc(tt(`LiveConnect IT Services GmbH sells managed IT and cloud services to the Mittelstand: many website visitors, but high bounce rates, low interaction, slow answers and measures that are not coordinated. Budget ${euro(BUDGET)}, time ${MONTHS} months. Evidence in the file: nine real-time ideas, last quarter's requests by speed of answer, eight moments on the website and twelve metrics.`, `LiveConnect IT Services GmbH verkauft dem Mittelstand Managed-IT- und Cloud-Services: viele Website-Besucher, aber hohe Absprungraten, geringe Interaktion, langsame Antworten und nicht abgestimmte Maßnahmen. Budget ${euro(BUDGET)}, Zeit ${MONTHS} Monate. Evidenz in der Datei: neun Echtzeit-Ideen, die Anfragen des letzten Quartals nach Antworttempo, acht Momente auf der Website und zwölf Kennzahlen.`))}</p>

<h2>${esc(tt("Part 1 · Understand the real-time effect", "Teil 1 · Die Echtzeit-Wirkung verstehen"))}</h2>
<h3>${esc(tt("1.1 · Respond, personalise or learn", "1.1 · Reagieren, personalisieren oder lernen"))}</h3>
<table><thead><tr><th>#</th><th>${esc(tt("Idea", "Idee"))}</th><th>${esc(tt("Your lever", "Ihr Hebel"))}</th></tr></thead><tbody>${sortRows}</tbody></table>${sortNote}
<h3>${esc(tt("A real-time opportunity of my own", "Eine eigene Echtzeit-Chance"))}</h3>${para(l1.extraInsight)}
<h3>${esc(tt("1.2 · What speed is worth", "1.2 · Was Tempo wert ist"))}</h3>
${figTable}
${para(l1.meaning)}
<h2>${esc(tt("1.3 · Where to respond at once, where to personalise, and three improvements", "1.3 · Wo sofort reagieren, wo personalisieren, und drei Verbesserungen"))}</h2>
<p><strong>${esc(tt("Respond immediately:", "Sofort reagieren:"))}</strong> ${names(l1.valuable)}</p>
<p><strong>${esc(tt("Personalise:", "Personalisieren:"))}</strong> ${names(l1.churners)}</p>
${insights}
<h2>${esc(tt("1.4 · Coaching reflection", "1.4 · Coaching-Reflexion"))}</h2>
<h3>${esc(tt("Why is speed a success factor, and where do delays occur?", "Warum ist Tempo ein Erfolgsfaktor, und wo entstehen Verzögerungen?"))}</h3>${para(l1.reflect.interpret)}
<h3>${esc(tt("When is personalisation felt as added value?", "Wann wird Personalisierung als Mehrwert empfunden?"))}</h3>${para(l1.reflect.causation)}
<h3>${esc(tt("Which measures work immediately, and how to prioritise?", "Welche Maßnahmen wirken sofort, und wie priorisieren?"))}</h3>${para(l1.reflect.decider)}

<h2>${esc(tt("Part 2 · Make it measurable and choose", "Teil 2 · Messbar machen und auswählen"))}</h2>
<h3>${esc(tt("2.1 · The twelve metrics, as you tagged them", "2.1 · Die zwölf Kennzahlen, wie Sie sie zugeordnet haben"))}</h3>
<table><thead><tr><th>${esc(tt("Metric", "Kennzahl"))}</th><th>${esc(tt("What it counts", "Was sie zählt"))}</th><th>${esc(tt("Last year", "Letztes Jahr"))}</th><th>${esc(tt("Kind", "Art"))}</th></tr></thead><tbody>${tagRows}</tbody></table>${tagNote}
${tallySvg(p)}
<h2>${esc(tt("2.2 · What each kind of metric is worth", "2.2 · Was jede Art von Kennzahl wert ist"))}</h2>
<table><thead><tr><th>${esc(tt("Kind", "Art"))}</th><th>${esc(tt("Link to value", "Verbindung zum Wert"))}</th><th>${esc(tt("What it tells management", "Was es dem Management sagt"))}</th><th>${esc(tt("How to use it", "Wie man sie nutzt"))}</th></tr></thead><tbody>${rowRows}</tbody></table>
<h3>${esc(tt("Uncertainties in the speed figures", "Unsicherheiten der Tempo-Werte"))}</h3>${uncList}
<h3>${esc(tt("My three KPIs", "Meine drei KPIs"))}</h3>${para(l1.misread)}
<h2>${esc(tt("2.3 · A fair A/B test", "2.3 · Ein fairer A/B-Test"))}</h2>
<h3>${esc(tt("Hypothesis", "Hypothese"))}</h3>${para(l1.ab.hyp)}
<table><tbody>${abRows}</tbody></table>
<h3>${esc(tt("Decision rule", "Entscheidungsregel"))}</h3>${para(l1.ab.rule)}
<h2>${esc(tt("2.4 · Three measures, scored and ordered", "2.4 · Drei Maßnahmen, bewertet und geordnet"))}</h2>
<table><thead><tr><th>${esc(tt("Measure", "Maßnahme"))}</th><th>${esc(tt("Answers", "Beantwortet"))}</th><th class="num">${esc(tt("Effect × Speed × Scalability", "Wirkung × Tempo × Skalierbarkeit"))}</th><th class="num">${esc(tt("Cost", "Kosten"))}</th></tr></thead><tbody>${measureRows || `<tr><td colspan="4">—</td></tr>`}</tbody></table>
<p class="legend">${esc(tt(`Total cost ${euro(cost)} of the ${euro(BUDGET)} budget${cost > BUDGET ? ` (${euro(cost - BUDGET)} over)` : ""}.`, `Gesamtkosten ${euro(cost)} vom Budget von ${euro(BUDGET)}${cost > BUDGET ? ` (${euro(cost - BUDGET)} darüber)` : ""}.`))} ${esc(covLine)}</p>
<h3>${esc(tt("Priority order", "Reihenfolge"))}</h3>
<ol>${order.map((id) => `<li>${esc(MEASURE_BY_ID[id].name)}</li>`).join("") || "<li>—</li>"}</ol>
${para(l1.why)}

<div class="foot">${esc(tt(`Checks requested: ${l1.checks}`, `Angeforderte Prüfungen: ${l1.checks}`))}<br/>${esc(tt(`Generated ${dateLabel()}.`, `Erstellt am ${dateLabel()}.`))}</div>`;
}

/* ------------------------------------------------------------------ Route 2 · the Real-Time Management Memo */

/** The Level 3 memo. The on-screen live preview and the exported file are both built by this function. */
export function memoBody(p: Persisted): string {
  const { l1, r2 } = p;
  const name = p.participant.name.trim();
  const risks = PATTERN_IDS.filter((x) => l1.rows[x].risk).map((x) => `${PATTERNS[x].label} (${RISK_LABEL[l1.rows[x].risk!]})`);
  const situation =
    risks.length || l1.chosen.length
      ? `<blockquote><strong>${esc(tt("Where Route 1 left off.", "Wo Route 1 aufgehört hat."))}</strong> ${esc(tt("Link to customer value per kind of metric:", "Verbindung zum Kundenwert pro Art von Kennzahl:"))} ${esc(risks.join(", ") || "—")}. ${esc(tt("Measures chosen:", "Gewählte Maßnahmen:"))} ${esc(l1.chosen.map((id) => MEASURE_BY_ID[id].name).join(", ") || "—")}.</blockquote>`
      : `<p class="muted">${esc(tt("Route 1 is not finished, so there is nothing to quote yet. Nothing is blocked.", "Route 1 ist nicht fertig, daher gibt es noch nichts zu zitieren. Nichts ist gesperrt."))}</p>`;
  const principleRows = r2.principles.map((c) => `<tr><td class="id">${esc(PRINCIPLES[c].name)}</td><td>${cell(r2.principleText[c] ?? "")}</td></tr>`).join("");
  const sourceRows = SOURCES.map((s) => `<tr><td class="id">${esc(s.name)}</td><td>${esc(s.decision ?? "—")}</td><td class="num">${pct(s.complete)}</td><td>${r2.sources[s.id] ? esc(USE_LABEL[r2.sources[s.id]]) : "—"}</td></tr>`).join("");
  const B = ["—", tt("Low", "Niedrig"), tt("Mid", "Mittel"), tt("High", "Hoch")];
  const compRows = r2.comps
    .map((id) => `<tr><td class="id">${esc(COMP_BY_ID[id].name)}${r2.greatest === id ? ` <span class="muted">(${esc(tt("greatest leverage", "größte Hebelwirkung"))})</span>` : ""}</td>${CRIT_IDS.map((c) => `<td>${esc(B[r2.rate[`${id}.${c}`] || 0])}</td>`).join("")}</tr>`)
    .join("");
  const logicRows = SITUATIONS.map((s) => {
    const r = r2.logic[s.id];
    return `<tr><td class="id">${esc(s.signal)}</td><td class="num">${s.lift > 0 ? "+" : s.lift < 0 ? "−" : ""}${esc(pct(Math.abs(s.lift)))} · ${s.cases}</td><td>${r?.action ? esc(ACTION_LABEL[r.action]) : "—"}</td><td>${r?.owner ? esc(LOGIC_OWNER_LABEL[r.owner]) : "—"}</td></tr>`;
  }).join("");
  const fundedIds = funded(r2);
  const archRows = ARCH.map((a) => {
    const on = !!r2.alloc[a.id];
    return `<tr><td class="id">${esc(a.name)}</td><td>${esc(on ? tt("funded", "finanziert") : tt("not funded", "nicht finanziert"))}</td><td class="num">${on ? esc(euro(a.cost)) : "—"}</td><td class="num">${on && r2.start[a.id] != null ? esc(tt(`month ${r2.start[a.id]}`, `Monat ${r2.start[a.id]}`)) : "—"}</td><td>${on && r2.owner[a.id] ? esc(OWNERS[r2.owner[a.id]!].name) : "—"}</td><td>${on ? cell(r2.trigger[a.id] ?? "") : "—"}</td></tr>`;
  }).join("");
  const d = DECISIONS.find((x) => x.id === r2.decision);
  const k = r2.tripKpi ? KPI_BY_ID[r2.tripKpi] : null;
  const thr = parseAmount(r2.tripThreshold);
  const u = (x: typeof k) => (x ? (x.unit === "%" ? tt("%", " %") : ` ${x.unit}`) : "");
  const action = { "": "—", scale: tt("scale up anyway", "trotzdem ausweiten"), adjust: tt("adjust one rule and continue", "eine Regel anpassen und weitermachen"), stop: tt("stop the rollout and reconsider the architecture", "den Rollout stoppen und die Architektur überdenken") }[r2.tripAction];

  return `${header("Real-Time Management Memo", tt("Level 3 · Management decision", "Level 3 · Managemententscheidung"), p)}
<p class="muted">${esc(tt(`To: the board · From: ${name || "Chief Digital Officer"}, LiveConnect IT Services GmbH · Budget ${euro(R2_BUDGET)} over ${R2_MONTHS} months.`, `An: den Vorstand · Von: ${name || "Chief Digital Officer"}, LiveConnect IT Services GmbH · Budget ${euro(R2_BUDGET)} über ${R2_MONTHS} Monate.`))}</p>
<h2>${esc(tt("1 · Situation", "1 · Lage"))}</h2>
<p>${esc(tt("Customer interaction not coordinated, responses too slow, measures not measurable, a limited budget, an incomplete data situation and high time pressure. The board asks for a real-time customer management system and a decision now.", "Nicht abgestimmte Kundeninteraktion, zu langsame Antworten, nicht messbare Maßnahmen, begrenztes Budget, unvollständige Datenlage und hoher Zeitdruck. Der Vorstand verlangt ein Echtzeit-Kundenmanagementsystem und eine Entscheidung jetzt."))}</p>
${situation}
<h2>${esc(tt("2 · Target vision of the real-time retention system", "2 · Zielbild des Echtzeit-Bindungssystems"))}</h2>
<table><thead><tr><th>${esc(tt("Principle", "Prinzip"))}</th><th>${esc(tt("What it means at LiveConnect", "Was es bei LiveConnect bedeutet"))}</th></tr></thead><tbody>${principleRows || `<tr><td colspan="2">—</td></tr>`}</tbody></table>
<h2>${esc(tt("3 · Central interaction points", "3 · Zentrale Interaktionspunkte"))}</h2>
<table><thead><tr><th>${esc(tt("Interaction point", "Interaktionspunkt"))}</th><th>${esc(tt("Customer decision", "Entscheidung des Kunden"))}</th><th class="num">${esc(tt("Tracked", "Erfasst"))}</th><th>${esc(tt("Decision", "Entscheidung"))}</th></tr></thead><tbody>${sourceRows}</tbody></table>
<h2>${esc(tt("4 · The KPI and optimisation system", "4 · Das KPI- und Optimierungssystem"))}</h2>
<table><thead><tr><th>${esc(tt("KPI", "KPI"))}</th>${CRITERIA.map((c) => `<th>${esc(c.name)}</th>`).join("")}</tr></thead><tbody>${compRows || `<tr><td colspan="5">—</td></tr>`}</tbody></table>
<h3>${esc(tt("Why the greatest lever is the greatest", "Warum der größte Hebel der größte ist"))}</h3>${para(r2.greatestWhy)}
<h2>${esc(tt("5 · Tested measures: roll out, keep testing or stop", "5 · Getestete Maßnahmen: ausrollen, weiter testen oder stoppen"))}</h2>
<table><thead><tr><th>${esc(tt("Test", "Test"))}</th><th class="num">${esc(tt("Uplift · conversions", "Uplift · Conversions"))}</th><th>${esc(tt("What happens", "Was passiert"))}</th><th>${esc(tt("Who acts", "Wer handelt"))}</th></tr></thead><tbody>${logicRows}</tbody></table>
<h2>${esc(tt("6 · Prioritised implementation architecture", "6 · Priorisierte Umsetzungsarchitektur"))}</h2>
<table><thead><tr><th>${esc(tt("Item", "Punkt"))}</th><th>${esc(tt("Status", "Status"))}</th><th class="num">${esc(tt("Cost", "Kosten"))}</th><th class="num">${esc(tt("Start", "Start"))}</th><th>${esc(tt("Owner", "Owner"))}</th><th>${esc(tt("Trigger", "Trigger"))}</th></tr></thead><tbody>${archRows}</tbody></table>
<p class="legend">${esc(tt(`Funded ${euro(archCost(r2))} of ${euro(R2_BUDGET)} (${euro(archLeft(r2))} left) across ${fundedIds.length} item${fundedIds.length === 1 ? "" : "s"}.`, `Finanziert ${euro(archCost(r2))} von ${euro(R2_BUDGET)} (${euro(archLeft(r2))} übrig) über ${fundedIds.length} ${fundedIds.length === 1 ? "Punkt" : "Punkte"}.`))}</p>
${ARCH_IDS.every((id) => r2.alloc[id]) ? "" : `<h3>${esc(tt("Left out, and when we look again", "Weggelassen, und wann wir es wieder ansehen"))}</h3>${para(r2.postponed)}<p><strong>${esc(tt("Pickup point:", "Pickup Point:"))}</strong> ${cell(r2.pickup)}</p>`}
<h2>${esc(tt("7 · The decision under time pressure", "7 · Die Entscheidung unter Zeitdruck"))}</h2>
<p><strong>${d ? esc(d.label) : "—"}</strong>${d ? ` — ${esc(d.detail)}` : ""}</p>
<h3>${esc(tt("What this decision rests on", "Worauf diese Entscheidung beruht"))}</h3>
<ol>${r2.assumptions.map((a) => `<li>${cell(a)}</li>`).join("")}</ol>
<h3>Tripwire</h3>
<p>${esc(tt(`${k ? k.label : "—"} reaches ${thr !== null && k ? `${num(thr)}${u(k)}` : "—"} by month ${r2.tripMonth ?? "—"} (today: ${k ? `${num(k.baseline)}${u(k)}` : "—"}). If it is missed: ${action}.`, `${k ? k.label : "—"} erreicht ${thr !== null && k ? `${num(thr)}${u(k)}` : "—"} bis Monat ${r2.tripMonth ?? "—"} (heute: ${k ? `${num(k.baseline)}${u(k)}` : "—"}). Wenn er verfehlt wird: ${action}.`))}</p>
<h3>${esc(tt("If the chat is fast but not good enough in month 2", "Wenn der Chat in Monat 2 schnell, aber nicht gut genug ist"))}</h3>${para(r2.challenge)}

<div class="foot">${esc(tt(`Checks requested: ${r2.checks}`, `Angeforderte Prüfungen: ${r2.checks}`))}<br/>${esc(tt(`Generated ${dateLabel()}.`, `Erstellt am ${dateLabel()}.`))}</div>`;
}

export { ARCH_BY_ID };
