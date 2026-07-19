import React, { useRef, useEffect } from 'react';
import { useGLTF, Float } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

useGLTF.preload('/models/chocolate_berry_cake/scene.gltf');

export default function ChocolateCakeModel({ position = [3.5, -2.5, -1] }) {
  const { scene } = useGLTF('/models/chocolate_berry_cake/scene.gltf');
  const groupRef = useRef();
  const cloneRef = useRef();

  useEffect(() => {
    // Clone so both models can be in scene at same time
    const cloned = scene.clone(true);
    cloneRef.current = cloned;

    if (groupRef.current) {
      const box = new THREE.Box3().setFromObject(cloned);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 2.5 / maxDim;

      cloned.position.sub(center);
      groupRef.current.scale.setScalar(scale);
      groupRef.current.add(cloned);
    }

    return () => {
      if (groupRef.current && cloneRef.current) {
        groupRef.current.remove(cloneRef.current);
      }
    };
  }, [scene]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Base auto-rotation (spins slowly opposite way)
      groupRef.current.rotation.y -= delta * 0.1;
      
      // Mouse parallax
      const targetRotationX = (state.pointer.y * Math.PI) / 12;
      const targetRotationY = (state.pointer.x * Math.PI) / 12;
      
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, 0.08);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, -targetRotationY, 0.08);
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={0.4} floatIntensity={1}>
      <group ref={groupRef} position={position} />
    </Float>
  );
}
