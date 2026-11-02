# 🏛️ MUSEO — Files Required to Build & Architecture Mapping

> **Active Stack**: **Next.js 16 (App Router) + TypeScript 5 (Strict) + React Three Fiber (Three.js 0.185) + Tailwind CSS + GSAP / Framer Motion / Anime.js**  
> **Status**: ✅ Complete (Foundation & Core Experience) | 🔨 Refined / Polished | ⏳ Planned Extensions  
> **Priority**: **P0** Core Foundation & Engine, **P1** High-fidelity Inspectors & Audio, **P2** Extended Sandboxes.

---

## 1. Resolved Architectural Decisions (Open Questions)

| Question | Resolved Decision | Architecture Justification |
|---|---|---|
| **Vite or Next.js?** | **Next.js 16 (App Router)** | Provides SSR metadata, route streaming, dynamic `[slug]` museum archives, and secure server-side JWT authentication APIs without separate backend infrastructure. |
| **Physics library?** | **`maath` + Anime.js v4 Springs + Pointer Inertia** | Pure WebGL/CSS physics eliminates 3+ MB of heavy Cannon/Rapier WASM overhead, delivering 60 FPS tilt, inertia, and spring dynamics across mobile & low-power devices. |
| **Motion library?** | **GSAP 3 + Framer Motion + Anime.js** | GSAP handles scroll-driven timeline triggers & camera quickTo transforms; Framer Motion powers UI layout gestures; Anime.js handles ticket micro-springs. |
| **Auth strategy?** | **Hybrid: Real JWT Auth + Demo Pass** | Route handlers (`/api/auth/login`, `/me`, `/profile`, `/logout`) support both authenticated Patron sessions and 1-click VIP demo clearance. |
| **Hosting target?** | **Vercel / Node Server** | Native Next.js 16 App Router runtime with automatic asset caching and WebAssembly/Draco header support. |

---

## 2. Project Directory Tree (Next.js App Router Edition)

