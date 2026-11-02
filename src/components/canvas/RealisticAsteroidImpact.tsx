'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useEvolutionStore, latLonToVector3 } from '@/stores/useEvolutionStore';
import { useGlobalSound } from '@/hooks/useGlobalSound';

// Chicxulub authentic impact coordinates: 21.3°N, -89.5°W
const CHICXULUB_COORDS = latLonToVector3(21.3, -89.5, 2.5);

// ── Realistic Asteroid 3D Rock Geometry Generator ──
function createAsteroidGeometry(radius: number) {
  const geom = new THREE.DodecahedronGeometry(radius, 2);
  const pos = geom.attributes.position;
  // Displace vertices with rugged multi-frequency noise for asteroid ridges & craters
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const noise =
      Math.sin(x * 9.0) * Math.cos(y * 9.0) * 0.22 +
      Math.sin(z * 14.0 + x * 6.0) * 0.12 +
      Math.cos(y * 18.0) * 0.08;
    pos.setXYZ(i, x * (1.0 + noise), y * (1.0 + noise), z * (1.0 + noise));
  }
  geom.computeVertexNormals();
  return geom;
}

// ── 3D Ballistic Ejecta Particle Class ──
interface EjectaBoulder {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  rot: THREE.Vector3;
  rotSpeed: THREE.Vector3;
  size: number;
  life: number;
  maxLife: number;
  color: string;
}

