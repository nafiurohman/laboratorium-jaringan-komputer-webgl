import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface AIGuideProps {
  position: [number, number, number];
  onInteract: () => void;
  message: string;
  isActive: boolean;
}

export const AIGuide = ({ position, onInteract, message, isActive }: AIGuideProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      // Floating animation
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      // Gentle rotation
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* NPC Body - Holographic Professor */}
      <group
        onClick={(e) => {
          e.stopPropagation();
          onInteract();
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Body */}
        <mesh position={[0, 0, 0]} castShadow>
          <capsuleGeometry args={[0.25, 0.6, 8, 16]} />
          <meshStandardMaterial
            color={hovered ? '#4a90d9' : '#2563eb'}
            transparent
            opacity={0.8}
            emissive="#3b82f6"
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* Head */}
        <mesh position={[0, 0.65, 0]} castShadow>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial
            color={hovered ? '#4a90d9' : '#2563eb'}
            transparent
            opacity={0.8}
            emissive="#3b82f6"
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* Glasses */}
        <mesh position={[0, 0.68, 0.18]}>
          <boxGeometry args={[0.25, 0.06, 0.02]} />
          <meshStandardMaterial color="#1e3a5f" metalness={0.8} />
        </mesh>

        {/* Eyes */}
        <mesh position={[-0.06, 0.68, 0.2]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.06, 0.68, 0.2]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        {/* Tie */}
        <mesh position={[0, 0.15, 0.26]}>
          <boxGeometry args={[0.08, 0.25, 0.02]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>

        {/* Holographic Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.3, 0]}>
          <torusGeometry args={[0.4, 0.02, 8, 32]} />
          <meshBasicMaterial color="#60a5fa" transparent opacity={0.6} />
        </mesh>

        {/* Floating particles */}
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh
            key={i}
            position={[
              Math.cos((i / 8) * Math.PI * 2) * 0.5,
              -0.3 + (i % 3) * 0.2,
              Math.sin((i / 8) * Math.PI * 2) * 0.5,
            ]}
          >
            <sphereGeometry args={[0.02, 6, 6]} />
            <meshBasicMaterial color="#93c5fd" />
          </mesh>
        ))}
      </group>

      {/* Name Tag */}
      <Html position={[0, 1.1, 0]} center distanceFactor={10}>
        <div className="bg-primary/90 border-2 border-border px-3 py-1 font-mono text-sm text-primary-foreground whitespace-nowrap shadow-md">
          🎓 Dosen AI
        </div>
      </Html>

      {/* Speech Bubble */}
      {isActive && (
        <Html position={[1.2, 1.2, 0]} center distanceFactor={6} style={{ pointerEvents: 'none' }}>
          <div className="bg-card border-2 border-border p-3 max-w-[200px] font-sans text-xs text-card-foreground shadow-lg pointer-events-auto">
            <p className="leading-relaxed">{message}</p>
            <div className="mt-2 text-[10px] text-muted-foreground">
              Klik NPC untuk tips berikutnya →
            </div>
          </div>
        </Html>
      )}

      {/* Interaction hint */}
      {hovered && !isActive && (
        <Html position={[0, 1.4, 0]} center distanceFactor={10}>
          <div className="bg-accent border border-border px-2 py-1 text-xs text-accent-foreground animate-pulse">
            Klik untuk berbicara
          </div>
        </Html>
      )}
    </group>
  );
};