```
museverse/
├─ package.json                   # Dependencies: Next 16, Three.js, R3F, GSAP, Anime.js, Zustand
├─ tsconfig.json                  # Strict mode enabled, path alias @/* -> src/*
├─ next.config.ts                 # Turbopack & WebGL asset headers
├─ postcss.config.mjs             # Tailwind CSS PostCSS configuration
├─ .gitignore                     # Git exclusions
├─ README.md                      # High-level architecture & quick start
├─ design.md                      # Neo-brutalist & luxury museum design tokens
├─ FILES.md                       # This file specification & implementation matrix
├─ docs/
│  ├─ ARCHITECTURE.md             # Dual-presentation WebGL & frame-delta memory specs
│  ├─ API_REFERENCE.md            # Universal schema, Zustand stores, & auth routes
│  └─ DEVELOPMENT_GUIDE.md        # Draco compression pipeline & local dev guide
│
├─ public/
│  ├─ draco/                      # Google Draco WebAssembly decoders
│  ├─ models/                     # .glb models (intro-arch, planet earth, tree, etc.)
│  ├─ textures/                   # Procedural & compressed textures (.ktx2)
│  ├─ images/                     # Archival photography & museum assets
│  └─ favicon.ico
│
└─ src/
   ├─ app/                        # Next.js App Router
   │  ├─ layout.tsx               # Root layout, Space Grotesk font injection, audio provider
   │  ├─ page.tsx                 # Home exhibition hall (7 interactive sections)
   │  ├─ globals.css              # Reset, tokens, neo-brutalist utilities, reduced-motion rules
   │  ├─ evolution/
   │  │  └─ page.tsx              # 3D Earth Evolution Engine (4.5 Ga -> Present)
   │  ├─ login/
   │  │  ├─ page.tsx              # Living Museum 6-stage Admission Portal
   │  │  ├─ layout.tsx            # Portal layout shell
   │  │  └─ login.css             # Ticket, wax seal, & scanner styling
   │  ├─ museum/
   │  │  ├─ page.tsx              # Virtual Specimen Archive (24 entities, filters, search)
   │  │  └─ [slug]/
   │  │     └─ page.tsx           # 3D Specimen Inspector, Material Degradation & Origin Map
   │  ├─ compare/
   │  │  └─ page.tsx              # Side-by-side artifact comparison tool
   │  ├─ profile/
   │  │  └─ page.tsx              # Patron clearance pass & exhibition history
   │  ├─ hall/
   │  │  └─ page.tsx              # High-throughput 3D hall redirect
   │  └─ api/auth/
   │     ├─ login/route.ts        # Credential & VIP demo authentication endpoint
   │     ├─ logout/route.ts       # Cookie session revoker
   │     ├─ me/route.ts           # Token verification & patron state
   │     └─ profile/route.ts      # Profile mutation endpoint
   │
   ├─ types/
   │  ├─ museum.ts                # MuseumEntity, EvolutionStage, SpecimenCategory types
   │  └─ schema.ts                # Runtime Zod validation schemas
   │
   ├─ data/
   │  └─ entities.ts              # Universal 24-entity verified museum catalog
   │
   ├─ lib/
   │  ├─ apiClient.ts             # Type-safe API client wrapper
   │  └─ gsap.ts                  # SSR-safe GSAP ScrollTrigger registration
   │
   ├─ hooks/
   │  ├─ useEvolutionScroll.ts    # Smooth scroll-to-MYA synchronization
   │  ├─ usePerformanceTier.ts   # Device GPU tiering & particle throttling
   │  ├─ useGlobalSound.ts        # Synthesized Web Audio soundtrack & FX
   │  ├─ useLoginAudio.ts         # Cinematic admission soundscapes
   │  ├─ useSpatialAudio.ts       # 3D positional WebGL sound
   │  ├─ useGyroscope.ts          # Mobile tilt & orientation handler
   │  └─ useVariableFontWeight.ts # Scroll-reactive typography weights
   │
   ├─ stores/
   │  ├─ useEvolutionStore.ts     # Deep-time chrono scrubber, stages, & telemetry
   │  ├─ useMuseumStore.ts        # Archive filters, active inspect entity, search
   │  ├─ useAuthStore.ts          # Patron session, clearance level, admission state
   │  ├─ useLoginStore.ts         # 6-stage admission flow coordinator
   │  └─ useAppStore.ts           # Global UI drawer & theme states
   │
   └─ components/
      ├─ canvas/                  # WebGL & React Three Fiber components
      │  ├─ CanvasShell.tsx       # Standardized R3F Canvas wrapper with tier fallback
      │  ├─ HeroCanvas.tsx        # Home hero 3D interactive exhibit
      │  ├─ StageManager.tsx      # Smooth frame-delta shader & fog interpolator
      │  ├─ ChronoTerraGlobe.tsx  # Dynamic continental drift & geological Earth
      │  ├─ EarthModel.tsx        # Optimized low-poly interactive globe
      │  ├─ RealisticAsteroidImpact.tsx # Chicxulub cinematic shockwave & firestorm
      │  ├─ Specimen3DViewer.tsx  # Orbit inspector with wireframe & material sandbox
      │  ├─ MiniSpecimen3D.tsx    # Lightweight preview mesh for archive cards
      │  ├─ HotspotMarker.tsx     # Geographic discovery pins
      │  ├─ CameraRig.tsx         # Smooth camera trajectory controller
      │  ├─ AntikytheraModel.tsx  # Dedicated Hellenistic gear mechanism
      │  └─ planetaryTextures.ts  # Multi-epoch procedural shaders & normal maps
      │
      ├─ login/                   # 6-Stage Admission Experience
      │  ├─ TicketCard.tsx        # 3D Admission Pass with 24K Gold Foil & cursor physics
      │  ├─ TicketPrinter.tsx     # Robotic dispenser with cyan laser sweep
      │  ├─ MuseumFacade.tsx      # Atmospheric night facade & Latin pediment
      │  ├─ MuseumFlythrough.tsx  # Perspective corridor warp through museum wings
      │  ├─ AuthResult.tsx        # Wax seal slam animation & clearance display
      │  ├─ MuseumGalleryDashboard.tsx # Post-admission patron hub
      │  ├─ DustParticles.tsx     # Ambient atmospheric dust
      │  └─ InkEffect.tsx         # Neo-brutalist authentication splash
      │
      ├─ sections/                # Home Exhibition Sections
      │  ├─ ArchiveScatterPlot.tsx# Deep-time chronological specimen distribution
      │  ├─ Spotlight.tsx         # Curated artifact highlight carousel
      │  ├─ VirtualMuseumPortals.tsx # Entrance gates to specialized galleries
      │  ├─ DegradationSandbox.tsx# Interactive patina & geological weathering simulator
      │  ├─ OriginMap.tsx         # Archeological discovery globe with GPS decoders
      │  ├─ EpochPreview.tsx      # 5 Geological epochs preview carousel
      │  ├─ PatronExhibitionPass.tsx # Admission CTA and membership tier selector
      │  ├─ HorizontalScrollSection.tsx # Chronological horizontal gallery track
      │  └─ CuratorialConsortium.tsx # Institutional partners & citation registry
      │
      ├─ showreel/
      │  └─ MuseumReelModal.tsx   # Cinematic video reel modal
      ├─ certificate/
      │  └─ CertificateModal.tsx  # Verified specimen provenance certificate generator
      ├─ compare/
      │  └─ CompareDrawer.tsx     # Specimen comparative analysis drawer
      └─ auth/
         └─ AuthModal.tsx         # Fast-login modal overlay
```

