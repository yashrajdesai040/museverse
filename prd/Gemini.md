# Gemini

> Exported: 7/25/2026 via Gemini+

---

## 👤 You

You said This is a strong foundation. You already have the most important part defined: the product vision. At this stage, I would avoid thinking about colors, animations, or UI details. Instead, turn this into a proper software architecture and roadmap.  From what you've described, your project is essentially two products combined into one experience:  Interactive Earth Evolution (a cinematic 3D storytelling experience)  Virtual Museum (a searchable digital archive of artifacts, fossils, relics, and civilizations)  These should share one common data system rather than being built as separate applications.  Overall Project Vision  An immersive web experience that tells Earth's 4.5 billion year history through interactive 3D storytelling and a museum-quality digital archive of natural and human history.  The site should feel like a mix of  National Geographic  Google Arts & Culture  NASA visualization  Smithsonian Museum  Unreal Engine interactive demo  but running completely inside a browser.  Proposed Information Architecture  Home  │  ├── Introduction  │  ├── Earth Evolution  │     │  │     ├── Stage 1  │     ├── Stage 2  │     ├── Stage 3  │     ├── Stage 4  │     └── Stage 5  │  ├── Museum  │     │  │     ├── Fossils  │     ├── Dinosaurs  │     ├── Ancient Artifacts  │     ├── Relics  │     ├── Civilizations  │     └── Collections  │  ├── Timeline  │  ├── Search  │  └── About  Main Modules  1. Hero Experience  Purpose  Introduce visitors.  Contains  Fullscreen Earth  Floating atmosphere  Animated stars  Scroll indicator  Intro text  CTA buttons  Ambient audio  2. Evolution Engine  Instead of making five separate pages, make one continuous engine.  EvolutionEngine  ↓  StageManager  ↓  CameraController  ↓  TimelineController  ↓  ModelLoader  ↓  LightingController  ↓  ParticleSystem  ↓  HotspotManager  Every stage simply changes:  models  lighting  shaders  skybox  narration  music  Evolution Stages  Stage 1  Ancient Earth  Models  Ocean  Hydrothermal vents  Single cells  Cyanobacteria  Effects  Water caustics  Fog  Bioluminescence  Stage 2  Dinosaurs  Models  T-Rex  Triceratops  Ferns  Volcanoes  Effects  Wind  Dust  Dynamic shadows  Stage 3  Asteroid  Effects  Fire  Shockwave  Smoke  Particle simulation  Stage 4  Mammals  Models  Mammoth  Saber Tooth  Ice  Glaciers  Stage 5  Humans  Models  Earth  Migration paths  Villages  Agriculture  Ancient cities  Museum System  The museum should be completely data-driven.  Instead of hardcoding artifact pages:  Artifact  ↓  Database Record  ↓  React Component  ↓  Dynamic Page  Example  /museum/rosetta-stone  /museum/t-rex-skull  /museum/venus-de-milo  One page component renders everything.  Universal Entity Schema  Every object (artifact, fossil, relic, civilization, species) should share a common schema.  Entity {  id  slug  name  category  subcategory  era  civilization  species  creator  commissionedBy  discoverer  excavatedBy  discoveryDate  origin  placeOfDiscovery  material  dimensions  weight  age  currentLocation  currentCustodian  condition  authenticity  provenance  historicalSignificance  description  references  images  model3D  audioGuide  relatedEntities  timelinePosition  tags  }  This allows one search system to work for everything.  Gallery  Filters  All  ↓  Category  ↓  Period  ↓  Location  ↓  Civilization  ↓  Material  ↓  Discoverer  ↓  Museum  ↓  Authenticity  ↓  Search  No hardcoded filters.  Everything should be generated from metadata.  Search System  One universal search.  Search examples  T Rex  ↓  T-Rex Skeleton  ↓  Stage 2  ↓  Cretaceous  ↓  Museum Entry  ↓  3D Model  or  Egypt  ↓  Artifacts  ↓  Dynasties  ↓  Relics  ↓  Timeline  ↓  Civilizations  Timeline  A horizontal interactive timeline.  4.5 Billion Years  ↓  Formation  ↓  Life  ↓  Dinosaurs  ↓  Extinction  ↓  Mammals  ↓  Humans  ↓  Modern Day  Clicking any point  ↓  Moves camera  ↓  Loads models  ↓  Updates narration  Asset Pipeline  Blender  ↓  GLB Export  ↓  Draco Compression  ↓  KTX2 Textures  ↓  gltfjsx  ↓  React Component  ↓  Lazy Loading  ↓  Scene  Recommended Folder Structure  app/  │  ├── page.tsx  ├── evolution/  ├── museum/  ├── timeline/  ├── search/  ├── about/  │  components/  │  ├── hero/  ├── evolution/  ├── museum/  ├── timeline/  ├── ui/  ├── layout/  ├── search/  ├── audio/  │  data/  │  ├── entities/  ├── timeline/  ├── civilizations/  ├── species/  │  public/  │  ├── models/  ├── textures/  ├── hdr/  ├── audio/  ├── images/  │  hooks/  │  stores/  │  lib/  │  types/  Technology Stack  LayerTechnologyFrameworkNext.jsLanguageTypeScriptStylingTailwind CSS3D EngineThree.jsReact RendererReact Three FiberHelpersDreiAnimationsGSAP + ScrollTriggerUI MotionFramer MotionPhysics@react-three/rapierPost Processing@react-three/postprocessingStateZustand3D CreationBlenderAsset FormatGLB/GLTFCompressionDraco + Meshopt + KTX2Database (future)PostgreSQL + PrismaCMS (future)Payload CMS or SanityDeploymentVercelDevelopment Roadmap  Phase 1 – Foundation  Next.js project setup  Global layout  Navigation  Hero page  Zustand store  Basic Three.js canvas  Phase 2 – Earth Evolution  Scroll-driven timeline  Five evolution stages  Camera system  Lighting and particle effects  Audio integration  Phase 3 – Museum  Entity schema  Dynamic museum pages  Search  Filters  3D model viewer  Phase 4 – Polish  Performance optimization  Mobile responsiveness  Accessibility  SEO  Analytics  Progressive loading and asset streaming  Based on what you've shared so far, I would keep the visual design on hold until the architecture, data model, and interaction flow are finalized. A well-defined structure will make it much easier to iterate on the UI later without having to redesign the underlying system. optimze promte ☆

---

## ✨ Gemini

Gemini said☆☆

---

## ✨ Gemini

Gemini said☆

---

## ✨ Gemini

Here is an optimized, structured prompt tailored to give a AI development partner (or engineering team) crystal-clear instructions to execute this exact architecture without fluff or scope creep.Key Improvements Made to Your DraftClarified Data-Engine Link: Strictly defines how the 3D Evolution Engine and the Universal Entity Schema cross-reference each other (so an artifact in the Museum links directly to a point in the Evolution Engine timeline).Explicit Performance & Loading Architecture: Added concrete budget limits (e.g., target FPS, drawer/LOD strategy) to ensure a 3D web application running inside React Three Fiber (R3F) stays smooth on consumer devices.Structured Execution Order: Refined the system prompt format so the AI understands its precise role as a Senior Technical Architect & Lead WebGL Developer.Optimized PromptRole: You are a Senior Software Architect and Lead WebGL/3D Front-End Engineer specializing in Next.js (App Router), React Three Fiber (R3F), Three.js, TypeScript, Zustand, and Tailwind CSS.Task: Review, formalize, and begin implementing the technical architecture for "Earth Evolution & Virtual Museum" — a high-performance, browser-based 3D storytelling experience and searchable digital archive combining Earth’s 4.5 billion-year history with museum-grade artifacts.1. Project Core VisionA unified, data-driven web experience combining two primary interfaces over one shared data model:Evolution Engine: A scroll-driven, continuous 3D stage-based camera/scene controller covering 5 major Earth eras.Virtual Museum: A dynamic, metadata-filtered archive for 3D models, artifacts, fossils, and civilizations powered by a Universal Entity Schema.2. Tech Stack & Engineering GuardrailsFramework: Next.js (App Router, SSR for dynamic entity metadata, SEO, and static fallback routes).Language: TypeScript (Strict Mode).3D Stack: Three.js, @react-three/fiber, @react-three/drei, @react-three/postprocessing.Animations: GSAP + ScrollTrigger (for R3F camera keyframing & timeline synchronization), Framer Motion (for DOM overlay UI).State Management: Zustand (for global active stage, time-step index, active entity modal, audio playback context, and performance tiering).Styling: Tailwind CSS.Asset Pipeline Requirements:3D Formats: .glb / .gltf compressed via Draco + KTX2 / Basis Universal textures.Dynamic instantiation via gltfjsx with React Suspense and progressive fallback placeholders.3. Architectural SpecificationsA. Universal Entity Schema (types/entity.ts)Define a fully typed TypeScript interface for all museum assets, fossils, relics, and species:TypeScriptexport type Category = 'fossil' | 'dinosaur' | 'artifact' | 'relic' | 'civilization' | 'collection';

export interface UniversalEntity {
  id: string;
  slug: string;
  name: string;
  category: Category;
  subcategory?: string;
  era: string; // e.g., "Cretaceous", "Hadean"
  timelinePosition: number; // Normalised 0.0 - 1.0 or exact Year/MYA integer for sync with Evolution Engine
  
  // Historical / Contextual Metadata
  civilization?: string;
  species?: string;
  creator?: string;
  commissionedBy?: string;
  discoverer?: string;
  excavatedBy?: string;
  discoveryDate?: string;
  origin?: string;
  placeOfDiscovery?: string;
  material?: string[];
  dimensions?: { height?: string; width?: string; depth?: string; weight?: string };
  age?: string;
  currentLocation?: string;
  currentCustodian?: string;
  condition?: string;
  authenticity?: string;
  provenance?: string[];
  historicalSignificance: string;
  description: string;
  
  // Media Assets
  references?: { title: string; url: string }[];
  images: { url: string; alt: string; caption?: string }[];
  model3D?: {
    glbPath: string;
    dracoCompressed: boolean;
    initialScale?: [number, number, number];
    initialRotation?: [number, number, number];
    boundingRadius?: number;
  };
  audioGuide?: { url: string; duration: number };
  
  // Relationships
  relatedEntityIds?: string[];
  tags: string[];
}
B. Evolution Engine ArchitectureThe engine must be driven by a central manager rather than discrete route mounts:
EvolutionEngine -> StageManager -> CameraController -> TimelineController -> LightingController -> ParticleSystem -> HotspotManager.Implement stage parameters as structured configurations:Stage 1 (Ancient Earth): Primordial ocean, hydrothermal vents, cyanobacteria, fog, bioluminescent shaders, water caustics.Stage 2 (Dinosaurs): Mesozoic fauna/flora, volcanic terrain, dynamic shadows, dust particles.Stage 3 (Asteroid Impact): Shockwave, fire particle simulation, atmospheric smoke, lighting shifts.Stage 4 (Mammals): Glacial ice, tundra, sub-zero volumetric atmospheric fog, Mammoth / Saber-tooth models.Stage 5 (Anthropocene/Humans): Earth globe view, ancient cities, migration paths, urban light nodes.C. Universal Search & Dynamic Filtering LogicImplement a unified indexing engine that operates across all fields of the UniversalEntity schema without hardcoded UI filters.Filters must be dynamically derived at runtime from entity metadata (Categories, Eras, Materials, Locations, Civilizations).4. Recommended Directory TreeMaintain a modular, scalable App Router layout:Plaintextapp/
├── page.tsx                  # Hero / Landing Page
├── evolution/page.tsx        # Evolution Engine View
├── museum/
│   ├── page.tsx              # Dynamic Entity Gallery & Filter Grid
│   └── [slug]/page.tsx       # Unified Dynamic Detail Page (3D Inspector)
├── timeline/page.tsx         # Horizontal Historical Timeline
├── search/page.tsx           # Global Search Engine Interface
└── layout.tsx                # Universal Navigation, Audio Manager, WebGL Canvas Shell

