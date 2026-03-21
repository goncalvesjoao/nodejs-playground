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
    if (req.method === 'GET' && (req.pathname === '/' || req.pathname === '')) {
      return {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
        body: await fs.readFile(
          path.join(rootDirPath, PUBLIC_DIR_NAME, 'index.html'),
        ),
      };
    }

    return {
      status: 404,
      headers: { 'Content-Type': 'text/html' },
      body: await fs.readFile(
        path.join(rootDirPath, PUBLIC_DIR_NAME, 'not_found.html'),
      ),
    };
  }
}
