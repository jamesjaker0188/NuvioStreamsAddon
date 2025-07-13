// Universal proxy helper shared by all providers
// It prefixes any absolute http/https URL with the value of SID_RESOLVER_PROXY.
// Adds lightweight console logs so we can verify it is being applied in production.

console.log('[Proxy Helper] _httpProxy.js is being loaded/executed');

const PROXY_PREFIX = process.env.SID_RESOLVER_PROXY || '';

console.log(`[Proxy Helper] Environment check - SID_RESOLVER_PROXY: ${PROXY_PREFIX ? 'SET' : 'NOT SET'}`);

if (PROXY_PREFIX) {
  console.log(`[Proxy] Global SID_RESOLVER_PROXY detected: ${PROXY_PREFIX}`);
} else {
  console.log('[Proxy] No SID_RESOLVER_PROXY set – traffic will be direct');
}

let proxifyCount = 0;

function proxify(url) {
  console.log(`[Proxy Helper] proxify() called with URL: ${url ? url.slice(0, 100) : 'undefined'}...`);
  
  // Only touch absolute http/https URLs
  if (!PROXY_PREFIX || !/^https?:\/\//i.test(url)) {
    console.log(`[Proxy Helper] Skipping proxify - PROXY_PREFIX: ${!!PROXY_PREFIX}, URL valid: ${/^https?:\/\//i.test(url)}`);
    return url;
  }
  
  // Avoid double-prefixing
  if (url.startsWith(PROXY_PREFIX)) {
    console.log(`[Proxy Helper] URL already proxified, returning as-is`);
    return url;
  }

  // Skip TMDB API and image domains – no need to proxy those
  try {
    const { hostname } = new URL(url);
    if (hostname.endsWith('themoviedb.org')) {
      console.log(`[Proxy Helper] Skipping TMDB domain: ${hostname}`);
      return url;
    }
  } catch (_) {
    /* ignore parse failures */
  }

  proxifyCount += 1;
  if (proxifyCount <= 10) {
    // Log first 10 to get better visibility
    console.log(`[Proxy] (${proxifyCount}) proxifying → ${url.slice(0, 120)}...`);
  }
  
  const proxifiedUrl = `${PROXY_PREFIX}${encodeURIComponent(url)}`;
  console.log(`[Proxy Helper] Returning proxified URL: ${proxifiedUrl.slice(0, 150)}...`);
  return proxifiedUrl;
}

module.exports = { proxify };