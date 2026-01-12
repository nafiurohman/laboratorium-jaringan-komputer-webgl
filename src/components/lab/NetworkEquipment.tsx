import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface NetworkEquipmentProps {
  onSwitchClick: () => void;
  onCabinetClick: () => void;
  showLabels: boolean;
}

export const NetworkEquipment = ({ onSwitchClick, onCabinetClick, showLabels }: NetworkEquipmentProps) => {
  const [hovered, setHovered] = useState<string | null>(null);
  const ledRefs = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    ledRefs.current.forEach((led, i) => {
      if (led) {
        const blink = Math.sin(state.clock.elapsedTime * 5 + i * 0.5) > 0;
        (led.material as THREE.MeshBasicMaterial).color.setHex(blink ? 0x00ff00 : 0x004400);
      }
    });
  });

  return (
    <group>
      {/* Network Cabinet (Corner facing entrance) */}
      <group 
        position={[5, 0, 5]}
        rotation={[0, -3 * Math.PI / 4, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onCabinetClick();
        }}
        onPointerOver={() => setHovered('cabinet')}
        onPointerOut={() => setHovered(null)}
      >
        {/* Server Rack Frame */}
        <mesh position={[0, 1.2, 0]} castShadow>
          <boxGeometry args={[1.2, 2.4, 0.8]} />
          <meshStandardMaterial 
            color={hovered === 'cabinet' ? '#1a1a1a' : '#0a0a0a'} 
            roughness={0.3} 
            metalness={0.7}
          />
        </mesh>
        
        {/* Left Glass Door */}
        <mesh position={[-0.25, 1.2, 0.42]}>
          <boxGeometry args={[0.5, 2.2, 0.02]} />
          <meshStandardMaterial color="#2a2a2a" transparent opacity={0.8} />
        </mesh>
        
        {/* Right Glass Door */}
        <mesh position={[0.25, 1.2, 0.42]}>
          <boxGeometry args={[0.5, 2.2, 0.02]} />
          <meshStandardMaterial color="#2a2a2a" transparent opacity={0.8} />
        </mesh>
        
        {/* Left Door Handle */}
        <mesh position={[0.15, 1.2, 0.45]}>
          <boxGeometry args={[0.05, 0.3, 0.05]} />
          <meshStandardMaterial color="#888888" metalness={0.8} />
        </mesh>
        
        {/* Right Door Handle */}
        <mesh position={[-0.15, 1.2, 0.45]}>
          <boxGeometry args={[0.05, 0.3, 0.05]} />
          <meshStandardMaterial color="#888888" metalness={0.8} />
        </mesh>

        {/* Network Switches inside rack */}
        {[0.3, 0.6, 0.9, 1.2, 1.5, 1.8, 2.1].map((y, i) => (
          <group key={i} position={[0, y, 0.1]}>
            {/* Switch Body (1U rack mount) */}
            <mesh>
              <boxGeometry args={[1, 0.2, 0.4]} />
              <meshStandardMaterial color="#1a365d" roughness={0.4} />
            </mesh>
            {/* Front Panel */}
            <mesh position={[0, 0, 0.21]}>
              <boxGeometry args={[0.95, 0.15, 0.02]} />
              <meshStandardMaterial color="#2d3748" roughness={0.3} />
            </mesh>
            {/* Status LEDs */}
            <mesh 
              position={[-0.4, 0.03, 0.22]}
              ref={(el) => { if (el) ledRefs.current[i * 2] = el; }}
            >
              <sphereGeometry args={[0.015, 8, 8]} />
              <meshBasicMaterial color="#00ff00" />
            </mesh>
            <mesh 
              position={[-0.32, 0.03, 0.22]}
              ref={(el) => { if (el) ledRefs.current[i * 2 + 1] = el; }}
            >
              <sphereGeometry args={[0.015, 8, 8]} />
              <meshBasicMaterial color="#ff6600" />
            </mesh>
            {/* Ethernet Ports */}
            {Array.from({ length: 24 }).map((_, j) => (
              <mesh key={j} position={[-0.35 + j * 0.03, -0.03, 0.22]}>
                <boxGeometry args={[0.025, 0.04, 0.02]} />
                <meshStandardMaterial color="#111111" />
              </mesh>
            ))}
            {/* Brand Label */}
            <mesh position={[0.3, 0, 0.22]}>
              <planeGeometry args={[0.2, 0.06]} />
              <meshBasicMaterial color="#0066cc" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Network Switch Rack (Open server rack style) */}
      <group 
        position={[-2.5, 0, -1]}
        onClick={(e) => {
          e.stopPropagation();
          onSwitchClick();
        }}
        onPointerOver={() => setHovered('switch')}
        onPointerOut={() => setHovered(null)}
      >
        {/* Rack Frame - Open design */}
        {/* Left Rail */}
        <mesh position={[-0.35, 0.6, -0.25]} castShadow>
          <boxGeometry args={[0.05, 1.2, 0.05]} />
          <meshStandardMaterial color="#333333" metalness={0.8} />
        </mesh>
        <mesh position={[-0.35, 0.6, 0.25]} castShadow>
          <boxGeometry args={[0.05, 1.2, 0.05]} />
          <meshStandardMaterial color="#333333" metalness={0.8} />
        </mesh>
        
        {/* Right Rail */}
        <mesh position={[0.35, 0.6, -0.25]} castShadow>
          <boxGeometry args={[0.05, 1.2, 0.05]} />
          <meshStandardMaterial color="#333333" metalness={0.8} />
        </mesh>
        <mesh position={[0.35, 0.6, 0.25]} castShadow>
          <boxGeometry args={[0.05, 1.2, 0.05]} />
          <meshStandardMaterial color="#333333" metalness={0.8} />
        </mesh>
        
        {/* Base */}
        <mesh position={[0, 0.05, 0]} castShadow>
          <boxGeometry args={[0.8, 0.1, 0.6]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.5} />
        </mesh>

        {/* Rack-mounted Network Switches */}
        {[0.2, 0.4, 0.6, 0.8, 1.0].map((y, i) => (
          <group key={i} position={[0, y, 0]}>
            {/* Switch Chassis (1U) */}
            <mesh castShadow>
              <boxGeometry args={[0.7, 0.15, 0.45]} />
              <meshStandardMaterial 
                color={hovered === 'switch' ? '#4a5568' : '#2d3748'} 
                roughness={0.3} 
                metalness={0.6}
              />
            </mesh>
            
            {/* Front Bezel */}
            <mesh position={[0, 0, 0.23]}>
              <boxGeometry args={[0.68, 0.13, 0.02]} />
              <meshStandardMaterial color="#1a202c" roughness={0.4} />
            </mesh>
            
            {/* Rack Ears */}
            <mesh position={[-0.38, 0, 0.15]}>
              <boxGeometry args={[0.06, 0.15, 0.3]} />
              <meshStandardMaterial color="#333333" metalness={0.8} />
            </mesh>
            <mesh position={[0.38, 0, 0.15]}>
              <boxGeometry args={[0.06, 0.15, 0.3]} />
              <meshStandardMaterial color="#333333" metalness={0.8} />
            </mesh>
            
            {/* Ethernet Ports (24 ports) */}
            {Array.from({ length: 24 }).map((_, j) => (
              <mesh key={j} position={[-0.3 + j * 0.025, -0.02, 0.24]}>
                <boxGeometry args={[0.02, 0.04, 0.02]} />
                <meshStandardMaterial color="#111111" />
              </mesh>
            ))}
            
            {/* Status LEDs */}
            <mesh 
              position={[-0.32, 0.04, 0.24]}
              ref={(el) => { if (el) ledRefs.current[i * 3] = el; }}
            >
              <sphereGeometry args={[0.01, 8, 8]} />
              <meshBasicMaterial color="#00ff00" />
            </mesh>
            <mesh 
              position={[-0.28, 0.04, 0.24]}
              ref={(el) => { if (el) ledRefs.current[i * 3 + 1] = el; }}
            >
              <sphereGeometry args={[0.01, 8, 8]} />
              <meshBasicMaterial color="#ff6600" />
            </mesh>
            <mesh 
              position={[-0.24, 0.04, 0.24]}
              ref={(el) => { if (el) ledRefs.current[i * 3 + 2] = el; }}
            >
              <sphereGeometry args={[0.01, 8, 8]} />
              <meshBasicMaterial color="#0066ff" />
            </mesh>
            
            {/* Brand Label */}
            <mesh position={[0.25, 0, 0.24]}>
              <planeGeometry args={[0.15, 0.05]} />
              <meshBasicMaterial color="#0066cc" />
            </mesh>
            
            {/* Ventilation Holes */}
            {Array.from({ length: 8 }).map((_, k) => (
              <mesh key={k} position={[-0.2 + k * 0.05, 0, -0.22]}>
                <cylinderGeometry args={[0.008, 0.008, 0.02]} />
                <meshStandardMaterial color="#111111" />
              </mesh>
            ))}
          </group>
        ))}
      </group>
    </group>
  );
};
