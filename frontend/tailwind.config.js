/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: '#0B0F17',
        panel: '#131A26',
        accent: '#22D3EE',
        warn: '#F59E0B',
        danger: '#F87171',
        success: '#34D399',
      },
      borderRadius: {
        lg: '0.75rem',
        xl: '0.875rem',
      },
    },
  },
  plugins: [],
}

