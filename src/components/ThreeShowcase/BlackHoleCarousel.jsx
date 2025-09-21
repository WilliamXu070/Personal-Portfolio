import React from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';

function OrbitingCard({ index, total }) {
  const meshRef = React.useRef();
  const radius = 2.2;
  const speed = 0.4 + index * 0.03;
  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed + (index / total) * Math.PI * 2;
    const x = Math.cos(t) * radius;
    const y = Math.sin(t) * (radius * 0.35);
    const z = Math.sin(t * 0.7) * 0.8;
    if (meshRef.current) {
      meshRef.current.position.set(x, y, z);
      meshRef.current.lookAt(0, 0, 0);
    }
  });
  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[0.8, 0.5, 1, 1]} />
      <meshStandardMaterial color={new THREE.Color().setHSL((index / total), 0.6, 0.6)} emissive={new THREE.Color().setHSL((index / total), 0.6, 0.2)} emissiveIntensity={1.0} />
    </mesh>
  );
}

export default function BlackHoleCarousel() {
  const count = 8;
  const hubRef = React.useRef();
  const matRef = React.useRef();
  const lastTexIdx = React.useRef(-1);

  // Resolve public paths respecting Vite base
  const resolvePublicPath = (p) => {
    const base = import.meta.env.BASE_URL || '/';
    const normalized = p.startsWith('/') ? p.slice(1) : p;
    return new URL(normalized, window.location.origin + base).pathname + window.location.search;
  };

  // Load a small sequence of textures from public/ to cycle through
  const texturePaths = [
    '/frame_00_delay-0.1s.png',
    '/frame_01_delay-0.1s.png',
    '/frame_02_delay-0.1s.png',
    '/frame_03_delay-0.1s.png',
    '/frame_04_delay-0.1s.png',
    '/frame_05_delay-0.1s.png',
    '/frame_06_delay-0.1s.png',
    '/frame_07_delay-0.1s.png',
    '/frame_08_delay-0.1s.png',
    '/frame_09_delay-0.1s.png',
    '/frame_10_delay-0.1s.png',
    '/frame_11_delay-0.1s.png',
  ];
  const resolvedPaths = texturePaths.map(resolvePublicPath);
  const textures = useTexture(resolvedPaths);
  textures.forEach(tex => { if (tex) tex.colorSpace = THREE.SRGBColorSpace; });

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (hubRef.current) {
      hubRef.current.rotation.x = t * 0.4;
      hubRef.current.rotation.y = t * 0.6;
    }
    // Cycle textures (preserve original PNG colors; no hue/emissive changes)
    if (matRef.current && Array.isArray(textures) && textures.length > 0) {
      const idx = Math.floor((t * 5) % textures.length);
      if (idx !== lastTexIdx.current) {
        const tex = textures[idx];
        if (tex && tex.image) {
          matRef.current.map = tex;
          matRef.current.needsUpdate = true;
          lastTexIdx.current = idx;
        }
      }
    }
  });
  return (
    <group>
      <mesh ref={hubRef}>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshStandardMaterial ref={matRef} color={new THREE.Color('#ffffff')} metalness={0.0} roughness={1.0} emissive={new THREE.Color('#000000')} emissiveIntensity={0.0} toneMapped={false} />
      </mesh>
      {Array.from({ length: count }).map((_, i) => (
        <OrbitingCard key={i} index={i} total={count} />
      ))}
    </group>
  );
}


