// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // 設定 GitHub Pages 網址
  site: 'https://ashssa.github.io',
  base: '/laws',
  vite: {
    plugins: [tailwindcss()]
  },
});

