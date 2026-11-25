// Pages _worker.js (yueliao-ui-preview):
// - /api/* -> live YueLiao Worker (same-origin for the browser)
// - everything else -> Pages static assets (env.ASSETS)
const API = 'https://yueliao.jameswilson199079.workers.dev';
const SITE = 'https://yueliao.eu.cc';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api' || url.pathname.startsWith('/api/')) {
      const headers = new Headers(request.headers);
      const origin = headers.get('Origin');
      if (origin !== null && origin !== url.origin) {
        return Response.json({ code: 'FORBIDDEN', error: '禁止跨站请求' }, { status: 403 });
      }
      // The public page and its API share an origin at the Pages boundary.
      // Express that same relationship at the upstream Worker boundary.
      if (origin === SITE) headers.set('Origin', API);
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
