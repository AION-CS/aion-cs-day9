"use client";

import { useHydrated, useStore } from "@/store/useStore";
import { tt } from "@/lib/lang";


/** A suggested order, never a lock. Dismissal persists per route; nothing about the page changes either way. */
export function SuggestedOrderBanner({ routeKey, text }: { routeKey: string; text: string }) {
  const hydrated = useHydrated();
  const dismissed = useStore((s) => !!s.ui.bannerDismissed[routeKey]);
  const dismiss = useStore((s) => s.dismissBanner);
  if (!hydrated || dismissed) return null;
  return (
    <div role="note" className="flex items-start gap-3 rounded-xl border border-gold/70 bg-accentSoft p-3.5">
      <p className="min-w-0 flex-1 text-caption text-ink">
        <span className="smallcaps mr-1 text-accent">{tt("Suggested order", "Empfohlene Reihenfolge")}</span>
        {text}
      </p>
      <button type="button" onClick={() => dismiss(routeKey)} className="btn-ghost btn-sm shrink-0">
        {tt("Dismiss", "Ausblenden")}
      </button>
    </div>
  );
}
