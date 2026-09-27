import { euro } from "@/lib/lang";
/**
 * Reads an amount typed in any international format:
 * `159890`, `159,890`, `159.890`, `159.890,00`, `€ 159 890`, `159'890`.
 *
 *  - currency signs and spaces are stripped;
 *  - if both "." and "," appear, the LAST one is the decimal separator;
 *  - a lone "." or "," followed by exactly three digits (and no other
 *    separator) is a thousands separator;
 *  - the same separator appearing more than once is a thousands separator.
 *
 * Returns null when nothing numeric can be read.
 */
export function parseAmount(raw: string): number | null {
  if (typeof raw !== "string") return null;
  let s = raw.replace(/[€$£]|eur|usd|chf/gi, "").replace(/[\s  ']/g, "");
  if (!s) return null;
  let sign = 1;
  if (s.startsWith("-") || s.startsWith("−")) {
    sign = -1;
    s = s.slice(1);
  } else if (s.startsWith("+")) {
    s = s.slice(1);
  }
  if (!/^[\d.,]+$/.test(s) || !/\d/.test(s)) return null;

  const lastDot = s.lastIndexOf(".");
  const lastComma = s.lastIndexOf(",");
  let normalised: string;

  if (lastDot >= 0 && lastComma >= 0) {
    const decimalSep = lastDot > lastComma ? "." : ",";
    const groupSep = decimalSep === "." ? "," : ".";
    normalised = s.split(groupSep).join("").replace(decimalSep, ".");
  } else if (lastDot >= 0 || lastComma >= 0) {
    const sep = lastDot >= 0 ? "." : ",";
    const parts = s.split(sep);
    const tail = parts[parts.length - 1];
    const integerPart = parts[0];
    if (parts.length > 2) {
      // "1.234.567": the same separator repeated can only be grouping.
      normalised = parts.join("");
    } else if (tail.length === 3 && integerPart !== "0" && integerPart !== "") {
      normalised = parts.join("");
    } else {
      normalised = `${integerPart || "0"}.${tail}`;
    }
  } else {
    normalised = s;
  }

  const n = Number(normalised);
  return Number.isFinite(n) ? sign * n : null;
}

/** Every amount-like token inside a sentence, parsed. Used to spot "figures cited". */
export function extractAmounts(text: string): number[] {
  const re = /\d{1,3}(?:[.,  ' ]\d{3})+(?:[.,]\d+)?|\d+(?:[.,]\d+)?/g;
  const out: number[] = [];
  for (const m of text.matchAll(re)) {
    const n = parseAmount(m[0]);
    if (n !== null) out.push(n);
  }
  return out;
}

/** A percentage or a percentage-point gap typed as `42.7`, `42,7 %`, `−32.3 pp`, `-32.3pp`. Null when unreadable. */
export function parsePct(raw: string): number | null {
  if (typeof raw !== "string") return null;
  const s = raw.replace(/percentage\s*points?|pp|%/gi, "").trim();
  return parseAmount(s);
}

export function formatEuro(n: number): string {
  return euro(n);
}
