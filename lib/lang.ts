/**
 * The active language as a plain module value (no React, no store), so data files, the export builders and the components all
 * read it the same way. `<LangProvider>` (lib/i18n.tsx) sets it before its children render and remounts them when it changes.
 *
 * Two ways to write bilingual text (CLAUDE.md #32: common technical terms stay English, every explanation is German):
 *  - inline, in a component or a function: `tt("English", "Deutsch")`, for a string or for JSX;
 *  - in a data file: `t("English", "Deutsch")` as a field value, and the exported object wrapped in `bi(...)`. `bi` turns every
 *    such field into a getter, so the text follows the language at read time and nothing is frozen at import.
 */
export type Lang = "en" | "de";

let current: Lang = "en";

export const getLang = (): Lang => current;
export const setCurrentLang = (l: Lang) => {
  current = l;
};
export const isDe = () => current === "de";

/** The text of the active language. Works for strings and for JSX. */
export function tt<T>(en: T, de: T): T {
  return current === "de" ? de : en;
}

/* ------------------------------------------------------------------ bilingual data */

const TX = "__tx" as const;
/** A bilingual string inside a data file. Resolved to a plain string by `bi()`. */
export type Tx = { readonly [TX]: true; readonly en: string; readonly de: string };
export const t = (en: string, de: string): Tx => ({ [TX]: true, en, de }) as Tx;
const isTx = (v: unknown): v is Tx => typeof v === "object" && v !== null && (v as Record<string, unknown>)[TX] === true;

/** The type a data structure has once every Tx in it is a string. */
export type Res<T> = T extends Tx
  ? string
  : T extends (...args: never[]) => unknown
    ? T
    : T extends readonly (infer U)[]
      ? Res<U>[]
      : T extends object
        ? { [K in keyof T]: Res<T[K]> }
        : T;

const isPlain = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && Object.getPrototypeOf(v) === Object.prototype;

/**
 * Deep-copies a data structure and turns every `t(en, de)` in it into a getter that returns the active language. Arrays and plain
 * objects are walked; anything else (numbers, functions, strings) is copied as it is.
 */
export function bi<T>(v: T): Res<T> {
  if (Array.isArray(v)) {
    const out: unknown[] = [];
    v.forEach((x, i) => {
      if (isTx(x)) Object.defineProperty(out, i, { get: () => (current === "de" ? x.de : x.en), enumerable: true, configurable: true });
      else out[i] = bi(x);
    });
    return out as Res<T>;
  }
  if (isPlain(v)) {
    const out: Record<string, unknown> = {};
    for (const [k, x] of Object.entries(v)) {
      if (isTx(x)) Object.defineProperty(out, k, { get: () => (current === "de" ? x.de : x.en), enumerable: true, configurable: true });
      else out[k] = bi(x);
    }
    return out as Res<T>;
  }
  if (isTx(v)) return (current === "de" ? v.de : v.en) as Res<T>;
  return v as Res<T>;
}

/* ------------------------------------------------------------------ numbers */

/** The locale for numbers: German writes 1.234,5. */
export const locale = () => (current === "de" ? "de-DE" : "en-US");

/** A number in the active language's format. */
export const num = (n: number, opts?: Intl.NumberFormatOptions) => n.toLocaleString(locale(), opts);

/** One decimal place: 42.7 in English, 42,7 in German. */
export const d1 = (n: number) => num(n, { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/** Euros: €60,000 in English, 60.000 € in German (with a no-break space). A negative amount keeps its sign in front. */
export const euro = (n: number) => {
  const sign = n < 0 ? "−" : "";
  const v = num(Math.abs(Math.round(n)));
  return current === "de" ? `${sign}${v} €` : `${sign}€${v}`;
};

/** Euros with a sign: +€3,416 / −€4,872 in English, +3.416 € / −4.872 € in German. A zero has no sign. */
export const euroSigned = (n: number) => {
  const sign = n < 0 ? "−" : n > 0 ? "+" : "";
  const v = num(Math.abs(Math.round(n)));
  return current === "de" ? `${sign}${v} €` : `${sign}€${v}`;
};

/** Thousands of euros: €56k / 56 T€. */
export const euroK = (n: number) => (current === "de" ? `${num(Math.round(n / 1000))} T€` : `€${num(Math.round(n / 1000))}k`);

/** A percentage: 12% / 12 %. */
export const pct = (n: number, digits = 0) => `${num(n, { minimumFractionDigits: digits, maximumFractionDigits: digits })}${current === "de" ? " %" : "%"}`;

/** An object whose string properties are read lazily, so a value chosen with `tt` follows the language at read time. */
export function lazyRecord<K extends string>(defs: Record<K, () => string>): Record<K, string> {
  const o = {} as Record<K, string>;
  for (const k of Object.keys(defs) as K[]) Object.defineProperty(o, k, { get: defs[k], enumerable: true });
  return o;
}

/** Plural helper for English; German callers pass both forms. */
export const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);
