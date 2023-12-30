/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/*.html"],
  theme: {
    container: { center: true },
    extend: {
      fontFamily: { "sarbaz": "sarbaz" },
      backgroundImage: {
        "company": "url('./public/images/224491-meeting-wallpaper-top-free-meeting-background.jpg')"
      }
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant('ch', '& > *');
      addVariant('ch-hover', '& > *:hover');
    }
  ],
}