// ══════════════════════════════════════════════════════════════════
// 1. CHICXULUB 3D VOLUMETRIC IMPACT SEQUENCE
// ══════════════════════════════════════════════════════════════════
export function ChicxulubImpactVisualizer({ onSeismicImpulse }: { onSeismicImpulse?: (intensity: number) => void }) {
  const impactTriggerKey = useEvolutionStore((s) => s.impactTriggerKey);
  const activeHotspot = useEvolutionStore((s) => s.activeHotspot);
  const { playSeismicRumble, playImpact, playShatter, playLaser } = useGlobalSound();

  const isChicxulubSelected = activeHotspot?.id === 'mesozoic-chicxulub';

  const [animTime, setAnimTime] = useState<number>(-1);
  const asteroidGroupRef = useRef<THREE.Group>(null!);
  const flameConeRef = useRef<THREE.Mesh>(null!);
  const shockwaveDomeRef = useRef<THREE.Mesh>(null!);
  const machRingRef = useRef<THREE.Mesh>(null!);
  const fireballSphereRef = useRef<THREE.Mesh>(null!);
  const eruptingPlumeRef = useRef<THREE.Mesh>(null!);
  const craterRimRef = useRef<THREE.Mesh>(null!);
  const calderaRef = useRef<THREE.Mesh>(null!);
  const impactLightRef = useRef<THREE.PointLight>(null!);

  const targetVec = useMemo(() => new THREE.Vector3(...CHICXULUB_COORDS), []);
  const normal = useMemo(() => targetVec.clone().normalize(), [targetVec]);

  // Authentic 60° re-entry trajectory vector
  const trajectoryDir = useMemo(() => {
    const tangent = new THREE.Vector3(0.55, 0.35, 0.65).normalize();
    return normal.clone().multiplyScalar(0.72).add(tangent.multiplyScalar(0.48)).normalize();
  }, [normal]);

  const startVec = useMemo(() => {
    return targetVec.clone().add(trajectoryDir.clone().multiplyScalar(15.0));
  }, [targetVec, trajectoryDir]);

  // Alignment quaternion for 3D shockwave on the sphere normal
  const normalQuaternion = useMemo(() => {
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
    return q;
  }, [normal]);

  // Asteroid rock geometry
  const asteroidGeom = useMemo(() => createAsteroidGeometry(0.24), []);

  // 40 3D Ballistic Ejecta Boulders
  const ejectaBoulders = useMemo<EjectaBoulder[]>(() => {
    return Array.from({ length: 40 }).map(() => ({
      pos: new THREE.Vector3(),
      vel: new THREE.Vector3(),
      rot: new THREE.Vector3(),
      rotSpeed: new THREE.Vector3(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8
      ),
      size: 0.025 + Math.random() * 0.035,
      life: 0,
      maxLife: 2.2 + Math.random() * 1.6,
      color: Math.random() > 0.35 ? '#ff4400' : '#ffcc00',
    }));
  }, []);

  const ejectaGroupRef = useRef<THREE.Group>(null!);

  // Trigger impact sequence on key change or hotspot select
  const lastKeyRef = useRef(impactTriggerKey);
  useEffect(() => {
    if (impactTriggerKey !== lastKeyRef.current) {
      lastKeyRef.current = impactTriggerKey;
      setAnimTime(0);
      playLaser();
    }
  }, [impactTriggerKey, playLaser]);

  useEffect(() => {
    if (isChicxulubSelected) {
      setAnimTime(0);
      playLaser();
    }
  }, [isChicxulubSelected, playLaser]);

  // Frame animation loop
  useFrame((_, delta) => {
    if (animTime < 0) return;

    const safeDelta = Math.min(delta, 0.08);
    const newTime = animTime + safeDelta;
    setAnimTime(newTime);

    const DURATION_APPROACH = 2.5; // Descent duration

    // ── Phase 1 & 2: Descent & Hypersonic Atmospheric Re-entry Fireball ──
    if (newTime <= DURATION_APPROACH) {
      const progress = newTime / DURATION_APPROACH;
      // Gravitational physics acceleration curve
      const easedProgress = Math.pow(progress, 2.2);

      const currentPos = new THREE.Vector3().lerpVectors(startVec, targetVec, easedProgress);

      if (asteroidGroupRef.current) {
        asteroidGroupRef.current.visible = true;
        asteroidGroupRef.current.position.copy(currentPos);
        // Realistic 3-axis tumble rotation
        asteroidGroupRef.current.rotation.x += safeDelta * 5.2;
        asteroidGroupRef.current.rotation.y += safeDelta * 7.1;
        asteroidGroupRef.current.rotation.z += safeDelta * 3.8;
      }

      // Volumetric Hypersonic Plasma Flame Cone
      if (flameConeRef.current) {
        flameConeRef.current.visible = progress > 0.12;
        flameConeRef.current.position.copy(currentPos);
        flameConeRef.current.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), trajectoryDir);

        const flameLength = 1.2 + progress * 2.8 + Math.sin(newTime * 45) * 0.3;
        flameConeRef.current.scale.set(1.0 + progress * 0.8, flameLength, 1.0 + progress * 0.8);
        const mat = flameConeRef.current.material as THREE.MeshBasicMaterial;
        if (mat) {
          mat.opacity = Math.min(0.95, progress * 1.5);
        }
      }

      // Re-entry illumination of planet and clouds below
      if (impactLightRef.current) {
        impactLightRef.current.position.copy(currentPos);
        impactLightRef.current.intensity = progress > 0.4 ? Math.pow(progress, 4) * 45 : 0;
      }
    }

    // ── Phase 3: The Impact Cataclysm Moment (Explosion Trigger) ──
    if (newTime >= DURATION_APPROACH && animTime - safeDelta < DURATION_APPROACH) {
      playImpact();
      playSeismicRumble();
      playShatter();
      if (onSeismicImpulse) onSeismicImpulse(1.0);

      // Hide descending bolide
      if (asteroidGroupRef.current) asteroidGroupRef.current.visible = false;
      if (flameConeRef.current) flameConeRef.current.visible = false;

      // Launch 3D ejecta boulders outward
      ejectaBoulders.forEach((b) => {
        b.pos.copy(targetVec);
        const lateral = new THREE.Vector3(
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2
        );
        b.vel = normal
          .clone()
          .multiplyScalar(2.0 + Math.random() * 2.8)
          .add(lateral.multiplyScalar(1.4))
          .normalize()
          .multiplyScalar(2.4 + Math.random() * 2.6);
        b.life = 0;
      });
    }

    const impactAge = newTime - DURATION_APPROACH;

    // ── Phase 4: Volumetric 3D Shockwave Dome, Fire Plume & Ejecta ──
    if (impactAge >= 0 && impactAge <= 6.0) {
      // 1. Thermonuclear Fireball Bloom (0 to 0.5s)
      if (fireballSphereRef.current) {
        if (impactAge < 0.5) {
          fireballSphereRef.current.visible = true;
          const flashProgress = impactAge / 0.5;
          const flashScale = Math.sin(flashProgress * Math.PI) * 1.6;
          fireballSphereRef.current.scale.setScalar(flashScale);
          const mat = fireballSphereRef.current.material as THREE.MeshBasicMaterial;
          if (mat) mat.opacity = (1 - flashProgress) * 0.98;
        } else {
          fireballSphereRef.current.visible = false;
        }
      }

      // 2. 3D Volumetric Shockwave Dome (Expanding 3D hemisphere)
      if (shockwaveDomeRef.current) {
        shockwaveDomeRef.current.visible = true;
        const waveProgress = Math.min(1.0, impactAge / 3.4);
        const waveScale = 0.05 + Math.pow(waveProgress, 0.72) * 2.8;
        shockwaveDomeRef.current.scale.set(waveScale, waveScale, waveScale * 0.75);
        const mat = shockwaveDomeRef.current.material as THREE.MeshBasicMaterial;
        if (mat) {
          mat.opacity = Math.max(0, (1 - waveProgress) * 0.85);
        }
      }

      // 3. Supersonic Ionization Mach Ring
      if (machRingRef.current) {
        machRingRef.current.visible = true;
        const ringProgress = Math.min(1.0, impactAge / 2.8);
        const ringScale = 0.05 + Math.pow(ringProgress, 0.65) * 3.2;
        machRingRef.current.scale.set(ringScale, ringScale, 1);
        const mat = machRingRef.current.material as THREE.MeshBasicMaterial;
        if (mat) {
          mat.opacity = Math.max(0, (1 - ringProgress) * 0.9);
        }
      }

      // 4. Vertical Mushroom Ejecta Column (Volcanic Fire Plume)
      if (eruptingPlumeRef.current) {
        eruptingPlumeRef.current.visible = true;
        const plumeProgress = Math.min(1.0, impactAge / 3.8);
        const plumeHeight = 0.2 + Math.pow(plumeProgress, 0.6) * 1.8;
        const plumeWidth = 0.1 + Math.pow(plumeProgress, 0.8) * 0.6;
        eruptingPlumeRef.current.scale.set(plumeWidth, plumeWidth, plumeHeight);
        const mat = eruptingPlumeRef.current.material as THREE.MeshBasicMaterial;
        if (mat) {
          mat.opacity = Math.max(0, (1 - plumeProgress) * 0.85);
        }
      }

      // 5. Update 3D Flying Ejecta Boulders without garbage allocations
      ejectaBoulders.forEach((b, idx) => {
        if (b.life < b.maxLife) {
          b.life += safeDelta;
          // Planetary gravitational pull
          b.vel.x -= (b.pos.x / 2.5) * safeDelta * 4.2;
          b.vel.y -= (b.pos.y / 2.5) * safeDelta * 4.2;
          b.vel.z -= (b.pos.z / 2.5) * safeDelta * 4.2;

          b.pos.x += b.vel.x * safeDelta;
          b.pos.y += b.vel.y * safeDelta;
          b.pos.z += b.vel.z * safeDelta;

          b.rot.x += b.rotSpeed.x * safeDelta;
          b.rot.y += b.rotSpeed.y * safeDelta;
          b.rot.z += b.rotSpeed.z * safeDelta;

          if (ejectaGroupRef.current && ejectaGroupRef.current.children[idx]) {
            const mesh = ejectaGroupRef.current.children[idx] as THREE.Mesh;
            mesh.position.set(b.pos.x, b.pos.y, b.pos.z);
            mesh.rotation.set(b.rot.x, b.rot.y, b.rot.z);
            mesh.scale.setScalar(Math.max(0, (1 - b.life / b.maxLife) * b.size));
          }
        }
      });

      // Point Light Flash
      if (impactLightRef.current) {
        const lightFade = Math.max(0, 1 - impactAge / 1.8);
        impactLightRef.current.intensity = lightFade * 55;
      }
    }

    // ── Phase 5: 3D Raised Crater Rim & Lingering Molten Caldera ──
    if (craterRimRef.current && calderaRef.current) {
      if (impactAge >= 0 && impactAge <= 14.0) {
        craterRimRef.current.visible = true;
        calderaRef.current.visible = true;
        const coolProgress = impactAge / 14.0;

        const calderaMat = calderaRef.current.material as THREE.MeshBasicMaterial;
        if (calderaMat) {
          if (coolProgress < 0.25) calderaMat.color.set('#ffffff');
          else if (coolProgress < 0.55) calderaMat.color.set('#ff5500');
          else calderaMat.color.set('#2b1008');
          calderaMat.opacity = Math.max(0, (1 - coolProgress) * 0.9);
        }

        const rimMat = craterRimRef.current.material as THREE.MeshStandardMaterial;
        if (rimMat) {
          rimMat.emissiveIntensity = Math.max(0, (1 - coolProgress) * 2.2);
        }
      } else {
        craterRimRef.current.visible = false;
        calderaRef.current.visible = false;
      }
    }

    // Reset sequence after completion
    if (newTime > 15.0) {
      setAnimTime(-1);
    }
  });

  return (
    <>
      {/* Dynamic Hypersonic Point Light */}
      <pointLight ref={impactLightRef} color="#ffaa33" distance={15} intensity={0} />

      {/* 3D Asteroid Rock Mesh with Realistic Shading */}
      <group ref={asteroidGroupRef} visible={false}>
        <mesh geometry={asteroidGeom}>
          <meshStandardMaterial
            color="#221814"
            roughness={0.92}
            metalness={0.15}
            emissive="#ff4400"
            emissiveIntensity={2.2}
          />
        </mesh>
      </group>

      {/* Hypersonic Volumetric Plasma Flame Cone */}
      <mesh ref={flameConeRef} visible={false}>
        <coneGeometry args={[0.3, 1.8, 20]} />
        <meshBasicMaterial
          color="#ff7700"
          transparent
          opacity={0.88}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Impact Site Tangent Group (Rotates synchronously with Earth!) */}
      <group position={targetVec.toArray()} quaternion={normalQuaternion}>
        {/* Blinding Thermonuclear Fireball Sphere */}
        <mesh ref={fireballSphereRef} visible={false} position={[0, 0, 0.08]}>
          <sphereGeometry args={[0.45, 32, 32]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.98}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* 3D Volumetric Shockwave Hemisphere Dome (True 3D Curvature) */}
        <mesh ref={shockwaveDomeRef} visible={false} position={[0, 0, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
          <sphereGeometry args={[1.0, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshBasicMaterial
            color="#00f5d4"
            transparent
            opacity={0.85}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Supersonic Mach Shockwave Ground Ring */}
        <mesh ref={machRingRef} visible={false} position={[0, 0, 0.04]}>
          <ringGeometry args={[0.9, 1.05, 64]} />
          <meshBasicMaterial
            color="#ff5500"
            transparent
            opacity={0.9}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Vertical Erupting Fire Mushroom Plume Column */}
        <mesh ref={eruptingPlumeRef} visible={false} position={[0, 0, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.06, 1.4, 20]} />
          <meshBasicMaterial
            color="#ff5500"
            transparent
            opacity={0.85}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* 3D Physical Raised Crater Rim Wall (Torus Geometry) */}
        <mesh ref={craterRimRef} visible={false} position={[0, 0, 0.03]}>
          <torusGeometry args={[0.24, 0.038, 12, 32]} />
          <meshStandardMaterial
            color="#1e130f"
            roughness={0.9}
            emissive="#ff3300"
            emissiveIntensity={2.0}
          />
        </mesh>

        {/* Lingering Molten Caldera Pool */}
        <mesh ref={calderaRef} visible={false} position={[0, 0, 0.015]}>
          <circleGeometry args={[0.22, 32]} />
          <meshBasicMaterial
            color="#ff4400"
            transparent
            opacity={0.9}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* 40 3D Ballistic Ejecta Boulders Flying Through Space */}
      <group ref={ejectaGroupRef}>
        {ejectaBoulders.map((b, i) => (
          <mesh key={i} position={b.pos.toArray()}>
            <dodecahedronGeometry args={[b.size, 0]} />
            <meshStandardMaterial
              color="#1a110d"
              roughness={0.9}
              emissive={b.color}
              emissiveIntensity={1.8}
            />
          </mesh>
        ))}
      </group>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════
