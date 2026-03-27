/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4da6ff',
        background: '#f5f9ff',
        panel: '#ffffff',
        text: '#000000',
      },
    },
  },
  plugins: [],
}
