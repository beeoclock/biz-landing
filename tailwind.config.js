const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    fontFamily: {
      'display': ['Poppins', ...defaultTheme.fontFamily.sans]
    },
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
      }
    }
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}

