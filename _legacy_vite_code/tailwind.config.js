/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: "#166534", // Green-800
                secondary: "#ca8a04", // Yellow-600
                danger: "#dc2626",
            }
        },
    },
    plugins: [],
}
