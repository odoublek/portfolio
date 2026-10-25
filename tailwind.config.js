/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // warm espresso blacks
        ink: {
          950: "#0b0a08",
          900: "#11100d",
          800: "#1a1814",
          700: "#24211c",
        },
        // bone / paper
        bone: {
          DEFAULT: "#ede6da",
          muted: "#a39c90",
          dim: "#6f695f",
        },
        // single signal accent
        ember: {
          DEFAULT: "#ff5b1f",
          soft: "#ff8a5c",
        },
      },
      fontFamily: {
        serif: ['"Instrument Serif"', "Georgia", "serif"],
        sans: ['"Inter Tight"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      keyframes: {
        spin: {
          to: { transform: "rotate(360deg)" },
        },
        steam: {
          "0%": { transform: "translateY(6px) scaleX(1)", opacity: "0" },
          "25%": { opacity: "0.55" },
          "100%": { transform: "translateY(-28px) scaleX(1.6)", opacity: "0" },
        },
      },
      animation: {
        "spin-slow": "spin 18s linear infinite",
        steam: "steam 2.2s ease-out infinite",
      },
    },
  },
  plugins: [],
}
