/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1A3263',
          dark: '#0F1F3F',
        },
        steel: {
          DEFAULT: '#547792',
          light: '#6B8FAA',
        },
        cream: {
          DEFAULT: '#EFD2B0',
          light: '#F5E0C8',
          dark: '#E0C29E',
        },
        warmOrange: {
          DEFAULT: '#FFC570',
          light: '#FFD699',
          dark: '#F0AD4E',
        },
      },
      fontFamily: {
        mono: ['"Ubuntu Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      maxWidth: {
        'app': '420px',
      },
      boxShadow: {
        'app': '0 0 40px rgba(26, 50, 99, 0.10)',
        'card': '0 2px 12px rgba(26, 50, 99, 0.06)',
        'card-hover': '0 4px 20px rgba(26, 50, 99, 0.10)',
      },
    },
  },
  plugins: [],
}
