import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light surfaces
        bg: "#FFFFFF",
        "bg-section": "#F8F7FF",
        // Dark premium surfaces
        "dark-surface": "#12002E",   // deep dark purple
        "dark-mid": "#1E0A3C",       // dark purple mid
        "dark-light": "#2D1B69",     // dark purple lighter
        // Accents
        violet: {
          DEFAULT: "#7C3AED",
          hover: "#6D28D9",
          light: "#EDE9FE",
          lighter: "#F5F3FF",
          dark: "#5B21B6",
          glow: "#A78BFA",
        },
        // Text
        ink: "#111827",
        "ink-muted": "#6B7280",
        "ink-faint": "#9CA3AF",
        // Borders
        edge: "#E5E7EB",
        "edge-strong": "#D1D5DB",
        // On dark
        "on-dark": "#F5F3FF",
        "on-dark-muted": "#A78BFA",
        "on-dark-faint": "rgba(167,139,250,0.45)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      fontSize: {
        "display": ["4.5rem", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "display-sm": ["3.25rem", { lineHeight: "1.08", letterSpacing: "-0.025em" }],
        "heading": ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.04)",
        "card-hover": "0 4px 20px 0 rgb(124 58 237 / 0.15), 0 2px 8px -2px rgb(0 0 0 / 0.08)",
        "card-lg": "0 8px 32px 0 rgb(0 0 0 / 0.08)",
        violet: "0 4px 24px 0 rgb(124 58 237 / 0.3)",
        "violet-lg": "0 8px 40px 0 rgb(124 58 237 / 0.4)",
        "inner-violet": "inset 0 0 0 1px rgb(124 58 237 / 0.3)",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.65s cubic-bezier(0.16,1,0.3,1) forwards",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "shimmer": "shimmer 2.5s linear infinite",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
