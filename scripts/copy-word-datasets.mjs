import fs from "node:fs";
import path from "node:path";

function copyIfExists(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return false;
  fs.mkdirSync(destDir, { recursive: true });
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const e of entries) {
    if (e.isFile() && e.name.endsWith(".txt")) {
      fs.copyFileSync(path.join(srcDir, e.name), path.join(destDir, e.name));
    }
  }
  return true;
}

const pkgRoot = process.cwd();
const src = path.join(pkgRoot, "node_modules", "word-datasets", "data");
const dest = path.join(pkgRoot, "public", "word-datasets");

const ok = copyIfExists(src, dest);
if (ok) {
  console.log(`[copy-word-datasets] Copied datasets from ${src} -> ${dest}`);
} else {
  console.warn(
    "[copy-word-datasets] Source not found. Is word-datasets installed?"
  );
}
