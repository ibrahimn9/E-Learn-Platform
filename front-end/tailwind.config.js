/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      backgroundColor: {
        blueState: "#2E86FB"
      },
      textColor: {
        primary: "#00194F",
        secondary: "#FFB256",
        darkGray: "#333333",
        darkGray2: "#4F4F4F",
        gray: "#828282",
        gray4: "#BDBDBD",
        gray5: "#E0E0E0",
        blueState: "#2E86FB"
      },
      borderColor: {
        primary: "#00194F",
        blueState: "#2E86FB"
      },
    },
  },
  plugins: [],
}