src/
├── components/
│   ├── canvas/               # Shared R3F Viewports, Lights, Canvas Wrappers
│   ├── evolution/            # Stage managers, shaders, camera rigs
│   ├── museum/               # Entity cards, 3D model inspector overlays, filter bars
│   ├── ui/                   # DOM Controls, Framer Motion transitions, HUD
│   └── audio/                # Spatial audio player & ambient controllers
├── data/                     # Mock data sets adhering to UniversalEntity Schema
├── hooks/                    # Custom R3F, Scroll, & Query hooks
├── stores/                   # Zustand stores (useEvolutionStore, useMuseumStore, useAudioStore)
└── types/                    # TypeScript interfaces & types
5. Expected Output / First InstructionsAct as the Tech Lead. Please begin by supplying:Phase 1 Execution Plan: Exact code files to create for the Next.js setup, Zustand state slice (useEvolutionStore), and basic @react-three/fiber canvas container.TypeScript Declarations: The core interface file (src/types/entity.ts) fully exported.Basic Stage Manager Skeleton: A minimal R3F setup showing how state shifts between Stage 1 and Stage 2 smoothly using GSAP or standard frame-delta interpolation (useFrame).How to use this prompt:Feed this structured prompt directly into your AI coding assistant (or share it with your development team). It prevents unproductive conversation about visual design/colors and forces the focus strictly onto clean architecture, typed data models, asset streaming pipelines, and WebGL state management.⭐Заметки☆☆

---

## 👤 You

You said more detailed prompt please  ☆

---

## ✨ Gemini

Gemini said☆☆

---

## ✨ Gemini

Gemini said☆

---

## ✨ Gemini

Here is a comprehensive, production-grade System Architecture Document & Implementation Blueprint Prompt. This prompt is engineered to serve as a complete technical directive for an AI developer, lead architect, or engineering team.It leaves zero room for ambiguity regarding data flow, WebGL memory management, state machine boundaries, or Next.js App Router conventions.Optimized Production Directive & Architectural PromptMarkdown# SYSTEM ARCHITECT & TECHNICAL DIRECTIVE

## 1. IDENTITY & GOALS
You are a Principal Software Architect and Lead WebGL/3D Front-End Engineer specializing in Next.js (App Router), React Three Fiber (R3F), Three.js, TypeScript (Strict Mode), Zustand, and Tailwind CSS.

Your mission is to architect and build **"Earth Evolution & Virtual Museum"** — an enterprise-grade, browser-based 3D storytelling experience and digital archive combining Earth’s 4.5-billion-year history with a searchable, museum-grade collection of artifacts, fossils, species, and civilizations.

---

## 2. CORE ARCHITECTURAL PARADIGM

The system operates as a **Single Shared WebGL Context with Dual Presentation Layers**:
1. **The Evolution Engine (Continuous 3D Journey):** A scroll-driven, stage-based WebGL scene controlled via frame interpolation, camera rigs, shader switches, and environmental particle systems.
2. **The Virtual Museum (Data-Driven Archive):** A dynamic interface powered by a **Universal Entity Schema**. It allows visitors to search, filter, inspect 3D models with orbit controls, and read rich historical provenance.

              ┌───────────────────────────────────────────────┐
              │          Zustand Global Core Store            │
              │   (Active Stage, Audio State, Entity ID)      │
              └───────┬───────────────────────────────┬───────┘
                      │                               │
   ┌──────────────────▼──────────┐         ┌──────────▼──────────────────┐
   │     Evolution Engine        │         │       Virtual Museum        │
   │  (Scroll-driven Stage Manager│         │   (Universal Entity Grid &   │
   │    & R3F Camera Interpolation)│         │     Interactive 3D Inspector) │
   └─────────────────────────────┘         └─────────────────────────────┘

Both presentation layers read from the same underlying dataset (`data/entities/`), ensuring zero data duplication across the application.

---

## 3. TECHNICAL STACK & DEPENDENCY BOUNDARIES

* **Framework:** Next.js 14+ (App Router, Server Components for metadata indexing, Client Components for R3F canvas nodes).
* **Language:** TypeScript 5.0+ (Strict Type Checking enabled).
* **3D Stack:**
  * `three` (Core WebGL framework)
  * `@react-three/fiber` (React reconciler for Three.js)
  * `@react-three/drei` (Canvas helpers, OrbitControls, Environment, UseGLTF, BakeShadows, Preload)
  * `@react-three/postprocessing` (Volumetric lighting, Bloom, Depth of Field)
* **Animation & Motion:**
  * `gsap` + `ScrollTrigger` (Frame-accurate canvas camera moves & 3D keyframing)
  * `framer-motion` (UI overlay transitions, dynamic page routes, modal slide-ins)
* **State Management:** `zustand` with selector memoization (`useShallow`).
* **Styling & Layout:** Tailwind CSS + Radix UI primitives (for accessible dialogs, tooltips, and popovers).
* **Asset Compression Pipeline:**
  * Models: `.glb` / `.gltf` compressed via **Draco** + **Meshopt**.
  * Textures: **KTX2 / Basis Universal** GPU-compressed texture formats.
  * Lazy Instantiation: React `Suspense` fallbacks with low-poly/point-cloud bounding volume indicators.

---

## 4. DETAILED DOMAIN DATA SCHEMAS

### A. Universal Entity Schema (`src/types/entity.ts`)
Every artifact, fossil, dinosaur, relic, and civilization shares this schema to power universal search, filtering, and cross-linking:

