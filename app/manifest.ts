import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: process.env.NEXT_PUBLIC_TITLE || 'Next Music Player',
    short_name: 'Music Player',
    description: 'A sleek music player to listen to your favorite tracks, even offline.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#0f0f14',
    theme_color: '#0f0f14',
    icons: [
      { src: '/favicon/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/favicon/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/favicon/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
