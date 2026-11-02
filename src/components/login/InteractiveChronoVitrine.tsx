'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';

// ─── 3D Rotating Chrono-Ring ───
function ChronoRing({
  radius,
  tube,
  color,
  metalness = 0.85,
  roughness = 0.25,
  speedX = 0,
  speedY = 0,
  speedZ = 0,
  initialRot = [0, 0, 0],
}: {
  radius: number;
  tube: number;
  color: string;
  metalness?: number;
  roughness?: number;
  speedX?: number;
  speedY?: number;
  speedZ?: number;
  initialRot?: [number, number, number];
}) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += speedX * delta;
    meshRef.current.rotation.y += speedY * delta;
    meshRef.current.rotation.z += speedZ * delta;
  });

  return (
    <mesh ref={meshRef} rotation={initialRot}>
      <torusGeometry args={[radius, tube, 16, 64]} />
      <meshStandardMaterial
        color={color}
        metalness={metalness}
        roughness={roughness}
        envMapIntensity={1.2}
      />
    </mesh>
  );
}

// ─── Floating Deep-Time Core (Polyhedral Geode) ───
function TemporalCore({ color = '#FFD400' }: { color?: string }) {
  const coreRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (!coreRef.current) return;
    coreRef.current.rotation.y += delta * 0.35;
    coreRef.current.rotation.x += delta * 0.2;
  });

  return (
    <group ref={coreRef}>
      {/* Outer crystalline facets */}
      <mesh>
        <octahedronGeometry args={[0.75, 1]} />
        <meshStandardMaterial
          color={color}
          roughness={0.15}
          metalness={0.9}
          wireframe={false}
          emissive="#d4af37"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Wireframe overlay for architectural depth */}
      <mesh scale={1.03}>
        <octahedronGeometry args={[0.75, 1]} />
        <meshBasicMaterial color="#ffffff" wireframe={true} transparent opacity={0.35} />
      </mesh>

      {/* Internal warm golden point light */}
      <pointLight color="#FFD400" intensity={2.5} distance={6} decay={2} />
    </group>
  );
}

