import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'dotenv';
import {
  DEFAULT_SERVER_PORT,
  DEFAULT_VITE_DEV_SERVER_ORIGIN,
  PUBLIC_DIR_NAME,
  SRC_DIR_NAME,
  VIEWS_DIR_NAME,
} from '@/config/constants';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Environment {
  isDist: boolean;
  publicDirPath: string;
  rootDirPath: string;
  viewsDirPath: string;
  protected loaded: boolean = false;

  constructor() {
    this.isDist = path.basename(__dirname) === 'dist';

    if (this.isDist) {
      this.rootDirPath = path.join(__dirname, '..');
    } else {
      this.rootDirPath = path.resolve(__dirname, '..', '..');
    }

    this.publicDirPath = path.join(this.rootDirPath, PUBLIC_DIR_NAME);
    this.viewsDirPath = path.join(
      this.rootDirPath,
      SRC_DIR_NAME,
      VIEWS_DIR_NAME,
    );
  }

  async load() {
    if (this.loaded) return;

    this.loaded = true;

    const initialEnvKeys = new Set(Object.keys(process.env));
    const envFilePaths = [
      '.env',
      '.env.local',
      `.env.${this.mode}`,
      `.env.${this.mode}.local`,
    ].map((fileName) => path.join(this.rootDirPath, fileName));

    for (const envFilePath of envFilePaths) {
      const fileContent = await fs
        .readFile(envFilePath, 'utf-8')
        .catch(() => null);

      if (!fileContent) {
        continue;
      }

      const parsedEnv = parse(fileContent);

      for (const [key, value] of Object.entries(parsedEnv)) {
        if (initialEnvKeys.has(key)) {
          continue;
        }

        process.env[key] = value;
      }
    }
  }

  get(key: string, defaultValue?: string): string {
    return process.env[key] || defaultValue || '';
  }

  get mode(): string {
    return (
      this.get('APP_ENV') ||
      this.get('NODE_ENV') ||
      (this.isDist ? 'production' : 'development')
    );
  }

  get serverPort(): number {
    return Number(this.get('SERVER_PORT', DEFAULT_SERVER_PORT));
  }

  get viteDevServerOrigin(): string {
    return this.get('VITE_DEV_SERVER_ORIGIN', DEFAULT_VITE_DEV_SERVER_ORIGIN);
  }
}

export const env = new Environment();
