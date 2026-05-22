/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  i18n: undefined, // we use [lang] route segment instead
};

module.exports = nextConfig;
