import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'DigiSutra — AI Growth Studio',
    short_name: 'DigiSutra',
    description: 'AI-powered digital marketing automation by DigiSutra Solutions.',
    start_url: '/',
    display: 'standalone',
    background_color: '#07080f',
    theme_color: '#F97316',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  }
}
