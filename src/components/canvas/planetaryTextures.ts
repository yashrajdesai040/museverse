import * as THREE from 'three';

// Cache generated textures so they are rendered once and reused instantly
const textureCache: Map<string, EpochTextureSet> = new Map();
let cloudTextureCache: THREE.CanvasTexture | null = null;
let cloudTextureCache2: THREE.CanvasTexture | null = null;

export interface EpochTextureSet {
  map: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
  emissiveMap: THREE.CanvasTexture;
  thermalMap: THREE.CanvasTexture;
  tectonicMap: THREE.CanvasTexture;
  biosphereMap: THREE.CanvasTexture;
}

// ── Ultra-Fast Seeded 2D/3D Noise Engine for Procedural Cartography ──
const P: number[] = new Array(512);
const PERM: number[] = [
  151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99,
  37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32,
  57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27,
  166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244,
  102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130,
  116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147,
  118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213,
  119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108,
  110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12,
  191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184,
  84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243,
  141, 128, 195, 78, 66, 215, 61, 156, 180
];
for (let i = 0; i < 256; i++) {
  P[256 + i] = P[i] = PERM[i];
}

function fade(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}
function lerp(t: number, a: number, b: number): number {
  return a + t * (b - a);
}
function grad(hash: number, x: number, y: number, z: number): number {
  const h = hash & 15;
  const u = h < 8 ? x : y;
  const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
}

function perlin3d(x: number, y: number, z: number): number {
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  const Z = Math.floor(z) & 255;

  x -= Math.floor(x);
  y -= Math.floor(y);
  z -= Math.floor(z);

  const u = fade(x);
  const v = fade(y);
  const w = fade(z);

  const A = P[X] + Y;
  const AA = P[A] + Z;
  const AB = P[A + 1] + Z;
  const B = P[X + 1] + Y;
  const BA = P[B] + Z;
  const BB = P[B + 1] + Z;

  return lerp(
    w,
    lerp(
      v,
      lerp(u, grad(P[AA], x, y, z), grad(P[BA], x - 1, y, z)),
      lerp(u, grad(P[AB], x, y - 1, z), grad(P[BB], x - 1, y - 1, z))
    ),
    lerp(
      v,
      lerp(u, grad(P[AA + 1], x, y, z - 1), grad(P[BA + 1], x - 1, y, z - 1)),
      lerp(u, grad(P[AB + 1], x, y - 1, z - 1), grad(P[BB + 1], x - 1, y - 1, z - 1))
    )
  );
}

// Multi-octave fractal Brownian motion sampled on sphere to eliminate polar distortion
function fbmSphere(x: number, y: number, z: number, octaves = 4): number {
  let val = 0;
  let freq = 1;
  let amp = 0.5;
  let max = 0;
  for (let i = 0; i < octaves; i++) {
    val += perlin3d(x * freq, y * freq, z * freq) * amp;
    max += amp;
    freq *= 2.05;
    amp *= 0.5;
  }
  return (val / max + 1) * 0.5; // normalized 0.0 to 1.0
}

