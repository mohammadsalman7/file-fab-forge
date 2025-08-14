import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Use relative base so the app works when hosted under a subpath
  base: './',
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
