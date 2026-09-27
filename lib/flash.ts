/**
 * Flash: a 1.2 s outline on an element, cleaned up on `animationend`.
 * "warn" (rust) points at something missing; "ref" (amber) confirms arrival
 * from a material chip. Arriving somewhere you asked to go is not a warning,
 * so the two never share a colour.
 */
export type FlashVariant = "warn" | "ref";

const CLASS: Record<FlashVariant, string> = { warn: "anim-flash-warn", ref: "anim-flash-ref" };

export function flash(el: HTMLElement, variant: FlashVariant = "warn") {
  const cls = CLASS[variant];
  el.classList.remove(CLASS.warn, CLASS.ref);
  void el.offsetWidth; // force reflow so the animation can re-trigger
  el.classList.add(cls);
  const done = () => el.classList.remove(cls);
  el.addEventListener("animationend", done, { once: true });
  window.setTimeout(done, 1400); // safety net when animations are off
}

const FOCUSABLE =
  "button:not([disabled]), [href], input:not([disabled]):not([type='hidden']), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])";

export function focusFirstIn(el: HTMLElement) {
  const target = el.matches(FOCUSABLE) ? el : el.querySelector<HTMLElement>(FOCUSABLE);
  target?.focus({ preventScroll: true });
}

/**
 * Smooth-scroll to `#id`, flash it, and focus the first focusable control inside. `block: "start"` puts
 * the top of a tall section under the sticky bars (its `scroll-margin-top`) instead of centring its middle.
 */
export function scrollToAndFlash(id: string, variant: FlashVariant = "warn", block: ScrollLogicalPosition = "center") {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block });
  flash(el, variant);
  if (variant === "warn") focusFirstIn(el);
}
