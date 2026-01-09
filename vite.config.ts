
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Standard mapping for environment variables
    'process.env': process.env
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  server: {
    port: 3000
  }
});
