"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { LINE_IDS } from "@/data/ladder";
import type { LevelTag, LineId } from "@/data/ladder";
import { INSIGHT_COUNT } from "@/data/forecast";
import type { Basis, CustId } from "@/data/forecast";
import { PATTERN_IDS, REC_IDS } from "@/data/patterns";
import { emptyAb } from "@/data/patterns";
import type { AbState, PatternId, PatternRow, RecId, UncId } from "@/data/patterns";
import type { MeasureId, ProblemId } from "@/data/measures";
import { SIT_IDS } from "@/data/route2";
import type { ArchId, CompId, DecisionId, KpiId, LogicRow, OwnerId, PrincipleId, Use } from "@/data/route2";
import { KEY_L1, KEY_R2 } from "@/data/mentorKey";
import type { RouteNo } from "@/lib/routes";

export const STORAGE_KEY = "cs-d9-v1";
const HISTORY_CAP = 100;

/** 0 means not chosen yet. */
export type Score = 0 | 1 | 2 | 3;

export type SortMap = Record<LineId, LevelTag | null>;
export type TagMap = Record<RecId, PatternId | null>;
export type InsightRow = { basis: Basis | null; text: string };

/** Route 1 · Levels 1 and 2 — the Real-Time Analysis File. (Field names keep Day 7's; see the data files for what each holds.) */
export type L1State = {
  sort: SortMap;
  sortHistory: SortMap[];
  sortFuture: SortMap[];
  sortChecks: number;
  sortResult: { holds: number; placed: number } | null;
  sortClue: boolean;
  sortReasoning: boolean;
  extraInsight: string;
  meaning: string;
  meaningFlagged: boolean;
  meaningClue: boolean;
  valuable: CustId[];
  churners: CustId[];
  pickResult: { holds: number; total: number } | null;
  pickClue: boolean;
  insights: InsightRow[];
  insFlagged: number[];
  insChecked: boolean;
  insClue: boolean;
  reflect: { interpret: string; causation: string; decider: string };
  tags: TagMap;
  tagHistory: TagMap[];
  tagFuture: TagMap[];
  tagChecks: number;
  tagResult: { holds: number; placed: number } | null;
  tagClue: boolean;
  tagReasoning: boolean;
  unc: UncId[];
  uncResult: { holds: number; chosen: number } | null;
  rows: Record<PatternId, PatternRow>;
  rowResult: { holds: number; total: number } | null;
  rowFlags: string[];
  rowClue: boolean;
  misread: string;
  ab: AbState;
  abFlags: string[];
  abChecked: boolean;
  abClue: boolean;
  chosen: MeasureId[];
  aims: Record<string, ProblemId[]>;
  exp: Record<string, Score>;
  fea: Record<string, Score>;
  eff: Record<string, Score>;
  /** One sentence per chosen measure on why its two judged scores (effect, scalability) are what they are (CLAUDE.md #45). */
  reasons: Record<string, string>;
  measureFlags: string[];
  order: MeasureId[];
  why: string;
  checks: number;
};

/** Route 2 · Level 3 — the Real-Time Management Memo. */
export type R2State = {
  principles: PrincipleId[];
  principleText: Record<string, string>;
  principleFlagged: boolean;
  principleClue: boolean;
  sources: Record<string, Use>;
  sourceResult: { holds: number; total: number } | null;
  sourceClue: boolean;
  comps: CompId[];
  rate: Record<string, Score>;
  rateFlags: string[];
  compResult: { early: number } | null;
  greatest: CompId | null;
  greatestWhy: string;
  logic: Record<string, LogicRow>;
  logicResult: { holds: number; total: number } | null;
  logicClue: boolean;
  alloc: Record<string, boolean>;
  start: Record<string, number | null>;
  owner: Record<string, OwnerId | null>;
  trigger: Record<string, string>;
  postponed: string;
  pickup: string;
  seqResult: { holds: number; total: number } | null;
  seqClue: boolean;
  decision: DecisionId | null;
  decisionFlagged: boolean;
  assumptions: string[];
  tripKpi: KpiId | null;
  tripThreshold: string;
  tripMonth: number | null;
  tripAction: "" | "scale" | "adjust" | "stop";
  tripFlags: string[];
  challenge: string;
  checks: number;
};

