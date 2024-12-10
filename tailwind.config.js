/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        Poppins: ["Poppins"],
        Gilroy: ["Gilroy"],
      },
      screens: {
        xxs: '390px',
        xs: "475px",
        pantalla: "1080px",
        pantallalg: "1600px",
        pantallapc: "1920px",
  
      },
    },
  },
  plugins: [],
}
