import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import httpProxy from 'http-proxy';
// Custom plugin to handle CORS bypass for LLM API calls during development
function corsBypassPlugin() {
    var proxy = httpProxy.createProxyServer({
        changeOrigin: true,
        secure: false, // Don't verify SSL certs for local proxies
    });
    return {
        name: 'cors-bypass-plugin',
        configureServer: function (server) {
            server.middlewares.use('/api/proxy', function (req, res, next) {
                var targetUrl = req.headers['x-target-url'];
                if (!targetUrl) {
                    res.statusCode = 400;
                    res.end('Missing x-target-url header');
                    return;
                }
                // Forward the request to the target URL
                proxy.web(req, res, { target: targetUrl, ignorePath: true }, function (err) {
                    console.error('[CORS Proxy Error]', err);
                    res.statusCode = 502;
                    res.end('Proxy error: ' + err.message);
                });
            });
        }
    };
}
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), corsBypassPlugin()],
});
