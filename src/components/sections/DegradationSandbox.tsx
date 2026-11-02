'use client';

import { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useGlobalSound } from '@/hooks/useGlobalSound';

// ─── Antikythera-like gear mechanism ─────────────────────────────────────
function AntikytheraMechanism({ rustLevel }: { rustLevel: number }) {
  const groupRef = useRef<THREE.Group>(null!);

  // Lerp material properties based on rust level (Bronze → Marine Verdigris Patina)
  const color = useMemo(
    () =>
      new THREE.Color().lerpColors(
        new THREE.Color('#d97706'), // pristine bronze/amber
        new THREE.Color('#2e6355'), // authentic corroded Aegean Sea verdigris patina
        rustLevel
      ),
    [rustLevel]
  );

  const roughness = 0.18 + rustLevel * 0.75;
  const metalness = 0.92 - rustLevel * 0.7;

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * (0.35 - rustLevel * 0.28);
  });

  const gears = [
    { radius: 1.8, tube: 0.08, segments: 24, y: 0, rotX: 0 },
    { radius: 1.2, tube: 0.07, segments: 18, y: 0.2, rotX: 0.3 },
    { radius: 0.7, tube: 0.06, segments: 12, y: -0.15, rotX: -0.2 },
    { radius: 0.35, tube: 0.05, segments: 8, y: 0.05, rotX: 0.5 },
  ];

  return (
    <group ref={groupRef}>
      {gears.map((g, i) => (
        <mesh key={i} position={[0, g.y, 0]} rotation={[g.rotX, 0, 0]}>
          <torusGeometry args={[g.radius, g.tube, 8, g.segments]} />
          <meshStandardMaterial
            color={color}
            roughness={roughness}
            metalness={metalness}
            envMapIntensity={0.6}
          />
        </mesh>
      ))}

      {/* Central spindle */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 1.2, 8]} />
        <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
      </mesh>

      {/* Gear teeth */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 1.88, 0, Math.sin(angle) * 1.88]}
            rotation={[0, -angle, 0]}
          >
            <boxGeometry args={[0.08, 0.06, 0.06]} />
            <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
          </mesh>
        );
      })}
    </group>
  );
}

// ─── Chemical degradation stages ─────────────────────────────────────────
interface DegradationState {
  label: string;
  compounds: string[];
}

function getDegradationState(year: number): DegradationState {
  if (year < 100) {
    return {
      label: 'Pristine Hellenistic Bronze Alloy',
      compounds: ['Cu (Copper 88%)', 'Sn (Tin 12%)', 'Cu₂O (Cuprite film)'],
    };
  }
  if (year < 400) {
    return {
      label: 'Initial Marine Submersion Corrosion',
      compounds: ['CuCl (Nantokite crust)', 'CuCO₃ (Malachite green patina)'],
    };
  }
  if (year < 1200) {
    return {
      label: 'Deep-Sea Marine Sediment Incrustation',
      compounds: ['Cu₂(OH)₃Cl (Atacamite)', 'CaCO₃ (Calcified concretion shell)'],
    };
  }
  return {
    label: 'Complete Mineralization & Bronze Disease',
    compounds: [
      'Cu₂(OH)₃Cl (Paratacamite crumbling)',
      'SnO₂ (Cassiterite core)',
      'FeS₂ (Iron sulfide binding)',
    ],
  };
}

