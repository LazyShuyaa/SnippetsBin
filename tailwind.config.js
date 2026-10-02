/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Deep, layered ink palette used for surfaces and text.
        ink: {
          950: '#05060a',
          900: '#080a11',
          850: '#0b0e16',
          800: '#101420',
          750: '#151a29',
          700: '#1c2333',
          600: '#2a3346',
          500: '#3d485e',
          400: '#5c6a83',
          300: '#8b98ae',
          200: '#b9c3d4',
          100: '#e3e8f1',
        },
        // Signature accent: electric violet -> cyan gradient family.
        brand: {
          50: '#f2eeff',
          100: '#e4dcff',
          200: '#cabaff',
          300: '#a992ff',
          400: '#8b6bff',
          500: '#7145f7',
          600: '#5c2fe0',
          700: '#4a24b8',
          800: '#3c1f92',
          900: '#331c73',
        },
        aqua: {
          300: '#7ef0e6',
          400: '#38dcd0',
          500: '#14bdb4',
          600: '#0e9a95',
        },
        flare: {
          400: '#ff7ab8',
          500: '#f5539b',
        },
        'custom-gray': '#242526',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'Liberation Mono', 'monospace'],
        display: ['Khand', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        khand: ['Khand', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        panel: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 18px 40px -24px rgba(0,0,0,0.9)',
        lift: '0 24px 60px -28px rgba(0,0,0,0.95), 0 2px 0 0 rgba(255,255,255,0.03) inset',
        glow: '0 0 0 1px rgba(139,107,255,0.35), 0 18px 50px -18px rgba(113,69,247,0.55)',
        'glow-aqua': '0 0 0 1px rgba(56,220,208,0.35), 0 18px 50px -18px rgba(20,189,180,0.45)',
      },
      backgroundImage: {
        'grid-faint':
          'linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)',
        'brand-sheen': 'linear-gradient(120deg, #8b6bff 0%, #38dcd0 100%)',
        'panel-sheen': 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 60%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.96) translateY(6px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(24px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateX(0) scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(0,-18px,0) scale(1.03)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate3d(0,0,0)' },
          '33%': { transform: 'translate3d(24px,-16px,0)' },
          '66%': { transform: 'translate3d(-20px,12px,0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        caret: {
          '0%, 45%': { opacity: '1' },
          '50%, 95%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'gradient-pan': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.22,1,0.36,1) both',
        'fade-in': 'fade-in 0.4s ease-out both',
        'pop-in': 'pop-in 0.16s cubic-bezier(0.22,1,0.36,1) both',
        'slide-in-right': 'slide-in-right 0.28s cubic-bezier(0.22,1,0.36,1) both',
        float: 'float 11s ease-in-out infinite',
        drift: 'drift 18s ease-in-out infinite',
        shimmer: 'shimmer 1.8s infinite',
        caret: 'caret 1.1s steps(1,end) infinite',
        'gradient-pan': 'gradient-pan 6s ease infinite',
      },
      transitionTimingFunction: {
        snap: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
