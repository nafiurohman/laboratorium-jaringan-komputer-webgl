import { Eye, EyeOff, HelpCircle, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HUDProps {
  showLabels: boolean;
  onToggleLabels: () => void;
  isSeated: boolean;
  onStandUp: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const HUD = ({
  showLabels,
  onToggleLabels,
  isSeated,
  onStandUp,
  soundEnabled,
  onToggleSound,
}: HUDProps) => {
  return (
    <>
      {/* Top Left - Title */}
      <div className="absolute top-4 left-4 bg-card/95 border-2 border-border px-4 py-3 shadow-lg">
        <h1 className="text-lg font-bold font-mono uppercase tracking-wider text-foreground">
          🏛️ Lab Jaringan UHW Perbanas
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Metaverse Virtual Lab Experience
        </p>
      </div>

      {/* Top Right - Controls */}
      <div className="absolute top-4 right-4 flex gap-2">
        <Button
          onClick={onToggleLabels}
          variant="outline"
          size="sm"
          className="gap-2 font-mono text-xs uppercase"
        >
          {showLabels ? (
            <>
              <Eye className="h-4 w-4" />
              Keterangan ON
            </>
          ) : (
            <>
              <EyeOff className="h-4 w-4" />
              Keterangan OFF
            </>
          )}
        </Button>

        <Button
          onClick={onToggleSound}
          variant="outline"
          size="icon"
          className="w-9 h-9"
        >
          {soundEnabled ? (
            <Volume2 className="h-4 w-4" />
          ) : (
            <VolumeX className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Bottom Left - Controls Guide */}
      <div className="absolute bottom-4 left-4 bg-card/95 border-2 border-border p-3 shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-mono font-bold text-foreground uppercase">Kontrol</span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs font-mono">
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 bg-secondary border border-border text-secondary-foreground">W A S D</kbd>
            <span className="text-muted-foreground">Jalan</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 bg-secondary border border-border text-secondary-foreground">Mouse</kbd>
            <span className="text-muted-foreground">Lihat</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 bg-secondary border border-border text-secondary-foreground">Click</kbd>
            <span className="text-muted-foreground">Interaksi</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 bg-secondary border border-border text-secondary-foreground">ESC</kbd>
            <span className="text-muted-foreground">Berdiri</span>
          </div>
        </div>
      </div>

      {/* Seated Mode Overlay */}
      {isSeated && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
          <Button
            onClick={onStandUp}
            variant="default"
            size="lg"
            className="gap-2 font-mono uppercase shadow-lg"
          >
            Tekan ESC atau Klik untuk Berdiri
          </Button>
        </div>
      )}

      {/* Crosshair */}
      {!isSeated && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-1 h-1 bg-foreground rounded-full opacity-50" />
        </div>
      )}
    </>
  );
};
