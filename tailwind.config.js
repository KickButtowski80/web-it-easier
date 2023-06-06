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
            opacity: 1,
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
            opacity: 1,
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
            width: '6.5rem',
           opacity: 0,
          
          },
              
          '100%': {
            width: '4rem',
            height: '13.25rem',
            transform: 'perspective(200px) rotateY(40deg) ',
            'border-color': 'purple',
            'background-color': 'white',     
            top: '3.90rem', 
            left: '2.95rem',  
            opacity: 1,       
            },
        },
        'open-door-knob':{
          '0%':{},
              
          '100%': {
            width: '0.75rem',
            height: '0.75rem',
            transform: 'perspective(100px) rotateY(70deg)',
            position: 'absolute',
            left: '2.75rem',    
            bottom: '6rem',        
            },
        },
        'slogan':{
          '0%':{
          opacity: 0
          },
          '100%':{
          opacity: 1
          },
        }
      },
      animation: {
        'open-menu': 'open-menu 2s ease-in-out forwards',
        'close-menu': 'close-menu 0.5s ease-in-out forwards',
        'rotate-letter-right': 'rotate-letter-right 3s ease 1s forwards',
        'rotate-letter-left':'rotate-letter-left 3s  ease 1s forwards',
        'appear-door-knob':'appear-door-knob 6s ease 3s forwards',
        'open-door':'open-door 6s ease 4s forwards',
        'open-door-knob':'open-door-knob 6s ease 4s forwards',
        'slogan': 'slogan 3s ease 6s forwards'
      }
    },
  },
  plugins: [],
};
