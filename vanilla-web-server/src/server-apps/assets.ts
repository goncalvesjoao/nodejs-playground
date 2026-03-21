import fs from 'fs/promises';
import path from 'node:path';
import { rootDirPath } from '@/utils';
import type {
  ServerAppRequestType,
  ServerAppInterface,
  ServerAppResponseType,
} from '@/types';
import { RESOURCES_DIR_NAME } from '@/constants';

const BASE_PATH = '/assets';

export class Assets implements ServerAppInterface {
  constructor(protected nextServerApp: ServerAppInterface) {}

  async run(req: ServerAppRequestType): Promise<ServerAppResponseType> {
    if (!req.pathname.startsWith(BASE_PATH) || req.method !== 'GET') {
      return this.nextServerApp.run(req);
    }

    const assetAbsolutePath = path.join(
      rootDirPath,
      RESOURCES_DIR_NAME,
      `.${req.pathname}`,
    );

    const fileExists = await fs
      .stat(assetAbsolutePath)
      .then((stats) => stats.isFile())
      .catch(() => false);

    if (!fileExists) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'text/html' },
        body: await fs.readFile(
          path.join(rootDirPath, RESOURCES_DIR_NAME, 'not_found.html'),
        ),
      };
    }

    const body = await fs.readFile(assetAbsolutePath);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': contentTypeFromFileName(assetAbsolutePath),
      },
      body,
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
