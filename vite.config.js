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
      minify: "terser",
      terserOptions: {
        compress: {
          ecma: 2020,
          warnings: false,
          comparisons: false,
          inline: 2,
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug'],
          passes: 3,
        },
        mangle: {
          safari10: true,
          properties: {
            regex: /^_/,
          },
        },
        format: {
          comments: false,
          ecma: 2020,
        },
        toplevel: true,
        keep_classnames: false,
        keep_fnames: false,
      },
      cssCodeSplit: true,
      cssMinify: true,
      assetsInlineLimit: 0,
      rollupOptions: {
        input: {
          main: resolve(__dirname, "index.html"),
          notFound: resolve(__dirname, "404.html")
        },
        output: {
          manualChunks: {
            firebase: ["firebase/app", "firebase/firestore"],
            fontawesome: ["@fortawesome/fontawesome-free"],
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
