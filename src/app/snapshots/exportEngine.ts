import JSZip from 'jszip';
import { SnapshotItem, SNAPSHOT_ITEMS } from './snapshotRegistry';

export async function packageZipArchive(
  capturedBlobs: Map<string, { blob: Blob; filename: string; folder: string }>
): Promise<Blob> {
  const zip = new JSZip();

  // Create category directories
  const folders: Record<string, JSZip> = {
    '01-pages': zip.folder('01-pages')!,
    '02-home-sections': zip.folder('02-home-sections')!,
    '03-3d-models': zip.folder('03-3d-models')!,
    '04-ui-components': zip.folder('04-ui-components')!,
    '05-reactbits': zip.folder('05-reactbits')!,
    '06-modals': zip.folder('06-modals')!,
  };

  const manifest = {
    generatedAt: new Date().toISOString(),
    project: 'MUSEO // Museum of Deep Time',
    studio: 'Standalone Visual Audit & Batch Screenshot Exporter',
    totalItems: capturedBlobs.size,
    items: [] as Array<{ id: string; name: string; folder: string; filename: string; description: string }>,
  };

  // Populate files
  capturedBlobs.forEach(({ blob, filename, folder }, id) => {
    const targetFolder = folders[folder] || zip;
    targetFolder.file(filename, blob);

    const meta = SNAPSHOT_ITEMS.find((it) => it.id === id);
    if (meta) {
      manifest.items.push({
        id: meta.id,
        name: meta.name,
        folder: meta.folder,
        filename: meta.filename,
        description: meta.description,
      });
    }
  });

  // Attach manifest.json at root of zip
  zip.file('manifest.json', JSON.stringify(manifest, null, 2));

  // Generate downloadable zip blob
  const zipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  return zipBlob;
}

export function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function generateMasterContactSheet(
  capturedImages: Map<string, string> // id -> dataUrl
): Promise<Blob> {
  const items = SNAPSHOT_ITEMS.filter((it) => capturedImages.has(it.id));
  if (items.length === 0) {
    throw new Error('No captured images available to build contact sheet.');
  }

  const columns = 4;
  const cardWidth = 600;
  const cardHeight = 440;
  const padding = 36;
  const headerHeight = 180;

  const rows = Math.ceil(items.length / columns);
  const totalWidth = columns * cardWidth + (columns + 1) * padding;
  const totalHeight = headerHeight + rows * cardHeight + (rows + 1) * padding;

  const canvas = document.createElement('canvas');
  canvas.width = totalWidth;
  canvas.height = totalHeight;
  const ctx = canvas.getContext('2d')!;

  // Background
  ctx.fillStyle = '#0A0A0C';
  ctx.fillRect(0, 0, totalWidth, totalHeight);

  // Master Header
  ctx.fillStyle = '#FFD400';
  ctx.font = 'bold 36px "Courier New", monospace';
  ctx.fillText('MUSEO // MASTER VISUAL AUDIT & PROOF SHEET', padding, 70);

  ctx.fillStyle = '#A0A0AA';
  ctx.font = '16px "Courier New", monospace';
  ctx.fillText(
    `EXHAUSTIVE VISUAL INVENTORY • ${items.length} ASSETS CAPTURED • GENERATED ${new Date().toISOString()}`,
    padding,
    110
  );

  // Hairline dividing line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding, 140);
  ctx.lineTo(totalWidth - padding, 140);
  ctx.stroke();

  // Load and draw each image card
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const col = i % columns;
    const row = Math.floor(i / columns);

    const x = padding + col * (cardWidth + padding);
    const y = headerHeight + padding + row * (cardHeight + padding);

    // Card Frame
    ctx.fillStyle = '#141418';
    ctx.fillRect(x, y, cardWidth, cardHeight);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.strokeRect(x, y, cardWidth, cardHeight);

    // Draw Image
    const dataUrl = capturedImages.get(item.id);
    if (dataUrl) {
      const img = new Image();
      img.src = dataUrl;
      await new Promise((res) => {
        img.onload = () => res(true);
        img.onerror = () => res(false);
      });

      // Fit image in upper 340px
      const imgTargetH = 330;
      const imgTargetW = cardWidth - 20;
      ctx.drawImage(img, x + 10, y + 10, imgTargetW, imgTargetH);
    }

    // Typography footer for card
    ctx.fillStyle = '#FFD400';
    ctx.font = 'bold 13px "Courier New", monospace';
    ctx.fillText(`${item.folder.toUpperCase()} • ${item.filename}`, x + 14, y + 368);

    ctx.fillStyle = '#F5F3EF';
    ctx.font = 'bold 15px "Courier New", monospace';
    ctx.fillText(item.name, x + 14, y + 392);

    ctx.fillStyle = '#8E8E93';
    ctx.font = '11px "Courier New", monospace';
    const desc = item.description.length > 70 ? item.description.slice(0, 67) + '...' : item.description;
    ctx.fillText(desc, x + 14, y + 416);
  }

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob || new Blob());
    }, 'image/png');
  });
}
