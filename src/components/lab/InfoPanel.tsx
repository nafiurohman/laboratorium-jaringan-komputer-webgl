import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InfoPanelProps {
  title: string;
  description: string;
  details: string[];
  onClose: () => void;
  icon?: string;
}

export const InfoPanel = ({ title, description, details, onClose, icon = '📋' }: InfoPanelProps) => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card border-2 border-border shadow-lg z-50">
      {/* Header */}
      <div className="flex items-center justify-between bg-primary px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <h2 className="text-lg font-bold font-mono text-primary-foreground uppercase tracking-wider">
            {title}
          </h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-primary-foreground hover:bg-primary-foreground/10 h-8 w-8"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        <p className="text-foreground leading-relaxed">{description}</p>

        <div className="border-t border-border pt-4">
          <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-muted-foreground mb-2">
            Spesifikasi / Fungsi:
          </h3>
          <ul className="space-y-2">
            {details.map((detail, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                <span className="text-primary font-bold">▸</span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-secondary border-t border-border">
        <p className="text-xs text-muted-foreground text-center font-mono">
          Tekan ESC atau klik X untuk menutup
        </p>
      </div>
    </div>
  );
};

// Predefined info for lab equipment
export const labEquipmentInfo = {
  computer: {
    title: 'Komputer Mahasiswa',
    icon: '🖥️',
    description: 'Komputer praktikum yang digunakan mahasiswa untuk melakukan konfigurasi jaringan dan simulasi network.',
    details: [
      'Processor Intel Core i5 / AMD Ryzen 5',
      'RAM 8GB DDR4',
      'Storage SSD 256GB',
      'OS: Windows 10 / Linux Ubuntu',
      'Software: Cisco Packet Tracer, Wireshark, GNS3',
    ],
  },
  switch: {
    title: 'Switch Jaringan',
    icon: '🔌',
    description: 'Switch managed layer 2/3 untuk praktikum VLAN, trunking, dan routing antar VLAN.',
    details: [
      'Cisco Catalyst 2960 Series',
      '24 Port Gigabit Ethernet',
      'Managed Switch dengan CLI',
      'Support VLAN, STP, Port Security',
      'Koneksi antar meja mahasiswa',
    ],
  },
  cabinet: {
    title: 'Rak Server Jaringan',
    icon: '🗄️',
    description: 'Rak server 42U berisi switch jaringan managed untuk infrastruktur lab dan praktikum switching.',
    details: [
      '7x Cisco Catalyst 2960-X Series',
      '24 Port Gigabit Ethernet per switch',
      'Managed Layer 2/3 Switch',
      'Support VLAN, STP, RSTP, MSTP',
      'Port Security & Access Control',
      'SNMP Management & Monitoring',
      'Redundant Power Supply',
    ],
  },
  projector: {
    title: 'Proyektor & Layar',
    icon: '📽️',
    description: 'Sistem proyeksi untuk menampilkan materi praktikum, topologi jaringan, dan demonstrasi konfigurasi.',
    details: [
      'Proyektor Epson EB-X51 3800 Lumens',
      'Resolusi XGA 1024x768',
      'Screen 120 inch Manual',
      'Koneksi HDMI & VGA',
      'Menampilkan topologi & slide materi',
    ],
  },
  desk: {
    title: 'Meja Praktikum',
    icon: '🪑',
    description: 'Meja praktikum berbentuk huruf U yang dirancang untuk kolaborasi dan akses mudah ke perangkat jaringan.',
    details: [
      'Desain U-Shape untuk kolaborasi',
      'Material kayu laminasi tahan lama',
      'Kabel management tersembunyi',
      'Kapasitas 5 workstation',
      'Menghadap ke meja dosen & proyektor',
    ],
  },
};
