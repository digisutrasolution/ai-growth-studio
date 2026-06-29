import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AI Growth Studio',
    short_name: 'AI Growth',
    description: 'AI-powered digital marketing automation.',
    start_url: '/',
    display: 'standalone',
    background_color: '#07080f',
    theme_color: '#7c3aed',
    icons: [{ src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' }],
  }
}
