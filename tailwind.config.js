const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        // Simple 24 column grid
        '24': 'repeat(24, minmax(0, 1fr))',
      },
      gridColumn: {
        'span-14': 'span 14 / span 14',
        'span-24': 'span 24 / span 24',
      },
      screens: {
        'phone': {'max': '1023px'},
      },
      fontFamily: {
        sans: ['FixelDisplay', ...defaultTheme.fontFamily.sans],
      }
    },
    colors: {
      ...colors,
      beeColor: colors.neutral,
      beeDarkColor: colors.neutral,
      beeoclock: {
        primary: {
          DEFAULT: '#FF8A4C',
        }
      },
      'main-hover': '#FFC907'
    }
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}

