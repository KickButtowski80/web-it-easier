import { withDirectives } from "vue";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundPosition: {
        "right-bottom": "bottom 50% right 40%",
        'center-top': 'right top 1rem',
      },
      keyframes: {
        "open-menu": {
          "0%": { transform: "scaley(0)" },
          "80%": { transform: "scaley(1.2)" },
          "100%": { transform: "scaley(1)" },
        },
        "close-menu": {
          "0%": { transform: "scaley(1)" },
          "80%": { transform: "scaley(1.2)" },
          "100%": { transform: "scaley(0)" },
        },
        "rotate-letter-right": {
          "0%": {
            "transform-origin": "bottom center",
            opacity: 0,
            transform: "rotate(-90deg)",
          },

          "100%": {
            opacity: 1,
            transform: "rotate(0deg)",
          },
        },
        "rotate-letter-left": {
          "0%": {
            "transform-origin": "bottom center",
            opacity: 0,
            transform: "rotate(90deg)",
          },

          "100%": {
            opacity: 1,
            transform: "rotate(0deg)",
          },
        },
        "appear-door-knob": {
          "0%": {
            opacity: 0,
          },

          "100%": {
            opacity: 1,
          },
        },
        "open-door": {
          "0%": {
            opacity: 0,
          },

          "100%": {
            width: "4rem",
            height: "13.10rem",
            transform: "perspective(200px) rotateY(40deg) translateX(-0.25rem)",
            "border-color": "purple",
            "background-color": "white",
            opacity: 1,
          },
        },
        "open-door-knob": {
          "0%": {},

          "100%": {
            transform: "scale(1) rotateY(70deg) translateZ(-2.25rem)",
          },
        },
        slogan: {
          "0%": {
            opacity: 0,
          },
          "100%": {
            opacity: 1,
          },
        },
        "bg-appears": {
          "0%": {
            opacity: 0,
          },
          "100%": {
            opacity: 1,
          },
        },
        "sun-appears": {
          "0%": {
            opacity: 0,
            "transform-origin": "bottom right",
            transform: " translate(0px,5px) scale(0)",
          },
          "100%": {
            opacity: 1,
            // vertically by a calculated value of 100% - 200px.
            // 100% refers to the full height of the parent container.
            // 200px is subtracted from that height to create the vertical translation.
            // This means the element will be moved up by 200 pixels less than the full
            // height of its parent container.
            transform: "translate(-20px,calc(100% - 90px)) scale(1.75) ",
          },
        },
      },
      animation: {
        "rotate-letter-right": "rotate-letter-right 2s ease 1s forwards",
        "rotate-letter-left": "rotate-letter-left 2s  ease 1s forwards",
        "open-door": "open-door 3s ease 2.5s forwards",
        "open-door-knob": "open-door-knob 3s ease 2.5s forwards",
        slogan: "slogan 3s ease-in-out 3.75s forwards",
        "sun-appears": "sun-appears 5s ease-in-out 3.75s forwards",
        "bg-appears": "bg-appears 5s ease-in-out 3.25s forwards",
      },
    },
  },
  plugins: [],
};