// ── Draw Complex Natural Fractal Landmass ──
function drawFractalContinent(
  ctx: CanvasRenderingContext2D,
  bumpCtx: CanvasRenderingContext2D,
  roughCtx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  fillColor: string,
  shelfColor: string,
  roughnessVal = 200,
  elevationVal = 180
) {
  const points = 72;

  // 1. Shallow Continental Shelf
  ctx.save();
  ctx.beginPath();
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2;
    const nx = Math.cos(angle);
    const ny = Math.sin(angle);
    const n = Math.sin(nx * 3.5 + ny * 2.8) * 0.5 + Math.cos(nx * 6.0 - ny * 5.0) * 0.25;
    const radX = rx * (1.18 + n * 0.2);
    const radY = ry * (1.18 + n * 0.2);
    const px = cx + nx * radX;
    const py = cy + ny * radY;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = shelfColor;
  ctx.fill();
  ctx.restore();

  // 2. Main Landmass
  ctx.save();
  ctx.beginPath();
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2;
    const nx = Math.cos(angle);
    const ny = Math.sin(angle);
    const n = Math.sin(nx * 4.0 + ny * 3.2) * 0.5 + Math.cos(nx * 7.5 - ny * 6.0) * 0.25;
    const radX = rx * (1.0 + n * 0.24);
    const radY = ry * (1.0 + n * 0.24);
    const px = cx + nx * radX;
    const py = cy + ny * radY;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = fillColor;
  ctx.fill();
  ctx.restore();

  // 3. Physical Elevation Bump
  bumpCtx.save();
  bumpCtx.fillStyle = `rgb(${elevationVal}, ${elevationVal}, ${elevationVal})`;
  bumpCtx.beginPath();
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2;
    const nx = Math.cos(angle);
    const ny = Math.sin(angle);
    const n = Math.sin(nx * 4.0 + ny * 3.2) * 0.5;
    const radX = rx * (0.92 + n * 0.2);
    const radY = ry * (0.92 + n * 0.2);
    const px = cx + nx * radX;
    const py = cy + ny * radY;
    if (i === 0) bumpCtx.moveTo(px, py);
    else bumpCtx.lineTo(px, py);
  }
  bumpCtx.closePath();
  bumpCtx.fill();
  bumpCtx.restore();

  // 4. Roughness
  roughCtx.save();
  roughCtx.fillStyle = `rgb(${roughnessVal}, ${roughnessVal}, ${roughnessVal})`;
  roughCtx.beginPath();
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2;
    const nx = Math.cos(angle);
    const ny = Math.sin(angle);
    const radX = rx * 1.05;
    const radY = ry * 1.05;
    const px = cx + nx * radX;
    const py = cy + ny * radY;
    if (i === 0) roughCtx.moveTo(px, py);
    else roughCtx.lineTo(px, py);
  }
  roughCtx.closePath();
  roughCtx.fill();
  roughCtx.restore();
}

// ── Branching Magma Fissures Helper ──
function drawBranchingCrack(
  ctx: CanvasRenderingContext2D,
  eCtx: CanvasRenderingContext2D,
  bCtx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  length: number,
  angle: number,
  depth: number
) {
  if (depth <= 0 || length < 2) return;

  const endX = startX + Math.cos(angle) * length;
  const endY = startY + Math.sin(angle) * length;

  // Outer red-orange glow
  ctx.strokeStyle = '#ff3300';
  ctx.lineWidth = Math.max(2, depth * 2.2);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();

  // Emissive glow
  eCtx.strokeStyle = '#ff4400';
  eCtx.lineWidth = Math.max(3, depth * 2.5);
  eCtx.lineCap = 'round';
  eCtx.beginPath();
  eCtx.moveTo(startX, startY);
  eCtx.lineTo(endX, endY);
  eCtx.stroke();

  // Inner incandescent yellow core
  ctx.strokeStyle = '#ffee33';
  ctx.lineWidth = Math.max(1, depth * 0.9);
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();

  eCtx.strokeStyle = '#ffff77';
  eCtx.lineWidth = Math.max(1.2, depth * 1.1);
  eCtx.beginPath();
  eCtx.moveTo(startX, startY);
  eCtx.lineTo(endX, endY);
  eCtx.stroke();

  // Bump ditch
  bCtx.strokeStyle = '#000000';
  bCtx.lineWidth = depth * 2;
  bCtx.beginPath();
  bCtx.moveTo(startX, startY);
  bCtx.lineTo(endX, endY);
  bCtx.stroke();

  const branches = 1 + Math.floor(Math.random() * 2);
  for (let i = 0; i < branches; i++) {
    const nextAngle = angle + (Math.random() - 0.5) * 0.95;
    const nextLength = length * (0.68 + Math.random() * 0.22);
    drawBranchingCrack(ctx, eCtx, bCtx, endX, endY, nextLength, nextAngle, depth - 1);
  }
}