// 2. CONTINUOUS HADEAN BOMBARDMENT (Late Heavy Bombardment Engine)
// ══════════════════════════════════════════════════════════════════
// Scratch vectors to prevent GC thrashing in animation frames
const _scratchPos = new THREE.Vector3();
const _scratchDir = new THREE.Vector3();
const _scratchUp = new THREE.Vector3(0, 1, 0);

export function ContinuousHadeanBombardment() {
  const bolides = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const target = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ).normalize().multiplyScalar(2.5);

      const offset = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ).normalize();

      const start = target.clone().add(offset.multiplyScalar(10.0 + Math.random() * 5.0));

      const normal = target.clone().normalize();
      const ringQuat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);

      return {
        id: i,
        start,
        target,
        normal,
        ringQuat,
        speed: 0.65 + Math.random() * 0.5,
        progress: Math.random(),
        size: 0.08 + Math.random() * 0.06,
        impactAge: -1,
      };
    });
  }, []);

  const groupRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    const safeDelta = Math.min(delta, 0.08);

    bolides.forEach((b, idx) => {
      if (b.impactAge < 0) {
        b.progress += safeDelta * b.speed * 0.38;
        const eased = Math.pow(b.progress, 2.0);

        if (groupRef.current && groupRef.current.children[idx]) {
          const container = groupRef.current.children[idx] as THREE.Group;
          const rock = container.children[0];
          const tail = container.children[1];
          const shock = container.children[2];

          if (rock && tail) {
            rock.visible = true;
            tail.visible = b.progress > 0.1;
            _scratchPos.lerpVectors(b.start, b.target, eased);
            rock.position.copy(_scratchPos);
            tail.position.copy(_scratchPos);

            _scratchDir.subVectors(b.start, b.target).normalize();
            tail.quaternion.setFromUnitVectors(_scratchUp, _scratchDir);
            tail.scale.set(1.0, 0.8 + b.progress * 1.5, 1.0);

            rock.rotation.x += safeDelta * 3;
            rock.rotation.y += safeDelta * 4;
          }

          if (shock) shock.visible = false;
        }

        if (b.progress >= 1.0) {
          b.impactAge = 0;
        }
      } else {
        b.impactAge += safeDelta;

        if (groupRef.current && groupRef.current.children[idx]) {
          const container = groupRef.current.children[idx] as THREE.Group;
          const rock = container.children[0];
          const tail = container.children[1];
          const shock = container.children[2] as THREE.Mesh;

          if (rock) rock.visible = false;
          if (tail) tail.visible = false;

          if (shock && b.impactAge < 1.4) {
            shock.visible = true;
            shock.position.copy(b.target);
            shock.quaternion.copy(b.ringQuat);
            const waveScale = b.impactAge * 1.3;
            shock.scale.set(waveScale, waveScale, waveScale * 0.6);
            const mat = shock.material as THREE.MeshBasicMaterial;
            if (mat) mat.opacity = Math.max(0, (1 - b.impactAge / 1.4) * 0.85);
          } else if (shock) {
            shock.visible = false;
          }
        }

        if (b.impactAge > 1.8) {
          b.impactAge = -1;
          b.progress = 0;
          b.target.set(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
          ).normalize().multiplyScalar(2.5);
          const offset = new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
          ).normalize();
          b.start = b.target.clone().add(offset.multiplyScalar(10.0 + Math.random() * 5.0));
          b.normal = b.target.clone().normalize();
          b.ringQuat.setFromUnitVectors(new THREE.Vector3(0, 0, 1), b.normal);
        }
      }
    });
  });

  return (
    <group ref={groupRef}>
      {bolides.map((b) => (
        <group key={b.id}>
          {/* Asteroid Rock */}
          <mesh>
            <dodecahedronGeometry args={[b.size, 0]} />
            <meshStandardMaterial
              color="#201512"
              roughness={0.9}
              emissive="#ff3300"
              emissiveIntensity={1.8}
            />
          </mesh>
          {/* Flame Tail */}
          <mesh>
            <coneGeometry args={[b.size * 1.5, 0.8, 12]} />
            <meshBasicMaterial
              color="#ff5500"
              transparent
              opacity={0.82}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
          {/* 3D Impact Shockwave Hemisphere Dome */}
          <mesh visible={false} rotation={[Math.PI / 2, 0, 0]}>
            <sphereGeometry args={[1.0, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            <meshBasicMaterial
              color="#ff7700"
              transparent
              opacity={0.8}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
