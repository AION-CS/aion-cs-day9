/**
 * Re-derives every figure and every rule the day rests on, from the same data files the site uses, and compares them with the
 * results briefed in the README. Run: npm run verify:calc. A failed line prints FAIL and the process exits with code 1.
 *
 * The data files are TypeScript with "@/" imports, so a tiny loader transpiles them on the fly (no test framework, no extra dependency).
 */
const path = require("path");
const fs = require("fs");
const Module = require("module");
const ts = require(path.join(process.cwd(), "node_modules", "typescript"));

const root = process.cwd();
const origResolve = Module._resolveFilename;
Module._resolveFilename = function (request, ...rest) {
  if (request.startsWith("@/")) {
    const base = path.join(root, request.slice(2));
    for (const ext of [".ts", ".tsx", "/index.ts"]) if (fs.existsSync(base + ext)) return base + ext;
  }
  return origResolve.call(this, request, ...rest);
};
for (const ext of [".ts", ".tsx"])
  require.extensions[ext] = function (module, filename) {
    const out = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true, jsx: ts.JsxEmit.ReactJSX },
    });
    module._compile(out.outputText, filename);
  };

let failed = 0;
const ok = (name, cond, detail = "") => {
  console.log(`${cond ? "ok  " : "FAIL"}  ${name}${detail ? "  " + detail : ""}`);
  if (!cond) failed++;
};
const eq = (name, a, b) => ok(name, JSON.stringify(a) === JSON.stringify(b), `got ${JSON.stringify(a)}, want ${JSON.stringify(b)}`);

const lang = require("@/lib/lang");
const fc = require("@/data/forecast");
const ld = require("@/data/ladder");
const pt = require("@/data/patterns");
const meas = require("@/data/measures");
const r2 = require("@/data/route2");
const key = require("@/data/mentorKey");
const checks = require("@/lib/checks");
const missing = require("@/lib/missing");
const progress = require("@/lib/progress");
const store = require("@/store/useStore");
const mg = require("@/lib/mentorGuide");

const read = (f) => fs.readFileSync(path.join(root, f), "utf8");
/** The source text of one exported function (up to the next export) of a file. */
const fnText = (file, name) => {
  const src = read(file);
  const i = src.indexOf(`export function ${name}(`);
  if (i < 0) return "";
  const ends = [src.indexOf("\n/* ----", i + 10), src.indexOf("\nexport ", i + 10)].filter((x) => x > 0);
  return src.slice(i, ends.length ? Math.min(...ends) : src.length);
};


// --- Block 1.2 --------------------------------------------------------------------
eq("F1 closing rate of fast answers", fc.FORECAST.f1, 24);
eq("closing rate of slow answers", fc.FORECAST.controlRate, 8);
eq("F2 lift", fc.FORECAST.f2, 3);
eq("Neckar worked example", [fc.MOSEL_RESULT.rate, fc.MOSEL_RESULT.other, fc.MOSEL_RESULT.lift, fc.MOSEL_RESULT.extra], [20, 10, 2, 100000]);
ok("worked example uses other numbers than the task", fc.MOSEL.order !== fc.PILOT.order && fc.MOSEL.yearly !== fc.PILOT.yearly && fc.MOSEL_RESULT.rate !== fc.FORECAST.f1);

ok("sentence check accepts the printed personalised rate", checks.citesForecastFigure(`It reached ${fc.FORECAST.f1}% of requests.`));
ok("sentence check accepts the printed rate in German writing", checks.citesForecastFigure(`Es erreichte ${String(fc.FORECAST.f1).replace(".", ",")} % der Anfragen.`));
ok("sentence check accepts the printed lift as a multiple", checks.citesForecastFigure(`It did ${fc.FORECAST.f2} times as well.`));
ok("sentence check accepts a printed count", checks.citesForecastFigure(`Only ${fc.PILOT.control.orders} cases stand behind it.`));
ok("sentence check rejects a sentence with no figure", !checks.citesForecastFigure("This seems to work for us."));