// ── Draw Tectonic Fault Lines ──
function drawTectonicFaults(ctx: CanvasRenderingContext2D, W: number, H: number, color = '#00e5ff') {
  ctx.strokeStyle = color;
  ctx.lineWidth = 3.0;
  ctx.setLineDash([10, 6]);

  const paths = [
    // Mid-Atlantic Ridge
    [
      { x: W * 0.44, y: H * 0.05 },
      { x: W * 0.46, y: H * 0.35 },
      { x: W * 0.42, y: H * 0.65 },
      { x: W * 0.45, y: H * 0.95 },
    ],
    // Pacific Ring of Fire
    [
      { x: W * 0.12, y: H * 0.85 },
      { x: W * 0.18, y: H * 0.45 },
      { x: W * 0.32, y: H * 0.20 },
      { x: W * 0.72, y: H * 0.25 },
      { x: W * 0.85, y: H * 0.55 },
      { x: W * 0.88, y: H * 0.85 },
    ],
    // Indo-Eurasian Collision
    [
      { x: W * 0.55, y: H * 0.38 },
      { x: W * 0.68, y: H * 0.42 },
      { x: W * 0.75, y: H * 0.48 },
    ],
    // African Rift Valley
    [
      { x: W * 0.56, y: H * 0.45 },
      { x: W * 0.58, y: H * 0.65 },
      { x: W * 0.57, y: H * 0.75 },
    ],
  ];

  paths.forEach((p) => {
    ctx.beginPath();
    ctx.moveTo(p[0].x, p[0].y);
    for (let i = 1; i < p.length; i++) {
      ctx.lineTo(p[i].x, p[i].y);
    }
    ctx.stroke();
  });
  ctx.setLineDash([]);
}

// ── Draw City Lights for Anthropocene (Golden Cluster Simulation) ──
function drawCityLights(ctx: CanvasRenderingContext2D, W: number, H: number) {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, H);

  // High-density urban cluster centers [x, y, radius, intensity]
  const urbanCenters = [
    // North America (East Coast, West Coast, Chicago)
    { x: W * 0.28, y: H * 0.36, r: 42, count: 280, color: '#ffb703' },
    { x: W * 0.24, y: H * 0.38, r: 28, count: 140, color: '#fb8500' },
    { x: W * 0.19, y: H * 0.38, r: 34, count: 180, color: '#ffb703' },
    // Western Europe (London, Paris, Ruhr, Italy)
    { x: W * 0.48, y: H * 0.30, r: 48, count: 340, color: '#ffd166' },
    { x: W * 0.52, y: H * 0.32, r: 38, count: 240, color: '#ffb703' },
    // East Asia (Tokyo, Beijing, Shanghai, Seoul)
    { x: W * 0.82, y: H * 0.38, r: 52, count: 420, color: '#ffea00' },
    { x: W * 0.75, y: H * 0.38, r: 45, count: 320, color: '#ffb703' },
    { x: W * 0.76, y: H * 0.44, r: 40, count: 290, color: '#ffea00' },
    // South Asia (Indo-Gangetic Plain, Mumbai, Delhi)
    { x: W * 0.67, y: H * 0.46, r: 48, count: 360, color: '#ffb703' },
    // South America (São Paulo, Rio, Buenos Aires)
    { x: W * 0.36, y: H * 0.72, r: 35, count: 190, color: '#ffb703' },
    // Middle East & Nile River Delta
    { x: W * 0.54, y: H * 0.42, r: 24, count: 160, color: '#ffb703' },
    { x: W * 0.58, y: H * 0.44, r: 30, count: 210, color: '#ffd166' },
    // Australia (Sydney, Melbourne)
    { x: W * 0.85, y: H * 0.76, r: 22, count: 90, color: '#ffb703' },
  ];

  urbanCenters.forEach((center) => {
    // Soft metropolitan glow
    const g = ctx.createRadialGradient(center.x, center.y, 2, center.x, center.y, center.r * 1.5);
    g.addColorStop(0, 'rgba(255, 200, 80, 0.45)');
    g.addColorStop(0.4, 'rgba(255, 140, 20, 0.15)');
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(center.x, center.y, center.r * 1.5, 0, Math.PI * 2);
    ctx.fill();

    // High-density incandescent light points
    for (let i = 0; i < center.count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.pow(Math.random(), 1.6) * center.r;
      const px = center.x + Math.cos(angle) * dist;
      const py = center.y + Math.sin(angle) * dist * 0.85;
      const size = Math.random() > 0.85 ? 1.6 : 1.0;
      ctx.fillStyle = center.color;
      ctx.fillRect(px, py, size, size);
    }
  });
}

