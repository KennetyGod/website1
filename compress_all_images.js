const fs = require('fs');
const path = require('path');
const sharp = require('./node_modules/sharp');

const targetDir = path.join(__dirname, 'assets', 'images');

async function processDirectory() {
  console.log(`Starting image optimization in: ${targetDir}`);

  let totalFiles = 0;
  let processedFiles = 0;
  let skippedFiles = 0;
  let totalBytesBefore = 0;
  let totalBytesAfter = 0;

  const imageFiles = [];

  function collectFiles(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        collectFiles(fullPath);
      } else {
        const ext = path.extname(entry.name).toLowerCase();
        if (['.jpg', '.jpeg', '.png'].includes(ext)) {
          imageFiles.push(fullPath);
        }
      }
    }
  }

  collectFiles(targetDir);
  totalFiles = imageFiles.length;
  console.log(`Found ${totalFiles} images to check.`);

  // Process in batches
  const batchSize = 10;
  for (let i = 0; i < imageFiles.length; i += batchSize) {
    const batch = imageFiles.slice(i, i + batchSize);
    await Promise.all(batch.map(async (filePath) => {
      try {
        const stat = fs.statSync(filePath);
        totalBytesBefore += stat.size;

        // Skip small files (< 150 KB) that are already small enough
        if (stat.size < 150 * 1024) {
          skippedFiles++;
          totalBytesAfter += stat.size;
          return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const tmpPath = filePath + '.tmp';

        let image = sharp(filePath).resize({ width: 1200, withoutEnlargement: true });
        
        if (ext === '.png') {
          image = image.png({ quality: 80, compressionLevel: 8 });
        } else {
          image = image.jpeg({ quality: 80, progressive: true });
        }

        await image.toFile(tmpPath);
        
        const newStat = fs.statSync(tmpPath);
        if (newStat.size < stat.size) {
          fs.renameSync(tmpPath, filePath);
          totalBytesAfter += newStat.size;
          processedFiles++;
        } else {
          // If new size is not smaller, discard tmp
          fs.unlinkSync(tmpPath);
          totalBytesAfter += stat.size;
          skippedFiles++;
        }
      } catch (err) {
        console.error(`Error processing ${filePath}:`, err.message);
        if (fs.existsSync(filePath + '.tmp')) {
          try { fs.unlinkSync(filePath + '.tmp'); } catch(e){}
        }
        totalBytesAfter += fs.existsSync(filePath) ? fs.statSync(filePath).size : 0;
      }
    }));

    if ((i + batchSize) % 100 < batchSize || i + batchSize >= imageFiles.length) {
      const currentDone = Math.min(i + batchSize, imageFiles.length);
      const savedMB = ((totalBytesBefore - totalBytesAfter) / (1024 * 1024)).toFixed(1);
      console.log(`Progress: ${currentDone}/${totalFiles} (${((currentDone / totalFiles) * 100).toFixed(1)}%) | Optimized: ${processedFiles} | Saved: ${savedMB} MB`);
    }
  }

  const beforeMB = (totalBytesBefore / (1024 * 1024)).toFixed(1);
  const afterMB = (totalBytesAfter / (1024 * 1024)).toFixed(1);
  const savedMB = ((totalBytesBefore - totalBytesAfter) / (1024 * 1024)).toFixed(1);
  const percentSaved = ((totalBytesBefore - totalBytesAfter) / totalBytesBefore * 100).toFixed(1);

  console.log('\n=== OPTIMIZATION SUMMARY ===');
  console.log(`Total Images Evaluated: ${totalFiles}`);
  console.log(`Images Optimized: ${processedFiles}`);
  console.log(`Images Skipped (Already small): ${skippedFiles}`);
  console.log(`Size Before: ${beforeMB} MB`);
  console.log(`Size After: ${afterMB} MB`);
  console.log(`Total Space & Bandwidth Saved: ${savedMB} MB (${percentSaved}%)`);
}

processDirectory().catch(console.error);
