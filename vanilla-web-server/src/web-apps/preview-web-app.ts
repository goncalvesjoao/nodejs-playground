import type { WebAppEnvType, WebAppOutputType } from '@/types';
import { WebApp } from '@/web-app';

const BASE_PATH = '/preview';

export class PreviewWebApp extends WebApp {
  constructor(public nextApp: WebApp) {
    super();
  }

  async run(env: WebAppEnvType): Promise<WebAppOutputType> {
    if (!env.pathname.startsWith(BASE_PATH) || env.method !== 'GET') {
      return this.nextApp.run(env);
    }

    return Promise.resolve({
      statusCode: 200,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Hello from the Preview!',
    });
  }
}