```typescript
export type EntityCategory = 
  | 'fossil' 
  | 'dinosaur' 
  | 'artifact' 
  | 'relic' 
  | 'civilization' 
  | 'species';

export interface BoundingBox3D {
  center: [number, number, number];
  size: [number, number, number];
}

export interface Model3DConfig {
  glbPath: string;
  dracoCompressed: boolean;
  ktx2Textures: boolean;
  initialScale?: [number, number, number];
  initialRotation?: [number, number, number];
  cameraOffset?: [number, number, number];
  boundingVolume?: BoundingBox3D;
  polygonCount?: number;
}

export interface UniversalEntity {
  id: string;
  slug: string;
  name: string;
  category: EntityCategory;
  subcategory?: string;
  era: string; // e.g., "Hadean", "Mesozoic", "Cretaceous", "Holocene"
  timelinePositionMYA: number; // Million Years Ago (e.g., 4500 for Earth formation, 66 for T-Rex)
  normalizedTimelineStep: number; // 0.0 (Formation) to 1.0 (Modern Era)

  // Contextual Provenance
  civilization?: string;
  species?: string;
  creator?: string;
  discoverer?: string;
  discoveryDate?: string;
  placeOfDiscovery?: string;
  materials?: string[];
  dimensions?: {
    heightCM?: number;
    widthCM?: number;
    depthCM?: number;
    weightKG?: number;
  };
  ageYears?: string;
  currentLocation?: string;
  currentCustodian?: string;
  historicalSignificance: string;
  description: string;

  // Media & WebGL Specs
  references?: { title: string; url: string }[];
  images: { url: string; alt: string; caption?: string }[];
  model3D?: Model3DConfig;
  audioGuide?: {
    url: string;
    durationSeconds: number;
    narrator?: string;
  };

  // Cross-Referencing & Search
  relatedEntityIds?: string[];
  tags: string[];
}
B. Evolution Stage Configuration (src/types/evolution.ts)TypeScriptexport interface StageShaderParams {
  fogColor: string;
  fogNear: number;
  fogFar: number;
  ambientLightIntensity: number;
  directionalLightColor: string;
  directionalLightPosition: [number, number, number];
  particleDensity: number;
}

export interface EvolutionStageConfig {
  id: number; // 1 to 5
  slug: string;
  title: string;
  timeRangeLabel: string;
  myaRange: [number, number]; // [Start MYA, End MYA]
  cameraTargetPosition: [number, number, number];
  cameraLookAt: [number, number, number];
  environmentMap: string;
  lighting: StageShaderParams;
  models: {
    id: string;
    path: string;
    position: [number, number, number];
    scale: [number, number, number];
    rotation: [number, number, number];
  }[];
  narrationAudioPath?: string;
  ambientSoundscapePath?: string;
}
5. REPOSITORY DIRECTORY LAYOUTYou must structure the project strictly adhering to this Next.js App Router tree:Plaintextapp/
├── layout.tsx                    # Root Shell: Fonts, Metadata, Global Audio Controller
├── page.tsx                      # Hero Landing Page (Interactive WebGL Splash)
├── evolution/
│   └── page.tsx                  # Scroll-Driven Evolution Engine (Fullscreen WebGL Viewport)
├── museum/
│   ├── page.tsx                  # Dynamic Gallery: Dynamic Metadata Filters & Grid
│   └── [slug]/
│       └── page.tsx              # Universal 3D Entity Inspector (SSR Metadata + Interactive Canvas)
├── timeline/
│   └── page.tsx                  # Interactive 4.5 Billion Year Horizontal Timeline
├── search/
│   └── page.tsx                  # Global Multi-Facet Search Interface
└── api/
    └── entities/route.ts         # Fast Serverless JSON Endpoint for Search/Filter queries

src/
├── components/
│   ├── canvas/                   # R3F Canvas Nodes & WebGL Elements
│   │   ├── CanvasShell.tsx       # Global R3F Canvas Wrapper with Viewport Controls
│   │   ├── StageManager.tsx      # Handles Stage Switching, Lighting, and Particle Systems
│   │   ├── CameraRig.tsx         # GSAP/Frame-Delta Smooth Camera Interpolation
│   │   ├── ModelViewer.tsx       # Interactive Orbit-Controlled 3D Inspector
│   │   └── EnvironmentRigs.tsx   # Custom Shaders (Water caustics, Volumetric Fog, Stars)
│   ├── evolution/                # Stage-specific HUD overlays, stage progress bars
│   ├── museum/                   # Entity Cards, Filter Sidebars, Metadata Trays
│   ├── timeline/                 # Timeline Nodes, Axis Sliders, Year Tooltips
│   ├── ui/                       # Buttons, Modals, Audio Sliders (Radix + Tailwind)
│   └── audio/                    # Howler.js or Web Audio API Spatial Audio Managers
├── data/
│   ├── entities/                 # Static JSON datasets adhering to UniversalEntity
│   │   ├── fossils.json
│   │   ├── artifacts.json
│   │   ├── dinosaurs.json
│   │   └── civilizations.json
│   └── stages.ts                 # Stage configs (Stages 1 through 5)
├── hooks/
│   ├── useEvolutionScroll.ts     # Maps GSAP ScrollTrigger to Stage Manager values
│   ├── useEntitySearch.ts        # Dynamic Fuse.js/Metadata searching hook
│   └── useWebGLPerformance.ts    # FPS Monitor & Automatic Resolution / DPR Downscaler
├── stores/
│   ├── useEvolutionStore.ts      # Global stage, scroll position, camera state
│   ├── useMuseumStore.ts         # Active entity filters, selected tags, grid/list view
│   └── useAudioStore.ts          # Mute, ambient volume, narration audio playback context
├── lib/
│   ├── gltfLoader.ts             # Pre-configured GLTFLoader with Draco & KTX2 decoders
│   └── utils.ts                  # Tailwind merger, math tools, frame interpolators
└── types/
    ├── entity.ts                 # Universal Entity TypeScript interfaces
    └── evolution.ts              # Stage and WebGL state types
6. STATE MANAGEMENT SPECIFICATION (ZUSTAND)Implement state slices with clear boundaries. Example for useEvolutionStore.ts:TypeScriptimport { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface EvolutionState {
  currentStage: number; // 1 to 5
  scrollProgress: number; // 0.0 to 1.0 overall journey
  isTransitioning: boolean;
  targetCameraPosition: [number, number, number];
  targetLookAt: [number, number, number];
  
  // Actions
  setStage: (stage: number) => void;
  setScrollProgress: (progress: number) => void;
  setCameraTargets: (pos: [number, number, number], lookAt: [number, number, number]) => void;
  setIsTransitioning: (status: boolean) => void;
}

export const useEvolutionStore = create<EvolutionState>()(
  devtools((set) => ({
    currentStage: 1,
    scrollProgress: 0,
    isTransitioning: false,
    targetCameraPosition: [0, 2, 10],
    targetLookAt: [0, 0, 0],

    setStage: (stage) => set({ currentStage: stage }),
    setScrollProgress: (progress) => set({ scrollProgress: progress }),
    setCameraTargets: (pos, lookAt) => 
      set({ targetCameraPosition: pos, targetLookAt: lookAt }),
    setIsTransitioning: (status) => set({ isTransitioning: status }),
  }))
);
7. EXECUTION ROADMAP & STEP-BY-STEP OUTPUT INSTRUCTIONSAs the Lead Engineer, you must execute this project following this step-by-step phased structure:PHASE 1: Architecture, Types & Canvas Infrastructure (Immediate Task)Generate the core TypeScript interfaces (src/types/entity.ts and src/types/evolution.ts).Build the global Zustand stores (useEvolutionStore and useMuseumStore).Setup the Next.js CanvasShell.tsx component using @react-three/fiber with proper DPR limits ([1, 2]), PerformanceMonitor, and standard lighting fallbacks.Provide mock data files for at least 3 entities (e.g., T-Rex Skull, Rosetta Stone, Cyanobacteria Stromatolite) matching the UniversalEntity schema.PHASE 2: Evolution Engine & GSAP Camera RigBuild StageManager.tsx and CameraRig.tsx using standard frame-delta math (THREE.MathUtils.damp) or GSAP timeline scrubbing.Implement Stage 1 (Ancient Earth) and Stage 2 (Dinosaurs) scene nodes with background lighting and fog transitions.Add full scroll-driven progress handling using useEvolutionScroll.ts.PHASE 3: Virtual Museum & Dynamic FilteringImplement dynamic routing under app/museum/[slug]/page.tsx that reads entity metadata and renders a 3D orbit-control inspector (ModelViewer.tsx).Implement universal metadata filtering logic in app/museum/page.tsx (filtering by Era, Category, Material, and Civilization without hardcoded values).PHASE 4: Optimization & PolishIntegrate Draco / KTX2 texture decoding via @react-three/drei's useGLTF.setDecoderPath.Implement memory cleanup routines (geometry.dispose(), material.dispose()) on stage unmounts.Configure Next.js dynamic metadata generation (generateMetadata) for museum detail pages to optimize SEO.BEGIN PHASE 1 IMPLEMENTATION NOWRespond with:The full production code for src/types/entity.ts and src/types/evolution.ts.The complete code for src/stores/useEvolutionStore.ts.The R3F setup in src/components/canvas/CanvasShell.tsx including a responsive viewport wrapper and fallback loader.
---

### What to expect next:
When provided to an AI developer or engineering lead, this prompt forces immediate delivery of production-ready TypeScript definitions, state models, and R3F canvas components without any conversation fluff or unnecessary styling debates.
☆☆

---

## 👤 You

You said more detailed prompt please  ☆

---

## ✨ Gemini

Gemini said☆☆

---

## ✨ Gemini

Gemini said☆

---

## ✨ Gemini

Here is the Master Technical Architecture Directive (v3.0)—a fully detailed, zero-ambiguity system prompt engineered for AI code generation agents (or human engineering teams).This version expands beyond high-level architecture into exact Zustand slice contracts, Zod runtime validation schemas, WebGL memory management strategies, GSAP-to-R3F camera math, spatial Web Audio nodes, and custom shader uniform contracts.Markdown# MASTER TECHNICAL ARCHITECTURE DIRECTIVE & AI SYSTEM PROMPT (v3.0)

## 1. AI EXECUTION CONTRACT & PERSONA
You are acting as a **Principal WebGL Systems Architect & Lead Front-End Engineer**.
* **Target Stack:** Next.js 14+ (App Router), React 18+, TypeScript 5+ (Strict Mode), Three.js, `@react-three/fiber` (R3F), `@react-three/drei`, `@react-three/postprocessing`, Zustand, GSAP + ScrollTrigger, Framer Motion, Zod, and Tailwind CSS.
* **Code Quality Rules:**
  1. **Strict Type Safety:** Zero `any` or `unknown` casts without explicit Zod type guards.
  2. **WebGL GC & Memory Safety:** Every created Geometry, Material, Texture, and RenderTarget MUST have an explicit disposal path on component unmount (`dispose()`).
  3. **Performance Budget:** Target rock-solid 60 FPS on mid-tier mobile devices. Dynamic Pixel Ratio (DPR) capped at `[1, 2]`. Max draw calls per frame in continuous scene: `< 80`.
  4. **No Visual Code Overhead:** Do NOT write placeholder styling comments. Write complete, production-grade TypeScript code.

---

## 2. COMPLETE RUNTIME DATA CONTRACTS (ZOD SCHEMAS)

Create `src/types/schema.ts` using `zod` for strict runtime parsing of static JSON datasets:

```typescript
import { z } from 'zod';

export const BoundingBox3DSchema = z.object({
  center: z.tuple([z.number(), z.number(), z.number()]),
  size: z.tuple([z.number(), z.number(), z.number()]),
});

export const Model3DConfigSchema = z.object({
  glbPath: z.string(),
  dracoCompressed: z.boolean().default(true),
  ktx2Textures: z.boolean().default(true),
  initialScale: z.tuple([z.number(), z.number(), z.number()]).optional().default([1, 1, 1]),
  initialRotation: z.tuple([z.number(), z.number(), z.number()]).optional().default([0, 0, 0]),
  cameraOffset: z.tuple([z.number(), z.number(), z.number()]).optional().default([0, 0, 5]),
  boundingVolume: BoundingBox3DSchema.optional(),
  polygonCount: z.number().optional(),
});

export const EntityCategorySchema = z.enum([
  'fossil',
  'dinosaur',
  'artifact',
  'relic',
  'civilization',
  'species',
]);

export const UniversalEntitySchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1),
  name: z.string().min(1),
  category: EntityCategorySchema,
  subcategory: z.string().optional(),
  era: z.string(),
  timelinePositionMYA: z.number(), // Millions of years ago
  normalizedTimelineStep: z.number().min(0).max(1), // 0.0 (Earth Formation) to 1.0 (Modern Era)
  
  // Provenance & Historical Data
  civilization: z.string().optional(),
  species: z.string().optional(),
  creator: z.string().optional(),
  discoverer: z.string().optional(),
  discoveryDate: z.string().optional(),
  placeOfDiscovery: z.string().optional(),
  materials: z.array(z.string()).optional().default([]),
  dimensions: z.object({
    heightCM: z.number().optional(),
    widthCM: z.number().optional(),
    depthCM: z.number().optional(),
    weightKG: z.number().optional(),
  }).optional(),
  ageYears: z.string().optional(),
  currentLocation: z.string().optional(),
  currentCustodian: z.string().optional(),
  historicalSignificance: z.string(),
  description: z.string(),
  
  // Media & WebGL
  references: z.array(z.object({ title: z.string(), url: z.string().url() })).optional().default([]),
  images: z.array(z.object({ url: z.string(), alt: z.string(), caption: z.string().optional() })),
  model3D: Model3DConfigSchema.optional(),
  audioGuide: z.object({
    url: z.string(),
    durationSeconds: z.number(),
    narrator: z.string().optional(),
  }).optional(),
  
  // Search & Cross-Linking
  relatedEntityIds: z.array(z.string()).optional().default([]),
  tags: z.array(z.string()).default([]),
});

export type UniversalEntity = z.infer<typeof UniversalEntitySchema>;
export type EntityCategory = z.infer<typeof EntityCategorySchema>;
3. ZUSTAND GLOBAL STATE SPECIFICATIONImplement three isolated state slices to prevent unnecessary component re-renders:A. useEvolutionStore.ts (Scroll & Camera Orchestration)TypeScriptimport { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface CameraTarget {
  position: [number, number, number];
  lookAt: [number, number, number];
}

interface EvolutionState {
  currentStage: number; // 1 to 5
  scrollProgress: number; // 0.000 to 1.000 overall journey progress
  stageProgress: number; // 0.000 to 1.000 progress within current stage
  activeHotspotId: string | null;
  cameraTarget: CameraTarget;
  isScrubbing: boolean;
  
  // Actions
  setScrollProgress: (progress: number) => void;
  setStage: (stage: number) => void;
  setActiveHotspot: (id: string | null) => void;
  setCameraTarget: (target: CameraTarget) => void;
  setIsScrubbing: (isScrubbing: boolean) => void;
}

export const useEvolutionStore = create<EvolutionState>()(
  subscribeWithSelector((set) => ({
    currentStage: 1,
    scrollProgress: 0,
    stageProgress: 0,
    activeHotspotId: null,
    cameraTarget: { position: [0, 2, 10], lookAt: [0, 0, 0] },
    isScrubbing: false,

    setScrollProgress: (progress) => {
      const stage = Math.min(Math.floor(progress * 5) + 1, 5);
      const stageProgress = (progress * 5) % 1;
      set({ scrollProgress: progress, currentStage: stage, stageProgress });
    },
    setStage: (currentStage) => set({ currentStage }),
    setActiveHotspot: (activeHotspotId) => set({ activeHotspotId }),
    setCameraTarget: (cameraTarget) => set({ cameraTarget }),
    setIsScrubbing: (isScrubbing) => set({ isScrubbing }),
  }))
);
B. useMuseumStore.ts (Search & Metadata Query Engine)TypeScriptinterface MuseumFilterState {
  searchQuery: string;
  selectedCategories: EntityCategory[];
  selectedEras: string[];
  selectedCivilizations: string[];
  selectedMaterials: string[];
  sortBy: 'timelineAsc' | 'timelineDesc' | 'nameAsc';
  
  // Actions
  setSearchQuery: (q: string) => void;
  toggleCategory: (cat: EntityCategory) => void;
  toggleEra: (era: string) => void;
  resetFilters: () => void;
}
C. useAudioStore.ts (Spatial Soundscape & Narration Engine)TypeScriptinterface AudioState {
  isMuted: boolean;
  masterVolume: number; // 0.0 to 1.0
  ambientVolume: number;
  narrationVolume: number;
  currentTrack: string | null;
  isPlayingNarration: boolean;
  
  toggleMute: () => void;
  setMasterVolume: (vol: number) => void;
  playNarration: (url: string) => void;
  stopNarration: () => void;
}
4. MATHEMATICAL RIGS & WEBGL SHADER CONTRACTSA. Dynamic Smooth Camera Interpolation (CameraRig.tsx)In R3F, never snap camera coordinates. Use exponential decay frame-delta damping inside useFrame:TypeScriptimport { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useEvolutionStore } from '@/stores/useEvolutionStore';

const dummyPos = new THREE.Vector3();
const dummyLookAt = new THREE.Vector3();

export function CameraRig() {
  useFrame((state, delta) => {
    const { position, lookAt } = useEvolutionStore.getState().cameraTarget;
    
    // Smooth damp camera position
    dummyPos.set(...position);
    state.camera.position.damp3(dummyPos, 1.5, delta);
    
    // Smooth damp camera lookAt vector
    dummyLookAt.set(...lookAt);
    state.camera.lookAt(dummyLookAt);
  });

  return null;
}
B. Water Caustics / Primordial Atmosphere Shader Uniform ContractEvery custom shader in the Evolution Engine (Stage 1 to 5) must adhere to standard uniform conventions:OpenGL Shading Language// Uniforms passed from React frame loop
uniform float uTime;
uniform float uStageProgress; // Interpolation driver (0.0 to 1.0)
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform sampler2D uNoiseTexture;
varying vec2 vUv;
varying vec3 vNormal;
5. MEMORY MANAGEMENT & GARBAGE COLLECTION LAWSTo prevent browser crashes during prolonged 3D browsing sessions:Asset Disposal Hook: Implement a custom useUnmountCleanup hook that iterates through all mesh children in an R3F scene tree upon component unmounting:TypeScriptexport function disposeSceneGraph(object: THREE.Object3D) {
  object.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      mesh.geometry?.dispose();
      
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((mat) => mat.dispose());
      } else {
        mesh.material?.dispose();
      }
    }
  });
}
Texture Memory Capping: All textures supplied to KTX2Loader or useTexture must be downscaled to a max resolution of 2048x2048 for desktop and 1024x1024 for mobile.6. PROJECT DIRECTORY & MODULE MAPPlaintextapp/
├── layout.tsx                     # Root App Shell (Global Providers, Radix Toaster, Sound Engine)
├── page.tsx                       # Landing Page (Interactive Hero Engine)
├── evolution/
│   └── page.tsx                   # Continuous Scroll Viewport
├── museum/
│   ├── page.tsx                   # Filterable Entity Grid View
│   └── [slug]/
│       └── page.tsx               # Dedicated 3D Entity Inspector (SSR Dynamic Metadata)
├── timeline/
│   └── page.tsx                   # 2D/3D Hybrid Interactive Timeline Node
└── search/
    └── page.tsx                   # Instant Universal Search Index View

