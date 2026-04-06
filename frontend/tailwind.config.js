/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["'Inter'", "'Segoe UI'", "system-ui", "sans-serif"] },
      colors: { accent: "#f97316", dark: "#111827" },
      keyframes: {
        blink:   { "0%,100%": { opacity: "1" }, "50%": { opacity: "0" } },
        fadeIn:  { from: { opacity: "0", transform: "translateY(10px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        pulse2:  { "0%,100%": { opacity: "1" }, "50%": { opacity: ".35" } },
        shimmer: { from: { backgroundPosition: "200% 0" }, to: { backgroundPosition: "-200% 0" } },
        float:   { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-6px)" } },
      },
      animation: {
        blink:   "blink 1s step-end infinite",
        fadeIn:  "fadeIn 0.5s ease both",
        pulse2:  "pulse2 2.5s ease infinite",
        shimmer: "shimmer 1.8s linear infinite",
        spin:    "spin 1s linear infinite",
        float:   "float 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
