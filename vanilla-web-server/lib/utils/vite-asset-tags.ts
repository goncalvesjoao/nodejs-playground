import fs from 'node:fs';

type ViteManifest = Record<string, ViteManifestEntry>;

type ViteManifestEntry = {
  file: string;
  src?: string;
  isEntry?: boolean;
  css?: string[];
  imports?: string[];
};

let manifestCache: ViteManifest | undefined;

export function viteAssetTags(input: {
  productionMode: boolean;
  entryPath: string;
  devServerOrigin: string;
  manifestPath: string;
}): string {
  const { productionMode, entryPath, devServerOrigin, manifestPath } = input;

  if (!productionMode) {
    return developmentViteAssetTags(entryPath, devServerOrigin);
  }

  return productionViteAssetTags(entryPath, manifestPath);
}

function developmentViteAssetTags(
  entryPath: string,
  devServerOrigin: string,
): string {
  return [
    `<script type="module" src="${devServerOrigin}/@vite/client"></script>`,
    `<script type="module" src="${devServerOrigin}/${entryPath}"></script>`,
  ].join('\n');
}

function productionViteAssetTags(
  entryPath: string,
  manifestPath: string,
): string {
  const manifest = loadManifest(manifestPath);
  const entry = resolveManifestEntry(manifest, entryPath);

  if (!entry) {
    throw new Error(`Vite manifest entry not found for "${entryPath}".`);
  }

  const stylesheets = new Set<string>();
  const modulePreloads = new Set<string>();
  const visited = new Set<string>();

  collectManifestAssets(manifest, entry, stylesheets, modulePreloads, visited);

  return [
    ...Array.from(
      stylesheets,
      (filePath) => `<link rel="stylesheet" href="/${filePath}">`,
    ),
    ...Array.from(
      modulePreloads,
      (filePath) => `<link rel="modulepreload" href="/${filePath}">`,
    ),
    `<script type="module" src="/${entry.file}"></script>`,
  ].join('\n');
}

function collectManifestAssets(
  manifest: ViteManifest,
  entry: ViteManifestEntry,
  stylesheets: Set<string>,
  modulePreloads: Set<string>,
  visited: Set<string>,
) {
  if (visited.has(entry.file)) {
    return;
  }

  visited.add(entry.file);

  for (const stylesheet of entry.css ?? []) {
    stylesheets.add(stylesheet);
  }

  for (const importKey of entry.imports ?? []) {
    const importedEntry = manifest[importKey];

    if (!importedEntry) {
      continue;
    }

    modulePreloads.add(importedEntry.file);
    collectManifestAssets(
      manifest,
      importedEntry,
      stylesheets,
      modulePreloads,
      visited,
    );
  }
}

function resolveManifestEntry(
  manifest: ViteManifest,
  entryPath: string,
): ViteManifestEntry | undefined {
  return Object.entries(manifest).find(([key, value]) => {
    return key === entryPath || (value.isEntry && value.src === entryPath);
  })?.[1];
}

function loadManifest(manifestPath: string): ViteManifest {
  if (manifestCache) {
    return manifestCache;
  }

  const manifestContent = fs.readFileSync(manifestPath, 'utf-8');

  manifestCache = JSON.parse(manifestContent) as ViteManifest;

  return manifestCache;
}
