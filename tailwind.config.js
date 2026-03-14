/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: '#121212',
        card: '#1E1E1E',
        border: '#2A2A2A',
        primary: '#E50914',
        muted: '#AAAAAA',
      },
    },
  },
  plugins: [],
};
