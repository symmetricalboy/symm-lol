/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'dancing': ['"Dancing Script"', 'cursive'],
        'sans': ['Inter', 'sans-serif'],
      },
      colors: {
        'nytimes': '#1a1a1a',
        'gemini': '#673ab7',
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'bg-pulse-custom': 'bg-pulse-custom 15s ease-in-out infinite',
        'bg-pulse-simple': 'bg-pulse-simple 5s ease-in-out infinite',
        'bg-gradient-flow': 'bg-gradient-flow 12s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(139, 92, 246, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.8)' },
        },
        'bg-pulse-custom': {
          '0%, 100%': {
            '--tw-gradient-from': '#111827',
            '--tw-gradient-to': '#581c87',
          },
          '50%': {
            '--tw-gradient-from': '#881337',
            '--tw-gradient-to': '#9d174d',
          },
        },
        'bg-pulse-simple': {
          '0%, 100%': { backgroundColor: '#111827' },
          '50%': { backgroundColor: '#220f24' },
        },
        'bg-gradient-flow': {
          '0%, 100%': {
            background: 'linear-gradient(120deg, #111827 0%, #220f24 100%)',
          },
          '50%': {
            background: 'linear-gradient(240deg, #220f24 0%, #111827 100%)',
          },
        },
      },
      boxShadow: {
        'glow': '0 0 15px rgba(139, 92, 246, 0.5)',
        'glow-lg': '0 0 30px rgba(139, 92, 246, 0.7)',
      },
    },
  },
  plugins: [],
} 