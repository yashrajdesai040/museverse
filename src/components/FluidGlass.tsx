'use client';

/* eslint-disable react/no-unknown-property */
import * as THREE from 'three';
import React, { useRef, useState, useEffect, memo, useMemo } from 'react';
import { Canvas, createPortal, useFrame, useThree } from '@react-three/fiber';
import {
  useFBO,
  useGLTF,
  useScroll,
  Image,
  Scroll,
  Preload,
  ScrollControls,
  MeshTransmissionMaterial,
  Text
} from '@react-three/drei';
import { easing } from 'maath';

export interface FluidGlassProps {
  mode?: 'lens' | 'bar' | 'cube';
  lensProps?: Record<string, any>;
  barProps?: Record<string, any>;
  cubeProps?: Record<string, any>;
  scale?: number;
  thickness?: number;
  chromaticAberration?: number;
  anisotropy?: number;
  ior?: number;
}

export default function FluidGlass({
  mode = 'lens',
  lensProps = {},
  barProps = {},
  cubeProps = {}
}: FluidGlassProps) {
  const Wrapper = mode === 'bar' ? Bar : mode === 'cube' ? Cube : Lens;
  const rawOverrides = mode === 'bar' ? barProps : mode === 'cube' ? cubeProps : lensProps;

  const {
    navItems = [
      { label: 'Home', link: '' },
      { label: 'About', link: '' },
      { label: 'Contact', link: '' }
    ],
    ...modeProps
  } = rawOverrides;

  return (
    <Canvas camera={{ position: [0, 0, 20], fov: 15 }} gl={{ alpha: true }}>
      {mode === 'bar' && <NavItems items={navItems} />}
      <Wrapper modeProps={modeProps}>
        <Typography />
        <Images />
        <Preload />
      </Wrapper>
    </Canvas>
  );
}

