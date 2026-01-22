import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind()],
  site: 'https://tu-portafolio.vercel.app',
  output: 'static',
  build: {
    assets: '_assets'
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "src/styles/variables.scss";`
        }
      }
    }
  }
});