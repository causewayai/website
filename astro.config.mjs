import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://causewayai.com',
  // Interim GitHub Pages project URL serves from /website — remove this
  // once the causewayai.com custom domain is live (Pages then serves from root).
  base: '/website',
});
