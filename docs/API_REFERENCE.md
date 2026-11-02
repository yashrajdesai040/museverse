# 📡 MUSEO // API Reference & Data Specification

> **Version**: 2.4.0 • **TypeScript**: Strict Mode • **State Engine**: Zustand 4+

---

## 1. Universal Entity Schema (`UniversalEntity`)

Defined in [`src/types/schema.ts`](file:///c:/Users/DELL/Documents/museverse/src/types/schema.ts) and [`src/types/museum.ts`](file:///c:/Users/DELL/Documents/museverse/src/types/museum.ts). Every fossil, relic, specimen, and celestial artifact adheres to this common contract:

```typescript
export type Category = 'fossil' | 'dinosaur' | 'artifact' | 'relic' | 'space' | 'civilization';

export interface UniversalEntity {
  id: string;                      // Unique identifier, e.g. "SPECIMEN-001"
  slug: string;                    // URL-safe route slug, e.g. "trex-sue"
  name: string;                    // Common display name, e.g. "T-Rex 'Sue' Skull"
  scientificName?: string;         // e.g. "Tyrannosaurus rex"
  category: Category;              // Primary taxonomy category
  subcategory?: string;            // Secondary classification
  era: string;                     // Geological epoch, e.g. "Late Cretaceous (66 MYA)"
  timelinePosition: number;        // Normalized chrono-index (0.0 to 1.0)
  
  // Historical & Origin Metadata
  civilization?: string;           // e.g. "Mesozoic Fauna", "Ancient Egypt"
  origin: string;                  // Archaeological discovery site
  coordinates?: [number, number];  // [Latitude, Longitude] for 3D globe plotting
  discoveryDate?: string;          // e.g. "1990 by Sue Hendrickson"
  material: string[];              // e.g. ["Mineralized Bone", "Silicate"]
  dimensions: {
    height?: string;
    width?: string;
    depth?: string;
    weight?: string;
  };
  condition?: string;              // e.g. "90% Complete Fossilized Skeleton"
  authenticity?: string;           // e.g. "Verified • Holotype Specimen"
  provenance: string[];            // Chain of custody records
  historicalSignificance: string;  // Detailed educational narrative
  description: string;             // Architectural exhibit overview
  
  // 3D & Media Assets
  images: { url: string; alt: string; caption?: string }[];
  model3D?: {
    glbPath: string;               // Path to Draco-compressed GLB
    initialScale?: [number, number, number];
    initialRotation?: [number, number, number];
  };
  audioGuide?: {
    url: string;
    duration: number;              // Duration in seconds
  };
  
  // Cross-References
  relatedEntityIds?: string[];
  tags: string[];
}
```

---

## 2. Global State Stores (Zustand)

### 2.1 `useAppStore` ([`src/stores/useAppStore.ts`](file:///c:/Users/DELL/Documents/museverse/src/stores/useAppStore.ts))
Controls global application shell state:

| State / Action | Type | Description |
| :--- | :--- | :--- |
| `audioMuted` | `boolean` | Global audio mute toggle |
| `performanceMode` | `'high' \| 'performance'` | Active GPU and visual quality tier |
| `searchModalOpen` | `boolean` | Universal search overlay visibility |
| `activeEntityId` | `string \| null` | Currently inspected 3D modal entity |
| `toggleAudio()` | `() => void` | Inverts `audioMuted` state |
| `setPerformanceMode(mode)` | `(mode) => void` | Updates visual quality tier |
| `openSearchModal()` | `() => void` | Opens global quick-search modal (`Cmd+K`) |

---

### 2.2 `useAuthStore` ([`src/stores/useAuthStore.ts`](file:///c:/Users/DELL/Documents/museverse/src/stores/useAuthStore.ts))
Manages user session, curator profiles, and authentication lifecycle:

| State / Action | Type | Description |
| :--- | :--- | :--- |
| `user` | `UserProfile \| null` | Authenticated curator metadata |
| `isAuthenticated` | `boolean` | Boolean auth flag |
| `isInitializing` | `boolean` | Initial session hydration status |
| `login(email, pass, remember)` | `Promise<AuthResult>` | Authenticates against `/api/auth/login` |
| `logout()` | `Promise<void>` | Clears cookie session and resets store |
| `checkSession()` | `Promise<void>` | Validates active session via `/api/auth/me` |

---

### 2.3 `useEvolutionStore` ([`src/stores/useEvolutionStore.ts`](file:///c:/Users/DELL/Documents/museverse/src/stores/useEvolutionStore.ts))
Controls the 3D Earth Evolution Engine timeline:

| State / Action | Type | Description |
| :--- | :--- | :--- |
| `currentStage` | `number (1–5)` | Active geological epoch |
| `scrollProgress` | `number (0–1)` | Continuous scroll timeline position |
| `isInspecting` | `boolean` | Time dilation inspection active flag |
| `setStage(stage)` | `(stage) => void` | Sets active evolution stage |
| `setScrollProgress(p)` | `(p) => void` | Updates continuous scroll position |

---

### 2.4 `useLoginStore` ([`src/stores/useLoginStore.ts`](file:///c:/Users/DELL/Documents/museverse/src/stores/useLoginStore.ts))
Orchestrates the 6-stage museum admission portal:

| State / Action | Type | Description |
| :--- | :--- | :--- |
| `scene` | `LoginScene` | Current scene: `ARRIVAL`, `APPROACH`, `TICKET_PRINT`, `LOGIN_FORM`, `VERIFYING`, `SUCCESS`, `DENIED`, `FLYTHROUGH` |
| `email` / `password` | `string` | Form input states |
| `rememberMe` | `boolean` | Remember me checkbox |
| `soundEnabled` | `boolean` | Soundscape audio toggle |
| `reducedMotion` | `boolean` | Accessibility motion preference |
| `setScene(scene)` | `(scene) => void` | Advances or jumps login scene |
| `authenticateAsync()` | `Promise<boolean>` | Submits credentials to auth API |

---

## 3. Custom Hooks

### 3.1 `usePerformanceTier` ([`src/hooks/usePerformanceTier.ts`](file:///c:/Users/DELL/Documents/museverse/src/hooks/usePerformanceTier.ts))
Dynamically detects low-power hardware, mobile viewports, battery saving profiles, and hardware concurrency ($\le 4$ cores). Returns scaled DPR targets and particle multipliers.

### 3.2 `useLoginAudio` ([`src/hooks/useLoginAudio.ts`](file:///c:/Users/DELL/Documents/museverse/src/hooks/useLoginAudio.ts))
High-fidelity procedural Web Audio engine:
- `playAmbience()`: Synthesizes low-frequency wind drone pad.
- `playPrint()`: 10-step mechanical laser printhead pulse sequence.
- `playTear()`: High-pass filtered paper tear transient.
- `playStamp()`: 95 Hz $\to$ 32 Hz sub-bass sine thud with metallic ring.
- `playGateOpen()`: Sawtooth hydraulic motor rise with air hiss.
- `playDenied()`: Dissonant minor-second warning alarm.

---

## 4. Next.js API Routes

| Endpoint | Method | Description | Security |
| :--- | :--- | :--- | :--- |
| `/api/auth/login` | `POST` | Authenticates curator credentials and sets `museo_session` HttpOnly cookie. | Rate-limited (5 attempts / 15 min), HttpOnly cookie |
| `/api/auth/me` | `GET` | Validates session token and returns non-sensitive user profile. | Cookie validation |
| `/api/auth/logout` | `POST` | Invalidates session and clears cookie. | Public |
| `/api/auth/profile` | `PATCH` | Updates curator profile handle, name, or avatar. | Protected (Requires active session) |

---

*MUSEO API Reference Specification • 2026*
