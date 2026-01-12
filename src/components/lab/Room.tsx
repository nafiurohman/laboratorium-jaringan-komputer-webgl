import { useRef } from 'react';
import * as THREE from 'three';

export const Room = () => {
  const wallMaterial = useRef(new THREE.MeshStandardMaterial({ color: '#f5f5f0', roughness: 0.9 }));
  const floorMaterial = useRef(new THREE.MeshStandardMaterial({ color: '#e8e8e8', roughness: 0.8 }));
  const ceilingMaterial = useRef(new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.9 }));

  const roomWidth = 12;
  const roomDepth = 12;
  const roomHeight = 4;

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[roomWidth, roomDepth]} />
        <meshStandardMaterial color="#d4d4d4" roughness={0.7} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, roomHeight, 0]}>
        <planeGeometry args={[roomWidth, roomDepth]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>

      {/* Back Wall (behind teacher) */}
      <mesh position={[0, roomHeight / 2, -roomDepth / 2]} receiveShadow>
        <boxGeometry args={[roomWidth, roomHeight, 0.2]} />
        <meshStandardMaterial color="#f5f5f0" roughness={0.9} />
      </mesh>

      {/* Front Wall (with door opening on left side) */}
      <group>
        {/* Center section of front wall */}
        <mesh position={[1, roomHeight / 2, roomDepth / 2]} receiveShadow>
          <boxGeometry args={[6, roomHeight, 0.2]} />
          <meshStandardMaterial color="#f5f5f0" roughness={0.9} />
        </mesh>
        {/* Right section of front wall */}
        <mesh position={[5, roomHeight / 2, roomDepth / 2]} receiveShadow>
          <boxGeometry args={[2, roomHeight, 0.2]} />
          <meshStandardMaterial color="#f5f5f0" roughness={0.9} />
        </mesh>
        {/* Top section above door */}
        <mesh position={[-4, 3.5, roomDepth / 2]} receiveShadow>
          <boxGeometry args={[4, 1, 0.2]} />
          <meshStandardMaterial color="#f5f5f0" roughness={0.9} />
        </mesh>
      </group>

      {/* Left Wall */}
      <mesh position={[-roomWidth / 2, roomHeight / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[roomDepth, roomHeight, 0.2]} />
        <meshStandardMaterial color="#f5f5f0" roughness={0.9} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[roomWidth / 2, roomHeight / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[roomDepth, roomHeight, 0.2]} />
        <meshStandardMaterial color="#f5f5f0" roughness={0.9} />
      </mesh>

      {/* Floor Grid Lines */}
      {Array.from({ length: 13 }).map((_, i) => (
        <mesh key={`grid-x-${i}`} position={[-6 + i, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.02, roomDepth]} />
          <meshBasicMaterial color="#cccccc" />
        </mesh>
      ))}
      {Array.from({ length: 13 }).map((_, i) => (
        <mesh key={`grid-z-${i}`} position={[0, 0.01, -6 + i]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
          <planeGeometry args={[0.02, roomWidth]} />
          <meshBasicMaterial color="#cccccc" />
        </mesh>
      ))}
    </group>
  );
};
