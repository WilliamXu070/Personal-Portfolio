import React, { useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

export default function ParticleSignature({ text = 'Signature' }) {
  const gl = useThree((s) => s.gl);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const count = isMobile ? 2000 : 8000;

  // Generate target positions from text rendered to offscreen canvas
  const targets = useMemo(() => {
    const canvas = document.createElement('canvas');
    const size = 512;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const padding = Math.floor(size * 0.08);
    const initialSize = size * 0.28;
    ctx.font = `bold ${initialSize}px system-ui, -apple-system, Segoe UI, Roboto, sans-serif`;
    const metrics = ctx.measureText(text);
    const desiredWidth = size - padding * 2;
    const scale = metrics.width > 0 ? desiredWidth / metrics.width : 1.0;
    const finalSize = Math.max(10, Math.min(initialSize * scale, size * 0.5));
    ctx.font = `bold ${finalSize}px system-ui, -apple-system, Segoe UI, Roboto, sans-serif`;

    ctx.fillText(text, size / 2, size / 2);
    const img = ctx.getImageData(0, 0, size, size).data;
    const points = [];
    const step = 2;
    for (let y = 0; y < size; y += step) {
      for (let x = 0; x < size; x += step) {
        const i = (y * size + x) * 4;
        if (img[i + 3] > 128) {
          const px = (x / size - 0.5) * 4.2; // slightly wider to ensure edges visible
          const py = (0.5 - y / size) * 1.6;
          points.push(px, py, 0);
        }
      }
    }
    return new Float32Array(points);
  }, [text]);

  const fromPositions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 5;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }
    return arr;
  }, [count]);

  const targetPositions = useMemo(() => {
    // Sample from targets to match count
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const ti = (i % (targets.length / 3)) * 3;
      arr[i * 3 + 0] = targets[ti + 0] + (Math.random() - 0.5) * 0.02;
      arr[i * 3 + 1] = targets[ti + 1] + (Math.random() - 0.5) * 0.02;
      arr[i * 3 + 2] = targets[ti + 2];
    }
    return arr;
  }, [targets, count]);

  const positions = useMemo(() => fromPositions.slice(0), [fromPositions]);
  const velocities = useMemo(() => new Float32Array(count * 3), [count]);
  const pointsRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const mouse = useRef(new THREE.Vector3());

  useEffect(() => {
    const handleMove = (e) => {
      const rect = gl.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouse.current.set(x * 2.5, y * 1.5, 0);
    };
    const handleDown = () => setIsDragging(true);
    const handleUp = () => setIsDragging(false);
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerdown', handleDown);
    window.addEventListener('pointerup', handleUp);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerdown', handleDown);
      window.removeEventListener('pointerup', handleUp);
    };
  }, [gl]);

  useFrame((_, dt) => {
    const ease = THREE.MathUtils.clamp(dt * 2.2, 0, 0.12);
    const gravityStrength = isDragging ? 1.2 : 0.18; // gentle hover attraction
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const px = positions[i3 + 0];
      const py = positions[i3 + 1];
      const pz = positions[i3 + 2];

      const tx = targetPositions[i3 + 0];
      const ty = targetPositions[i3 + 1];
      const tz = targetPositions[i3 + 2];

      // Pull towards text target
      velocities[i3 + 0] += (tx - px) * ease * 0.6;
      velocities[i3 + 1] += (ty - py) * ease * 0.6;
      velocities[i3 + 2] += (tz - pz) * ease * 0.6;

      // Mouse gravity only while dragging
      if (gravityStrength > 0.0) {
        const dx = mouse.current.x - px;
        const dy = mouse.current.y - py;
        const dist2 = Math.max(dx * dx + dy * dy, 0.05);
        const inv = gravityStrength / dist2;
        const factor = isDragging ? 0.002 : 0.001;
        velocities[i3 + 0] += dx * inv * factor;
        velocities[i3 + 1] += dy * inv * factor;
      }

      // Dampen
      velocities[i3 + 0] *= 0.92;
      velocities[i3 + 1] *= 0.92;
      velocities[i3 + 2] *= 0.92;

      positions[i3 + 0] += velocities[i3 + 0] * dt * 60;
      positions[i3 + 1] += velocities[i3 + 1] * dt * 60;
      positions[i3 + 2] += velocities[i3 + 2] * dt * 60;
    }
    if (pointsRef.current) {
      pointsRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      <Points ref={pointsRef} positions={positions} frustumCulled>
        <PointMaterial transparent color="#88ddff" size={0.025} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
      </Points>
    </group>
  );
}


