"use client";

import { useEffect } from "react";
import { rehydrateStore } from "@/store/useStore";

/** Reads localStorage once after mount (the store is created with skipHydration), so SSR and first paint match. */
export function StoreHydrator() {
  useEffect(() => {
    void rehydrateStore();
  }, []);
  return null;
}
