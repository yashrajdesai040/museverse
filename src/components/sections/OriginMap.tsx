'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { gsap, useGSAP, ScrollTrigger } from '@/lib/gsap';
import { EarthModel } from '../canvas/EarthModel';
import * as THREE from 'three';

// ─── Coordinate data for 5 hotspot locations ─────────────────────────────
const HOTSPOTS = [
  {
    id: 'pilbara',
    name: 'Pilbara Craton',
    entity: 'Pilbara Stromatolite',
    lat: -20.5,
    lng: 117.2,
    coordStr: '20°30′00″S  117°12′00″E',
    age: '3.48 Billion Y.A.',
  },
  {
    id: 'solnhofen',
    name: 'Solnhofen, Bavaria',
    entity: 'Archaeopteryx',
    lat: 48.9,
    lng: 10.9,
    coordStr: '48°54′00″N  010°54′00″E',
    age: '150 Million Y.A.',
  },
  {
    id: 'hell-creek',
    name: 'Hell Creek, South Dakota',
    entity: '"Sue" the T. rex',
    lat: 47.0,
    lng: -105.3,
    coordStr: '47°00′00″N  105°18′00″W',
    age: '67 Million Y.A.',
  },
  {
    id: 'similaun',
    name: 'Similaun Glacier',
    entity: 'Ötzi the Iceman',
    lat: 46.78,
    lng: 10.84,
    coordStr: '46°46′44″N  10°50′23″E',
    age: '5,300 Years Ago',
  },
  {
    id: 'rosetta',
    name: 'Rosetta, Egypt',
    entity: 'Rosetta Stone',
    lat: 31.4,
    lng: 30.4,
    coordStr: '31°24′00″N  030°24′00″E',
    age: '196 B.C.',
  },
];

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function EarthOriginGlobe({ activeIndex }: { activeIndex: number }) {
  const globeRef = useRef<THREE.Group>(null!);
  const currentRotY = useRef(0);
  const currentRotX = useRef(0);

  const active = HOTSPOTS[activeIndex];
  const targetRotY = (-(active.lng + 180) * Math.PI) / 180;
  const targetRotX = (active.lat * Math.PI) / 180;

  useFrame((_, delta) => {
    if (!globeRef.current) return;
    currentRotY.current = THREE.MathUtils.lerp(currentRotY.current, targetRotY, delta * 3);
    currentRotX.current = THREE.MathUtils.lerp(currentRotX.current, targetRotX, delta * 3);
    globeRef.current.rotation.y = currentRotY.current;
    globeRef.current.rotation.x = currentRotX.current;
  });

  return (
    <group ref={globeRef}>
      <EarthModel factor={0.65} />

      {HOTSPOTS.map((h, i) => {
        const pos = latLngToVector3(h.lat, h.lng, 1.85);
        const isActive = i === activeIndex;

        return (
          <group key={h.id} position={pos}>
            <mesh>
              <sphereGeometry args={[isActive ? 0.08 : 0.045, 12, 12]} />
              <meshBasicMaterial color={isActive ? '#d97706' : '#64748b'} />
            </mesh>
            {isActive && (
              <mesh>
                <ringGeometry args={[0.1, 0.16, 24]} />
                <meshBasicMaterial color="#d97706" side={THREE.DoubleSide} />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}

// ─── Coordinate Decoder ──────────────────────────────────────────────────
function CoordDecoder({ target }: { target: string }) {
  const [displayed, setDisplayed] = useState(target.replace(/[^\s°′″NSEW]/g, '?'));
  const revealRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setDisplayed(target.replace(/[^\s°′″NSEW]/g, '?'));
    let progress = 0;
    const chars = target.split('');

    const reveal = () => {
      progress += 1;
      const result = chars
        .map((c, i) => {
          if (i < progress) return c;
          if (/[0-9]/.test(c)) return String(Math.floor(Math.random() * 10));
          return c;
        })
        .join('');
      setDisplayed(result);
      if (progress < chars.length) {
        revealRef.current = setTimeout(reveal, 35);
      }
    };

    revealRef.current = setTimeout(reveal, 200);
    return () => {
      if (revealRef.current) clearTimeout(revealRef.current);
    };
  }, [target]);

  return (
    <span className="font-mono">
      {displayed.split('').map((c, i) => (
        <span key={i} className="coord-char">
          {c}
        </span>
      ))}
    </span>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────
export function OriginMap() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      HOTSPOTS.forEach((_, i) => {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: `top+=${i * 20}% center`,
          end: `top+=${(i + 1) * 20}% center`,
          onEnter: () => setActiveIdx(i),
          onEnterBack: () => setActiveIdx(Math.max(0, i - 1)),
        });
      });
    },
    { scope: sectionRef }
  );

  const active = HOTSPOTS[activeIdx];

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#ffffff] border-b border-neutral-200/90 overflow-hidden"
      style={{ height: '140vh' }}
    >
      {/* Sticky inner */}
      <div className="sticky top-0 h-screen flex flex-col md:flex-row">
        {/* LEFT: 7 cols — Globe Canvas */}
        <div className="w-full md:w-7/12 h-[50vh] md:h-full bg-[#f8f9fa] relative border-b md:border-b-0 md:border-r border-neutral-200">
          <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }}>
            <ambientLight intensity={1.8} color="#ffffff" />
            <directionalLight position={[5, 6, 5]} intensity={3.0} color="#fffcf5" />
            <directionalLight position={[-5, -4, -2]} intensity={1.5} color="#e0f2fe" />
            <EarthOriginGlobe activeIndex={activeIdx} />
          </Canvas>

          {/* Eyebrow */}
          <div className="absolute top-6 left-6 z-10">
            <span className="px-3.5 py-1.5 bg-white/95 text-neutral-800 font-mono font-bold text-[10px] uppercase tracking-widest border border-neutral-200 backdrop-blur-md shadow-xs rounded-full">
              ✦ TOPOGRAPHIC ORIGIN CARTOGRAPHY
            </span>
          </div>
        </div>

        {/* RIGHT: 5 cols — Data Panel */}
        <div className="w-full md:w-5/12 h-[50vh] md:h-full flex flex-col justify-center p-8 md:p-14 bg-[#ffffff] text-neutral-900">
          {/* Progress dots */}
          <div className="flex gap-2.5 mb-8">
            {HOTSPOTS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className={`w-3 h-3 border transition-all duration-200 cursor-pointer ${
                  i === activeIdx
                    ? 'bg-neutral-950 border-neutral-950 scale-110'
                    : 'bg-transparent border-neutral-300 hover:border-neutral-500'
                }`}
                title={`Discovery Site ${i + 1}`}
              />
            ))}
          </div>

          <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 mb-2 font-bold">
            DISCOVERY SITE {activeIdx + 1} / {HOTSPOTS.length}
          </p>

          <h2 className="text-3xl md:text-4xl font-extrabold font-outfit text-neutral-950 uppercase mb-2 variable-heading">
            {active.name}
          </h2>

          <p className="font-mono text-xs text-amber-700 uppercase tracking-wider mb-6 font-bold">
            {active.entity}
          </p>

          {/* Live coordinate decoder */}
          <div className="bg-[#f8f9fa] border border-neutral-200 p-5 mb-6 shadow-xs">
            <p className="font-mono text-[10px] text-neutral-500 uppercase mb-2 font-bold tracking-wider">
              RAW GPS / GEODETIC COORDINATES:
            </p>
            <p className="text-neutral-950 text-xl font-bold leading-relaxed tracking-wider font-mono">
              <CoordDecoder target={active.coordStr} />
            </p>
          </div>

          <div className="flex items-center gap-3 mb-8">
            <span className="px-3 py-1.5 bg-neutral-100 border border-neutral-200 font-mono text-[11px] text-neutral-800 uppercase font-bold">
              ESTIMATED AGE: {active.age}
            </span>
          </div>

          {/* Hotspot nav */}
          <div className="flex gap-3">
            <button
              disabled={activeIdx === 0}
              onClick={() => setActiveIdx((i) => Math.max(0, i - 1))}
              className="px-5 py-2.5 border border-neutral-300 text-neutral-800 hover:border-neutral-950 font-mono text-[10px] uppercase font-bold disabled:opacity-30 transition-colors cursor-pointer"
            >
              ← Prev Locus
            </button>
            <button
              disabled={activeIdx === HOTSPOTS.length - 1}
              onClick={() => setActiveIdx((i) => Math.min(HOTSPOTS.length - 1, i + 1))}
              className="px-5 py-2.5 border border-neutral-300 text-neutral-800 hover:border-neutral-950 font-mono text-[10px] uppercase font-bold disabled:opacity-30 transition-colors cursor-pointer"
            >
              Next Locus →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
