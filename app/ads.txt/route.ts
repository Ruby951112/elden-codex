import { siteConfig } from '@/lib/site-config';

/**
 * Served at /ads.txt — authorizes Google AdSense to monetize this site's inventory.
 * Derived from NEXT_PUBLIC_ADSENSE_CLIENT_ID so it can never drift from config.
 * Returns 404 until AdSense is configured (ads are off anyway, so there's nothing
 * to authorize yet).
 */
export const dynamic = 'force-static';

export function GET() {
  const clientId = siteConfig.monetization.adsense.clientId; // e.g. "ca-pub-1234567890123456"
  if (!clientId) {
    return new Response('', { status: 404 });
  }
  // ads.txt uses the publisher ID without the "ca-" prefix.
  const pubId = clientId.replace(/^ca-/, '');
  const body = `google.com, ${pubId}, DIRECT, f08c47fec0942fa0\n`;
  return new Response(body, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
