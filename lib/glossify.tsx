import { Fragment, cloneElement, isValidElement } from "react";
import type { ReactElement, ReactNode } from "react";
import { GLOSS_LOOKUP, GLOSS_LOOKUP_DE, GLOSS_RE, GLOSS_RE_DE } from "@/data/glossary";
import { getLang } from "@/lib/lang";
import { GlossTerm } from "@/components/ui/GlossTerm";

/** Elements whose text must never become a link (already interactive, code, or SVG text). */
const SKIP = new Set(["button", "a", "code", "pre", "svg", "summary", "option", "textarea", "input", "select", "label", "title", "desc", "th", "h1", "h2", "h3", "h4"]);

/** Splits one string into plain text and glossary terms. Each term is linked once per `seen`. */
function splitText(text: string, seen: Set<string>): ReactNode {
  const out: ReactNode[] = [];
  let last = 0;
  let n = 0;
  const de = getLang() === "de";
  for (const m of text.matchAll(de ? GLOSS_RE_DE : GLOSS_RE)) {
    const hit = m[1];
    const found = (de ? GLOSS_LOOKUP_DE : GLOSS_LOOKUP).get(hit.toLowerCase());
    if (!found) continue;
    // An all-capitals form ("ICE", "ALE") must match exactly, so ordinary words are never linked.
    if (found.exact && hit !== found.exact) continue;
    if (seen.has(found.entry.id)) continue;
    seen.add(found.entry.id);
    const start = m.index ?? 0;
    if (start > last) out.push(text.slice(last, start));
    out.push(
      <GlossTerm key={`g${n++}-${found.entry.id}`} id={found.entry.id}>
        {hit}
      </GlossTerm>,
    );
    last = start + hit.length;
  }
  if (out.length === 0) return text;
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/**
 * Turns the technical terms in a piece of JSX into glossary links. It is a pure
 * function of its input (the same on the server and in the browser), and it only
 * walks plain elements and fragments: components that render their own text call
 * glossify themselves. `seen` makes each term a link once per block, so a
 * paragraph is not a wall of underlines.
 */
export function glossify(node: ReactNode, seen: Set<string> = new Set()): ReactNode {
  if (typeof node === "string") return splitText(node, seen);
  if (Array.isArray(node)) {
    return node.map((n, i) => (
      <Fragment key={isValidElement(n) && n.key != null ? n.key : i}>{glossify(n, seen)}</Fragment>
    ));
  }
  if (isValidElement(node)) {
    const el = node as ReactElement<{ children?: ReactNode }>;
    if (el.type === Fragment) return cloneElement(el, undefined, glossify(el.props.children, seen));
    if (typeof el.type === "string") {
      if (SKIP.has(el.type) || el.props.children == null) return el;
      return cloneElement(el, undefined, glossify(el.props.children, seen));
    }
  }
  return node;
}

/** Wrap any prose in <Gloss> to make its technical terms clickable. */
export function Gloss({ children }: { children: ReactNode }) {
  return <>{glossify(children)}</>;
}
