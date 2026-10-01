import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    // Next.js allows fetch with cache/revalidate options
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const res = await fetch(`${apiUrl}/api/products/${params.id}`, { cache: 'no-store' });
    
    if (!res.ok) {
      return {
        title: 'Product | Kiara Jewels',
      };
    }
    
    const product = await res.json();
    
    return {
      title: `${product.name} | 925 Silver Jewellery | Kiara Jewels`,
      description: product.description?.substring(0, 160) || 'Premium 925 silver jewellery, made to order.',
      openGraph: {
        title: `${product.name} | Kiara Jewels`,
        description: product.description?.substring(0, 160),
        images: product.media?.[0] ? [{ url: product.media[0].url }] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Product | Kiara Jewels',
    };
  }
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
