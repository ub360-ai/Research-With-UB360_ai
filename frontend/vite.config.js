import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Build optimization for Choreo
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react'],
          'api-vendor': ['axios'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },

  // Development server configuration
  server: {
    port: 5173,
    host: true,
    proxy: {
      // Proxy Choreo connection path to local backend
      '/choreo-apis': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => {
          // Remove Choreo prefix: /choreo-apis/default/research-assistant-api/v1 -> /api/v1
          return path.replace(/^\/choreo-apis\/default\/research-assistant-api\/v1/, '')
        },
      },
    },
  },

  // Preview server
  preview: {
    port: 4173,
    host: true,
  },

  // Dependency optimization
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'axios', 'lucide-react'],
  },
})