export function DegradationSandbox() {
  const [year, setYear] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const rustLevel = year / 2000;
  const state = getDegradationState(year);
  const { playHover, playClick } = useGlobalSound();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: '250px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#F2EDE4] text-[#0E0E0E] border-b-3 border-[#0E0E0E] py-24 px-6 md:px-12 lg:px-20 relative overflow-hidden select-none"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b-3 border-[#0E0E0E] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 bg-[#FFD400] border-2 border-[#0E0E0E] animate-pulse" />
              <span className="px-3 py-1 bg-[#0E0E0E] text-[#FFD400] border-2 border-[#0E0E0E] font-mono text-xs font-bold uppercase tracking-widest shadow-[2px_2px_0px_#FFD400]">
                CONSERVATION & METALLURGY LABORATORY
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-space uppercase tracking-tight text-[#0E0E0E] mt-1">
              Material Degradation Sandbox
            </h2>
            <p className="text-[#0E0E0E]/75 font-space text-sm sm:text-base max-w-2xl mt-2 font-normal">
              Accelerate 2,000 years of marine chemical oxidation, seawater concretion, and verdigris patina formation in interactive 3D.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {[0, 500, 1200, 2000].map((presetYear) => (
              <button
                key={presetYear}
                onClick={() => {
                  playClick();
                  setYear(presetYear);
                }}
                className={`px-2.5 py-1 text-[11px] font-mono font-bold uppercase border-2 border-[#0E0E0E] transition-all cursor-pointer shadow-[2px_2px_0px_#0E0E0E] ${
                  year === presetYear
                    ? 'bg-[#FFD400] text-[#0E0E0E]'
                    : 'bg-white text-[#0E0E0E] hover:bg-[#FFD400]'
                }`}
              >
                {presetYear === 0 ? 'Pristine' : `+${presetYear}Y`}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border-3 border-[#0E0E0E] p-6 sm:p-10 shadow-[8px_8px_0px_#0E0E0E]">
          {/* LEFT 7 cols — 3D Canvas */}
          <div className="lg:col-span-7 h-[420px] sm:h-[460px] relative bg-[#0E0E0E] border-2 border-[#0E0E0E] overflow-hidden shadow-[4px_4px_0px_#0E0E0E] cursor-grab active:cursor-grabbing">
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
              <span className="px-3 py-1 bg-[#FFD400] text-[#0E0E0E] border-2 border-[#0E0E0E] font-mono font-bold text-[10px] uppercase tracking-widest shadow-[2px_2px_0px_#000]">
                SIMULATION CHAMBER • DRAG TO ORBIT 360°
              </span>
            </div>

            <div className="absolute bottom-4 right-4 z-10 font-mono text-[10px] text-white/50 bg-black/60 px-2 py-1 border border-white/20">
              FRICTION COEFFICIENT: {(0.05 + rustLevel * 0.45).toFixed(3)} µ
            </div>

            <Canvas
              frameloop={isInView ? 'always' : 'never'}
              camera={{ position: [0, 0, 5.2], fov: 42 }}
              dpr={[1, 1.25]}
            >
              <ambientLight intensity={1.8} color="#ffffff" />
              <directionalLight position={[4, 5, 4]} intensity={3.5} color="#fffcf5" />
              <directionalLight position={[-4, -3, -3]} intensity={1.4} color="#e0f2fe" />
              <Float floatIntensity={0.2} speed={1.0}>
                <AntikytheraMechanism rustLevel={rustLevel} />
              </Float>
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                dampingFactor={0.06}
              />
            </Canvas>
          </div>

          {/* RIGHT 5 cols — Controls */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="bg-[#F2EDE4] border-2 border-[#0E0E0E] p-6 mb-6 shadow-[4px_4px_0px_#0E0E0E]">
              <p className="font-mono text-[10px] text-[#0E0E0E]/70 uppercase tracking-widest mb-1 font-bold">
                SIMULATED TIME ANCHOR
              </p>
              <p className="text-[#0E0E0E] text-3xl font-extrabold font-mono tracking-tight">
                {year === 0 ? '150 B.C.' : `A.D. ${150 + year}`}
              </p>
              <p className="font-mono text-xs text-[#B3261E] mt-1 font-bold">
                +{year.toLocaleString()} Years of Marine Submersion
              </p>
            </div>

            {/* Time Slider */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="font-mono text-[11px] text-[#0E0E0E] uppercase tracking-wider font-bold">
                  Oxidation Accelerator (0 → 2,000 Years)
                </label>
                <span className="font-mono text-xs text-[#0E0E0E] font-bold bg-[#FFD400] px-2 py-0.5 border border-[#0E0E0E]">
                  {year} YRS
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="2000"
                step="10"
                value={year}
                onChange={(e) => {
                  playHover();
                  setYear(Number(e.target.value));
                }}
                className="w-full accent-[#0E0E0E] cursor-ew-resize h-3 bg-[#F2EDE4] border-2 border-[#0E0E0E]"
                aria-label="Accelerate material degradation over 2000 years"
              />
            </div>

            {/* Chemical Compounds */}
            <div className="bg-[#F2EDE4] border-2 border-[#0E0E0E] p-5 mb-6 shadow-[4px_4px_0px_#0E0E0E]">
              <p className="font-mono text-[10px] text-[#0E0E0E]/70 uppercase tracking-widest mb-1.5 font-bold">
                CURRENT ALLOY STATUS
              </p>
              <p className="text-[#0E0E0E] font-bold text-sm mb-3 font-space">{state.label}</p>
              <div className="flex flex-wrap gap-1.5">
                {state.compounds.map((c, i) => (
                  <span
                    key={i}
                    className="font-mono text-[10px] text-[#0E0E0E] bg-white border border-[#0E0E0E] px-2 py-0.5 font-bold shadow-[1px_1px_0px_#0E0E0E]"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Structural Integrity Meter */}
            <div className="bg-[#F2EDE4] border-2 border-[#0E0E0E] p-4 shadow-[4px_4px_0px_#0E0E0E]">
              <div className="flex justify-between items-center mb-2 font-mono text-[10px]">
                <span className="text-[#0E0E0E]/80 uppercase font-bold">STRUCTURAL INTEGRITY</span>
                <span className="text-[#0E0E0E] font-bold">
                  {Math.round(100 - rustLevel * 88)}%
                </span>
              </div>
              <div className="w-full h-3 bg-white border-2 border-[#0E0E0E] overflow-hidden">
                <div
                  className="h-full transition-all duration-200"
                  style={{
                    width: `${100 - rustLevel * 88}%`,
                    backgroundColor: rustLevel > 0.6 ? '#dc2626' : rustLevel > 0.3 ? '#d97706' : '#16a34a',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
