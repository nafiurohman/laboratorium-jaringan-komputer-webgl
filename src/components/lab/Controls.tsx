import { useRef, useEffect, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ControlsProps {
  isSeated: boolean;
  seatPosition?: THREE.Vector3;
  seatLookAt?: THREE.Vector3;
  teleportTarget?: { x: number; z: number } | null;
  onTeleportComplete: () => void;
  onPositionUpdate: (x: number, z: number) => void;
}

export const Controls = ({
  isSeated,
  seatPosition,
  seatLookAt,
  teleportTarget,
  onTeleportComplete,
  onPositionUpdate,
}: ControlsProps) => {
  const { camera, gl } = useThree();
  const moveSpeed = 0.08;
  const rotateSpeed = 0.002;
  const keys = useRef<{ [key: string]: boolean }>({});
  const yaw = useRef(0);
  const pitch = useRef(0);
  const targetPosition = useRef(new THREE.Vector3(-4, 1.6, 8));
  const isPointerLocked = useRef(false);
  const initialized = useRef(false);

  // Room boundaries
  const bounds = {
    minX: -5.5,
    maxX: 5.5,
    minZ: -5.5,
    maxZ: 5.5,
  };

  // Initialize camera position
  useEffect(() => {
    if (!initialized.current) {
      camera.position.set(-4, 1.6, 8);
      targetPosition.current.set(-4, 1.6, 8);
      initialized.current = true;
    }
  }, [camera]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    keys.current[e.key.toLowerCase()] = true;
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    keys.current[e.key.toLowerCase()] = false;
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isPointerLocked.current || isSeated) return;
    
    yaw.current -= e.movementX * rotateSpeed;
    pitch.current -= e.movementY * rotateSpeed;
    pitch.current = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, pitch.current));
  }, [isSeated]);

  const handlePointerLockChange = useCallback(() => {
    isPointerLocked.current = document.pointerLockElement === gl.domElement;
  }, [gl.domElement]);

  const handleCanvasClick = useCallback(() => {
    if (!isSeated && document.pointerLockElement !== gl.domElement) {
      gl.domElement.requestPointerLock?.();
    }
  }, [isSeated, gl.domElement]);

  useEffect(() => {
    const canvas = gl.domElement;
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    canvas.addEventListener('click', handleCanvasClick);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      canvas.removeEventListener('click', handleCanvasClick);
    };
  }, [gl.domElement, handleKeyDown, handleKeyUp, handleMouseMove, handlePointerLockChange, handleCanvasClick]);

  // Handle teleportation
  useEffect(() => {
    if (teleportTarget && !isSeated) {
      targetPosition.current.set(teleportTarget.x, 1.6, teleportTarget.z);
      camera.position.set(teleportTarget.x, 1.6, teleportTarget.z);
      onTeleportComplete();
      onPositionUpdate(teleportTarget.x, teleportTarget.z);
    }
  }, [teleportTarget, isSeated, onTeleportComplete, camera, onPositionUpdate]);

  useFrame(() => {
    if (isSeated && seatPosition && seatLookAt) {
      // Smooth transition to seated position
      camera.position.lerp(seatPosition, 0.1);
      camera.lookAt(seatLookAt);
      return;
    }

    // Calculate forward direction based on yaw only (for movement)
    const forward = new THREE.Vector3(
      -Math.sin(yaw.current),
      0,
      -Math.cos(yaw.current)
    );
    
    const right = new THREE.Vector3(
      Math.cos(yaw.current),
      0,
      -Math.sin(yaw.current)
    );

    let moved = false;
    const moveVector = new THREE.Vector3();

    if (keys.current['w'] || keys.current['arrowup']) {
      moveVector.add(forward.clone().multiplyScalar(moveSpeed));
      moved = true;
    }
    if (keys.current['s'] || keys.current['arrowdown']) {
      moveVector.add(forward.clone().multiplyScalar(-moveSpeed));
      moved = true;
    }
    if (keys.current['a'] || keys.current['arrowleft']) {
      moveVector.add(right.clone().multiplyScalar(-moveSpeed));
      moved = true;
    }
    if (keys.current['d'] || keys.current['arrowright']) {
      moveVector.add(right.clone().multiplyScalar(moveSpeed));
      moved = true;
    }

    if (moved) {
      targetPosition.current.add(moveVector);
      
      // Apply boundaries
      targetPosition.current.x = Math.max(bounds.minX, Math.min(bounds.maxX, targetPosition.current.x));
      targetPosition.current.z = Math.max(bounds.minZ, Math.min(bounds.maxZ, targetPosition.current.z));
      targetPosition.current.y = 1.6;
    }

    // Smooth camera movement
    camera.position.lerp(targetPosition.current, 0.2);

    // Update camera rotation based on pitch and yaw
    camera.rotation.order = 'YXZ';
    camera.rotation.y = yaw.current;
    camera.rotation.x = pitch.current;

    // Update position for minimap
    onPositionUpdate(camera.position.x, camera.position.z);
  });

  return null;
};
