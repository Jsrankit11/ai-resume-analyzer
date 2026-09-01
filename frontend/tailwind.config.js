/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '320px',
      'sm': '430px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        coral: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#ff5656',
          600: '#ff4242',
          700: '#e11d48',
          800: '#be123c',
          900: '#9f1239',
        },
        brand: {
          50: '#fff5f5',
          100: '#ffe3e3',
          200: '#ffc9c9',
          300: '#ffa8a8',
          400: '#ff7a7a',
          500: '#ff5656',
          600: '#f03e3e',
          700: '#d63333',
          800: '#b82727',
          900: '#911d1d',
        },
        slate: {
          850: '#151d2e',
          925: '#0b111e',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        serif: ['Lora', 'Merriweather', 'serif'],
      },
    },
  },
  plugins: [],
}
