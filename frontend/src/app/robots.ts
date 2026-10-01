import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/profile/', '/cart', '/checkout', '/login', '/signup'],
    },
    sitemap: 'https://www.kiarajewels.co/sitemap.xml',
  }
}
