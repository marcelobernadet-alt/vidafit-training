import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: "#0B0D0C", // fondo negro/antracita
          soft: "#141615",    // superficie de tarjetas
          border: "#23262A",  // bordes sutiles
        },
        lime: {
          DEFAULT: "#C6FF3D", // verde lima VidaFit
          dark: "#9FDB1E",
        },
        ink: {
          DEFAULT: "#FFFFFF",
          muted: "#A7ADB4",
          faint: "#6B7176",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-inter-tight)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
