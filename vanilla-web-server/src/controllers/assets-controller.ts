import fs from 'fs/promises';
import path from 'node:path';
import { readPublicFile, rootDirPath } from '@/utils';
import type { ServerModRequestType, ServerModResponseType } from '@/server-mod';
import { PUBLIC_DIR_NAME } from '@/constants';
import { Controller } from '@/controller';

export class AssetsController extends Controller {
  static basePath = '/assets';

  async run(req: ServerModRequestType): Promise<ServerModResponseType> {
    if (!req.path.startsWith(this.basePath) || req.method !== 'GET') {
      return this.next(req);
    }

    const assetAbsolutePath = path.join(
      rootDirPath,
      PUBLIC_DIR_NAME,
      `.${req.path}`,
    );

    const fileExists = await fs
      .stat(assetAbsolutePath)
      .then((stats) => stats.isFile())
      .catch(() => false);

    if (!fileExists) {
      return this.next(req);
    }

    return {
      status: 200,
      headers: { 'Content-Type': contentTypeFromFileName(req.path) },
      body: await readPublicFile(req.path),
    };
  }
}

function contentTypeFromFileName(filePath: string): string {
  const extname = path.extname(filePath);

  // Set default content type
  let contentType = 'text/html';

  // Determine content type based on file extension
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
    case '.svg':
      contentType = 'image/svg+xml';
      break;
    // Default more types as needed
  }
  return contentType;
}
