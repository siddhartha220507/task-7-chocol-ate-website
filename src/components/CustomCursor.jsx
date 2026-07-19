import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import cursorImg from '../assets/cursor.png';
import './CustomCursor.css';

// Nut images — walnut/almond/pistachio, each used multiple times for variety
import walnutImg from '../assets/walnut.png';
import almondImg from '../assets/almonds.png';
import pistachioImg from '../assets/pichtachious.png';

const NUT_IMAGES = [
  walnutImg, walnutImg, walnutImg,
  almondImg, almondImg,
  pistachioImg, pistachioImg,
];

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const [nuts, setNuts] = useState([]);
  const nutIdCounter = useRef(0);

  useEffect(() => {
    const cursor = cursorRef.current;

    const moveCursor = (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        scale: 0.4,
        duration: 0.08,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', moveCursor);

    const handleClick = (e) => {
      // Spawn 4–6 nuts per click
      const count = 4 + Math.floor(Math.random() * 3);
      const newNuts = Array.from({ length: count }, () => {
        nutIdCounter.current += 1;
        return {
          id: nutIdCounter.current,
          x: e.clientX,
          y: e.clientY,
          img: NUT_IMAGES[Math.floor(Math.random() * NUT_IMAGES.length)],
          vx: (Math.random() - 0.5) * 260,          // horizontal spread
          launchVy: -(Math.random() * 220 + 100),    // initial upward kick
          rotation: Math.random() * 640 - 320,
          size: 44 + Math.floor(Math.random() * 28), // 44–72px
        };
      });

      setNuts((prev) => [...prev, ...newNuts]);

      // Remove after full fall animation duration (2.4s)
      setTimeout(() => {
        const ids = new Set(newNuts.map((n) => n.id));
        setNuts((prev) => prev.filter((n) => !ids.has(n.id)));
      }, 2600);
    };

    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <>
      <img
        ref={cursorRef}
        src={cursorImg}
        alt=""
        className="custom-cursor-img"
      />

      {nuts.map((nut) => (
        <NutParticle key={nut.id} nut={nut} />
      ))}
    </>
  );
}

function NutParticle({ nut }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Distance from click Y to bottom of viewport
    const distToBottom = window.innerHeight - nut.y + nut.size;

    // Phase 1: burst upward with spread
    // Phase 2: gravity pulls to bottom of screen
    const tl = gsap.timeline();

    tl.fromTo(
      el,
      { x: nut.x, y: nut.y, scale: 1, opacity: 1, rotation: 0 },
      {
        x: nut.x + nut.vx * 0.5,
        y: nut.y + nut.launchVy, // jump up first
        scale: 1.1,
        rotation: nut.rotation * 0.4,
        duration: 0.45,
        ease: 'power2.out',
      }
    ).to(el, {
      // Then fall all the way to viewport bottom
      x: nut.x + nut.vx,
      y: nut.y + distToBottom + nut.size,
      scale: 0.6,
      opacity: 0,
      rotation: nut.rotation,
      duration: 1.9,
      ease: 'power3.in',
    });

    return () => tl.kill();
  }, [nut]);

  return (
    <img
      ref={ref}
      src={nut.img}
      alt=""
      className="nut-particle"
      style={{ width: nut.size, height: nut.size }}
    />
  );
}
