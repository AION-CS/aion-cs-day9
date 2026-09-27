"use client";

import { Fragment, useEffect } from "react";
import type { ReactNode } from "react";
import { setCurrentLang } from "@/lib/lang";
import type { Lang } from "@/lib/lang";
import { useHydrated, useStore } from "@/store/useStore";

/**
 * The German version of the site (CLAUDE.md #32): English stays the default; the EN | DE switch in the top bar changes every
 * learner-facing text on every page. Common technical terms stay English inside German sentences. One language is active at a
 * time and it is a plain module value (lib/lang.ts), so data files, the export builders and the components all read it the same
 * way. `<LangProvider>` sets it before its children render and remounts them when it changes, so nothing keeps a stale language.
 * Mentor-only tools (the mentor bar, answer keys, worked answers) stay English: they are for the facilitator.
 */
export type { Lang } from "@/lib/lang";
export { getLang, tt, locale, num, d1, euro, euroSigned } from "@/lib/lang";

export function LangProvider({ children }: { children: ReactNode }) {
  const hydrated = useHydrated();
  const stored = useStore((s) => s.ui.lang);
  const lang: Lang = hydrated && stored === "de" ? "de" : "en";
  // Set before the children render (they read it while rendering), and remount them when it changes.
  setCurrentLang(lang);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return <Fragment key={lang}>{children}</Fragment>;
}

/** EN | DE, in the top bar of every page. */
export function LangSwitch({ className }: { className?: string }) {
  const hydrated = useHydrated();
  const stored = useStore((s) => s.ui.lang);
  const setLang = useStore((s) => s.setLang);
  const on = hydrated ? stored : "en";
  return (
    <div role="group" aria-label="Language / Sprache" className={className}>
      {(["en", "de"] as const).map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          aria-pressed={on === l}
          title={l === "en" ? "English" : "Deutsch"}
          onClick={() => setLang(l)}
          className={
            "min-h-[28px] px-2 text-caption font-semibold transition-colors first:rounded-l-full last:rounded-r-full " +
            (on === l ? "bg-gold text-ink" : "text-paper/80 hover:bg-paper/10 hover:text-paper")
          }
        >
          {l === "en" ? "EN" : "DE"}
        </button>
      ))}
    </div>
  );
}