export type Persisted = {
  participant: { name: string };
  ui: { bannerDismissed: Record<string, boolean>; sectionsRead: Record<string, boolean>; lang: "en" | "de" };
  l1: L1State;
  r2: R2State;
};

type Session = { mentorUnlocked: boolean; resetCount: number };
type Patch<T> = Partial<T> | ((s: T) => Partial<T>);

type Actions = {
  setParticipant: (patch: Partial<Persisted["participant"]>) => void;
  dismissBanner: (routeKey: string) => void;
  toggleRead: (cardId: string, value?: boolean) => void;
  setLang: (l: "en" | "de") => void;
  patchL1: (p: Patch<L1State>) => void;
  patchR2: (p: Patch<R2State>) => void;
  placeLine: (id: LineId, tag: LevelTag | null) => void;
  undoSort: () => void;
  redoSort: () => void;
  placeTag: (id: RecId, s: PatternId | null) => void;
  undoTags: () => void;
  redoTags: () => void;
  setMentorUnlocked: (v: boolean) => void;
  mentorFill: () => void;
  resetRoute: (route: RouteNo | null) => void;
};

const emptySort = (): SortMap => Object.fromEntries(LINE_IDS.map((id) => [id, null])) as SortMap;
const emptyTags = (): TagMap => Object.fromEntries(REC_IDS.map((id) => [id, null])) as TagMap;

export const emptyL1 = (): L1State => ({
  sort: emptySort(),
  sortHistory: [],
  sortFuture: [],
  sortChecks: 0,
  sortResult: null,
  sortClue: false,
  sortReasoning: false,
  extraInsight: "",
  meaning: "",
  meaningFlagged: false,
  meaningClue: false,
  valuable: [],
  churners: [],
  pickResult: null,
  pickClue: false,
  insights: Array.from({ length: INSIGHT_COUNT }, () => ({ basis: null, text: "" })),
  insFlagged: [],
  insChecked: false,
  insClue: false,
  reflect: { interpret: "", causation: "", decider: "" },
  tags: emptyTags(),
  tagHistory: [],
  tagFuture: [],
  tagChecks: 0,
  tagResult: null,
  tagClue: false,
  tagReasoning: false,
  unc: [],
  uncResult: null,
  rows: Object.fromEntries(PATTERN_IDS.map((p) => [p, { risk: null, meaning: null, measure: null }])) as Record<PatternId, PatternRow>,
  rowResult: null,
  rowFlags: [],
  rowClue: false,
  misread: "",
  ab: emptyAb(),
  abFlags: [],
  abChecked: false,
  abClue: false,
  chosen: [],
  aims: {},
  exp: {},
  fea: {},
  eff: {},
  reasons: {},
  measureFlags: [],
  order: [],
  why: "",
  checks: 0,
});

export const emptyR2 = (): R2State => ({
  principles: [],
  principleText: {},
  principleFlagged: false,
  principleClue: false,
  sources: {},
  sourceResult: null,
  sourceClue: false,
  comps: [],
  rate: {},
  rateFlags: [],
  compResult: null,
  greatest: null,
  greatestWhy: "",
  logic: Object.fromEntries(SIT_IDS.map((s) => [s, { action: null, owner: null }])) as Record<string, LogicRow>,
  logicResult: null,
  logicClue: false,
  alloc: {},
  start: {},
  owner: {},
  trigger: {},
  postponed: "",
  pickup: "",
  seqResult: null,
  seqClue: false,
  decision: null,
  decisionFlagged: false,
  assumptions: ["", "", ""],
  tripKpi: null,
  tripThreshold: "",
  tripMonth: null,
  tripAction: "",
  tripFlags: [],
  challenge: "",
  checks: 0,
});

