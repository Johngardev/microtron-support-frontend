/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{html,ts}", // Escanea todos los archivos HTML y TS en src
    ],
    theme: {
      extend: {
        colors: {
          'primary': '#DD0B26', // Color corporativo de Microtron
          'secondary': '#FF6F00',
        }
      },
    },
    plugins: [],
  };