import { useState, useCallback, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Stars } from '@react-three/drei';
import * as THREE from 'three';

import { Room } from './lab/Room';
import { Door } from './lab/Door';
import { UShapeDesk } from './lab/UShapeDesk';
import { TeacherArea } from './lab/TeacherArea';
import { NetworkEquipment } from './lab/NetworkEquipment';
import { NetworkCables } from './lab/NetworkCables';
import { Lighting } from './lab/Lighting';
import { AIGuide } from './lab/AIGuide';
import { Controls } from './lab/Controls';
import { HUD } from './lab/HUD';
import { Minimap } from './lab/Minimap';
import { InfoPanel, labEquipmentInfo } from './lab/InfoPanel';

type InfoType = 'computer' | 'switch' | 'cabinet' | 'projector' | 'desk' | null;

const aiMessages = [
  "Selamat datang di Lab Jaringan! Saya Dosen AI yang akan memandu Anda. Klik untuk tips berikutnya!",
  "Gunakan WASD untuk berjalan dan mouse untuk melihat sekeliling. Klik objek untuk melihat informasinya.",
  "Coba klik kursi untuk duduk dan merasakan pengalaman mahasiswa di lab ini.",
  "Perhatikan kabel jaringan berwarna-warni yang menghubungkan komputer ke switch!",
  "Switch jaringan di tengah ruangan menghubungkan semua komputer. Klik untuk detail!",
  "Lemari Mikrotik berisi router untuk praktikum routing dan firewall.",
  "Proyektor menampilkan topologi jaringan. Anda bisa klik untuk melihat lebih detail.",
  "Gunakan minimap di kanan bawah untuk teleport ke lokasi yang berbeda!",
  "Selamat mengeksplorasi Lab Jaringan UHW Perbanas Surabaya! 🎓",
];

// Scene content component
const SceneContent = ({
  isDoorOpen,
  handleDoorToggle,
  handleSit,
  handleComputerClick,
  showLabels,
  setActiveInfo,
  handleAiInteract,
  aiMessageIndex,
  isAiActive,
  isSeated,
  seatPosition,
  seatLookAt,
  teleportTarget,
  setTeleportTarget,
  setPlayerPosition,
}: {
  isDoorOpen: boolean;
  handleDoorToggle: () => void;
  handleSit: (position: THREE.Vector3, lookAt: THREE.Vector3) => void;
  handleComputerClick: (id: number) => void;
  showLabels: boolean;
  setActiveInfo: (info: InfoType) => void;
  handleAiInteract: () => void;
  aiMessageIndex: number;
  isAiActive: boolean;
  isSeated: boolean;
  seatPosition?: THREE.Vector3;
  seatLookAt?: THREE.Vector3;
  teleportTarget: { x: number; z: number } | null;
  setTeleportTarget: (target: null) => void;
  setPlayerPosition: (pos: { x: number; z: number }) => void;
}) => {
  return (
    <>
      <color attach="background" args={['#0a0a0a']} />
      <fog attach="fog" args={['#0a0a0a', 20, 50]} />
      
      <Lighting />
      <Room />
      <Door isOpen={isDoorOpen} onToggle={handleDoorToggle} />
      
      <UShapeDesk
        onSit={handleSit}
        onComputerClick={handleComputerClick}
        showLabels={showLabels}
      />
      
      <TeacherArea
        onProjectorClick={() => setActiveInfo('projector')}
        showLabels={showLabels}
      />
      
      <NetworkEquipment
        onSwitchClick={() => setActiveInfo('switch')}
        onCabinetClick={() => setActiveInfo('cabinet')}
        showLabels={showLabels}
      />
      
      <NetworkCables />
      
      <AIGuide
        position={[5, 0.5, -4]}
        onInteract={handleAiInteract}
        message={aiMessages[aiMessageIndex]}
        isActive={isAiActive}
      />
      
      <Controls
        isSeated={isSeated}
        seatPosition={seatPosition}
        seatLookAt={seatLookAt}
        teleportTarget={teleportTarget}
        onTeleportComplete={() => setTeleportTarget(null)}
        onPositionUpdate={(x, z) => setPlayerPosition({ x, z })}
      />
      
      <Stars radius={100} depth={50} count={1000} factor={4} fade />
      <Environment preset="city" />
    </>
  );
};

