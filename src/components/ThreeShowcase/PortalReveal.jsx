import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';

// Single knob to control particle count globally (easy to change)
export const LIQUID_NUM_PARTICLES = 2000;

function LiquidBall({ numParticles = LIQUID_NUM_PARTICLES }) {
  const meshRef = useRef();
  const { viewport, camera } = useThree();
  const [dragging, setDragging] = useState(false);
  const dragPos = useRef(new THREE.Vector3(0, 0, 0));
  const rotating = useRef(false);
  const lastClient = useRef({ x: 0, y: 0 });
  const yaw = useRef(Math.atan2(camera.position.x, camera.position.z));
  const pitch = useRef(Math.atan2(camera.position.y, Math.hypot(camera.position.x, camera.position.z)));
  const roll = useRef(0);
  const lastAppliedRoll = useRef(0);
  const radius = useRef(Math.max(0.1, camera.position.length()));
  const planeRef = useRef();
  const { gl } = useThree();

  // Simulation buffers
  const positions = useMemo(() => new Float32Array(numParticles * 3), [numParticles]);
  const velocities = useMemo(() => new Float32Array(numParticles * 3), [numParticles]);

  // Initialize in a sphere
  useMemo(() => {
    const radius = 1.0;
    for (let i = 0; i < numParticles; i++) {
      // random point in unit sphere
      let x = 0, y = 0, z = 0, d2 = 2;
      while (d2 > 1) {
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
        z = Math.random() * 2 - 1;
        d2 = x*x + y*y + z*z;
      }
      const r = radius * Math.cbrt(Math.random());
      positions[i * 3 + 0] = x * r;
      positions[i * 3 + 1] = y * r;
      positions[i * 3 + 2] = z * r;
      velocities[i * 3 + 0] = 0;
      velocities[i * 3 + 1] = 0;
      velocities[i * 3 + 2] = 0;
    }
  }, [numParticles, positions, velocities]);

  // Spatial hash for neighbor lookup
  function buildGrid(cellSize) {
    const grid = new Map();
    const key = (cx, cy, cz) => cx + ',' + cy + ',' + cz;
    for (let i = 0; i < numParticles; i++) {
      const x = positions[i * 3 + 0];
      const y = positions[i * 3 + 1];
      const z = positions[i * 3 + 2];
      const cx = Math.floor(x / cellSize);
      const cy = Math.floor(y / cellSize);
      const cz = Math.floor(z / cellSize);
      const k = key(cx, cy, cz);
      let arr = grid.get(k);
      if (arr === undefined) { arr = []; grid.set(k, arr); }
      arr.push(i);
    }
    return { grid, key };
  }

  // Visual/physics parameters
  const PARTICLE_RADIUS = 0.05;                // rendered sphere radius
  const INFLUENCE_RADIUS = 0.8;                // mouse interaction radius (world units)
  const INFLUENCE_ACCEL = 700.0;                // acceleration toward cursor inside radius

  useFrame((state, dt) => {
    const delta = Math.min(0.033, dt);
    const centerAccel = 12.0; // constant acceleration magnitude toward center
    const damping = 0.9;
    // Collision spacing derived from particle radius (slightly less than diameter to reduce visible gaps)
    const restDist = PARTICLE_RADIUS * 2 * 0.95;
    const cellSize = restDist * 1.6;
    // Mouse interaction radius (only particles strictly within this sphere are affected)
    const dragRadius = INFLUENCE_RADIUS;

    // 1) Integrate with center acceleration, overridden by local mouse influence
    for (let i = 0; i < numParticles; i++) {
      const ix = i * 3;
      const px = positions[ix + 0];
      const py = positions[ix + 1];
      const pz = positions[ix + 2];

      let ax = 0, ay = 0, az = 0;
      let influenced = false;
      if (dragging) {
        const dx = dragPos.current.x - px;
        const dy = dragPos.current.y - py;
        const dz = dragPos.current.z - pz;
        const d2 = dx*dx + dy*dy + dz*dz;
        if (d2 < dragRadius * dragRadius) {
          const d = Math.max(Math.sqrt(d2), 1e-6);
          const falloff = 1.0 - Math.min(1.0, d / dragRadius); // 1 at center → 0 at edge
          ax = (dx / d) * INFLUENCE_ACCEL * falloff;
          ay = (dy / d) * INFLUENCE_ACCEL * falloff;
          az = (dz / d) * INFLUENCE_ACCEL * falloff;
          influenced = true;
        }
      }

      if (!influenced) {
        // Constant acceleration toward center
        const len = Math.sqrt(px*px + py*py + pz*pz);
        if (len > 1e-5) {
          const inv = 1.0 / len;
          ax = -px * inv * centerAccel;
          ay = -py * inv * centerAccel;
          az = -pz * inv * centerAccel;
        }
      }

      velocities[ix + 0] = (velocities[ix + 0] + ax * delta) * damping;
      velocities[ix + 1] = (velocities[ix + 1] + ay * delta) * damping;
      velocities[ix + 2] = (velocities[ix + 2] + az * delta) * damping;
      positions[ix + 0] += velocities[ix + 0] * delta;
      positions[ix + 1] += velocities[ix + 1] * delta;
      positions[ix + 2] += velocities[ix + 2] * delta;
    }

    // 2) Build grid once and resolve collisions by separating overlapping pairs
    // Two small solver passes improve packing without visible gaps
    for (let pass = 0; pass < 2; pass++) {
      const { grid, key } = buildGrid(cellSize);
      for (let i = 0; i < numParticles; i++) {
        const ix = i * 3;
        const px = positions[ix + 0];
        const py = positions[ix + 1];
        const pz = positions[ix + 2];
        const cx = Math.floor(px / cellSize);
        const cy = Math.floor(py / cellSize);
        const cz = Math.floor(pz / cellSize);
        for (let gx = -1; gx <= 1; gx++) {
          for (let gy = -1; gy <= 1; gy++) {
            for (let gz = -1; gz <= 1; gz++) {
              const list = grid.get(key(cx + gx, cy + gy, cz + gz));
              if (!list) continue;
              for (let idx = 0; idx < list.length; idx++) {
                const j = list[idx];
                if (j <= i) continue;
                const jx = j * 3;
                const dx = positions[jx + 0] - px;
                const dy = positions[jx + 1] - py;
                const dz = positions[jx + 2] - pz;
                const d2 = dx*dx + dy*dy + dz*dz;
                if (d2 > 0 && d2 < restDist * restDist) {
                  const d = Math.max(Math.sqrt(d2), 1e-6);
                  const overlap = (restDist - d) * 0.5;
                  const nx = dx / d;
                  const ny = dy / d;
                  const nz = dz / d;
                  positions[ix + 0] -= nx * overlap;
                  positions[ix + 1] -= ny * overlap;
                  positions[ix + 2] -= nz * overlap;
                  positions[jx + 0] += nx * overlap;
                  positions[jx + 1] += ny * overlap;
                  positions[jx + 2] += nz * overlap;
                  const vin = velocities[ix + 0] * nx + velocities[ix + 1] * ny + velocities[ix + 2] * nz;
                  const vjn = velocities[jx + 0] * nx + velocities[jx + 1] * ny + velocities[jx + 2] * nz;
                  velocities[ix + 0] -= vin * nx; velocities[ix + 1] -= vin * ny; velocities[ix + 2] -= vin * nz;
                  velocities[jx + 0] -= vjn * nx; velocities[jx + 1] -= vjn * ny; velocities[jx + 2] -= vjn * nz;
                }
              }
            }
          }
        }
      }
    }

    // Write instance matrices
    if (meshRef.current) {
      const m = new THREE.Matrix4();
      for (let i = 0; i < numParticles; i++) {
        const ix = i * 3;
        m.makeTranslation(positions[ix + 0], positions[ix + 1], positions[ix + 2]);
        meshRef.current.setMatrixAt(i, m);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
    }

    // Update camera spherical orbit from yaw/pitch/radius
    // Quaternion-based orbit like Blender: q = Yaw * Pitch * Roll
    const qYaw = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw.current);
    const qPitch = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), pitch.current);
    const qRoll = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), roll.current);
    const q = new THREE.Quaternion().multiplyQuaternions(qYaw, qPitch).multiply(qRoll);

    // Camera position is +Z at radius rotated by q; camera looks along -Z in its local space
    const pos = new THREE.Vector3(0, 0, radius.current).applyQuaternion(q);
    camera.position.copy(pos);
    camera.quaternion.copy(q);

    // Keep the input plane facing the camera and large enough for raycasts
    if (planeRef.current) {
      planeRef.current.quaternion.copy(camera.quaternion);
      // Ensure it is big so rays always hit
      const s = Math.max(viewport.width, viewport.height) * 2.0;
      const geo = planeRef.current.geometry;
      if (geo.parameters && (geo.parameters.width !== s || geo.parameters.height !== s)) {
        planeRef.current.geometry.dispose();
        planeRef.current.geometry = new THREE.PlaneGeometry(s, s);
      }
    }
  });

  // Interaction plane (fullscreen) to capture pointer in world units
  const onPointerDown = (e) => {
    if (e.shiftKey) {
      rotating.current = true;
      lastClient.current = { x: e.clientX, y: e.clientY };
      return;
    }
    setDragging(true);
    dragPos.current.set(e.point.x, e.point.y, e.point.z);
  };
  const onPointerMove = (e) => {
    if (rotating.current) {
      const dx = e.clientX - lastClient.current.x;
      const dy = e.clientY - lastClient.current.y;
      lastClient.current = { x: e.clientX, y: e.clientY };
      const rotSpeed = 0.005;
      if (e.altKey) {
        // Roll when holding Alt: full, unbounded
        roll.current += dx * rotSpeed;
      } else {
        yaw.current += dx * rotSpeed;      // unbounded 360 yaw
        pitch.current -= dy * rotSpeed;    // now unbounded
      }
      return;
    }
    dragPos.current.set(e.point.x, e.point.y, e.point.z);
  };
  const onPointerUp = () => { setDragging(false); rotating.current = false; };
  const onPointerOut = () => { setDragging(false); rotating.current = false; };
  const onWheel = (e) => {
    e.stopPropagation();
    e.preventDefault();
    // Zoom in/out by changing radius (smooth exponential)
    const zoomSpeed = 0.0015;
    const factor = Math.exp(e.deltaY * zoomSpeed);
    radius.current = Math.min(10, Math.max(0.3, radius.current * factor));
  };

  // Fallback wheel capture on the canvas element to ensure zoom always works
  useEffect(() => {
    const handler = (e) => {
      // Ignore when OrbitControls handles zoom (non-portal modes), but here we're in portal component
      const zoomSpeed = 0.0015;
      const factor = Math.exp(e.deltaY * zoomSpeed);
      radius.current = Math.min(10, Math.max(0.3, radius.current * factor));
      e.preventDefault();
    };
    gl.domElement.addEventListener('wheel', handler, { passive: false });
    return () => gl.domElement.removeEventListener('wheel', handler);
  }, [gl]);

  return (
    <group>
      {/* Fullscreen transparent catcher */}
      <mesh ref={planeRef} position={[0, 0, 0]} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerOut={onPointerOut} onWheel={onWheel}>
        <planeGeometry args={[viewport.width * 2, viewport.height * 2]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} depthTest={false} toneMapped={false} />
      </mesh>
      {/* Particles */}
      <instancedMesh ref={meshRef} args={[undefined, undefined, numParticles]}>
        <sphereGeometry args={[0.03, 12, 12]} />
        <meshStandardMaterial color={new THREE.Color('#66ccff')} emissive={new THREE.Color('#224455')} emissiveIntensity={0.7} roughness={0.4} metalness={0.1} />
      </instancedMesh>
    </group>
  );
}

export default function PortalReveal() {
  return (
    <group>
      <LiquidBall numParticles={LIQUID_NUM_PARTICLES} />
    </group>
  );
}


