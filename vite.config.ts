import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const BUILD_STAMP = new Date().toISOString()

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'inject-build-stamp',
      transformIndexHtml(html) {
        return html.replace(
          '</head>',
          `    <meta name="app-build" content="${BUILD_STAMP}" />\n  </head>`,
        )
      },
    },
  ],
  define: {
    __APP_BUILD__: JSON.stringify(BUILD_STAMP),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@content': path.resolve(__dirname, './content'),
    },
    dedupe: ['react', 'react-dom', 'react-router', 'react-router-dom'],
  },
  optimizeDeps: {
    include: ['react-router-dom'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/katex') || id.includes('node_modules/rehype-katex')) return 'katex'
          if (id.includes('node_modules/react-markdown') || id.includes('node_modules/remark-')) return 'markdown'
          if (id.includes('node_modules/firebase')) return 'firebase'
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) return 'react-vendor'
          if (id.includes('/features/explorers/')) return 'explorers'
        },
      },
    },
  },
})
