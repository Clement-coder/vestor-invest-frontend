import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        card: {
          DEFAULT: 'rgb(var(--card) / <alpha-value>)',
          foreground: 'rgb(var(--card-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'rgb(var(--popover) / <alpha-value>)',
          foreground: 'rgb(var(--popover-foreground) / <alpha-value>)',
        },
        primary: {
          DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
          foreground: 'rgb(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'rgb(var(--secondary) / <alpha-value>)',
          foreground: 'rgb(var(--secondary-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'rgb(var(--muted) / <alpha-value>)',
          foreground: 'rgb(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          foreground: 'rgb(var(--accent-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'rgb(var(--destructive) / <alpha-value>)',
          foreground: 'rgb(var(--destructive-foreground) / <alpha-value>)',
        },
        border: 'rgb(var(--border) / <alpha-value>)',
        input: 'rgb(var(--input) / <alpha-value>)',
        ring: 'rgb(var(--ring) / <alpha-value>)',
        chart: {
          1: 'rgb(var(--chart-1) / <alpha-value>)',
          2: 'rgb(var(--chart-2) / <alpha-value>)',
          3: 'rgb(var(--chart-3) / <alpha-value>)',
          4: 'rgb(var(--chart-4) / <alpha-value>)',
          5: 'rgb(var(--chart-5) / <alpha-value>)',
        },
        sidebar: {
          DEFAULT: 'rgb(var(--sidebar) / <alpha-value>)',
          foreground: 'rgb(var(--sidebar-foreground) / <alpha-value>)',
          primary: 'rgb(var(--sidebar-primary) / <alpha-value>)',
          'primary-foreground': 'rgb(var(--sidebar-primary-foreground) / <alpha-value>)',
          accent: 'rgb(var(--sidebar-accent) / <alpha-value>)',
          'accent-foreground': 'rgb(var(--sidebar-accent-foreground) / <alpha-value>)',
          border: 'rgb(var(--sidebar-border) / <alpha-value>)',
          ring: 'rgb(var(--sidebar-ring) / <alpha-value>)',
        },
        // Vestor-specific colors
        cyan: {
          50: '#e0f7ff',
          100: '#b3f0ff',
          300: '#4de8ff',
          400: '#00c4ff',
          500: '#00a8ff',
          600: '#0088d9',
        },
        neon: {
          cyan: '#00A8FF',
          'cyan-light': '#00C4FF',
          green: '#39FF9E',
          'green-light': '#00FF9E',
          blue: '#1E90FF',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: 'calc(var(--radius) + 4px)',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 168, 255, 0.6)',
        'glow-green': '0 0 20px rgba(57, 255, 158, 0.6)',
        'glow-blue': '0 0 20px rgba(30, 144, 255, 0.6)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
        'glass-lg': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
      animation: {
        floating: 'floating 3s ease-in-out infinite',
        'neon-glow': 'neon-glow 2s ease-in-out infinite',
        'glow-cyan': 'glow-cyan 3s ease-in-out infinite',
        'glow-green': 'glow-green 3s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 3s ease infinite',
        ripple: 'ripple 0.6s ease-out',
        shimmer: 'shimmer 2s infinite',
      },
      keyframes: {
        floating: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'neon-glow': {
          '0%, 100%': {
            boxShadow: '0 0 5px rgba(0, 168, 255, 0.5), 0 0 10px rgba(0, 168, 255, 0.3)',
          },
          '50%': {
            boxShadow: '0 0 10px rgba(0, 168, 255, 0.8), 0 0 20px rgba(0, 168, 255, 0.5)',
          },
        },
        'glow-cyan': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(0, 168, 255, 0.4)' },
          '50%': {
            boxShadow: '0 0 20px rgba(0, 168, 255, 0.7), inset 0 0 10px rgba(0, 168, 255, 0.2)',
          },
        },
        'glow-green': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(57, 255, 158, 0.4)' },
          '50%': {
            boxShadow: '0 0 20px rgba(57, 255, 158, 0.7), inset 0 0 10px rgba(57, 255, 158, 0.2)',
          },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        ripple: {
          '0%': {
            transform: 'scale(0)',
            opacity: '1',
          },
          '100%': {
            transform: 'scale(4)',
            opacity: '0',
          },
        },
        shimmer: {
          '0%': {
            backgroundPosition: '200% center',
          },
          '100%': {
            backgroundPosition: '-200% center',
          },
        },
      },
      fontSize: {
        xs: ['12px', { lineHeight: '16px' }],
        sm: ['14px', { lineHeight: '20px' }],
        base: ['16px', { lineHeight: '24px' }],
        lg: ['18px', { lineHeight: '28px' }],
        xl: ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '36px' }],
        '4xl': ['36px', { lineHeight: '40px' }],
      },
      spacing: {
        '4.5': '1.125rem',
        '5.5': '1.375rem',
      },
      opacity: {
        glass: '0.8',
        'glass-light': '0.05',
        'glass-dark': '0.15',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
