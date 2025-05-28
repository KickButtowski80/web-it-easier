import viteCompression from "vite-plugin-compression";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import Sonda from 'sonda/vite';

export default defineConfig(({ mode, command }) => {
  // Enable source maps for analysis mode or development
  const enableSourceMap = mode === 'analysis' || mode === 'development';

  return {
    build: {
      outDir: "dist",
      sourcemap: enableSourceMap,  // Enable source maps for analysis and development
      minify: 'esbuild',
      chunkSizeWarningLimit: 1000,  // Moved here from rollupOptions.output
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
      cssMinify: {
        preset: ['default', {
          discardComments: { removeAll: true },  // Remove all comments
          normalizeWhitespace: false,            // Keep some whitespace for readability
          minifyFontValues: false,               // Less aggressive font minification
          minifyGradients: false                 // Keep gradient declarations readable
        }]
      },
      assetsInlineLimit: 0,
      rollupOptions: {
        input: {
          main: resolve(__dirname, "index.html"),
        },
        output: {
          manualChunks: {
            firebase: ["firebase/app", "firebase/firestore"],
            vue: ['vue', 'vue-router'],
            icons: [
              '@fortawesome/fontawesome-svg-core',
              '@fortawesome/vue-fontawesome',
              '@fortawesome/free-solid-svg-icons'
            ],
            // Add markdown-it if you're using it for blog
            markdown: ['highlight.js'],
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
        buildAnalysis: true,
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
