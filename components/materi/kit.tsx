"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import clsx from "clsx";
import { glossify } from "@/lib/glossify";
import { tt } from "@/lib/lang";


/** Short bullet list used inside cards. */
export function Bul({ items }: { items: ReactNode[] }) {
  const seen = new Set<string>();
  return (
    <ul className="list-disc space-y-1.5 pl-5 text-body">
      {items.map((it, i) => (
        <li key={i}>{glossify(it, seen)}</li>
      ))}
    </ul>
  );
}

/** A framed figure: the SVG is the teaching instrument, so it gets its own quiet frame and caption. */
export function Diagram({ label, children, caption }: { label: string; children: ReactNode; caption?: ReactNode }) {
  return (
    <figure className="rounded-xl border border-line bg-canvas/50 p-3 md:p-4" aria-label={label}>
      <p className="smallcaps mb-2">{label}</p>
      {children}
      {caption && <figcaption className="mt-2 text-caption text-ash">{glossify(caption)}</figcaption>}
    </figure>
  );
}

/** A row of toggle / scenario buttons. Every one is a real button with a pressed state. */
export function Toggles<T extends string>({
  options,
  value,
  onChange,
  label,
  multi,
}: {
  options: { id: T; label: string }[];
  value: T | T[] | null;
  onChange: (id: T) => void;
  label: string;
  multi?: boolean;
}) {
  const isOn = (id: T) => (Array.isArray(value) ? value.includes(id) : value === id);
  return (
    <div role={multi ? "group" : "radiogroup"} aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={isOn(o.id)}
          onClick={() => onChange(o.id)}
          className={clsx(
            "btn btn-sm min-h-[40px] border",
            isOn(o.id) ? "border-accent bg-accentSoft text-ink" : "border-line bg-paper text-ash hover:border-ash",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Exploratory marker — ungraded and never exported. */
export function Exploratory() {
  return <span className="pill border-line bg-mist text-ash">{tt("Exploratory · not graded", "Explorativ · nicht bewertet")}</span>;
}

/**
 * Always-visible, live-updating reading of what the control above just showed — not the raw
 * value, but what it demonstrates. Place directly under the interactive element it explains.
 */
export function Insight({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p aria-live="polite" className={clsx("insight rounded-md bg-mist px-3 py-2 text-caption text-ink", className)}>
      <span className="smallcaps mr-1.5 text-ash">{tt("What this shows", "Was das zeigt")}</span>
      {glossify(children)}
    </p>
  );
}

/** "The point" (CLAUDE.md #36): the whole lesson of an interactive picture in one to three everyday sentences, always visible. */
export function ThePoint({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-lg border-l-4 border-signal bg-signalSoft px-3 py-2 text-body text-ink">
      <span className="smallcaps mr-1.5 text-signal">{tt("The point", "Das Wichtigste")}</span>
      {glossify(children)}
    </p>
  );
}

/* ------------------------------------------------------------------ CLAUDE.md #36 · "Walk me through it" */

export type StoryStep = {
  /** Three to six words: what this step is about. */
  title: string;
  /** Everyday words, two to four short sentences, numbers computed from the same state that draws the picture. */
  say: ReactNode;
  /** One short line naming what to look at in the picture right now. */
  look?: string;
};

/** A story step that also sets the picture: `apply` calls the diagram's own setters, so the picture is the one the buttons make. */
export type StoryPlan = StoryStep & { apply: () => void };

/**
 * The state of a diagram's story. `go(i)` opens step i and applies it; `leave()` is called by every manual control so the
 * narration never disagrees with the picture.
 */
export function useStory(plan: StoryPlan[]) {
  const [step, setStep] = useState<number | null>(null);
  const go = (i: number | null) => {
    setStep(i);
    if (i !== null) plan[i].apply();
  };
  return { step, go, leave: () => setStep(null), plan };
}

/**
 * A guided walk through an interactive picture: one "Next" press per idea, so a learner can understand it by reading one short
 * paragraph at a time while the picture changes. Controlled by the diagram: `step` is null while the learner explores alone with
 * the diagram's own buttons; the diagram applies each step's state itself (it owns the controls) and moves the spotlight in the
 * picture. The plain sentences here interpret; they never replace the always-visible "What this shows" (#20).
 */
export function Story({ steps, step, onStep }: { steps: StoryStep[]; step: number | null; onStep: (i: number | null) => void }) {
  if (step === null)
    return (
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-gold bg-accentSoft p-3">
        <button type="button" onClick={() => onStep(0)} className="btn btn-sm min-h-[40px] border border-accent bg-paper font-semibold text-ink">
          ▶ {tt("Walk me through it", "Führen Sie mich durch")}
        </button>
        <p className="min-w-[14rem] flex-1 text-caption text-ink">
          {tt(
            `${steps.length} short steps in plain words. The picture changes as you press Next. Or skip this and use the buttons below on your own.`,
            `${steps.length} kurze Schritte in einfachen Worten. Das Bild ändert sich, wenn Sie auf Weiter drücken. Oder überspringen Sie das und nutzen Sie die Schaltflächen unten selbst.`,
          )}
        </p>
      </div>
    );
  const s = steps[step];
  const last = step === steps.length - 1;
  return (
    <section aria-label={tt("Guided walk-through", "Geführter Durchgang")} className="space-y-2.5 rounded-lg border border-gold bg-accentSoft p-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="smallcaps text-accent">
          {tt(`Step ${step + 1} of ${steps.length}`, `Schritt ${step + 1} von ${steps.length}`)} · {s.title}
        </p>
        <button type="button" onClick={() => onStep(null)} className="text-micro font-semibold text-ash underline decoration-dotted underline-offset-2 hover:text-accentHi">
          {tt("Explore on my own", "Selbst ausprobieren")}
        </button>
      </div>
      <div aria-live="polite" className="space-y-1.5 text-body text-ink">
        <p>{glossify(s.say)}</p>
        {s.look && (
          <p className="text-caption text-ash">
            <span aria-hidden>👁 </span>
            {tt("Look at: ", "Schauen Sie auf: ")}
            {s.look}
          </p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => onStep(step - 1)} disabled={step === 0} aria-disabled={step === 0} className="btn btn-sm min-h-[40px] border border-line bg-paper text-ink disabled:opacity-40">
          ◀ {tt("Back", "Zurück")}
        </button>
        <button type="button" onClick={() => onStep(last ? 0 : step + 1)} className="btn btn-sm min-h-[40px] border border-accent bg-paper font-semibold text-ink">
          {last ? tt("Start over", "Von vorn") : tt("Next", "Weiter")} {last ? "↺" : "▶"}
        </button>
        <div className="ml-auto flex items-center gap-1" role="group" aria-label={tt("Jump to a step", "Zu einem Schritt springen")}>
          {steps.map((x, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onStep(i)}
              aria-label={`${tt("Step", "Schritt")} ${i + 1}: ${x.title}`}
              aria-current={i === step}
              className="flex h-10 w-6 items-center justify-center"
            >
              <span className={clsx("block h-2.5 w-2.5 rounded-full border", i === step ? "border-ink bg-ink" : i < step ? "border-signal bg-signal" : "border-ash bg-paper")} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ CLAUDE.md #33 · an embedded video, click to load */

export type Video = {
  title: string;
  /** The channel or speaker, named, so a reference chip could be written for it. */
  channel: string;
  youtubeId: string;
  minutes: number;
  /** Longer than a couple of minutes: marked optional and kept outside the card's own minutes. */
  optional?: boolean;
  /** What this video adds that the card cannot (one sentence). */
  adds: string;
  /** Language of the audio and whether captions exist. */
  lang: string;
};

/**
 * Nothing from YouTube loads except the thumbnail image until the learner presses play; then an iframe on the cookie-reduced
 * youtube-nocookie.com domain replaces it, autoplay off. If the thumbnail cannot load (video removed, or no connection), the block
 * says so and points back to the card, which is complete without the video.
 */
export function Watch({ video }: { video: Video }) {
  const [playing, setPlaying] = useState(false);
  const [broken, setBroken] = useState(false);
  const url = `https://www.youtube.com/watch?v=${video.youtubeId}`;
  return (
    <figure className="rounded-xl border border-line bg-canvas/50 p-3 md:p-4" aria-label={tt("Video", "Video")}>
      <div className="overflow-hidden rounded-lg border border-line bg-ink">
        {playing ? (
          <div className="relative aspect-video w-full">
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?rel=0`}
              title={video.title}
              loading="lazy"
              allow="encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
            />
          </div>
        ) : broken ? (
          <div className="p-4 text-caption text-paper">
            {tt(
              "The video could not be loaded (no connection, or it is no longer available). The card above already covers what it shows.",
              "Das Video konnte nicht geladen werden (keine Verbindung, oder es ist nicht mehr verfügbar). Die Karte oben deckt schon ab, was es zeigt.",
            )}
          </div>
        ) : (
          <button type="button" onClick={() => setPlaying(true)} className="group relative block aspect-video w-full" aria-label={`${tt("Play video", "Video abspielen")}: ${video.title}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`} alt="" className="absolute inset-0 h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100" loading="lazy" onError={() => setBroken(true)} />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-paper text-2xl text-ink shadow">▶</span>
            </span>
          </button>
        )}
      </div>
      <figcaption className="mt-2 space-y-1 text-caption">
        <p className="font-semibold text-ink">{video.title}</p>
        <p className="text-ash">
          {video.channel} · {video.minutes} {tt("min", "Min.")} · {video.lang}{video.optional ? tt(" · optional, outside today's minutes", " · optional, außerhalb der heutigen Minuten") : ""}
        </p>
        <p className="text-ink">{video.adds}</p>
        <p className="text-micro text-ash">
          {tt("Until you press play, only a preview image loads from YouTube; no player and no cookies. ", "Bis Sie auf Abspielen drücken, lädt nur ein Vorschaubild von YouTube; kein Player und keine Cookies. ")}
          <a href={url} target="_blank" rel="noreferrer" className="underline decoration-dotted underline-offset-2 hover:text-accentHi">
            {tt("Open on YouTube", "Auf YouTube öffnen")}
          </a>
        </p>
      </figcaption>
    </figure>
  );
}
