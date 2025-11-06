/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['i.imgur.com', 'i.scdn.co',"i1.sndcdn.com"],
  },
  unoptimized: true,
  reactStrictMode: false,
  // Remove console logs in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'] // Keep error and warn logs, remove others
    } : false,
  },
};

module.exports = nextConfig;