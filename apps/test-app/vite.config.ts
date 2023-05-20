/// <reference types="vitest" />
import type { UserConfigExport } from "vite"
import { defineConfig, loadEnv } from "vite"
import react from '@vitejs/plugin-react';
import viteTsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig((config) => {
  console.log("config", config)
  const vars = loadEnv(config.mode, process.cwd(), "")
  const out: UserConfigExport = {
    cacheDir: '../../node_modules/.vite/test-app',
    envPrefix: "NX",
    define: {
      "process.env.ENV": JSON.stringify(vars.ENV || "dev"),
      "process.env.NEXT_PUBLIC_FIREBASE_API_KEY": JSON.stringify(vars.NEXT_PUBLIC_FIREBASE_API_KEY),
      "process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN": JSON.stringify(vars.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
      "process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID": JSON.stringify(vars.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
      "process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET": JSON.stringify(vars.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
      "process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID": JSON.stringify(vars.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
      "process.env.NEXT_PUBLIC_FIREBASE_APP_ID": JSON.stringify(vars.NEXT_PUBLIC_FIREBASE_APP_ID),
      "process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID": JSON.stringify(vars.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID)
    },

    server: {
      port: 4200,
      host: 'localhost',
    },

    preview: {
      port: 4300,
      host: 'localhost',
    },

    plugins: [
      react(),
      viteTsConfigPaths({
        root: '../../',
      }),
    ],

    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [
    //    viteTsConfigPaths({
    //      root: '../../',
    //    }),
    //  ],
    // },

    test: {
      globals: true,
      cache: {
        dir: '../../node_modules/.vitest',
      },
      environment: 'jsdom',
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    },
  }
  return out
});

