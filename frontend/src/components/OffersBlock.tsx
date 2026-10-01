import React from 'react';
import { OFFERS_CONFIG } from '@/config/offers';
import { Tag } from 'lucide-react';

export default function OffersBlock() {
  return (
    <div style={{
      backgroundColor: '#f9fafb',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '24px',
      marginBottom: '32px'
    }}>
      <h3 style={{ 
        fontSize: '1.2rem', 
        fontWeight: '600', 
        color: '#27302E', 
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <Tag size={20} color="var(--rose-deep)" />
        Available Offers
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{ 
            backgroundColor: 'var(--rose-deep)', 
            color: 'white', 
            padding: '4px 8px', 
            borderRadius: '4px', 
            fontSize: '0.8rem', 
            fontWeight: '600',
            whiteSpace: 'nowrap'
          }}>
            {OFFERS_CONFIG.firstOrder.code}
          </div>
          <p style={{ margin: 0, color: '#4b5563', fontSize: '0.95rem', lineHeight: 1.5 }}>
            {OFFERS_CONFIG.firstOrder.description}
          </p>
        </div>

        {OFFERS_CONFIG.tiers.map((tier, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ 
              backgroundColor: '#e5e7eb', 
              color: '#374151', 
              padding: '4px 8px', 
              borderRadius: '4px', 
              fontSize: '0.8rem', 
              fontWeight: '600',
              whiteSpace: 'nowrap'
            }}>
              {tier.discountPercent}% OFF
            </div>
            <p style={{ margin: 0, color: '#4b5563', fontSize: '0.95rem', lineHeight: 1.5 }}>
              {tier.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
