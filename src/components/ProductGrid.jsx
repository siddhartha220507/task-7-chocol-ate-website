import React, { useLayoutEffect, useRef } from 'react';
import { ShoppingCart } from 'lucide-react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { products } from '../data/products';
import './ProductGrid.css';

gsap.registerPlugin(ScrollTrigger);

const ProductGrid = () => {
  const containerRef = useRef();
  const wrapperRef = useRef();

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Horizontal scroll effect
      const sections = gsap.utils.toArray('.product-panel');
      
      gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          snap: 1 / (sections.length - 1),
          end: () => "+=" + wrapperRef.current.offsetWidth
        }
      });

      // Hover effects for images
      sections.forEach(sec => {
        const img = sec.querySelector('.product-image');
        sec.addEventListener('mouseenter', () => gsap.to(img, { scale: 1.1, duration: 0.5 }));
        sec.addEventListener('mouseleave', () => gsap.to(img, { scale: 1, duration: 0.5 }));
      });
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  const handleAddToCart = (e, product) => {
    // Unique Add To Cart Animation
    const btn = e.currentTarget;
    const cartIcon = document.querySelector('.cart-btn'); // From Navbar
    
    // Create clone
    const clone = btn.cloneNode(true);
    const rect = btn.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();
    
    clone.style.position = 'fixed';
    clone.style.top = rect.top + 'px';
    clone.style.left = rect.left + 'px';
    clone.style.margin = 0;
    clone.style.zIndex = 10000;
    clone.style.pointerEvents = 'none';
    
    document.body.appendChild(clone);
    
    gsap.to(clone, {
      x: cartRect.left - rect.left,
      y: cartRect.top - rect.top,
      scale: 0.2,
      opacity: 0,
      duration: 0.8,
      ease: "power3.inOut",
      onComplete: () => {
        clone.remove();
        // Pop the cart icon
        gsap.fromTo(cartIcon, 
          { scale: 1.5 }, 
          { scale: 1, duration: 0.3, ease: "back.out(2)" }
        );
      }
    });
  };

  return (
    <div className="horizontal-scroll-container" ref={containerRef} style={{ overflowX: 'hidden' }}>
      <div className="horizontal-scroll-wrapper" ref={wrapperRef} style={{ display: 'flex', width: `${products.length * 100}vw`, height: '100vh' }}>
        {products.map((product) => (
          <div key={product.id} className="product-panel" style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5vw' }}>
            <div className="product-card-heavy glass" style={{ display: 'flex', width: '100%', maxWidth: '1200px', height: '70vh', borderRadius: '30px', overflow: 'hidden' }}>
              
              <div className="product-image-side" style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                <img src={product.image} alt={product.name} className="product-image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '20px', left: '20px', background: 'var(--accent-gold)', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold', color: '#1c110a' }}>
                  {product.flavor}
                </div>
              </div>

              <div className="product-details-side" style={{ flex: 1, padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h2 style={{ fontSize: '4rem', marginBottom: '1rem', lineHeight: 1 }} className="text-gradient">{product.name}</h2>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>{product.description}</p>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '3rem' }}>${product.price}</div>
                
                <button 
                  className="heavy-add-btn" 
                  onClick={(e) => handleAddToCart(e, product)}
                  style={{
                    background: 'var(--accent-gold)',
                    color: '#1c110a',
                    padding: '1rem 2rem',
                    borderRadius: '50px',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: 'max-content',
                    cursor: 'none' // For CustomCursor
                  }}
                >
                  <ShoppingCart />
                  <span style={{ cursor: 'none' }}>Add to Cart</span>
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