// --- Block 1.1 / 1.3 ----------------------------------------------------------------
const lvl = ld.LINES.reduce((o, r) => ({ ...o, [r.truth]: (o[r.truth] || 0) + 1 }), {});
eq("ideas: three per kind", lvl, { respond: 3, personal: 3, learn: 3 });
const respondRule = fc.CUSTOMERS.filter((c) => c.decision && c.leave >= fc.LEAVE_MIN).map((c) => c.id);
eq("respond at once = decision page, 50%+ leave", [...respondRule].sort(), [...fc.VALUABLE_TRUTH].sort());
const personalRule = fc.CUSTOMERS.filter((c) => c.known !== "none").map((c) => c.id);
eq("personalise = the visitor is known", [...personalRule].sort(), [...fc.CHURN_TRUTH].sort());
ok("the busy home page is neither", !fc.VALUABLE_TRUTH.includes("c3") && !fc.CHURN_TRUTH.includes("c3"));
ok("the plan comparison page (38% leave) is not respond-at-once", !fc.VALUABLE_TRUTH.includes("c7"));
ok("advantage check needs a consequence word", fc.hasSoWhat("We answer on the pricing page, so fewer visitors leave.") && !fc.hasSoWhat("We answer on the pricing page and faster."));

// --- Block 2.1 / 2.2 / 2.3 ------------------------------------------------------------
eq("metrics per kind", pt.TRUTH_COUNTS, { outcome: 3, driver: 3, guardrail: 3, vanity: 3 });
eq("moved with value per kind", pt.TRUTH_LEFT, { outcome: 3, driver: 2, guardrail: 1, vanity: 0 });
eq("model link per kind", pt.PATTERN_IDS.map((x) => pt.riskOf(pt.TRUTH_LEFT[x], pt.TRUTH_COUNTS[x])), ["high", "high", "mid", "low"]);
eq("real uncertainties", pt.UNCERTAINTIES.filter((w) => w.real).map((w) => w.id), ["sample", "cause", "missing", "shift"]);
ok("every kind has its own use", new Set(Object.values(pt.MEASURE_TRUTH)).size === 4);
ok("the bonus fits no kind", !Object.values(pt.MEASURE_TRUTH).includes("bonus"));
ok("each A/B part has exactly one fair option", pt.AB_PARTS.every((k) => pt.AB[k].options.filter((o) => o.right).length === 1));
eq("model A/B card flags nothing", checks.abFlagsOf({ ...pt.AB_MODEL, hyp: "If we show the add-on, then conversion rises, because it fits.", rule: "Roll out at 10% uplift." }), []);
eq("A/B card flags a wrong part", checks.abFlagsOf({ ...pt.AB_MODEL, control: "lastyear", hyp: "", rule: "" }), ["control"]);
eq("A/B card flags a rule without a number", checks.abFlagsOf({ ...pt.AB_MODEL, hyp: "", rule: "Roll out if it wins." }), ["rule"]);

// --- Block 2.4 --------------------------------------------------------------------
const scores = Object.fromEntries(meas.MEASURES.map((m) => [m.id, meas.modelScore(m.id)]));
eq("model scores", scores, { chat: 27, personal: 18, kpi: 18, callback: 6, pricing: 6, popup: 9, relaunch: 6, social: 3, avatar: 3 });
eq("model three cost", meas.MODEL_COST, 115000);
ok("model three fit the budget", meas.MODEL_COST <= meas.BUDGET);
eq("model three are the three highest scores", [...meas.MEASURES].sort((a, b) => meas.modelScore(b.id) - meas.modelScore(a.id)).slice(0, 3).map((m) => m.id).sort(), [...meas.MODEL_MEASURES].sort());
ok("the model three answer all three problems", meas.PROBLEM_IDS.every((p) => meas.MODEL_MEASURES.some((id) => meas.MEASURE_BY_ID[id].targets.includes(p))));
ok("the avatar answers no problem of the brief", meas.MEASURE_BY_ID.avatar.targets.length === 0);

