/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        'open-menu': {
          '0%': { transform: 'scaley(0)' },
          '80%': { transform: 'scaley(1.2)' },
          '100%': { transform: 'scaley(1)' },
        },
        'close-menu': {
          '0%': { transform: 'scaley(1)' },
          '80%': { transform: 'scaley(1.2)' },
          '100%': { transform: 'scaley(0)' },
        },
        'rotate-letter-right': {
          '0%': { 
            'transform-origin': 'bottom center',
            opacity: 0,
            transform: 'rotate(-90deg)'
                 },
     
          '100%': {
             transform:'rotate(0deg)',
             },
        },
        'rotate-letter-left': {
          '0%': { 
            'transform-origin': 'bottom center',
            opacity: 0,
            transform: 'rotate(90deg)'
                 },
     
          '100%': {
             transform:'rotate(0deg)',
             },
        }
      },
      animation: {
        'open-menu': 'open-menu 2s ease-in-out forwards',
        'close-menu': 'close-menu 0.5s ease-in-out forwards',
        'rotate-letter-right': 'rotate-letter-right 1s ease forwards',
        'rotate-letter-left':'rotate-letter-left 1s ease forwards'
      }
    },
  },
  plugins: [],
};
