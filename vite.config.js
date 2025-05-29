import terser from '@rollup/plugin-terser';
import viteCompression from "vite-plugin-compression";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import Sonda from 'sonda/vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig(({ mode }) => {
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
      assetsInlineLimit: 4096,// 4kb - files smaller than this will be inlined
      rollupOptions: {
        input: {
          main: resolve(__dirname, "index.html"),
        },
        output: {
          manualChunks: {
            'firebase-core': ['firebase/app'],
            'firebase-auth': ['firebase/auth'],
            'firebase-firestore-lite': ['firebase/firestore/lite'], // For all lite SDK usage (core setup and reads)
            'firebase-firestore-full': ['firebase/firestore'],    // For write operations and advanced features
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
      ViteImageOptimizer({
        sharp: {
          quality: 80,  // Default image quality (1-100)
          avif: { quality: 60 },  // AVIF compression
          webp: { quality: 75 },  // WebP compression
          png: { quality: 85, compressionLevel: 9 },  // PNG optimization
          jpeg: { quality: 80, mozjpeg: true },  // JPEG optimization
        },
        includePublic: true,  // Optimize images in public folder
        logStats: true,  // Show optimization stats
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
