import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { products } from '../data/products';
import './ProductShowcase.css';

gsap.registerPlugin(ScrollTrigger);

// Use first 5 products
const SHOWCASE_PRODUCTS = products.slice(0, 5);

export default function ProductShowcase() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const cardsRef = useRef([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    // Horizontal pin-scroll: pin the section while all cards scroll through
    const totalCards = SHOWCASE_PRODUCTS.length;

    const ctx = gsap.context(() => {
      // Pin the entire section, scroll through each card
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 0.8,
          start: 'top top',
          end: () => `+=${window.innerWidth * (totalCards - 1)}`,
          anticipatePin: 1,
        },
      });

      // Translate the track left to reveal each card
      tl.to(track, {
        xPercent: -100 * (totalCards - 1),
        ease: 'none',
      });

      // Intersection Observer for cards entrance animations
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
            }
          });
        },
        { threshold: 0.4 } // Trigger when 40% of the card is visible
      );

      cardsRef.current.forEach((card) => {
        if (card) observer.observe(card);
      });
      
      return () => observer.disconnect();
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="ps-section">
      {/* Section label */}
      <div className="ps-label">
        <span>Our Collection</span>
      </div>

      {/* Scrollable track */}
      <div className="ps-viewport">
        <div className="ps-track" ref={trackRef}>
          {SHOWCASE_PRODUCTS.map((product, i) => (
            <div
              key={product.id}
              className="ps-card"
              ref={(el) => (cardsRef.current[i] = el)}
            >
              {/* Left: Image */}
              <div className="ps-image-side">
                <img
                  src={product.image}
                  alt={product.name}
                  className="ps-img"
                />
                <div className="ps-card-number">
                  {String(i + 1).padStart(2, '0')} / {String(SHOWCASE_PRODUCTS.length).padStart(2, '0')}
                </div>
                <div className="ps-flavor-tag">{product.flavor}</div>
              </div>

              {/* Right: Details */}
              <div className="ps-text-block">
                <p className="ps-eyebrow">Featured Cake</p>
                <h2 className="ps-title">{product.name}</h2>
                <p className="ps-desc">{product.description}</p>
                <div className="ps-price">${product.price}</div>
                <button className="ps-btn">
                  Order Now
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress dots */}
      <ProgressDots count={SHOWCASE_PRODUCTS.length} sectionRef={sectionRef} />
    </section>
  );
}

function ProgressDots({ count, sectionRef }) {
  const dotsRef = useRef([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      dotsRef.current.forEach((dot, i) => {
        if (!dot) return;
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: () => `top top-=${window.innerWidth * i * 0.98 - 50}`,
          end: () => `top top-=${window.innerWidth * (i + 1) * 0.98 - 50}`,
          onEnter: () => setActive(i),
          onEnterBack: () => setActive(i),
        });
      });

      function setActive(idx) {
        dotsRef.current.forEach((d, i) => {
          if (!d) return;
          d.classList.toggle('active', i === idx);
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="ps-dots">
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          ref={(el) => (dotsRef.current[i] = el)}
          className={`ps-dot ${i === 0 ? 'active' : ''}`}
        />
      ))}
    </div>
  );
}
