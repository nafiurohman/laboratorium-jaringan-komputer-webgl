import { useRef, useEffect } from 'react';

interface MinimapProps {
  playerPosition: { x: number; z: number };
  onTeleport: (x: number, z: number) => void;
}

interface TeleportPoint {
  id: string;
  name: string;
  x: number;
  z: number;
  color: string;
}

const teleportPoints: TeleportPoint[] = [
  { id: 'entrance', name: 'Pintu Masuk', x: -4, z: 5, color: '#22c55e' },
  { id: 'teacher', name: 'Meja Dosen', x: 0, z: -4, color: '#3b82f6' },
  { id: 'switches', name: 'Rak Switch', x: -2.5, z: -1, color: '#f59e0b' },
  { id: 'cabinet', name: 'Rak Server', x: 5, z: 5, color: '#8b5cf6' },
  { id: 'student1', name: 'Meja Mahasiswa', x: -2, z: 1, color: '#ec4899' },
];

export const Minimap = ({ playerPosition, onTeleport }: MinimapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Convert world coordinates to minimap coordinates
  const worldToMinimap = (worldX: number, worldZ: number) => {
    const mapSize = 150;
    const worldSize = 20;
    const x = ((worldX + worldSize / 2) / worldSize) * mapSize;
    const y = ((-worldZ + worldSize / 2) / worldSize) * mapSize;
    return { x, y };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const mapSize = 150;

    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, mapSize, mapSize);

    // Draw room outline
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 130, 104);

    // Draw grid
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 10; i++) {
      ctx.beginPath();
      ctx.moveTo(10 + i * 13, 10);
      ctx.lineTo(10 + i * 13, 114);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(10, 10 + i * 10.4);
      ctx.lineTo(140, 10 + i * 10.4);
      ctx.stroke();
    }

    // Draw door
    const doorPos = worldToMinimap(0, 8);
    ctx.fillStyle = '#854d0e';
    ctx.fillRect(doorPos.x - 10, doorPos.y - 3, 20, 6);

    // Draw teacher desk area
    ctx.fillStyle = '#1e40af';
    ctx.fillRect(50, 95, 50, 15);

    // Draw U-shaped student desks
    ctx.fillStyle = '#854d0e';
    ctx.fillRect(20, 40, 10, 50); // Left side
    ctx.fillRect(120, 40, 10, 50); // Right side
    ctx.fillRect(30, 80, 90, 10); // Bottom

    // Draw switch table
    ctx.fillStyle = '#374151';
    ctx.fillRect(55, 55, 40, 15);

    // Draw cabinet
    ctx.fillStyle = '#4c1d95';
    ctx.fillRect(125, 30, 12, 25);

    // Draw teleport points
    teleportPoints.forEach((point) => {
      const pos = worldToMinimap(point.x, point.z);
      ctx.fillStyle = point.color;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Draw player position
    const playerPos = worldToMinimap(playerPosition.x, playerPosition.z);
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(playerPos.x, playerPos.y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(playerPos.x, playerPos.y, 3, 0, Math.PI * 2);
    ctx.fill();
  }, [playerPosition]);

  return (
    <div className="absolute bottom-4 right-4 bg-card/95 border-2 border-border p-3 shadow-lg">
      <div className="mb-2 text-xs font-mono font-bold text-foreground uppercase tracking-wider">
        🗺️ Peta Lab
      </div>
      
      <canvas
        ref={canvasRef}
        width={150}
        height={120}
        className="border border-border cursor-crosshair"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          // Convert minimap coordinates to world coordinates
          const worldX = (x / 150) * 20 - 10;
          const worldZ = -(y / 120) * 16 + 8;
          
          onTeleport(worldX, worldZ);
        }}
      />

      {/* Teleport Points Legend */}
      <div className="mt-2 space-y-1">
        <div className="text-xs font-mono text-muted-foreground mb-1">Teleport:</div>
        <div className="grid grid-cols-2 gap-1">
          {teleportPoints.map((point) => (
            <button
              key={point.id}
              onClick={() => onTeleport(point.x, point.z)}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-secondary hover:bg-accent border border-border transition-colors text-left"
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: point.color }}
              />
              <span className="truncate text-secondary-foreground">{point.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
