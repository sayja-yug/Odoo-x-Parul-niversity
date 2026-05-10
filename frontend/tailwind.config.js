import forms from '@tailwindcss/forms'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#07111f',
          900: '#0b1730',
          800: '#102045',
        },
        aqua: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
        sand: {
          50: '#fffaf2',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#f59e0b',
        },
      },
      boxShadow: {
        glow: '0 20px 60px rgba(6, 182, 212, 0.18)',
        soft: '0 14px 40px rgba(2, 6, 23, 0.10)',
      },
      backgroundImage: {
        'traveloop-radial': 'radial-gradient(circle at top left, rgba(34, 211, 238, 0.22), transparent 35%), radial-gradient(circle at top right, rgba(245, 158, 11, 0.16), transparent 30%), linear-gradient(180deg, #07111f 0%, #0b1730 55%, #07111f 100%)',
      },
    },
  },
  plugins: [forms],
}
