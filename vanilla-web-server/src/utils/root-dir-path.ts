import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function rootDirPath(...paths: string[]): string {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const parentDir = __dirname;
  const isDist = path.basename(parentDir) === 'dist';

  if (isDist) {
    return path.join(__dirname, '..', ...paths);
  }

  return path.resolve(parentDir, '..', '..', ...paths);
}