// --- Route 2 --------------------------------------------------------------------
eq("interaction point decisions by the rule", r2.SOURCES.map((s) => r2.useOf(s)), ["core", "core", "core", "later", "later", "later", "leave", "leave"]);
eq("test decisions by the rule", r2.SITUATIONS.map((s) => r2.actionOf(s)), ["intervene", "watch", "none", "watch", "none", "intervene"]);
for (const c of r2.COMPS) for (const k of r2.CRIT_IDS) ok(`model rating within the printed limit (${c.id}.${k})`, c.model[k] <= r2.maxRating(c.id, k));
ok("model KPIs all show a change early", checks.earlyCount(r2.MODEL_COMPS) === r2.MODEL_COMPS.length);
const archCost = r2.MODEL_ARCH.reduce((s, id) => s + r2.ARCH_BY_ID[id].cost, 0);
eq("model architecture cost", archCost, 180000);
ok("model architecture inside the budget", archCost <= r2.R2_BUDGET);
ok("adding the experience suite breaks the budget", archCost + r2.ARCH_BY_ID.suite.cost > r2.R2_BUDGET);
ok("the tripwire is better than today's baseline", r2.MODEL_TRIPWIRE.threshold > r2.KPI_BY_ID[r2.MODEL_TRIPWIRE.kpi].baseline);

// --- Measures: category, scene, who (CLAUDE.md #45, #46) ---------------------------------------
const AREAS = Object.keys(meas.MEASURE_AREA_LABEL);
for (const l of ["en", "de"]) {
  lang.setCurrentLang(l);
  for (const m of meas.MEASURES) ok(`[${l}] measure ${m.id} has a scene, a who-does-what line and a category`, m.scene.length > 30 && m.who.length > 30 && AREAS.includes(m.area));
  ok(`[${l}] the area note and labels are written`, meas.AREA_NOTE.v.length > 40 && AREAS.every((a) => meas.MEASURE_AREA_LABEL[a].length > 2));
}
lang.setCurrentLang("en");

// --- Key phrases are real substrings, in both languages ---------------------------------
for (const l of ["en", "de"]) {
  lang.setCurrentLang(l);
  for (const r of ld.LINES) ok(`[${l}] key phrase of idea ${r.id} is in its text`, r.text.includes(ld.LINE_KEY[r.id]));
  for (const r of pt.RECORDS) ok(`[${l}] key phrase of metric ${r.id} is in its text`, r.text.includes(pt.REC_KEY[r.id]));
}
lang.setCurrentLang("en");

// --- Core never reads Optional (CLAUDE.md #40) -------------------------------------------
const OPT = /Block (1\.2|1\.4|2\.2|2\.3)\b/;
for (const [file, fn] of [["components/task1/Part1.tsx", "Block11"], ["components/task1/Part1.tsx", "Block13"], ["components/task1/Part2.tsx", "Block21"], ["components/task1/Part2.tsx", "Block24"]])
  ok(`${fn} (Core) names no Optional block`, !OPT.test(fnText(file, fn)));
for (const c of ["CardA1", "CardA2", "CardA3", "CardA5", "CardA7"]) ok(`${c} (Core) names no Optional block`, !OPT.test(fnText("components/materi/CardsA.tsx", c)));
ok("Block 2.4 does not read the pilot figures", !/fig\.|FORECAST|PILOT/.test(fnText("components/task1/Part2.tsx", "Block24")));
const optIds = ["b12", "b14", "b22", "b23", "b31", "b32", "b33", "b34"];
eq("Optional blocks", [...progress.OPTIONAL_BLOCKS].sort(), [...optIds].sort());
eq("Optional material cards", require("@/data/materialIndex").MATERIALS.filter((m) => m.optional && m.block === "A").map((m) => m.id), ["A4", "A6"]);

// --- Old-shape blob (CLAUDE.md #9): version 1 fields are dropped, new ones filled ----------
{
  const old = { ...store.emptyL1(), fig: { F1: "4.8" }, parts: { x: "1" }, chosen: ["reco"] };
  delete old.reasons;
  const merged = store.mergeDefaults(store.emptyL1(), old);
  ok("an old blob gets the new reasons field", typeof merged.reasons === "object" && merged.reasons !== null);
  ok("an old blob keeps what it had", merged.chosen.length === 1 && merged.chosen[0] === "reco");
}

