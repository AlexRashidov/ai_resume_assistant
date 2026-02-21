/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class', // Включаем темную тему через класс
    content: [
        "./app/**/*.{vue,js,ts,jsx,tsx}",
        "./components/**/*.{vue,js,ts,jsx,tsx}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./app.vue",
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}