src/
├── components/
│   ├── canvas/                    # WebGL R3F Nodes
│   │   ├── CanvasShell.tsx        # Responsive R3F Canvas Container
│   │   ├── CameraRig.tsx          # GSAP/Frame-Delta Camera Driver
│   │   ├── StageManager.tsx       # Stage 1-5 Environmental Switcher
│   │   ├── ModelInspector.tsx     # OrbitControls-driven Isolated 3D Viewer
│   │   └── shaders/               # Custom Shader Materials (GLSL)
│   ├── evolution/                 # Scroll Overlays, Progress Bars, Hotspot HTML Markers
│   ├── museum/                    # Filter Sidebars, Entity Cards, Provenance Trays
│   ├── ui/                        # Radix UI + Tailwind Primitives
│   └── audio/                     # Spatial Audio Players & Sound Managers
├── data/                          # JSON files matching UniversalEntitySchema
├── hooks/                         # useEvolutionScroll, useEntitySearch, useWebGLPerformance
├── stores/                        # useEvolutionStore, useMuseumStore, useAudioStore
├── types/                         # schema.ts (Zod + TypeScript Interfaces)
└── lib/                           # GLTF loader instances, Draco setup, Math utility helpers
7. ACTIONABLE PHASE 1 DELIVERABLESPerform Phase 1 implementation immediately by generating the following complete, working code files:src/types/schema.ts — The full Zod schema and TypeScript exports.src/stores/useEvolutionStore.ts — The complete camera and scroll state slice.src/stores/useMuseumStore.ts — The filtering and search state slice.src/components/canvas/CanvasShell.tsx — The primary @react-three/fiber canvas shell configured with PerformanceMonitor, Suspense fallbacks, AdaptiveDpr, and responsive viewport management.src/data/entities.json — A mock dataset containing 3 realistic, fully populated objects (e.g., T-Rex Skull, Rosetta Stone, Cyanobacteria Stromatolite) adhering strictly to UniversalEntitySchema.Begin execution now with crisp, fully-typed code.
---

<FollowUp label="Ready to start writing Phase 1 code using this prompt?" query="Let's execute Phase 1: generate src/types/schema.ts, the Zustand stores, CanvasShell.tsx, and sample JSON data."/>
☆☆

---

## 👤 You

You said thats details in not inuf  ☆

---

## ✨ Gemini

Gemini said☆☆

---

## ✨ Gemini

Gemini said☆

---

## ✨ Gemini

Building an enterprise-grade 3D WebGL engine combined with a data-driven museum archive requires zero hand-waving. If we don't define the camera vector curves, WebGL memory cleanup loops, GLSL shader uniforms, and Zustand selector graphs right now, the project will quickly become unmaintainable as 3D assets accumulate.Below is the Complete Ultra-Detailed Production Blueprint (v4.0), including fully executable TypeScript code, GLSL shaders, state slices, and runtime validation logic.1. Complete System Architecture & Directory MapPlaintextapp/
├── layout.tsx                    # Shell: Web Audio context, Font loaders, Global Radix Provider
├── page.tsx                      # Hero Experience: Interactive WebGL Landing Splash
├── evolution/
│   └── page.tsx                  # Scroll-Driven Evolution Engine (Fullscreen WebGL Viewport)
├── museum/
│   ├── page.tsx                  # Universal Entity Archive (Multi-Facet Filter Grid)
│   └── [slug]/
│       └── page.tsx              # Dynamic 3D Entity Inspector (SSR Metadata + Orbit Canvas)
├── timeline/
│   └── page.tsx                  # Interactive 4.5B Year Timeline Navigator
└── api/
    └── entities/
        └── route.ts              # Edge Route: Filtered JSON/Metadata query endpoint

src/
├── components/
│   ├── canvas/                   # R3F WebGL Nodes
│   │   ├── CanvasShell.tsx       # Core Canvas with DPR Scaling & Performance Monitoring
│   │   ├── CameraRig.tsx         # Frame-delta Damped Camera Matrix Interpolator
│   │   ├── StageManager.tsx      # Stage Switcher, Environment, & Atmospheric Lighting
│   │   ├── ModelInspector.tsx     # Isolated OrbitControls 3D Model Inspector
│   │   └── shaders/
│   │       ├── WaterCausticsShader.ts   # Stage 1 Primordial Ocean GLSL Shader
│   │       └── VolumetricAtmosphere.ts  # Volumetric Fog & Particle Shaders
│   ├── evolution/                # HUD overlays, Scroll Progress, Hotspot Nodes
│   ├── museum/                   # Metadata Trays, Filter Sidebars, Provenance Cards
│   ├── ui/                       # Radix UI + Tailwind Base Primitives
│   └── audio/                    # Spatial Sound Engine (Web Audio API Nodes)
├── data/
│   └── entities.json             # Universal Entity Dataset (Zod-Validated)
├── hooks/
│   ├── useEvolutionScroll.ts     # GSAP ScrollTrigger to R3F Sync Hook
│   ├── useEntitySearch.ts        # Dynamic Fuse.js Search Engine Wrapper
│   └── useWebGLPerformance.ts    # Dynamic Resolution & Post-Processing Downscaler
├── stores/
│   ├── useEvolutionStore.ts      # Stage, Scroll, Camera Matrix & Hotspot State
│   ├── useMuseumStore.ts         # Multi-Facet Filter, Query & Sorting State
│   └── useAudioStore.ts          # Spatial Audio, Ambient Loops & Narration State
├── types/
│   └── schema.ts                 # Zod Runtime Schemas & TypeScript Types
└── lib/
    ├── gltfLoader.ts             # DRACO/KTX2 pre-configured GLTF Loader
    └── gc.ts                     # WebGL Garbage Collection & Asset Unloading Utility
2. Production Codebase (Phase 1 Code Stack)A. Runtime Schema & Types (src/types/schema.ts)TypeScriptimport { z } from 'zod';

export const BoundingBox3DSchema = z.object({
  center: z.tuple([z.number(), z.number(), z.number()]),
  size: z.tuple([z.number(), z.number(), z.number()]),
});

export const Model3DConfigSchema = z.object({
  glbPath: z.string().min(1),
  dracoCompressed: z.boolean().default(true),
  ktx2Textures: z.boolean().default(true),
  initialScale: z.tuple([z.number(), z.number(), z.number()]).default([1, 1, 1]),
  initialRotation: z.tuple([z.number(), z.number(), z.number()]).default([0, 0, 0]),
  cameraOffset: z.tuple([z.number(), z.number(), z.number()]).default([0, 0, 5]),
  boundingVolume: BoundingBox3DSchema.optional(),
  polygonCount: z.number().optional(),
});

export const EntityCategorySchema = z.enum([
  'fossil',
  'dinosaur',
  'artifact',
  'relic',
  'civilization',
  'species',
]);

export const UniversalEntitySchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1),
  name: z.string().min(1),
  category: EntityCategorySchema,
  subcategory: z.string().optional(),
  era: z.string(),
  timelinePositionMYA: z.number(), // Millions of Years Ago
  normalizedTimelineStep: z.number().min(0).max(1),

  // Provenance & Context
  civilization: z.string().optional(),
  species: z.string().optional(),
  creator: z.string().optional(),
  discoverer: z.string().optional(),
  discoveryDate: z.string().optional(),
  placeOfDiscovery: z.string().optional(),
  materials: z.array(z.string()).default([]),
  dimensions: z
    .object({
      heightCM: z.number().optional(),
      widthCM: z.number().optional(),
      depthCM: z.number().optional(),
      weightKG: z.number().optional(),
    })
    .optional(),
  ageYears: z.string().optional(),
  currentLocation: z.string().optional(),
  currentCustodian: z.string().optional(),
  historicalSignificance: z.string(),
  description: z.string(),

  // Media & 3D Assets
  references: z.array(z.object({ title: z.string(), url: z.string() })).default([]),
  images: z.array(z.object({ url: z.string(), alt: z.string(), caption: z.string().optional() })),
  model3D: Model3DConfigSchema.optional(),
  audioGuide: z
    .object({
      url: z.string(),
      durationSeconds: z.number(),
      narrator: z.string().optional(),
    })
    .optional(),

  // Search & Cross-Linking
  relatedEntityIds: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
});

