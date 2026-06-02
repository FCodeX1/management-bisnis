import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './features/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bone: '#F8F5EE',
        sage: {
          50: '#F3F8F2',
          100: '#E4EFE2',
          200: '#C9DFC5',
          300: '#A8CBA1',
          400: '#7EAF77',
          500: '#5E9458',
          600: '#497544',
          700: '#3D6039',
          800: '#334F31',
          900: '#2C432A'
        }
      },
      boxShadow: {
        soft: '0 18px 60px rgba(32, 52, 38, 0.10)',
        glass: '0 20px 70px rgba(48, 69, 56, 0.12)'
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem'
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'ui-sans-serif', 'system-ui']
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
};
export default config;
