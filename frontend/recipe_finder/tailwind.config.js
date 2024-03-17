/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        lightBlue: '#3ADBDD',
        darkBlue: '#0279A5',
        lightOrange: '#dba745',
        darkPink: '#D83C5E',
        bgBlue: '#02314F'
      }
    },
    fontFamily: {
      madimi: ["Madimi One", 'sans-serif']
    }
  },
  plugins: [],
}