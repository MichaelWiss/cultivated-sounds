/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./theme/**/*.liquid",
    "./theme/**/*.js",
    "./theme/**/*.json",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'vinyl-paper': 'rgb(var(--color-vinyl-paper) / <alpha-value>)',
        'vinyl-blue': 'rgb(var(--color-vinyl-blue) / <alpha-value>)',
        'vinyl-black': 'rgb(var(--color-vinyl-black) / <alpha-value>)',
        'vinyl-red': 'rgb(var(--color-vinyl-red) / <alpha-value>)',
      },
      fontFamily: {
        serif: ['var(--font-heading-family)', 'serif'],
        mono: ['var(--font-mono-family)', 'monospace'],
        sans: ['var(--font-body-family)', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      }
    },
  },
  plugins: [],
}

