import viteCompression from "vite-plugin-compression";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import Sonda from 'sonda/vite';

export default defineConfig(() => {

  return {
    build: {
      outDir: "dist",
      sourcemap: false,
      minify: 'esbuild',
      esbuildOptions: {
        target: 'es2020',
        drop: ['console', 'debugger'],
        keepNames: true,
        minifyIdentifiers: true,
        minifySyntax: true,
        minifyWhitespace: true,
        treeShaking: true,
      },
      cssCodeSplit: true,
      cssMinify: false,
      assetsInlineLimit: 0,
      rollupOptions: {
        input: {
          main: resolve(__dirname, "index.html"),
        },
        output: {
          manualChunks: {
            firebase: ["firebase/app", "firebase/firestore"],
          },
          assetFileNames: (assetInfo) => {
            const imgType = /\.(png|jpe?g|gif|svg|webp|avif)$/;
            if (assetInfo.name && imgType.test(assetInfo.name)) {
              return "assets/img/[name]-[hash][extname]";
            }
            return "assets/[name]-[hash][extname]";
          },
        },
      },
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
        "@": resolve(__dirname, "src")
      }
    },
    server: {
      watch: {
        usePolling: true
      }
    }
  };
});
