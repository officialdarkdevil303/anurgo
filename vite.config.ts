import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { processProjectBrief } from './api/contact.ts';

// Custom Vite plugin to handle /api/contact in local dev mode
function devContactApiPlugin(): Plugin {
  return {
    name: 'dev-contact-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/contact' && req.method === 'POST') {
          try {
            // Load environment variables for local dev
            const env = loadEnv(server.config.mode, process.cwd(), '');
            Object.assign(process.env, env);

            let body = '';
            req.on('data', (chunk) => {
              body += chunk;
            });

            req.on('end', async () => {
              try {
                const parsedBody = JSON.parse(body || '{}');
                const result = await processProjectBrief(parsedBody);
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = result.success ? 200 : 400;
                res.end(JSON.stringify(result));
              } catch (err: any) {
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 500;
                res.end(JSON.stringify({ success: false, message: err?.message || 'Server error' }));
              }
            });
          } catch (err: any) {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, message: err?.message || 'Server error' }));
          }
          return;
        }
        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), devContactApiPlugin()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
