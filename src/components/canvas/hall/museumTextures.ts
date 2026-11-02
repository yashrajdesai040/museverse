import * as THREE from 'three';

// ─── Museum Texture Cache ───
const textureCache = new Map<string, any>();

/**
 * Creates high-detail honed gallery marble floor textures.
 * Includes diffuse map, bump map, and roughness map with realistic tile seams and veining.
 */
export function getMuseumMarbleFloorTextures(isNight: boolean, repeatX = 26, repeatY = 58) {
  const cacheKey = `marble_floor_${isNight ? 'night' : 'day'}_${repeatX}_${repeatY}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey);
  }

  if (typeof window === 'undefined') {
    return { map: null, bumpMap: null, roughnessMap: null };
  }

  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bumpCtx = bumpCanvas.getContext('2d')!;

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = size;
  roughCanvas.height = size;
  const roughCtx = roughCanvas.getContext('2d')!;

  // 1. Draw 4 large floor stone slabs (2x2 grid)
  const tileSize = size / 2;
  const tileColors = isNight
    ? ['#0a0c10', '#101217', '#0d0f14', '#13161c']
    : ['#1e1c19', '#25221e', '#211f1b', '#2b2723'];

  for (let ty = 0; ty < 2; ty++) {
    for (let tx = 0; tx < 2; tx++) {
      const idx = ty * 2 + tx;
      const x = tx * tileSize;
      const y = ty * tileSize;

      // Base tile color
      ctx.fillStyle = tileColors[idx];
      ctx.fillRect(x, y, tileSize, tileSize);

      bumpCtx.fillStyle = '#808080';
      bumpCtx.fillRect(x, y, tileSize, tileSize);

      roughCtx.fillStyle = isNight ? '#222222' : '#303030';
      roughCtx.fillRect(x, y, tileSize, tileSize);

      // Fine organic marble veins
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, tileSize, tileSize);
      ctx.clip();

      const veinCount = 6 + Math.floor(Math.random() * 3);
      for (let v = 0; v < veinCount; v++) {
        let vx = x + Math.random() * tileSize;
        let vy = y + Math.random() * tileSize;
        const angle = -0.6 + (Math.random() - 0.5) * 0.4;
        const length = tileSize * (0.8 + Math.random() * 0.7);

        ctx.beginPath();
        ctx.moveTo(vx, vy);
        bumpCtx.beginPath();
        bumpCtx.moveTo(vx, vy);

        const steps = 16;
        for (let s = 0; s < steps; s++) {
          vx += Math.cos(angle) * (length / steps) + Math.sin(s * 1.5) * 8;
          vy += Math.sin(angle) * (length / steps) + Math.cos(s * 1.8) * 8;
          ctx.lineTo(vx, vy);
          bumpCtx.lineTo(vx, vy);
        }

        ctx.strokeStyle = isNight ? 'rgba(210, 185, 130, 0.14)' : 'rgba(235, 215, 175, 0.18)';
        ctx.lineWidth = 1.2 + Math.random() * 2.2;
        ctx.stroke();

        bumpCtx.strokeStyle = 'rgba(160, 160, 160, 0.45)';
        bumpCtx.lineWidth = ctx.lineWidth;
        bumpCtx.stroke();
      }

      // Micro stone calcite stippling
      for (let d = 0; d < 350; d++) {
        const dx = x + Math.random() * tileSize;
        const dy = y + Math.random() * tileSize;
        const val = Math.random() > 0.5 ? 255 : 0;
        ctx.fillStyle = val === 255 ? 'rgba(255, 240, 220, 0.05)' : 'rgba(0, 0, 0, 0.09)';
        ctx.fillRect(dx, dy, 1.5, 1.5);
      }

      ctx.restore();
    }
  }

  // 2. Grout mortar lines between slabs
  const groutColor = isNight ? '#040507' : '#12100e';
  ctx.strokeStyle = groutColor;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, tileSize);
  ctx.lineTo(size, tileSize);
  ctx.moveTo(tileSize, 0);
  ctx.lineTo(tileSize, size);
  ctx.stroke();

  bumpCtx.strokeStyle = '#181818';
  bumpCtx.lineWidth = 3;
  bumpCtx.beginPath();
  bumpCtx.moveTo(0, tileSize);
  bumpCtx.lineTo(size, tileSize);
  bumpCtx.moveTo(tileSize, 0);
  bumpCtx.lineTo(tileSize, size);
  bumpCtx.stroke();

  roughCtx.strokeStyle = '#d8d8d8';
  roughCtx.lineWidth = 3;
  roughCtx.beginPath();
  roughCtx.moveTo(0, tileSize);
  roughCtx.lineTo(size, tileSize);
  roughCtx.moveTo(tileSize, 0);
  roughCtx.lineTo(tileSize, size);
  roughCtx.stroke();

  // Create Three.js textures
  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(repeatX, repeatY);

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(repeatX, repeatY);

  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.repeat.set(repeatX, repeatY);

  const result = { map, bumpMap, roughnessMap };
  textureCache.set(cacheKey, result);
  return result;
}

/**
 * Creates ashlar Roman travertine limestone wall textures with masonry joints.
 */
export function getMuseumWallTextures(isNight: boolean, repeatX = 24, repeatY = 6) {
  const cacheKey = `travertine_wall_${isNight ? 'night' : 'day'}_${repeatX}_${repeatY}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey);
  }

  if (typeof window === 'undefined') {
    return { map: null, bumpMap: null };
  }

  const width = 512;
  const height = 256;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = width;
  bumpCanvas.height = height;
  const bumpCtx = bumpCanvas.getContext('2d')!;

  // Base stone tone
  ctx.fillStyle = isNight ? '#13151b' : '#d2cbbf';
  ctx.fillRect(0, 0, width, height);

  bumpCtx.fillStyle = '#808080';
  bumpCtx.fillRect(0, 0, width, height);

  // Horizontal ashlar block courses
  const courseHeight = height / 4;
  const blockWidth = width / 2;

  for (let c = 0; c < 4; c++) {
    const y = c * courseHeight;
    const isShifted = c % 2 === 1;

    for (let b = -1; b < 3; b++) {
      const x = b * blockWidth + (isShifted ? blockWidth / 2 : 0);

      // Subtle course shade variation
      const shade = (Math.random() - 0.5) * 16;
      ctx.fillStyle = isNight
        ? `rgb(${19 + shade}, ${21 + shade}, ${27 + shade})`
        : `rgb(${210 + shade}, ${203 + shade}, ${191 + shade})`;
      ctx.fillRect(x + 2, y + 2, blockWidth - 4, courseHeight - 4);

      // Travertine horizontal pore bands
      for (let p = 0; p < 8; p++) {
        const py = y + Math.random() * courseHeight;
        const px = x + Math.random() * (blockWidth - 30);
        const pw = 15 + Math.random() * 35;
        ctx.fillStyle = isNight ? 'rgba(6, 8, 12, 0.4)' : 'rgba(160, 150, 138, 0.35)';
        ctx.fillRect(px, py, pw, 2);

        bumpCtx.fillStyle = '#505050';
        bumpCtx.fillRect(px, py, pw, 2);
      }
    }

    // Horizontal mortar groove
    ctx.strokeStyle = isNight ? '#07080b' : '#948c80';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();

    bumpCtx.strokeStyle = '#303030';
    bumpCtx.lineWidth = 3;
    bumpCtx.beginPath();
    bumpCtx.moveTo(0, y);
    bumpCtx.lineTo(width, y);
    bumpCtx.stroke();
  }

  // Vertical mortar joints
  for (let c = 0; c < 4; c++) {
    const y = c * courseHeight;
    const isShifted = c % 2 === 1;
    const x = isShifted ? blockWidth / 2 : blockWidth;

    ctx.strokeStyle = isNight ? '#07080b' : '#948c80';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + courseHeight);
    ctx.stroke();

    bumpCtx.strokeStyle = '#303030';
    bumpCtx.lineWidth = 3;
    bumpCtx.beginPath();
    bumpCtx.moveTo(x, y);
    bumpCtx.lineTo(x, y + courseHeight);
    bumpCtx.stroke();
  }

  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(repeatX, repeatY);

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(repeatX, repeatY);

  const result = { map, bumpMap };
  textureCache.set(cacheKey, result);
  return result;
}

