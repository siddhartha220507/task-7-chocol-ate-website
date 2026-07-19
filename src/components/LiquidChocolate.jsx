import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

export default function LiquidChocolate() {
  const meshRef = useRef();
  const materialRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Animate the distortion based on hover state
  useFrame((state, delta) => {
    if (materialRef.current) {
      // Smoothly interpolate the distort factor
      const targetDistort = hovered ? 0.6 : 0.3;
      const targetSpeed = hovered ? 4 : 2;
      
      materialRef.current.distort = THREE.MathUtils.lerp(materialRef.current.distort, targetDistort, delta * 2);
      materialRef.current.speed = THREE.MathUtils.lerp(materialRef.current.speed, targetSpeed, delta * 2);
    }
    
    if (meshRef.current) {
      // Gentle rotation
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh 
        ref={meshRef} 
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={2}
      >
        <sphereGeometry args={[1, 128, 128]} />
        <MeshDistortMaterial
          ref={materialRef}
          color="#2b1a10" // Rich dark chocolate
          envMapIntensity={2}
          clearcoat={1}
          clearcoatRoughness={0.1}
          metalness={0.8}
          roughness={0.2}
          distort={0.3}
          speed={2}
        />
      </mesh>
    </Float>
  );
}
