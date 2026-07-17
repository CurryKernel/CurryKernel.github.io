import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
  site: 'https://currykernel.github.io',
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
