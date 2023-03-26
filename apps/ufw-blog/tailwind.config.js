const { createGlobPatternsForDependencies } = require('@nrwl/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        'ufw-dark': {
          50: '#e7e7e9',
          100: '#cfd0d3',
          200: '#9fa1a7',
          300: '#6f717b',
          400: '#3f424f',
          500: '#0f1323',
          600: '#0c0f1c',
          700: '#090b15',
          800: '#06080e',
          900: '#030407',
        },

        'ufw-light': {
          50: '#fcfaf1',
          100: '#faf5e4',
          200: '#f4ebc8',
          300: '#efe0ad',
          400: '#e9d691',
          500: '#e4cc76',
          600: '#b6a35e',
          700: '#897a47',
          800: '#5b522f',
          900: '#2e2918',
        },
      },
    },
  },
  plugins: [],
};
