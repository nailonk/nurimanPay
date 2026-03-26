/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#A3C585",
        primarySoft: "#A3C58533", // versi transparan
        textMain: "#1F2937",
        textSoft: "#6B7280",
        borderSoft: "#E5E7EB",
        bgSoft: "#F9FAFB",
      },
    }
  }
}