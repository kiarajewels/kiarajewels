'use client';
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "What is it made of?",
    answer: "Every piece is crafted from 925 sterling silver, set with premium CZ stones, and finished with a rhodium plating and anti-tarnish coating."
  },
  {
    question: "Will it tarnish, and can I wear it every day?",
    answer: "Our pieces are everyday wear friendly! However, to keep the finish lasting longer, please remove before swimming or bathing and keep away from perfume and harsh chemicals."
  },
  {
    question: "How long does delivery take?",
    answer: "Every piece is made in our own unit to order. It takes about 4 days to make, plus about 3 days for delivery (varies by pincode), so you can expect it in about 7 days total."
  },
  {
    question: "What is your return policy?",
    answer: "You can request a return within 3 days of delivery if the item is in good condition. Custom-designed pieces are non-returnable unless defective."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept UPI, net banking, and all major credit/debit cards."
  },
  {
    question: "Can I get a custom design?",
    answer: "Yes! We accept custom orders. It takes about 4 days to make plus delivery, longer for complex designs. We will confirm the exact timeline in your quote."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <section className="faq" id="faq-section" style={{ padding: '80px 24px', maxWidth: '800px', margin: '0 auto' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', textAlign: 'center', margin: '0 0 40px', fontWeight: 500 }}>
        Frequently Asked Questions
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {faqs.map((faq, index) => (
          <div
            key={index}
            style={{ borderBottom: '1px solid var(--light-grey)' }}
          >
            <button 
              onClick={() => toggleFaq(index)}
              aria-expanded={openIndex === index}
              style={{ width: '100%', padding: '24px 0', border: 'none', background: 'transparent', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left', cursor: 'pointer', fontSize: '1.1rem', letterSpacing: '0.02em', color: 'var(--pure-black)' }}
            >
              <span style={{ fontWeight: 500 }}>{faq.question}</span>
              <ChevronDown 
                size={20} 
                style={{ transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} 
              />
            </button>
            <div 
              style={{
                display: 'grid',
                gridTemplateRows: openIndex === index ? '1fr' : '0fr',
                transition: 'grid-template-rows 0.3s ease'
              }}
            >
              <div style={{ overflow: 'hidden' }}>
                <p style={{ margin: '0 0 24px', lineHeight: 1.6, color: 'var(--pure-black)', opacity: 0.8 }}>
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
