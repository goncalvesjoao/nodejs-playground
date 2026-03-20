import type { WebAppEnvType, WebAppOutputType } from '@/types';
import { WebApp } from '@/web-app';

export class CorsWebApp extends WebApp {
  constructor(public nextApp: WebApp) {
    super();
  }

  async run(env: WebAppEnvType): Promise<WebAppOutputType> {
    if (env.method !== 'OPTIONS') {
      return await this.nextApp.run(env);
    }

    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, GET, POST, PUT, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      body: null,
    };
  }
}
