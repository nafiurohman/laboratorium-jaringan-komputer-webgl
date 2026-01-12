import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DoorProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const Door = ({ isOpen, onToggle }: DoorProps) => {
  const doorRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const targetRotation = isOpen ? -Math.PI / 2 : 0;

  useFrame(() => {
    if (doorRef.current) {
      doorRef.current.rotation.y = THREE.MathUtils.lerp(
        doorRef.current.rotation.y,
        targetRotation,
        0.05
      );
    }
  });

  return (
    <group position={[-4, 0, 6]}>
      {/* Door Frame */}
      <mesh position={[-2.1, 1.5, 0]}>
        <boxGeometry args={[0.2, 3, 0.3]} />
        <meshStandardMaterial color="#4a3728" roughness={0.8} />
      </mesh>
      <mesh position={[2.1, 1.5, 0]}>
        <boxGeometry args={[0.2, 3, 0.3]} />
        <meshStandardMaterial color="#4a3728" roughness={0.8} />
      </mesh>
      <mesh position={[0, 3.1, 0]}>
        <boxGeometry args={[4.4, 0.2, 0.3]} />
        <meshStandardMaterial color="#4a3728" roughness={0.8} />
      </mesh>

      {/* Door Pivot Point */}
      <group position={[-2, 0, 0]}>
        <group ref={doorRef}>
          {/* Door Panel */}
          <mesh 
            position={[2, 1.5, 0]}
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            castShadow
          >
            <boxGeometry args={[4, 3, 0.1]} />
            <meshStandardMaterial 
              color={hovered ? '#6b5344' : '#5c4033'} 
              roughness={0.7} 
            />
          </mesh>
          
          {/* Door Handle */}
          <mesh position={[3.5, 1.5, 0.1]}>
            <boxGeometry args={[0.3, 0.1, 0.2]} />
            <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} />
          </mesh>
          
          {/* Door Window */}
          <mesh position={[2, 2.2, 0.06]}>
            <boxGeometry args={[1.5, 0.8, 0.02]} />
            <meshStandardMaterial color="#87ceeb" transparent opacity={0.5} />
          </mesh>
        </group>
      </group>

      {/* Door Label */}
      {hovered && (
        <group position={[0, 3.5, 0.5]}>
          <mesh>
            <planeGeometry args={[3, 0.5]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
        </group>
      )}
    </group>
  );
};
