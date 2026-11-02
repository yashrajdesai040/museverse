import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const MODELS_DIR = path.resolve('public/models');
const files = fs.readdirSync(MODELS_DIR)
  .filter(f => f.endsWith('.glb') && !f.includes('.opt.') && !f.includes('.test.'));

console.log(`Found ${files.length} .glb files in ${MODELS_DIR}`);

// Sort by size ascending or descending?
// Let's sort by size descending so we process largest first, but let's see each step clearly.
const fileStats = files.map(file => {
  const filePath = path.join(MODELS_DIR, file);
  return {
    file,
    filePath,
    size: fs.statSync(filePath).size,
  };
}).sort((a, b) => b.size - a.size);

const results = [];
let totalOriginal = 0;
let totalCompressed = 0;

for (let i = 0; i < fileStats.length; i++) {
  const { file, filePath, size: origSize } = fileStats[i];
  totalOriginal += origSize;

  // If scene.glb is already 1.3MB, we already compressed it
  if (file === 'scene.glb' && origSize < 2 * 1024 * 1024) {
    console.log(`[${i + 1}/${fileStats.length}] Skipping ${file} (already compressed at ${(origSize / 1024 / 1024).toFixed(2)} MB)`);
    results.push({
      file,
      origSize,
      newSize: origSize,
      saved: 0,
      reductionPct: '0.0%',
      status: 'Skipped (already compressed)',
    });
    totalCompressed += origSize;
    continue;
  }

  const tempPath = path.join(MODELS_DIR, `${path.parse(file).name}.opt.glb`);
  console.log(`\n--------------------------------------------------`);
  console.log(`[${i + 1}/${fileStats.length}] Optimizing ${file} (${(origSize / 1024 / 1024).toFixed(2)} MB)...`);

  const startTime = Date.now();
  try {
    // Execute gltf-transform optimize with Draco
    const cmd = `npx --no-install @gltf-transform/cli optimize "${filePath}" "${tempPath}" --compress draco`;
    execSync(cmd, {
      stdio: 'pipe',
      env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=8192' },
      maxBuffer: 50 * 1024 * 1024,
    });

    if (fs.existsSync(tempPath)) {
      const newSize = fs.statSync(tempPath).size;
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);

      if (newSize < origSize) {
        // Replace original with optimized file
        fs.unlinkSync(filePath);
        fs.renameSync(tempPath, filePath);

        const pct = (((origSize - newSize) / origSize) * 100).toFixed(1);
        console.log(`✓ ${file}: ${(origSize / 1024 / 1024).toFixed(2)} MB -> ${(newSize / 1024 / 1024).toFixed(2)} MB (-${pct}%) in ${duration}s`);

        results.push({
          file,
          origSize,
          newSize,
          saved: origSize - newSize,
          reductionPct: `${pct}%`,
          status: 'Compressed',
        });
        totalCompressed += newSize;
      } else {
        fs.unlinkSync(tempPath);
        console.log(`⚠ ${file} optimization produced larger file (${(newSize / 1024 / 1024).toFixed(2)} MB vs ${(origSize / 1024 / 1024).toFixed(2)} MB), keeping original.`);
        results.push({
          file,
          origSize,
          newSize: origSize,
          saved: 0,
          reductionPct: '0.0%',
          status: 'Kept original (already optimal)',
        });
        totalCompressed += origSize;
      }
    } else {
      console.error(`✗ Temp file was not created for ${file}`);
      results.push({ file, origSize, newSize: origSize, saved: 0, reductionPct: '0.0%', status: 'Failed' });
      totalCompressed += origSize;
    }
  } catch (err) {
    console.error(`✗ Error optimizing ${file}:`, err.message || err);
    if (fs.existsSync(tempPath)) {
      try { fs.unlinkSync(tempPath); } catch {}
    }
    results.push({ file, origSize, newSize: origSize, saved: 0, reductionPct: '0.0%', status: 'Error' });
    totalCompressed += origSize;
  }
}

console.log('\n==================================================');
console.log('COMPRESSION SUMMARY');
console.log('==================================================');
console.log(`Total Initial Size: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
console.log(`Total Final Size:   ${(totalCompressed / 1024 / 1024).toFixed(2)} MB`);
const totalSaved = totalOriginal - totalCompressed;
console.log(`Total Space Saved:  ${(totalSaved / 1024 / 1024).toFixed(2)} MB (-${((totalSaved / totalOriginal) * 100).toFixed(1)}%)`);

// Write report to JSON
fs.writeFileSync('scripts/compression-report.json', JSON.stringify({
  totalOriginalMB: (totalOriginal / 1024 / 1024).toFixed(2),
  totalFinalMB: (totalCompressed / 1024 / 1024).toFixed(2),
  totalSavedMB: (totalSaved / 1024 / 1024).toFixed(2),
  savingsPercent: `${((totalSaved / totalOriginal) * 100).toFixed(1)}%`,
  results,
}, null, 2));
