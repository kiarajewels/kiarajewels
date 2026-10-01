// config/offers.ts
// Configure active discount tiers and offers here

export const OFFERS_CONFIG = {
  firstOrder: {
    code: 'FIRST10',
    discountPercent: 10,
    description: '10% off on your first order with code FIRST10'
  },
  tiers: [
    {
      minSpend: 9999,
      discountPercent: 15,
      description: 'Spend ₹9,999 or more for 15% off'
    },
    {
      minSpend: 4999,
      discountPercent: 10,
      description: 'Spend ₹4,999 or more for 10% off'
    }
  ]
};
