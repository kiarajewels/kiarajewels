import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.kiarajewels.co';
  
  // Static Routes
  const routes = [
    '',
    '/rings',
    '/earrings',
    '/necklaces',
    '/bracelets',
    '/sets',
    '/gifting',
    '/about',
    '/custom-order',
    '/contact',
    '/shipping-policy',
    '/return-policy',
    '/cancellation-policy',
    '/privacy-policy',
    '/terms',
    '/jewellery-care',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic Routes - Products
  let products = [];
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const res = await fetch(`${apiUrl}/api/products`);
    if (res.ok) {
      products = await res.json();
    }
  } catch (error) {
    console.error('Failed to fetch products for sitemap', error);
  }

  const productRoutes = products.map((product: any) => ({
    url: `${baseUrl}/product/${product._id}`,
    lastModified: new Date(product.updatedAt || new Date()).toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...routes, ...productRoutes];
}
