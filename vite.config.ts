import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    tailwindcss(),
    // 自定义插件：全局 /api/year 路由
    {
      name: 'year-api',
      configureServer(server) {
        server.middlewares.use('/api/year', (req: import('http').IncomingMessage, res: import('http').ServerResponse, next: () => void) => {
          if (req.method === 'GET') {
            const now = new Date();
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ year: now.getFullYear(), iso: now.toISOString() }));
          } else {
            next();
          }
        });
      },
    },
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@alt': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api/hitokoto': {
        target: 'https://international.v1.hitokoto.cn',
        changeOrigin: true,
        rewrite: (path) => '/?c=i&c=d',
      },
    },
  },
})
