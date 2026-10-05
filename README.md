# Retention Lab · Day 9

**Customer Retention & Buying Behaviour in B2B IT Sales · Module 5, Day 1 of 2.**
*Customer retention in real time: personalisation, automation and optimisation.*
A self-study companion: study material with twelve live instruments, two tasks and two working documents, in **English and German**
(EN | DE in the top bar, `../CLAUDE.md` #32). It carries the shared standards `../CLAUDE.md` #1 to #28, the two-route form of #30
and the German version of #32 and, since the retrofit of 2026-10-03, #33 to #46 (see “Retrofit” below). Route 2 follows #47 since 2026-10-04 (see “Route 2 redesign” below).

The case company is **LiveConnect IT Services GmbH** (the plan's case study): *high bounce rates, low interaction, measures not
coordinated*, €170,000 and four months. Route 2 puts the learner in the Chief Digital Officer's chair: interaction not coordinated,
responses too slow, measures not measurable, a limited budget (€190,000, Case assumption), four months, an incomplete data situation
and high time pressure.

This repo was bootstrapped from `day8` (chrome, primitives, store pattern, tokens, the language machinery) and its content was
replaced. Nothing of AIConnect remains in the visible content; several data identifiers keep Day 8's (and Day 7's) names (e.g.
`CUSTOMERS` holds the eight website moments, `PILOT` the requests by speed of answer), and each file's header comment says what they
hold now.

> **Before you push:** this folder has a fresh local `git init` and no remote. Create the `aion-cs-day9` repository and set the
> remote first (`../CLAUDE.md` #17). Nothing was committed or pushed.

## Routes

| Route | Content | Export |
|---|---|---|
| `/route-1/` **Levels 1 + 2** | **Materi A**: seven cards, 60 min (A1 why real time matters: what a delay costs, A2 personalisation in the moment: value or intrusion, A3 where to respond at once: chatbots, callbacks, social media and adaptive content, A4 what speed is worth: closing rate, lift and extra revenue, A5 KPIs in real time: outcome, driver, guardrail, vanity, A6 A/B testing in digital channels and feedback loops, A7 effect × speed × scalability). **Task 1, Real-Time Retention**: *Part 1 · Understand the real-time effect:* 1.1 tag nine ideas as respond, personalise or learn and name one real-time opportunity, 1.2 what speed is worth (F1–F3 and a sentence), 1.3 two moments to respond at once, two to personalise, three concrete improvements, 1.4 coaching reflection. *Part 2 · Make it measurable and choose:* 2.1 tag twelve real-time metrics by kind, 2.2 link to value, meaning and use per kind, uncertainties, your three KPIs, 2.3 design a fair A/B test of a chat on the pricing page, 2.4 choose, score and order three measures. | `1-{name}-day9-l1l2-real-time-file.html` |
| `/route-2/` **Level 3** | **Materi B**: five cards, 60 min (B1 the target vision of a real-time retention system, B2 central interaction points: the decision first, then the tracking, B3 a KPI and optimisation system: four tests, B4 the optimisation loop: roll out, keep testing, stop, B5 deciding under time pressure, and the architecture). **Task 2, Real-Time Management Memo**, one decision frame (#47): a live control panel, **Step A** (Block 3.5, the architecture: each of eight items Now / After data is ready / Not now, a two-sentence vision, what the plan gives and what it costs) and **Step B** (Block 3.6, the decision under time pressure, why, what you will watch and when you would stop), then four folded Optional blocks, “Go deeper”: 3.1 three principles, 3.2 real-time now / fix the tracking first / not central for eight interaction points, 3.3 three KPIs rated on four tests and the greatest lever, 3.4 roll out / keep testing / stop and who acts for six test results. The memo assembles below the answers. | `2-{name}-day9-l3-real-time-memo.html` |

Minutes: Materi A 60 + Task 1 65, Materi B 60 + Task 2 50. All in `lib/routes.ts`.

## German version (CLAUDE.md #32)

Same machinery as Days 5–8: `lib/lang.ts`, `lib/i18n.tsx`, `ui.lang` in the persisted store. Common terms stay English in German
sentences (Response Time, Bounce Rate, Lift, Uplift, KPI, Guardrail, Vanity Metric, Chatbot, Live-Chat, Social Media, Tracking, Rollout,
Owner, Tripwire…); explanations are German, formal "Sie". Where German practitioners use the German word, the German word is used and
the glossary entry says so (Echtzeit, Abschlussquote, Antwortzeit, Rückruf, Feedbackschleife, Interaktionspunkt). Mentor tools stay
English; file names and the deliverable names stay English.

## Stack

Next.js 14 App Router · TypeScript strict · Tailwind (CS tokens) · Zustand + `persist` (key `cs-d9-v1`, version 1, `skipHydration` +
`StoreHydrator`, deep `mergeDefaults`) · static export. No animation, drag-and-drop, PDF or chart library.

```bash
npm install
npm run dev          # http://localhost:3000 (the parent launch config uses port 3009)
npm run typecheck
npm run verify:calc  # re-derives every figure and rule, and runs the mentor fill in both languages (295 checks)
npm run build        # writes the static site to out/  (stop `npm run dev` first)
```

## What is in the data

- `ladder.ts`: nine real-time ideas (3 respond faster, 3 personalise the moment, 3 learn and adjust) with tests, pair tests, clue,
  reason and rejected kinds.
- `forecast.ts`: last quarter's quote requests by speed of answer (Case assumption). Closing rate = deals ÷ requests × 100; lift = fast
  rate ÷ slow rate; extra revenue = requests a year × (fast − slow rate, as a share) × deal value. 72 ÷ 300 = **F1 24%**; 24 ÷ 8 =
  **F2 3**; 1,600 × 0.16 × €1,500 = **F3 €384,000**. Worked example of A4 (Neckar Hosting): 20%, 10%, 2, €100,000. Also the eight
  website moments of 1.3 (respond at once: pricing page, quote form; personalise: customer portal, hospital campaign landing page;
  traps: the busy home page and blog, and the plan comparison page, a decision page where only 38% leave).
- `patterns.ts`: four kinds of metric with tests and pair tests; twelve real-time metrics (3 each; moved with value: outcome 3, driver 2,
  guardrail 1, vanity 0); the link rule; meaning and use per kind; seven uncertainties (four real); the A/B test card (four parts, one
  fair option each, plus hypothesis and decision rule).
- `measures.ts`: six measures (2026-10-05, was nine). Each price is the sum of printed parts (tool set-up, a licence for four months, staff hours × €80); weeks until it works. Speed follows from the weeks (≤ 4 → 3, 5–10 → 2, > 10 → 1).
  Chatbot and live chat (€44,000, 27), real-time personalisation (€56,000, 18), KPI dashboard and weekly test routine (€32,000, 18): €132,000 of €170,000. Traps: discount pop-up (€40,000, fast, answers no problem), callback (€65,000, grows only with people), relaunch (€110,000, 16 weeks, no time to work; with the chat and dashboard €16,000 over).
  Block 2.4 no longer asks which problems each measure answers: `PlanPicture` shows it (a problem is lit only if a chosen measure answers it and has working time left inside the 16 weeks) plus a 16-week bar per measure. Persist version 4 drops the removed measures from old blobs.
- `route2.ts`: six principles, eight interaction points (rule: does the customer decide there? is ≥ 80% tracked?), eight KPI candidates
  with printed facts and limits, six test results (rule: uplift ≥ 10% and ≥ 100 conversions → roll out; uplift ≥ 3% → keep testing;
  else stop), eight architecture items (model €180,000 of €190,000; the all-in-one experience platform is a black box, the relaunch
  too slow), owners, triggers, three decisions, KPIs and the board's month-2 challenge.

## Mentor bar

The first element on every page. Enter `muchson123` once and every model answer of Routes 1 and 2 fills in (plus a participant name if
empty and every calculator part), so each export downloads straight away. The same unlock shows the answer keys (1.1, 1.3 picks, 2.1,
2.2 rows and uncertainties, 2.3 test card, 2.4 measures and order, 3.1–3.6) and a worked answer for every other question (F1–F3 as
step tables with pitfalls, every free text with what to look for). Client-side convenience gate, not security; a reload locks it.

## Notes on deviations from the brief and the shared rules

1. **Two routes (CLAUDE.md #30).** The plan's Level 1 Task 1 (why speed is a success factor, where delays occur, real-time
   opportunities), Level 1 Task 2 (when personalisation is value and when it is intrusive, which measures work immediately) and the
   Level 2 case study (LiveConnect: real-time interaction potential, where to respond and personalise, a KPI system, a test concept,
   prioritised measures) run on one company. Mapping: opportunities and levers 1.1; what speed is worth 1.2; where to respond and
   personalise, three concrete improvements 1.3; KPIs 2.1–2.2; testing and feedback loop 2.3; prioritisation 2.4. The coaching focus
   (speed as a success factor, personalisation as value, how a decision-maker prioritises) is Block 1.4. The Level 3 transfer project's
   five items are 3.1 to 3.5; the additional requirement (a decision under high time pressure with incomplete data) is 3.6.
2. **The evaluation is "Effect × Speed × Scalability"** in Block 2.4, because the day is about real time and the plan asks which
   measures work immediately. Speed is derived from the printed weeks until a measure takes effect, so it can be checked; effect and
   scalability are judged.
3. **Task 1 is 65 minutes** (the A/B test card is its own block, as on Day 8).
4. **Every figure beyond the brief is a Case assumption**: the ideas, the request figures by speed, the website moments, the metrics,
   the costs and weeks, the Route 2 budget (€190,000), the tracking shares, the uplifts, the KPI baselines and the board's challenge.
   The brief gives €170,000 and four months.
5. **German by the user's standing request (#32)**; English stays the default.
6. **Not built as a Friday capstone (#29)**: the request did not name Day 9 as a Friday.
7. **The plausible-range band in A6** is a standard normal approximation, shown only to make the effect of sample size visible; no task
   asks for it.
8. **Sources to re-check before teaching:** citations are given by their usual details; page ranges and editions differ between
   printings. The request, closing-rate and uplift figures are illustrations, not research findings (Oldroyd et al. 2011 is cited for
   the direction of the effect only).

## Coverage: where each task block is taught

| Block | Taught in | Help while answering |
|---|---|---|
| 1.1 Respond, personalise, learn | A1, A2, A3, A6 (tests, pair tests, worked sort) | Show the test questions · Check + clue · reasoning after two checks · undo/redo |
| 1.2 What speed is worth | A4 (the four steps on Neckar) | Show where the numbers are · Show the formula + calculator · per-part clues |
| 1.3 Where to respond and personalise, improvements | A3 (decision × leaving × what we know rule), A2 | Check (picks as a count, improvements floor) + clue |
| 1.4 Coaching reflection | A1, A2, A7 | Worked answers for the mentor |
| 2.1 Tag the metrics | A5 (four kinds, pair tests, KPI tree) | Show the test questions · Check + clue · reasoning after two checks · undo/redo |
| 2.2 Link, meaning, use; KPIs | A5, A6 (link rule, uses, uncertainties) | Your tally · Check per row with clues · Check my choices |
| 2.3 A fair A/B test | A6 (test card, sample size, feedback loop) | Check per part with clue · hypothesis and rule floors |
| 2.4 Measures, scores, order | A7 (matching problems, speed rule, budget) | Show the test questions · budget bar · problem coverage · Check · order check |
| 3.1 Principles | B1 | Check (live view and response standards) + clue |
| 3.2 Interaction points | B2 (decision first, 80% tracking rule) | Show the test questions · Check (count) + clue |
| 3.3 KPI system | B3 (four tests, limits from printed facts) | Show the test questions · Check (limits, early count) |
| 3.4 Roll out, keep testing, stop | B4 (uplift and conversions rule, owners) | Show the test questions · Check (count) + clue |
| 3.5 Step A · Architecture | B5 (the order: base, people, data, engines; four tests; the time test) | The live panel (diagram, three bars, four tests on request, “what to change” reading) · numbers today printed in the brief |
| 3.6 Step B · Decision under time pressure | B5 (decide now, in stages, watch one figure, say when you stop) | The decision's reading and plain hint · the watch sentence's clue kit |

## Retrofit of 2026-10-03 (the user's request: bring Days 8 to 12 up to the current rules, Route 1 first, decide without asking)

Applied from `../CLAUDE.md`: #33 to #46. Route 1 was done first, Route 2 second. Nothing was committed or pushed.

**Core and Optional (#35, #40, #44).** Route 1 has **four Core blocks** (1.1, 1.3, 2.1, 2.4; 40 min of the 64) and four Optional blocks, folded and never removed
(1.2, 1.4, 2.2, 2.3). Route 2 has **two Core blocks** (3.5, 3.6; 19 min of the 50) and
four Optional blocks (3.1, 3.2, 3.3, 3.4). Optional cards: A4, A6, B1, B2, B3, B4; every other card is Core because a Core block cites it. The ring, the page map
and both missing lists count Core only; an unanswered Optional block is marked as such in the exported file.

**What changed in Route 1.** Block 1.2 is read-only (the two close rates are printed, nothing is calculated, #44) and Optional; the three KPIs moved into Block 2.1;
Block 2.4 names a category for every measure, asks for a reason for each judged score, and shows the budget as a hint (#45, #38). Every measure and every
contact situation prints a scene and who does what (#46). Every interactive picture opens with “The point” and a three-step story (#36); long text sits behind
“＋ Show …” (#37); every free-text field has a clue kit and an example answer (#42, #23); two live rust notices (#34); the page map shows Core / Optional (#28).

**What changed in Route 2 (superseded on 2026-10-04 by the redesign below).** The live memo moved to the bottom with “Hide the memo” (#39); Blocks 3.1 to 3.4 became folded Optional blocks; the trigger, pickup, assumption and tripwire kits of this first pass were replaced by the panel.

**Shared mechanics.** `cs-d9-v1` persists at version 3 with a pure `migratePersisted` and a deep merge (#9); `npm run verify:calc` runs 310 checks (figures and rules, the panel's bars, tests and categories, the mentor fill and a
Core-only fill in both languages, #40 scans of the Core blocks, old version-2 blob).

### Notes on deviations (retrofit)

R1. **No video was embedded (#33).** None was searched and verified in this pass; a card without a video is not a defect (#33). The video slot stays empty (`data/videos.ts`).
R2. **No calculators (#44).** The plan names no calculation beyond the printed rates, the budget and the score formula, so the former F1–F3 calculators and “Show the formula” helps
    of Block 1.2 were removed; wherever older text above mentions them, it is superseded.
R3. **Route 1 has at most four Core blocks and Route 2 two** (user decision, #35); everything else is folded, not removed.
R4. **Model answers use only printed numbers.** The mentor's KPI answer uses aims such as “up” or “stay under a limit”; the panel's bars and the memo's figures are computed from the printed costs, weeks, data shares and the budget, so each number can be found on the screen.
R5. **The Word documents (#31) were not rebuilt** in this pass and are out of date for Day 9: Core / Optional marks, “The point”, the shown numbers and the new case-brief table are missing. Rebuild them from the reviewed Markdown in `../materi-task-docx/_source/` when wanted.
R6. **German and English** are written by hand next to each other for every new text (#32); the glossary got “cost of waiting” and “halfway between today and the aim”.
R7. **Plan mapping (#44).** The plan's numbered task items and the Level 3 requirements are mapped in note 1 above; Core is drawn from them: Route 1's Core blocks answer the Task 1 items (the first tagging and the situations or opportunities) and the case study's KPI and measures items; Route 2's Core blocks are the implementation requirement (3.5) and the additional decision requirement (3.6).

### Dependency checklist (#40)

✓ = reads only Core blocks, Core cards and the case brief. An Optional item may read a Core answer; nothing reads an Optional item back.

| Item | Status | Reads from | Core-safe |
|---|---|---|---|
| **Route 1** | | | |
| 1.1 Respond, personalise or learn? | **Core** | the brief, the block's own printed items, cards A1, A2, A3 | ✓ |
| 1.2 Read the speed figures: two closing rates side by side | Optional | the brief, the block's own printed items, cards A4 | self-contained |
| 1.3 Where to respond at once, where to personalise, and three improvements | **Core** | the brief, the block's own printed items, cards A3 | ✓ |
| 1.4 Coaching reflection: from Level 1 to Level 2 | Optional | the brief, the block's own printed items, cards A1, A2, A3 | self-contained |
| 2.1 Tag LiveConnect's twelve metrics by kind, and name your three KPIs | **Core** | the brief, the block's own printed items, cards A5 | ✓ |
| 2.2 What each kind of metric is worth, and the uncertainties in measuring | Optional | the brief, the block's own printed items, cards A5, A6 | self-contained |
| 2.3 Design a fair A/B test | Optional | the brief, the block's own printed items, cards A6 | self-contained |
| 2.4 Choose three measures, score them, put them in order | **Core** | the brief, the block's own printed items, cards A7 | ✓ |
| **Route 2** | | | |
| Case brief and “Where Route 1 left off” | — | Route 1 Core Block 2.4 (measures chosen), “the numbers today” | ✓ |
| Control panel (diagram, bars, tests) | Core | printed item facts, “the numbers today”, card B5 | ✓ |
| 3.1 The target vision of a real-time retention system | Optional | its own printed items, cards B1 | self-contained |
| 3.2 Definition of central interaction points | Optional | its own printed items, cards B2 | self-contained |
| 3.3 A KPI and optimisation system | Optional | its own printed items, cards B3 | self-contained |
| 3.4 Automation and personalisation measures, tested: roll out, keep testing or stop | Optional | its own printed items, cards B4 | self-contained |
| 3.5 Step A: the prioritised implementation architecture | **Core** | the panel, printed item cards, “the numbers today”, card B5 | ✓ |
| 3.6 Step B: a decision under time pressure and uncertain data | **Core** | own plan from Step A (quoted in the block), the panel's readings, “the numbers today”, card B5 | ✓ |
| **Cards** | | | |
| A1, A2, A3, A5, A7, B5 | Core | each other and the case | ✓ |
| A4, A6, B1, B2, B3, B4 | Optional | — | no Core block cites them |

## Route 2 redesign (CLAUDE.md #47, applied 2026-10-04; reference: `../day8/ROUTE2-REDESIGN.md`)

The user added rule #47 (from Day 8) and asked for Day 9 to follow it. Route 2 is one decision frame with a live control panel; nothing of Day 8's AI content is reused, only the form.

```
Materi B (five cards, 60 min; B5 rewritten: how an architecture is built)
Case brief + “the numbers today” (cost, weeks, data ready, the KPI each item moves)
Control panel · eight item cards · diagram with links that can break · three bars · four tests on request · a reading in plain words
Step A  (Core, 3.5)   each item Now / After data is ready / Not now · vision (two sentences) · what my plan gives and what I give up
Step B  (Core, 3.6)   decide now, in stages / wait / launch everything · why · what I will watch and when I would stop
Go deeper (Optional, folded): 3.1 · 3.2 · 3.3 · 3.4   (self-contained, never read by the frame)
Memo (bottom, full width, Hide) → Export
```

**Plan mapping (#44).** Day 9's Level 3 transfer project asks for: the target vision (Step A's vision box), the central interaction points (the panel's top band
and the item cards; the full exercise is Optional 3.2), measures (the three tiers), a KPI and optimisation system (the live view and KPI system as the base,
the **Measurable** bar, and Step B's watch sentence), a prioritised implementation architecture (Step A) and the additional requirement, a decision under high
time pressure with incomplete data (Step B and the data switch “15 points weaker”). The optimisation process is Optional 3.4 and the stop condition in Step B's
watch sentence. The plan asks for no calculation beyond the printed budget, so the learner derives no number: the bars are computed and shown.

**The panel.** Eight items: the live view and KPI system (the base), the chatbot and live chat, real-time personalisation (the engines), response standards and routing,
real-time selling training (the people), the tracking and consent clean-up (the data), the all-in-one AI platform and the website relaunch (no KPI named, built last).
A solid teal link works; a dashed amber link says in words why it does not (an engine not measured, measured only after it starts, tracking used as it is). Three bars:
**Budget** (€190,000, four months), **Measurable** (money on items that are measured, whose data is ready and that are in use within four months) and **Risk** (money on a
black box, on data below 80% when the item starts, or on an item in use only after the four months). Measurable and Risk are shown as ranges across the two data
scenarios (the brief's data, and 15 points weaker). **Time** is derived: month in use = start month + weeks ÷ 4, rounded up; After data starts when the clean-up is in use.
Four tests, hidden until asked: measurement comes first; every funded item has a purpose; data is ready when an engine starts; it fits the budget and the four months.
Each open test gives the fact, the rule and two ways to act, never a question.

**Categories (mentor only).** The reading's wording follows three internal categories (1 safe, 2 fair, 3 clearly wrong). Only the unlocked mentor sees them
(`MentorCategory`); they are never exported, never printed and never block (#38). A learner who builds the model set (live view and KPI system, chat, response standards,
training, clean-up all Now; personalisation After data; platform and relaunch Not now) reads that every test holds; anything else reads what to change to get there.

**What was removed from the first pass.** Start months, owners, triggers, the pickup point, three assumptions, the tripwire and the board's challenge (the plan names none of them),
the three-method numbers kit (`lib/r2Numbers.ts`) and `SentenceKit`. B5's worked example is now a small panel on another company (Elster Digital).

**Missing (#34, #38).** Only an empty field, a too-short reason, or no item Now. Labels start “Step A:” / “Step B:”. Going over the budget, an engine on thin data or a decision that
disagrees with Step A is a reading and a plain hint, never a missing item; the memo prints the choice, the amount over the budget and the reasons as plain facts.

### Notes on deviations (redesign)

P1. **The panel is AI-free.** Day 8's panel has an A/B routine and a pricing engine; Day 9 has neither. Measurement means the live view and KPI system only, and the tracking clean-up
    is the “after data” prerequisite of personalisation. The chat's data (85%) is above the 80% bar; personalisation's (50%) is below it, so it is the item the clean-up gates.
P2. **Time pressure sits inside the two bars** through the `late` flag (an item in use after month 4 counts as Risk and not as Measurable), not as a fourth bar.
P3. **Persist version 3.** The funded items of a version-2 blob become “now”; the removed fields are dropped; a deep merge fills the new ones. Tested in `verify:calc` and in the browser from an old-shape blob.
P4. **Word documents** (#31) for Route 2 are stale (they describe the old 3.5 and 3.6) and were not rebuilt.
P5. **Verified:** `tsc`, `verify:calc` (310 checks), a production build in a scratch copy served as a static export: clean `localStorage`, the panel with the model set (180,000 €; 69% / 47% Measurable; 0% / 22% Risk; 4 of 4 tests, 3 of 4 with weaker data), mentor fill, memo, DE, 390 px (no horizontal scroll), old blob, no console errors. A page-by-page screenshot review was not possible (the preview pane stopped painting); layout was checked through the DOM.
