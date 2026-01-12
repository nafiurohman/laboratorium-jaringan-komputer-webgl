export const Lighting = () => {
  return (
    <>
      {/* Ambient Light */}
      <ambientLight intensity={0.4} />
      
      {/* Main Ceiling Lights */}
      <group>
        {/* Front Row */}
        {[-5, 0, 5].map((x, i) => (
          <group key={`front-${i}`} position={[x, 3.9, 4]}>
            <mesh>
              <boxGeometry args={[1.5, 0.1, 0.4]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
            </mesh>
            <pointLight position={[0, -0.2, 0]} intensity={0.8} distance={8} color="#fffaf0" />
          </group>
        ))}
        
        {/* Middle Row */}
        {[-5, 0, 5].map((x, i) => (
          <group key={`mid-${i}`} position={[x, 3.9, 0]}>
            <mesh>
              <boxGeometry args={[1.5, 0.1, 0.4]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
            </mesh>
            <pointLight position={[0, -0.2, 0]} intensity={0.8} distance={8} color="#fffaf0" />
          </group>
        ))}
        
        {/* Back Row */}
        {[-5, 0, 5].map((x, i) => (
          <group key={`back-${i}`} position={[x, 3.9, -5]}>
            <mesh>
              <boxGeometry args={[1.5, 0.1, 0.4]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
            </mesh>
            <pointLight position={[0, -0.2, 0]} intensity={0.8} distance={8} color="#fffaf0" />
          </group>
        ))}
      </group>

      {/* Directional Light for shadows */}
      <directionalLight
        position={[5, 10, 5]}
        intensity={0.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />
    </>
  );
};
