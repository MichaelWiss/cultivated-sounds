/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./sections/**/*.liquid",
    "./snippets/**/*.liquid",
    "./layout/**/*.liquid",
    "./templates/**/*.json",
    "./assets/**/*.js",
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
      boxShadow: {
        'brutalist-blue': '4px 4px 0px 0px rgba(26, 35, 219, 1)',
        'brutalist-blue-lg': '12px 12px 0px 0px rgba(26, 35, 219, 1)',
        'brutalist-blue-soft': '4px 4px 0px 0px rgba(26, 35, 219, 0.1)',
        'brutalist-blue-soft-lg': '6px 6px 0px 0px rgba(26, 35, 219, 0.2)',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      }
    },
  },
  plugins: [],
}

