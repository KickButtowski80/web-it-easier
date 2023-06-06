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
        },
        'appear-door-knob':{
          '0%':{
            opacity:0
          },
              
          '100%': {
            opacity:1
            },
        },
        'open-door':{
          '0%':{
            width: '7rem',
          },
              
          '100%': {
            width: '4rem',
            height: '13.25rem',
            transform: 'skewY(-17deg)',
            'border-color': 'purple',
           'border-bottom': '30px solid transparent',
            'border-Top': '30px solid purple',
            'border-left': '60px solid white',        
            top: '4rem',          
            },
        },
        'open-door-knob':{
          '0%':{
            // width: '7rem',
          },
              
          '100%': {
            width: '0.75rem',
            height: '0.75rem',
            transform: 'skewY(-17deg)',
            position: 'absolute',
            left: '-1.5rem',    
            bottom: '4rem',        
            },
        }
      },
      animation: {
        'open-menu': 'open-menu 2s ease-in-out forwards',
        'close-menu': 'close-menu 0.5s ease-in-out forwards',
        'rotate-letter-right': 'rotate-letter-right 3s ease forwards',
        'rotate-letter-left':'rotate-letter-left 3s ease forwards',
        'appear-door-knob':'appear-door-knob 9s ease forwards',
        'open-door':'open-door 9s ease forwards',
        'open-door-knob':'open-door-knob 9s ease forwards',
      }
    },
  },
  plugins: [],
};