export type UniversalEntity = z.infer<typeof UniversalEntitySchema>;
export type EntityCategory = z.infer<typeof EntityCategorySchema>;
export type Model3DConfig = z.infer<typeof Model3DConfigSchema>;
B. Evolution Engine Store (src/stores/useEvolutionStore.ts)TypeScriptimport { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export interface CameraTarget {
  position: [number, number, number];
  lookAt: [number, number, number];
}

interface EvolutionState {
  currentStage: number; // 1 to 5
  scrollProgress: number; // 0.000 to 1.000 overall journey
  stageProgress: number; // 0.000 to 1.000 within current stage
  activeHotspotId: string | null;
  cameraTarget: CameraTarget;
  isScrubbing: boolean;

  // Actions
  setScrollProgress: (progress: number) => void;
  setStage: (stage: number) => void;
  setActiveHotspot: (id: string | null) => void;
  setCameraTarget: (target: CameraTarget) => void;
  setIsScrubbing: (status: boolean) => void;
}

const STAGE_CAMERA_PRESETS: Record<number, CameraTarget> = {
  1: { position: [0, 2, 12], lookAt: [0, 0, 0] }, // Ancient Earth
  2: { position: [5, 8, 15], lookAt: [0, 2, 0] }, // Mesozoic Dinosaurs
  3: { position: [0, 15, 25], lookAt: [0, -5, 0] }, // Asteroid Impact
  4: { position: [-8, 4, 10], lookAt: [0, 0, 0] }, // Ice Age Mammals
  5: { position: [0, 0, 8], lookAt: [0, 0, 0] }, // Anthropocene Earth
};

export const useEvolutionStore = create<EvolutionState>()(
  subscribeWithSelector((set) => ({
    currentStage: 1,
    scrollProgress: 0,
    stageProgress: 0,
    activeHotspotId: null,
    cameraTarget: STAGE_CAMERA_PRESETS[1],
    isScrubbing: false,

    setScrollProgress: (progress) => {
      const clamped = Math.max(0, Math.min(1, progress));
      const stage = Math.min(Math.floor(clamped * 5) + 1, 5);
      const stageProgress = (clamped * 5) % 1;

      set({
        scrollProgress: clamped,
        currentStage: stage,
        stageProgress,
        cameraTarget: STAGE_CAMERA_PRESETS[stage] ?? STAGE_CAMERA_PRESETS[1],
      });
    },

    setStage: (currentStage) =>
      set({
        currentStage,
        cameraTarget: STAGE_CAMERA_PRESETS[currentStage] ?? STAGE_CAMERA_PRESETS[1],
      }),

    setActiveHotspot: (activeHotspotId) => set({ activeHotspotId }),
    setCameraTarget: (cameraTarget) => set({ cameraTarget }),
    setIsScrubbing: (isScrubbing) => set({ isScrubbing }),
  }))
);
C. WebGL Canvas Container (src/components/canvas/CanvasShell.tsx)TypeScript'use client';

import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor, AdaptiveDpr, AdaptiveEvents, Preload } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, DepthOfField } from '@react-three/postprocessing';
import { CameraRig } from './CameraRig';
import { StageManager } from './StageManager';

interface CanvasShellProps {
  children?: React.ReactNode;
}

function CanvasFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black text-white text-xs tracking-widest uppercase">
      <span>Initializing WebGL Pipeline...</span>
    </div>
  );
}

export function CanvasShell({ children }: CanvasShellProps) {
  const [dpr, setDpr] = useState(1.5);
  const [lowPerformance, setLowPerformance] = useState(false);

  return (
    <div className="relative w-full h-screen bg-neutral-950 overflow-hidden">
      <Suspense fallback={<CanvasFallback />}>
        <Canvas
          gl={{
            powerPreference: 'high-performance',
            antialias: false, // Turned off for post-processing efficiency
            alpha: false,
            stencil: false,
            depth: true,
          }}
          dpr={dpr}
          camera={{ position: [0, 2, 12], fov: 45, near: 0.1, far: 1000 }}
          eventSource={typeof window !== 'undefined' ? document.getElementById('root') ?? undefined : undefined}
          eventPrefix="client"
        >
          <PerformanceMonitor
            onDecline={() => {
              setDpr(1.0);
              setLowPerformance(true);
            }}
            onIncline={() => {
              setDpr(1.5);
              setLowPerformance(false);
            }}
          >
            <AdaptiveDpr pixelated />
            <AdaptiveEvents />
            <CameraRig />
            
            <StageManager />
            {children}

            {!lowPerformance && (
              <EffectComposer disableNormalPass>
                <Bloom intensity={0.4} luminanceThreshold={0.8} luminanceSmoothing={0.2} />
                <Vignette eskil={false} offset={0.1} darkness={1.1} />
                <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} />
              </EffectComposer>
            )}

            <Preload all />
          </PerformanceMonitor>
        </Canvas>
      </Suspense>
    </div>
  );
}
D. Frame-Delta Damped Camera Controller (src/components/canvas/CameraRig.tsx)TypeScript'use client';

import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useEvolutionStore } from '@/stores/useEvolutionStore';

const targetPos = new THREE.Vector3();
const targetLookAt = new THREE.Vector3();
const currentLookAt = new THREE.Vector3(0, 0, 0);

export function CameraRig() {
  useFrame((state, delta) => {
    const { position, lookAt } = useEvolutionStore.getState().cameraTarget;

    targetPos.set(...position);
    targetLookAt.set(...lookAt);

    // Frame-rate independent exponential damping for position
    state.camera.position.lerp(targetPos, 1 - Math.exp(-4 * delta));

    // Damped camera focus (lookAt target interpolation)
    currentLookAt.lerp(targetLookAt, 1 - Math.exp(-4 * delta));
    state.camera.lookAt(currentLookAt);
  });

  return null;
}
E. Custom Stage 1 GLSL Shader (src/components/canvas/shaders/WaterCausticsShader.ts)TypeScriptimport * as THREE from 'three';

