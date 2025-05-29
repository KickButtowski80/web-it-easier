import terser from '@rollup/plugin-terser';
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
      minify: 'terser',
      chunkSizeWarningLimit: 1000,  // Moved here from rollupOptions.output
      terserOptions: {
        compress: {
          // Code Removal
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.warn', 'console.error'],
          
          // Advanced Compression
          passes: 2,                  // Multiple compression passes
          ecma: 2020,                 // Modern JS features
          collapse_vars: true,        // Merge variables when possible
          toplevel: true,             // Optimize top-level functions/variables
          
          // Safe Optimizations
          booleans: true,             // Optimize boolean expressions
          conditionals: true,         // Optimize conditionals
          dead_code: true,            // Remove unreachable code
          evaluate: true,             // Evaluate constant expressions
          if_return: true,            // Optimize if-return and if-continue
          join_vars: true,            // Join consecutive variable declarations
          loops: true,                // Optimize loops
        },
        format: {
          comments: false,
          ecma: 2020
        },
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
            'firebase-core': ['firebase/app'],
            'firebase-auth': ['firebase/auth'],
            'firebase-firestore-core': ['firebase/firestore/lite'],
            'firebase-firestore-read': ['firebase/firestore/lite'],
            'firebase-firestore-write': ['firebase/firestore'],
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
