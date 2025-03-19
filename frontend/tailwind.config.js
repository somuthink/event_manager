/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./@/components/**/*.{ts,tsx}",
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [require("tailwindcss-animate")],
};
