import { mergeConfig } from 'vite';
import rootMain from "../../../.storybook/main"
import tsConfigPaths from "vite-tsconfig-paths"

export default {
  ...rootMain,
    viteFinal(config) {
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
