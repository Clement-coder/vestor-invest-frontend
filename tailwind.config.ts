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
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
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