const emptyPersisted = (): Persisted => ({
  participant: { name: "" },
  ui: { bannerDismissed: {}, sectionsRead: {}, lang: "en" },
  l1: emptyL1(),
  r2: emptyR2(),
});

const pushCapped = <T,>(list: T[], item: T) => [...list, item].slice(-HISTORY_CAP);
const resolve = <T,>(p: Patch<T>, s: T): Partial<T> => (typeof p === "function" ? (p as (x: T) => Partial<T>)(s) : p);
const isPlain = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

/**
 * A deep merge of a saved value onto the defaults: every field an older or partial blob lacks comes from the defaults, a value of the
 * wrong type is dropped, and an empty default array or object takes what was saved (a history, a list of chosen ids).
 */
export function mergeDefaults<T>(base: T, saved: unknown): T {
  if (saved === undefined || saved === null) return base;
  if (Array.isArray(base)) {
    if (!Array.isArray(saved)) return base;
    if (base.length === 0) return saved as T;
    return base.map((b, i) => mergeDefaults(b, saved[i])) as T;
  }
  if (isPlain(base)) {
    if (!isPlain(saved)) return base;
    const keys = Object.keys(base);
    if (keys.length === 0) return { ...saved } as T;
    const out: Record<string, unknown> = { ...(saved as Record<string, unknown>) };
    for (const k of keys) out[k] = mergeDefaults((base as Record<string, unknown>)[k], (saved as Record<string, unknown>)[k]);
    return out as T;
  }
  return typeof saved === typeof base || base === null ? (saved as T) : base;
}

