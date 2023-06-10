const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"
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
      }
    },
    colors: {
      beeoclock: {
        primary: {
          DEFAULT: '#FF8A4C',
        }
      }
    }
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

