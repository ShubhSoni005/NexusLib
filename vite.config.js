import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// NexusLib — Vite Configuration
// root: Frontend/ so index.html lives there
// envDir: project root (one level up) so .env is read correctly
export default defineConfig({
  root: './Frontend',
  envDir: '..',
  plugins: [react()],
  resolve: {
    alias: {
      // @db → Database/index.js at the project root
      '@db': fileURLToPath(new URL('./Database/index.js', import.meta.url)),
    },
  },
  build: {
    // Output to project root dist/ (outside Frontend/)
    outDir: '../dist',
    emptyOutDir: true,
  },
});
