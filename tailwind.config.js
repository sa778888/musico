// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './@/components/**/*.{ts,tsx}',  // if you use '@/components'
    './node_modules/@shadcn/ui/**/*.{js,ts,jsx,tsx}', 
  ],
  theme: {
    extend: {
      colors: {
        'spotify-green': '#1DB954',
        'spotify-dark': '#181818',
        'spotify-black': '#121212',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
