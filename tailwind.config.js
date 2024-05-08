/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        color: {
          main: '#368ACA',
          second: '#0E85C3',
          maintext: '#333'
        },
      },
    },
  },
  plugins: [],
}