export const WaterCausticsShaderMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uColorA: { value: new THREE.Color('#001021') },
    uColorB: { value: new THREE.Color('#007791') },
    uCausticIntensity: { value: 1.5 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `,
  fragmentShader: /* glsl */ `
    uniform float uTime;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform float uCausticIntensity;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    // Simplex Noise Generator
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                         -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m;
      m = m*m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      vec2 p = vUv * 8.0;
      float n1 = snoise(p + vec2(uTime * 0.2, uTime * 0.15));
      float n2 = snoise(p * 1.5 - vec2(uTime * 0.1, uTime * 0.25));
      
      float caustics = pow(abs(n1 + n2), 2.5) * uCausticIntensity;
      vec3 baseColor = mix(uColorA, uColorB, vUv.y + (n1 * 0.2));
      vec3 finalColor = baseColor + vec3(caustics);

      gl_FragColor = vec4(finalColor, 0.85);
    }
  `,
};
F. Validated Sample Dataset (src/data/entities.json)JSON[
  {
    "id": "e7b8a1c0-3f4d-4221-a021-0812921a2201",
    "slug": "cyanobacteria-stromatolite",
    "name": "Cyanobacteria Stromatolite",
    "category": "fossil",
    "subcategory": "Microbial Reef",
    "era": "Archean",
    "timelinePositionMYA": 3500,
    "normalizedTimelineStep": 0.12,
    "placeOfDiscovery": "Pilbara, Western Australia",
    "materials": ["Calcium Carbonate", "Sediment"],
    "historicalSignificance": "Produced the first atmospheric oxygen on Earth via photosynthesis, enabling modern complex life.",
    "description": "Layered sedimentary formations created by photosynthetic cyanobacteria. These structures transformed Earth's atmosphere during the Great Oxidation Event.",
    "references": [
      { "title": "NASA Astrobiology - Stromatolites", "url": "https://astrobiology.nasa.gov" }
    ],
    "images": [
      {
        "url": "/images/stromatolite.jpg",
        "alt": "Cross section of fossilized stromatolite showing distinct growth bands",
        "caption": "Fossilized Stromatolite Cross-Section"
      }
    ],
    "model3D": {
      "glbPath": "/models/stromatolite.glb",
      "dracoCompressed": true,
      "ktx2Textures": true,
      "initialScale": [1.5, 1.5, 1.5],
      "initialRotation": [0, 0.78, 0],
      "cameraOffset": [0, 1, 4]
    },
    "tags": ["Precambrian", "Oxygenation", "Photosynthesis", "Australia"]
  },
  {
    "id": "f2c9e2b1-5d8a-4112-b132-1923831b3302",
    "slug": "tyrannosaurus-rex-skull",
    "name": "Tyrannosaurus Rex Skull",
    "category": "dinosaur",
    "subcategory": "Theropod",
    "era": "Cretaceous",
    "timelinePositionMYA": 66,
    "normalizedTimelineStep": 0.48,
    "placeOfDiscovery": "Hell Creek Formation, Montana, USA",
    "materials": ["Fossilized Bone", "Apatite"],
    "dimensions": { "heightCM": 150, "widthCM": 120, "depthCM": 180, "weightKG": 270 },
    "historicalSignificance": "One of the largest terrestrial carnivores in Earth history, possessing a bite force of over 12,000 lbs.",
    "description": "Exquisitely preserved cranium displaying serrated teeth up to 12 inches long and binocular stereoscopic vision cavities.",
    "images": [
      {
        "url": "/images/trex-skull.jpg",
        "alt": "Tyrannosaurus Rex skull cast showing massive jaw line",
        "caption": "Complete T-Rex Skull Assembly"
      }
    ],
    "model3D": {
      "glbPath": "/models/trex_skull.glb",
      "dracoCompressed": true,
      "ktx2Textures": true,
      "initialScale": [1, 1, 1],
      "initialRotation": [0, -1.57, 0],
      "cameraOffset": [0, 0, 3]
    },
    "tags": ["Cretaceous", "Apex Predator", "Montana", "Mesozoic"]
  },
  {
    "id": "a1d3f4c2-6e9b-4332-c243-2034942c4403",
    "slug": "rosetta-stone",
    "name": "The Rosetta Stone",
    "category": "artifact",
    "subcategory": "Stele",
    "era": "Ptolemaic Period",
    "timelinePositionMYA": 0.0022,
    "normalizedTimelineStep": 0.99,
    "civilization": "Ancient Egypt",
    "discoverer": "French soldiers under Pierre-François Bouchard",
    "discoveryDate": "1799",
    "placeOfDiscovery": "Rashid (Rosetta), Egypt",
    "materials": ["Granodiorite"],
    "dimensions": { "heightCM": 112, "widthCM": 75, "depthCM": 28, "weightKG": 760 },
    "currentLocation": "British Museum, London",
    "historicalSignificance": "Provided the key to deciphering Ancient Egyptian hieroglyphs by featuring the same text in three scripts.",
    "description": "Granodiorite stele inscribed with a decree issued at Memphis in 196 BC in Ancient Egyptian (Hieroglyphic and Demotic) and Ancient Greek.",
    "images": [
      {
        "url": "/images/rosetta-stone.jpg",
        "alt": "Black granodiorite slab with dense carved inscriptions",
        "caption": "The Rosetta Stone Front Face"
      }
    ],
    "model3D": {
      "glbPath": "/models/rosetta_stone.glb",
      "dracoCompressed": true,
      "ktx2Textures": true,
      "initialScale": [0.8, 0.8, 0.8],
      "initialRotation": [0, 0, 0],
      "cameraOffset": [0, 0, 2.5]
    },
    "tags": ["Hieroglyphs", "Egypt", "Ptolemaic", "Decipherment"]
  }
]
3. WebGL Garbage Collection Lifecycle Protocol (src/lib/gc.ts)Memory leaks inside Three.js cause tab crashes within minutes during long model-inspection sessions. Call this utility when unmounting any 3D node:TypeScriptimport * as THREE from 'three';

export function purgeWebGLSceneGraph(target: THREE.Object3D) {
  target.traverse((node) => {
    if ((node as THREE.Mesh).isMesh) {
      const mesh = node as THREE.Mesh;

      // Dispose Geometry
      if (mesh.geometry) {
        mesh.geometry.dispose();
      }

      // Dispose Material(s) and associated Textures
      if (mesh.material) {
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

        materials.forEach((mat) => {
          Object.keys(mat).forEach((prop) => {
            const value = (mat as unknown as Record<string, unknown>)[prop];
            if (value && typeof value === 'object' && 'isTexture' in value) {
              (value as THREE.Texture).dispose();
            }
          });
          mat.dispose();
        });
      }
    }
  });
}
4. Phase 1-to-4 Implementation ChecklistPhaseMilestonePriority DeliverableStatusPhase 1FoundationNext.js App Router, Zod schema validation, CanvasShell container, Zustand storesReady to RunPhase 2Evolution EngineGSAP ScrollTrigger sync, 5-stage camera keyframing curves, GLSL caustics & fog shadersPending Phase 1Phase 3Virtual MuseumDynamic SSR routes (/museum/[slug]), dynamic metadata filtering grid, Orbit 3D inspectorPending Phase 2Phase 4OptimizationDraco/KTX2 texture decoding pipelines, dynamic WebGL resolution downscaling, spatial audio graphPending Phase 3Where would you like to focus next?Build Phase 2: GSAP ScrollTrigger to R3F Camera SyncBuild Phase 3: Dynamic Museum Filter Engine & PageSetup Spatial Audio Engine☆☆

---

## 👤 You

You said Show me the full implementation of useEvolutionScroll.ts and StageManager.tsx to link scroll progress with R3F camera moves. ☆

---

## ✨ Gemini

Gemini said☆☆

---

## ✨ Gemini

Gemini said☆

---

## ✨ Gemini

Here is the full implementation of useEvolutionScroll.ts and StageManager.tsx, along with a quick integration example in app/evolution/page.tsx to tie the DOM scroll track directly to your WebGL viewport.1. GSAP Scroll Bridge (src/hooks/useEvolutionScroll.ts)This hook pins a long DOM scroll container and calculates smooth 0.0–1.0 progress. Using scrub: 0.5 ensures that fast wheel flicks don't cause sudden camera jumps in Three.js.TypeScript'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEvolutionStore } from '@/stores/useEvolutionStore';

gsap.registerPlugin(ScrollTrigger);

interface UseEvolutionScrollOptions {
  /**
   * Total height multiplier for the scroll track (e.g. 5 = 500vh for 5 stages)
   */
  scrollMultiplier?: number;
}

export function useEvolutionScroll(options: UseEvolutionScrollOptions = {}) {
  const { scrollMultiplier = 5 } = options;
  const containerRef = useRef<HTMLDivElement | null>(null);

  const setScrollProgress = useEvolutionStore((state) => state.setScrollProgress);
  const setIsScrubbing = useEvolutionStore((state) => state.setIsScrubbing);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Use gsap.context for clean lifecycle management & React Strict Mode safety
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: `+=${scrollMultiplier * 100}%`,
        pin: true,
        scrub: 0.5, // 0.5s smooth catching-up window for high-refresh WebGL
        onUpdate: (self) => {
          setScrollProgress(self.progress);
        },
        onToggle: (self) => {
          setIsScrubbing(self.isActive);
        },
      });
    }, container);

    return () => {
      ctx.revert(); // Automatically kills all ScrollTriggers created in context
    };
  }, [scrollMultiplier, setScrollProgress, setIsScrubbing]);

  return { containerRef };
}
2. Stage Manager (src/components/canvas/StageManager.tsx)This component sits inside your <CanvasShell> and manages background fog, ambient/directional lighting, particle effects, and 3D focal nodes. Colors and light positions lerp frame-by-frame inside useFrame so transitions feel continuous rather than stepped.TypeScript'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useEvolutionStore } from '@/stores/useEvolutionStore';

// Environmental presets for each of the 5 evolutionary eras
const STAGE_ENVIRONMENTS = {
  1: {
    fogColor: '#011627',
    fogNear: 2,
    fogFar: 25,
    ambientColor: '#007791',
    ambientIntensity: 1.2,
    directionalColor: '#2EC4B6',
    directionalPos: [5, 10, 5] as [number, number, number],
    particleColor: '#2EC4B6',
    particleCount: 150,
  },
  2: {
    fogColor: '#2b1e17',
    fogNear: 5,
    fogFar: 35,
    ambientColor: '#ff9f1c',
    ambientIntensity: 0.8,
    directionalColor: '#ffe6a7',
    directionalPos: [10, 15, 10] as [number, number, number],
    particleColor: '#ffbf69',
    particleCount: 100,
  },
  3: {
    fogColor: '#3a0808',
    fogNear: 1,
    fogFar: 20,
    ambientColor: '#e71d36',
    ambientIntensity: 2.0,
    directionalColor: '#ff5400',
    directionalPos: [0, 20, -5] as [number, number, number],
    particleColor: '#ff0000',
    particleCount: 300,
  },
  4: {
    fogColor: '#0b1d3a',
    fogNear: 4,
    fogFar: 30,
    ambientColor: '#a8dede',
    ambientIntensity: 0.9,
    directionalColor: '#ffffff',
    directionalPos: [-10, 10, 10] as [number, number, number],
    particleColor: '#e0fbfc',
    particleCount: 200,
  },
  5: {
    fogColor: '#050814',
    fogNear: 5,
    fogFar: 40,
    ambientColor: '#118ab2',
    ambientIntensity: 0.6,
    directionalColor: '#06d6a0',
    directionalPos: [0, 10, 10] as [number, number, number],
    particleColor: '#ffd166',
    particleCount: 120,
  },
};

export function StageManager() {
  const ambientRef = useRef<THREE.AmbientLight>(null!);
  const directionalRef = useRef<THREE.DirectionalLight>(null!);
  const fogRef = useRef<THREE.Fog>(null!);

  // Pre-allocated THREE.Color instances to prevent garbage collection spikes in render loop
  const currentFogColor = useRef(new THREE.Color('#011627'));
  const currentAmbientColor = useRef(new THREE.Color('#007791'));
  const currentDirectionalColor = useRef(new THREE.Color('#2EC4B6'));

  useFrame((state, delta) => {
    const currentStage = useEvolutionStore.getState().currentStage;
    const targetEnv =
      STAGE_ENVIRONMENTS[currentStage as keyof typeof STAGE_ENVIRONMENTS] ||
      STAGE_ENVIRONMENTS[1];

    // Frame-rate independent exponential interpolation factor
    const lerpFactor = 1 - Math.exp(-3 * delta);

    // 1. Smooth Fog Transitions
    if (fogRef.current) {
      currentFogColor.current.lerp(new THREE.Color(targetEnv.fogColor), lerpFactor);
      fogRef.current.color = currentFogColor.current;
      fogRef.current.near = THREE.MathUtils.lerp(fogRef.current.near, targetEnv.fogNear, lerpFactor);
      fogRef.current.far = THREE.MathUtils.lerp(fogRef.current.far, targetEnv.fogFar, lerpFactor);
      state.scene.background = currentFogColor.current;
    }

    // 2. Smooth Ambient Light Transitions
    if (ambientRef.current) {
      currentAmbientColor.current.lerp(new THREE.Color(targetEnv.ambientColor), lerpFactor);
      ambientRef.current.color = currentAmbientColor.current;
      ambientRef.current.intensity = THREE.MathUtils.lerp(
        ambientRef.current.intensity,
        targetEnv.ambientIntensity,
        lerpFactor
      );
    }

    // 3. Smooth Directional Light Transitions
    if (directionalRef.current) {
      currentDirectionalColor.current.lerp(new THREE.Color(targetEnv.directionalColor), lerpFactor);
      directionalRef.current.color = currentDirectionalColor.current;
      directionalRef.current.position.lerp(
        new THREE.Vector3(...targetEnv.directionalPos),
        lerpFactor
      );
    }
  });

  const currentStage = useEvolutionStore((state) => state.currentStage);
  const activeEnv =
    STAGE_ENVIRONMENTS[currentStage as keyof typeof STAGE_ENVIRONMENTS] ||
    STAGE_ENVIRONMENTS[1];

  return (
    <>
      {/* Dynamic Background Fog */}
      <fog attach="fog" ref={fogRef} args={['#011627', 2, 25]} />

      {/* Dynamic Environmental Lights */}
      <ambientLight ref={ambientRef} intensity={1.2} />
      <directionalLight
        ref={directionalRef}
        position={[5, 10, 5]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Stage Particle Atmosphere */}
      <Sparkles
        key={currentStage} // Remounts sparkle count & palette per stage
        count={activeEnv.particleCount}
        scale={[25, 25, 25]}
        size={3}
        speed={0.4}
        color={activeEnv.particleColor}
      />

      {/* Stage-Specific Mesh Content */}
      <StageContent stage={currentStage} />
    </>
  );
}

/**
 * Isolated mesh switcher for each era
 */
function StageContent({ stage }: { stage: number }) {
  return (
    <group>
      {stage === 1 && (
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[1.8, 64, 64]} />
            <meshStandardMaterial color="#007791" roughness={0.3} metalness={0.1} wireframe />
          </mesh>
        </Float>
      )}

      {stage === 2 && (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
          <mesh position={[0, 1, 0]}>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color="#ff9f1c" roughness={0.6} />
          </mesh>
        </Float>
      )}

      {stage === 3 && (
        <group position={[0, -2, 0]}>
          <mesh>
            <icosahedronGeometry args={[2.5, 2]} />
            <meshStandardMaterial color="#e71d36" roughness={0.2} emissive="#3a0808" />
          </mesh>
        </group>
      )}

      {stage === 4 && (
        <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
          <mesh position={[0, 0, 0]}>
            <octahedronGeometry args={[2, 0]} />
            <meshStandardMaterial color="#a8dede" roughness={0.1} metalness={0.8} />
          </mesh>
        </Float>
      )}

      {stage === 5 && (
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[2, 32, 32]} />
          <meshStandardMaterial color="#118ab2" roughness={0.5} wireframe />
        </mesh>
      )}
    </group>
  );
}
3. Page Assembly (app/evolution/page.tsx)This component puts everything together: a fixed, fullscreen WebGL canvas sits behind a pinned DOM track with floating HUD overlays that update based on the current stage.TypeScript'use client';

import React from 'react';
import { CanvasShell } from '@/components/canvas/CanvasShell';
import { useEvolutionScroll } from '@/hooks/useEvolutionScroll';
import { useEvolutionStore } from '@/stores/useEvolutionStore';

const STAGE_TITLES = [
  'Stage 1: Ancient Earth & Primordial Oceans',
  'Stage 2: Rise of the Mesozoic Dinosaurs',
  'Stage 3: The Great Extinction Asteroid',
  'Stage 4: Ice Age & Mammalian Dominance',
  'Stage 5: The Anthropocene & Human Civilization',
];

export default function EvolutionPage() {
  const { containerRef } = useEvolutionScroll({ scrollMultiplier: 5 });
  const currentStage = useEvolutionStore((state) => state.currentStage);
  const scrollProgress = useEvolutionStore((state) => state.scrollProgress);

  return (
    <div ref={containerRef} className="relative w-full bg-neutral-950 text-white">
      {/* Sticky WebGL Canvas Layer */}
      <div className="sticky top-0 left-0 w-full h-screen z-0">
        <CanvasShell />
      </div>

      {/* DOM Overlay HUD */}
      <div className="pointer-events-none fixed inset-0 z-10 flex flex-col justify-between p-8">
        <header className="flex justify-between items-center">
          <span className="text-xs uppercase tracking-widest text-neutral-400">
            Earth Evolution Engine
          </span>
          <span className="text-xs font-mono text-cyan-400">
            {(scrollProgress * 100).toFixed(1)}%
          </span>
        </header>

        <main className="max-w-xl">
          <h1 className="text-3xl font-bold tracking-tight mb-2 transition-all duration-500">
            {STAGE_TITLES[currentStage - 1]}
          </h1>
          <p className="text-sm text-neutral-300">
            Scroll to navigate through 4.5 billion years of planetary development.
          </p>
        </main>

        <footer className="w-full bg-neutral-900/50 h-1 rounded-full overflow-hidden">
          <div
            className="bg-cyan-400 h-full transition-all duration-150"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </footer>
      </div>
    </div>
  );
}
☆☆

---

## 👤 You

You said Show me the complete implementation of the Virtual Museum search page (app/museum/page.tsx) with dynamic metadata filters. ☆

---

## ✨ Gemini

Gemini said☆☆

---

## ✨ Gemini

Gemini said☆

---

## ✨ Gemini

Here is the complete implementation of the Virtual Museum Search Page (app/museum/page.tsx) along with its dedicated Zustand store (src/stores/useMuseumStore.ts).This page automatically extracts all filter categories, eras, civilizations, and materials directly from the UniversalEntity dataset at runtime—ensuring zero hardcoding as new items are added to the database.1. Museum Filter State Store (src/stores/useMuseumStore.ts)TypeScriptimport { create } from 'zustand';
import { EntityCategory } from '@/types/schema';

export type SortOption = 'timelineDesc' | 'timelineAsc' | 'nameAsc';

interface MuseumStoreState {
  searchQuery: string;
  selectedCategories: EntityCategory[];
  selectedEras: string[];
  selectedCivilizations: string[];
  selectedMaterials: string[];
  sortBy: SortOption;
  isMobileFiltersOpen: boolean;

  setSearchQuery: (query: string) => void;
  toggleCategory: (category: EntityCategory) => void;
  toggleEra: (era: string) => void;
  toggleCivilization: (civilization: string) => void;
  toggleMaterial: (material: string) => void;
  setSortBy: (sortBy: SortOption) => void;
  setIsMobileFiltersOpen: (isOpen: boolean) => void;
  resetFilters: () => void;
}

export const useMuseumStore = create<MuseumStoreState>((set) => ({
  searchQuery: '',
  selectedCategories: [],
  selectedEras: [],
  selectedCivilizations: [],
  selectedMaterials: [],
  sortBy: 'timelineDesc',
  isMobileFiltersOpen: false,

  setSearchQuery: (searchQuery) => set({ searchQuery }),

  toggleCategory: (category) =>
    set((state) => ({
      selectedCategories: state.selectedCategories.includes(category)
        ? state.selectedCategories.filter((c) => c !== category)
        : [...state.selectedCategories, category],
    })),

  toggleEra: (era) =>
    set((state) => ({
      selectedEras: state.selectedEras.includes(era)
        ? state.selectedEras.filter((e) => e !== era)
        : [...state.selectedEras, era],
    })),

  toggleCivilization: (civilization) =>
    set((state) => ({
      selectedCivilizations: state.selectedCivilizations.includes(civilization)
        ? state.selectedCivilizations.filter((c) => c !== civilization)
        : [...state.selectedCivilizations, civilization],
    })),

  toggleMaterial: (material) =>
    set((state) => ({
      selectedMaterials: state.selectedMaterials.includes(material)
        ? state.selectedMaterials.filter((m) => m !== material)
        : [...state.selectedMaterials, material],
    })),

  setSortBy: (sortBy) => set({ sortBy }),

  setIsMobileFiltersOpen: (isMobileFiltersOpen) => set({ isMobileFiltersOpen }),

  resetFilters: () =>
    set({
      searchQuery: '',
      selectedCategories: [],
      selectedEras: [],
      selectedCivilizations: [],
      selectedMaterials: [],
      sortBy: 'timelineDesc',
    }),
}));
2. Dynamic Museum Search Page (app/museum/page.tsx)TypeScript'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import entitiesData from '@/data/entities.json';
import { UniversalEntity, EntityCategory } from '@/types/schema';
import { useMuseumStore, SortOption } from '@/stores/useMuseumStore';

export default function MuseumPage() {
  const entities = entitiesData as UniversalEntity[];

  const {
    searchQuery,
    selectedCategories,
    selectedEras,
    selectedCivilizations,
    selectedMaterials,
    sortBy,
    isMobileFiltersOpen,
    setSearchQuery,
    toggleCategory,
    toggleEra,
    toggleCivilization,
    toggleMaterial,
    setSortBy,
    setIsMobileFiltersOpen,
    resetFilters,
  } = useMuseumStore();

  // 1. DYNAMIC FACET DERIVATION (Computed directly from dataset metadata)
  const availableFacets = useMemo(() => {
    const categories = new Set<EntityCategory>();
    const eras = new Set<string>();
    const civilizations = new Set<string>();
    const materials = new Set<string>();

    entities.forEach((entity) => {
      if (entity.category) categories.add(entity.category);
      if (entity.era) eras.add(entity.era);
      if (entity.civilization) civilizations.add(entity.civilization);
      entity.materials?.forEach((mat) => materials.add(mat));
    });

    return {
      categories: Array.from(categories).sort(),
      eras: Array.from(eras).sort(),
      civilizations: Array.from(civilizations).sort(),
      materials: Array.from(materials).sort(),
    };
  }, [entities]);

  // 2. DYNAMIC FILTER & SEARCH ENGINE LOGIC
  const filteredEntities = useMemo(() => {
    return entities
      .filter((entity) => {
        // Text Search
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const matchName = entity.name.toLowerCase().includes(q);
          const matchDesc = entity.description.toLowerCase().includes(q);
          const matchSignificance = entity.historicalSignificance.toLowerCase().includes(q);
          const matchTags = entity.tags.some((t) => t.toLowerCase().includes(q));
          const matchCiv = entity.civilization?.toLowerCase().includes(q) ?? false;
          const matchEra = entity.era.toLowerCase().includes(q);

          if (!matchName && !matchDesc && !matchSignificance && !matchTags && !matchCiv && !matchEra) {
            return false;
          }
        }

        // Category Filter
        if (selectedCategories.length > 0 && !selectedCategories.includes(entity.category)) {
          return false;
        }

        // Era Filter
        if (selectedEras.length > 0 && !selectedEras.includes(entity.era)) {
          return false;
        }

        // Civilization Filter
        if (
          selectedCivilizations.length > 0 &&
          (!entity.civilization || !selectedCivilizations.includes(entity.civilization))
        ) {
          return false;
        }

        // Material Filter
        if (
          selectedMaterials.length > 0 &&
          !entity.materials?.some((mat) => selectedMaterials.includes(mat))
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'timelineDesc') {
          return b.timelinePositionMYA - a.timelinePositionMYA;
        }
        if (sortBy === 'timelineAsc') {
          return a.timelinePositionMYA - b.timelinePositionMYA;
        }
        if (sortBy === 'nameAsc') {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
  }, [
    entities,
    searchQuery,
    selectedCategories,
    selectedEras,
    selectedCivilizations,
    selectedMaterials,
    sortBy,
  ]);

  const activeFilterCount =
    selectedCategories.length +
    selectedEras.length +
    selectedCivilizations.length +
    selectedMaterials.length;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      {/* HEADER BAR */}
      <header className="sticky top-0 z-30 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xl font-bold tracking-tight text-white hover:text-cyan-400 transition">
              ARCHIVE
            </Link>
            <span className="text-xs px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700">
              {filteredEntities.length} Entities
            </span>
          </div>

          {/* SEARCH INPUT */}
          <div className="relative w-full md:w-96">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search artifacts, species, eras, tags..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 transition"
            />
            <SearchIcon className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-neutral-500 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* SORT & MOBILE CONTROLS */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="timelineDesc">Oldest First (MYA)</option>
              <option value="timelineAsc">Newest First (MYA)</option>
              <option value="nameAsc">Alphabetical (A-Z)</option>
            </select>

            <button
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
              className="md:hidden flex items-center gap-2 px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-neutral-300"
            >
              <FilterIcon className="w-4 h-4" />
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto w-full flex-1 px-6 py-8 flex gap-8">
        {/* DESKTOP SIDEBAR FILTERS */}
        <aside className="hidden md:block w-64 shrink-0 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Metadata Facets</h2>
            {activeFilterCount > 0 && (
              <button onClick={resetFilters} className="text-xs text-cyan-400 hover:underline">
                Reset All
              </button>
            )}
          </div>

          {/* CATEGORIES */}
          <FilterSection title="Categories">
            {availableFacets.categories.map((cat) => (
              <CheckboxItem
                key={cat}
                label={cat.toUpperCase()}
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
              />
            ))}
          </FilterSection>

          {/* ERAS */}
          <FilterSection title="Geological Eras">
            {availableFacets.eras.map((era) => (
              <CheckboxItem
                key={era}
                label={era}
                checked={selectedEras.includes(era)}
                onChange={() => toggleEra(era)}
              />
            ))}
          </FilterSection>

          {/* CIVILIZATIONS */}
          {availableFacets.civilizations.length > 0 && (
            <FilterSection title="Civilizations">
              {availableFacets.civilizations.map((civ) => (
                <CheckboxItem
                  key={civ}
                  label={civ}
                  checked={selectedCivilizations.includes(civ)}
                  onChange={() => toggleCivilization(civ)}
                />
              ))}
            </FilterSection>
          )}

          {/* MATERIALS */}
          {availableFacets.materials.length > 0 && (
            <FilterSection title="Materials">
              {availableFacets.materials.map((mat) => (
                <CheckboxItem
                  key={mat}
                  label={mat}
                  checked={selectedMaterials.includes(mat)}
                  onChange={() => toggleMaterial(mat)}
                />
              ))}
            </FilterSection>
          )}
        </aside>

        {/* ENTITY CARD GRID */}
        <main className="flex-1">
          {filteredEntities.length === 0 ? (
            <div className="h-96 flex flex-col items-center justify-center border border-dashed border-neutral-800 rounded-xl p-8 text-center">
              <p className="text-neutral-400 mb-4 text-sm">No artifacts or entities match your active filters.</p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-neutral-900 border border-neutral-700 text-xs font-semibold rounded-lg text-white hover:bg-neutral-800 transition"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEntities.map((entity) => (
                <EntityCard key={entity.id} entity={entity} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/* HELPER COMPONENTS */

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-mono text-neutral-500 uppercase tracking-widest">{title}</h3>
      <div className="space-y-1 max-h-48 overflow-y-auto pr-2 custom-scrollbar">{children}</div>
    </div>
  );
}

function CheckboxItem({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2 text-xs text-neutral-300 hover:text-white cursor-pointer select-none py-1">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="rounded border-neutral-800 bg-neutral-900 text-cyan-500 focus:ring-0 focus:ring-offset-0"
      />
      <span className="truncate">{label}</span>
    </label>
  );
}

function EntityCard({ entity }: { entity: UniversalEntity }) {
  return (
    <Link
      href={`/museum/${entity.slug}`}
      className="group relative flex flex-col bg-neutral-900/50 border border-neutral-800/80 hover:border-neutral-700 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
    >
      {/* THUMBNAIL CONTAINER */}
      <div className="relative aspect-square w-full bg-neutral-950 overflow-hidden">
        {entity.images[0] ? (
          <Image
            src={entity.images[0].url}
            alt={entity.images[0].alt}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-neutral-600">No Preview</div>
        )}
        <div className="absolute top-3 left-3 bg-neutral-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-cyan-400 border border-neutral-800">
          {entity.era}
        </div>
        {entity.model3D && (
          <div className="absolute top-3 right-3 bg-neutral-950/80 backdrop-blur-md p-1 rounded-full text-neutral-400 border border-neutral-800">
            <Box3DIcon className="w-3.5 h-3.5 text-cyan-400" />
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-500">{entity.category}</span>
          <h3 className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
            {entity.name}
          </h3>
          <p className="text-xs text-neutral-400 line-clamp-2 mt-1">{entity.description}</p>
        </div>

        {/* METADATA FOOTER */}
        <div className="pt-2 border-t border-neutral-800/50 flex items-center justify-between text-[10px] text-neutral-500 font-mono">
          <span>{entity.timelinePositionMYA > 1 ? `${entity.timelinePositionMYA} MYA` : 'Modern Era'}</span>
          <span>{entity.civilization || entity.placeOfDiscovery || 'Global'}</span>
        </div>
      </div>
    </Link>
  );
}

/* SVG ICONS */
function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  );
}

function FilterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
    </svg>
  );
}

function Box3DIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
    </svg>
  );
}
Where would you like to go next?Build app/museum/[slug]/page.tsx (3D Inspector Page)Build app/timeline/page.tsx (Horizontal Timeline)☆☆

---

## 👤 You

You said see  ☆

---

## ✨ Gemini

Gemini said☆☆

---

## ✨ Gemini

Gemini said☆

---

## ✨ Gemini

That is a crucial architectural nuance from your conversation history.  HTMLThe suggestion to move from a single flat UniversalEntity table to a Discriminated Union (BaseEntity extended by FossilSpecimen and CulturalArtifact) solves a classic WebGL/CMS data problem: UI clutter and empty "N/A" field handling.  HTMLIf you use a flat schema, an ancient artifact like the Rosetta Stone ends up with empty fossil attributes (species, excavatedBy), while a T-Rex skull has empty cultural attributes (creator, commissionedBy). By refactoring to a discriminated union, TypeScript and React can automatically branch which attribute table to render in your UI modal using type guards.  HTML+ 1Here is how we integrate that exact discriminated union schema into our master architecture, along with the Hotspot Linking System (connecting 3D Evolution Engine stage hotspots to Gallery cards) and the dynamic EntityDetailModal.tsx.  HTML1. Discriminated Union Schema & Zod Parsers (src/types/schema.ts)We define a shared BaseEntitySchema and discriminate on type: 'fossil' | 'artifact' | 'relic' | 'civilization'.  HTMLTypeScriptimport { z } from 'zod';

// Shared base attributes for every museum item
export const BaseEntitySchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1),
  name: z.string().min(1),
  era: z.string(),
  timelinePositionMYA: z.number(), // Millions of Years Ago (e.g. 66 for T-Rex, 0.00022 for Rosetta Stone)
  yearsAgo: z.number(), // Absolute years ago for unified timeline slider filtering
  historicalSignificance: z.string(),
  description: z.string(),
  currentLocation: z.string().optional(),
  currentCustodian: z.string().optional(),
  
  // Media Assets
  images: z.array(z.object({ url: z.string(), alt: z.string(), caption: z.string().optional() })),
  model3D: z.object({
    glbPath: z.string(),
    dracoCompressed: z.boolean().default(true),
    ktx2Textures: z.boolean().default(true),
    initialScale: z.tuple([z.number(), z.number(), z.number()]).default([1, 1, 1]),
    initialRotation: z.tuple([z.number(), z.number(), z.number()]).default([0, 0, 0]),
  }).optional(),
  audioGuide: z.object({
    url: z.string(),
    durationSeconds: z.number(),
  }).optional(),

  tags: z.array(z.string()).default([]),
  relatedEntityIds: z.array(z.string()).default([]),
});

// Type 1: Paleontological / Biological Fossil Specimens
export const FossilSpecimenSchema = BaseEntitySchema.extend({
  type: z.literal('fossil'),
  category: z.enum(['fossil', 'dinosaur', 'species']),
  species: z.string(),
  geologicalPeriod: z.string(), // e.g., "Late Cretaceous"
  excavatedBy: z.string().optional(),
  placeOfDiscovery: z.string().optional(),
  estimatedAge: z.string().optional(),
});

// Type 2: Human Cultural Artifacts & Antiquities
export const CulturalArtifactSchema = BaseEntitySchema.extend({
  type: z.literal('artifact'),
  category: z.enum(['artifact', 'relic', 'coin', 'statue', 'manuscript']),
  civilization: z.string(), // e.g., "Ptolemaic Egypt"
  creator: z.string().optional(),
  commissionedBy: z.string().optional(),
  discoverer: z.string().optional(),
  discoveryDate: z.string().optional(),
  materials: z.array(z.string()).default([]),
  dimensions: z.object({
    heightCM: z.number().optional(),
    widthCM: z.number().optional(),
    depthCM: z.number().optional(),
    weightKG: z.number().optional(),
  }).optional(),
  authenticity: z.enum(['Authentic', 'Replica', 'Disputed']).default('Authentic'),
});

// Discriminated Union combining all specimen types
export const MuseumEntitySchema = z.discriminatedUnion('type', [
  FossilSpecimenSchema,
  CulturalArtifactSchema,
]);

export type BaseEntity = z.infer<typeof BaseEntitySchema>;
export type FossilSpecimen = z.infer<typeof FossilSpecimenSchema>;
export type CulturalArtifact = z.infer<typeof CulturalArtifactSchema>;
export type MuseumEntity = z.infer<typeof MuseumEntitySchema>;

/* TYPE GUARDS */
export function isFossil(entity: MuseumEntity): entity is FossilSpecimen {
  return entity.type === 'fossil';
}

export function isCulturalArtifact(entity: MuseumEntity): entity is CulturalArtifact {
  return entity.type === 'artifact';
}
2. Evolution Stage Hotspot Contract (src/types/evolution.ts)To link Stage 2's 3D T-Rex model directly to its Gallery card, we define an explicit linkedEntityId contract on hotspots:  HTMLTypeScriptimport { z } from 'zod';

export const Hotspot3DSchema = z.object({
  id: z.string(),
  title: z.string(),
  position: z.tuple([z.number(), z.number(), z.number()]), // 3D Coordinates inside R3F stage
  linkedEntityId: z.string().uuid(), // Foreign Key matching a MuseumEntity.id
  shortDescription: z.string(),
});

export const EvolutionStageSchema = z.object({
  id: z.number().min(1).max(5),
  slug: z.string(),
  title: z.string(),
  timeRangeLabel: z.string(),
  myaRange: z.tuple([z.number(), z.number()]),
  hotspots: z.array(Hotspot3DSchema),
});

export type Hotspot3D = z.infer<typeof Hotspot3DSchema>;
export type EvolutionStage = z.infer<typeof EvolutionStageSchema>;
3. Type-Safe Modal Renderer (src/components/museum/EntityDetailModal.tsx)This modal uses our isFossil() and isCulturalArtifact() type guards to render clean, context-aware metadata without showing empty "N/A" rows.  HTMLTypeScript'use client';

import React from 'react';
import Image from 'next/image';
import { MuseumEntity, isFossil, isCulturalArtifact } from '@/types/schema';

interface EntityDetailModalProps {
  entity: MuseumEntity | null;
  onClose: () => void;
}

export function EntityDetailModal({ entity, onClose }: EntityDetailModalProps) {
  if (!entity) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-neutral-950/80 rounded-full text-neutral-400 hover:text-white transition"
        >
          ✕
        </button>

        {/* IMAGE / PREVIEW COLUMN */}
        <div className="relative w-full md:w-1/2 aspect-square md:aspect-auto bg-neutral-950">
          {entity.images[0] && (
            <Image
              src={entity.images[0].url}
              alt={entity.images[0].alt}
              fill
              className="object-cover"
            />
          )}
          <div className="absolute bottom-4 left-4 bg-neutral-950/90 border border-neutral-800 px-3 py-1 rounded text-xs font-mono text-cyan-400">
            {entity.era} ({entity.timelinePositionMYA} MYA)
          </div>
        </div>

        {/* METADATA COLUMN */}
        <div className="w-full md:w-1/2 p-6 overflow-y-auto space-y-6">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">
              {entity.type.toUpperCase()} • {entity.category.toUpperCase()}
            </span>
            <h2 className="text-2xl font-bold text-white mt-1">{entity.name}</h2>
          </div>

          <p className="text-sm text-neutral-300 leading-relaxed">
            {entity.description}
          </p>

          {/* DISCRIMINATED METADATA TABLE */}
          <div className="border-t border-neutral-800 pt-4">
            <h3 className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-3">
              Specimen Attributes
            </h3>

            <dl className="grid grid-cols-2 gap-3 text-xs">
              {/* BRANCH 1: FOSSIL SPECIMEN ATTRIBUTES */}
              {isFossil(entity) && (
                <>
                  <MetaItem label="Species" value={entity.species} />
                  <MetaItem label="Geological Period" value={entity.geologicalPeriod} />
                  {entity.excavatedBy && <MetaItem label="Excavated By" value={entity.excavatedBy} />}
                  {entity.placeOfDiscovery && <MetaItem label="Discovery Site" value={entity.placeOfDiscovery} />}
                  {entity.estimatedAge && <MetaItem label="Estimated Age" value={entity.estimatedAge} />}
                </>
              )}

              {/* BRANCH 2: CULTURAL ARTIFACT ATTRIBUTES */}
              {isCulturalArtifact(entity) && (
                <>
                  <MetaItem label="Civilization" value={entity.civilization} />
                  {entity.creator && <MetaItem label="Creator" value={entity.creator} />}
                  {entity.commissionedBy && <MetaItem label="Commissioned By" value={entity.commissionedBy} />}
                  {entity.discoverer && <MetaItem label="Discoverer" value={entity.discoverer} />}
                  {entity.discoveryDate && <MetaItem label="Discovery Date" value={entity.discoveryDate} />}
                  {entity.materials.length > 0 && (
                    <MetaItem label="Materials" value={entity.materials.join(', ')} />
                  )}
                  <MetaItem label="Authenticity" value={entity.authenticity} />
                </>
              )}

              {/* SHARED BASE ATTRIBUTES */}
              {entity.currentLocation && <MetaItem label="Current Location" value={entity.currentLocation} />}
            </dl>
          </div>

          {/* HISTORICAL SIGNIFICANCE BLOCK */}
          <div className="bg-neutral-950/60 p-4 rounded-xl border border-neutral-800/60">
            <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
              Historical Significance
            </h4>
            <p className="text-xs text-neutral-400 leading-normal">
              {entity.historicalSignificance}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-neutral-500 text-[10px] uppercase font-mono">{label}</dt>
      <dd className="text-neutral-200 font-medium mt-0.5">{value}</dd>
    </div>
  );
}
4. Architectural SummaryBy adopting this discriminated union refactor:  HTMLZero "N/A" Field Clutter: FossilSpecimen cards only render biological/geological properties, while CulturalArtifact cards render human historical details.  HTMLSeamless 3D-to-Gallery Linking: Clicking a 3D hotspot in Stage 2 (T-Rex) pulls hotspot.linkedEntityId, finds the matching MuseumEntity from entities.json, and opens EntityDetailModal instantly.  HTMLStrict Zod Runtime Guarantees: Invalid JSON items get flagged during build time or API fetching before reaching WebGL canvas elements.☆☆

---