---

## 3. Specification vs Implementation Matrix

| Original Vite Spec File | Next.js Implementation Path | Status | Key Features |
|---|---|---|---|
| `main.tsx` / `App.tsx` | [`src/app/layout.tsx`](file:///c:/Users/DELL/Documents/museverse/src/app/layout.tsx) + [`page.tsx`](file:///c:/Users/DELL/Documents/museverse/src/app/page.tsx) | ✅ Done | Global HTML shell, audio context provider, Space Grotesk font, and root home page. |
| `routes.tsx` | Next.js App Router (`src/app/**/page.tsx`) | ✅ Done | Native file-system routes (`/`, `/evolution`, `/login`, `/museum`, `/museum/[slug]`, `/compare`, `/profile`). |
| `styles/tokens.css` | [`src/app/globals.css`](file:///c:/Users/DELL/Documents/museverse/src/app/globals.css) & [`design.md`](file:///c:/Users/DELL/Documents/museverse/design.md) | ✅ Done | Complete Neo-Brutalist & Luxury Plum/Honey Dawn token variables. |
| `types/catalog.ts` | [`src/types/museum.ts`](file:///c:/Users/DELL/Documents/museverse/src/types/museum.ts) & [`schema.ts`](file:///c:/Users/DELL/Documents/museverse/src/types/schema.ts) | ✅ Done | `MuseumEntity`, `FossilSpecimen`, `CulturalArtifact`, `CelestialSpecimen` union types with Zod validation. |
| `types/evolution.ts` | [`src/types/museum.ts`](file:///c:/Users/DELL/Documents/museverse/src/types/museum.ts) | ✅ Done | `EvolutionStage`, `StageId` (5 geological epochs: Ocean, Dinosaurs, Asteroid, Ice Age, Anthropocene). |
| `data/entities.ts` | [`src/data/entities.ts`](file:///c:/Users/DELL/Documents/museverse/src/data/entities.ts) | ✅ Done | 24 verified specimens with scientific dates, coordinates, significance, and 3D paths. |
| `lib/guards.ts` | [`src/types/schema.ts`](file:///c:/Users/DELL/Documents/museverse/src/types/schema.ts) | ✅ Done | Full Zod schema guards and type narrowing for fossils, artifacts, and celestial bodies. |
| `lib/time.ts` | [`src/stores/useEvolutionStore.ts`](file:///c:/Users/DELL/Documents/museverse/src/stores/useEvolutionStore.ts) | ✅ Done | Non-linear logarithmic deep-time mapping (4,500 MYA to 0 MYA). |
| `hooks/useDeviceTier.ts` | [`src/hooks/usePerformanceTier.ts`](file:///c:/Users/DELL/Documents/museverse/src/hooks/usePerformanceTier.ts) | ✅ Done | Dynamic GPU tiering (Low, Med, High), particle scaling, and post-processing gating. |
| `hooks/useTimeline.ts` | [`src/hooks/useEvolutionScroll.ts`](file:///c:/Users/DELL/Documents/museverse/src/hooks/useEvolutionScroll.ts) | ✅ Done | Scroll-driven MYA timeline reader/writer with smooth lerp interpolation. |
| `canvas/LazyCanvas.tsx` | [`src/components/canvas/CanvasShell.tsx`](file:///c:/Users/DELL/Documents/museverse/src/components/canvas/CanvasShell.tsx) | ✅ Done | Frameloop gating, low-power fallback, WebGL context loss recovery. |
| `scenes/login/TicketCard.tsx` | [`src/components/login/TicketCard.tsx`](file:///c:/Users/DELL/Documents/museverse/src/components/login/TicketCard.tsx) | ✅ Done | 3D interactive ticket with 24K Holographic Gold Foil Seal, tilt physics, and clearance meter. |
| `scenes/login/TicketCounter.tsx` | [`src/components/login/TicketPrinter.tsx`](file:///c:/Users/DELL/Documents/museverse/src/components/login/TicketPrinter.tsx) | ✅ Done | Robotic dispenser with laser stepper printhead pulses. |
| `scenes/earth/EarthScene.tsx` | [`src/app/evolution/page.tsx`](file:///c:/Users/DELL/Documents/museverse/src/app/evolution/page.tsx) | ✅ Done | Multi-epoch WebGL Earth engine with time dilation and telemetry HUD. |
| `scenes/earth/Globe.tsx` | [`src/components/canvas/ChronoTerraGlobe.tsx`](file:///c:/Users/DELL/Documents/museverse/src/components/canvas/ChronoTerraGlobe.tsx) | ✅ Done | Multi-epoch terrain, continental drift textures, and orbital atmosphere. |
| `scenes/earth/AsteroidImpact.tsx` | [`src/components/canvas/RealisticAsteroidImpact.tsx`](file:///c:/Users/DELL/Documents/museverse/src/components/canvas/RealisticAsteroidImpact.tsx) | ✅ Done | 66 Ma Chicxulub shockwave, fiery particle burst, and atmospheric red-shift. |
| `scenes/gallery/ModelViewer.tsx` | [`src/components/canvas/Specimen3DViewer.tsx`](file:///c:/Users/DELL/Documents/museverse/src/components/canvas/Specimen3DViewer.tsx) | ✅ Done | Interactive orbit inspector, wireframe mode, and Material Degradation Sandbox. |

---

## 4. Suggested Build Order & Milestone Status

1. **Setup & Design Tokens** (✅ Complete): Next.js 16 configuration, Tailwind CSS, Space Grotesk fonts, and luxury neo-brutalist CSS tokens.
2. **Data Model & Catalog** (✅ Complete): Verified 24-entity collection in `entities.ts` with Zod validation.
3. **Core UI & Home Exhibition** (✅ Complete): 7 narrative sections (ScatterPlot, Spotlight, Portals, Degradation, Origin Map, Epochs, Patron Pass).
4. **Earth Evolution Engine** (✅ Complete): Deep-time scrubber, multi-epoch atmospheric transitions in `StageManager.tsx`, and Chicxulub impact cutscene.
5. **Admission & Auth Experience** (✅ Complete): 6-stage Living Museum portal (`/login`) with 3D tactile ticket and procedural Web Audio.
6. **Virtual Specimen Archive** (✅ Complete): Filterable catalog at `/museum` and dynamic 3D inspector at `/museum/[slug]`.
7. **Performance & Acoustic Polish** (✅ Complete): GPU tier detection, Draco mesh decompression, and procedural Web Audio soundtrack.
