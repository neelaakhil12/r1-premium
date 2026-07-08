/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./assets/js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#D4AF37',       // Luxury Gold
        secondary: '#C89B2A',     // Dark Gold
        accent: '#E8C45C',        // Light Gold
        background: '#0F0F10',    // Matte Black
        'section-bg': '#181818',  // Dark Gray
        'card-bg': '#202020',     // Medium Gray
        'border-color': '#2E2E2E' // Subtle Gold/Gray border
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 4px 20px -2px rgba(212, 175, 55, 0.15)',
        'gold-glow-hover': '0 8px 30px rgba(212, 175, 55, 0.3)',
      }
    },
  },
  plugins: [],
}
