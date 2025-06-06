/** @type {import('tailwindcss').Config} */
export default {

theme: { // defaults to these values
    patterns: {
        opacities: {
            100: "1",
            80: ".80",
            60: ".60",
            40: ".40",
            20: ".20",
            10: ".10",
            5: ".05",
        },
        sizes: {
            1: "0.25rem",
            2: "0.5rem",
            4: "1rem",
            6: "1.5rem",
            8: "2rem",
            16: "4rem",
            20: "5rem",
            24: "6rem",
            32: "8rem",
        }
    },
  },

  darkMode: ["class"],
  content: [
    "./@/components/**/*.{ts,tsx}",
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
    plugins: [require("tailwindcss-animate"),    require('tailwindcss-bg-patterns'),],
};
