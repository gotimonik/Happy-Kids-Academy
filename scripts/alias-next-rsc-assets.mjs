import { copyFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

const outputDir = path.join(process.cwd(), "out");

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

async function exists(file) {
  try {
    await stat(file);
    return true;
  } catch {
    return false;
  }
}

const sourceFiles = (await walk(outputDir)).filter((file) =>
  path.basename(file).endsWith(".__PAGE__.txt"),
);

let aliasCount = 0;

for (const sourceFile of sourceFiles) {
  const aliasFile = path.join(path.dirname(sourceFile), "__next.**PAGE**.txt");

  if (!(await exists(aliasFile))) {
    await copyFile(sourceFile, aliasFile);
    aliasCount += 1;
  }
}

console.log(`Aliased ${aliasCount} Next RSC page asset${aliasCount === 1 ? "" : "s"}.`);
