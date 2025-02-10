import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#9CA3AF',
            a: {
              color: '#8B5CF6',
              '&:hover': {
                color: '#7C3AED',
              },
            },
            h1: {
              color: '#FFFFFF',
            },
            h2: {
              color: '#FFFFFF',
            },
            h3: {
              color: '#FFFFFF',
            },
            h4: {
              color: '#FFFFFF',
            },
            strong: {
              color: '#FFFFFF',
            },
            code: {
              color: '#FFFFFF',
            },
            figcaption: {
              color: '#6B7280',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;