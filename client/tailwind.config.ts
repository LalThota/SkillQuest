import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        space: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        brand: {
          navy: '#0A0F1E',
          violet: '#7C3AED',
          gold: '#F59E0B',
          emerald: '#10B981',
          crimson: '#EF4444'
        }
      }
    },
  },
  plugins: [],
} satisfies Config
