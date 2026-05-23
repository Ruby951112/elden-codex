/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  i18n: undefined, // we use [lang] route segment instead
  // Verification builds (`npm run build:check`) write to a separate dir so they
  // can't clobber a running `next dev` server's `.next` cache (which surfaces as
  // console errors + 404s on the next edit). Dev and the Vercel `build` leave
  // NEXT_DIST_DIR unset and keep using the default `.next`.
  distDir: process.env.NEXT_DIST_DIR || '.next',
};

module.exports = nextConfig;
