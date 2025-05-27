import viteCompression from "vite-plugin-compression";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import Sonda from 'sonda/vite'; 

export default defineConfig({  
  build: {
    // Enable source maps for development and bundle analysis
    // - 'true': Generates source maps in development mode (faster builds)
    // - 'hidden': Generates source maps but doesn't include them in the bundle (smaller production builds)
    // - 'inline': Embeds source maps as data URLs (useful for development)
    // Note: Enabling source maps increases build time and output size,
    // but is necessary for accurate bundle analysis with tools like Sonda
    sourcemap: true, // Set to false in production for better performance
  },
  plugins: [
    vue(),
    viteCompression({
      algorithm: "brotliCompress", // Choose desired compression algorithm (optional)
      threshold: 1024,
      ext: ".gz", // Output compressed files with .gz extension
      filter: /\.(js|css|html|svg)$/i, // Compress all text-based assets
    }),
    Sonda({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    watch: {
      usePolling: true,
    },
  },
});
