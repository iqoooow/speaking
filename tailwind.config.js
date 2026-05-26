/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: {
            base: '#0a0f1d',
            dark: '#0e1626',
            light: '#1b253c',
          },
          purple: {
            base: '#7c3aed',
            light: '#a78bfa',
            glow: 'rgba(124, 58, 237, 0.15)',
          },
          gold: {
            base: '#d4af37',
            hover: '#e5c158',
            glow: 'rgba(212, 175, 55, 0.2)',
          },
          neutral: {
            white: '#ffffff',
            grayLight: '#f8fafc',
            grayMed: '#e2e8f0',
            textMuted: '#94a3b8',
          },
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        premium: '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
        goldGlow: '0 0 15px rgba(212, 175, 55, 0.15)',
        purpleGlow: '0 0 15px rgba(124, 58, 237, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out forwards',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulseSlow 3s infinite ease-in-out',
        'glow-pulse': 'glowPulse 2s infinite ease-in-out',
        'soundwave': 'soundwave 1.2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(212, 175, 55, 0.2)', borderColor: 'rgba(212, 175, 55, 0.2)' },
          '50%': { boxShadow: '0 0 15px rgba(212, 175, 55, 0.5)', borderColor: 'rgba(212, 175, 55, 0.6)' },
        },
        soundwave: {
          '0%': { height: '15%' },
          '100%': { height: '100%' },
        }
      }
    },
  },
  plugins: [],
}

