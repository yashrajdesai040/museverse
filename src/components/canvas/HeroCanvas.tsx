'use client';

import React, { useRef, useMemo, memo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { useAppStore } from '@/stores/useAppStore';
import { usePerformanceTier } from '@/hooks/usePerformanceTier';
import { EarthModel } from './EarthModel';

/* ═══════════════════════════════════════════════════════
   HERO 3D CANVAS — ISOLATED THREE.JS GALLERY PIPELINE
   Pure White Architectural Gallery Studio Lighting
   ═══════════════════════════════════════════════════════ */

// ─── Procedural Gallery Light Motes (Subtle floating ambient dust) ───
function GalleryLightMotes({ count = 80 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const p = [];
    for (let i = 0; i < count; i++) {
      p.push({
        x: (Math.random() - 0.5) * 16,
        y: (Math.random() - 0.5) * 12,
        z: (Math.random() - 0.5) * 10,
        vx: 0,
        vy: Math.random() * 0.0015 + 0.0004,
        scale: 0.012 + Math.random() * 0.018,
      });
    }
    return p;
  }, [count]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const safeDelta = Math.min(delta, 0.1);
    const mx = state.pointer.x * 7;
    const my = state.pointer.y * 5;

    particles.forEach((pt, i) => {
      const dx = pt.x - mx;
      const dy = pt.y - my;
      const distSq = dx * dx + dy * dy;

      if (distSq < 2.5 && distSq > 0.001) {
        const force = (2.5 - distSq) * 0.008;
        pt.vx += (dx / Math.sqrt(distSq)) * force;
        pt.vy += (dy / Math.sqrt(distSq)) * force;
      }

      pt.vx *= 0.96;
      pt.vy = pt.vy * 0.98 + 0.0004;
      pt.x += pt.vx * (safeDelta * 60);
      pt.y += pt.vy * (safeDelta * 60);

      if (pt.y > 6) pt.y = -6;
      if (pt.x > 8) pt.x = -8;
      if (pt.x < -8) pt.x = 8;

      dummy.position.set(pt.x, pt.y, pt.z);
      dummy.scale.setScalar(pt.scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#b45309" transparent opacity={0.35} />
    </instancedMesh>
  );
}

// ─── Orbital Telemetry Rings (Titanium & Amber Museum Grade) ───
function OrbitalTelemetryRings({ size = 2.4 }: { size?: number }) {
  const ringRef1 = useRef<THREE.Group>(null!);
  const ringRef2 = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    const safeDelta = Math.min(delta, 0.1);
    if (ringRef1.current) {
      ringRef1.current.rotation.z += safeDelta * 0.07;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.z -= safeDelta * 0.045;
    }
  });

  return (
    <group rotation={[0.41, 0, 0]}>
      {/* Primary Equator Telemetry Ring */}
      <group ref={ringRef1} rotation={[Math.PI / 2, 0, 0]}>
        <mesh>
          <torusGeometry args={[size * 1.35, 0.005, 8, 80]} />
          <meshBasicMaterial color="#0284c7" transparent opacity={0.4} />
        </mesh>
        {/* Cardinal tick marks */}
        {[0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].map((angle, idx) => (
          <mesh key={idx} position={[Math.cos(angle) * (size * 1.35), Math.sin(angle) * (size * 1.35), 0]}>
            <boxGeometry args={[0.07, 0.015, 0.015]} />
            <meshBasicMaterial color="#d97706" transparent opacity={0.75} />
          </mesh>
        ))}
      </group>

      {/* Secondary Outer Latitude Ring */}
      <group ref={ringRef2} rotation={[Math.PI / 2.3, 0.3, 0]}>
        <mesh>
          <torusGeometry args={[size * 1.55, 0.0035, 8, 80]} />
          <meshBasicMaterial color="#64748b" transparent opacity={0.25} />
        </mesh>
      </group>
    </group>
  );
}

// ─── Viewport-Responsive 3D Earth (Pure useFrame mutations) ───
function EarthHeroMesh({ onSpinTrigger }: { onSpinTrigger: () => void }) {
  const groupRef = useRef<THREE.Group>(null!);
  const { viewport } = useThree();
  const mouseNDC = useRef(new THREE.Vector2());

  const isDesktop = viewport.width > 6;
  const targetX = isDesktop ? viewport.width * 0.22 : 0;

  const isDragging = useRef(false);
  const previousX = useRef(0);
  const spinVelocity = useRef(0);
  const hasTriggeredRef = useRef(false);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const safeDelta = Math.min(delta, 0.1);
    mouseNDC.current.set(state.pointer.x, state.pointer.y);

    if (!isDragging.current) {
      spinVelocity.current *= 0.95;
      groupRef.current.rotation.y += safeDelta * 0.25 + spinVelocity.current;

      const mouseDist = Math.hypot(mouseNDC.current.x - (isDesktop ? 0.4 : 0), mouseNDC.current.y);

      if (mouseDist < 0.6) {
        const targetRotX = mouseNDC.current.y * 0.35;
        const targetRotZ = -mouseNDC.current.x * 0.35;
        groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetRotX, 4, safeDelta);
        groupRef.current.rotation.z = THREE.MathUtils.damp(groupRef.current.rotation.z, targetRotZ, 4, safeDelta);
      } else {
        groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, 0, 4, safeDelta);
        groupRef.current.rotation.z = THREE.MathUtils.damp(groupRef.current.rotation.z, 0, 4, safeDelta);
      }
    }

    if (Math.abs(spinVelocity.current) > 0.12 && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      onSpinTrigger();
    }
  });

  const handlePointerDown = (e: any) => {
    isDragging.current = true;
    previousX.current = e.clientX;
  };

  const handlePointerMove = (e: any) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - previousX.current;
    previousX.current = e.clientX;

    const rotSpeed = 0.008;
    if (groupRef.current) {
      groupRef.current.rotation.y += deltaX * rotSpeed;
    }
    spinVelocity.current = deltaX * rotSpeed;
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  return (
    <Float floatIntensity={1.0} speed={1.2} rotationIntensity={0.3}>
      <group
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerOut={handlePointerUp}
        position={[targetX, 0, 0]}
      >
        <EarthModel ref={groupRef} factor={0.38} />
        <OrbitalTelemetryRings size={1.5} />
      </group>
    </Float>
  );
}

