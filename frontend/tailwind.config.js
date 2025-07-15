/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#06b6d4',
          dark: '#0891b2',
          light: '#67e8f9',
        },
        secondary: {
          DEFAULT: '#10b981',
          dark: '#059669',
        },
        accent: {
          DEFAULT: '#f59e0b',
          dark: '#d97706',
        },
        dark: {
          primary: '#0f172a',
          secondary: '#1e293b',
          tertiary: '#334155',
        },
        text: {
          primary: '#f8fafc',
          secondary: '#cbd5e1',
          muted: '#94a3b8',
          dark: '#1e293b',
        },
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideInRight: {
          '0%': {
            opacity: '0',
            transform: 'translateX(-20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        glow: {
          '0%, 100%': {
            boxShadow: '0 0 20px rgb(6 182 212 / 0.3)',
          },
          '50%': {
            boxShadow: '0 0 30px rgb(6 182 212 / 0.5)',
          },
        },
      },
    },
  },
  plugins: [],
} 