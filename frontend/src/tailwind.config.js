/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // tu carpeta de código
  ],
  safelist: [
  'data-[state=active]:bg-primary/90',
  'data-[state=active]:text-white',
  'data-[state=active]:border-primary',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
