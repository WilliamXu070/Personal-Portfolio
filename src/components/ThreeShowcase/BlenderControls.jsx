import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';

export default function BlenderControls() {
  const { camera, gl } = useThree();
  const rotating = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const yaw = useRef(Math.atan2(camera.position.x, camera.position.z));
  const pitch = useRef(Math.atan2(camera.position.y, Math.hypot(camera.position.x, camera.position.z)));
  const roll = useRef(0);
  const radius = useRef(Math.max(0.3, camera.position.length()));

  useEffect(() => {
    const onPointerDown = (e) => {
      if (e.shiftKey) {
        rotating.current = true;
        last.current = { x: e.clientX, y: e.clientY };
      }
    };
    const onPointerMove = (e) => {
      if (!rotating.current) return;
      const dx = e.clientX - last.current.x;
      const dy = e.clientY - last.current.y;
      last.current = { x: e.clientX, y: e.clientY };
      const rotSpeed = 0.005;
      if (e.altKey) {
        roll.current += dx * rotSpeed;
      } else {
        yaw.current += dx * rotSpeed;
        pitch.current -= dy * rotSpeed;
      }
    };
    const onPointerUp = () => { rotating.current = false; };
    const onPointerOut = () => { rotating.current = false; };
    const onWheel = (e) => {
      const zoomSpeed = 0.0015;
      const factor = Math.exp(e.deltaY * zoomSpeed);
      radius.current = Math.min(20, Math.max(0.3, radius.current * factor));
      e.preventDefault();
    };
    gl.domElement.addEventListener('pointerdown', onPointerDown);
    gl.domElement.addEventListener('pointermove', onPointerMove);
    gl.domElement.addEventListener('pointerup', onPointerUp);
    gl.domElement.addEventListener('pointerout', onPointerOut);
    gl.domElement.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      gl.domElement.removeEventListener('pointerdown', onPointerDown);
      gl.domElement.removeEventListener('pointermove', onPointerMove);
      gl.domElement.removeEventListener('pointerup', onPointerUp);
      gl.domElement.removeEventListener('pointerout', onPointerOut);
      gl.domElement.removeEventListener('wheel', onWheel);
    };
  }, [gl]);

  useFrame(() => {
    // Quaternion composition: Yaw (Y) * Pitch (X) * Roll (Z)
    const qYaw = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw.current);
    const qPitch = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), pitch.current);
    const qRoll = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), roll.current);
    const q = new THREE.Quaternion().multiplyQuaternions(qYaw, qPitch).multiply(qRoll);
    const pos = new THREE.Vector3(0, 0, radius.current).applyQuaternion(q);
    camera.position.copy(pos);
    camera.quaternion.copy(q);
  });

  return null;
}