// ─── Memoized Isolated Canvas (Never re-renders from DOM UI state) ───
const IsolatedCanvas = memo(function IsolatedCanvas({
  isHighQuality,
  maxDpr,
  particleCount,
  onSpinTrigger,
  isVisible,
}: {
  isHighQuality: boolean;
  maxDpr: number;
  particleCount: number;
  onSpinTrigger: () => void;
  isVisible: boolean;
}) {
  return (
    <Canvas
      frameloop={isVisible ? 'always' : 'never'}
      camera={{ position: [0, 0, 7.5], fov: 45 }}
      dpr={[1, maxDpr]}
      gl={{
        powerPreference: isHighQuality ? 'high-performance' : 'low-power',
        antialias: isHighQuality,
        alpha: true,
        stencil: false,
      }}
    >
      {/* Architectural White Gallery Studio Lighting */}
      <ambientLight intensity={1.8} color="#ffffff" />
      <directionalLight position={[6, 8, 6]} intensity={3.5} color="#fffcf5" />
      <directionalLight position={[-6, -4, -4]} intensity={1.6} color="#e0f2fe" />

      <EarthHeroMesh onSpinTrigger={onSpinTrigger} />
      <GalleryLightMotes count={particleCount} />
    </Canvas>
  );
});

export function HeroCanvas() {
  const router = useRouter();
  const { isLowPower, maxDpr, particleMultiplier } = usePerformanceTier();
  const performanceMode = useAppStore((s) => s.performanceMode);
  const isHighQuality = performanceMode === 'high' && !isLowPower;

  const containerRef = useRef<HTMLDivElement>(null);
  const inspectBadgeRef = useRef<HTMLDivElement>(null);
  const spinNoticeRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    // Ensure GSAP global timeline is locked at standard 1.0x velocity
    gsap.globalTimeline.timeScale(1.0);

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      gsap.globalTimeline.timeScale(1.0);
    };
  }, []);

  // Inspect mode visual indicator without altering GSAP global engine speed
  const handleMouseDown = () => {
    if (inspectBadgeRef.current) {
      inspectBadgeRef.current.classList.add('active');
    }
  };

  const handleMouseUp = () => {
    if (inspectBadgeRef.current) {
      inspectBadgeRef.current.classList.remove('active');
    }
  };

  const handleSpinTrigger = () => {
    if (spinNoticeRef.current) {
      spinNoticeRef.current.style.display = 'block';
    }
    setTimeout(() => {
      router.push('/museum/trex-sue');
    }, 400);
  };

  const particleCount = Math.floor(80 * particleMultiplier);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-auto z-0 cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Inspect Mode Badge Cue */}
      <div
        ref={inspectBadgeRef}
        className="inspect-mode-badge absolute top-6 right-6 z-30 opacity-0 pointer-events-none transition-opacity duration-300 bg-white/90 backdrop-blur-md text-neutral-900 font-mono text-[11px] font-bold border border-neutral-300 px-3.5 py-1.5 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
      >
        [ INSPECT MODE — 10% TIME DILATION ]
      </div>

      {/* High-Velocity Routing Notice */}
      <div
        ref={spinNoticeRef}
        style={{ display: 'none' }}
        className="absolute top-24 left-1/2 -translate-x-1/2 z-50 bg-white/95 backdrop-blur-xl text-neutral-950 font-mono font-bold text-xs uppercase px-6 py-2.5 border border-neutral-300 shadow-[0_10px_30px_rgba(0,0,0,0.1)] animate-bounce rounded-full"
      >
        ⚡ INERTIA OVERDRIVE DETECTED — ROUTING TO T-REX ARCHIVE...
      </div>

      {/* Isolated Three.js Canvas */}
      <IsolatedCanvas
        isHighQuality={isHighQuality}
        maxDpr={maxDpr}
        particleCount={particleCount}
        onSpinTrigger={handleSpinTrigger}
        isVisible={isVisible}
      />
    </div>
  );
}
