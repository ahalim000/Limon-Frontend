/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
    backgroundImage: {
      'lemon-background': "url('/lemon-background2x-min.png')",
    }
  },
  plugins: [],

}