const ModeWrapper = memo(function ModeWrapper({
  children,
  glb,
  geometryKey,
  lockToBottom = false,
  followPointer = true,
  modeProps = {},
  defaultGeoType = 'cylinder',
  ...props
}: {
  children?: React.ReactNode;
  glb?: string;
  geometryKey?: string;
  lockToBottom?: boolean;
  followPointer?: boolean;
  modeProps?: Record<string, any>;
  defaultGeoType?: 'cylinder' | 'box';
  [key: string]: any;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  const buffer = useFBO();
  const { viewport: vp } = useThree();
  const [scene] = useState(() => new THREE.Scene());
  const geoWidthRef = useRef<number>(1);

  // Fallback procedural geometries if GLTF is not loaded/found
  const proceduralCylinder = useMemo(() => new THREE.CylinderGeometry(1, 1, 0.3, 64), []);
  const proceduralBox = useMemo(() => new THREE.BoxGeometry(1.2, 1.2, 0.4), []);

  let loadedGeo: THREE.BufferGeometry | null = null;
  if (glb && geometryKey) {
    try {
      const gltf = useGLTF(glb, '/draco/');
      if (gltf?.nodes?.[geometryKey]) {
        loadedGeo = (gltf.nodes[geometryKey] as THREE.Mesh).geometry;
      }
    } catch {
      // Fallback silently if GLB fails to load
    }
  }

  const geometry = loadedGeo || (defaultGeoType === 'cylinder' ? proceduralCylinder : proceduralBox);

  useEffect(() => {
    if (geometry) {
      geometry.computeBoundingBox();
      if (geometry.boundingBox) {
        geoWidthRef.current = geometry.boundingBox.max.x - geometry.boundingBox.min.x || 1;
      }
    }
  }, [geometry]);

  useFrame((state, delta) => {
    const { gl, viewport, pointer, camera } = state;
    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);

    const destX = followPointer ? (pointer.x * v.width) / 2 : 0;
    const destY = lockToBottom ? -v.height / 2 + 0.2 : followPointer ? (pointer.y * v.height) / 2 : 0;

    if (ref.current) {
      easing.damp3(ref.current.position, [destX, destY, 15], 0.15, delta);

      if (modeProps.scale == null) {
        const maxWorld = v.width * 0.9;
        const desired = maxWorld / geoWidthRef.current;
        ref.current.scale.setScalar(Math.min(0.15, desired));
      }
    }

    gl.setRenderTarget(buffer);
    gl.render(scene, camera);
    gl.setRenderTarget(null);

    // Subtle dark luxury clear color
    gl.setClearColor(0x0a0a0f, 1);
  });

  const { scale, ior, thickness, anisotropy, chromaticAberration, ...extraMat } = modeProps;

  return (
    <>
      {createPortal(children, scene)}
      <mesh scale={[vp.width, vp.height, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={buffer.texture} transparent />
      </mesh>
      <mesh
        ref={ref}
        scale={scale ?? 0.15}
        rotation-x={Math.PI / 2}
        geometry={geometry}
        {...props}
      >
        <MeshTransmissionMaterial
          buffer={buffer.texture}
          ior={ior ?? 1.15}
          thickness={thickness ?? 5}
          anisotropy={anisotropy ?? 0.01}
          chromaticAberration={chromaticAberration ?? 0.1}
          {...extraMat}
        />
      </mesh>
    </>
  );
});

function Lens({ modeProps, ...p }: { modeProps?: Record<string, any>; [key: string]: any }) {
  return (
    <ModeWrapper
      defaultGeoType="cylinder"
      followPointer
      modeProps={modeProps}
      {...p}
    />
  );
}

function Cube({ modeProps, ...p }: { modeProps?: Record<string, any>; [key: string]: any }) {
  return (
    <ModeWrapper
      defaultGeoType="box"
      followPointer
      modeProps={modeProps}
      {...p}
    />
  );
}

function Bar({ modeProps = {}, ...p }: { modeProps?: Record<string, any>; [key: string]: any }) {
  const defaultMat = {
    transmission: 1,
    roughness: 0,
    thickness: 10,
    ior: 1.15,
    color: '#ffffff',
    attenuationColor: '#ffffff',
    attenuationDistance: 0.25
  };

  return (
    <ModeWrapper
      defaultGeoType="box"
      lockToBottom
      followPointer={false}
      modeProps={{ ...defaultMat, ...modeProps }}
      {...p}
    />
  );
}

function NavItems({ items }: { items: Array<{ label: string; link: string }> }) {
  const group = useRef<THREE.Group>(null!);
  const { viewport, camera } = useThree();

  const DEVICE = {
    mobile: { max: 639, spacing: 0.2, fontSize: 0.035 },
    tablet: { max: 1023, spacing: 0.24, fontSize: 0.035 },
    desktop: { max: Infinity, spacing: 0.3, fontSize: 0.035 }
  };
  const getDevice = () => {
    if (typeof window === 'undefined') return 'desktop';
    const w = window.innerWidth;
    return w <= DEVICE.mobile.max ? 'mobile' : w <= DEVICE.tablet.max ? 'tablet' : 'desktop';
  };

  const [device, setDevice] = useState(getDevice());

  useEffect(() => {
    const onResize = () => setDevice(getDevice());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const { spacing, fontSize } = DEVICE[device as keyof typeof DEVICE];

  useFrame(() => {
    if (!group.current) return;
    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);
    group.current.position.set(0, -v.height / 2 + 0.2, 15.1);

    group.current.children.forEach((child, i) => {
      child.position.x = (i - (items.length - 1) / 2) * spacing;
    });
  });

  const handleNavigate = (link: string) => {
    if (!link) return;
    link.startsWith('#') ? (window.location.hash = link) : (window.location.href = link);
  };

  return (
    <group ref={group} renderOrder={10}>
      {items.map(({ label, link }) => (
        <Text
          key={label}
          fontSize={fontSize}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0}
          outlineBlur="20%"
          outlineColor="#000"
          outlineOpacity={0.5}
          renderOrder={10}
          onClick={e => {
            e.stopPropagation();
            handleNavigate(link);
          }}
          onPointerOver={() => (document.body.style.cursor = 'pointer')}
          onPointerOut={() => (document.body.style.cursor = 'auto')}
          {...{ depthWrite: false, depthTest: false } as Record<string, unknown>}
        >
          {label}
        </Text>
      ))}
    </group>
  );
}

function Images() {
  const group = useRef<THREE.Group>(null!);
  const { height } = useThree(s => s.viewport);

  // High quality Unsplash futuristic/art assets as reliable defaults
  const sampleImages = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1000&q=80',
  ];

  useFrame(state => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    const children = group.current.children as any[];
    if (children[0]?.material) children[0].material.zoom = 1 + Math.sin(t * 0.5) * 0.05;
    if (children[1]?.material) children[1].material.zoom = 1 + Math.cos(t * 0.5) * 0.05;
  });

  return (
    <group ref={group}>
      <Image position={[-2, 0, 0]} {...{ scale: [3, height / 1.1, 1] } as Record<string, unknown>} url={sampleImages[0]} />
      <Image position={[2, 0, 3]} {...{ scale: 3 } as Record<string, unknown>} url={sampleImages[1]} />
      <Image position={[-2.05, -height, 6]} {...{ scale: [1, 3, 1] } as Record<string, unknown>} url={sampleImages[2]} />
      <Image position={[-0.6, -height, 9]} {...{ scale: [1, 2, 1] } as Record<string, unknown>} url={sampleImages[0]} />
      <Image position={[0.75, -height, 10.5]} {...{ scale: 1.5 } as Record<string, unknown>} url={sampleImages[1]} />
    </group>
  );
}

function Typography() {
  const DEVICE = {
    mobile: { fontSize: 0.2 },
    tablet: { fontSize: 0.4 },
    desktop: { fontSize: 0.6 }
  };
  const getDevice = () => {
    if (typeof window === 'undefined') return 'desktop';
    const w = window.innerWidth;
    return w <= 639 ? 'mobile' : w <= 1023 ? 'tablet' : 'desktop';
  };

  const [device, setDevice] = useState(getDevice());

  useEffect(() => {
    const onResize = () => setDevice(getDevice());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const { fontSize } = DEVICE[device as keyof typeof DEVICE];

  return (
    <Text
      position={[0, 0, 12]}
      fontSize={fontSize}
      letterSpacing={-0.05}
      outlineWidth={0}
      outlineBlur="20%"
      outlineColor="#000"
      outlineOpacity={0.5}
      color="white"
      anchorX="center"
      anchorY="middle"
    >
      MUSEVERSE
    </Text>
  );
}
