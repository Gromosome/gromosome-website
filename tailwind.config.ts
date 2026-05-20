import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './data/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gromo: {
          50: '#fff7ed',
          100: '#ffedd5',
          300: '#fdba74',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          900: '#431407'
        },
        ink: '#070707'
      },
      boxShadow: {
        glow: '0 0 70px rgba(249,115,22,0.25)'
      }
    }
  },
  plugins: []
};

export default config;
