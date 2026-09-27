import type { Config } from "tailwindcss";

/**
 * Retention Lab tokens — a case file and a ledger. Paper-and-ink neutrals; one
 * amber accent (attention / selection), one teal signal (structure / an OK
 * state, never "correct"), one rust (warning). Colours are never the only
 * channel: every state that uses one also carries a label or a pattern.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}", "./data/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1F2328",
        slate: "#23272D",
        slateHi: "#333A43",
        ash: "#59606A",
        paper: "#FFFEFA",
        canvas: "#F3EFE4",
        mist: "#ECE6D6",
        line: "#D8D1BF",

        accent: "#8A5A0B", // amber, deep enough for AA text and button fills
        accentHi: "#6E4708",
        gold: "#D99A2B", // amber for graphics
        accentSoft: "#FBF0D6",

        signal: "#0F6B6B", // teal — structure, an OK-state
        signalSoft: "#DFEEEB",

        rust: "#A4472A", // warning
        rustSoft: "#F6E3DB",
      },
      fontFamily: {
        sans: ["system-ui", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
      },
      fontSize: {
        display: ["38px", { lineHeight: "44px", fontWeight: "600", letterSpacing: "-0.01em" }],
        h1: ["30px", { lineHeight: "38px", fontWeight: "600", letterSpacing: "-0.01em" }],
        h2: ["22px", { lineHeight: "30px", fontWeight: "600" }],
        h3: ["17px", { lineHeight: "24px", fontWeight: "600" }],
        body: ["15.5px", { lineHeight: "24px" }],
        caption: ["13px", { lineHeight: "19px" }],
        micro: ["11px", { lineHeight: "15px", letterSpacing: "0.05em" }],
      },
      boxShadow: {
        sm: "0 1px 2px rgba(31,35,40,0.06)",
        md: "0 4px 14px rgba(31,35,40,0.08)",
        lg: "0 16px 40px rgba(31,35,40,0.16)",
      },
      maxWidth: { prose: "46rem" },
    },
  },
  plugins: [],
};

export default config;
