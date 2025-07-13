// Universal proxy helper shared by all providers
// It prefixes any absolute http/https URL with the value of SID_RESOLVER_PROXY.
// Adds lightweight console logs so we can verify it is being applied in production.

const PROXY_PREFIX = process.env.SID_RESOLVER_PROXY || '';

if (PROXY_PREFIX) {
  console.log(`[Proxy] Global SID_RESOLVER_PROXY detected: ${PROXY_PREFIX}`);
} else {
  console.log('[Proxy] No SID_RESOLVER_PROXY set – traffic will be direct');
}

let proxifyCount = 0;

function proxify(url) {
  // Only touch absolute http/https URLs
  if (!PROXY_PREFIX || !/^https?:\/\//i.test(url)) return url;
  // Avoid double-prefixing
  if (url.startsWith(PROXY_PREFIX)) return url;

  proxifyCount += 1;
  if (proxifyCount <= 5) {
    // Log only the first few to avoid massive console spam
    console.log(`[Proxy] (${proxifyCount}) proxifying → ${url.slice(0, 120)}...`);
  }
  return `${PROXY_PREFIX}${encodeURIComponent(url)}`;
}

module.exports = { proxify };