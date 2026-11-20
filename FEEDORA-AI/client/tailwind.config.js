/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Feedora AI Warm White & Editorial Palette
        canvas: {
          DEFAULT: '#FAF9F6',
          white: '#FFFFFF',
          subtle: '#F5F3EF',
          muted: '#EAE8E4',
          dark: '#F0ECE4',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          card: '#FFFFFF',
          'card-hover': '#FCFBF9',
          page: '#FAF9F6',
          subtle: '#F7F6F2',
          raised: '#FFFFFF',
          overlay: '#FFFFFF',
          border: '#EAE8E4',
          'border-light': '#F2EFEB',
          glass: 'rgba(255, 255, 255, 0.92)',
          strong: '#FFFFFF',
        },

        // Clean Editorial Border Tokens
        'glass-border': '#EAE8E4',
        'glass-border-light': '#F0EDE8',
        'glass-highlight': 'rgba(0, 0, 0, 0.02)',

        // Backdrop aliases
        'backdrop-glass': {
          DEFAULT: 'rgba(255, 255, 255, 0.90)',
          light: 'rgba(250, 249, 246, 0.85)',
          strong: 'rgba(255, 255, 255, 0.98)',
        },

        // Primary Accent: Sophisticated Warm Terracotta / Coral
        primary: {
          DEFAULT: '#E05638',
          hover: '#C8482A',
          dark: '#B03B20',
          light: '#FDF4F2',
          glow: 'rgba(224, 86, 56, 0.12)',
        },

        // Secondary Accent: Restrained Warm Amber / Ochre
        secondary: {
          DEFAULT: '#B45309',
          hover: '#92400E',
          dark: '#78350F',
          light: '#FEF3C7',
          glow: 'rgba(180, 83, 9, 0.12)',
        },

        // Status Semantics (Refined, Editorial, Not Neon)
        success: {
          DEFAULT: '#15803D',
          hover: '#166534',
          dark: '#14532D',
          light: '#F0FDF4',
        },
        danger: {
          DEFAULT: '#BE123C',
          hover: '#9F1239',
          dark: '#881337',
          light: '#FFF1F2',
        },
        warning: {
          DEFAULT: '#B45309',
          hover: '#92400E',
          dark: '#78350F',
          light: '#FFFBEB',
        },

        // High-Legibility Charcoal & Muted Warm Grey Hierarchy
        'text-primary': '#1C1917',
        'text-secondary': '#57534E',
        'text-muted': '#78716C',

        // Legacy compatibility aliases
        navy: {
          DEFAULT: '#1C1917',
          dark: '#FAF9F6',
          canvas: '#FAF9F6',
          card: '#FFFFFF',
          light: '#F5F3EF',
          border: '#EAE8E4',
          'border-light': '#F0EDE8',
        },
        electric: {
          DEFAULT: '#E05638',
          hover: '#C8482A',
          light: '#FDF4F2',
          glow: 'rgba(224, 86, 56, 0.12)',
        },
        teal: {
          DEFAULT: '#0284C7',
          hover: '#0369A1',
          light: '#F0F9FF',
          glow: 'rgba(2, 132, 199, 0.12)',
        },
        emerald: {
          DEFAULT: '#15803D',
          hover: '#166534',
          light: '#F0FDF4',
        },
        rose: {
          DEFAULT: '#BE123C',
          hover: '#9F1239',
          light: '#FFF1F2',
        },
        text: {
          main: '#1C1917',
          secondary: '#57534E',
          muted: '#78716C',
        },
        status: {
          positive: '#15803D',
          negative: '#BE123C',
          warning: '#B45309',
          info: '#0284C7',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        editorial: ['Newsreader', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        sm: '4px',
        md: '6px',
        lg: '10px',
        xl: '12px',
        '2xl': '16px',
        '3xl': '20px',
        full: '9999px',
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 4px 12px -2px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
        glass: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        elevated: '0 10px 30px -4px rgba(0, 0, 0, 0.08), 0 4px 8px -2px rgba(0, 0, 0, 0.04)',
        glow: '0 0 0 1px #EAE8E4, 0 4px 16px -2px rgba(224, 86, 56, 0.1)',
        'glow-emerald': '0 0 0 1px #BBF7D0, 0 4px 16px -2px rgba(21, 128, 61, 0.1)',
      },
      animation: {
        'fadeIn': 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scaleIn': 'scaleIn 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(3px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
