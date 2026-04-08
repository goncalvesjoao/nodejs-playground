import fs from 'fs/promises';
import path from 'node:path';
import { readPublicFile } from '@app/utils';
import {
  Get,
  BaseController,
  type RequestType,
  type ResponseType,
} from '@app/controllers/base-controller';
import { env } from '@config/env';

export class PublicController extends BaseController {
  static basePath = '';

  @Get('/*path')
  async findOne(req: RequestType): Promise<ResponseType> {
    const filePath = path.join(env.publicDirPath, `.${req.path}`);

    const fileExists = await fs
      .stat(filePath)
      .then((stats) => stats.isFile())
      .catch(() => false);

    if (!fileExists) {
      return {
        status: 404,
        body: await readPublicFile('not_found.html', 'utf-8'),
      };
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
