# 🏛️ MUSEO // System Architecture Documentation

> **Version**: 2.4.0 • **Framework**: Next.js 16 (App Router) • **Rendering**: React Three Fiber (R3F) + Three.js • **State**: Zustand

---

## 1. High-Level Architectural Paradigm

MUSEO is architected around a **Single Shared Data Layer with Dual 3D Presentation Views**:

```
                              ┌─────────────────────────────────────────────────────────┐
                              │                 CENTRAL DATA CORE                       │
                              │           (Universal Entity Dataset & MYA)              │
                              └────────────┬───────────────────────────────┬─────────────┘
                                           │                               │
                ┌──────────────────────────▼──────────┐         ┌──────────▼──────────────────────────┐
                │       Evolution Engine              │         │       Virtual Museum                │
                │  Continuous Scroll-Driven Stage     │         │  Data-Driven Entity Archive         │
                │  Manager & Camera Interpolation     │         │  Dynamic 3D Inspector & Sandbox     │
                │         Route: `/evolution`         │         │     Route: `/museum`, `/museum/:id` │
                └─────────────────────────────────────┘         └─────────────────────────────────────┘
                                           │                               │
                                           └───────────────┬───────────────┘
                                                           ▼
                                      ┌─────────────────────────────────────────┐
                                      │        Zustand Global State Slice       │
                                      │  (useAppStore, useEvolutionStore, etc.) │
                                      └─────────────────────────────────────────┘
```

Both presentation layers read from the central dataset in [`src/data/entities.ts`](file:///c:/Users/DELL/Documents/museverse/src/data/entities.ts), ensuring zero data duplication across the application.

---

## 2. Core Subsystems

### 2.1 The 3D Earth Evolution Engine (`/evolution`)
The Evolution Engine is a scroll-driven, single-canvas experience spanning 4.5 billion years across 5 geological epochs:

1. **Stage 1: Hadean / Primordial Ocean (4.5–3.8 Ga)**:
   - Magma oceans, hydrothermal vents, cyanobacteria.
   - Fog: `#020b14`, Ambient: `#006680`, Cyan bioluminescent particles.
2. **Stage 2: Age of Dinosaurs (252–66 Ma)**:
   - Mesozoic flora, volcanic terrain, golden amber atmosphere.
   - Fog: `#1e140a`, Ambient: `#ff9900`, Volcanic ash particles.
3. **Stage 3: Chicxulub Asteroid Impact (66 Ma)**:
   - High-energy shockwave, fiery particle burst, intense atmospheric red shifts.
   - Fog: `#2b0000`, Ambient: `#ff1a00`, Fast fire particles (450 count).
4. **Stage 4: Pleistocene Ice Age (2.5 Ma – 11.7 ka)**:
   - Sub-zero crystalline structures, glacial tundra, volumetric mist.
   - Fog: `#061326`, Ambient: `#88ddee`, Ice crystal particles.
5. **Stage 5: Dawn of Mankind / Anthropocene (Present)**:
   - 3D interactive Earth globe, human settlement migration paths, orbital telemetry.
   - Fog: `#050814`, Ambient: `#118ab2`, Golden urban light nodes.

#### Stage Manager Implementation:
The stage transitions are managed smoothly inside `useFrame` via exponential damping without triggering React component re-renders:

```typescript
// Smooth frame-delta color interpolation in StageManager.tsx
const damping = 1 - Math.exp(-3.5 * delta);
cFog.current.lerp(new THREE.Color(target.fog), damping);
fogRef.current.color = cFog.current;
state.scene.background = cFog.current;
```

---

### 2.2 The Virtual Museum & 3D Specimen Inspector (`/museum`, `/museum/[slug]`)
A dynamic archive featuring 24 museum-grade specimens categorized into Fossils, Dinosaurs, Ancient Relics, Civilizations, and Celestial Meteorites.

#### Features:
- **Dynamic Routing**: Single template (`/museum/[slug]/page.tsx`) renders any specimen from the universal dataset.
- **3D Orbit Inspector**: Interactive rotation, pan, zoom, wireframe toggle, and multi-light inspection.
- **Material Degradation Sandbox**: Interactive slider simulating centuries of patina, oxidation, and erosion in real time.
- **Origin Geographic Map**: 3D globe plotting exact archeological dig sites with real-time coordinate decoders.

---

### 2.3 The Living Museum Admission & Auth Portal (`/login`)
A 6-stage cinematic entrance experience:
- **Arrival**: Night facade with dual sky searchlights, Latin pediment relief, and cursor parallax.
- **Approach**: Camera dolly toward brutalist entrance arch.
- **Dispensary**: Robotic kiosk with cyan/gold laser printhead sweep.
- **Admission Pass**: 3D interactive ticket card with **24K Holographic Gold Foil Seal**, security clearance meter (`Level 1–3`), and password eye toggle.
- **Verification**: Metallic gold stamp slam (`✓ VERIFIED // ACCESS GRANTED`) with expanding shockwave.
- **Flythrough**: 3D perspective corridor warp through 8 museum wings.

---

## 3. WebGL Performance & Memory Pipeline

```
  GLB 3D Asset
      │
      ▼
  Draco Compression (WebAssembly offload via Google CDN)
      │
      ▼
  Low-Poly Wireframe Suspense Fallback (Instant UI interactivity)
      │
      ▼
  Hardware Tier Detection (usePerformanceTier)
      │
      ├─ High-End Desktop ──► Full 60 FPS, 1.5x DPR, 100% Particles, Shadows
      └─ Mobile / Low Power ─► 1.0x–1.2x DPR, 35% Particles, Disabled Post-Processing
```

### Performance Rules:
1. **Decoupled Render Loop**: Three.js animations mutate refs inside `useFrame` rather than React `useState`.
2. **Draco WebAssembly Offloading**: Fast decoding off the main JavaScript thread.
3. **Adaptive DPR**: Canvas automatically scales pixel ratios dynamically based on frame latency.

---

*MUSEO Architecture Reference • Confidential & Proprietary*
