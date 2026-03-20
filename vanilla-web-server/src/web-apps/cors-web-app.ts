import type { WebApp, WebAppEnvType, WebAppOutputType } from '@/types';

export class CorsWebApp implements WebApp {
  constructor(public nextApp: WebApp) {}

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
