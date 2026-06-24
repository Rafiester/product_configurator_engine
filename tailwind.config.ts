import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        // Pastel Pink Primary Brand
        primary: {
          DEFAULT: "#F9A8D4", // Pastel Pink
          hover: "#F472B6",
          active: "#EC4899",
          soft: "rgba(249,168,212,0.12)",
          dark: "#F472B6",
          darkGlow: "#FBCFE8",
          darkSoft: "rgba(249,168,212,0.12)",
          border: "rgba(249,168,212,0.35)",
        },
        neutral: {
          bg: "#F9FAFB",
          surface: "#FFFFFF",
          border: "#E5E7EB",
          text: "#111827",
          textSecondary: "#6B7280",
        },
        dark: {
          bg: "#0B0F14",
          surface: "#111827",
          surface2: "#1F2937",
          border: "#374151",
          text: "#F9FAFB",
          textSecondary: "#9CA3AF",
          muted: "#6B7280",
        },
      },
    },
  },
  plugins: [forms],
};
export default config;
