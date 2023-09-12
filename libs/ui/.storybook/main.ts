import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
const tsConfigPaths = require("vite-tsconfig-paths").default


const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-essentials',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {
      builder: {
        viteConfigPath: 'libs/ui/vite.config.ts',
      },
    },
  },
};

export default {
  ...config,
    viteFinal(config:any) {
    return mergeConfig(config, {
      cacheDir: "../../node_modules/.vite/ui-storybook",
      plugins: [
        tsConfigPaths({
          root: "../../",
          projects: [ "tsconfig.base.json" ],
          loose: true
        })
      ]
    })
  }
};

// To customize your Vite configuration you can use the viteFinal field.
// Check https://storybook.js.org/docs/react/builders/vite#configuration
// and https://nx.dev/packages/storybook/documents/custom-builder-configs
