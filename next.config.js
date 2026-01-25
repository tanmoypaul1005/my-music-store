/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['i.imgur.com', 'i.scdn.co',"i.ytimg.com",""],
  },
  unoptimized: true,
  reactStrictMode: false,
  // Remove console logs in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'] // Keep error and warn logs, remove others
    } : false,
  },
  // Add headers for better caching
  async headers() {
    return [
      {
        source: '/musics/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;