'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// 1. STROMATOLITE (Layered microbial dome)
function StromatoliteMesh() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.4;
  });

  return (
    <group ref={groupRef} scale={[0.85, 0.85, 0.85]}>
      {[0.9, 0.75, 0.6, 0.45, 0.3].map((r, i) => (
        <mesh key={i} position={[0, i * 0.22 - 0.4, 0]}>
          <cylinderGeometry args={[r * 0.85, r, 0.2, 16]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? '#b45309' : '#d97706'}
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}

// 2. ARCHAEOPTERYX (Limestone slab with carbonized relief)
function ArchaeopteryxMesh() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.35;
  });

  return (
    <group ref={groupRef} scale={[0.8, 0.8, 0.8]} rotation={[0.2, 0.3, 0]}>
      {/* Slab */}
      <mesh>
        <boxGeometry args={[1.8, 1.4, 0.15]} />
        <meshStandardMaterial color="#f5f0e6" roughness={0.9} />
      </mesh>
      {/* Carbonized avian skeleton relief */}
      <mesh position={[0, 0, 0.08]}>
        <torusGeometry args={[0.45, 0.05, 8, 24]} />
        <meshStandardMaterial color="#451a03" roughness={0.6} />
      </mesh>
      <mesh position={[0.2, 0.2, 0.08]} rotation={[0, 0, 0.5]}>
        <boxGeometry args={[0.06, 0.6, 0.03]} />
        <meshStandardMaterial color="#451a03" roughness={0.6} />
      </mesh>
    </group>
  );
}

// 3. T-REX SUE (Tyrannosaur Skull & Teeth)
function TRexSkullMesh() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.35;
  });

  return (
    <group ref={groupRef} scale={[0.75, 0.75, 0.75]}>
      {/* Braincase */}
      <mesh position={[-0.2, 0.1, 0]}>
        <boxGeometry args={[0.9, 0.7, 0.8]} />
        <meshStandardMaterial color="#d4b996" roughness={0.6} />
      </mesh>
      {/* Snout */}
      <mesh position={[0.45, 0, 0]}>
        <boxGeometry args={[0.9, 0.5, 0.6]} />
        <meshStandardMaterial color="#c2a785" roughness={0.6} />
      </mesh>
      {/* Eye Socket */}
      <mesh position={[0.05, 0.1, 0.41]}>
        <ringGeometry args={[0.1, 0.22, 12]} />
        <meshBasicMaterial color="#1c1917" side={THREE.DoubleSide} />
      </mesh>
      {/* Teeth */}
      {[-0.1, 0.15, 0.4, 0.65].map((x, idx) => (
        <mesh key={idx} position={[x, -0.32, 0.2]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.05, 0.2, 4]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

// 4. ÖTZI ICEMAN (Copper Axe & Flint Dagger)
function OtziAxeMesh() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.4;
  });

  return (
    <group ref={groupRef} scale={[0.8, 0.8, 0.8]} rotation={[0.2, 0, 0.3]}>
      {/* Yew wood haft handle */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 1.8, 12]} />
        <meshStandardMaterial color="#854d0e" roughness={0.8} />
      </mesh>
      {/* Forged 99.7% pure copper blade */}
      <mesh position={[0.3, 0.65, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.45, 0.25, 0.08]} />
        <meshStandardMaterial color="#ea580c" metalness={0.85} roughness={0.25} />
      </mesh>
      {/* Birch tar & leather lashing binding */}
      <mesh position={[0.08, 0.65, 0]}>
        <sphereGeometry args={[0.16, 12, 12]} />
        <meshStandardMaterial color="#292524" roughness={0.9} />
      </mesh>
    </group>
  );
}

// 5. ANTIKYTHERA MECHANISM (Concentric Bronze Gearing)
function AntikytheraMiniMesh() {
  const groupRef = useRef<THREE.Group>(null);
  const gearRef1 = useRef<THREE.Mesh>(null);
  const gearRef2 = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.25;
    if (gearRef1.current) gearRef1.current.rotation.z += delta * 1.2;
    if (gearRef2.current) gearRef2.current.rotation.z -= delta * 0.8;
  });

  return (
    <group ref={groupRef} scale={[0.85, 0.85, 0.85]}>
      <mesh ref={gearRef1}>
        <torusGeometry args={[0.8, 0.07, 12, 32]} />
        <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.25} />
      </mesh>
      <mesh ref={gearRef2} rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[0.45, 0.05, 12, 24]} />
        <meshStandardMaterial color="#b45309" metalness={0.9} roughness={0.25} />
      </mesh>
      {/* Center spindle */}
      <mesh>
        <cylinderGeometry args={[0.1, 0.1, 0.4, 16]} />
        <meshStandardMaterial color="#92400e" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}

// 6. ROSETTA STONE (Inscribed Granodiorite Slab)
function RosettaStoneMesh() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.35;
  });

  return (
    <group ref={groupRef} scale={[0.85, 0.85, 0.85]} rotation={[0.15, 0.2, 0]}>
      {/* Broken Granodiorite Slab */}
      <mesh>
        <boxGeometry args={[1.2, 1.6, 0.18]} />
        <meshStandardMaterial color="#292524" roughness={0.85} metalness={0.2} />
      </mesh>
      {/* Trilingual Inscription Registers (3 distinct zones) */}
      {[-0.4, 0, 0.4].map((y, idx) => (
        <group key={idx} position={[0, y, 0.1]}>
          <mesh>
            <planeGeometry args={[0.95, 0.24]} />
            <meshBasicMaterial
              color={idx === 0 ? '#a8a29e' : idx === 1 ? '#d6d3d1' : '#f5f5f4'}
              transparent
              opacity={0.35}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

interface MiniSpecimen3DProps {
  id: string;
}

export function MiniSpecimen3D({ id }: MiniSpecimen3DProps) {
  const renderMesh = () => {
    switch (id) {
      case 'stromatolite-pilbara':
        return <StromatoliteMesh />;
      case 'archaeopteryx-london':
        return <ArchaeopteryxMesh />;
      case 'trex-sue':
        return <TRexSkullMesh />;
      case 'otzi-iceman':
        return <OtziAxeMesh />;
      case 'antikythera-mechanism':
        return <AntikytheraMiniMesh />;
      case 'rosetta-stone':
        return <RosettaStoneMesh />;
      default:
        return <AntikytheraMiniMesh />;
    }
  };

  return (
    <div className="w-full h-44 relative bg-[#f8f9fa] border-b border-neutral-200 overflow-hidden cursor-grab active:cursor-grabbing group/canvas">
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={1.8} color="#ffffff" />
        <directionalLight position={[4, 6, 4]} intensity={3.2} color="#fffcf5" />
        <directionalLight position={[-4, -3, -3]} intensity={1.4} color="#e0f2fe" />
        <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.25}>
          {renderMesh()}
        </Float>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={true}
          autoRotateSpeed={1.0}
          dampingFactor={0.06}
        />
      </Canvas>
      <div className="absolute bottom-2 left-3 text-[9px] font-mono uppercase tracking-widest text-neutral-600 bg-white/90 backdrop-blur-md px-2 py-0.5 border border-neutral-200 shadow-xs font-bold flex items-center gap-1.5 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>Drag 3D Orbit ✦</span>
      </div>
    </div>
  );
}
