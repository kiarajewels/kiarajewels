import CatalogPage from '@/components/CatalogPage';

export const metadata = {
  title: 'Silver Jewellery Gifts for Her | Kiara Jewels',
  description: 'Find the perfect gift. 925 silver jewellery with American Diamond (CZ) stones. Made to order for every occasion with luxury packaging.',
}

export default function GiftingPage() {
  return <CatalogPage title="Gifting" apiQuery="isGifting=true" />;
}
