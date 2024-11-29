// tailwind.config.js
const { fontFamily } = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Custom color palette optimized for data visualization and sports analytics
      colors: {
        // Primary color scheme
        primary: {
          50: '#e6f1ff',
          100: '#b3d7ff',
          200: '#80bdff',
          300: '#4da3ff',
          400: '#1a89ff',
          500: '#0070f3', // Brand primary blue
          600: '#0059c2',
          700: '#004191',
          800: '#002960',
          900: '#001530'
        },
        
        // Success and performance colors
        performance: {
          positive: '#10b981', // Emerald green for positive trends
          negative: '#ef4444', // Red for negative trends
          neutral: '#6b7280' // Neutral gray
        },
        
        // Sports-themed accent colors
        sports: {
          basketball: '#f59e0b', // Warm amber
          football: '#10b981', // Emerald green
          baseball: '#ef4444', // Soft red
          soccer: '#3b82f6' // Bright blue
        },
        
        // Dark mode optimized background and text colors
        dark: {
          background: '#121212',
          surface: '#1e1e1e',
          text: '#e0e0e0',
          muted: '#888888'
        }
      },
      
      // Enhanced typography and font handling
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
        display: ['Poppins', ...fontFamily.sans],
        mono: ['Fira Code', ...fontFamily.mono]
      },
      
      // Advanced animation and transition settings
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      
      // Custom shadow styles for depth and interactivity
      boxShadow: {
        'data-card': '0 4px 6px -1px rgba(0, 112, 243, 0.1), 0 2px 4px -1px rgba(0, 112, 243, 0.06)',
        'hover-elevation': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'intense': '0 20px 25px -5px rgba(0, 112, 243, 0.1), 0 10px 10px -5px rgba(0, 112, 243, 0.04)'
      },
      
      // Customized border radius for modern, clean design
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem'
      },
      
      // Keyframe animations for interactive elements
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      },
      
      // Animation classes
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
        'pulse-soft': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio')
  ]
};