// --- Core-only fill: the four Core blocks alone make a complete, exportable file -----------
{
  lang.setCurrentLang("en");
  const full = { ...store.emptyL1(), ...key.KEY_L1() };
  const coreOnly = { ...full, meaning: "", reflect: { interpret: "", causation: "", decider: "" }, unc: [], rows: store.emptyL1().rows, ab: pt.emptyAb() };
  const p = { participant: { name: "Core Only" }, ui: { bannerDismissed: {}, sectionsRead: {}, lang: "en" }, l1: coreOnly, r2: { ...store.emptyR2() } };
  eq("Core-only fill leaves the Route 1 missing list empty", missing.l1Missing(p).map((m) => m.label), []);
  const tb = progress.taskBlocks(p);
  eq("Core blocks complete after a Core-only fill", [tb.b11, tb.b13, tb.b21, tb.b24], [true, true, true, true]);
  eq("Optional blocks are not complete after a Core-only fill", [tb.b12, tb.b14, tb.b22, tb.b23], [false, false, false, false]);
  const cards = require("@/data/materialIndex").MATERIALS.filter((m) => m.block === "A" && !m.optional);
  const readAll = Object.fromEntries(cards.map((m) => [m.id, true]));
  const done = progress.dossierProgress({ ...p, ui: { ...p.ui, sectionsRead: readAll } }, 1);
  eq("Route 1 ring: Core cards + four Core blocks", [done.done, done.total], [cards.length + 4, cards.length + 4]);
  // a Core answer that differs from the model still exports (CLAUDE.md #38): the three dearest measures, over budget, with a reason each
  const dear = [...meas.MEASURES].sort((a, b) => b.cost - a.cost).slice(0, 3).map((m) => m.id);
  ok("the three dearest measures are over the budget", checks.totalCost(dear) > meas.BUDGET);
  const over = { ...coreOnly, chosen: dear, aims: Object.fromEntries(dear.map((id) => [id, []])), exp: Object.fromEntries(dear.map((id) => [id, 1])), fea: Object.fromEntries(dear.map((id) => [id, 2])), eff: Object.fromEntries(dear.map((id) => [id, 1])), reasons: Object.fromEntries(dear.map((id) => [id, "x".repeat(40)])), order: dear };
  const po = { ...p, l1: over };
  ok("an over-budget, against-the-model choice with reasons leaves nothing missing", missing.l1Missing(po).length === 0);
  ok("without a reason a measure is a named missing item", missing.l1Missing({ ...p, l1: { ...coreOnly, reasons: {} } }).some((m) => m.label.startsWith("Block 2.4:") && /why/.test(m.label)));
}

// --- Worked answers: every reason has a mentor guide and an example (CLAUDE.md #23, #45) ---
for (const id of meas.MODEL_MEASURES) {
  const g = mg.reasonGuide(id);
  ok(`reason guide of ${id} has an answer, a worked example and look-fors`, g.answer.length > 30 && g.example.length > 60 && g.lookFor.length >= 2);
}
ok("the KPI guide carries a worked example on another company", mg.misreadGuide().example.length > 100);
ok("the why guide carries a worked example on another company", mg.whyGuide().example.length > 100);

