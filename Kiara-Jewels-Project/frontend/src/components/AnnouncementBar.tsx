'use client';
import React from 'react';

export default function AnnouncementBar() {
  return (
    <div className="announcement-bar">
      <div className="announcement-bar__marquee">
        <div className="announcement-bar__content">
          {[...Array(2)].map((_, i) => (
            <React.Fragment key={i}>
              <span className="announcement-bar__item">10% OFF YOUR FIRST ORDER • NO MINIMUM PURCHASE</span>
              <span className="announcement-bar__separator">✦</span>
              <span className="announcement-bar__item">₹3,000+ → 5% OFF</span>
              <span className="announcement-bar__separator">✦</span>
              <span className="announcement-bar__item">₹6,000+ → 10% OFF</span>
              <span className="announcement-bar__separator">✦</span>
              <span className="announcement-bar__item">FREE SHIPPING ACROSS INDIA</span>
              <span className="announcement-bar__separator">✦</span>
              <span className="announcement-bar__item">GET CUSTOM ORDERS READY WITHIN 3 DAYS</span>
              <span className="announcement-bar__separator">✦</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
