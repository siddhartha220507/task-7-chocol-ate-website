import React, { useRef, useEffect } from 'react';
import { useGLTF, Float } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

useGLTF.preload('/models/chocolatebar/scene.gltf');

export default function ChocolateBarModel() {
  const { scene } = useGLTF('/models/chocolatebar/scene.gltf');
  const groupRef = useRef();

  useEffect(() => {
    if (scene && groupRef.current) {
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 5 / maxDim;

      scene.position.sub(center);
      groupRef.current.scale.setScalar(scale);
      groupRef.current.position.set(0, 0.5, 0);
    }
  }, [scene]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Base auto-rotation
      groupRef.current.rotation.y += delta * 0.15;
      
      // Mouse parallax (Spline-like interactive feel)
      const targetRotationX = (state.pointer.y * Math.PI) / 8;
      const targetRotationY = (state.pointer.x * Math.PI) / 8;
      
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, 0.1);
      // We add the target Y rotation on top of the auto-rotation implicitly by just leaning the Z axis slightly
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, -targetRotationY, 0.1);
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.6}>
      <group ref={groupRef}>
        <primitive object={scene} />
      </group>
    </Float>
  );
}
