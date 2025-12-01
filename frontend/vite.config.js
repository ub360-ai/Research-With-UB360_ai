import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Bundle analyzer (only in build mode)
    process.env.ANALYZE && visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),

  // Build optimization for Choreo
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable sourcemaps in production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        // Manual chunks for better caching
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react'],
          'api-vendor': ['axios'],
        },
      },
    },
    // Chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Optimize dependencies
    commonjsOptions: {
      include: [/node_modules/],
    },
  },

  // Development server configuration
  server: {
    port: 5173,
    strictPort: false,
    host: true, // Listen on all addresses
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || '/choreo-apis/default/research-assistant-api',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api/v1'),
      },
    },
  },

  // Preview server (for testing production build)
  preview: {
    port: 4173,
    strictPort: false,
    host: true,
  },

  // Dependency optimization
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'axios', 'lucide-react'],
  },

  // Define global constants
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
  },
})
