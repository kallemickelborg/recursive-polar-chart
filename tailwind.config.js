/** @type {import('tailwindcss').Config} */
export default {
  purge: [
    "./node_modules/flowbite-react/lib/**/*.js",
    "./src/**/*.{js,jsx,ts,tsx}",
    "index.html",
  ],
  darkMode: true, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  content: ["./node_modules/flowbite/**/*.js"],
  plugins: [require("flowbite/plugin")],
};
