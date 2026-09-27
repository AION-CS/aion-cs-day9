# Retention Lab · Day 9

**Customer Retention & Buying Behaviour in B2B IT Sales · Module 5, Day 1 of 2.**
*Customer retention in real time: personalisation, automation and optimisation.*
A self-study companion: study material with twelve live instruments, two tasks and two working documents, in **English and German**
(EN | DE in the top bar, `../CLAUDE.md` #32). It carries the shared standards `../CLAUDE.md` #1 to #28, the two-route form of #30
and the German version of #32.

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
| `/route-2/` **Level 3** | **Materi B**: five cards, 60 min (B1 the target vision of a real-time retention system, B2 central interaction points: the decision first, then the tracking, B3 a KPI and optimisation system: four tests, B4 the optimisation loop: roll out, keep testing, stop, B5 deciding under time pressure, and the architecture). **Task 2, Real-Time Management Memo**, assembling beside the questions: 3.1 three principles, 3.2 real-time now / fix the tracking first / not central for eight interaction points, 3.3 three KPIs rated on four tests and the greatest lever, 3.4 roll out / keep testing / stop and who acts for six test results, 3.5 the prioritised implementation architecture, 3.6 the decision under time pressure, three assumptions, the tripwire and the board's challenge. | `2-{name}-day9-l3-real-time-memo.html` |

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
npm run verify:calc  # re-derives every figure and rule, and runs the mentor fill in both languages (123 checks)
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
- `measures.ts`: nine measures with cost and weeks until they take effect. Speed follows from the weeks (≤ 4 → 3, 5–10 → 2, > 10 → 1).
  Chatbot and live chat (27), real-time personalisation (18), KPI dashboard and weekly test routine (18): €115,000.
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
| 3.5 Architecture | B5 (live view first, budget, no black box; owner and trigger tests) | Show the owner test · budget bar · plan sentences · Check (three rules) |
| 3.6 Decision under time pressure | B5 (decision rules, tripwire, premortem) | Baselines printed · Check (wait, activity metric, threshold) |
