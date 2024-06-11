import compression  from "vite-plugin-compression";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    compression ({
      ext: '.gz', // Output compressed files with .gz extension
      filter: /\.(js|css|html|svg)$/i, // Compress all text-based assets
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
