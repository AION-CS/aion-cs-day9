"use client";

import { useEffect } from "react";
import { scrollToAndFlash } from "@/lib/flash";

/** When a page is opened at `#some-id` (a jump from another route), scroll to it and flash it once. */
export function HashFlash() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.replace(/^#/, ""));
    if (!id) return;
    const t = window.setTimeout(() => scrollToAndFlash(id), 500);
    return () => window.clearTimeout(t);
  }, []);
  return null;
}
