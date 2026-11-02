'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { entities } from '@/data/entities';

// ─── Logarithmic time scale ───────────────────────────────────────────────
const MAX_YEARS = 4_500_000_000;
const LOG_MAX   = Math.log10(MAX_YEARS);
function timeToX(yearsAgo: number): number {
  return (Math.log10(Math.max(yearsAgo, 100)) / LOG_MAX) * 14 - 7;
}

// Estimated physical size (meters) per entity — from real records
const SIZE_MAP: Record<string, number> = {
  'stromatolite-pilbara':    0.15,
  'archaeopteryx-london':    0.5,
  'trex-sue':               12.8,
  'triceratops-hatcher':     9.0,
  'spinosaurus-fsac-kk11':  14.0,
  'lyuba-mammoth':           4.5,
  'smilodon-rancho-la-brea': 2.5,
  'irish-elk':               3.7,
  'megalania':               7.0,
  'moa-giant':               3.6,
  'rosetta-stone':           1.12,
  'antikythera-mechanism':   0.34,
  'tutankhamun-mask':        0.54,
  'nefertiti-bust':          0.5,
  'otzi-iceman':             1.59,
  'terracotta-warrior':      1.83,
  'code-hammurabi':          2.25,
  'venus-willendorf':        0.11,
  'bayeux-tapestry':        70.0,
  'gutenberg-bible':         0.42,
  'antler-harpoon':          0.3,
  'cave-bear-skull':         0.45,
  'human-moa-footprint':     0.25,
  'pilbara-handstencil':     0.22,
};

