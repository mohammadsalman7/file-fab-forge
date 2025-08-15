import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Use absolute base path for better compatibility
  base: '/',
  server: {
    host: "::",
    port: 8080,
    fs: {
      strict: false
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,gif,webp,woff,woff2,ttf,eot}'],
        globIgnores: [
          '**/uploads/d6e67793-e22c-4362-a794-c59496780b93.png',
          '**/uploads/4797c19b-882c-40ac-8c72-3df894830230.png'
        ],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024
      },
      manifest: {
        name: 'ImageDocPro - Free Online Image & PDF Tools',
        short_name: 'ImageDocPro',
        description: 'Free online image processing tools with AI background remover, image upscaler, document converter, file compressor, and PDF password remover.',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/uploads/logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/uploads/logo.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ],
        categories: ['productivity', 'utilities', 'photo'],
        lang: 'en',
        dir: 'ltr'
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    rollupOptions: {
      external: [
        'fs',
        'path',
        'stream',
        'util',
        'events',
        'child_process',
        'crypto',
        'os',
        'url',
        'querystring',
        'http',
        'https',
        'zlib',
        'assert',
        'buffer',
        'process',
        'vm',
        'module',
        'constants',
        'domain',
        'punycode',
        'tty',
        'readline',
        'repl',
        'string_decoder',
        'timers',
        'tls',
        'net',
        'dgram',
        'dns',
        'cluster',
        'worker_threads',
        'perf_hooks',
        'async_hooks',
        'inspector',
        'trace_events',
        'v8',
        'worker_threads',
        'fs/promises',
        'path/posix',
        'path/win32',
        'url',
        'querystring',
        'http',
        'https',
        'zlib',
        'assert',
        'buffer',
        'process',
        'vm',
        'module',
        'constants',
        'domain',
        'punycode',
        'tty',
        'readline',
        'repl',
        'string_decoder',
        'timers',
        'tls',
        'net',
        'dgram',
        'dns',
        'cluster',
        'worker_threads',
        'perf_hooks',
        'async_hooks',
        'inspector',
        'trace_events',
        'v8',
        'worker_threads',
        'fs/promises',
        'path/posix',
        'path/win32'
      ],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-toast'],
          tensorflow: ['@tensorflow/tfjs', '@tensorflow-models/deeplab'],
          utils: ['fabric', 'pdf-lib'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'lucide-react',
      'qrcode',
      'jsbarcode',
    ],
    exclude: []
  },
  css: {
    devSourcemap: false,
  },
  define: {
    global: 'globalThis',
  },
}));
