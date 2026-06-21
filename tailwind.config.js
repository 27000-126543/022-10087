/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        cream: '#FAF7F2',
        bark: '#2D2016',
        coral: '#E8734A',
        mint: '#4CAF82',
      },
      fontFamily: {
        sans: ['Noto Sans SC', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['Noto Serif SC', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
