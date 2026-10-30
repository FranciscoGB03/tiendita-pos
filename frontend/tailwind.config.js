/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#C75B39", // Rojo terracota (Botones principales, header)
        secondary: "#E8A838", // Amarillo mostaza (Acentos, highlights)
        background: "#FDF6EC", // Crema cálido (Fondo general, fácil para la vista)
        text: "#3D2817", // Café oscuro (Textos principales, alto contraste)
        success: "#6B8E4E", // Verde aguacate (Confirmaciones, stock OK)
        error: "#D94F3D", // Rojo tomate (Errores, stock bajo)
        neutral: "#8B7D6B", // Gris cálido (Textos secundarios, bordes)
      },
      // Aquí agregaremos los breakpoints personalizados para la Tablet más adelante
    },
  },
  plugins: [],
};
