import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TeacherAreaProps {
  onProjectorClick: () => void;
  showLabels: boolean;
}

export const TeacherArea = ({ onProjectorClick, showLabels }: TeacherAreaProps) => {
  const [hovered, setHovered] = useState<string | null>(null);
  const projectorLightRef = useRef<THREE.SpotLight>(null);

  useFrame((state) => {
    if (projectorLightRef.current) {
      projectorLightRef.current.intensity = 2 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <group position={[0, 0, -4]}>
      {/* Teacher's Desk */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 0.8, 1]} />
        <meshStandardMaterial color="#5c4033" roughness={0.6} />
      </mesh>
      
      {/* Desk Panel (front) */}
      <mesh position={[0, 0.4, 0.52]}>
        <boxGeometry args={[3, 0.75, 0.05]} />
        <meshStandardMaterial color="#4a3728" roughness={0.7} />
      </mesh>

      {/* Teacher's Chair */}
      <group position={[0, 0, 1.2]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[0.5, 0.08, 0.5]} />
          <meshStandardMaterial color="#1a1a5a" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.85, -0.22]} castShadow>
          <boxGeometry args={[0.5, 0.62, 0.06]} />
          <meshStandardMaterial color="#1a1a5a" roughness={0.7} />
        </mesh>
        {/* Chair Base */}
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.5]} />
          <meshStandardMaterial color="#333333" metalness={0.5} />
        </mesh>
        {/* Chair Wheels Base */}
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.03]} />
          <meshStandardMaterial color="#333333" metalness={0.5} />
        </mesh>
      </group>

      {/* Projector Screen */}
      <group position={[0, 2.5, -1.8]}>
        {/* Screen Frame */}
        <mesh>
          <boxGeometry args={[5.2, 3.2, 0.1]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.5} />
        </mesh>
        {/* Screen Surface */}
        <mesh 
          position={[0, 0, 0.06]}
          onClick={(e) => {
            e.stopPropagation();
            onProjectorClick();
          }}
          onPointerOver={() => setHovered('screen')}
          onPointerOut={() => setHovered(null)}
        >
          <planeGeometry args={[5, 3]} />
          <meshStandardMaterial 
            color={hovered === 'screen' ? '#ffffff' : '#f8f8f8'} 
            roughness={0.3}
            emissive="#ffffff"
            emissiveIntensity={0.1}
          />
        </mesh>
        
        {/* Network Topology Display on Screen */}
        <group position={[0, 0, 0.07]}>
          {/* Router Icon */}
          <mesh position={[0, 0.8, 0]}>
            <boxGeometry args={[0.4, 0.25, 0.02]} />
            <meshBasicMaterial color="#0066cc" />
          </mesh>
          {/* Switch Icons */}
          {[-1.5, 0, 1.5].map((x, i) => (
            <mesh key={i} position={[x, -0.2, 0]}>
              <boxGeometry args={[0.6, 0.15, 0.02]} />
              <meshBasicMaterial color="#00aa44" />
            </mesh>
          ))}
          {/* Connection Lines */}
          {[-1.5, 0, 1.5].map((x, i) => (
            <mesh key={`line-${i}`} position={[x * 0.5, 0.3, 0]} rotation={[0, 0, Math.atan2(1, x * 0.5 || 0.001)]}>
              <boxGeometry args={[0.02, 0.8, 0.01]} />
              <meshBasicMaterial color="#666666" />
            </mesh>
          ))}
          {/* Computer Icons */}
          {[-2, -1, 0, 1, 2].map((x, i) => (
            <mesh key={`pc-${i}`} position={[x * 0.8, -1, 0]}>
              <boxGeometry args={[0.2, 0.25, 0.02]} />
              <meshBasicMaterial color="#ff6600" />
            </mesh>
          ))}
        </group>
      </group>

      {/* Projector (ceiling mounted) */}
      <group 
        position={[0, 3.8, 1]}
        onClick={(e) => {
          e.stopPropagation();
          onProjectorClick();
        }}
        onPointerOver={() => setHovered('projector')}
        onPointerOut={() => setHovered(null)}
      >
        {/* Projector Mount */}
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.3]} />
          <meshStandardMaterial color="#666666" metalness={0.5} />
        </mesh>
        {/* Projector Body */}
        <mesh castShadow>
          <boxGeometry args={[0.5, 0.15, 0.4]} />
          <meshStandardMaterial 
            color={hovered === 'projector' ? '#4a4a4a' : '#333333'} 
            roughness={0.4} 
          />
        </mesh>
        {/* Projector Lens */}
        <mesh position={[0, -0.05, -0.22]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.06, 0.05]} />
          <meshStandardMaterial color="#111111" roughness={0.2} />
        </mesh>
        
        {/* Projector Light Beam */}
        <spotLight
          ref={projectorLightRef}
          position={[0, -0.1, -0.3]}
          angle={0.4}
          penumbra={0.3}
          intensity={2}
          color="#ffffee"
          target-position={[0, -3, -3]}
          castShadow
        />
      </group>

      {/* Whiteboard */}
      <mesh position={[4, 1.8, -1.5]}>
        <boxGeometry args={[3, 1.5, 0.05]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.3} />
      </mesh>
      <mesh position={[4, 1.8, -1.48]}>
        <boxGeometry args={[2.9, 1.4, 0.02]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
};
