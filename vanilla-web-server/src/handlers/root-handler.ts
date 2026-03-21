import fs from 'fs/promises';
import path from 'path';
import type {
  ServerAppInterface,
  ServerAppRequestType,
  ServerAppResponseType,
} from '@/types';
import { rootDirPath } from '@/utils';
import { PUBLIC_DIR_NAME } from '@/constants';

export class RootHandler implements ServerAppInterface {
  async run(req: ServerAppRequestType): Promise<ServerAppResponseType> {
    if (req.method !== 'GET' || req.pathname !== '/') {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'text/html' },
        body: await fs.readFile(
          path.join(rootDirPath, PUBLIC_DIR_NAME, 'not_found.html'),
        ),
      };
    }

    const body = await fs.readFile(
      path.join(rootDirPath, PUBLIC_DIR_NAME, 'index.html'),
    );

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body,
    };
  }
}
