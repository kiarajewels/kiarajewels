'use client';
import React from 'react';

const reviews = [
  {
    name: "Priya Sharma",
    product: "Diamond Ring",
    text: "The ring looks even more beautiful in person. The stone has a lovely sparkle, and the design feels elegant without being too flashy. I've received so many compliments already!"
  },
  {
    name: "Ananya Mehta",
    product: "Earrings",
    text: "Absolutely in love with these earrings! They're lightweight, comfortable enough for all-day wear, and instantly elevate even a simple outfit. The finishing is beautiful."
  },
  {
    name: "Sneha Jain",
    product: "Bracelet",
    text: "Such a delicate and classy bracelet. I was looking for something elegant for everyday wear, and this was perfect. The quality and detailing genuinely exceeded my expectations."
  },
  {
    name: "Riya Agarwal",
    product: "Pendant",
    text: "The pendant is stunning! It has the perfect balance of sparkle and sophistication. I wore it to a family function and everyone kept asking me where I got it from."
  },
  {
    name: "Kavya Nair",
    product: "Statement Ring",
    text: "I was honestly a little unsure before ordering online, but I'm so happy I did. The ring feels premium, fits beautifully, and looks exactly as elegant as the pictures."
  },
  {
    name: "Ishita Verma",
    product: "Jewellery Collection",
    text: "This was my first purchase, and definitely won't be my last. The jewellery feels thoughtfully designed and beautifully crafted. Everything from the packaging to the product felt premium."
  }
];

export default function ReviewSection() {
  return (
    <section className="reviews" id="reviews-section" style={{ backgroundColor: '#000000', color: '#ffffff', padding: '60px 20px' }}>
      <h2 className="reviews__heading" style={{ color: '#ffffff' }}>What Our Customers Say</h2>
      <div className="reviews__grid">
        {reviews.map((review, index) => (
          <div key={index} className="review-card" style={{ backgroundColor: '#1a1a1a', borderColor: '#333333', color: '#ffffff' }}>
            <div className="review-card__stars" style={{ color: '#FFD700' }}>★★★★★</div>
            <h3 className="review-card__name" style={{ color: '#ffffff' }}>{review.name} — {review.product}</h3>
            <p className="review-card__text" style={{ color: '#cccccc' }}>“{review.text}”</p>
          </div>
        ))}
      </div>
    </section>
  );
}
