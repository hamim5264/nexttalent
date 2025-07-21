// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         primary: '#FFD24C',
//         secondary: '#FFFAEC',
//         textDark: '#333333',
//         textLight: '#555555',
//       },
//     },
//   },
//   plugins: [],
// }
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFD24C',
        secondary: '#FFFAEC',
        textDark: '#333333',
        textLight: '#555555',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