// --- Route 2: the shown numbers, Core independence, Core-only fill (CLAUDE.md #44, #40, #35, #38) ----------------
{
  const rn = require("@/lib/r2Numbers");
  const ex = require("@/data/route2Extra");
  for (const l of ["en", "de"]) {
    lang.setCurrentLang(l);
    for (const id of r2.ARCH_IDS) {
      const x = ex.ARCH_EXTRA[id];
      ok(`[${l}] item ${id} prints a scene, a metric, a reason and two actions`, x.scene.length > 60 && x.metric.length > 15 && x.reason.length > 10 && x.actions.length >= 2 && x.actions.every((a) => a.text.length > 10 && a.why.length > 30));
      const n = rn.triggerNumber(id);
      ok(`[${l}] trigger number of ${id} lies between today and the aim`, n > Math.min(x.today, x.aim) && n < Math.max(x.today, x.aim), `today ${x.today}, aim ${x.aim}, halfway ${n}`);
      const s0 = rn.triggerSentence(id);
      ok(`[${l}] model trigger of ${id} names a number and a month no later than month ${r2.R2_MONTHS}`, checks.hasNumber(s0) && rn.monthOf(id, rn.modelStart(id)) <= r2.R2_MONTHS, s0);
    }
    for (let i = 0; i < ex.ASSUMPTION_KIT.length; i++) {
      const a = rn.assumptionSign(i);
      ok(`[${l}] assumption ${i + 1} has a sign with a number and a month within the plan`, checks.hasNumber(a.text) && a.month >= 1 && a.month <= r2.R2_MONTHS, a.text);
      ok(`[${l}] assumption ${i + 1} sign rests on a behaviour figure, not a market figure`, ex.ASSUMPTION_KIT[i].kind === "item" || r2.KPI_BY_ID[ex.ASSUMPTION_KIT[i].ref].behaviour);
    }
    const pick = rn.pickupSentence(ex.MODEL_PICKUP);
    ok(`[${l}] the model pickup point names a count and a month`, checks.hasNumber(pick) && rn.paybackCount(ex.MODEL_PICKUP) >= 1, pick);
    ok(`[${l}] the pickup item is one the model plan leaves out`, !r2.MODEL_ARCH.includes(ex.MODEL_PICKUP));
  }
  lang.setCurrentLang("en");
  const mk = r2.MODEL_TRIPWIRE;
  eq("the model tripwire threshold is halfway between today and the aim", [mk.threshold, mk.month <= r2.R2_MONTHS], [rn.tripNumber(mk.kpi), true]);

  // Core never reads Optional (3.1 to 3.4, cards B1 to B4)
  const OPT2 = /Block 3\.[1-4]\b|Materi B[1-4]\b/;
  for (const fn of ["Block35", "Block36"]) ok(`${fn} (Core) names no Optional block or card`, !OPT2.test(fnText("components/task2/Blocks.tsx", fn)));
  const t2 = read("components/task2/Task2.tsx");
  ok("the Route 2 case brief names no Optional block", !OPT2.test(t2.slice(t2.indexOf("function CaseBrief"), t2.indexOf("export function Task2"))));
  ok("the trigger and pickup kits name no Optional block or card", !OPT2.test(read("components/task2/Kits.tsx")));
  ok("Route 2 Optional blocks are 3.1 to 3.4", ["b31", "b32", "b33", "b34"].every((b) => progress.OPTIONAL_BLOCKS.includes(b)) && !progress.OPTIONAL_BLOCKS.includes("b35") && !progress.OPTIONAL_BLOCKS.includes("b36"));
  eq("Optional material cards of Materi B", require("@/data/materialIndex").MATERIALS.filter((m) => m.optional && m.block === "B").map((m) => m.id), ["B1", "B2", "B3", "B4"]);

  // The learner's worked examples differ from the model text (CLAUDE.md #23)
  const guides = [mg.greatestGuide(), mg.postponedGuide(), mg.pickupGuide(), mg.challengeGuide(), ...r2.MODEL_ARCH.map((id) => mg.triggerGuide(id)), ...[0, 1, 2].map((i) => mg.assumptionGuide(i))];
  for (const g of guides) ok(`example of "${g.title}" exists and differs from the answer`, !!g.example && g.example.length > 60 && g.example !== g.answer);

  for (const l of ["en", "de"]) {
    lang.setCurrentLang(l);
    const k = key.KEY_R2();
    // Core-only: the plan and the decision alone make a complete memo; the Optional blocks 3.1 to 3.4 stay empty
    const coreR2 = { ...store.emptyR2(), alloc: k.alloc, start: k.start, owner: k.owner, trigger: k.trigger, postponed: k.postponed, pickup: k.pickup, decision: k.decision, assumptions: k.assumptions, tripKpi: k.tripKpi, tripThreshold: k.tripThreshold, tripMonth: k.tripMonth, tripAction: k.tripAction, challenge: k.challenge };
    const pc = { participant: { name: "Core Only" }, ui: { bannerDismissed: {}, sectionsRead: {}, lang: l }, l1: store.emptyL1(), r2: coreR2 };
    eq(`[${l}] Core-only fill leaves the Route 2 missing list empty`, missing.r2Missing(pc).map((m) => m.label), []);
    // a decision that differs from the model, over the budget, with its reasons, still exports (CLAUDE.md #38)
    const everything = Object.fromEntries(r2.ARCH_IDS.map((id) => [id, true]));
    const startAll = Object.fromEntries(r2.ARCH_IDS.map((id) => [id, 1]));
    const ownerAll = Object.fromEntries(r2.ARCH_IDS.map((id) => [id, r2.OWNER_IDS[0]]));
    const trigAll = Object.fromEntries(r2.ARCH_IDS.map((id) => [id, rn.triggerSentence(id)]));
    const over = { ...coreR2, alloc: everything, start: startAll, owner: ownerAll, trigger: trigAll, decision: "commit" };
    ok(`[${l}] funding everything, over the budget, with the fields filled leaves nothing missing`, missing.r2Missing({ ...pc, r2: over }).length === 0);
    ok(`[${l}] the memo prints the amount over the budget as a fact`, require("@/lib/exportDoc").memoBody({ ...pc, r2: over }).includes(lang.euro(checks.archOver(over))));
    ok(`[${l}] an unanswered Optional block is marked in the memo`, require("@/lib/exportDoc").memoBody(pc).includes(lang.tt("Optional block, not answered.", "Optionaler Block, nicht beantwortet.")));
    ok(`[${l}] without a trigger a funded item is a named missing item`, missing.r2Missing({ ...pc, r2: { ...coreR2, trigger: {} } }).some((m) => m.label.startsWith("Block 3.5:") && /trigger/i.test(m.label)));
  }
  lang.setCurrentLang("en");
}

