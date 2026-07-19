import React, { useRef, useLayoutEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, PresentationControls } from '@react-three/drei';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import './Hero.css'; // Reusing some base hero styles if needed

gsap.registerPlugin(ScrollTrigger);

function ChocolatePiece({ position, targetPosition, rotation, targetRotation, scrollRef }) {
  const meshRef = useRef();

  useLayoutEffect(() => {
    if (meshRef.current) {
      // Setup animation tied to scroll
      const ctx = gsap.context(() => {
        gsap.to(meshRef.current.position, {
          x: targetPosition[0],
          y: targetPosition[1],
          z: targetPosition[2],
          ease: "none",
          scrollTrigger: {
            trigger: ".hero3d-container",
            start: "top top",
            end: "bottom top",
            scrub: 1,
          }
        });
        
        gsap.to(meshRef.current.rotation, {
          x: targetRotation[0],
          y: targetRotation[1],
          z: targetRotation[2],
          ease: "none",
          scrollTrigger: {
            trigger: ".hero3d-container",
            start: "top top",
            end: "bottom top",
            scrub: 1,
          }
        });
      });
      return () => ctx.revert();
    }
  }, [targetPosition, targetRotation]);

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={[2, 2, 0.5]} />
      <meshStandardMaterial 
        color="#3a2618" 
        roughness={0.2}
        metalness={0.1}
        envMapIntensity={1}
      />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <Environment preset="city" />
      
      <PresentationControls
        global={false}
        cursor={false}
        snap={true}
        speed={1}
        zoom={1}
        rotation={[0, 0, 0]}
        polar={[-Math.PI / 4, Math.PI / 4]}
        azimuth={[-Math.PI / 4, Math.PI / 4]}
      >
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
          <group position={[0, 0, 0]}>
            {/* Left Piece */}
            <ChocolatePiece 
              position={[-1.02, 0, 0]} 
              targetPosition={[-3, -1, 1]}
              rotation={[0, 0, 0]}
              targetRotation={[-0.5, -1, -0.2]}
            />
            {/* Right Piece */}
            <ChocolatePiece 
              position={[1.02, 0, 0]} 
              targetPosition={[3, 1, 2]}
              rotation={[0, 0, 0]}
              targetRotation={[0.5, 1, 0.2]}
            />
          </group>
        </Float>
      </PresentationControls>
    </>
  );
}

export default function Hero3D() {
  return (
    <section className="hero3d-container" style={{ height: '150vh', position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100%', zIndex: 1 }}>
        <Canvas shadows camera={{ position: [0, 0, 8], fov: 45 }}>
          <Scene />
        </Canvas>
        <div 
          className="hero-content" 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            textAlign: 'center',
            width: '100%',
            zIndex: 2
          }}
        >
          <h1 className="text-gradient" style={{ fontSize: '5rem', marginBottom: '1rem', textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>Unwrap the Magic</h1>
          <p style={{ fontSize: '1.5rem', color: '#fff', textShadow: '0 2px 5px rgba(0,0,0,0.5)' }}>Scroll to discover pure indulgence</p>
        </div>
      </div>
    </section>
  );
}
