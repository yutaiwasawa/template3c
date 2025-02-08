import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    server: {
      host: true,
      port: 5173,
      proxy: {
        '/api/notion': {
          target: 'https://api.notion.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/notion/, ''),
          headers: {
            'Authorization': `Bearer ${env.VITE_NOTION_TOKEN}`,
            'Notion-Version': '2022-06-28',
          },
          secure: true,
          ws: true,
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('proxy error', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('Sending Request to Notion:', {
                method: req.method,
                url: req.url,
                headers: proxyReq.getHeaders()
              });
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('Received Response from Notion:', {
                statusCode: proxyRes.statusCode,
                url: req.url,
                headers: proxyRes.headers
              });
            });
          }
        },
      },
    },
  };
});