// --- the mentor fill, in both languages --------------------------------------------
for (const l of ["en", "de"]) {
  lang.setCurrentLang(l);
  const l1 = { ...store.emptyL1(), ...key.KEY_L1(),  };
  const rr = { ...store.emptyR2(), ...key.KEY_R2() };
  const p = { participant: { name: "Mentor Check" }, ui: { bannerDismissed: {}, sectionsRead: {}, lang: l }, l1, r2: rr };
  eq(`[${l}] mentor fill leaves Route 1 missing list empty`, missing.l1Missing(p).map((m) => m.label), []);
  eq(`[${l}] mentor fill leaves Route 2 missing list empty`, missing.r2Missing(p).map((m) => m.label), []);
  const tb = progress.taskBlocks(p);
  eq(`[${l}] every task block complete after the fill`, Object.values(tb).every(Boolean), true);
  eq(`[${l}] model sort all hold`, checks.sortHolds(l1.sort), { holds: 9, placed: 9 });
  eq(`[${l}] model picks all hold`, checks.pickHolds(l1), { holds: 4, total: 4 });
  eq(`[${l}] model insights pass the floor`, checks.insightFlags(l1), []);
  ok(`[${l}] model sentence cites a figure`, checks.citesForecastFigure(l1.meaning));
  eq(`[${l}] model tags all hold`, checks.tagHolds(l1.tags), { holds: 12, placed: 12 });
  eq(`[${l}] model uncertainties all real`, checks.uncHolds(l1.unc), { holds: 4, chosen: 4 });
  eq(`[${l}] model A/B card flags nothing`, checks.abFlagsOf(l1.ab), []);
  const rc = checks.rowChecks(l1);
  eq(`[${l}] model kind rows hold`, [rc.holds, rc.total, rc.flags], [12, 12, []]);
  for (const id of l1.chosen) ok(`[${l}] model problems and measurability hold (${id})`, checks.aimsHold(id, l1.aims[id]) && checks.expHolds(id, l1.exp[id]));
  eq(`[${l}] model order has no inversion`, checks.orderInversions(l1), []);
  eq(`[${l}] model principles hold`, checks.principlesHold(rr), { defs: true, rules: true });
  eq(`[${l}] model sources hold`, checks.sourceHolds(rr), { holds: 8, total: 8 });
  eq(`[${l}] model ratings flag nothing`, checks.ratingFlags(rr), []);
  eq(`[${l}] model decision logic holds`, checks.logicHolds(rr), { holds: 12, total: 12 });
  eq(`[${l}] model architecture holds all rules`, checks.seqRules(rr), { baseline: true, budget: true, explainable: true, hasBaseline: true });
  eq(`[${l}] model tripwire flags nothing`, checks.tripFlagsOf(rr), []);
}
lang.setCurrentLang("en");

console.log(failed ? `\n${failed} check(s) FAILED` : "\nAll checks passed.");
process.exit(failed ? 1 : 0);
