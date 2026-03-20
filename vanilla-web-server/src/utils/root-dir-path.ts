import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const parentDir = __dirname;
const isDist = path.basename(parentDir) === 'dist';

let rootDirPath = '';

if (isDist) {
  rootDirPath = path.join(__dirname, '..');
} else {
  rootDirPath = path.resolve(parentDir, '..', '..');
}

export { rootDirPath };
