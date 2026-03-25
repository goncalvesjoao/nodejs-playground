import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export type EnvironmentModeType = 'DEV' | 'PROD' | 'TEST';

export class Environment {
  isDist: boolean;
  rootDirPath: string;
  protected loaded: boolean = false;

  constructor() {
    this.isDist = path.basename(__dirname) === 'dist';

    if (this.isDist) {
      this.rootDirPath = path.resolve(__dirname, '..');
    } else {
      this.rootDirPath = path.resolve(__dirname, '..', '..');
    }
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

  get mode(): EnvironmentModeType {
    const mode =
      this.get('APP_ENV') ||
      this.get('NODE_ENV') ||
      (this.isDist ? 'production' : 'development');

    switch (mode.toLowerCase()) {
      case 'production':
      case 'prod':
        return 'PROD';
      case 'test':
        return 'TEST';
      default:
        return 'DEV';
    }
  }
}
