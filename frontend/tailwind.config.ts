import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0d0d0f',
        surface: '#18181b',
        'surface-2': '#27272a',
        border: '#3f3f46',
        accent: '#6366f1',
        'accent-hover': '#4f46e5',
        muted: '#71717a',
        valorant: '#ff4655',
        steam: '#1b2838',
        cs2: '#f0a500',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