/**
 * Creates classical diamond & geometric marble runner for the Grand Center Nave Aisle.
 */
export function getNaveAisleMosaicTexture(isNight: boolean) {
  const cacheKey = `nave_aisle_${isNight ? 'night' : 'day'}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey);
  }

  if (typeof window === 'undefined') return null;

  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Background dark Belgian marble
  ctx.fillStyle = isNight ? '#0a0b0e' : '#181715';
  ctx.fillRect(0, 0, size, size);

  // Outer brass borders
  ctx.fillStyle = '#d4af37';
  ctx.fillRect(16, 0, 8, size);
  ctx.fillRect(size - 24, 0, 8, size);

  // Greek key / geometric diamond lattice in the center
  const grid = 64;
  for (let y = 0; y < size; y += grid) {
    for (let x = 32; x < size - 32; x += grid) {
      // Rotated square / diamond
      ctx.save();
      ctx.translate(x + grid / 2, y + grid / 2);
      ctx.rotate(Math.PI / 4);

      // White Carrara diamond center
      ctx.fillStyle = isNight ? '#2a2b30' : '#e8e4dc';
      ctx.fillRect(-grid * 0.32, -grid * 0.32, grid * 0.64, grid * 0.64);

      // Gold inlay square border
      ctx.strokeStyle = '#caa04d';
      ctx.lineWidth = 3;
      ctx.strokeRect(-grid * 0.32, -grid * 0.32, grid * 0.64, grid * 0.64);

      // Inner Nero Marquina core
      ctx.fillStyle = isNight ? '#0f1115' : '#221f1a';
      ctx.fillRect(-grid * 0.16, -grid * 0.16, grid * 0.32, grid * 0.32);

      ctx.restore();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 24);

  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Creates white Statuary Carrara marble with rich organic veining for columns & plinths.
 */
export function getCarraraMarbleTexture() {
  const cacheKey = 'carrara_marble';
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey);
  }

  if (typeof window === 'undefined') return null;

  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#faf8f4';
  ctx.fillRect(0, 0, size, size);

  // Soft grey-smoke clouds
  for (let i = 0; i < 6; i++) {
    const grad = ctx.createRadialGradient(
      Math.random() * size,
      Math.random() * size,
      10,
      Math.random() * size,
      Math.random() * size,
      size * 0.6
    );
    grad.addColorStop(0, 'rgba(220, 225, 230, 0.45)');
    grad.addColorStop(1, 'rgba(250, 248, 244, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  }

  // Branching dark mineral veins
  for (let v = 0; v < 7; v++) {
    let x = Math.random() * size;
    let y = Math.random() * size;
    const angle = 0.8 + (Math.random() - 0.5) * 0.5;
    const length = size * (0.6 + Math.random() * 0.6);

    ctx.beginPath();
    ctx.moveTo(x, y);
    const steps = 18;
    for (let s = 0; s < steps; s++) {
      x += Math.cos(angle) * (length / steps) + Math.sin(s * 1.4) * 6;
      y += Math.sin(angle) * (length / steps) + Math.cos(s * 1.6) * 6;
      ctx.lineTo(x, y);
    }
    ctx.strokeStyle = 'rgba(130, 140, 150, 0.28)';
    ctx.lineWidth = 1.2 + Math.random() * 2;
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 6);

  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Creates classical coffered ceiling squares (lacunaria) with gold rosette medallions.
 */
export function getCofferedCeilingTexture(isNight: boolean) {
  const cacheKey = `coffered_ceiling_${isNight ? 'night' : 'day'}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey);
  }

  if (typeof window === 'undefined') return null;

  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Base stone tone
  ctx.fillStyle = isNight ? '#12141a' : '#d8d3c7';
  ctx.fillRect(0, 0, size, size);

  // Outer coffer frame
  ctx.fillStyle = isNight ? '#0b0c10' : '#b8b2a3';
  ctx.fillRect(16, 16, size - 32, size - 32);

  // Stepped recessed bevel
  ctx.fillStyle = isNight ? '#07080a' : '#9e9788';
  ctx.fillRect(36, 36, size - 72, size - 72);

  // Inner deep square
  ctx.fillStyle = isNight ? '#161922' : '#ece7dc';
  ctx.fillRect(52, 52, size - 104, size - 104);

  // Gold central rosette medallion
  const cx = size / 2;
  const cy = size / 2;
  const petals = 8;
  const radius = 64;

  ctx.fillStyle = isNight ? '#caa04d' : '#dfb552';
  for (let p = 0; p < petals; p++) {
    const angle = (p / petals) * Math.PI * 2;
    const px = cx + Math.cos(angle) * (radius * 0.55);
    const py = cy + Math.sin(angle) * (radius * 0.55);

    ctx.beginPath();
    ctx.arc(px, py, 22, 0, Math.PI * 2);
    ctx.fill();
  }

  // Central golden boss
  ctx.beginPath();
  ctx.arc(cx, cy, 26, 0, Math.PI * 2);
  ctx.fillStyle = '#ffd700';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, 12, 0, Math.PI * 2);
  ctx.fillStyle = '#6b4f17';
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 18);

  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Creates rich American walnut wood grain texture for gallery seating.
 */
