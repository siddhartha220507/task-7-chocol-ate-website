import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import './VideoSection.css';

gsap.registerPlugin(ScrollTrigger);

const TEXT_STAGES = [
  { progress: 0.1, heading: 'Pure Chocolate', sub: 'Sourced from the finest cocoa farms on earth' },
  { progress: 0.35, heading: 'Crafted with Passion', sub: 'Every bar is an expression of artisanal mastery' },
  { progress: 0.65, heading: 'Roasted to Perfection', sub: 'Nuts slow-roasted at 160°C for unrivalled depth' },
  { progress: 0.88, heading: 'NuttyCocoa', sub: 'Indulgence, redefined.' },
];

export default function VideoSection() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const textRef = useRef(null);
  const headingRef = useRef(null);
  const subRef = useRef(null);
  const stageIdxRef = useRef(-1);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    // Wait for video metadata so we know the duration
    const setup = () => {
      const duration = video.duration || 5;

      const ctx = gsap.context(() => {
        // Pin the section and scrub video playback
        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: '+=300%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          onUpdate: (self) => {
            // Drive video currentTime from scroll progress safely
            if (!isNaN(duration) && video.readyState >= 1) {
              try {
                video.currentTime = self.progress * duration;
              } catch (e) {
                // Ignore DOMException if browser blocks scrubbing before interaction
              }
            } else if (video.readyState >= 2) {
                // Fallback: Just ensure it's playing if scrubbing fails or isn't ready
                if (video.paused && self.isActive) video.play().catch(()=>{});
                else if (!video.paused && !self.isActive) video.pause();
            }

            // Text stage transitions
            let nextIdx = -1;
            for (let i = TEXT_STAGES.length - 1; i >= 0; i--) {
              if (self.progress >= TEXT_STAGES[i].progress) {
                nextIdx = i;
                break;
              }
            }

            if (nextIdx !== stageIdxRef.current) {
              stageIdxRef.current = nextIdx;
              const stage = TEXT_STAGES[nextIdx] ?? null;
              const heading = headingRef.current;
              const sub = subRef.current;
              const textBlock = textRef.current;

              if (!heading || !sub || !textBlock) return;

              if (stage) {
                gsap.fromTo(
                  [heading, sub],
                  { opacity: 0, y: 40 },
                  { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: 'power2.out', overwrite: true }
                );
                heading.textContent = stage.heading;
                sub.textContent = stage.sub;
                textBlock.style.opacity = '1';
              } else {
                textBlock.style.opacity = '0';
              }
            }
          },
        });
      }, section);

      return () => ctx.revert();
    };

    let cleanup;
    if (video.readyState >= 1) {
      cleanup = setup();
    } else {
      video.addEventListener('loadedmetadata', () => {
        cleanup = setup();
      }, { once: true });
    }

    return () => {
      cleanup?.();
    };
  }, []);

  return (
    <section ref={sectionRef} className="vs-section">
      {/* Dark overlay above the video */}
      <div className="vs-overlay" />

      {/* The chocolate animation video */}
      <video
        ref={videoRef}
        className="vs-video"
        src="/chocolate-animation.mp4"
        muted
        playsInline
        preload="auto"
      />

      {/* Text that appears at scroll stages */}
      <div ref={textRef} className="vs-text">
        <div className="vs-text-inner">
          <div className="vs-line" />
          <h2 ref={headingRef} className="vs-heading">Pure Chocolate</h2>
          <p ref={subRef} className="vs-sub">Sourced from the finest cocoa farms on earth</p>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="vs-scroll-hint">
        <span>Scroll to experience</span>
        <div className="vs-scroll-bar">
          <div className="vs-scroll-fill" />
        </div>
      </div>
    </section>
  );
}
