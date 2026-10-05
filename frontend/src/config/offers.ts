// config/offers.ts
// Configure active discount tiers and offers here

export type Tier = {
  minSpend: number;
  discountPercent: number;
  description: string;
};

export const OFFERS_CONFIG = {
  firstOrder: {
    code: '',
    discountPercent: 0,
    description: ''
  },
  tiers: [] as Tier[]
};
