/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0F1B2D',
        sub: '#5A6B80',
        line: '#E2E8EF',
        wash: '#F4F8FC',
        brand: { DEFAULT: '#2F7FC1', dark: '#24679E' },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', '"PingFang SC"', '"Noto Sans SC"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
