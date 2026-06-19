/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f4f5f3',
          100: '#e7e8e3',
          200: '#cdd0c7',
          300: '#a9ad9d',
          400: '#80836f',
          500: '#5f6251',
          600: '#494c3e',
          700: '#3a3d32',
          800: '#26271f',
          900: '#161710',
        },
        masthead: '#1b2a1f',
        wire: '#b8401f',
        parchment: '#f7f4ec',
      },
      fontFamily: {
        display: ['"Source Serif 4"', '"Georgia"', 'serif'],
        body: ['"Inter"', '"Helvetica Neue"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
