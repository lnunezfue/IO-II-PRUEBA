/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        io:{
          100:'#CCD0CF',
          200:'#9BA8AB',
          300:'#4A5C6A',
          400:'#253745',
          500:'#11212D',
          600:'#06141B',
        }
      }
    },
    fontFamily:{
      sans:["Open Sans"]
    },
  },
  plugins: [],
}

