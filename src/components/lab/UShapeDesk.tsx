import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface UShapeDeskProps {
  onSit: (position: THREE.Vector3, lookAt: THREE.Vector3) => void;
  onComputerClick: (id: number) => void;
  showLabels: boolean;
}

interface ComputerStation {
  id: number;
  position: [number, number, number];
  rotation: number;
  chairOffset: [number, number, number];
  lookDirection: [number, number, number];
}

export const UShapeDesk = ({ onSit, onComputerClick, showLabels }: UShapeDeskProps) => {
  const [hoveredStation, setHoveredStation] = useState<number | null>(null);
  const [hoveredChair, setHoveredChair] = useState<number | null>(null);

  // Computer stations positioned along the U-shape desk - Compact Layout
  const stations: ComputerStation[] = [
    // Left arm of U (2 stations facing right)
    { id: 1, position: [-3.5, 0.82, 1], rotation: Math.PI / 2, chairOffset: [-0.8, 0, 0], lookDirection: [1, 0, 0] },
    { id: 2, position: [-3.5, 0.82, -1], rotation: Math.PI / 2, chairOffset: [-0.8, 0, 0], lookDirection: [1, 0, 0] },
    // Right arm of U (2 stations facing left)
    { id: 3, position: [3.5, 0.82, 1], rotation: -Math.PI / 2, chairOffset: [0.8, 0, 0], lookDirection: [-1, 0, 0] },
    { id: 4, position: [3.5, 0.82, -1], rotation: -Math.PI / 2, chairOffset: [0.8, 0, 0], lookDirection: [-1, 0, 0] },
    // Bottom of U (2 stations facing forward/toward teacher)
    { id: 5, position: [-1.5, 0.82, 2], rotation: Math.PI, chairOffset: [0, 0, 0.8], lookDirection: [0, 0, -1] },
    { id: 6, position: [1.5, 0.82, 2], rotation: Math.PI, chairOffset: [0, 0, 0.8], lookDirection: [0, 0, -1] },
  ];

  const handleChairClick = (station: ComputerStation) => {
    const chairPos = new THREE.Vector3(
      station.position[0] + station.chairOffset[0],
      1.2,
      station.position[2] + station.chairOffset[2]
    );
    const lookAt = new THREE.Vector3(
      station.position[0] + station.lookDirection[0] * 3,
      1.2,
      station.position[2] + station.lookDirection[2] * 3
    );
    onSit(chairPos, lookAt);
  };

  return (
    <group>
      {/* U-Shape Desk Frame - Compact Design */}
      {/* Left Arm - Vertical */}
      <mesh position={[-3.5, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 0.8, 4]} />
        <meshStandardMaterial color="#8b7355" roughness={0.6} />
      </mesh>
      <mesh position={[-3.5, 0.82, 0]}>
        <boxGeometry args={[1.2, 0.05, 4.2]} />
        <meshStandardMaterial color="#d4a574" roughness={0.5} />
      </mesh>

      {/* Right Arm - Vertical */}
      <mesh position={[3.5, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 0.8, 4]} />
        <meshStandardMaterial color="#8b7355" roughness={0.6} />
      </mesh>
      <mesh position={[3.5, 0.82, 0]}>
        <boxGeometry args={[1.2, 0.05, 4.2]} />
        <meshStandardMaterial color="#d4a574" roughness={0.5} />
      </mesh>

      {/* Bottom Connector - Horizontal */}
      <mesh position={[0, 0.4, 2]} castShadow receiveShadow>
        <boxGeometry args={[7, 0.8, 1]} />
        <meshStandardMaterial color="#8b7355" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.82, 2]}>
        <boxGeometry args={[7.2, 0.05, 1.2]} />
        <meshStandardMaterial color="#d4a574" roughness={0.5} />
      </mesh>

      {/* Computer Stations */}
      {stations.map((station) => (
        <group key={station.id} position={station.position} rotation={[0, station.rotation, 0]}>
          {/* Monitor */}
          <group
            onClick={(e) => {
              e.stopPropagation();
              onComputerClick(station.id);
            }}
            onPointerOver={() => setHoveredStation(station.id)}
            onPointerOut={() => setHoveredStation(null)}
          >
            {/* Monitor Frame */}
            <mesh position={[0, 0.35, 0]} castShadow>
              <boxGeometry args={[0.55, 0.38, 0.03]} />
              <meshStandardMaterial
                color={hoveredStation === station.id ? '#2a2a2a' : '#1a1a1a'}
                roughness={0.3}
              />
            </mesh>
            {/* Screen */}
            <mesh position={[0, 0.35, 0.02]}>
              <planeGeometry args={[0.5, 0.33]} />
              <meshBasicMaterial color={hoveredStation === station.id ? '#0088ff' : '#0066cc'} />
            </mesh>
            {/* Monitor Stand */}
            <mesh position={[0, 0.1, 0]}>
              <boxGeometry args={[0.06, 0.12, 0.06]} />
              <meshStandardMaterial color="#333333" />
            </mesh>
            {/* Monitor Base */}
            <mesh position={[0, 0.02, 0]}>
              <boxGeometry args={[0.18, 0.02, 0.12]} />
              <meshStandardMaterial color="#333333" />
            </mesh>
          </group>

          {/* CPU */}
          <mesh position={[0.35, 0.15, 0]} castShadow>
            <boxGeometry args={[0.12, 0.32, 0.28]} />
            <meshStandardMaterial color="#2a2a2a" roughness={0.5} />
          </mesh>
          {/* CPU LED */}
          <mesh position={[0.42, 0.2, 0]}>
            <sphereGeometry args={[0.012, 8, 8]} />
            <meshBasicMaterial color="#00ff00" />
          </mesh>

          {/* Keyboard */}
          <mesh position={[0, 0, 0.25]}>
            <boxGeometry args={[0.35, 0.015, 0.12]} />
            <meshStandardMaterial color="#333333" />
          </mesh>

          {/* Mouse */}
          <mesh position={[0.25, 0, 0.25]}>
            <boxGeometry args={[0.05, 0.015, 0.08]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
        </group>
      ))}

      {/* Chairs */}
      {stations.map((station) => (
        <group
          key={`chair-${station.id}`}
          position={[
            station.position[0] + station.chairOffset[0] * 0.6,
            0,
            station.position[2] + station.chairOffset[2] * 0.6,
          ]}
          rotation={[0, station.rotation, 0]}
          onClick={(e) => {
            e.stopPropagation();
            handleChairClick(station);
          }}
          onPointerOver={() => setHoveredChair(station.id)}
          onPointerOut={() => setHoveredChair(null)}
        >
          {/* Seat */}
          <mesh position={[0, 0.45, 0]} castShadow>
            <boxGeometry args={[0.42, 0.05, 0.42]} />
            <meshStandardMaterial
              color={hoveredChair === station.id ? '#1a1a8a' : '#0a0a5a'}
              roughness={0.7}
            />
          </mesh>
          {/* Backrest */}
          <mesh position={[0, 0.72, -0.18]} castShadow>
            <boxGeometry args={[0.42, 0.5, 0.04]} />
            <meshStandardMaterial
              color={hoveredChair === station.id ? '#1a1a8a' : '#0a0a5a'}
              roughness={0.7}
            />
          </mesh>
          {/* Chair Pole */}
          <mesh position={[0, 0.22, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.45]} />
            <meshStandardMaterial color="#444444" metalness={0.6} />
          </mesh>
          {/* Chair Base */}
          <mesh position={[0, 0.03, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 0.03]} />
            <meshStandardMaterial color="#333333" metalness={0.5} />
          </mesh>
          {/* Wheels */}
          {[0, 72, 144, 216, 288].map((angle, i) => (
            <mesh
              key={i}
              position={[
                Math.cos((angle * Math.PI) / 180) * 0.18,
                0.02,
                Math.sin((angle * Math.PI) / 180) * 0.18,
              ]}
            >
              <sphereGeometry args={[0.025, 8, 8]} />
              <meshStandardMaterial color="#222222" />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
};