// ─── Cube instances ───────────────────────────────────────────────────────
function ScatterCubes({
  onHover,
}: {
  onHover: (idx: number | null) => void;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const { camera, raycaster } = useThree();
  const mouseRef = useRef(new THREE.Vector2(99, 99));

  // Positions
  const positions = useMemo(() =>
    entities.map(e => ({
      x: timeToX(e.yearsAgo),
      y: ((SIZE_MAP[e.id] ?? 1) / 14.0) * 6 - 0.5,
    })), []);

  // Set matrix positions
  useEffect(() => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();
    entities.forEach((_, i) => {
      dummy.position.set(positions[i].x, positions[i].y, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [positions]);

  // Mouse tracking
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x =  (e.clientX / window.innerWidth)  * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;
    raycaster.setFromCamera(mouseRef.current, camera);
    const intersects = raycaster.intersectObject(meshRef.current);
    if (intersects.length > 0 && intersects[0].instanceId !== undefined) {
      onHover(intersects[0].instanceId);
    } else {
      onHover(null);
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, entities.length]} frustumCulled={false}>
      <boxGeometry args={[0.35, 0.35, 0.35]} />
      <meshBasicMaterial color="#ffd700" wireframe={false} />
    </instancedMesh>
  );
}

// ─── Axis Labels ──────────────────────────────────────────────────────────
const TIME_TICKS = [
  { years: 1000, label: '1k Y' },
  { years: 1_000_000, label: '1M Y' },
  { years: 100_000_000, label: '100M Y' },
  { years: MAX_YEARS, label: '4.5B Y' },
];

function AxisLines({ hoveredPos }: { hoveredPos: { x: number; y: number } | null }) {
  return (
    <>
      {/* X-axis */}
      <mesh position={[0, -0.8, 0]}>
        <boxGeometry args={[16, 0.02, 0.02]} />
        <meshBasicMaterial color="#333" />
      </mesh>
      {/* Y-axis */}
      <mesh position={[-7.5, 2.5, 0]}>
        <boxGeometry args={[0.02, 6.6, 0.02]} />
        <meshBasicMaterial color="#333" />
      </mesh>

      {/* Time tick marks */}
      {TIME_TICKS.map(tick => {
        const x = timeToX(tick.years);
        return (
          <group key={tick.years}>
            <mesh position={[x, -0.8, 0]}>
              <boxGeometry args={[0.02, 0.15, 0.02]} />
              <meshBasicMaterial color="#555" />
            </mesh>
            <Html position={[x, -1.1, 0]} center style={{ pointerEvents: 'none' }}>
              <span className="scatter-axis-label">{tick.label}</span>
            </Html>
          </group>
        );
      })}

      {/* Laser lines to axes when hovered */}
      {hoveredPos && (
        <>
          {/* Vertical laser to X-axis */}
          <mesh position={[hoveredPos.x, (hoveredPos.y - 0.8) / 2 - 0.4, 0.1]}>
            <boxGeometry args={[0.015, Math.abs(hoveredPos.y + 0.8), 0.015]} />
            <meshBasicMaterial color="#ffd700" />
          </mesh>
          {/* Horizontal laser to Y-axis */}
          <mesh position={[(hoveredPos.x - 7.5) / 2, hoveredPos.y, 0.1]}>
            <boxGeometry args={[Math.abs(hoveredPos.x + 7.5), 0.015, 0.015]} />
            <meshBasicMaterial color="#ffd700" />
          </mesh>
        </>
      )}
    </>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────
export function ArchiveScatterPlot() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const hoveredEntity  = hoveredIdx !== null ? entities[hoveredIdx] : null;
  const hoveredPos = hoveredIdx !== null
    ? {
        x: timeToX(entities[hoveredIdx].yearsAgo),
        y: ((SIZE_MAP[entities[hoveredIdx].id] ?? 1) / 14.0) * 6 - 0.5,
      }
    : null;

  return (
    <section
      className="w-full bg-[#030303] border-b-3 border-black relative"
      style={{ minHeight: '100vh' }}
    >
      {/* Label */}
      <div className="absolute top-6 left-6 z-10">
        <span className="px-3 py-1 bg-[#ffd700] text-black font-mono font-bold text-[10px] uppercase tracking-[0.15em] border-2 border-[#ffd700]">
          [ ARCHIVE SCATTER PLOT — {entities.length} VERIFIED RECORDS ]
        </span>
      </div>

      {/* Axis labels */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10">
        <span className="font-mono text-[10px] text-neutral-600 uppercase tracking-widest">
          X-Axis: Geological Time (Logarithmic) →
        </span>
      </div>
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10">
        <span className="font-mono text-[10px] text-neutral-600 uppercase tracking-widest -rotate-90 block origin-center">
          Y-Axis: Physical Size
        </span>
      </div>

      {/* Hover tooltip */}
      {hoveredEntity && (
        <div className="absolute top-20 right-6 z-20 bg-black border-3 border-[#ffd700] p-4 shadow-[6px_6px_0px_#ffd700] max-w-xs pointer-events-none">
          <p className="font-mono text-[9px] text-neutral-500 uppercase mb-1">{hoveredEntity.periodLabel}</p>
          <p className="font-outfit font-bold text-white text-base mb-1">{hoveredEntity.name}</p>
          <p className="font-mono text-[10px] text-[#ffd700]">
            {hoveredEntity.yearsAgo >= 1_000_000
              ? `${(hoveredEntity.yearsAgo / 1_000_000).toFixed(0)}M years ago`
              : `${hoveredEntity.yearsAgo.toLocaleString()} years ago`}
          </p>
          <p className="font-mono text-[10px] text-neutral-400 mt-1">
            Size: {SIZE_MAP[hoveredEntity.id]?.toFixed(1) ?? '?'}m
          </p>
        </div>
      )}

      {/* 3D Canvas */}
      <div className="w-full h-screen">
        <Canvas camera={{ position: [0, 2, 12], fov: 50 }}>
          <ambientLight intensity={1.5} />
          <ScatterCubes onHover={setHoveredIdx} />
          <AxisLines hoveredPos={hoveredPos} />
        </Canvas>
      </div>
    </section>
  );
}
