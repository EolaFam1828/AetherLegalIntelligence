import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: [
    './index.html',
    './*.tsx',
    './components/**/*.tsx',
    './hooks/**/*.tsx',
    './services/**/*.tsx',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        surface: 'var(--surface)',
        surfaceHighlight: 'var(--surface-active)',
        textMain: 'var(--text-main)',
        textMuted: 'var(--text-muted)',
        border: 'var(--border)',
        brand: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          fuschia: '#D946EF',
          blue: '#2563EB',
        },
        cta: {
          primary: '#0F172A',
        },
        aetherBlack: '#FFFFFF',
        aetherGraphite: '#F3F4F6',
        aetherSlate: '#E5E7EB',
        aetherFog: '#6B7280',
        pureWhite: '#111827',
        cyan: {
          DEFAULT: '#0891B2',
          dim: 'rgba(8, 145, 178, 0.1)',
          hover: '#06B6D4',
        },
        status: {
          critical: '#EF4444',
          moderate: '#F59E0B',
          safe: '#10B981',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono Variable', 'JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '6px',
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
        '2xl': '16px',
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        glow: '0 0 15px rgba(8, 145, 178, 0.3)',
      },
    },
  },
  plugins: [],
} satisfies Config;