// ─── Floating Interactive Particle Field ───
function TemporalParticles({ count = 80 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null!);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const gold = new THREE.Color('#FFD400');
    const amber = new THREE.Color('#e5a93c');
    const cyan = new THREE.Color('#7dd3fc');

    for (let i = 0; i < count; i++) {
      const radius = 3.5 + Math.random() * 4.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      const choice = Math.random();
      const c = choice > 0.6 ? gold : choice > 0.25 ? amber : cyan;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.05;
    pointsRef.current.rotation.x += delta * 0.02;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─── Interactive Gyroscope Scene with Cursor Physics ───
function ChronoScene({ mousePos }: { mousePos: { x: number; y: number } }) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(() => {
    if (!groupRef.current) return;
    // Smooth lerp toward mouse target (-0.35 to +0.35 rad)
    const targetRotY = mousePos.x * 0.45;
    const targetRotX = -mousePos.y * 0.35;
    groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.05;
    groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.05;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <Float floatIntensity={0.4} rotationIntensity={0.2} speed={1.2}>
        {/* Core Jewel */}
        <TemporalCore color="#FFD400" />

        {/* Outer Ring: Hadean/Deep Time Titanium */}
        <ChronoRing
          radius={2.7}
          tube={0.035}
          color="#383838"
          metalness={0.9}
          roughness={0.2}
          speedX={0.12}
          speedY={0.08}
          initialRot={[0.4, 0.2, 0]}
        />

        {/* Middle Ring: Proterozoic/Paleozoic Brushed Brass */}
        <ChronoRing
          radius={2.2}
          tube={0.03}
          color="#FFD400"
          metalness={0.88}
          roughness={0.28}
          speedY={-0.18}
          speedZ={0.14}
          initialRot={[-0.5, 0.6, 0.3]}
        />

        {/* Inner Ring: Cenozoic / Human Era Polished Amber */}
        <ChronoRing
          radius={1.65}
          tube={0.025}
          color="#e0a93b"
          metalness={0.92}
          roughness={0.15}
          speedX={-0.2}
          speedZ={-0.15}
          initialRot={[0.7, -0.4, 0.5]}
        />

        {/* Floating Time Markers (Tiny orbital satellites) */}
        <mesh position={[2.7, 0, 0]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshBasicMaterial color="#FFD400" />
        </mesh>
        <mesh position={[-2.2, 0.5, 0]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0, -1.65, 0.4]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color="#7dd3fc" />
        </mesh>
      </Float>

      {/* Floating Particles */}
      <TemporalParticles count={90} />
    </group>
  );
}

// ─── Main Interactive Background ───
export default function InteractiveChronoVitrine() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      setMousePos({
        x: (e.clientX / w) * 2 - 1,
        y: (e.clientY / h) * 2 - 1,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 overflow-hidden bg-[#07080c] select-none"
    >
      {/* ── Blueprint Precision Architectural Grid ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage:
            'radial-gradient(#ffd700 1px, transparent 1px), linear-gradient(to right, rgba(255,215,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,215,0,0.03) 1px, transparent 1px)',
          backgroundSize: '32px 32px, 64px 64px, 64px 64px',
        }}
      />

      {/* Subtle vignette + radial amber depth */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(255,212,0,0.08)_0%,transparent_60%)]" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_100%,rgba(0,0,0,0.85)_0%,transparent_80%)]" />

      {/* Curatorial Archival Watermark Coordinates */}
      <div className="absolute top-6 left-6 font-mono text-[9px] uppercase tracking-widest text-[#FFD400]/40 pointer-events-none hidden md:block">
        <div>CHRONO-OBSERVATORY // SECTOR 01</div>
        <div className="text-white/20 mt-0.5">TEMPORAL RADIUS: 4,600 MA • ACES FILMIC PBR</div>
      </div>

      <div className="absolute bottom-6 left-6 font-mono text-[9px] uppercase tracking-widest text-white/30 pointer-events-none hidden md:block">
        <div>[ DRAG ANYWHERE TO ORBIT VITRINE ]</div>
      </div>

      <div className="absolute top-6 right-6 font-mono text-[9px] uppercase tracking-widest text-[#FFD400]/40 pointer-events-none hidden md:block text-right">
        <div>ISO-21127 CANONICAL</div>
        <div className="text-white/20 mt-0.5">VAULT STATUS: ONLINE</div>
      </div>

      {/* ── R3F WebGL Canvas (Fully Interactive, Drag to Orbit, Pointer Reactive) ── */}
      <div className="absolute inset-0 cursor-grab active:cursor-grabbing">
        <Canvas
          eventSource={containerRef as unknown as React.RefObject<HTMLElement>}
          camera={{ position: [0, 0, 7.8], fov: 42 }}
          dpr={[1, 1.5]}
          gl={{
            powerPreference: 'high-performance',
            antialias: true,
            alpha: true,
            stencil: false,
          }}
        >
          {/* Studio Lighting */}
          <ambientLight intensity={1.2} color="#ffffff" />
          <directionalLight position={[6, 8, 6]} intensity={3.0} color="#fffcf5" />
          <directionalLight position={[-6, -4, -4]} intensity={1.8} color="#7dd3fc" />
          <pointLight position={[mousePos.x * 4, mousePos.y * -4, 4]} intensity={2.5} color="#ffd700" distance={10} />

          {/* Interactive 3D Chrono Scene */}
          <ChronoScene mousePos={mousePos} />

          {/* Orbit Controls (Allows dragging background to inspect in 360°) */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            rotateSpeed={0.65}
            dampingFactor={0.06}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={(Math.PI * 3) / 4}
          />
        </Canvas>
      </div>
    </div>
  );
}
