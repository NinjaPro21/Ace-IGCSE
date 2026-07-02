import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@content': path.resolve(__dirname, './content'),
    },
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