export function getWalnutWoodTexture() {
  const cacheKey = 'walnut_wood';
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey);
  }

  if (typeof window === 'undefined') return null;

  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#321f14';
  ctx.fillRect(0, 0, size, size);

  // Grain lines
  for (let y = 0; y < size; y += 3) {
    const darkness = Math.sin(y * 0.08) * 0.5 + 0.5;
    ctx.fillStyle = `rgba(32, 18, 10, ${0.25 + darkness * 0.35})`;
    ctx.fillRect(0, y, size, 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 2);

  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Creates a crisp, high-resolution museum reader stand plaque texture for an exhibit.
 * Includes museum seal, catalog number, short title, era, dating, origin, and inspection prompt.
 */
export function getReaderPlaqueTexture(config: {
  catalogNum: string;
  shortTitle: string;
  era: string;
  dating: string;
  location: string;
  accentColor: string;
}) {
  const cacheKey = `reader_plaque_${config.catalogNum}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey);
  }

  if (typeof window === 'undefined') return null;

  const width = 1024;
  const height = 576;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // 1. Deep Museum Slate Plaque Backdrop
  ctx.fillStyle = '#0f1115';
  ctx.fillRect(0, 0, width, height);

  // Subtle slate texture gradient
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, 'rgba(25, 28, 35, 0.9)');
  grad.addColorStop(1, 'rgba(10, 12, 16, 0.95)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // 2. Brass Bevel Rim
  ctx.strokeStyle = '#caa04d';
  ctx.lineWidth = 10;
  ctx.strokeRect(16, 16, width - 32, height - 32);

  ctx.strokeStyle = 'rgba(255, 215, 0, 0.35)';
  ctx.lineWidth = 2;
  ctx.strokeRect(24, 24, width - 48, height - 48);

  // Corner Rosette Accents
  const cornerRadius = 14;
  const corners = [
    [32, 32],
    [width - 32, 32],
    [32, height - 32],
    [width - 32, height - 32],
  ];
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, cornerRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#ffd700';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#1c1e22';
    ctx.fill();
  });

  // 3. Header: Museum Archive Registry
  ctx.font = 'bold 22px "Courier New", monospace';
  ctx.fillStyle = '#caa04d';
  ctx.fillText('✦ MUSEO HISTORICA // ACCREDITED SPECIMEN ARCHIVE', 64, 80);

  // Catalog Badge
  ctx.fillStyle = '#ffd700';
  ctx.fillRect(64, 102, 220, 36);
  ctx.font = '900 20px "Courier New", monospace';
  ctx.fillStyle = '#000000';
  ctx.fillText(config.catalogNum, 76, 127);

  // Accent Line
  ctx.fillStyle = config.accentColor || '#ffd700';
  ctx.fillRect(300, 118, width - 364, 4);

  // 4. Specimen Title
  ctx.font = '900 52px "Outfit", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(config.shortTitle.toUpperCase(), 64, 206);

  // 5. Era & Dating
  ctx.font = 'bold 28px "Outfit", sans-serif';
  ctx.fillStyle = '#ffd700';
  ctx.fillText(`${config.era} · ${config.dating}`, 64, 260);

  // 6. Provenance & Geological Location
  ctx.font = '24px "Outfit", sans-serif';
  ctx.fillStyle = '#a6b0c2';
  ctx.fillText(`LOCUS: ${config.location.toUpperCase()}`, 64, 310);

  // Divider Line
  ctx.strokeStyle = 'rgba(202, 160, 77, 0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(64, 350);
  ctx.lineTo(width - 64, 350);
  ctx.stroke();

  // Curatorial Authentication Notes
  ctx.font = '20px "Outfit", sans-serif';
  ctx.fillStyle = '#8e98a8';
  ctx.fillText('STATUS: VERIFIED SCIENTIFIC SPECIMEN · 3D VOLUMETRIC CAPTURE', 64, 396);
  ctx.fillText('MUSEO ARCHIVE CODE: MSV-GEO-SPECIMEN-PRIME', 64, 432);

  // 7. Interactive Call-To-Action Pill
  ctx.fillStyle = 'rgba(255, 215, 0, 0.15)';
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 3;
  ctx.beginPath();
  if (typeof (ctx as any).roundRect === 'function') {
    (ctx as any).roundRect(64, 474, width - 128, 54, [10]);
  } else {
    ctx.rect(64, 474, width - 128, 54);
  }
  ctx.fill();
  ctx.stroke();

  ctx.font = 'bold 22px "Courier New", monospace';
  ctx.fillStyle = '#ffd700';
  ctx.textAlign = 'center';
  ctx.fillText('▶ CLICK PLACARD OR PRESS [E] TO INSPECT IN 3D ◀', width / 2, 508);
  ctx.textAlign = 'left';

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.anisotropy = 8;

  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Creates a crisp floating 3D billboard tag texture positioned above the exhibit pedestal.
 */
export function getBillboardLabelTexture(config: {
  catalogNum: string;
  shortTitle: string;
  era: string;
  accentColor: string;
}) {
  const cacheKey = `billboard_tag_${config.catalogNum}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey);
  }

  if (typeof window === 'undefined') return null;

  const width = 512;
  const height = 128;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Background rounded pill
  ctx.fillStyle = 'rgba(10, 12, 16, 0.92)';
  ctx.strokeStyle = config.accentColor || '#ffd700';
  ctx.lineWidth = 4;
  ctx.beginPath();
  if (typeof (ctx as any).roundRect === 'function') {
    (ctx as any).roundRect(6, 6, width - 12, height - 12, [24]);
  } else {
    ctx.rect(6, 6, width - 12, height - 12);
  }
  ctx.fill();
  ctx.stroke();

  // Left catalog badge
  ctx.fillStyle = '#ffd700';
  ctx.beginPath();
  if (typeof (ctx as any).roundRect === 'function') {
    (ctx as any).roundRect(16, 18, 140, 32, [8]);
  } else {
    ctx.rect(16, 18, 140, 32);
  }
  ctx.fill();

  ctx.font = 'bold 16px "Courier New", monospace';
  ctx.fillStyle = '#000000';
  ctx.fillText(config.catalogNum, 26, 40);

  // Era tag
  ctx.font = 'bold 14px "Outfit", sans-serif';
  ctx.fillStyle = '#a0aec0';
  ctx.fillText(config.era, 172, 40);

  // Main Exhibit Title
  ctx.font = '900 28px "Outfit", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(config.shortTitle.toUpperCase(), 20, 88);

  // Right chevron/pulse indicator
  ctx.font = '900 24px monospace';
  ctx.fillStyle = config.accentColor || '#ffd700';
  ctx.fillText('✦', width - 44, 72);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.anisotropy = 8;

  textureCache.set(cacheKey, texture);
  return texture;
}
