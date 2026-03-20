import { resourcesDirPath } from '@/utils';
import type { WebApp, WebAppEnvType, WebAppOutputType } from '@/types';
import fs from 'fs/promises';

export class RootWebApp implements WebApp {
  async run(env: WebAppEnvType): Promise<WebAppOutputType> {
    if (env.method !== 'GET') {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Not Found',
      };
    }

    const body = await fs.readFile(resourcesDirPath('index.html'));

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body,
    };
  }
}
