/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/*.html"],
  theme: {
    container: { center: true },
    extend: {
      fontFamily: { "sarbaz": "sarbaz" },
      screens: { "xs": "576px" },
    }
  },
  plugins: [
    function ({ addVariant }) {
      addVariant('ch', '& > *');
      addVariant('ch-hover', '& > *:hover');
    }
  ],
}