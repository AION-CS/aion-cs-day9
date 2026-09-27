"use client";

import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { MENTOR_PASSCODE } from "@/data/mentorKey";
import { scrollToAndFlash } from "@/lib/flash";
import { useStore } from "@/store/useStore";
import type { RouteNo } from "@/lib/routes";

/**
 * The mentor bar — the very first thing on every page. A mentor enters the
 * passcode once, every model answer is filled in (Routes 1 and 2, plus a
 * participant name if empty), and the notes can be exported at once,
 * so a site can be checked without anyone typing through it.
 *
 * A convenience gate in client code: the passcode ships in plaintext, so this is
 * not security and the UI never claims it is. The unlock flag is session-only.
 */
export function MentorBar() {
  const pathname = usePathname() ?? "";
  const unlocked = useStore((s) => s.mentorUnlocked);
  const setUnlocked = useStore((s) => s.setMentorUnlocked);
  const mentorFill = useStore((s) => s.mentorFill);
  const resetRoute = useStore((s) => s.resetRoute);

  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const route: RouteNo | null = pathname.startsWith("/route-1") ? 1 : pathname.startsWith("/route-2") ? 2 : null;
  const exportId = route === 1 ? "export-l1l2" : route === 2 ? "export-l3" : null;

  const submit = () => {
    if (code === MENTOR_PASSCODE) {
      setUnlocked(true);
      setError(false);
      setCode("");
      setMsg("");
    } else setError(true);
  };

  return (
    <div className="border-b border-line bg-mist print:hidden" role="region" aria-label="Mentor">
      <div className="mx-auto flex min-h-[36px] w-full max-w-[1100px] flex-wrap items-center gap-x-3 gap-y-1 px-4 py-1 md:px-6">
        <span className="smallcaps">Mentor</span>

        {!open && !unlocked && (
          <button
            type="button"
            onClick={() => {
              setOpen(true);
              window.setTimeout(() => inputRef.current?.focus(), 30);
            }}
            className="text-caption text-ash underline decoration-dotted underline-offset-2 hover:text-ink"
          >
            Enter passcode to fill all model answers
          </button>
        )}

        {open && !unlocked && (
          <form
            className="flex flex-wrap items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <label htmlFor="mentor-code" className="sr-only">
              Mentor passcode
            </label>
            <input
              ref={inputRef}
              id="mentor-code"
              type="password"
              autoComplete="off"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError(false);
              }}
              aria-invalid={error}
              aria-describedby="mentor-note"
              placeholder="Passcode"
              className="field !w-40 !py-1"
            />
            <button type="submit" className="btn-primary btn-sm">
              Go
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setCode("");
                setError(false);
              }}
              className="btn-ghost btn-sm"
            >
              Cancel
            </button>
            {error && (
              <span role="alert" className="text-caption text-rust">
                Wrong passcode.
              </span>
            )}
            <span id="mentor-note" className="text-micro normal-case tracking-normal text-ash">
              A convenience gate in client code, not security.
            </span>
          </form>
        )}

        {unlocked && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="btn-primary btn-sm"
              onClick={() => {
                mentorFill();
                setMsg("Model answers filled in Routes 1 and 2. Nothing is left to type; export the documents.");
              }}
            >
              Fill all model answers
            </button>
            {exportId && (
              <button
                type="button"
                className="btn-ghost btn-sm"
                onClick={() => {
                  // Let the fill render before we scroll to the export bar.
                  window.setTimeout(() => scrollToAndFlash(exportId, "ref"), 60);
                }}
              >
                Jump to this route&apos;s export
              </button>
            )}
            <button
              type="button"
              className="btn-ghost btn-sm"
              onClick={() => {
                resetRoute(route);
                setMsg(route ? `Route ${route} cleared.` : "All routes cleared.");
              }}
            >
              {route ? "Clear this route" : "Clear all routes"}
            </button>
            <button
              type="button"
              className="btn-ghost btn-sm"
              onClick={() => {
                setUnlocked(false);
                setOpen(false);
                setMsg("");
              }}
            >
              Lock
            </button>
            <span role="status" className="text-caption text-signal">
              {msg}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
