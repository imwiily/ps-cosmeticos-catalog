/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      // Paleta de cores personalizadas para cosméticos
      colors: {
        // Cores principais da marca
        primary: {
          50: '#fef7f0',
          100: '#fceee0',
          200: '#f8d9b8',
          300: '#f3c088',
          400: '#ec9d56',
          500: '#e67e22', // cor principal
          600: '#d35400',
          700: '#b7471a',
          800: '#92421b',
          900: '#763a1a',
        },
        // Rosa para cosméticos
        beauty: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899', // rosa vibrante
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        // Dourado luxuoso
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b', // dourado principal
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Tons nude/bege
        nude: {
          50: '#faf9f7',
          100: '#f3f1ed',
          200: '#e6e1d7',
          300: '#d4cbb7',
          400: '#c2b490',
          500: '#b09c6a', // nude médio
          600: '#9a8353',
          700: '#7d6b43',
          800: '#665638',
          900: '#54472f',
        },
        // Verde para skincare natural
        natural: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e', // verde natural
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        }
      },
      
      // Fontes personalizadas
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
      },
      
      // Espaçamentos customizados
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      
      // Sombras customizadas para produtos
      boxShadow: {
        'product': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'product-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 20px rgba(236, 72, 153, 0.3)',
        'soft': '0 2px 15px rgba(0, 0, 0, 0.08)',
      },
      
      // Gradientes personalizados
      backgroundImage: {
        'beauty-gradient': 'linear-gradient(135deg, #fce7f3 0%, #fed7d7 50%, #fde68a 100%)',
        'gold-gradient': 'linear-gradient(135deg, #fef3c7 0%, #fcd34d  100%)',
        'nude-gradient': 'linear-gradient(135deg, #faf9f7 0%, #e6e1d7 100%)',
        'hero-pattern': 'radial-gradient(circle at 20% 80%, #fce7f3 0%, transparent 50%), radial-gradient(circle at 80% 20%, #fed7d7 0%, transparent 50%), radial-gradient(circle at 40% 40%, #fde68a 0%, transparent 50%)',
      },
      
      // Animações customizadas
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      
      // Bordas arredondadas especiais
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      
      // Configurações de backdrop blur
      backdropBlur: {
        xs: '2px',
      },
      
      // Configurações de transições
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      
      // Dimensões específicas para produtos
      width: {
        'product': '280px',
        'product-lg': '320px',
      },
      height: {
        'product': '320px',
        'product-lg': '360px',
        'hero': '70vh',
      },
    },
  },
  plugins: [
    // Plugin para scrollbar customizada
    function({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        },
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
          '&::-webkit-scrollbar': {
            width: '6px',
            height: '6px'
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1'
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#ec4899',
            'border-radius': '3px'
          }
        }
      })
    },
    
    // Plugin para utilitários de glassmorphism
    function({ addUtilities }) {
      addUtilities({
        '.glass': {
          'background': 'rgba(255, 255, 255, 0.25)',
          'backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(255, 255, 255, 0.18)',
          'border-radius': '1rem',
        },
        '.glass-dark': {
          'background': 'rgba(0, 0, 0, 0.25)',
          'backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(255, 255, 255, 0.18)',
          'border-radius': '1rem',
        }
      })
    }
  ],
}