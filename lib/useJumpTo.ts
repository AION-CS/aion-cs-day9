"use client";

import { useRouter } from "next/navigation";
import { scrollToAndFlash } from "@/lib/flash";

/**
 * Jump to an element that may live on another route. If it is on this page it
 * scrolls and flashes; otherwise it navigates to `routeHref#id` (client-side, so
 * the persisted store carries over) and <HashFlash/> flashes it on arrival.
 * A soft pointer, never a gate.
 */
export function useJumpTo() {
  const router = useRouter();
  return (id: string, routeHref: string) => {
    if (document.getElementById(id)) scrollToAndFlash(id);
    else router.push(`${routeHref}#${id}`);
  };
}