// ── Generate All Maps for Given Epoch ──
export function getEpochTexture(epochIndex: number): EpochTextureSet {
  const key = `epoch_v3_${epochIndex}`;
  if (textureCache.has(key)) {
    return textureCache.get(key)!;
  }

  const W = 1536;
  const H = 768;

  // 1. Diffuse Albedo Canvas
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // 2. Bump / Height Canvas (physical relief)
  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = W;
  bumpCanvas.height = H;
  const bCtx = bumpCanvas.getContext('2d')!;
  bCtx.fillStyle = '#101010';
  bCtx.fillRect(0, 0, W, H);

  // 3. Roughness Canvas (shiny ocean vs matte rock)
  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = W;
  roughCanvas.height = H;
  const rCtx = roughCanvas.getContext('2d')!;
  rCtx.fillStyle = '#202020'; // Glossy water default
  rCtx.fillRect(0, 0, W, H);

  // 4. Emissive Canvas (magma, vents, night lights)
  const emissiveCanvas = document.createElement('canvas');
  emissiveCanvas.width = W;
  emissiveCanvas.height = H;
  const eCtx = emissiveCanvas.getContext('2d')!;
  eCtx.fillStyle = '#000000';
  eCtx.fillRect(0, 0, W, H);

  // 5. Paleoclimate Thermal Heatmap Canvas
  const thermalCanvas = document.createElement('canvas');
  thermalCanvas.width = W;
  thermalCanvas.height = H;
  const tCtx = thermalCanvas.getContext('2d')!;

  // 6. Holographic Tectonic Boundaries Canvas
  const tectonicCanvas = document.createElement('canvas');
  tectonicCanvas.width = W;
  tectonicCanvas.height = H;
  const tcCtx = tectonicCanvas.getContext('2d')!;
  tcCtx.fillStyle = 'rgba(0,0,0,0)';
  tcCtx.fillRect(0, 0, W, H);

  // 7. Biosphere NDVI Vegetation Index Canvas
  const bioCanvas = document.createElement('canvas');
  bioCanvas.width = W;
  bioCanvas.height = H;
  const bioCtx = bioCanvas.getContext('2d')!;
  bioCtx.fillStyle = '#020d08';
  bioCtx.fillRect(0, 0, W, H);

  if (epochIndex === 0) {
    // ════════════════════════════════════════════════════════════
    // 0. HADEAN EON (Molten Magma Ocean & Tectonic Fissures)
    // ════════════════════════════════════════════════════════════
    ctx.fillStyle = '#0f0a09';
    ctx.fillRect(0, 0, W, H);

    // Deep mantle convective turbulence
    const lavaGrad = ctx.createRadialGradient(W * 0.45, H * 0.5, 40, W * 0.45, H * 0.5, W * 0.55);
    lavaGrad.addColorStop(0, '#550800');
    lavaGrad.addColorStop(0.5, '#220600');
    lavaGrad.addColorStop(1, '#0f0a09');
    ctx.fillStyle = lavaGrad;
    ctx.fillRect(0, 0, W, H);

    bCtx.fillStyle = '#404040';
    bCtx.fillRect(0, 0, W, H);
    rCtx.fillStyle = '#d0d0d0'; // Rough matte basalt crust
    rCtx.fillRect(0, 0, W, H);

    // Branching Molten Lava Networks
    const lavaFissures = [
      { x: W * 0.22, y: H * 0.28, l: 140 },
      { x: W * 0.46, y: H * 0.44, l: 160 },
      { x: W * 0.74, y: H * 0.32, l: 150 },
      { x: W * 0.28, y: H * 0.68, l: 130 },
      { x: W * 0.62, y: H * 0.65, l: 155 },
      { x: W * 0.86, y: H * 0.60, l: 125 },
      { x: W * 0.50, y: H * 0.18, l: 110 },
      { x: W * 0.38, y: H * 0.85, l: 115 },
      { x: W * 0.80, y: H * 0.82, l: 120 },
      { x: W * 0.15, y: H * 0.50, l: 135 },
    ];
    lavaFissures.forEach((s) => {
      drawBranchingCrack(ctx, eCtx, bCtx, s.x, s.y, s.l, Math.random() * Math.PI * 2, 4);
    });

    // Asteroid Impact Basins with molten rings
    [
      { x: W * 0.42, y: H * 0.38, r: 65 },
      { x: W * 0.72, y: H * 0.52, r: 85 },
      { x: W * 0.25, y: H * 0.75, r: 50 },
    ].forEach((basin) => {
      const bg = ctx.createRadialGradient(basin.x, basin.y, 2, basin.x, basin.y, basin.r);
      bg.addColorStop(0, '#ffffaa');
      bg.addColorStop(0.3, '#ff5500');
      bg.addColorStop(0.7, '#880000');
      bg.addColorStop(1, 'transparent');
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.arc(basin.x, basin.y, basin.r, 0, Math.PI * 2);
      ctx.fill();

      eCtx.fillStyle = bg;
      eCtx.beginPath();
      eCtx.arc(basin.x, basin.y, basin.r, 0, Math.PI * 2);
      eCtx.fill();
    });

    // Thermal Heatmap (Extreme Magma: 1,200°C)
    const tGrad = tCtx.createRadialGradient(W / 2, H / 2, 50, W / 2, H / 2, W / 2);
    tGrad.addColorStop(0, '#ffff33');
    tGrad.addColorStop(0.35, '#ff4400');
    tGrad.addColorStop(0.75, '#cc0000');
    tGrad.addColorStop(1, '#550000');
    tCtx.fillStyle = tGrad;
    tCtx.fillRect(0, 0, W, H);

    drawTectonicFaults(tcCtx, W, H, '#ff5500');
  } else if (epochIndex === 1) {
    // ════════════════════════════════════════════════════════════
    // 1. ARCHEAN EON (Acidic Iron-Teal Oceans & First Cratons)
    // ════════════════════════════════════════════════════════════
    // Deep iron sea gradient
    const seaGrad = ctx.createLinearGradient(0, 0, 0, H);
    seaGrad.addColorStop(0, '#02242b');
    seaGrad.addColorStop(0.5, '#03414d');
    seaGrad.addColorStop(1, '#02242b');
    ctx.fillStyle = seaGrad;
    ctx.fillRect(0, 0, W, H);

    // Ancient Cratons (Pilbara, Kaapvaal, Superior, Yilgarn)
    drawFractalContinent(ctx, bCtx, rCtx, W * 0.32, H * 0.42, 160, 120, '#2b2118', '#00b4d8', 210, 190);
    drawFractalContinent(ctx, bCtx, rCtx, W * 0.58, H * 0.50, 180, 140, '#352920', '#00b4d8', 210, 185);
    drawFractalContinent(ctx, bCtx, rCtx, W * 0.78, H * 0.36, 140, 110, '#261b14', '#00b4d8', 210, 180);
    drawFractalContinent(ctx, bCtx, rCtx, W * 0.22, H * 0.68, 120, 95, '#2d2218', '#00b4d8', 210, 175);

    // Stromatolite bio-fringes in shallow waters
    bioCtx.fillStyle = '#1b4332';
    [
      { x: W * 0.32, y: H * 0.42, r: 170 },
      { x: W * 0.58, y: H * 0.50, r: 190 },
      { x: W * 0.78, y: H * 0.36, r: 150 },
    ].forEach((reef) => {
      bioCtx.beginPath();
      bioCtx.arc(reef.x, reef.y, reef.r, 0, Math.PI * 2);
      bioCtx.fill();
    });

    // Glowing Submarine Hydrothermal Vents
    [
      { x: W * 0.38, y: H * 0.55 },
      { x: W * 0.52, y: H * 0.38 },
      { x: W * 0.73, y: H * 0.60 },
      { x: W * 0.26, y: H * 0.32 },
    ].forEach((v) => {
      const vGrad = ctx.createRadialGradient(v.x, v.y, 1, v.x, v.y, 22);
      vGrad.addColorStop(0, '#00ffff');
      vGrad.addColorStop(0.3, '#0099bb');
      vGrad.addColorStop(0.8, '#004455');
      vGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = vGrad;
      ctx.beginPath();
      ctx.arc(v.x, v.y, 22, 0, Math.PI * 2);
      ctx.fill();

      eCtx.fillStyle = vGrad;
      eCtx.beginPath();
      eCtx.arc(v.x, v.y, 22, 0, Math.PI * 2);
      eCtx.fill();
    });

    // Thermal Heatmap (55°C)
    tCtx.fillStyle = '#00a896';
    tCtx.fillRect(0, 0, W, H);

    drawTectonicFaults(tcCtx, W, H, '#00e5ff');
  } else if (epochIndex === 2) {
    // ════════════════════════════════════════════════════════════
    // 2. PROTEROZOIC (Snowball Earth & Great Oxidation)
    // ════════════════════════════════════════════════════════════
    // Crystalline global ice ocean
    ctx.fillStyle = '#f0f8ff';
    ctx.fillRect(0, 0, W, H);

    bCtx.fillStyle = '#808080';
    bCtx.fillRect(0, 0, W, H);
    rCtx.fillStyle = '#222222'; // High specular ice
    rCtx.fillRect(0, 0, W, H);

    // Glacial Ice Crevasse Fault Lines
    ctx.strokeStyle = '#0096c7';
    ctx.lineWidth = 2.0;
    for (let i = 0; i < 35; i++) {
      const sx = Math.random() * W;
      const sy = Math.random() * H;
      drawBranchingCrack(ctx, eCtx, bCtx, sx, sy, 70, Math.random() * Math.PI * 2, 3);
    }

    // Exposed Banded Iron Formation mountain nunataks
    ctx.fillStyle = '#7a1f18';
    bCtx.fillStyle = '#e0e0e0';
    [
      { x: W * 0.44, y: H * 0.48, r: 60 },
      { x: W * 0.68, y: H * 0.42, r: 70 },
      { x: W * 0.28, y: H * 0.58, r: 50 },
    ].forEach((bif) => {
      ctx.beginPath();
      ctx.arc(bif.x, bif.y, bif.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Thermal Heatmap (Sub-zero Glacial: -45°C)
    const snGrad = tCtx.createLinearGradient(0, 0, 0, H);
    snGrad.addColorStop(0, '#10002b');
    snGrad.addColorStop(0.3, '#240046');
    snGrad.addColorStop(0.5, '#3c096c');
    snGrad.addColorStop(0.7, '#240046');
    snGrad.addColorStop(1, '#10002b');
    tCtx.fillStyle = snGrad;
    tCtx.fillRect(0, 0, W, H);

    drawTectonicFaults(tcCtx, W, H, '#90e0ef');
  } else if (epochIndex === 3) {
    // ════════════════════════════════════════════════════════════
    // 3. PALEOZOIC ERA (Cambrian Explosion & Greening Land)
    // ════════════════════════════════════════════════════════════
    // Panthalassa Ocean & Iapetus Seaway
    const paleoOcean = ctx.createRadialGradient(W * 0.2, H * 0.5, 50, W * 0.2, H * 0.5, W * 0.55);
    paleoOcean.addColorStop(0, '#004e89');
    paleoOcean.addColorStop(0.5, '#002952');
    paleoOcean.addColorStop(1, '#001428');
    ctx.fillStyle = paleoOcean;
    ctx.fillRect(0, 0, W, H);

    // Proto-Continents: Massive southern Gondwana + Laurentia & Baltica
    // Southern Supercontinent Gondwana
    drawFractalContinent(ctx, bCtx, rCtx, W * 0.50, H * 0.65, 340, 200, '#386641', '#00b4d8', 215, 190);
    // Laurentia (North America equatorial)
    drawFractalContinent(ctx, bCtx, rCtx, W * 0.26, H * 0.40, 160, 120, '#6a994e', '#00b4d8', 210, 195);
    // Baltica / Siberia
    drawFractalContinent(ctx, bCtx, rCtx, W * 0.68, H * 0.32, 140, 100, '#6a994e', '#00b4d8', 205, 190);

    // Shallow tropical carbonate reef platforms (Cambrian reef explosion)
    ctx.fillStyle = '#06d6a0';
    ctx.beginPath();
    ctx.arc(W * 0.32, H * 0.45, 60, 0, Math.PI * 2);
    ctx.arc(W * 0.58, H * 0.55, 75, 0, Math.PI * 2);
    ctx.fill();

    // Appalachian / Caledonian early orogenic mountain bump elevation
    bCtx.fillStyle = '#ffffff';
    bCtx.fillRect(W * 0.35, H * 0.42, 80, 20);

    // Biosphere NDVI (Coastal mosses and early land plants)
    bioCtx.fillStyle = '#1b4332';
    bioCtx.beginPath();
    bioCtx.arc(W * 0.50, H * 0.65, 330, 0, Math.PI * 2);
    bioCtx.fill();

    // Thermal Heatmap (Moderate Greenhouse: 20°C)
    tCtx.fillStyle = '#f77f00';
    tCtx.fillRect(0, 0, W, H);

    drawTectonicFaults(tcCtx, W, H, '#52b788');
  } else if (epochIndex === 4) {
    // ════════════════════════════════════════════════════════════
    // 4. MESOZOIC ERA (Supercontinent Pangaea & Dinosaurs)
    // ════════════════════════════════════════════════════════════
    // Panthalassa Ocean
    const oceanGrad = ctx.createRadialGradient(W * 0.15, H * 0.5, 40, W * 0.15, H * 0.5, W * 0.5);
    oceanGrad.addColorStop(0, '#023e8a');
    oceanGrad.addColorStop(0.6, '#002855');
    oceanGrad.addColorStop(1, '#001833');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, W, H);

    // Giant Supercontinent Pangaea
    // Coastal rainforests
    drawFractalContinent(ctx, bCtx, rCtx, W * 0.52, H * 0.48, 380, 260, '#1b4d24', '#00b4d8', 210, 195);
    // Interior arid desert
    drawFractalContinent(ctx, bCtx, rCtx, W * 0.52, H * 0.48, 200, 145, '#b07d4b', '#1b4d24', 220, 220);

    // Central Pangean Mountain chain bump elevation
    bCtx.fillStyle = '#ffffff';
    bCtx.fillRect(W * 0.46, H * 0.38, 120, 150);

    // Chicxulub Meteor Impact coordinate hotspot
    const cx = W * 0.38;
    const cy = H * 0.42;
    const cGrad = ctx.createRadialGradient(cx, cy, 1, cx, cy, 32);
    cGrad.addColorStop(0, '#ffffff');
    cGrad.addColorStop(0.3, '#ff4400');
    cGrad.addColorStop(0.7, '#ff8800');
    cGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = cGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 32, 0, Math.PI * 2);
    ctx.fill();

    eCtx.fillStyle = cGrad;
    eCtx.beginPath();
    eCtx.arc(cx, cy, 32, 0, Math.PI * 2);
    eCtx.fill();

    // Biosphere NDVI (High coastal foliage)
    bioCtx.fillStyle = '#2d6a4f';
    bioCtx.beginPath();
    bioCtx.arc(W * 0.52, H * 0.48, 370, 0, Math.PI * 2);
    bioCtx.fill();

    // Thermal Heatmap (Warm Greenhouse: 24°C)
    tCtx.fillStyle = '#d90429';
    tCtx.fillRect(0, 0, W, H);

    drawTectonicFaults(tcCtx, W, H, '#ffd166');
  } else {
    // ════════════════════════════════════════════════════════════
    // 5. CENOZOIC ERA (Age of Mammals, Ice Ages & Anthropocene)
    // ════════════════════════════════════════════════════════════
    // Deep vibrant ocean
    const modernOcean = ctx.createLinearGradient(0, 0, 0, H);
    modernOcean.addColorStop(0, '#001b3a');
    modernOcean.addColorStop(0.5, '#002f6c');
    modernOcean.addColorStop(1, '#001b3a');
    ctx.fillStyle = modernOcean;
    ctx.fillRect(0, 0, W, H);

    // 7 Modern Continents
    // Eurasia
    drawFractalContinent(ctx, bCtx, rCtx, W * 0.65, H * 0.32, 270, 135, '#2d5a27', '#00b4d8', 210, 195);
    // Africa
    drawFractalContinent(ctx, bCtx, rCtx, W * 0.53, H * 0.54, 130, 160, '#606c38', '#00b4d8', 220, 185);
    // Sahara Desert belt
    ctx.fillStyle = '#b08968';
    ctx.fillRect(W * 0.46, H * 0.40, 150, 45);
    // North America
    drawFractalContinent(ctx, bCtx, rCtx, W * 0.25, H * 0.34, 170, 120, '#2d5a27', '#00b4d8', 210, 190);
    // South America (Amazon Basin)
    drawFractalContinent(ctx, bCtx, rCtx, W * 0.32, H * 0.65, 110, 150, '#132a13', '#00b4d8', 200, 185);
    // Australia
    drawFractalContinent(ctx, bCtx, rCtx, W * 0.82, H * 0.70, 110, 85, '#99582a', '#00b4d8', 220, 180);
    // Antarctica Polar Ice
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, H * 0.88, W, H * 0.12);
    // Greenland Ice
    ctx.beginPath();
    ctx.ellipse(W * 0.38, H * 0.14, 55, 38, 0, 0, Math.PI * 2);
    ctx.fill();

    // Himalayan mountain ridge bump
    bCtx.fillStyle = '#ffffff';
    bCtx.fillRect(W * 0.65, H * 0.34, 90, 25);

    // Dynamic Night-Side City Lights in Emissive Map!
    drawCityLights(eCtx, W, H);

    // Biosphere NDVI Vegetation Index
    bioCtx.fillStyle = '#020d08';
    bioCtx.fillRect(0, 0, W, H);
    bioCtx.fillStyle = '#52b788';
    bioCtx.fillRect(W * 0.28, H * 0.58, 90, 80); // Amazon
    bioCtx.fillRect(W * 0.50, H * 0.52, 60, 60); // Congo
    bioCtx.fillRect(W * 0.68, H * 0.28, 180, 50); // Siberian Taiga

    // Thermal Heatmap (Modern 15.2°C)
    const tModGrad = tCtx.createLinearGradient(0, 0, 0, H);
    tModGrad.addColorStop(0, '#001233');
    tModGrad.addColorStop(0.2, '#0466c8');
    tModGrad.addColorStop(0.5, '#e09f3e');
    tModGrad.addColorStop(0.8, '#0466c8');
    tModGrad.addColorStop(1, '#001233');
    tCtx.fillStyle = tModGrad;
    tCtx.fillRect(0, 0, W, H);

    drawTectonicFaults(tcCtx, W, H, '#38bdf8');
  }

  // Convert canvases to Three.js CanvasTextures with crisp mipmapping & filtering
  const map = new THREE.CanvasTexture(canvas);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.ClampToEdgeWrapping;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.ClampToEdgeWrapping;

  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.ClampToEdgeWrapping;

  const emissiveMap = new THREE.CanvasTexture(emissiveCanvas);
  emissiveMap.wrapS = THREE.RepeatWrapping;
  emissiveMap.wrapT = THREE.ClampToEdgeWrapping;

  const thermalMap = new THREE.CanvasTexture(thermalCanvas);
  thermalMap.wrapS = THREE.RepeatWrapping;
  thermalMap.wrapT = THREE.ClampToEdgeWrapping;

  const tectonicMap = new THREE.CanvasTexture(tectonicCanvas);
  tectonicMap.wrapS = THREE.RepeatWrapping;
  tectonicMap.wrapT = THREE.ClampToEdgeWrapping;

  const biosphereMap = new THREE.CanvasTexture(bioCanvas);
  biosphereMap.wrapS = THREE.RepeatWrapping;
  biosphereMap.wrapT = THREE.ClampToEdgeWrapping;

  const result: EpochTextureSet = {
    map,
    bumpMap,
    roughnessMap,
    emissiveMap,
    thermalMap,
    tectonicMap,
    biosphereMap,
  };

  textureCache.set(key, result);
  return result;
}

