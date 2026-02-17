/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#000000",
        surface: "#0A0A0F",
        primary: {
          DEFAULT: "#F85C3A", // Updated to new Orange
          foreground: "#FFFFFF",
        },
        brand: {
            primary: '#F85C3A',
            black: '#000000',
        },
        secondary: "#888888",
        accent: "#F2F2F2",
        muted: "#1a1a1f",
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', '"JetBrains Mono"', 'monospace'], // Added var
        display: ['var(--font-neue-machina)', '"Space Grotesk"', 'system-ui', 'sans-serif'], // Added var
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'reveal': 'reveal 1.5s cubic-bezier(0.77, 0, 0.175, 1) forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        reveal: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { opacity: '0.4' },
          '100%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
}
