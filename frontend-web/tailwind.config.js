/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.tsx',
    './src/app/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        agro: {
          bg: '#121212',
          panel: '#1D2226',
          panel2: '#242A2F',
          border: '#2F3336',
          text: '#FFFFFF',
          muted: '#B0B3B8',
          dim: '#6F767E',
          green: '#149D7F',
          red: '#E74C3C',
          yellow: '#FBBF24',
          orange: '#F97316',
        },
      },
    },
  },
  plugins: [],
};
