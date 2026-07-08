import type { Config } from "tailwindcss";

// ─────────────────────────────────────────────────────────────
// MAGHRAJ JEWELLERS — DESIGN TOKENS
// Signature: the "Assay Seal" — a circular hallmark-stamp motif
// used as a recurring signature element across the site (hero,
// section dividers, loading state, badges) — it literalizes the
// brand promise "Trusted Hallmark Gold" instead of using a
// generic gold gradient like every other jewellery site.
//
// Palette:
//   ink       #12100D  near-black warm ink (dark bg / dark text)
//   ivory     #FBF8F1  warm paper ivory (light bg)
//   gold      #A9812E  antique/hallmark gold (primary accent — NOT bright yellow gold)
//   gold-deep #7C5A1E  deep bronze gold (hover/active)
//   maroon    #611F26  Bihar bridal oxblood-maroon (secondary accent)
//   stone     #8A8378  warm grey stone (muted text/borders)
// ─────────────────────────────────────────────────────────────

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        ink: "#12100D",
        ivory: "#FBF8F1",
        gold: {
          DEFAULT: "#A9812E",
          light: "#C9A24B",
          deep: "#7C5A1E",
        },
        maroon: {
          DEFAULT: "#611F26",
          deep: "#43141A",
        },
        stone: {
          DEFAULT: "#8A8378",
          light: "#D9D3C5",
        },
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-manrope)", "sans-serif"],
        caption: ["var(--font-jetbrains)", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      letterSpacing: {
        widest2: "0.28em",
      },
      keyframes: {
        "seal-stamp": {
          "0%": { transform: "scale(1.6) rotate(-8deg)", opacity: "0" },
          "60%": { transform: "scale(0.96) rotate(2deg)", opacity: "1" },
          "100%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
        },
        "fade-up": {
          "0%": { transform: "translateY(24px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "seal-stamp": "seal-stamp 0.7s cubic-bezier(.2,.9,.3,1) forwards",
        "fade-up": "fade-up 0.8s cubic-bezier(.2,.9,.3,1) forwards",
        shimmer: "shimmer 2.5s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
