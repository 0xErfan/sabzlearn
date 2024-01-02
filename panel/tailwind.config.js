/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./public/*.html"],
    theme: {
        container: {
            center: true,
            padding: {
                DEFAULT: "20px",
                "lg" : "10px",
            }
        },
        extend: {
            fontFamily: { "sarbaz": "sarbaz" },
            screens: { "xs": "480px" },
        }
    },
    plugins: [
        function ({ addVariant }) {
            addVariant('ch', '& > *');
            addVariant('ch-hover', '& > *:hover');
        }
    ],
}