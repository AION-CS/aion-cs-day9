"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { COURSE, ROUTES } from "@/lib/routes";
import { LangSwitch } from "@/lib/i18n";
import { tt } from "@/lib/lang";

/** Persistent top bar: the site name, the two routes and the EN | DE switch. Nothing is locked — every route is always reachable. */
export function TopBar() {
  const pathname = usePathname() ?? "";
  return (
    <header className="sticky top-0 z-40 h-12 bg-slate text-paper print:hidden">
      <div className="mx-auto flex h-full w-full max-w-[1100px] items-center gap-3 px-4 md:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-2 font-semibold">
          <span aria-hidden className="grid h-6 w-6 place-items-center rounded bg-gold text-caption font-black text-ink">
            R
          </span>
          <span className="truncate text-caption md:text-body">{COURSE.site}</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <nav aria-label={tt("Routes", "Routen")}>
            <ol className="flex items-center gap-1">
              {ROUTES.map((r) => {
                const active = pathname.startsWith(`/route-${r.n}`);
                return (
                  <li key={r.n}>
                    <Link
                      href={r.href}
                      aria-current={active ? "page" : undefined}
                      className={clsx(
                        "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-caption font-semibold transition-colors",
                        active ? "bg-gold text-ink" : "text-paper/80 hover:bg-paper/10 hover:text-paper",
                      )}
                    >
                      <span className="tnum">{r.n}</span>
                      <span className="hidden md:inline">{r.short}</span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </nav>
          <LangSwitch className="flex overflow-hidden rounded-full border border-paper/30" />
        </div>
      </div>
    </header>
  );
}
