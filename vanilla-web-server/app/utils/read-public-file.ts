import fs from 'fs/promises';
import path from 'path';
import { env } from '@config/env';

export async function readPublicFile(
  filePath: string,
  encoding?: BufferEncoding,
): Promise<Buffer | string> {
  const fileAbsolutePath = path.join(env.publicDirPath, filePath);

  return await fs.readFile(fileAbsolutePath, encoding);
}
