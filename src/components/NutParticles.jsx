import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// All 3 nut PNGs — each repeated 2-3x for variety
import walnutImg from '../assets/walnut.png';
import almondImg from '../assets/almonds.png';
import pistachioImg from '../assets/pichtachious.png';

const MAX_PARTICLES = 60;
const DUMMY = new THREE.Object3D();

// Preload all 3 textures
const textureLoader = new THREE.TextureLoader();
const NUT_TEXTURES_PATHS = [
  walnutImg,
  walnutImg,
  walnutImg,
  almondImg,
  almondImg,
  pistachioImg,
  pistachioImg,
];

export default function NutParticles() {
  const { viewport, mouse } = useThree();
  const [nutTextures, setNutTextures] = useState([]);

  // Load textures once
  useEffect(() => {
    const textures = NUT_TEXTURES_PATHS.map((src) => {
      const t = textureLoader.load(src);
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    });
    setNutTextures(textures);
    return () => textures.forEach((t) => t.dispose());
  }, []);

  // Each particle bin holds its own mesh ref + particles array
  const bins = useMemo(() => {
    return Array.from({ length: NUT_TEXTURES_PATHS.length }, () => ({
      meshRef: React.createRef(),
      particles: Array.from({ length: Math.ceil(MAX_PARTICLES / NUT_TEXTURES_PATHS.length) }, () => ({
        position: new THREE.Vector3(0, 1000, 0),
        velocity: new THREE.Vector3(0, 0, 0),
        active: false,
        life: 0,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 5,
      })),
      nextIdx: { current: 0 },
    }));
  }, []);

  const spawnRef = useRef(false);

  useEffect(() => {
    const handleDown = () => { spawnRef.current = true; };
    const handleUp   = () => { spawnRef.current = false; };
    window.addEventListener('pointerdown', handleDown);
    window.addEventListener('pointerup',   handleUp);
    return () => {
      window.removeEventListener('pointerdown', handleDown);
      window.removeEventListener('pointerup',   handleUp);
    };
  }, []);

  useFrame((state, delta) => {
    if (nutTextures.length === 0) return;

    const worldX = (mouse.x * viewport.width)  / 2;
    const worldY = (mouse.y * viewport.height) / 2;

    bins.forEach((bin, bi) => {
      const mesh = bin.meshRef.current;
      if (!mesh) return;

      // Spawn
      if (spawnRef.current) {
        const idx = bin.nextIdx.current;
        const p = bin.particles[idx];
        p.position.set(
          worldX + (Math.random() - 0.5) * 0.8,
          worldY + (Math.random() - 0.5) * 0.8,
          (Math.random() - 0.5) * 0.5
        );
        p.velocity.set(
          (Math.random() - 0.5) * 3,
          -1.5 - Math.random() * 3,
          (Math.random() - 0.5) * 1
        );
        p.active = true;
        p.life = 1.0;
        p.rotation = Math.random() * Math.PI * 2;
        p.rotSpeed = (Math.random() - 0.5) * 6;
        bin.nextIdx.current = (idx + 1) % bin.particles.length;
      }

      // Update physics
      bin.particles.forEach((p, i) => {
        if (p.active) {
          p.velocity.y -= 9.8 * delta;
          p.position.addScaledVector(p.velocity, delta);
          
          // Only rotate if it's still moving significantly
          if (Math.abs(p.velocity.y) > 0.1 || Math.abs(p.velocity.x) > 0.1) {
            p.rotation += p.rotSpeed * delta;
          }
          
          p.life -= delta * 0.5;

          // Virtual Floor at y = -3.5
          const FLOOR_Y = -3.5;
          if (p.position.y <= FLOOR_Y) {
            p.position.y = FLOOR_Y;
            p.velocity.y *= -0.4; // Bounce dampening
            p.velocity.x *= 0.8;  // Friction
            p.velocity.z *= 0.8;
            
            // If moving very slowly, stop it completely so it rests
            if (Math.abs(p.velocity.y) < 0.2) {
              p.velocity.y = 0;
            }
            if (Math.abs(p.velocity.x) < 0.1) {
              p.velocity.x = 0;
            }
          }

          DUMMY.position.copy(p.position);
          DUMMY.rotation.set(0, 0, p.rotation);
          // Don't fade out based on life. Just grow slightly at spawn and stay at full size.
          const sc = Math.min(1, p.life + 1) * 0.4; // Quickly reach 0.4 scale and stay
          DUMMY.scale.set(sc, sc, sc);
          DUMMY.updateMatrix();
          mesh.setMatrixAt(i, DUMMY.matrix);
        } else {
          // Keep hidden if not spawned yet
          DUMMY.position.set(0, 1000, 0);
          DUMMY.scale.set(0, 0, 0);
          DUMMY.updateMatrix();
          mesh.setMatrixAt(i, DUMMY.matrix);
        }
      });

      mesh.instanceMatrix.needsUpdate = true;
    });
  });

  if (nutTextures.length === 0) return null;

  const perBin = Math.ceil(MAX_PARTICLES / NUT_TEXTURES_PATHS.length);

  return (
    <group>
      {bins.map((bin, bi) => (
        <instancedMesh
          key={bi}
          ref={bin.meshRef}
          args={[null, null, perBin]}
        >
          {/* Flat quad (PlaneGeometry) so the PNG texture looks right */}
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={nutTextures[bi]}
            transparent={true}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </instancedMesh>
      ))}
    </group>
  );
}
