// Pages _worker.js (yueliao-ui-preview):
// - /api/* -> live YueLiao Worker (same-origin for the browser)
// - everything else -> Pages static assets (env.ASSETS)
const API = 'https://yueliao.jameswilson199079.workers.dev';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api' || url.pathname.startsWith('/api/')) {
      const headers = new Headers(request.headers);
      headers.delete('host');
      const init = { method: request.method, headers, redirect: 'manual' };
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        init.body = await request.arrayBuffer();
      }
      const res = await fetch(API + url.pathname + url.search, init);
      return new Response(res.body, { status: res.status, headers: res.headers });
    }
    return env.ASSETS.fetch(request);
  },
};
