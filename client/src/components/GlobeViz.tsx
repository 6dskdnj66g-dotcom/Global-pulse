import { useEffect, useRef, useState, useMemo } from 'react';
import Globe, { type GlobeMethods } from 'react-globe.gl';
import { useTheme } from '@/hooks/use-theme';
import { useArticles } from '@/hooks/use-articles';
import { useLanguage } from '@/hooks/use-language';
import { Loader2 } from 'lucide-react';

interface GlobeVizProps {
  height?: number;
}

export function GlobeViz({ height = 500 }: GlobeVizProps) {
  const globeEl = useRef<GlobeMethods | undefined>(undefined);
  const { theme } = useTheme();
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  
  // Fetch latest world news for the globe
  const { data: articles } = useArticles({ 
    category: 'World',
    limit: 20
  });

  // Preparare points data for regions
  const pointsData = useMemo(() => {
    return [
      { lat: 25.0, lng: 45.0, title: "Middle East News", category: "Middle East", color: "#ef4444" },
      { lat: 50.0, lng: 10.0, title: "Europe News", category: "Europe", color: "#3b82f6" },
      { lat: 35.0, lng: 105.0, title: "Asia News", category: "Asia", color: "#10b981" },
      { lat: 40.0, lng: -100.0, title: "North America News", category: "North America", color: "#f59e0b" },
      { lat: -15.0, lng: -60.0, title: "South America News", category: "South America", color: "#8b5cf6" },
      { lat: 0.0, lng: 20.0, title: "Africa News", category: "Africa", color: "#ec4899" }
    ];
  }, []);

  const handlePointClick = (point: any) => {
    // Navigate to homepage with category/search filter
    window.location.href = `/?search=${encodeURIComponent(point.category)}`;
  };

  useEffect(() => {
    setMounted(true);
    
    // Auto-rotate
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
    }
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center bg-muted/20 rounded-2xl" style={{ height }}>
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Globe configuration based on theme
  const globeConfig = theme === 'dark' ? {
    globeImageUrl: "//unpkg.com/three-globe/example/img/earth-dark.jpg",
    bumpImageUrl: "//unpkg.com/three-globe/example/img/earth-topology.png",
    backgroundColor: "rgba(0,0,0,0)",
    atmosphereColor: "#3a6ea5",
    atmosphereAltitude: 0.15,
  } : {
    globeImageUrl: "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg",
    bumpImageUrl: "//unpkg.com/three-globe/example/img/earth-topology.png",
    backgroundColor: "rgba(0,0,0,0)",
    atmosphereColor: "#ffffff",
    atmosphereAltitude: 0.1,
  };

  return (
    <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-border/50 bg-card/30 backdrop-blur-sm cursor-move">
      <div className="absolute top-4 left-6 z-10 pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.6)]" />
          <span className="text-xs font-bold uppercase tracking-widest text-foreground/80 font-sans">
            Live Coverage
          </span>
        </div>
      </div>

      <Globe
        ref={globeEl}
        height={height}
        width={undefined} // responsive width
        {...globeConfig}
        pointsData={pointsData}
        pointAltitude={0.1}
        pointColor="color"
        pointRadius={0.5}
        pointsMerge={true}
        pointLabel="title"
        onPointClick={handlePointClick}
        labelsData={pointsData}
        labelLat="lat"
        labelLng="lng"
        labelText="title"
        labelSize={1.5}
        labelDotRadius={0.5}
        labelColor={() => theme === 'dark' ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.9)'}
        labelResolution={2}
        onLabelClick={handlePointClick}
      />
      
      {/* Overlay gradient for better integration */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background via-transparent to-transparent opacity-50" />
    </div>
  );
}
