import fs from 'fs/promises';
import path from 'node:path';
import { readPublicFile, rootDirPath } from '@/utils';
import type {
  ServerModRequestType,
  ServerModInterface,
  ServerModResponseType,
} from '@/types';
import { PUBLIC_DIR_NAME } from '@/constants';

const BASE_PATH = '/assets';

export class AssetsController implements ServerModInterface {
  get basePath() {
    return `${this.basePathPrefix}${BASE_PATH}`;
  }

  constructor(
    protected nextServerMod: ServerModInterface,
    protected basePathPrefix: string = '',
  ) {}

  run = async (req: ServerModRequestType): Promise<ServerModResponseType> => {
    if (!req.pathname.startsWith(this.basePath) || req.method !== 'GET') {
      return this.nextServerMod.run(req);
    }

    const assetAbsolutePath = path.join(
      rootDirPath,
      PUBLIC_DIR_NAME,
      `.${req.pathname}`,
    );

    const fileExists = await fs
      .stat(assetAbsolutePath)
      .then((stats) => stats.isFile())
      .catch(() => false);

    if (!fileExists) {
      return this.nextServerMod.run(req);
    }

    return {
      status: 200,
      headers: { 'Content-Type': contentTypeFromFileName(req.pathname) },
      body: await readPublicFile(req.pathname),
    };
  };
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
