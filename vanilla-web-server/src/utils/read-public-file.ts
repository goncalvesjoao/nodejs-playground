import fs from 'fs/promises';
import path from 'path';
import { PUBLIC_DIR_NAME } from '@/constants';
import { rootDirPath } from '@/utils/root-dir-path';

export async function readPublicFile(filePath: string): Promise<Buffer> {
  const fileAbsolutePath = path.join(rootDirPath, PUBLIC_DIR_NAME, filePath);

  return await fs.readFile(fileAbsolutePath);
}
