# 🛠️ MUSEO // Development & Operations Guide

> **Stack**: Next.js 16 (Turbopack) • React 19 • Three.js / React Three Fiber • Tailwind CSS • TypeScript 5+

---

## 1. Getting Started

### 1.1 Prerequisites
- **Node.js**: v18.18.0 or higher (v20+ recommended)
- **Package Manager**: `npm` (v9+) or `pnpm`
- **Modern Browser**: Chrome 110+, Edge 110+, Firefox 115+, or Safari 16.4+ with WebGL 2.0 and Web Audio API support.

### 1.2 Local Setup & Dev Server
```bash
# Clone the repository
git clone https://github.com/your-username/museverse.git
cd museverse

# Install dependencies
npm install

# Start development server with Turbopack
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 2. 3D Asset Pipeline & Optimization

All 3D assets in MUSEO are located in [`public/models/`](file:///c:/Users/DELL/Documents/museverse/public/models/) and must follow strict optimization guidelines:

### 2.1 Draco Geometry Compression
Raw Blender `.glb` exports can be 10–50 MB. Before committing 3D assets, compress them using `gltf-pipeline` with Draco compression:

```bash
# Install gltf-pipeline globally
npm install -g gltf-pipeline

# Compress GLB with Draco (Level 7)
gltf-pipeline -i input_model.glb -o public/models/compressed_model.glb -d --draco.compressionLevel 7
```

### 2.2 Model Guidelines
- **Polycount**: Target $\le 45,000$ triangles per hero specimen model.
- **Textures**: 1024x1024 or 2048x2048 JPEG / WebP / KTX2 texture maps.
- **Origin**: Center the pivot point at $(0, 0, 0)$ in Blender.
- **Units**: Set scene scale to meters (1 Blender unit = 1 Three.js world unit).

---

## 3. Performance & Memory Profiling

### 3.1 3D Canvas Guardrails
1. **Never Call `useState` Inside 3D Render Loops**:
   - Always use `@react-three/fiber`'s `useFrame((state, delta) => { ... })` and direct ref mutations (`ref.current.rotation.y += delta * speed`).
   - Calling React state setters inside the frame loop causes 60 React re-renders per second, resulting in severe GPU stutter.
2. **Dispose Geometries & Materials on Unmount**:
   - R3F handles automatic disposal of declarative JSX meshes. If creating standalone Three.js objects dynamically in `useEffect`, call `.dispose()` on unmount:
     ```typescript
     useEffect(() => {
       const geometry = new THREE.BufferGeometry();
       const material = new THREE.MeshStandardMaterial();
       return () => {
         geometry.dispose();
         material.dispose();
       };
     }, []);
     ```

---

## 4. Production Build & Deployment

### 4.1 Production Build
Validate the build locally before deploying:

```bash
# Run production build
npm run build

# Start production server
npm start
```

### 4.2 Verifying Build Output
Expected output across all 12 routes:
```
Route (app)
┌ ○ /
├ ○ /_not-found
├ ƒ /api/auth/login
├ ƒ /api/auth/logout
├ ƒ /api/auth/me
├ ƒ /api/auth/profile
├ ○ /evolution
├ ○ /login
├ ○ /museum
├ ƒ /museum/[slug]
└ ○ /profile

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
Exit code: 0
```

### 4.3 Deployment Target
- **Vercel** / **AWS Amplify** / **Docker Container**.
- Configure environment variables if integrating production databases (e.g. Supabase, PostgreSQL) or Redis rate limiters.

---

## 5. Troubleshooting & FAQ

#### Q: Next.js build errors with `missing-suspense-with-csr-bailout` on `/404` or `/_not-found`?
**A**: Ensure any component in root `app/layout.tsx` (like `AuthGuard`) that reads `useSearchParams()` is wrapped in `<Suspense fallback={...}>`.

#### Q: Audio doesn't play automatically on page load?
**A**: Browsers enforce user gesture security policies that suspend `AudioContext` until the user clicks or presses a key. MUSEO provides a first-class unlock overlay banner (`[ CLICK ANYWHERE TO START SOUNDSCAPE ]`) to resume the context smoothly on first interaction.

---

*MUSEO Development Manual • 2026*
