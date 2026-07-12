import fs from 'fs/promises';
import path from 'path';

const cwd = process.cwd();
const achievementsDir = path.join(cwd, 'public', 'achievements');
const outFile = path.join(cwd, 'public', 'certificates.json');

function normalizeTitle(filename) {
  // strip extension
  let name = filename.replace(/\.[^/.]+$/, '');
  // replace - and _ with spaces
  name = name.replace(/[\-_]+/g, ' ');
  // remove common suffixes like 'by <org>'
  name = name.replace(/\bby\b.*$/i, '');
  // remove stray multiple spaces
  name = name.replace(/\s{2,}/g, ' ').trim();
  if (!name) return filename;
  // Title case
  const words = name.split(/\s+/).map(w => {
    return w.length > 0 ? (w[0].toUpperCase() + w.slice(1).toLowerCase()) : w;
  });
  return words.join(' ');
}

async function generate() {
  try {
    const st = await fs.stat(achievementsDir).catch(() => null);
    if (!st || !st.isDirectory()) {
      console.warn('[generate-certificates] No achievements directory found at', achievementsDir);
      await fs.writeFile(outFile, JSON.stringify({ files: [] }, null, 2), 'utf8');
      console.log('[generate-certificates] Wrote empty manifest to', outFile);
      return;
    }

    const entries = await fs.readdir(achievementsDir);
    const files = entries.filter(f => !f.startsWith('.') && !f.toLowerCase().endsWith('.ds_store'));

    // Create manifest entries as simple filenames (consumer can fetch file and create title locally)
    const manifestFiles = files.slice().sort((a,b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

    const manifest = {
      generatedAt: new Date().toISOString(),
      files: manifestFiles,
      // optional human-friendly titles (generated automatically)
      titles: manifestFiles.reduce((acc, fn) => {
        acc[fn] = normalizeTitle(fn);
        return acc;
      }, {})
    };

    await fs.writeFile(outFile, JSON.stringify(manifest, null, 2), 'utf8');
    console.log('[generate-certificates] Generated manifest with', manifestFiles.length, 'files ->', outFile);
  } catch (err) {
    console.error('[generate-certificates] Error:', err);
    process.exitCode = 1;
  }
}

generate();
