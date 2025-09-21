import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import ParticleSignature from './ParticleSignature.jsx';
import PortalReveal from './PortalReveal.jsx';
import BlackHoleCarousel from './BlackHoleCarousel.jsx';
import BlenderControls from './BlenderControls.jsx';

function OverlayControls({ mode, setMode, onClose }) {
  return (
    <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', gap: 8, alignItems: 'center', zIndex: 1000 }}>
      <button onClick={() => setMode('particles')} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #555', background: mode === 'particles' ? '#111' : '#222', color: '#fff' }}>Particles</button>
      <button onClick={() => setMode('portal')} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #555', background: mode === 'portal' ? '#111' : '#222', color: '#fff' }}>Fluid Simulation</button>
      <button onClick={() => setMode('carousel')} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #555', background: mode === 'carousel' ? '#111' : '#222', color: '#fff' }}>Carousel</button>
      <button onClick={onClose} style={{ marginLeft: 12, padding: '8px 12px', borderRadius: 8, border: '1px solid #955', background: '#2a0000', color: '#fff' }}>Close</button>
    </div>
  );
}

function Placeholder() {
  return (
    <mesh>
      <torusKnotGeometry args={[1, 0.3, 128, 32]} />
      <meshStandardMaterial color={0x3399ff} metalness={0.3} roughness={0.4} />
    </mesh>
  );
}

export default function ThreeShowcase({ onClose }) {
  const [mode, setMode] = useState('particles');

  // Prevent body scroll while overlay open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Simple audio + haptic feedback on open
  useEffect(() => {
    try {
      if (navigator?.vibrate) navigator.vibrate(30);
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 520;
      gain.gain.value = 0.0001;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      const start = ctx.currentTime;
      gain.gain.exponentialRampToValueAtTime(0.05, start + 0.02);
      osc.frequency.exponentialRampToValueAtTime(880, start + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.2);
      osc.stop(start + 0.22);
    } catch {}
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(1200px 800px at 70% -20%, rgba(255,255,255,0.05), rgba(0,0,0,0.9) 40%)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', zIndex: 999 }}>
      <OverlayControls mode={mode} setMode={setMode} onClose={onClose} />
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <directionalLight intensity={1.2} position={[5, 5, 5]} />
        <Suspense fallback={<Placeholder />}> 
          {mode === 'particles' && <><BlenderControls /><ParticleSignature text={'William Xu'} /></>}
          {mode === 'portal' && <><BlenderControls /><PortalReveal /></>}
          {mode === 'carousel' && <><BlenderControls /><BlackHoleCarousel /></>}
        </Suspense>
        <OrbitControls enablePan={false} enableDamping dampingFactor={0.08} enableRotate={false} enableZoom={false} />
        <EffectComposer disableNormalPass>
          <Bloom intensity={0.8} luminanceThreshold={0.1} luminanceSmoothing={0.2} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  );
}