// ── Realistic Dynamic Atmospheric Weather Cloud Texture ──
export function getCloudTexture(): THREE.CanvasTexture {
  if (cloudTextureCache) return cloudTextureCache;

  const W = 1024;
  const H = 512;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = 'rgba(0,0,0,0)';
  ctx.fillRect(0, 0, W, H);

  // Equatorial Intertropical Convergence Zone (ITCZ) cloud band
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * W;
    const y = H * 0.48 + (Math.random() - 0.5) * 55;
    const rx = 40 + Math.random() * 90;
    const ry = 15 + Math.random() * 25;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, (Math.random() - 0.5) * 0.4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Mid-latitude swirling storm spirals (cyclones)
  const cycloneCoords = [
    { x: W * 0.25, y: H * 0.28 },
    { x: W * 0.65, y: H * 0.25 },
    { x: W * 0.40, y: H * 0.72 },
    { x: W * 0.85, y: H * 0.68 },
  ];
  cycloneCoords.forEach((cyc) => {
    ctx.fillStyle = 'rgba(255,255,255,0.65)';
    for (let r = 5; r < 75; r += 8) {
      const angle = r * 0.15;
      const px = cyc.x + Math.cos(angle) * r;
      const py = cyc.y + Math.sin(angle) * (r * 0.65);
      ctx.beginPath();
      ctx.arc(px, py, 14, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  cloudTextureCache = texture;
  return texture;
}
