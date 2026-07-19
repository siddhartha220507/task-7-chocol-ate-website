import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const NUM_CUTS = 20;

const vertexShader = `
  uniform vec3 uCuts[${NUM_CUTS}];
  uniform float uTime;
  
  varying vec2 vUv;
  varying vec3 vNormal;
  varying float vDisplacement;
  
  // Simplex 3D Noise function (simplified for performance)
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

  float snoise(vec3 v){ 
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

    i = mod(i, 289.0 ); 
    vec4 p = permute( permute( permute( 
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    float n_ = 1.0/7.0; 
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );    

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
  }

  void main() {
    vUv = uv;
    vNormal = normal;
    
    vec3 pos = position;
    
    // Calculate distance to cuts
    float minC = 999.0;
    for(int i=0; i<${NUM_CUTS}; i++) {
      if(length(uCuts[i]) > 0.1) {
        float d = distance(pos, uCuts[i]);
        if(d < minC) {
          minC = d;
        }
      }
    }
    
    // Add noise to the cake surface
    float noise = snoise(pos * 2.0 + uTime * 0.1) * 0.1;
    
    // Create the "cut" trench
    float cutInfluence = smoothstep(1.0, 0.0, minC);
    
    vDisplacement = cutInfluence;
    
    // Deform vertices inward where the cut is
    if (pos.y > 0.0) { // Only deform top half
      pos.y -= cutInfluence * 1.5;
      pos.y += noise * (1.0 - cutInfluence); // Add rough texture outside cut
    }
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying float vDisplacement;
  
  void main() {
    // Cake exterior color (Chocolate Glaze)
    vec3 colorExterior = vec3(0.17, 0.10, 0.06); 
    
    // Cake interior color (Sponge)
    vec3 colorInterior = vec3(0.6, 0.4, 0.2); 
    
    // Lighting
    float light = dot(vNormal, normalize(vec3(1.0, 2.0, 1.0))) * 0.5 + 0.5;
    
    // Blend based on cut depth
    vec3 finalColor = mix(colorExterior, colorInterior, smoothstep(0.1, 0.8, vDisplacement));
    
    gl_FragColor = vec4(finalColor * light, 1.0);
  }
`;

export default function InteractiveCake() {
  const materialRef = useRef();
  const [cuts, setCuts] = useState(Array(NUM_CUTS).fill(new THREE.Vector3(999,999,999)));
  const nextCutIdx = useRef(0);
  
  const uniforms = useMemo(() => ({
    uCuts: { value: cuts },
    uTime: { value: 0 }
  }), []);

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta;
      materialRef.current.uniforms.uCuts.value = cuts;
    }
  });

  const handlePointerMove = (e) => {
    // Record the intersection point
    const { point } = e;
    
    setCuts(prev => {
      const newCuts = [...prev];
      newCuts[nextCutIdx.current] = point;
      nextCutIdx.current = (nextCutIdx.current + 1) % NUM_CUTS;
      return newCuts;
    });
  };

  return (
    <mesh 
      onPointerMove={handlePointerMove}
      position={[0, -1, 0]}
    >
      {/* High segment count for smooth deformation */}
      <cylinderGeometry args={[3, 3, 2, 128, 64]} />
      <shaderMaterial 
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        wireframe={false}
      />
    </mesh>
  );
}
