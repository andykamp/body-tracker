const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');
const { THEME } = require("./tailwind.shared.config")

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    // Path to the tremor module
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}",
    ...createGlobPatternsForDependencies(__dirname),
  ],
  darkMode: 'class',
  theme: {
    ...THEME,
  },
  plugins: [],
};
