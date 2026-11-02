# 🏛️ MUSEO // The Living Museum & 3D Specimen Archive

> **MUSEO (Museverse)** is an immersive, browser-based digital museum combining **4.5 billion years of Earth's evolution** with interactive 3D WebGL storytelling and a museum-quality digital specimen archive. Built with **Next.js 16 (App Router)**, **React Three Fiber (Three.js)**, **Zustand**, and **Tailwind CSS**.

---

## 📚 Complete Project Documentation

| Document | Path | Description |
| :--- | :--- | :--- |
| **System Architecture** | [`docs/ARCHITECTURE.md`](file:///c:/Users/DELL/Documents/museverse/docs/ARCHITECTURE.md) | Dual presentation layers, single shared WebGL context, frame-delta render loop, and memory pipeline. |
| **API & Schema Reference** | [`docs/API_REFERENCE.md`](file:///c:/Users/DELL/Documents/museverse/docs/API_REFERENCE.md) | Universal Entity Schema, Zustand stores, custom hooks, and Next.js App Router auth endpoints. |
| **Design Specification** | [`design.md`](file:///c:/Users/DELL/Documents/museverse/design.md) | Neo-Brutalist design tokens, typography scales, 3D admission ticket specs, and visual UI mockups. |
| **Development & Ops Guide** | [`docs/DEVELOPMENT_GUIDE.md`](file:///c:/Users/DELL/Documents/museverse/docs/DEVELOPMENT_GUIDE.md) | Local environment setup, Draco 3D mesh compression pipeline, testing, and deployment. |

---

## 🌟 Key Features & Core Modules

### 1. 🌍 3D Earth Evolution Engine (`/evolution`)
- Continuous, scroll-driven WebGL timeline spanning 4.5 billion years from the Hadean Eon to the Anthropocene.
- 5 Geological Epochs with custom atmospheric fog shaders, particle systems, dynamic lighting, and scientific telemetry.
- Real-time time dilation inspection mode and interactive horizontal chrono-scrubber.

### 2. 🏛️ Virtual Specimen Museum & 3D Inspector (`/museum`, `/museum/[slug]`)
- Data-driven collection of 24 verified specimens (Fossils, Dinosaurs, Ancient Relics, Civilizations, Meteorites).
- Interactive 3D WebGL orbit inspector with wireframe mode and multi-angle lighting passes.
- Material Degradation Sandbox: Real-time interactive simulation of patina, oxidation, rust, and geological erosion.
- Archeological Origin Map: 3D globe plotting specimen discovery coordinates with live coordinate decoders.

### 3. 🎫 The Living Museum Admission Portal (`/login`)
- 6-Stage cinematic admission flow: Monolithic facade $\to$ Robotic dispensary $\to$ Tactile 3D Admission Pass $\to$ Verification Stamp $\to$ 3D Corridor Flythrough $\to$ Gallery.
- 3D tactile admission ticket pass with **24K Holographic Gold Foil Seal** (`#D4AF37`), weighted cursor tilt physics, security clearance meter (`Level 1–3`), password eye toggle, and one-click demo fill.
- Synthesized Web Audio soundscapes: low-frequency wind pads, laser stepper printhead pulses, paper tear transients, and sub-bass wax seal slam thuds.

### 4. ⚡ Performance & Low-Power Hardware Tiering
- Dynamic GPU & hardware tier detection (`usePerformanceTier.ts`) to downscale particles and disable heavy post-processing on mobile devices and battery-saver profiles.
- Draco WebAssembly off-thread decompression for 3D GLB assets with instant low-poly wireframe fallbacks.
- Decoupled Three.js render loops running purely in `useFrame` frame-delta mutations to prevent React re-render jank.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
npm start
```

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 16.2.11 (App Router + Turbopack) |
| **Language** | TypeScript 5 (Strict Mode) |
| **3D / WebGL** | Three.js, React Three Fiber (R3F), `@react-three/drei` |
| **Compression** | Draco 3D Geometry Compression (WebAssembly) |
| **Animation** | GSAP 3 (ScrollTrigger, quickTo), Anime.js v4 (Spring physics), Canvas 2D |
| **State** | Zustand 5 |
| **Styling** | Tailwind CSS + Custom CSS Modules |
| **Acoustics** | Web Audio API (Procedural sound synthesis) |

---

*© 2026 MUSEO Digital Archive • All Rights Reserved*
