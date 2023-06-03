const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,app,pages,components}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}",
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
