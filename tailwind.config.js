// tailwind.config.js
import typography from '@tailwindcss/typography'
import lineClamp from '@tailwindcss/line-clamp'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1B2A4A',
          light: '#2D4270',
          dark: '#121E35',
        },
        brand: {
          orange: '#F26522',
        },
        'gray-soft': '#F4F6F9',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        arabic: ['Cairo', 'sans-serif'],
      },
    },
  },
  plugins: [
    typography,   // @tailwindcss/typography — prose classes for WP content
  ],
}