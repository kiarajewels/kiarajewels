'use client';
import React, { useState } from 'react';

const faqs = [
  {
    question: "What material is your jewellery made of?",
    answer: "Every piece is crafted from 925 Sterling Silver, ensuring premium quality, lasting beauty, and timeless elegance."
  },
  {
    question: "Is the jewellery waterproof?",
    answer: "Yes, our jewellery is designed to be waterproof, sweatproof, and tarnish-free, making it suitable for everyday wear."
  },
  {
    question: "How long will my order take to arrive?",
    answer: "Each piece is carefully prepared before dispatch. Orders typically take approximately 7 days, including around 4 days for product manufacturing and 3 days for delivery."
  },
  {
    question: "Can I return my order?",
    answer: "Yes. You can request a return within 2 days of delivery, subject to our product inspection and return conditions."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq" id="faq-section">
      <h2 className="faq__heading">Frequently Asked Questions</h2>
      <div className="faq__container">
        {faqs.map((faq, index) => (
          <div
            key={index} 
            className={`faq__item ${openIndex === index ? 'active' : ''}`}
          >
            <button 
              className="faq__question" 
              onClick={() => toggleFaq(index)}
              aria-expanded={openIndex === index}
              style={{ width: '100%', border: 'none', background: 'transparent' }}
            >
              {faq.question}
              <span className="faq__icon material-symbols-outlined" style={{ transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>
                expand_more
              </span>
            </button>
            <div 
              style={{
                display: 'grid',
                gridTemplateRows: openIndex === index ? '1fr' : '0fr',
                transition: 'grid-template-rows 0.3s ease',
                backgroundColor: '#c9c2b4'
              }}
            >
              <div style={{ overflow: 'hidden' }}>
                <div style={{ padding: '0 24px 24px 24px', margin: 0, color: '#ffffff', lineHeight: '1.6', fontFamily: "'Abyssinica SIL', serif", textAlign: 'right', fontSize: 'clamp(1.25rem, 3vw, 1.8rem)' }}>
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '16px' }}>
                    {faq.answer}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
