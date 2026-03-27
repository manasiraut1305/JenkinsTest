import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react({
      // Use the modern oxc compiler instead of deprecated esbuild options
      babel: {
        // optional: custom Babel config if needed
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // optional: handy alias
    },
  },
  optimizeDeps: {
    // Use rollupOptions instead of deprecated esbuildOptions
    rollupOptions: {
      // leave empty unless you need custom dependency optimization
    },
  },
  test: {
    // Vitest configuration
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js', 
  },
});
