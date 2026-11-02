'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Physics, RigidBody, RapierRigidBody } from '@react-three/rapier';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useGlobalSound } from '@/hooks/useGlobalSound';

interface TicketPhysicsSceneProps {
  onAdmitted: () => void;
  isStamped: boolean;
  onStamp: () => void;
}

// ─── 3D Physical Countertop ───
function CounterDesk() {
  return (
    <RigidBody type="fixed" position={[0, -0.6, 0]}>
      <mesh receiveShadow>
        <boxGeometry args={[14, 0.6, 10]} />
        <meshStandardMaterial
          color="#161616"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      {/* Brass edge trim */}
      <mesh position={[0, 0.31, 3.2]}>
        <boxGeometry args={[14, 0.04, 0.2]} />
        <meshStandardMaterial color="#FFD400" roughness={0.3} metalness={0.8} />
      </mesh>
    </RigidBody>
  );
}

// ─── 3D Physical Ticket with Rapier Dynamics ───
function PhysicalTicket({
  isStamped,
  onHitCounter,
}: {
  isStamped: boolean;
  onHitCounter: () => void;
}) {
  const rigidRef = useRef<RapierRigidBody>(null);
  const hasCollided = useRef(false);

  return (
    <RigidBody
      ref={rigidRef}
      type="dynamic"
      colliders="cuboid"
      position={[0, 3.5, 0.5]}
      rotation={[0.15, 0.25, -0.1]}
      restitution={0.25}
      friction={0.85}
      linearDamping={0.5}
      angularDamping={0.5}
      onCollisionEnter={() => {
        if (!hasCollided.current) {
          hasCollided.current = true;
          onHitCounter();
        }
      }}
    >
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.8, 0.03, 1.4]} />
        <meshStandardMaterial
          color="#F2EDE4"
          roughness={0.6}
          metalness={0.05}
        />
      </mesh>

      {/* Ticket Front Label Text */}
      <group position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <Text
          position={[-0.8, 0.45, 0]}
          fontSize={0.12}
          color="#0E0E0E"
          anchorX="left"
          anchorY="middle"
        >
          MUSEO // PASS
        </Text>

        <Text
          position={[-0.8, 0.15, 0]}
          fontSize={0.07}
          color="#0E0E0E"
          anchorX="left"
          anchorY="middle"
        >
          VALID: 4,600 MA → PRESENT
        </Text>

        <Text
          position={[-0.8, -0.15, 0]}
          fontSize={0.06}
          color="#555555"
          anchorX="left"
          anchorY="middle"
        >
          SECTOR: HALL OF DEEP TIME
        </Text>

        <Text
          position={[-0.8, -0.4, 0]}
          fontSize={0.05}
          color="#888888"
          anchorX="left"
          anchorY="middle"
        >
          ||| | |||| || | |||| ||| ||||||| 004600
        </Text>

        {/* Dynamic Stamp Imprint */}
        {isStamped && (
          <group position={[0.7, 0, 0.01]} rotation={[0, 0, -0.18]}>
            <mesh>
              <planeGeometry args={[1.1, 0.5]} />
              <meshBasicMaterial color="#B3261E" transparent opacity={0.9} />
            </mesh>
            <Text
              position={[0, 0, 0.01]}
              fontSize={0.11}
              color="#F2EDE4"
              anchorX="center"
              anchorY="middle"
            >
              ADMITTED
            </Text>
            <Text
              position={[0, -0.14, 0.01]}
              fontSize={0.055}
              color="#F2EDE4"
              anchorX="center"
              anchorY="middle"
            >
              4.6 GA VERIFIED
            </Text>
          </group>
        )}
      </group>
    </RigidBody>
  );
}

// ─── 3D Mechanical Stamper Head ───
function MechanicalStamper({ isStamping }: { isStamping: boolean }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const targetY = isStamping ? 0.35 : 2.5;
    meshRef.current.position.y = THREE.MathUtils.damp(
      meshRef.current.position.y,
      targetY,
      isStamping ? 25 : 8,
      delta
    );
  });

  return (
    <group ref={meshRef} position={[0.7, 2.5, 0.5]}>
      {/* Cylindrical Handle */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 1.2, 16]} />
        <meshStandardMaterial color="#FFD400" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Heavy Stamp Head */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[1.2, 0.3, 0.6]} />
        <meshStandardMaterial color="#0E0E0E" roughness={0.4} metalness={0.8} />
      </mesh>
      {/* Red Inked Base */}
      <mesh position={[0, -0.06, 0]}>
        <boxGeometry args={[1.15, 0.04, 0.55]} />
        <meshStandardMaterial color="#B3261E" roughness={0.9} />
      </mesh>
    </group>
  );
}

