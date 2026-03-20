import path from 'path';
import type {
  ServerModInterface,
  ServerModEnvType,
  ServerModOutputType,
} from '@/types';
import { rootDirPath } from '@/utils';
import fs from 'fs/promises';
import { RESOURCES_DIR_NAME } from '@/constants';

export class Root implements ServerModInterface {
  async run(env: ServerModEnvType): Promise<ServerModOutputType> {
    if (env.method !== 'GET') {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Not Found',
      };
    }

    const body = await fs.readFile(
      path.join(rootDirPath, RESOURCES_DIR_NAME, 'index.html'),
    );

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body,
    };
  }
}
