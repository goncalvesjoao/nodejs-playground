import fs from 'fs/promises';
import path from 'node:path';
import { readPublicFile } from '@/utils';
import {
  BaseController,
  type RequestType,
  type ResponseType,
} from '@/controllers/base-controller';
import { env } from '@/config';

export class PublicController extends BaseController {
  static basePath = '';

  async handle(req: RequestType): Promise<ResponseType> {
    if (req.method !== 'GET') {
      return this.next.handle(req);
    }

    const filePath = path.join(env.publicDirPath, `.${req.path}`);

    const fileExists = await fs
      .stat(filePath)
      .then((stats) => stats.isFile())
      .catch(() => false);

    if (!fileExists) {
      return this.next.handle(req);
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