export const useStore = create<Persisted & Session & Actions>()(
  persist(
    (set) => ({
      ...emptyPersisted(),
      mentorUnlocked: false,
      resetCount: 0,

      setParticipant: (patch) => set((s) => ({ participant: { ...s.participant, ...patch } })),
      dismissBanner: (routeKey) => set((s) => ({ ui: { ...s.ui, bannerDismissed: { ...s.ui.bannerDismissed, [routeKey]: true } } })),
      toggleRead: (cardId, value) => set((s) => ({ ui: { ...s.ui, sectionsRead: { ...s.ui.sectionsRead, [cardId]: value ?? !s.ui.sectionsRead[cardId] } } })),
      setLang: (l) => set((s) => ({ ui: { ...s.ui, lang: l } })),

      patchL1: (p) => set((s) => ({ l1: { ...s.l1, ...resolve(p, s.l1) } })),
      patchR2: (p) => set((s) => ({ r2: { ...s.r2, ...resolve(p, s.r2) } })),

      placeLine: (id, tag) =>
        set((s) => {
          const before = s.l1.sort;
          if (before[id] === tag) return {};
          return { l1: { ...s.l1, sort: { ...before, [id]: tag }, sortHistory: pushCapped(s.l1.sortHistory, before), sortFuture: [], sortResult: null } };
        }),
      undoSort: () =>
        set((s) => {
          const prev = s.l1.sortHistory[s.l1.sortHistory.length - 1];
          if (!prev) return {};
          return { l1: { ...s.l1, sort: prev, sortHistory: s.l1.sortHistory.slice(0, -1), sortFuture: pushCapped(s.l1.sortFuture, s.l1.sort), sortResult: null } };
        }),
      redoSort: () =>
        set((s) => {
          const next = s.l1.sortFuture[s.l1.sortFuture.length - 1];
          if (!next) return {};
          return { l1: { ...s.l1, sort: next, sortHistory: pushCapped(s.l1.sortHistory, s.l1.sort), sortFuture: s.l1.sortFuture.slice(0, -1), sortResult: null } };
        }),

      placeTag: (id, sig) =>
        set((s) => {
          const before = s.l1.tags;
          if (before[id] === sig) return {};
          return { l1: { ...s.l1, tags: { ...before, [id]: sig }, tagHistory: pushCapped(s.l1.tagHistory, before), tagFuture: [], tagResult: null } };
        }),
      undoTags: () =>
        set((s) => {
          const prev = s.l1.tagHistory[s.l1.tagHistory.length - 1];
          if (!prev) return {};
          return { l1: { ...s.l1, tags: prev, tagHistory: s.l1.tagHistory.slice(0, -1), tagFuture: pushCapped(s.l1.tagFuture, s.l1.tags), tagResult: null } };
        }),
      redoTags: () =>
        set((s) => {
          const next = s.l1.tagFuture[s.l1.tagFuture.length - 1];
          if (!next) return {};
          return { l1: { ...s.l1, tags: next, tagHistory: pushCapped(s.l1.tagHistory, s.l1.tags), tagFuture: s.l1.tagFuture.slice(0, -1), tagResult: null } };
        }),

      setMentorUnlocked: (v) => set({ mentorUnlocked: v }),

      // Mentor autofill: every model answer in Routes 1 and 2, plus the participant name if it is empty, so each document can be exported straight away.
      mentorFill: () =>
        set((s) => {
          const l1: L1State = { ...emptyL1(), ...KEY_L1() };
          const r2: R2State = { ...emptyR2(), ...KEY_R2() };
          const participant = { name: s.participant.name.trim() ? s.participant.name : "Mentor Check" };
          return { participant, l1, r2, resetCount: s.resetCount + 1 };
        }),

      resetRoute: (route) =>
        set((s) => {
          const prefix = route === 1 ? "A" : route === 2 ? "B" : "";
          const keep = (k: string) => (route === null ? false : !k.startsWith(prefix));
          const sectionsRead = Object.fromEntries(Object.entries(s.ui.sectionsRead).filter(([k]) => keep(k)));
          const bannerDismissed = { ...s.ui.bannerDismissed };
          if (route === null) for (const k of Object.keys(bannerDismissed)) delete bannerDismissed[k];
          else delete bannerDismissed[`r${route}`];
          return {
            l1: route === null || route === 1 ? emptyL1() : s.l1,
            r2: route === null || route === 2 ? emptyR2() : s.r2,
            ui: { bannerDismissed, sectionsRead, lang: s.ui.lang },
            resetCount: s.resetCount + 1,
          };
        }),
    }),
    {
      name: STORAGE_KEY,
      version: 2,
      skipHydration: true,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ participant: s.participant, ui: s.ui, l1: s.l1, r2: s.r2 }),
      // Version 2 (the retrofit of 2026-10-02): the pilot block no longer asks for figures (CLAUDE.md #44), so `fig`, `figFlagged`,
      // `figClue`, `parts` and `partFlags` are dropped from Route 1; each chosen measure gets a `reasons` entry (#45). `merge` then
      // fills every field a version-1 blob lacks from the defaults.
      migrate: (persisted, from) => {
        const p = (persisted ?? {}) as Persisted;
        if (from < 2 && p.l1) {
          const l1 = p.l1 as unknown as Record<string, unknown>;
          for (const k of ["fig", "figFlagged", "figClue", "parts", "partFlags"]) delete l1[k];
        }
        return p;
      },
      merge: (persisted, current) => {
        const merged = mergeDefaults(emptyPersisted(), (persisted ?? {}) as Partial<Persisted>);
        merged.ui.lang = merged.ui.lang === "de" ? "de" : "en";
        return { ...current, ...merged };
      },
    },
  ),
);

export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const unsub = useStore.persist.onFinishHydration(() => setHydrated(true));
    if (useStore.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);
  return hydrated;
}

export function rehydrateStore() {
  return useStore.persist.rehydrate();
}
