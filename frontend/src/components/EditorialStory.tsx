'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import './EditorialStory.css';



export default function EditorialStory() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="about-page-wrapper">
      
      {/* SECTION 1 - HERO */}
      <section className="about-hero animate-on-scroll fade-up" ref={sectionRef}>
        <div className="about-hero__content">
          <span className="about-eyebrow">OUR STORY</span>
          <h1 className="about-hero__title">Jewellery With Meaning.</h1>
          <p className="about-hero__desc">
            "Designed for the moments you remember, the moments you celebrate, and the moments that simply become part of you."
          </p>
        </div>
        <div className="about-hero__image">
          <img 
            src="/images/about-us-images/about-hero.png" 
            alt="Jewellery With Meaning" 
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '4px', objectFit: 'cover' }} 
          />
        </div>
      </section>

      {/* SECTION 2 - OUR BEGINNING */}
      <section className="about-beginning animate-on-scroll fade-up">
        <div className="about-beginning__grid">
          <div className="about-beginning__text">
            <span className="about-eyebrow">OUR BEGINNING</span>
            <h2 className="about-heading">More Than Jewellery.</h2>
            <div className="about-body">
              <p>Kiara Jewels was created with a simple idea: jewellery should feel personal.</p>
              <p>Every piece is thoughtfully selected and designed to bring together elegance, individuality and everyday wearability. From delicate details to timeless silhouettes, each piece is created to become part of your story.</p>
            </div>
          </div>
          <div className="about-beginning__image">
            <img 
              src="/images/about-us-images/brand-story.png" 
              alt="Brand Story" 
              style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '4px', objectFit: 'cover' }} 
            />
          </div>
        </div>
      </section>

      {/* SECTION 3 - WHAT WE BELIEVE */}
      <section className="about-belief animate-on-scroll fade-up">
        <div className="about-belief__content">
          <span className="about-eyebrow">WHAT WE BELIEVE</span>
          <h2 className="about-belief__quote">
            "Jewellery shouldn't simply complete an outfit.<br />
            It should become part of your story."
          </h2>
          <div className="about-belief__divider"></div>
          <div className="about-belief__pillars">
            <span>DESIGN</span>
            <span>DETAIL</span>
            <span>EMOTION</span>
          </div>
        </div>
      </section>

      {/* SECTION 4 - THE ART OF CRAFTING */}
      <section className="about-crafting animate-on-scroll fade-up">
        <div className="about-crafting__intro">
          <span className="about-eyebrow">THE ART OF CRAFTING</span>
          <h2 className="about-heading">Every piece begins as an idea.</h2>
          <p className="about-body">
            "It takes shape through design, precision and countless small details — from the first concept to the final finish."
          </p>
        </div>
        <div className="about-crafting__hero">
          <img 
            src="/images/about-us-images/craftmanship-hero.jpg" 
            alt="The Art of Crafting" 
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '4px', objectFit: 'cover' }} 
          />
        </div>
      </section>

      {/* SECTION 5 - CRAFT PROCESS */}
      <section className="about-process animate-on-scroll fade-up">
        <div className="about-process__grid">
          
          <div className="process-block">
            <div className="process-image">
              <img src="/images/about-us-images/design-process.png" alt="Design Process" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '4px', objectFit: 'cover' }} />
            </div>
            <div className="process-text">
              <h3>DESIGN</h3>
              <p>"From an idea to a form, every detail begins with intention."</p>
            </div>
          </div>

          <div className="process-block">
            <div className="process-image">
              <img src="/images/about-us-images/setting-process.jpg" alt="Setting Process" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '4px', objectFit: 'cover' }} />
            </div>
            <div className="process-text">
              <h3>SETTING</h3>
              <p>"Precision brings every element together."</p>
            </div>
          </div>

          <div className="process-block">
            <div className="process-image">
              <img src="/images/about-us-images/finishing-process.jpg" alt="Finishing Process" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '4px', objectFit: 'cover' }} />
            </div>
            <div className="process-text">
              <h3>FINISHING</h3>
              <p>"The final details create the character of every piece."</p>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 6 - FULL-WIDTH EMOTIONAL IMAGE */}
      <section className="about-emotional animate-on-scroll fade-up">
        <div className="about-emotional__image">
          <img 
            src="/images/about-us-images/lifestyle-jewellery.png" 
            alt="Lifestyle Jewellery" 
            style={{ width: '100%', height: 'auto', minHeight: '400px', display: 'block', objectFit: 'cover' }} 
          />
          <div className="about-emotional__overlay">
            <h2 className="about-emotional__text">
              JEWELLERY MADE TO<br />
              BE REMEMBERED
            </h2>
          </div>
        </div>
      </section>

      {/* SECTION 7 - THE KIARA STANDARD */}
      <section className="about-standard animate-on-scroll fade-up">
        <div className="about-standard__intro">
          <span className="about-eyebrow">THE KIARA STANDARD</span>
          <h2 className="about-heading">Details Make The Difference.</h2>
        </div>
        <div className="about-standard__grid">
          <div className="standard-block">
            <span className="standard-num">01</span>
            <h3>INTENTIONAL DESIGN</h3>
            <p>"Pieces chosen with purpose."</p>
          </div>
          <div className="standard-block">
            <span className="standard-num">02</span>
            <h3>REFINED DETAIL</h3>
            <p>"Because the smallest details matter."</p>
          </div>
          <div className="standard-block">
            <span className="standard-num">03</span>
            <h3>EVERYDAY ELEGANCE</h3>
            <p>"Designed to move effortlessly with you."</p>
          </div>
          <div className="standard-block">
            <span className="standard-num">04</span>
            <h3>MADE FOR YOUR MOMENTS</h3>
            <p>"Jewellery that becomes part of your story."</p>
          </div>
        </div>
      </section>

      {/* SECTION 8 - CRAFTED WITH CARE */}
      <section className="about-specs animate-on-scroll fade-up">
        <div className="about-specs__grid">
          <div className="about-specs__text">
            <span className="about-eyebrow">CRAFTED WITH CARE</span>
            <h2 className="about-heading">Thoughtful Details.<br/>Refined Finish.</h2>
            
            <div className="specs-list">
              <div className="spec-item">
                <span className="spec-value">92.5%</span>
                <span className="spec-label">STERLING SILVER</span>
              </div>
              <div className="spec-item">
                <span className="spec-value">Premium Quality</span>
                <span className="spec-label">CZ STONES</span>
              </div>
            </div>
          </div>
          <div className="about-specs__image">
            <img 
              src="/images/about-us-images/jewellery-detail.png" 
              alt="Jewellery Details" 
              style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '4px', objectFit: 'cover' }} 
            />
          </div>
        </div>
      </section>

      {/* SECTION 9 - CLOSING BRAND STATEMENT */}
      <section className="about-closing animate-on-scroll fade-up">
        <div className="about-closing__content">
          <h2 className="about-heading">JEWELLERY FOR YOUR STORY</h2>
          <div className="about-closing__desc">
            <p>"For the little celebrations.</p>
            <p>For the unforgettable moments.</p>
            <p>For everything in between."</p>
          </div>
          <Link href="/rings" className="about-cta">
            EXPLORE THE COLLECTION
          </Link>
        </div>
      </section>

    </div>
  );
}
