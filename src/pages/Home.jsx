import React, { Suspense, useLayoutEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ChocolateBarModel from '../components/ChocolateBarModel';
import ChocolateCakeModel from '../components/ChocolateCakeModel';
import NutParticles from '../components/NutParticles';
import DotField from '../components/DotField';
import ScrollFloat from '../components/ScrollFloat';
import ProductShowcase from '../components/ProductShowcase';
import VideoSection from '../components/VideoSection';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const canvasWrapRef = useRef(null);

  // Fade out the fixed 3D canvas as user scrolls into product section
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(canvasWrapRef.current, {
        opacity: 0,
        scrollTrigger: {
          trigger: '#story-end',
          start: 'top 60%',
          end: 'top 20%',
          scrub: true,
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div
      className="home-container"
      style={{ position: 'relative', width: '100%', backgroundColor: '#1c110a' }}
    >
      {/* ── Background dot field (fixed) ── */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <DotField
          dotRadius={1.5}
          dotSpacing={20}
          bulgeStrength={80}
          glowRadius={200}
          sparkle={true}
          waveAmplitude={0.5}
          gradientFrom="rgba(212, 163, 115, 0.35)"
          gradientTo="rgba(74, 107, 83, 0.25)"
          glowColor="#2b1a10"
        />
      </div>

      {/* ── Fixed 3D Canvas — both models ── */}
      <div
        ref={canvasWrapRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: '100%', height: '100%',
          zIndex: 1, pointerEvents: 'none',
        }}
      >
        <Canvas style={{ pointerEvents: 'auto' }}>
          <PerspectiveCamera makeDefault position={[0, 2, 10]} fov={45} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 10, 5]} intensity={1.8} />
          <pointLight position={[-5, 5, 5]} intensity={0.8} color="#d4a373" />

          <Suspense fallback={null}>
            <Environment preset="city" />
            {/* Main hero: chocolate bar — center stage */}
            <ChocolateBarModel />
            {/* Secondary: cake — lower right */}
            <ChocolateCakeModel position={[4, -2.8, -1.5]} />
            {/* Click nut particles */}
            <NutParticles />
          </Suspense>

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 2.2}
            minPolarAngle={Math.PI / 5}
          />
        </Canvas>
      </div>

      {/* ── Scrolling story content ── */}
      <div style={{ position: 'relative', zIndex: 2, pointerEvents: 'none' }}>

        {/* ── Section 1: HERO ── */}
        <section style={{
          height: '100vh',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center',
          textAlign: 'center', padding: '0 2rem',
        }}>
          <p style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '0.85rem', fontWeight: 600,
            letterSpacing: '0.25em', textTransform: 'uppercase',
            color: 'var(--accent-gold)', opacity: 0.7,
            marginBottom: '1.5rem',
          }}>
            ✦ Artisanal Chocolate &amp; Nut Cakes ✦
          </p>
          <ScrollFloat
            animationDuration={1.2}
            ease="back.inOut(2)"
            scrollStart="top bottom"
            scrollEnd="bottom top"
            stagger={0.05}
            textClassName="text-gradient"
          >
            Nutty Cocoa
          </ScrollFloat>
          <p style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.6rem)',
            color: 'var(--text-secondary)',
            marginTop: '2rem', maxWidth: '600px',
            lineHeight: 1.7,
            textShadow: '0 2px 10px rgba(0,0,0,0.9)',
          }}>
            Where the finest roasted nuts meet pure dark chocolate — every cake is a masterpiece.
          </p>
          <div style={{
            marginTop: '3.5rem', display: 'flex', gap: '1rem',
            pointerEvents: 'auto', flexWrap: 'wrap', justifyContent: 'center',
          }}>
            <a
              href="/products"
              style={{
                padding: '1rem 2.5rem',
                background: 'var(--accent-gold)',
                color: '#1c110a', fontSize: '1rem', fontWeight: 700,
                borderRadius: '50px', textDecoration: 'none',
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              Explore Collection
            </a>
            <a
              href="/story"
              style={{
                padding: '1rem 2.5rem',
                background: 'transparent',
                border: '1px solid rgba(212,163,115,0.4)',
                color: 'var(--accent-gold)', fontSize: '1rem', fontWeight: 600,
                borderRadius: '50px', textDecoration: 'none',
                fontFamily: "'Outfit', sans-serif",
                backdropFilter: 'blur(10px)',
              }}
            >
              Our Story
            </a>
          </div>

          {/* Click hint */}
          <p style={{
            marginTop: '5rem',
            fontSize: '0.8rem', color: 'rgba(212,163,115,0.5)',
            letterSpacing: '0.15em', textTransform: 'uppercase',
            fontFamily: "'Outfit', sans-serif",
            animation: 'float 3s ease-in-out infinite',
          }}>
            ↓ Click anywhere to drop nuts &nbsp;•&nbsp; Scroll to explore
          </p>
        </section>

        {/* ── Section 2: Handcrafted ── */}
        <section style={{
          height: '100vh', display: 'flex',
          alignItems: 'center', paddingLeft: '8vw',
        }}>
          <div style={{ maxWidth: '540px' }}>
            <ScrollFloat
              animationDuration={1}
              ease="power3.out"
              scrollStart="top center+=20%"
              scrollEnd="bottom center-=20%"
              stagger={0.03}
            >
              Handcrafted Artisanal
            </ScrollFloat>
            <p style={{
              fontSize: 'clamp(1rem, 1.5vw, 1.3rem)',
              color: 'var(--text-secondary)',
              marginTop: '2.5rem', lineHeight: 1.8,
              textShadow: '0 2px 5px rgba(0,0,0,0.8)',
            }}>
              Each creation begins with single-origin dark chocolate sourced from
              sustainable farms. Paired with the freshest seasonal nuts — hazelnut,
              walnut, almond and pistachio — our bakers craft every cake by hand,
              layering flavours that tell a story of the earth.
            </p>
            <div style={{
              marginTop: '2rem', display: 'flex', gap: '2rem',
              flexWrap: 'wrap',
            }}>
              {[['12+', 'Unique Flavours'], ['100%', 'Organic Nuts'], ['0', 'Preservatives']].map(([n, l]) => (
                <div key={l} style={{ textAlign: 'center' }}>
                  <div style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '2.5rem', fontWeight: 900,
                    background: 'linear-gradient(135deg, var(--accent-gold), #ffcf96)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  }}>{n}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 3: Roasted Perfection ── */}
        <section style={{
          height: '100vh', display: 'flex',
          alignItems: 'center', justifyContent: 'flex-end',
          paddingRight: '8vw',
        }}>
          <div style={{ maxWidth: '540px', textAlign: 'right' }}>
            <ScrollFloat
              animationDuration={1}
              ease="power3.out"
              scrollStart="top center+=20%"
              scrollEnd="bottom center-=20%"
              stagger={0.03}
            >
              Roasted Perfection
            </ScrollFloat>
            <p style={{
              fontSize: 'clamp(1rem, 1.5vw, 1.3rem)',
              color: 'var(--text-secondary)',
              marginTop: '2.5rem', lineHeight: 1.8,
              textShadow: '0 2px 5px rgba(0,0,0,0.8)',
            }}>
              Our nuts are slow-roasted at precisely 160 °C — unlocking deep, complex
              notes that raw nuts simply cannot achieve. We source only the finest earth-grown
              ingredients: Turkish hazelnuts, California almonds, and Iranian pistachios.
              Click and hold to see them fall.
            </p>
            <div style={{
              marginTop: '2.5rem',
              display: 'inline-flex',
              gap: '1rem', flexWrap: 'wrap', justifyContent: 'flex-end',
            }}>
              {['Hazelnut', 'Walnut', 'Almond', 'Pistachio', 'Cashew', 'Pecan'].map((n) => (
                <span key={n} style={{
                  padding: '0.35rem 1rem',
                  border: '1px solid rgba(212,163,115,0.3)',
                  borderRadius: '50px',
                  fontSize: '0.82rem',
                  color: 'var(--accent-gold)',
                  fontFamily: "'Outfit', sans-serif",
                  letterSpacing: '0.05em',
                }}>
                  {n}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 4: Pure Indulgence ── */}
        <section style={{
          height: '100vh', display: 'flex',
          alignItems: 'center', paddingLeft: '8vw',
        }}>
          <div style={{ maxWidth: '540px' }}>
            <ScrollFloat
              animationDuration={1}
              ease="power3.out"
              scrollStart="top center+=20%"
              scrollEnd="bottom center-=20%"
              stagger={0.03}
            >
              Pure Indulgence
            </ScrollFloat>
            <p style={{
              fontSize: 'clamp(1rem, 1.5vw, 1.3rem)',
              color: 'var(--text-secondary)',
              marginTop: '2.5rem', lineHeight: 1.8,
              textShadow: '0 2px 5px rgba(0,0,0,0.8)',
            }}>
              No artificial additives. No fillers. Just the honest depth of cocoa,
              the warmth of caramel, the crunch of perfectly roasted nuts — and your
              name on the box. Every NuttyCocoa cake is made fresh, to order.
            </p>
          </div>
        </section>

        {/* ── Section 5: Experience It (CTA) ── */}
        <section
          id="story-end"
          style={{
            height: '100vh', display: 'flex',
            flexDirection: 'column', justifyContent: 'center',
            alignItems: 'center', textAlign: 'center',
            padding: '0 2rem',
          }}
        >
          <ScrollFloat
            animationDuration={1.2}
            ease="bounce.out"
            scrollStart="top center+=20%"
            scrollEnd="bottom center-=20%"
            stagger={0.05}
            textClassName="text-gradient"
          >
            Experience It
          </ScrollFloat>
          <p style={{
            fontSize: 'clamp(1rem, 1.5vw, 1.3rem)',
            color: 'var(--text-secondary)',
            marginTop: '2rem', maxWidth: '500px', lineHeight: 1.7,
          }}>
            Discover our curated collection of artisanal chocolate nut cakes — each one
            a limited edition, available while ingredients last.
          </p>
          <div style={{
            marginTop: '3.5rem', display: 'flex', gap: '1rem',
            pointerEvents: 'auto', flexWrap: 'wrap', justifyContent: 'center',
          }}>
            <a
              href="/products"
              style={{
                padding: '1.1rem 3rem',
                background: 'var(--accent-gold)',
                color: '#1c110a', fontSize: '1.1rem', fontWeight: 700,
                borderRadius: '50px', textDecoration: 'none',
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              View The Collection
            </a>
          </div>
        </section>

      </div>
      {/* ── End fixed-canvas scroll content ── */}

      {/* ── Product Showcase (outside fixed canvas area) ── */}
      <div style={{ position: 'relative', zIndex: 3 }}>
        <ProductShowcase />
      </div>

      {/* ── Video Section ── */}
      <div style={{ position: 'relative', zIndex: 3 }}>
        <VideoSection />
      </div>

    </div>
  );
}