export function TicketPhysicsScene({
  onAdmitted,
  isStamped,
  onStamp,
}: TicketPhysicsSceneProps) {
  const { playClick, playStamp, playTear } = useGlobalSound();
  const [isStampingAnim, setIsStampingAnim] = useState(false);
  const [robotQuote, setRobotQuote] = useState(
    'Unit 01: "Please present your physical ticket at the counter."'
  );

  const handleTriggerStamp = () => {
    if (isStamped) return;

    setIsStampingAnim(true);
    setTimeout(() => {
      playStamp();
      onStamp();
      setRobotQuote(
        'Unit 01: "Ticket verified. Four billion years. You have time."'
      );
    }, 120);

    setTimeout(() => {
      setIsStampingAnim(false);
      playTear();
    }, 450);
  };

  return (
    <div className="relative w-full h-[520px] bg-[#0E0E0E] border-3 border-[#0E0E0E] shadow-[8px_8px_0px_#0E0E0E] overflow-hidden">
      {/* 3D Physics Canvas */}
      <Canvas
        dpr={[1, 1.5]}
        shadows
        camera={{ position: [0, 3.2, 4.2], fov: 42 }}
        className="w-full h-full"
      >
        <color attach="background" args={['#101010']} />
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[4, 7, 3]}
          intensity={1.8}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0001}
        />
        <pointLight position={[-3, 2, 2]} intensity={0.8} color="#FFD400" />

        <Physics gravity={[0, -12, 0]}>
          <CounterDesk />
          <PhysicalTicket
            isStamped={isStamped}
            onHitCounter={() => {
              playClick();
              setRobotQuote(
                'Unit 01: "Ticket registered on counter. Press STAMP to authorize entry."'
              );
            }}
          />
        </Physics>

        <MechanicalStamper isStamping={isStampingAnim} />
      </Canvas>

      {/* Top Retro Terminal Overlay */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="bg-[#F2EDE4] text-[#0E0E0E] border-2 border-[#0E0E0E] px-3 py-1 font-mono text-xs font-bold uppercase shadow-[2px_2px_0px_#0E0E0E]">
          COUNTER 01 // ADMISSION TERMINAL
        </div>
        <div className="bg-[#FFD400] text-[#0E0E0E] border-2 border-[#0E0E0E] px-2.5 py-1 font-mono text-xs font-bold uppercase shadow-[2px_2px_0px_#0E0E0E]">
          RAPIER PHYSICS SIM
        </div>
      </div>

      {/* Bottom Robot Dialogue & Interaction Bar */}
      <div className="absolute bottom-4 inset-x-4 bg-[#F2EDE4] text-[#0E0E0E] border-3 border-[#0E0E0E] p-4 shadow-[4px_4px_0px_#0E0E0E] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <p className="font-mono text-xs font-bold text-[#0E0E0E] tracking-tight">
            {robotQuote}
          </p>
          <p className="font-space text-[11px] text-[#0E0E0E]/60 mt-0.5">
            Admission requires physical counter stamp. No passwords or accounts necessary.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {!isStamped ? (
            <button
              onClick={handleTriggerStamp}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#FFD400] hover:bg-[#FFE033] text-[#0E0E0E] border-2 border-[#0E0E0E] shadow-[3px_3px_0px_#0E0E0E] font-mono text-xs font-bold uppercase transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_#0E0E0E] cursor-pointer"
            >
              🔨 STAMP TICKET
            </button>
          ) : (
            <button
              onClick={onAdmitted}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#FFD400] hover:bg-[#FFE033] text-[#0E0E0E] border-2 border-[#0E0E0E] shadow-[4px_4px_0px_#0E0E0E] font-space text-xs font-bold uppercase tracking-wider transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#0E0E0E] cursor-pointer animate-pulse"
            >
              ENTER DEEP TIME →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