export const MetaverseLab = () => {
  const [isDoorOpen, setIsDoorOpen] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isSeated, setIsSeated] = useState(false);
  const [seatPosition, setSeatPosition] = useState<THREE.Vector3 | undefined>();
  const [seatLookAt, setSeatLookAt] = useState<THREE.Vector3 | undefined>();
  const [playerPosition, setPlayerPosition] = useState({ x: -4, z: 8 });
  const [teleportTarget, setTeleportTarget] = useState<{ x: number; z: number } | null>(null);
  const [activeInfo, setActiveInfo] = useState<InfoType>(null);
  const [aiMessageIndex, setAiMessageIndex] = useState(0);
  const [isAiActive, setIsAiActive] = useState(true);

  // Handle ESC key to stand up
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isSeated) {
          setIsSeated(false);
          setSeatPosition(undefined);
          setSeatLookAt(undefined);
        }
        if (activeInfo) {
          setActiveInfo(null);
        }
        document.exitPointerLock?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSeated, activeInfo]);

  const handleDoorToggle = useCallback(() => {
    setIsDoorOpen((prev) => {
      const newDoorState = !prev;
      if (!hasEntered && newDoorState) {
        setTimeout(() => setHasEntered(true), 500);
      }
      return newDoorState;
    });
  }, [hasEntered]);

  const handleSit = useCallback((position: THREE.Vector3, lookAt: THREE.Vector3) => {
    setIsSeated(true);
    setSeatPosition(position);
    setSeatLookAt(lookAt);
    document.exitPointerLock?.();
  }, []);

  const handleStandUp = useCallback(() => {
    setIsSeated(false);
    setSeatPosition(undefined);
    setSeatLookAt(undefined);
  }, []);

  const handleTeleport = useCallback((x: number, z: number) => {
    if (!isSeated) {
      setTeleportTarget({ x, z });
    }
  }, [isSeated]);

  const handleAiInteract = useCallback(() => {
    setAiMessageIndex((prev) => (prev + 1) % aiMessages.length);
    setIsAiActive(true);
  }, []);

  const handleComputerClick = useCallback((id: number) => {
    setActiveInfo('computer');
  }, []);

  return (
    <div className="relative w-full h-screen bg-background overflow-hidden">
      <Canvas
        shadows
        camera={{ fov: 75, near: 0.1, far: 1000, position: [-4, 1.6, 8] }}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <SceneContent
            isDoorOpen={isDoorOpen}
            handleDoorToggle={handleDoorToggle}
            handleSit={handleSit}
            handleComputerClick={handleComputerClick}
            showLabels={showLabels}
            setActiveInfo={setActiveInfo}
            handleAiInteract={handleAiInteract}
            aiMessageIndex={aiMessageIndex}
            isAiActive={isAiActive}
            isSeated={isSeated}
            seatPosition={seatPosition}
            seatLookAt={seatLookAt}
            teleportTarget={teleportTarget}
            setTeleportTarget={setTeleportTarget}
            setPlayerPosition={setPlayerPosition}
          />
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      <HUD
        showLabels={showLabels}
        onToggleLabels={() => setShowLabels((prev) => !prev)}
        isSeated={isSeated}
        onStandUp={handleStandUp}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
      />

      <Minimap playerPosition={playerPosition} onTeleport={handleTeleport} />

      {/* Info Panels */}
      {activeInfo && (
        <InfoPanel
          title={labEquipmentInfo[activeInfo].title}
          description={labEquipmentInfo[activeInfo].description}
          details={labEquipmentInfo[activeInfo].details}
          icon={labEquipmentInfo[activeInfo].icon}
          onClose={() => setActiveInfo(null)}
        />
      )}

      {/* Entry Prompt */}
      {!hasEntered && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="text-center bg-card border-2 border-border p-8 max-w-md shadow-lg">
            <h2 className="text-2xl font-bold font-mono uppercase tracking-wider text-foreground mb-4">
              🏛️ Selamat Datang
            </h2>
            <p className="text-muted-foreground mb-6">
              Lab Jaringan Virtual<br />
              Universitas Hayam Wuruk Perbanas Surabaya
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Klik pintu untuk masuk dan mulai eksplorasi!
            </p>
            <div 
              className="animate-bounce cursor-pointer hover:scale-110 transition-transform"
              onClick={handleDoorToggle}
            >
              <span className="text-4xl">🚪</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
