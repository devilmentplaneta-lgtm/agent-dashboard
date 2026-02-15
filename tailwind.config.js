/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        apple: {
          blue: '#007AFF',
          green: '#34C759',
          orange: '#FF9500',
          red: '#FF3B30',
          gray: '#8E8E93',
          'gray-light': '#C7C7CC',
          'background': '#F2F2F7',
          'background-dark': '#1C1C1E',
          'card': '#FFFFFF',
          'card-dark': '#2C2C2E',
          'text-primary': '#000000',
          'text-primary-dark': '#FFFFFF',
          'text-secondary': '#3C3C43',
          'text-secondary-dark': '#EBEBF5',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'apple': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'apple-lg': '0 8px 24px rgba(0, 0, 0, 0.12)',
      }
    },
  },
  plugins: [],
}
