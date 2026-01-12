import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CablePoint {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
}

export const NetworkCables = () => {
  const dataPacketsRef = useRef<THREE.Mesh[]>([]);
  const timeOffsets = useRef<number[]>([]);

  // No cables - Clean lab without cable clutter
  const cables: CablePoint[] = useMemo(() => [], []);

  // Initialize random time offsets for each cable
  useMemo(() => {
    timeOffsets.current = cables.map(() => Math.random() * Math.PI * 2);
  }, [cables]);

  // Create curved path for each cable
  const cableCurves = useMemo(() => {
    return cables.map((cable) => {
      const start = new THREE.Vector3(...cable.start);
      const end = new THREE.Vector3(...cable.end);
      const mid = new THREE.Vector3().lerpVectors(start, end, 0.5);
      mid.y = Math.max(start.y, end.y) + 0.3; // Arc upward

      return new THREE.QuadraticBezierCurve3(start, mid, end);
    });
  }, [cables]);

  // Get points for lines
  const cablePoints = useMemo(() => {
    return cableCurves.map(curve => curve.getPoints(20));
  }, [cableCurves]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    dataPacketsRef.current.forEach((packet, i) => {
      if (packet && cableCurves[i]) {
        // Calculate position along curve with offset
        const t = ((time * 0.5 + timeOffsets.current[i]) % 1);
        const point = cableCurves[i].getPoint(t);
        packet.position.copy(point);
        
        // Pulse scale effect
        const scale = 0.8 + Math.sin(time * 8 + i) * 0.2;
        packet.scale.setScalar(scale);
      }
    });
  });

  return (
    <group>
      {/* Cables */}
      {cables.map((cable, index) => {
        const curve = cableCurves[index];
        const points = cablePoints[index];
        
        return (
          <group key={index}>
            {/* Cable glow tube */}
            <mesh>
              <tubeGeometry args={[curve, 20, 0.025, 8, false]} />
              <meshStandardMaterial
                color={cable.color}
                transparent
                opacity={0.8}
                emissive={cable.color}
                emissiveIntensity={0.4}
              />
            </mesh>

            {/* Data packet */}
            <mesh
              ref={(el) => {
                if (el) dataPacketsRef.current[index] = el;
              }}
            >
              <sphereGeometry args={[0.06, 12, 12]} />
              <meshBasicMaterial color={cable.color} />
            </mesh>
          </group>
        );
      })}

      {/* No connection points - cables removed */}
    </group>
  );
};
