import fs from 'node:fs/promises';
import path from 'node:path';
import { env } from '@config/env';

type ViteManifest = Record<string, ViteManifestEntry>;

type ViteManifestEntry = {
  file: string;
  src?: string;
  isEntry?: boolean;
  css?: string[];
  imports?: string[];
};

const DEFAULT_VITE_DEV_SERVER_ORIGIN = 'http://localhost:5173';
const DEFAULT_VITE_ENTRY = 'assets/main.ts';
const MANIFEST_FILE_NAME = 'manifest.json';

let manifestCache: ViteManifest | undefined;

export function buildDevelopmentViteAssetTags(
  entryPath: string,
  devServerOrigin = DEFAULT_VITE_DEV_SERVER_ORIGIN,
): string {
  return [
    `<script type="module" src="${devServerOrigin}/@vite/client"></script>`,
    `<script type="module" src="${devServerOrigin}/${entryPath}"></script>`,
  ].join('\n');
}

export function buildProductionViteAssetTags(
  manifest: ViteManifest,
  entryPath: string,
): string {
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

export async function renderViteAssetTags(
  entryPath = DEFAULT_VITE_ENTRY,
): Promise<string> {
  await env.load();

  if (env.mode !== 'production') {
    return buildDevelopmentViteAssetTags(entryPath, env.viteDevServerOrigin);
  }

  const manifest = await loadManifest();

  return buildProductionViteAssetTags(manifest, entryPath);
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

async function loadManifest(): Promise<ViteManifest> {
  if (manifestCache) {
    return manifestCache;
  }

  const manifestPath = path.join(env.publicDirPath, MANIFEST_FILE_NAME);
  const manifestContent = await fs.readFile(manifestPath, 'utf-8');

  manifestCache = JSON.parse(manifestContent) as ViteManifest;

  return manifestCache;
}
