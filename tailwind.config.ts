import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        vibra: {
          orange:  '#F5A020',
          pink:    '#E8498A',
          purple:  '#5B2D8E',
          blue:    '#4FC3F7',
        },
      },
      backgroundImage: {
        'vibra-gradient': 'linear-gradient(to bottom, #F5A020, #E8498A, #5B2D8E)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        sans:    ['var(--font-body)', 'sans-serif'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':       { transform: 'translateY(-12px)' },
        },
        bounce_slow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':       { transform: 'translateY(8px)' },
        },
      },
      animation: {
        float:        'float 4s ease-in-out infinite',
        float_slow:   'float 6s ease-in-out infinite',
        bounce_slow:  'bounce_slow 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
