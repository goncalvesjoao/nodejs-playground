import fs from 'fs/promises';
import path from 'node:path';
import { rootDirPath } from '@/utils';
import type {
  ServerModInterface,
  ServerModEnvType,
  ServerModOutputType,
} from '@/types';
import { RESOURCES_DIR_NAME } from '@/constants';

const BASE_PATH = '/assets';

export class Assets implements ServerModInterface {
  constructor(private nextMod: ServerModInterface) {}

  async run(env: ServerModEnvType): Promise<ServerModOutputType> {
    if (!env.pathname.startsWith(BASE_PATH) || env.method !== 'GET') {
      return this.nextMod.run(env);
    }

    const assetAbsolutePath = path.join(
      rootDirPath,
      RESOURCES_DIR_NAME,
      `.${env.pathname}`,
    );

    const fileExists = await fs
      .stat(assetAbsolutePath)
      .then((stats) => stats.isFile())
      .catch(() => false);

    if (!fileExists) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Not Found',
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
